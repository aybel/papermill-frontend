# Sistema de Filtros Avanzados - Frontend

Este documento describe la implementación del sistema de filtros estructurados para el frontend en Vue 3 con TypeScript.

---

## 📁 Estructura de Archivos

```
src/
├── types/
│   ├── filters.types.ts          # Tipos genéricos de filtrado
│   ├── api.types.ts              # Tipos genéricos de API
│   ├── index.ts                  # Exportaciones centralizadas
│   └── entities/
│       └── [entity].types.ts     # Tipos específicos por entidad
├── helpers/
│   └── filter.helper.ts          # Helpers para construir filtros
└── services/
    └── [entity].service.ts       # Servicio de la entidad
```

---

## 🚀 Implementación Paso a Paso

### 1. Tipos Genéricos (Ya implementados)

Los archivos `filters.types.ts` y `api.types.ts` contienen los tipos base y **NO deben modificarse** al agregar nuevas entidades.

---

### 2. Crear Tipos de la Entidad

**Archivo:** `src/types/entities/[entity].types.ts`

```typescript
import { FilterRequest, FilterCondition } from '../filters.types';
import { ApiResponse, PaginatedResponse, SuccessResponse } from '../api.types';

// ============================================
// ENTIDAD
// ============================================

export interface [Entity] {
  id: number;
  name: string;
  // ... otras propiedades específicas ...
  created_at: string | null;
  updated_at: string | null;
}

// ============================================
// CAMPOS PERMITIDOS
// ============================================

export type [Entity]Field =
  | 'id'
  | 'name'
  // ... otros campos ...
  | 'created_at'
  | 'updated_at';

// ============================================
// REQUEST ESPECÍFICO
// ============================================

export interface [Entity]FilterRequest extends FilterRequest {
  filters?: Array<FilterCondition & {
    field: [Entity]Field;
  }>;
  order_by?: {
    column: [Entity]Field;
    direction: 'asc' | 'desc';
  };
}

// ============================================
// RESPONSES ESPECÍFICAS
// ============================================

export type [Entity]Response       = ApiResponse<[Entity]>;
export type [Entity]ListResponse   = PaginatedResponse<[Entity]>;
export type [Entity]SingleResponse = SuccessResponse<[Entity]>;
```

---

### 3. Actualizar Exportaciones

**Archivo:** `src/types/index.ts`

```typescript
// Genéricos
export * from './filters.types';
export * from './api.types';

// Entidades
export * from './entities/material-category.types';
export * from './entities/[entity].types'; // Nueva entidad
```

---

### 4. Crear/Actualizar Servicio

**Archivo:** `src/services/[entity].service.ts`

```typescript
import api from "@/plugins/axios";
import {
  [Entity],
  [Entity]ListResponse,
  [Entity]SingleResponse,
  [Entity]FilterRequest,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
const route = "[entity-plural]";

export const [entity]Service = {
  /** Filtros avanzados (POST) */
  async filterPost(request: [Entity]FilterRequest): Promise<[Entity]ListResponse> {
    const response = await api.post(`${API_URL}/${route}/filter`, request);
    return response.data;
  },

  /** Obtener por ID */
  async getById(id: number): Promise<[Entity]SingleResponse> {
    const response = await api.get(`${API_URL}/${route}/${id}`);
    return response.data;
  },

  // ============================================
  // MÉTODOS LEGACY (Mantener temporalmente)
  // ============================================

  /** @deprecated Usar filterPost() en su lugar */
  async getAll(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const response = await api.get(`${API_URL}/${route}/all?${queryString}`);
    return response.data;
  },

  /** @deprecated Usar filterPost() con filtro 'ilike' en su lugar */
  async search(q: string, perPage: number = 15) {
    const params = new URLSearchParams();
    params.append('q', q);
    params.append('per_page', String(perPage));
    const response = await api.get(`${API_URL}/${route}/search?${params}`);
    return response.data;
  },
};
```

---

### 5. Usar en Componentes Vue

**Archivo:** `src/components/[Entity]List.vue`

