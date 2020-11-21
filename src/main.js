import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import AsyncComputed from "vue-async-computed";
import vuetify from "./plugins/vuetify";

Vue.use(AsyncComputed);

Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    if (user) {
      store.commit({
        type: "loginUser",
        user
      });
    } else {
      store.commit({
        type: "logoutUser"
      });
    }
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});
