<template>
	<div>
		<h1 v-if="!isLoggedIn">
			Pour accéder au réseau social Groupomania, <br />renseigner les informations suivantes
		</h1>
		<div>
			<h1 v-if="mod">Merci de renseigner le formulaire ci-dessous</h1>
			<h2 style="color:red;">{{ theInfo }}</h2>
			<form enctype="multipart/form-data">
				<p v-if="mod || creat">Prénom : <input type="text" v-model="prenom" /></p>
				<p v-if="mod || creat">Nom : <input type="text" v-model="nom" /></p>
				<p v-if="!isLoggedIn || creat">Email : <input type="text" v-model="email" /></p>
				<p v-if="mod || creat">Service : <input type="text" v-model="service" /></p>
				<p v-if="!isLoggedIn || mod || creat">
					Mot de passe : <input type="text" v-model="password" />
					<span style="color:red;" v-if="mod"
						>La saisie du mot de passe est obligatoire. Vous pouvez en saisir un
						différent.</span
					>
				</p>
				<p v-if="mod || creat">
					Description (optionnel) : <input type="text" v-model="description" />
				</p>
				<p v-if="mod || creat">
					Photo (optionnel) :<input type="file" name="image" @change="onFileChange" />
				</p>
				<!-- <p v-if="mod || creat">
					Photo (optionnel) : <input type="file" ref="file" @change="selectFile" />
				</p> -->
			</form>
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
import { mapMutations, mapGetters, mapState } from "vuex";
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
					const { user, token } = resp.data;
					this.setUser(user);
					this.setToken(token);
					this.theInfo = "Compte créé !!";
					this.creat = false;
					console.log("currentUserId = " + resp.data.user.id);
				})
				.catch((err) => {
					console.log(err);
					if (err.response.data.validatorKey === "notEmpty") {
						this.theInfo =
							"Merci de compléter votre " + this.paramUser[err.response.data.path];
					} else if (err.response.data === "email already used") {
						this.theInfo = "Un compte contient déjà cet email !";
					} else if (err.response.data === "Not format email") {
						this.theInfo = "Il ne s'agit pas d'un format email";
					} // TODO ici les autres erreurs de création (password pas assez fort, cellule non renseignée...)
					this.theInfo =
						"Votre compte n'a pas pu être créé. Merci de corriger les données.";
					console.log("c pas bon ! " + err);
					// console.log("c pas bon ! " + err.response.data);
				});
		},
		//* LOGIN a USER
		// loginUser: function() {
		// 	this.theInfo = this.$store.state.storeInfo;
		// 	const { email, password } = this;
		// 	this.$store.dispatch(AUTH_REQUEST, { email, password }).then(() => {
		// 		this.$router.push("http://localhost:8080/publi");
		// 	});
		// },

		//* LOGIN a USER
		...mapMutations(["setUser", "setToken"]),
		// async loginUser() {
		// 	const response = await axios.post("http://localhost:3001/api/auth/login", {
		// 		email: this.email,
		// 		password: this.password,
		// 	});
		// 	const { user, token } = await response.data;
		// 	this.$store.state.currentUserId = response.data.user[0].id;
		// 	console.log("je vais renvoyer le token de store");
		// 	this.setUser(user);
		// 	this.setToken(token);
		// 	console.log(this.$store.state.token);
		// 	this.$router.push("http://localhost:8080/publi");
		// },

		loginUser: function() {
			console.log("g bien recu la requete pour login!");
			axios
				.post("http://localhost:3001/api/auth/login", {
					email: this.email,
					password: this.password,
				})
				.then((resp) => {
					const { user, token } = resp.data;
					console.log(resp.data.user.id);
					this.setUser(user);
					this.setToken(token);
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
			console.log("g bien recu la requete pour DEMANDE de modif!");
			this.theInfo = "";
			this.mod = true;
			axios
				.get("http://localhost:3001/api/auth/modif/" + this.$store.state.user.id)
				.then((resp) => {
					console.log(resp.data);
					this.prenom = resp.data.prenom;
					this.nom = resp.data.nom;
					this.service = resp.data.service;
					this.description = resp.data.description;
					this.photo = resp.data.photo;
					// this.mod = false;
				})
				.catch((erreur) => console.log(erreur));
		},

		//* MODIFY a USER
		modifUser: function() {
			console.log("g bien recu la requete pour modif!" + this.$store.state.user.id);
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
				url: "http://localhost:3001/api/auth/modif/" + this.$store.state.user.id,
				data: formData,
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
				// axios
				// 	.put(
				// 		"http://localhost:3001/api/auth/modif/" + this.$store.state.currentUserId,
				// 		formData
				// 	)
				.then((resp) => {
					console.log(resp);
					if (resp.data === "notEmpty") {
						this.theInfo = "Les champs non optionnels doivent être remplis.";
					} else {
						this.mod = false;
						this.theInfo = "Vos modifications ont été prises en compte";
					}
				})
				.catch((erreur) => console.log(erreur));
		},
		//* DELETE a USER
		demandDeleteUser: function() {
			this.sup = true;
			this.theInfo = "Êtes vous sûre de vouloir supprimer votre compte ?";
		},
		deleteUser: function() {
			console.log("g bien recu la requete pour delete!");
			axios({
				method: "delete",
				url: "http://localhost:3001/api/auth/delete/" + this.$store.state.user.id,
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
				// axios
				// 	.delete("http://localhost:3001/api/auth/delete/" + this.$store.state.currentUserId)
				.then((resp) => {
					console.log(resp);
					this.sup = false;
					this.theInfo = "Votre compte a été supprimé !";
					this.hom = false;
					this.$store.state.user = null;
					this.$store.state.token = null;
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
