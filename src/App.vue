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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default {
  components: {
    Navbar,
    Footer
  },
  created() {
    this.$store.dispatch("bindSessions");
  }
};
</script>

<style lang="scss">
@import "./scss/_main.scss";
</style>
