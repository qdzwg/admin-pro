<template>
  <div class="newtable">
    <h4 class="table-title">订单信息</h4>
    <div class="w-table-border">
      <table class="table"
             border
             width=100%>
        <tr>
          <td class="title">订单编号</td>
          <td><span class="fontweight">{{orderInfo.orderNo}}</span></td>
          <td class="title">下单时间</td>
          <td><span class="fontweight">{{orderInfo.createTime}}</span></td>
          <td class="title">交易流水</td>
          <td><span class="fontweight">{{orderInfo.payOrderNo}}</span></td>
        </tr>
        <tr>
          <td class="title">支付时间</td>
          <td><span class="fontweight">{{orderInfo.payTime || '无'}}</span></td>
          <td class="title">支付方式</td>
          <td><span class="fontweight">{{orderInfo.payType ? filter.payType(orderInfo.payType) :'无'}}</span></td>
          <td class="title">订单来源</td>
          <td><span class="fontweight">{{orderInfo.wayType | wayType}}</span></td>
        </tr>
        <tr>
          <td class="title">订单业务</td>
          <td><span class="fontweight">{{orderInfo.orderType | orderType}}</span></td>
          <td class="title">消费时间</td>
          <td><span class="fontweight">{{checkTime ? filter.formatDate(checkTime, 'yyyy-MM-dd') : '未消费'}}</span></td>
          <td class="title"
              v-if="orderInfo.orderType == 'eatery'">使用时间</td>
          <td class="title"
              v-else-if="orderInfo.orderType == 'guide'">服务时间</td>
          <td class="title"
              v-else>游玩时间</td>
          <td><span class="fontweight"
                  v-if="orderInfo.orderType != 'guide'&&orderInfo.orderType != 'hotel'&&orderInfo.orderType!='mdse'&&orderInfo.orderType!='eatery'">{{orderInfo.startTime | formatDate('yyyy-MM-dd')}}
              <span v-if="orderTicket && orderTicket.fsStartTime && orderTicket.fsStartTime!=''">{{orderTicket.fsStartTime}} - {{orderTicket.fsEndTime}}</span>
            </span>
            <span class="fontweight"
                  v-else-if="orderInfo.orderType == 'guide'">{{orderInfo.startTime | formatDate('yyyy-MM-dd hh:mm')}}
            </span>
            <span v-else>无</span></td>
        </tr>
        <tr>
          <td class="title">数量</td>
          <td><span class="fontweight">{{orderInfo.amount}}</span></td>
          <td class="title">单价(￥)</td>
          <td><span class="fontweight">{{orderInfo.price}}</span></td>
          <td class="title">实付金额(￥)</td>
          <td><span class="fontweight">{{orderInfo.paySum}}<span v-if="postage">(邮费：{{postage}})</span></span></td>
        </tr>
        <tr>
          <td class="title">用户名</td>
          <td><span class="fontweight">{{orderInfo.buyerName || '无'}}</span></td>
          <td class="title">优惠金额(￥)</td>          
          <td><span class="fontweight">{{orderInfo.couponSum || 0}}</span></td>
          
          <td class="title">结算金额(￥)</td>
          <td><span class="fontweight"
                  v-if="orderInfo.salesType&&orderInfo.salesType == '1'">{{orderInfo.settleSum}}</span></td>
        </tr>
        <!-- 酒店特殊字段 -->
        <template v-if="orderInfo.orderType == 'hotel'">
          <tr>
            <td class="title">入住时间</td>
            <td><span class="fontweight">{{orderInfo.startTime | formatDate('yyyy-MM-dd')}}</span></td>
            <td class="title">离店时间</td>
            <td colspan="3"><span class="fontweight">{{orderInfo.endTime | formatDate('yyyy-MM-dd')}}</span></td>
          </tr>
        </template>
        <!-- 商品特殊字段 -->
        <template v-if="orderInfo.orderType == 'shop'">
          <tr>
            <td class="title">收货地址</td>
            <td colspan="5"><span class="fontweight">{{orderInfo.linkAddr || '无'}}</span></td>
          </tr>
        </template>
        <tr>
          <td class="title">产品名</td>
          <td><span class="fontweight">{{orderInfo.rateName || orderInfo.goodsName}}</span></td>
          <template v-if="orderInfo.wayType != '4'">
            <td class="title">产品别名</td>
            <td><span class="fontweight">{{orderInfo.rateName || orderInfo.nickName}}</span></td>
          </template>
          <td class="title">订单内容</td>
          <td v-if="orderInfo.wayType != '4'"><span class="fontweight">{{orderInfo.orderInfo}}</span></td>
          <td colspan="3"
              v-else><span class="fontweight">{{orderInfo.orderInfo}}</span></td>
        </tr>

        <template v-if="orderInfo.orderType == 'mdse'">
          <tr v-if="deliverType">
            <td class="title">订单类型</td>
            <td colspan="5"><span class="fontweight"
                    v-if="deliverType == '0'">自提</span>
              <span class="fontweight"
                    v-else-if="deliverType == '1'">快递</span></td>
          </tr>
        </template>
        <template v-if="orderInfo.orderType == 'theater_ticket'">
          <tr>
            <td class="title">演出日期：</td>
            <td><span class="fontweight">{{theaterMap.showTime}}</span></td>
            <td class="title">场次：</td>
            <td><span class="fontweight">{{theaterMap.playTime}}</span></td>
            <td class="title">座位号：</td>
            <td><span class="fontweight">{{theaterMap.seats}}</span></td>
          </tr>
        </template>
        <tr v-if="transInfo">
          <td class="title">支付流水号</td>
          <td><span class="fontweight">{{transInfo.transNo}}</span></td>
          <td class="title">第三方交易号</td>
          <td colspan="3"><span class="fontweight">{{transInfo.gatewayTransNo}}</span></td>
        </tr>
        <tr>
          <td class="title">积分抵扣金额(￥)</td>
          <td><span class="fontweight">{{result.bonus || 0}}</span></td>
          <td class="title">备注</td>
          <td colspan="5"><span class="fontweight">{{orderInfo.remark || '无'}}</span></td>
        </tr>
      </table>
      <h4 class="table-title ptop"
          v-if="orderInfo.orderType=='mdse'">收货人信息</h4>
      <h4 class="table-title ptop"
          v-else>联系人信息</h4>
      <table class="table"
             border
             width=100%>
        <tr>
          <td class="title">联系人</td>
          <td><span class="fontweight">{{orderInfo.linkName}}</span></td>
          <td class="title">电话号码</td>
          <td><span class="fontweight">{{orderInfo.linkMobile}}</span></td>
          <td class="title">身份证号</td>
          <td><span class="fontweight">{{orderInfo.linkIdcard}}</span></td>
        </tr>
        <template v-if="orderTipList">
          <tr v-for="index in  Math.ceil(orderTipList.length/3)"
              :key="index">
            <template v-for="num in index===Math.ceil(orderTipList.length/3)?orderTipList.length-3*(index-1):3">
              <td class="title">{{orderTipList[(index-1)*3+(num-1)].title}}</td>
              <td :colspan="((index-1)*3+num)==orderTipList.length?5-2*(num-1):1">
                <span v-if="orderTipList[(index-1)*3+(num-1)].type=='lvPic'&&orderTipList[(index-1)*3+(num-1)].tips">
                  <img v-for="item in orderTipList[(index-1)*3+(num-1)].tips.split(',')"
                       :src="item"
                       @click="showBigImg(item)" />
                </span>
                <span class="fontweight"
                      v-else>{{orderTipList[(index-1)*3+(num-1)].tips}}</span></td>
            </template>
          </tr>
        </template>
        <tr v-for="item in tipImgList"
            :key="item.id"
            v-if="item.tips">
          <td class="title">{{item.title}}</td>
          <td colspan="5">
            <img v-for="sitem in item.tips.split(',')"
                 :src="sitem"
                 @click="showBigImg(sitem)"
                 style="margin-right:5px;" />
          </td>
        </tr>
        <template v-if="deliverType">
          <tr v-if="deliverType == '1'">
            <td class="title">收货地址</td>
            <td colspan="5"><span class="fontweight">{{linkAddr}}</span></td>
          </tr>
          <tr v-else-if="deliverType == '0'">
            <td class="title">自提地址</td>
            <td><span class="fontweight">{{linkAddr}}</span></td>
            <td class="title">自提电话</td>
            <td><span class="fontweight"
                    v-if="mdsePlace">{{mdsePlace.linkTel}}</span></td>
            <td class="title">营业时间</td>
            <td><span class="fontweight"
                    v-if="mdsePlace">{{mdsePlace.pickupBeginDate}} - {{mdsePlace.pickupEndDate}}</span></td>
          </tr>
        </template>
      </table>
      <h4 class="table-title ptop"
          v-if="orderInfo.orderType=='traffic'">站点信息</h4>
      <table class="table"
             border
             width=100%
             v-if="orderInfo.orderType=='traffic'">
        <tr>
          <td class="title">起始站点</td>
          <td><span class="fontweight">{{siteInfo.bgSiteName}}</span></td>
          <td class="title">发车日期</td>
          <td><span class="fontweight">{{siteInfo.playTime}}</span></td>
        </tr>
        <tr>
          <td class="title">截止站点</td>
          <td><span class="fontweight">{{siteInfo.edSiteName}}</span></td>
          <td class="title">车牌</td>
          <td><span class="fontweight">{{siteInfo.carNumber}}</span></td>
        </tr>
      </table>
      <!-- orderInfo.salesType为空或者是==2时，既有买家也有卖家信息，orderInfo.salesType为0时，买家和卖家信息都没有，orderInfo.salesType为1时，有卖家信息 -->
      <template v-if="!orderInfo.salesType||(orderInfo.salesType!=0&&orderInfo.salesType!=1)">
        <h4 class="table-title ptop">买家信息</h4>
        <table class="table"
               border
               width=100%>
          <tr>
            <td class="title">用户名</td>
            <td><span class="fontweight">{{buyer.accName}}</span></td>
            <td class="title">分销商</td>
            <td colspan="3">
              <span class="fontweight"
                    v-if="buyerAuth.authType">
                <span v-if="buyerAuth.authType == 'corp'">{{buyerAuth.corpName}}</span>
                <span v-else>{{buyerAuth.name}}</span>
              </span>
            </td>
          </tr>
        </table>
      </template>
      <template v-if="!orderInfo.salesType||orderInfo.salesType!=0">
        <h4 class="table-title ptop">卖家信息</h4>
        <table class="table"
               border
               width=100%>
          <tr>
            <td class="title">用户名</td>
            <td><span class="fontweight">{{seller.accName}}</span></td>
            <td class="title">供应商</td>
            <td colspan="3"><span class="fontweight"
                    v-if="sellerAuth.authType">
                <span v-if="sellerAuth.authType == 'corp'">{{sellerAuth.corpName}}</span>
                <span v-else>{{sellerAuth.name}}</span>
              </span>
            </td>
          </tr>
        </table>
      </template>
      <h4 class="table-title ptop">产品明细</h4>
      <Table border
             size="small"
             :columns="orderType=='family'?orderDetailColumns2:orderDetailColumns"
             :data="orderDetail"></Table>
      <template v-if="linkMan&&linkMan.length">
        <h4 class="table-title ptop">实名制游客信息</h4>
        <Table border
               size="small"
               :columns="linkManColumns"
               :data="linkMan"></Table>
      </template>
    </div>
    <div class="imgShow"
         v-if="imgShow">
      <span>
        <img :src="bigUrl" />
      </span>
      <a href="javascript:;"
         class="close"
         @click="closeImg">
        <Icon type="android-close"
              size="32"></Icon>
      </a>
      <div class="imgShowShade"
           @click="closeImg"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      orderInfo: '',
      orderTicket: '',
      postage: '',
      siteInfo: {},
      buyer: {},
      deliverType: '',
      buyerAuth: {},
      seller: {},
      sellerAuth: {},
      orderDetail: [],
      linkMan: [],
      orderInfoMain: '',
      linkAddr: '',
      transInfo: '',
      mdsePlace: '',
      syncStatusMap: [],
      checkTime: '',
      orderTipList: '',
      orderDetailColumns: [
        {
          title: '子订单号',
          align: 'center',
          width: 210,
          key: 'orderDetailNo'
        },
        {
          title: '支付订单号',
          width: 210,
          align: 'center',
          render: (h, params) => {
            return h('span', this.orderInfo.payOrderNo || '无')
          }
        },
        {
          title: '外部订单号',
          width: 210,
          align: 'center',
          render: (h, params) => {
            return h('span', this.result.externalOrderNo || '无')
          }
        },
        {
          title: '产品名称',
          align: 'center',
          width: 210,
          key: 'orderInfo',
          render: (h, params) => {
            let text = params.row.orderInfo || ''
            if (this.orderInfoMain && this.orderInfoMain.specParam) {
              text += '  规格信息:' + this.orderInfoMain.specParam
            } else if (params.row.orderType === 'route' && params.row.detailType === '0') {
              text += '【成人票】'
            } else if (params.row.orderType === 'route' && params.row.detailType === '1') {
              text += '【儿童票】'
            } else {
              if (params.row.mdseDetail) {
                text += '  规格信息:' + params.row.mdseDetail.specParam
              }
            }
            return h('span', text)
          }
        },
        {
          title: '游玩日期',
          align: 'center',
          width: 180,
          key: 'startDate',
          render: (h, params) => {
            let text = ''
            switch (params.row.orderType) {
              case 'mdse':
              case 'eatery':
                text = ''
                break
              case 'hotel':
                text = '入住时间：' + this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd') + '<br>' + '离店时间：' + this.filter.formatDate(params.row.endDate, 'yyyy-MM-dd')
                break
              default:
                text = this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd')
            }
            return h('span', {
              domProps: {
                innerHTML: text
              }
            })
          }
        },
        {
          title: '单价',
          width: 80,
          align: 'center',
          key: 'price',
          render: (h, params) => {
            let text = params.row.price
            if (this.searchType === 'supplyOrder') {
              text = params.row.priceSettle
            }
            return h('span', text)
          }
        },
        {
          title: '总数量',
          width: 80,
          align: 'center',
          key: 'amount'
        },
        {
          title: '同步状态',
          width: 85,
          align: 'center',
          key: 'syncStatus',
          render: (h, params) => {
            return h('span', params.row.syncStatus ? this.syncStatusMap[params.row.syncStatus] : '无')
          }
        },
        {
          title: '已消费',
          width: 80,
          align: 'center',
          key: 'checkAmount'
        },
        {
          title: '已退票',
          width: 80,
          align: 'center',
          key: 'refundAmount'
        }
      ],
      orderDetailColumns2: [
        {
          title: '子订单号',
          align: 'center',
          width: 210,
          key: 'orderDetailNo'
        },
        {
          title: '支付订单号',
          width: 210,
          align: 'center',
          render: (h, params) => {
            return h('span', this.orderInfo.payOrderNo || '无')
          }
        },
        {
          title: '外部订单号',
          width: 210,
          align: 'center',
          render: (h, params) => {
            return h('span', this.result.externalOrderNo || '无')
          }
        },
        {
          title: '产品名称',
          align: 'center',
          width: 210,
          key: 'orderInfo',
          render: (h, params) => {
            let text = params.row.orderInfo || ''
            if (this.orderInfoMain && this.orderInfoMain.specParam) {
              text += '  规格信息:' + this.orderInfoMain.specParam
            } else if (params.row.orderType === 'route' && params.row.detailType === '0') {
              text += '【成人票】'
            } else if (params.row.orderType === 'route' && params.row.detailType === '1') {
              text += '【儿童票】'
            } else {
              if (params.row.mdseDetail) {
                text += '  规格信息:' + params.row.mdseDetail.specParam
              }
            }
            return h('span', text)
          }
        },
        {
          title: '游玩日期',
          align: 'center',
          width: 180,
          key: 'startDate',
          render: (h, params) => {
            let text = ''
            switch (params.row.orderType) {
              case 'mdse':
              case 'eatery':
                text = ''
                break
              case 'hotel':
                text = '入住时间：' + this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd') + '<br>' + '离店时间：' + this.filter.formatDate(params.row.endDate, 'yyyy-MM-dd')
                break
              default:
                text = this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd')
            }
            return h('span', {
              domProps: {
                innerHTML: text
              }
            })
          }
        },
        {
          title: '单价',
          width: 80,
          align: 'center',
          key: 'price',
          render: (h, params) => {
            let text = params.row.price
            if (this.searchType === 'supplyOrder') {
              text = params.row.priceSettle
            }
            return h('span', text)
          }
        },
        {
          title: '总数量',
          width: 80,
          align: 'center',
          key: 'amount'
        },
        {
          title: '总价',
          width: 80,
          align: 'center',
          key: 'orderSum'
        },
        {
          title: '同步状态',
          width: 85,
          align: 'center',
          key: 'syncStatus',
          render: (h, params) => {
            return h('span', params.row.syncStatus ? this.syncStatusMap[params.row.syncStatus] : '无')
          }
        },
        {
          title: '已消费',
          width: 80,
          align: 'center',
          key: 'checkAmount'
        },
        {
          title: '已退票',
          width: 80,
          align: 'center',
          key: 'refundAmount'
        }
      ],
      linkManColumns: [
        {
          title: '姓名',
          align: 'center',
          key: 'linkMan'
        },
        {
          title: '身份证',
          align: 'center',
          key: 'idcardNo'
        },
        {
          title: '状态',
          align: 'center',
          key: 'checked',
          render: (h, params) => {
            let text = '未消费'
            if (params.row.checked === 'T') {
              text = '已消费'
            }
            if (params.row.refunded === 'T') {
              text = '已退票'
            }
            return h('span', text)
          }
        }
      ],
      theaterMap: '',
      imgShow: false,
      bigUrl: '',
      tipImgList: []
    }
  },
  props: ['result', 'searchType', 'orderType'],
  watch: {
    result () {
      this.orderInfo = this.result.orderInfo
      this.buyer = this.result.buyer
      this.buyerAuth = this.result.buyerAuth
      this.seller = this.result.seller
      this.sellerAuth = this.result.sellerAuth
      this.orderDetail = this.result.list
      this.deliverType = this.result.deliverType
      this.linkAddr = this.result.linkAddr
      this.transInfo = this.result.transInfo
      this.mdsePlace = this.result.mdsePlace
      this.syncStatusMap = this.result.syncStatusMap
      this.linkMan = this.result.linkManDTOList
      this.orderTicket = this.result.orderTicket
      this.checkTime = this.result.checkTime
      this.postage = this.result.postage
      this.siteInfo = this.result.siteInfo||{} // 小交通站点信息
      if (this.orderInfo.orderType === 'eatery') {
        this.orderDetailColumns[4].title = '使用日期'
      } else {
        this.orderDetailColumns[4].title = '游玩日期'
      }
      this.theaterMap = this.result.threatJson
      // this.orderTipList = this.result.orderTipList
      let orderTipList = []
      let tipImgList = []
      if (this.result.orderTipList) {
        this.result.orderTipList.forEach(element => {
          if (element.type === 'lvPic') {
            tipImgList.push(element)
          } else {
            orderTipList.push(element)
          }
        })
      }
      this.orderTipList = orderTipList
      this.tipImgList = tipImgList
    }
  },
  methods: {
    showBigImg (imgurl) {
      this.imgShow = true
      this.bigUrl = imgurl
    },
    closeImg () {
      this.imgShow = false
    }
  }
}
</script>
<style>
.imgShow {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  text-align: center;
  display: table;
}
.imgShowShade {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 998;
}
.imgShow span {
  display: table-cell;
  vertical-align: middle;
  width: 100%;
  height: 100%;
}
.imgShow img {
  max-width: 80%;
  position: relative;
  z-index: 1000;
  vertical-align: middle;
  max-height: 70%;
}
.close {
  position: absolute;
  display: block;
  color: #fff;
  width: 32px;
  height: 32px;
  right: 10px;
  top: 10px;
  z-index: 1000;
}
</style>
