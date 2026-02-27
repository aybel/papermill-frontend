<template>
  <v-card elevation="6" class="mb-4">
    <v-card-title class="text-h6">Contactos</v-card-title>
    <v-card-text>
      <!-- Formulario para agregar/editar contacto -->
      <v-form @submit.prevent="handleSubmit" ref="contactFormRef" v-model="formValid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="contact.name" label="Nombre completo" :rules="[rules.required]" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="contact.email" label="Email" type="email" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="contact.phone" label="Teléfono" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="contact.mobile" label="Celular" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="contact.position" label="Cargo o posición" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="contact.department" label="Departamento" />
          </v-col>
          <v-col cols="12" md="6">
            <v-switch v-model="contact.is_primary" label="Contacto principal" />
          </v-col>
          <v-col cols="12" md="6">
            <v-switch v-model="contact.is_active" label="Activo" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="contact.notes" label="Notas" rows="2" />
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="12" class="text-right">
            <v-btn color="primary" type="submit" :loading="saving">
              {{ editIndex === null ? 'Guardar contacto' : 'Actualizar contacto' }}
            </v-btn>
            <v-btn color="secondary" variant="text" @click="resetForm">Cancelar</v-btn>
          </v-col>
        </v-row>
      </v-form>
      <!-- Tabla de contactos guardados -->
      <ContactsTable :contacts="contacts" @edit="editContact" @delete="deleteContact" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import ContactsTable from './ContactsTable.vue';
import { supplierContactsService } from '@/services/supplierContactsService';
import { firstError } from '@/utils/errors';
import { showSwal } from '@/utils/alerts';

const emit = defineEmits(['save', 'cancel']);
const props = defineProps({
  contactData: {
    type: Object,
    default: () => ({})
  },
  contacts: {
    type: Array,
    default: () => []
  },
  supplierId: {
    type: Number,
    required: true
  }
});

const contactFormRef = ref();
const formValid = ref(true);
const errors = ref<Record<string, string[]>>({});

const contacts = ref([...props.contacts]);
const editIndex = ref<number | null>(null);
const saving = ref(false);

const contact = reactive({
  id: null as number | null,
  name: '',
  email: '',
  phone: '',
  mobile: '',
  position: '',
  department: '',
  is_primary: false,
  is_active: true,
  notes: '',
  ...props.contactData
});

const rules = {
  required: (v: any) => !!v || 'Campo requerido',
};

// Mantiene la tabla sincronizada con los contactos que llegan del padre
watch(
  () => props.contacts,
  (newContacts) => {
    contacts.value = mapFromApi(newContacts);
  },
  { immediate: true }
);

function mapFromApi(list: any[] = []) {
  return list.map((c: any) => ({
    ...c,
    is_primary: c.is_primary ?? (c.primary === 1 || c.primary === true),
    is_active: c.is_active ?? (c.active === 1 || c.active === true),
  }));
}

async function handleSubmit() {
  const validation = await contactFormRef.value?.validate();
  if (!validation?.valid) return;
  saving.value = true;
  errors.value = {};
  try {
    const payload = {
      supplier_id: props.supplierId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      mobile: contact.mobile,
      position: contact.position,
      department: contact.department,
      notes: contact.notes,
      primary: contact.is_primary ? 1 : 0,
      active: contact.is_active ? 1 : 0,
    };

    if (contact.id) {
      await supplierContactsService.update(contact.id, payload);
    } else {
      await supplierContactsService.create(payload);
    }

    const refreshed = await supplierContactsService.search({ supplier_id: props.supplierId, is_active: 1, order_by_: "is_primary desc" });
    contacts.value = mapFromApi(refreshed || []);
    emit('save', contacts.value);
    resetForm();
    showSwal({ icon: 'success', title: 'Contacto guardado', timer: 1200, showConfirmButton: false });
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
    saving.value = false;
  }
}

function editContact(index: number) {
  Object.assign(contact, contacts.value[index]);
  editIndex.value = index;
}

async function deleteContact(index: number) {
  const toDelete = contacts.value[index];
  if (!toDelete?.id) {
    contacts.value.splice(index, 1);
    emit('save', contacts.value);
    resetForm();
    return;
  }

  try {
    await supplierContactsService.delete(toDelete.id);
    const refreshed = await supplierContactsService.search({ supplier_id: props.supplierId, is_active: 1, order_by_: "is_primary desc" });
    contacts.value = mapFromApi(refreshed || []);
    emit('save', contacts.value);
    resetForm();
    showSwal({ icon: 'success', title: 'Contacto eliminado', timer: 1200, showConfirmButton: false });
  } catch (error) {
    console.error('Error eliminando contacto:', error);
    showSwal({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el contacto.' });
  }
}

function resetForm() {
  Object.assign(contact, {
    id: null,
    name: '',
    email: '',
    phone: '',
    mobile: '',
    position: '',
    department: '',
    is_primary: false,
    is_active: true,
    notes: ''
  });
  editIndex.value = null;
  contactFormRef.value?.resetValidation();
}
</script>

<style scoped>
:global(.swal-front) {
  z-index: 3000;
}

:global(.swal-front-container) {
  z-index: 3000 !important;
}
</style>
