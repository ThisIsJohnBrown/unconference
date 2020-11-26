<template>
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
              :items="startTimes()"
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
              :items="endTimes()"
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
    typeErrors: []
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
        this.$emit("submitted");
        const startTime = TimeStamp.fromMillis(this.startTime.val);
        const endTime = TimeStamp.fromMillis(this.endTime.val);
        string_to_slug;
        this.$store.dispatch("sessions/addSession", {
          startTime,
          endTime,
          title: this.title,
          active: false,
          slug: string_to_slug(this.title),
          type: this.type.val,
          details: this.details,
          created_by: {
            id: this.$store.state.user.user.uid,
            username: this.$store.state.user.userDetails.username,
            displayName: this.$store.state.user.userDetails.displayName,
            avatar: this.$store.state.user.userDetails.avatar
          },
          tags: this.addedTags,
          visible: [],
          kicked: []
        });
      }
    },
    startTimes() {
      if (!this.timeBlocks.length) return [];
      return this.timeBlocks.map(t => {
        let [hour, minute] = t.start.toLocaleTimeString("en-US").split(/:| /);
        return {
          time: `${hour}:${minute}`,
          val: t.start.getTime()
        };
      });
    },
    endTimes() {
      if (!this.timeBlocks.length) return [];
      let times = [];
      this.timeBlocks.forEach(t => {
        if (t.end.getTime() < this.startTime.val + 100) return false;
        let [hour, minute] = t.end.toLocaleTimeString("en-US").split(/:| /);
        times.push({
          time: `${hour}:${minute}`,
          val: t.end.getTime()
        });
      });
      return times;
    }
  },
  computed: {
    tags() {
      return this.conference.tags;
    },
    conference() {
      return this.$store.state.conferences.conference || {};
    },
    timeBlocks() {
      if (!this.conference.numBlocks) return [];
      let times = [];
      const startTime = this.conference.startTime.seconds * 1000;
      for (let i = 0; i < this.conference.numBlocks; i++) {
        times.push({
          start: new Date(
            startTime + 1000 * 60 * (i * this.conference.blockLength)
          ),
          end: new Date(
            startTime + 1000 * 60 * ((i + 1) * this.conference.blockLength)
          )
        });
      }
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
