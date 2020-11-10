<template>
  <div class="section is-max-desktop">
    <h2 class="is-size-2">Sessions</h2>
    <div class="container">
      <div class="columns">
        <div class="column" v-for="(session, i) in sessions" v-bind:key="i">
          <div class="card">
            <header>
              <p class="card-header-title has-text-white is-size-4">
                {{ session.title }}
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <p class="block">
                  {{ session.details }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  computed: {
    sessions() {
      if (this.$store.state.sessions) {
        return [...this.$store.state.sessions].splice(0, 3);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  border: solid white 2px;
  header {
    border-bottom: solid white 2px;
  }
}
</style>
