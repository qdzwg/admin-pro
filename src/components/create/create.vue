<template>
  <div class="custom-page">
    <div :style="{width:width}" class="clearfix handel-box">
      <!-- {{list2}} -->
      <Button @click="preview" type="primary">保存并预览</Button>
      <Button style="margin-right:10px;" class="save" @click="save" type="info">保存</Button>
    </div>
    <create @sendPageData="getPageData" ref="custompage"></create>
    <Modal v-model="modal1" title="服务过期提示" @on-ok="ok" @on-cancel="cancel">
      <div>
        <!-- 当前微信小程序续费过期或者未开通小程序服务,请前往 -->
        您未订购营销中心-应用市场的【微信小程序】或该服务已过期，
        <!-- <span style="color: blue;cursor: pointer;font-size:14px" @click="goUrl">营销中心-应用市场</span>购买/续费， -->
        {{isWap?'请及时订购，本次操作不会更新小程序页面，请知晓！':"请及时订购。"}}
      </div>
      <div slot="footer">
        <template v-if="!isPreview">
          <Button @click="goUrl" style="margin-right:10px;" type="primary">订购</Button>
          <Button class="save" @click="realSave" type="info">保存</Button>
        </template>
        <template v-else>
          <Button class="save" @click="modal1=false">取消</Button>
          <Button class="save" @click="realSave('preview')" type="info">保存</Button>
        </template>
      </div>
    </Modal>

    <Modal v-model="modal2" title="服务过期提示" @on-ok="ok" @on-cancel="cancel">
      <div>
        <!-- 当前微信小程序续费过期或者未开通小程序服务,请前往 -->
        您未订购营销中心-应用市场的【PC主页】或该服务已过期，
        <!-- <span style="color: blue;cursor: pointer;font-size:14px" @click="goUrl">营销中心-应用市场</span>购买/续费， -->
        {{isWap?'请及时订购，本次操作不会更新小程序页面，请知晓！':"请及时订购。"}}
      </div>
      <div slot="footer">
        <template v-if="!isPreview2">
          <Button @click="goUrl" style="margin-right:10px;" type="primary">订购</Button>
          <Button class="save" @click="realSave" type="info">保存</Button>
        </template>
        <template v-else>
          <Button class="save" @click="modal1=false">取消</Button>
          <Button class="save" @click="realSave('preview')" type="info">保存</Button>
        </template>
      </div>
    </Modal>

    <!-- 预览 -->
    <Modal width="700" v-model="preLookModal" title="预览">
      <div v-if="showPcUrl" class>
        <span>PC官网主页链接：{{pcUrl}}</span>
        <Button
          v-clipboard:copy="pcUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >复制链接</Button>
      </div>
      <div v-if="showWapUrl">
        <span>领取短链接：{{copyUrl}}</span>
        <Button
          v-clipboard:copy="copyUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >复制</Button>
        <Button
          v-clipboard:copy="copyLongUrl"
          v-clipboard:success="onCopy2"
          v-clipboard:error="onError2"
        >复制长链接</Button>
        <p>
          <span>
            领取二维码:
            <a :href="codeUrl" download>下载二维码</a>
          </span>
        </p>
        <p style="background:yellow;padding:5px 0;margin-top:5px;">扫一扫查看，推荐使用支付宝、微信、手机浏览器 全员推广请使用长链接</p>
        <center id="target" style="margin-top:20px;">
          <qrcode :value="qrcodeUrl" :options="{ size: 170}"></qrcode>
        </center>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { apiPost, apiGet } from "@/fetch/api";
