<template>
	<div>
		<h1 v-if="hom == 0 || creat">
			Pour accéder au réseau social Groupomania, <br />renseigner les informations suivantes
			{{ this.$store.state.currentUserId }}
		</h1>
		<div>
			<h1 v-if="mod">Merci de renseigner le formulaire ci-dessous</h1>
			<h2 style="color:red;">{{ theInfo }}</h2>
			<form enctype="multipart/form-data">
				<p v-if="mod || creat">Prénom : <input type="text" v-model="prenom" /></p>
				<p v-if="mod || creat">Nom : <input type="text" v-model="nom" /></p>
				<p v-if="hom == 0 || creat">Email : <input type="text" v-model="email" /></p>
				<p v-if="mod || creat">Service : <input type="text" v-model="service" /></p>
				<p v-if="hom == 0 || mod || creat">
					Mot de passe : <input type="text" v-model="password" />
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
			<button v-if="hom == 0" v-on:click="loginUser">
				Entrer sur le GroupoSocialMania !</button
			><button v-if="creat" v-on:click="createUser">Valider</button><br /><button
				v-if="mod"
				v-on:click="modifUser"
			>
				Valider les modifications</button
			><br />
			<button v-if="hom > 0" v-on:click="demandModifUser">
				Modifier mon compte</button
			><button v-if="hom > 0" v-on:click="demandDeleteUser">
				Supprimer mon compte
			</button>
			<button style="color:red;" v-if="sup" v-on:click="deleteUser">
				Confirmer la suppression de mon compte
			</button>
			<p v-if="hom == 0" style="color:blue;">
				Pas encore de compte ? <button v-on:click="wantCreate">Créer un compte</button>
			</p>
		</div>
	</div>
</template>

<script>
import { FileUpload } from "v-file-upload"; //! a retirer
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
			image: null,
			hom: this.$store.state.currentUserId, //user connected if >0
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
	methods: {
		//* Select a photo
		onFileChange: function(event) {
			console.log(event.target.files[0]);
			this.image = event.target.files[0];
		},
		//* CREATE a new USER
		wantCreate: function() {
			this.hom = -1;
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

					this.theInfo = "Compte créé !!";
					this.$store.state.currentUserId = resp.data.id;
					this.creat = false;
					this.hom = this.$store.state.currentUserId;
					console.log("currentUserId = " + this.$store.state.currentUserId);
				})
				.catch((err) => {
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
					console.log("c pas bon ! " + err.response.data);
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
					const connection = resp.data;
					console.log(connection);
					if (connection === "Password not OK") {
						this.theInfo = "Mot de passe incorrect !! !!";
					} else if (connection === "Email not OK") {
						this.theInfo = "Email incorrect !!";
					} else {
						this.$store.state.currentUserId = resp.data.id;
						this.$router.push("http://localhost:8080/publi");
					}
				})
				.catch((erreur) => console.log(erreur));
		},
		//* DEMAND modification  USER datas
		demandModifUser: function() {
			console.log("g bien recu la requete pour DEMANDE de modif!");
			this.theInfo = "";
			this.mod = true;
			this.hom = -1;
			console.log("mod = " + this.mod);
			axios
				.get("http://localhost:3001/api/auth/modif/" + this.$store.state.currentUserId)
				.then((resp) => {
					console.log(resp.data);
					this.prenom = resp.data.prenom;
					this.nom = resp.data.nom;
					this.service = resp.data.service;
					this.description = resp.data.description;
					console.log(this.$store.state.currentUserId);
					// this.mod = false;
				})
				.catch((erreur) => console.log(erreur));
		},

		//* MODIFY a USER
		modifUser: function() {
			console.log("g bien recu la requete pour modif!" + this.$store.state.currentUserId);
			//! Il faut renseigner toutes les lignes !
			// ! Dans le back faire remonter l'info que manque ligne renseignée !
			axios
				.put("http://localhost:3001/api/auth/modif/" + this.$store.state.currentUserId, {
					prenom: this.prenom,
					nom: this.nom,
					service: this.service,
					password: this.password,
					description: this.description,
				})
				.then((resp) => {
					console.log(resp);
					this.mod = false;
					this.hom = this.$store.state.currentUserId;
					this.theInfo = "Vos modifications ont été prises en compte";
				})
				.catch((erreur) => console.log(erreur));
		},
		//* DELETE a USER
		demandDeleteUser: function() {
			this.sup = true;
			this.hom = -1;
			this.theInfo = "Êtes vous sûre de vouloir supprimer votre compte ?";
		},
		deleteUser: function() {
			console.log("g bien recu la requete pour delete!");
			axios
				.delete("http://localhost:3001/api/auth/delete/" + this.$store.state.currentUserId)
				.then((resp) => {
					console.log(resp);
					this.sup = false;
					this.theInfo = "Votre compte a été supprimé !";
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
