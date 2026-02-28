<template>
	<v-card elevation="10" class="withbg">
		<v-card-title class="text-h5">Nuevo Material</v-card-title>
		<v-card-text>
			<v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
				<v-row>
					<v-col cols="12" md="8">
						<v-text-field v-model="form.name" label="Nombre" :rules="[rules.required]" required />
					</v-col>

					<v-col cols="12" md="12">
						<v-textarea v-model="form.description" label="Descripción" rows="2" />
					</v-col>

					<v-col cols="12" md="6">
						<v-select v-model="form.category_id as any" :items="categories" item-title="name"
							item-value="id" label="Categoría" :rules="[rules.required]" required />
					</v-col>
					<v-col cols="12" md="4">
						<v-select v-model="form.material_type_id as any" :items="materialTypes" item-title="name"
							item-value="id" label="Tipo de material" :rules="[rules.required]" required />
					</v-col>

					<v-col cols="12" md="4">
						<v-select v-model="form.unit_of_measure_id as any" :items="unitsOfMeasure" item-title="name"
							item-value="id" label="Unidad de medida" :rules="[rules.required]" required />
					</v-col>
					
					<v-col cols="12" md="4">
						<v-select v-model="form.currency_id as any" :items="currencies" item-title="name"
							item-value="id" label="Moneda" :rules="[rules.required]" required />
					</v-col>

					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.current_stock" label="Stock actual" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.min_stock" label="Stock mínimo" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.max_stock" label="Stock máximo" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.safety_stock" label="Stock de seguridad" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>

					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.reorder_point" label="Punto de reorden" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.avg_unit_cost" label="Costo prom. unitario" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.last_purchase_price" label="Último precio de compra"
							type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model.number="form.grammage" label="Gramaje" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model.number="form.width" label="Ancho" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model.number="form.length" label="Largo" type="number"
							:rules="[rules.numeric, rules.nonNegative]" />
					</v-col>

					<v-col cols="12" md="6">
						<v-text-field v-model="form.color" label="Color" />
					</v-col>
				</v-row>
				<v-row class="mt-4">
					<v-col cols="12" class="text-right">
						<v-btn color="primary" type="submit" :loading="loading">Guardar</v-btn>
						<v-btn color="secondary" variant="text" @click="goBack">Cancelar</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { materialService, type Material } from '@/services/materialService';
import { firstError } from '@/utils/errors';
import { showSwal } from '@/utils/alerts';
import { materialTypeService } from '@/services/materialTypeService';
import { materialCategoryService } from '@/services/materialCategories';
import { unitsOfMeasureService } from '@/services/unitsOfMeasureService';
import { catalogsService } from '@/services/catalogsService';


const router = useRouter();
const loading = ref(false);
const formValid = ref(true);
const formRef = ref();
const categories = ref([]);
const materialTypes = ref([]);
const unitsOfMeasure = ref([]);
const currencies = ref([]);
const errors = ref<Record<string, string[]>>({});

const form = reactive<Partial<Material>>({
	name: '',
	description: '',
	category_id: null,
	material_type_id: null,
	unit_of_measure_id: null,
	current_stock: 0,
	min_stock: 0,
	max_stock: 0,
	safety_stock: 0,
	reorder_point: 0,
	avg_unit_cost: 0,
	last_purchase_price: 0,
	currency_id: null,
	grammage: 0,
	width: 0,
	length: 0,
	color: '',
});
const fetchSelects = async () => {
	const [categoriesAll, materialTypesAll, unitsOfMeasureAll, currenciesAll] = await Promise.all([
		materialCategoryService.getAll(),
		materialTypeService.getAll(),
		unitsOfMeasureService.getAll(),
		catalogsService.getCurrencies(),
	]);

	categories.value = categoriesAll;
	materialTypes.value = materialTypesAll;
	unitsOfMeasure.value = unitsOfMeasureAll;
	currencies.value = currenciesAll;
};
const rules = {
	required: (v: any) => !!v || 'Campo requerido',
	numeric: (v: any) => !isNaN(Number(v)) || 'Debe ser numérico',
	nonNegative: (v: any) => Number(v ?? 0) >= 0 || 'Debe ser mayor o igual a cero',
};

const handleSubmit = async () => {
	if (!formRef.value?.validate()) return;
	loading.value = true;
	try {
		const payload = {
			...form,
			category_id: form.category_id ?? null,
			currency_id: form.currency_id ?? null,
			material_type_id: form.material_type_id ?? null,
			unit_of_measure_id: form.unit_of_measure_id ?? null,
			color: form.color || null,
		};

		const response = await materialService.create(payload);
		if (response.success) {
			Swal.fire({
				icon: 'success',
				title: 'Material creado',
				text: response.message || 'El registro se guardó correctamente',
				confirmButtonText: 'Aceptar',
			}).then(() => {
				router.push({ name: 'Materials' });
			});
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: response?.message || 'No se pudo crear el material',
				confirmButtonText: 'Aceptar',
			});
		}
	} catch (err: any) {
		console.error('Error guardando material:', err);
		if (err?.response?.status === 422) {
			errors.value = err.response.data?.errors || {};
			const msg = firstError(errors.value) || 'Errores de validación';
			showSwal({ icon: 'error', title: 'Validación', text: msg });
		} else {
			showSwal({ icon: 'error', title: 'Error', text: 'Error inesperado' });
		}
	} finally {
		loading.value = false;
	}
};

onMounted(async () => {
	await fetchSelects();
});

const goBack = () => router.push({ name: 'Materials' });
</script>

<style scoped>
.withbg {
	background: #fff;
}
</style>
