<template>
	<div class="home">
		<h1>Bienvenue sur votre Réseau Social Entreprise</h1>
		<div v-if="infoHome" class="p-grid p-jc-center">
			<Message severity="warn">{{ infoHome }} </Message>
		</div>
		<img id="logo" alt="Groupomania logo" src="../assets/iconGroupo.png" />
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	name: "Home",
	computed: {
		...mapState(["infoHome"]),
	},
};
</script>
<style>
#logo {
	width: 30rem;
}
/* MEDIA QUERIES */

@media only screen and (max-width: 768px) {
	/*tablettes et mobiles */
	h1 {
		font-size: 1.5rem;
	}
	#logo {
		width: 20rem;
	}
}
</style>
