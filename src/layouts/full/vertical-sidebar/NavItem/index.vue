<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Icon from '../Icon.vue';

const props = defineProps({ 
    item: { type: Object, required: true }, 
    level: { type: Number, default: 0 } 
});

const router = useRouter();
const route = useRoute();

// Ya que las rutas vienen congeladas del store, solo verificamos
const absolutePath = computed(() => {
    const to = props.item?.to;
    if (!to || to === '#' || to === '') return null;
    
    // Si ya es absoluta (viene del store congelado), confiar en ella
    if (typeof to === 'string' && to.startsWith('/')) {
        return to;
    }
    
    // Para URLs externas
    if (typeof to === 'string' && (to.startsWith('http://') || to.startsWith('https://'))) {
        return to;
    }
    
    return null;
});

const isActive = computed(() => {
    if (!absolutePath.value) return false;
    
    const currentPath = route.path;
    const itemPath = absolutePath.value;
    
    return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
});

const handleClick = (e) => {
    e.preventDefault();
    if (!absolutePath.value) return;
    
    router.push(absolutePath.value).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
            console.error('Navigation error:', err);
        }
    });
};
</script>

<template>
    <v-list-item 
        v-if="item.external" 
        :href="item.to" 
        target="_blank" 
        :disabled="item.disabled" 
        rounded 
        class="mb-1"
        color="primary"
    >
        <template v-slot:prepend>
            <Icon :item="item.icon" :level="level" />
        </template>
        <v-list-item-title class="wrap-text">{{ item.title }}</v-list-item-title>
    </v-list-item>
    
    <v-list-item 
        v-else
        :active="isActive" 
        :disabled="item.disabled"
        @click.prevent="handleClick"
        rounded 
        class="mb-1" 
        color="primary"
        link
    >
        <template v-slot:prepend>
            <Icon :item="item.icon" :level="level" />
        </template>
        <v-list-item-title class="wrap-text">
            {{ item.title }}
        </v-list-item-title>
    </v-list-item>
</template>