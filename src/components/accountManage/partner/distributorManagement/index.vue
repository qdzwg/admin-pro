<template>
    <div class="distributorManagement">
        <list ref="gridTable" :columns="columns" :url="url" :searchItems="searchItems" :hannleItems="hannleItems"></list>
        <confirm ref="confirmModel" :title="title" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
        <Modal v-model="chooseModal" title="选择分销组" width=600>
            <div>
                <Table height='350' :loading='tableLoading' border :columns="columns7" :data="data6"></Table>
            </div>
            <div style="margin-top:10px">
                <Page :total="total" :current="page" :page-size="pageSize" @on-change="changePage" size="small"></Page>
            </div>
            <div slot='footer'></div>
        </Modal>
        <Modal v-model="rechargeModal" title="缴存" width=600>
            <Form :model="formItem" :label-width="120" label-position="right" ref="formItem" :rules="ruleForm">
                <FormItem label="分销商名称：">
                    <span>{{formItem.name}}</span>
                </FormItem>
                <FormItem label="账户余额：">
                    <span v-if="formItem.type=='credit'">{{formItem.creditLeftValue}}</span>
                    <span v-else>{{formItem.leftValue}}</span>
                </FormItem>
                <FormItem label="充值金额：" prop="money">
                    <Input v-model="formItem.money" style="width:200px;" number :maxlength="6"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit">提交</Button>
                    <Button @click="test">取消</Button>
                </FormItem>
            </Form>
            <div slot='footer'></div>
        </Modal>
        <Modal v-model="updateSwitchModal" title="导游审核" @on-cancel="cancel" @on-ok="ok">
            <Form :label-width="120" label-position="right">
                <FormItem label="导游审核：">
                    <RadioGroup v-model="updateSwitchsStatus">
                        <Radio label="T">开启</Radio>
                        <Radio label="F">关闭</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>


