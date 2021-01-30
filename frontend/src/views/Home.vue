<template>
	<div class="home">
		<h1>Bienvenue sur votre Réseau Social Entreprise</h1>
		<div v-if="this.$store.getters.infoHome" class="p-grid p-jc-center">
			<Message severity="warn">{{ this.$store.getters.infoHome }}</Message>
		</div>
		<img alt="Groupomania logo" src="../assets/iconGroupo.png" style="width:30rem;" />
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
