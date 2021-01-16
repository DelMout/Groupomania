<template>
	<div>
		<h1>{{ theInfo }}</h1>
		<!-- loop to display all publications -->
		<div v-if="!del">
			<div v-for="pub in publica" :key="pub.index">
				<Author :item="pub" />
				<h2>{{ pub.titre }}</h2>
				<p>{{ pub.contenu }}</p>
				<img
					v-if="pub.photo != null"
					:src="pub.photo"
					alt="publication picture"
					title="pub-img"
				/>
				<Like :pub="pub" />
				<Comment :pub="pub" />
				<button style="color:red;" v-if="seePub" v-on:click="deletePub(pub)">
					Supprimer cette publication
				</button>
				<p>***********************</p>
			</div>
		</div>
		<div v-if="del">
			<p>Titre de la publication à supprimer : {{ titreDel }}</p>
			<p>Contenu de la publication à supprimer : {{ contenuDel }}</p>
			<button v-if="confDel" style="color:red;" v-on:click="confDeletePub">
				Confirmer la suppression
			</button>
		</div>
		<button v-if="seePub" v-on:click="backToPublications">
			Revenir sur les publications
		</button>

		<button v-if="more" v-on:click="seeMorePublications">Voir plus de publications</button>

		<button v-if="mine" v-on:click="seeMinePublications">Voir vos publications</button>
	</div>
</template>

<script>
import Like from "@/components/Like";
import Comment from "@/components/Comment";
import Author from "@/components/Author";
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
			del: false,
			confDel: true,
			photo: "",
		};
	},
	created: function() {
		this.qtyMore = 0;
		this.seePublications();
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
		},
		//* SELECT 10 PUBLICATIONS
		seePublications: function() {
			// this.qtyMore += 1;
			this.seePub = false;
			this.del = false;

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
			this.mine = false;
			this.more = false;
			this.theInfo = "Vos publications GroupoRéseauMania !";
			this.publica = [];
			this.seePub = true;
			this.del = false;

			axios
				.get("http://localhost:3001/api/pub/user/" + this.$store.state.currentUserId)
				.then((resp) => {
					this.qtyPub = resp.data.length;
					console.log("qty :" + resp.data.length);
					console.log("Publica :" + resp.data.length);
					if (resp.data.length === 0) {
						this.theInfo = "Vous n'avez pas encore de publications GroupoRéseauMania !";
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
		},
		//* DELETE a PUBLICATION
		deletePub: function(pub) {
			console.log("indexPub =" + pub.index);
			this.theInfo =
				"Attention cette publication, supprimera aussi les commentaires liés à cette publication.";
			this.del = true;
			this.seePub = false;
			this.more = false;
			this.mine = false;
			this.titreDel = pub.titre;
			this.contenuDel = pub.contenu;
			this.indexDel = pub.index;
		},
		confDeletePub: function() {
			axios
				.delete("http://localhost:3001/api/pub/" + this.indexDel)
				.then((resp) => {
					this.theInfo = "Votre publication a été supprimée.";
					this.confDel = false;
					this.seePub = true;
					this.mine = true;

					//TODO : afficher boutons "back publi" et "voir mes pub"
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>
