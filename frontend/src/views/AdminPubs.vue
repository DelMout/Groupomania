<template>
	<div>
		<div>
			<p class="p-mb-4">Recherche de publications par mot (dans le titre ou le contenu).</p>
			<!-- display for medium screen -->
			<div class="p-grid p-jc-center p-text-left ">
				<div class="p-lg-3 p-col-8 p-d-none p-d-md-inline">
					<div class="p-grid  p-float-label">
						<InputText id="word" type="text" v-model="wordReq" /><label for="word">
							Mot recherché</label
						>
						<Button class="p-ml-2" label="Valider la recherche" @click="findByWord" />
					</div>
				</div>
			</div>
			<!-- display for small screen -->
			<div class="p-grid p-jc-center  p-d-md-none p-d-sm-inline">
				<div class="p-col">
					<div class="p-grid  ">
						<div class="p-float-label">
							<InputText id="word" type="text" v-model="wordReq" /><label for="word">
								Mot recherché</label
							>
						</div>
						<Button class="p-mt-2" label="Valider la recherche" @click="findByWord" />
					</div>
				</div>
			</div>

			<div>Nombre de publications trouvées : {{ qtyPubs }}</div>
			<div class="p-grid p-jc-center p-mt-3">
				<Message v-if="infoPub" severity="info">{{ infoPub }}</Message>
			</div>
		</div>

		<div v-for="pub in pubs" :key="pub.index" class=" p-grid vertical-container p-mt-3 ">
			<div class="p-mx-auto p-col ">
				<div class="p-grid p-jc-center">
					<div class=" p-card p-shadow-6 p-lg-4 p-md-8 p-col-12  p-grid p-p-5 p-m-2 ">
						<Author class="p-col-10 p-offset-1" :item="pub" />
						<h2 class="p-card-title p-col-10 p-offset-1 ">
							{{ pub.titre }}
						</h2>
						<div class="p-card-content p-col-10 p-offset-1 ">
							<p class="p-text-justify p-mb-3">{{ pub.contenu }}</p>
							<img
								v-if="pub.photo != null"
								:src="pub.photo"
								alt="publication picture"
								title="pub-img"
							/>
						</div>
						<div class="p-card-footer p-col-10 p-offset-1  ">
							<Message v-if="pub.info" severity="success">{{ pub.info }}</Message>

							<ConfirmPopup></ConfirmPopup>
							<Button
								label="Supprimer cette publication"
								class="p-button-danger p-button-raised p-button-text"
								v-if="pub.demandDelete"
								@click="deletePub($event, pub)"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";

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
		...mapState(["token", "userId", "isAdmin", "logged"]),
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin"]),
		...mapActions(["checkConnect"]),

		//* FIND publications by word
		findByWord: function() {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
				this.$router.push("/");
			} else {
				this.infoPub = "";
				this.qtyPubs = "";
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
								demandDelete: true,
								info: "",
							});
						}
					})
					.catch((err) => {
						this.infoPub = "Aucune publication ne correspond à cette recherche.";
						if (err.response.data.message === "jwt expired") {
							this.setInfo;
							this.$router.push("/");
						}
						res.send(err);
					});
			}
		},
		//* DELETE a PUBLICATION
		deletePub(event, pub) {
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
		},
		confDeletePub: function(pub) {
			this.$store.dispatch("checkConnect");
			if (!this.logged) {
				this.$router.push("/");
			} else {
				axios({
					method: "delete",
					url: "http://localhost:3001/api/pub/" + pub.index + "/" + pub.userId,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						pub.info = "Cette publication vient d'être supprimée.";
						pub.demandDelete = false;
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
<style>
.p-card {
	background-color: beige;
}
.p-card-content {
	max-width: 100%;
}
img {
	max-width: 100%;
	max-height: 100%;
}
</style>
