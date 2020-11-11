<template>
  <div v-bind:class="headerClasses">
    <router-link :to="{ name: 'Session', params: { slug: session.slug } }">
      <header>
        <p class="card-header-title has-text-white is-size-4">
          {{ session.title }}
        </p>
      </header>
    </router-link>
    <div class="card-content">
      <div class="content">
        <p class="block">
          {{ session.details }}
        </p>
      </div>
    </div>
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
  data: function() {
    return {
      headerClasses: {
        card: true,
        "m-1": true,
        [`${backgroundMap[this.session.type]}`]: true
      }
    };
  },
  props: ["session"]
};
</script>

<style lang="scss" scoped>
@import "@/scss/_backgrounds.scss";
@import "@/scss/_variables.scss";
.card {
  header {
    border-bottom: solid white 2px;
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
