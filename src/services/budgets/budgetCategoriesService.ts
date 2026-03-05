import api from '@/plugins/axios';



const API_URL = import.meta.env.VITE_API_URL;
const route="budget-categories";

export interface BudgetCategory {
    id: number | null;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
}

export const BudgetCategoryService = {
    async getAll() {
        const response = await api.get(`${API_URL}/${route}`);
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

    async create(category: Partial<BudgetCategory>) {
        const response = await api.post(`${API_URL}/${route}`, category);
        return response.data;
    },

    async update(id: number, category: Partial<BudgetCategory>) {
        const response = await api.put(`${API_URL}/${route}/${id}`, category);
        return response.data;
    },

    async delete(id: number) {
        const response = await api.delete(`${API_URL}/${route}/${id}`);
        return response.data;
    },

    async exportAs(type: string, filters: Record<string, any> = {}) {
        const response = await api.post(`${API_URL}/reports/export`,
            {
                "type": "budget-categories",
                "format": type,
                "filters": filters
            }, {
            responseType: 'blob'
        });
        return response.data;
    }
};