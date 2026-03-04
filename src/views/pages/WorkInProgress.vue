<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" class="text-center">
                <v-card elevation="10" class="pa-5">
                    <v-card-title class="text-h4">
                        <v-icon size="x-large" class="mr-2">mdi-cogs</v-icon>
                        Módulo en Construcción
                    </v-card-title>
                    <v-card-text class="text-h6 my-4">
                        Estamos trabajando para traerte nuevas funcionalidades. ¡Vuelve pronto!
                    </v-card-text>
                    <v-btn color="primary" @click="goHome">
                        <v-icon left>mdi-home</v-icon>
                        Ir al Inicio
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push({ name: 'Home' });
};
</script>

<style scoped>
.fill-height {
    min-height: 80vh;
}
</style>
