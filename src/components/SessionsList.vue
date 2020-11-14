<template>
  <div>
    <div v-if="showTimes">
      <v-container
        v-for="sessionTimePeriod in sessions"
        :key="sessionTimePeriod.time"
      >
        <h3 class="is-size-3 m-4">{{ sessionTimePeriod.prettyTime }}</h3>
        <v-row>
          <v-col
            v-for="(session, i) in sessionTimePeriod.sessionGroup"
            v-bind:key="i"
            :lg="4"
            :sm="12"
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
      <v-row>
        <v-col v-for="(session, i) in sessions" v-bind:key="i" :lg="4" :sm="12">
          <SessionInfoCard
            v-if="getUserDetails(session.created_by)"
            v-bind:session="session"
            v-bind:creator="getUserDetails(session.created_by)"
          />
        </v-col>
      </v-row>
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
