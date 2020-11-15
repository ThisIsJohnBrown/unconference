<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <h3 class="mb-6">Sign in with Google</h3>
          <button
            class="button text-h3 is-pulled-right mb-5"
            @click="loginWithGoogle()"
          >
            <v-img :src="signinGoogleAsset"></v-img></button
        ></v-col>
        <v-col col="6">
          <div>
            <h3 class="mb-6">Sign in with email</h3>
            <v-form>
              <v-text-field
                label="Email"
                v-model="$v.email.$model"
                :error-messages="emailErrors"
                @focus="emailErrors = []"
              ></v-text-field>
              <v-text-field
                type="password"
                label="Password"
                v-model="$v.password.$model"
                :error-messages="passwordErrors"
                @focus="passwordErrors = []"
              ></v-text-field>

              <p class="red--text">{{ error }}</p>
              <v-btn class="mr-4" @click="loginEmailPassword">
                submit
              </v-btn>
              <v-btn @click="clear">
                clear
              </v-btn>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import { emailPasswordLogin, googleLogin } from "@/firebase";
export default {
  name: "Login",
  mixins: [validationMixin],
  data: function() {
    return {
      email: "",
      password: "",
      error: "",
      emailErrors: [],
      passwordErrors: [],
      signinGoogleAsset: require("@/assets/google-signin.png")
    };
  },
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) }
  },
  methods: {
    checkPassword() {
      if (!this.$v.password.required) return ["Please enter a password"];
      if (!this.$v.password.minLength) return ["Must be at least 8 characters"];
      return [];
    },
    checkEmail() {
      if (!this.$v.email.required) return ["Please enter an email address"];
      if (!this.$v.email.email) return ["Must be valid e-mail"];
      return [];
    },
    clear() {
      this.$v.$reset();
      this.email = "";
      this.password = "";
    },
    async loginWithGoogle() {
      const data = await googleLogin();
      if (data.user.uid) {
        this.$router.push({ name: "Home" });
      }
    },
    async loginEmailPassword() {
      this.passwordErrors = this.checkPassword();
      this.emailErrors = this.checkEmail();
      const errors = [...this.passwordErrors, ...this.emailErrors];
      if (!errors.length) {
        try {
          const details = await emailPasswordLogin({
            email: this.email,
            password: this.password
          });
          this.error =
            details.success === false ? details.data.error.message : "";
          if (!this.error) {
            this.$router.push({ name: "Home" });
          }
        } catch (error) {
          this.error = error.message;
        }
      }
    }
  }
};
</script>

<style></style>
