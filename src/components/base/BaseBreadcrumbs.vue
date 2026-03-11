<template>
  <v-breadcrumbs :items="items" divider="/" class="px-0 py-0 text-body-2">
    <template #title="{ item }">
      <router-link
        v-if="item.to && !item.disabled"
        :to="item.to"
        class="base-breadcrumbs__link"
      >
        {{ item.title }}
      </router-link>
      <span v-else class="base-breadcrumbs__current">
        {{ item.title }}
      </span>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

export type BreadcrumbItem = {
  title: string;
  to?: RouteLocationRaw;
  disabled?: boolean;
};

defineProps({
  items: {
    type: Array as PropType<BreadcrumbItem[]>,
    default: () => [],
  },
});
</script>

<style scoped>
.base-breadcrumbs__link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.base-breadcrumbs__link:hover {
  text-decoration: underline;
}

.base-breadcrumbs__current {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}
</style>
