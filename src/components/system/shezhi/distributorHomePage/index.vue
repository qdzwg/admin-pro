<template>
    <div class="distributorHomePage clearfix">
        <div class="distributor-left fl">
            <div class="todayNews">
                <div class="todayNews-item bgc1">
                    <p class="news-title">今日支付订单（笔）</p>
                    <p class="news-num">{{(todayNum).toLocaleString('en-US')}}</p>
                </div>
                <div class="todayNews-item bgc2">
                    <p class="news-title">今日支付金额（元）</p>
                    <p class="news-num">{{(todayPayNum).toLocaleString('en-US')}}</p>
                </div>
                <div class="todayNews-item bgc3">
                    <p class="news-title">昨日支付订单（笔）</p>
                    <p class="news-num">{{(oldNum).toLocaleString('en-US')}}</p>
                </div>
                <div class="todayNews-item bgc4">
                    <p class="news-title">昨日支付金额（笔）</p>
                    <p class="news-num">{{(oldPayNum).toLocaleString('en-US')}}</p>
                </div>
            </div>
            <div class="commonly">
                <div class="common-title">
                    <span style="color:#2db6f4;">●</span> 常用功能</div>
                <div class="commonly-box">
                    <div class="commonly-item" @click="skipPage('product')">
                        <img src="./../../../../assets/images/common1.png" alt="">
                        <p>产品预订</p>
                    </div>
                    <div class="commonly-item" @click="skipPage('management')">
                        <img src="./../../../../assets/images/common2.png" alt="">
                        <p>订单管理</p>
                    </div>
                    <div class="commonly-item" @click="skipPage('account')">
                        <img src="./../../../../assets/images/common3.png" alt="">
                        <p>备用金账户</p>
                    </div>
                    <div class="commonly-item" @click="skipPage('manger')">
                        <img src="./../../../../assets/images/common4.png" alt="">
                        <p>常用联系人</p>
                    </div>
                </div>
            </div>
            <div class="latest-order">
                <div class="order-title">
                    <span style="color:#88c4f9;">●</span> 最新订单</div>
                <Table style="position:static;" :columns="columns" :data="dataList"></Table>
            </div>
        </div>
        <div class="distributor-right fr">
            <div class="systom-notice">
                <div class="notice-title">
                    <span style="color:#88c4f9;">●</span>
                    <span>系统公告</span>
                    <span class="more" @click="getMore('1')">更多</span>
                    <Modal v-model="moreNoticeShow" title="公告">
                        <Table height='350' :columns="columns2" :data="data"></Table>
                        <div slot="footer"></div>
                    </Modal>
                </div>
                <div class="notice-item">
                    <div @click="lookNotice(item.content)" class="notice-text clearfix" v-for="(item,index) in systomNoticeData" :key="index">
                        <span style="color:#f05b47">●</span>
                        <p class="text fl">{{item.title}}</p>
                        <span style="color:#fc6670;">NEW</span>
                    </div>
                </div>
            </div>
            <div class="systom-notice">
                <div class="notice-title">
                    <span style="color:#88c4f9;">●</span>
                    <span>景区通知</span>
                    <span class="more" @click="getMore('2')">更多</span>
                </div>

                <div class="notice-item">
                    <div @click="lookNotice(item.content)" class="notice-text clearfix" v-for="(item,index) in scenicData" :key="index">
                        <span style="color:#f05b47">●</span>
                        <p class="text fl">{{item.title}}</p>
                        <span style="color:#fc6670;">NEW</span>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model="noticeShow" title="公告" :styles="{'z-index':1000}" width=700>
            <div class="distributorNotice" v-html="noticeText"></div>
            <div slot="footer"></div>
        </Modal>

    </div>
</template>


<script>
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      data: [],
      columns2: [
        {
          title: "标题",
          key: "title"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return (
              h,
              "div",
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.lookNotice(params.row.content);
                      }
                    }
                  },
                  "查看"
                )
              ]
            );
          }
        }
      ],
      columns: [
        {
          title: "产品名称",
          key: "orderInfo",
          sortable: true
          //   filters: [
          //     {
          //       label: "门票",
          //       value: 1
          //     },
          //     {
          //       label: "酒店",
          //       value: 2
          //     },
          //     {
          //       label: "商品",
          //       value: 3
          //     }
          //   ],
          //   filterMultiple: false,
          //   filterMethod(value, row) {
          //     if (value === 1) {
          //       return row.show > 4000;
          //     } else if (value === 2) {
          //       return row.show < 4000;
          //     }
          //   }
        },

        {
          title: "订单号",
          key: "orderNo"
        },
        {
          title: "游玩日期",
          key: "startTime"
        },
        {
          title: "订单金额",
          key: "paySum",
          width: 100
        },
        {
          title: "订单状态",
          key: "orderStatus",
          width: 90
        },
        {
          title: "业态",
          key: "orderType",
          width: 90
        },
        {
          title: "联系人",
          key: "linkMobile"
        }
      ],
      lookShow: true, //是否查看了
      noticeText: "",
      noticeShow: false,
      moreNoticeShow: false,
      dataList: [], //订单数据
      systomNoticeData: [], //系统公告
      scenicData: [], //景区通知
      todayNum: 0,
      todayPayNum: 0,
      oldPayNum: 0,
      oldNum: 0
    };
  },
  created() {
    //系统公告
    apiPost("/admin/api/sysAnnouncement/grid").then(res => {
      this.systomNoticeData = res.rows;
    });
    //景区公告
    apiPost("/admin/webapi/userNotice/ownNotice").then(res => {
      this.scenicData = res.data.rows;
    });
    //今日昨日订单量
    apiGet("/order/orderInfo/getSaleData").then(res => {
      if (res.status == 200) {
        if (res.data.rows) {
          res.data.rows.forEach(ele => {
            if (ele.flag == "F") {
              this.oldNum = ele.payOrderNum;
              this.oldPayNum = ele.paySumNum;
            } else {
              this.todayNum = ele.payOrderNum;
              this.todayPayNum = ele.paySumNum;
            }
          });
        }    
      }
    });
    //最新订单
    apiGet("/order/orderInfo/getOrderTop").then(res => {
      if (res.status == 200) {
        this.dataList = res.data.rows;
      }
    });
  },
  methods: {
    lookNotice(text) {
      this.noticeShow = true;
      this.noticeText = text;
    },
    getMore(text) {
      this.moreNoticeShow = true;
      if (text == "1") {
        this.data = this.systomNoticeData;
      } else if (text == "2") {
        this.data = this.scenicData;
      }
    },
    skipPage(text) {
      if (text == "product") {
        // window.location.href =
        //   "https://testwww.lotsmall.cn/admin/index#/order/orderInfo/purchaseList";
           this.$router.push("/myWantBuy");
      } else if (text == "management") {
        // window.location.href =
        //   "https://testwww.lotsmall.cn/admin/index#/order/orderInfo/merchantList";
           this.$router.push("/purchase-order");
      } else if (text == "account") {
        // window.location.href =
        //   "https://testwww.lotsmall.cn/admin/index#/admin/capitalAccount/list";
           this.$router.push("/distributorCapitalManage");
      } else if (text == "manger") {
        this.$router.push("/commonManger");
      }
    }
  }
};
</script>

