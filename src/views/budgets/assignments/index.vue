<template>
    <DetailPage title="Asignaciones Presupuestarias"
        subtitle="Gestiona las asignaciones que podrás usar en los presupuestos">
    </DetailPage>

    <UiParentCard>
        <DataTable :headers="headers" :items="assignments" :loading="loading" v-model:search="search"
            :page="pagination.page" :items-per-page="pagination.itemsPerPage" :total-items="assignments.length"
            @update:page="pagination.page = $event" @update:itemsPerPage="pagination.itemsPerPage = $event">
            <template #top>
                <div class="d-flex flex-wrap align-center justify-space-between px-4 py-3 ga-3">
                    <v-text-field v-model="search" density="comfortable" variant="outlined" clearable hide-details
                        label="Buscar asignación" class="flex-grow-1" />
                    <div class="d-flex ga-2">
                        <v-btn variant="text" color="secondary" prepend-icon="mdi-download" @click="exportCsv">
                            Exportar
                        </v-btn>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">
                            Nueva Asignación
                        </v-btn>
                    </div>
                </div>
            </template>

            <template #item.year="{ item }">
                <InlineEdit :model-value="item?.year" :loading="inlineSavingId === item?.id" placeholder="Sin año"
                    @save="(value) => item && saveInline(item, 'year', value as string)" />
            </template>

            <template #item.department_id="{ item }">
                <InlineEdit :model-value="item?.department?.name" :loading="inlineSavingId === item?.department_id"
                    placeholder="Sin departamento"
                    @save="(value) => item && saveInline(item, 'department_id', value as string)" />
            </template>

            <template #item.budget_category_id="{ item }">
                <InlineEdit :model-value="item?.category?.name" :loading="inlineSavingId === item?.budget_category_id"
                    placeholder="Sin rubro"
                    @save="(value) => item && saveInline(item, 'budget_category_id', value as string)" />
            </template>

            <template #item.assigned_amount="{ item }">
                <div class="w-100 d-flex justify-end">
                    <InlineEdit class="" :model-value="item?.assigned_amount"
                        :loading="inlineSavingId === item?.assigned_amount" placeholder="Sin monto asignado"
                        @save="(value) => item && saveInline(item, 'assigned_amount', value as string)">
                        <template #display>
                            <span class="">{{ formatAmount(item?.assigned_amount ?? 0) }}</span>
                        </template>
                    </InlineEdit>
                </div>
            </template>

            <template #item.justification="{ item }">
                <InlineEdit type="textarea" :model-value="item?.justification"
                    :loading="inlineSavingId === item?.justification" placeholder="Sin justificación"
                    @save="(value) => item && saveInline(item, 'justification', value as string)" />
            </template>

            <template #item.actions="{ item }">
                <v-btn icon variant="text" color="primary" @click.stop="item && startEdit(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="error" :loading="deletingId === item?.id"
                    @click.stop="item && remove(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

            <template #body.append="{ columns }">
                <tr class="bg-grey-lighten-4 font-weight-medium">
                    <td :colspan="columns.length - 2" class="text-right">Total</td>
                    <td class="text-end">{{ formatAmount(totalAssigned) }}</td>
                </tr>
            </template>
        </DataTable>
    </UiParentCard>

    <CreateModal v-model="dialog" :title="dialogMode === 'create' ? 'Nueva Asignación' : 'Editar Asignación'"
        :subtitle="dialogMode === 'create' ? 'Crea una asignación para tu presupuesto' : 'Actualiza la información de la asignación'"
        :loading="saving" submit-label="Guardar" @submit="submitForm" @cancel="closeDialog">
        <v-form ref="formRef" @submit.prevent="submitForm">
            <v-select v-model="form.year" :items="yearOptions" label="Año" :rules="[rules.required]" />
            <v-select v-model="form.department_id" :items="departmentOptions" item-title="name" item-value="id"
                label="Departamento" :rules="[rules.required]" :loading="lookupsLoading" clearable autofocus />
            <v-select v-model="form.budget_category_id" :items="categoryOptions" item-title="name" item-value="id"
                label="Categoría presupuestaria" :rules="[rules.required]" :loading="lookupsLoading" clearable />
            <v-text-field v-model="form.assigned_amount" label="Monto Asignado" type="text" inputmode="decimal"
                :rules="[rules.required, rules.amountFormat]" @keypress="handleAmountKeyPress" />
            <v-textarea v-model="form.justification" label="Justificación" rows="3" auto-grow />
        </v-form>
    </CreateModal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, onMounted, reactive, ref } from "vue";
