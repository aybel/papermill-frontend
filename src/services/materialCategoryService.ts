// services/materialCategory.service.ts

import api from "@/plugins/axios";
import { 
  FilterRequest,
  buildFilterUrl,
  MaterialCategory,
  MaterialCategoryListResponse,
  MaterialCategorySingleResponse,
  MaterialCategoryFilterRequest 
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
const route = "material-categories";

export const materialCategoryService = {
  /**
   * Filtros avanzados (GET)
   */
  async filter(request: MaterialCategoryFilterRequest): Promise<MaterialCategoryListResponse> {
    const url = buildFilterUrl(`${API_URL}/${route}/filter`, request);
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Filtros avanzados (POST - alternativa)
   */
  async filterPost(request: MaterialCategoryFilterRequest): Promise<MaterialCategoryListResponse> {
    const response = await api.post(`${API_URL}/${route}/filter`, request);
    return response.data;
  },

  /**
   * Búsqueda simple (legacy)
   */
  async search(q: string, perPage: number = 15): Promise<MaterialCategoryListResponse> {
    const params = new URLSearchParams();
    params.append('q', q);
    params.append('per_page', String(perPage));
    
    const response = await api.get(`${API_URL}/${route}/search?${params}`);
    return response.data;
  },

  /**
   * Obtener por ID
   */
  async getById(id: number): Promise<MaterialCategorySingleResponse> {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    return response.data;
  },

  /**
   * Obtener todos con filtros simples (legacy)
   */
  async getAll(params: {
    parent_id?: number;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
  } = {}): Promise<MaterialCategoryListResponse> {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await api.get(`${API_URL}/${route}/all?${queryString}`);
    return response.data;
  },
};