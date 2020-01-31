<template>
  <div class="layout">
    <!-- {{testName}} -->
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
          :active-name="testName"
          @on-select="changeTab"
        >
          <div @click="goHome" class="layout-logo">
            <img src="../assets/images/index-logo.png" alt="" />
          </div>
          <div class="layout-nav">
            <MenuItem
              v-for="item in menuList.data"
              :key="item.id"
              :name="item.funCode"
            >
              {{ item.funName }}
            </MenuItem>
          </div>
          <div class="layout-userinfo">
            <span class="userinfo">欢迎（{{ userName }}）登录</span>
            <Dropdown style="margin-left: 20px">
              <a href="javascript:void(0)">
                <Icon type="chevron-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem class="down-item">
                  <div class="down-item-handle" @click="info">个人信息</div>
                </DropdownItem>
                <DropdownItem class="down-item">
                  <div class="down-item-handle" @click="password">修改密码</div>
                </DropdownItem>
                <DropdownItem class="down-item">
                  <div class="down-item-handle" @click="loginOut">退出</div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger class="page-left">
          <Menu
            ref="contactMenu"
            :active-name="$route.name"
            theme="light"
            width="auto"
            :accordion="true"
            :open-names="vexOpenNames ? [vexOpenNames] : openNames"
            @on-select="changeMenu"
          >
            <Submenu
              v-for="item in subMenuList.list"
              :name="item.funCode"
              :key="item.id"
            >
              <template slot="title">
                <!-- <Icon type="ios-navigate"></Icon> -->
                {{ item.funName }}
              </template>
              <MenuItem
                v-for="sitem in item.list"
                :name="sitem.funCode"
                :key="sitem.id"
              >
                <span>{{ sitem.funName }}</span>
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout id="content">
          <Breadcrumb class="breadcrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem
              v-for="(item, index) in breadcrumbList"
              :key="index"
              >{{ item }}</BreadcrumbItem
            >
          </Breadcrumb>
          <Content class="content">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import store from "@/store";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      subMenuList: [],
      openNames: "",
      activeName: "",
      userName: this.$cookies.get("userName"),
      accType: "",
      logoUrl: "",
      activeDate: new Date().getTime(),
      imgShow: false,
      padding: ""
    };
  },
  // beforeRouteUpdate (to, from, next) {
  //   // 在当前路由改变，但是该组件被复用时调用
  //   // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
  //   // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  //   // 可以访问组件实例 `this`
  //   // next()
  // },
  store,
  created() {
    if(!this.$cookies.get('isSuperAdmin'))
    apiGet("/merchant/merchantInfo/getMerchantInfo").then(data => {
      if (data.status==200) {
        window.localStorage.setItem(
          "xjsc_merchantInfoId_2018_11_13_czc",
          data.data.id
        );
      } else {
        this.$Message.warning('店铺id获取失败!');
      }
    }).catch(err=>{
      this.$Message.warning('店铺id获取失败!');
    });

    //firefox
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("firefox") > 0) {
      this.padding = "80px";
    }
  },
  computed: {
    isUserDefine() {
      return this.$store.state.defined.userDefine;
    },
    vexOpenNames() {
      return this.$store.state.menu.openName;
    },
    testName() {
      return this.$store.state.menu.activeName;
    },
    menuList() {
      return this.$store.state.menu.menuList;
    },
    breadcrumbList() {
      return this.$route.meta.breadcrumbList;
    }
  },
  watch: {
    testName(newValue, oldValue) {
      this.$store.state.menu.menuList.data.forEach(element => {
        if (element.funCode === newValue) {
          this.subMenuList = element;
        }
      });
    },
    vexOpenNames(newValue) {
      // this.openName = [newValue]
      this.$nextTick(() => {
        this.$refs.contactMenu.updateOpened();
        this.$refs.contactMenu.updateActiveName();
      });
    },
    $route(v) {}
  },
  mounted() {
    this.loadpage();
  },
  methods: {
    goHome() {
      
    },
    info(val) {
      this.$router.push('/memberInfo');
    },
    password() {
      this.$router.push('/editPwd')
      // window.location.href = "/editPwd";
    },
    loginOut() {
      apiGet("/admin/storeMerchant/loginOut").then(res => {
        if (res.success) {
          this.$cookies.remove("xiaojingToken");
          this.$cookies.remove("userId");
          // localStorage.removeItem("xjsc_2018_token");
          // localStorage.removeItem("xjsc_2018_userId");

          window.location.href = "/login";
        } else {
          this.$cookies.remove("xjsc_2018_token");
          this.$cookies.remove("xjsc_2018_userId");
          window.location.href = "/login";
        }
      });
    },
    changeMenu(active) {
      if (active === "aa890897878") {
        // 如果点击店铺设置 - 全员营销 跳转 全员营销 全员配置
        active = "peizhi";
      }
      // this.$emit("on-change", active);
      this.$router.push("/" + active);
      this.subMenuList.list.forEach(element => {
        element.list.forEach(item => {
          if (item.funCode === active) {
            this.$cookies.set("openName", element.funCode);
          }
        });
      });
    },
    changeTab(active) {
      this.menuPosite(active);
      this.$cookies.set("activeName", active);
      this.openNames = [this.subMenuList.list[0].funCode];
      this.$router.push("/" + this.subMenuList.list[0].list[0].funCode);
      this.$nextTick(() => {
        this.$refs.contactMenu.updateOpened();
        this.$refs.contactMenu.updateActiveName();
      });
    },
    async loadpage() {
      await this.$store.dispatch("getApi");
      this.$store.dispatch("formaterRouterHandle");

      this.openNames = [this.$route.meta.openName];
      this.menuPosite(this.$route.meta.belongTab);
      this.$nextTick(() => {
        this.$refs.contactMenu.updateOpened();
        this.$refs.contactMenu.updateActiveName();
      });
    },
    menuPosite(active) {
      this.$store.state.menu.menuList.data.forEach(element => {
        if (element.funCode === active) {
          this.subMenuList = element;
        }
      });
    }
  }
};
</script>

