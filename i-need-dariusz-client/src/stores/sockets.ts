import { defineStore } from "pinia";
import { ref } from "vue";
import { io, type Socket } from "socket.io-client";

export type ChatMessage = {
  id: string;
  text: string;
  user?: string;
  createdAt: string;
};

let socket: Socket | null = null;

export const useSocketStore = defineStore("socket", () => {
  const isConnected = ref(false);
  const messages = ref<ChatMessage[]>([]);

  function connect() {
    if (socket?.connected) return;

    socket = io(import.meta.env.VITE_API_BASE, {});

    socket.on("connect", () => {
      isConnected.value = true;
      console.log("Socket connected", socket?.id);
    });

    socket.on("disconnect", () => {
      isConnected.value = false;
      console.log("Socket disconnected");
    });

    socket.on("chat:message", (msg: ChatMessage) => {
      messages.value.push(msg);
    });
  }

  function disconnect() {
    if (!socket) return;
    socket.disconnect();
    socket = null;
    isConnected.value = false;
  }

  function sendMessage(text: string, user?: string) {
    if (!socket) {
      connect(); // optional auto-connect
    }
    if (!socket) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      user,
      createdAt: new Date().toISOString(),
    };

    socket.emit("chat:message", msg);
    messages.value.push(msg);
  }

  return {
    isConnected,
    messages,
    connect,
    disconnect,
    sendMessage,
  };
});
