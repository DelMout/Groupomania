<template>
	<div>
		<h1>{{ theInfo }}</h1>
		<p v-if="toSend">Titre : <input type="text" v-model="titre" /></p>
		<p v-if="toSend">Contenu : <input type="text" v-model="contenu" /></p>
		<p v-if="toSend">
			Photo (optionnel) : <input type="file" name="image" @change="onFileChange" />
		</p>
		<button v-if="toSend" v-on:click="createPub">Publier</button>
	</div>
</template>

<script>
import { FileUpload } from "v-file-upload"; //! a retirer
import axios from "axios";
export default {
	name: "Publier",
	data() {
		return {
			titre: "",
			contenu: "",
			image: null,
			toSend: true,
			theInfo: "Ici je crée ma publication",
		};
	},
	methods: {
		//* Select a photo
		onFileChange: function(event) {
			console.log(event.target.files[0]);
			this.image = event.target.files[0];
		},
		//* CREATE a PUBLICATION
		createPub: function() {
			const formData = new FormData();
			formData.append("image", this.$data.image);
			formData.append("titre", this.$data.titre);
			formData.append("texte_pub", this.$data.contenu);
			formData.append("userId", this.$store.state.currentUserId);
			axios
				.post(
					"http://localhost:3001/api/pub/create/" + this.$store.state.currentUserId,
					formData
				)
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
