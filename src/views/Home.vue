<template>
  <div class="section is-max-desktop">
    <h2 class="is-size-2 has-text-centered">Sessions</h2>
    <Sessions />
  </div>
</template>

<script>
import Sessions from "@/components/Sessions";
export default {
  name: "Home",
  components: { Sessions }
};
</script>

<style lang="scss" scoped></style>
