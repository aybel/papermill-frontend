<template>
    <UiParentCard>
        <div class="d-flex align-center justify-space-between px-4 py-3">
            <h3 class="text-h6">Artículos</h3>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateModal">Agregar artículo</v-btn>
        </div>

        <DataTable :headers="headers" :items="budgetRequestItems" :loading="loading" v-model:search="search"
            :page="pagination.page" :items-per-page="pagination.itemsPerPage" :total-items="budgetRequestItems.length"
            @update:page="pagination.page = $event" @update:itemsPerPage="pagination.itemsPerPage = $event">
            <template #item.actions="{ item }">
                <v-btn icon variant="text" color="info" @click.stop="openView(item)">
                    <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="primary" @click.stop="startEdit(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="error" :loading="deletingId === item.id" @click.stop="remove(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </DataTable>
    </UiParentCard>

    <CreateModal v-model="itemDialog" title="Agregar artículo"
        subtitle="Captura la información del artículo para esta solicitud" submit-label="Cerrar"
        @submit="itemDialog = false" :max-width="980" :persistent="false">
        <RequestItemsCreateView :request-id="props.requestId" embedded @saved="handleItemSaved" />
    </CreateModal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { reactive, ref, watch } from "vue";
import DataTable, { BaseTableHeader } from "@/components/base/DataTable.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { showSwal } from "@/utils/alerts";
import CreateModal from "@/components/base/CreateModal.vue";
import RequestItemsCreateView from "@/views/budgets/request-items/create.vue";
import {
    BudgetRequestItemsService,
    type BudgetRequestItems
} from "@/services/budgets/requestItemsService";

const props = defineProps<{
    requestId?: number | null;
}>();

const router = useRouter();
const budgetRequestItems = ref<BudgetRequestItems[]>([]);
const loading = ref(false);
const deletingId = ref<number | null>(null);
const search = ref("");
const itemDialog = ref(false);
const pagination = reactive({
    page: 1,
    itemsPerPage: 50,
});

const headers: BaseTableHeader[] = [
    { title: "Material", key: "request_number", sortable: true },
    { title: "Cantidad", key: "number", sortable: true },
    { title: "Precio estimado", key: "estimated_unit_price", sortable: true },
    { title: "Especificaciones técnicas", key: "technical_specifications", sortable: true },
    { title: "Requerimientos de calidad", key: "quality_requirements", sortable: true },
    { title: "Total", key: "total", sortable: true, align: "end" },
    { title: "Acciones", key: "actions", sortable: false, align: "end", },
];
async function fetchRequestItems() {
    if (!props.requestId || props.requestId <= 0) {
        budgetRequestItems.value = [];
        return;
    }

    loading.value = true;
    try {
        const data = await BudgetRequestItemsService.getByRequestId(props.requestId);
        budgetRequestItems.value = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al cargar los articulos", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los articulos.',
            confirmButtonText: 'Aceptar',
        });
    } finally {
        loading.value = false;
    }
}

async function openCreateModal() {
    if (!props.requestId || props.requestId <= 0) {
        await showSwal({
            icon: 'warning',
            title: 'Guarda el encabezado primero',
            text: 'Debes guardar la solicitud para obtener el id y agregar artículos.',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    itemDialog.value = true;
}

function handleItemSaved() {
    itemDialog.value = false;
    fetchRequestItems();
}

function startEdit(item: BudgetRequestItems) {
    if (item.id === null) return;
    router.push({ name: "BudgetRequestsEdit", params: { id: item.id } });
}

function openView(item: BudgetRequestItems) {
    if (item.id === null) return;
    router.push({ name: "BudgetRequestsView", params: { id: item.id } });
}

function remove(item: BudgetRequestItems) {
    if (item.id === null) return;
    // Aquí iría la lógica para eliminar la solicitud de calendarización presupuestaria
    // Por ejemplo, podrías mostrar un diálogo de confirmación y luego llamar a un servicio para eliminarla
    console.log("Eliminar solicitud con ID:", item.id);
}

watch(
    () => props.requestId,
    () => {
        fetchRequestItems();
    },
    { immediate: true }
);

</script>