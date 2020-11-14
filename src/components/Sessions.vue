<template>
  <div class="container">
    <v-container
      v-for="sessionTimePeriod in organizedSessions.all"
      :key="sessionTimePeriod.time"
    >
      <h3 class="is-size-3 m-4">{{ sessionTimePeriod.prettyTime }}</h3>
      <v-row>
        <v-col
          v-for="(session, i) in sessionTimePeriod.sessionGroup"
          v-bind:key="i"
          :lg="4"
          :sm="12"
        >
          <SessionInfoCard
            v-if="getUserDetails(session.created_by)"
            v-bind:session="session"
            v-bind:creator="getUserDetails(session.created_by)"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SessionInfoCard from "@/components/SessionInfoCard";
import { getUserDetails } from "@/helpers";
export default {
  name: "Sessions",
  computed: {
    organizedSessions() {
      if (this.sessions) {
        const now = new Date();
        const times = [
          ...new Set(this.sessions.map(item => item.startTime.seconds))
        ];
        let sessionsByTime = times.map(time => {
          return {
            time,
            sessions: []
          };
        });
        this.sessions.forEach(session => {
          sessionsByTime[
            times.indexOf(session.startTime.seconds)
          ].sessions.push(session);
        });
        const filteredSessionList = sessionsByTime.map(group => {
          return {
            time: group.time,
            //eslint-disable-next-line
          prettyTime: (new Date(group.time * 1000)).toTimeString().split(' ')[0],
            sessionGroup: group.sessions //chunk(group.sessions, 3)
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
      } else {
        return [];
      }
    }
  },
  components: {
    SessionInfoCard
  },
  props: ["sessions"],
  methods: {
    getUserDetails
  }
};
</script>

<style lang="scss" scoped></style>
