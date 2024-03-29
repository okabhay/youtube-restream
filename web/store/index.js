import axios from 'axios';

export const state = () => ({
  user: {
    role: "user"
  },
  setting: {},
  isAuthenticated: false,
  token: null,
})

export const getters = {
  user: (state) => state.user,
  isAuthenticated: (state) => state.isAuthenticated,
  token: (state)=> state.token,
  setting: (state)=> state.setting,
}

export const mutations = {
  setUser(state, param) {
    state.isAuthenticated = true;
    state.user = param.user;
    state.setting = param.setting;
    state.token = param.token;
  },

  logoutUser(state) {
    state.isAuthenticated = false;
    state.user = null;
    state.setting = {};
    this.$cookies.removeAll();
    this.$router.push("/")
  },
}

export const actions = {
  async nuxtServerInit({ commit, getters }, context) {
    const token = this.$cookies.get('token');

    if (token) {
      try {
        const res =  await axios.get(`${this.$config.apiUrl}/user`, {
            headers: {
              'Authorization': `Bearer ${token}` 
            }
        })

        console.log(res.data);

        commit('setUser', {user: res.data.user, setting: res.data.setting, token: token})
      } catch (error) {
        commit('logoutUser')
        console.log(error);
      }
    }
  },

  async loadMe({ commit, state }) {
    try {
        const res =  await axios.get(`${this.$config.apiUrl}/user`, {
            headers: {
                'Authorization': `Bearer ${state.token}` 
            }
        })

        console.log(res.data)

        commit('setUser', {user: res.user, token: state.token})
    } catch (error) {
        console.log(error);
    }
  },
}