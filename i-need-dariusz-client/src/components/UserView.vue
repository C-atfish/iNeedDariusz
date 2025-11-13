<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, reactive } from "vue";

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
  <v-card elevation="2" rounded="xl">
    <v-toolbar color="primary" density="comfortable" class="rounded-t-xl" dark>
      <v-toolbar-title class="font-weight-medium">Queue</v-toolbar-title>
      <v-spacer />
      <v-chip
        variant="elevated"
        color="white"
        text-color="primary"
        class="mr-2"
      >
        {{ queue.length }} in line
      </v-chip>
      <v-btn variant="tonal" color="white" class="text-primary" disabled>
        Join queue
      </v-btn>
    </v-toolbar>

    <v-divider />

    <!-- your status -->
    <v-alert
      v-if="myEntry"
      type="info"
      variant="tonal"
      class="mx-4 mt-4"
      border="start"
      border-color="primary"
    >
      <div class="d-flex align-center justify-space-between flex-wrap">
        <div class="mr-4">
          <div class="text-subtitle-1 font-weight-medium">
            You are <span class="text-primary">#111</span> in the queue
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Queued at {{ hhmm(myEntry.queuedAt) }} ({{
              timeAgo(myEntry.queuedAt)
            }})
          </div>
        </div>
        <v-chip color="primary" variant="elevated" size="large" class="my-2">
          Position #111
        </v-chip>
      </div>
    </v-alert>

    <!-- queue list -->
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
            #{{ index }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="mt-2" />

    <div class="d-flex justify-end pa-4">
      <v-btn variant="text" color="primary" @click="fetchQueue">Refresh</v-btn>
    </div>
  </v-card>
</template>
