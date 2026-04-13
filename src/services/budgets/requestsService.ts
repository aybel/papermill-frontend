import api from "@/plugins/axios";

const API_URL = import.meta.env.VITE_API_URL;
const route = "budget-requests";

export interface BudgetRequest {
  id: number | null;
  request_number?: string;
  budget_request_status_id: string;
  budget_category_id: number;
  created:string
  year: number;
  notes: string;
  created_at: string | null;
  updated_at: string | null;
  department_name: string;
  estimated_total: number;
  status_name: string;
  category_name:string,
}

export const BudgetRequestService = {
  async getAll() {
    const response = await api.get(`${API_URL}/${route}`);
    console.log("Response from getAll:", response.data.data.items);
    return Array.isArray(response?.data?.data?.items) ? response.data.data.items : [];
  },

  async getById(id: number) {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    return response.data.data;
  },

  async create(budgetRequest: Partial<BudgetRequest>) {

    const response = await api.post(`${API_URL}/${route}`, budgetRequest);
    return response.data;
  },

  async update(id: number, budgetRequest: Partial<BudgetRequest>) {
    const response = await api.put(`${API_URL}/${route}/${id}`, budgetRequest);
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
