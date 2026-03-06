import { defineStore } from "pinia";
import { ref, computed } from "vue";
import sidebarItem, {
  type menu,
} from "@/layouts/full/vertical-sidebar/sidebarItem";
import { useAuthStore } from "./authStore";

export const useSidebarStore = defineStore("sidebar", () => {
  // Estado: el menú completo sin filtrar
  const menuItems = ref<menu[]>(sidebarItem);

  // Getter: devuelve el menú filtrado según los permisos del usuario
  const filteredMenu = computed(() => {
    const authStore = useAuthStore();
    
    console.log('=== INICIO FILTRADO DE MENÚ ===');
    console.log('Estado completo authStore:', {
      isAuthenticated: authStore.isAuthenticated,
      token: authStore.token ? 'presente' : 'ausente',
      user: authStore.user,
      roles: authStore.roles,
      permissions: authStore.permissions,
    });
    console.log('LocalStorage permissions:', localStorage.getItem('permissions'));
    console.log('LocalStorage roles:', localStorage.getItem('roles'));
    console.log('Permisos del usuario:', authStore.permissions);
    console.log('Usuario autenticado:', authStore.isAuthenticated);

    // Función recursiva para filtrar los elementos del menú y sus hijos
    const filter = (items: menu[], level = 0): menu[] => {
      const indent = '  '.repeat(level);
      console.log(`${indent}Filtrando ${items.length} items en nivel ${level}`);
      
      return items
        .map((item) => ({ ...item })) // Crear una copia del objeto para evitar mutaciones
        .filter((item) => {
          console.log(`${indent}📋 Procesando: "${item.title || item.header}"`);
          console.log(`${indent}   - Permiso requerido: ${item.permission || 'ninguno (público)'}`);
          
          // Si el elemento tiene hijos, filtramos también a los hijos (creando copias)
          if (item.children) {
            console.log(`${indent}   - Tiene hijos, filtrando recursivamente...`);
            item.children = filter(item.children, level + 1);
            console.log(`${indent}   - Hijos después de filtrar: ${item.children.length}`);
          }

          // Un elemento es visible si:
          const noRequierePermiso = !item.permission;
          const tienePermiso = item.permission ? authStore.hasPermission(item.permission) : false;
          const esHeader = !!item.header;
          const tieneHijosVisibles = item.children && item.children.length > 0;
          
          console.log(`${indent}   - No requiere permiso: ${noRequierePermiso}`);
          console.log(`${indent}   - Tiene permiso: ${tienePermiso}`);
          console.log(`${indent}   - Es header: ${esHeader}`);
          console.log(`${indent}   - Tiene hijos visibles: ${tieneHijosVisibles}`);
          
          const esVisible = noRequierePermiso || tienePermiso || esHeader || tieneHijosVisibles;
          console.log(`${indent}   ✅ Visible: ${esVisible}`);
          
          return esVisible;
        })
        .filter((item, index, arr) => {
          // Elimina encabezados que no tienen elementos visibles después de ellos
          if (item.header) {
            const nextItem = arr[index + 1];
            const mantenerHeader = nextItem && !nextItem.header;
            console.log(`${indent}🏷️  Header "${item.header}" - Mantener: ${mantenerHeader}`);
            return mantenerHeader;
          }
          return true;
        });
    };

    const resultado = filter([...menuItems.value]);
    console.log('=== FIN FILTRADO DE MENÚ ===');
    console.log('Items finales visibles:', resultado.length);
    console.log('Items:', resultado.map(i => i.title || i.header));
    
    return resultado;
  });

  return {
    filteredMenu,
  };
});
