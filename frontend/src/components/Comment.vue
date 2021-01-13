<template>
	<div>
		<a v-on:click="seeComment(pub)">
			<p v-if="pub.comm > 1">{{ pub.comm }} commentaires</p>
			<p v-else>{{ pub.comm }} commentaire</p>
		</a>
		<div v-for="com in allComments" :key="com">
			<Author :item="com" />
			<!-- <p>{{ com.prenom }} {{ com.nom }} :</p> -->
			<p>{{ com.texte }}</p>
			<p>----------------------</p>
		</div>
		<div>
			<p v-if="seeComm">
				Votre commentaire : <input type="text" v-model="commentUser" /><button
					v-on:click="createComm"
				>
					>>
				</button>
			</p>
		</div>
		<!-- <p v-if="alreadyLike">Vous avez déjà émis un like sur cette publication.</p> -->
	</div>
</template>
<script>
import Author from "@/components/Author";
import axios from "axios";
export default {
	name: "Comment",
	data() {
		return {
			comment: "",
			allComments: [],
			seeComm: false,
			commentUser: "",
		};
	},
	components: {
		Author,
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
						// Pick up firstName and name of Comment author
						axios
							.get("http://localhost:3001/api/auth/ident/" + resp.data[i].userId)
							.then((respo) => {
								this.allComments.push({
									texte: resp.data[i].texte_com,
									date: resp.data[i].date_crea_com,
									userId: resp.data[i].userId,
									prenom: respo.data[0].prenom,
									nom: respo.data[0].nom,
								});
							})
							.catch((err) => console.log(err));
					}
				})
				.catch((err) => console.log(err));
		},

		//* Create a COMMENT
		createComm: function() {
			axios
				.post(
					"http://localhost:3001/api/pub/" +
						this.pub.index +
						"/comm/" +
						this.$store.state.currentUserId,
					{
						texte: this.commentUser,
					}
				)
				.then((resp) => {
					console.log("commentaire créé !");
					// see allComments
					this.allComments = [];
					axios
						.get("http://localhost:3001/api/pub/" + this.pub.index + "/comm/")
						.then((resp) => {
							console.log("length = " + resp.data.length);
							for (let i = 0; i < resp.data.length; i++) {
								// Pick up firstName and name of Comment author
								axios
									.get(
										"http://localhost:3001/api/auth/ident/" +
											resp.data[i].userId
									)
									.then((respo) => {
										this.allComments.push({
											texte: resp.data[i].texte_com,
											prenom: respo.data[0].prenom,
											nom: respo.data[0].nom,
										});
									})
									.catch((err) => console.log(err));
							}
							this.commentUser = "";
						})
						.catch((err) => console.log(err));
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>
