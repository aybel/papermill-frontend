import api from "@/plugins/axios";
import { 
    MaterialTypeFilterRequest,
    buildFilterUrl,
    MaterialTypesListResponse 
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
const route = "material-types";


export const materialTypeService = {
  /**
   * Filtros avanzados (GET)
   */
  async filter(
    request: MaterialTypeFilterRequest,
  ): Promise<MaterialTypesListResponse> {
    const url = buildFilterUrl(`${API_URL}/${route}/filter`, request);
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Filtros avanzados (POST - alternativa)
   */
  async filterPost(
    request: MaterialTypeFilterRequest,
  ): Promise<MaterialTypesListResponse> {
    const response = await api.post(`${API_URL}/${route}/filter`, request);
    return response.data;
  },
  async getAll() {
    const response = await api.get(`${API_URL}/${route}`);
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    return response.data.data;
  },
};
