// config/icon-mapping.ts
// Este es el ÚNICO archivo que cambiará si cambias de plantilla
import * as Icons from 'vue-tabler-icons';

// Mapeo semántico a componentes de iconos
export const iconMap = {
    dashboard: Icons.LayoutDashboardIcon,
    supplier: Icons.UsersIcon,
    material: Icons.PackageIcon,
    budget: Icons.MoneybagIcon,
    report: Icons.ReportAnalyticsIcon,
    user: Icons.UsersIcon,
    role: Icons.ShieldCheckIcon,
    settings: Icons.SettingsIcon,
    contact: Icons.PhoneIcon,
    chart: Icons.ChartLineIcon,
    currency: Icons.CurrencyDollarIcon,
    tag: Icons.TagIcon,
    check: Icons.CircleCheckIcon,
    point: Icons.PointIcon,
    calendar: Icons.CalendarIcon,
    building: Icons.BuildingStoreIcon,
    file: Icons.FileTextIcon,
    truck: Icons.TruckDeliveryIcon,
    clipboard: Icons.ClipboardTextIcon,
    default: Icons.PointIcon,
} as const;

export type SemanticIcon = keyof typeof iconMap;