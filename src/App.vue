<template>
  <div id="app">
    <Navbar />
    <div class="container is-fluid">
      <router-view />
    </div>
    <Footer />
  </div>
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
    this.$store.dispatch("bindSessions");
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$store.commit({
          type: "loginUser",
          user
        });
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
