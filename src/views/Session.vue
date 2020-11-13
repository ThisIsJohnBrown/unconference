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
              <p v-if="isActive">Session is active</p>
              <p v-else>Session IS NOT active</p>

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
            <SessionAdmin
              v-if="isOwner"
              v-bind:participants="participants"
              v-bind:api="api"
            />
            <div v-if="isActive && !isOwner">
              <button class="button" @click="joinSession" v-if="!hasJoined">
                Join the session!
              </button>
              <div v-if="hasJoined">
                <form @submit.prevent="submitQuestion">
                  <input class="input" type="class" v-model="question" />
                  <button class="button">Submit Question</button>
                </form>
                <button class="button" @click="toggleHand">Raise Hand</button>
              </div>
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
import SessionAdmin from "@/components/SessionAdmin";
import { unique } from "@/helpers";
export default {
  components: { SessionAdmin },
  data: function() {
    return {
      slug: "another-jitsi-test",
      api: {},
      hasJoined: false,
      participants: [],
      hiddenParticipantIds: [],
      randomSlug: "",
      randomPassword: "",
      question: "",
      isHandRaised: false
    };
  },
  methods: {
    toggleHand() {
      this.isHandRaised = !this.isHandRaised;
      let handsRaised = [...this.handsRaised];
      const index = handsRaised.indexOf(this.$store.state.user.uid);
      if (index === -1) {
        handsRaised.push(this.$store.state.user.uid);
      } else {
        handsRaised.splice(index, 1);
      }
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          handsRaised: handsRaised.filter(unique)
        }
      });
    },
    submitQuestion() {
      const question = {
        user: this.$store.state.user.uid,
        question: this.question
      };
      const questions = [...this.questions, question];
      this.$store.dispatch("updateSession", {
        id: this.$store.state.session[0].id,
        data: {
          questions: questions
        }
      });
      this.question = "";
    },
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
    }
  },
  watch: {
    isActive(newActive, oldActive) {
      if (newActive === true && oldActive !== newActive && this.isOwner) {
        this.initJitsi();
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
}

.box {
  border: solid white 2px;
}
</style>
