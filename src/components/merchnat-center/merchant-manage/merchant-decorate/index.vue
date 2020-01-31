<template>
  <div>
    <Tabs value="name1">
      <TabPane label="基础模板" name="name1">
        <div>
          <Button type="primary" @click="submit">提交</Button>
          <Row class="modal-warper" :gutter="24">
            <Col v-for="(item,index) in imgList" :key="index" span="6">
            <div class="selected" :class='{active:activeIndex==item.id,"img-active":selectImgIndex==item.id}'>
              <div @click="activeIndex=item.id" class="modelSelect">
                <img :src="item.picUrl" alt="">
              </div>
            </div>
            </Col>
          </Row>
        </div>
      </TabPane>
      <TabPane label="自定义模板" name="name2">
        <div style="overflow:auto">
          <div class='index-handel-box'>
            <Button type="primary" @click="save">保存自定义模板</Button>
            <Button v-if="status" type="primary" @click="done">
              <span>启用</span>
            </Button>
            <Button v-else type="warning" @click="stop">
              <span>禁用</span>
            </Button>
            <!-- <Button v-if='islook' @click="look" type="success">预览</Button>
                    <Button v-else @click="look" type="success">取消预览</Button> -->
          </div>
          {{qrcodeUrl}}
          <div v-if='show' class="index-qrcode-warper">
            <qrcode :value="qrcodeUrl" :options="{ size: 100 }">
            </qrcode>
          </div>
          <span style="float:left;margin-top:43px;font-size:16px:color:#999">扫一扫预览</span>
        </div>

        <index-defined @setStaut='set' ref="userDefined"></index-defined>
      </TabPane>
      <!-- <TabPane label="标签三" name="name3">标签三的内容</TabPane> -->
    </Tabs>
    <Modal v-model="confirmModel" width="360" class-name="ivu-confirm-modal">
      <p slot="header" style="color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>信息确认</span>
      </p>
      <div>
        <p style="color:red;font-size:14px">
          {{handleState=='done'?'启用后C端将更换为自定义模板，请确定！':'禁用后C端将更换为基础模板，请确定'}}
        </p>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="error" :loading='btnLoading' @click="ok">确认</Button>
        <Button type="ghost" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import indexDefined from "@/components/otherRouter/indeUserDefined/index.vue";
import confirm from "@/components/global/confirm";
import { apiGet, apiPost } from "@/fetch/api";
import QRcode from "@xkeshi/vue-qrcode";
export default {
  data() {
    return {
      state: "",
      btnLoading: false,
      handleState: "",
      confirmModel: false,
      selectImgIndex: null,
      activeIndex: null,
      imgList: [],
      status: null,
      id: null,
      islook: true,
      qrcodeUrl: "",
      show: false,
      flag: true
    };
  },
  created() {
    this.getData();
    apiGet("/merchant/merchantInfo/getUserMerchantInfo").then(res => {
      this.qrcodeUrl = "testwap.lotsmall.cn/showNewIndex?m_id=" + res.id;
      this.show = true;
    });
  },
  components: {
    confirm,
    indexDefined,
    qrcode: QRcode
  },
  methods: {
    ok() {
      this.btnLoading = true;
      apiGet(
        (this.handleState == "done"
          ? "/merchant/merchantTemplateCustom/enableTemplate?id="
          : "/merchant/merchantTemplateCustom/disableTemplate?id=") +
          this.id +
          "&t=" +
          new Date().getTime()
      ).then(res => {
        if (res.success) {
          this.status = !this.status;
          this.$refs.userDefined.getTemplateData();
          this.$Message.success(
            this.handleState == "done" ? "启用成功！" : "禁用成功！"
          );
        }
        this.confirmModel = false;
        this.btnLoading = false;
      });
    },
    cancel() {
      this.confirmModel = false;
    },
    done() {
      if (this.id) {
        // this.handlerUrl = "/merchant/merchantTemplateCustom/enableTemplate?id=";
        this.handleState = "done";
        this.confirmModel = true;
      } else {
        this.$Message.warning("请先创建模板");
      }
    },
    stop() {
      // this.handlerUrl = "/merchant/merchantTemplateCustom/disableTemplate?id=";
      this.handleState = "stop";
      this.confirmModel = true;
    },
    getData() {
      apiGet("/merchant/merchantInfo/decorateFL").then(res => {
        //   console.log(res.data);
        this.imgList = res.data.templates;
        this.selectImgIndex =
          res.data.merchantTemplateInfo && res.data.merchantTemplateInfo.id
            ? res.data.merchantTemplateInfo.id
            : null;
        this.activeIndex =
          res.data.merchantTemplateInfo && res.data.merchantTemplateInfo.id
            ? res.data.merchantTemplateInfo.id
            : null;
      });
    },
    look() {
      this.islook = !this.islook;
      this.$refs.userDefined.setPadding();
    },
    submit() {
      apiPost("/merchant/merchantTemplateUse/saveTemplate", {
        merchantTemplateInfoId: this.activeIndex
      }).then(res => {
        if (res.success) {
          this.$Message.success("提交成功！");
          this.getData();
        } else {
          this.$Message.warning("提交失败！");
        }
      });
    },
    save() {
      this.$refs.userDefined.save();
    },
    set(status, id) {
      if (this.flag) {
        this.status = status == "1" ? false : true;
        this.state = status;
        this.flag = false;
      }
      this.id = id;
    }
  }
};
</script>
<style scoped lang="scss">
.index-handel-box {
  padding-bottom: 20px;
  margin-top: 35px;
  float: left;
  margin-right: 7px;
}
.index-qrcode-warper {
  float: left;
}
.modelSelect {
  padding: 10px;
  position: relative;
  img {
    width: 100%;
  }
}
.modelSelect:hover {
  border: 2px solid #d50000;
  padding: 8px;
}
.selected.active {
  .modelSelect {
    border: 2px solid #d50000;
    padding: 8px;
  }
}

.selected {
  position: relative;
}
.selected.img-active:after {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 63px;
  height: 78px;
  background: url(../../../../assets/images/selected.png);
}
.modal-warper {
  margin-top: 20px;
}
.save-btn {
  margin-bottom: 15px !important;
}
</style>
