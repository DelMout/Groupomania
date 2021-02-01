<template>
	<div>
		<div class="p-grid">
			<a class="p-col p-text-right" @click="seeComment(pub)">
				<p v-if="pub.comm > 1">{{ pub.comm }} commentaires</p>
				<p v-else>{{ pub.comm }} commentaire</p>
			</a>
		</div>
		<div class="p-pb-1 p-my-3" v-for="com in allComments" :key="com">
			<div class="p-grid ">
				<div class="p-col-11 ">
					<Author class="" :item="com" />
				</div>
			</div>
			<div class="p-grid ">
				<div class="p-col-11">
					<p class="p-text-justify p-my-0">
						{{ com.texte }}
					</p>
				</div>
			</div>
		</div>
		<div v-if="seeComm" class="p-grid p-ai-end vertical-container p-mt-2">
			<div class="p-col-11 p-as-start p-float-label p-text-left">
				<Textarea v-model="commentUser" :autoResize="true" rows="3" :cols="col" />

				<label>Votre commentaire</label
				><Button icon="pi pi-angle-double-right" class="" @click="createComm" />
			</div>
		</div>
		<div class="p-grid">
			<Message v-if="noConnected" severity="warn" :life="5000" :sticky="false"
				>Vous devez être connecté.e pour écrire un commentaire.</Message
			>
		</div>
	</div>
</template>
<script>
import Author from "@/components/Author";
import axios from "axios";
import { mapActions, mapState } from "vuex"; // for authentification
export default {
	name: "Comment",
	data() {
		return {
			comment: "",
			allComments: [],
			seeComm: false,
			commentUser: "",
			noConnected: false,
			col: 40,
		};
	},
	components: {
		Author,
	},
	computed: {
		...mapState(["token", "logged"]),
	},
	props: ["pub"],
	created: function() {
		if (window.matchMedia("(max-width:768px)").matches) {
			this.col = 30;
		}
		if (window.matchMedia("(max-width:576px)").matches) {
			this.col = 15;
		}
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* See COMMENTS
		seeComment: function(pub) {
			this.seeComm = true;
			this.allComments = [];
			axios
				.get("http://localhost:3001/api/pub/" + this.pub.index + "/comm/")
				.then((resp) => {
					for (let i = 0; i < this.pub.comm; i++) {
						this.allComments.push({
							texte: resp.data[i].texte_com,
							date: resp.data[i].date_crea_com,
							userId: resp.data[i].userId,
						});
					}
				})
				.catch((err) => console.log(err));
		},

		//* Create a COMMENT
		createComm: function() {
			if (!this.token) {
				this.noConnected = true;
			} else {
				this.$store.dispatch("checkConnect");
				if (!this.logged) {
					this.$router.push("/");
				} else {
					axios({
						method: "post",
						url:
							"http://localhost:3001/api/pub/" +
							this.pub.index +
							"/comm/" +
							this.$store.state.userId,
						data: { texte: this.commentUser },
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					})
						.then((resp) => {
							// see allComments
							this.allComments = [];
							axios
								.get("http://localhost:3001/api/pub/" + this.pub.index + "/comm/")
								.then((resp) => {
									console.log("length = " + resp.data.length);
									for (let i = 0; i < resp.data.length; i++) {
										this.allComments.push({
											texte: resp.data[i].texte_com,
											date: resp.data[i].date_crea_com,
											userId: resp.data[i].userId,
										});
									}
									this.commentUser = "";
									this.pub.comm += 1;
								})
								.catch((err) => res.send(err));
						})
						.catch((err) => {
							if (err.response.data.message === "jwt expired") {
								this.setInfo;
								this.$router.push("/");
							}
							res.send(err);
						});
				}
			}
		},
	},
};
</script>
<style>
a {
	text-decoration: underline;
}
</style>
