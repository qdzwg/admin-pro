/**跟团游差异化文件
 * 
 */
import {
    apiGet
  } from '@/fetch/api';
  const Group = {
    namespaced: true,
    state: {
      diffInfo: {},
      diffValue: {}
    },
    getters: {
      
      songBegAddress(state) {
        return state.diffInfo.begAddress    //出发地
      },
      songDistPolicy(state) {
        return state.diffInfo.distPolicy    //分销政策
      },
      songDistShowPrice(state) {
        return state.diffInfo.distShowPrice    //分销展示价
      },
      songEmail(state) {
        return state.diffInfo.email    //订单通知(用于接收下单提示邮箱)
      },
      songExtendParamFive(state) {
        return state.diffInfo.extendParamFive    //购票限制(1：无，2：身份证限制，3：手机号限制)
      },
      songExtendParamFour(state) {
        return state.diffInfo.extendParamFour    //出游人证件(1：全填，2：选填)
      },
      songExtendParamOne(state) {
        return state.diffInfo.extendParamOne    //目的地编码
      },
      songExtendParamSix(state) {
        return state.diffInfo.extendParamSix    //限制内容
      },
      songExtendParamThree(state) {
        return state.diffInfo.extendParamThree    //售后政策
      },
      songExtendParamTwo(state) {
        return state.diffInfo.extendParamTwo    //详情页视频
      },
      songLineViceName(state) {
        return state.diffInfo.lineViceName    //跟团游副标题
      },
      songMchId(state) {
        return state.diffInfo.mchId    //商户
      },
      songMerchantParkInfoId(state) {
        return state.diffInfo.merchantParkInfoId    //所属景区
      },
      songMerchatShowPrice(state) {
        return state.diffInfo.merchatShowPrice    //前台展示起价
      },
      songOrderCustomPlugins(state) {
        return state.diffInfo.orderCustomPlugins    //下单自定义组件
      },
      songPeopleConfirm(state) {
        return state.diffInfo.peopleConfirm    //预定人工确认
      },
      songSellType(state) {
        return state.diffInfo.sellType    //分销渠道
      },
      songSoldPolicy(state) {
        return state.diffInfo.soldPolicy    //售后政策
      },
      songTel(state) {
        return state.diffInfo.tel    //订单通知(用于接收下单提示短信)
      },
      songVirtualSell(state) {
        return state.diffInfo.virtualSell    //店铺虚拟销量
      },
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
      getDiffInfo({ state, commit }) {
        return new Promise(async (resolve) => {
          let info = await apiGet('/admin/api/sysParam/getSysParamJsonByKey', {
            key: 'routeInfoPageId'
          })
          if (info.status == '200') {
            commit('setDiffInfo', info.data)
          }
          resolve()
        })
  
      }
    }
  }
  
  export default Group
  