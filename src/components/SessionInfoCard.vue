<template>
  <div class="card">
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
header {
  border-bottom: solid white 2px;
}
</style>
