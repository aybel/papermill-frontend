// ============================================
// OPERADORES Y CONFIGURACIONES BÁSICAS
// ============================================

export type ComparisonOperator = 
  | 'eq'      // igual
  | 'ne'      // no igual
  | 'gt'      // mayor que
  | 'gte'     // mayor o igual
  | 'lt'      // menor que
  | 'lte'     // menor o igual
  | 'like'    // contiene (case sensitive)
  | 'ilike'   // contiene (case insensitive)
  | 'in'      // en lista
  | 'nin'     // no en lista
  | 'null'    // es nulo
  | 'notnull' // no es nulo
  | 'between' // entre valores
  | 'startsWith' // empieza con
  | 'endsWith';  // termina con

export interface FilterCondition {
  field: string;
  operator: ComparisonOperator;
  value?: any;
}

export interface OrderByConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page?: number;
  limit?: number;
}

export interface FilterRequest {
  filters?: FilterCondition[];
  order_by?: OrderByConfig;
  pagination?: PaginationConfig;
}

// ============================================
// CONSTANTES ÚTILES
// ============================================

export const OPERATORS_WITHOUT_VALUE: ComparisonOperator[] = ['null', 'notnull'];
export const ARRAY_OPERATORS: ComparisonOperator[] = ['in', 'nin', 'between'];
export const TEXT_OPERATORS: ComparisonOperator[] = ['like', 'ilike', 'startsWith', 'endsWith'];
export const COMPARISON_OPERATORS: ComparisonOperator[] = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'];

export const OPERATOR_SYMBOLS: Record<ComparisonOperator, string> = {
  eq: '=',
  ne: '≠',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  like: 'contiene',
  ilike: 'contiene',
  in: 'en',
  nin: 'no en',
  null: 'es nulo',
  notnull: 'no es nulo',
  between: 'entre',
  startsWith: 'empieza con',
  endsWith: 'termina con',
};

// ============================================
// UTILIDADES PARA QUERY STRING
// ============================================

export function serializeFilterRequest(request: FilterRequest): string {
  const params = new URLSearchParams();
  
  if (request.filters) {
    request.filters.forEach((filter, index) => {
      params.append(`filters[${index}][field]`, filter.field);
      params.append(`filters[${index}][operator]`, filter.operator);
      if (filter.value !== undefined && filter.value !== null) {
        params.append(`filters[${index}][value]`, String(filter.value));
      }
    });
  }
  
  if (request.order_by) {
    params.append('order_by[column]', request.order_by.column);
    params.append('order_by[direction]', request.order_by.direction);
  }
  
  if (request.pagination) {
    if (request.pagination.page) {
      params.append('pagination[page]', String(request.pagination.page));
    }
    if (request.pagination.limit) {
      params.append('pagination[limit]', String(request.pagination.limit));
    }
  }
  
  return params.toString();
}

export function buildFilterUrl(baseUrl: string, request: FilterRequest): string {
  const queryString = serializeFilterRequest(request);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}