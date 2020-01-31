<template>
  <Modal
    v-model="confirmModel"
    width="360"
    :mode="mode"
    class-name="ivu-confirm-modal"
    class="v-confirm-dom"
  >
    <p slot="header" style="color:#f60;">
      <Icon type="information-circled"></Icon>
      <span>{{title ? title : "信息确认"}}</span>
    </p>
    <div>
      <div v-html="content"></div>
    </div>
    <div slot="footer" style="text-align:center">
      <Button type="error" :loading="modal_loading" @click="ok">确认</Button>
      <Button type="ghost" @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      confirmModel: false,
      modal_loading: false,
      url: "",
      param: ""
    };
  },
  props: ["mode", "title", "content", "sucessMsg", "callback"],
  methods: {
    confirm(url, param) {
      this.url = url;
      this.param = param ? param : {};
      this.confirmModel = true;
    },
    cancel() {
      this.confirmModel = false;
    },
    ok() {
      // console.log(this.url)
      let _this = this;
      switch (this.mode) {
        //delete请求
        case "delete":
          _this.common.listDelete(_this, {
            url: _this.url,
            params: _this.param,
            callback: res => {
              if (res.success || res.status == 200) {
                this.$emit("okClick");
                this.$store.dispatch("postApi");
                this.$Message.success(
                  this.sucessMsg ? this.sucessMsg : "删除成功!"
                );
                _this.$emit("sucessDone");
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
          break;
        //POST
        case "post":
          _this.common.listPost(_this, {
            url: _this.url,
            params: _this.param,
            callback: res => {
              if (res.success || res.status == 200) {
                this.$emit("okClick");
                this.$store.dispatch("postApi");
                this.$Message.success(
                  this.sucessMsg ? this.sucessMsg : "设置成功!"
                );
                _this.$emit("sucessDone");
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
          break;
        //get请求
        case "done":
          _this.common.listDone(_this, {
            url: _this.url,
            params: _this.param,
            callback: res => {
              if (res.success || res.status == 200) {
                this.$emit("okClick")
                this.$store.dispatch("postApi");
                this.$Message.success(
                  this.sucessMsg ? this.sucessMsg : "操作成功!"
                );
                _this.$emit("sucessDone");
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
          break;
        case "forbidden":
          _this.common.listDone(_this, {
            url: _this.url,
            params: _this.param,
            callback: res => {
              if (res.success || res.status == 200) {
                this.$emit("okClick");
                this.$store.dispatch("postApi");
                this.$Message.success(
                  this.sucessMsg ? this.sucessMsg : "操作成功!"
                );
                _this.$emit("sucessDone");
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
        case "undefined":
          _this.common.listDone(_this, {
            url: _this.url,
            params: _this.param,
            callback: res => {
              if (res.success || res.status == 200) {
                this.$emit("okClick");
                this.$store.dispatch("postApi");
                this.$Message.success(this.sucessMsg);
              } else {
                this.$Message.warning(res.message);
              }
            }
          });
          break;
      }
      this.confirmModel = false;
    }
  }
};
</script>
<style>
.ivu-confirm-modal .ivu-modal{ top:50%; margin-top: -79px;}
</style>
