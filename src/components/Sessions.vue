<template>
  <div class="container">
    <div class="columns" v-for="(sessionChunk, i) in sessions" v-bind:key="i">
      <div class="column" v-for="(session, j) in sessionChunk" v-bind:key="j">
        <SessionInfoCard v-bind:session="session" />
      </div>
    </div>
  </div>
</template>

<script>
import SessionInfoCard from "@/components/SessionInfoCard";
import { chunk } from "@/helpers";
export default {
  name: "Sessions",
  computed: {
    sessions() {
      if (this.$store.state.sessions) {
        return chunk([...this.$store.state.sessions], 3);
      }
      return [[]];
    }
  },
  components: {
    SessionInfoCard
  }
};
</script>

<style lang="scss" scoped></style>
