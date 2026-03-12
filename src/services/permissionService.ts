// services/permissionService.ts
import api from "@/plugins/axios";

const API_URL = import.meta.env.VITE_API_URL;
const route = "permissions";

export interface Permission {
  id: number;
  name: string;
  full_name: string;
  category: string;
  resource: string;
  action: string;
  description: string;
  icon: string;
  guard_name: string;
}

export interface ModulePermissions {
  category: string;
  category_label: string;
  permissions: Permission[];
}

export const permissionService = {
  async getAll(): Promise<Permission[]> {
    const params = {
      resource: "NOT NULL",
      order_by: JSON.stringify({ column: "category", direction: "asc" }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`${API_URL}/${route}/search?${queryString}`);
    return response.data.data;
  },
};
