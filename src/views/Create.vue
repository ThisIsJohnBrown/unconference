<template>
  <div>
    <v-container fill-height v-if="!hasSubmitted && isAuthenticated">
      <v-row>
        <v-col col="12"><h1 class="text-h2">Run your own session!</h1></v-col>
      </v-row>
    </v-container>
    <v-container v-if="!hasSubmitted && isAuthenticated">
      <CreateSessionForm @submitted="submitted" />
    </v-container>
    <v-container fill-height v-if="hasSubmitted && isAuthenticated">
      <v-row>
        <v-col col="12"
          ><h1 class="text-h2">You did it!</h1>
          <p>
            Please be sure to show up on time! You can find your session by
            going to
            <router-link :to="{ name: 'Profile' }">your profile</router-link>
          </p></v-col
        >
      </v-row>
    </v-container>
    <v-container v-if="!isAuthenticated">
      <v-row>
        <v-col col="4"
          ><p>You must be registered before you can create a session!</p>
          <v-btn outlined tile :to="{ name: 'Register' }">Register</v-btn>
          <v-btn outlined tile :to="{ name: 'Login' }" class="ml-6"
            >Login</v-btn
          ></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CreateSessionForm from "@/components/CreateSessionForm";
export default {
  data: () => ({
    hasSubmitted: false
  }),
  methods: {
    submitted() {
      console.log("a");
      this.hasSubmitted = true;
    }
  },
  props: ["isAuthenticated"],
  components: {
    CreateSessionForm
  }
};
</script>

<style></style>
