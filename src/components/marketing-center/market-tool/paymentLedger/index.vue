<template>
  <div>
    <div v-if="noBuyShow">
      <no-buy></no-buy>
    </div>
    <div v-else>
      <list ref="gridTable"
            :columns="columns"
            :url="url"
            :searchItems="searchItems"
            :hannleItems="hannleItems"></list>
      <confirm ref="confirmModel"
               mode="done"
               content="确定删除吗？"
               sucessMsg="删除成功！"></confirm>
      <!-- 新增/编辑页面 -->
      <edit-info ref="editRef"
                 :banktype="banktype"
                 :title="title"
                 :type="type"
                 v-if="completeInfo"
                 :formCompleteData="formCompleteItem"
                 @on-ok="completeFormOK"
                 v-model="completeInfo"></edit-info>
    </div>
  </div>
</template>
<script>
import list from "@/components/global/list";

import confirm from "@/components/global/confirm";
import noBuy from "@/components/marketing-center/notBuyService";
import editInfo from "./components/edit";
export default {
  components: {
    list,
    confirm,
    noBuy,
    editInfo
  },
  data () {
    return {
      banktype: "10590", //农行10590，建行11102
      noBuyShow: false,
      url: "/marketing/webApi/marketPayAccount/listGrid",
      searchItems: [
        {
          label: "业态",
          type: "select",
          name: "productType",
          data: [
            {
              value: "",
              label: "--请选择状态--"
            },
            {
              value: 'family',
              label: '套票'
            },
            {
              value: 'ticket',
              label: '单票'
            }
          ]
        },
        {
          label: "产品名称",
          type: "input",
          name: "productName"
        }
      ],
      hannleItems: [
        {
          title: "新增",
          callback: () => {
            this.completeInfo = true;
            this.formCompleteItem = {
              splitMode: "form_price",
              productCode: "",
              productName: "",
              productType: "",
              totalPrice: 0,
              details: []
            };
            this.title = "新增";
            this.type = "add";
          }
        },
        {
          title: "启用",
          callback: () => {
            let selection = this.$refs.gridTable.selection;
            if (selection) {
              let ids = "";
              selection.forEach(el => {
                ids += el.id + ",";
              });
              this.setForbidden(ids, "T");
            } else {
              this.$Message.warning("请选择数据！");
            }
          }
        },
        {
          title: "禁用",
          callback: () => {
            let selection = this.$refs.gridTable.selection;
            if (selection) {
              let ids = "";
              selection.forEach(el => {
                ids += el.id + ",";
              });
              this.setForbidden(ids, "F");
            } else {
              this.$Message.warning("请选择数据！");
            }
          }
        },
        {
          title: "分账参数配置",
          callback: () => {
            this.$router.push("/allotParams");
          }
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "业态",
          key: "productType",
          render: (h, params) => {
            let { productType } = params.row;
            return h("span", productType == "family" ? "套票" : "单票");
          }
        },
        {
          title: "产品名称",
          key: "productName"
        },
        {
          title: "产品编码",
          key: "productCode"
        },
        {
          title: "分账方式",
          key: "splitMode",
          render: (h, params) => {
            let text = "";
            switch (params.row.splitMode) {
              case "form_price":
                text = "组成价";
                break;
              case "fix_money":
                text = "固定金额";
                break;
              case "fix_scale":
                text = "固定比例";
                break;
            }
            return h("span", text);
          }
        },
        {
          title: "展示价",
          key: "totalPrice",
          render: (h, params) => {
            let array = [h("div", params.row.totalPrice)];
            if (params.row.tipsFlag === "T") {
              array.push(
                h(
                  "span",
                  {
                    style: {
                      color: "#f00"
                    }
                  },
                  "分账信息不全!"
                )
              );
            }
            return h("div", array);
          }
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            let text = "";
            switch (params.row.status) {
              case "T":
                text = "启用";
                break;
              case "F":
                text = "禁用";
                break;
            }
            return h("span", text);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 240,
          align: "center",
          render: (h, params) => {
            let actions = [
              {
                title: params.row.status === "T" ? "禁用" : "启用",
                action: () => {
                  let status = params.row.status === "F" ? "T" : "F";
                  this.setForbidden(params.row.id, status);
                }
              },
              {
                title: "编辑",
                action: async () => {
                  let res = await this.apiGet(
                    "/marketing/webApi/marketPayAccount/getById",
                    { id: params.row.id }
                  );
                  if (res.status === 200) {
                    let data = res.data;
                    this.completeInfo = true;
                    this.formCompleteItem = {
                      id: data.id,
                      productCode: data.productCode,
                      productType: data.productType,
                      productName: data.productName,
                      totalPrice: data.totalPrice,
                      splitMode: data.splitMode,
                      details: data.details
                    };
                    this.title = "编辑";
                    this.type = "edit";
                  } else {
                    this.$Message.error(res.message);
                  }
                }
              },
              {
                title: "删除",
                action: () => {
                  this.$refs.confirmModel.confirm(
                    "/marketing/webApi/marketPayAccount/deleted?id=" +
                    params.row.id
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      completeInfo: false,
      title: "新增",
      loading: true,
      type: "add",
      formCompleteItem: {
        merchantInfoId: 0,
        payAccountId: 0,
        productCode: "",
        productName: "",
        productType: "",
        splitMode: "form_price",
        totalPrice: "",
        details: []
      }
    };
  },
  async created () {
    let payRes = await this.apiGet(
      "/marketing/webApi/market/selectServiceUse",
      {
        serviceType: "payAccount"
      }
    );
    if (payRes.status === 200) {
      if (payRes.data.payAccount) {
        this.noBuyShow = false;
      } else {
        this.noBuyShow = true;
      }
    } else {
      this.noBuyShow = true;
      this.$Message.warning(payRes.message);
    }

    this.apiGet("/marketing/webApi/marketPayAccountConfig/getCongig").then(
      res => {
        if (res.status === 200) {
          //目前农行未作单票，需隐藏单票
          this.banktype = res.data.splitAccountType;
        } else {
          this.$Message.error(res.message);
        }
      }
    );
  },
  methods: {
    completeFormOK () {
      this.$refs.gridTable.loadpage();
    },
    setloading () {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    },
    async setForbidden (id, status) {
      let res = await this.apiGet("/marketing/webApi/marketPayAccount/enabel", {
        ids: id,
        status: status
      });
      if (res.status === 200) {
        this.$refs.gridTable.loadpage();
      } else {
        this.$Message.error(res.message);
      }
    }
  }
};
</script>
<style>
.mode-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e9eaec;
}
.mode-table th {
  background-color: #f8f8f9;
  line-height: 30px;
  border: 1px solid #e9eaec;
}
.mode-table td {
  padding: 5px;
  text-align: center;
  border: 1px solid #e9eaec;
}
.mode-table .ivu-form-item-error-tip {
  z-index: 90;
  position: relative;
  text-align: left;
}
</style>
