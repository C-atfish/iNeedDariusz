<template>
  <main style="min-height: 70vh; display: grid; place-items: center">
    <div>
      <h2>Signing you in…</h2>
      <p v-if="!redirected">
        If nothing happens,
        <a :href="googleUrl">click here</a>.
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const API_BASE = import.meta.env.VITE_API_BASE as string;
const FRONTEND_BASE = import.meta.env.VITE_FRONTEND_BASE as string;

const params = new URLSearchParams(location.search);
const next = params.get("next") || "/";
const googleUrl = `${API_BASE}/api/auth/google?next=${encodeURIComponent(
  next
)}`;

const redirected = ref(false);
onMounted(() => {
  redirected.value = true;
  window.location.href = googleUrl;
});
</script>
