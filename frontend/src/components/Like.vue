<template>
	<div>
		<a v-on:click="liker(pub)">
			<p>Likes : {{ pub.likes }}</p>
		</a>
		<i v-if="alreadyLike" style="color:blue"
			>Vous avez déjà émis un like sur cette publication.</i
		>
	</div>
</template>
<script>
import axios from "axios";
export default {
	name: "Like",
	data() {
		return {
			alreadyLike: false,
		};
	},
	props: ["pub"],
	computed: {},

	methods: {
		//* Add a LIKE
		liker: function(pub) {
			console.log("pub.index = " + this.pub.index);
			axios
				.post(
					"http://localhost:3001/api/pub/" +
						this.pub.index +
						"/like/" +
						this.$store.state.currentUserId
				)
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
