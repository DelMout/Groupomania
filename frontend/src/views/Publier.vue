<template>
	<div>
		<div class="p-grid">
			<div class="p-col-4 p-offset-4">
				<Message v-if="message" :severity="severity" :sticky="true" @click="close">{{
					theInfo
				}}</Message>
				<h1>Ici, je crée ma publication</h1>
			</div>
		</div>

		<div class="p-grid vertical-container p-text-left">
			<div class="p-col-6 p-offset-4 p-px-auto">
				<div v-if="toSend" class="p-col  ">
					<p class="p-float-label p-my-0">
						<Textarea
							id="titre"
							:autoResize="true"
							rows="1"
							cols="65"
							v-model="titre"
						/><label for="titre">Titre</label>
					</p>
				</div>
				<div v-if="toSend" class="p-col  ">
					<p class="p-float-label">
						<Textarea
							id="contenu"
							:autoResize="true"
							rows="5"
							cols="65"
							v-model="contenu"
						/><label for="contenu">Contenu</label>
					</p>
				</div>
				<p v-if="toSend">
					<!-- <FileUpload type="file" mode="basic" name="image" @change="onFileChange" /> -->
					Photo (optionnel) : <input type="file" name="image" @change="onFileChange" />
				</p>
				<Button label="Publier" v-if="toSend" @click="createPub" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"; // for authentification
import axios from "axios";
export default {
	name: "Publier",
	data() {
		return {
			titre: "",
			contenu: "",
			image: null,
			toSend: true,
			theInfo: "",
			message: false,
			severity: "success",
		};
	},
	computed: {
		...mapState(["token", "logged"]),
	},
	methods: {
		...mapMutations(["setInfo"]),
		...mapActions(["checkConnect"]),
		//* Select a photo
		onFileChange: function(event) {
			console.log(event.target.files[0]);
			this.image = event.target.files[0];
		},
		//* When close alert message
		close: function() {
			this.message = false;
		},

		//* CREATE a PUBLICATION
		createPub: function() {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
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
						this.$router.push("http://localhost:8080/publi");
					})
					.catch((err) => {
						if (err.response.data === "notEmpty") {
							this.severity = "error";

							this.message = true;
							this.theInfo = "Le titre et le contenu doivent être renseignés.";
						}
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
						res.send(err);
					});
			}
		},
	},
};
</script>
