<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, reactive } from "vue";

import UserQueue from "./UserQueue.vue";
</script>

<template>
  <v-card elevation="2" rounded="xl">
    <v-toolbar color="primary" density="comfortable" class="rounded-t-xl" dark>
      <v-toolbar-title class="font-weight-medium">Queue</v-toolbar-title>
      <v-spacer />

      <v-btn variant="tonal" color="white" class="text-primary" disabled>
        Join queue
      </v-btn>
    </v-toolbar>

    <v-divider />

    <UserQueue />
    <!-- your status -->
    <!--     <v-alert
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
    </v-alert> -->

    <v-divider class="mt-2" />

    <div class="d-flex justify-end pa-4">
      <v-btn variant="text" color="primary" disabled>Refresh</v-btn>
    </div>
  </v-card>
</template>
