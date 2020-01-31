/**景区差异化文件
 * 
 */
import {
  apiGet
} from '@/fetch/api';
const Scenic = {
  namespaced: true,
  state: {
    diffInfo: {},
    diffValue: {}
  },
  getters: {
    isNameText(state) {
      let {
        name
      } = state.diffInfo
      if (name && name.fieldType == 'text') {
        return true
      }
      return false
    },
    songCityId(state) {
      return state.diffInfo.cityId
    },
    songOrderType(state) {
      return state.diffInfo.orderType
    },
    songAreaAddr(state) {
      return state.diffInfo.areaAddr
    },
    songBelongTo(state) {
      return state.diffInfo.belongTo
    },
    songTralveBase(state) { //旅游主题
      return state.diffInfo.tralveBase
    },
    songExtendsParam4(state) { //旅游主题
      return state.diffInfo.extendsParam4
    },
    songChannel(state) {
      return state.diffInfo.channel
    },
    songIsSyncYpw(state) {
      return state.diffInfo.isSyncYpw
    },
    songOneCode(state) {
      return state.diffInfo.oneCode
    },
    songSummary(state) { //景点描述
      return state.diffInfo.summary
    },
    songExtendsParam2(state) { //售后政策
      return state.diffInfo.extendsParam2
    },
    songExtendsParam3(state) { //详情页视频
      return state.diffInfo.extendsParam3
    },
    songDistType(state) {
      return state.diffInfo.distType
    },
    songNickName(state) {
      return state.diffInfo.nickName
    },
    songSubTitle(state) { //经典副标题
      return state.diffInfo.subTitle
    },
    songPriceShow(state) { //店铺展示价
      return state.diffInfo.priceShow
    },
    songVirtualSale(state) { //店铺虚拟销量
      return state.diffInfo.virtualSale
    },
    songPriceDist(state) { //分销商展示价
      return state.diffInfo.priceDist
    },
    songDistPolicy(state) { //分销政策
      return state.diffInfo.distPolicy
    },
    songDistAreaType(state) {
      return state.diffInfo.distAreaType
    },
    songOrderNotice(state) {
      return state.diffInfo.orderNotice
    }
  },
  mutations: {
    setDiffInfo(state, payLoad) {
      state.diffInfo = payLoad
      let diffValue = state.diffValue
      Object.keys(payLoad).forEach(key => {
        diffValue[key] = payLoad[key].defaultValue
      })
    },
  },
  actions: {
    getDiffInfo({
      state,
      commit
    }) {
      return new Promise(async (resolve) => {
        let info = await apiGet('/admin/api/sysParam/getSysParamJsonByKey', {
          key: 'park_info_id'
        })
        if (info.status == '200') {
          commit('setDiffInfo', info.data)
        }
        resolve()
      })

    }
  }
}

export default Scenic
