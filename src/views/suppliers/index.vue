<template>
    <v-card elevation="10" class="withbg full-width-card">
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5">Gestión de Proveedores</v-card-title>
                <div class="my-sm-0 my-2">
                    <v-btn color="primary" @click="handleCreate">
                        <PlusIcon class="mr-2" size="20" />
                        Nuevo Proveedor
                    </v-btn>
                </div>
            </div>
        </v-card-item>

        <v-card-text>

            <v-row class="mb-4 align-center">
                <v-col cols="12" md="8">
                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Buscar proveedor"
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
            <v-data-table :headers="headers" :items="suppliers" :search="search" :loading="loading" :items-per-page="10"
                class="elevation-1" loading-text="Cargando proveedores..."
                no-data-text="No hay proveedores registrados">
                <template v-slot:item.active="{ item }">
                    <span :style="{ color: item.active === 1 ? 'green' : 'red', 'font-weight': 'bold' }">
                        {{ item.active === 1 ? 'Sí' : 'No' }}
                    </span>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn icon size="small" variant="text" color="primary" @click="handleEdit(item)">
                        <PencilIcon />
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="error" @click="handleDelete(item)">
                        <TrashIcon />
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="info" @click="handleContacts(item)">
                        <v-icon>mdi-account-multiple-outline</v-icon>
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="secondary" @click="handleShow(item)">
                        <v-icon>mdi-eye-outline</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>

    <!-- Diálogo para contactos -->
    <v-dialog v-model="showContactDialog" max-width="1200px">
        <template v-slot:default>
            <SupplierContactForm v-if="selectedSupplier" :supplier-id="selectedSupplier?.id"
                :contactData="selectedContact" :contacts="supplierContacts" @save="syncContacts"
                @cancel="closeContactDialog" />
        </template>
    </v-dialog>
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
import { supplierService, type Supplier } from '@/services/supplierService';
import { supplierContactsService, type SupplierContacts } from '@/services/supplierContactsService';
import { PencilIcon, TrashIcon, PlusIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';
import SupplierContactForm from './components/SupplierContactForm.vue';

const router = useRouter();

const suppliers = ref<Supplier[]>([]);
const loading = ref(false);
const search = ref('');

const headers = [
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'Código', key: 'code', align: 'start' },
    { title: 'Nombre', key: 'name' },
    { title: 'RFC', key: 'tax_id' },
    { title: 'Limite de crédito', key: 'credit_limit' },
    { title: 'Activo', key: 'active', sortable: false, align: 'center' },
    { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
];

const loadSuppliers = async () => {
    loading.value = true;
    try {
        const response = await supplierService.getAll();
        suppliers.value = response.data || response;
    } catch (error: any) {
        let message = 'Error al cargar proveedores';
        alert(message);
        console.error(message, error);
    } finally {
        loading.value = false;
    }
};

const handleEdit = (item: Supplier) => {
    console.log('Editar proveedor:', item);
    // Implementar navegación a edición
    router.push({ name: 'EditSupplier', params: { id: item.id } });
};

const handleDelete = async (item: Supplier) => {
    const result = await Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro de eliminar al proveedor ${item.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
        try {
            await supplierService.delete(item.id);
            await loadSuppliers();
            Swal.fire('Eliminado', 'El proveedor ha sido eliminado.', 'success');
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
            Swal.fire('Error', 'No se pudo eliminar el proveedor.', 'error');
        }
    }
};

const handleCreate = () => {
    // Implementar navegación a creación
    router.push({ name: 'CreateSupplier' });
};

const handleShow = (item: Supplier) => {
    // Implementar navegación a vista detallada
    router.push({ name: 'ShowSupplier', params: { id: item.id } });
}



const showContactDialog = ref(false);
const selectedSupplier = ref<Supplier | null>(null);
const selectedContact = ref<any>(null);
const supplierContacts = ref<SupplierContacts[]>([]);

async function handleContacts(supplier: Supplier) {
    selectedSupplier.value = supplier;
    selectedContact.value = null;
    supplierContacts.value = [];
    showContactDialog.value = true;
    try {
        const response = await supplierContactsService.search({ supplier_id: supplier.id, is_active: 1, order_by_: "is_primary desc" });
        supplierContacts.value = response || [];
    } catch (error) {
        console.error('Error al cargar contactos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los contactos del proveedor.'
        });
    }
}

function closeContactDialog() {
    showContactDialog.value = false;
    selectedSupplier.value = null;
    selectedContact.value = null;
}

function syncContacts(updated: SupplierContacts[]) {
    supplierContacts.value = updated;
    // Se mantiene el diálogo abierto para seguir viendo/gestionando la tabla
}

async function exportToPDF() {
    try {
        const response = await supplierService.exportAs('pdf', { active: 1 });
        downloadFile(response, 'proveedores.pdf', 'application/pdf');
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
        const response = await supplierService.exportAs('excel', { active: 1 });
        downloadFile(response, 'proveedores.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
    loadSuppliers();
});
</script>