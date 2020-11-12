<template>
  <div class="container is-fluid mt-6" v-if="session">
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <p class="title has-text-white is-size-3">{{ session.title }}</p>
          <p class="is-size-5 block">
            John Brown
          </p>
          <p>
            {{ session.details }}
          </p>
        </div>
        <div class="tile is-child box">
          <div>
            <div v-if="authenticated">
              <button v-if="isOwner" class="button" @click="startSession">
                Start the session!
              </button>
              <button
                class="button is-white"
                v-for="participant in participants"
                v-bind:key="participant.participantId"
                @click.prevent="
                  toggleVisibleParticipant(participant.participantId)
                "
              >
                <i class="fas fa-calendar-plus"></i
                ><span>{{ participant.displayName }}</span>
              </button>
              <button
                v-if="!isOwner && isActive"
                class="button"
                @click="joinSession"
              >
                Join the session!
              </button>
              <p v-if="!isOwner && !isActive">
                Session hasn't started yet!
              </p>
            </div>
            <div v-else>
              <p>
                If you want to participate in this session, please register or
                log in!
              </p>
            </div>
          </div>
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child box jitsi-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { TimeStamp } from "@/firebase";
export default {
  data: function() {
    return {
      slug: "another-jitsi-test",
      api: {},
      hasJoined: false,
      participants: [],
      hiddenParticipantIds: []
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
    initJitsi() {
      this.hasJoined = true;
      const domain = "localhost:8081";
      const options = {
        roomName: this.slug,
        parentNode: document.querySelector(".jitsi-block"),
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
        },
        userInfo: {
          // email: this.$store.state.user.email,
          displayName: this.$store.state.userDetails.username
        }
      };

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
      this.api.addEventListeners({
        participantRoleChanged: e => {
          if (e.role == "moderator" && this.visibleParticipants == []) {
            this.initVisibleParticipants(e.id);
          }
        }
      });
    },
    startSession() {
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          active: true,
          activeTime: TimeStamp.fromDate(new Date())
        }
      });
      this.initJitsi();
    },
    joinSession() {
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
      setTimeout(this.initJitsi, 500);
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
    }
  },
  watch: {
    isActive(newActive, oldActive) {
      if (newActive === true && oldActive !== newActive) {
        // setTimeout(this.initJitsi.bind(this), 500);
      }
    },
    visibleParticipants(to) {
      if (this.api) {
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
}

.box {
  border: solid white 2px;
}
</style>
