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
import InlineMessage from "primevue/inlinemessage";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmPopup from "primevue/confirmpopup";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Textarea from "primevue/textarea";
import FileUpload from "primevue/fileupload";

import "primevue/resources/themes/mdc-light-deeppurple/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // grid system

createApp(App)
	.use(PrimeVue)
	.use(ConfirmationService)
	.use(ToastService)
	.component("InputText", InputText) // Components from PrimeVue
	.component("Button", Button)
	.component("Card", Card)
	.component("Avatar", Avatar)
	.component("Message", Message)
	.component("InlineMessage", InlineMessage)
	.component("ConfirmPopup", ConfirmPopup)
	.component("Toast", Toast)
	.component("Textarea", Textarea)
	.component("FileUpload", FileUpload)
	.use(store)
	.use(router)
	.mount("#app");
