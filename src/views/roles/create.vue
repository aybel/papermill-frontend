<template>
    <DetailPage title="Roles" subtitle="Gestiona los roles de la aplicación"></DetailPage>
    <BaseBreadcrumbs :items="breadcrumbItems"></BaseBreadcrumbs>
    <FormPageActions :loading="saving" :back-to="{ name: 'Roles' }" @save="handleSave" />
    <UiParentCard class="mb-6">
        <v-form>
            <v-row>
                <v-col cols="12">
                    <h3 class="text-h6 mb-2">Rol</h3>
                    <v-divider class="mb-4" />
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="headerForm.name" label="Nombre" variant="outlined" density="comfortable" />
                </v-col>
            </v-row>
        </v-form>
    </UiParentCard>
    <UiParentCard>
        <h3 class="text-h6 mb-2">Permisos</h3>
        <div class="text-body-2 text-medium-emphasis mt-1">
            Selecciona los permisos que tendrá este rol
        </div>
        <v-divider class="mb-4" />
        <div v-for="group in groupedPermissions" :key="group.category" class="mb-6">
            <div class="d-flex align-center justify-space-between mb-3">
                <h4 class="text-subtitle-1 font-weight-bold">{{ group.category }}</h4>
                <v-chip size="small" variant="outlined" color="primary">
                    {{ group.totalPermissions }} permiso(s)
                </v-chip>
            </div>

            <!-- Sub-agrupado por resource (solo Configuraciones) -->
            <template v-if="group.resourceGroups">
                <div v-for="rg in group.resourceGroups" :key="rg.resource" class="mb-4 pl-2">
                    <div class="d-flex align-center ga-2 mb-2">
                        <v-icon size="small" color="secondary">mdi-folder-outline</v-icon>
                        <span class="text-body-1 font-weight-medium">{{ rg.resource }}</span>
                        <v-chip size="x-small" variant="tonal" color="secondary">{{ rg.permissions.length }}</v-chip>
                    </div>
                    <v-row>
                        <v-col cols="12" md="6" lg="4" v-for="permission in rg.permissions" :key="permission.id">
                            <v-checkbox v-model="headerForm.permissionIds" :value="permission.id" color="primary" hide-details>
                                <template #label>
                                    <div class="py-1">
                                        <div class="text-subtitle-2 font-weight-bold">{{ permission.full_name }}</div>
                                        <div class="text-body-2 text-medium-emphasis">{{ permission.description }}</div>
                                        <div class="d-flex flex-wrap ga-2 mt-2">
                                            <v-chip size="small" label>ID: {{ permission.id }}</v-chip>
                                            <v-chip size="small" label>Nombre: {{ permission.name }}</v-chip>
                                            <v-chip size="small" label>Acción: {{ permission.action }}</v-chip>
                                            <v-chip size="small" label>Categoría: {{ permission.category }}</v-chip>
                                            <v-chip size="small" label>Icono: {{ permission.icon }}</v-chip>
                                        </div>
                                    </div>
                                </template>
                            </v-checkbox>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-3" />
                </div>
            </template>

            <!-- Listado plano para el resto de categorías -->
            <v-row v-else>
                <v-col cols="12" md="6" lg="4" v-for="permission in group.permissions" :key="permission.id">
                    <v-checkbox v-model="headerForm.permissionIds" :value="permission.id" color="primary" hide-details>
                        <template #label>
                            <div class="py-1">
                                <div class="text-subtitle-2 font-weight-bold">{{ permission.full_name }}</div>
                                <div class="text-body-2 text-medium-emphasis">{{ permission.description }}</div>
                                <div class="d-flex flex-wrap ga-2 mt-2">
                                    <v-chip size="small" label>ID: {{ permission.id }}</v-chip>
                                    <v-chip size="small" label>Nombre: {{ permission.name }}</v-chip>
                                    <v-chip size="small" label>Acción: {{ permission.action }}</v-chip>
                                    <v-chip size="small" label>Categoría: {{ permission.category }}</v-chip>
                                    <v-chip size="small" label>Icono: {{ permission.icon }}</v-chip>
                                </div>
                            </div>
                        </template>
                    </v-checkbox>
                </v-col>
            </v-row>
        </div>
    </UiParentCard>
</template>
<script setup lang="ts">

import { useRouter } from 'vue-router';
import { computed, onMounted, reactive, ref } from "vue";
import BaseBreadcrumbs, { type BreadcrumbItem } from '@/components/base/BaseBreadcrumbs.vue';
import DetailPage from "@/components/base/DetailPage.vue";
import FormPageActions from "@/components/base/FormPageActions.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { permissionService, type Permission } from "@/services/permissionService";

type HeaderForm = {
    name: string;
    permissionIds: number[];
};

const headerForm = reactive<HeaderForm>({
    name: "",
    permissionIds: [],
});
const saving = ref(false);
const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Inicio", to: { name: "Home" } },
    { title: "Roles", to: { name: "Roles" } },
    { title: "Nuevo rol", disabled: true },
];
const permissions = ref<Permission[]>([]);
type ResourceGroup = { resource: string; permissions: Permission[] };
type PermissionGroup =
    | { category: string; totalPermissions: number; permissions: Permission[]; resourceGroups: undefined }
    | { category: string; totalPermissions: number; permissions: undefined; resourceGroups: ResourceGroup[] };

const CATEGORY_BY_RESOURCE = "Configuraciones";

const groupedPermissions = computed((): PermissionGroup[] => {
    const groups = new Map<string, Permission[]>();

    for (const permission of permissions.value) {
        const category = permission.category || "Sin categoría";
        const list = groups.get(category) ?? [];
        list.push(permission);
        groups.set(category, list);
    }

    return Array.from(groups.entries()).map(([category, list]) => {
        if (category === CATEGORY_BY_RESOURCE) {
            const resourceMap = new Map<string, Permission[]>();
            for (const p of list) {
                const resource = p.resource || "Sin recurso";
                const rList = resourceMap.get(resource) ?? [];
                rList.push(p);
                resourceMap.set(resource, rList);
            }
            const resourceGroups = Array.from(resourceMap.entries()).map(
                ([resource, perms]) => ({ resource, permissions: perms })
            );
            return { category, totalPermissions: list.length, permissions: undefined, resourceGroups };
        }
        return { category, totalPermissions: list.length, permissions: list, resourceGroups: undefined };
    });
});
const router = useRouter();

const handleSave = async () => {
    saving.value = true;
    // Simula una operación de guardado
    setTimeout(() => {
        saving.value = false;
        router.push({ name: "Roles" });
    }, 2000);
};
function loadPermissions() {
    permissionService.getAll().then((response) => {
        permissions.value = response;
    });
}
onMounted(() => {
    loadPermissions();
});
</script>