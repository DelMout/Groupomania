<template>
	<div id="author" class="p-grid  vertical-container nested-grid">
		<div class="p-col p-mx-auto p-py-0">
			<div class="p-col p-mb-1 p-py-0">
				<i @mouseover="hover = true" @mouseleave="hover = false">
					{{ prenom }} {{ nom }} - <span v-if="publie">a publié</span
					><span v-else>a commenté</span> {{ dateFr(item.date) }}
				</i>
			</div>
			<div class="p-col p-mx-auto p-shadow-4 " v-if="hover">
				<div class="p-grid ">
					<div class="p-col-4 p-my-1 ">
						<img
							class=" p-avatar p-avatar-image p-avatar-circle p-avatar-xl "
							:src="photo"
							alt="author picture"
							title="user-img"
						/>
					</div>
					<div class="p-col-8 p-text-left p-pb-0">
						<p><span class="p-text-bold"> Service : </span>{{ service }}</p>
						<p>
							<span v-if="description" class="p-text-bold">A propos de moi : </span
							>{{ description }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import moment from "moment";
import axios from "axios";
export default {
	name: "Author",
	data() {
		return {
			prenom: "",
			nom: "",
			service: "",
			description: "",
			photo: "",
			publie: true,
			hover: false,
		};
	},
	props: ["item"],
	methods: {
		dateFr: function(date) {
			moment.locale("fr");
			const dateFct = moment(date).calendar({
				sameDay: "[aujourd'hui]",
				lastDay: "[hier]",
			});
			if (dateFct === "hier" || dateFct === "aujourd'hui") {
				return dateFct;
			} else {
				return `le ${moment(date).format("DD MMMM YYYY")}`;
			}
		},
	},
	created: function(item) {
		axios.get("http://localhost:3001/api/auth/ident/" + this.item.userId).then((respon) => {
			this.prenom = respon.data.prenom;
			this.nom = respon.data.nom;
			this.service = respon.data.service;
			this.description = respon.data.description;
			if (respon.data.photo != null) {
				this.photo = respon.data.photo;
			} else {
				this.photo = "http://localhost:3001/images/photo_defaut.jpg";
			}
			if (this.item.index >= 0) {
				this.publie = true; // Corresponding to publication
			} else {
				this.publie = false; // Corresponding to comment
			}
		});
	},
};
</script>
<style>
#author {
	color: #303030;
}
</style>
