<template>
  <div>
    <v-container>
      <v-row>
        <v-col col="6" offset="6">
          <h2 class="is-size-1 mb-6">
            Sign up for an account!
          </h2>
          <div>
            <v-form>
              <v-text-field
                v-model="username"
                :error-messages="nameErrors"
                label="Username"
                required
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="E-mail"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                label="Password"
                required
                type="password"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>
              <v-checkbox
                v-model="checkbox"
                :error-messages="checkboxErrors"
                label="Do you agree to our Code of Conduct?"
                required
                @change="$v.checkbox.$touch()"
                @blur="$v.checkbox.$touch()"
              ></v-checkbox>

              <v-btn class="mr-4" @click="submit">
                submit
              </v-btn>
              <v-btn @click="clear">
                clear
              </v-btn>
            </v-form>
            <p class="has-text-danger is-size-3">{{ error }}</p>
          </div>
          <h2 class="is-size-1 has-text-right mb-6">Or</h2>
          <button
            class="button is-size-3 is-pulled-right"
            @click="registerWithGoogle()"
          >
            Register with Google
          </button>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { register, googleLogin } from "@/firebase";
export default {
  name: "Register",
  mixins: [validationMixin],
  data: function() {
    return {
      email: "asdf@asfd.com",
      password: "asdfasdf",
      username: "asdf1",
      error: "",
      checkbox: false
    };
  },
  validations: {
    username: { required },
    email: { required, email },
    password: { required },
    checkbox: {
      checked(val) {
        return val;
      }
    }
  },
  computed: {
    checkboxErrors() {
      const errors = [];
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (this.$v.username.$dirty) return errors;

      !this.$v.username.required && errors.push("Username is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      this.$v.password.valid && errors.push("Must be valid password");
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.registerUser();
      }
    },
    clear() {
      this.$v.$reset();
      this.username = "";
      this.email = "";
      this.password = "";
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
