// services/base.service.ts

import api from "@/plugins/axios";
import { QueryBuilder } from "@/utils/query-builder.util";
import { QueryParams } from "@/types/filters.types";

const API_URL = import.meta.env.VITE_API_URL;

export class BaseService {
  protected route: string;

  constructor(route: string) {
    this.route = route;
  }

  /**
   * Método genérico para obtener todos los registros con filtros
   */
  async getAll(params: QueryParams | Record<string, any> = {}) {
    const queryString = QueryBuilder.fromQueryParams(params);
    const url = `${API_URL}/${this.route}/search${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(url);
    return response.data.data;
  }

  /**
   * Método genérico para obtener un registro por ID
   */
  async getById(id: number) {
    const response = await api.get(`${API_URL}/${this.route}/${id}`);
    return response.data.data;
  }

  /**
   * Método genérico para crear un registro
   */
  async create(data: any) {
    const response = await api.post(`${API_URL}/${this.route}`, data);
    return response.data.data;
  }

  /**
   * Método genérico para actualizar un registro
   */
  async update(id: number, data: any) {
    const response = await api.put(`${API_URL}/${this.route}/${id}`, data);
    return response.data.data;
  }

  /**
   * Método genérico para eliminar un registro
   */
  async delete(id: number) {
    const response = await api.delete(`${API_URL}/${this.route}/${id}`);
    return response.data.data;
  }
}