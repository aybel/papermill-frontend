import api from '@/plugins/axios';


const API_URL = import.meta.env.VITE_API_URL;
const route="users";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    department_id:number;
    created_at: string | null;
    updated_at: string | null;
    role_ids: number[];
    department?: number[];
}

export const userService = {
    async getAll() {
        const response = await api.get(`${API_URL}/${route}`);
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

    async create(user: Partial<User>) {
        const response = await api.post(`${API_URL}/${route}`, user);
        return response.data;
    },

    async update(id: number, user: Partial<User>) {
        const response = await api.put(`${API_URL}/${route}/${id}`, user);
        return response.data.data;
    },

    async delete(id: number) {
        const response = await api.delete(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

    async exportAs(type: string, filters: Record<string, any> = {}) {
        const response = await api.post(`${API_URL}/reports/export`,
            {
                "type": "materials",
                "format": type,
                "filters": filters
            }, {
            responseType: 'blob'
        });
        return response.data;
    }
};