<style lang="scss">
.distributorNotice {
  img {
    max-width: 668px;
  }
}
.distributorHomePage {
  width: 100%;
  .distributor-left {
    width: 76%;
    .todayNews {
      background-color: #fff;
      //   border-radius: 5px;
      //   box-shadow: 0px 0px 15px rgb(240, 237, 237);
      //   border-top:1px solid #e0eaec;
      border-bottom: 1px solid #e0eaec;
      margin-bottom: 20px;
      padding: 20px;
      height: 206px;
      display: flex;
      justify-content: space-between;
      .todayNews-item {
        width: 23%;
        height: 166px;
        padding: 20px;
        color: #fff;
        text-align: left;
        border-radius: 5px;
        background-color: #8792f2;
        .news-title {
          font-size: 12px;
        }
        .news-num {
          font-size: 28px;
        }
      }
      .bgc1 {
        background-color: #8792f2;
      }
      .bgc2 {
        background-color: #bd8def;
      }
      .bgc3 {
        background-color: #ffa896;
      }
      .bgc4 {
        background-color: #88c4f9;
      }
    }
    .commonly {
      margin-bottom: 20px;
      height: 157px;
      //   box-shadow: 0px 0px 15px rgb(240, 237, 237);
      border-top: 1px solid #e0eaec;
      border-bottom: 1px solid #e0eaec;
      //   border-radius: 5px;
      .common-title {
        height: 52px;
        line-height: 52px;
        padding-left: 10px;
        font-size: 14px;
        color: #413838;
        border-bottom: 1px solid #eeeee7;
        background-color: #f3f7fe;
      }
      .commonly-box {
        width: 100%;
        height: 105px;
        display: flex;
        justify-content: space-between;
        .commonly-item {
          width: 23%;
          height: 35px;
          line-height: 20px;
          margin-top: 35px;
          text-align: center;
          border-right: 1px solid #eeeee7;
          cursor: pointer;
          img {
            width: 35px;
            height: 42px;
            margin-top: -13.5px;
          }
          &:last-child {
            border-right: 0px solid transparent;
          }
        }
      }
    }
    .latest-order {
      margin-bottom: 20px;
      height: auto;
      //   box-shadow: 0px 0px 15px rgb(240, 237, 237);
      border-top: 1px solid #e0eaec;
      //   border-bottom:1px solid #e0eaec;
      //   border-radius: 5px;
      .order-title {
        height: 52px;
        line-height: 52px;
        padding-left: 10px;
        font-size: 14px;
        color: #413838;
        border-bottom: 1px solid #eeeee7;
        background-color: #f3f7fe;
      }
      .ivu-table-wrapper {
        // width: 100%;
        border: none;
        position: static;
      }
      .ivu-table-header {
        //   background-color: #fff;
      }
      .ivu-table th {
        // border: none;
        background-color: #fff;
      }
      .ivu-table-tbody tr {
        background-color: #fbfcff;
      }
      .ivu-table-row:nth-child(2n-1) {
        // border: none;
        background-color: #fff;
      }
    }
  }
  .distributor-right {
    width: 22%;
    // width: 280px;
    .systom-notice {
      height: 221px;
      overflow: hidden;
      background-color: #fff;
      //   border-radius: 5px;
      //   box-shadow: 0px 0px 15px rgb(240, 237, 237);
      border-top: 1px solid #e0eaec;
      border-bottom: 1px solid #e0eaec;
      margin-bottom: 20px;
      .notice-title {
        height: 52px;
        line-height: 52px;
        padding-left: 10px;
        font-size: 14px;
        color: #413838;
        border-bottom: 1px solid #eeeee7;
        background-color: #f3f7fe;
        .more {
          color: #f05b47;
          float: right;
          margin-right: 15px;
          cursor: pointer;
        }
      }
      .notice-item {
        padding: 10px 10px;
        .notice-text {
          line-height: 26px;
          display: flex;
          .text {
            margin-left: 5px;
            width: 82%;
            overflow: hidden;
            flex-grow: 1;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>


