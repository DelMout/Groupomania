<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link to="/signup">Mon compte</router-link
			><span>
				|
				<router-link to="/publi">Les publications</router-link>
				|
				<router-link v-if="isLoggedIn" to="/publier"
					>Créer une publication</router-link
				></span
			>
			|
			<span v-if="isLoggedIn">
				<router-link v-on:click="deconnect" to="/">Se déconnecter</router-link></span
			>
		</div>
		<router-view />
	</div>
</template>
<script>
import { mapGetters, mapState } from "vuex"; // for authentification
export default {
	name: "Home",
	computed: {
		...mapGetters(["isLoggedIn"]),
	},
	methods: {
		deconnect: function() {
			this.$store.state.user = null;
			this.$store.state.token = null;
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
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
