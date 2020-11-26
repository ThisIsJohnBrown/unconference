<template>
  <v-app id="app">
    <Navbar
      :conferenceName="conference.name"
      :isAuthenticated="isAuthenticated"
    />
    <v-main>
      <router-view :isAuthenticated="isAuthenticated" />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
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
  async created() {},
  computed: {
    conference() {
      return this.$store.state.conferences.conference || null;
    },
    isAuthenticated() {
      return this.$store.getters[`user/isAuthenticated`];
    }
  },
  watch: {
    conference() {}
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "./scss/_main.scss";
</style>
