import { createStore } from "vuex";
import moment from "moment";
import jwt_decode from "jwt-decode";

export default createStore({
	state: {
		userId: null,
		token: null,
		isAdmin: 0,
		// infoHome: "",
		// isLoggedIn: false,
		dateEXP: "",
		dateNOW: "",
		value: "",
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
		setLogOut(state) {
			state.isLoggedIn = false;
		},
		setLogIn(state) {
			//! A ne plus utiliser
			if (state.token === null) {
				state.isLoggedIn = false;
			} else {
				state.isLoggedIn = getters.isExpire;
			}
			if (!state.isLoggedIn) {
				state.infoHome = "Votre session a expiré.";
			}
		},
	},

	getters: {
		decoded(state) {
			return jwt_decode(state.token);
		},
		dateExp(state, getters) {
			return moment(new Date(getters.decoded.exp * 1000)).format("DD MM YYYY k:mm:ss");
		},
		dateNow(state) {
			return moment().format("DD MM YYYY k:mm:ss");
		},
		isLife(state, getters) {
			return getters.dateExp > getters.dateNow;
		},
		isLoggedIn(state, getters) {
			if (state.token === null) {
				return false;
			} else {
				return getters.dateExp > getters.dateNow;
			}
		},
		infoHome(state, getters) {
			if (getters.isLife) {
				return "";
			} else {
				return "Votre session a expiré.";
			}
		},
	},
	actions: {
		updateInfo(context) {
			context.commit("setInfo");
		},
	},
});
