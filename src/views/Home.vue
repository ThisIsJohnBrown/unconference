<template>
  <div>
    <section class="hero">
      <div class="hero-body has-text-white">
        <div class="container">
          <h1 class="title has-text-white is-size-1">
            Welcome to the virtual unconference
          </h1>
          <h2 class="subtitle">
            A place for learning, sharing, and connecting!
          </h2>
        </div>
      </div>
    </section>
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
    <section class="section is-max-desktop">
      <div class="container">
        <h2 class="is-size-1 has-text-left mb-6">Upcoming sessions</h2>
        <Sessions />
      </div>
    </section>
  </div>
</template>

<script>
import Sessions from "@/components/Sessions";
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
      }
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
    }
  },
  components: { Sessions }
};
</script>

<style lang="scss" scoped></style>
