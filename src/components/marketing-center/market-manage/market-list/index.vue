<template>
    <div class="market-list">
    <searchForm :search-items='searchItems'></searchForm>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>

    <Modal v-model="modalpay" :title="modalTitle">
        <Form :data="dataList">
            <FormItem label="申请备注：">
                <span>{{dataList.remark}}</span>
            </FormItem>
            <FormItem label="审核备注：">
                <span></span>
            </FormItem>
        </Form>
        <div slot="footer"></div>
    </Modal>
   </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import { apiPost,apiGet } from "@/fetch/api";
export default {
  components: {
    searchForm,
    gridTable
  },
  data() {
    return {
      searchItems: [
        {
          label: "服务类型",
          type: "select",
          name: "plugCode",
          data: [
            {
              value: "",
              label: "--请选择服务类型--"
            },
            {
              value: "coupon",
              label: "优惠券"
            },
            {
              value: "wdf",
              label: "微多粉"
            },
            {
              value: "lpt",
              label: "来拼团"
            },
            {
              value: "mjs",
              label: "买即送"
            },
            {
              value: "rlsb",
              label: "人脸识别"
            },
            {
              value: "dzfp",
              label: "电子发票"
            },
            {
              value: "jzyx",
              label: "精准营销"
            }
          ]
        },
        {
          label: "订单状态",
          type: "select",
          name: "state",
          data: [
            {
              value: "",
              label: "--请选择订单状态--"
            },
            {
              value: "1",
              label: "待付款"
            },
            {
              value: "2",
              label: "订单关闭"
            },
            {
              value: "3",
              label: "订购成功"
            },
            {
              value: "4",
              label: "已过期"
            }
          ]
        }
      ],
      columns: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "订单编号",
          sortable: true,
          key: "orderNo"
        },
        {
          title: "订单时间",
          key: "createTime",
          sortable: true,
          width: 150
        },
        {
          title: "服务名称",
          sortable: true,
          key: "serviceName",
          width: 110
        },
        {
          title: "联系人",
          key: "shopName",
          sortable: true,
          width: 90
        },
        {
          title: "手机号",
          key: "shopTele",
          sortable: true,
          width: 115
        },
        {
          title: "订购信息规格 | 周期",
          sortable: true,
          render: (h, params) => {
            if (params.row.dateType == "1") {
              return h(
                "span",
                params.row.dateNum +
                  "天" +
                  " | " +
                  params.row.vaildStartTime +
                  "~" +
                  params.row.vaildEndTime
              );
            } else if (params.row.dateType == "2") {
              return h(
                "span",
                params.row.dateNum +
                  "月" +
                  " | " +
                  params.row.vaildStartTime +
                  "~" +
                  params.row.vaildEndTime
              );
            } else if (params.row.dateType == "3") {
              return h(
                "span",
                params.row.dateNum +
                  "年" +
                  " | " +
                  params.row.vaildStartTime +
                  "~" +
                  params.row.vaildEndTime
              );
            } else {
              return h(
                "span",
                "永久" + " | " + params.row.vaildStartTime + "~ 以后"
              );
            }
          }
        },
        {
          title: "订单价格",
          key: "amount",
          sortable: true,
          width: 110
        },
        {
          title: "状态",
          key: "state",
          sortable: true,
          width: 85,
          render: (h, params) => {
            return h(
              "span",
              this.filter.marketState(params.row.state) == "订购成功" &&
              params.row.ifRenewal == "T"
                ? "续费成功"
                : this.filter.marketState(params.row.state)
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 130,
          align: "center",
          render: (h, params) => {
            const actions = [];
            if (params.row.state == "1") {
              actions.push(
                {
                  title: "支付",
                  action: () => {
                     
                      this.$router.push({path:'/orderPay',query:{orderId:params.row.orderNo}})
                //     this.modalTitle = "查看备注";
                //     this.modalpay = true;
                //     this.dataList = params.row;
                  }
                },
                {
                  title: "取消",
                  action: () => {
                    this.modalTitle = "查看备注";
                    this.modalpay = true;
                    this.dataList = params.row;
                  }
                }
              );
            } else if (params.row.state == "2") {
              actions.push({
                title: "订购",
                action: () => {
                    apiPost('/marketing/marketService/tobuy?id='+params.row.serviceId).then(res=>{
                        if(res.success){
                            this.$router.push({path:'/orderList',query:{id:params.row.serviceId}})
                        }else{
                            this.$Message.warning(res.message)
                        }
                    })
                }
              });
            } else if (params.row.state == "3" || params.row.state == "4") {
              actions.push({
                title: "续期",
                action: () => {
                    apiPost('/marketing/marketService/tobuy?id='+params.row.serviceId).then(res=>{
                        if(res.success){
                            this.$router.push({path:'/orderList',query:{id:params.row.serviceId}})
                        }else{
                            this.$Message.warning(res.message)
                        }
                    })
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      dataList: {},
      modalpay: false,
      modalTitle: "",
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc",
        opType: "2"
      },
      url: "/marketing/marketServiceOrder/grid"
    };
  },
  created() {},
  methods: {}
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







