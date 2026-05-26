import api from "@/plugins/axios";

import type {
  UnitMeasure,
  UnitMeasureResponse,
  PaginatedUnitMeasuresResponse,
  UnitMeasureFilterRequest,
} from "@/types";
import { buildFilterUrl } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
const route = "units-of-measure";

export const unitsMeasureService = {
  /**
   * Filtros avanzados (GET)
   */
  async filter(
    request: UnitMeasureFilterRequest,
  ): Promise<PaginatedUnitMeasuresResponse> {
    const url = buildFilterUrl(`${API_URL}/${route}/filter`, request);
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Filtros avanzados (POST - alternativa)
   */
  async filterPost(
    request: UnitMeasureFilterRequest,
  ): Promise<PaginatedUnitMeasuresResponse> {
    const response = await api.post(`${API_URL}/${route}/filter`, request);
    return response.data;
  },
  async getAll() {
    const response = await api.get(`${API_URL}/${route}`);
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    console.log("unitsOfMeasureService getById response:", response);
    return response.data.data;
  },
};
