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
                tile
                :label="isEditing ? 'Display Name' : ''"
                placeholder="Display Name"
                v-model="displayName"
              ></v-text-field>
              <v-container v-if="isEditing">
                <v-row>
                  <v-icon class="mr-2 mb-8">fa fa-home</v-icon>
                  <v-text-field
                    class="editable"
                    placeholder=""
                    :readonly="!isEditing"
                    outlined
                    tile
                    x-large
                    v-model="social.homepage"
                    type="url"
                    :label="isEditing ? 'Homepage URL' : ''"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-icon class="mr-2 mb-8">fab fa-twitter</v-icon>
                  <v-text-field
                    class="editable"
                    placeholder=""
                    :readonly="!isEditing"
                    outlined
                    tile
                    x-large
                    v-model="social.twitter"
                    :label="isEditing ? 'Twitter username' : ''"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-icon class="mr-2 mb-8">fab fa-instagram</v-icon>
                  <v-text-field
                    class="editable"
                    placeholder=""
                    :readonly="!isEditing"
                    outlined
                    tile
                    x-large
                    v-model="social.instagram"
                    :label="isEditing ? 'Instagram username' : ''"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-icon class="mr-2 mb-8">fab fa-linkedin</v-icon>
                  <v-text-field
                    class="editable"
                    placeholder=""
                    :readonly="!isEditing"
                    outlined
                    tile
                    x-large
                    v-model="social.linkedin"
                    :label="isEditing ? 'Linkedin username' : ''"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-icon class="mr-2 mb-8">fab fa-github</v-icon>
                  <v-text-field
                    class="editable"
                    placeholder=""
                    :readonly="!isEditing"
                    outlined
                    tile
                    x-large
                    v-model="social.github"
                    :label="isEditing ? 'Github username' : ''"
                  ></v-text-field>
                </v-row>
              </v-container>
              <v-container v-else>
                <v-row align="center" justify="space-around">
                  <v-btn
                    icon
                    color="black"
                    v-if="socialLinks.homepage"
                    :href="socialLinks.homepage"
                    ><v-icon>fa fa-home</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    color="black"
                    v-if="socialLinks.twitter"
                    :href="`https://twitter.com/${socialLinks.twitter}`"
                    ><v-icon>fab fa-twitter</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    color="black"
                    v-if="socialLinks.instagram"
                    :href="`https://instagram.com/${socialLinks.instagram}`"
                    ><v-icon>fab fa-instagram</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    color="black"
                    v-if="socialLinks.linkedin"
                    :href="
                      `https://www.linkedin.com/in/${socialLinks.linkedin}/`
                    "
                    ><v-icon>fab fa-linkedin</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    color="black"
                    v-if="socialLinks.github"
                    :href="`https://github.com/${socialLinks.github}`"
                    ><v-icon>fab fa-github</v-icon></v-btn
                  >
                </v-row>
              </v-container>
              <div v-if="isUser">
                <v-btn outlined tile @click="toggleEditing">{{
                  editing ? "Cancel" : "Edit"
                }}</v-btn>
                <v-btn outlined tile @click="saveDetails" v-if="editing"
                  >Save</v-btn
                >
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <div v-if="!username">
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
  </div>
</template>

<script>
import SessionsList from "@/components/SessionsList";
import { db, storage } from "@/firebase";

export default {
  name: "Profile",
  data() {
    return {
      editing: false,
      displayName: " ",
      avatar: "",
      imageData: "",
      uploadPercent: 0,
      storageRef: null,
      social: {
        twitter: "",
        instagram: "",
        linkedin: "",
        github: ""
      },
      newAvatar: false
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
      return this.$store.state.sessions.sessions.filter(a => {
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
        : this.$store.state.user.userDetails;
    },
    owned() {
      return this.$store.state.user.owned;
    },
    socialLinks() {
      return this.details && this.details.social ? this.details.social : {};
    },
    watched() {
      if (this.username) {
        return this.profileDetails ? this.profileWatched : {};
      } else {
        return this.$store.state.user.watched;
      }
    },
    isUser() {
      // if (!this.details) return;
      return !this.username;
    }
  },
  components: {
    SessionsList
  },
  methods: {
    toggleEditing() {
      this.editing = !this.editing;
      this.syncEditingDetails();
    },
    syncEditingDetails() {
      this.displayName = this.details?.displayName;
      this.avatar = this.details?.avatar;
      if (this.details?.social) {
        this.social.homepage = this.details?.social.homepage || "";
        this.social.twitter = this.details?.social.twitter || "";
        this.social.instagram = this.details?.social.instagram || "";
        this.social.github = this.details?.social.github || "";
        this.social.linkedin = this.details?.social.linkedin || "";
      }
    },
    async saveDetails() {
      this.editing = false;
      if (this.storageRef) {
        await storage
          .ref(`avatar-${this.details.username}`)
          .put(this.imageData);
      }
      this.$store.dispatch("user/updateDetails", {
        displayName: this.displayName,
        avatar: this.avatar,
        social: this.social
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
      this.storageRef = storage
        .ref(`tmp/tmp-${Math.random()}`)
        .put(this.imageData);
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
  mounted() {
    this.syncEditingDetails();
  },
  watch: {
    details(newDetails) {
      if (newDetails) {
        this.syncEditingDetails();
      }
    }
  }
};
</script>

<style lang="scss">
$text-field-outlined-label-position-x: 50px;

.v-input.editable {
  &.text-h3 input {
    padding: 40px 0px;
  }
  &.v-input--is-readonly {
    fieldset {
      border: none;
    }
  }
}
</style>