```vue
<template>
  <div>
    <!-- Filtros UI -->
    <div class="filters">
      <input
        v-model="searchTerm"
        placeholder="Buscar..."
        @input="onSearch"
      />
      <select v-model="filterType" @change="applyFilters">
        <option value="all">Todos</option>
        <option value="withParent">Con padre</option>
        <option value="withoutParent">Sin padre</option>
      </select>
    </div>

    <!-- Lista -->
    <div v-if="loading">Cargando...</div>
    <div v-else>
      <div v-for="item in items" :key="item.id">
        {{ item.name }}
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="meta" class="pagination">
      <button :disabled="meta.current_page === 1" @click="changePage(meta.current_page - 1)">
        Anterior
      </button>
      <span>Página {{ meta.current_page }} de {{ meta.last_page }}</span>
      <button :disabled="meta.current_page === meta.last_page" @click="changePage(meta.current_page + 1)">
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { [entity]Service, type [Entity] } from '@/services/[entity].service';
import { Filter } from '@/helpers/filter.helper';
import type { PaginationMeta } from '@/types';

const items       = ref<[Entity][]>([]);
const loading     = ref(false);
const meta        = ref<PaginationMeta | null>(null);
const searchTerm  = ref('');
const filterType  = ref('all');
const currentPage = ref(1);

let searchTimeout: any;

async function loadItems() {
  loading.value = true;
  try {
    const filters: any[] = [];

    if (filterType.value === 'withParent') {
      filters.push(Filter.notNull('parent_id'));
    } else if (filterType.value === 'withoutParent') {
      filters.push(Filter.isNull('parent_id'));
    }

    if (searchTerm.value) {
      filters.push(Filter.contains('name', searchTerm.value));
    }

    const response = await [entity]Service.filterPost({
      filters: filters.length > 0 ? filters : undefined,
      order_by: { column: 'name', direction: 'asc' },
      pagination: { page: currentPage.value, limit: 20 },
    });

    if (response.success) {
      items.value = response.data;
      meta.value  = response.meta;
    }
  } catch (error) {
    console.error('Error loading items:', error);
    items.value = [];
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadItems();
  }, 300);
}

function applyFilters() {
  currentPage.value = 1;
  loadItems();
}

function changePage(page: number) {
  currentPage.value = page;
  loadItems();
}

onMounted(() => {
  loadItems();
});
</script>
```

---

## 🛠️ Helpers Disponibles

### FilterBuilder (Programático)

```typescript
import { FilterBuilder } from '@/helpers/filter.helper';

const filters = new FilterBuilder()
  .notNull('parent_id')
  .contains('name', 'material')
  .greaterThan('id', 10)
  .build();
```

### Filter (Estático)

```typescript
import { Filter } from '@/helpers/filter.helper';

const filters = [
  Filter.notNull('parent_id'),
  Filter.contains('name', 'material'),
  Filter.greaterThan('id', 10),
];
```

### Operadores Disponibles

| Helper           | Operador     | Descripción             |
| ---------------- | ------------ | ----------------------- |
| `equals()`       | `eq`         | Igual a                 |
| `notEquals()`    | `ne`         | No igual a              |
| `greaterThan()`  | `gt`         | Mayor que               |
| `greaterOrEqual()` | `gte`      | Mayor o igual           |
| `lessThan()`     | `lt`         | Menor que               |
| `lessOrEqual()`  | `lte`        | Menor o igual           |
| `contains()`     | `ilike`      | Contiene texto          |
| `startsWith()`   | `startsWith` | Empieza con             |
| `endsWith()`     | `endsWith`   | Termina con             |
| `inList()`       | `in`         | En lista de valores     |
| `notIn()`        | `nin`        | No en lista             |
| `isNull()`       | `null`       | Es nulo                 |
| `notNull()`      | `notnull`    | No es nulo              |
| `between()`      | `between`    | Entre dos valores       |

---

## ✅ Checklist por Entidad

- [ ] Crear `types/entities/[entity].types.ts`
  - [ ] Definir interfaz `[Entity]`
  - [ ] Definir tipo `[Entity]Field` con campos permitidos
  - [ ] Definir `[Entity]FilterRequest`
  - [ ] Definir tipos de respuesta
- [ ] Exportar en `types/index.ts`
- [ ] Actualizar servicio con `filterPost()`
- [ ] Marcar métodos legacy como `@deprecated`
- [ ] Implementar en componentes Vue
- [ ] Probar filtros y paginación

---

## 📝 Ejemplos de Uso

### Filtro simple

```typescript
const response = await [entity]Service.filterPost({
  filters: [Filter.notNull('parent_id')],
  order_by: { column: 'name', direction: 'asc' },
});
```

### Múltiples filtros

```typescript
const response = await [entity]Service.filterPost({
  filters: [
    Filter.notNull('parent_id'),
    Filter.contains('name', 'busqueda'),
    Filter.greaterThan('id', 100),
  ],
  order_by: { column: 'created_at', direction: 'desc' },
  pagination: { page: 1, limit: 30 },
});
```

### Con paginación

```typescript
const response = await [entity]Service.filterPost({
  filters: [...],
  pagination: { page: currentPage, limit: itemsPerPage },
});

if (response.success) {
  items.value      = response.data;
  totalPages.value = response.meta.last_page;
}
```

---

## ⚠️ Consideraciones

- No eliminar métodos legacy hasta migración completa.
- Usar debounce en búsquedas por texto (300 ms recomendado).
- Tipos estrictos gracias a TypeScript.
- Reutilizar `FilterBuilder` para lógica compleja.
