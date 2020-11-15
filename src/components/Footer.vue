<template>
  <v-card height="150">
    <v-footer absolute class="font-weight-medium">
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>unconference</strong> - The
        source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>
      </v-col>
    </v-footer>
  </v-card>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 120px;
  border: solid white 2px;
}
</style>
