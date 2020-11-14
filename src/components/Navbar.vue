<template>
  <v-layout row justify-center>
    <v-toolbar>
      <router-link :to="{ name: 'Home' }"
        ><v-img :src="logo"></v-img
      ></router-link>
      <v-toolbar-items>
        <v-btn
          v-for="item in nav"
          :key="item.icon"
          :to="{ name: item.to }"
          :title="item.title"
          text
          >{{ item.text }}</v-btn
        >
      </v-toolbar-items>
      <v-spacer></v-spacer>
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
    </v-toolbar>

    <!-- <v-toolbar dark color="blue-grey darken-3" class="hidden-sm-and-up">
      <v-toolbar-title>Mobile Menu</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-toolbar-side-icon dark slot="activator"></v-toolbar-side-icon>
        <v-card>
          <v-toolbar flat color="blue-grey darken-2">
            <v-toolbar-title>Mobile Menu</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-list>
            <v-list-tile v-for="(item, index) in nav" :key="index" to="#">
              <v-list-tile-action>
                <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title :title="item.title">{{
                  item.text
                }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-dialog>
    </v-toolbar> -->

    <!-- <v-container fluid>
      <v-slide-y-transition mode="out-in">
        <v-layout column align-center>
          <h1 class="display-1">Vuetify Desktop / Mobile navbar example</h1>
          <p>
            A quick demo of how to combine a desktop navigation and a mobile
            overlay (dialog) navigation menu.
          </p>
          <p>
            Resize the window to see the navbar change to mobile version.
          </p>
          <p>
            My deep gratitude towards the VueJS and Vuetify team!
          </p>
        </v-layout>
      </v-slide-y-transition>
    </v-container> -->
  </v-layout>
  <!-- <v-app-bar app color="white" flat>
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
  </v-app-bar> -->
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
    logo: require("@/assets/logo.svg"),
    dialog: false,
    nav: [
      {
        icon: "info",
        text: "Sessions",
        to: "Sessions",
        title: "See all sessions",
        active: false
      },
      {
        icon: "assignment_turned_in",
        text: "About",
        to: "About",
        title: "About",
        active: false
      },
      {
        icon: "email",
        text: "Code of Conduct",
        to: "CodeOfConduct",
        title: "Our code of conduct",
        active: false
      }
    ]
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
