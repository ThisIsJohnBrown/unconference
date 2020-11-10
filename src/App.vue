<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
console.log(Navbar);
export default {
  components: {
    Navbar
  }
};
</script>

<style lang="scss">
@import "./scss/_main.scss";
</style>
