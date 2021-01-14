import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/signup",
		name: "Signup",
		component: () => import(/* webpackChunkName: "signup" */ "../views/Signup.vue"),
	},
	{
		path: "/publi",
		name: "Publication",
		component: () => import(/* webpackChunkName: "publication" */ "../views/Publication.vue"),
	},
	{
		path: "/publier",
		name: "Publier",
		component: () => import(/* webpackChunkName: "publier" */ "../views/Publier.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