import DataTable, { BaseTableHeader } from "@/components/base/DataTable.vue";
import CreateModal from "@/components/base/CreateModal.vue";
import DetailPage from "@/components/base/DetailPage.vue";
import InlineEdit from "@/components/base/InlineEdit.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import {
    AssignmentService,
    type Assignment,
} from "@/services/budgets/assignmentsService";
import { BudgetCategoryService, type BudgetCategory } from "@/services/budgets/categoriesService";
import { DepartmentService, type Department } from "@/services/departmentsService";
import { showSwal, confirmSwal } from "@/utils/alerts";
import { normalizeAmount, formatAmount, handleAmountKeyPress } from "@/utils/numberFormat";
import type { VForm } from "vuetify/components";



type EditableAssignment = Omit<Assignment, "created_at" | "updated_at"> & {
    department_id: number | null;
    budget_category_id: number | null;
};

const headers: BaseTableHeader[] = [
    {
        title: "Año",
        key: "year",
        sortable: true,
        align: "center",
    },
    { title: "Departamento", key: "department_id" },
    { title: "Rubro", key: "budget_category_id", sortable: false },
    {
        title: "Justificación",
        key: "justification",
        sortable: false,
    },
    {
        title: "Monto Asignado",
        key: "assigned_amount",
        sortable: false,
        align: "end",
    },
    { title: "Acciones", key: "actions", sortable: false, align: "end" },
];

const router = useRouter();
const assignments = ref<Assignment[]>([]);
const loading = ref(false);
const saving = ref(false);
const deletingId = ref<number | null>(null);
const inlineSavingId = ref<number | null>(null);
const lookupsLoading = ref(false);
const dialog = ref(false);
const dialogMode = ref<"create" | "edit">("create");
const search = ref("");
const pagination = reactive({
    page: 1,
    itemsPerPage: 50,
});

const totalAssigned = computed(() =>
    assignments.value.reduce((sum, item) => {
        if (!item) return sum;
        return sum + normalizeAmount(item.assigned_amount ?? 0);
    }, 0)
);

const departmentOptions = ref<Department[]>([]);
const categoryOptions = ref<BudgetCategory[]>([]);
const yearOptions = ref<number[]>([]);

const form = reactive<EditableAssignment>(emptyForm());
const formRef = ref<VForm | null>(null);

const rules = {
    required: (value: unknown) => {
        if (value === null || value === undefined) return "Campo requerido";
        if (typeof value === "string") return value.trim().length > 0 || "Campo requerido";
        return true;
    },
    amountFormat: (value: unknown) => {
        if (value === null || value === undefined || value === "") return "Campo requerido";
        const str = String(value);
        return /^[0-9.,]+$/.test(str) || "Solo números, comas y puntos";
    },
};

function emptyForm(): EditableAssignment {
    return {
        id: null,
        department_id: null,
        budget_category_id: null,
        year: new Date().getFullYear(),
        assigned_amount: 0,
        justification: "",
    };
}

function buildYearOptions() {
    const current = new Date().getFullYear();
    yearOptions.value = Array.from({ length: 7 }, (_, idx) => current - 3 + idx);
}

async function fetchAssignments() {
    loading.value = true;
    try {
        const data = await AssignmentService.getAll();
        assignments.value = data;
    } catch (error) {
        console.error("Error al cargar asignaciones", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las asignaciones.',
            confirmButtonText: 'Aceptar',
        });
    } finally {
        loading.value = false;
    }
}

