// services/menuService.ts
import api from 'axios';
import type { MenuResponse } from '@/config/menu';

const API_URL = import.meta.env.VITE_API_URL;
const route="/user/menu";

class MenuService {
    private cache: MenuResponse | null = null;
    private lastFetch: number = 0;
    private CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    async getUserMenu(): Promise<MenuResponse> {
        // Si hay cache válido, lo devolvemos
        if (this.cache && (Date.now() - this.lastFetch) < this.CACHE_DURATION) {
            return this.cache;
        }

        try {
            const response = await api.get(`${API_URL}${route}`);
            this.cache = response.data;
            this.lastFetch = Date.now();
            
            // Guardar backup en localStorage
            localStorage.setItem('menu_backup', JSON.stringify(this.cache));
            
            return this.cache;
        } catch (error) {
            console.error('Error loading menu:', error);
            
            // Fallback a localStorage
            const backup = localStorage.getItem('menu_backup');
            if (backup) {
                return JSON.parse(backup);
            }
            
            throw error;
        }
    }

    clearCache() {
        this.cache = null;
    }
}

export const menuService = new MenuService();