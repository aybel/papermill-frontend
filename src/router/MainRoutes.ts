const MainRoutes = {
  path: "/",
  meta: {
    requiresAuth: true,
  },
  //redirect: "/home",

  component: () => import("@/layouts/full/FullLayout.vue"),
  children: [
    {
      path: "/WorkInProgress",
      name: "WorkInProgress",
      component: () => import("@/views/pages/WorkInProgress.vue"),
    },
    {
      path: "home",
      name: "Home",
      component: () => import("@/views/Home.vue"),
    },

    // ==================== PROVEEDORES ====================
    {
      path: "suppliers",
      name: "Suppliers",
      component: () => import("@/views/suppliers/index.vue"),
    },
    {
      path: "suppliers/create",
      name: "CreateSupplier",
      component: () => import("@/views/suppliers/create.vue"),
    },
    {
      path: "suppliers/:id/edit",
      name: "EditSupplier",
      component: () => import("@/views/suppliers/edit.vue"),
    },
    {
      path: "suppliers/:id",
      name: "SupplierDetail",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "suppliers/:id",
      name: "ShowSupplier",
      component: () => import("@/views/suppliers/show.vue"),
    },

    // Contactos de proveedores
    {
      path: "supplier-contacts",
      name: "SupplierContacts",
      component: () => import("@/views/Home.vue"),
    },

    // Desempeño de proveedores
    {
      path: "supplier-performance",
      name: "SupplierPerformance",
      component: () => import("@/views/Home.vue"),
    },
    // ==================== PRESUPUESTO ====================
    {
      path: "budget-categories", //Rubros presupuestales
      name: "BudgetCategories",
      component: () => import("@/views/budgets/categories/index.vue"),
    },
    {
      path: "budget-assignments", //Asignación presupuestaria
      name: "BudgetAssignments",
      component: () => import("@/views/budgets/assignments/index.vue"),
    },
    {
      path: "budget-requests", //Solicitud presupuestaria
      name: "BudgetRequests",
      component: () => import("@/views/budgets/requests/index.vue"),
    },
    {
      path: "budget-requests/create", //Nueva solicitud de calendarización presupuestaria
      name: "BudgetRequestsCreate",
      component: () => import("@/views/budgets/requests/create.vue"),
    },
    {
      path: "budget-requests/edit/:id", //Editar solicitud de calendarización presupuestaria
      name: "BudgetRequestsEdit",
      component: () => import("@/views/budgets/requests/edit.vue"),
    },
    {
      path: "budget-requests/view/:id", //Ver solicitud de calendarización presupuestaria
      name: "BudgetRequestsView",
      component: () => import("@/views/budgets/requests/show.vue"),
    },
    {
      path: "budget-authorization", //Autorización presupuestaria
      name: "BudgetAuthorization",
      component: () => import("@/views/budgets/authorization/index.vue"),
    },
    {
      path: "my-budget", //Mi presupuesto
      name: "MyBudget",
      component: () => import("@/views/budgets/my-budget/index.vue"),
    },
    // ==================== MATERIALES ====================
    {
      path: "materials",
      name: "Materials",
      component: () => import("@/views/materials/index.vue"),
    },
    {
      path: "materials/create",
      name: "CreateMaterial",
      component: () => import("@/views/materials/create.vue"),
    },
    {
      path: "materials/:id/edit",
      name: "EditMaterial",
      component: () => import("@/views/materials/edit.vue"),
    },
    {
      path: "materials/:id",
      name: "ShowMaterial",
      component: () => import("@/views/materials/show.vue"),
    },

    // Categorías de materiales
    {
      path: "material-categories",
      name: "MaterialCategories",
      component: () => import("@/views/Home.vue"),
    },

    // ==================== REQUISICIONES ====================
    {
      path: "purchase-requisitions",
      name: "PurchaseRequisitions",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "purchase-requisitions/create",
      name: "PurchaseRequisitionCreate",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "purchase-requisitions/:id/edit",
      name: "PurchaseRequisitionEdit",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "purchase-requisitions/:id",
      name: "PurchaseRequisitionDetail",
      component: () => import("@/views/Home.vue"),
    },

    // ==================== ÓRDENES DE COMPRA ====================
    {
      path: "purchase-orders",
      name: "PurchaseOrders",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "purchase-orders/create",
      name: "PurchaseOrderCreate",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "purchase-orders/:id/edit",
      name: "PurchaseOrderEdit",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "purchase-orders/:id",
      name: "PurchaseOrderDetail",
      component: () => import("@/views/Home.vue"),
    },

    // ==================== RECEPCIONES ====================
    {
      path: "receipts",
      name: "Receipts",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "receipts/create",
      name: "ReceiptCreate",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "receipts/:id",
      name: "ReceiptDetail",
      component: () => import("@/views/Home.vue"),
    },

    // ==================== INSPECCIONES DE CALIDAD ====================
    {
      path: "quality-inspections",
      name: "QualityInspections",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "quality-inspections/create",
      name: "QualityInspectionCreate",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "quality-inspections/:id",
      name: "QualityInspectionDetail",
      component: () => import("@/views/Home.vue"),
    },

    // ==================== CATÁLOGOS ====================
    {
      path: "catalogs/currencies",
      name: "Currencies",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "catalogs/payment-terms",
      name: "PaymentTerms",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "catalogs/supplier-types",
      name: "SupplierTypes",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "catalogs/supplier-statuses",
      name: "SupplierStatuses",
      component: () => import("@/views/Home.vue"),
    },

    // ==================== REPORTES ====================
    {
      path: "reports/suppliers",
      name: "SupplierReports",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "reports/purchases",
      name: "PurchaseReports",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "reports/inventory",
      name: "InventoryReports",
      component: () => import("@/views/Home.vue"),
    },

    // ==================== USUARIOS ====================
    {
      path: "users",
      name: "Users",
      component: () => import("@/views/users/index.vue"),
    },
  ],
};

export default MainRoutes;
