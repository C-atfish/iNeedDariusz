<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type QueueItem = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  queuedAt: Date;
  status: string;
  startedAt?: Date;
  endsAt?: Date;
};

async function fetchQueue() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/queue/waiting`);
  return res.json();
}

const queue = ref<QueueItem[]>([]);

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
  () => queue.value.find((q) => q.user.email === currentUserEmail) || null
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
  const raw = await fetchQueue();

  queue.value = raw.map((item: any) => ({
    ...item,

    queuedAt: new Date(item.queuedAt),
    startedAt: item.startedAt ? new Date(item.startedAt) : undefined,
    endsAt: item.endsAt ? new Date(item.endsAt) : undefined,
  }));
});
</script>

<template>
  <v-chip variant="elevated" color="white" text-color="primary" class="mr-2">
    {{ queue.length }} in line
  </v-chip>
  <v-list lines="two" class="py-0">
    <v-list-item v-for="(item, index) in queue" :key="item.id" class="px-4">
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
