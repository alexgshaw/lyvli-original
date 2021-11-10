import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

import users from "./mock-data.js";

let data = {
  users: users,
};

new Vue({
  router,
  data,
  render: (h) => h(App),
}).$mount("#app");
