<template>
	<div>
		<h1 v-if="!isLoggedIn">
			Pour accéder au réseau social Groupomania, <br />renseigner les informations suivantes
		</h1>

		<div>
			<h1 v-if="mod">Merci de renseigner le formulaire ci-dessous</h1>
			<h2 style="color:red;">{{ theInfo }}</h2>
			<div enctype="multipart/form-data">
				<p v-if="mod || creat">
					Prénom : <input type="text" @keyup="checkData" v-model="prenom" />
					<span style="background-color:pink;">{{ prenomInfo }} </span>
				</p>
				<p v-if="mod || creat">
					Nom : <input type="text" @keyup="checkData" v-model="nom" /><span
						style="background-color:pink;"
						>{{ nomInfo }}
					</span>
				</p>
				<p v-if="!isLoggedIn || creat">
					Email : <input type="text" @keyup="checkData" v-model="email" />
					<span v-if="creat" style="background-color:pink;">{{ emailInfo }} </span>
				</p>
				<p v-if="mod || creat">
					Service : <input type="text" @keyup="checkData" v-model="service" /><span
						style="background-color:pink;"
						>{{ serviceInfo }}
					</span>
				</p>

				<p v-if="!isLoggedIn || mod || creat">
					Mot de passe :
					<input :type="type" @keyup="checkData" v-model="password" /><button
						@click="visibility"
					>
						{{ hide }}</button
					><span v-if="mod || creat" style="background-color:pink;"
						>{{ passwordInfo }}
					</span>
					<span style="color:red;" v-if="mod"
						>Saisir un autre mot de passe, modifiera votre mot de passe.</span
					>
				</p>
				<p v-if="mod || creat">
					Description (optionnel) :
					<input type="text" v-model="description" />
				</p>
				<p v-if="mod || creat">
					Photo (optionnel) :<input type="file" name="image" @change="onFileChange" />
				</p>
			</div>
			<div v-if="photo != null && mod">
				<span>Votre photo actuelle : </span
				><img style="width:200px;" :src="photo" alt="photo utilisateur" />
			</div>
			<div v-if="photo === null && mod">Vous n'avez pas de photo actuellement.</div>
			<button v-if="!isLoggedIn && !creat" v-on:click="loginUser">
				Entrer sur le GroupoSocialMania !</button
			><button v-if="creat" v-on:click="createUser">Valider</button><br /><button
				v-if="mod"
				v-on:click="modifUser"
			>
				Valider les modifications</button
			><br />
			<button v-if="isLoggedIn && !mod && !sup" v-on:click="demandModifUser">
				Modifier mon compte</button
			><button v-if="isLoggedIn && !mod && !sup" v-on:click="demandDeleteUser">
				Supprimer mon compte
			</button>
			<button style="color:red;" v-if="sup" v-on:click="deleteUser">
				Confirmer la suppression de mon compte
			</button>
			<p v-if="!isLoggedIn && !creat" style="color:blue;">
				Pas encore de compte ? <button v-on:click="wantCreate">Créer un compte</button>
			</p>
		</div>
	</div>
</template>

<script>
// import { FileUpload } from "v-file-upload"; //! a retirer
import moment from "moment"; //! Pour essais sur dates, à retirer par la suite !

