/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import { useAuth } from "@/stores/auth"; // ⟵ add this

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const auth = useAuth();
router.beforeEach(async (to) => {
  if (!auth.ready.value) await auth.fetchMe();

  const isLogin = to.path.toLowerCase() === "/login";
  const isPublic = Boolean(to.meta?.public) || isLogin;
  const isAuthed = Boolean(auth.user.value);

  if (!isPublic && !isAuthed) {
    return { path: "/login", query: { next: to.fullPath || "/" } };
  }
  if (isLogin && isAuthed) {
    return { path: "/" };
  }
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
