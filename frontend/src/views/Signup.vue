<template>
	<div>
		<h1 v-if="!logged">
			Pour accéder au réseau social Groupomania, <br />renseigner les informations suivantes
		</h1>

		<div>
			<h1 v-if="mod">
				Merci de renseigner le formulaire ci-dessous
			</h1>
			<div class="p-grid p-jc-center">
				<div class="p-lg-4 p-md-6 p-col-10">
					<Message v-if="theInfo" :severity="severity" :life="7000" :sticky="false">{{
						theInfo
					}}</Message>
				</div>
			</div>
			<div class=" p-text-left ">
				<div class=" p-input-filled  " enctype="multipart/form-data">
					<div class="p-grid p-jc-center  p-py-0">
						<div class=" p-lg-4 p-md-5 p-col-10 vertical-container" v-if="mod || creat">
							<p class=" p-float-label">
								<InputText
									class=""
									type="text"
									id="firstname"
									@keyup="checkData"
									v-model="prenom"
								/><label for="firstname">Prénom</label>
							</p>
							<InlineMessage class="p-lg-6 p-12 " v-if="prenomInfo" severity="error"
								>{{ prenomInfo }}
							</InlineMessage>
						</div>
					</div>
					<div class="p-grid p-jc-center p-py-0">
						<div class=" p-lg-4 p-md-5 p-col-10 vertical-container" v-if="mod || creat">
							<p class=" p-float-label">
								<InputText
									class=""
									id="lastname"
									type="text"
									@keyup="checkData"
									v-model="nom"
								/><label for="lastname">Nom</label>
							</p>
							<InlineMessage class="p-lg-6 p-12 " v-if="nomInfo" severity="error"
								>{{ nomInfo }}
							</InlineMessage>
						</div>
					</div>
					<div class="p-grid p-jc-center p-py-0">
						<div
							class=" p-lg-4 p-md-5 p-col-10 vertical-container"
							v-if="!logged || creat"
						>
							<p class="p-float-label ">
								<InputText
									class=""
									id="email"
									type="text"
									@keyup="checkData"
									v-model="email"
								/><label for="email">Email</label>
							</p>
							<InlineMessage
								class="p-lg-6 p-12 "
								v-if="creat && emailInfo"
								severity="error"
								>{{ emailInfo }}
							</InlineMessage>
						</div>
					</div>
					<div class="p-grid p-jc-center p-py-0">
						<div class=" p-lg-4 p-md-5 p-col-10 vertical-container" v-if="mod || creat">
							<p class="p-float-label">
								<InputText
									class="p-mx-1"
									id="service"
									type="text"
									@keyup="checkData"
									v-model="service"
								/><label for="service">Service</label>
							</p>
							<InlineMessage class="p-lg-6 p-12 " v-if="serviceInfo" severity="error"
								>{{ serviceInfo }}
							</InlineMessage>
						</div>
					</div>
					<div class="p-grid p-jc-center p-py-0">
						<div
							class=" p-lg-4 p-md-5 p-col-10 vertical-container"
							v-if="!logged || mod || creat"
						>
							<p class=" p-float-label">
								<InputText
									class=""
									id="password"
									:type="type"
									@keyup="checkData"
									v-model="password"
								/><label for="password">Mot de passe</label>
								<Button
									class="p-ml-1 p-pl-auto p-button-outlined p-button-help p-button-text "
									@click="visibility"
									:icon="hide"
								>
								</Button>
							</p>
							<InlineMessage
								class="p-lg-6 p-12 "
								v-if="(mod && passwordInfo) || (creat && passwordInfo)"
								severity="error"
							>
								{{ passwordInfo }}
							</InlineMessage>
							<InlineMessage
								class="p-lg-5 p-12 "
								v-if="(mod && min) || (creat && min)"
								severity="error"
							>
								{{ min }}
							</InlineMessage>
							<InlineMessage
								class="p-lg-5 p-12 "
								v-if="(mod && up) || (creat && up)"
								severity="error"
							>
								{{ up }}
							</InlineMessage>
							<InlineMessage
								class="p-lg-5 p-12"
								v-if="(mod && low) || (creat && low)"
								severity="error"
							>
								{{ low }}
							</InlineMessage>
							<InlineMessage
								class="p-lg-4 p-12"
								v-if="(mod && num) || (creat && num)"
								severity="error"
							>
								{{ num }}
							</InlineMessage>
							<InlineMessage class="" v-if="mod" severity="info"
								>Saisir un autre mot de passe, modifiera votre mot de
								passe.</InlineMessage
							>
						</div>
					</div>
					<div class="p-grid p-jc-center p-py-0">
						<div class=" p-lg-4 p-md-5 p-col-10 vertical-container" v-if="mod || creat">
							<p class=" p-float-label">
								<InputText
									class="p-mx-1"
									id="description"
									type="text"
									v-model="description"
								/><label for="description">Description</label>
							</p>
						</div>
					</div>
					<div class="p-grid p-jc-center p-py-0">
						<div class=" p-lg-4 p-md-5 p-col-10 vertical-container" v-if="mod || creat">
							<p class="">
								Photo (optionnel) :<input
									type="file"
									name="image"
									@change="onFileChange"
								/>
							</p>
						</div>
					</div>

					<div class="p-grid p-jc-center " v-if="photo != null && mod">
						<div class=" p-lg-4 p-md-5 p-col-10 vertical-container">
							<span>Votre photo actuelle : </span
							><img style="width:200px;" :src="photo" alt="photo utilisateur" />
						</div>
					</div>
					<div class="p-grid p-jc-center " v-if="photo === null && mod">
						<InlineMessage severity="info"
							>Vous n'avez pas de photo actuellement.</InlineMessage
						>
					</div>
					<div class="p-grid p-jc-center p-my-5">
						<Button
							class="p-md-4 p-col-6"
							label="Entrer dans le réseau social Groupomania !"
							v-if="!logged && !creat"
							@click="loginUser"
						/>
					</div>
					<div class="p-grid p-jc-center p-my-2">
						<Button label="Valider" v-if="creat" v-on:click="createUser" /><br />
					</div>
				</div>
			</div>
			<div class="p-grid p-jc-center">
				<div class="p-col p-py-0">
					<Button
						label="Valider les modifications"
						v-if="mod"
						v-on:click="modifUser"
					/><br />
					<Button
						label="Modifier mon compte"
						class="p-m-2"
						v-if="logged && !mod"
						@click="demandModifUser"
					/>

					<ConfirmPopup></ConfirmPopup>
					<Button
						label="Supprimer mon compte"
						class="p-m-2"
						v-if="logged && !mod"
						@click="demandDeleteUser($event)"
					/>
				</div>
			</div>
			<div class="p-grid">
				<div class="p-col p-py-0">
					<p v-if="!logged && !creat" style="color:blue;">
						<span class="p-mx-3">Pas encore de compte ?</span>
						<Button label="Créer un compte" @click="wantCreate" />
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from "moment"; //! Pour essais sur dates, à retirer par la suite !

