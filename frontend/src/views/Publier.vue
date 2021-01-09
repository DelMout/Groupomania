<template>
	<div>
		<h1>{{ theInfo }}</h1>
		<p>Titre de ma publication : <input type="text" v-model="titre" /></p>
		<p>Contenu de ma publication : <input type="text" v-model="contenu" /></p>
		<button v-if="r" v-on:click="createPub">Publier</button>
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
			r: true,
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
					this.theInfo = "Votre publication a été créée !";
					// TODO : transfert vers page du réseau !
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
