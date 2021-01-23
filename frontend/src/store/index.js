import { createStore } from "vuex";
import moment from "moment";
import jwt_decode from "jwt-decode";

export default createStore({
	state: {
		userId: null,
		token: null,
		infoHome: "",
	},
	mutations: {
		setUserId(state, userId) {
			state.userId = userId;
		},
		setToken(state, token) {
			state.token = token;
		},
		setInfo(state) {
			state.infoHome = "Votre session a expiré.";
		},
	},
	getters: {
		//* Indication token expired
		isLoggedIn(state) {
			if (state.token === null) {
				return false;
			} else {
				const decoded = jwt_decode(state.token);
				const dateEXP = moment(new Date(decoded.exp * 1000)).format("DD MM YYYY k:mm:ss");
				const dateNOW = moment().format("DD MM YYYY k:mm:ss");
				console.log();
				return dateEXP > dateNOW;
			}
		},
	},
	actions: {
		updateInfo(context) {
			context.commit("setInfo");
		},
	},

	//TODO si inNotExpired=false
	//TODO => annuler token et userID
	//TODO => Afficher un message sur page '/' : Votre session a expiré.
});
