<template>
  <v-card outlined>
    <v-btn
      tile
      elevation="0"
      @click="startSession"
      color="success"
      v-if="!isActive"
      block
    >
      Start the Session!
    </v-btn>
    <div class="pa-3" v-if="isActive">
      <div>
        <v-row justify="center">
          <v-col v-if="visibleParticipantsDetails.length">
            <h4>Speakers</h4>
            <p>Click to focus on a speaker</p>
            <v-chip-group column>
              <v-chip
                label
                :class="isSpeaker(participant.participantId) ? 'primary' : ''"
                v-for="participant in visibleParticipantsDetails"
                v-bind:key="participant.participantId"
                @click.prevent="
                  toggleHighlightedParticipant(participant.participantId)
                "
              >
                <v-avatar left>
                  <v-img :src="participant.avatarURL"></v-img>
                </v-avatar>
                {{ participant.displayName }}
              </v-chip>
            </v-chip-group>
          </v-col>
          <v-expansion-panels multiple accordion>
            <v-expansion-panel>
              <v-expansion-panel-header
                ><h4>All Attendees</h4></v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <p>
                  Click on a participant to make them a speaker and mute others
                </p>
                <v-chip-group column>
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
                  <v-chip
                    label
                    outlined
                    v-for="participant in nonVisibleParticipantsDetails"
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
                </v-chip-group>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                >Questions ({{ questions.length }})</v-expansion-panel-header
              >
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
              <v-expansion-panel-header
                >Raised Hands ({{
                  handsRaised.length
                }})</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <v-card
                  outlined
                  v-for="(hand, i) in handsRaised"
                  v-bind:key="i"
                >
                  <v-list-item>
                    <v-list-item-content style="padding: 1px;" class="p-0">
                      <div class="overline mb-4">
                        {{ hand.username }}
                      </div>
                    </v-list-item-content>

                    <v-list-item-avatar tile
                      ><v-img :src="hand.avatarURL"></v-img
                    ></v-list-item-avatar>
                  </v-list-item>

                  <v-card-actions>
                    <v-btn
                      alt="Unmute"
                      outlined
                      tile
                      @click="toggleVisibleParticipant(hand.id)"
                    >
                      Unmute
                    </v-btn>
                    <v-btn alt="Lower hand" tile outlined @click="lowerHand(i)">
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>End Session</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card-actions>
                  <v-btn
                    tile
                    elevation="0"
                    @click="resetSession"
                    color="warning"
                  >
                    Reset!
                  </v-btn>
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
  data() {
    return {
      types: [
        { name: "Moderated Panel", type: "panel" },
        { name: "Presentation", type: "presentation" },
        { name: "Open Discussion", type: "discussion" }
      ]
    };
  },
  methods: {
    changeSessionType(type) {
      this.$emit("changeSessionType", type);
    },
    unmuteEveryoneToggle() {
      this.$store.dispatch("updateSession", {
        id: this.session.id,
        data: {
          open: !this.session.open,
          visible: [],
          speaker: "",
          test: "asdf"
        }
      });
    },
    deleteQuestion(index) {
      const questions = [...this.questions];
      questions.splice(index, 1);
      this.$store.dispatch("updateSession", {
        id: this.session.id,
        data: {
          questions
        }
      });
    },
    lowerHand(index) {
      const handsRaised = [...this.handsRaised];
      handsRaised.splice(index, 1);
      this.$store.dispatch("updateSession", {
        id: this.session.id,
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
          id: this.session.id,
          data: {
            active: true,
            activeTime: TimeStamp.fromDate(new Date()),
            randomSlug: this.randomSlug,
            randomPassword: this.randomPassword
          }
        });
        this.$emit("startImmediately");
      }
    },
    endSession() {
      if (this.isActive) {
        this.$store.dispatch("updateSession", {
          id: this.session.id,
          data: {
            active: false,
            endTime: TimeStamp.fromDate(new Date())
          }
        });
      }
    },
    anonymizeUsername(question) {
      if (question.anonymous) return `Anonymous (${question.username})`;
      return question.username;
    },
    resetSession() {
      this.$store.dispatch("updateSession", {
        id: this.session.id,
        data: {
          active: false,
          activeTime: null,
          visible: [],
          questions: [],
          handsRaised: [],
          randomSlug: "",
          randomPassword: "",
          speaker: ""
        }
      });
    },
    toggleVisibleParticipant(id) {
      this.$emit("toggleVisibleParticipant", id);
    },
    toggleHighlightedParticipant(id) {
      this.$emit("toggleHighlightedParticipant", id);
    },
    toggleSpeakerView(id) {
      this.$emit("toggleSpeakerView", id);
    },
    isVisible(id) {
      return this.visibleParticipants.indexOf(id) === -1 ? true : false;
    },
    isSpeaker(id) {
      return this.session.speaker === id ? true : false;
    },
    joinSession() {
      this.$emit("joinSession");
    }
  },
  computed: {
    session() {
      return this.$store.state.session[0];
    },
    sessionType() {
      return this.session?.type;
    },
    questions() {
      return this.session?.questions;
    },
    handsRaised() {
      return this.session?.handsRaised;
    },
    visibleParticipants() {
      return this.session?.visible;
    },
    visibleParticipantsDetails() {
      return this.participants.filter(p => !this.isVisible(p.participantId));
    },
    nonVisibleParticipantsDetails() {
      return this.participants.filter(p => this.isVisible(p.participantId));
    },
    isActive() {
      return this.session?.active;
    },
    isPanel() {
      return this.session.type === "panel";
    }
  },
  props: ["participants"]
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-content__wrap {
  padding: 1px;
}
</style>
