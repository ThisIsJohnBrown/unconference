import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import AsyncComputed from "vue-async-computed";
import vuetify from "./plugins/vuetify";
import vueAwesomeCountdown from "vue-awesome-countdown";

Vue.use(AsyncComputed);
Vue.use(vueAwesomeCountdown);
Vue.config.devtools = true; //process.env.NODE_ENV === "development";
Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    store.commit({
      type: "user/loginUser",
      user
    });
  } else {
    store.commit({
      type: "user/logoutUser"
    });
  }
  if (!app) {
    await store.dispatch(
      "conferences/bindConference",
      process.env.VUE_APP_CONFERENCE_ID
    );
    if (user) {
      await store.dispatch("user/bindUser", user.uid);
    }
    store.dispatch("sessions/bindSessions", process.env.VUE_APP_CONFERENCE_ID);
    if (user) {
      store.dispatch("user/bindUserOwned");
      store.dispatch("user/bindUserWatched");
    }
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");

    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
  }
});
