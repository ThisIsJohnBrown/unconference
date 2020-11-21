<template>
  <v-container fluid ma-2 v-if="session">
    <v-row>
      <v-col cols="4" style="overflow:auto height: 80vh">
        <div>
          <div class="d-block pa-2 green white--text" v-if="isActive"></div>
        </div>
        <v-card outlined>
          <v-card-title>
            {{ session.title }}
          </v-card-title>
          <v-card-subtitle>
            Moderated by John Brown
          </v-card-subtitle>
          <v-card-subtitle>
            {{ session.details }}
          </v-card-subtitle>
        </v-card>
        <SessionAdminPanel
          v-bind:participants="participants"
          v-bind:api="api"
          v-if="isOwner"
          @joinSession="joinSession"
          @toggleVisibleParticipant="toggleVisibleParticipant"
          @toggleHighlightedParticipant="toggleHighlightedParticipant"
          @toggleSpeakerView="toggleSpeakerView"
          @changeSessionType="changeSessionType"
          @startImmediately="startImmediately"
        />
        <SessionWatcherPanel
          v-bind:hasJoined="hasJoined"
          @joinSession="joinSession"
          v-if="!isOwner"
          v-bind:participantId="participantId"
        />
      </v-col>
      <v-col>
        <v-card outlined v-if="tempToggle">
          <v-responsive :aspect-ratio="16 / 9" align="center">
            <h3 class="text-h3 mt-3 mb-n6">
              Stay safe out there.
            </h3>
            <v-img
              :aspect-ratio="16 / 9"
              contain
              :src="require('@/assets/safe.png')"
            ></v-img>
          </v-responsive>
        </v-card>
        <v-card outlined v-else>
          <v-responsive :aspect-ratio="16 / 9">
            <div v-if="isBefore && !isActive" align="center">
              <h3 class="text-h3 mt-3 mb-n6">Starting soon!</h3>
              <v-img
                :aspect-ratio="16 / 9"
                contain
                :src="require('@/assets/mermaid.png')"
              ></v-img>
            </div>
            <div class="jitsi-block" v-if="isActive"></div>
          </v-responsive>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SessionAdminPanel from "@/components/SessionAdminPanel";
import SessionWatcherPanel from "@/components/SessionWatcherPanel";

