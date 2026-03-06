<template>
    <div class="pa-3 d-flex flex-column align-center justify-center h-100vh mh-100 auth">
        <div class="d-flex align-center mb-8">
            <img src="@/assets/images/logos/logo-paper.png" height="100" alt="logo" />
        </div>
        <h2 class="text-h2 font-weight-semibold">Restablecer Contraseña</h2>
        <p class="text-subtitle-1 text-medium-emphasis mt-3">
            Ingresa tu nueva contraseña.
        </p>
        <div class="pa-sm-7 pa-4 w-100" style="max-width: 400px;">
            <v-card class="pa-4">
                <v-form @submit.prevent="submit">
                    <v-label class="text-subtitle-1 font-weight-semibold pb-2">Nueva Contraseña</v-label>
                    <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" required
                        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPassword = !showPassword"></v-text-field>

                    <v-label class="text-subtitle-1 font-weight-semibold pb-2">Confirmar Contraseña</v-label>
                    <v-text-field v-model="password_confirmation" :type="showPassword ? 'text' : 'password'" required
                        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPassword = !showPassword"></v-text-field>

                    <v-btn size="large" class="mt-2" color="primary" block type="submit">Restablecer</v-btn>
                </v-form>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { showSwal, confirmSwal } from "@/utils/alerts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const password = ref('');
const password_confirmation = ref('');
const showPassword = ref(false);

const email = ref(route.query.email as string);
const token = ref(route.query.token as string);

const submit = async () => {
    if (password.value !== password_confirmation.value) {
        showSwal({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden.',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    try {
        await authStore.resetPassword(token.value, email.value, password.value, password_confirmation.value);
        showSwal({
            icon: 'success',
            title: 'Éxito',
            text: 'Contraseña restablecida con éxito.',
            confirmButtonText: 'Aceptar',
        }).then(() => {
            router.push('/auth/login');
        });
    } catch (error: any) {
        showSwal({
            icon: 'error',
            title: 'Error',
            text: error.message,
            confirmButtonText: 'Aceptar',
        });
    }
};
</script>
