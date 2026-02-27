<template>
	<v-card elevation="10" class="withbg">
		<v-card-title class="text-h5">Nuevo Proveedor</v-card-title>
		<v-card-text>
			<v-form @submit.prevent="handleSubmit" ref="formRef" v-model="formValid">
				<v-row>
					<v-col cols="12" md="6">
						<v-text-field v-model="form.name" label="Nombre" :rules="[rules.required]" required />
					</v-col>
					<v-col cols="12" md="6">
						<v-text-field v-model="form.tax_id" label="RFC" :rules="[rules.required]" required />
					</v-col>
					<v-col cols="12" md="6">
						<v-select v-model="form.supplier_type_id as any" :items="supplierTypes" item-title="name"
							item-value="id" label="Tipo de Proveedor" :rules="[rules.required]" required />
					</v-col>
					<v-col cols="12" md="6">
						<v-select v-model="form.supplier_status_id as any" :items="supplierStatuses" item-title="name"
							item-value="id" label="Estado" :rules="[rules.required]" required />
					</v-col>
					<v-col cols="12" md="6">
						<v-select v-model="form.payment_terms_id as any" :items="paymentTerms" item-title="name"
							item-value="id" label="Términos de Pago" :rules="[rules.required]" required />
					</v-col>
					<v-col cols="12" md="6">
						<v-select v-model="form.currency_id as any" :items="currencies" item-title="name"
							item-value="id" label="Moneda" :rules="[rules.required]" required />
					</v-col>
					<v-col cols="12" md="6">
						<v-text-field v-model.number="form.credit_limit" label="Límite de Crédito" type="number"
							:rules="[rules.required, rules.numeric, rules.greaterThanZero]" required />
					</v-col>
					<!-- Campos de calidad y entrega removidos -->
					<v-col cols="12" md="6">
						<v-switch v-model="form.active" label="Activo" :color="form.active ? 'success' : 'error'" />
					</v-col>
					<v-col cols="12">
						<v-textarea v-model="form.notes" label="Notas" rows="2" />
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
import { ref, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { supplierService } from '@/services/supplierService';
import { catalogsService } from '@/services/catalogsService';
import { firstError } from '@/utils/errors';
import { showSwal } from '@/utils/alerts';

const router = useRouter();
const loading = ref(false);
const formValid = ref(true);
const formRef = ref();

const form = reactive({
	name: '',
	tax_id: '',
	supplier_type_id: null as number | null | undefined,
	supplier_status_id: null as number | null | undefined,
	payment_terms_id: null as number | null | undefined,
	currency_id: null as number | null | undefined,
	credit_limit: 0,
	notes: '',
	active: true,
});

const supplierTypes = ref([]);
const supplierStatuses = ref([]);
const paymentTerms = ref([]);
const currencies = ref([]);
const errors = ref<Record<string, string[]>>({});
const rules = {
	required: (v: any) => !!v || 'Campo requerido',
	numeric: (v: any) => !isNaN(Number(v)) || 'Debe ser numérico',
	score: (v: any) => (v === null || v === '' || (v >= 0 && v <= 100)) || 'Debe estar entre 0 y 100',
	greaterThanZero: (v: any) => (v > 0) || 'Debe ser mayor a cero',
	codeLength: (v: string) =>
		(typeof v === 'string' && v.length >= 1 && v.length <= 20) ||
		'Debe tener entre 1 y 20 caracteres',
};

const fetchCatalogs = async () => {
	const [types, statuses, terms, currs] = await Promise.all([
		catalogsService.getSupplierTypes(),
		catalogsService.getSupplierStatuses(),
		catalogsService.getPaymentTerms(),
		catalogsService.getCurrencies(),
	]);
	supplierTypes.value = types;
	supplierStatuses.value = statuses;
	paymentTerms.value = terms;
	currencies.value = currs;
	console.log('fetchCatalogs currencies:', currs);
};

const handleSubmit = async () => {
	if (!formRef.value?.validate()) return;
	loading.value = true;
	errors.value = {};
	try {
		// Convertir undefined a null para los campos *_id si el backend lo requiere
		const payload = {
			...form,
			supplier_type_id: form.supplier_type_id ?? null,
			supplier_status_id: form.supplier_status_id ?? null,
			payment_terms_id: form.payment_terms_id ?? null,
			currency_id: form.currency_id ?? null
		};

		const response = await supplierService.create(payload);
		console.log(response);

		if (response.success) {
			Swal.fire({
				icon: 'success',
				title: 'Proveedor creado',
				text: response.message || 'El registro se guardó correctamente',
				confirmButtonText: 'Aceptar',
			}).then(() => {
				router.push({ name: 'Suppliers' });
			});
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: response?.message || 'No se pudo crear el proveedor',
				confirmButtonText: 'Aceptar',
			});
		}
	} catch (err: any) {
		console.error('Error guardando contacto:', err);
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

const goBack = () => router.push({ name: 'Suppliers' });

onMounted(async () => {
	await fetchCatalogs();
	console.log('Currencies:', currencies.value);
});
</script>

<style scoped>
.withbg {
	background: #fff;
}
</style>
