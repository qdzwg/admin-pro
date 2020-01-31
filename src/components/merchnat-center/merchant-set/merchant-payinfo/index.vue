<template>
  <div class="merchant-payinfo">
    <div class="contents">
      <div v-for="(item, index) in comList" :key="index">
        <div style="margin:10px 0;">
          <img :src="item.icon" alt="" />
          <span class="span">{{ item.name }}</span>
          <Button type="primary" @click="clickMode(item.key)">设置</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGet } from "@/fetch/api.js";
import { apiPost } from "@/fetch/api.js";
import { paySet } from "@/mixins/merchant";
export default {
  mixins: [paySet],
  components: {},
  data() {
    return {
      password: ""
    };
  },
  mounted() {
    // console.log(this.formItem2.transAuth)
  },
  methods: {
    async clickMode(key) {
      let self = this;
      this.$Modal.confirm({
        title: "登陆",
        render: h => {
          return h("Input", {
            props: {
              value: this.password,
              autofocus: true,
              type: "password",
              placeholder: "请输入密码"
            },
            style: {
              marginTop: "10px"
            },
            on: {
              input: val => {
                this.password = val;
              }
            }
          });
        },
        onOk: function() {
          if (self.password) {
            self
              .apiPost("/admin/userInfo/sensitiveCheck", {
                passWord: self.password
              })
              .then(res => {
                if (res.success || res.status == 200) {
                  self.$router.push({
                    path: "/managePayinfo",
                    query: { comKey: key }
                  });
                } else {
                  res.message && this.$Message.warning(res.message);
                }
              });
          } else {
            self.$Message.warning("请输入密码");
          }
        }
      });
    }
  }
};
</script>

<style scope>
.merchant-payinfo {
  width: 500px;
  margin: 50px auto;
}
.merchant-payinfo .contents img {
  width: 37px;
  height: 37px;
  vertical-align: middle;
}
.merchant-payinfo .contents div .span {
  display: inline-block;
  width: 160px;
  margin: 0 30px;
}
</style>
