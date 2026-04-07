<template>
    <DetailPage title="Nueva Solicitud Presupuestaria"
        subtitle="Captura el encabezado y los artículos de la solicitud." />
    <BaseBreadcrumbs :items="breadcrumbItems" />
    <FormPageActions :loading="saving" :back-to="{ name: 'BudgetRequests' }" @save="handleSave" />
    <UiParentCard class="mb-6">
        <v-form ref="headerFormRef">
            <v-row class="px-4 py-3 d-flex justify-content-center" :gap="24">
                <v-col cols="8">
                    <h3 class="text-h6 mb-2">Encabezado</h3>
                    <v-divider class="mb-4" />
                </v-col>

                <v-col cols="8">
                    <v-text-field v-model="headerForm.folio" label="Folio" variant="outlined" density="comfortable"
                        readonly />
                </v-col>

                <v-col cols="8">
                    <label class="mb-1 font-weight-medium">Fecha de creación</label>
                    <DatePicker v-model="headerForm.created" placeholder="Selecciona la fecha" />
                </v-col>

                <v-col cols="8">
                    <v-select v-model="headerForm.budget_category_id" :items="categoryOptions" item-title="name"
                        item-value="id" label="Categoría presupuestaria" variant="outlined" density="comfortable"
                        :loading="loadingLookups" />
                </v-col>

                <v-col cols="8">
                    <v-textarea v-model="headerForm.notes" label="Notas" variant="outlined" density="comfortable"
                        rows="4" auto-grow />
                </v-col>
            </v-row>
        </v-form>
    </UiParentCard>

    <UiParentCard>
        <DataTable :headers="itemHeaders" :items="requestItems" :loading="false" :hide-default-search="true"
            :show-footer="false">
            <template #top>
                <div class="d-flex align-center justify-space-between px-4 py-3">
                    <h3 class="text-h6">Artículos</h3>
                    <v-btn color="primary" prepend-icon="mdi-plus" @click="openItemModal">Agregar artículo</v-btn>
                </div>
            </template>
        </DataTable>
    </UiParentCard>

    <div class="mt-4">
        <FormPageActions :loading="saving" :back-to="{ name: 'BudgetRequests' }" @save="handleSave" />
    </div>

    <CreateModal v-model="itemDialog" title="Agregar artículo"
        subtitle="Captura la información del material para agregarlo a la solicitud" submit-label="Guardar artículo"
        @submit="saveItem">
        <v-row>
            <v-col cols="12">
                <v-autocomplete v-model="itemForm.material_id" :items="materialOptions" item-title="name"
                    item-value="id" label="Material" variant="outlined" density="comfortable" clearable
                    :loading="loadingLookups" />
            </v-col>

            <v-col cols="12" md="6">
                <v-text-field v-model.number="itemForm.quantity" label="Cantidad" type="number" min="0"
                    variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12" md="6">
                <v-text-field v-model.number="itemForm.estimated_price" label="Precio estimado" type="number" min="0"
                    step="0.01" variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12">
                <v-textarea v-model="itemForm.technical_specifications" label="Especificaciones técnicas"
                    variant="outlined" density="comfortable" rows="2" auto-grow />
            </v-col>

            <v-col cols="12">
                <v-textarea v-model="itemForm.quality_requirements" label="Requerimientos de calidad" variant="outlined"
                    density="comfortable" rows="2" auto-grow />
            </v-col>
        </v-row>
    </CreateModal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, reactive, ref } from "vue";
import BaseBreadcrumbs, { type BreadcrumbItem } from "@/components/base/BaseBreadcrumbs.vue";
import DataTable, { type BaseTableHeader } from "@/components/base/DataTable.vue";
import CreateModal from "@/components/base/CreateModal.vue";
import DetailPage from "@/components/base/DetailPage.vue";
import FormPageActions from "@/components/base/FormPageActions.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { BudgetCategoryService, type BudgetCategory } from "@/services/budgets/categoriesService";
import { materialService, type Material } from "@/services/materialService";
import { BudgetRequestItemsService, type BudgetRequestItems } from "@/services/budgets/requestItemsService";
import { BudgetRequestService, type BudgetRequest } from "@/services/budgets/requestsService";
import DatePicker from "@/components/shared/DatePicker.vue";
import '@vuepic/vue-datepicker/dist/main.css';
import { showSwal, confirmSwal } from "@/utils/alerts";
import { firstError } from "@/utils/errors";

type HeaderForm = {
    folio: string;
    created: string;
    budget_category_id: number | null;
    notes: string;
};

