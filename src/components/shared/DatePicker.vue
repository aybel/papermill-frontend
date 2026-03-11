<template>
  <VueDatePicker
    v-bind="$attrs"
    v-model="modelValueProxy"
    :enable-time-picker="false"
    :format="formatDate"
    :input-class-name="inputClassName"
    :teleport="teleport"
    :auto-apply="autoApply"
    model-type="yyyy-MM-dd"
    :formats="{ input: 'dd-MM-yyyy' }"
    :week-start="1"
    :locale="es" 
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { es } from 'date-fns/locale';

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: '',
  },
  format: {
    type: String,
    default: 'dd-MM-yy',
  },
  enableTimePicker: {
    type: Boolean,
    default: false,
  },
  inputClassName: {
    type: String,
    default: 'v-input__control v-field__input v-field__input--variant-outlined',
  },
  teleport: {
    type: Boolean,
    default: true,
  },
  autoApply: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);

// No necesitamos crear una variable adicional, podemos usar 'es' directamente en el template

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>