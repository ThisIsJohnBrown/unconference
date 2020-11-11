import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Session from "../views/Session.vue";
import Register from "../views/Register.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/session/:slug",
    name: "Session",
    component: Session
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  console.log(to.name, store.state.user.uid);
  if (to.name === "Register" && store.state.user.uid) next({ name: "Home" });
  else next();
});

export default router;
