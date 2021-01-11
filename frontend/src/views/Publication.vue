<template>
	<div>
		<h1>{{ theInfo }}</h1>
		<!-- <p>{{ theWarning }}</p> -->
		<button v-if="log" v-on:click="displayPublications">Valider</button>
		<!-- boucle  pour afficher toutes les pub -->
		<div v-for="pub in publica" :key="pub.titre">
			<a v-if="!select" v-on:click="seeOnePublication(pub)">
				<h2>{{ pub.titre }}</h2>
				<p>{{ pub.contenu }}</p>
				<p>Likes : {{ pub.likes }}</p>
				<p>commentaires</p>
			</a>
			<div v-if="select">
				<h2>{{ pub.titre }}</h2>
				<p>{{ pub.contenu }}</p>
				<Like />
				<Comment />
			</div>
		</div>
		<button v-if="seePub" v-on:click="displayPublications">Revenir sur les publications</button>
		* <button v-if="more" v-on:click="seeMorePublications">Voir plus de publications</button> *
		<button v-if="mine" v-on:click="seeMinePublications">Voir vos publications</button>
	</div>
</template>

<script>
import Like from "@/components/Like";
import Comment from "@/components/Comment";
import axios from "axios";
export default {
	name: "Publication",
	components: {
		Like,
		Comment,
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
								console.log("lon = " + respo.data.length);
								this.publica.push({
									index: resp.data[i].id,
									titre: resp.data[i].titre,
									contenu: resp.data[i].texte_pub,
									userId: resp.data[i].userId,
									likes: respo.data.length,
								});
							})
							.catch((err) => console.log(err));
					}
					console.log("Publica_like :" + this.publica[0]);
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
								console.log("lon = " + respo.data.length);
								this.publica.push({
									index: resp.data[i].id,
									titre: resp.data[i].titre,
									contenu: resp.data[i].texte_pub,
									userId: resp.data[i].userId,
									likes: respo.data.length,
								});
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
			const likes_anc = pub.likes;
			this.$store.state.currentLikes = pub.likes;
			console.log("likes : " + likes_anc);
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
						likes: likes_anc,
					});
					console.log("publicat[likes] : " + this.publica[0].likes);
					this.$store.state.currentPubId = resp.data[0].id;
					console.log("pubId = " + this.$store.state.currentPubId);
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
