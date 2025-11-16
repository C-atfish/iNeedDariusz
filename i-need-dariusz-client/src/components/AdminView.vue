<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

type Status = "queued" | "active" | "done";
type QueueItem = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  queuedAt: Date;
  status: Status;
  startedAt?: Date;
  endsAt?: Date;
};

const FIVE_MIN = 5 * 60 * 1000;
const now = ref(Date.now());
let timer: number | undefined;

// --- Mock data (replace with backend later)
const items = reactive<QueueItem[]>([
  {
    id: "u1",
    user: {
      name: "Dariusz K.",
      email: "dariusz@example.com",
    },
    queuedAt: new Date(Date.now() - 11 * 60_000),
    status: "queued",
  },
  {
    id: "u2",
    user: {
      name: "Maya S.",
      email: "maya@example.com",
    },
    queuedAt: new Date(Date.now() - 8 * 60_000),
    status: "queued",
  },
  {
    id: "u3",
    user: {
      name: "Jonar L.",
      email: "jonar@example.com",
    },
    queuedAt: new Date(Date.now() - 4 * 60_000),
    status: "queued",
  },
  {
    id: "u4",
    user: {
      name: "Alex R.",
      email: "alex@example.com",
    },
    queuedAt: new Date(Date.now() - 2 * 60_000),
    status: "queued",
  },
]);

// Tick every second for live countdowns
onMounted(() => {
  timer = window.setInterval(() => (now.value = Date.now()), 1000);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

// Derived groups
const activeItems = computed(() => items.filter((i) => i.status === "active"));
const queuedItems = computed(() =>
  [...items]
    .filter((i) => i.status === "queued")
    .sort((a, b) => a.queuedAt.getTime() - b.queuedAt.getTime())
    .map((item, idx) => ({ ...item, position: idx + 1 }))
);
const doneItems = computed(() =>
  items
    .filter((i) => i.status === "done")
    .sort(
      (a, b) => (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0)
    )
);

// Actions
function startItem(id: string) {
  const it = items.find((i) => i.id === id && i.status === "queued");
  if (!it) return;
  const start = new Date();
  it.status = "active";
  it.startedAt = start;
  it.endsAt = new Date(start.getTime() + FIVE_MIN);
}

function startNext() {
  const next = queuedItems.value[0];
  if (next) startItem(next.id);
}

function cancelItem(id: string) {
  const it = items.find((i) => i.id === id && i.status === "active");
  if (!it) return;
  it.status = "queued";
  it.startedAt = undefined;
  it.endsAt = undefined;
}

function completeItem(id: string) {
  const it = items.find((i) => i.id === id && i.status === "active");
  if (!it) return;
  it.status = "done";
}

function remainingMs(it: QueueItem) {
  if (it.status !== "active" || !it.endsAt) return 0;
  return Math.max(0, it.endsAt.getTime() - now.value);
}

function formatMMSS(ms: number) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function progressPct(it: QueueItem) {
  if (it.status !== "active" || !it.startedAt || !it.endsAt) return 0;
  const elapsed = now.value - it.startedAt.getTime();
  return Math.min(100, Math.max(0, (elapsed / FIVE_MIN) * 100));
}

function hhmm(d: Date) {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
</script>

<template>
  <v-card elevation="2" rounded="xl">
    <v-toolbar color="secondary" class="rounded-t-xl" density="comfortable">
      <v-toolbar-title class="font-weight-medium">Admin Queue</v-toolbar-title>
      <v-spacer />
      <v-chip
        class="mr-2"
        color="white"
        text-color="secondary"
        variant="elevated"
      >
        {{ queuedItems.length }} queued
      </v-chip>
      <v-chip
        class="mr-2"
        color="white"
        text-color="secondary"
        variant="elevated"
      >
        {{ activeItems.length }} active
      </v-chip>
      <v-btn
        color="white"
        class="text-secondary"
        variant="tonal"
        @click="startNext"
        :disabled="!queuedItems.length"
      >
        Start next
      </v-btn>
    </v-toolbar>

    <!-- Active items -->
    <v-expand-transition>
      <div v-if="activeItems.length" class="pa-4">
        <div class="text-subtitle-1 mb-2">In progress</div>

        <v-row dense>
          <v-col v-for="it in activeItems" :key="it.id" cols="12" md="6">
            <v-card variant="tonal" color="secondary" class="h-100">
              <v-card-title class="d-flex align-center">
                <v-avatar color="secondary" class="mr-3">
                  <span class="text-white">{{
                    it.user.name.charAt(0).toUpperCase()
                  }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ it.user.name }}</div>
                  <div class="text-caption text-medium-emphasis">
                    Started at {{ it.startedAt ? hhmm(it.startedAt) : "-" }}
                  </div>
                </div>
                <v-spacer />
                <v-chip color="secondary" variant="elevated">
                  {{ formatMMSS(remainingMs(it)) }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <v-progress-linear
                  :model-value="progressPct(it)"
                  height="10"
                  rounded
                  color="secondary"
                />
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="secondary"
                  variant="flat"
                  @click="completeItem(it.id)"
                  >Complete</v-btn
                >
                <v-btn color="grey" variant="text" @click="cancelItem(it.id)"
                  >Cancel</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>

    <v-divider />

    <!-- Queued list -->
    <div class="pa-4">
      <div class="d-flex align-center mb-2">
        <div class="text-subtitle-1">Waiting</div>
        <v-spacer />
        <v-btn variant="text" @click="/* hook for real refresh later */ null"
          >Refresh</v-btn
        >
      </div>

      <v-list v-if="queuedItems.length" lines="two" class="py-0">
        <v-list-item v-for="it in queuedItems" :key="it.id" class="px-4">
          <template #prepend>
            <v-avatar color="primary" class="elevation-1">
              <span class="text-white">{{
                it.user.name.charAt(0).toUpperCase()
              }}</span>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-medium">
            {{ it.user.name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            Queued at {{ hhmm(it.queuedAt) }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center">
              <v-chip class="mr-3" color="primary" variant="flat"
                >#{{ it.position }}</v-chip
              >
              <v-btn color="primary" variant="flat" @click="startItem(it.id)"
                >Start</v-btn
              >
            </div>
          </template>
        </v-list-item>
      </v-list>

      <v-alert
        v-else
        type="info"
        variant="tonal"
        border="start"
        border-color="primary"
      >
        No one is waiting in the queue.
      </v-alert>
    </div>

    <v-divider />

    <!-- Recently completed -->
    <div class="pa-4">
      <div class="text-subtitle-1 mb-2">Recently completed</div>
      <v-chip
        v-for="it in doneItems.slice(0, 6)"
        :key="it.id"
        class="mr-2 mb-2"
        color="success"
        variant="flat"
      >
        {{ it.user.name }}
      </v-chip>
      <div v-if="!doneItems.length" class="text-medium-emphasis text-body-2">
        No completed items yet.
      </div>
    </div>
  </v-card>
</template>