type ItemForm = {
    material_id: number | null;
    quantity: number;
    estimated_price: number;
    technical_specifications: string;
    quality_requirements: string;
};

type RequestItem = {
    id: number;
    material_id: number | null;
    material_name: string;
    quantity: number;
    estimated_price: number;
    technical_specifications: string;
    quality_requirements: string;
};

const router = useRouter();
const headerFormRef = ref<any>(null);
const loadingLookups = ref(false);
const saving = ref(false);
const categoryOptions = ref<BudgetCategory[]>([]);
const materialOptions = ref<Material[]>([]);
const itemDialog = ref(false);
const requestItems = ref<RequestItem[]>([]);
const itemSeq = ref(1);

const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Inicio", to: { name: "Home" } },
    { title: "Solicitudes presupuestarias", to: { name: "BudgetRequests" } },
    { title: "Nueva solicitud", disabled: true },
];

const itemHeaders: BaseTableHeader[] = [
    { title: "Material", key: "material_name" },
    { title: "Cantidad", key: "quantity" },
    { title: "Precio estimado", key: "estimated_price" },
    { title: "Especificaciones técnicas", key: "technical_specifications", sortable: false },
    { title: "Requerimientos de calidad", key: "quality_requirements", sortable: false },
];

const headerForm = reactive<HeaderForm>({
    folio: "",
    created: new Date().toISOString().split("T")[0],
    budget_category_id: null,
    notes: "",
});

const itemForm = reactive<ItemForm>({
    material_id: null,
    quantity: 1,
    estimated_price: 0,
    technical_specifications: "",
    quality_requirements: "",
});

function resetItemForm() {
    itemForm.material_id = null;
    itemForm.quantity = 1;
    itemForm.estimated_price = 0;
    itemForm.technical_specifications = "";
    itemForm.quality_requirements = "";
}

function openItemModal() {
    resetItemForm();
    itemDialog.value = true;
}

function saveItem() {
    const selectedMaterial = materialOptions.value.find((material) => material.id === itemForm.material_id);

    requestItems.value.push({
        id: itemSeq.value++,
        material_id: itemForm.material_id,
        material_name: selectedMaterial?.name ?? "",
        quantity: itemForm.quantity,
        estimated_price: itemForm.estimated_price,
        technical_specifications: itemForm.technical_specifications,
        quality_requirements: itemForm.quality_requirements,
    });

    itemDialog.value = false;
}
//Guarda la solicitud
async function handleSave() {
    const isValid = await headerFormRef.value?.validate();
    if (isValid?.valid === false) return;

    saving.value = true;
    try {
        const newRequest: Partial<BudgetRequest> = {
            budget_request_status_id: "draft",
            year: new Date(headerForm.created).getFullYear(),
            notes: headerForm.notes,
            created: headerForm.created,
            budget_category_id: headerForm.budget_category_id ?? 0,
        };

        const created = await BudgetRequestService.create(newRequest);
        if (created.success) {
            headerForm.folio = created.data.request_number;
            await showSwal({
                icon: 'success',
                title: 'Solicitud creada',
                text: created.data.message || 'El registro se guardó correctamente',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        showSwal({
            icon: 'error',
            title: 'Error',
            text: created?.message || 'No se pudo crear la solicitud',
            confirmButtonText: 'Aceptar',
        });
    } catch (err: any) {
        console.error('Error guardando solicitud:', err);
        if (err?.response?.status === 422) {
            const backendErrors = err.response?.data?.errors || {};
            const allMessages = Object.values(backendErrors)
                .flatMap((value) => Array.isArray(value) ? value : [String(value)])
                .filter(Boolean);

            const msg = allMessages.length > 0
                ? allMessages.join(' ')
                : firstError(backendErrors) || err.response?.data?.message || 'Errores de validación';

            showSwal({ icon: 'error', title: 'Validación', text: msg, confirmButtonText: 'Aceptar' });
        } else {
            showSwal({ icon: 'error', title: 'Error', text: 'Error inesperado', confirmButtonText: 'Aceptar' });
        }
    } finally {
        saving.value = false;
    }

}

async function loadLookups() {
    loadingLookups.value = true;
    try {
        const [categories, materials] = await Promise.all([
            BudgetCategoryService.getAll(),
            materialService.getAll(),
        ]);

        categoryOptions.value = categories;
        materialOptions.value = materials;
    } finally {
        loadingLookups.value = false;
    }
}

onMounted(() => {
    loadLookups();
});
</script>