import api from '@/plugins/axios';
import { searchForWorkspaceRoot } from 'vite';

const API_URL = import.meta.env.VITE_API_URL;

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
        const response = await api.get(`${API_URL}/supplier_contacts`);
        return response.data.data;
    },
    async search(params: Record<string, any> = {}) {
        // Puedes pasar cualquier combinación de filtros en params, por ejemplo:
        // { supplier_id: 5, name: 'Juan', email: 'juan@mail.com' }
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`${API_URL}/supplier_contacts/search?${queryString}`);
        return response.data.data;
    },
    async getById(id: number) {
        const response = await api.get(`${API_URL}/supplier_contacts/${id}`);
        return response.data.data;
    },

    async create(supplier: Partial<SupplierContacts>) {
        const response = await api.post(`${API_URL}/supplier_contacts`, supplier);
        return response.data;
    },

    async update(id: number, supplier: Partial<SupplierContacts>) {
        const response = await api.put(`${API_URL}/supplier_contacts/${id}`, supplier);
        return response.data.data;
    },

    async delete(id: number) {
        const response = await api.delete(`${API_URL}/supplier_contacts/${id}`);
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