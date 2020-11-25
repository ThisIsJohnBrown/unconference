<template>
  <v-row class="fill-height" v-if="conference">
    <v-col>
      <v-sheet>
        <v-calendar
          :first-time="firstTime"
          :start="date"
          :last-time="lastTime"
          hide-header
          interval-minutes="15"
          interval-count="8"
          ref="calendar"
          v-model="focus"
          color="primary"
          type="day"
          :events="events"
          :event-color="getEventColor"
          @change="fetchEvents"
          @click:event="showEvent"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    focus: "",
    colors: ["blue", "indigo", "deep-purple"],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false
  }),
  computed: {
    sessions() {
      return this.$store.state.sessions.sessions;
    },
    events() {
      if (!this.sessions) return [];
      return this.sessions.map(session => {
        return {
          name: session.title,
          start: new Date(session.startTime.seconds * 1000),
          end: new Date(session.endTime.seconds * 1000),
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: true,
          details: session.details
        };
      });
    },
    conference() {
      // eslint-disable-next-line
      if (!this.$store.state.conferences.conference.hasOwnProperty("name")) return false;
      return this.$store.state.conferences.conference;
    },
    date() {
      if (!this.conference?.startTime?.seconds) return "";
      const date = new Date(this.conference.startTime.seconds * 1000)
        .toLocaleDateString()
        .split("/");
      return `${date[2]}-${date[0]}-${date[1]}`;
    },
    firstTime() {
      if (!this.conference?.startTime?.seconds) return "";
      const startTime = Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
        hour12: false
      }).format(new Date(this.conference?.startTime?.seconds * 1000));
      return startTime;
    },
    lastTime() {
      if (!this.conference?.endTime?.seconds) return "";
      const startTime = Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
        hour12: false
      }).format(new Date(this.conference?.endTime?.seconds * 1000));
      return startTime;
    }
  },
  watch: {
    sessions(newSessions) {
      if (newSessions) {
        newSessions;
      }
    }
  },
  mounted() {
    // this.$refs.calendar.checkChange();
  },
  methods: {
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    fetchEvents() {},
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    }
  }
};
</script>

<style></style>
