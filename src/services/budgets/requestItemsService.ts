import api from "@/plugins/axios";

const API_URL = import.meta.env.VITE_API_URL;
const route = "budget-request-items";

export interface BudgetRequestItems {
  id: number | null;
  budget_request_id: number;
  material_id: number;
  quantity: number;
  estimated_unit_price: number;
  technical_specifications: string;
  quality_requirements: string;
  created_at: string | null;
  updated_at: string | null;
}

export const BudgetRequestItemsService = {
  async getAll() {
    const response = await api.get(`${API_URL}/${route}`);
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    return response.data.data;
  },

  async create(budgetRequestItem: Partial<BudgetRequestItems>) {
    const response = await api.post(`${API_URL}/${route}`, budgetRequestItem);
    return response.data;
  },

  async update(id: number, budgetRequestItem: Partial<BudgetRequestItems>) {
    const response = await api.put(`${API_URL}/${route}/${id}`, budgetRequestItem);
    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`${API_URL}/${route}/${id}`);
    return response.data;
  },

  async exportAs(type: string, filters: Record<string, any> = {}) {
    const response = await api.post(
      `${API_URL}/reports/export`,
      {
        type: "budget-requests",
        format: type,
        filters: filters,
      },
      {
        responseType: "blob",
      },
    );
    return response.data;
  },
};
