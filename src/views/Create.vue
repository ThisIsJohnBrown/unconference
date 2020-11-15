<template>
  <div>
    <v-container fill-height v-if="!hasSubmitted && isAuthenticated">
      <v-row>
        <v-col col="12"><h1 class="text-h2">Run your own session!</h1></v-col>
      </v-row>
    </v-container>
    <v-container v-if="!hasSubmitted && isAuthenticated">
      <v-form @submit.prevent="addSession">
        <v-row>
          <v-col cols="12" sm="6" lg="5"
            ><v-text-field
              label="Title"
              v-model="$v.title.$model"
              :error-messages="titleErrors"
              @focus="titleErrors = []"
            ></v-text-field>
            <v-textarea
              v-model="details"
              :error-messages="detailsErrors"
              @focus="detailsErrors = []"
              outlined
              name="input-7-1"
              label="Details about your session"
            ></v-textarea
          ></v-col>
          <v-col cols="12" sm="6" lg="5" class="offset-lg-2">
            <v-combobox
              v-model="addedTags"
              :items="tags"
              :error-messages="tagsErrors"
              @focus="tagsErrors = []"
              hide-selected
              hint="Maximum of 5 tags"
              label="Tags"
              multiple
              persistent-hint
              small-chips
              outlined
            >
            </v-combobox>
            <v-select
              class="mt-3"
              v-model="time"
              :items="times"
              :error-messages="timeErrors"
              @focus="timeErrors = []"
              item-text="time"
              item-value="val"
              label="Time slot"
              return-object
              outlined
            ></v-select>
            <v-select
              v-model="type"
              :items="types"
              :error-messages="typeErrors"
              @focus="typeErrors = []"
              item-text="pretty"
              item-value="val"
              label="Session type"
              return-object
              outlined
            ></v-select>
            <v-btn type="submit" outlined tile>Register</v-btn>
          </v-col>
        </v-row>
      </v-form>
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
import { TimeStamp } from "@/firebase";
import { string_to_slug } from "@/helpers";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  data: () => ({
    tags: ["Tips & Tricks", "Soft Skills", "Technical"],
    addedTags: ["VueJS"],
    times: [
      { val: "12:00-12:30", time: "12:00-12:30" },
      { val: "12:30-13:00", time: "12:30-1:00" },
      { val: "13:00-13:30", time: "1:00-1:30" },
      { val: "13:30-14:00", time: "1:30-2:00" }
    ],
    time: { val: "12:00-12:30", time: "12:00-12:30" },
    types: [
      { val: "presentation", pretty: "Presentation" },
      { val: "panel", pretty: "Moderated Panel" },
      { val: "discussion", pretty: "Open Discussion" }
    ],
    type: { val: "panel", pretty: "Moderated Panel" },
    title: "Long Session Title",
    details:
      "Non rerum ullam amet et illum rerum nihil unde excepturi. Minus facere saepe nesciunt ut reprehenderit perspiciatis iste corrupti mollitia. Earum nihil omnis officiis atque consequatur natus sit aut. Eos odit earum excepturi.",
    titleErrors: [],
    detailsErrors: [],
    tagsErrors: [],
    timeErrors: [],
    typeErrors: [],
    hasSubmitted: false
  }),
  validations: {
    title: { required },
    details: { required, minLength: minLength(50) },
    type: { required },
    time: { required },
    addedTags: { required }
  },
  methods: {
    checkTitle() {
      if (!this.$v.title.required) return ["Title is required."];
      return [];
    },
    checkDetails() {
      if (!this.$v.details.required) return ["Details are required."];
      if (!this.$v.details.minLength)
        return ["Please use at least 50 characters."];
      return [];
    },
    checkTags() {
      if (!this.$v.addedTags.required) return ["At least one tag is required."];
      return [];
    },
    checkTime() {
      if (!this.$v.time.required) return ["Please choose a time"];
      return [];
    },
    checkType() {
      if (!this.$v.type.required) return ["Please choose a type"];
      return [];
    },
    addSession() {
      this.titleErrors = this.checkTitle();
      this.detailsErrors = this.checkDetails();
      this.tagsErrors = this.checkTags();
      this.timeErrors = this.checkTime();
      this.typeErrors = this.checkType();
      const errors = [
        ...this.titleErrors,
        ...this.detailsErrors,
        ...this.tagsErrors,
        ...this.timeErrors,
        ...this.typeErrors
      ];
      if (!errors.length) {
        this.hasSubmitted = true;
        const times = this.time.val.split("-").map(time => time.split(":"));
        //eslint-disable-next-line
        const startTime = TimeStamp.fromMillis((new Date()).setHours(times[0][0], times[0][1], 0, 0))
        //eslint-disable-next-line
        const endTime = TimeStamp.fromMillis((new Date()).setHours(times[1][0] - 1, times[1][1], 0, 0));
        string_to_slug;
        this.$store.dispatch("addSession", {
          startTime,
          endTime,
          title: this.title,
          active: false,
          slug: string_to_slug(this.title),
          type: this.type.val,
          details: this.details,
          created_by: this.$store.state.user.uid,
          tags: this.addedTags,
          handsRaised: [],
          questions: [],
          visible: [],
          kicked: []
        });
      }
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.user?.uid;
    }
  },
  watch: {
    addedTags(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.addedTags.pop());
      }
    }
  }
};
</script>

<style></style>
