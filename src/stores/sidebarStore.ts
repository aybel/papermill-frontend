// stores/sidebarStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { menuService } from '@/services/menuService';
import { useMenuAdapter } from '@/composables/useMenuAdapter';
import type { SemanticMenuItem } from '@/config/menu';
import { showSwal } from '@/utils/alerts';

export const useSidebarStore = defineStore('sidebar', () => {
    const semanticMenu = ref<SemanticMenuItem[]>([]);
    const adaptedMenu = ref<any[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const isMenuLoaded = ref(false);
    const { adaptMenu } = useMenuAdapter();

    // filteredMenu solo devuelve el menú adaptado, NO recalcula
    const filteredMenu = computed(() => {
        console.log('🔍 filteredMenu accedido:', adaptedMenu.value.length, 'items');
        return adaptedMenu.value;
    });

    async function loadMenu(force = false) {
        // Si ya está cargado y no se fuerza, retornar
        
        loading.value = true;
        error.value = null;
        
        try {
            const response = await menuService.getUserMenu();
            semanticMenu.value = response.menu;

            if (!semanticMenu.value || !semanticMenu.value.length) {
                error.value = 'No tiene permisos asignados al rol';
                await showSwal({
                    icon: 'warning',
                    title: 'Sin permisos',
                    text: 'No tiene permisos asignados al rol.'
                });
                adaptedMenu.value = [];
                isMenuLoaded.value = true;
                return;
            }
            
            // ADAPTAR EL MENÚ UNA SOLA VEZ
            const adapted = adaptMenu(semanticMenu.value);
            
            // CONGELAR para evitar mutaciones
            adaptedMenu.value = deepFreeze(adapted);
            isMenuLoaded.value = true;
            
        } catch (err) {
            error.value = 'Error al cargar el menú';
            console.error('❌ Store: Error:', err);
            adaptedMenu.value = [];
        } finally {
            loading.value = false;
        }
    }

    function deepFreeze(obj: any): any {
        if (obj === null || obj === undefined || typeof obj !== 'object') {
            return obj;
        }
        
        const frozen = Array.isArray(obj) 
            ? obj.map(item => deepFreeze(item))
            : Object.freeze(
                Object.keys(obj).reduce((acc: any, key) => {
                    acc[key] = deepFreeze(obj[key]);
                    return acc;
                }, {} as any)
              );
        
        return frozen;
    }

    function clearMenu() {
        semanticMenu.value = [];
        adaptedMenu.value = [];
        isMenuLoaded.value = false;
        menuService.clearCache();
    }

    return {
        filteredMenu,
        semanticMenu,
        adaptedMenu,
        loading,
        error,
        isMenuLoaded,
        loadMenu,
        clearMenu
    };
});