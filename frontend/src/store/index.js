import { createStore } from "vuex";

export default createStore({
	state: {
		totalFromVuex: 12,
		// info: "RAS",
		// savePrenom: "Norbert",
		// saveNom: "DuSchnok",
		// saveEmail: "ddd@groupomania.fr",
		// saveService: "Finance",
		// savePassword: "nnn",
		// saveDescription: "Champion de la dérision !",
	},
	getters: {
		doubleDuTotal(state) {
			return state.totalFromVuex * 2;
		},
	},
	mutations: {
		setTotalFromVuex(state, nouvelle_valeur) {
			state.totalFromVuex = nouvelle_valeur;
		},
		// createUser(state){
		//   fetch("http://localhost:3001/api/auth.signup")
		//   .then((resp)=>{
		//     return resp.json();
		//   })
		//   .then((obj)=>{
		//     state.info=obj[0];
		//   })
		// }
	},
	actions: {},
	modules: {},
});
