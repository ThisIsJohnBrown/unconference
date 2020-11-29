<template>
  <v-layout row justify-center>
    <v-toolbar class="hidden-sm-and-down">
      <v-toolbar-title
        ><router-link :to="{ name: 'Home' }" data-cy="navbar-home-button"
          ><v-img :src="logo" width="40px"></v-img></router-link
        >{{ conferenceName }}</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          v-for="item in nav"
          :key="item.icon"
          :to="{ name: item.to }"
          :title="item.title"
          text
          :data-cy="item.cy"
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
          data-cy="navbar-login-button"
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
          data-cy="navbar-profile-button"
        >
          Profile
        </v-btn>
        <v-btn
          tile
          class="ma-2"
          outlined
          color="indigo"
          @click.prevent="logout"
          data-cy="navbar-logout-button"
        >
          Log out
        </v-btn>
      </div>
    </v-toolbar>
    <v-app-bar class="hidden-md-and-up" dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title
        ><v-img :src="logo" width="40px"></v-img
      ></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="item in nav"
            :key="item.icon"
            :to="{ name: item.to }"
            ><v-list-item-title>{{ item.text }}</v-list-item-title></v-list-item
          >
          <v-list-item :to="{ name: 'Register' }" v-if="!isAuthenticated">
            <v-list-item-title>Register</v-list-item-title></v-list-item
          >
          <v-list-item :to="{ name: 'Login' }" v-if="!isAuthenticated">
            <v-list-item-title>Login</v-list-item-title></v-list-item
          >
          <v-list-item :to="{ name: 'Profile' }" v-if="isAuthenticated">
            <v-list-item-title>Profile</v-list-item-title></v-list-item
          >
          <v-list-item :to="{ name: 'Logout' }" v-if="isAuthenticated">
            <v-list-item-title>Logout</v-list-item-title></v-list-item
          >
        </v-list>
      </v-menu>
    </v-app-bar>
  </v-layout>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
    }
  },
  data: () => ({
    links: ["Dashboard", "Messages", "Profile", "Updates"],
    logo: require("@/assets/logo-round.png"),
    dialog: false,
    nav: [
      {
        text: "Sessions",
        to: "Sessions",
        title: "See all sessions",
        active: false,
        cy: "navbar-sessions-button"
      },
      {
        text: "About",
        to: "About",
        title: "About",
        active: false,
        cy: "navbar-about-button"
      },
      {
        text: "Create",
        to: "Create",
        title: "Create",
        active: false,
        cy: "navbar-create-button"
      },
      {
        text: "Code of Conduct",
        to: "CodeOfConduct",
        title: "Our code of conduct",
        active: false,
        cy: "navbar-codeofconduct-button"
      }
    ]
  }),
  computed: {},
  props: ["isAuthenticated", "conferenceName"]
};
</script>

<style lang="scss" scoped>
.logo {
  fill: black;
}
</style>
