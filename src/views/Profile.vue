<template>
  <div class="section">
    <div class="container" v-if="profileDetails">
      <div class="is-hidden-mobile">
        <div>
          <div class="columns is-mobile">
            <div class="column is-1"></div>
            <div class="column">
              <div class="image is-1by1 sui-avatar">
                <img :src="profileDetails.avatar" />
              </div>
            </div>
            <div class="column is-1"></div>
            <div class="column is-two-thirds content">
              <p>
                <span class="is-size-1 is-bold">
                  {{ profileDetails.displayName }}
                </span>
                <!---->
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
              <h1 class="title is-bold">
                Randall Jackson
              </h1>
              <!---->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container"><hr /></div>
    <div class="container">
      <div class="profile-items">
        <div class="columns is-multiline is-mobile">
          <div class="column" v-for="(session, j) in watched" v-bind:key="j">
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
import { getUserDetails } from "@/helpers";
export default {
  name: "Profile",
  data: function() {
    return {
      profileDetails: {},
      watched: {}
    };
  },
  computed: {
    details() {
      if (this.$route.params.username) {
        return db
          .collection("users")
          .where("username", "==", this.$route.params.username)
          .get()[0];
      }
      return this.$store.state.userDetails;
    },
    sessions() {
      return [...this.$store.state.sessions].splice(0, 3);
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
      const userSnap = await db
        .collection("users")
        .where("username", "==", this.$route.params.username)
        .get();
      this.profileDetails = userSnap.docs[0].data();
      this.watched = this.$store.state.sessions.filter(a => {
        return this.profileDetails.watched.indexOf(a.id) !== -1;
      });
    }
  }
};
</script>

<style></style>
