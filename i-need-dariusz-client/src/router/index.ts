/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Try to load user once
  if (!auth.ready) {
    await auth.fetchMe();
  }

  const isLogin = to.path.toLowerCase() === "/login";
  const requiresAuth = to.meta?.requiresAuth === true;
  const isAuthed = !!auth.user;

  // Only block routes that explicitly require auth
  if (requiresAuth && !isAuthed) {
    return { path: "/login", query: { next: to.fullPath || "/" } };
  }

  // If user is already logged in, keep them away from /login
  if (isLogin && isAuthed) {
    return { path: (to.query.next as string) || "/" };
  }

  // otherwise allow navigation
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
