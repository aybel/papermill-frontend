<template>
  <div class="form-page-actions">
    <v-btn
      variant="text"
      color="secondary"
      :disabled="loading"
      @click="handleBack"
    >
      {{ backLabel }}
    </v-btn>
    <v-btn
      color="primary"
      :loading="loading"
      @click="emit('save')"
    >
      {{ saveLabel }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

const props = defineProps({
  saveLabel: {
    type: String,
    default: "Guardar",
  },
  backLabel: {
    type: String,
    default: "Regresar",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  backTo: {
    type: [String, Object] as PropType<RouteLocationRaw | null>,
    default: null,
  },
});

const emit = defineEmits(["save", "back"]);
const router = useRouter();

function handleBack() {
  emit("back");
  if (props.backTo) {
    router.push(props.backTo);
    return;
  }
  router.back();
}
</script>

<style scoped>
.form-page-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}
</style>
