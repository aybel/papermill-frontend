<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supplierService, type Supplier } from '@/services/supplierService';
import { PencilIcon, TrashIcon, PlusIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';
import SupplierContactForm from '@/components/suppliers/SupplierContactForm.vue';

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
    router.push({ name: 'SupplierEdit', params: { id: item.id } });
};

const handleDelete = async (item: Supplier) => {
    if (confirm(`¿Está seguro de eliminar al proveedor ${item.name}?`)) {
        try {
            await supplierService.delete(item.id);
            await loadSuppliers();
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
        }
    }
};

const handleCreate = () => {
    console.log('Crear nuevo proveedor');
    // Implementar navegación a creación
    router.push({ name: 'CreateSupplier' });
};

const showContactDialog = ref(false);
const selectedSupplier = ref<Supplier | null>(null);
const selectedContact = ref<any>(null);

function handleContacts(supplier: Supplier) {
    selectedSupplier.value = supplier;
    selectedContact.value = null;
    showContactDialog.value = true;
}

function closeContactDialog() {
    showContactDialog.value = false;
    selectedSupplier.value = null;
    selectedContact.value = null;
}

onMounted(() => {
    loadSuppliers();
});
</script>

<template>
    <v-card elevation="10" class="withbg">
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
            <v-row class="mb-4">
                <v-col cols="12" md="4">
                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Buscar proveedor"
                        variant="outlined" density="compact" hide-details />
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
                        <PencilIcon size="20" />
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="error" @click="handleDelete(item)">
                        <TrashIcon size="20" />
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="info" @click="handleContacts(item)">
                        <v-icon>mdi-account-multiple-outline</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>

    <!-- Diálogo para contactos -->
    <v-dialog v-model="showContactDialog" max-width="600">
        <template v-slot:default>
            <SupplierContactForm v-if="selectedSupplier" :contactData="selectedContact" @save="closeContactDialog"
                @cancel="closeContactDialog" />
        </template>
    </v-dialog>
</template>