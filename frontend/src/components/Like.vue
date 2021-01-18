<template>
	<div>
		<a v-on:click="liker(pub)">
			<p v-if="pub.likes > 1">Likes : {{ pub.likes }}</p>
			<p v-else>Like : {{ pub.likes }}</p>
		</a>
		<i v-if="alreadyLike" style="color:blue"
			>Vous avez déjà émis un like sur cette publication.</i
		>
	</div>
</template>
<script>
import axios from "axios";
import { mapGetters, mapState } from "vuex"; // for authentification

export default {
	name: "Like",
	data() {
		return {
			alreadyLike: false,
		};
	},
	props: ["pub"],
	computed: {
		...mapState({ token: "token" }),
	},

	methods: {
		//* Add a LIKE
		liker: function(pub) {
			console.log("pub.index = " + this.pub.index);
			axios({
				method: "post",
				url:
					"http://localhost:3001/api/pub/" +
					this.pub.index +
					"/like/" +
					this.$store.state.user[0].id,
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
				// axios
				// 	.post(
				// 		"http://localhost:3001/api/pub/" +
				// 			this.pub.index +
				// 			"/like/" +
				// 			this.$store.state.currentUserId
				// 	)
				.then((resp) => {
					if (resp.data === "user already liked that publication") {
						this.alreadyLike = true;
					} else {
						this.pub.likes += 1;
					}
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
