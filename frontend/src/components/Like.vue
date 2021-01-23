<template>
	<div>
		<a v-on:click="liker(pub)">
			<p v-if="pub.likes > 1">Likes : {{ pub.likes }}</p>
			<p v-else>Like : {{ pub.likes }}</p>
		</a>
	</div>
</template>
<script>
import axios from "axios";
import { mapGetters, mapState } from "vuex"; // for authentification

export default {
	name: "Like",
	data() {
		return {};
	},
	props: ["pub"],
	computed: {
		...mapState({ token: "token" }),
		...mapGetters(["isLoggedIn"]),
	},

	methods: {
		//* Add a LIKE
		liker: function(pub) {
			if (!this.isLoggedIn) {
				this.$store.dispatch("updateInfo");
				this.$router.push("/");
			} else {
				console.log("pub.index = " + this.pub.index);
				axios({
					method: "post",
					url:
						"http://localhost:3001/api/pub/" +
						this.pub.index +
						"/like/" +
						this.$store.state.userId,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						if (resp.data === "like deleted") {
							this.pub.likes -= 1;
						} else {
							this.pub.likes += 1;
						}
					})
					.catch((err) => res.send(err));
			}
		},
	},
};
</script>
