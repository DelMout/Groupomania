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
import { mapGetters, mapState } from "vuex"; // for authentification
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
	computed: {
		...mapState({ token: "token" }),
		...mapGetters(["isLoggedIn"]),
	},
	methods: {
		//* Select a photo
		onFileChange: function(event) {
			console.log(event.target.files[0]);
			this.image = event.target.files[0];
		},
		//* CREATE a PUBLICATION
		createPub: function() {
			if (!this.isLoggedIn) {
				this.$store.dispatch("updateInfo");
				this.$router.push("/");
			} else {
				console.log("token une fois dans create pub !" + this.$store.state.userId);
				console.log(this.$store.state.token);
				const formData = new FormData();
				formData.append("image", this.$data.image);
				formData.append("titre", this.$data.titre);
				formData.append("texte_pub", this.$data.contenu);
				axios({
					method: "post",
					url: "http://localhost:3001/api/pub/create/" + this.$store.state.userId,
					data: formData,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						console.log(resp.data);
						console.log("Pub créée !!");
						this.toSend = false;
						this.theInfo = "Votre publication a été créée !";
					})
					.catch((err) => {
						if (err.response.data === "notEmpty") {
							this.theInfo = "Le titre et le contenu doivent être renseignés.";
						}
						console.log(err);
					});
			}
		},
	},
};
</script>