<style>
@import url("../assets/styles/main.css");
</style>

<style scoped>
.sidebar-box {
  margin-right: 10px;
}
.sidebar-box ul {
  display: flex;
  justify-content: space-around;
  color: #fff;
  font-size: 14px;
}
.sidebar-box ul li {
  line-height: 60px;
  list-style: none;
  padding: 0 10px;
}
.sidebar-box ul li a {
  color: #fff;
  transition: all 0.5s;
}
.sidebar-box ul li a img {
  vertical-align: middle;
}
#content {
  background: #fff;
  /* background-color: #f7f7f7; */
}
.down-item {
  padding: 0px;
  height: 30px;
  line-height: 30px;
}
.down-item.down-item-handle {
  display: inline-block;
}
.layout {
  background: #f5f7f9;
  position: relative;
  overflow: hidden;
  height: 100%;
}
.layout-logo {
  width: 130px;
  /* height: 30px; */
  /* background: #5b6270; */
  /* border-radius: 3px; */
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-logo img {
  width: 130px;
  float: left;
  height: 28px;
}
.layout-nav {
  margin: 0 auto;
  margin-left: 50px;
  float: left;
}
.breadcrumb {
  padding: 12px;
  text-align: left;
}
.page-left {
  background-color: #fff;
  height: 100%;
}
.layout-userinfo {
  float: right;
  color: #ffffff;
}
.ivu-icon-chevron-down {
  color: #ffffff;
  padding: 14px;
  padding: 23px 14px;
}
.ivu-icon-chevron-down:hover {
  background: rgba(250, 250, 250, 0.2);
}
.ivu-layout-header {
  height: 60px;
  line-height: 60px;
}
.ivu-layout-header {
  padding-left: 0px;
  padding: 0 20px;
}
</style>
