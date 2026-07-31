# Papermill Frontend

Frontend construido con Vue 3, Vite, TypeScript y Vuetify.

## Acceso rapido (elige una opcion)

- Con Docker Compose: `http://localhost:8080`
- En local con Vite (`npm run dev`): `http://localhost:5173`

Importante: solo una opcion estara activa segun como inicies el proyecto.

## Requisitos

- Docker
- Docker Compose
- Node.js 20+ (solo para ejecucion local sin Docker)

## Ejecución con Docker (recomendado)

Este proyecto ya está dockerizado. Por defecto, el contenedor expone la aplicación en:

- `http://localhost:8080`

### 1. Levantar el proyecto

```sh
docker compose up --build -d
```

### 2. Ver logs

```sh
docker compose logs -f frontend
```

### 3. Detener contenedores

```sh
docker compose down
```

## Variables de build

El `docker-compose.yml` usa este argumento de build:

- `BUILD_MODE` (por defecto: `development`)

La URL del backend se define en un solo lugar por entorno:

- `.env.development`
- `.env.production`

Ejemplo:

```dotenv
VITE_API_URL=http://localhost:8088/api/v1
```

El `Dockerfile` valida que exista `.env.<modo>` y Vite toma las variables desde ese archivo durante el build.

### Ejemplo en PowerShell

```powershell
docker compose up --build -d
```

## Ejecución local (sin Docker)

Si necesitas correrlo localmente para desarrollo rápido:

### 1. Instalar dependencias

```sh
npm install
```

### 2. Levantar servidor de desarrollo

```sh
npm run dev
```

La app quedará disponible en:

- `http://localhost:5173`

## Scripts disponibles

- `npm run dev`: inicia Vite en modo desarrollo.
- `npm run build`: compila en modo producción.
- `npm run build:dev`: compila en modo desarrollo.
- `npm run build:check`: valida tipos con `vue-tsc` y compila.
- `npm run preview`: previsualiza el build en `http://localhost:5050`.
- `npm run typecheck`: ejecuta validación de tipos.
- `npm run lint`: ejecuta ESLint con `--fix`.

## Diagnóstico rápido

| Sintoma | Causa probable | Solucion |
| --- | --- | --- |
| Firefox no abre `localhost:5173` | No esta corriendo Vite en local | Ejecuta `npm run dev` y abre `http://localhost:5173` |
| Firefox no abre `localhost:8080` | El contenedor frontend no esta levantado | Ejecuta `docker compose up --build -d` y revisa con `docker compose ps` |
| Abre `8080` pero no `5173` | Estas usando Docker (no modo local) | Es normal. Usa `http://localhost:8080` |
| Abre `5173` pero no `8080` | Estas usando modo local (sin contenedor) | Es normal. Usa `http://localhost:5173` |
| Cambio de modo y sigue fallando | Quedaron procesos del modo anterior | Deten Docker con `docker compose down` o cierra Vite (`Ctrl + C`) y vuelve a iniciar el modo deseado |

## Estructura principal

- `src/views`: pantallas de negocio.
- `src/components`: componentes reutilizables y de dominio.
- `src/services`: integración con API.
- `src/stores`: estado global (Pinia).
- `src/router`: rutas y control de navegación.
