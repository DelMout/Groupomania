import { createStore } from "vuex";

export default createStore({
	state: {
		currentUserId: 0,
		user: null,
		token: null,
	},
	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setToken(state, token) {
			state.token = token;
		},
	},
	getters: {
		isLoggedIn(state) {
			return !!state.token;
		},
	},
});
