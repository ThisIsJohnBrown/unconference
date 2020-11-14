<template>
  <v-card outlined>
    <div>
      <v-container fluid>
        <v-card-actions>
          <v-btn tile elevation="0" @click="startSession" color="success">
            Start!
          </v-btn>
          <v-btn tile elevation="0" @click="joinSession">
            Re-join!
          </v-btn>
          <v-btn tile elevation="0" @click="resetSession" color="warning">
            Reset!
          </v-btn>
        </v-card-actions>
      </v-container>
    </div>
    <div class="pa-3" v-if="isActive">
      <div>
        <v-row justify="center">
          <v-expansion-panels multiple accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>Panelists</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-chip
                  label
                  v-for="participant in visibleParticipantsDetails"
                  v-bind:key="participant.participantId"
                  @click.prevent="
                    toggleVisibleParticipant(participant.participantId)
                  "
                >
                  <v-avatar left>
                    <v-img :src="participant.avatarURL"></v-img>
                  </v-avatar>
                  {{ participant.displayName }}
                </v-chip>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                >All Participants</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <v-chip
                  label
                  :outlined="isVisible(participant.participantId)"
                  v-for="participant in participants"
                  v-bind:key="participant.participantId"
                  @click.prevent="
                    toggleVisibleParticipant(participant.participantId)
                  "
                >
                  <v-avatar left>
                    <v-img :src="participant.avatarURL"></v-img>
                  </v-avatar>
                  {{ participant.displayName }}
                </v-chip>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Questions</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card
                  outlined
                  v-for="(question, i) in questions"
                  v-bind:key="i"
                >
                  <v-list-item>
                    <v-list-item-content style="padding: 1px;" class="p-0">
                      <div class="overline mb-4">
                        {{ anonymizeUsername(question) }}
                      </div>
                      <v-list-item-subtitle style="display: block">{{
                        question.question
                      }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar tile
                      ><v-img :src="question.avatarURL"></v-img
                    ></v-list-item-avatar>
                  </v-list-item>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      alt="Lower hand"
                      outlined
                      tile
                      @click="deleteQuestion(i)"
                    >
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Raised Hands</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list>
                  <v-list-item v-for="(hand, i) in handsRaised" v-bind:key="i">
                    <v-list-item-avatar>
                      <v-img :src="hand.avatarURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ hand.username }}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon>
                      <v-btn
                        alt="Lower hand"
                        tile
                        outlined
                        @click="lowerHand(i)"
                      >
                        Lower Hand
                      </v-btn>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>End Session</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    alt="End Session"
                    tile
                    center
                    color="error"
                    @click="endSession()"
                  >
                    End this session?<br />
                  </v-btn>
                </v-card-actions>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </div>
    </div>
  </v-card>
</template>

<script>
import { unique } from "@/helpers";
import { TimeStamp } from "@/firebase";

export default {
  name: "SessionAdminPanel",
  methods: {
    deleteQuestion(index) {
      const questions = [...this.questions];
      questions.splice(index, 1);
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          questions
        }
      });
    },
    lowerHand(index) {
      const handsRaised = [...this.handsRaised];
      handsRaised.splice(index, 1);
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          handsRaised: handsRaised.filter(unique)
        }
      });
    },
    startSession() {
      if (!this.isActive) {
        this.randomSlug = Math.floor(Math.random() * 100000);
        this.randomPassword = Math.floor(Math.random() * 100000);
        this.$store.dispatch("updateSession", {
          id: this.$store.state.session[0].id,
          data: {
            active: true,
            activeTime: TimeStamp.fromDate(new Date()),
            randomSlug: this.randomSlug,
            randomPassword: this.randomPassword
          }
        });
      }
    },
    endSession() {
      if (this.isActive) {
        this.$store.dispatch("updateSession", {
          id: this.$store.state.session[0].id,
          data: {
            active: false,
            endTime: TimeStamp.fromDate(new Date())
          }
        });
      }
    },
    anonymizeUsername(question) {
      console.log(question);
      if (question.anonymous) return `Anonymous (${question.username})`;
      return question.username;
    },
    resetSession() {
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          active: false,
          activeTime: null,
          endTime: null,
          visible: [],
          questions: [],
          handsRaised: [],
          randomSlug: "",
          randomPassword: ""
        }
      });
    },
    toggleVisibleParticipant(id) {
      const visibleIds = [...this.visibleParticipants];
      const index = visibleIds.indexOf(id);
      if (index === -1) {
        visibleIds.push(id);
      } else {
        visibleIds.splice(index, 1);
      }
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          visible: visibleIds
        }
      });
    },
    isVisible(id) {
      return this.visibleParticipants.indexOf(id) === -1 ? true : false;
    }
  },
  computed: {
    session() {
      return this.$store.state.session[0];
    },
    questions() {
      return this.$store.state.session[0]?.questions;
    },
    handsRaised() {
      return this.$store.state.session[0]?.handsRaised;
    },
    visibleParticipants() {
      return this.$store.state.session[0]?.visible;
    },
    visibleParticipantsDetails() {
      return this.participants.filter(p => !this.isVisible(p.participantId));
    },
    isActive() {
      return this.$store.state.session[0]?.active;
    }
  },
  props: ["participants", "joinSession"]
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-content__wrap {
  padding: 1px;
}
</style>
