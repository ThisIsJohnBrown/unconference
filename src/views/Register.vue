<template>
  <div>
    <v-container>
      <v-row>
        <v-col col="12" align="center">
          <h2 class="text-h3 mt-6 mb-6">
            Two easy ways to register
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <h3 class="mb-6">Register with Google</h3>
          <button
            class="button text-h3 is-pulled-right mb-5"
            @click="registerWithGoogle()"
          >
            <v-img :src="signinGoogleAsset"></v-img></button
        ></v-col>
        <v-col col="6">
          <div>
            <h3 class="mb-6">Sign up with email</h3>
            <v-form>
              <v-text-field
                label="Display Name"
                v-model="$v.displayName.$model"
                :error-messages="displayNameErrors"
                @focus="displayNameErrors = []"
              ></v-text-field>
              <v-text-field
                label="Username"
                v-model="$v.username.$model"
                :error-messages="usernameErrors"
                @focus="usernameErrors = []"
              ></v-text-field>
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
              <v-switch
                :label="`Do you agree to our Code of Conduct?`"
                v-model="checkbox"
                :error-messages="checkboxErrors"
                @focus="checkboxErrors = []"
              ></v-switch>

              <p class="red--text">{{ error }}</p>
              <v-btn class="mr-4" @click="submit">
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
import { required, email, alphaNum, minLength } from "vuelidate/lib/validators";
import { register, googleLogin } from "@/firebase";
export default {
  name: "Register",
  mixins: [validationMixin],
  data: function() {
    return {
      email: "asdf@asdf.com",
      password: "asdf1",
      username: "asdf",
      displayName: "Asdf",
      error: "",
      checkbox: true,
      signinGoogleAsset: require("@/assets/google-signin.png"),
      displayNameErrors: [],
      usernameErrors: [],
      emailErrors: [],
      passwordErrors: [],
      checkboxErrors: []
    };
  },
  validations: {
    username: { required, alphaNum },
    email: { required, email },
    password: { required, minLength: minLength(8) },
    displayName: { required },
    checkbox: {
      checked(val) {
        return val;
      }
    }
  },
  methods: {
    checkDisplayName() {
      if (!this.$v.displayName.required) return ["Display name is required."];
      return [];
    },
    checkUsername() {
      if (!this.$v.username.required) return ["Username is required."];
      if (!this.$v.username.alphaNum)
        return ["Must only be letters and numbers."];
      return [];
    },
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
    checkCheckboxErrors() {
      if (!this.$v.checkbox.checked) return ["You must agree to register"];
      return [];
    },
    submit() {
      this.displayNameErrors = this.checkDisplayName();
      this.usernameErrors = this.checkUsername();
      this.passwordErrors = this.checkPassword();
      this.emailErrors = this.checkEmail();
      this.checkboxErrors = this.checkCheckboxErrors();
      const errors = [
        ...this.displayNameErrors,
        ...this.usernameErrors,
        ...this.passwordErrors,
        ...this.emailErrors,
        ...this.checkboxErrors
      ];
      if (!errors.length) {
        this.registerUser();
      }
    },
    clear() {
      this.$v.$reset();
      this.username = "";
      this.email = "";
      this.password = "";
      this.displayName = "";
      this.checkbox = false;
    },
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
