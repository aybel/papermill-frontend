import api from "@/plugins/axios";
const API_URL = import.meta.env.VITE_API_URL;
const route = "roles";

export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const roleService = {
  async getAll(): Promise<Role[]> {
    const response = await api.get(`${API_URL}/${route}`);
    return response.data.data;
  },

  async search(params: Record<string, any> = {}) {
    // Puedes pasar cualquier combinación de filtros en params, por ejemplo:
    // { supplier_id: 5, name: 'Juan', email: 'juan@mail.com' }
    const queryString = new URLSearchParams(params).toString();
    console.log("Query string for search:", queryString);
    const response = await api.get(`${API_URL}/${route}/search?${queryString}`);
    return response.data.data;
  },

  async getById(id: number): Promise<Role> {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    return response.data;
  },

  async create(data: Role): Promise<Role> {
    const response = await api.post(`${API_URL}/${route}`, data);
    return response.data;
  },

  async update(id: number, data: Role): Promise<Role> {
    const response = await api.put(`${API_URL}/${route}/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${API_URL}/${route}/${id}`);
  },
};
