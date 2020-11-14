<template>
  <v-badge bordered :color="badgeColor" content="" overlap>
    <v-card outlined tile class="mx-auto">
      <!-- <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      height="200px"
    ></v-img> -->
      <v-card-title>
        {{ session.title }}
      </v-card-title>
      <v-card-subtitle>
        {{ session.details }}
      </v-card-subtitle>

      <v-card-text>
        <v-chip-group column>
          <v-chip small>Tag</v-chip>

          <v-chip small>Another Tag</v-chip>

          <v-chip small>One More</v-chip>
        </v-chip-group>
      </v-card-text>

      <v-card-actions v-if="isAuthenticated">
        <v-btn text @click.prevent="toggleWatch">
          <div v-if="!isWatched">
            <span>Add to agenda</span>
          </div>
          <div v-else>
            <span>Remove from agenda</span>
          </div>
        </v-btn>
        <v-btn text :to="{ name: 'Session', params: { slug: session.slug } }">
          <span>Go to session</span>
        </v-btn>
      </v-card-actions>
      <!-- <v-card-actions v-else>
        <v-btn text><span>Register to attend</span></v-btn>
      </v-card-actions> -->
    </v-card>
  </v-badge>
</template>

<script>
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
    isStartingSoon() {
      return false;
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
      return false;
    },
    isCompleted() {
      return true;
    },
    badgeColor() {
      if (this.isStartingSoon) return "warning";
      if (this.isActive) return "success";
      if (this.isCompleted) return "error";
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
