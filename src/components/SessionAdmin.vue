<template>
  <div>
    <div>
      <button class="button" @click="startSession">
        Start the session!
      </button>
      <button class="button" @click="resetSession">
        Reset the session!
      </button>
    </div>
    <div>
      <button
        class="button is-white"
        v-for="participant in participants"
        v-bind:key="participant.participantId"
        @click.prevent="toggleVisibleParticipant(participant.participantId)"
      >
        <i class="fas fa-calendar-plus"></i
        ><span>{{ participant.displayName }}</span>
      </button>
    </div>
    <div v-if="isActive">
      <p class="title mt-6">Questions</p>
      <ul>
        <li v-for="(question, i) in questions" v-bind:key="i">
          {{ question.question
          }}<span class="button is-small" @click="deleteQuestion(i)"
            >Delete</span
          >
        </li>
      </ul>
      <p class="title mt-6">Hands Raised</p>
      <ul>
        <li v-for="(hand, i) in handsRaised" v-bind:key="i">
          {{ hand
          }}<span class="button is-small" @click="lowerHand(i)">Lower</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { unique } from "@/helpers";
import { TimeStamp } from "@/firebase";

export default {
  name: "SessionAdmin",
  methods: {
    deleteQuestion(index) {
      const questions = [...this.questions];
      questions.splice(index, 1);
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          questions
        }
      });
    },
    lowerHand(index) {
      const handsRaised = [...this.handsRaised];
      handsRaised.splice(index, 1);
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          handsRaised: handsRaised.filter(unique)
        }
      });
    },
    startSession() {
      if (!this.isActive) {
        this.randomSlug = Math.floor(Math.random() * 100000);
        this.randomPassword = Math.floor(Math.random() * 100000);
        this.$store.dispatch("updateSession", {
          id: this.$store.state.session[0].id,
          data: {
            active: true,
            activeTime: TimeStamp.fromDate(new Date()),
            randomSlug: this.randomSlug,
            randomPassword: this.randomPassword
          }
        });
      }
    },
    resetSession() {
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          active: false,
          activeTime: null,
          visible: [],
          questions: [],
          handsRaised: [],
          randomSlug: "",
          randomPassword: ""
        }
      });
    },
    toggleVisibleParticipant(id) {
      const visibleIds = [...this.visibleParticipants];
      const index = visibleIds.indexOf(id);
      if (index === -1) {
        visibleIds.push(id);
      } else {
        visibleIds.splice(index, 1);
      }
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          visible: visibleIds
        }
      });
    }
  },
  computed: {
    session() {
      return this.$store.state.session[0];
    },
    questions() {
      return this.$store.state.session[0]?.questions;
    },
    handsRaised() {
      return this.$store.state.session[0]?.handsRaised;
    },
    visibleParticipants() {
      return this.$store.state.session[0]?.visible;
    },
    isActive() {
      return this.$store.state.session[0]?.active;
    }
  },
  props: ["participants"]
};
</script>

<style></style>
