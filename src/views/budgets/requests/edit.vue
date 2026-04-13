<template>
    <DetailPage title="Editar Solicitud Presupuestaria"
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
     <RequestItemsIndex :request-id="currentRequestId" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, reactive, ref } from "vue";
import BaseBreadcrumbs, { type BreadcrumbItem } from "@/components/base/BaseBreadcrumbs.vue";
import RequestItemsIndex from "@/views/budgets/request-items/index.vue";
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



const router = useRouter();
const headerFormRef = ref<any>(null);
const loadingLookups = ref(false);
const saving = ref(false);
const categoryOptions = ref<BudgetCategory[]>([]);
const currentRequestId = ref<number | null>(null);
const itemDialog = ref(false);


const breadcrumbItems: BreadcrumbItem[] = [
    { title: "Inicio", to: { name: "Home" } },
    { title: "Solicitudes presupuestarias", to: { name: "BudgetRequests" } },
    { title: "Editar solicitud", disabled: true },
];


const headerForm = reactive<HeaderForm>({
    folio: "",
    created: new Date().toISOString().split("T")[0],
    budget_category_id: null,
    notes: "",
});



function openItemModal() {
    itemDialog.value = true;
}

//Guarda la solicitud
async function handleSave() {
    const isValid = await headerFormRef.value?.validate();
    if (isValid?.valid === false) return;

    const selectedCategoryId = Number(headerForm.budget_category_id);
    if (!Number.isInteger(selectedCategoryId) || selectedCategoryId <= 0) {
        await showSwal({
            icon: 'warning',
            title: 'Categoría requerida',
            text: 'Selecciona una categoría presupuestaria antes de guardar.',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    saving.value = true;
    try {
        const newRequest: Partial<BudgetRequest> = {
            budget_request_status_id: "draft",
            year: new Date(headerForm.created).getFullYear(),
            notes: headerForm.notes,
            created: headerForm.created,
            budget_category_id: selectedCategoryId,
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
            text: created.data.message || 'No se pudo crear la solicitud',
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
        } if (err?.response?.status === 500) {
            showSwal({ icon: 'error', title: 'Error del servidor', text: err.response?.data?.message || 'Error del servidor', confirmButtonText: 'Aceptar' });
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
        const [categories] = await Promise.all([
            BudgetCategoryService.getAll(),
        ]);

        categoryOptions.value = Array.isArray(categories)
            ? categories
            : Array.isArray((categories as any)?.items)
                ? (categories as any).items
                : [];

    } finally {
        loadingLookups.value = false;
    }
}
async function loadRequest(requestId: number) {
    try {
        const request = await BudgetRequestService.getById(requestId);
        if (request) {
            headerForm.folio = request.request_number;
            headerForm.created = request.created.split("T")[0];
            headerForm.budget_category_id = request.budget_category_id;
            headerForm.notes = request.notes;
        } else {
            showSwal({
                icon: 'error',
                title: 'No encontrado',
                text: 'No se encontró la solicitud presupuestaria.',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                router.push({ name: "BudgetRequests" });
            });
        }
    } catch (error) {
        console.error("Error al cargar la solicitud presupuestaria", error);
        showSwal({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar la solicitud presupuestaria.',
            confirmButtonText: 'Aceptar',
        });
    }
}


onMounted(() => {
    loadLookups();
    const currentRequestIdValue = Number(router.currentRoute.value.params.id);
    if (isNaN(currentRequestIdValue)) {
        showSwal({
            icon: 'error',
            title: 'ID inválido',
            text: 'El ID de la solicitud presupuestaria no es válido.',
            confirmButtonText: 'Aceptar',
        }).then(() => {
            router.push({ name: "BudgetRequests" });
        });
    } else {
        currentRequestId.value = currentRequestIdValue;
        loadRequest(currentRequestIdValue);
    }
});

</script>