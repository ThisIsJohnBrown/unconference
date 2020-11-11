<template>
  <nav class="navbar is-white" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link :to="{ name: 'Home' }" class="navbar-item"
        ><img class="logo" src="../assets/logo.svg"
      /></router-link>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start"></div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <router-link
              class="button is-black"
              :to="{ name: 'Register' }"
              v-if="!isAuthenticated"
            >
              Register!
            </router-link>
            <router-link
              class="button is-black"
              :to="{ name: 'Login' }"
              v-if="!isAuthenticated"
            >
              Log in
            </router-link>
            <a v-else class="button is-black" @click.prevent="logout">
              Log out
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { logout } from "@/firebase";

export default {
  name: "Navbar",
  methods: {
    logout
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.user?.uid;
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  fill: black;
}
</style>
