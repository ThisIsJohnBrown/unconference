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
          <p class="block">Where</p>
          <p class="block">all</p>
          <p class="block">the</p>
          <p class="block">controls</p>
          <p class="block">will</p>
          <p class="block">go</p>
          <p class="block">eventually.</p>
        </div>
        <div class="tile is-child box">
          <div v-if="!hasJoined">
            <div v-if="authenticated">
              <button v-if="isOwner" class="button" @click="startSession">
                Start the session!
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
      hasJoined: false
    };
  },
  methods: {
    initJitsi() {
      this.hasJoined = true;
      const domain = "localhost:8080";
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
        }
      };

      // eslint-disable-next-line
      this.api = new JitsiMeetExternalAPI(domain, options);
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
  async created() {
    this.slug = this.$route.params.slug;
    try {
      await this.$store.dispatch("bindSession", this.slug);
    } catch (error) {
      console.error(error.message);
    }
  },
  mounted() {
    if (this.isActive) {
      this.initJitsi();
    }
  },
  computed: {
    session() {
      return this.$store.state.session[0];
    },
    authenticated() {
      return this.$store.state.user.uid;
    },
    isOwner() {
      return this.session?.created_by.user === this.$store.state.user.uid;
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
