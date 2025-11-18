<template>
  <v-card class="pa-4" max-width="500">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Lobby Chat</span>
      <v-chip
        :color="socketStore.isConnected ? 'green' : 'red'"
        size="small"
        label
      >
        {{ socketStore.isConnected ? "Online" : "Offline" }}
      </v-chip>
    </v-card-title>

    <v-card-text
      class="chat-messages"
      style="max-height: 250px; overflow-y: auto"
    >
      <div v-for="msg in socketStore.messages" :key="msg.id" class="mb-2">
        <strong>{{ msg.user || "Anon" }}:</strong>
        <span>{{ msg.text }}</span>
        <div class="text-caption text-disabled">
          {{ new Date(msg.createdAt).toLocaleTimeString() }}
        </div>
      </div>
      <div v-if="!socketStore.messages.length" class="text-medium-emphasis">
        No messages yet.
      </div>
    </v-card-text>

    <v-divider class="my-2" />

    <v-card-actions>
      <v-text-field
        v-model="message"
        label="Type a message"
        variant="outlined"
        hide-details
        density="compact"
        class="flex-grow-1 mr-2"
        @keyup.enter="handleSend"
      />
      <v-btn color="primary" @click="handleSend">Send</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useSocketStore } from "@/stores/sockets";
import { useUserStore } from "@/stores/user";

const socketStore = useSocketStore();
const userStore = useUserStore();

const message = ref("");

onMounted(() => {
  socketStore.connect();
  socketStore.getMessages();
});

onBeforeUnmount(() => {
  socketStore.disconnect();
});

function handleSend() {
  const text = message.value.trim();
  if (!text) return;
  socketStore.sendMessage(text, userStore.name ? userStore.name : "Guest");
  message.value = "";
}
</script>
