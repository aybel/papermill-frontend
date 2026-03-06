import api from "@/plugins/axios";
const API_URL = import.meta.env.VITE_API_URL;
const route = "roles";

export interface Role {
  id: number;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
}
export interface Permission {
  id: number;
  name: string;
  full_name: string;
  resource: string;
  action: string;
  category: string;
  description: string;
  icon?: string;
}

export const RoleService = {
  async getAll(): Promise<Role[]> {
    const { data } = await api.get<Role[]>(`${API_URL}/${route}`);
    return data.data;
  },
  async getPermissions(roleId: number): Promise<Permission[]> {
    const { data } = await api.get<Role<Permission[]>>(
      `${API_URL}/${route}/${roleId}`,
    );
    return data.data.permissions;
  },
};
