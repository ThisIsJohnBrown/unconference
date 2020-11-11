<template>
  <div v-bind:class="headerClasses">
    <header @click="toggleOpenCard">
      <div class="card-header-title">
        <h2 class="title has-text-white is-size-4">
          {{ session.title }}
        </h2>
      </div>
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
      <a href="#" class="card-footer-item has-text-white">
        <i class="fas fa-calendar-plus"></i>
        <span class="ml-2">Add to agenda</span>
      </a>
      <router-link
        class="card-footer-item has-text-white"
        :to="{ name: 'Session', params: { slug: session.slug } }"
      >
        <i class="fas fa-users"></i>
        <span class="ml-2">Go to session</span>
      </router-link>
      <a href="#" class="card-footer-item has-text-white">
        <i class="fas fa-flag"></i>
        <span class="ml-2">Report</span>
      </a>
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
backgroundMap;
export default {
  name: "SessionInfoCard",
  methods: {
    toggleOpenCard() {
      this.cardIsOpen = !this.cardIsOpen;
    }
  },
  data: function() {
    return {
      cardIsOpen: false,
      headerClasses: {
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
</style>
