<template>
    <UiParentCard>
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { reactive, ref,onMounted,computed } from "vue";
import DataTable, { BaseTableHeader } from "@/components/base/DataTable.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { showSwal, confirmSwal } from "@/utils/alerts";
import {
    BudgetRequestItemsService,
    type BudgetRequestItems
} from "@/services/budgets/requestItemsService";

const router = useRouter();
const budgetRequestItems = ref<BudgetRequestItems[]>([]);
const loading = ref(false);
const deletingId = ref<number | null>(null);
const search = ref("");
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
    loading.value = true;
    try {
        const data = await BudgetRequestItemsService.getAll();
        budgetRequestItems.value = data;
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

onMounted(() => {
    fetchRequestItems();
});

</script>