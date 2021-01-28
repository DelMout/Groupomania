<template>
	<div>
		<h1>{{ theInfo }}</h1>

		<!-- loop to display all publications -->
		<div v-for="pub in publica" :key="pub.index" class=" p-grid vertical-container  ">
			<div class="p-mx-auto ">
				<div class=" p-card p-shadow-6 p-col p-grid p-p-5 p-m-2 " style="width:40rem;">
					<Author class="p-col-10 p-offset-1" :item="pub" v-if="comLike" />
					<h2 class="p-card-title p-col-10 p-offset-1 ">
						{{ pub.titre }}
					</h2>
					<div class="p-card-content p-col-10 p-offset-1 ">
						<p class="p-text-justify">{{ pub.contenu }}</p>
						<img
							v-if="pub.photo != null"
							:src="pub.photo"
							alt="publication picture"
							style="max-width:40rem;max-height:40rem;"
							title="pub-img"
						/>
					</div>
					<div class="p-card-footer p-col-10 p-offset-1  ">
						<div class="p-grid">
							<!-- <div class=" "> -->
							<Like class=" p-col-1" :pub="pub" v-if="comLike" />
							<!-- </div> -->
							<Comment class="p-col " :pub="pub" v-if="comLike" />
						</div>

						<ConfirmPopup></ConfirmPopup>
						<Button
							label="Supprimer cette publication"
							class="p-button-danger p-button-raised p-button-text"
							v-if="seeDel"
							@click="deletePub($event, pub)"
						/>

						<!-- <Button
							label="Confirmer la suppression"
							v-if="confDel"
							style="color:red;"
							v-on:click="confDeletePub"
						/> -->
					</div>
				</div>
			</div>
		</div>
		<Button
			class="p-m-2"
			label="Revenir sur les publications"
			v-if="seePub"
			v-on:click="backToPublications"
		/>

		<Button
			class="p-m-2"
			label="Voir plus de publications"
			v-if="more"
			v-on:click="seeMorePublications"
		/>

		<Button
			class="p-m-2"
			label="Voir vos publications"
			v-if="mine && isLoggedIn"
			v-on:click="seeMinePublications"
		/>
		<div class="p-grid p-jc-center p-my-3">
			<div class=" p-col-2 p-toast ">
				<div class="">
					<div
						class="p-shadow-3 p-py-1 p-grid p-jc-between p-text-left"
						style="background-color:green;color:white;"
						v-if="infoDelete"
					>
						<div class="p-col-11">
							<i class="pi pi-check"></i>
							<span> Votre publication a été supprimée.</span>
						</div>
						<div class="p-col-1">
							<i @click="closeInfo" class="pi pi-times-circle"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Like from "@/components/Like";
import Comment from "@/components/Comment";
import Author from "@/components/Author";
import axios from "axios";
import { mapGetters, mapState, mapActions } from "vuex"; // for authentification

