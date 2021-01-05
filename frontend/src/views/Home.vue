<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" />
		<Compteur />
		<HelloWorld msg="Welcome to Your Vue.js App" />
		<p>{{ joe }}</p>
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Compteur from "@/components/Compteur.vue";

export default {
	name: "Home",
	data() {
		return {
			joe: "Lalalala !",
		};
	},
	components: {
		HelloWorld,
		Compteur,
	},
};
</script>
