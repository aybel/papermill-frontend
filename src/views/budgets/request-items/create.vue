<template>
    <UiParentCard class="mb-6">
        <FormPageActions v-if="!embedded" :loading="saving" :back-to="{ name: 'BudgetRequests' }"
            @save="handleSaveItem" />
        <v-form ref="headerItemsFormRef">
            <v-row class="px-4 py-3 d-flex justify-content-center" :gap="24">
                <v-col cols="8">
                    <h3 class="text-h6 mb-2">Artículo</h3>
                    <v-divider class="mb-4" />
                </v-col>
                <v-col cols="8">
                    <v-select v-model="itemForm.category_id" :items="materialCategoryItems" item-title="title"
                        item-value="value" label="Categoría de material" variant="outlined" density="comfortable"
                        :loading="loadingLookups" />
                </v-col>
                <v-col cols="8">
                    <v-select v-model="itemForm.material_id" :items="materialOptions" item-title="name" item-value="id"
                        label="Material" variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="8">
                    <v-text-field v-model="itemForm.quantity" label="Cantidad" variant="outlined"
                        density="comfortable" />
                </v-col>
                <v-col cols="8">
                    <v-text-field v-model="itemForm.estimated_price" label="Precio estimado" variant="outlined"
                        density="comfortable" prefix="$" />
                </v-col>
                <v-col cols="8">
                    <v-textarea v-model="itemForm.technical_specifications" label="Especificaciones técnicas"
                        variant="outlined" density="comfortable" rows="4" auto-grow />
                </v-col>

                <v-col cols="8">
                    <v-textarea v-model="itemForm.quality_requirements" label="Requerimientos de calidad"
                        variant="outlined" density="comfortable" rows="4" auto-grow />
                </v-col>
            </v-row>
        </v-form>
    </UiParentCard>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from 'vue-router';
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { materialService, type Material } from "@/services/materialService";
import { materialCategoryService, type MaterialCategory } from "@/services/materialCategoryService";

import { onMounted, reactive, ref } from "vue";
import { BudgetRequestItemsService, type BudgetRequestItems } from "@/services/budgets/requestItemsService";
import FormPageActions from "@/components/base/FormPageActions.vue";
import { showSwal } from "@/utils/alerts";
import { firstError } from "@/utils/errors";

const props = withDefaults(defineProps<{
    requestId?: number | null;
    embedded?: boolean;
}>(), {
    requestId: null,
    embedded: false,
});

const emit = defineEmits<{
    (e: 'saved'): void;
}>();

const route = useRoute();
const router = useRouter();

const headerItemsFormRef = ref<any>(null);
const materialOptions = ref<Material[]>([]);
const materialCategoryOptions = ref<MaterialCategory[]>([]);
const loadingLookups = ref(false);
const saving = ref(false);

type ItemForm = {
    category_id: number | null;
    material_id: number | null;
    quantity: number;
    estimated_price: number;
    technical_specifications: string;
    quality_requirements: string;
};

const itemForm = reactive<ItemForm>({
    category_id: null,
    material_id: null,
    quantity: 1,
    estimated_price: 0,
    technical_specifications: "",
    quality_requirements: "",
});

const resolvedRequestId = computed(() => {
    if (props.requestId && props.requestId > 0) return props.requestId;

    const queryRequestId = Number(route.query.requestId);
    return Number.isInteger(queryRequestId) && queryRequestId > 0 ? queryRequestId : null;
});

const materialCategoryItems = computed(() => {
    return materialCategoryOptions.value.map((category) => ({
        title: category.name,
        value: category.id,
    }));
});

function resetItemForm() {
    itemForm.category_id = null;
    itemForm.material_id = null;
    itemForm.quantity = 1;
    itemForm.estimated_price = 0;
    itemForm.technical_specifications = "";
    itemForm.quality_requirements = "";
}

async function handleSaveItem() {
    const isValid = await headerItemsFormRef.value?.validate();
    if (isValid?.valid === false) return;

    if (!resolvedRequestId.value) {
        await showSwal({
            icon: 'warning',
            title: 'Solicitud requerida',
            text: 'No se encontró el id de la solicitud para guardar el artículo.',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    if (!itemForm.material_id) {
        await showSwal({
            icon: 'warning',
            title: 'Material requerido',
            text: 'Selecciona un material antes de guardar.',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    saving.value = true;
    try {
        const payload: Partial<BudgetRequestItems> = {
            budget_request_id: resolvedRequestId.value,
            material_id: itemForm.material_id,
            quantity: Number(itemForm.quantity),
            estimated_unit_price: Number(itemForm.estimated_price),
            technical_specifications: itemForm.technical_specifications,
            quality_requirements: itemForm.quality_requirements,
        };

        await BudgetRequestItemsService.create(payload);

        await showSwal({
            icon: 'success',
            title: 'Artículo agregado',
            text: 'El artículo se guardó correctamente.',
            confirmButtonText: 'Aceptar',
        });

        resetItemForm();
        emit('saved');

        if (!props.embedded) {
            router.push({ name: 'BudgetRequests' });
        }
    } catch (err: any) {
        console.error('Error guardando artículo:', err);
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
            showSwal({ icon: 'error', title: 'Error', text: 'No se pudo guardar el artículo.', confirmButtonText: 'Aceptar' });
        }
    } finally {
        saving.value = false;
    }
}

async function loadLookups() {
    loadingLookups.value = true;
    try {
        const [categoriesResponse] = await Promise.all([
            materialCategoryService.filterPost({
                filters: [
                    { field: 'parent_id', operator: 'notnull' }
                ],
                order_by: { column: 'name', direction: 'asc' }
            }),
        ]);

        materialCategoryOptions.value = categoriesResponse.success ? categoriesResponse.data : [];

    } catch (error) {
        console.error('Error loading lookups:', error);
        materialCategoryOptions.value = [];
    } finally {
        loadingLookups.value = false;
    }
}

onMounted(() => {
    loadLookups();
});
</script>