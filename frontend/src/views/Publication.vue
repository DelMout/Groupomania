<template>
	<div>
		<h1>{{ theInfo }}</h1>
		<button v-if="log" v-on:click="displayPublications">Valider</button>
		<!-- boucle  pour afficher toutes les pub -->
		<div v-for="pub in publica" :key="pub.titre">
			<Author :item="pub" />
			<h2>{{ pub.titre }}</h2>
			<p>{{ pub.contenu }}</p>
			<Like :pub="pub" />
			<Comment :pub="pub" />
			<p>***********************</p>
		</div>
		<button v-if="seePub" v-on:click="displayPublications">Revenir sur les publications</button>
		* <button v-if="more" v-on:click="seeMorePublications">Voir plus de publications</button> *
		<button v-if="mine" v-on:click="seeMinePublications">Voir vos publications</button>
	</div>
</template>

<script>
import Like from "@/components/Like";
import Comment from "@/components/Comment";
import Author from "@/components/Author";
// import * as moment from "vue-moment";
import axios from "axios";
export default {
	name: "Publication",
	components: {
		Like,
		Comment,
		Author,
	},
	data() {
		return {
			theInfo: "Les publications GroupoRéseauMania",
			log: true,
			qtyPub: 0,
			qtyMore: 0,
			onePub: false,
			publica: [],
			more: false,
			mine: true,
			select: false,
			seePub: false,
		};
	},
	methods: {
		//* SELECT 10 first PUBLICATIONS
		displayPublications: function() {
			this.log = false;
			this.select = false;
			this.seePub = false;
			this.qtyMore = 0;

			this.publica = [];
			axios
				.get("http://localhost:3001/api/pub")
				.then((resp) => {
					console.log(resp);
					console.log(resp.data);
					console.log('titre 0 " : ' + resp.data[0].titre);
					this.qtyPub = resp.data.length;
					if (resp.data.length > 1) {
						//! A modifier le '1' en 10
						this.more = true;
						this.qtyPub = 1;
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
										console.log("lon = " + respo.data.length);
										console.log("comments = " + rep.data.length);
										// Pick up firstName and name of Publication author
										axios
											.get(
												"http://localhost:3001/api/auth/ident/" +
													resp.data[i].userId
											)
											.then((respon) => {
												this.publica.push({
													index: resp.data[i].id,
													titre: resp.data[i].titre,
													contenu: resp.data[i].texte_pub,
													date: resp.data[i].date_crea_pub,
													userId: resp.data[i].userId,
													comm: rep.data.length,
													likes: respo.data.length,
													nom: respon.data[0].nom,
													prenom: respon.data[0].prenom,
												});
												console.log("index = " + this.publica[0].index);
											})
											.catch((err) => console.log(err));
									})
									.catch((err) => console.log(err));
							})
							.catch((erreur) => console.log(erreur));
						// console.log("Publica_like :" + this.publica[0]);
					}
				})
				.catch((erreur) => console.log(erreur));
		},
		//* SELECT 10 following PUBLICATIONS
		seeMorePublications: function() {
			this.qtyMore += 1;
			this.seePub = false;
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
										// Pick up firstName and name of Comment author
										axios
											.get(
												"http://localhost:3001/api/auth/ident/" +
													resp.data[i].userId
											)
											.then((respon) => {
												this.publica.push({
													index: resp.data[i].id,
													titre: resp.data[i].titre,
													contenu: resp.data[i].texte_pub,
													date: resp.data[i].date_crea_pub,
													userId: resp.data[i].userId,
													comm: rep.data.length,
													likes: respo.data.length,
													nom: respon.data[0].nom,
													prenom: respon.data[0].prenom,
												});
											})
											.catch((err) => console.log(err));
									})
									.catch((erreur) => console.log(erreur));
								// console.log("Publica_like :" + this.publica[0]);
							})
							.catch((err) => console.log(err));
					}
				})
				.catch((erreur) => console.log(erreur));
		},
		//* SELECT mine PUBLICATIONS
		seeMinePublications: function() {
			this.mine = false;
			this.more = false;
			this.theInfo = "Vos publications GroupoRéseauMania !";
			this.publica = [];
			this.seePub = true;

			axios
				.get("http://localhost:3001/api/pub/user/" + this.$store.state.currentUserId)
				.then((resp) => {
					this.qtyPub = resp.data.length;
					console.log("qty :" + resp.data.length);
					for (let i = 0; i < this.qtyPub; i++) {
						this.publica.push({
							index: resp.data[i].id,
							titre: resp.data[i].titre,
							contenu: resp.data[i].texte_pub,
							userId: resp.data[i].userId,
						});
					}
					console.log("Publica :" + resp.data.length);
					if (resp.data.length === 0) {
						this.theInfo = "Vous n'avez pas encore de publications GroupoRéseauMania !";
					}
				})
				.catch((erreur) => console.log(erreur));
		},
		//* SELECT one PUBLICATION
		seeOnePublication: function(pub) {
			console.log("select one : " + pub.index);
			this.theInfo = "Votre sélection :";
			this.publica = [];
			this.$store.state.currentPubId = pub.index;
			this.$store.state.currentLikes = pub.likes;
			this.$store.state.currentComments = pub.comm;
			this.onePub = true;
			this.seePub = true;
			this.more = false;
			this.select = true;

			axios
				.get("http://localhost:3001/api/pub/" + pub.index)
				.then((resp) => {
					this.publica.push({
						index: resp.data[0].id,
						titre: resp.data[0].titre,
						contenu: resp.data[0].texte_pub,
						userId: resp.data[0].userId,
						likes: pub.likes,
						comm: pub.comm,
					});
					console.log("publicat[likes] : " + this.publica[0].likes);
					// this.$store.state.currentPubId = resp.data[0].id;
					// this.$store.state.currentComments = resp.data[0].id;

					console.log("pubId = " + this.$store.state.currentPubId);
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
