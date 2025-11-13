import { defineStore } from "pinia";
import { apiFetch } from "@/api";

type User = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    ready: false,
    fetching: null as Promise<void> | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    async fetchMe() {
      if (this.fetching) return this.fetching;

      this.fetching = (async () => {
        try {
          const data = await apiFetch<{ ok: boolean; user?: User }>(
            "/api/auth/me"
          );
          this.user = data.user ?? null;
        } catch {
          this.user = null;
        } finally {
          this.ready = true;
          this.fetching = null;
        }
      })();

      return this.fetching;
    },

    async logout() {
      await apiFetch("/api/auth/logout", { method: "POST" });
      this.user = null;
    },
  },
});
