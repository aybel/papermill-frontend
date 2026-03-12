import { computed } from 'vue';
import { iconMap } from '@/config/icon-mapping';
import type { SemanticMenuItem } from '@/config/menu';

export function useMenuAdapter() {
    
    // Adapta el menú semántico al formato de la plantilla actual
    const adaptMenuItem = (item: SemanticMenuItem): any => {
        const adapted: any = {};

        switch (item.type) {
            case 'header':
                adapted.header = item.name;
                break;
                
            case 'module':
            case 'group':
            case 'link':
                adapted.title = item.name;
                adapted.to = item.route || '#';
                
                // Adaptar icono semántico
                if (item.icon && iconMap[item.icon as keyof typeof iconMap]) {
                    adapted.icon = iconMap[item.icon as keyof typeof iconMap];
                }
                
                // Adaptar hijos
                if (item.children?.length) {
                    adapted.children = item.children.map(adaptMenuItem);
                }
                break;
        }

        // Mantener metadata útil
        if (item.permission) {
            adapted.permission = item.permission;
        }

        return adapted;
    };

    const adaptMenu = (semanticMenu: SemanticMenuItem[]): any[] => {
        return semanticMenu.map(adaptMenuItem).filter(Boolean);
    };

    return {
        adaptMenu
    };
}