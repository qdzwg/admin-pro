<template>
    <div class="marketCoupon">
    <couponForm v-if="songCreateBeginTime && songCreateBeginTime.show" :parkList='parkList' :couponType="couponType"></couponForm>
    <searchForm v-else :search-items='searchItems'></searchForm>
    <Button type="primary" icon="android-add" style="margin-bottom:20px;" @click="addCoupon">添加</Button>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <Modal v-model="modalpay" :title="modalTitle">
       <span>领取短链接：{{copyUrl}}</span>
        <Button v-clipboard:copy="copyUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
        <p>
          <span>领取二维码:
            <a :href="codeUrl" download>下载二维码</a>
          </span>
        </p>
        <center id="target" style="margin-top:20px;">
          <qrcode :value="qrcodeUrl" :options="{ size: 170}">
          </qrcode>
        </center>
        <div slot="footer"></div>
    </Modal>
   </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import couponForm from "@/components/global/couponForm";
import gridTable from "@/components/global/gridTable";
import { apiPost, apiGet } from "@/fetch/api";
import confirm from "@/components/global/confirm";
import QRcode from "@xkeshi/vue-qrcode";
import store from "@/store";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    searchForm,
    gridTable,
    confirm,
    qrcode: QRcode,
    couponForm
  },
  data() {
    return {
      copyUrl: "",
      qrcodeUrl: "",
      codeUrl: "",
      parkList: [],
      couponType: [],
      searchItems: [
        {
          label: "优惠券名称",
          type: "input",
          name: "name"
        },
        {
          label: "状态",
          type: "select",
          name: "status",
          data: [
            {
              value: "",
              label: "--请选择状态--"
            },
            {
              value: "1",
              label: "未开始"
            },
            {
              value: "2",
              label: "进行中"
            },
            {
              value: "3",
              label: "已结束"
            },
            {
              value: "4",
              label: "已失效"
            }
          ]
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "优惠券名称",
          sortable: true,
          key: "name",
          width: 150
        },
        {
          title: "面值",
          key: "showAmount",
          sortable: true,
          width: 120,
          render:(h,params)=>{
              return h("span",params.row.showAmount ? params.row.showAmount.replace("<br/>"," / ") : '')
          }
        },
        {
          title: "领取限制",
          sortable: true,
          key: "showReceive",
          width: 180,
           render:(h,params)=>{
              return h("span",params.row.showReceive.replace("<br/>"," / "))
          }
        },
        {
          title: "使用有效期",
          key: "showValitDate",
          sortable: true,
          width: 180
        },
        {
          title: "发放总量",
          key: "totalNum",
          sortable: true,
          width: 120
        },
        {
          title: "状态",
          key: "status",
          width: 120,
          sortable: true,
          render: (h, params) => {
            return h("span", this.filter.marketStatus(params.row.status));
          }
        },
        {
          title: "已领人数/张数",
          key: "showNum",
          sortable: true,
          width: 150
        },
        {
          title: "已使用",
          sortable: true,
          key: "usedNum",
          width: 120
        },
        {
          title: "操作",
          key: "action",
          width: 260,
          align: "center",
          fixed: 'right',
          render: (h, params) => {
            let actions = [
              {
                title: "编辑",
                action: () => {
                  this.$router.push({
                    path: "/editCoupons",
                    query: { id: params.row.id }
                  });
                }
              }
            ];
            if (params.row.status == "1" || params.row.status == "2") {
              actions.push(
                {
                  title: "使失效",
                  action: () => {
                    this.mode = "done";
                    this.sucessMsg = "操作成功！";
                    this.content =
                      "失效后，买家无法再领取该优惠券，你也不能继续编辑优惠券内容；买家之前已领取的优惠券，在使用有效期内还能继续使用";
                    this.$refs.confirmModel.confirm(
                      "/marketing/marketCouponTemplet/invalid?id=" +
                        params.row.id
                    );
                  }
                },
                {
                  title: "推广",
                  action: () => {
                    let _this = this;
                    this.modalTitle = "优惠券信息";
                    apiGet(
                      "/marketing/marketCouponTemplet/donwloadQrFL?id=" +
                        params.row.id
                    ).then(res => {
                      if (res.success) {
                        this.modalpay = true;
                        this.qrcodeUrl = res.data.qrCodeUrl;
                        this.copyUrl = res.data.qrCodeUrl;
                        //把生成的二维码转换成图片
                        this.$nextTick(function() {
                          let canvasData = $("#target").children("canvas");
                          _this.codeUrl = canvasData[0].toDataURL();
                        });
                      } else {
                        this.$Message.warning(res.message);
                      }
                    });
                  }
                },
                {
                  title: "使用记录",
                  action: () => {
                    this.$router.push({
                      path: "/userRecord",
                      query: { id: params.row.id }
                    });
                  }
                }
              );
            } else if (params.row.status == "3") {
              actions.push({
                title: "删除",
                action: () => {
                  this.mode = "done";
                  this.content = "确定删除吗？";
                  this.sucessMsg = "操作成功！";
                  this.$refs.confirmModel.confirm(
                    "/marketing/marketCouponTemplet/deleted?id=" + params.row.id
                  );
                }
              });
            } else if (params.row.status == "4") {
              actions = [];
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      mode: "",
      content: "",
      sucessMsg: "",
      dataList: {},
      modalpay: false,
      modalTitle: "",
      data: "",
      params: {
        page: 1,
        limit: 10       
      },
      url: "/marketing/marketCouponTemplet/pageCouponTemplet"
    };
  },
  async created() {
    await this.getDiffInfo();
    this.getParks();
    this.getCouponType();
    if(this.songCouponType && this.songCouponType.show){
      this.columns.splice(1,0,{
        title: "券类型",
        sortable: true,
        key: "couponTypeName",
        width: 100        
      })
    }
    if(this.songParkName && this.songParkName.show) {
      this.columns.splice(3,0, {
        title: "归属景区",
        sortable: true,
        key: "parkName",
        width: 120        
      })
    }
    if(this.songCode && this.songCode.show) {
      this.columns.splice(2,0, {
        title: "优惠券编码",
        sortable: true,
        key: "code",
        width: 180        
      })
    }
  },
  mounted() {},
  methods: {
    ...mapActions("couponList", ["getDiffInfo"]),
    getParks() {
      this.apiGet('/marketing/marketCouponTemplet/findAllCouponOfParks').then(res => {
        if(res.status == 200 || res.success){
          this.parkList = res.data;
        }
      })
    },
    getCouponType() {
      this.apiGet('/marketing/marketCouponTemplet/getNeumContent').then(res => {
        if(res.status == 200 || res.success){
          this.couponType = res.data.couponType;
        }
      });
    },
    addCoupon() {
      this.$router.push("/newCoupons");
    },
    onCopy() {
      this.$Message.success("复制成功！");
    },
    onError() {
      this.$Message.error("复制失败！");
    }
  },
  computed: {
    ...mapState("couponList", ["diffValue"]),
    ...mapGetters("couponList", [
      "songCouponCode",
      "songCouponType",
      "songCouponTypeSearch",
      "songCreateBeginTime",
      "songCreateEndTime",
      "songModifyBeginTime",
      "songModifyEndTime",
      "songParkId",
      "songParkName",
      "songParkcode",
      "songPrefixDateLimit",
      "songCode"
    ])
  }
};
</script>

<style lang="scss">
.market-list {
  width: 100%;
}
.table {
  margin-bottom: 15px;
  width: 100%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  tr {
    td {
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #dddddd;
      padding: 8px;
      line-height: 20px;
    }
    .table-title {
      background-color: #f5fafe;
    }
  }
}
</style>







