// import { tokenAxios, loginAxios, roleMenuAxios } from 'api/login.js';
// import router from '@/router';
import {
  getLineListAxios,
  getRuleProductAxios,
  lineDetailAxios,
  timeCarListAxios,
  timeStationListAxios,
  distTypeListAxios,
  styleAndNumberAxios,
  allCarManAxios } from '@/components/product/smallTrafficMgt/apis/xjt_line.js'
// import { styleAndNumberAxios, allCarManAxios } from 'api/car.js'
import { Message } from 'iview'
const lineManage = {
  namespaced: true,
  state: {
    ruleShow: false, // 规则查看
    carLineFlag: false, // 线路管理页面标识，true新增或false修改
    lineIsLoading: false, // 默认不加载；用于修改时页面loading和watched属性控制
    distInfo: {
      distType: '',
      salePolicy: '',
      distPolicy: '',
    },
    ruleBuy: {
      name: '',
      buyFarthestType: '',
      buyFarthestDay: '',
      earlyBookDay: '',
      isRealnameAuth: '',
      buyFartMinute: '',
      remark: '',
    },
    ruleSold: {
      name: '',
      type: '',
      name: '',
      retreatPeriodType: '',
      isRetreat: '',
      isChCommission: '',
      isChange: '',
      isReCommission: '',
      refundChargeType: '',
      changeChargeType: '',
      remark: '',
      ruleSoldRefundCharges: [],
      ruleSoldChangeCharges: [],
    },
    lineInfo: {
      routeCode: '',
      routeName: '',
      routeType: '01',
      distType: '',
      runBeginTime: '',
      runEndTime: '',
      goodDetailIntr: '',
      goodBriefIntr: '',
      distPolicy: '',
      salePolicy: '',
      priceDist: '',
      wapUrl: '',
      linkMobileImg: '',
      // routeIntr: '',
      // orderNotice: '',
      // freeIntr: '',
      // routeMileage: 1,
      id: '',
      // wapImg: '',
      // wapCarouselImg: '',
      // pcImg: '',
      // pcCarouselImg: ''
    }, // 新增或修改线路信息
    lineTimeList: {
      show: [{
        busNo: '',
        driveBeginTime: '',
        flag: 0
      }],
      hide: []
    }, // 某线路下时刻信息
    distList: [], // 分销渠道枚举
    siteList: { show: [], hide: [] }, // 线路下站点
    lineList: [], // 线路列表信息
    styleNumberList: [], // 车型车牌列表
    carManTime: {
      showCarManList: [] // 司机排班表
    },
    busScheduleVos: { hide: [] }, // [] // 站点时刻表 {}//
    stockListparams: {} // 路由跳转库存列表页面参数
  },
  getters: {
    getShowTimeList (state) {
      let list = state.lineTimeList.show
      let data = []
      list.forEach(item => {
        if (item.driveBeginTime) {
          data.push(item)
        }
      })
      return data
    },
    getHideTimeList (state) {
      return state.lineTimeList.hide
    }
  },
  mutations: {
    setRuleShow (state, ruleShow) {
      state.ruleShow = ruleShow
    },
    setLineList (state, payload) {
      state.lineList = payload.lineList
    },
    setStyleNumber (state, payload) {
      state.styleNumberList = payload.styleNumberList
    },
    setAllManList (state, payload) {
      state.allManList = payload.allManList
    },
    setCarLineFlag (state, payload) {
      state.carLineFlag = payload.flag
    },
    setLineIsLoading (state, payload) {
      state.lineIsLoading = payload.flag
    },
    setLineDetail (state, payload) {
      state.lineInfo = payload.lineInfo
    },
    setRuleBuy (state, payload) {
      state.ruleBuy = payload.lineInfo
    },
    setRuleSold (state, payload) {
      state.ruleSold = payload.lineInfo
    },
    setRuleInfo (state, payload) {
      state.ruleBuy = payload.ruleInfo.ruleBuy
      state.ruleSold = payload.ruleInfo.ruleSold
    },
    setLineInfo (state, payload) {
      state.lineInfo = payload.lineInfo
    },
    setSiteList (state, payload) {
      let show = payload.show ? payload.show : []
      let hide = payload.hide ? payload.hide : []
      state.siteList = { show, hide }
    },
    setLineTimeList (state, payload) {
      let show = payload.show ? payload.show : state.lineTimeList.show
      let hide = payload.hide ? payload.hide : state.lineTimeList.hide
      state.lineTimeList = { show, hide }
    },
    setCarManTime (state, payload) {
      state.carManTime.showCarManList = payload.carManTimeList
    },
    setBusScheduleVos (state, payload) {
      state.busScheduleVos = payload.sitTimeList
      state.busScheduleVos.hide = state.busScheduleVos.hide ? state.busScheduleVos.hide : []
    },
    setStockListparams (state, payload) {
      state.stockListparams = payload
    },
    setDistTypeList (state, payload) {
      state.distList = payload
    }
  },
  actions: {
    getRuleInfo ({ commit }) {
      getRuleProductAxios().then(res => {
        if (res.status == '200' && res.data.status == 200) {
          commit('setRuleShow', true)
          var {
            name,
            buyFarthestDay,
            buyFarthestType,
            earlyBookDay,
            isRealnameAuth,
            buyFartMinute,
            remark,
          } = res.data.data.ruleBuy;
          commit('setRuleBuy', {lineInfo:{ 
            name,
            buyFarthestDay,
            buyFarthestType,
            earlyBookDay,
            isRealnameAuth,
            buyFartMinute,
            remark,
           }});
          var {
            name,
            type,
            name,
            retreatPeriodType,
            isRetreat,
            isChCommission,
            isChange,
            isReCommission,
            refundChargeType,
            changeChargeType,
            remark,
            ruleSoldRefundCharges,
            ruleSoldChangeCharges,
          } = res.data.data.ruleSold;
          commit('setRuleSold', {lineInfo:{ 
            name,
            type,
            name,
            retreatPeriodType,
            isRetreat,
            isChCommission,
            isChange,
            isReCommission,
            refundChargeType,
            changeChargeType,
            remark,
            ruleSoldRefundCharges,
            ruleSoldChangeCharges,
           }})
        } else {
          Message.warning(res.message ? res.message : res.data.message)
        }
      })
    },
    getLineAction ({ commit }) {
      getLineListAxios().then(res => {
        if (res.status == '200' && res.data.status == 200) {
          commit('setLineList', { lineList: res.data.data })
        }
      })
    },
    getStyleAndNumber ({ commit }) {
      // styleAndNumberAxios().then(res => {
      //   if (res.status == 200) {
      //     commit('setStyleNumber', { styleNumberList: res.data })
      //   }
      // })
      // allCarManAxios().then(res => {
      //   if (res.status == 200) {
      //     commit('setAllManList', { allManList: res.data })
      //   }
      // })
    },
    async getCarManList ({ commit, state }, payLoad) {
      // let params = {
      //   routeId: payLoad.id
      // };
      // let busInfoList = await getBusInfoListAxios(params);
      // if (busInfoList.success && busInfoList.status == 200) {
      //   commit('setLineTimeList', { show: busInfoList.data, hide: [] });
      let list = state.lineTimeList.show
      let request1 = []
      let busCarTime = []
      list.forEach(item => {
        let param = {
          routeId: payLoad.id,
          trainNumberId: item.id
        }
        request1.push(timeCarListAxios(param))
      })
      let busCarList = await Promise.all(request1)
      busCarList.forEach(item => {
        if (item.status == 200 && item.success) {
          busCarTime = busCarTime.concat(item.data)
        }
      })
      let styleList = state.styleNumberList
      busCarTime.forEach(item => {
        let list = styleList.filter(style => {
          return style.id == item.busTypeId
        })
        item.carNumberList = list.length ? list[0].singleCarList : []
      })
      commit('setCarManTime', { carManTimeList: busCarTime })
      // }
    },
    async getBusInfoList ({ commit, state }, payLoad) {
      commit('setLineIsLoading', { flag: true })
      let list = state.lineTimeList.show
      let request1 = []
      let request2 = []
      let busCarTime = []
      let busScheduleVos = {}
      list.forEach(item => {
        let param = {
          routeId: payLoad.id,
          trainNumberId: item.id
        }
        request1.push(timeCarListAxios(param))
        request2.push(timeStationListAxios(param))
      })

      let busCarList = await Promise.all(request1)
      busCarList.forEach(item => {
        if (item.status == 200 && item.success) {
          busCarTime = busCarTime.concat(item.data)
        }
      })
      let styleList = state.styleNumberList
      busCarTime.forEach(item => {
        let list = styleList.filter(style => {
          return style.id == item.busTypeId
        })
        item.carNumberList = list.length ? list[0].singleCarList : []
      })

      let sitTimeList = await Promise.all(request2)
      sitTimeList.forEach(item => {
        if (item.status == 200 && item.success) {
          let data = item.data
          if (data.length) {
            busScheduleVos[data[0].driveBeginTime] = data
          }
          // busScheduleVos = busScheduleVos.concat(item.data);
        }
      })
      commit('setCarManTime', { carManTimeList: busCarTime })
      commit('setBusScheduleVos', { sitTimeList: busScheduleVos })
      commit('setLineIsLoading', { flag: false })
    },
    // 获取线路信息
    getLineDetail ({ commit, dispatch }, payload) {
      let { id, routeCode, routeName,
        routeType,
        routeMileage,
        distType,
        runBeginTime,
        runEndTime,
        goodDetailIntr,
        distPolicy,
        salePolicy,
        goodBriefIntr,
        priceDist,
        wapUrl,
        linkMobileImg} = payload
      routeMileage = routeMileage * 1
      priceDist = priceDist?String(priceDist):''
      distTypeListAxios().then(res => {
        if (res.status == 200) {
          commit('setDistTypeList', res.data.data)
        }
      })
      commit('setLineDetail', { lineInfo: {
        oldDistType: distType,
        id,
        routeCode,
        routeName,
        routeType,
        distType,
        runBeginTime,
        runEndTime,
        goodDetailIntr,
        distPolicy,
        salePolicy,
        goodBriefIntr,
        priceDist,
        wapUrl,
        linkMobileImg,
      } })
      let arr = [];
      for (const key in payload.trafficShiftTime) {
        if (payload.trafficShiftTime.hasOwnProperty(key)) {
          const element = payload.trafficShiftTime[key];
          element.forEach(item=>{
            item.driveBeginTime = key;
          })
          arr.push({driveBeginTime: key});
        }
      }
      commit('setSiteList', { show: payload.trafficSiteInfos, hide: [] })
      commit('setLineTimeList', { show: arr, hide: [] })
      commit('setBusScheduleVos', { sitTimeList: payload.trafficShiftTime, hide: []})
    },
    initLine ({ commit }, payload) {
      commit('setLineDetail', {
        lineInfo: {
          routeCode: '',
          routeName: '',
          routeType: '01',
          distType: '',
          runBeginTime: '',
          runEndTime: '',
          goodDetailIntr: '',
          goodBriefIntr: '',
          distPolicy: '',
          salePolicy: '',
          priceDist: '',
          wapUrl: '',
          linkMobileImg: '',
        }
      })
      commit('setLineTimeList', {
        show: [{
          busNo: '',
          driveBeginTime: '',
          flag: 0
        }],
        hide: []
      })
      commit('setSiteList', {
        show: [], hide: []
      })
      // commit('setCarManTime', { carManTimeList: [] })
      commit('setBusScheduleVos', { sitTimeList: {} })
    }
    // // 获取线路下站点信息
    // getLineSiteList() {

    // }
  }
}
export default lineManage
