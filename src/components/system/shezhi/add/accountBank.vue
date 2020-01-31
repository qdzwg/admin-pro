<template>
    <div class="accountBank">
        <list ref="gridTable" :columns="columns" :url="url" :searchItems="searchItems" :params="params"></list>
        <Modal v-model="detailShow" title="详情" width=600>
            <div class="newtable">
                <table class="table" border width=100%>
                    <tr>
                        <td class="title">流水号</td>
                        <td>{{tableData.serialNo}}</td>
                    </tr>
                    <tr>
                        <td class="title">分销商名称</td>
                        <td>{{tableData.distributorName}}</td>
                    </tr>
                    <tr>
                        <td class="title">交易类型</td>
                        <td>{{tableData.opType | opType}}</td>
                    </tr>
                    <tr>
                        <td class="title">交易金额</td>
                        <td>{{tableData.opValue}}</td>
                    </tr>
                    <tr>
                        <td class="title">账户余额</td>
                        <td>{{tableData.leftValue}}</td>
                    </tr>
                    <tr>
                        <td class="title">备注信息</td>
                        <td>{{tableData.remark}}</td>
                    </tr>
                </table>
            </div>

            <div slot='footer'></div>
        </Modal>
    </div>
</template>

<script>
import { apiGet, apiPost } from "@/fetch/api";
import list from "@/components/global/list";
export default {
  components: {
    list
  },
  data() {
    return {
      detailShow: false,
      tableData: {},
      searchItems: [
        {
          label: "交易方式",
          type: "select",
          name: "opType",
          data: [
            {
              value: "0",
              label: "充值"
            },
            {
              value: "1",
              label: "缴存"
            },
            {
              value: "2",
              label: "提现"
            },
            {
              value: "3",
              label: "代销"
            },
            {
              value: "4",
              label: "退款"
            }
          ]
        },
        {
          label: "交易日期",
          type: "date",
          name: "beginDate"
        },
        {
          label: "交易日期",
          type: "date",
          name: "endDate"
        },
        {
          label: "分销商名称",
          type: "input",
          name: "distributorName"
        },
        {
          label: "流水号",
          type: "input",
          name: "serialNo"
        },
        {
          label: "交易流水号",
          type: "input",
          name: "orderNo"
        }
      ],
      columns: [
        {
          title: "序号",
          width: 60,
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "流水号",
          key: "serialNo"
        },
        {
          title: "交易流水号",
          key: "orderNo"
        },
        {
          title: "分销商名称",
          key: "distributorName"
        },
        {
          title: "交易方式",
          key: "opType",
          render: (h, params) => {
            return h("div", this.filter.opType(params.row.opType));
          }
        },
        {
          title: "交易金额（元）",
          key: "opValue"
        },
        {
          title: "备用金余额",
          key: "leftValue"
        },
        {
          title: "操作员",
          key: "opernatorName"
        },
        {
          title: "操作时间",
          key: "createTime"
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
                      type: "text",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.detailShow = true;
                        apiGet(
                          "/admin/capitalAccountDetail/detail/detailFL?id=" +
                            params.row.id
                        ).then(res => {
                          this.tableData = res.capitalAccountDetail;
                        });
                      }
                    }
                  },
                  "详情"
                )
              ]
            );
          }
        }
      ],
      url: "/admin/capitalAccountDetail/grid",
      params: { capitalAccountId: this.$route.query.id }
    };
  }
};
</script>
