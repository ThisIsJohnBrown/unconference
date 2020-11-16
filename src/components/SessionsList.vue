<template>
  <div>
    <div v-if="showTimes">
      <v-container
        fluid
        v-for="sessionTimePeriod in sessions"
        :key="sessionTimePeriod.time"
      >
        <v-row
          ><v-col align="center">
            <h3 class="text-h4 ma-4">{{ sessionTimePeriod.prettyTime }}</h3>
          </v-col></v-row
        >
        <v-row>
          <v-col
            v-for="(session, i) in sessionTimePeriod.sessionGroup"
            v-bind:key="i"
            cols="12"
            sm="6"
            md="4"
          >
            <SessionInfoCard
              v-if="getUserDetails(session.created_by)"
              v-bind:session="session"
              v-bind:creator="getUserDetails(session.created_by)"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <v-container>
        <v-row>
          <v-col
            v-for="(session, i) in sessions"
            v-bind:key="i"
            cols="12"
            sm="6"
            md="4"
          >
            <SessionInfoCard
              v-if="getUserDetails(session.created_by)"
              v-bind:session="session"
              v-bind:creator="getUserDetails(session.created_by)"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import SessionInfoCard from "@/components/SessionInfoCard";
import { getUserDetails } from "@/helpers";
export default {
  name: "SessionsList",
  computed: {},
  components: {
    SessionInfoCard
  },
  props: ["sessions", "showTimes"],
  methods: {
    getUserDetails
  }
};
</script>

<style lang="scss" scoped></style>
