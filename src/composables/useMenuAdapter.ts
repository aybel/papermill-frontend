import { iconMap } from "@/config/icon-mapping";
import type { SemanticMenuItem } from "@/config/menu";

export function useMenuAdapter() {
  const normalizeRoute = (route?: string): string => {
    if (!route || route === "#") {
      return "#";
    }

    const normalized = route.trim();

    // URLs externas o rutas ya absolutas se mantienen.
    if (/^(https?:)?\/\//.test(normalized) || normalized.startsWith("/")) {
      return normalized;
    }
    const finalRoute = `/${normalized}`;
    console.log("[MenuAdapter] Ruta normalizada a:", finalRoute);
    return finalRoute
  };

  // Adapta el menú semántico al formato de la plantilla actual
  const adaptMenuItem = (item: SemanticMenuItem): any => {
    const adapted: any = {};

    switch (item.type) {
      case "header":
        adapted.header = item.name;
        break;

      case "module":
      case "group":
      case "link":
        adapted.title = item.name;
        adapted.to = normalizeRoute(item.route);

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
    adaptMenu,
  };
}
