import api from '@/plugins/axios';


const API_URL = import.meta.env.VITE_API_URL;
const route="material-types";

export interface MaterialType {
    id: number;
    name: string;
    code: string;
    description: string | null;
    attributes: Record<string, any> | null;
    sort_order: number;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
}

export const materialTypeService = {
    async getAll() {
        const response = await api.get(`${API_URL}/${route}`);
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

};