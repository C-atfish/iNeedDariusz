<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";

type QueueEntry = {
  id: string;
  name: string;
  queuedAt: Date;
  email?: string;
};

// 👉 mock data
const mockQueue = ref<QueueEntry[]>([
  {
    id: "u1",
    name: "Dariusz K.",
    queuedAt: new Date(Date.now() - 1000 * 60 * 11),
    email: "dariusz@example.com",
  },
  { id: "u2", name: "Maya S.", queuedAt: new Date(Date.now() - 1000 * 60 * 8) },
  {
    id: "u3",
    name: "Jonar L.",
    queuedAt: new Date(Date.now() - 1000 * 60 * 4),
    email: "you@example.com",
  }, // you
  { id: "u4", name: "Alex R.", queuedAt: new Date(Date.now() - 1000 * 60 * 2) },
]);

// pretend we know who the current user is
const currentUserEmail = "you@example.com";

// keep a ticking ref to refresh "time ago"
const now = ref(Date.now());
let timer: number | undefined;
onMounted(() => {
  timer = window.setInterval(() => (now.value = Date.now()), 30_000); // update every 30s
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

// position is simply index in FIFO by queuedAt
const queue = computed(() =>
  [...mockQueue.value]
    .sort((a, b) => a.queuedAt.getTime() - b.queuedAt.getTime())
    .map((entry, i) => ({ ...entry, position: i + 1 }))
);

const myEntry = computed(
  () => queue.value.find((q) => q.email === currentUserEmail) || null
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
            You are <span class="text-primary">#{{ myEntry.position }}</span> in
            the queue
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Queued at {{ hhmm(myEntry.queuedAt) }} ({{
              timeAgo(myEntry.queuedAt)
            }})
          </div>
        </div>
        <v-chip color="primary" variant="elevated" size="large" class="my-2">
          Position #{{ myEntry.position }}
        </v-chip>
      </div>
    </v-alert>

    <!-- queue list -->
    <v-list lines="two" class="py-0">
      <v-list-item v-for="item in queue" :key="item.id" class="px-4">
        <template #prepend>
          <v-avatar color="primary" class="elevation-1">
            <span class="text-white">{{
              item.name.charAt(0).toUpperCase()
            }}</span>
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-medium">
          {{ item.name }}
          <v-chip
            v-if="item.email === currentUserEmail"
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
            :color="item.email === currentUserEmail ? 'secondary' : 'primary'"
            variant="flat"
            class="font-weight-medium"
          >
            #{{ item.position }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="mt-2" />

    <div class="d-flex justify-end pa-4">
      <v-btn variant="text" color="primary">Refresh</v-btn>
    </div>
  </v-card>
</template>
