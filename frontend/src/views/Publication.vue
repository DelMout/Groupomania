<template>
	<div>
		<h1>{{ theInfo }}</h1>
		<button v-if="log" v-on:click="displayPublications">Valider</button>
		<div v-for="pub in publica" :key="pub.titre">
			<!-- boucle  pour afficher toutes les pub -->
			<h2>{{ pub.titre }}</h2>
			<p>
				{{ pub.contenu }}
			</p>
		</div>
		<button v-if="more" v-on:click="seeMorePublications">Voir plus de publications</button
		><button v-if="mine" v-on:click="seeMinePublications">Voir vos publications</button>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "Publication",
	data() {
		return {
			theInfo: "Les publications GroupoRéseauMania",
			titre: "",
			contenu: "",
			log: true,
			qtyPub: 0,
			qtyMore: 0,
			publica: [],
			more: false,
			mine: true,
		};
	},
	methods: {
		//* SELECT 10 first PUBLICATIONS
		displayPublications: function() {
			this.log = false;
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
						this.publica.push({
							titre: resp.data[i].titre,
							contenu: resp.data[i].texte_pub,
						});
					}
					console.log("Publica :" + this.publica[0].titre);
				})
				.catch((erreur) => console.log(erreur));
		},
		//* SELECT 10 following PUBLICATIONS
		seeMorePublications: function() {
			this.qtyMore += 1;
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
					for (let i = parseInt(1 * this.qtyMore); i < this.qtyPub; i++) {
						this.publica.push({
							titre: resp.data[i].titre,
							contenu: resp.data[i].texte_pub,
						});
					}
					console.log("Publica :" + this.publica[1].titre);
				})
				.catch((erreur) => console.log(erreur));
		},
		//* SELECT mine PUBLICATIONS
		seeMinePublications: function() {
			this.mine = false;
			axios
				.get("http://localhost:3001/api/pub/user/" + this.$store.state.currentUserId)
				.then((resp) => {
					this.qtyPub = resp.data.length;
					console.log("qty :" + resp.data.length);
					for (let i = 0; i < this.qtyPub; i++) {
						this.publica.push({
							titre: resp.data[i].titre,
							contenu: resp.data[i].texte_pub,
						});
					}
					console.log("Publica :" + this.publica[0].titre);
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
