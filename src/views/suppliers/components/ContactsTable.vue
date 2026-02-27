<template>
    <v-data-table :headers="headers" :items="contacts" class="mb-6 contacts-table"
        no-data-text="No hay contactos registrados" density="compact" :items-per-page="5">
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
        <template v-slot:item.notes="{ item }">
            <v-tooltip v-if="item.notes" location="top">
                <template #activator="{ props }">
                    <span v-bind="props">{{ truncate(item.notes, 30) }}</span>
                </template>
                <span>{{ item.notes }}</span>
            </v-tooltip>
            <span v-else>-</span>
        </template>
        <template v-slot:item.actions="{ item, index }">
            <v-btn icon size="small" variant="text" color="primary" @click="$emit('edit', item)">
                <PencilIcon size="20" />
            </v-btn>
            <v-btn icon size="small" variant="text" color="error" @click="$emit('delete', item)">
                <TrashIcon size="20" />
            </v-btn>
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

const truncate = (text: string, max = 30) => {
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max)}...` : text;
};

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

<style scoped>
.contacts-table :global(table) {
    table-layout: fixed;
}

.contacts-table :global(th),
.contacts-table :global(td) {
    white-space: normal;
    word-break: break-word;
}

.contacts-table :global(.v-data-table__wrapper) {
    overflow-x: visible;
}
</style>
