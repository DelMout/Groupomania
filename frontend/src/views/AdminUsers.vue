<template>
	<div>
		<p>Nombre utilisateurs dans la base : {{ this.qtyUsers }}.</p>
		<div class="p-grid p-jc-center p-my-3">
			<!-- display for medium screen -->
			<div class="p-lg-3 p-md-8 p-d-none p-d-md-inline">
				<div class="p-grid p-jc-between">
					<Button
						class=""
						label="Recherche d'un compte par email"
						@click="wantFindUser"
					/>

					<Button class="" label="Voir tous les comptes" @click="seeAllUsers" />
				</div>
			</div>
			<!-- display for small screen -->
			<div class="p-lg-3 p-md-8 p-d-md-none p-d-sm-inline">
				<div class="p-grid p-jc-center">
					<Button
						class=""
						label="Recherche d'un compte par email"
						@click="wantFindUser"
					/>

					<Button class="p-mt-2" label="Voir tous les comptes" @click="seeAllUsers" />
				</div>
			</div>
		</div>
		<!-- display for medium screen -->
		<div v-if="findUser" class="p-grid p-jc-center p-text-left ">
			<div class="p-lg-3 p-col-8 p-d-none p-d-md-inline">
				<div class="p-grid  p-float-label">
					<InputText id="email" type="text" v-model="emailReq" /><label for="email">
						Email recherché</label
					>
					<Button class="p-ml-2" label="Valider la recherche" @click="findByEmail" />
				</div>
			</div>
		</div>
		<!-- display for small screen -->
		<div v-if="findUser" class="p-grid p-jc-center  p-d-md-none p-d-sm-inline">
			<div class="p-col">
				<div class="p-grid  ">
					<div class="p-float-label">
						<InputText id="email" type="text" v-model="emailReq" /><label for="email">
							Email recherché</label
						>
					</div>
					<Button class="p-mt-2" label="Valider la recherche" @click="findByEmail" />
				</div>
			</div>
		</div>
		<div class="p-grid p-jc-center">
			<Message v-if="noFound" severity="info"
				>Cet email ne correspond à aucun compte.</Message
			>
		</div>
		<div class="p-grid vertical-container" v-for="user in users" :key="user.index">
			<div class="p-mx-auto p-col p-mt-3">
				<div class="p-grid p-jc-center">
					<div class="p-card p-shadow-6 p-col-12 p-md-6 p-lg-3 p-p-5 p-m-2">
						<div class="p-card-content p-text-left">
							<i
								><span class="intitut">Dernière connexion : </span
								>{{ user.last_connect }}</i
							>
							<p>
								<span class="intitut"> Utilisateur : </span>{{ user.nom }}
								{{ user.prenom }}
							</p>
							<p><span class="intitut">Email : </span>{{ user.email }}</p>
							<p><span class="intitut">Service : </span>{{ user.service }}</p>
							<p class="p-mb-2">
								<span class="intitut ">Description : </span>{{ user.description }}
							</p>
							<img
								v-if="user.photo"
								style="width:100px;"
								:src="user.photo"
								alt="identity user"
							/>
						</div>
						<div class="p-card-footer">
							<Message v-if="user.info" severity="success">{{ user.info }}</Message>
							<ConfirmPopup></ConfirmPopup>
							<Button
								class="p-button-danger p-button-raised"
								label="Supprimer le compte"
								v-if="user.demandDelete === 1"
								@click="deleteUser($event, user)"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapActions, mapState } from "vuex";
import moment from "moment";
import axios from "axios";

export default {
	name: "AdminUsers",
	data() {
		return {
			users: [],
			qtyUsers: "",
			findUser: false,
			emailReq: "",
			noFound: false,
		};
	},
	computed: {
		...mapState(["token", "userId", "isAdmin", "logged"]),
	},
	created: function() {
		this.seeAllUsers();
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin"]),
		...mapActions(["checkConnect"]),
		//* DISPLAY ALL USERS
		seeAllUsers: function() {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
				this.$router.push("/");
			} else {
				this.noFound = false;
				this.findUser = false;
				this.users = [];
				axios
					.get("http://localhost:3001/api/auth/users")
					.then((resp) => {
						this.qtyUsers = resp.data.length;
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
					.catch((err) => {
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
					});
			}
		},

		//* DELETE a USER
		deleteUser: function(event, user) {
			this.$confirm.require({
				target: event.currentTarget,
				message:
					"Attention, la suppression de ce compte supprimera aussi les publications et les commentaires créés par cet utilisateur.",
				icon: "pi pi-exclamation-triangle",
				accept: () => {
					this.confDeleteUser(user);
				},
				reject: () => {},
			});
		},
		confDeleteUser: function(user) {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
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
					.catch((err) => {
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
					});
			}
		},

		//* FIND by Email
		wantFindUser: function() {
			this.noFound = false;
			this.findUser = true;
		},
		findByEmail: function() {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
				this.$router.push("/");
			} else {
				this.noFound = false;
				this.users = [];
				axios({
					method: "get",
					url: "http://localhost:3001/api/auth/find/" + this.emailReq,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
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
						// }
					})
					.catch((err) => {
						this.noFound = true;
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
					});
			}
		},
	},
};
</script>
<style>
.intitut {
	color: #303030;
	font-weight: bold;
}
</style>
