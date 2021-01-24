<template>
	<div>
		<div>
			<p>Recherche de commentaires par mot présent dans son contenu.</p>

			<p>
				Mot recherché : <input type="text" v-model="wordReq" /><button
					style="color:green;"
					@click="findByWord"
				>
					Valider la recherche
				</button>
			</p>
			<p>Nombre de commentaires trouvés : {{ this.qtyComms }}.</p>
			<p>-- -- -- -- -- -- --</p>
			<p>{{ this.infoComm }}</p>
		</div>
		<div v-for="comm in comms" :key="comm.index">
			<Author :item="comm" />
			<p>Contenu : {{ comm.contenu }}</p>
			<p>{{ comm.info }}</p>
			<button v-if="comm.demandDelete === 1" style="color:red;" @click="deleteComm(comm)">
				Supprimer le commentaire
			</button>
			<p v-if="comm.demandDelete === 2" style="color:red;">
				Merci de confirmer la suppression de ce commentaire.
			</p>
			<button v-if="comm.demandDelete === 2" style="color:red;" @click="confDeleteComm(comm)">
				CONFIRMER la SUPPRESSION du commentaire.
			</button>
			<p>***** ***** *****</p>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import Author from "../components/Author.vue";
export default {
	name: "AdminComms",
	components: { Author },
	data() {
		return {
			qtyComms: "",
			wordReq: "",
			comms: [],
			infoComm: "",
		};
	},
	methods: {
		//* FIND comments by word
		findByWord: function() {
			console.log("qordReq =" + this.wordReq);
			this.comms = [];
			axios({
				method: "get",
				url: "http://localhost:3001/api/pub/search/comment/" + this.wordReq,
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			})
				.then((resp) => {
					this.qtyComms = resp.data.length;
					for (let i = 0; i < this.qtyComms; i++) {
						this.comms.push({
							index: resp.data[i].id,
							contenu: resp.data[i].texte_com,
							userId: resp.data[i].userId,
							date: resp.data[i].date_crea_com,
							demandDelete: 1,
							info: "",
						});
					}
				})
				.catch((err) => {
					this.infoComm = "Aucun commentaire ne correspond à cette recherche.";
					console.log(err);
				});
		},
		//* DELETE a COMMENT
		deleteComm: function(comm) {
			comm.demandDelete = 2;
			console.log(comm.index);
		},
		confDeleteComm: function(comm) {
			axios({
				method: "delete",
				url: "http://localhost:3001/api/pub/delete/comment/" + comm.index,
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			})
				.then((resp) => {
					comm.info = "Ce commentaire vient d'être supprimé.";
					comm.demandDelete = 0;
				})
				.catch((err) => {
					console.log(err);
				});
		},
	},
};
</script>
