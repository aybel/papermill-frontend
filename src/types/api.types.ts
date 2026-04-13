// ============================================
// RESPONSES GENÉRICAS DE API
// ============================================

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
}

export interface PaginatedResponse<T> extends BaseResponse {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ValidationErrorResponse extends BaseResponse {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  message: string;
  error?: string;
}

export type ApiResponse<T> = 
  | SuccessResponse<T>
  | PaginatedResponse<T>
  | ValidationErrorResponse
  | ErrorResponse;

// ============================================
// REQUESTS GENÉRICOS
// ============================================

export interface SearchRequest {
  q?: string;
  per_page?: number;
}

// ============================================
// TYPE GUARDS
// ============================================

export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true && 'data' in response && !('meta' in response);
}

export function isPaginatedResponse<T>(response: ApiResponse<T>): response is PaginatedResponse<T> {
  return response.success === true && 'meta' in response;
}

export function isValidationError(response: ApiResponse<any>): response is ValidationErrorResponse {
  return response.success === false && 'errors' in response;
}

export function isErrorResponse(response: ApiResponse<any>): response is ErrorResponse {
  return response.success === false && !('errors' in response);
}