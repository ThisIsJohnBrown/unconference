<template>
  <div>
    <section class="section is-max-desktop">
      <div class="container">
        <h2 class="text-h3 ml-4 pl-4 mt-4">Current sessions</h2>
        <SessionsList
          v-bind:sessions="organizedSessions.current"
          v-bind:showTimes="false"
        />
        <h2 class="text-h3 ml-4 pl-4 mt-4 mb-5">Upcoming sessions</h2>
        <SessionsList
          v-bind:sessions="organizedSessions.upcoming"
          v-bind:showTimes="true"
        />
        <h2 class="text-h3 ml-4 pl-4 mt-4">Previous sessions</h2>
        <SessionsList
          v-bind:sessions="organizedSessions.expired"
          v-bind:showTimes="true"
        />
      </div>
    </section>
  </div>
</template>

<script>
import SessionsList from "@/components/SessionsList";
export default {
  name: "Sessions",
  computed: {
    organizedSessions() {
      if (this.sessions) {
        const now = new Date();
        const currentSessions = this.sessions.filter(session => {
          const minutesUntilStart = parseInt(
            (new Date(session.startTime.seconds * 1000) - new Date()) /
              (1000 * 60)
          );
          const minutesUntilEnd = parseInt(
            (new Date(session.endTime.seconds * 1000) - new Date()) /
              (1000 * 60)
          );
          return minutesUntilStart <= 0 && minutesUntilEnd >= 0;
        });
        console.log(currentSessions);
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
          current: currentSessions,
          upcoming: filteredSessionList.filter(
            session => now <= new Date(session.time * 1000)
          )
        };
      } else {
        return [];
      }
    },
    isAuthenticated() {
      return this.$store.state.user?.uid;
    },
    sessions() {
      return this.$store.state.sessions;
    }
  },
  components: {
    SessionsList
  }
};
</script>

<style></style>