async function fetchLookups() {
    lookupsLoading.value = true;
    try {
        const [departments, categories] = await Promise.all([
            DepartmentService.getAll(),
            BudgetCategoryService.getAll(),
        ]);
        departmentOptions.value = departments;
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

function openCreate() {
    dialogMode.value = "create";
    Object.assign(form, emptyForm());
    dialog.value = true;
}

function startEdit(item: Assignment) {
    dialogMode.value = "edit";
    Object.assign(form, {
        id: item.id,
        department_id: item.department_id,
        budget_category_id: item.budget_category_id,
        year: item.year,
        assigned_amount: item.assigned_amount,
        justification: item.justification
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
            const created = await AssignmentService.create({
                department_id: form.department_id,
                budget_category_id: form.budget_category_id,
                year: form.year,
                assigned_amount: normalizeAmount(form.assigned_amount),
                justification: form.justification,
            });
            if (created.success) {
                showSwal({
                    icon: 'success',
                    title: 'Rubro creado',
                    text: created.data.message || 'El registro se guardó correctamente',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    router.push({ name: 'BudgetAssignments' });
                });
            }
            assignments.value = [created.data, ...assignments.value];
        } else if (form.id) {
            const updated = await AssignmentService.update(form.id, {
                department_id: form.department_id,
                budget_category_id: form.budget_category_id,
                year: form.year,
                assigned_amount: normalizeAmount(form.assigned_amount),
                justification: form.justification,
            });
            if (updated.success) {
                showSwal({
                    icon: 'success',
                    title: 'Asignación actualizada',
                    text: updated.message || 'El registro se actualizó correctamente',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    router.push({ name: 'BudgetAssignments' });
                });
            }
            const index = assignments.value.findIndex((c) => c.id === form.id);
            if (index !== -1) {
                assignments.value[index] = { ...assignments.value[index], ...updated.data };
            }
        }
        closeDialog();
    } catch (error) {
        console.error("Error al guardar asignación", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'No se pudo guardar la asignación.',
            confirmButtonText: 'Aceptar',
        });
    } finally {
        saving.value = false;
    }
}

async function remove(item: Assignment) {
    if (!item.id) return;

    const result = await confirmSwal({
        title: '¿Eliminar asignación?',
        text: 'Esta acción no se puede deshacer.',
        confirmButtonText: 'Sí, eliminar',
    });

    if (!result.isConfirmed) return;

    deletingId.value = item.id;
    try {
        await AssignmentService.delete(item.id);
        assignments.value = assignments.value.filter((c) => c.id !== item.id);
        showSwal({ icon: 'success', title: 'Eliminado', text: 'La asignación ha sido eliminada.' });
    } catch (error) {
        console.error("Error al eliminar asignación", error);
        showSwal({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo eliminar la asignación.' });
    } finally {
        deletingId.value = null;
    }
}

async function saveInline(
    item: Assignment,
    field: "name" | "description",
    value: string
) {
    if (!item.id) return;
    inlineSavingId.value = item.id;
    try {
        const payload: Record<string, any> = { [field]: value };
        if (field === "assigned_amount") {
            payload[field] = normalizeAmount(value);
        }
        const updated = await AssignmentService.update(item.id, payload);
        if (updated.success) {
            showSwal({
                icon: 'success',
                title: 'Asignación actualizada',
                text: updated.message || 'El registro se actualizó correctamente',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                router.push({ name: 'BudgetAssignments' });
            });
        }
        const index = assignments.value.findIndex((c) => c.id === item.id);
        if (index !== -1) {
            assignments.value[index] = { ...assignments.value[index], ...updated.data };
        }
    } catch (error) {
        console.error("Error al actualizar asignación", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'No se pudo actualizar la asignación.',
            confirmButtonText: 'Aceptar',
        });
    } finally {
        inlineSavingId.value = null;
    }
}

async function exportCsv() {
    try {
        const blob = await AssignmentService.exportAs("csv");
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "asignaciones-presupuestarias.csv";
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al exportar asignaciones", error);
    }
}

onMounted(() => {
    fetchAssignments();
    fetchLookups();
    buildYearOptions();
});
</script>
