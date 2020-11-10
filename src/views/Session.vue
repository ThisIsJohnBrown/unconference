<template>
  <div class="container is-fluid mt-6">
    <div class="tile is-ancestor">
      <div class="tile is-4 is-vertical is-parent">
        <div class="tile is-child box">
          <p class="title has-text-white is-size-3">{{ title }}</p>
          <p class="is-size-5 block">
            John Brown
          </p>
          <p>
            {{ details }}
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
          <p class="block">Where</p>
          <p class="block">even</p>
          <p class="block">more</p>
          <p class="block">controls</p>
          <p class="block">will</p>
          <p class="block">go</p>
          <p class="block">eventually.</p>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child box jitsi-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      title: "Very Cool Session Title",
      details:
        "If we quantify the panel, we can get to the JSON transmitter through the mobile PCI interface. The SMTP transmitter is down, calculate the 1080p capacitor so we can override the SDD driver!",
      slug: "another-jitsi-test",
      api: {}
    };
  },
  methods: {
    initJitsi() {
      this.hasJoined = true;
      const domain = "meet.jit.si";
      const options = {
        roomName: this.slug + "a",
        parentNode: document.querySelector(".jitsi-block"),
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true
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
        }
      };

      // eslint-disable-next-line
      this.api = new JitsiMeetExternalAPI(domain, options);
      //   this.api.addEventListener(
      //     "participantRoleChanged",
      //     function(event) {
      //       console.log("--------------");
      //       console.log(this.$store.state.user.data);
      //       if (event.role === "moderator") {
      //         // this.api.executeCommand("toggleLobby", false);
      //       }
      //     }.bind(this)
      //   );
    }
  },
  async created() {
    this.slug = this.$route.params.slug;
    console.log(this.slug);
  },
  mounted() {
    this.initJitsi();
  },
  computed: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.jitsi-block {
}

.box {
  border: solid white 2px;
}
</style>
