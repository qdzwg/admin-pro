/**优惠券列表差异化文件
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
      
      songCouponCode(state) {
        return state.diffInfo.couponCode    //券编码
      },
      songCouponType(state) {
        return state.diffInfo.couponType    //券编码
      },
      songCouponTypeSearch(state) {
        return state.diffInfo.couponTypeSearch    //券编码
      },
      songCreateBeginTime(state) {
        return state.diffInfo.createBeginTime    //券编码
      },
      songCreateEndTime(state) {
        return state.diffInfo.createEndTime    //券编码
      },
      songModifyBeginTime(state) {
        return state.diffInfo.modifyBeginTime    //券编码
      },
      songModifyEndTime(state) {
        return state.diffInfo.modifyEndTime    //券编码
      },
      songParkId(state) {
        return state.diffInfo.parkId    //券编码
      },
      songParkName(state) {
        return state.diffInfo.parkName    //券编码
      },
      songParkcode(state) {
        return state.diffInfo.parkcode    //券编码
      },
      songPrefixDateLimit(state) {
        return state.diffInfo.prefixDateLimit    //券编码
      },
      songCode(state) {
        return state.diffInfo.code    //券编码
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
      getDiffInfo({ state, commit }) {
        return new Promise(async (resolve) => {
          let info = await apiGet('/admin/api/sysParam/getSysParamJsonByKey', {
            key: 'market_coupon_list'
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
  