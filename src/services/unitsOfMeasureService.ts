import api from "@/plugins/axios";

const API_URL = import.meta.env.VITE_API_URL;
const route = "units-of-measure";

export interface UnitsOfMeasure {
  id: number;
  code: string;
  name: string;
  symbol: string;
  category: string | null;
  conversion_factor: number | null;
  base_unit_id: number | null;
  is_base_unit: number;
  decimal_places: number | null;
  description: string | null;
  is_active: number;
  created_at: string | null;
  updated_at: string | null;
}

export const unitsOfMeasureService = {
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
