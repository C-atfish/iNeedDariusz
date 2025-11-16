import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: "" as string,
    name: "" as string,
    email: "" as string,
    isAdmin: false as boolean,
  }),

  getters: {
    isLoggedIn: (state) => !!state.email,
  },

  actions: {
    setUser(payload: {
      id: string;
      name: string;
      email: string;
      isAdmin?: boolean;
    }) {
      this.id = payload.id;
      this.name = payload.name;
      this.email = payload.email;
      this.isAdmin = !!payload.isAdmin;
    },
    logout() {
      this.id = "";
      this.name = "";
      this.email = "";
      this.isAdmin = false;
    },
  },
});
