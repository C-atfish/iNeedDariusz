import { defineStore } from "pinia";

export type QueueItem = {
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

export const useQueueStore = defineStore("queue", {
  state: () => ({
    queue: [] as QueueItem[],
  }),

  actions: {
    async fetchQueue() {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/queue/waiting`
      );
      let queueRes = await res.json();
      console.log("queueRes");
      console.log(queueRes);

      queueRes = queueRes.map((item: any) => ({
        ...item,

        queuedAt: new Date(item.queuedAt),
        startedAt: item.startedAt ? new Date(item.startedAt) : undefined,
        endsAt: item.endsAt ? new Date(item.endsAt) : undefined,
      }));

      this.queue = queueRes;

      return queueRes;
    },
    async startQueueItem(id: string) {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/queue/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            status: "meeting",
          }),
        }
      );
    },
    async finnishQueueItem(id: string) {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/queue/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            status: "completed",
          }),
        }
      );
    },
  },
});
