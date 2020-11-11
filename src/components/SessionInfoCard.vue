<template>
  <div class="card m-4">
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
export default {
  props: ["session"]
};
</script>

<style lang="scss" scoped>
@import "@/scss/_backgrounds.scss";
.card {
  header {
    border-bottom: solid white 2px;
  }
  border: solid white 2px;
  overflow: initial;

  &::after {
    @include is-striped;
    content: " ";
    width: calc(100% + 2em);
    height: calc(100% + 2em);
    position: absolute;
    top: -1em;
    left: -1em;
    z-index: -1;
  }
}
</style>
