<template>
    <DetailPage title="Usuarios" subtitle="Gestiona los usuarios de la aplicación">
    </DetailPage>

    <UiParentCard>
        <DataTable :headers="headers" :items="users" :loading="loading" v-model:search="search" :page="pagination.page"
            :items-per-page="pagination.itemsPerPage" :total-items="users.length"
            @update:page="pagination.page = $event" @update:itemsPerPage="pagination.itemsPerPage = $event">
            <template #top>
                <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3 ga-3">
                    <v-text-field v-model="search" density="comfortable" variant="outlined" clearable hide-details
                        label="Buscar usuario" class="flex-grow-1" />
                    <div class="d-flex ga-2">
                        <v-btn variant="text" color="secondary" prepend-icon="mdi-download" @click="exportCsv">
                            Exportar
                        </v-btn>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
                            Nuevo Usuario
                        </v-btn>
                    </div>
                </div>
            </template>
            <template #item.department_id="{ item }">
                {{ item.department?.name || 'N/A' }}
            </template>
            <template #item.roles="{ item }">
                <div class="d-flex flex-wrap ga-1">
                    <v-chip v-for="role in item.roles" :key="typeof role === 'string' ? role : role.id" class="ma-1"
                        color="primary" text-color="white" size="small" @click="viewRolePermissions(role)">
                        {{ typeof role === 'string' ? role : role.name }}
                    </v-chip>
                </div>
            </template>
            <template #item.actions="{ item }">
                <v-btn icon variant="text" color="primary" @click.stop="item && startEdit(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="error" :loading="deletingId === item?.id"
                    @click.stop="item && remove(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </DataTable>
    </UiParentCard>

    <CreateModal v-model="dialog" :title="dialogMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'"
        :subtitle="dialogMode === 'create' ? 'Crea un usuario para tu aplicación' : 'Actualiza la información del usuario'"
        :loading="saving" submit-label="Guardar" @submit="submitForm" @cancel="closeDialog">
        <v-form ref="formRef" @submit.prevent="submitForm">
            <v-row class="ga-2">
                <v-col cols="12" md="12">
                    <v-text-field v-model="form.name" label="Nombre" required />
                </v-col>
                <v-col cols="12" md="12">
                    <v-text-field v-model="form.email" label="Correo electrónico" required />
                </v-col>
                <v-col cols="12" md="12">
                    <v-select v-if="Array.isArray(departmentOptions)" v-model="form.department_id" :items="departmentOptions" item-title="name" item-value="id"
                        label="Departamento al que pertenece" required :loading="lookupsLoading" />
                </v-col>
                <v-col cols="12" md="12">
                    <v-select v-if="Array.isArray(roleOptions)" v-model="form.roles" :items="roleOptions" item-title="name" item-value="name"
                        label="Roles" multiple required :loading="lookupsLoading" />
                </v-col>
                <v-col cols="12" md="12">
                    <v-select v-if="Array.isArray(departmentOptions)" v-model="form.accessible_departments" :items="departmentOptions" item-title="name"
                        item-value="id" label="Departamentos asignados" multiple required :loading="lookupsLoading" />
                </v-col>
            </v-row>
        </v-form>
    </CreateModal>

    <!-- Modal de Permisos -->
    <v-dialog v-model="permissionsDialog" max-width="600px" scrollable>
        <v-card>
            <v-card-title class="px-4 pt-4 pb-2">
                <div class="d-flex align-center justify-space-between">
                    <span class="text-h6">Permisos de: {{ selectedRoleName }}</span>
                    <v-btn icon size="small" variant="text" @click="permissionsDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
            </v-card-title>
            <v-card-text class="pt-2">
                <div v-if="selectedRolePermissions.length">
                    <div v-for="(permissions, category) in groupedPermissions" :key="category" class="mb-4">
                        <div class="text-overline text-medium-emphasis">{{ category }}</div>
                        <v-divider class="mb-2" />
                        <v-list density="compact" class="py-0">
                            <v-list-item v-for="permission in permissions" :key="permission.id" class="px-1">
                                <template #prepend>
                                    <v-icon size="small" class="mr-3" color="primary">
                                        {{ permission.icon ? `mdi-${permission.icon}` : 'mdi-shield-check-outline' }}
                                    </v-icon>
                                </template>
                                <v-list-item-title class="font-weight-medium">{{ permission.description
                                    }}</v-list-item-title>
                                <v-list-item-subtitle>{{ permission.name }}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </div>
                </div>
                <div v-else class="text-center py-10">
                    <p class="text-disabled">No hay permisos asignados para este rol.</p>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, reactive, ref, computed } from "vue";
import DataTable, { BaseTableHeader } from "@/components/base/DataTable.vue";
import CreateModal from "@/components/base/CreateModal.vue";
import DetailPage from "@/components/base/DetailPage.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { showSwal, confirmSwal } from "@/utils/alerts";
import type { VForm } from "vuetify/components";

import { DepartmentService, type Department } from "@/services/departmentsService";
import { userService, type User } from "@/services/usersService";
import { RoleService, type Role } from "@/services/rolesService";

interface Permission {
    id: number;
    name: string;
    full_name: string;
    resource: string;
    action: string;
    category: string;
    description: string;
    icon?: string;
}

const headers: BaseTableHeader[] = [
    { title: "ID", key: "id", sortable: true, align: "center", width: 80 },
    {
        title: "Nombre",
        key: "name",
        sortable: true,
        align: "center",
    },
    { title: "Correo", key: "email" },
    { title: "Departamento", key: "department_id", sortable: false },
    {
        title: "Roles",
        key: "roles",
        sortable: false,
    },
    { title: "Acciones", key: "actions", sortable: false, align: "end" },
];

