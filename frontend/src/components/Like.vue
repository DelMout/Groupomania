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
		<div class="p-toast ">
			<div
				class="p-shadow-3 p-py-1 p-grid p-jc-between"
				style="background-color:orange;"
				v-if="noConnected"
			>
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
			noConnected: false,
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
			this.noConnected = false;
		},
		//* Add a LIKE
		liker: function(pub) {
			if (!this.token) {
				this.noConnected = true;
			} else {
				this.$store.dispatch("checkConnect");
				if (!this.logged && this.token) {
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
