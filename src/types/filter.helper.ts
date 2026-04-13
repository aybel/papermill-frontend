import { FilterCondition, ComparisonOperator } from "@/types/filters.types";

export class FilterBuilder {
  private filters: FilterCondition[] = [];

  add(field: string, operator: ComparisonOperator, value: any): this {
    this.filters.push({ field, operator, value });
    return this;
  }

  notNull(field: string): this {
    return this.add(field, 'notnull', null);
  }

  isNull(field: string): this {
    return this.add(field, 'null', null);
  }

  equals(field: string, value: any): this {
    return this.add(field, 'eq', value);
  }

  notEquals(field: string, value: any): this {
    return this.add(field, 'ne', value);
  }

  contains(field: string, value: string): this {
    return this.add(field, 'ilike', value);
  }

  greaterThan(field: string, value: any): this {
    return this.add(field, 'gt', value);
  }

  lessThan(field: string, value: any): this {
    return this.add(field, 'lt', value);
  }

  inList(field: string, values: any[]): this {
    return this.add(field, 'in', values);
  }

  between(field: string, min: any, max: any): this {
    return this.add(field, 'between', [min, max]);
  }

  build(): FilterCondition[] {
    return this.filters;
  }
}

// Helper de filtros estáticos para uso rápido
export const Filter = {
  notNull: (field: string): FilterCondition => ({
    field,
    operator: 'notnull',
    value: null
  }),
  
  isNull: (field: string): FilterCondition => ({
    field,
    operator: 'null',
    value: null
  }),
  
  equals: (field: string, value: any): FilterCondition => ({
    field,
    operator: 'eq',
    value
  }),
  
  contains: (field: string, value: string): FilterCondition => ({
    field,
    operator: 'ilike',
    value
  }),
  
  greaterThan: (field: string, value: any): FilterCondition => ({
    field,
    operator: 'gt',
    value
  }),
  
  inList: (field: string, values: any[]): FilterCondition => ({
    field,
    operator: 'in',
    value: values
  })
};