import create from "@/components/create";
import QRcode from "@xkeshi/vue-qrcode";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      codeUrl: "", //二维码图片
      qrcodeUrl: "zz", //生成二维码地址
      copyUrl: "", //短链接
      copyLongUrl: "", //长链接
      preLookModal: false,
      modal1: false,
      width: "",
      wxxcx: false, //是否购买微信小程序权限默认false
      isSmall: false, //当前自定义页面是否是小程序主页默认false,
      isWap: false, //当前自定义页面是否是wap主页的默认程序 默认false
      isPreview: false,
      cityWebsite: false,
      isPc: false, //当前自定义页面是否是pc主页的默认程序 默认false
      isPreview2: false,
      modal2: false,
      showPcUrl: false,
      showWapUrl: false,
      pcUrl: ""
    };
  },
  components: {
    create,
    qrcode: QRcode
  },
  created() {
    // console.log('fbgbb26655+');
    //权限
    // apiGet(
    //   "/marketing/api/market/selectServiceUse?merchantInfoId=" +
    //     window.localStorage.getItem("xjsc_merchantInfoId_2018_11_13_czc") +
    //     "&serviceType=wxxcx"
    // ).then(res => {
    //   this.wxxcx = res.data["wxxcx"];
    // });
    // apiGet(
    //   "/marketing/api/market/selectServiceUse?merchantInfoId=" +
    //     window.localStorage.getItem("xjsc_merchantInfoId_2018_11_13_czc") +
    //     "&serviceType=cityWebsite"
    // ).then(res => {
    //   this.cityWebsite = res.data["cityWebsite"];
    // });
  },
  computed: {
    ...mapState({
      list2: state => {
        return state.defined.list;
      }
    })
  },
  mounted() {
    let _this = this;
    this.width = $("#app").width() - 220 + "px";
    $(window).resize(function() {
      _this.width = $("#app").width() - 220 + "px";
      // console.log(_this.width)
    });

    //编辑页面过来
    if (this.$route.query && this.$route.query.id) {
      this.$refs.custompage.getData(
        "/merchant/webApi/merchantRenovationTob/getRenovationById"
      );
    }
    //模板选择过来
    if (this.$route.query && this.$route.query.templateId) {
      this.$refs.custompage.baseTemplate(
        "/merchant/webApi/merchantTemplateInfoTob/getTemplateById?id=" +
          this.$route.query.templateId
      );
    }
  },
  methods: {
    ...mapActions("defined", ["setErrorShow"]),
    onCopy() {
      this.$Message.success("复制成功！");
    },
    onError() {
      this.$Message.error("复制失败！");
    },
    onCopy2() {
      this.$Message.success("复制成功！");
    },
    onError2() {
      this.$Message.error("复制失败！");
    },
    //预览   生成二维码
    showQr(id, pageType) {
      let _this = this;
      apiGet(
        "/merchant/webApi/merchantRenovationTob/getExtendUrl?id=" +
          id +
          "&&pageType=" +
          pageType
      ).then(res => {
        if (res.status == 200) {
          this.pcUrl = res.data.pcUrl;
          if (this.isPc && (this.pcWebsite||this.cityWebsite) && this.pcUrl != "") {
            // window.location.href = this.pcUrl;
            window.open(this.pcUrl);
          } else {
            this.preLookModal = true;
          }
          this.qrcodeUrl = res.data.qrCodeLongUrl;
          this.copyUrl = res.data.qrCodeUrl;
          this.copyLongUrl = res.data.qrCodeLongUrl;
          this.showPcUrl = res.data.pc_use_flag == "T" ? true : false;
          // this.showWapUrl = res.data.wap_use_flag == 'T'||res.data.small_use_flag == 'T' ? true : false;
          this.showWapUrl = !(
            res.data.wap_use_flag == "F" &&
            res.data.small_use_flag == "F" &&
            res.data.pc_use_flag == "T"
          )
            ? true
            : false;

          //把生成的二维码转换成图片
          this.$nextTick(function() {
            if (this.showWapUrl) {
              let canvasData = $("#target").children("canvas");
              _this.codeUrl = canvasData[0].toDataURL();
            }
            // let canvasData = $("#target").children("canvas");
            // _this.codeUrl = canvasData[0].toDataURL();
          });
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    preview() {
      // console.log(this.list2.length, this.$refs.custompage.checkVal)
      //预览
      if (this.list2 && this.list2.length) {
        this.$refs.custompage.check();
        if (this.$refs.custompage.checkVal) {
          // console.log(this.list2.length, this.$refs.custompage.checkVal)
          // if (!this.wxxcx && this.isSmall) {
          //   //未购买微信小程序服务并且当前自定义页面是当前店铺小程序主页的时候，需要弹框提示
          //   this.isPreview = true;
          //   this.modal1 = true;
          // } else if ((!this.pcWebsite ||!this.cityWebsite )&& this.isPc) {
          //   //未购买PC主页服务并且当前自定义页面是当前店铺PC主页的时候，需要弹框提示
          //   this.isPreview2 = true;
          //   this.modal2 = true;
          // } else {
          //   this.realSave("preview");
          // }
          this.realSave("preview");
        }  
      } else {
        this.$Message.warning("请添加组件");
      }
    },
    goUrl() {
      this.$router.push("/market-apply");
    },
    getPageData(data) {
      this.pageType = data.renovationPageType;
      if (data.smallUseFlag == "T") {
        //判断但当前的自定义页面是微信小程序使用的话，保存的时候用于判断
        this.isSmall = true;
      } else {
        this.isSmall = false;
      }
      if (data.pcUseFlag == "T") {
        this.isPc = true;
      } else {
        this.isPc = false;
      }
      this.isWap = data.wapUseFlag == "T";
    },
    ok() {},
    cancel() {},
    realSave(handletype) {
      // handletype.是保存还是预览，默认保存
      let productJson = {},
        strategyJson = {};
      let pageSetData = this.$refs.custompage.pageSetData;
      let url = "/merchant/webApi/merchantRenovationTob/saveRenovation";

      let comList = JSON.parse(JSON.stringify(this.list2));

      comList.forEach((item, index) => {
        if (item.category == "strategy") {
          //攻略
          item.data.dataList.forEach((it, i) => {
            strategyJson[it.merchantStrategyId] = {
              strategyId: it.merchantStrategyId + ""
            };
            comList[index].data.dataList[i] = {
              strategyId: it.merchantStrategyId
                ? it.merchantStrategyId + ""
                : ""
            };
          });
        } else if (item.category == "strategyGroup") {
          //攻略分组
          item.data.list.forEach((it, i) => {
            it.dataList.forEach((el, elIndex) => {
              strategyJson[el.merchantStrategyId] = {
                strategyId: el.merchantStrategyId + ""
              };
              comList[index].data.list[i].dataList[elIndex] = {
                strategyId: el.merchantStrategyId
                  ? el.merchantStrategyId + ""
                  : ""
              };
            });
          });
        } else if (item.category == "productGroup") {
          //产品分组
          item.data.list.forEach((it, i) => {
            it.data.forEach((el, elIndex) => {
              productJson[el.productCode] = {
                productCode: el.productCode
              };
              comList[index].data.list[i].data[elIndex] = {
                productCode: el.productCode
              };
            });
          });
          // comList[index].data.list.forEach((it,i)=>{
          //   it.data.forEach((el,elIndex)=>{

          //   })
          // })
        } else if (item.category == "product") {
          //产品
          item.data.list.forEach((it, i) => {
            productJson[it.productCode] = {
              productCode: it.productCode
            };
            comList[index].data.list[i] = {
              productCode: it.productCode
            };
          });
        }
        if (item.category == "freeLayout") {
          //自定义布局
          let limitNum = 4;
          let val = item.data.type;
          if (val == "freeLayout1") {
            limitNum = 4;
          } else if (val == "freeLayout2") {
            limitNum = 2;
          } else if (val == "freeLayout3") {
            limitNum = 3;
          } else if (val == "freeLayout4") {
            limitNum = 3;
          } else if (val == "freeLayout5") {
            limitNum = 4;
          } else if (val == "freeLayout6") {
            limitNum = 3;
          } else if(val == "freeLayout7"){
            limitNum = 2;
          } else {
            // console.log("检查类型");
          }
          comList[index].data.list = comList[index].data.list.splice(
            0,
            limitNum
          );
        }
      });
      // console.log(productJson)

      // console.log(comList)
      apiPost(url, {
        id: this.$route.query.id
          ? this.$route.query.id
          : this.previewId
          ? this.previewId
          : "",
        content: JSON.stringify(comList),
        pageType: this.$refs.custompage.pageType,
        productJson: JSON.stringify(productJson),
        strategyJson: JSON.stringify(strategyJson),
        pageName: pageSetData.title,
        pageDescribe: pageSetData.describe,
        pageBack:
          pageSetData.backgroundSet != "customBgImg"
            ? pageSetData.color1
            : pageSetData.bgImg,
        backFlag: pageSetData.backgroundSet
      }).then(res => {
        if (handletype == "preview") {
          //预览
          // console.log(res);
          if (res.status == 200) {
            //保存成功后，页面操作是保存
            localStorage.setItem("curentPageType", "save");
            this.setErrorShow(false);
            this.$Message.success("保存成功!");
            this.previewId = res.data.id;
            this.showQr(res.data.id, res.data.renovationPageType);
            // this.$refs.custompage.
          } else {
            // console.log("11")
            if (res.message == "页面名称已存在") {
              //名字重复了
              $("#content").animate(
                {
                  scrollTop: 0
                },
                300
              );
              this.$Message.warning("页面名称已存在，请重新填写");
              this.$refs.custompage.headShow = true;
              this.$refs.custompage.editIndex = null;
            } else {
              this.$Message.warning(res.message ? res.message : "保存出错!");
            }
          }
        } else {
          if (res.status == 200) {
            //保存成功后，页面操作是保存
            localStorage.setItem("curentPageType", "save");
            this.setErrorShow(false);
            this.$Message.success(
              this.$route.query.id ? "编辑成功!" : "保存成功!"
            );
            this.$router.push("/customPage");
          } else {
            if (res.message == "页面名称已存在") {
              //名字重复了
              $("#content").animate(
                {
                  scrollTop: 0
                },
                300
              );
              this.$Message.warning("页面名称已存在，请重新填写");
              this.$refs.custompage.headShow = true;
              this.$refs.custompage.editIndex = null;
            } else {
              this.$Message.warning(res.message ? res.message : "保存出错!");
            }
          }
        }
      });
    },
    save() {
      this.isPreview = false;
      this.$refs.custompage.check();
      if (this.list2 && this.list2.length) {
        if (this.$refs.custompage.checkVal) {
          // wxxcx: false, //是否购买微信小程序权限默认false
          // isSmall: false //当前自定义页面是否是小程序主页默认false
          // if (this.wxxcx || !this.isSmall) {
          //   //在购买微信小程序服务或者当前自定页面不是当前店铺小程序主页的时候，直接保存
          //   this.realSave();
          // } else if (!this.wxxcx && this.isSmall) {
          //   //未购买微信小程序服务并且当前自定义页面是当前店铺小程序主页的时候，需要弹框提示
          //   this.modal1 = true;
          // } else if ((!this.pcWebsite||!this.cityWebsite) && this.isPc) {
          //   //未购买PC主页服务并且当前自定义页面是当前店铺PC主页的时候，需要弹框提示
          //   this.modal2 = true;
          // } else {
          //   this.realSave();
          // }
          this.realSave();
        }
      } else {
        this.$Message.warning("请添加组件");
      }
    }
  }
};
</script>
<style lang="scss">
.custom-page {
  .handel-box {
    position: fixed;
    z-index: 99;
    bottom: 0px;
    text-align: center;
    // background: #ffffff;
    padding-bottom: 7px;
  }
}
</style>

