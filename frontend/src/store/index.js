import { createStore } from "vuex";
import moment from "moment";
import jwt_decode from "jwt-decode";

export default createStore({
	state: {
		userId: null,
		token: null,
		isAdmin: 0,
		infoHome: "",
		isLoggedIn: false,
		dateEXP: "",
		dateNOW: "",
	},
	mutations: {
		setUserId(state, userId) {
			state.userId = userId;
		},
		setToken(state, token) {
			state.token = token;
		},
		setAdmin(state, isAdmin) {
			state.isAdmin = isAdmin;
		},
		setInfo(state) {
			state.infoHome = "Votre session a expiré.";
		},
		// setLogIn(state) {
		// 	state.isLoggedIn = true;
		// },
		setLogOut(state) {
			state.isLoggedIn = false;
		},
		setLogIn(state) {
			if (state.token === null) {
				state.isLoggedIn = false;
			} else {
				const decoded = jwt_decode(state.token);
				state.dateEXP = moment(new Date(decoded.exp * 1000)).format("DD MM YYYY k:mm:ss");
				state.dateNOW = moment().format("DD MM YYYY k:mm:ss");
				state.isLoggedIn = state.dateEXP > state.dateNOW;
				if (!state.isLoggedIn) {
					state.infoHome = "Votre session a expiré.";
				}
			}
		},
	},
	getters: {
		//* Indication token expired
		// isLoggedIn(state) {
		// 	if (state.token === null) {
		// 		return false;
		// 	} else {
		// 		const decoded = jwt_decode(state.token);
		// 		const dateEXP = moment(new Date(decoded.exp * 1000)).format("DD MM YYYY k:mm:ss");
		// 		const dateNOW = moment().format("DD MM YYYY k:mm:ss");
		// 		return dateEXP > dateNOW;
		// 	}
		// },
	},
	actions: {
		updateInfo(context) {
			context.commit("setInfo");
		},
		// updateLog(context) {
		// 	if (this.state.token === null) {
		// 		context.commit("setLogOut");
		// 	} else {
		// 		const decoded = jwt_decode(state.token);
		// 		const dateEXP = moment(new Date(decoded.exp * 1000)).format("DD MM YYYY k:mm:ss");
		// 		const dateNOW = moment().format("DD MM YYYY k:mm:ss");
		// 		const log = dateEXP > dateNOW;
		// 		if (log) {
		// 			context.commit("setLogIn");
		// 		} else {
		// 			context.commit("setLogOut");
		// 			context.commit("setInfo");
		// 		}
		// 	}
		// },
	},

	//TODO si inNotExpired=false
	//TODO => annuler token et userID
	//TODO => Afficher un message sur page '/' : Votre session a expiré.
});
