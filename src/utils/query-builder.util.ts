// utils/query-builder.util.ts

import { FilterCondition, QueryParams, OrderByConfig } from "@/types/filters.types";

export class QueryBuilder {
  private urlParams: URLSearchParams;

  constructor() {
    this.urlParams = new URLSearchParams();
  }

  /**
   * Procesa filtros y los convierte en parámetros URL
   */
  processFilters(filters: FilterCondition[]): this {
    filters.forEach((filter) => {
      const { field, operator, value } = filter;
      
      switch (operator) {
        case 'eq':
          this.urlParams.append(field, String(value));
          break;
        case 'ne':
          this.urlParams.append(`${field}[ne]`, String(value));
          break;
        case 'gt':
          this.urlParams.append(`${field}[gt]`, String(value));
          break;
        case 'gte':
          this.urlParams.append(`${field}[gte]`, String(value));
          break;
        case 'lt':
          this.urlParams.append(`${field}[lt]`, String(value));
          break;
        case 'lte':
          this.urlParams.append(`${field}[lte]`, String(value));
          break;
        case 'like':
        case 'ilike':
          this.urlParams.append(`${field}[${operator}]`, `%${value}%`);
          break;
        case 'in':
        case 'nin':
          this.urlParams.append(`${field}[${operator}]`, Array.isArray(value) ? value.join(',') : value);
          break;
        case 'null':
          this.urlParams.append(`${field}[is]`, 'null');
          break;
        case 'notnull':
          this.urlParams.append(`${field}[isnot]`, 'null');
          break;
        case 'between':
          if (Array.isArray(value) && value.length === 2) {
            this.urlParams.append(`${field}[between]`, `${value[0]},${value[1]}`);
          }
          break;
      }
    });
    return this;
  }

  /**
   * Procesa ordenamiento
   */
  processOrderBy(orderBy?: OrderByConfig): this {
    if (orderBy) {
      this.urlParams.append('order_by', JSON.stringify(orderBy));
    }
    return this;
  }

  /**
   * Procesa paginación
   */
  processPagination(pagination?: { page?: number; limit?: number }): this {
    if (pagination) {
      const { page, limit } = pagination;
      if (page) this.urlParams.append('page', String(page));
      if (limit) this.urlParams.append('limit', String(limit));
    }
    return this;
  }

  /**
   * Procesa parámetros simples (compatibilidad con versión anterior)
   */
  processSimpleParams(params: Record<string, any>): this {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.urlParams.append(key, String(value));
      }
    });
    return this;
  }

  /**
   * Construye el query string final
   */
  build(): string {
    return this.urlParams.toString();
  }

  /**
   * Método estático para construir query completo desde QueryParams
   */
  static fromQueryParams(params: QueryParams | Record<string, any>): string {
    const builder = new QueryBuilder();
    const remainingParams = { ...params };

    // Procesar filtros si existen
    if ('filters' in remainingParams && Array.isArray(remainingParams.filters)) {
      builder.processFilters(remainingParams.filters);
      delete remainingParams.filters;
    }

    // Procesar ordenamiento si existe
    if ('order_by' in remainingParams && remainingParams.order_by) {
      builder.processOrderBy(remainingParams.order_by);
      delete remainingParams.order_by;
    }

    // Procesar paginación si existe
    if ('pagination' in remainingParams && remainingParams.pagination) {
      builder.processPagination(remainingParams.pagination);
      delete remainingParams.pagination;
    }

    // Procesar parámetros simples restantes
    builder.processSimpleParams(remainingParams);

    return builder.build();
  }
}