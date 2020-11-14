<template>
  <div class="section">
    <v-container grid-list-md>
      <v-row>
        <v-col offset="1" cols="2">
          <v-card tile elevation="0">
            <v-img
              :src="`https://robohash.org/${details.username}.png`"
            ></v-img>
          </v-card>
        </v-col>
        <v-col offset="1" cols="8"
          ><v-card tile elevation="0">
            <h2 class="text-h2">{{ details.displayName }}</h2>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="container">
      <SessionsList v-bind:sessions="watched" />
    </div>
  </div>
</template>

<script>
import SessionsList from "@/components/SessionsList";
import { db } from "@/firebase";
import { getUserDetails } from "@/helpers";

export default {
  name: "Profile",
  data: function() {},
  asyncComputed: {
    async profileDetails() {
      if (this.username) {
        const userSnap = await db
          .collection("users")
          .where("username", "==", this.$route.params.username)
          .get();
        return userSnap.docs[0].data();
      }
      return null;
    }
  },
  computed: {
    profileWatched() {
      return this.$store.state.sessions.filter(a => {
        return this.profileDetails.watched.indexOf(a.id) !== -1;
      });
    },
    sessions() {
      return [...this.$store.state.sessions].splice(0, 3);
    },
    username() {
      return this.$route.params.username;
    },
    details() {
      return this.$route.params.username
        ? this.profileDetails
        : this.$store.state.userDetails;
    },
    watched() {
      if (this.$route.params.username) {
        return this.profileDetails ? this.profileWatched : {};
      } else {
        return this.$store.state.watchedSessions;
      }
    }
  },
  components: {
    SessionsList
  },
  methods: {
    getUserDetails
  }
};
</script>

<style></style>