<script>
import { apiGet, apiPost } from "@/fetch/api";
import list from "@/components/global/list";
import confirm from "@/components/global/confirm";
export default {
  components: {
    confirm,
    list
  },
  data() {
    return {
      updateSwitchModal: false,
      updateSwitchsStatus: "F",
      rechargeModal: false,
      formItem: {
        id: "",
        name: "",
        leftValue: "",
        creditLeftValue: "",
        opValue: "",
        type: "",
        money: ""
      },
      ruleForm: {
        money: [
          {
            required: true,
            type: "number",
            message: "请输入充值金额",
            trigger: "blur"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          }
        ]
      },
      chooseModal: false,
      mode: "",
      title: "",
      content: "",
      sucessMsg: "",
      searchItems: [
        {
          label: "分销商名称",
          type: "input",
          name: "name"
        },
        {
          label: "分组",
          type: "select",
          name: "group_id",
          data: [
            {
              value: "",
              label: "全部"
            }
          ],
          value: ""
        }
      ],
      hannleItems: [
        {
          title: "分组管理",
          icon: "android-add",
          callback: () => {
            this.add();
          }
        },
        {
          title: "导游审核",
          callback: () => {
            this.updateSwitchModal = true;
          }
        }
      ],
      columns: [
        {
          title: "分销商名称",
          key: "name"
        },
        {
          title: "联系人",
          key: "link_man"
        },
        {
          title: "建立合作时间",
          key: "create_time"
        },
        {
          title: "备用金金额",
          key: "leftValue"
        },
        {
          title: "累计消费",
          key: "totalConsume"
        },
        {
          title: "分组",
          key: "group_name"
        },
        {
          title: "操作",
          key: "action",
          width: 400,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "授信",
                action: () => {
                  this.rechargeModal = true;
                  apiGet(
                    "/admin/capitalAccount/supplier/toRechargeFL?id=" +
                      params.row.id
                  ).then(res => {
                    this.formItem = res.capitalAccount;
                  });
                }
              },
              {
                title: "流水明细",
                action: () => {
                  this.$router.push({
                    path: "/accountBank",
                    query: { id: params.row.id }
                  });
                }
              },
              {
                title: "合同管理",
                action: () => {
                  this.$router.push({path:"/contractList",query:{distMainUserId:params.row.distributorId}});
                }
              },
              {
                title: "更改分组",
                action: () => {
                  this.chooseModal = true;
                  this.selectHotel(params.row.id);
                }
              },
              {
                title: params.row.enable == "F" ? "解禁" : "禁单",
                action: () => {
                  this.mode = "post";
                  this.title = "确定是否" + (params.row.enable == "F" ? "解禁" : "禁单");
                  this.content = params.row.enable == "F" ? "解禁后，可以正常下单购买！" : "禁单后，不可下单购买！";
                  this.sucessMsg = "操作成功!";
                  this.$refs.confirmModel.confirm(
                    "/admin/webapi/capitalAccount/updateEnable",
                    {
                      id: params.row.id,
                      status: params.row.enable == "F" ? "T" : "F"
                    }
                  );
                }
              },{
                   title:params.row.cooperation=='T'? "取消合作":"合作",
                action: () => {
                  this.mode = "post";
                  this.content = "你确认此操作吗?";
                  this.sucessMsg = "操作成功!";
                  this.$refs.confirmModel.confirm(
                    "/admin/webapi/capitalAccount/updateCooperation",
                    {
                      id: params.row.id,
                      status: params.row.cooperation=='T'?'F':'T'
                    }
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      url: "/admin/webapi/capitalAccount/grid",
      columns7: [
        {
          title: "序号",
          width: 60,
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "描述",
          key: "remark"
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
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.updateUserGroups(this.pid, params.row.id);
                      }
                    }
                  },
                  "更改"
                )
              ]
            );
          }
        }
      ],
      tableLoading: false,
      data6: [],
      total: 0,
      page: 1,
      pageSize: 10,
      page2: 1,
      pageSize2: 10,
      tableSelecttion: [], //弹框选中项
      seletedList: [],
      showTableSelection: [],
      pid: "",
      dataList: []
    };
  },
  created() {
    if (this.$route.query.id) {
      this.searchItems[1].value = this.$route.query.id;
      setTimeout(() => {
        this.$refs.gridTable.handleSubmit2();
      }, 150);
    } else {
    }
    this.getAccount();
    apiGet(
      "/admin/webapi/accountInfo/getSwitch"
    ).then(res => {
      if (res.status == 200) {
        this.updateSwitchsStatus = res.data.payValue;
      } else {
        this.$Message.warning(res.message);
      }
    });
  },
  mounted() {},
  methods: {
    uniqueArray(array, key) {
      var result = [array[0]];
      for (var i = 1; i < array.length; i++) {
        var item = array[i];
        var repeat = false;
        for (var j = 0; j < result.length; j++) {
          if (item[key] == result[j][key]) {
            repeat = true;
            break;
          }
        }
        if (!repeat) {
          result.push(item);
        }
      }
      return result;
    },
    add() {
      this.$router.push("/groupingManagement");
    },
    ok() {
      apiPost("/admin/webapi/accountInfo/updateSwitch", {
        status: this.updateSwitchsStatus
      }).then(res => {
        if (res.status == 200) {
          this.updateSwitchModal = false;
          this.$Message.success(res.message);
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    cancel() {
      this.updateSwitchModal = false;
    },
    changePage(num) {
      this.page = num;
      this.selectHotel();
    },
    pageSizeChange() {},
    getAccount() {
      apiPost("/admin/webapi/userGroup/list", {
        page: this.page2,
        limit: this.pageSize2
      }).then(res => {
        if (res.status == 200) {
          if (res.data.rows && res.data.rows.length) {
            let data = this.uniqueArray(res.data.rows, "id");
            let arr = [
              {
                value: "",
                label: "全部"
              }
            ];
            data.map(ele => {
              let obj = {};
              obj.value = ele.id;
              obj.label = ele.name;
              arr.push(obj);
            });
            this.searchItems[1].data = arr;
          }
        }
      });
    },
    updateUserGroups(id, gid) {
      apiPost("/admin/webapi/capitalAccount/updateUserGroups", {
        id: id,
        group_id: gid
      }).then(res => {
        if (res.status == 200) {
          this.chooseModal = false;
          this.$refs.gridTable.loadpage();
          this.getAccount();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    selectHotel(id) {
      this.tableLoading = true;
      this.pid = id;
      apiPost("/admin/webapi/capitalAccount/getGroups", {
        page: this.page,
        limit: this.pageSize
      }).then(res => {
        if (res.status == 200) {
          let _this = this;
          this.tableLoading = false;
          this.data6 = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    test() {
      this.rechargeModal = false;
    },
    submit() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          apiPost("/admin/capitalAccount/suplier/doRecharge", {
            id: this.formItem.id,
            money: this.formItem.money
          }).then(res => {
            if (res.success) {
              this.rechargeModal = false;
              this.$Message.success(res.message);
              this.$refs.gridTable.loadpage();
            }
          });
        }
      });
    }
  }
};
</script>


<style lang="scss">
.distributorManagement {
}
</style>


