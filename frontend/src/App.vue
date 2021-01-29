<template>
	<div id="app">
		<div id="nav">
			<div class="p-grid p-jc-center">
				<TabMenu :model="items" />
				<TabMenu v-if="isLoggedIn" :model="publish" />
				<TabMenu v-if="isAdmin === 1 && isLoggedIn" :model="admin" />
				<TabMenu v-if="isLoggedIn" @click="deconnect" :model="quit" />
			</div>
			<router-view />
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState } from "vuex"; // for authentification
export default {
	name: "Home",
	data() {
		return {
			items: [
				{ label: "Home", icon: "pi pi-home", to: "/" },
				{ label: "Mon compte", icon: "pi pi-id-card", to: "/signup" },
				{ label: "Les publications", icon: "pi pi-copy", to: "/publi" },
			],
			publish: [{ label: "Créer une publication", icon: "pi pi-pencil", to: "/publier" }],
			quit: [{ label: "Se déconnecter", icon: "pi pi-power-off", to: "/" }],
			admin: [
				{ label: "Utilisateurs", icon: "pi pi-star", to: "/admin/users" },
				{ label: "Publications", icon: "pi pi-star", to: "/admin/publications" },
				{ label: "Commentaires", icon: "pi pi-star", to: "/admin/comments" },
			],
		};
	},
	computed: {
		...mapState({ isAdmin: "isAdmin" }),
		isLoggedIn() {
			return this.$store.state.isLoggedIn;
		},
	},
	methods: {
		deconnect: function() {
			this.$store.state.user = null;
			this.$store.state.token = null;
			this.$store.commit("setLogIn");
			this.$router.push("/");
		},
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: grey;
	/* background-color: rgb(241, 241, 189); */
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: grey;
}

#nav a.router-link-exact-active {
	color: #673ab7;
}
</style>
