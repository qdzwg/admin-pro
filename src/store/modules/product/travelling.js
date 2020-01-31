/**景区差异化文件
 * 
 */
import {
  apiGet
} from '@/fetch/api';
const Travelling = {
  namespaced: true,
  state: {
    showTableSelection: [],
    diffInfo: {},
    diffValue: {},
    paramsBase: { //参数基础数据
      // 基本信息
      productCode: '',
      name: "", // 酒店名称
      begAddress: "", // 出发地
      endAddress: "", // 目的地
      lineTheme: "", // 主题
      useDay: "", // 用时几天
      useNight: "", // 用时几夜
      extendParamOne: '', //目的地编码
      //跟团游信息
      lineDescription: "", // 线路描述
      lineNotes: "<p>【报名方式】</p><p></p><p>【集合地点】</p><p></p><p>【变更说明】</p><p></p><p>【发票说明】</p><p></p><p>【退改说明】</p><p></p><p>【温馨提示】</p><p></p><p>【联系电话】</p>", // 线路须知
      lineArrange: "<p>【产品特色】</p><p></p><p>【行程安排】</p><p></p><p>第一天/出发地-目的地：</p><p></p><p>第二天/出发地-目的地：</p><p></p>", // 线路安排
      costDescription: "<p>【费用包含】</p><p></p><p>景点：</p><p></p><p>住宿：</p><p></p><p>用餐：</p><p></p><p>交通：</p><p></p><p>保险：</p><p></p><p>服务：</p><p></p><p>【费用不包含】</p><p></p><p>【自费项目】</p><p></p><p>【购物说明】</p><p></p>", // 费用说明
      linkMobileImg: "", // 主图地址
      linkBreviaryImg: "", // 缩略图地址
      extendParamTwo: '',
      cityId: '',
      extendParamThree: '',
      // 分销设置
      sellType: 0, // 渠道
      lineAlias: "", // 线路别名
      lineViceName: "", // 线路副标题
      merchatShowPrice: "", // 店铺展示起价
      virtualSell: "", // 店铺虚拟销量
      distShowPrice: "", // 分销展示价
      distPolicy: "", // 分销政策
      soldPolicy: "", // 售后政策
      enabled: "",
      orderCustomPlugins: [], // 留言字段
      peopleConfirm: "F",
      peopleConfirmTime: "",
      tel: "",
      email: ""
    },
    initParams: {},
  },
  getters: {
    getBaseInfo({
      initParams
    }) {
      let {
        productCode = '',
          name = "", // 酒店名称
          begAddress = "", // 出发地
          endAddress = "", // 目的地
          lineTheme = "", // 主题
          useDay = "", // 用时几天
          useNight = "", // 用时几夜
          mchId = '',
          extendParamOne,
          lineAlias,
          cityId
      } = initParams;
      return {
        name,
        begAddress,
        endAddress,
        lineTheme,
        useDay,
        useNight,
        mchId,
        extendParamOne,
        lineAlias,
        cityId,
        productCode
      };
    },
    getTravellIngInfo({
      initParams
    }) {
      let {
        lineDescription = "", // 线路描述
          lineNotes = "<p>【报名方式】</p><p></p><p>【集合地点】</p><p></p><p>【变更说明】</p><p></p><p>【发票说明】</p><p></p><p>【退改说明】</p><p></p><p>【温馨提示】</p><p></p><p>【联系电话】</p>", // 线路须知
          lineArrange = "<p>【产品特色】</p><p></p><p>【行程安排】</p><p></p><p>第一天/出发地-目的地：</p><p></p><p>第二天/出发地-目的地：</p><p></p>", // 线路安排
          costDescription = "<p>【费用包含】</p><p></p><p>景点：</p><p></p><p>住宿：</p><p></p><p>用餐：</p><p></p><p>交通：</p><p></p><p>保险：</p><p></p><p>服务：</p><p></p><p>【费用不包含】</p><p></p><p>【自费项目】</p><p></p><p>【购物说明】</p><p></p>", // 费用说明
          linkMobileImg = "", // 主图地址
          linkBreviaryImg = "", // 缩略图地址
          extendParamTwo = '',
          merchatShowPrice,
          soldPolicy,
          extendParamThree,
          peopleConfirm = 'F',
          peopleConfirmTime = "",
          tel = "",
          email = ""
      } = initParams;
      return {
        lineDescription,
        lineNotes,
        lineArrange,
        costDescription,
        linkMobileImg,
        linkBreviaryImg,
        extendParamTwo,
        merchatShowPrice,
        soldPolicy,
        extendParamThree,
        peopleConfirm,
        peopleConfirmTime,
        tel,
        email
      };
    },
    getSalesInfo({
      initParams
    }) {
      let {
        sellType = 0, // 渠道
          lineAlias = "", // 线路别名
          lineViceName = "", // 线路副标题
          merchatShowPrice = "", // 店铺展示起价
          virtualSell = "", // 店铺虚拟销量
          distShowPrice = "", // 分销展示价
          distPolicy = "", // 分销政策
          soldPolicy = "", // 售后政策
          enabled = "",
          orderCustomPlugins = [], // 留言字段
          peopleConfirm = "F",
          peopleConfirmTime = "",
          tel = "",
          email = ""
      } = initParams;
      sellType = parseFloat(sellType)
      return {
        sellType,
        lineAlias,
        lineViceName,
        merchatShowPrice,
        virtualSell,
        distShowPrice,
        distPolicy,
        soldPolicy,
        enabled,
        orderCustomPlugins,
        peopleConfirm,
        peopleConfirmTime,
        tel,
        email
      };
    },
    isSongcheng(state) {
      if (state.diffInfo && state.diffInfo.projectName) {
        return state.diffInfo.projectName.defaultValue == 'scxcx'
      } else {
        return false
      }
    },
    s_projectName(state) {
      return state.diffInfo.projectName
    },

    s_extendParamTwo(state) { //视频
      return state.diffInfo.extendParamTwo
    },
    s_peopleConfirm(state) {
      return state.diffInfo.peopleConfirm
    },
    s_mchId(state) {
      return state.diffInfo.mchId
    },
    s_cityId(state) {
      return state.diffInfo.cityId
    },
    s_merchantParkInfoId(state) {
      return state.diffInfo.merchantParkInfoId
    },
    s_extendParamOne(state) {
      return state.diffInfo.extendParamOne
    },
    s_soldPolicy(state) {
      return state.diffInfo.soldPolicy
    },
    s_sellType(state) {
      return state.diffInfo.sellType
    },
    s_lineViceName(state) {
      return state.diffInfo.lineViceName
    },
    s_begAddress(state) {
      return state.diffInfo.begAddress
    },
    s_distPolicy(state) {
      return state.diffInfo.distPolicy
    },
    s_tel(state) {
      return state.diffInfo.tel
    },
    s_merchatShowPrice(state) {
      return state.diffInfo.merchatShowPrice
    },
    s_distShowPrice(state) {
      return state.diffInfo.distShowPrice
    },

    s_extendParamThree(state) {
      return state.diffInfo.extendParamThree
    },
    s_virtualSell(state) {
      return state.diffInfo.virtualSell
    },
    s_orderCustomPlugins(state) {
      return state.diffInfo.orderCustomPlugins
    },
    s_email(state) {
      return state.diffInfo.orderCustomPlugins
    }

  },
  mutations: {
    setTableSelection(state, payload) {
      state.showTableSelection = payload
    }
  },
  actions: {
    getDiffInfo({
      state,
      commit,
      dispatch
    }, id) {
      let configInfo = apiGet("/admin/api/sysParam/getSysParamJsonByKey", {
        key: "routeInfoPageId"
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
              initData.orderCustomPlugins = initData.orderCustomPlugins ? JSON.parse(initData.orderCustomPlugins) : {}
            }
            state.initParams = {
              ...state.paramsBase,
              ...diffValue,
              ...initData
            };
            resolve()
          } else {
            let initPageInfo = apiGet("/product/api/routeProduct/editRouteInfo", {
              routeId: id
            });
            Promise.all([configInfo, initPageInfo]).then(res => {
              let data1 = res[0]
              let data2 = res[1]
              if (data1.status == 200) {
                let info = data1.data
                Object.keys(info).forEach(key => {
                  diffValue[key] = info[key].defaultValue;
                });
                state.diffInfo = info;
                state.diffValue = diffValue
              }
              if (data2.status == 200) {
                initData = data2.data
                initData.orderCustomPlugins = initData.orderCustomPlugins ? JSON.parse(initData.orderCustomPlugins) : {}
              }
              state.initParams = {
                ...state.paramsBase,
                ...diffValue,
                ...initData
              };
              resolve()
            })
          }
        } catch (err) {
          reject(err)
        }

      })
    }
  }
}
export default Travelling
