<template>
	<div id="app">
		<div id="nav">
			<div id="nav_small" class="p-grid p-mx-5">
				<Button
					class="p-button-outlined p-button-help p-button-text"
					type="button"
					icon="pi pi-bars"
					@click="toggle"
					aria-haspopup="true"
					aria-controls="overlay_menu"
				/>
				<Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
			</div>
			<div id="nav_big">
				<div class="p-grid p-jc-center">
					<TabMenu :model="items" />
				</div>
			</div>
			<div v-if="logged">
				<p>
					<i>Vous êtes connecté.e avec l'adresse email {{ email }}</i>
				</p>
			</div>
			<router-view />
		</div>
	</div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex"; // for authentification
import store from "./store/index.js";
export default {
	name: "Home",
	data() {
		return {
			items: [],
			noLog: [
				{ label: "Home", icon: "pi pi-home", to: "/" },
				{ label: "Mon compte", icon: "pi pi-id-card", to: "/signup" },
				{ label: "Les publications", icon: "pi pi-copy", to: "/publi" },
			],
			publish: [
				{ label: "Home", icon: "pi pi-home", to: "/" },
				{ label: "Mon compte", icon: "pi pi-id-card", to: "/signup" },
				{ label: "Les publications", icon: "pi pi-copy", to: "/publi" },
				{
					label: "Créer publications",
					icon: "pi pi-pencil",
					to: "/publier",
				},
				{
					label: "Se déconnecter",
					icon: "pi pi-power-off",
					command: () => {
						this.setToken(null);
						this.setUserId(null);
					},
					to: "/",
				},
			],
			admin: [
				{ label: "Home", icon: "pi pi-home", to: "/" },
				{ label: "Mon compte", icon: "pi pi-id-card", to: "/signup" },
				{ label: "Les publications", icon: "pi pi-copy", to: "/publi" },
				{ label: "Créer publications", icon: "pi pi-pencil", to: "/publier" },
				{ label: "Utilisateurs", icon: "pi pi-star", to: "/admin/users" },
				{ label: "Publications", icon: "pi pi-star", to: "/admin/publications" },
				{ label: "Commentaires", icon: "pi pi-star", to: "/admin/comments" },
				{
					label: "Se déconnecter",
					icon: "pi pi-power-off",
					command: () => {
						this.setToken(null);
						this.setUserId(null);
					},
					to: "/",
				},
			],
		};
	},
	computed: {
		...mapState(["isAdmin", "logged", "email"]),
		infoHome() {
			return store.getters.infoHome;
		},
	},

	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin"]),
		...mapActions(["checkConnect"]),

		toggle(event) {
			this.$refs.menu.toggle(event);
		},
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect");
		if (this.logged) {
			if (this.isAdmin === 1) {
				this.items = this.admin;
			} else {
				this.items = this.publish;
			}
		} else {
			this.items = this.noLog;
		}
	},
	updated: function() {
		this.$store.dispatch("checkConnect");
		if (this.logged) {
			if (this.isAdmin === 1) {
				this.items = this.admin;
			} else {
				this.items = this.publish;
			}
		} else {
			this.items = this.noLog;
		}
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

#nav_small {
	visibility: collapse;
}
#nav_big {
	visibility: visible;
}

/* MEDIA QUERIES */

@media only screen and (max-width: 768px) {
	#nav_small {
		visibility: visible;
	}

	#nav_big {
		visibility: collapse;
	}
}
</style>
