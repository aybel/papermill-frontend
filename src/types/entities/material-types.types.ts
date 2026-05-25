import { FilterRequest, FilterCondition } from "../filters.types";
import { ApiResponse, PaginatedResponse, SuccessResponse } from "../api.types";

//definimos las interfaces para los tipos de materiales
export interface MaterialType {
  id: number;
  name: string;
  code: string;
  description: string | null;
  attributes: Record<string, any> | null;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateMaterialTypeRequest {
  name: string;
  description: string;
  attributes: string;
}

export interface UpdateMaterialTypeRequest {
  id: number;
  name?: string;
  description?: string;
  attributes?: string;
}

export type MaterialTypeResponse = ApiResponse<MaterialType>;
export type MaterialTypesListResponse = PaginatedResponse<MaterialType>;
export type MaterialTypeSingleResponse = SuccessResponse<MaterialType>;

// ============================================
// CAMPOS PERMITIDOS PARA FILTROS
// ============================================
export type MaterialTypeField = 'id' | 'code' | 'name' | 'description' | 'attributes' | 'is_active' | 'created_at' | 'updated_at';

// ============================================
// REQUEST ESPECÍFICO
// ============================================
export interface MaterialTypeFilterRequest extends FilterRequest {
  filters?: Array<FilterCondition & {
    field: MaterialTypeField;
  }>;
  order_by?: {
    column: MaterialTypeField;
    direction: 'asc' | 'desc';
  };
}