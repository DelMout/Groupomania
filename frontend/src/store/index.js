import { createStore } from "vuex";
import moment from "moment";
import jwt_decode from "jwt-decode";

export default createStore({
	state: {
		userId: null,
		token: null,
		isAdmin: 0,
		logged: false,
		infoHome: "",
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
		IS_TRUE(state) {
			state.logged = true;
		},
		IS_FALSE(state) {
			state.logged = false;
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
	},
	actions: {
		checkConnect(context) {
			if (context.state.token) {
				if (this.getters.dateExp > this.getters.dateNow) {
					context.commit("IS_TRUE");
				} else {
					context.commit("IS_FALSE");
					context.commit("setInfo");
				}
			} else {
				context.commit("IS_FALSE");
			}
		},
	},
});
