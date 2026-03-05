<template>
  <v-dialog v-model="localValue" :max-width="maxWidth" :persistent="persistent">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-start py-4 px-4">
        <div>
          <div class="text-h6">{{ title }}</div>
          <div v-if="subtitle" class="text-body-2 text-medium-emphasis">{{ subtitle }}</div>
        </div>
        <v-btn icon variant="text" density="comfortable" @click="handleCancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-0 px-4 pb-2">
        <slot />
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end px-4 py-3">
        <slot name="actions">
          <v-btn variant="text" :disabled="loading" @click="handleCancel">
            {{ cancelLabel }}
          </v-btn>
          <v-btn color="primary" :loading="loading" @click="handleSubmit">
            {{ submitLabel }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  submitLabel: {
    type: String,
    default: "Guardar",
  },
  cancelLabel: {
    type: String,
    default: "Cancelar",
  },
  maxWidth: {
    type: [Number, String],
    default: 560,
  },
  persistent: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "submit", "cancel"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

function handleCancel() {
  emit("cancel");
  emit("update:modelValue", false);
}

function handleSubmit() {
  emit("submit");
}
</script>
