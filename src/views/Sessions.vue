<template>
  <div>
    <section class="section is-max-desktop">
      <div class="container">
        <h2
          class="text-h3 ml-4 pl-4 mt-4"
          v-if="organizedSessions.current.length"
          data-cy="sessions-current"
        >
          Current sessions
        </h2>
        <h2 class="text-h3 ml-4 pl-4 mt-4" data-cy="no-sessions-current" v-else>
          No sessions currently active
        </h2>
        <SessionsList
          v-bind:sessions="organizedSessions.current"
          v-bind:showTimes="false"
        />
        <h2
          class="text-h3 ml-4 pl-4 mt-4 mb-5"
          v-if="organizedSessions.upcoming.length"
        >
          Upcoming sessions
        </h2>
        <SessionsList
          v-bind:sessions="organizedSessions.upcoming"
          v-bind:showTimes="true"
        />
        <h2
          class="text-h3 ml-4 pl-4 mt-4"
          v-if="organizedSessions.expired.length"
        >
          Previous sessions
        </h2>
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
    isBeforeAllSessions() {
      return new Date().getTime() < this.conference.startTime.seconds * 1000;
    },
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
    conference() {
      return this.$store.getters[`conferences/conference`];
    },
    sessions() {
      return this.$store.state.sessions.sessions?.length
        ? this.$store.state.sessions.sessions
        : [];
    }
  },
  mounted() {
    setInterval(() => console.log(new Date()), 1000);
  },
  components: {
    SessionsList
  }
};
</script>

<style></style>
