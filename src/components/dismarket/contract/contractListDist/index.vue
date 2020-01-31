<template>
    <div class="contractListDist">
        <list ref="gridTable" :columns="columns" :url="url" :searchItems="searchItems"></list>
        <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
        <Modal v-model="contractTempModal" title="选择合同模板" width=650>
            <div>
                <Table height='350' :loading='contractLoading' border :columns="columns2" :data="data2"></Table>
            </div>
            <div style="margin-top:10px">
                <Page :total="total2" :current="page2" :page-size="pageSize2" @on-change="changePage2" size="small"></Page>
            </div>
            <div slot='footer'>
            </div>
        </Modal>
        <Modal></Modal>
    </div>
</template>

<script>
import list from "@/components/global/list";
import confirm from "@/components/global/confirm";
import { apiPost, apiGet } from "@/fetch/api";
export default {
  components: {
    list,
    confirm
  },
  data() {
    return {
      mode: "",
      content: "",
      sucessMsg: "",
      searchItems: [
        {
          label: "合同名称",
          type: "input",
          name: "contractName"
        },
        {
          label: "签约状态",
          type: "select",
          name: "signStatus",
          data: [
            {
              value: "",
              label: "--请选择签约状态--"
            },
            {
              value: "sign_success",
              label: "签约成功"
            },
            {
              value: "sign_fail",
              label: "签约失败"
            },
            {
              value: "sign_wait",
              label: "签约中"
            }
          ]
        },
        {
          label: "合同开始时间",
          type: "date",
          name: "contractStartTime"
        },
        {
          label: "合同结束时间",
          type: "date",
          name: "contractEndTime"
        }
      ],
      //   hannleItems: [
      //     {
      //       title: "新增合同",
      //       icon: "android-add",
      //       callback: () => {
      //         this.add();
      //       }
      //     }
      //   ],
      columns: [
        {
          title: "合同名称",
          key: "contractName"
        },
        // {
        //   title: "合同模板",
        //   key: "contractTemplateName"
        // },
        {
          title: "签约发起时间",
          key: "signTime"
        },
        {
          title: "合作开始/结束时间",
          render: (h, params) => {
            return h(
              "span",
              params.row.contractStartTimeStr
                ? params.row.contractStartTimeStr +
                  " - " +
                  params.row.contractEndTimeStr
                : "暂未确定合同时间"
            );
          }
        },
        {
          title: "签约状态",
          key: "signStatus",
          render: (h, params) => {
            return h("span", this.filter.signStatus(params.row.signStatus));
          }
        },
        {
          title: "供应商名称",
          key: "suppName"
        },
        {
          title: "供应商操作人",
          key: "suppOperator"
        },
        {
          title: "旅行社操作人",
          key: "distOperator"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 240,
          render: (h, params) => {
            const actions = [
              {
                title: "合同内容",
                action: () => {
                  this.$router.push({
                    path: "/editContract",
                    query: { contractId: params.row.id }
                  });
                }
              }
            ];
            if (params.row.signStatus != "sign_wait") {
              actions.push({
                title: "续签",
                action: () => {
                  this.mode = "done";
                  this.content = "是否续签，请勿重复发起续签请求!";
                  this.sucessMsg = "续签成功!";
                  this.$refs.confirmModel.confirm(
                    "/admin/webApi/distContract/renewContract?contractId=" +
                      params.row.id
                  );
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      type: "",
      contractId: "",
      url: "/admin/webApi/distContract/selectPage",
      contractTempModal: false,
      contractLoading: false,
      total2: 0,
      page2: 1,
      pageSize2: 10,
      columns2: [
        {
          title: "序号",
          key: "name",
          width: 60,
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "合同名称",
          key: "name"
        },
        {
          title: "合同期限",
          render: (h, params) => {
            return h("span", params.row.startDate + " - " + params.row.endDate);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "确定签约",
                action: () => {
                  if (this.type == "success") {
                    apiGet("/admin/webApi/suppContract/signSuccess", {
                      contractId: this.contractId,
                      contractTemplateId: params.row.id
                    }).then(res => {
                      if (res.status == 200) {
                        this.$refs.gridTable.loadpage();
                        this.$Message.success(res.message);
                        this.contractTempModal = false;
                      }
                    });
                  } else {
                    apiGet("/admin/webApi/suppContract/signFail", {
                      contractId: this.contractId,
                      contractTemplateId: params.row.id
                    }).then(res => {
                      if (res.status == 200) {
                        this.$refs.gridTable.loadpage();
                        this.$Message.success(res.message);
                        this.contractTempModal = false;
                      }
                    });
                  }
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data2: []
    };
  },
  methods: {
    add() {
      this.$router.push("/newContract");
    },
    getList() {
      this.contractLoading = true;
      apiPost("/admin/webApi/contractTemplate/page", {
        page: this.page2,
        limit: this.pageSize2
      }).then(res => {
        if (res.status == 200) {
          this.contractLoading = false;
          this.data2 = res.data.rows;
          this.total2 = res.data.total;
        }
      });
    },
    changePage2() {}
  }
};
</script>

<style lang="scss">
.contractListDist {
}
</style>


