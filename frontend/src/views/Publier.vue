<template>
	<div>
		<h1>Ici je crée ma publication</h1>
		<p>Titre de ma publication : <input type="text" v-model="titre" /></p>
		<p>Contenu de ma publication : <input type="text" v-model="contenu" /></p>
		<button v-if="r" v-on:click="createPub">Publier</button>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "Signup",
	data() {
		return {
			titre: "",
			contenu: "",
			r: true,
		};
	},
	methods: {
		//* CREATE a PUBLICATION
		createPub: function() {
			axios
				.post("http://localhost:3001/api/pub/" + this.$store.state.currentUserId, {
					titre: this.titre,
					texte_pub: this.contenu,
					userId: this.$store.state.currentUserId,
				})
				.then((resp) => {
					console.log(resp.data);
					console.log("Pub créée !!");
					// TODO : transfert vers page du réseau !
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
