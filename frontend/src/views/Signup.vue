<template>
	<div>
		<h1 v-if="!newUser">
			Pour accéder au réseau social Groupomania, <br />renseigner les informations suivantes
		</h1>
		<div>
			<h1 v-if="newUser">Merci de renseigner le formulaire ci-dessous</h1>
			<h2>{{ theInfo }}</h2>
			<p v-if="newUser">Prénom : <input type="text" v-model="prenom" /></p>
			<p v-if="newUser">Nom : <input type="text" v-model="nom" /></p>
			<p v-if="affEmail">Email : <input type="text" v-model="email" /></p>
			<p v-if="newUser">Service : <input type="text" v-model="service" /></p>
			<p>Mot de passe : <input type="text" v-model="password" /></p>
			<p v-if="newUser">
				Description (optionnel) : <input type="text" v-model="description" />
			</p>
			<button v-if="!newUser" v-on:click="loginUser">Entrer sur le GroupoRéseau !</button
			><button v-if="valider" v-on:click="createUser">Valider</button><br /><button
				v-if="!affEmail"
				v-on:click="modifUser"
			>
				Valider les modifications</button
			><br />
			<button v-if="!newUser" v-on:click="demandModifUser">Modifier mon compte</button
			><button v-if="!newUser" v-on:click="deleteUser">Supprimer mon compte</button>
			<p v-if="!newUser">
				Pas encore de compte ? <button v-on:click="wantCreate">Créer un compte</button>
			</p>
		</div>
	</div>
</template>

<script>
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
			newUser: false,
			affEmail: true,
			valider: false,
			informations: ["prénom", "nom", "email", "service", "mot de passe", "description"],
			paramUser: [
				{ donnee: this.prenom, param: "prénom" },
				{ donnee: this.nom, param: "nom" },
			],
			notFilled: [],
		};
	},
	methods: {
		//* CREATE a new USER
		wantCreate: function() {
			this.newUser = true;
			this.valider = true;
		},
		createUser: function() {
			console.log("g bien recu la requete!");
			this.theInfo = "Fonction lancée !!";
			this.paramUser.forEach((p) => {
				// this.notFilled.push(p.param);
				this.notFilled.push(p.param);
			});
			console.log(this.notFilled);
			// if (this.prenom == "") {
			// 	this.theInfo = "Merci de renseigner votre prénom";
			// } else if (this.nom == "") {
			// 	this.theInfo = "Merci de renseigner votre nom";
			// }

			axios
				.post("http://localhost:3001/api/auth/signup", {
					prenom: this.prenom,
					nom: this.nom,
					email: this.email,
					service: this.service,
					password: this.password,
					description: this.description,
				})
				.then((resp) => {
					this.newUser = false;
					console.log(resp.data);
					this.theInfo = "Compte créé !!";
					this.$store.state.currentUserId = resp.data.id;
					console.log("currentUserId = " + this.$store.state.currentUserId);
					// TODO : transfert vers page du réseau !
				})
				.catch((err) => {
					if ((err.response.data = "email already used")) {
						this.theInfo = "Un compte contient déjà cet email !";
					} else if ((err.response.data = "firstname not filled")) {
						this.theInfo = "Merci de renseigner un prénom.";
					} // TODO ici les autres erreurs de création (password pas assez fort, cellule non renseignée...)
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
						this.theInfo = "Email et Mot de passe corrects !!";
						this.$store.state.currentUserId = resp.data.id;
						console.log("id =" + resp.data.id);
						// TODO : transfert vers page du réseau !
						// TODO  : ...avec bouton modifier compte / supprimer compte accessibles !
					}
				})
				.catch((erreur) => console.log(erreur));
		},
		//* DEMAND modification  USER datas
		demandModifUser: function() {
			console.log("g bien recu la requete pour DEMANDE de modif!");
			this.newUser = true;
			this.affEmail = false;
			axios
				.get("http://localhost:3001/api/auth/modif/" + this.$store.state.currentUserId)
				.then((resp) => {
					console.log(resp.data);
					this.prenom = resp.data.prenom;
					this.nom = resp.data.nom;
					this.service = resp.data.service;
					this.description = resp.data.description;
					console.log(this.$store.state.currentUserId);
				})
				.catch((erreur) => console.log(erreur));
		},

		//* MODIFY a USER
		modifUser: function() {
			console.log("g bien recu la requete pour modif!");

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
				})
				.catch((erreur) => console.log(erreur));
		},
		//* DELETE a USER
		deleteUser: function() {
			console.log("g bien recu la requete pour delete!");
			axios
				.delete("http://localhost:3001/api/auth/delete/" + this.$store.state.currentUserId)
				.then((resp) => {
					console.log(resp);
					this.theInfo = "Votre compte a été supprimé !";
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
