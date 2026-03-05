import api from "@/plugins/axios";

const API_URL = import.meta.env.VITE_API_URL;
const route = "departments";

export interface Department {
  id: number;
  code: string;
  name: string;
  is_active?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export const DepartmentService = {
  async getAll() {
    const response = await api.get(`${API_URL}/${route}`);
    return response.data.data as Department[];
  },
};
