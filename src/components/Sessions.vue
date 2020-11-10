<template>
  <div class="container">
    <div class="columns">
      <div class="column" v-for="(session, i) in sessions" v-bind:key="i">
        <SessionInfoCard v-bind:session="session" />
      </div>
    </div>
  </div>
</template>

<script>
import SessionInfoCard from "@/components/SessionInfoCard";
export default {
  name: "Sessions",
  computed: {
    sessions() {
      if (this.$store.state.sessions) {
        return [...this.$store.state.sessions].splice(0, 3);
      }
      return [];
    }
  },
  components: {
    SessionInfoCard
  }
};
</script>

<style lang="scss" scoped>
.card {
  border: solid white 2px;
}
</style>
