<template>
  <UiParentCard title="Rubros Presupuestarios">
    <v-row class="mb-4">
      <v-col cols="12" class="text-right">
        <v-btn color="primary" @click="dialog = true">
          <v-icon left>mdi-plus</v-icon>
          Nuevo Rubro
        </v-btn>
      </v-col>
    </v-row>
    <List
      :categories="categories"
      :loading="loading"
      @edit="editItem"
      @delete="deleteItem">
    </List>
  </UiParentCard>

  <!-- Dialog for new/edit category -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.name"
                label="Nombre del Rubro"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.description"
                label="Descripción"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import List from "./components/list.vue";

const loading = ref(true);
const categories = ref<any[]>([]);

// Dialog state
const dialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  id: null,
  name: "",
  description: "",
  type: "Gasto",
});
const defaultItem = {
  id: null,
  name: "",
  description: "",
  type: "Gasto",
};

const formTitle = computed(() => {
  return editedIndex.value === -1 ? "Nuevo Rubro" : "Editar Rubro";
});

// Mock data fetching
onMounted(() => {
  setTimeout(() => {
    categories.value = [
      {
        id: 1,
        name: "Salarios",
        description: "Pagos de nómina a empleados",
        type: "Gasto",
      },
      {
        id: 2,
        name: "Venta de Servicios",
        description: "Ingresos por consultoría y desarrollo",
        type: "Ingreso",
      },
      {
        id: 3,
        name: "Renta de Oficina",
        description: "Alquiler mensual de las instalaciones",
        type: "Gasto",
      },
      {
        id: 4,
        name: "Marketing Digital",
        description: "Gastos en campañas de publicidad online",
        type: "Gasto",
      },
      {
        id: 5,
        name: "Venta de Productos",
        description: "Ingresos por venta de licencias de software",
        type: "Ingreso",
      },
    ];
    loading.value = false;
  }, 1500);
});

// CRUD functions
function editItem(item: any) {
  editedIndex.value = categories.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

function deleteItem(item: any) {
  const index = categories.value.indexOf(item);
  if (confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
    categories.value.splice(index, 1);
  }
}

function close() {
  dialog.value = false;
  editedItem.value = Object.assign({}, defaultItem);
  editedIndex.value = -1;
}

function save() {
  if (editedIndex.value > -1) {
    // Edit
    Object.assign(categories.value[editedIndex.value], editedItem.value);
  } else {
    // New
    editedItem.value.id = Date.now(); // Mock ID
    categories.value.push(Object.assign({}, editedItem.value));
  }
  close();
}
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
