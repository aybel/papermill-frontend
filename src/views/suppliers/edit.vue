<template>
  <v-card elevation="10" class="withbg">
    <v-card-title class="text-h5">Editar Proveedor</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit" ref="formRef" v-model="formValid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.code" label="Código" :rules="[rules.required, rules.codeLength]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.name" label="Nombre" :rules="[rules.required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.tax_id" label="RFC" :rules="[rules.required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="form.supplier_type_id" :items="supplierTypes" item-title="name" item-value="id" label="Tipo de Proveedor" :rules="[rules.required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="form.supplier_status_id" :items="supplierStatuses" item-title="name" item-value="id" label="Estado" :rules="[rules.required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="form.payment_terms_id" :items="paymentTerms" item-title="name" item-value="id" label="Términos de Pago" :rules="[rules.required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="form.currency_id" :items="currencies" item-title="name" item-value="id" label="Moneda" :rules="[rules.required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.number="form.credit_limit" label="Límite de Crédito" type="number" :rules="[rules.required, rules.numeric, rules.greaterThanZero]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-switch v-model="form.active" label="Activo" :color="form.active ? 'success' : 'error'" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="form.notes" label="Notas" rows="2" />
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col cols="12" class="text-right">
            <v-btn color="primary" type="submit" :loading="loading">Guardar Cambios</v-btn>
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
import { useRouter, useRoute } from 'vue-router';
import { supplierService } from '@/services/supplierService';
import { catalogsService } from '@/services/catalogsService';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const formValid = ref(true);
const formRef = ref();

const form = reactive({
  code: '',
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

const rules = {
  required: (v: any) => !!v || 'Campo requerido',
  numeric: (v: any) => !isNaN(Number(v)) || 'Debe ser numérico',
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
};

const fetchSupplier = async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id);
    const data = await supplierService.getById(id);
    Object.assign(form, data);
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el proveedor',
      confirmButtonText: 'Aceptar',
    });
    goBack();
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!formRef.value?.validate()) return;
  loading.value = true;
  try {
    const id = Number(route.params.id);
    const payload = {
      ...form,
      supplier_type_id: form.supplier_type_id ?? null,
      supplier_status_id: form.supplier_status_id ?? null,
      payment_terms_id: form.payment_terms_id ?? null,
      currency_id: form.currency_id ?? null,
    };
    const response = await supplierService.update(id, payload);
    Swal.fire({
      icon: 'success',
      title: 'Proveedor actualizado',
      text: 'El registro se actualizó correctamente',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      router.push({ name: 'Suppliers' });
    });
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el proveedor',
      confirmButtonText: 'Aceptar',
    });
  } finally {
    loading.value = false;
  }
};

const goBack = () => router.push({ name: 'Suppliers' });

onMounted(async () => {
  await fetchCatalogs();
  await fetchSupplier();
});
</script>

<style scoped>
.withbg {
  background: #fff;
}
</style>