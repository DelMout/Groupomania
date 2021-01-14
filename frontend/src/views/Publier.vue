<template>
	<div>
		<h1>{{ theInfo }}</h1>
		<p v-if="toSend">Titre de ma publication : <input type="text" v-model="titre" /></p>
		<p v-if="toSend">Contenu de ma publication : <input type="text" v-model="contenu" /></p>
		<button v-if="toSend" v-on:click="createPub">Publier</button>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "Publier",
	data() {
		return {
			titre: "",
			contenu: "",
			toSend: true,
			theInfo: "Ici je crée ma publication",
		};
	},
	methods: {
		//* CREATE a PUBLICATION
		createPub: function() {
			axios
				.post("http://localhost:3001/api/pub/create/" + this.$store.state.currentUserId, {
					titre: this.titre,
					contenu: this.contenu,
					userId: this.$store.state.currentUserId,
				})
				.then((resp) => {
					console.log(resp.data);
					console.log("Pub créée !!");
					this.toSend = false;
					this.theInfo = "Votre publication a été créée !";
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
