import api from '@/plugins/axios';



const API_URL = import.meta.env.VITE_API_URL;
const route="budget-schedulings";

export interface Assignment {
    id: number | null;
    department_id: number;
    budget_category_id: number;
    year: number;
    assigned_amount: number;
    justification: string;
    created_at: string | null;
    updated_at: string | null;
}

export const AssignmentService = {
    async getAll() {
        const response = await api.get(`${API_URL}/${route}`);
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

    async create(assignment: Partial<Assignment>) {
        const response = await api.post(`${API_URL}/${route}`, assignment);
        return response.data;
    },

    async update(id: number, assignment: Partial<Assignment>) {
        const response = await api.put(`${API_URL}/${route}/${id}`, assignment);
        return response.data;
    },

    async delete(id: number) {
        const response = await api.delete(`${API_URL}/${route}/${id}`);
        return response.data;
    },

    async exportAs(type: string, filters: Record<string, any> = {}) {
        const response = await api.post(`${API_URL}/reports/export`,
            {
                "type": "budget-assignments",
                "format": type,
                "filters": filters
            }, {
            responseType: 'blob'
        });
        return response.data;
    }
};