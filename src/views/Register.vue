<template>
  <div>
    <section class="section is-max-desktop">
      <div class="container">
        <h2 class="is-size-1 mb-6">
          Sign up for an account!
        </h2>
        <div>
          <form @submit.prevent="registerUser">
            <input
              class="input  is-size-3"
              type="username"
              placeholder="username"
              v-model="username"
            /><input
              class="input  is-size-3"
              type="email"
              placeholder="email address"
              v-model="email"
            />
            <input
              class="input  is-size-3"
              type="password"
              placeholder="password"
              v-model="password"
            />
            <button class="button is-size-3">
              Register
            </button>
          </form>
          <p class="has-text-danger is-size-3">{{ error }}</p>
        </div>
        <h2 class="is-size-1 has-text-right mb-6">Or</h2>
        <button
          class="button is-size-3 is-pulled-right"
          @click="registerWithGoogle()"
        >
          Register with Google
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { register, googleLogin } from "@/firebase";
export default {
  name: "Register",
  data: function() {
    return {
      email: "",
      password: "",
      username: "",
      error: ""
    };
  },
  methods: {
    async registerWithGoogle() {
      const data = await googleLogin();
      if (data.user.uid) {
        this.$router.push({ name: "Home" });
      }
    },
    async registerUser() {
      try {
        const details = await register({
          email: this.email,
          password: this.password,
          username: this.username
        });
        console.log(details);
        this.error =
          details.success === false ? details.data?.error.message : "";
        if (!this.error) {
          this.$router.push({ name: "Home" });
        }
      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>

<style></style>
