<template>
  <DetailPage title="Calendarización Presupuestaria"
    subtitle="Gestiona las solicitudes de  calendarización presupuestaria.">
  </DetailPage>
  <UiParentCard>
    <DataTable :headers="headers" :items="budgets" :loading="loading" v-model:search="search" :page="pagination.page"
      :items-per-page="pagination.itemsPerPage" :total-items="budgets.length" @update:page="pagination.page = $event"
      @update:itemsPerPage="pagination.itemsPerPage = $event">
      <template #top>
        <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3 ga-3">
          <v-text-field v-model="search" density="comfortable" variant="outlined" clearable hide-details
            label="Buscar solicitud" class="flex-grow-1" />
          <div class="d-flex ga-2">
            <v-btn variant="text" color="secondary" prepend-icon="mdi-download" @click="exportCsv">
              Exportar
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
              Nueva Solicitud
            </v-btn>
          </div>
        </div>
      </template>
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
import { reactive, ref, onMounted, computed } from "vue";
import DataTable, { BaseTableHeader } from "@/components/base/DataTable.vue";
import DetailPage from "@/components/base/DetailPage.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import {
  BudgetRequestService,
  type BudgetRequest,
} from "@/services/budgets/requestsService";
import { showSwal, confirmSwal } from "@/utils/alerts";

const router = useRouter();
const budgets = ref<BudgetRequest[]>([]);
const loading = ref(false);
const deletingId = ref<number | null>(null);
const search = ref("");
const pagination = reactive({
  page: 1,
  itemsPerPage: 50,
});

const headers: BaseTableHeader[] = [
  { title: "Numero de solicitud", key: "request_number" },
  { title: "Año", key: "year" },
  { title: "Fecha de registro", key: "created_at" },
  { title: "Rubro", key: "category_name", sortable: false },
  { title: "Departamento", key: "department_name", sortable: false },
  { title: "Total solicitado", key: "estimated_total", sortable: false, align: "end", format: "currency" },
  { title: "Notas", key: "notes", sortable: false },
  { title: "Estado", key: "status_name", sortable: false, },
  { title: "Acciones", key: "actions", sortable: false, align: "end", },
];

async function fetchRequests() {
  loading.value = true;
  try {
    const data = await BudgetRequestService.getAll();
    budgets.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al cargar los presupuestos", error);
    showSwal({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los presupuestos.',
      confirmButtonText: 'Aceptar',
    });
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  router.push({ name: "BudgetRequestsCreate" });
}

function startEdit(item: BudgetRequest) {
  if (item.id === null) return;
  router.push({ name: "BudgetRequestsEdit", params: { id: item.id } });
}

function openView(item: BudgetRequest) {
  if (item.id === null) return;
  router.push({ name: "BudgetRequestsView", params: { id: item.id } });
}

function remove(item: BudgetRequest) {
  if (item.id === null) return;
  confirmSwal({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      // Lógica para eliminar la solicitud
      console.log("Eliminar solicitud con ID:", item.id);
      // Aquí podrías llamar a un servicio para eliminar la solicitud y luego recargar la lista
      // Por ejemplo:
      // BudgetRequestService.delete(item.id).then(() => {
      //   showSwal({ icon: 'success', title: 'Eliminado', text: 'La solicitud ha sido eliminada.' });
      //   fetchRequests();
      // }).catch(error => {
      //   console.error("Error al eliminar la solicitud", error);
      //   showSwal({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la solicitud.' });
      // });
    }
  });
  console.log("Eliminar solicitud con ID:", item.id);
}

function exportCsv() {
  // Aquí iría la lógica para exportar las solicitudes de calendarización presupuestaria a CSV
  console.log("Exportar a CSV");
}
onMounted(() => {
  fetchRequests();
});

</script>