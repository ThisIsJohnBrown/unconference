<template>
  <div class="container">
    <div
      v-for="sessionTimePeriod in sessions.all"
      v-bind:key="sessionTimePeriod.time"
    >
      <h3 class="is-size-3 m-4">{{ sessionTimePeriod.prettyTime }}</h3>
      <div
        class="columns"
        v-for="(sessionChunk, i) in sessionTimePeriod.sessionGroup"
        v-bind:key="i"
      >
        <div class="column" v-for="(session, j) in sessionChunk" v-bind:key="j">
          <SessionInfoCard
            v-bind:session="session"
            v-bind:creator="getUserDetails(session.created_by)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SessionInfoCard from "@/components/SessionInfoCard";
import { chunk, getUserDetails } from "@/helpers";
export default {
  name: "Sessions",
  computed: {
    sessions() {
      const now = new Date();
      const times = [
        ...new Set(
          this.$store.state.sessions.map(item => item.startTime.seconds)
        )
      ];
      let sessionsByTime = times.map(time => {
        return {
          time,
          sessions: []
        };
      });
      this.$store.state.sessions.forEach(session => {
        sessionsByTime[times.indexOf(session.startTime.seconds)].sessions.push(
          session
        );
      });
      const filteredSessionList = sessionsByTime.map(group => {
        return {
          time: group.time,
          //eslint-disable-next-line
          prettyTime: (new Date(group.time * 1000)).toTimeString().split(' ')[0],
          sessionGroup: chunk(group.sessions, 3)
        };
      });
      return {
        all: filteredSessionList,
        expired: filteredSessionList.filter(
          session => now > new Date(session.time * 1000)
        ),
        upcoming: filteredSessionList.filter(
          session => now <= new Date(session.time * 1000)
        )
      };
    }
  },
  components: {
    SessionInfoCard
  },
  methods: {
    getUserDetails
  }
};
</script>

<style lang="scss" scoped></style>
