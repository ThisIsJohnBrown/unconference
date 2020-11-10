<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  components: {
    Navbar
  },
  created() {
    this.$store.dispatch("bindSessions");
  }
};
</script>

<style lang="scss">
@import "./scss/_main.scss";
</style>
