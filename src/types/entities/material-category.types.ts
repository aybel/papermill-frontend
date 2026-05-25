import { FilterRequest, FilterCondition } from '../filters.types';
import { ApiResponse, PaginatedResponse, SuccessResponse } from '../api.types';

// ============================================
// ENTIDAD
// ============================================

export interface MaterialCategory {
  id: number; //id de la categoría de material
  name: string; //nombre de la categoría de material
  parent_id: number | null; //id de la categoría padre, si es null, es una categoría raíz Materias Primas para Papel->Pastas y Fibras
  attributes: Record<string, any> | null; //Atributos específicos por categoría en JSON
  created_at: string | null; //Fecha de creación de la categoría
  updated_at: string | null; //Fecha de última actualización de la categoría
}

// ============================================
// CAMPOS PERMITIDOS PARA FILTROS
// ============================================

export type MaterialCategoryField = 'id' | 'name' | 'parent_id' | 'attributes' | 'created_at' | 'updated_at';

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
export type MaterialCategoryListResponse = PaginatedResponse<MaterialCategory>; //regresa una lista para combos o tablas
export type MaterialCategorySingleResponse = SuccessResponse<MaterialCategory>; //regresa un solo registro para edit o show

// ============================================
// CONSTANTES ESPECÍFICAS
// ============================================

export const MATERIAL_CATEGORY_FIELDS: MaterialCategoryField[] = [
  'id',
  'name', 
  'attributes',
  'parent_id', 
  'created_at', 
  'updated_at'
];

export const MATERIAL_CATEGORY_SORTABLE_FIELDS: MaterialCategoryField[] = [
  'id',
  'name',
  'attributes',
  'parent_id',
  'created_at',
  'updated_at'
];