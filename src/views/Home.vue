<template>
  <div>
    <v-container fill-height>
      <v-row align="center" justify="center"
        ><v-col cols="8"><v-img :src="images[0]"></v-img></v-col
        ><v-col cols="4"
          ><h3 class="text-h3 mb-5">Community Decides</h3>
          <p>
            Attendees guide the topics, because anyone can organize or attend a
            panel, presentation, or open conversation. You get to choose!
          </p></v-col
        ></v-row
      >
      <v-row align="center" justify="center"
        ><v-col cols="4"
          ><h3 class="text-h3 mb-5">Many-to-many</h3>
          <p>
            More than one-way streaming or pre-recorded talks, you can ask
            questions and interact in real time with the hosts and attendees of
            the sessions
          </p></v-col
        ><v-col cols="8"><v-img :src="images[1]"></v-img></v-col
      ></v-row>
      <v-row align="center" justify="center"
        ><v-col cols="8"><v-img :src="images[2]"></v-img></v-col
        ><v-col cols="4"
          ><h3 class="text-h3 mb-5">Infinite tracks</h3>
          <p>
            There’s no one track of talks to listen to. You can bounce between
            different subjects and formats and create your own experience.
          </p></v-col
        ></v-row
      >
      <v-row align="center" justify="center"
        ><v-col cols="4"
          ><h3 class="text-h3 mb-5">Prioritizing safety</h3>
          <p>
            As this is an open platform for communication, all attendees must
            register and adhere to a code of conduct. No exceptions.
          </p></v-col
        ><v-col cols="8"><v-img :src="images[3]"></v-img></v-col
      ></v-row>
    </v-container>
    <section class="section is-max-desktop">
      <div class="container">
        <h2 class="is-size-1 has-text-right mb-6">Register your own Session</h2>
        <div v-if="isRegistering">
          <form class="is-size-3" @submit.prevent="addSession">
            <input
              class="input is-size-3"
              type="text"
              v-model="session.title"
              placeholder="Session Title (Something like 'Avoid The Top 10 ______ Mistakes')"
            />
            <textarea
              name=""
              id=""
              class="textarea is-size-4"
              v-model="session.details"
              placeholder="All the details about your session (the more, the better)"
            ></textarea>
            <div class="select">
              <select v-model="session.type">
                <option value="presentation">Presentation</option>
                <option value="panel">Moderated Panel</option>
                <option value="workshop">Workshop</option>
                <option value="discussion">Open Discussion</option>
              </select>
            </div>
            <div class="select">
              <select v-model="session.time">
                <option value="12:00-12:30">12:00-12:30</option>
                <option value="12:30-13:00">12:30-1:00</option>
                <option value="13:00-13:30">1:00-1:30</option>
                <option value="13:30-14:00">1:30-2:00</option>
              </select>
            </div>
            <button class="button is-size-3 is-pulled-right">
              Create session
            </button>
          </form>
        </div>
        <div v-else>
          <button
            @click="beginRegister()"
            class="button is-size-3 is-pulled-right"
          >
            Create a session!
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { TimeStamp } from "@/firebase";
export default {
  name: "Home",
  data: function() {
    return {
      isRegistering: false,
      session: {
        title: "",
        details: "",
        type: "presentation",
        time: "12:00-12:30"
      },
      images: [
        require("@/assets/create.png"),
        require("@/assets/many.png"),
        require("@/assets/tracks.png"),
        require("@/assets/safety.png")
      ]
    };
  },
  methods: {
    beginRegister() {
      this.isRegistering = true;
    },
    addSession() {
      const times = this.session.time.split("-").map(time => time.split(":"));
      //eslint-disable-next-line
      const startTime = TimeStamp.fromMillis((new Date()).setHours(times[0][0] - 1, times[0][1], 0, 0))
      //eslint-disable-next-line
      const endTime = TimeStamp.fromMillis(
        new Date().setHours(times[1][0] - 1, times[1][1], 0, 0)
      );
      this.$store.dispatch("addSession", {
        ...this.session,
        startTime,
        endTime
      });
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.user?.uid;
    },
    sessions() {
      return this.$store.state.sessions;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped></style>
