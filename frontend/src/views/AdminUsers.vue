<template>
	<div>
		<p>Nombre utilisateurs dans la base : {{ this.qtyUsers }}.</p>
		<Button class="p-m-2" label="Recherche d'un compte par email" @click="wantFindUser" />

		<Button class="p-m-2" label="Voir tous les comptes" @click="seeAllUsers" />

		<div v-if="findUser">
			<p>
				Email recherché : <InputText type="text" v-model="emailReq" /><Button
					label="Valider la recherche"
					@click="findByEmail"
				/>
			</p>
			<p>{{ infoFind }}</p>
		</div>

		<div class="p-grid vertical-container" v-for="user in users" :key="user.index">
			<div class="p-mx-auto">
				<div class="p-card p-shadow-6   p-p-5 p-m-2" style="width:25rem;">
					<div class="p-card-content p-text-left">
						<i>Dernière connexion : {{ user.last_connect }}</i>
						<p>
							<span class="attribut"> Utilisateur : </span>{{ user.nom }}
							{{ user.prenom }}
						</p>
						<p>Email : {{ user.email }}</p>
						<p>Service : {{ user.service }}</p>
						<p>Description : {{ user.description }}</p>
						<img
							v-if="user.photo"
							style="width:100px;"
							:src="user.photo"
							alt="identity user"
						/>
					</div>
					<div class="p-card-footer">
						<p>{{ user.info }}</p>
						<Button
							label="Supprimer le compte"
							v-if="user.demandDelete === 1"
							@click="deleteUser(user)"
						/>

						<p v-if="user.demandDelete === 2">
							Attention, la suppression de ce compte supprimera aussi les publications
							et les commentaires créés par cet utilisateur.
						</p>
						<Button
							label="CONFIRMER la SUPPRESSION du compte"
							v-if="user.demandDelete === 2"
							@click="confDeleteUser(user)"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapGetters, mapState } from "vuex";
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
	computed: {
		...mapState({ token: "token" }, { userId: "userId" }, { isAdmin: "isAdmin" }),
		// ...mapGetters(["isLoggedIn"]),
		isLoggedIn() {
			return this.$store.state.isLoggedIn;
		},
	},
	created: function() {
		this.seeAllUsers();
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin"]),

		//* DISPLAY ALL USERS
		seeAllUsers: function() {
			this.$store.commit("setLogIn");
			if (!this.isLoggedIn) {
				this.$router.push("/");
			} else {
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
								last_connect: moment(resp.data[i].last_connect).format(
									"DD/MM/YYYY"
								),
								demandDelete: 1,
								info: "",
							});
						}
					})
					.catch((err) => console.log(err));
			}
		},

		//* DELETE a USER
		deleteUser: function(user) {
			user.demandDelete = 2;
			console.log(user.index);
		},
		confDeleteUser: function(user) {
			this.$store.commit("setLogIn");
			if (!this.isLoggedIn) {
				this.$router.push("/");
			} else {
				axios({
					method: "delete",
					url: "http://localhost:3001/api/auth/delete/" + user.index,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						user.info = "Ce compte vient d'être supprimé.";
						user.demandDelete = 0;
					})
					.catch((err) => console.log(err));
			}
		},

		//* FIND by Email
		wantFindUser: function() {
			this.findUser = true;
		},
		findByEmail: function() {
			this.$store.commit("setLogIn");
			if (!this.isLoggedIn) {
				this.$router.push("/");
			} else {
				this.users = [];
				console.log("req =" + this.emailReq);
				axios({
					method: "get",
					url: "http://localhost:3001/api/auth/find/" + this.emailReq,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
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
			}
		},
	},
};
</script>
