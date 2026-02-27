import api from '@/plugins/axios';
import { log } from 'console';
import { searchForWorkspaceRoot } from 'vite';

const API_URL = import.meta.env.VITE_API_URL;
const route='supplier-contacts';

export interface SupplierContacts {
    id: number;
    supplier_id: number;
    name: string,
    email: string | null | undefined;
    phone: string | null | undefined;
    mobile: string | null | undefined;
    position: string | null | undefined;
    department: string | null | undefined;
    primary: number;
    active: boolean | 1;
    notes: string | null | undefined;
    created_at: string | null;
    updated_at: string | null;
}

export const supplierContactsService = {
    async getAll() {
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
    async getById(id: number) {
        const response = await api.get(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

    async create(supplier: Partial<SupplierContacts>) {
        const response = await api.post(`${API_URL}/${route}`, supplier);
        return response.data;
    },

    async update(id: number, supplier: Partial<SupplierContacts>) {
        const response = await api.put(`${API_URL}/${route}/${id}`, supplier);
        return response.data.data;
    },

    async delete(id: number) {
        const response = await api.delete(`${API_URL}/${route}/${id}`);
        return response.data.data;
    },

    async exportAs(type: string, filters: Record<string, any> = {}) {
        const response = await api.post(`${API_URL}/reports/export`,
            {
                "type": "supplier_contacts",
                "format": type,
                "filters": filters
            }, {
            responseType: 'blob'
        });
        return response.data;
    }
};