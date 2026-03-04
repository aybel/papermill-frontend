<template>
    <div class="material-detail-container">
        <!-- Header con navegación y acciones -->
        <v-card v-if="material" elevation="10" class="detail-card withbg">
            <v-card-item>
                <div class="d-sm-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <v-btn icon variant="text" @click="goBack" class="mr-3">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <div>
                            <div class="text-subtitle-2 text-grey">Material #{{ material.sku }}</div>
                            <v-card-title class="text-h4 pa-0">{{ material.name }}</v-card-title>
                        </div>
                    </div>
                    <div class="my-sm-0 my-2">
                        <v-btn color="primary" @click="goToEdit" prepend-icon="mdi-pencil">
                            Editar Material
                        </v-btn>
                    </div>
                </div>
            </v-card-item>

            <!-- Badges de estado rápido -->
            <v-card-text class="pt-0">
                <v-chip
                    :color="stockStatus.color"
                    class="mr-2"
                    size="small"
                >
                    <v-icon start>{{ stockStatus.icon }}</v-icon>
                    {{ stockStatus.text }}
                </v-chip>
                <v-chip
                    color="info"
                    variant="outlined"
                    size="small"
                >
                    <v-icon start>mdi-package-variant</v-icon>
                    {{ material.category?.name }}
                </v-chip>
            </v-card-text>

            <v-divider></v-divider>

            <!-- KPIs principales -->
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" md="3">
                        <v-sheet class="kpi-card" elevation="2" rounded="lg">
                            <div class="kpi-icon" :style="{ background: stockKpiColor + '20' }">
                                <v-icon color="primary">mdi-package-variant-closed</v-icon>
                            </div>
                            <div class="kpi-content">
                                <div class="kpi-label">Stock Actual</div>
                                <div class="kpi-value">{{ formatNumber(material.current_stock) }}</div>
                                <div class="kpi-unit">{{ material.unit_of_measure?.abbreviation }}</div>
                                <v-progress-linear
                                    :model-value="stockPercentage"
                                    :color="stockStatus.color"
                                    height="6"
                                    rounded
                                    class="mt-2"
                                ></v-progress-linear>
                            </div>
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-sheet class="kpi-card" elevation="2" rounded="lg">
                            <div class="kpi-icon" style="background: #10b98120">
                                <v-icon color="success">mdi-currency-usd</v-icon>
                            </div>
                            <div class="kpi-content">
                                <div class="kpi-label">Valor Inventario</div>
                                <div class="kpi-value">{{ formatCurrency(inventoryValue) }}</div>
                                <div class="kpi-unit">Valor total</div>
                                <div class="kpi-trend positive">
                                    <v-icon size="small">mdi-trending-up</v-icon>
                                    <span>Costo prom: {{ formatCurrency(material.avg_unit_cost) }}/unidad</span>
                                </div>
                            </div>
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-sheet class="kpi-card" elevation="2" rounded="lg">
                            <div class="kpi-icon" style="background: #f59e0b20">
                                <v-icon color="warning">mdi-chart-line</v-icon>
                            </div>
                            <div class="kpi-content">
                                <div class="kpi-label">Punto de Reorden</div>
                                <div class="kpi-value">{{ formatNumber(material.reorder_point) }}</div>
                                <div class="kpi-unit">Unidades</div>
                                <div class="mt-2 text-caption">
                                    Mínimo: {{ formatNumber(material.min_stock) }} | Seguridad: {{ formatNumber(material.safety_stock) }}
                                </div>
                            </div>
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-sheet class="kpi-card" elevation="2" rounded="lg">
                            <div class="kpi-icon" style="background: #8b5cf620">
                                <v-icon color="purple">mdi-calendar-clock</v-icon>
                            </div>
                            <div class="kpi-content">
                                <div class="kpi-label">Última Compra</div>
                                <div class="kpi-value">{{ formatCurrency(material.last_purchase_price) }}</div>
                                <div class="kpi-unit">{{ material.currency?.symbol }} / unidad</div>
                                <div class="mt-2 text-caption text-grey">
                                    Actualizado: {{ formatDate(material.updated_at) }}
                                </div>
                            </div>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card-text>

            <!-- Especificaciones Técnicas y Detalles -->
            <v-card-text>
                <v-row>
                    <!-- Columna Izquierda: Especificaciones Técnicas -->
                    <v-col cols="12" md="6">
                        <v-sheet class="pa-4" elevation="1" rounded="lg">
                            <h3 class="text-h6 mb-4">
                                <v-icon start color="primary">mdi-ruler</v-icon>
                                Especificaciones Técnicas
                            </h3>
                            <v-row>
                                <v-col cols="6">
                                    <div class="spec-item">
                                        <span class="spec-label">Gramaje</span>
                                        <span class="spec-value">{{ material.grammage || 'N/A' }} g/m²</span>
                                    </div>
                                    <div class="spec-item">
                                        <span class="spec-label">Ancho</span>
                                        <span class="spec-value">{{ material.width || 'N/A' }} cm</span>
                                    </div>
                                </v-col>
                                <v-col cols="6">
                                    <div class="spec-item">
                                        <span class="spec-label">Largo</span>
                                        <span class="spec-value">{{ material.length || 'N/A' }} m</span>
                                    </div>
                                    <div class="spec-item">
                                        <span class="spec-label">Color</span>
                                        <span class="spec-value">
                                            <v-chip
                                                v-if="material.color"
                                                :color="material.color"
                                                size="small"
                                                class="color-chip"
                                            >
                                                {{ material.color }}
                                            </v-chip>
                                            <span v-else>N/A</span>
                                        </span>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-sheet>

                        <!-- Información General -->
                        <v-sheet class="pa-4 mt-4" elevation="1" rounded="lg">
                            <h3 class="text-h6 mb-4">
                                <v-icon start color="primary">mdi-information</v-icon>
                                Información General
                            </h3>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Categoría</v-list-item-title>
                                    <v-list-item-subtitle>{{ material.category?.name }}</v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Tipo de Material</v-list-item-title>
                                    <v-list-item-subtitle>{{ material.material_type?.name }}</v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Unidad de Medida</v-list-item-title>
                                    <v-list-item-subtitle>{{ material.unit_of_measure?.name }} ({{ material.unit_of_measure?.abbreviation }})</v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Moneda</v-list-item-title>
                                    <v-list-item-subtitle>{{ material.currency?.name }} ({{ material.currency?.symbol }})</v-list-item-subtitle>
                                </v-list-item>
                            </v-list>
                        </v-sheet>
                    </v-col>

                    <!-- Columna Derecha: Gráficos y Movimientos -->
                    <v-col cols="12" md="6">
                        <!-- Gráfico de Movimiento de Stock -->
                        <v-sheet class="pa-4" elevation="1" rounded="lg">
                            <div class="d-flex align-center justify-space-between mb-4">
                                <h3 class="text-h6">
                                    <v-icon start color="primary">mdi-chart-line</v-icon>
                                    Movimiento de Stock (30 días)
                                </h3>
                                <v-btn variant="text" size="small" color="primary">
                                    Ver más
                                </v-btn>
                            </div>
                            <div class="chart-placeholder">
                                <!-- Aquí iría tu componente de gráfico real -->
                                <v-sheet class="pa-8 text-center text-grey" color="grey-lighten-4" rounded="lg">
                                    <v-icon size="48" color="grey-lighten-1">mdi-chart-line</v-icon>
                                    <div class="mt-2">Gráfico de movimientos</div>
                                </v-sheet>
                            </div>
                        </v-sheet>

                        <!-- Historial de Compras Recientes -->
                        <v-sheet class="pa-4 mt-4" elevation="1" rounded="lg">
                            <div class="d-flex align-center justify-space-between mb-4">
                                <h3 class="text-h6">
                                    <v-icon start color="primary">mdi-history</v-icon>
                                    Últimas Compras
                                </h3>
                                <v-btn variant="text" size="small" color="primary">
                                    Ver todo
                                </v-btn>
                            </div>
                            
                            <!-- Timeline de compras -->
                            <v-timeline density="compact" align="start">
                                <v-timeline-item
                                    v-for="i in 3"
                                    :key="i"
                                    dot-color="primary"
                                    size="small"
                                >
                                    <div class="d-flex justify-space-between">
                                        <div>
                                            <div class="font-weight-bold">Orden de Compra #OC-2024-{{ i }}</div>
                                            <div class="text-caption text-grey">Proveedor: Papelera Industrial S.A.</div>
                                        </div>
                                        <div class="text-right">
                                            <div class="font-weight-bold">{{ formatNumber(1000 * i) }} unidades</div>
                                            <div class="text-caption">{{ formatCurrency(2500 * i) }}</div>
                                        </div>
                                    </div>
                                </v-timeline-item>
                            </v-timeline>
                        </v-sheet>

                        <!-- Proveedores -->
                        <v-sheet class="pa-4 mt-4" elevation="1" rounded="lg">
                            <div class="d-flex align-center justify-space-between mb-4">
                                <h3 class="text-h6">
                                    <v-icon start color="primary">mdi-truck</v-icon>
                                    Proveedores
                                </h3>
                                <v-btn variant="text" size="small" color="primary">
                                    Gestionar
                                </v-btn>
                            </div>

                            <v-list>
                                <v-list-item
                                    v-for="i in 2"
                                    :key="i"
                                    :prepend-avatar="`https://randomuser.me/api/portraits/men/${i}.jpg`"
                                    :title="`Proveedor ${i}`"
                                    :subtitle="`Última compra: ${formatDate(new Date())}`"
                                >
                                    <template v-slot:append>
                                        <v-chip size="small" color="success">Activo</v-chip>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card-text>

            <!-- Descripción -->
            <v-card-text v-if="material.description">
                <v-divider class="mb-4"></v-divider>
                <h3 class="text-h6 mb-2">
                    <v-icon start color="primary">mdi-text-box</v-icon>
                    Descripción
                </h3>
                <p class="text-body-1 text-grey-darken-1">{{ material.description }}</p>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { materialService, type Material } from '@/services/materialService';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const material = ref<Material | null>(null);

