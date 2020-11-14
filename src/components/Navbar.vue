<template>
  <v-app-bar app color="white" flat>
    <v-container class="py-0 fill-height">
      <router-link :to="{ name: 'Home' }"
        ><v-img :src="logo"></v-img
      ></router-link>

      <v-spacer></v-spacer>

      <v-responsive max-width="260">
        <div v-if="!isAuthenticated">
          <v-btn tile class="ma-2" color="primary" :to="{ name: 'Register' }">
            Register!
          </v-btn>

          <v-btn
            tile
            class="ma-2"
            outlined
            :to="{ name: 'Login' }"
            color="primary"
          >
            Login!
          </v-btn>
        </div>
        <div v-else>
          <v-btn
            tile
            class="ma-2"
            outlined
            color="indigo"
            :to="{ name: 'Profile' }"
          >
            Profile
          </v-btn>
          <v-btn
            tile
            class="ma-2"
            outlined
            color="indigo"
            @click.prevent="logout"
          >
            Log out
          </v-btn>
        </div>
      </v-responsive>
    </v-container>
  </v-app-bar>
</template>

<script>
import { logout } from "@/firebase";

export default {
  name: "Navbar",
  methods: {
    logout
  },
  data: () => ({
    links: ["Dashboard", "Messages", "Profile", "Updates"],
    logo: require("@/assets/logo.svg")
  }),
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
