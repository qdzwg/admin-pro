<template>
    <div class="conTemplate">
        <list ref="gridTable" :columns="columns" :url="url" :searchItems="searchItems" :hannleItems="hannleItems"></list>
        <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
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
          label: "合同模板名称",
          type: "input",
          name: "name"
        },
        {
          label: "使用状态",
          type: "select",
          name: "status",
          data: [
            {
              value: "",
              label: "--请选择状态--"
            },
            {
              value: "T",
              label: "启用"
            },
            {
              value: "F",
              label: "禁用"
            }
          ]
        }
      ],
      hannleItems: [
        {
          title: "新增",
          icon: "android-add",
          callback: () => {
            this.add();
          }
        }
      ],
      columns: [
        {
          title: "合同名称",
          key: "name"
        },

        {
          title: "新增/修改时间",
          key: "modifyTime"
        },
        {
          title: "使用状态",
          key: "status",
          render: (h, params) => {
            return h("span", params.row.status == "T" ? "启用" : "禁用");
          }
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
                title: params.row.status == "T" ? "禁用" : "启用",
                action: () => {
                  this.mode = "post";
                  this.content = "你确认此操作吗?";
                  this.sucessMsg = "操作成功!";
                  this.$refs.confirmModel.confirm(
                    "/admin/webApi/contractTemplate/disable",
                    {
                      id: params.row.id,
                      status: params.row.status == "T" ? "F" : "T"
                    }
                  );
                }
              },
              {
                title: "编辑",
                action: () => {
                  this.$router.push({
                    path: "/newContractTemplate",
                    query: { id: params.row.id }
                  });
                }
              },
              {
                title: "删除",
                action: () => {
                  this.mode = "done";
                  this.content = "你是否确认删除这项内容?";
                  this.sucessMsg = "删除成功!";
                  this.$refs.confirmModel.confirm(
                    "/admin/webApi/contractTemplate/deleteById?id=" + params.row.id
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      url: "/admin/webApi/contractTemplate/page"
    };
  },
  methods: {
    add() {
      this.$router.push("/newContractTemplate");
    }
  }
};
</script>

<style lang="scss">
.conTemplate {
}
</style>


