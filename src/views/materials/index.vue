<template>
    <v-card elevation="10" class="withbg full-width-card">
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5">Gestión de Materiales</v-card-title>
                <div class="my-sm-0 my-2">
                    <v-btn color="primary" @click="handleCreate">
                        <PlusIcon class="mr-2" size="20" />
                        Nuevo Material
                    </v-btn>
                </div>
            </div>
        </v-card-item>

        <v-card-text>
            <v-row class="mb-4 align-center">
                <v-col cols="12" md="8">
                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify"
                        label="Buscar material (SKU, nombre...)" variant="outlined" density="compact" hide-details
                        clearable @update:model-value="onSearchChange" />
                </v-col>
                <v-col cols="12" md="4" class="d-flex justify-end">
                    <v-menu offset-y>
                        <template #activator="{ props }">
                            <v-btn color="secondary" v-bind="props">
                                Exportar
                                <v-icon right>mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="exportAs('pdf')">
                                <v-list-item-title>PDF</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="exportAs('excel')">
                                <v-list-item-title>Excel</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>

            <v-data-table-server v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers"
                :items="materials" :items-length="totalItems" :loading="loading" class="elevation-1"
                loading-text="Cargando materiales..." no-data-text="No hay materiales registrados"
                @update:options="loadMaterials">
                <!-- Nombre con descripción truncada debajo -->
                <template #item.name="{ item }">
                    <div class="d-flex flex-column">
                        <span class="font-weight-medium">{{ item.name }}</span>
                        <span v-if="item.description" class="text-caption text-medium-emphasis text-truncate"
                            style="max-width: 250px;" :title="item.description">
                            {{ item.description }}
                        </span>
                    </div>
                </template>

                <!-- Categoría como chip -->
                <template #item.category.name="{ item }">
                    <v-chip size="small" color="primary" variant="tonal">
                        {{ item.category?.name || '—' }}
                    </v-chip>
                </template>

                <!-- Stock con color según nivel -->
                <template #item.current_stock="{ item }">
                    <span :class="getStockClass(item)">
                        {{ Math.round(item.current_stock) }}
                    </span>
                </template>

                <template #item.last_purchase_price="{ item }">
                    {{ item.currency?.symbol }} {{ Number(item.last_purchase_price).toFixed(2) }}
                </template>

                <template #item.actions="{ item }">
                    <v-btn icon size="small" variant="text" color="primary" @click="handleEdit(item)">
                        <PencilIcon />
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="secondary" @click="handleShow(item)">
                        <v-icon>mdi-eye-outline</v-icon>
                    </v-btn>
                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Swal from 'sweetalert2';
import { materialService, type Material } from '@/services/materialService';
import { useRouter } from 'vue-router';

const router = useRouter();

const materials = ref<Material[]>([]);
const loading = ref(false);
const search = ref('');
const page = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

const headers = [
    { title: 'ID', key: 'id', align: 'start' as const },
    { title: 'SKU', key: 'sku', align: 'start' as const },
    { title: 'Nombre', key: 'name', sortable: true },
    { title: 'Categoría', key: 'category.name', sortable: false },
    { title: 'Stock actual', key: 'current_stock', align: 'end' as const },
    { title: 'Último precio', key: 'last_purchase_price', align: 'end' as const },
    { title: 'Acciones', key: 'actions', sortable: false, align: 'center' as const }
];

let currentSortBy: { key: string; order: 'asc' | 'desc' }[] = [];

// Carga desde el servidor con parámetros reales
const loadMaterials = async (options: {
    page: number;
    itemsPerPage: number;
    sortBy: { key: string; order: 'asc' | 'desc' }[];
}) => {
    page.value = options.page;
    itemsPerPage.value = options.itemsPerPage;
    currentSortBy = options.sortBy ?? [];

    loading.value = true;
    try {
        const orderBy = options.sortBy?.[0]
            ? { column: options.sortBy[0].key, direction: options.sortBy[0].order }
            : { column: 'id', direction: 'desc' as const };

        const term = search.value?.trim();
        if (term) {
            const res = await materialService.search(term, options.itemsPerPage, options.page);
            materials.value = res.data?.data ?? [];
            totalItems.value = res.data?.total ?? materials.value.length;
        } else {
            const res = await materialService.filter({
                pagination: { page: options.page, limit: options.itemsPerPage },
                order_by: orderBy as any
            });
            materials.value = res.data ?? [];
            totalItems.value = res.meta?.total ?? materials.value.length;
        }
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.response?.data?.message || 'Error al cargar materiales'
        });
        console.error(error);
    } finally {
        loading.value = false;
    }
};

// Debounce para no saturar el backend
let searchTimer: ReturnType<typeof setTimeout> | undefined;
const onSearchChange = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        // Si la página cambia, la tabla emite update:options y recarga sola
        if (page.value !== 1) {
            page.value = 1;
            return;
        }
        loadMaterials({
            page: 1,
            itemsPerPage: itemsPerPage.value,
            sortBy: currentSortBy
        });
    }, 400);
};

onBeforeUnmount(() => {
    if (searchTimer) clearTimeout(searchTimer);
});

const getStockClass = (item: Material) => {
    const stock = Number(item.current_stock);
    const min = Number(item.min_stock);
    if (stock <= min) return 'text-error font-weight-bold'; // rojo
    if (stock <= min * 1.5) return 'text-warning font-weight-bold'; // amarillo
    return 'text-success'; // verde
};

const handleEdit = (item: Material) => {
    router.push({ name: 'EditMaterial', params: { id: item.id } });
};

const handleCreate = () => {
    router.push({ name: 'CreateMaterial' });
};

const handleShow = (item: Material) => {
    router.push({ name: 'ShowMaterial', params: { id: item.id } });
};

async function exportToPDF() {
    try {
        const response = await materialService.exportAs('pdf', { active: 1 });
        downloadFile(response, 'materiales.pdf', 'application/pdf');
    } catch (error: any) {
        Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || 'Error al exportar a PDF' });
    }
}

async function exportToExcel() {
    try {
        const response = await materialService.exportAs('excel', { active: 1 });
        downloadFile(response, 'materiales.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    } catch (error: any) {
        Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || 'Error al exportar a Excel' });
    }
}

function exportAs(type: string) {
    if (type === 'pdf') exportToPDF();
    else if (type === 'excel') exportToExcel();
}

function downloadFile(data: any, filename: string, mimeType: string) {
    const blob = (data instanceof Blob) ? data : new Blob([data], { type: mimeType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
}

</script>

<style scoped>
.full-width-card {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
}
</style>