import { mapMutations, mapGetters, mapState } from "vuex";
import jwt_decode from "jwt-decode";
import axios from "axios";
export default {
	name: "Signup",

	data() {
		return {
			theInfo: "",
			prenom: "",
			nom: "",
			email: "",
			service: "",
			password: "",
			description: "",
			photo: "",
			image: null,
			creat: false, //phase user creation
			mod: false, //phase modification user
			sup: false, //phase delete user
			indexDel: "",
			// password: "",
			type: "password",
			hide: "Voir",
			// selectedFile: null,
			// file: "",
			paramUser: {
				prenom: "prénom",
				nom: "nom",
				email: "email",
				service: "service",
				description: "description",
				password: "mot de passe",
			},
			notStrong: [],
			prenomTest: "",
			nomTest: "",
			serviceTest: "",
			emailTest: "",
			prenomInfo: "Merci de renseigner ce champ",
			nomInfo: "Merci de renseigner ce champ",
			serviceInfo: "Merci de renseigner ce champ",
			emailInfo: "Merci de renseigner ce champ",
			passwordInfo: "Merci de renseigner ce champ",
			min: "",
			up: "",
			low: "",
			num: "",
			convers: {
				min: "10 caractères minimum",
				uppercase: "manque majuscule",
				lowercase: "manque minuscle",
				digits: "manque chiffres",
				not: 'les symboles "$.=" et apostrophe sont interdits',
			},
		};
	},
	computed: {
		...mapState({ token: "token" }, { userId: "userId" }, { isAdmin: "isAdmin" }),
		...mapGetters(["isLoggedIn"]),
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin"]),
		//* Hide or show password
		visibility() {
			if (this.type === "password") {
				this.type = "text";
				this.hide = "Masquer";
			} else {
				this.type = "password";
				this.hide = "Voir";
			}
		},

		//* Check datas in form
		checkData: function() {
			if (this.prenom !== "") {
				this.prenomTest = !/[^_a-zA-ZÀ-ÿ-]/.test(this.prenom); // Renvoie true qd bonne saisie
				if (this.prenomTest === false) {
					this.prenomInfo = "Caractère non accépté.";
				} else {
					this.prenomInfo = "";
				}
				// } else(this.prenom !== null) {
			} else if (this.prenom === "") {
				this.prenomInfo = "Merci de renseigner ce champ";
			}

			if (this.nom !== "") {
				this.nomTest = !/[^_a-zA-ZÀ-ÿ- ']/.test(this.nom);
				if (this.nomTest === false) {
					this.nomInfo = "Caractère non accépté.";
				} else {
					this.nomInfo = "";
				}
			} else if (this.nom === "") {
				this.nomInfo = "Merci de renseigner ce champ";
			}

			if (this.service !== "") {
				this.serviceTest = !/[^_0-9a-zA-ZÀ-ÿ- ']/.test(this.service);
				if (this.serviceTest === false) {
					this.serviceInfo = "Caractère non accépté.";
				} else {
					this.serviceInfo = "";
				}
			} else if (this.service === "") {
				this.serviceInfo = "Merci de renseigner ce champ";
			}

			if (this.password !== "") {
				let passwordMin = this.password.length >= 10;
				let passwordUp = /[A-Z]/.test(this.password);
				let passwordLow = /[a-z]/.test(this.password);
				let passwordNum = /[0-9]/.test(this.password);
				if (passwordMin === false) {
					this.min = "10 caractères minimum |";
				} else {
					this.min = "";
				}

				if (passwordUp === false) {
					this.up = " 1 majuscule requise |";
				} else {
					this.up = "";
				}
				if (passwordLow === false) {
					this.low = " 1 minuscule requise |";
				} else {
					this.low = "";
				}
				if (passwordNum === false) {
					this.num = " 1 chiffre requis ";
				} else {
					this.num = "";
				}
				this.passwordInfo = this.min + this.up + this.low + this.num;
			} else if (this.password === "") {
				this.passwordInfo = "Merci de renseigner ce champ";
			}

			if (this.email !== "") {
				this.emailTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
					this.email
				);
				if (this.emailTest === false) {
					this.emailInfo = "Adresse email non accéptée.";
				} else {
					this.emailInfo = "";
				}
			} else if (this.email === "") {
				this.emailInfo = "Merci de renseigner ce champ";
			}
		},

		//* Select a photo
		onFileChange: function(event) {
			console.log(event.target.files[0]);
			this.image = event.target.files[0];
		},
		//* CREATE a new USER
		wantCreate: function() {
			this.creat = true;
		},
		createUser: function() {
			console.log("g bien recu la requete!");
			this.theInfo = "Fonction lancée !!";
			const formData = new FormData();
			formData.append("image", this.$data.image);
			formData.append("prenom", this.$data.prenom);
			formData.append("nom", this.$data.nom);
			formData.append("email", this.$data.email);
			formData.append("service", this.$data.service);
			formData.append("description", this.$data.description);
			formData.append("password", this.$data.password);
			axios
				.post("http://localhost:3001/api/auth/signup", formData)
				.then((resp) => {
					console.log(resp.data);
					const { userId, token, isAdmin } = resp.data;
					this.setUserId(userId);
					this.setToken(token);
					this.setAdmin(isAdmin);
					this.theInfo = "Compte créé !!";
					this.creat = false;
					console.log("currentUserId = " + resp.data.userId);
				})
				.catch((err) => {
					console.log(err);
					this.theInfo =
						"Votre compte n'a pas pu être créé. Merci de corriger les paramètres demandés dans le formulaire.";
				});
		},

		//* LOGIN a USER

		loginUser: function() {
			console.log("g bien recu la requete pour login!");
			axios
				.post("http://localhost:3001/api/auth/login", {
					email: this.email,
					password: this.password,
				})
				.then((resp) => {
					const { userId, token, isAdmin } = resp.data;
					const decoded = jwt_decode(token);
					const dateEXP = moment(new Date(decoded.exp * 1000)).format(
						"DD MM YYYY k:mm:ss"
					);
					console.log(dateEXP);
					console.log(token);
					this.setUserId(userId);
					this.setToken(token);
					this.setAdmin(isAdmin);
					this.$router.push("http://localhost:8080/publi");
				})
				.catch((err) => {
					if (err.response.data === "Password not OK") {
						this.theInfo = "Mot de passe incorrect !! !!";
					} else if (err.response.data === "Email not OK") {
						this.theInfo = "Email incorrect !!";
					}
					console.log(err);
				});
		},

		//* DEMAND modification  USER datas
		demandModifUser: function() {
			if (!this.isLoggedIn) {
				this.$store.dispatch("updateInfo");
				this.$router.push("/");
			} else {
				console.log(
					"g bien recu la requete pour DEMANDE de modif!" + this.$store.state.userId
				);
				this.theInfo = "";
				this.mod = true;
				this.type = "password";
				this.hide = "Voir";
				axios({
					method: "get",
					url: "http://localhost:3001/api/auth/modif/" + this.$store.state.userId,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						console.log(resp.data);
						this.prenom = resp.data.prenom;
						this.nom = resp.data.nom;
						this.service = resp.data.service;
						this.description = resp.data.description;
						this.photo = resp.data.photo;
						this.checkData();
						// this.mod = false;
					})
					.catch((erreur) => console.log(erreur));
			}
		},

		//* MODIFY a USER
		modifUser: function() {
			if (!this.isLoggedIn) {
				this.$store.dispatch("updateInfo");
				this.$router.push("/");
			} else {
				console.log("g bien recu la requete pour modif!" + this.$store.state.userId);
				const formData = new FormData();
				formData.append("image", this.$data.image);
				formData.append("prenom", this.$data.prenom);
				formData.append("nom", this.$data.nom);
				formData.append("service", this.$data.service);
				formData.append("description", this.$data.description);
				formData.append("password", this.$data.password);
				console.log(this.$data.nom);
				axios({
					method: "put",
					url: "http://localhost:3001/api/auth/modif/" + this.$store.state.userId,
					data: formData,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						console.log(resp);
						this.mod = false;
						this.theInfo = "Vos modifications ont été prises en compte";
					})
					.catch((err) => {
						console.log(err.response.data);
						if (err.response.data === "notEmpty") {
							this.theInfo = "Les champs non optionnels doivent être remplis.";
						} else {
							const issues = err.response.data;
							for (let n in issues) {
								let issue = issues[n];
								this.notStrong.push(this.convers[issue]);
							}
							this.theInfo =
								"Ces conditions pour le mot de passe ne sont pas respectées : " +
								this.notStrong +
								".";
						}
					});
			}
		},
		//* DELETE a USER
		demandDeleteUser: function() {
			this.sup = true;
			this.theInfo = "Êtes vous sûre de vouloir supprimer votre compte ?";
		},
		deleteUser: function() {
			if (!this.isLoggedIn) {
				this.$store.dispatch("updateInfo");
				this.$router.push("/");
			} else {
				console.log("g bien recu la requete pour delete!");
				axios({
					method: "delete",
					url: "http://localhost:3001/api/auth/delete/" + this.$store.state.userId,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						console.log(resp);
						this.sup = false;
						this.theInfo = "Votre compte a été supprimé !";
						this.hom = false;
						this.$store.state.userId = null;
						this.$store.state.token = null;
					})
					.catch((erreur) => console.log(erreur));
			}
		},
	},
};
</script>