export default {
  components: { SessionAdminPanel, SessionWatcherPanel },
  data: function() {
    return {
      slug: "another-jitsi-test",
      api: null,
      hasJoined: false,
      participants: [],
      hiddenParticipantIds: [],
      randomSlug: "",
      randomPassword: "",
      speakerView: false,
      doStartImmediately: false,
      participantId: "",
      tempToggle: false
    };
  },
  methods: {
    changeSessionType(type) {
      const me = this.api
        .getParticipantsInfo()
        .filter(
          p => p.displayName === this.$store.state.userDetails.username
        )[0];
      if (type === "discussion") {
        type;
      } else if (type === "panel") {
        this.speakerView = false;
        this.$store.dispatch("updateSession", {
          id: this.$store.state.session[0].id,
          data: {
            speaker: ""
          }
        });
      } else if (type === "presentation") {
        this.speakerView = true;
        this.$store.dispatch("updateSession", {
          id: this.$store.state.session[0].id,
          data: {
            speaker: me.participantId
          }
        });
      }
    },
    initModerator(id) {
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          visible: [id],
          speaker: id
        }
      });
    },
    addVisibleParticipant(id) {
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          visible: [...this.$store.state.session[0].visible, id]
        }
      });
    },
    toggleSpeakerView() {
      this.speakerView = !this.speakerView;
      // this.api.executeCommand("toggleTileView");
      this.api.executeCommand(
        "setSpeakerView",
        JSON.stringify({
          enabled: this.speakerView,
          speaker: this.visibleParticipants[0]
        })
      );
    },
    startImmediately() {
      this.doStartImmediately = true;
    },
    initJitsi() {
      if (!this.api) {
        this.hasJoined = true;
        const domain = process.env.VUE_APP_JITSI_URL;
        const options = {
          roomName: `${this.slug}-${this.randomSlug ||
            this.$store.state.session[0].randomSlug}`,
          parentNode: document.querySelector(".jitsi-block"),
          password:
            this.randomPassword || this.$store.state.session[0].randomPassword,
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: true,
            prejoinPageEnabled: false
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "closedcaptions",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "settings",
              "videoquality",
              "filmstrip",
              "tileview"
            ]
            // filmStripOnly: true
          },
          userInfo: {
            // email: this.$store.state.user.email,
            displayName: this.$store.state.userDetails.username
          }
        };

        if (this.isOwner) {
          this.isOwner;
        }

        // eslint-disable-next-line
      this.api = new JitsiMeetExternalAPI(domain, options);
        this.api.executeCommand(
          "avatarUrl",
          `https://robohash.org/${this.$store.state.userDetails.username}.png` // this.$store.state.userDetails?.avatar
        );
        this.api.executeCommand("toggleTileView");
        this.api.addEventListener("participantJoined", e => {
          this.participants = this.api.getParticipantsInfo();
          this.api.executeCommand(
            "toggleParticipant",
            JSON.stringify({
              ids: this.participants,
              visible: this.visibleParticipants
            })
          );
          e;
        });
        this.api.addEventListener("participantRoleChanged", e => {
          if (e.role == "moderator" && this.visibleParticipants.length === 0) {
            this.initModerator(e.id);
            this.api.executeCommand(
              "password",
              this.randomPassword || this.$store.state.session[0].randomPassword
            );
          }
        });
        this.api.addEventListener("videoConferenceJoined", e => {
          this.participantId = e.id;
          if (this.speaker) {
            this.api.executeCommand(
              "setSpeakerView",
              JSON.stringify({
                enabled: false,
                speaker: this.speaker
              })
            );
          } else {
            this.api.executeCommand(
              "setSpeakerView",
              JSON.stringify({
                enabled: true
              })
            );
          }
        });
        this.api.addEventListener("passwordRequired", () => {
          this.api.executeCommand(
            "password",
            this.$store.state.session[0].randomPassword
          );
        });
        this.api.addEventListener("participantLeft", () => {
          this.api.executeCommand(
            "password",
            this.$store.state.session[0].randomPassword
          );
        });
      }
    },
    joinSession() {
      this.$store.dispatch("updateJoined", {
        id: this.$store.state.session[0].id
      });
      this.initJitsi();
    },
    toggleHighlightedParticipant(id) {
      this.speakerView = false;
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          speaker: this.speaker === id ? "" : id
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
    }
  },
  computed: {
    session() {
      return this.$store.state.session[0];
    },
    startTime() {
      return new Date(this.session.startTime.seconds * 1000);
    },
    endTime() {
      return new Date(this.session.endTime.seconds * 1000);
    },
    visibleParticipants() {
      return this.session?.visible;
    },
    authenticated() {
      return this.$store.state.user.uid;
    },
    isOwner() {
      return this.session?.created_by === this.$store.state.user.uid;
    },
    isActive() {
      return this.session?.active;
    },
    isBefore() {
      return (
        !this.isActive && !this.session.activeTime && this.endTime > new Date()
      );
    },
    isComplete() {
      return !this.isActive && this.endTime < new Date();
    },
    speaker() {
      return this.session?.speaker;
    },
    isOpen() {
      return this.session?.open;
    },
    conference() {
      return this.$store.state.conference;
    }
  },
  watch: {
    async conference() {
      this.slug = this.$route.params.slug;
      try {
        await this.$store.dispatch("bindSession", this.slug);
      } catch (error) {
        console.error(error.message);
      }
    },
    isActive(newActive, oldActive) {
      if (oldActive === true && newActive === false) {
        this.tempToggle = true;
      }
      if (newActive === true && oldActive !== newActive) {
        if (this.doStartImmediately) {
          setTimeout(this.initJitsi, 100);
        } else {
          setTimeout(this.initJitsi, 2000);
        }
      }
    },
    speaker(to) {
      if (this.isActive) {
        const enabled = to ? false : true;
        // if (to) {
        this.api.executeCommand(
          "setSpeakerView",
          JSON.stringify({
            enabled,
            speaker: to
          })
        );
      }
      // }
    },
    visibleParticipants(to) {
      if (this.hasJoined) {
        const ids = this.api.getParticipantsInfo().map(p => p.participantId);
        const missing = ids.filter(id =>
          to.indexOf(id) === -1 ? false : true
        );
        this.api.executeCommand(
          "toggleParticipant",
          JSON.stringify({
            ids,
            visible: missing
          })
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.jitsi-block {
  height: 100%;
}
.v-card__title {
  word-break: normal;
}
</style>
