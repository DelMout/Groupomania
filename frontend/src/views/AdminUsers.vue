<template>
	<div>
		<p>Nombre utilisateurs dans la base : {{ this.qtyUsers }}.</p>
		<button style="color:green;" @click="wantFindUser">
			Recherche d'un compte par email
		</button>
		<button @click="seeAllUsers">
			Voir tous les comptes
		</button>
		<div v-if="findUser">
			<p>
				Email recherché : <input type="text" v-model="emailReq" /><button
					style="color:green;"
					@click="findByEmail"
				>
					Valider la recherche
				</button>
			</p>
			<p>{{ infoFind }}</p>
		</div>
		<p>- - - - - - - - - - - - - -</p>

		<div v-for="user in users" :key="user.index">
			<p>Dernière connexion : {{ user.last_connect }}</p>
			<p>Nom Prénom : {{ user.nom }} {{ user.prenom }}</p>
			<p>Email : {{ user.email }}</p>
			<p>Service : {{ user.service }}</p>
			<p>Description : {{ user.description }}</p>
			<img v-if="user.photo" style="width:100px;" :src="user.photo" alt="identity user" />
			<p>{{ user.info }}</p>
			<button v-if="user.demandDelete === 1" style="color:red;" @click="deleteUser(user)">
				Supprimer le compte
			</button>
			<p v-if="user.demandDelete === 2" style="color:red;">
				Attention, la suppression de ce compte supprimera aussi les publications et les
				commentaires créés par cet utilisateur.
			</p>
			<button v-if="user.demandDelete === 2" style="color:red;" @click="confDeleteUser(user)">
				CONFIRMER la SUPPRESSION du compte
			</button>
			<p>***** ***** *****</p>
		</div>
	</div>
</template>
<script>
import moment from "moment";
import axios from "axios";

export default {
	name: "AdminUsers",
	data() {
		return {
			users: [],
			qtyUsers: "",
			chose: "",
			findUser: false,
			infoFind: "",
			emailReq: "",
		};
	},
	created: function() {
		this.seeAllUsers();
	},
	methods: {
		//* DISPLAY ALL USERS
		seeAllUsers: function() {
			this.users = [];
			axios
				.get("http://localhost:3001/api/auth/users")
				.then((resp) => {
					this.qtyUsers = resp.data.length;
					console.log(resp.data[12].nom);
					for (let i = 0; i < this.qtyUsers; i++) {
						this.users.push({
							index: resp.data[i].id,
							nom: resp.data[i].nom,
							prenom: resp.data[i].prenom,
							email: resp.data[i].email,
							service: resp.data[i].service,
							description: resp.data[i].description,
							photo: resp.data[i].photo,
							last_connect: moment(resp.data[i].last_connect).format("DD/MM/YYYY"),
							demandDelete: 1,
							info: "",
						});
					}
				})
				.catch((err) => console.log(err));
		},

		//* DELETE a USER
		deleteUser: function(user) {
			user.demandDelete = 2;
			console.log(user.index);
		},
		confDeleteUser: function(user) {
			axios({
				method: "delete",
				url: "http://localhost:3001/api/auth/delete/" + user.index,
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			})
				.then((resp) => {
					user.info = "Ce compte vient d'être supprimé.";
					user.demandDelete = 0;
				})
				.catch((err) => console.log(err));
		},

		//* FIND by Email
		wantFindUser: function() {
			this.findUser = true;
		},
		findByEmail: function() {
			this.users = [];
			console.log("req =" + this.emailReq);
			axios({
				method: "get",
				url: "http://localhost:3001/api/auth/find/" + this.emailReq,
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			})
				.then((resp) => {
					console.log(resp);
					this.users.push({
						index: resp.data.id,
						nom: resp.data.nom,
						prenom: resp.data.prenom,
						email: resp.data.email,
						service: resp.data.service,
						description: resp.data.description,
						photo: resp.data.photo,
						last_connect: moment(resp.data.last_connect).format("DD/MM/YYYY"),
						demandDelete: 1,
						info: "",
					});
				})
				.catch((err) => {
					this.infoFind = "Aucun compte a cette adresse email.";
					console.log(err);
				});
		},
	},
};
</script>
