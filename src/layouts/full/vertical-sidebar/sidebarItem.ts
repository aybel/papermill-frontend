import {
  LayoutDashboardIcon,
  UsersIcon,
  PackageIcon,
  ClipboardTextIcon,
  FileTextIcon,
  TruckDeliveryIcon,
  ShieldCheckIcon,
  SettingsIcon,
  ReportAnalyticsIcon,
  PhoneIcon,
  ChartLineIcon,
  CurrencyDollarIcon,
  TagIcon,
  CircleCheckIcon,
  PointIcon,
  CalendarIcon,
  BuildingStoreIcon,
  MoneybagIcon,
} from "vue-tabler-icons";

import { PERMISSIONS } from "@/config/permissions";

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipColor?: string;
  chipBgColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  permission?: string;
  external?: boolean;
}

const sidebarItem: menu[] = [
  { header: "Principal" },
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    to: "/home",
    external: false,
    permission: PERMISSIONS.VIEW_DASHBOARD,
  },

  { header: "Gestión de Proveedores" },
  {
    title: "Proveedores",
    icon: UsersIcon,
    to: "/suppliers",
    external: false,
    permission: PERMISSIONS.VIEW_SUPPLIERS,
  },
  {
    title: "Contactos",
    icon: PhoneIcon,
    to: "/supplier-contacts",
    external: false,
    permission: PERMISSIONS.VIEW_SUPPLIER_CONTACTS,
  },
  {
    title: "Desempeño",
    icon: ChartLineIcon,
    to: "/supplier-performance",
    external: false,
    permission: PERMISSIONS.VIEW_SUPPLIER_PERFORMANCE,
  },

  {
    header: "Gestión de Presupuestos",
  },
  {
    title: "Rubros presupuestarios",
    icon: MoneybagIcon,
    to: "/budget-categories",
    external: false,
    permission: PERMISSIONS.VIEW_BUDGET_CATEGORIES,
  },
  {
    title: "Asignación presupuestaria",
    icon: BuildingStoreIcon,
    to: "/budget-assignments",
    external: false,
    permission: PERMISSIONS.VIEW_BUDGET_ASSIGNMENTS,
  },
  {
    title: "Calendarización presupuestaria",
    icon: CalendarIcon,
    to: "/budget-scheduling",
    external: false,
    permission: PERMISSIONS.VIEW_BUDGET_REQUESTS,
  },
  {
    title: "Autorización presupuestaria",
    icon: ReportAnalyticsIcon,
    to: "/WorkInProgress",
    external: false,
    permission: PERMISSIONS.VIEW_BUDGET_AUTHORIZATIONS,
  },
  {
    title: "Mi presupuesto",
    icon: CalendarIcon,
    to: "/WorkInProgress",
    external: false,
    permission: PERMISSIONS.VIEW_BUDGET_REQUESTS,
  },

  { header: "Gestión de Materiales" },
  {
    title: "Materiales",
    icon: PackageIcon,
    to: "/materials",
    external: false,
    permission: PERMISSIONS.VIEW_MATERIALS,
  },
  {
    title: "Categorías",
    icon: TagIcon,
    to: "/WorkInProgress",
    external: false,
    permission: PERMISSIONS.VIEW_MATERIAL_CATEGORIES,
  },

  { header: "Procesos de Compra" },
  {
    title: "Requisiciones",
    icon: ClipboardTextIcon,
    to: "/WorkInProgress",
    external: false,
    permission: PERMISSIONS.VIEW_REQUISITIONS,
  },
  {
    title: "Órdenes de Compra",
    icon: FileTextIcon,
    to: "/WorkInProgress",
    external: false,
    permission: PERMISSIONS.VIEW_PURCHASE_PROCESSES,
  },
  {
    title: "Recepciones",
    icon: TruckDeliveryIcon,
    to: "/WorkInProgress",
    external: false,
    permission: PERMISSIONS.VIEW_PURCHASE_PROCESSES,
  },
  {
    title: "Inspecciones de Calidad",
    icon: ShieldCheckIcon,
    to: "/WorkInProgress",
    external: false,
    permission: PERMISSIONS.VIEW_PURCHASE_PROCESSES,
  },

  { header: "Catálogos" },
  {
    title: "Configuración",
    icon: SettingsIcon,
    to: "#",
    external: false,
    permission: PERMISSIONS.VIEW_CATALOGS,
    children: [
      {
        title: "Monedas",
        icon: CurrencyDollarIcon,
        to: "/WorkInProgress",
        external: false,
        permission: PERMISSIONS.VIEW_CURRENCIES,
      },
      {
        title: "Términos de Pago",
        icon: ChartLineIcon,
        to: "/WorkInProgress",
        external: false,
        permission: PERMISSIONS.VIEW_CURRENCIES,
      },
      // {
      //   title: "Tipos de Proveedor",
      //   icon: TagIcon,
      //   to: "/WorkInProgress",
      //   external: false,
      //   permission: PERMISSIONS.VIEW_SUPPLIER_TYPES,
      // },
      // {
      //   title: "Estados de Proveedor",
      //   icon: CircleCheckIcon,
      //   to: "/WorkInProgress",
      //   external: false,
      //   permission: PERMISSIONS.VIEW_SUPPLIER_STATUSES,
      // },
    ],
  },

  { header: "Reportes" },
  {
    title: "Reportes",
    icon: ReportAnalyticsIcon,
    to: "#",
    external: false,
    permission: PERMISSIONS.VIEW_REPORTS,
    children: [
      {
        title: "Proveedores",
        icon: PointIcon,
        to: "/WorkInProgress",
        external: false,
        permission: PERMISSIONS.VIEW_REPORTS,
      },
      {
        title: "Compras",
        icon: PointIcon,
        to: "/WorkInProgress",
        external: false,
        permission: PERMISSIONS.VIEW_REPORTS,
      },
      {
        title: "Inventario",
        icon: PointIcon,
        to: "/WorkInProgress",
        external: false,
        permission: PERMISSIONS.VIEW_REPORTS,
      },
    ],
  },
  {
    header: "Usuarios",
  },
  {
    title: "Gestión de Usuarios",
    icon: UsersIcon,
    to: "#",
    external: false,
    permission: PERMISSIONS.VIEW_USERS,
    children: [
      {
        title: "Roles",
        icon: ShieldCheckIcon,
        to: "/WorkInProgress",
        external: false,
        permission: PERMISSIONS.VIEW_ROLES,
      },
      {
        title: "Usuarios",
        icon: UsersIcon,
        to: "/users",
        external: false,
        permission: PERMISSIONS.VIEW_USERS,
      },
    ],
  },
];

export default sidebarItem;
