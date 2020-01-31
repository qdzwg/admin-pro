import {
  apiGet
} from '../../fetch/api'
const pageTitle = {
  state: {
    title: ''
  },
  getters: {

  },
  mutations: {
    setTitle (state, title) {
      state.title = title
    }
  },
  actions: {
    async getTitle (context) {
      let res = await apiGet('/merchant/merchantInfo/getMerchantInfo')
      // context.state.activeName = menuList.data[0].funCode
      // context.state.menuList = menuList
      if (res.status === 200) {
        context.state.title = res.data.name
      }
    }
  }
}

export default pageTitle
