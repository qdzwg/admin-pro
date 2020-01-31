import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import lineManage from './modules/xjt_line.js'
import stock from './modules/xjt_stock.js'
import user from './modules/user'
import list from './modules/list'
import menu from './modules/menu'
import scenic from './modules/product/scenic'
import ticket from './modules/product/ticket'
import travelling from './modules/product/travelling'
import travellingRule from './modules/product/travellingRule'
import recommend from './modules/product/recommend'
import indexdefined from './modules/indexdefined'
import pageTitle from './modules/pageTitle'
import baseInfoConfig from './modules/baseInfoConfig'
import coupons from './modules/coupons'
import couponList from './modules/couponList'

// 自定义页面
import defined from './modules/userDefined'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [createPersistedState({
    reducer(val) {
      return {
        lineManage: lineManage.state
      }
    }
  })],
  state: {
    count: 0,
    activeName: 'user',
    subMenuList: [],
    userId: '',
    showLoadding: '',
    loading: false
  },
  mutations: {
    // setEditIndex (state, editIndex) {
    //   state.editIndex = editIndex
    // },
    add(state, n) {
      state.count += n
    },
    reduce(state) {
      state.count--
    },
    setActiveName(state, name) {
      state.activeName = name
    },
    setUserId(state, id) {
      state.userId = id
    },
    setLoading(state, flag) {
      state.showLoadding = flag
    },
    showLoading(state) {
      state.loading = true
    },
    hideLoading(state) {
      state.loading = false
    }
  },
  getters: {
    count(state) {
      state.count += 100
      return state.count
    }
  },
  actions: {
    addAction(context) {
      context.commit('add', 10)
      setTimeout(() => {
        context.commit('reduce')
      }, 3000)
      console.log('我比reduce提前执行')
    },
    reduceAction({
      commit
    }) {
      commit('reduce')
    },
    getGrid(context) {

    },
    setUserIdAction({
      commit
    }, id) {
      commit('setUserId', id)
    },
    setLoadingAction({
      commit
    }, flag) {
      // console.log(flag)
      commit('setLoading', flag)
    }
  },
  modules: {
    user,
    list,
    menu,
    indexdefined,
    defined,
    pageTitle,
    baseInfoConfig,
    lineManage,
    scenic,
    ticket,
    travelling,
    travellingRule,
    coupons,
    couponList,
    recommend
    // stock
  }
})

export default store
