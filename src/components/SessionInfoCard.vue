<template>
  <div v-bind:class="cardClasses">
    <header @click="toggleOpenCard">
      <div class="card-header-title">
        <h2 class="title has-text-white is-size-4">
          {{ session.title }}
        </h2>
      </div>

      <span class="tag is-success is-starting-soon" v-if="isStartingSoon"
        >Starting soon</span
      >
      <span class="tag is-warning is-starting-soon" v-else-if="isActive"
        >Happening now</span
      >
      <span class="tag is-white is-starting-soon" v-else-if="isCompleted"
        >Finished</span
      >
    </header>
    <div class="card-content" v-if="cardIsOpen">
      <div class="content">
        <p class="is-4">Created by {{ creator.displayName }}</p>
        <p>1:30pm-2:00pm</p>
        <p>{{ session.details }}</p>
        <div class="tags">
          <span class="tag is-white">Tag1</span
          ><span class="tag is-white">Longer Tag</span
          ><span class="tag is-white">Just another tag</span>
        </div>
      </div>
    </div>
    <footer class="card-footer" v-if="cardIsOpen">
      <a @click.prevent="toggleWatch" class="card-footer-item has-text-white">
        <div v-if="!isWatched">
          <i class="fas fa-calendar-plus"></i>
          <span class="ml-2">Add to agenda</span>
        </div>
        <div v-else>
          <i class="fas fa-calendar-minus"></i>
          <span class="ml-2">Remove from agenda</span>
        </div>
      </a>
      <router-link
        class="card-footer-item has-text-white"
        :to="{ name: 'Session', params: { slug: session.slug } }"
      >
        <i class="fas fa-users"></i>
        <span class="ml-2">Go to session</span>
      </router-link>
    </footer>
  </div>
</template>

<script>
const backgroundMap = {
  panel: "is-zigzag",
  workshop: "is-boxes",
  discussion: "is-striped",
  presentation: "is-dotted"
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
    }
  },
  data: function() {
    return {
      cardIsOpen: true,
      cardClasses: {
        card: true,
        "m-1": true,
        [`${backgroundMap[this.session.type]}`]: true
      }
    };
  },
  props: ["session", "creator"]
};
</script>

<style lang="scss" scoped>
@import "@/scss/_backgrounds.scss";
@import "@/scss/_variables.scss";
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
    transition: all $hover-speed ease;
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
