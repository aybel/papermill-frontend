<template>
    <v-container fluid class="py-4">
        <v-row class="mb-4 align-center justify-space-between">
            <v-col cols="12" md="6">
                <div class="d-flex align-center gap-2">
                    <v-icon color="primary">mdi-truck-cargo-container</v-icon>
                    <h2 class="text-h5 mb-0">Proveedor</h2>
                </div>
                <div class="text-medium-emphasis text-caption">Gestión de proveedor</div>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end gap-2">
                <v-btn color="secondary" variant="outlined" prepend-icon="mdi-arrow-left" @click="goBack">Regresar</v-btn>
                <v-btn color="primary" prepend-icon="mdi-pencil" @click="editSupplier">Editar</v-btn>
            </v-col>
        </v-row>

        <v-row>
            <!-- Sidebar -->
            <v-col cols="12" lg="4">
                <v-card elevation="6" class="sticky-card">
                    <v-card-text class="text-center">
                        <div class="d-flex justify-center mb-3">
                            <div class="rounded-circle d-inline-flex align-center justify-center bg-primary-light" style="width:80px;height:80px;">
                                <v-icon color="primary" size="42">mdi-domain</v-icon>
                            </div>
                        </div>
                        <h3 class="text-h6 mb-1">{{ supplier.name }}</h3>
                        <div class="text-medium-emphasis mb-4">#{{ supplier.code }}</div>

                        <div class="d-grid gap-2 mb-4">
                            <v-btn color="primary" block prepend-icon="mdi-phone">Contactar</v-btn>
                            <v-btn color="primary" variant="outlined" block prepend-icon="mdi-file-chart">Generar reporte</v-btn>
                        </div>

                        <v-row class="mb-3" dense>
                            <v-col cols="6">
                                <v-card variant="outlined" class="pa-3 text-center">
                                    <div class="text-success font-weight-bold">{{ supplier.quality_score }}/5</div>
                                    <div class="text-caption text-medium-emphasis">Calidad</div>
                                </v-card>
                            </v-col>
                            <v-col cols="6">
                                <v-card variant="outlined" class="pa-3 text-center">
                                    <div class="text-success font-weight-bold">{{ supplier.delivery_score }}/5</div>
                                    <div class="text-caption text-medium-emphasis">Entrega</div>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-list density="comfortable" class="border rounded">
                            <v-list-item>
                                <v-list-item-title>Estado</v-list-item-title>
                                <template #append>
                                    <v-chip :color="supplier.active ? 'success' : 'error'" size="small" label>
                                        {{ supplier.active ? 'Activo' : 'Inactivo' }}
                                    </v-chip>
                                </template>
                            </v-list-item>
                            <v-divider />
                            <v-list-item>
                                <v-list-item-title>Crédito</v-list-item-title>
                                <template #append>
                                    <strong>{{ formatCurrency(supplier.credit_limit) }}</strong>
                                </template>
                            </v-list-item>
                            <v-divider />
                            <v-list-item>
                                <v-list-item-title>Moneda</v-list-item-title>
                                <template #append>
                                    <span>{{ supplier.currency?.name || 'N/A' }}</span>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Main content -->
            <v-col cols="12" lg="8">
                <div class="d-flex justify-space-between align-center mb-4">
                    <div>
                        <h2 class="text-h5 mb-1">Detalles del proveedor</h2>
                        <div class="text-medium-emphasis">Información completa y actualizada</div>
                    </div>
                </div>

                <v-tabs v-model="tab" bg-color="transparent" class="mb-4" density="comfortable">
                    <v-tab value="info">Información</v-tab>
                    <v-tab value="financial">Financiera</v-tab>
                    <v-tab value="location">Ubicación</v-tab>
                </v-tabs>

                <v-window v-model="tab">
                    <v-window-item value="info">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-card class="mb-4" elevation="4">
                                    <v-card-text>
                                        <div class="text-medium-emphasis text-caption mb-3">Identificación</div>
                                        <v-table density="comfortable" class="text-body-2">
                                            <tbody>
                                                <tr>
                                                    <td class="text-medium-emphasis" width="40%">Código</td>
                                                    <td>{{ supplier.code }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-medium-emphasis">Tipo</td>
                                                    <td>
                                                        <v-chip color="info" size="small" label>{{ supplier.supplier_type?.name || 'N/A' }}</v-chip>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-medium-emphasis">RIF/Cédula</td>
                                                    <td>{{ supplier.tax_id || 'N/A' }}</td>
                                                </tr>
                                            </tbody>
                                        </v-table>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-card class="mb-4" elevation="4">
                                    <v-card-text>
                                        <div class="text-medium-emphasis text-caption mb-3">Estadísticas</div>
                                        <div class="d-flex align-center mb-3">
                                            <v-icon color="info" class="mr-2">mdi-file-document</v-icon>
                                            <strong>Contratos realizados:</strong>
                                            <v-chip color="primary" size="small" class="ml-2">{{ stats.contracts }}</v-chip>
                                        </div>
                                        <v-progress-linear :model-value="stats.progress" height="18" color="success" rounded>
                                            <strong class="text-body-2">{{ stats.progress }}% completados</strong>
                                        </v-progress-linear>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-card class="mb-4" elevation="4">
                            <v-card-text>
                                <div class="text-medium-emphasis text-caption mb-3">Notas</div>
                                <p class="mb-0 text-body-2">{{ supplier.notes || 'Sin notas registradas.' }}</p>
                            </v-card-text>
                        </v-card>

                        <v-card elevation="4">
                            <v-card-text>
                                <div class="d-flex justify-space-between align-center mb-3">
                                    <div class="text-medium-emphasis text-caption">Contactos</div>
                                </div>
                                <div v-if="contacts.length" class="table-responsive">
                                    <v-table density="comfortable" class="text-body-2">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                                <th>Tipo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="contact in contacts" :key="contact.id">
                                                <td>{{ contact.name }}</td>
                                                <td>{{ contact.email || 'N/A' }}</td>
                                                <td>{{ contact.phone || 'N/A' }}</td>
                                                <td>
                                                    <v-chip :color="contact.primary ? 'primary' : 'secondary'" size="small" label>
                                                        {{ contact.primary ? 'Principal' : 'Secundario' }}
                                                    </v-chip>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </div>
                                <div v-else class="text-medium-emphasis">No hay contactos registrados.</div>
                            </v-card-text>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="financial">
                        <v-table density="comfortable" class="text-body-2">
                            <tbody>
                                <tr>
                                    <td width="40%" class="text-medium-emphasis">Término de pago</td>
                                    <td>{{ supplier.payment_term?.name || 'N/A' }}</td>
                                </tr>
                                <tr>
                                    <td class="text-medium-emphasis">Moneda</td>
                                    <td>{{ supplier.currency?.name || 'N/A' }}</td>
                                </tr>
                                <tr>
                                    <td class="text-medium-emphasis">Límite de crédito</td>
                                    <td>{{ formatCurrency(supplier.credit_limit) }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-window-item>

                    <v-window-item value="location">
                        <v-card elevation="4" class="mb-4">
                            <v-card-text>
                                <div class="text-medium-emphasis text-caption mb-3">Ubicación</div>
                                <v-list density="comfortable" class="list-borderless">
                                    <v-list-item>
                                        <template #prepend><v-icon color="primary">mdi-map-marker</v-icon></template>
                                        <v-list-item-title>Ciudad</v-list-item-title>
                                        <template #append>{{ supplier.city?.name || 'N/A' }}</template>
                                    </v-list-item>
                                    <v-list-item>
                                        <template #prepend><v-icon color="success">mdi-flag</v-icon></template>
                                        <v-list-item-title>País</v-list-item-title>
                                        <template #append>{{ supplier.country?.name || 'N/A' }}</template>
                                    </v-list-item>
                                    <v-list-item>
                                        <template #prepend><v-icon color="secondary">mdi-home</v-icon></template>
                                        <v-list-item-title>Dirección</v-list-item-title>
                                        <template #append>{{ supplier.address || 'N/A' }}</template>
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-window-item>
                </v-window>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tab = ref<'info' | 'financial' | 'location'>('info');

// Datos simulados; reemplazar con fetch real
const supplier = ref({
    id: 1,
    name: 'Papermill Supplies',
    code: 'SUP-001',
    tax_id: 'J-12345678-9',
    active: true,
    credit_limit: 15000,
    currency: { name: 'USD' },
    supplier_type: { name: 'Materia prima' },
    payment_term: { name: '30 días' },
    address: 'Av. Principal 123',
    city: { name: 'Caracas' },
    country: { name: 'Venezuela' },
    notes: 'Proveedor confiable con entregas puntuales.',
    quality_score: 4.5,
    delivery_score: 4.8,
});

const contacts = ref([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '555-1234', primary: true },
    { id: 2, name: 'María Gómez', email: 'maria@example.com', phone: '555-5678', primary: false },
]);

const stats = {
    contracts: 8,
    progress: 72,
};

const formatCurrency = (value: number) => {
    if (value == null) return 'N/A';
    return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(value);
};

const goBack = () => router.push('/suppliers');
const editSupplier = () => router.push(`/suppliers/${supplier.value.id}/edit`);
</script>

<style scoped>
.sticky-card {
    position: sticky;
    top: 16px;
}

.bg-primary-light {
    background: rgba(86, 94, 231, 0.08);
}

.list-borderless :deep(.v-list-item) {
    border-bottom: 1px solid #eee;
}
</style>