import { mapMutations, mapGetters, mapState, mapActions } from "vuex";
import jwt_decode from "jwt-decode";
import axios from "axios";
export default {
	name: "Signup",

	data() {
		return {
			theInfo: "",
			severity: "info",
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
			indexDel: "",
			// password: "",
			type: "password",
			hide: "pi pi-eye",
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
		...mapState(["token", "userId", "isAdmin", "logged"]),
		// isLoggedIn() {
		// 	return this.$store.state.isLoggedIn;
		// },
		...mapGetters(["isExpire"]),
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin"]),
		...mapActions(["updateLog", "checkConnect"]),
		//* Hide or show password
		visibility() {
			if (this.type === "password") {
				this.type = "text";
				this.hide = "pi pi-eye-slash";
			} else {
				this.type = "password";
				this.hide = "pi pi-eye";
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
					this.min = "10 caractères minimum";
				} else {
					this.min = "";
				}

				if (passwordUp === false) {
					this.up = "1 majuscule requise";
				} else {
					this.up = "";
				}
				if (passwordLow === false) {
					this.low = "1 minuscule requise";
				} else {
					this.low = "";
				}
				if (passwordNum === false) {
					this.num = "1 chiffre requis";
				} else {
					this.num = "";
				}
				this.passwordInfo = "";
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
			this.theInfo = "";
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
					this.$store.dispatch("checkConnect");

					this.theInfo = "Votre compte a été créé.";
					this.severity = "success";
					this.creat = false;
					console.log("currentUserId = " + resp.data.userId);
				})
				.catch((err) => {
					res.send(err);
					this.theInfo =
						"Votre compte n'a pas pu être créé. Merci de corriger les paramètres demandés dans le formulaire.";
					this.severity = "error";
				});
		},

		//* LOGIN a USER

		loginUser: function() {
			this.theInfo = "";
			//!! Pour simulation SUPPRIMER ces 2 lignes
			this.email = "admin@groupomania.fr";
			this.password = "AAAaaa1111";

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
					console.log(moment().format("DD MM YYYY k:mm:ss"));
					console.log("valeur =" + dateEXP > moment().format("DD MM YYYY k:mm:ss"));
					this.setUserId(userId);
					console.log("userid = " + this.$store.state.userId);
					this.setToken(token);
					this.setAdmin(isAdmin);
					this.$store.dispatch("checkConnect");
					console.log("store.token =" + this.$store.state.token);
					this.$router.push("http://localhost:8080/publi");
				})
				.catch((err) => {
					if (err.response.data === "Password not OK") {
						this.theInfo = "Mot de passe incorrect !! !!";
						this.severity = "error";
					} else if (err.response.data === "Email not OK") {
						this.theInfo = "Email incorrect !!";
						this.severity = "error";
					}
					res.send(err);
				});
		},

		//* DEMAND modification  USER datas
		demandModifUser: function() {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
				this.$router.push("/");
			} else {
				console.log(
					"g bien recu la requete pour DEMANDE de modif!" + this.$store.state.userId
				);
				this.theInfo = "";
				this.mod = true;
				this.type = "password";
				this.hide = "pi pi-eye";
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
					.catch((err) => {
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
						res.send(err);
					});
			}
		},

		//* MODIFY a USER
		modifUser: function() {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
				this.$router.push("/");
			} else {
				this.theInfo = "";
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
						this.severity = "success";
					})
					.catch((err) => {
						if (err.response.data === "notEmpty") {
							this.theInfo = "Les champs non optionnels doivent être remplis.";
							this.severity = "info";
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
							this.severity = "error";
						}
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
						res.send(err);
					});
			}
		},
		//* DELETE a USER
		demandDeleteUser: function(event) {
			this.$confirm.require({
				target: event.currentTarget,
				message: "Êtes vous sûre de vouloir supprimer votre compte ?",
				icon: "pi pi-exclamation-triangle",
				accept: () => {
					this.deleteUser();
				},
				reject: () => {
					this.hom = false;
				},
			});
		},
		deleteUser: function() {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
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
						this.$store.state.infoHome = "Votre compte a été supprimé !";
						// this.hom = false;
						this.$store.state.userId = null;
						this.$store.state.token = null;
						this.$router.push("/");
					})
					.catch((err) => {
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
<style>
InlineMessage {
	color: black;
}
p {
	margin-bottom: 0px;
}
InlineMessage {
	margin-top: 0px;
}

/* MEDIA QUERIES */

@media only screen and (max-width: 768px) {
	/*mobiles et tablettes*/
	h1 {
		font-size: 1rem;
	}
	/* #inscript {
		font-size: 0.6rem;
	} */
}
@media only screen and (max-width: 576px) {
	/*mobiles */

	h1 {
		font-size: 0.9rem;
	}
}
</style>
