/**
 * Mapea los nombres de los permisos del backend a constantes.
 * Si un permiso cambia en el backend, solo necesitas actualizarlo aquí.
 */
export const PERMISSIONS = {

  // Permisos de dashboard
  VIEW_DASHBOARD: "dashboard.view",

  // Módulo de Proveedores
  VIEW_SUPPLIERS: "suppliers.view_any",
  SHOW_SUPPLIERS: "suppliers.view",
  CREATE_SUPPLIERS: "suppliers.create",
  EDIT_SUPPLIERS: "suppliers.edit",
  DELETE_SUPPLIERS: "suppliers.delete",

  // Módulo de Contactos de Proveedores
  VIEW_SUPPLIER_CONTACTS: "supplier_contacts.view_any",
  SHOW_SUPPLIER_CONTACTS: "supplier_contacts.view",
  CREATE_SUPPLIER_CONTACTS: "supplier_contacts.create",
  EDIT_SUPPLIER_CONTACTS: "supplier_contacts.edit",
  DELETE_SUPPLIER_CONTACTS: "supplier_contacts.delete",

  //Módulo de materiales
  VIEW_MATERIALS: "materials.view_any",
  SHOW_MATERIALS: "materials.view",
  CREATE_MATERIALS: "materials.create",
  EDIT_MATERIALS: "materials.edit",
  DELETE_MATERIALS: "materials.delete",

  //Categorías de materiales
  VIEW_MATERIAL_CATEGORIES: "material_categories.view_any",
  SHOW_MATERIAL_CATEGORIES: "material_categories.view",
  CREATE_MATERIAL_CATEGORIES: "material_categories.create",
  EDIT_MATERIAL_CATEGORIES: "material_categories.edit",
  DELETE_MATERIAL_CATEGORIES: "material_categories.delete",

  //Tpo de materiales
  VIEW_MATERIAL_TYPES: "material_types.view_any",
  SHOW_MATERIAL_TYPES: "material_types.view",
  CREATE_MATERIAL_TYPES: "material_types.create",
  EDIT_MATERIAL_TYPES: "material_types.edit",
  DELETE_MATERIAL_TYPES: "material_types.delete",

  //Unidades de medida
  VIEW_MEASUREMENT_UNITS: "units_of_measure.view_any",
  SHOW_MEASUREMENT_UNITS: "units_of_measure.view",
  CREATE_MEASUREMENT_UNITS: "units_of_measure.create",
  EDIT_MEASUREMENT_UNITS: "units_of_measure.edit",
  DELETE_MEASUREMENT_UNITS: "units_of_measure.delete",

  // Categorías presupuestarias
  VIEW_BUDGET_CATEGORIES: "budget_categories.view_any",
  SHOW_BUDGET_CATEGORIES: "budget_categories.view",
  CREATE_BUDGET_CATEGORIES: "budget_categories.create",
  EDIT_BUDGET_CATEGORIES: "budget_categories.edit",
  DELETE_BUDGET_CATEGORIES: "budget_categories.delete",

  // Asignaciones presupuestarias
  VIEW_BUDGET_ASSIGNMENTS: "budget_assignments.view_any",
  SHOW_BUDGET_ASSIGNMENTS: "budget_assignments.view",
  CREATE_BUDGET_ASSIGNMENTS: "budget_assignments.create",
  EDIT_BUDGET_ASSIGNMENTS: "budget_assignments.edit",
  DELETE_BUDGET_ASSIGNMENTS: "budget_assignments.delete",

  //Departamentos
  VIEW_DEPARTMENTS: "departments.view_any",
  SHOW_DEPARTMENTS: "departments.view",
  CREATE_DEPARTMENTS: "departments.create",
  EDIT_DEPARTMENTS: "departments.edit",
  DELETE_DEPARTMENTS: "departments.delete",

  //Solicitudes de presupuesto calendarizacion
  VIEW_BUDGET_REQUESTS: "budget_requests.view_any",
  SHOW_BUDGET_REQUESTS: "budget_requests.view",
  CREATE_BUDGET_REQUESTS: "budget_requests.create",
  EDIT_BUDGET_REQUESTS: "budget_requests.edit",
  DELETE_BUDGET_REQUESTS: "budget_requests.delete",

  //Monendas
  VIEW_CURRENCIES: "currencies.view_any",
  SHOW_CURRENCIES: "currencies.view",
  CREATE_CURRENCIES: "currencies.create",
  EDIT_CURRENCIES: "currencies.edit",
  DELETE_CURRENCIES: "currencies.delete",

  // Módulo de Usuarios
  VIEW_USERS: "users.manage",
  SHOW_USERS: "users.manage",
  CREATE_USERS: "users.manage",
  EDIT_USERS: "users.manage",
  DELETE_USERS: "users.manage",

  //Roles
  VIEW_ROLES: "roles.view_any",
  SHOW_ROLES: "roles.view",
  CREATE_ROLES: "roles.create",
  EDIT_ROLES: "roles.edit",
  DELETE_ROLES: "roles.delete",

  //Desempeño de proveedores
  VIEW_SUPPLIER_PERFORMANCE: "supplier_performance.view_any",
  SHOW_SUPPLIER_PERFORMANCE: "supplier_performance.view",

  //autorizaciones presupuestarias
  VIEW_BUDGET_AUTHORIZATIONS: "budget_authorizations.view_any",
  SHOW_BUDGET_AUTHORIZATIONS: "budget_authorizations.view",

  //Proceso de compra
  VIEW_PURCHASE_PROCESSES: "purchase_processes.view_any",
  SHOW_PURCHASE_PROCESSES: "purchase_processes.view",

  //Requisiciones
  VIEW_REQUISITIONS: "requisitions.view_any",
  SHOW_REQUISITIONS: "requisitions.view",

  //Catálogos
  VIEW_CATALOGS: "catalogs.view_any",

  //Reportes
  VIEW_REPORTS: "reports.view_any",
};
