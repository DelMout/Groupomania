import { createStore } from "vuex";

export default createStore({
	state: {
		totalFromVuex: 12,
		currentUserId: 5,
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
	},
	actions: {},
	modules: {},
});
