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
    const response = await api.get(`${API_URL}/payment-terms`, {
      params: { sort_by: 'name', sort_dir: 'asc', active: 1, },
    });
    return response.data.data;
  },
  async getSupplierStatuses() {
    const response = await api.get(`${API_URL}/supplier-statuses`, {
      params: { sort_by: 'name', sort_dir: 'asc', active: 1, },
    });
    return response.data.data;
  },
  async getSupplierTypes() {
    const response = await api.get(`${API_URL}/supplier-types`, {
      params: { sort_by: 'name', sort_dir: 'asc', active: 1, },
    });
    console.log('Supplier Types Response:', response.data.data);    
    return response.data.data;
  },
};