export default {
	name: "Publication",
	components: {
		Like,
		Comment,
		Author,
	},
	data() {
		return {
			theInfo: "Les publications du réseau Groupomania",
			log: true,
			qtyPub: 0,
			qtyMore: 0,
			onePub: false,
			publica: [],
			more: false,
			mine: true,
			select: false,
			seePub: false,
			confDel: false,
			seeDel: false,
			photo: "",
			comLike: true,
			infoDelete: false,
		};
	},
	created: function() {
		this.qtyMore = 0;
		this.seePublications();
		this.infoDelete = false;
	},
	computed: {
		...mapState({ token: "token" }, { userId: "userId" }),
		isLoggedIn() {
			return this.$store.state.isLoggedIn;
		},
		// ...mapGetters(["isLoggedIn", "isNotExpired"]),
		...mapActions(["updateInfo"]),
	},
	methods: {
		//* SELECT MORE publications
		seeMorePublications: function() {
			this.qtyMore += 1;
			this.seePublications();
		},
		//* BACK to PUBLICATIONS
		backToPublications: function() {
			this.publica = [];
			this.qtyMore = 0;
			this.mine = true;
			this.seePublications();
			this.comLike = true;
			this.theInfo = "Les publications GroupoRéseauMania";
			this.seeDel = false;
		},
		//* SELECT 10 PUBLICATIONS
		seePublications: function() {
			// this.qtyMore += 1;
			this.seePub = false;
			this.del = false;
			this.seeDel = false;

			console.log("qtyMore : " + this.qtyMore);
			axios
				.get("http://localhost:3001/api/pub")
				.then((resp) => {
					console.log(resp);
					console.log(resp.data);
					console.log('titre 0 " : ' + resp.data[0].titre);
					this.qtyPub = resp.data.length;
					if (resp.data.length > parseInt(1 + 1 * this.qtyMore)) {
						//! A modifier le '1' en 10
						this.more = true;
						this.qtyPub = parseInt(1 * this.qtyMore + 1);
					} else {
						this.more = false;
					}
					console.log("Nombre : " + parseInt(1 * this.qtyMore + 1));
					//* Get total of likes
					for (let i = parseInt(1 * this.qtyMore); i < this.qtyPub; i++) {
						axios
							.get("http://localhost:3001/api/pub/" + resp.data[i].id + "/like/")
							.then((respo) => {
								//* get total of comments
								axios
									.get(
										"http://localhost:3001/api/pub/" +
											resp.data[i].id +
											"/comm/"
									)
									.then((rep) => {
										console.log("lon = " + respo.data.length);
										console.log("comments = " + rep.data.length);
										this.publica.push({
											index: resp.data[i].id,
											titre: resp.data[i].titre,
											contenu: resp.data[i].texte_pub,
											date: resp.data[i].date_crea_pub,
											userId: resp.data[i].userId,
											photo: resp.data[i].photo,
											comm: rep.data.length,
											likes: respo.data.length,
										});
									})
									.catch((erreur) => console.log(erreur));
							})
							.catch((err) => console.log(err));
					}
				})
				.catch((erreur) => console.log(erreur));
		},
		//* SELECT my PUBLICATIONS
		seeMinePublications: function() {
			this.infoDelete = false;
			this.$store.commit("setLogIn");
			if (!this.isLoggedIn) {
				this.$router.push("/");
			} else {
				this.mine = false;
				this.more = false;
				this.theInfo = "Vos publications du Réseau Social Groupomania";
				this.publica = [];
				this.seePub = true;
				this.del = false;
				this.seeDel = true;
				this.comLike = true;
				console.log("this.userid =" + this.$store.state.userId);

				axios({
					method: "get",
					url: "http://localhost:3001/api/pub/user/" + this.$store.state.userId,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						this.qtyPub = resp.data.length;
						console.log("qty :" + resp.data.length);
						console.log("Publica :" + resp.data.length);
						if (resp.data.length === 0) {
							this.theInfo =
								"Vous n'avez pas encore de publications GroupoRéseauMania !";
						}
						for (let i = 0; i < this.qtyPub; i++) {
							//* Get total of likes
							axios
								.get("http://localhost:3001/api/pub/" + resp.data[i].id + "/like/")
								.then((respo) => {
									//* get total of comments
									axios
										.get(
											"http://localhost:3001/api/pub/" +
												resp.data[i].id +
												"/comm/"
										)
										.then((rep) => {
											this.publica.push({
												index: resp.data[i].id,
												titre: resp.data[i].titre,
												contenu: resp.data[i].texte_pub,
												userId: resp.data[i].userId,
												date: resp.data[i].date_crea_pub,
												photo: resp.data[i].photo,
												comm: rep.data.length,
												likes: respo.data.length,
											});
										})
										.catch((err) => console.log(err));
								})
								.catch((erreur) => console.log(erreur));
						}
					})
					.catch((erreur) => console.log(erreur));
			}
		},
		//* DELETE a PUBLICATION
		deletePub: function(event, pub) {
			console.log("indexPub =" + pub.index);
			// this.publicaSup.push({
			// 	index: pub.index,
			// 	titre: pub.titre,
			// 	contenu: pub.contenu,
			// 	photo: pub.photo,
			// });
			// console.log("target =" + event.currentTarget);
			// console.log(event.currentTarget);
			this.indexDel = pub.index;
			this.$confirm.require({
				target: event.currentTarget,
				message:
					"Attention, cette suppression supprimera aussi les commentaires liés à cette publication.",
				icon: "pi pi-exclamation-triangle",
				accept: () => {
					this.confDeletePub(pub);
				},
				reject: () => {},
			});
			// this.theInfo =
			// 	"Attention, cette suppression supprimera aussi les commentaires liés à cette publication.";
			// this.seePub = false;
			// this.more = false;
			// this.mine = false;

			// this.publica = [];
			// this.publica.push({
			// 	index: pub.index,
			// 	titre: pub.titre,
			// 	contenu: pub.contenu,
			// 	photo: pub.photo,
			// });

			// this.indexDel = pub.index;
			// this.confDel = true;
			// this.comLike = false;
			// this.seeDel = false;
		},
		confDeletePub: function(pub) {
			this.$store.commit("setLogIn");
			if (!this.isLoggedIn) {
				this.$router.push("/");
			} else {
				axios({
					method: "delete",
					url:
						"http://localhost:3001/api/pub/" +
						this.indexDel +
						"/" +
						this.$store.state.userId,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						// this.theInfo = "Votre publication a été supprimée.";
						this.confDel = false;
						this.seePub = true;
						this.mine = true;
						this.publica = [];
						this.infoDelete = true;
					})
					.catch((err) => console.log(err));
			}
		},
		//* Close toast information publication deleted
		closeInfo: function() {
			this.infoDelete = false;
		},
	},
};
</script>
<style>
.p-card {
	background-color: beige;
}
</style>
