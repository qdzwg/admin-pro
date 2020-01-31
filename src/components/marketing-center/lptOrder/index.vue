<template>
    <div class="lptOrder">
    <searchForm :search-items='searchItems'></searchForm>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>

    </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import { apiPost, apiGet } from "@/fetch/api";
export default {
  components: {
    searchForm,
    gridTable
  },
  data() {
    return {
      dataList: {},
      searchItems: [
          {
              label:"订单号",
              type:"input",
              name:"orderNo",
          },
        {
          label: "拼团状态",
          type: "select",
          name: "groupStatus",
          data: [
            {
              value: "",
              label: "--请选择状态--"
            },
            {
              value: "0",
              label: "等待拼团结果"
            },
            {
              value: "1",
              label: "拼团成功"
            },
            {
              value: "2",
              label: "拼团失败"
            },
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
          title: "订单号",
          key: "orderNo",
          width:200
        },
        {
          title: "订单来源",
          key: "wayType",
           render: (h, params) => {
            return h("span", this.filter.wayType(params.row.wayType));
          }
        },
        {
          title: "订单状态",
          key: "orderStatus",
           render: (h, params) => {
            return h("span", this.filter.orderStatus(params.row.orderStatus));
          }
        },
        {
          title: "消费状态",
          key: "checkStatus",
           render: (h, params) => {
            return h("span", this.filter.checkStatus(params.row.checkStatus));
          }
        },
         {
          title: "产品名称",
          key: "orderInfo"
        },
         {
          title: "数量",
          key: "amount"
        },
         {
          title: "订单金额",
          key: "orderSum"
        },
        {
          title: "拼团状态",
          key: "groupStatus",
          render: (h, params) => {
            return h("span", this.filter.groupStatus(params.row.groupStatus));
          }
        }
      ],
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc",
        marketLptId: this.$route.query.id
      },
      data: "",
      url: "/marketing/marketLpt/orderGrid"
    };
  },
  created() {
  },
  methods: {
    getBack() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.lptOrder {
  width: 100%;

}
</style>


