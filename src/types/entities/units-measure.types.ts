import { FilterRequest, FilterCondition } from '../filters.types';
import { ApiResponse, PaginatedResponse, SuccessResponse } from '../api.types';



//INTERFACE  para las unidades de medida es una entidad que representa a la tabla de la base de datos, es decir, cada propiedad de la interfaz corresponde a una columna de la tabla de unidades de medida en la base de datos. Esta interfaz se utiliza para definir el tipo de datos que se espera recibir o enviar al interactuar con las unidades de medida en la aplicación.
export interface UnitMeasure {
  id: number;
  code: string;
  name: string;
  symbol: string | null;
  category: string | null;
  conversion_factor: number;
  bases_unit_id: number | null;
  is_base_unit: boolean;
  decimal_places: number;
  description: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

// ============================================
// CAMPOS PERMITIDOS PARA FILTROS
// ============================================
export type UnitMeasureField = keyof UnitMeasure;

export type UnitMeasureResponse = ApiResponse<UnitMeasure>;
export type UnitMeasuresResponse = ApiResponse<UnitMeasure[]>;
export type PaginatedUnitMeasuresResponse = PaginatedResponse<UnitMeasure>;
export type UnitMeasureSingleResponse = SuccessResponse<UnitMeasure>;
export type SuccessUnitMeasureResponse = SuccessResponse<UnitMeasure>;


export interface UnitMeasureFilterRequest extends FilterRequest {
  filters?: Array<FilterCondition & {
    field: UnitMeasureField;
  }>;
  order_by?: {
    column: UnitMeasureField;
    direction: 'asc' | 'desc';
  };
}