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
			this.theInfo = "Fonction exécutée !!";
			this.newUser = false;
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
					console.log(resp.data);
					this.theInfo = "Compte créé !!";
					this.$store.state.currentUserId = resp.data.id;
					console.log("currentUserId = " + this.$store.state.currentUserId);
					// TODO : transfert vers page du réseau !
				})
				.catch((erreur) => console.log(erreur));
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
				.delete("http://localhost:3001/api/auth/modif", {
					email: this.email,
					password: this.password,
				})
				.then((reponse) => {
					console.log(reponse);
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};

// export default {
// 	name: "Signup",
// 	data() {
// 		return {
// 			theInfo: RAS,

// 			// prenom: "Evelyne",
// 			// nom: "Maison",
// 			// email: "eve@groupomania.fr",
// 			// service: "R&D",
// 			// password: "eee",
// 			// description: "De la suite dans les idées",
// 			// prenom: this.$store.state.savePrenom,
// 			// nom: this.$store.state.saveNom,
// 			// email: this.$store.state.saveEmail,
// 			// service: this.$store.state.saveService,
// 			// password: this.$store.state.savePassword,
// 			// description: this.$store.state.saveDescription,
// 		};
// 	},
// 	// 	methods: {
// 	// 		// createUser() {
// 	// 		// 	fetch("http://localhost:3001/api/auth.signup")
// 	// 		// 		.then((resp) => {
// 	// 		// 			return resp.json();
// 	// 		// 		})
// 	// 		// 		.then((obj) => {
// 	// 		// 			this.theInfo = obj[0];
// 	// 		// 		});
// 	// 		// },
// 	// 	},
// };
//
</script>
