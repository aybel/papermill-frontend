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
                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Buscar material"
                        variant="outlined" density="compact" hide-details />
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
            <v-data-table :headers="headers" :items="materials" :search="search" :loading="loading" :items-per-page="10"
                class="elevation-1" loading-text="Cargando materiales..."
                no-data-text="No hay materiales registrados">
                <template v-slot:item.actions="{ item }">
                    <v-btn icon size="small" variant="text" color="primary" @click="handleEdit(item)">
                        <PencilIcon />
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="secondary" @click="handleShow(item)">
                        <v-icon>mdi-eye-outline</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<style scoped>
.full-width-card {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { materialService, type Material } from '@/services/materialService';
import { PencilIcon, TrashIcon, PlusIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';


const router = useRouter();

const materials = ref<Material[]>([]);
const loading = ref(false);
const search = ref('');

const headers: { title: string; key: string; align?: 'start' | 'end' | 'center'; sortable?: boolean }[] = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'SKU', key: 'sku', align: 'start' },
    { title: 'Nombre', key: 'name' },
    { title: 'Descripción', key: 'description' },
    { title: 'Categoría', key: 'category.name' },
    { title: 'Tipo de material', key: 'material_type.name' },
    { title: 'Unidad de medida', key: 'unit_of_measure.name' },
    { title: 'Stock actual', key: 'current_stock', align: 'end' },
    { title: 'Stock mínimo', key: 'min_stock', align: 'end' },
    { title: 'Stock máximo', key: 'max_stock', align: 'end' },
    { title: 'Punto de reorden', key: 'reorder_point', align: 'end' },
    { title: 'Costo prom. unitario', key: 'avg_unit_cost', align: 'end' },
    { title: 'Último precio de compra', key: 'last_purchase_price', align: 'end' },
    { title: 'Moneda', key: 'currency.name', align: 'center' },
    { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
];

const loadMaterials = async () => {
    loading.value = true;
    try {
        const response = await materialService.getAll();
        materials.value = response.data || response;
        console.log(materials.value);
    } catch (error: any) {
        let message = 'Error al cargar materiales';
        alert(message);
        console.error(message, error);
    } finally {
        loading.value = false;
    }
};

const handleEdit = (item: Material) => {
    console.log('Editar material:', item);
    // Implementar navegación a edición
    router.push({ name: 'EditMaterial', params: { id: item.id } });
};

const handleCreate = () => {
    // Implementar navegación a creación
    router.push({ name: 'CreateMaterial' });
};

const handleShow = (item: Material) => {
    // Implementar navegación a vista detallada
    router.push({ name: 'ShowMaterial', params: { id: item.id } });
}

async function exportToPDF() {
    try {
        const response = await materialService.exportAs('pdf', { active: 1 });
        downloadFile(response, 'materiales.pdf', 'application/pdf');
    } catch (error: any) {
        const message = error?.response?.data?.message || 'Error al exportar a PDF';
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
        });
    }
}

async function exportToExcel() {
    try {
        const response = await materialService.exportAs('excel', { active: 1 });
        downloadFile(response, 'materiales.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    } catch (error: any) {
        const message = error?.response?.data?.message || 'Error al exportar a Excel';
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
        });
    }
}

function exportAs(type: string) {
    if (type === 'pdf') {
        exportToPDF();
    } else if (type === 'excel') {
        exportToExcel();
    }
}

function downloadFile(data: any, filename: string, mimeType: string) {
    // Si el backend responde con un blob, usar esto:
    const blob = (data instanceof Blob) ? data : new Blob([data], { type: mimeType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
}

onMounted(() => {
    loadMaterials();
});
</script>