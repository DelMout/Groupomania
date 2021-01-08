import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
	},
	{
		path: "/nouveau",
		name: "Nouveau",
		component: () => import(/* webpackChunkName: "nouveau" */ "../views/Nouveau.vue"),
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
