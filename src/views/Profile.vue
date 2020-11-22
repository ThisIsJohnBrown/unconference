<template>
  <div class="section">
    <v-container grid-list-md>
      <v-row>
        <v-col offset="1" cols="2">
          <v-card tile elevation="0" v-if="details">
            <v-avatar size="164" tile v-if="details && details.username">
              <v-img :src="avatar" />
            </v-avatar>
            <div v-if="editing">
              <v-btn @click="clickUpload" tile outlined block
                >Upload image</v-btn
              >
              <v-progress-linear v-model="uploadPercent"></v-progress-linear>
              <input
                type="file"
                ref="avatar"
                style="display: none"
                @change="previewImage"
                accept="image/*"
              />
            </div>
          </v-card>
        </v-col>
        <v-col offset="1" cols="8"
          ><v-card tile elevation="0">
            <v-form>
              <v-text-field
                class="text-h3 back editable"
                :readonly="!isEditing"
                outlined
                flat
                tile
                :label="isEditing ? 'Display Name' : ''"
                placeholder="Display Name"
                v-model="displayName"
              ></v-text-field>
              <div v-if="isUser">
                <v-btn outlined tile flat @click="toggleEditing">{{
                  editing ? "Cancel" : "Edit"
                }}</v-btn>
                <v-btn outlined flat tile @click="saveDetails" v-if="editing"
                  >Save</v-btn
                >
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <div class="container" v-if="owned.length">
      <h3 class="text-h4 mt-6 mb-6">Sessions you created</h3>
      <SessionsList v-bind:sessions="owned" />
    </div>
    <div class="container" v-if="watched.length">
      <h3 class="text-h4 mt-6 mb-6">Sessions on your agenda</h3>
      <SessionsList v-bind:sessions="watched" />
    </div>
    <div class="container" v-else>
      <h3 class="text-h4 mt-6 mb-6">There are no sessions on your agenda</h3>
    </div>
  </div>
</template>

<script>
import SessionsList from "@/components/SessionsList";
import { db, storage } from "@/firebase";
import { getUserDetails } from "@/helpers";

export default {
  name: "Profile",
  data() {
    return {
      editing: false,
      displayName: " ",
      avatar: "",
      imageData: "",
      uploadPercent: 0,
      storageRef: null
    };
  },
  asyncComputed: {
    async profileDetails() {
      if (this.username) {
        const userSnap = await db
          .collection("users")
          .where("username", "==", this.$route.params?.username)
          .get();
        return userSnap.docs[0].data();
      }
      return null;
    }
  },
  computed: {
    profileWatched() {
      return this.$store.state.sessions.filter(a => {
        return this.profileDetails.watched.indexOf(a.id) !== -1;
      });
    },
    isEditing() {
      return this.editing;
    },
    username() {
      return this.$route.params.username;
    },
    details() {
      return this.username
        ? this.profileDetails
        : this.$store.state.userDetails;
    },
    owned() {
      return this.$store.state.ownedSessions;
    },
    watched() {
      if (this.username) {
        return this.profileDetails ? this.profileWatched : {};
      } else {
        return this.$store.state.watchedSessions;
      }
    },
    isUser() {
      if (!this.details) return;
      return (
        this.$store.state.userDetails.username == this.username ||
        !this.username
      );
    }
  },
  components: {
    SessionsList
  },
  methods: {
    getUserDetails,
    toggleEditing() {
      this.editing = !this.editing;
      this.displayName = this.details?.displayName;
      this.avatar = this.details?.avatar;
    },
    async saveDetails() {
      this.editing = false;
      if (this.storageRef) {
        await storage
          .ref(`avatar-${this.details.username}`)
          .put(this.imageData);
      }
      this.$store.dispatch("updateDetails", {
        displayName: this.displayName,
        avatar: `https://firebasestorage.googleapis.com/v0/b/vue-auth-test-d1926.appspot.com/o/avatar-${this.details.username}_400x400?alt=media`
      });
    },

    clickUpload() {
      this.$refs.avatar.click();
    },

    previewImage(event) {
      this.uploadPercent = 0;
      this.imageData = event.target.files[0];
      this.onUpload();
    },

    onUpload() {
      this.storageRef = storage.ref(`tmp-${Math.random()}`).put(this.imageData);
      this.storageRef.on(
        `state_changed`,
        snapshot => {
          this.uploadPercent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          console.log(error.message);
        },
        () => {
          this.uploadPercent = 100;
          this.storageRef.snapshot.ref.getDownloadURL().then(url => {
            this.avatar = url;
          });
        }
      );
    }
  },
  created() {
    this.displayName = this.details?.displayName;
    this.avatar = this.details?.avatar;
  },
  watch: {
    details(newDetails) {
      if (newDetails) {
        this.displayName = newDetails.displayName;
        this.avatar = newDetails.avatar;
      }
    }
  }
};
</script>

<style lang="scss">
$text-field-outlined-label-position-x: 50px;

.v-input.editable {
  input {
    padding: 40px 0px;
  }
  &.v-input--is-readonly {
    fieldset {
      border: none;
    }
  }
}
</style>
