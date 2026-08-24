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
  material_type_id: number | null | undefined;
  unit_of_measure_id: number | null | undefined;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  safety_stock: number;
  reorder_point: number;
  avg_unit_cost: number;
  last_purchase_price: number;
  currency_id: number | null | undefined;
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

  async getById(id: number): Promise<MaterialSingleResponse> {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    return response.data;
  },
};
