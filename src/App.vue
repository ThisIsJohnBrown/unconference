<template>
  <v-app id="app">
    <Navbar />
    <v-content>
      <router-view />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import { auth } from "@/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default {
  components: {
    Navbar,
    Footer
  },
  created() {
    this.$store.dispatch("bindConference", process.env.VUE_APP_CONFERENCE_ID);
    this.$store.dispatch("bindSessions", process.env.VUE_APP_CONFERENCE_ID);
    this.$store.dispatch("bindSessionCreators");
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$store.commit({
          type: "loginUser",
          user
        });
        this.$store.dispatch("bindUser", user.uid);
      } else {
        this.$store.commit({
          type: "logoutUser"
        });
      }
    });
  }
};
</script>

<style lang="scss">
@import "./scss/_main.scss";
</style>
