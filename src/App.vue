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
  data() {
    return {
      user: null
    };
  },
  components: {
    Navbar,
    Footer
  },
  created() {
    this.$store.dispatch("bindConference", process.env.VUE_APP_CONFERENCE_ID);
    this.$store.dispatch("bindSessions", process.env.VUE_APP_CONFERENCE_ID);
  },
  computed: {
    conference() {
      return this.$store.state.conference || null;
    }
  },
  watch: {
    conference() {
      if (!this.$store.state.userDetails.username && this.user) {
        this.$store.dispatch("bindUser", this.user.uid);
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        if (this.conference) {
          this.$store.commit({
            type: "loginUser",
            user
          });
        }
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
