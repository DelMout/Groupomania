<template>
	<div>
		<a v-on:click="seeComment(pub)" style="text-decoration:underline;">
			<p v-if="pub.comm > 1">{{ pub.comm }} commentaires</p>
			<p v-else>{{ pub.comm }} commentaire</p>
		</a>
		<div v-for="com in allComments" :key="com">
			<Author :item="com" />
			<p>{{ com.texte }}</p>
			<p>----------------------</p>
		</div>
		<div>
			<p v-if="seeComm">
				Votre commentaire : <InputText type="text" v-model="commentUser" /><Button
					label=">>"
					class="p-m-1"
					@click="createComm"
				/>
			</p>
		</div>
		<div>
			<Message v-if="noConnected" severity="warn" :life="5000" :sticky="false"
				>Vous devez être connecté.e pour écrire un commentaire.</Message
			>
		</div>
	</div>
</template>
<script>
import Author from "@/components/Author";
import axios from "axios";
import { mapGetters, mapState } from "vuex"; // for authentification
export default {
	name: "Comment",
	data() {
		return {
			comment: "",
			allComments: [],
			seeComm: false,
			commentUser: "",
			noConnected: false,
		};
	},
	components: {
		Author,
	},
	computed: {
		...mapState({ token: "token" }),
		// ...mapGetters(["isLoggedIn"]),
		isLoggedIn() {
			return this.$store.state.isLoggedIn;
		},
	},
	props: ["pub"],
	methods: {
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
				this.$store.commit("setLogIn");
				if (!this.isLoggedIn) {
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
							console.log("commentaire créé !");
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
								.catch((err) => console.log(err));
						})
						.catch((err) => console.log(err));
				}
			}
		},
	},
};
</script>
