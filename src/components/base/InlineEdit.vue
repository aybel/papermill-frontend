<template>
  <div class="inline-edit">
    <div
      v-if="!editing"
      class="inline-edit__display"
      :class="{ 'inline-edit__display--readonly': readonly }"
      @click="startEdit"
    >
      <slot name="display" :value="modelValue">
        <span v-if="!modelValue" class="text-medium-emphasis">{{ placeholder }}</span>
        <span v-else>{{ modelValue }}</span>
      </slot>
      <v-icon v-if="!readonly" size="small" class="inline-edit__icon">mdi-pencil</v-icon>
    </div>

    <div v-else class="inline-edit__form">
      <component
        :is="fieldComponent"
        v-model="internalValue"
        :type="type"
        :items="items"
        :rules="rules"
        :loading="loading"
        autofocus
        density="compact"
        hide-details="auto"
        class="flex-grow-1"
        @keyup.enter="handleSave"
        @keyup.esc="handleCancel"
      />
      <div class="inline-edit__actions">
        <v-btn
          icon
          color="primary"
          variant="text"
          :loading="loading"
          density="comfortable"
          @click="handleSave"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          density="comfortable"
          :disabled="loading"
          @click="handleCancel"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";

type RuleFunction = (value: any) => boolean | string;

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: "",
  },
  type: {
    type: String as PropType<"text" | "number" | "select" | "textarea">,
    default: "text",
  },
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  rules: {
    type: Array as PropType<RuleFunction[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Agregar valor",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "save", "cancel", "enter", "escape"]);

const editing = ref(false);
const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    internalValue.value = value;
  }
);

const fieldComponent = computed(() => {
  if (props.type === "select") return "v-select";
  if (props.type === "textarea") return "v-textarea";
  return "v-text-field";
});

function startEdit() {
  if (props.readonly) return;
  editing.value = true;
}

function handleCancel() {
  editing.value = false;
  internalValue.value = props.modelValue;
  emit("cancel");
  emit("escape");
}

function handleSave() {
  emit("update:modelValue", internalValue.value);
  emit("save", internalValue.value);
  emit("enter");
  editing.value = false;
}
</script>

<style scoped>
.inline-edit {
  display: flex;
  align-items: center;
  width: 100%;
}

.inline-edit__display {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  min-height: 34px;
  padding: 4px 0;
}

.inline-edit__display--readonly {
  cursor: default;
}

.inline-edit__icon {
  opacity: 0.6;
}

.inline-edit__form {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.inline-edit__actions {
  display: flex;
  gap: 4px;
}
</style>
