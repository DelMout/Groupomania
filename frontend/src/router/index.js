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
	{
		path: "/admin/users",
		name: "AdminUsers",
		component: () => import(/* webpackChunkName: "users" */ "../views/AdminUsers.vue"),
	},
	{
		path: "/admin/publications",
		name: "AdminPubs",
		component: () => import(/* webpackChunkName: "publications" */ "../views/AdminPubs.vue"),
	},
	{
		path: "/admin/comments",
		name: "AdminComms",
		component: () => import(/* webpackChunkName: "comments" */ "../views/AdminComms.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
