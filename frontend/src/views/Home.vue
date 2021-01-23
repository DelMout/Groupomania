<template>
	<div class="home">
		<h1>Bienvenue sur votre Réseau Social Entreprise</h1>
		<p>{{ this.$store.state.infoHome }}</p>
		<img alt="Groupomania logo" src="../assets/iconGroupo.png" />
	</div>
</template>

<script>
// @ is an alias to /src

export default {
	name: "Home",
	data() {
		return {};
	},
	components: {},
};
</script>
