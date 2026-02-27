import api from '@/plugins/axios';
import { log } from 'console';


const API_URL = import.meta.env.VITE_API_URL;
const route="material-categories";

export interface MaterialCategory {
    id: number;
    name: string;
    parent_id: number | null;
    attributes: Record<string, any> | null;
    created_at: string | null;
    updated_at: string | null;
}

export const materialCategoryService = {
    async getAll() {
        const response = await api.get(`${API_URL}/${route}`);
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

};