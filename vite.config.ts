import { fileURLToPath, URL } from "url";
import { defineConfig, loadEnv } from "vite";  // 👈 Importa loadEnv
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno según el modo
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
    optimizeDeps: {
      exclude: ["vuetify"],
      entries: ["./src/**/*.vue"],
    },
    server: {
      host: '0.0.0.0',  // 👈 Importante para Docker
      port: 5173,
      hmr: {
        overlay: true,
      },
      // Proxy para desarrollo (opcional pero útil)
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // Definir variables globales (opcional)
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
});