<template>
  <v-card outlined v-if="isActive" class="pa-3">
    <v-card-text>
      <v-btn @click="joinSession" v-if="!hasJoined">
        Join the session!
      </v-btn>
      <div v-if="hasJoined">
        <v-form class="pb-4" @submit.prevent="submitQuestion">
          <v-text-field
            label="Ask a question"
            v-model="question"
          ></v-text-field>
          <v-switch
            v-model="anonymous"
            label="Ask to be read anonymously"
          ></v-switch>
          <v-btn right type="submit">Submit</v-btn>
        </v-form>
        <v-btn block alt="Raise hand" @click="toggleHand">
          Raise hand<v-icon :color="isHandRaised ? 'primary' : 'black'">
            mdi-hand
          </v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { TimeStamp } from "@/firebase";
export default {
  name: "SessionWatcherPanel",
  data: function() {
    return {
      question: "",
      anonymous: false,
      isHandRaised: false
    };
  },
  methods: {
    toggleHand() {
      this.isHandRaised = !this.isHandRaised;
      if (this.isHandRaised) {
        const raisedHand = {
          id: this.$store.state.user.uid,
          username: this.$store.state.userDetails.username,
          avatarURL: this.$store.state.userDetails.avatar,
          participantId: this.participantId,
          time: TimeStamp.fromDate(new Date()),
          raised: true
        };
        this.$store.dispatch("addRaisedHand", raisedHand);
      } else {
        this.$store.dispatch("lowerHand", this.$store.state.user.uid);
      }
    },
    submitQuestion() {
      const question = {
        id: this.$store.state.user.uid,
        username: this.$store.state.userDetails.username,
        avatarURL: this.$store.state.userDetails.avatar,
        question: this.question,
        time: TimeStamp.fromDate(new Date()),
        anonymous: this.anonymous
      };
      this.$store.dispatch("addQuestion", question);
      this.question = "";
    }
  },
  computed: {
    session() {
      return this.$store.state.session[0];
    },
    visibleParticipants() {
      return this.$store.state.session[0]?.visible;
    },
    authenticated() {
      return this.$store.state.user.uid;
    },
    isOwner() {
      return this.session?.created_by === this.$store.state.user.uid;
    },
    isActive() {
      return this.$store.state.session[0]?.active;
    }
  },
  props: ["hasJoined", "joinSession", "participantId"]
};
</script>

<style></style>
