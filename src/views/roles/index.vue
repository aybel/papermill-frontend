<template>
    <DetailPage title="Roles" subtitle="Gestiona los roles de la aplicación">
    </DetailPage>
    <BaseBreadcrumbs :items="breadcrumbItems"></BaseBreadcrumbs>
    <UiParentCard>
        <DataTable :headers="headers" :items="roles" :loading="loading" v-model:search="search" :page="pagination.page"
            :items-per-page="pagination.itemsPerPage" :total-items="roles.length"
            @update:page="pagination.page = $event" @update:itemsPerPage="pagination.itemsPerPage = $event">
            <template #top>
                <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3 ga-3">
                    <v-text-field v-model="search" density="comfortable" variant="outlined" clearable hide-details
                        label="Buscar rol" class="flex-grow-1" />
                    <div class="d-flex ga-2">
                        <v-btn variant="text" color="secondary" prepend-icon="mdi-download" @click="exportCsv">
                            Exportar
                        </v-btn>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'RolesCreate' });">
                            Nuevo Rol
                        </v-btn>
                    </div>
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
import { roleService, type Role } from "@/services/rolesService";
import BaseBreadcrumbs from '@/components/base/BaseBreadcrumbs.vue';


const router = useRouter();
const roles = ref<Role[]>([]);
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

const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Inicio", to: { name: "Home" } },
    { title: "Roles", to: { name: "Roles" } },
];

function emptyForm(): EditableRole {
    return {
        id: null,
        name: null,
        created_at: null,
        updated_at: null,
    };
}

interface RolesTableItem {
    id: number;
    name: string;
}

const headers: BaseTableHeader[] = [
    { title: "ID", key: "id", sortable: true, align: "center", width: 80 },
    {
        title: "Nombre",
        key: "name",
        sortable: true,
        align: "center",
    },
    { title: "Acciones", key: "actions", sortable: false, align: "end" },
];

function closeDialog() {
    dialog.value = false;
    Object.assign(form, emptyForm());
}

function openCreate() {
    dialogMode.value = "create";
    Object.assign(form, emptyForm());
    dialog.value = true;
}

async function remove(item: Role) {
    if (!item.id) return;

    const result = await confirmSwal({
        title: '¿Eliminar rol?',
        text: 'Esta acción no se puede deshacer.',
        confirmButtonText: 'Sí, eliminar',
    });

    if (!result.isConfirmed) return;

    deletingId.value = item.id;
    try {
        await roleService.delete(item.id);
        roles.value = roles.value.filter((c) => c.id !== item.id);
        showSwal({ icon: 'success', title: 'Eliminado', text: 'El rol ha sido eliminado.' });
    } catch (error) {
        console.error("Error al eliminar rol", error);
        showSwal({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo eliminar el rol.' });
    } finally {
        deletingId.value = null;
    }
}
async function loadRoles() {
    loading.value = true;
    try {
        const data = await roleService.getAll();
        roles.value = data;
    } catch (error) {
        console.error("Error al cargar roles", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los roles.',
            confirmButtonText: 'Aceptar',
        });
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadRoles();
});
</script>