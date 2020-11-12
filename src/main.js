import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import AsyncComputed from "vue-async-computed";

Vue.use(AsyncComputed);

Vue.config.productionTip = false;
Vue.config.devtools = true; //process.env.NODE_ENV === 'development'

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
      render: h => h(App)
    }).$mount("#app");
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
  }
});
