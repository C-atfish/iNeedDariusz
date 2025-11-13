<!-- src/pages/index.vue -->
<template>
  <v-app>
    <v-main>
      <v-container
        class="fill-height d-flex flex-column align-center justify-center text-center"
      >
        <h1 class="text-h3 mb-4">Do you need Dariusz? Dont we all?</h1>

        <p class="text-body-1 mb-8">
          Sign in to save your queue history, or continue as a guest.
        </p>

        <div class="d-flex flex-column flex-sm-row ga-4">
          <v-btn
            color="primary"
            size="large"
            class="mb-4 mb-sm-0"
            @click="signInWithGoogle"
          >
            Sign in with Google
          </v-btn>

          <v-btn variant="outlined" size="large" @click="continueAsGuest">
            Continue as guest
          </v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// If already logged in, don't show landing – go straight to app
onMounted(async () => {
  if (!authStore.ready) {
    await authStore.fetchMe();
  }
  if (authStore.user) {
    router.replace("/app");
  }
});

const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_BASE}/api/auth/google`;

function signInWithGoogle() {
  const next = (route.query.next as string) || "/app";
  const url = `${GOOGLE_LOGIN_URL}?next=${encodeURIComponent(next)}`;
  window.location.href = url;
}

function continueAsGuest() {
  const next = (route.query.next as string) || "/app";
  router.push(next);
}
</script>
