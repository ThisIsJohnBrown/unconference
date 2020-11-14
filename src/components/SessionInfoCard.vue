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
      <v-card-title class="mb-3">
        {{ session.title }}
      </v-card-title>
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
      </v-card-text>

      <v-card-actions v-if="isAuthenticated && !isCompleted">
        <v-btn text @click.prevent="toggleWatch">
          <div v-if="!isWatched">
            <span>Add to agenda</span>
          </div>
          <div v-else>
            <span>Remove from agenda</span>
          </div>
        </v-btn>
        <v-btn
          text
          :to="{ name: 'Session', params: { slug: session.slug } }"
          v-if="isStartingSoon || isActive"
        >
          <span>Go to session</span>
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
// @import "@/scss/_variables.scss";
.card {
  header {
    border-bottom: solid white 2px;
    cursor: pointer;
  }
  box-shadow: 0 0 0 3px black;
  border: solid white 2px;
  overflow: initial;

  &::after {
    content: " ";
    width: calc(100%);
    height: calc(100%);
    position: absolute;
    top: 0em;
    left: 0em;
    z-index: -1;
    transition: all 300ms ease;
  }

  &:hover {
    &::after {
      width: calc(100% + 2em);
      height: calc(100% + 2em);
      top: -1em;
      left: -1em;
    }
  }

  &.is-zigzag {
    &::after {
      @include is-zigzag;
    }
  }

  &.is-striped {
    &::after {
      @include is-striped;
    }
  }

  &.is-solid {
    &::after {
      @include is-solid;
    }
  }

  &.is-boxes {
    &::after {
      @include is-boxes;
    }
  }

  &.is-dotted {
    &::after {
      @include is-dotted;
    }
  }
}

.is-starting-soon {
  position: absolute;
  top: -1rem;
  right: 0px;
}
</style>
