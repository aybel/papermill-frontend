<template>
    <v-data-table :headers="headers" :items="contacts" class="mb-6" no-data-text="No hay contactos registrados"
        density="compact" :items-per-page="5">
        <template v-slot:item.is_primary="{ item }">
            <v-chip :color="item.is_primary ? 'primary' : 'default'" size="small">
                {{ item.is_primary ? 'Principal' : '' }}
            </v-chip>
        </template>
        <template v-slot:item.is_active="{ item }">
            <v-chip :color="item.is_active ? 'success' : 'default'" size="small">
                {{ item.is_active ? 'Activo' : 'Inactivo' }}
            </v-chip>
        </template>
        <template v-slot:item.actions="{ item, index }">
            <v-btn icon size="small" color="primary" @click="$emit('edit', index)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon size="small" color="error" @click="$emit('delete', index)"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    contacts: {
        type: Array,
        default: () => []
    }
});

const headers = [
    { title: 'Nombre', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Teléfono', key: 'phone' },
    { title: 'Celular', key: 'mobile' },
    { title: 'Cargo', key: 'position' },
    { title: 'Departamento', key: 'department' },
    { title: 'Principal', key: 'is_primary', align: 'center' },
    { title: 'Activo', key: 'is_active', align: 'center' },
    { title: 'Notas', key: 'notes' },
    { title: 'Acciones', key: 'actions', align: 'center', sortable: false }
];

defineEmits(['edit', 'delete']);
</script>
