<template>
	<div>
		<div>
			<p>Recherche de publications par mot (dans le titre ou le contenu).</p>

			<p>
				Mot recherché : <input type="text" v-model="wordReq" /><button
					style="color:green;"
					@click="findByWord"
				>
					Valider la recherche
				</button>
			</p>
			<p>Nombre de publications trouvées : {{ this.qtyPubs }}.</p>
			<p>-- -- -- -- -- -- --</p>
			<p>{{ this.infoPub }}</p>
		</div>
		<div v-for="pub in pubs" :key="pub.index">
			<Author :item="pub" />
			<p>Titre : {{ pub.titre }}</p>
			<p>Contenu : {{ pub.contenu }}</p>
			<img v-if="pub.photo" style="width:100px;" :src="pub.photo" alt="publication image" />
			<p>{{ pub.info }}</p>
			<button v-if="pub.demandDelete === 1" style="color:red;" @click="deletePub(pub)">
				Supprimer la publication
			</button>
			<p v-if="pub.demandDelete === 2" style="color:red;">
				Attention, la suppression de cette publication supprimera aussi les commentaires
				liés à cette publication.
			</p>
			<button v-if="pub.demandDelete === 2" style="color:red;" @click="confDeletePub(pub)">
				CONFIRMER la SUPPRESSION de la publication.
			</button>
			<p>***** ***** *****</p>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapGetters, mapState } from "vuex";

import moment from "moment";
import axios from "axios";
import Author from "../components/Author.vue";
export default {
	name: "AdminPubs",
	components: { Author },
	data() {
		return {
			qtyPubs: "",
			wordReq: "",
			pubs: [],
			infoPub: "",
		};
	},
	computed: {
		...mapState({ token: "token" }, { userId: "userId" }, { isAdmin: "isAdmin" }),
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin"]),

		//* FIND publications by word
		findByWord: function() {
			this.pubs = [];
			axios({
				method: "get",
				url: "http://localhost:3001/api/pub/search/" + this.wordReq,
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
				.then((resp) => {
					this.qtyPubs = resp.data.length;
					for (let i = 0; i < this.qtyPubs; i++) {
						this.pubs.push({
							index: resp.data[i].id,
							titre: resp.data[i].titre,
							contenu: resp.data[i].texte_pub,
							userId: resp.data[i].userId,
							photo: resp.data[i].photo,
							date: resp.data[i].date_crea_pub,
							// date: moment(resp.data.date_crea_pub).format("DD/MM/YYYY"),
							demandDelete: 1,
							info: "",
						});
					}
				})
				.catch((err) => {
					this.infoPub = "Aucune publication ne correspond à cette recherche.";
					console.log(err);
				});
		},
		//* DELETE a PUBLICATION
		deletePub: function(pub) {
			pub.demandDelete = 2;
			console.log(pub.index);
		},
		confDeletePub: function(pub) {
			axios({
				method: "delete",
				url: "http://localhost:3001/api/pub/" + pub.index + "/" + pub.userId,
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
				.then((resp) => {
					pub.info = "Cette publication vient d'être supprimée.";
					pub.demandDelete = 0;
				})
				.catch((err) => {
					console.log(err);
				});
		},
	},
};
</script>
