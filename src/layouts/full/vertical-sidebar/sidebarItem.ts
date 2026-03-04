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
  external?: boolean;
}

const sidebarItem: menu[] = [
  { header: "Principal" },
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    to: "/home",
    external: false,
  },

  { header: "Gestión de Proveedores" },
  {
    title: "Proveedores",
    icon: UsersIcon,
    to: "/suppliers",
    external: false,
  },
  {
    title: "Contactos",
    icon: PhoneIcon,
    to: "/supplier-contacts",
    external: false,
  },
  {
    title: "Desempeño",
    icon: ChartLineIcon,
    to: "/supplier-performance",
    external: false,
  },

  { header: "Gestión de Presupuestos" },
  {
    title: "Rubros presupuestarios",
    icon: MoneybagIcon,
    to: "/budget-categories",
    external: false,
  },
  {
    title: "Asignación presupuestaria",
    icon: BuildingStoreIcon,
    to: "/WorkInProgress",
    external: false,
  },
  {
    title: "Calendarización presupuestaria",
    icon: CalendarIcon,
    to: "/WorkInProgress",
    external: false,
  },
  {
    title: "Autorización presupuestaria",
    icon: ReportAnalyticsIcon,
    to: "/WorkInProgress",
    external: false,
  },
  {
    title: "Mi presupuesto",
    icon: CalendarIcon,
    to: "/WorkInProgress",
    external: false,
  },

  { header: "Gestión de Materiales" },
  {
    title: "Materiales",
    icon: PackageIcon,
    to: "/materials",
    external: false,
  },
  {
    title: "Categorías",
    icon: TagIcon,
    to: "/WorkInProgress",
    external: false,
  },

  { header: "Procesos de Compra" },
  {
    title: "Requisiciones",
    icon: ClipboardTextIcon,
    to: "/WorkInProgress",
    external: false,
  },
  {
    title: "Órdenes de Compra",
    icon: FileTextIcon,
    to: "/WorkInProgress",
    external: false,
  },
  {
    title: "Recepciones",
    icon: TruckDeliveryIcon,
    to: "/WorkInProgress",
    external: false,
  },
  {
    title: "Inspecciones de Calidad",
    icon: ShieldCheckIcon,
    to: "/WorkInProgress",
    external: false,
  },

  { header: "Catálogos" },
  {
    title: "Configuración",
    icon: SettingsIcon,
    to: "#",
    children: [
      {
        title: "Monedas",
        icon: CurrencyDollarIcon,
        to: "/WorkInProgress",
        external: false,
      },
      {
        title: "Términos de Pago",
        icon: ChartLineIcon,
        to: "/WorkInProgress",
        external: false,
      },
      {
        title: "Tipos de Proveedor",
        icon: TagIcon,
        to: "/WorkInProgress",
        external: false,
      },
      {
        title: "Estados de Proveedor",
        icon: CircleCheckIcon,
        to: "/WorkInProgress",
        external: false,
      },
    ],
  },

  { header: "Reportes" },
  {
    title: "Reportes",
    icon: ReportAnalyticsIcon,
    to: "#",
    children: [
      {
        title: "Proveedores",
        icon: PointIcon,
        to: "/WorkInProgress",
        external: false,
      },
      {
        title: "Compras",
        icon: PointIcon,
        to: "/WorkInProgress",
        external: false,
      },
      {
        title: "Inventario",
        icon: PointIcon,
        to: "/WorkInProgress",
        external: false,
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
    children: [
      {
        title: "Autorizar Usuarios",
        icon: UsersIcon,
        to: "/WorkInProgress",
        external: false,
      },
      {
        title: "Roles",
        icon: ShieldCheckIcon,
        to: "/WorkInProgress",
        external: false,
      },
    ],
  },
];

export default sidebarItem;
