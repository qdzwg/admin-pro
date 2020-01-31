import {apiPost} from '../../fetch/api'

const user = {
  state: {
    userName: ''
  },
  getters: {
    setUserName: (state) => (username) => {
      state.userName = username
      return state.userName
    }
  },
  mutations: {
    showUserName (state) {
    }
  },
  actions: {
    login (context, params) {
      return apiPost(params.url, params.params)
    }
  }
}

export default user
