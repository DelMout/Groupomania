<template>
	<div>
		<i @mouseover="hover = true" @mouseleave="hover = false" style="color:grey;">
			{{ prenom }} {{ nom }} - <span v-if="publie">a publié</span
			><span v-else>a commenté</span> {{ dateFr(item.date) }}
		</i>
		<p v-if="hover" style="color:green;">
			<img style="width:70px;" :src="photo" alt="author picture" title="user-img" />
			<!-- <img v-bind:src="photo" title="user-img" /> -->
			Service : {{ service }}, A propos de moi : {{ description }}
		</p>
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
		axios
			.get("http://localhost:3001/api/auth/ident/" + this.item.userId)
			.then((respon) => {
				this.prenom = respon.data[0].prenom;
				this.nom = respon.data[0].nom;
				this.service = respon.data[0].service;
				this.description = respon.data[0].description;
				if (respon.data[0].photo != null) {
					this.photo = respon.data[0].photo;
				} else {
					this.photo = "http://localhost:3001/images/photo_defaut.jpg";
				}
				console.log("lien photo = " + this.photo);
				if (this.item.index >= 0) {
					this.publie = true; // Corresponding to publication
				} else {
					this.publie = false; // Corresponding to comment
				}
			})
			.catch((err) => console.log(err));
	},
};
</script>
