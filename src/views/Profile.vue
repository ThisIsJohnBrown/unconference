<template>
  <div class="section">
    <v-container grid-list-md>
      <v-row>
        <v-col offset="1" cols="2">
          <v-card tile elevation="0" v-if="details">
            <v-img
              :src="`https://robohash.org/${details.username}.png`"
              v-if="details && details.username"
            ></v-img>
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
                :label="isEditing ? 'Display Name' : ''"
                placeholder="Display Name"
                v-model="displayName"
              ></v-text-field>
              <div v-if="isUser">
                <v-btn @click="toggleEditing">{{
                  editing ? "Cancel" : "Edit"
                }}</v-btn>
                <v-btn @click="saveDetails" v-if="editing">Save</v-btn>
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
import { db } from "@/firebase";
import { getUserDetails } from "@/helpers";

export default {
  name: "Profile",
  data() {
    return {
      editing: false,
      displayName: " "
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
    sessions() {
      return [...this.$store.state.sessions].splice(0, 3);
    },
    username() {
      return this.$route.params.username;
    },
    details() {
      return this.$route.params.username
        ? this.profileDetails
        : this.$store.state.userDetails;
    },
    owned() {
      return this.$store.state.ownedSessions;
    },
    watched() {
      if (this.$route.params.username) {
        return this.profileDetails ? this.profileWatched : {};
      } else {
        return this.$store.state.watchedSessions;
      }
    },
    isUser() {
      if (!this.details) return;
      return (
        this.$store.state.userDetails.username == this.$route.params.username ||
        !this.$route.params.username
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
    },
    saveDetails() {
      this.editing = false;
      this.$store.dispatch("updateDetails", {
        displayName: this.displayName
      });
    }
  },
  created() {
    this.displayName = this.details?.displayName;
  },
  watch: {
    details(newDetails) {
      if (newDetails) {
        this.displayName = newDetails.displayName;
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
