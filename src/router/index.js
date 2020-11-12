import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Session from "../views/Session.vue";
import Profile from "../views/Profile.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
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
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/session/:slug",
    name: "Session",
    component: Session
  },
  {
    path: "/me",
    name: "Profile",
    component: Profile
  },
  {
    path: "/user/:username",
    name: "Profile",
    component: Profile
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name === "Register" && store.state.user.uid) next({ name: "Home" });
  if (to.name === "Login" && store.state.user.uid) next({ name: "Home" });
  else next();
});

export default router;
