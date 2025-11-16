<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const name = ref("fdsf");

const email = ref("asas");

onMounted(() => {
  console.log("userStore");

  if (authStore.user?.email) {
    email.value = authStore.user.email;
  }
  if (authStore.user?.name) {
    name.value = authStore.user.name;
  }
});

async function joinQueue() {
  console.log("join queue");
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/queue/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
    }),
  });
}
</script>

<template>
  <v-card elevation="2" rounded="xl">
    <v-form>
      <v-text-field
        v-model="name"
        label="Your name"
        variant="filled"
        color="white"
        class="text-primary"
        required
      />
      <v-text-field
        v-model="email"
        label="Your email"
        variant="filled"
        color="white"
        class="text-primary"
        required
      />
      <v-btn
        variant="tonal"
        color="white"
        class="text-primary"
        @click="joinQueue"
      >
        Join queue
      </v-btn>
    </v-form>
  </v-card>
</template>
