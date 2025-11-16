<template>
  <v-app>
    <!-- Header -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title class="font-weight-medium">
        I need Dariusz
      </v-toolbar-title>

      <v-spacer />

      <!-- Show user info once loaded -->
      <template v-if="authStore.user">
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="d-flex align-center text-none"
            >
              <v-avatar size="36" class="mr-2">
                <v-img :src="authStore.user.picture" alt="avatar" />
              </v-avatar>
              <span class="text-truncate">{{ authStore.user.name }}</span>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title class="font-weight-medium">{{
                authStore.user.name
              }}</v-list-item-title>
              <v-list-item-subtitle>{{
                authStore.user.email
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider />
            <v-list-item @click="doLogout">
              <v-list-item-title>Log out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <v-container class="py-8">
        <AdminView
          v-if="
            authStore.user?.email === 'jonarlarsgard@gmail.com' ||
            authStore.user?.email === 'dariuszksiazek1@gmail.com'
          "
        />
        <UserView v-else />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import AdminView from "@/components/AdminView.vue";
import UserView from "@/components/UserView.vue";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

onMounted(async () => {
  if (!authStore.ready) await authStore.fetchMe();
});

async function doLogout() {
  await authStore.logout();
  location.href = "/login";
}
</script>
