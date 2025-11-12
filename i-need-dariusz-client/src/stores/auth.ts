import { ref } from "vue";
import { apiFetch } from "@/api";

type User = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

const user = ref<User | null>(null);
const ready = ref(false);
let fetching: Promise<void> | null = null;

async function fetchMe() {
  if (fetching) return fetching;
  fetching = (async () => {
    try {
      const data = await apiFetch<{ ok: boolean; user?: User }>("/api/auth/me");
      user.value = data.user || null;
    } catch {
      user.value = null;
    } finally {
      ready.value = true;
      fetching = null;
    }
  })();
  return fetching;
}

async function logout() {
  await apiFetch("/api/auth/logout", { method: "POST" });
  user.value = null;
}

export function useAuth() {
  return { user, ready, fetchMe, logout };
}
