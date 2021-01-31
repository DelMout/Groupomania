<template>
	<div>
		<div>
			<p>Recherche de commentaires par mot présent dans son contenu.</p>

			<div class="p-grid p-jc-center">
				<div class=" p-grid">
					<div class="p-m-3 p-col-5 p-float-label">
						<InputText id="word" type="text" v-model="wordReq" /><label for="word">
							Mot recherché</label
						>
					</div>
					<div class="p-m-3 p-col-5">
						<Button label="Valider la recherche" @click="findByWord" />
					</div>
				</div>
			</div>
			<div>Nombre de commentaires trouvés : {{ qtyComms }}</div>
			<div class="p-grid p-jc-center p-mt-3">
				<Message v-if="infoComm" severity="info">{{ infoComm }}</Message>
			</div>
		</div>

		<div v-for="comm in comms" :key="comm.index" class=" p-grid vertical-container p-mt-3 ">
			<div class="p-mx-auto ">
				<div class=" p-card p-shadow-6 p-col p-grid p-p-5 p-m-2 " style="width:40rem;">
					<Author class="p-col-10 p-offset-1" :item="comm" />
					<!-- <h2 class="p-card-title p-col-10 p-offset-1 ">
						{{ pub.titre }}
					</h2> -->
					<div class="p-card-content p-col-10 p-offset-1 ">
						<p class="p-text-justify">{{ comm.contenu }}</p>
					</div>
					<div class="p-card-footer p-col-10 p-offset-1  ">
						<Message v-if="comm.info" severity="success">{{ comm.info }}</Message>

						<ConfirmPopup></ConfirmPopup>
						<Button
							label="Supprimer cet commentaire"
							class="p-button-danger p-button-raised p-button-text"
							v-if="comm.demandDelete"
							@click="deleteComm($event, comm)"
						/>
					</div>
				</div>
			</div>

			<!-- <p>
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
			<p>***** ***** *****</p> -->
		</div>
	</div>
</template>
<script>
import { mapMutations, mapActions, mapState } from "vuex";

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
	computed: {
		...mapState(["token", "userId", "isAdmin", "logged"]),
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin"]),
		...mapActions(["checkConnect"]),
		//* FIND comments by word
		findByWord: function() {
			console.log("qordReq =" + this.wordReq);
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
				this.$router.push("/");
			} else {
				this.infoComm = "";
				this.qtyComms = "";
				this.comms = [];
				axios({
					method: "get",
					url: "http://localhost:3001/api/pub/search/comment/" + this.wordReq,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						this.qtyComms = resp.data.length;
						for (let i = 0; i < this.qtyComms; i++) {
							this.comms.push({
								index: resp.data[i].id,
								contenu: resp.data[i].texte_com,
								userId: resp.data[i].userId,
								date: resp.data[i].date_crea_com,
								demandDelete: true,
								info: "",
							});
						}
					})
					.catch((err) => {
						this.infoComm = "Aucun commentaire ne correspond à cette recherche.";
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
						res.send(err);
					});
			}
		},
		//* DELETE a COMMENT
		deleteComm: function(event, comm) {
			// comm.demandDelete = false;
			console.log(comm.index);
			this.$confirm.require({
				target: event.currentTarget,
				message: "Merci de confirmer la suppression de ce commentaire.",
				icon: "pi pi-exclamation-triangle",
				accept: () => {
					this.confDeleteComm(comm);
				},
				reject: () => {},
			});
		},
		confDeleteComm: function(comm) {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
				this.$router.push("/");
			} else {
				axios({
					method: "delete",
					url: "http://localhost:3001/api/pub/delete/comment/" + comm.index,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						comm.info = "Ce commentaire vient d'être supprimé.";
						comm.demandDelete = false;
					})
					.catch((err) => {
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
						res.send(err);
					});
			}
		},
	},
};
</script>
