<template>
  <div class="section">
    <div class="container" v-if="details">
      <div class="is-hidden-mobile">
        <div>
          <div class="columns is-mobile">
            <div class="column is-1"></div>
            <div class="column">
              <div class="image is-1by1 sui-avatar">
                <img :src="details.avatar" />
              </div>
            </div>
            <div class="column is-1"></div>
            <div class="column is-two-thirds content">
              <p>
                <span class="is-size-1 is-bold">
                  {{ details.displayName }}
                </span>
              </p>
              <p>
                <span class="subtitle"><small></small></span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="is-hidden-tablet">
        <div>
          <div class="columns is-mobile">
            <div class="column">
              <div class="image is-1by1 sui-avatar">
                <img src="https://placehold.it/256x256?text=people+02bacb" />
              </div>
            </div>
            <div class="column is-two-thirds">
              <h1 class="title is-bold"></h1>
              <!---->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container"><hr /></div>
    <div class="container">
      <div class="profile-items">
        <div
          class="columns is-multiline is-mobile"
          v-for="(sessionChunks, i) in watched"
          v-bind:key="i"
        >
          <div
            class="column"
            v-for="session in sessionChunks"
            v-bind:key="session.id"
          >
            <SessionInfoCard
              v-bind:session="session"
              v-bind:creator="getUserDetails(session.created_by)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SessionInfoCard from "@/components/SessionInfoCard";
import { db } from "@/firebase";
import { chunk, getUserDetails } from "@/helpers";
export default {
  name: "Profile",
  data: function() {
    return {
      profileDetails: {},
      username: ""
    };
  },
  computed: {
    sessions() {
      return [...this.$store.state.sessions].splice(0, 3);
    },
    details() {
      return this.username
        ? this.profileDetails
        : this.$store.state.userDetails;
    },
    watched() {
      return this.username
        ? chunk(this.profileWatched, 3)
        : chunk(this.$store.state.watchedSessions, 3);
    }
  },
  components: {
    SessionInfoCard
  },
  methods: {
    getUserDetails
  },
  async mounted() {
    if (this.$route.params.username) {
      this.username = this.$route.params.username;
      const userSnap = await db
        .collection("users")
        .where("username", "==", this.$route.params.username)
        .get();
      this.profileDetails = userSnap.docs[0].data();
      this.profileWatched = this.$store.state.sessions.filter(a => {
        console.log(a.id);
        return this.profileDetails.watched.indexOf(a.id) !== -1;
      });
      console.log("--", this.profileWatched);
    }
  }
};
</script>

<style></style>
