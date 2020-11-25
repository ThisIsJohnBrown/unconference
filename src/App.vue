<template>
  <v-app id="app">
    <Navbar />
    <v-main>
      <router-view />
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
  async created() {
    await this.$store.dispatch(
      "conferences/bindConference",
      process.env.VUE_APP_CONFERENCE_ID
    );
    this.$store.dispatch(
      "sessions/bindSessions",
      process.env.VUE_APP_CONFERENCE_ID
    );
    await this.$store.dispatch("user/bindUserOwned");
    this.$store.dispatch("user/bindUserWatched");
  },
  computed: {
    conference() {
      return this.$store.state.conferences.conference || null;
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
