<template>
	<div>
		<a v-on:click="liker">
			<p>Likes :{{ countLike }}</p>
		</a>
		<p v-if="alreadyLike">Vous avez déjà émis un like sur cette publication.</p>
	</div>
</template>
<script>
import axios from "axios";
export default {
	name: "Like",
	data() {
		return {
			alreadyLike: false,
			countLike: this.$store.state.currentLikes,
		};
	},
	computed: {},

	methods: {
		//* Add a LIKE
		liker: function() {
			axios
				.post(
					"http://localhost:3001/api/pub/" +
						this.$store.state.currentPubId +
						"/like/" +
						this.$store.state.currentUserId
				)
				.then((resp) => {
					if (resp.data === "user already liked that publication") {
						this.alreadyLike = true;
					} else {
						this.countLike += 1;
					}
				})
				.catch((erreur) => console.log(erreur));
		},
	},
};
</script>
