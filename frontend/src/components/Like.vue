<template>
	<div>
		<div>
			<Button
				@click="liker(pub)"
				:label="pub.likes.toString()"
				icon="pi pi-heart"
				class="p-button-rounded p-button-help p-button-outlined p-m-2"
			/>
		</div>
		<div v-if="noConnect" class="p-toast p-col-10 p-md-7 p-lg-3">
			<div id="noLike" class="p-shadow-3 p-py-1 p-grid p-jc-between">
				<div class="p-col-10">
					<i class="pi pi-exclamation-triangle"></i>
					<span> Vous devez être connecté.e pour "liker".</span>
				</div>
				<div class="p-col-1">
					<i @click="closeAlert" class="pi pi-times-circle"></i>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapActions, mapState } from "vuex"; // for authentification

export default {
	name: "Like",
	data() {
		return {
			noConnect: false,
			like: "",
		};
	},

	props: ["pub"],
	computed: {
		...mapState(["token", "logged"]),
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* Close message if box user is not connected
		closeAlert: function() {
			this.noConnect = false;
		},
		//* Add a LIKE
		liker: function(pub) {
			if (!this.token) {
				this.noConnect = true;
			} else {
				this.$store.dispatch("checkConnect");
				if (!this.logged && this.token) {
					this.$router.push("/");
				} else {
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
						.catch((err) => {
							if (err.response.data.message === "jwt expired") {
								this.setInfo;
								this.$router.push("/");
							}
						});
				}
			}
		},
	},
};
</script>
<style>
#noLike {
	background-color: orange;
}
</style>
