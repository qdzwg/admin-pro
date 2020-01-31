<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-done" @click="doneAll">启用</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-close" @click="forbiddenAll">禁用</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :content="content" :mode="mode"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal"   width="800" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Tabs>
          <TabPane label="基本信息">
            <div class="userInfo">
                 <table class="userInfo-table">
                  <tr>
                    <td colspan="4">详细信息</td>
                  </tr>
                  <tr>
                    <td>真实姓名</td>
                    <td>{{modalData.loginName}}</td>
                    <td>登录名</td>
                    <td>{{modalData.loginName}}</td>
                  </tr>
                  <tr>
                    <td>手机号</td>
                    <td>{{modalData.loginName}}</td>
                    <td>证件号</td>
                    <td>{{modalData.loginName}}</td>
                  </tr>
                  <tr>
                    <td>性别</td>
                    <td>{{modalData.loginName}}</td>
                    <td>年龄</td>
                    <td>{{modalData.loginName}}</td>
                  </tr>
                  <tr>
                    <td>所在地</td>
                    <td colspan="3">用户_ddPsLE</td>
                  </tr>
              </table>
            </div>
          </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import Image from "@/components/global/img";
export default {
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "头像图片",
          key: "headImg",
          render: (h, params) => {
            return h("Image", {
              props: {
                url: params.row.headImg ? params.row.headImg : ""
              }
            });
          }
        },
        {
          title: "登录名",
          key: "loginName"
        },
        {
          title: "会员唯一标识别",
          key: "onlyCode"
        },
        {
          title: "启禁用",
          key: "useFlag",
          render: (h, params) => {
            return h("span", this.filter.accountState(params.row.useFlag));
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "详情",
                action: () => {
                  this.modal = true;
                  this.modalData = params.row
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      modalData: "",
      data: "",
      params: { page: 1, limit: 10, sort: "modifyTime", order: "desc" },
      url: "list/leaguer/leaguerInfo/grid",
      searchItems: [
        {
          label: "会员标识",
          type: "input",
          name: "onlyCode"
        },
        {
          label: "登录名",
          type: "input",
          name: "loginName"
        },
        {
          label: "状态",
          type: "select",
          name: "useFlag",
          data: [
            {
              value: "",
              label: "--请选择启禁用--"
            },
            {
              value: "0",
              label: "启用"
            },
            {
              value: "1",
              label: "禁用"
            }
          ]
        }
      ],
      modal: false,
      content:'',
      mode: '',
      formItem: {
        roleName: "",
        switch: true,
        remark: ""
      },
      modalTitle: "会员详情",
      type: "add",
      loading: true,
      ruleForm: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    // this.loadpage(this.params)
  },
  components: { searchForm, gridTable, confirm },
  methods: {
    ok() {
      this.modal = false
    },
    cancel() {
      // this.$Message.info('Clicked cancel')
    },
    showModal() {
      this.modal = true;
      this.type = "add";
      this.formItem.roleName = "";
      this.formItem.switch = true;
      this.formItem.remark = "";
      this.modalTitle = "新增角色";
    },
    delAll() {
      this.content = "确认删除？"
       this.mode = 'delete'
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("list/admin/sysRole/" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    doneAll() {
      this.content = "确认启用？"
       this.mode = 'done'
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("list/leaguer/leaguerInfo/enable?enable=true&ids=" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    forbiddenAll() {
      this.content = "确认禁用？";
      this.mode = 'forbidden'
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("list/leaguer/leaguerInfo/enable?enable=false&ids=" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    }
  }
};
</script>
<style scoped>
  .userInfo{
    border-top: 1px solid #dddddd;
  }
  .userInfo-table{
    width: 100%
  }
  .userInfo-table td{
    padding: 8px;
    border-bottom: 1px solid #dddddd;
    border-left: 1px solid #dddddd
  }
  .userInfo-table tr td:last-child{
    border-right: 2px solid #dddddd
  }
</style>

