import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// App.use(require("vue-moment"));

createApp(App)
	.use(store)
	.use(router)
	.mount("#app");
