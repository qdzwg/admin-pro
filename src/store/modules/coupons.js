/**优惠券新增差异化文件
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
      
      songApplyType(state) {
        return state.diffInfo.applyType    //可使用产品类型(all,type,used,unused,selleruse(优惠券商户可用产品))
      },
      songCouponType(state) {
        return state.diffInfo.couponType    //优惠券类型0:抵用券,1:兑换券
      },
      songDistributionPath(state) {
        return state.diffInfo.distributionPath    //发放路径 0:产品详情页,1:购物车,2:小程序开屏页,3:支付完成送券
      },
      songMerchantIds(state) {
        return state.diffInfo.merchantIds    //可用商户id
      },
      songOrderMaxUse(state) {
        return state.diffInfo.orderMaxUse    //每笔订单最多可使用数量
      },
      songOrderParkId(state) {
        return state.diffInfo.parkId    //归属景区ID
      },
      songPrefixDateLimit(state) {
        return state.diffInfo.prefixDateLimit    //限领前置日期条件daily:每天
      },
      songProductCodes(state) {
        return state.diffInfo.productCodes    //可用产品编码
      },
      songReceiveAgain(state) {
        return state.diffInfo.receiveAgain    //已领的券核销完后是否可再次领取T:是,F:否
      },
      songUsableRange(state) {
        return state.diffInfo.usableRange    //可用范围 0:线上,1:线下
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
            key: 'market_coupon_update'
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
  