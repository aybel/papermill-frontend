import { FilterRequest, FilterCondition } from '../filters.types';
import { ApiResponse, PaginatedResponse, SuccessResponse } from '../api.types';

// ============================================
// ENTIDAD
// ============================================

export interface MaterialCategory {
  id: number;
  name: string;
  parent_id: number | null;
  attributes: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}

// ============================================
// CAMPOS PERMITIDOS PARA FILTROS
// ============================================

export type MaterialCategoryField = 'id' | 'name' | 'parent_id' | 'created_at' | 'updated_at';

// ============================================
// REQUEST ESPECÍFICO
// ============================================

export interface MaterialCategoryFilterRequest extends FilterRequest {
  filters?: Array<FilterCondition & {
    field: MaterialCategoryField;
  }>;
  order_by?: {
    column: MaterialCategoryField;
    direction: 'asc' | 'desc';
  };
}

// ============================================
// RESPONSES ESPECÍFICAS
// ============================================

export type MaterialCategoryResponse = ApiResponse<MaterialCategory>;
export type MaterialCategoryListResponse = PaginatedResponse<MaterialCategory>;
export type MaterialCategorySingleResponse = SuccessResponse<MaterialCategory>;

// ============================================
// CONSTANTES ESPECÍFICAS
// ============================================

export const MATERIAL_CATEGORY_FIELDS: MaterialCategoryField[] = [
  'id',
  'name', 
  'parent_id', 
  'created_at', 
  'updated_at'
];

export const MATERIAL_CATEGORY_SORTABLE_FIELDS: MaterialCategoryField[] = [
  'id',
  'name',
  'parent_id',
  'created_at',
  'updated_at'
];