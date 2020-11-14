<template>
  <v-container v-if="session">
    <v-row>
      <v-col cols="4" style="overflow:auto height: 80vh">
        <div>
          <div class="d-block pa-2 green white--text" v-if="isActive"></div>
          <div class="d-block pa-2 red white--text" v-else></div>
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
          v-bind:joinSession="joinSession"
        />
        <SessionWatcherPanel
          v-bind:hasJoined="hasJoined"
          v-bind:joinSession="joinSession"
          v-if="!isOwner"
        />
      </v-col>
      <v-col>
        <v-card outlined>
          <v-responsive :aspect-ratio="16 / 9">
            <div v-if="isBefore && !isActive">
              This session will start soon!
            </div>
            <div class="jitsi-block" v-if="isActive"></div>
            <div v-if="isComplete">
              This session is over. Thanks for attending!
            </div>
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
      api: {},
      hasJoined: false,
      participants: [],
      hiddenParticipantIds: [],
      randomSlug: "",
      randomPassword: ""
    };
  },
  methods: {
    initVisibleParticipants(id) {
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          visible: [id]
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
    initJitsi() {
      this.hasJoined = true;
      const domain = "localhost:8081";
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
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "chat",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "tileview",
            "help"
          ]
          // filmStripOnly: true
        },
        userInfo: {
          // email: this.$store.state.user.email,
          displayName: this.$store.state.userDetails.username
        }
      };

      console.log("--options", options);

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
        console.log("ROLE CHANGED", e.role, this.visibleParticipants.length);
        if (e.role == "moderator" && this.visibleParticipants.length === 0) {
          this.initVisibleParticipants(e.id);
          console.log("SETTING PASSWORD");
          this.api.executeCommand(
            "password",
            this.randomPassword || this.$store.state.session[0].randomPassword
          );
        }
      });
      this.api.addEventListener("passwordRequired", () => {
        console.log("PASSWORD REQUIRED");
        console.log(this.api);
        this.api.executeCommand(
          "password",
          this.$store.state.session[0].randomPassword
        );
      });
    },
    joinSession() {
      this.$store.dispatch("updateJoined", {
        id: this.$store.state.session[0].id
      });
      this.initJitsi();
    }
  },
  async mounted() {
    this.slug = this.$route.params.slug;
    try {
      await this.$store.dispatch("bindSession", this.slug);
    } catch (error) {
      console.error(error.message);
    }
    if (this.isActive) {
      // setTimeout(this.initJitsi, 500);
    }
  },
  computed: {
    session() {
      return this.$store.state.session[0];
    },
    visibleParticipants() {
      return this.$store.state.session[0]?.visible;
    },
    authenticated() {
      return this.$store.state.user.uid;
    },
    isOwner() {
      return this.session?.created_by === this.$store.state.user.uid;
    },
    isActive() {
      return this.$store.state.session[0]?.active;
    },
    isBefore() {
      return (
        !this.$store.state.session[0].isActive &&
        !this.$store.state.session[0].endTime
      );
    },
    isComplete() {
      return (
        !this.$store.state.session[0].isActive &&
        this.$store.state.session[0].endTime
      );
    }
  },
  watch: {
    isActive(newActive, oldActive) {
      if (newActive === true && oldActive !== newActive) {
        setTimeout(this.initJitsi, 1000);
      }
    },
    visibleParticipants(to) {
      if (this.hasJoined) {
        const ids = this.api.getParticipantsInfo().map(p => p.participantId);
        this.api.executeCommand(
          "toggleParticipant",
          JSON.stringify({
            ids,
            visible: to
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
</style>
