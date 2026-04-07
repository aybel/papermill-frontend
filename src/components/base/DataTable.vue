<template>
  <div class="base-data-table">
    <v-data-table
      :headers="headers"
      :items="items"
      :items-length="itemsLength"
      :loading="loading"
      :search="internalSearch"
      :page="page"
      :items-per-page="itemsPerPage"
      :sort-by="sortBy"
      :multi-sort="multiSort"
      :item-key="itemKey"
      :hide-default-footer="!showFooter"
      :density="dense ? 'compact' : 'default'"
      class="elevation-1"
      @update:page="emit('update:page', $event)"
      @update:items-per-page="emit('update:itemsPerPage', $event)"
      @update:sort-by="emit('update:sortBy', $event)"
      @click:row="emit('row:click', $event.item)"
    >
      <template v-slot:top>
        <slot name="top">
          <v-text-field
            v-if="!hideDefaultSearch"
            v-model="internalSearch"
            density="comfortable"
            variant="underlined"
            clearable
            hide-details
            label="Buscar"
            class="mx-4 my-2"
            @update:model-value="onSearch"
          />
        </slot>
      </template>

      <template v-slot:no-data>
        <slot name="empty">
          <div class="pa-6 text-medium-emphasis text-center">
            Sin resultados para mostrar
          </div>
        </slot>
      </template>

      <template v-slot:body.append="slotProps">
        <slot name="body.append" v-bind="slotProps" />
      </template>

      <template
        v-for="slotName in itemSlotNames"
        :key="slotName"
        v-slot:[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <template
        v-for="col in formattedColumns"
        :key="`fmt-${col.key}`"
        v-slot:[`item.${col.key}`]="{ item }"
      >
        <span class="d-flex justify-end font-weight-medium">$ {{ formatAmount(item[col.key]) }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue";
import type { PropType } from "vue";
import { formatAmount } from "@/utils/numberFormat";

export type BaseTableHeader = {
  title: string;
  key: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  width?: string | number;
  format?: "currency";
};

export type BaseSortItem = {
  key: string;
  order?: "asc" | "desc";
};

const props = defineProps({
  headers: {
    type: Array as PropType<BaseTableHeader[]>,
    required: true,
  },
  items: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  search: {
    type: String,
    default: "",
  },
  server: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  sortBy: {
    type: Array as PropType<BaseSortItem[]>,
    default: () => [],
  },
  multiSort: {
    type: Boolean,
    default: false,
  },
  itemKey: {
    type: String,
    default: "id",
  },
  dense: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  hideDefaultSearch: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "update:page", value: number): void;
  (e: "update:itemsPerPage", value: number): void;
  (e: "update:sortBy", value: BaseSortItem[]): void;
  (e: "row:click", value: Record<string, any>): void;
}>();

const internalSearch = ref(props.search);
watch(
  () => props.search,
  (value) => {
    internalSearch.value = value;
  }
);

const itemsLength = computed(() =>
  props.server ? props.totalItems : props.items.length
);

const slots = useSlots();
const itemSlotNames = computed(() =>
  Object.keys(slots).filter((name) => name.startsWith("item."))
);

const formattedColumns = computed(() =>
  props.headers.filter(
    (h) => h.format === "currency" && !slots[`item.${h.key}`]
  )
);

function onSearch(value: string) {
  emit("update:search", value);
}
</script>

<style scoped>
.base-data-table {
  width: 100%;
}
</style>
