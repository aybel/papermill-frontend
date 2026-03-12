// stores/sidebarStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { menuService } from '@/services/menuService';
import { useMenuAdapter } from '@/composables/useMenuAdapter';
import type { SemanticMenuItem } from '@/config/menu';

export const useSidebarStore = defineStore('sidebar', () => {
    const semanticMenu = ref<SemanticMenuItem[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { adaptMenu } = useMenuAdapter();

    const filteredMenu = computed(() => {
        if (!semanticMenu.value.length) return [];
        return adaptMenu(semanticMenu.value);
    });

    async function loadMenu(force = false) {
        if (!force && semanticMenu.value.length) return;
        
        loading.value = true;
        error.value = null;
        
        try {
            const response = await menuService.getUserMenu();
            semanticMenu.value = response.menu;
            
            console.log('✅ Menú semántico cargado:', semanticMenu.value.length, 'items');
        } catch (err) {
            error.value = 'Error al cargar el menú';
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    // Limpiar menú (útil para logout)
    function clearMenu() {
        semanticMenu.value = [];
        menuService.clearCache();
    }

    return {
        filteredMenu,
        semanticMenu,
        loading,
        error,
        loadMenu,
        clearMenu
    };
});