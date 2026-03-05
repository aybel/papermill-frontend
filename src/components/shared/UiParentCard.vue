<script setup lang="ts">
const props = defineProps({
    title: String,
    class: String
});
</script>

// ===============================|| Ui Parent Card||=============================== //
<template>
    <v-card elevation="10" class="withbg">
        <v-card-item class="pa-0">
            <div class="">
                <h5 class="text-h5 mb-0">{{ title }}</h5>
                <slot name="action"></slot>
            </div>
        </v-card-item>

        <v-divider />

        <v-card-text class="pt-0 px-7 pb-7">
            <slot />
        </v-card-text>
    </v-card>
</template>