interface EditableUser {
    id: number | null;
    name: string | null;
    email: string | null;
    password: string | null;
    department_id: number | null;
    roles: string[];
    accessible_departments: number[];
    created_at: string | null;
    updated_at: string | null;
}

const router = useRouter();
const users = ref<User[]>([]);
const loading = ref(false);
const saving = ref(false);
const deletingId = ref<number | null>(null);
const lookupsLoading = ref(false);
const dialog = ref(false);
const dialogMode = ref<"create" | "edit">("create");
const search = ref("");
const pagination = reactive({
    page: 1,
    itemsPerPage: 50,
});

const departmentOptions = ref<Department[]>([]);
const roleOptions = ref<Role[]>([]);
const formRef = ref<VForm | null>(null);

// Estados para modal de permisos
const permissionsDialog = ref(false);
const selectedRoleName = ref("");
const selectedRolePermissions = ref<Permission[]>([]);

const groupedPermissions = computed(() => {
    return selectedRolePermissions.value.reduce((acc, permission) => {
        const category = permission.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);
});

function generateRandomPassword(length = 12): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (x) => chars[x % chars.length]).join("");
}

function emptyForm(): EditableUser {
    return {
        id: null,
        name: null,
        email: null,
        password: null,
        department_id: null,
        roles: [],
        accessible_departments: [],
        created_at: null,
        updated_at: null,
    };
}

const form = reactive<EditableUser>(emptyForm());

async function fetchUsers() {
    loading.value = true;
    try {
        const data = await userService.getAll();
        users.value = data;
    } catch (error) {
        console.error("Error al cargar usuarios", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los usuarios.',
            confirmButtonText: 'Aceptar',
        });
    } finally {
        loading.value = false;
    }
}

async function fetchLookups() {
    lookupsLoading.value = true;
    try {
        const [departments, roles] = await Promise.all([
            DepartmentService.getAll(),
            RoleService.getAll(),
        ]);
        departmentOptions.value = departments;
        roleOptions.value = roles;
    } catch (error) {
        console.error("Error al cargar catálogos", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los catálogos.',
            confirmButtonText: 'Aceptar',
        });
    } finally {
        lookupsLoading.value = false;
    }
}

async function viewRolePermissions(role: any) {
    const roleName = typeof role === 'string' ? role : role.name;
    const roleId = typeof role === 'string' ? roleOptions.value.find(r => r.name === role)?.id : role.id;

    if (!roleId) return;

    try {
        selectedRoleName.value = roleName;
        const permissions = await RoleService.getPermissions(roleId);
        selectedRolePermissions.value = permissions || []; // Asegura que siempre sea un array
        permissionsDialog.value = true;
    } catch (error) {
        console.error("Error al cargar permisos", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los permisos del rol.',
            confirmButtonText: 'Aceptar',
        });
    }
}

function closeDialog() {
    dialog.value = false;
    Object.assign(form, emptyForm());
}

function openCreate() {
    dialogMode.value = "create";
    Object.assign(form, emptyForm());
    dialog.value = true;
}

function startEdit(item: User) {
    dialogMode.value = "edit";
    Object.assign(form, {
        id: item.id,
        name: item.name,
        email: item.email,
        password: null,
        department_id: item.department_id,
        roles: Array.isArray(item.roles)
            ? item.roles.map((r: any) => typeof r === 'string' ? r : r.name)
            : [],
        accessible_departments: (item.accessible_departments || []).map((d: Department) => d.id),
        created_at: item.created_at,
        updated_at: item.updated_at,
    });
    dialog.value = true;
}

async function submitForm() {
    const isValid = await formRef.value?.validate();
    if (isValid?.valid === false) return;

    saving.value = true;
    try {
        const isCreate = dialogMode.value === "create";
        const generatedPassword = isCreate ? generateRandomPassword() : undefined;

        const payload = {
            name: form.name,
            email: form.email,
            ...(isCreate && { password: generatedPassword, password_confirmation: generatedPassword }),
            department_id: form.department_id,
            roles: form.roles,
            accessible_departments: form.accessible_departments,
        };

        const result = isCreate
            ? await userService.create(payload)
            : await userService.update(form.id!, payload);
        console.log(result);
        if (result.success) {
            showSwal({
                icon: 'success',
                title: isCreate ? 'Usuario creado' : 'Usuario actualizado',
                text: isCreate
                    ? `Usuario creado correctamente. Contraseña temporal: ${generatedPassword}`
                    : result.message || 'El registro se actualizó correctamente',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                router.push({ name: 'Users' });
            });
        }

        if (isCreate) {
            users.value = [result.data, ...users.value];
        } else {
            const index = users.value.findIndex((c) => c.id === form.id);
            if (index !== -1) {
                users.value[index] = { ...users.value[index], ...result.data };
            }
        }

        closeDialog();
    } catch (error) {
        console.error("Error al guardar usuario", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'No se pudo guardar el usuario.',
            confirmButtonText: 'Aceptar',
        });
    } finally {
        saving.value = false;
    }
}

async function remove(item: User) {
    if (!item.id) return;

    const result = await confirmSwal({
        title: '¿Eliminar usuario?',
        text: 'Esta acción no se puede deshacer.',
        confirmButtonText: 'Sí, eliminar',
    });

    if (!result.isConfirmed) return;

    deletingId.value = item.id;
    try {
        await userService.delete(item.id);
        users.value = users.value.filter((c) => c.id !== item.id);
        showSwal({ icon: 'success', title: 'Eliminado', text: 'El usuario ha sido eliminado.' });
    } catch (error) {
        console.error("Error al eliminar usuario", error);
        showSwal({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo eliminar el usuario.' });
    } finally {
        deletingId.value = null;
    }
}

onMounted(() => {
    fetchUsers();
    fetchLookups();
});
</script>