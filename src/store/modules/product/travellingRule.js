/**景区差异化文件
 * 
 */
import {
  apiGet
} from '@/fetch/api';
const TravellingRule = {
  namespaced: true,
  state: {
    diffInfo: {},
    paramsBase: { //参数基础数据
      id: '',
      name: '',
      sellType: 2,
      ticketType: [], //小鲸票行
      routeTicketVos: [],
      ticketPriceJsonAduit: [{
        weeks: "1,2,3,4,5,6,0",
        beginDate: '',
        endDate: '',
        costPrice: 0,
        showPrice: 0,
        retailPrice: 0,
        supplyPrice: 0,
        minRetailPrice: 0,
        maxRetailPrice: 0,
        ticketType: '',

      }], //小鲸成人price
      ticketPriceJsonChild: [{
        weeks: "1,2,3,4,5,6,0",
        beginDate: '',
        endDate: '',
        costPrice: 0,
        showPrice: 0,
        retailPrice: 0,
        supplyPrice: 0,
        minRetailPrice: 0,
        maxRetailPrice: 0,
        ticketType: '',

      }], //小鲸儿童price
      //其他规则
      isEarlyBook: "F", //提前预定限制
      earlyBookDay: "", //提前预订天数
      isOrderDate: "F", //  预订日期限制
      orderBegDay: "", //允许开始下单日期
      orderEndDay: "", //允许结束下单日期
      isLimitNum: "F", //是否限制数量
      minOrder: "", //最小购买数量限制
      maxOrder: "", //最大购买数量限制
      checkType: "0", //过期检票操作
      refundAfterDay: "", //过期X天完结 退款
      checkRelativeDay: "", //过期X天完结 检票
      isRetreat: "T", //是否可退.'F'不可退.'T'可退
      isRetreatAudit: "F", //退单是否要审核
      isBeforeRetreat: "T", //游玩日前是否可退
      refundBeforeDay: "", //游玩日前退票提前天数
      refundBeforeTime: "", //游玩日前退票截止时间
      refundBeforeVal: "", //游玩日前退票手续费
      isTodayRetreat: "T", //游玩日当天是否可退
      refundTodayTime: "", //游玩日当天退票截止时间
      refundTodayVal: "", //游玩日当天退票费用
      isAfterRetreat: "T", //游玩日后是否可退
      refundAfterDayIn: "", //游玩日后退票天数
      refundAfterTime: "", //游玩日后退票截止时间
      refundAfterVal: "", //游玩日后退票费用,
      isLimitBuy: 0,
      isLimitBuyDay: 0,
      isLimitBuyDayAmount: 0,
      isLimitBuyDayOrder: 0,
      certificateWay: 0,
      earlyBookHour: ''
    },
    initParams: {},
  },
  getters: {
    getBaseRule({
      initParams
    }) {
      let {
        id = '',
          name,
          sellType = 2,
          ticketType = [], //小鲸票行
          routeTicketVos = [],
          ticketPriceJsonAduit = [], //小鲸成人price
          ticketPriceJsonChild = [], //小鲸儿童//小鲸儿童price

      } = initParams
      return {
        id,
        name,
        sellType,
        ticketType,
        routeTicketVos,
        ticketPriceJsonAduit,
        ticketPriceJsonChild
      }
    },
    getOtherRule({
      initParams
    }) {
      let {
        isEarlyBook = "F", //提前预定限制
          earlyBookDay = "", //提前预订天数
          isOrderDate = "F", //  预订日期限制
          orderBegDay = "", //允许开始下单日期
          orderEndDay = "", //允许结束下单日期
          isLimitNum = "F", //是否限制数量
          minOrder = "", //最小购买数量限制
          maxOrder = "", //最大购买数量限制
          checkType = "0", //过期检票操作
          refundAfterDay = "", //过期X天完结 退款
          checkRelativeDay = "", //过期X天完结 检票
          isRetreat = "T", //是否可退.'F'不可退.'T'可退
          isRetreatAudit = "F", //退单是否要审核
          isBeforeRetreat = "T", //游玩日前是否可退
          refundBeforeDay = "", //游玩日前退票提前天数
          refundBeforeTime = "", //游玩日前退票截止时间
          refundBeforeVal = "", //游玩日前退票手续费
          isTodayRetreat = "T", //游玩日当天是否可退
          refundTodayTime = "", //游玩日当天退票截止时间
          refundTodayVal = "", //游玩日当天退票费用
          isAfterRetreat = "T", //游玩日后是否可退
          refundAfterDayIn = "", //游玩日后退票天数
          refundAfterTime = "", //游玩日后退票截止时间
          refundAfterVal = "", //游玩日后退票费用,
          isLimitBuy = 0,
          isLimitBuyDay = 0,
          isLimitBuyDayAmount = 0,
          isLimitBuyDayOrder = 0,
          certificateWay = 0,
          earlyBookHour = ''
      } = initParams
      isLimitBuy = !isLimitBuy ? 0 : parseFloat(isLimitBuy)
      certificateWay = !certificateWay ? 0 : parseFloat(certificateWay)
      return {
        isEarlyBook,
        earlyBookDay,
        isOrderDate,
        orderBegDay,
        orderEndDay,
        isLimitNum,
        minOrder,
        maxOrder,
        checkType,
        refundAfterDay,
        checkRelativeDay,
        isRetreat,
        isRetreatAudit,
        isBeforeRetreat,
        refundBeforeDay,
        refundBeforeTime,
        refundBeforeVal,
        isTodayRetreat,
        refundTodayTime,
        refundTodayVal,
        isAfterRetreat,
        refundAfterDayIn,
        refundAfterTime,
        refundAfterVal,
        isLimitBuy,
        isLimitBuyDay,
        isLimitBuyDayAmount,
        isLimitBuyDayOrder,
        certificateWay,
        earlyBookHour
      }
    },
    isSongcheng(state) {
      if (state.diffInfo && state.diffInfo.projectName) {
        return state.diffInfo.projectName.defaultValue == 'scxcx'
      } else {
        return false
      }
    },
    s_checkType(state) {
      return state.diffInfo.checkType
    },
    s_isLimitBuy(state) {
      return state.diffInfo.isLimitBuy
    },
    s_isLimitBuyDayAmount(state) {
      return state.diffInfo.isLimitBuyDayAmount
    },
    s_isLimitBuyDayOrder(state) {
      return state.diffInfo.isLimitBuyDayOrder
    },
    s_ticketType(state) {
      return state.diffInfo.ticketType
    },
    s_certificateWay(state) {
      return state.diffInfo.certificateWay
    },
    s_earlyBookHour(state) {
      return state.diffInfo.earlyBookHour
    },
    s_isLimitBuyDay(state) {
      return state.diffInfo.isLimitBuyDay
    }
  },
  mutations: {},
  actions: {
    getDiffInfo({
      state,
      commit
    }, id) {
      let configInfo = apiGet("/admin/api/sysParam/getSysParamJsonByKey", {
        key: "routeLinePageId"
      });
      let diffValue = {};
      let initData = [];
      return new Promise(async (resolve, reject) => {
        try {
          if (!id) {
            let initPageInfo = apiGet(`/product/api/routePush/publishRoute?${new Date()}`);
            let res = await Promise.all([configInfo, initPageInfo])
            let data1 = res[0]
            let data2 = res[1]
            if (data1.status == 200) {
              let info = data1.data
              Object.keys(info).forEach(key => {
                diffValue[key] = info[key].defaultValue ? info[key].defaultValue : '';
              });
              state.diffInfo = info;
              state.diffValue = diffValue
            }
            if (data2.status == 200) {
              initData = data2.data
            }
            state.initParams = {
              ...state.paramsBase,
              ...diffValue,
              ...initData
            };
            resolve()
          } else {
            let data1 = await apiGet("/admin/api/sysParam/getSysParamJsonByKey", {
              key: "routeLinePageId"
            });
            let isSongcheng = false
            if (data1.status == 200) {
              let info = data1.data
              Object.keys(info).forEach(key => {
                diffValue[key] = info[key].defaultValue;
              });
              state.diffInfo = info;
              state.diffValue = diffValue
              isSongcheng = info.projectName.defaultValue == 'scxcx'
            }

            let param = {
              routeId: id,
            }
            if (isSongcheng) {
              param.businessFlag = 'scxcx'
            }
            let data2 = await apiGet("/product/api/routeProduct/editRouteLine", param);

            if (data2.status == 200) {
              initData = data2.data
            }
            state.initParams = {
              ...state.paramsBase,
              ...diffValue,
              ...initData,
              name: initData.routeName
            };
            resolve()
          }
        } catch (err) {
          reject(err)
        }

      })
    }
  }
}
export default TravellingRule
