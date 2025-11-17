<script lang="ts" setup>
import { useQueueStore } from "@/stores/queue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const queueStore = useQueueStore();

const currentUserEmail = "you@example.com";

const now = ref(Date.now());
let timer: number | undefined;
onMounted(() => {
  timer = window.setInterval(() => (now.value = Date.now()), 30_000); // update every 30s
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const myEntry = computed(
  () => queueStore.queue.find((q) => q.user.email === currentUserEmail) || null
);

function timeAgo(d: Date) {
  const diff = Math.max(0, now.value - d.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h${rem ? ` ${rem}m` : ""} ago`;
}

function hhmm(d: Date) {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

onMounted(async () => {
  queueStore.fetchQueue();
});
</script>

<template>
  <v-chip variant="elevated" color="white" text-color="primary" class="mr-2">
    {{ queueStore.queue.length }} in line
  </v-chip>
  <v-list lines="two" class="py-0">
    <v-list-item
      v-for="(item, index) in queueStore.queue"
      :key="item.id"
      class="px-4"
    >
      <template #prepend>
        <v-avatar color="primary" class="elevation-1">
          <span class="text-white">{{
            item.user.name.charAt(0).toUpperCase()
          }}</span>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-medium">
        {{ item.user.name }}
        <v-chip
          v-if="item.user.email === currentUserEmail"
          size="x-small"
          color="secondary"
          class="ml-2"
          label
          variant="elevated"
        >
          you
        </v-chip>
      </v-list-item-title>

      <v-list-item-subtitle>
        Queued at {{ hhmm(item.queuedAt) }} • {{ timeAgo(item.queuedAt) }}
      </v-list-item-subtitle>

      <template #append>
        <v-chip
          :color="
            item.user.email === currentUserEmail ? 'secondary' : 'primary'
          "
          variant="flat"
          class="font-weight-medium"
        >
          #{{ index + 1 }}
        </v-chip>
      </template>
    </v-list-item>
  </v-list>
</template>
