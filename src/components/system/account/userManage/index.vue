<template>
  <div>
    <Row :gutter="16" class="btn-groups">
      <Col span="3">
        <Button type="primary" icon="android-add" @click="showModal('add')"
          >新增</Button
        >
      </Col>
    </Row>
    <userForm :search-list="parkList"></userForm>
    <gridTable
      ref="gridTable"
      :params="params"
      :columns="columns"
      :data="data"
      :url="url"
    ></gridTable>
    <confirm
      ref="confirmModel"
      :mode="mode"
      :content="content"
      :sucessMsg="sucessMsg"
    ></confirm>
    <!--重置密码-->
    <Modal width="600" v-model="pwdModal" title="信息确认">
      <div style="padding-bottom: 15px; font-size: 13px;">确认重置密码？</div>
      <div>
        <Button type="error" @click="queren">确认</Button>
        <Button type="ghost" @click="closePwd">关闭</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--新增编辑-->
    <Modal v-model="modal" width="700" :title="doTitle">
      <Form
        :model="formItemt"
        label-position="right"
        ref="formItemt"
        :rules="ruleFormt"
      >
        <FormItem label="归属景区：" prop="parkId" :label-width="100">
          <Select
            v-model="formItemt.parkId"
            :disabled="type == 'see'"
            style="width:180px"
            placeholder="请选择归属景区"
          >
            <Option
              v-for="(item, index) in parkList"
              :value="item.parkId + ''"
              :key="index"
              >{{ item.parkName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="用户姓名：" prop="realName" :label-width="100">
          <Input
            v-model="formItemt.realName"
            :disabled="type == 'see'"
            placeholder="请输入用户姓名"
            style="width: 180px;"
          ></Input>
        </FormItem>
        <FormItem label="手机号：" prop="mobile" :label-width="100">
          <Input
            v-model="formItemt.mobile"
            :disabled="type == 'see'"
            placeholder="请输入手机号"
            style="width: 180px;"
          ></Input>
        </FormItem>
        <FormItem label="用户名：" prop="accName" :label-width="100">
          <Input
            v-model="formItemt.accName"
            :disabled="type == 'see'"
            placeholder="请输入用户名"
            style="width: 180px;"
          ></Input>
        </FormItem>
        <FormItem label="部门：" :label-width="100">
          <Input
            v-model="formItemt.department"
            :disabled="type == 'see'"
            placeholder="请输入部门名称"
            style="width: 180px;"
          ></Input>
        </FormItem>
        <FormItem label="归属商户：" :label-width="100">
          <Select
            v-model="formItemt.mchId"
            :disabled="type == 'see'"
            style="width:180px"
            placeholder="请选择归属商户"
          >
            <Option
              v-for="(item, index) in mchList"
              :value="item.id"
              :key="index"
              >{{ item.mchName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="状态：" prop="accStatus" :label-width="100">
          <Select
            v-model="formItemt.accStatus"
            :disabled="type == 'see'"
            style="width:180px"
            placeholder="请选择状态"
          >
            <Option
              v-for="(item, index) in statusList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem style="text-align: center;">
          <Button type="primary" @click="submit" v-if="type != 'see'"
            >保存</Button
          >
          <Button type="ghost" @click="cancel">关闭</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <!--角色分配-->
    <Modal v-model="roleModal" width="700" title="角色分配">
      <Form
        :model="formItemR"
        label-position="right"
        ref="formItemR"
        :rules="ruleFormR"
      >
        <FormItem label="" prop="roles">
          <!-- {{roleList}} -->
          <CheckboxGroup v-model="formItemR.roles">
            <Checkbox
              :label="item.value"
              v-for="(item, index) in roleList"
              :key="index"
            >
              <span>{{ item.label }}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem style="text-align: center;">
          <Button type="primary" @click="dispatchRole">确认</Button>
          <Button type="ghost" @click="cancelRoleModal">关闭</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import userForm from "@/components/global/userForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      type: "",
      id: "",
      userId: "",
      modal: false,
      pwdModal: false,
      roleModal: false,
      doTitle: "",
      parkList: [],
      mchList: [],
      roleList: [],
      mode: "",
      content: "",
      sucessMsg: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "用户名",
          key: "accName"
        },
        {
          title: "用户姓名",
          key: "realName"
        },
        {
          title: "手机号",
          key: "mobile"
        },
        {
          title: "归属景区",
          key: "parkName"
        },
        {
          title: "状态",
          key: "accStatus",
          render: (h, params) => {
            return h("span", params.row.accStatus == "F" ? "禁用" : "启用");
          }
        },
        {
          title: "创建人/时间",
          render: (h, params) => {
            let createBy = params.row.createBy;
            let createTime = params.row.createTime;
            return h("div", [
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                createBy
                // createBy + '/' + createTime
              ),
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                createTime
              )
            ]);
          }
        },
        {
          title: "更新人/时间",
          render: (h, params) => {
            let modifyBy = params.row.modifyBy;
            let modifyTime = params.row.modifyTime;
            return h("div", [h("p", modifyBy), h("p", modifyTime)]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            let { id, accStatus } = params.row;
            const actions = [
              {
                title: accStatus == "F" ? "启用" : "禁用",
                action: () => {
                  this.mode = "done";
                  this.sucessMsg =
                    (accStatus == "F" ? "启用" : "禁用") + "成功！";
                  this.content =
                    "确认" + (accStatus == "F" ? "启用" : "禁用") + "？";
                  this.$refs.confirmModel.confirm(
                    "/admin/webapi/userInfo/enable?ids=" +
                      id +
                      "&enable=" +
                      (accStatus == "F" ? "T" : "F")
                  );
                }
              },
              {
                title: "详情",
                action: () => {
                  this.showModal("see", params.row);
                }
              },
              {
                title: "修改",
                action: () => {
                  this.showModal("edit", params.row);
                }
              },
              {
                title: "删除",
                action: () => {
                  this.del(params.row.id);
                }
              },
              {
                title: "重置密码",
                action: () => {
                  this.showPwdModal(params.row);
                }
              },
              {
                title: "角色分配",
                action: () => {
                  this.showRoleModal(params.row);
                }
              }
            ];
            // if(){

            // }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      statusList: [
        {
          value: "",
          label: "--请选择用户状态--"
        },
        {
          value: "T",
          label: "启用"
        },
        {
          value: "F",
          label: "禁用"
        }
      ],
      data: "",
      params: { page: 1, limit: 10 },
      url: "/admin/userInfo/grid",
      formItemt: {
        parkId: "",
        accStatus: "",
        mobile: "",
        realName: "",
        accName: "",
        department: "",
        mchId: ""
      },
      ruleFormt: {
        parkId: [
          { required: true, message: "请选择归属景区", trigger: "change" }
        ],
        realName: [
          { required: true, message: "请填写用户姓名", trigger: "blur" }
        ],
        accName: [{ required: true, message: "请填写用户名", trigger: "blur" }],
        mobile: [{ required: true, message: "请填写手机号", trigger: "blur" }],
        accStatus: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      },
      formItemR: {
        roles: []
      },
      ruleFormR: {
        roles: [
          {
            required: true,
            message: "请选择角色",
            type: "array",
            min: 1,
            trigger: "change"
          }
        ]
      }
    };
  },
  components: { userForm, gridTable, confirm },
  mounted() {
    this.apiGet("/admin/api/mchInfo/loadParks").then(res => {
      if (res.success || res.status == 200) {
        this.parkList = res.parks;
      }
    });
    this.apiPost("/product/api/showTicketApi/add").then(res => {
      if (res.success || res.status == 200) {
        this.mchList = res.mch;
      }
    });
  },
  methods: {
    del(id) {
      this.mode = "done";
      this.content = "确认删除吗?";
      this.sucessMsg = "删除成功!";
      this.$refs.confirmModel.confirm("/admin/userInfo/delete/?id=" + id);
    },
    showModal(wTd, data) {
      this.type = wTd;
      this.modal = true;
      if (this.type == "add") {
        this.doTitle = "新增用户";
        this.formItemt.parkId = "";
        this.formItemt.accStatus = "";
        this.formItemt.mobile = "";
        this.formItemt.realName = "";
        this.formItemt.accName = "";
        this.formItemt.department = "";
        this.formItemt.mchId = "";
      } else if (this.type == "edit") {
        this.doTitle = "用户修改";
        this.id = data.id;
        // this.formItemt = data;
        this.formItemt.accStatus = data.accStatus;
        this.formItemt.mobile = data.mobile;
        this.formItemt.realName = data.realName;
        this.formItemt.accName = data.accName;
        this.formItemt.department = data.department;
        this.formItemt.mchId = data.mchId;
        this.formItemt.parkId = data.parkId + "";
      } else {
        this.doTitle = "用户详情";
        this.id = data.id;
        // this.formItemt = data
        this.formItemt.accStatus = data.accStatus;
        this.formItemt.mobile = data.mobile;
        this.formItemt.realName = data.realName;
        this.formItemt.accName = data.accName;
        this.formItemt.department = data.department;
        this.formItemt.mchId = data.mchId;
        this.formItemt.parkId = data.parkId + "";
      }
    },
    showPwdModal(item) {
      this.pwdModal = true;
      this.id = item.id;
    },
    showRoleModal(data) {
      this.roleModal = true;
      this.userId = data.id;
      this.apiGet("/admin/api/sys/role/distribute", { id: this.userId }).then(
        res => {
          if (res.status == 200 || res.sucess) {
            let rArr = [];
            let checkeArr = [];
            let obj = {};
            res.userRoles.forEach((item, index) => {
              obj = {
                value: item.sysRole.id,
                label: item.sysRole.roleName
              };
              if (item.checked) {
                checkeArr.push(item.sysRole.id);
              }
              rArr.push(obj);
            });
            this.roleList = rArr;
            this.formItemR.roles = checkeArr;
          }
        }
      );
    },
    dispatchRole() {
      let postParams = JSON.parse(JSON.stringify(this.formItemR));
      postParams.roles = postParams.roles.join(",");
      postParams.userId = this.userId;
      this.apiPost("/admin/api/sys/role/distributeRole", postParams).then(
        res => {
          if (res.status == 200 || res.success) {
            let msg = res.message ? res.message : "操作成功！";
            this.$Message.success(msg);
            this.$store.dispatch("postApi");
            this.roleModal = false;
          } else {
            let msg = res.message ? res.message : "操作失败！";
            this.$Message.warning(msg);
          }
        }
      );
    },
    cancel() {
      this.modal = false;
    },
    cancelRoleModal() {
      this.roleModal = false;
    },
    closePwd() {
      this.pwdModal = false;
    },
    queren() {
      this.apiGet("/admin/userInfo/resetPassword", { id: this.id }).then(
        res => {
          if (res.status == 200 || res.success) {
            let msg = res.message ? res.message : "操作成功！";
            this.$Message.success(msg);
            this.pwdModal = false;
          } else {
            let msg = res.message ? res.message : "操作失败！";
            this.$Message.warning(msg);
          }
        }
      );
    },
    submit() {
      this.$refs.formItemt.validate(async valid => {
        this.scrollError();
        if (valid) {
          let url = "";
          if (this.type == "add") {
            url = "/admin/userInfo/saveUserInfo";
          }
          if (this.type == "edit" || this.type == "see") {
            url = "/admin/userInfo/updateUserInfo";
            this.formItemt.id = this.id;
          }
          this.apiPost(url, this.formItemt).then(res => {
            if (res.status == 200 || res.success) {
              let msg = res.message ? res.message : "新增成功";
              this.$Message.success(msg);
              this.$store.dispatch("postApi");
              this.modal = false;
            } else {
              let msg = res.message ? res.message : "新增失败";
              this.$Message.warning(msg);
            }
          });
        }
      });
    },
    scrollError() {
      let errList = $(".ivu-form-item-error");
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top;
        $("#content").animate(
          {
            scrollTop: scroll_offset
          },
          300
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.choose-file {
  color: #2d8cf0;
  display: block;
  border: 1px solid #2d8cf0;
  padding: 0 30px;
  border-radius: 5px;
  height: 28px;
  line-height: 28px;
}
</style>
