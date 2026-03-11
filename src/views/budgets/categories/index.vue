<template>
  <DetailPage title="Rubros Presupuestarios" subtitle="Gestiona los rubros que podrás usar en los presupuestos">
  </DetailPage>

  <UiParentCard>
    <DataTable :headers="headers" :items="categories" :loading="loading" v-model:search="search" :page="pagination.page"
      :items-per-page="pagination.itemsPerPage" :total-items="categories.length" @update:page="pagination.page = $event"
      @update:itemsPerPage="pagination.itemsPerPage = $event">
      <template #top>
        <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3 ga-3">
          <v-text-field v-model="search" density="comfortable" variant="outlined" clearable hide-details
            label="Buscar rubro" class="flex-grow-1" />
          <div class="d-flex ga-2">
            <v-btn variant="text" color="secondary" prepend-icon="mdi-download" @click="exportCsv">
              Exportar
            </v-btn>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
              Nuevo Rubro
            </v-btn>
          </div>
        </div>
      </template>

      <template #item.name="{ item }">
        <InlineEdit :model-value="item.name" :loading="inlineSavingId === item.id" placeholder="Sin nombre"
          @save="(value) => saveInline(item, 'name', value as string)" />
      </template>

      <template #item.description="{ item }">
        <InlineEdit type="textarea" :model-value="item.description" :loading="inlineSavingId === item.id"
          placeholder="Sin descripción" @save="(value) => saveInline(item, 'description', value as string)" />
      </template>

      <template #item.is_active="{ item }">
        <v-chip :color="item.is_active ? 'success' : 'grey'" size="small" label>
          {{ item.is_active ? 'Activo' : 'Inactivo' }}
        </v-chip>
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

  <CreateModal v-model="dialog" :title="dialogMode === 'create' ? 'Nuevo Rubro' : 'Editar Rubro'"
    :subtitle="dialogMode === 'create' ? 'Crea un rubro para tu presupuesto' : 'Actualiza la información del rubro'"
    :loading="saving" submit-label="Guardar" @submit="submitForm" @cancel="closeDialog">
    <v-form ref="formRef" @submit.prevent="submitForm">
      <v-text-field v-model="form.name" label="Nombre" :rules="[rules.required]" autofocus />
      <v-textarea v-model="form.description" label="Descripción" rows="3" auto-grow />
      <v-switch v-model="form.is_active" color="primary" label="Activo" />
    </v-form>
  </CreateModal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, reactive, ref } from "vue";
import DataTable, { BaseTableHeader } from "@/components/base/DataTable.vue";
import CreateModal from "@/components/base/CreateModal.vue";
import DetailPage from "@/components/base/DetailPage.vue";
import InlineEdit from "@/components/base/InlineEdit.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import {
  BudgetCategoryService,
  type BudgetCategory,
} from "@/services/budgets/categoriesService";
import { showSwal, confirmSwal } from "@/utils/alerts";
import type { VForm } from "vuetify/components";



type EditableCategory = Omit<BudgetCategory, "created_at" | "updated_at">;

const headers: BaseTableHeader[] = [
  { title: "Nombre", key: "name" },
  { title: "Descripción", key: "description" },
  { title: "Estado", key: "is_active", sortable: false, width: 140 },
  { title: "Acciones", key: "actions", sortable: false, align: "end", width: 120 },
];

const router = useRouter();
const categories = ref<BudgetCategory[]>([]);
const loading = ref(false);
const saving = ref(false);
const deletingId = ref<number | null>(null);
const inlineSavingId = ref<number | null>(null);
const dialog = ref(false);
const dialogMode = ref<"create" | "edit">("create");
const search = ref("");
const pagination = reactive({
  page: 1,
  itemsPerPage: 10,
});

const form = reactive<EditableCategory>(emptyForm());
const formRef = ref<VForm | null>(null);

const rules = {
  required: (value: string) => !!value?.trim() || "Campo requerido",
};

function emptyForm(): EditableCategory {
  return {
    id: null,
    name: "",
    description: "",
    is_active: true,
  };
}

async function fetchCategories() {
  loading.value = true;
  try {
    const data = await BudgetCategoryService.getAll();
    categories.value = data;
  } catch (error) {
    console.error("Error al cargar rubros", error);
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  dialogMode.value = "create";
  Object.assign(form, emptyForm());
  dialog.value = true;
}

function startEdit(item: BudgetCategory) {
  dialogMode.value = "edit";
  Object.assign(form, {
    id: item.id,
    name: item.name,
    description: item.description,
    is_active: item.is_active,
  });
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  Object.assign(form, emptyForm());
}

async function submitForm() {
  const isValid = await formRef.value?.validate();
  if (isValid?.valid === false) return;

  saving.value = true;
  try {
    if (dialogMode.value === "create") {
      const created = await BudgetCategoryService.create({
        name: form.name,
        description: form.description,
        is_active: form.is_active,
      });
      if (created.success) {
        showSwal({
          icon: 'success',
          title: 'Rubro creado',
          text: created.message || 'El registro se guardó correctamente',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          router.push({ name: 'BudgetCategories' });
        });
      }
      categories.value = [created.data, ...categories.value];
    } else if (form.id) {
      const updated = await BudgetCategoryService.update(form.id, {
        name: form.name,
        description: form.description,
        is_active: form.is_active,
      });
      if (updated.success) {
        showSwal({
          icon: 'success',
          title: 'Rubro actualizado',
          text: updated.message || 'El registro se actualizó correctamente',
          confirmButtonText: 'Aceptar',
        });
      }
      const index = categories.value.findIndex((c) => c.id === form.id);
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...updated };
      }
    }
    closeDialog();
  } catch (error) {
    console.error("Error al guardar rubro", error);
  } finally {
    saving.value = false;
  }
}

async function remove(item: BudgetCategory) {
  if (!item.id) return;

  const result = await confirmSwal({
    title: '¿Eliminar rubro?',
    text: 'Esta acción no se puede deshacer.',
    confirmButtonText: 'Sí, eliminar',
  });

  if (!result.isConfirmed) return;

  deletingId.value = item.id;
  try {
    await BudgetCategoryService.delete(item.id);
    categories.value = categories.value.filter((c) => c.id !== item.id);
    showSwal({ icon: 'success', title: 'Eliminado', text: 'El rubro ha sido eliminado.' });
  } catch (error) {
    console.error("Error al eliminar rubro", error);
    showSwal({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el rubro.' });
  } finally {
    deletingId.value = null;
  }
}

async function saveInline(
  item: BudgetCategory,
  field: "name" | "description",
  value: string
) {
  if (!item.id) return;
  inlineSavingId.value = item.id;
  try {
    const updated = await BudgetCategoryService.update(item.id, {
      [field]: value,
    });
    if (updated.success) {
      showSwal({
        icon: 'success',
        title: 'Rubro actualizado',
        text: updated.message || 'El registro se actualizó correctamente',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        router.push({ name: 'BudgetCategories' });
      });
    }
    const index = categories.value.findIndex((c) => c.id === item.id);
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updated };
    }
  } catch (error) {
    console.error("Error al actualizar rubro", error);
  } finally {
    inlineSavingId.value = null;
  }
}

async function exportCsv() {
  try {
    const blob = await BudgetCategoryService.exportAs("csv");
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rubros-presupuestarios.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al exportar rubros", error);
  }
}

onMounted(fetchCategories);
</script>
