import api from '@/plugins/axios';


const API_URL = import.meta.env.VITE_API_URL;
const route="materials";

export interface Material {
    id: number;
    sku: string,
    name: string;
    description: string,
    category_id: number | null | undefined;
    material_type_id:number | null | undefined;
    unit_of_measure_id: number | null | undefined;
    current_stock: number;
    min_stock: number;
    max_stock: number;
    safety_stock: number;
    reorder_point: number;
    avg_unit_cost: number;
    last_purchase_price: number;
    currency_id: number | null | undefined;
    grammage: number;
    width: number;
    length: number;
    color: string | null | undefined;
    created_at: string | null;
    updated_at: string | null;
}

export const materialService = {
    async getAll() {
        const response = await api.get(`${API_URL}/${route}`);
        return response.data.data;
    },

    async getById(id: number) {
        const response = await api.get(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

    async create(material: Partial<Material>) {
        const response = await api.post(`${API_URL}/${route}`, material);
        return response.data;
    },

    async update(id: number, material: Partial<Material>) {
        const response = await api.put(`${API_URL}/${route}/${id}`, material);
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