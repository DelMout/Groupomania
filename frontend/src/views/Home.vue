<template>
	<div class="home">
		<h1>Bienvenue sur votre Réseau Social Entreprise</h1>
		<div v-if="infoHome" class="p-grid p-jc-center">
			<Message severity="warn">{{ infoHome }} </Message>
		</div>
		<img alt="Groupomania logo" src="../assets/iconGroupo.png" style="width:30rem;" />
	</div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";

export default {
	name: "Home",
	data() {
		return {};
	},
	components: {},
	computed: {
		...mapState(["infoHome"]),
	},
};
</script>
