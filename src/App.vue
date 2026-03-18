<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useSidebarStore } from './stores/sidebarStore';

const authStore = useAuthStore();
const sidebarStore = useSidebarStore();
onMounted(async () => {
    if (authStore.isAuthenticated) {
        //Carga el menú del sidebar solo si el usuario está autenticado
        await sidebarStore.loadMenu();
    }
});
</script>