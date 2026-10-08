import api from "@/plugins/axios";
import {
  MaterialListResponse,
  MaterialSingleResponse,
  MaterialFilterRequest,
  buildFilterUrl,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
const route = "materials";

export interface Material {
  id: number;
  sku: string;
  name: string;
  description: string;
  category_id: number | null | undefined;
  category?: { id: number; name: string } | null; 
  material_type_id: number | null | undefined;
  material_type?: { id: number; name: string } | null;
  unit_of_measure_id: number | null | undefined;
  unit_of_measure?: { id: number; name: string } | null;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  safety_stock: number;
  reorder_point: number;
  avg_unit_cost: number;
  last_purchase_price: number;
  currency_id: number | null | undefined;
  currency?: { id: number; name: string; symbol: string } | null;
  grammage: number;
  width: number;
  length: number;
  color: string | null | undefined;
  created_at: string | null;
  updated_at: string | null;
}

export const materialService = {
  async filter(request: MaterialFilterRequest): Promise<MaterialListResponse> {
    const url = buildFilterUrl(`${API_URL}/${route}/filter`, request);
    const response = await api.get(url);
    return response.data;
  },

  async filterPost(
    request: MaterialFilterRequest,
  ): Promise<MaterialListResponse> {
    const response = await api.post(`${API_URL}/${route}/filter`, request);
    return response.data;
  },

  async search(
    q: string,
    perPage: number = 15,
    page: number = 1,
  ): Promise<{ data: { data: Material[]; total?: number } }> {
    const params = new URLSearchParams();
    params.append("q", q);
    params.append("per_page", String(perPage));
    params.append("page", String(page));
    const response = await api.get(`${API_URL}/${route}/search?${params}`);
    return response.data;
  },

  async getById(id: number): Promise<MaterialSingleResponse> {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    return response.data;
  },
};
