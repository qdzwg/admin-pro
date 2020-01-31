
const stockManage = {
  state: {
    stockListparams: {}, // 路由跳转库存列表页面参数
    adminDetailId: ''
  },
  getters: {
  },
  mutations: {
    setStockListparams(state, payload) {
      state.stockListparams = payload;
    },
    setAdminDetailId(state, payload) {
      state.adminDetailId = payload.id;
    }
  },
  actions: {

  }
};
export default stockManage;
