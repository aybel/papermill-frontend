import api from '@/plugins/axios';
const API_URL = import.meta.env.VITE_API_URL;

export const catalogsService = {
  async getCurrencies() {
    const response = await api.get(`${API_URL}/currencies`, {
      params: { sort_by: 'code', sort_dir: 'asc', active: 1, },
    });
    return response.data.data;
  },
  async getPaymentTerms() {
    const response = await api.get(`${API_URL}/payment_terms`, {
      params: { sort_by: 'name', sort_dir: 'asc', active: 1, },
    });
    return response.data.data;
  },
  async getSupplierStatuses() {
    const response = await api.get(`${API_URL}/supplier_statuses`, {
      params: { sort_by: 'name', sort_dir: 'asc', active: 1, },
    });
    return response.data.data;
  },
  async getSupplierTypes() {
    const response = await api.get(`${API_URL}/supplier_types`, {
      params: { sort_by: 'name', sort_dir: 'asc', active: 1, },
    });
    return response.data.data;
  },
};