// Computed properties para el estado del stock
const stockStatus = computed(() => {
    if (!material.value) return { color: 'grey', text: 'Cargando...', icon: 'mdi-help' };
    
    const stock = material.value.current_stock;
    
    if (stock <= material.value.min_stock) {
        return { color: 'error', text: 'Stock Crítico', icon: 'mdi-alert-circle' };
    } else if (stock <= material.value.reorder_point) {
        return { color: 'warning', text: 'Punto de Reorden', icon: 'mdi-alert' };
    } else if (stock >= material.value.max_stock) {
        return { color: 'info', text: 'Sobre Stock', icon: 'mdi-package-up' };
    } else {
        return { color: 'success', text: 'Stock Normal', icon: 'mdi-check-circle' };
    }
});

const stockKpiColor = computed(() => {
    const colors = {
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        info: '#3b82f6'
    };
    return colors[stockStatus.value.color as keyof typeof colors] || '#6b7280';
});

const stockPercentage = computed(() => {
    if (!material.value) return 0;
    const { current_stock, min_stock, max_stock } = material.value;
    return Math.min(((current_stock - min_stock) / (max_stock - min_stock)) * 100, 100);
});

const inventoryValue = computed(() => {
    if (!material.value) return 0;
    return material.value.current_stock * material.value.avg_unit_cost;
});

