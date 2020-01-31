/**景区差异化文件
 *
 */
import {
  apiGet
} from "@/fetch/api";
const Scenic = {
  namespaced: true,
  state: {
    diffInfo: {},
    paramsBase: {
      //参数基础数据
      // 基本信息
      name: '',
      modelName: "", //门票名称
      nickName: "", //别名
      modelCode: '',
      ticketType: 1, //门票类型
      adultNum: 0,
      childNum: 0,
      externalCode: "", //外部编码，原没有
      isSyncYpw: "", //是否推送云票务
      modelExplain: "", //票行说明
      isRealName: "T", //实名制票行,原没有
      enabled: "T", //是否立即上架
      isSpecial: "T", //特殊渠道销售
      sellType: "0", //销售渠道
      bookRemind: "",
      stockModel: "day",
      totalStockNum: 0,
      leftStockNum: 0,
      priceMin: 0,
      priceMax: 0,
      isShowTicketNotice: "T", //购票是否提醒
      ticketNotice: "", //提醒说明
      parkId: "",
      extendsParam1: "0",
      extendsParam2: "T",
      extendsParam3: "",
      extendsParam4: "",
      linkMobileImg: "",
      groupItems: [{
        defaultLabel: "T",
        labelValue: "",
        sortNo: 0
      }], //分组数据
      priceListJson: [{
        weeks: "1,2,3,4,5,6,0",
        startTime: '',
        endTime: '',
        costPrice: 0,
        rackPrice: 0,
        retailPrice: 0,
        supplyPrice: 0,
        stockModel: "day"
      }],

      // 退单数据
      isRetreat: "T",
      isRetreatAudit: "T",
      earlyDay: 1, //提前退
      retreatPeriodType: 0, //退单时间限制
      absoluteDate: "", //绝对时间
      // 预定数据
      buyFarthestType: "any", //可购时间限制
      buyFarthestDay: 1, //可够近几天
      orderBegDay: "", //下单日期限制
      orderEndDay: "",
      dayBegTime: "", //下单时间限制
      dayEndTime: "",
      minOrder: 0, //数量限定
      maxOrder: 0,
      earlyBookDay: 0, //提前天数
      isNeedIdcard: "T", //身份证是否必填
      minAge: 0, //年龄限制
      maxAge: 0,
      sex: "", //性别限定
      isLimitBuy: "1"
    },
    initParams: {}
  },
  getters: {
    getBaseInfo({
      initParams
    }) {

      let {
        name = '',
          modelName = "", //门票名称
          nickName = "", //别名
          ticketType = 1, //门票类型
          adultNum = 0,
          childNum = 0,
          externalCode = "", //外部编码，原没有
          isSyncYpw = "", //是否推送云票务
          modelExplain = "", //票行说明
          isRealName = "T", //实名制票行,原没有
          enabled = "T", //是否立即上架
          isSpecial = "T", //特殊渠道销售
          sellType = "0", //销售渠道
          bookRemind = "",
          stockModel = "day",
          totalStockNum = 0,
          leftStockNum = 0,
          priceMin = 0,
          priceMax = 0,
          isShowTicketNotice = "T", //购票是否提醒
          ticketNotice = "", //提醒说明
          parkId = "",
          extendsParam0,
          extendsParam1 = "0",
          extendsParam2 = "T",
          extendsParam3 = "",
          extendsParam4 = "",
          mchId,
          groupItems,
          priceListJson,
          linkMobileImg = '',
          modelCode
      } = initParams;
      if (!priceListJson || !priceListJson.length) {
        priceListJson = [{
          weeks: "1,2,3,4,5,6,0",
          startTime: "",
          endTime: "",
          costPrice: 0,
          rackPrice: 0,
          retailPrice: 0,
          supplyPrice: 0,
        }];
      }
      if (!groupItems || groupItems.length) {
        groupItems = [{
          defaultLabel: "T",
          labelValue: "",
          sortNo: 99
        }];
      }
      return {
        mchId,
        modelName,
        nickName,
        ticketType,
        adultNum,
        childNum,
        externalCode,
        isSyncYpw,
        modelExplain,
        groupItems,
        isRealName,
        enabled,
        isSpecial,
        sellType,
        bookRemind,
        stockModel,
        totalStockNum,
        leftStockNum,
        priceMin,
        priceMax,
        isShowTicketNotice,
        ticketNotice,
        priceListJson,
        parkId,
        extendsParam0,
        extendsParam1,
        extendsParam2,
        extendsParam3,
        extendsParam4,
        linkMobileImg,
        modelCode
      };
    },
    getReturnInfo({
      initParams
    }) {
      let {
        isRetreat = "T",
          isRetreatAudit = "T",
          earlyDay = 1,
          retreatPeriodType = 0,
          absoluteDate = "",
          ruleSoldId = ''
      } = initParams;
      retreatPeriodType = parseFloat(retreatPeriodType)
      return {
        isRetreat,
        isRetreatAudit,
        earlyDay,
        retreatPeriodType,
        absoluteDate,
        ruleSoldId
      };
    },
    getReserveInfo({
      initParams
    }) {

      let {
        buyFarthestType = "any",
          buyFarthestDay = 1,
          orderBegDay = "",
          orderEndDay = "",
          dayBegTime = "",
          dayEndTime = "",
          minOrder = 0,
          maxOrder = 0,
          earlyBookDay = 0,
          isNeedIdcard = "T",
          minAge = 0,
          maxAge = 0,
          sex = "x",
          isLimitBuy = 0,
          isLimitBuyDay = 0,
          isLimitBuyDayAmount = 0,
          isLimitBuyDayOrder = 0,
          ruleBuyId = '',
          certificateWay
      } = initParams;
      isLimitBuy = isLimitBuy ? parseFloat(isLimitBuy) : 0 //转换类型
      earlyBookDay = earlyBookDay ? parseFloat(earlyBookDay) : 0
      minOrder = minOrder ? parseFloat(minOrder) : 0
      maxOrder = maxOrder ? parseFloat(maxOrder) : 0
      return {
        buyFarthestType,
        buyFarthestDay,
        orderBegDay,
        orderEndDay,
        dayBegTime,
        dayEndTime,
        minOrder,
        maxOrder,
        earlyBookDay,
        isNeedIdcard,
        minAge,
        maxAge,
        sex,
        isLimitBuy,
        isLimitBuyDay,
        isLimitBuyDayAmount,
        isLimitBuyDayOrder,
        ruleBuyId,
        certificateWay
      };
    },
    songName(state) {
      //景区名称
      return state.diffInfo.name;
    },
    songMchId(state) {
      //商户名称
      return state.diffInfo.mchId;
    },
    songTicketType(state) {
      //产品类型
      return state.diffInfo.ticketType || false;
    },
    songIsSyncYpw(state) {
      //是否推送云票务
      return state.diffInfo.isSyncYpw;
    },
    songExtendsParam3(state) {
      //提前购电商编码：
      return state.diffInfo.extendsParam3;
    },
    songExtendsParam4(state) {
      return state.diffInfo.extendsParam4;
    },
    extendsParam4(state) {
      //当天购电商编码：
      return state.diffInfo.extendsParam4;
    },
    songGroupName(state) {
      //产品分组
      return state.diffInfo.groupName;
    },
    songIsRealName(state) {
      //实名制
      return state.diffInfo.isRealName;
    },
    songIsSpecial(state) {
      //特殊渠道销售
      return state.diffInfo.isSpecial;
    },
    songSellType(state) {
      //销售渠道
      return state.diffInfo.sellType;
    },
    songIsShowTicketNotice(state) {
      return state.diffInfo.isShowTicketNotice;
    },
    songIsLimitBuy(state) {
      //购票限制
      return state.diffInfo.isLimitBuy;
    },
    songIsRetreatAudit(state) {
      //退单审核
      return state.diffInfo.isRetreatAudit;
    },
    songExtendsParam1(state) {
      return state.diffInfo.extendsParam1;
    },
    songStockModel1(state) {
      //表格库存模式
      return state.diffInfo.stockModel1;
    },
    songIsNeedIdcard(state) {
      //下单人身份证
      return state.diffInfo.isNeedIdcard;
    },
    songCertificateWay(state) {
      //出游人身份证
      return state.diffInfo.certificateWay;
    },
    songLinkMobileImg(state) {
      return state.diffInfo.linkMobileImg
    },
    songLeftStockNum(state) {
      return state.diffInfo.leftStockNum
    }
  },
  mutations: {},
  actions: {
    getDiffInfo({
      state,
      commit
    }, id) {
      return new Promise(async (resolve, reject) => {
        let info = await apiGet("/admin/api/sysParam/getSysParamJsonByKey", {
          key: "park_ticket_id"
        });
        if (info.status == "200") {
          let data = info.data;
          let diffValue = {};
          Object.keys(data).forEach(key => {
            diffValue[key] = data[key].defaultValue;
          });
          state.diffInfo = data;
          if (!id) {
            state.initParams = {
              ...state.paramsBase,
              ...diffValue
            };
          } else {
            let res = await apiGet("/product/api/park/api/editTicketFL", {
              id
            });
            if (res.success) {
              let data = res.data;
              let {
                parkInfo,
                parkTicket,
                groupsize,
                isFsyy,
                parkLabelList,
                parklabelId,
                priceIds,
                priceList,
                priceListJson,
                priceListSize,
                merchantParkTicket,
                ruleBuy,
                ruleSold,
                mchInfo
              } = data;
              let mchId = mchInfo.id;
              let ruleBuyId = ruleBuy.id;
              let ruleSoldId = ruleSold.id;
              state.initParams = {
                ...state.paramsBase,
                ...diffValue,
                ...parkInfo,
                ...parkTicket,
                ...merchantParkTicket,
                ...ruleBuy,
                ...ruleSold,
                groupsize,
                isFsyy,
                parkLabelList,
                parklabelId,
                priceIds,
                priceList,
                priceListJson,
                priceListSize,
                mchId,
                ruleBuyId,
                ruleSoldId
              };
            } else {
              state.initParams = {
                ...state.paramsBase,
                ...diffValue
              };
            }
            console.log(state.initParams);
          }
          resolve();
        } else {
          reject();
        }
      });
    }
  }
};
export default Scenic;
