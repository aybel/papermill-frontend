<template>
  <DetailPage title="Calendarización Presupuestaria"
    subtitle="Gestiona las solicitudes de presupuesto, asignaciones y cronogramas relacionados.">
  </DetailPage>
  <UiParentCard>
    <DataTable :headers="headers" :items="budgetRequest" :loading="loading" v-model:search="search"
      :page="pagination.page" :items-per-page="pagination.itemsPerPage" :total-items="budgetRequest.length"
      @update:page="pagination.page = $event" @update:itemsPerPage="pagination.itemsPerPage = $event">
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
import { onMounted, reactive, ref } from "vue";
import DataTable, { BaseTableHeader } from "@/components/base/DataTable.vue";
import DetailPage from "@/components/base/DetailPage.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import {
  BudgetRequestService,
  type BudgetRequest,
} from "@/services/budgets/budgetRequestsService";
import { BudgetCategoryService, type BudgetCategory } from "@/services/budgets/budgetCategoriesService";
import { showSwal, confirmSwal } from "@/utils/alerts";
import type { VForm } from "vuetify/components";

type EditableBudgetRequest = {
  id: number | null;
  request_number: string | null;
  year: number | null;
  budget_category_id: number | null;
  submitted_at: string | null;
  notes: string;
  is_active?: boolean;
};

const form = reactive<EditableBudgetRequest>(emptyForm());

const router = useRouter();
const budgetRequest = ref<BudgetRequest[]>([]);
const loading = ref(false);
const saving = ref(false);
const deletingId = ref<number | null>(null);
const inlineSavingId = ref<number | null>(null);
const lookupsLoading = ref(false);
const dialog = ref(false);
const dialogMode = ref<"create" | "edit">("create");
const search = ref("");
const formRef = ref<VForm | null>(null);
const pagination = reactive({
  page: 1,
  itemsPerPage: 50,
});

const categoryOptions = ref<BudgetCategory[]>([]);
const yearOptions = ref<number[]>([]);

const rules = {
  required: (value: unknown) => {
    if (value === null || value === undefined) return "Campo requerido";
    if (typeof value === "string") return value.trim().length > 0 || "Campo requerido";
    return true;
  },
};

const headers: BaseTableHeader[] = [
  { title: "Numero de solicitud", key: "request_number" },
  { title: "Año", key: "year" },
  { title: "Fecha de registro", key: "submitted_at" },
  {
    title: "Rubro", key: "category", sortable: false
  },
  {
    title: "Departamento", key: "department", sortable: false
  },
  {
    title: "Total solicitado", key: "total_requested", sortable: false
  },
  { title: "Notas", key: "notes", sortable: false },
  { title: "Estado", key: "budget_request_status_id", sortable: false, },
  { title: "Acciones", key: "actions", sortable: false, align: "end", },
];


function emptyForm(): EditableBudgetRequest {
  return {
    id: null,
    request_number: null,
    year: new Date().getFullYear(),
    budget_category_id: null,
    submitted_at: new Date().toISOString().split("T")[0],
    notes: "",
    is_active: true,
  };
}
async function submitForm() {

}

function buildYearOptions() {
  const current = new Date().getFullYear();
  yearOptions.value = Array.from({ length: 7 }, (_, idx) => current - 3 + idx);
}

async function fetchLookups() {
  lookupsLoading.value = true;
  try {
    const categories = await BudgetCategoryService.getAll();
    categoryOptions.value = categories;
  } catch (error) {
    console.error("Error al cargar catálogos", error);
    showSwal({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los catálogos.',
      confirmButtonText: 'Aceptar',
    });
  } finally {
    lookupsLoading.value = false;
  }
}

onMounted(() => {
  buildYearOptions();
  fetchLookups();
});

</script>