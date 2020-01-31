<template>
  <div class="user-manage">
    <page-template
      :search-items="searchItems"
      :columns="columns"
      pageFlag
      :url="url"
      ref="pageWrap"
    >
      <Row v-if="pageBtnParams.length" slot="topbtn" slot-scope="slotProps">
        <Button
          class="page-btn"
          :type="item.type"
          :icon="item.icon"
          v-for="(item, index) in pageBtnParams"
          @click="actionBtns(index, slotProps.selectedList)"
          :key="index"
          >{{ item.name }}</Button
        >
      </Row>
    </page-template>
    <edit-role
      :id="id"
      v-model="modal"
      :customTypeList="customTypeList"
      :authType="authType"
    ></edit-role>
    <!-- 认证信息 -->
    <authCom v-model="authFlag" :id="id"></authCom>
    <config-com v-model="configFlag" :id="id"></config-com>
  </div>
</template>

<script>
import editRole from "./components/edit.vue";
import authCom from "./components/auth.vue";
import configCom from "./components/config.vue";
export default {
  data() {
    return {
      pageBtnParams: [
        {
          btnType: "router",
          link: "",
          icon: "android-add",
          type: "primary",
          name: "添加"
        }
      ],
      authType: [
        {
          value: "corp",
          label: "企业"
        },
        {
          value: "person",
          label: "个人"
        }
      ],
      customTypeList: [
        {
          value: "provider",
          label: "供应商"
        },
        {
          value: "travel",
          label: "旅行社"
        }
      ],
      searchItems: [
        {
          label: "用户名",
          type: "input",
          name: "accName"
        },
        {
          label: "企业名称",
          type: "input",
          name: "showName"
        }
      ],
      columns: [
        {
          title: "序号",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "用户名",
          key: "accName"
        },
        {
          title: "最后登录时间",
          sortable: true,
          key: "loginDate"
        },
        {
          title: "认证类型",
          key: "authType",
          render: (h, params) => {
            let { authType } = params.row;
            return h("span", this.$flType(authType, this.authType));
          }
        },
        {
          title: "个人/企业名称",
          key: "showName"
        },
        {
          title: "店铺id",
          key: "merchantInfoId"
        },
        {
          title: "状态",
          sortable: true,
          key: "accStatus",
          render: (h, params) => {
            let { accStatus } = params.row;
            return h("span", accStatus == "T" ? "启用" : "禁用");
          }
        },
        {
          title: "操作",
          key: "action",
          width: 400,
          align: "center",
          render: (h, params) => {
            let { accStatus, userInfoId, platId, showName, id } = params.row;
            let text = accStatus == "T" ? "禁用" : "启用";
            const actions = [
              {
                title: text,
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: "/admin/userStore/enabled",
                    param: {
                      enabled: accStatus == "T" ? "F" : "T",
                      id: userInfoId
                    },
                    content: `确定${text}吗?`
                  });
                }
              },
              {
                title: "删除",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: "/admin/userAuth/manageDel",
                    param: { userInfoId },
                    content: `确定删除吗?`
                  });
                }
              },
              {
                title: "重置密码",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: "/admin/userInfo/resetPlatPw",
                    param: { id: platId },
                    content: `确认操作吗?`,
                    isRefresh: false
                  });
                }
              },
              {
                title: "重置分销商账号",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: "/admin/userAuth/resetDistCorp",
                    param: { userInfoId },
                    content: `确认操作吗?`,
                    isRefresh: false
                  });
                }
              },
              {
                title: "个性化配置",
                action: () => {
                  this.configFlag = true;
                  this.userInfoId = userInfoId;
                }
              }
            ];
            if (showName) {
              actions.push({
                title: "认证信息",
                action: () => {
                  this.authFlag = true;
                  this.id = id;
                  // this.userInfoId = userInfoId;
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      params: { page: 1, limit: 10, sort: "modifyTime", order: "desc" },
      url: "/admin/userAuth/userManageGrid",
      modal: false,
      authFlag: false,
      configFlag: false,
      id: "",
      userInfoId: ""
    };
  },
  components: { editRole, authCom, configCom },
  mounted() {},
  methods: {
    actionBtns() {
      this.modal = true;
      this.id = "";
    }
  }
};
</script>

<style>
#mImg {
  max-width: 100px;
}
</style>
