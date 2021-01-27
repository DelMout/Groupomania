import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Components from PrimeVue
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Avatar from "primevue/avatar";
import Message from "primevue/message";

import "primevue/resources/themes/mdc-light-deeppurple/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // grid system

createApp(App)
	.use(PrimeVue)
	.component("InputText", InputText) // Components from PrimeVue
	.component("Button", Button)
	.component("Card", Card)
	.component("Avatar", Avatar)
	.component("Message", Message)
	.use(store)
	.use(router)
	.mount("#app");
