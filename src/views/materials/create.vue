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

					<v-col cols="12" md="4">
						<v-text-field v-model.number="form.category_id" label="Categoría (ID)" type="number" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model="form.material_type_id" label="Tipo de material" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model="form.unit_of_measure_id" label="Unidad de medida" />
					</v-col>

					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.current_stock" label="Stock actual" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.min_stock" label="Stock mínimo" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.max_stock" label="Stock máximo" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.safety_stock" label="Stock de seguridad" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>

					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.reorder_point" label="Punto de reorden" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.avg_unit_cost" label="Costo prom. unitario" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.last_purchase_price" label="Último precio de compra" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="3">
						<v-text-field v-model.number="form.currency_id" label="Moneda (ID)" type="number" />
					</v-col>

					<v-col cols="12" md="4">
						<v-text-field v-model.number="form.grammage" label="Gramaje" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model.number="form.width" label="Ancho" type="number" :rules="[rules.numeric, rules.nonNegative]" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model.number="form.length" label="Largo" type="number" :rules="[rules.numeric, rules.nonNegative]" />
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
import { reactive, ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { materialService, type Material } from '@/services/materialService';

const router = useRouter();
const loading = ref(false);
const formValid = ref(true);
const formRef = ref();

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
		if (response?.success || response) {
			Swal.fire({
				icon: 'success',
				title: 'Material creado',
				text: 'El registro se guardó correctamente',
				confirmButtonText: 'Aceptar',
			}).then(() => router.push({ name: 'Materials' }));
		}
	} catch (error: any) {
		const message = error?.response?.data?.message || 'No se pudo crear el material';
		Swal.fire({ icon: 'error', title: 'Error', text: message });
	} finally {
		loading.value = false;
	}
};

const goBack = () => router.push({ name: 'Materials' });
</script>

<style scoped>
.withbg {
	background: #fff;
}
</style>
