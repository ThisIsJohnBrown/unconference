import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Session from "../views/Session.vue";
import Profile from "../views/Profile.vue";
import UserProfile from "../views/Profile.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import About from "../views/About.vue";
import Create from "../views/Create.vue";
import Sessions from "../views/Sessions.vue";
import CodeOfConduct from "../views/CodeOfConduct.vue";
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
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/create",
    name: "Create",
    component: Create
  },
  {
    path: "/code-of-conduct",
    name: "CodeOfConduct",
    component: CodeOfConduct
  },
  {
    path: "/sessions",
    name: "Sessions",
    component: Sessions
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
    name: "UserProfile",
    component: UserProfile
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
  if (to.name === "Profile" && !store.state.user.uid) next({ name: "Home" });
  else next();
});

export default router;
