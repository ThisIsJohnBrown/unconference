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
            <v-row>
              <v-col cols="6">
                <v-select
                  class="mt-3"
                  v-model="startTime"
                  :items="startTimes"
                  :error-messages="startTimeErrors"
                  @focus="startTimeErrors = []"
                  item-text="time"
                  item-value="val"
                  label="Start time"
                  return-object
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  class="mt-3"
                  v-model="endTime"
                  :items="endTimes"
                  :error-messages="endTimeErrors"
                  @focus="endTimeErrors = []"
                  item-text="time"
                  item-value="val"
                  label="End time"
                  return-object
                  outlined
                ></v-select> </v-col
            ></v-row>
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
    addedTags: [],
    startTime: {},
    endTime: {},
    types: [
      { val: "presentation", pretty: "Presentation" },
      { val: "panel", pretty: "Moderated Panel" },
      { val: "discussion", pretty: "Open Discussion" }
    ],
    type: { val: "panel", pretty: "Moderated Panel" },
    title: "",
    details: "",
    titleErrors: [],
    detailsErrors: [],
    tagsErrors: [],
    startTimeErrors: [],
    endTimeErrors: [],
    typeErrors: [],
    hasSubmitted: false
  }),
  validations: {
    title: { required },
    details: { required, minLength: minLength(50) },
    type: { required },
    startTime: { required },
    endTime: { required },
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
    checkStartTime() {
      if (!this.$v.startTime.required) return ["Please choose a time"];
      return [];
    },
    checkEndTime() {
      if (!this.$v.endTime.required) return ["Please choose a time"];
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
      this.startTimeErrors = this.checkStartTime();
      this.endTimeErrors = this.checkEndTime();
      this.typeErrors = this.checkType();
      const errors = [
        ...this.titleErrors,
        ...this.detailsErrors,
        ...this.tagsErrors,
        ...this.startTimeErrors,
        ...this.endTimeErrors,
        ...this.typeErrors
      ];
      if (!errors.length) {
        this.hasSubmitted = true;
        const startTime = TimeStamp.fromMillis(this.startTime.val * 1000);
        const endTime = TimeStamp.fromMillis(this.endTime.val * 1000);
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
    },
    tags() {
      return this.$store.state.conference?.tags;
    },
    startTimes() {
      if (!this.$store.state.conference?.times) return [];
      return this.$store.state.conference?.times.map(t => {
        let [hour, minute] = new Date(t.start.seconds * 1000)
          .toLocaleTimeString("en-US")
          .split(/:| /);
        return {
          time: `${hour}:${minute}`,
          val: t.start.seconds
        };
      });
    },
    endTimes() {
      if (!this.$store.state.conference?.times) return [];
      let times = [];
      this.$store.state.conference?.times.forEach(t => {
        if (t.end.seconds < this.startTime.val + 100) return false;
        let [hour, minute] = new Date(t.end.seconds * 1000)
          .toLocaleTimeString("en-US")
          .split(/:| /);
        times.push({
          time: `${hour}:${minute}`,
          val: t.end.seconds
        });
      });
      return times;
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
