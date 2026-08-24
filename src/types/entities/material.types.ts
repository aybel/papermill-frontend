import { FilterRequest, FilterCondition } from "../filters.types";
import { ApiResponse, PaginatedResponse, SuccessResponse } from "../api.types";

//definimos las interfaces para la tabla de materiales
export interface Material {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category_id: number | null;
  material__id: number | null;
  unit_of_measure_id: number | null;
  min_stock: number;
  max_stock: number;
  safety_stock: number;
  reorder_point: number | null;
  avg_unit_cost: number;
  last_purchase_price: number | null;
  currency_id: number;
  grammage: number|null;
  width: number| null;
  length: number | null;
  color: string| null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateMaterialRequest {
  name: string;
  description: string;
  attributes: string;
}

export interface UpdateMaterialRequest {
  id: number;
  name?: string;
  description?: string;
  attributes?: string;
}

export type MaterialResponse = ApiResponse<Material>;
export type MaterialListResponse = PaginatedResponse<Material>;
export type MaterialSingleResponse = SuccessResponse<Material>;

// ============================================
// CAMPOS PERMITIDOS PARA FILTROS
// ============================================
export type  MaterialField =
  | "id"
  | "sku"
  | "name"
  | "description"
  | "created_at"
  | "updated_at";

// ============================================
// REQUEST ESPECÍFICO
// ============================================
export interface MaterialFilterRequest extends FilterRequest {
  filters?: Array<FilterCondition & {
    field: MaterialField;
  }>;
  order_by?: {
    column: MaterialField;
    direction: 'asc' | 'desc';
  };
}
