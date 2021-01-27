<template>
	<div>
		<div>
			<Button
				@click="liker(pub)"
				:label="pub.likes"
				icon="pi pi-heart"
				class="p-button-rounded p-button-help p-button-outlined p-m-2"
			/>
		</div>
		<div>
			<Message v-if="noConnected" severity="warn" :life="5000" :sticky="false"
				>Vous devez être connecté.e pour "liker".</Message
			>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapGetters, mapState } from "vuex"; // for authentification

export default {
	name: "Like",
	data() {
		return {
			noConnected: false,
		};
	},
	props: ["pub"],
	computed: {
		...mapState({ token: "token" }),
		isLoggedIn() {
			return this.$store.state.isLoggedIn;
		},
		// ...mapGetters(["isLoggedIn"]),
	},

	methods: {
		//* Add a LIKE
		liker: function(pub) {
			if (!this.token) {
				this.noConnected = true;
			} else {
				this.$store.commit("setLogIn");
				if (!this.isLoggedIn && this.token) {
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
			}
		},
	},
};
</script>
