<template>
  <v-badge bordered :color="badgeColor" content="" overlap>
    <v-card outlined tile class="mx-auto">
      <!-- <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      height="200px"
    ></v-img> -->
      <div
        class="overline ml-4 pl-4 mt-4"
        :class="`${sessionColor.class} lighten-3`"
      >
        {{ session.type }}
      </div>
      <router-link
        class="text-decoration-none text-success black--text"
        :to="{ name: 'Session', params: { slug: session.slug } }"
      >
        <v-card-title>
          {{ session.title }}
        </v-card-title>
      </router-link>
      <v-card-subtitle class="mb-3">
        {{ session.details }}
      </v-card-subtitle>

      <v-card-text>
        <v-chip
          :class="`${sessionColor.class}`"
          small
          label
          outlined
          v-for="(tag, i) in session.tags"
          v-bind:key="i"
          >{{ tag }}</v-chip
        >
        <div class="overline pl-4 mt-6 green lighten-3" v-if="isOwner">
          You own this session!
        </div>
      </v-card-text>
      <v-card-actions v-if="isAuthenticated && !isCompleted">
        <v-btn text @click.prevent="toggleWatch" v-if="!isOwner">
          <div v-if="!isWatched">
            <span>Add to agenda</span>
          </div>
          <div v-else>
            <span>Remove from agenda</span>
          </div>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-badge>
</template>

<script>
const colorMap = {
  presentation: { border: "#EF9A9A", class: "red" },
  workshop: { border: "#CE93D8", class: "purple" },
  panel: { border: "#90CAF9", class: "blue" },
  discussion: { border: "#80CBC4", class: "teal" }
};
export default {
  name: "SessionInfoCard",
  methods: {
    toggleOpenCard() {
      this.cardIsOpen = !this.cardIsOpen;
    },
    async toggleWatch() {
      this.$store.dispatch("updateWatched", {
        session: this.session
      });
    }
  },
  computed: {
    startTime() {
      return new Date(this.session.startTime.seconds * 1000);
    },
    sessionColor() {
      return colorMap[this.session.type];
    },
    endTime() {
      return new Date(this.session.endTime.seconds * 1000);
    },
    minutesUntilStart() {
      return parseInt((this.startTime - new Date()) / (1000 * 60));
    },
    minutesUntilEnd() {
      return parseInt((this.endTime - new Date()) / (1000 * 60));
    },
    isStartingSoon() {
      return this.minutesUntilStart < 30 && this.minutesUntilStart >= 0;
    },
    currentWatched() {
      return this.$store.state.userDetails.watched
        ? [...this.$store.state.userDetails.watched]
        : [];
    },
    isWatched() {
      return this.currentWatched.indexOf(this.session.id) === -1 ? false : true;
    },
    isActive() {
      return this.minutesUntilStart <= 0 && this.minutesUntilEnd >= 0;
    },
    isOwner() {
      return this.session?.created_by === this.$store.state.user.uid;
    },
    isCompleted() {
      return this.minutesUntilEnd < 0;
    },
    badgeColor() {
      if (this.isStartingSoon) return "warning";
      else if (this.isActive) return "success";
      else if (this.isCompleted) return "error";
      return "";
    },
    isAuthenticated() {
      return this.$store.state.user?.uid;
    }
  },
  data: function() {
    return {};
  },
  props: ["session", "creator"]
};
</script>

<style lang="scss" scoped>
@import "@/scss/_backgrounds.scss";

.v-card__title {
  word-break: normal;
  &:hover {
    color: grey;
  }
}
</style>
