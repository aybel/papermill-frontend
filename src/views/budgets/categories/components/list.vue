<template>
    <v-data-table
        :headers="headers"
        :items="categories"
        :search="search"
        class="elevation-1"
        :loading="loading"
        loading-text="Cargando... por favor espere"
    >
        <template v-slot:top>
            <v-text-field
                v-model="search"
                label="Buscar rubro"
                class="mx-4"
            ></v-text-field>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="$emit('edit', item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="$emit('delete', item)"
            >
                mdi-delete
            </v-icon>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
    categories: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: true
    }
});

defineEmits(['edit', 'delete']);

const search = ref('');

const headers = ref([
    { title: 'Nombre', key: 'name' },
    { title: 'Descripción', key: 'description' },
    { title: 'Acciones', key: 'actions', sortable: false },
]);
</script>
