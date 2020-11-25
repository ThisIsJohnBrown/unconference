<template>
  <div>
    <v-container>
      <v-row class="ma-6" align="center" justify="center">
        <v-img :src="shapes[0]" class="ma-6"></v-img>
        <h1 class="text-h3 ma-6 text-md-h1">unconference</h1>
        <h2 class="text-h4 text-md-h3" v-if="conference">{{ prettyDate }}</h2>
        <v-img :src="shapes[1]" class="ma-6"></v-img>
      </v-row>
    </v-container>
    <v-container fill-height>
      <v-row
        class="ma-6"
        align="center"
        justify="center"
        color="teal lighten-4"
      >
        <v-col cols="12" sm="6" align="center" justify="center">
          <h3 class="text-h5">Have an idea?</h3>
          <v-btn class="mt-4" outlined tile :to="{ name: `Create` }"
            >Create a session</v-btn
          >
        </v-col>
        <v-col cols="12" sm="6" align="center" justify="center">
          <h3 class="text-h5">Want to join?</h3>
          <v-btn class="mt-4" outlined tile>Register</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container fill-height>
      <v-row align="center" justify="center"
        ><v-col cols="12" md="8"><v-img :src="images[0]"></v-img></v-col
        ><v-col cols="12" md="4"
          ><h3 class="text-h3 mb-5">Community Decides</h3>
          <p>
            Attendees guide the topics, because anyone can organize or attend a
            panel, presentation, or open conversation. You get to choose!
          </p></v-col
        ></v-row
      >
      <v-row align="center" justify="center"
        ><v-col cols="12" md="4"
          ><h3 class="text-h3 mb-5">Many-to-many</h3>
          <p>
            More than one-way streaming or pre-recorded talks, you can ask
            questions and interact in real time with the hosts and attendees of
            the sessions
          </p></v-col
        ><v-col cols="12" md="8"><v-img :src="images[1]"></v-img></v-col
      ></v-row>
      <v-row align="center" justify="center"
        ><v-col cols="12" md="8"><v-img :src="images[2]"></v-img></v-col
        ><v-col cols="12" md="4"
          ><h3 class="text-h3 mb-5">Infinite tracks</h3>
          <p>
            There’s no one track of talks to listen to. You can bounce between
            different subjects and formats and create your own experience.
          </p></v-col
        ></v-row
      >
      <v-row align="center" justify="center"
        ><v-col cols="12" md="4"
          ><h3 class="text-h3 mb-5">Prioritizing safety</h3>
          <p>
            As this is an open platform for communication, all attendees must
            register and adhere to a code of conduct. No exceptions.
          </p></v-col
        ><v-col cols="12" md="8"><v-img :src="images[3]"></v-img></v-col
      ></v-row>
    </v-container>
  </div>
</template>

<script>
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
      ],
      shapes: [require("@/assets/shapes1.png"), require("@/assets/shapes2.png")]
    };
  },
  methods: {},
  computed: {
    isAuthenticated() {
      return this.$store.getters[`user/isAuthenticated`];
    },
    conference() {
      return this.$store.state.conferences.conference &&
        this.$store.state.conferences.conference?.startTime
        ? this.$store.state.conferences.conference
        : null;
    },
    prettyDate() {
      const day = Intl.DateTimeFormat(navigator.language, {
        weekday: "long",
        month: "short",
        day: "numeric"
      }).format(new Date(this.conference?.startTime?.seconds * 1000));

      const startTime = Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      }).format(new Date(this.conference?.startTime?.seconds * 1000));

      const endTime = Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      }).format(new Date(this.conference?.endTime?.seconds * 1000));
      return `${day} ${startTime}-${endTime}`;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped></style>
