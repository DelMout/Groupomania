<template>
	<div>
		<h1>Merci de renseigner le formulaire ci-dessous</h1>
		<h2>Info : {{ theInfo }}</h2>
		<p>Prénom* : <input type="text" v-model="prenom" /></p>
		<p>Nom* : <input type="text" v-model="nom" /></p>
		<p>Email* : <input type="text" v-model="email" /></p>
		<p>Service* : <input type="text" v-model="service" /></p>
		<p>Mot de passe* : <input type="text" v-model="password" /></p>
		<p>Description : <input type="text" v-model="description" /></p>
		<button v-on:click="createUser">Save !</button>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "Signup",
	data() {
		return {
			theInfo: "Lalalala !",
			prenom: "Evelyne",
			nom: "Maison",
			email: "eve@groupomania.fr",
			service: "R&D",
			password: "eee",
			description: "De la suite dans les idées",
		};
	},
	methods: {
		createUser: function() {
			console.log("g bien recu la requete!");
			this.theInfo = "Fonction exécutée !!";
			axios
				.post("http://localhost:3001/api/auth/signup", {
					prenom: this.prenom,
					nom: this.nom,
					email: this.email,
					service: this.service,
					password: this.password,
					description: this.description,
				})
				.then((reponse) => {
					console.log(reponse);
					this.theInfo = "Compte créé !!";
				});
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
