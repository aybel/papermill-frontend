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
            <v-btn color="primary" type="submit">{{ editIndex === null ? 'Guardar contacto' : 'Actualizar contacto' }}</v-btn>
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
import { ref, reactive } from 'vue';
import ContactsTable from './ContactsTable.vue';

const emit = defineEmits(['save', 'cancel']);
const props = defineProps({
  contactData: {
    type: Object,
    default: () => ({})
  },
  contacts: {
    type: Array,
    default: () => []
  }
});

const contactFormRef = ref();
const formValid = ref(true);

const contacts = ref([...props.contacts]);
const editIndex = ref<number|null>(null);

const contact = reactive({
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

function handleSubmit() {
  if (!contactFormRef.value?.validate()) return;
  if (editIndex.value === null) {
    contacts.value.push({ ...contact });
  } else {
    contacts.value[editIndex.value] = { ...contact };
  }
  emit('save', contacts.value);
  resetForm();
}

function editContact(index: number) {
  Object.assign(contact, contacts.value[index]);
  editIndex.value = index;
}

function deleteContact(index: number) {
  contacts.value.splice(index, 1);
  emit('save', contacts.value);
  resetForm();
}

function resetForm() {
  Object.assign(contact, {
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
