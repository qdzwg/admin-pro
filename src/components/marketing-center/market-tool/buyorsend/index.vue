<template>
    <div class="buyorsend">
    <searchForm :search-items='searchItems'></searchForm>
    <Button type="primary" icon="android-add" style="margin-bottom:20px;" @click="addCoupon">添加</Button>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <Modal v-model="modalpay" :title="modalTitle">


        <div slot="footer"></div>
    </Modal>
   </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import { apiPost, apiGet } from "@/fetch/api";
import confirm from "@/components/global/confirm";
export default {
  components: {
    searchForm,
    gridTable,
    confirm
  },
  data() {
    return {
      searchItems: [
        {
          label: "活动名称",
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
        // {
        //   title: "序号",
        //   width: 60,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("span", params.index + 1);
        //   }
        // },
        {
          title: "优惠券名称",
          sortable: true,
          key: "name",
          width: 150
        },
        {
          title: "活动开始时间",
          key: "startTime",
          sortable: true,
          width: 150
        },
        {
          title: "活动结束时间",
          sortable: true,
          key: "endTime",
          width: 150
        },
        {
          title: "购买产品",
          key: "showName",
          sortable: true,
          width: 150
        },
        {
          title: "购买数量",
          key: "buyCount",
          sortable: true
        },
        {
          title: "优惠券名称",
          key: "couponTempletName",
          sortable: true,
          width: 150
        },
        {
          title: "状态",
          key: "status",
          sortable: true,
          render: (h, params) => {
            return h("span", this.filter.lptStatus(params.row.status));
          }
        },
        {
          title: "启禁用",
          sortable: true,
          key: "enabled",
          render: (h, params) => {
            return h("span", params.row.enabled == "T" ? "启用" : "禁用");
          }
        },
        {
          title: "操作",
          key: "action",
          width: 260,
          align: "center",
          render: (h, params) => {
            let actions = [
              {
                title: "编辑",
                action: () => {
                  this.$router.push({
                    path: "/newBuyorsend",
                    query: { id: params.row.id }
                  });
                }
              },
              {
                title: "删除",
                action: () => {
                  this.mode = "done";
                  this.content = "确定删除吗？";
                  this.sucessMsg = "操作成功！";
                  this.$refs.confirmModel.confirm(
                    "/marketing/marketBuySend/del?id=" + params.row.id
                  );
                }
              }
            ];
            if (
              params.row.status == "not_start" ||
              params.row.status == "processing"
            ) {
              actions.push({
                title: "失效",
                action: () => {
                  this.mode = "done";
                  this.sucessMsg = "操作成功！";
                  this.content = "确认失效？";
                  this.$refs.confirmModel.confirm(
                    "/marketing/marketBuySend/lnvalid?id=" + params.row.id
                  );
                }
              });
            } else if (params.row.enabled == "T") {
              actions.push({
                title: "关闭",
                action: () => {
                  this.mode = "done";
                  this.content = "关闭后,买家无法再领取活动权益,确认关闭?";
                  this.sucessMsg = "操作成功！";
                  this.$refs.confirmModel.confirm(
                    "/marketing/marketBuySend/close?id=" + params.row.id
                  );
                }
              });
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
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      url: "/marketing/marketBuySend/grid"
    };
  },
  created() {},
  methods: {
    addCoupon() {
      this.$router.push("/newBuyorsend");
    },
    onCopy() {
      this.$Message.success("复制成功！");
    },
    onError() {
      this.$Message.error("复制失败！");
    }
  }
};
</script>

<style lang="scss">
.buyorsend {
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







