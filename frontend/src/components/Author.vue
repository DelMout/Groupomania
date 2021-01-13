<template>
	<div>
		<p>
			{{ prenom }} {{ nom }} - <span v-if="publie">a publié</span
			><span v-else>a commenté</span> {{ dateFr(item.date) }}
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
			publie: true,
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
			if ((dateFct === "aujourd'hui") | "hier") {
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
