<template>
  <div class="template-user-define">
    <!-- <searchForm :search-items='searchItems'>
        </searchForm> -->
    <!-- <Row :gutter="16" class="btn-groups">
            <Col span="2">
            <Button type="primary" icon="plus-round" @click="add">新增页面</Button>
            </Col>
        </Row> -->
    <gridTable ref="gridTable"
               :columns="columns"
               :params="params"
               :data="data"
               :url="url"></gridTable>
  </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data () {
    return {
      content: "",
      sucessMsg: "",
      mode: "",
      searchItems: [
        {
          label: "页面类型",
          type: "input",
          name: "pageName"
        }
      ],
      columns: [
        {
          title: "页面名称",
          key: "renovationPageName",
          render: (h, params) => {
            let str = "";
            if (params.row.renovationPageType == "mianPage") {
              //店铺主页
              str = "店铺主页";
            } else if (params.row.renovationPageType == "navigationPage") {
              //店铺导航
              str = "店铺导航";
            } else if (params.row.renovationPageType == "centerPage") {
              //个人中心
              str = "个人中心";
            } else if (params.row.renovationPageType == "bottomFilingPage") {
              //底部备案
              str = "尾部备案";
            } else if (params.row.renovationPageType == "topNavigationPage") {
              //顶部导航
              str = "顶部导航";
            }else if (params.row.renovationPageType == "pushNavigationPage") {
              //顶部导航
              str = "推荐导航";
            }
            return h("span", str);
          }
        },
        {
          title: "更新时间",
          key: "modifyTime"
        },
        {
          title: "操作",
          key: "action",
          // width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("i-switch", {
                props: {
                  disabled:
                    params.row.renovationPageType == "mianPage" ||
                    params.row.renovationPageType == "centerPage",
                  value: params.row.editableState == "T" ? true : false,
                  type: "primary"
                },
                on: {
                  "on-change": val => {
                    apiGet(
                      "/merchant/webApi/merchantRenovationTob/updateEditableState",
                      {
                        id: params.row.id,
                        editableState: val ? "T" : "F"
                      }
                    ).then(res => {
                      console.log(res);
                      if (res.status == 200) {
                        this.$Message.success("操作成功");
                        this.$refs.gridTable.loadpage();
                      } else {
                        this.$Message.warning(res.message);
                      }
                    });
                  }
                }
              }),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    marginLeft: "20px"
                  },
                  on: {
                    click: () => {
                      if (params.row.renovationPageType == "mianPage") {
                        //店铺主页
                        this.$router.push("/customPage?source=shopSet");
                      } else if (
                        params.row.renovationPageType == "navigationPage"
                      ) {
                        //店铺导航
                        this.$router.push(
                          "/navigation-custompage?id=" + params.row.id
                        );
                      } else if (
                        params.row.renovationPageType == "pushNavigationPage"
                      ) {
                        //推荐导航
                        this.$router.push(
                          "/pushNavigation-custompage?id=" + params.row.id
                        );
                      } else if (
                        params.row.renovationPageType == "centerPage"
                      ) {
                        //个人中心
                        this.$router.push(
                          "/personal-custompage?id=" + params.row.id
                        );
                      } else if (
                        params.row.renovationPageType == "bottomFilingPage"
                      ) {
                        //底部备案
                        this.$router.push(
                          "/bottom-info-custompage?id=" + params.row.id
                        );
                      } else if (
                        params.row.renovationPageType == "topNavigationPage"
                      ) {
                        //顶部导航
                        this.$router.push(
                          "/top-navigation-custompage?id=" + params.row.id
                        );
                      }
                    }
                  }
                },
                "设置"
              )
            ]);
          }
        }
      ],
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "modifyTime",
        order: "desc",
        useFlag: "T"
      },
      url: "/merchant/webApi/merchantRenovationTob/selectRenovationPage",
      modal: false,
      templateCode: "",
      type: "",
      status: "",
      page: 1,
      total: null,
      listData: [],
      templateName: "",
      typeList: []
    };
  },
  created () {
    apiGet("/admin/api/sysParam/changeList?key=" + "mercantTemplateType").then(
      res => {
        this.typeList = res.data;
      }
    );
  },
  mounted () {
    // this.loadpage(this.params)
    // console.log("created mo");
  },
  destroyed () {
    // console.log("destroyed sdfsf");
  },
  components: { gridTable, confirm, searchForm },
  methods: {
    useTemplete (id) {
      this.$router.push("/create?templateId=" + id);
    },
    pageChange (page) {
      this.page = page;
      this.getList();
    },
    getList () {
      apiPost("/merchant/webApi/merchantTemplateInfoTob/selectPage?page=1&&limit=2", {
        page: this.page,
        limit: 7,
        templateName: this.templateName,
        status: this.status,
        type: this.type
      }).then(res => {
        // console.log(res)
        this.total = res.data.total;
        this.listData = res.data.rows;
      });
    },
    create () {
      this.$router.push("/create");
    },
    add () {
      this.modal = true;
      this.getList();
    },
    splits (test) {
      return test.split(",");
    },
    ok () {
      this.formItem.accType = 0;
      this.formItem.useFlag = this.formItem.switch ? 1 : 0;
      let _this = this;
      let url =
        _this.type === "add"
          ? "list/admin/sysFunctions/saveRole"
          : "list/admin/sysFunctions/update";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback (res) {
          if (res.success) {
            _this.modal = false;
          }
        }
      });
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    showModal () {
      this.modal = true;
      this.formItem.funName = "";
      this.formItem.funCode = "";
      this.formItem.optType = "";
      this.formItem.sortNo = "";
      this.formItem.openModes = "";
      this.formItem.functionTypes = "";
      this.formItem.hierarchys = "";
      this.formItem.funTypes = [];
      this.type = "add";
      this.formItem.switch = true;
      this.modalTitle = "新增角色";
    },
    delAll () {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("list/admin/sysFunctions/" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    }
  }
};
</script>
<style lang='scss'>
.template-modal-select {
  .template-select-list {
    margin-bottom: 15px;
    .item-warper {
      padding: 0 25px;
      .template-item {
        // margin: 0 5px;
        margin-bottom: 10px;
        height: 190px;
        position: relative;
        .template-item-img {
          width: 100%;
          height: 190px;
        }
        .cover {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          text-align: center;
          .template-use {
            margin-top: 85px;
          }
        }
      }
      .template-item:hover {
        .cover {
          display: block;
        }
      }
      .user-defined {
        border: 1px solid #eee;
        text-align: center;
        .userdefine-img {
          margin-top: 25px;
          height: 80px;
          width: 80px;
        }
      }
    }
  }
}

.template-user-define {
}
</style>