// Utilidades de formateo
const formatNumber = (value: number) => {
    if (!value && value !== 0) return 'N/A';
    return Math.round(value).toLocaleString('es-ES');
};

const formatCurrency = (value: number) => {
    if (!value && value !== 0) return 'N/A';
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const loadMaterial = async () => {
    const id = route.params.id as string;
    try {
        const response = await materialService.getById(Number(id));
        material.value = response.data || response;
    } catch (error: any) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'No se pudo cargar el material.',
        });
        console.error('Error loading material:', error);
    }
};

const goBack = () => {
    router.push({ name: 'Materials' });
};

const goToEdit = () => {
    if (material.value) {
        router.push({ name: 'EditMaterial', params: { id: material.value.id } });
    }
};

onMounted(() => {
    loadMaterial();
});
</script>

<style scoped>
.material-detail-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.detail-card {
    width: 100%;
}

.kpi-card {
    display: flex;
    align-items: center;
    padding: 16px;
    transition: all 0.3s ease;
}

.kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
}

.kpi-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
}

.kpi-content {
    flex: 1;
}

.kpi-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 4px;
}

.kpi-value {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.2;
}

.kpi-unit {
    font-size: 0.75rem;
    color: #9ca3af;
}

.kpi-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    margin-top: 4px;
}

.kpi-trend.positive {
    color: #10b981;
}

.kpi-trend.negative {
    color: #ef4444;
}

.spec-item {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
}

.spec-item:last-child {
    border-bottom: none;
}

.spec-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.spec-value {
    font-size: 1rem;
    font-weight: 500;
    color: #111827;
}

.color-chip {
    min-width: 60px;
    text-transform: capitalize;
}

.chart-placeholder {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .material-detail-container {
        padding: 10px;
    }
    
    .kpi-card {
        flex-direction: column;
        text-align: center;
    }
    
    .kpi-icon {
        margin-right: 0;
        margin-bottom: 12px;
    }
}
</style>