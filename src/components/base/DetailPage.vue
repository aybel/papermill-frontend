<template>
  <div class="detail-page">
    <header class="detail-page__header">
      <div class="detail-page__titles">
        <div v-if="overline" class="text-overline text-medium-emphasis mb-1">
          {{ overline }}
        </div>
        <div class="text-h5">{{ title }}</div>
        <div v-if="subtitle" class="text-body-2 text-medium-emphasis">
          {{ subtitle }}
        </div>
      </div>
      <div class="detail-page__actions">
        <slot name="header-actions" />
      </div>
    </header>

    <section class="detail-page__content">
      <div class="detail-page__main">
        <slot />
      </div>
      <aside v-if="$slots.sidebar" class="detail-page__sidebar">
        <slot name="sidebar" />
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  overline: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-page__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.detail-page__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.detail-page__content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;
}

.detail-page__main {
  width: 100%;
}

.detail-page__sidebar {
  width: 100%;
}

@media (min-width: 1080px) {
  .detail-page__content {
    grid-template-columns: minmax(0, 1fr) 320px;
  }

  .detail-page__sidebar {
    position: sticky;
    top: 84px;
  }
}
</style>
