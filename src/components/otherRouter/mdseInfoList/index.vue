<template>
  <div class="mdseInfoList">
    <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleForm">
      <div id="base" class="form-title">基本信息</div>
      <FormItem label="商品名称：" prop="name">
        <Input v-model="formItem.name" style="width:33%" :maxlength="50"></Input>
      </FormItem>
      <FormItem label="商品类型：">
        <Select v-model="formItem.firstCategory" style="width:10%" @on-change="changeFirst">
          <Option v-for="(item,index) in firstCategorys" :key="index" :value="item.id + ''" :label="item.label">
          </Option>
        </Select>
        <Select v-model="formItem.secondCategory" style="width:10%" @on-change="changeSecond">
          <Option v-for="(el,i) in secondCategorys" :value="el.value + ''" :key="i" :label="el.label"></Option>
        </Select>
        <Select v-model="formItem.thirdCategory" style="width:10%">
          <Option v-for="(el,i) in thirdCategorys" :value="el.value + ''" :key="i" :label="el.label"></Option>
        </Select>
      </FormItem>
      <FormItem label="产地：" prop="address" :maxlength="50">
        <Input v-model="formItem.address" style="width:33%"></Input>
      </FormItem>
      <div id="senicInfo" class="form-title">商品信息</div>
      <FormItem label="商品描述：" prop="summary">
        <Input v-model="formItem.summary" type="textarea" :maxlength="500" :autosize="{minRows: 4,maxRows: 10}" style="width:33%"></Input>
        <!-- <ueditor id="ue7" ref="mustKnow7" :content="formItem.summary" :config="config"></ueditor> -->
      </FormItem>
      <FormItem v-if='ueShow' label="商品详情：" prop="content">
        <Input v-model="formItem.content" style="display:none"></Input>
        <ueditor id="ue222" ref="mustKnow8" :content="formItem.content" :config="config"></ueditor>
      </FormItem>
      <div>
        <!-- 外层div不要去除，去除会报错 -->
        <FormItem label="缩略图：" prop="linkMobileImg">
          <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
          <my-img :limitNum="1" :uploadList="wapImgList" @getImgUrl="setWapListUrl"></my-img>
          <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
        </FormItem>
      </div>
      <div>
        <!-- 外层div不要去除，去除会报错 -->
        <FormItem label="轮播图：" prop="wapUrl">
          <Input v-model="formItem.wapUrl" style="display:none"></Input>
          <my-img :limitNum="5" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
          <p>最多上传5张，建议上传小于1M， 宽750px，高440px的JPG/PNG格式的图片</p>
        </FormItem>
      </div>

      <div id="distSet" class="form-title">分销设置</div>
      <FormItem label="分销渠道：" prop="distType">
        <Select v-model="formItem.distType" style="width:200px" @on-change="distTypeHand">
          <Option :value="item.value" v-for="(item,index) in list" :key="index">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品别名：" prop="nickName" v-if="formItem.distType!='1'">
        <Input v-model="formItem.nickName" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="商品副标题：" prop="subTitle" v-if="formItem.distType!='1'">
        <Input v-model="formItem.subTitle" placeholder="用简短文字描述" style="width:33%" :maxlength="100"></Input>
      </FormItem>

      <FormItem v-if="formItem.distType=='0' ||formItem.distType=='2'" label="店铺展示起价：" prop="priceShow">
        <InputNumber v-model="formItem.priceShow" :min="0" :max="100000"></InputNumber> 元
      </FormItem>
      <FormItem v-if="formItem.distType=='0'||formItem.distType=='2'" label="店铺门市价：" prop="priceLine">
        <InputNumber v-model="formItem.priceLine" :min="0" :max="100000"></InputNumber> 元
      </FormItem>
      <FormItem v-if="formItem.distType=='0' ||formItem.distType=='2'" label="店铺虚拟销量：" prop="virtualSale">
        <InputNumber v-model="formItem.virtualSale" :min="0" :max="100000"></InputNumber>
      </FormItem>
      <FormItem v-if="formItem.distType=='0'||formItem.distType=='1'" label="分销展示价：" prop="priceDist">
        <InputNumber v-model="formItem.priceDist" :min="0" :max="100000"></InputNumber> 元
      </FormItem>
      <template v-if='ueShow'>
        <FormItem v-show="formItem.distType=='0'||formItem.distType=='2'" label="预订须知：" required>
          <ueditor id="ue3" ref="mustKnow3" :content="formItem.orderNotice" :config="config"></ueditor>
        </FormItem>
        <FormItem v-show="formItem.distType=='0'||formItem.distType=='1'" label="分销政策：" required>
          <ueditor id="ue4" ref="mustKnow4" :content="formItem.distPolicy" :config="config"></ueditor>
        </FormItem>
        <FormItem v-show="formItem.distType=='0'||formItem.distType=='1'" label="售后政策：" required>
          <ueditor id="ue5" ref="mustKnow5" :content="formItem.salePolicy" :config="config"></ueditor>
        </FormItem>
      </template>

      <!-- <FormItem v-show="formItem.distType=='0'||formItem.distType=='1'" label="分销区域限制：">
                <Select v-model="formItem.distAreaType" style="width:200px">
                    <Option value="all">无限制</Option>
                    <Option value="all2">限制区域</Option>
                </Select>
            </FormItem> -->

      <FormItem label="是否立即上架：" v-show='!pageType=="edit"'>
        <Select v-model="formItem.enabled" style="width:200px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
      </FormItem>
      
      <FormItem label="订单通知：" prop="tel" :rules="tel?{required: tel, validator: common.validate.phone, trigger: 'blur'}:{}">
          <Checkbox label="tel" @on-change='telChange' v-model="tel"></Checkbox>
          <Input v-model="formItem.tel" :disabled='!tel' style="width:300px;" placeholder="用于接收下单提示短信"></Input>
          <Button type="primary" @click="getModal">查看模板</Button>
      </FormItem>

      <FormItem prop="email" :rules="email?{required: email, validator: common.validate.email, trigger: 'blur'}:{}">
          <Checkbox label="email" @on-change='emailChange' v-model="email"></Checkbox>
          <Input v-model="formItem.email" :disabled='!email' style="width:300px;" placeholder="用于接收下单提示邮箱"></Input>
      </FormItem>

      <FormItem class="save-cancel">
        <Button type="primary" :loading='saveLoading' @click="submit">保存</Button>
        <Button type="ghost" @click="test" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
    <Modal v-model="model2" title="查看模板">
      <p>
        您有新的已支付商品订单，订单号{OrderCode}，商品名称{XXX}，X份，实付金额XX，请及时处理。
      </p>
      <div slot="footer">
        <Button @click="cancel">关闭</Button>
      </div>
      <!-- <Input type="textarea" v-model="formItem.text"></Input> -->
    </Modal>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('senicInfo')">商品信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('distSet')">分销设置</a>
        </li>
        <li>
          <Button size="small" @click="submit" type="primary" :loading='saveLoading'>保存</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
import store from "@/store";
import { apiPost, apiGet } from "@/fetch/api";
import myImg from "@/components/global/singleImg";
import { setTimeout } from "timers";
export default {
  //   beforeRouteEnter(to, from, next) {
  //     next(vm => {
  //       if (
  //         !store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)
  //       ) {
  //         vm.$router.back(); //如果没有就不会跳转
  //       }
  //     });
  //   },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      tel: false,
      email: false,
      model2: false,
      saveLoading: false,
      ueShow: false,
      thirdCategory: "",
      firstCategorys: [],
      secondCategorys: [],
      singleImgList: [],
      thirdCategorys: [],
      wapImgList: [],
      list: [
        {
          value: "0",
          label: "分销市场+店铺"
        },
        {
          value: "1",
          label: "仅分销市场"
        },
        {
          value: "2",
          label: "仅店铺"
        }
      ],
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formItem: {
        mdseInfoId: this.$route.query.id,
        name: "",
        areaAddr: "",
        address: "",
        summary: "",
        distType: "0",
        nickName: "",
        subTitle: "",
        priceShow: null,
        priceLine: null,
        virtualSale: null,
        priceDist: null,
        content: "", // 商品须知
        wapUrl: "",
        linkMobileImg: "",
        orderNotice: "", //预 定须知
        distPolicy: "", // 分销政策
        salePolicy: "", // 售后政策,
        distAreaType: "all",
        firstCategory: null,
        secondCategory: null,
        thirdCategory: "",
        enabled: "T"
      },
      firstCategory: null,
      secondCategory: null,
      falg: false,
      secondFalg: false,
      pageType: "",
      ruleForm: {
        name: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        distType: [
          { required: true, message: "请选择分销渠道", trigger: "change" }
        ],
        nickName: [
          { required: true, message: "请填写商品别名", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "请填写商品描述", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请填写商品详情", trigger: "blur" }
        ],
        subTitle: [
          { required: true, message: "请填写商品副标题", trigger: "blur" }
        ],
        linkMobileImg: [
          {
            required: true,
            message: "请选择缩略图",
            trigger: "blur"
          }
        ],
        wapUrl: [
          {
            required: true,
            message: "请选择轮播图",
            trigger: "blur"
          }
        ],
        priceShow: [
          {
            required: true,
            type: "number",
            message: "请填写店铺展示起价"
          },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: "不超过两位小数点"
          },
          {
            validator: validateNum,
            max: 6,
            message: "数值不能大于999999"
          }
        ],
        priceLine: [
          {
            required: true,
            type: "number",
            message: "请填写店铺门市价"
          },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: "不超过两位小数点"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        virtualSale: [
          {
            required: true,
            type: "number",
            message: "请填写店铺虚拟销量"
          },
          {
            pattern: /^[1-9]\d*$/,
            message: "数据格式不正确"
          }
        ],
        priceDist: [
          {
            required: true,
            type: "number",
            message: "请填写分销展示价"
          },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: "不超过两位小数点"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        address: [{ required: true, message: "请填写产地", trigger: "blur" }]
      }
    };
  },
  async created() {
    await this.getGorey();
    this.getList();
  },
  watch: {
    "formItem.firstCategory": "changeFirst",
    "formItem.secondCategory": "changeSecond"
    // "formItem.distType": "getList"
  },
  methods: {
    telChange(bool) {
      if(!bool){
        this.formItem.tel = '';
      }
    },
    emailChange(bool) {
      if(!bool){
        this.formItem.email = '';
      }
    },
    //设置模板
    getModal() {
      this.model2 = true;
    },
    cancel() {
      this.model2 = false;
    },
    getList() {
      if (this.$route.query && this.$route.query.id) {
        this.pageType = "edit";
        //保证只有修改时才获取详情
        apiGet("/product/api/mdse/getMdse?mdseInfoId=" + this.$route.query.id)
          .then(res => {
            this.ueShow = true;
            this.formItem = res.data;
            if(this.formItem.tel){
              this.tel = true;
            }
            if(this.formItem.email){
              this.email = true;
            }
            this.formItem.priceShow = res.data.priceShow
              ? res.data.priceShow
              : null;
            this.formItem.priceLine = res.data.priceLine
              ? res.data.priceLine
              : null;
            this.formItem.virtualSale = res.data.virtualSale
              ? res.data.virtualSale
              : null;
            this.formItem.priceDist = res.data.priceDist
              ? res.data.priceDist
              : null;
            this.formItem.firstCategory = res.data.firstCategory;
            this.formItem.secondCategory = res.data.secondCategory;
            this.formItem.thirdCategory = res.data.thirdCategory;
            this.wapImgList = res.data.linkMobileImg
              ? res.data.linkMobileImg.split(",")
              : [];
            this.singleImgList = res.data.wapUrl
              ? res.data.wapUrl.split(",")
              : [];
          })
          .catch(() => {
            this.$Message.error("初始化数据出错！");
          });
      }
    },
    distTypeHand() {
      if (this.$route.query.id) {
        apiGet(
          "/product/api/mdse/getMdse?mdseInfoId=" + this.$route.query.id
        ).then(res => {
          this.ueShow = true;
          this.formItem.priceShow = res.data.priceShow
            ? res.data.priceShow
            : null;
          this.formItem.priceLine = res.data.priceLine
            ? res.data.priceLine
            : null;
          this.formItem.virtualSale = res.data.virtualSale
            ? res.data.virtualSale
            : null;
          this.formItem.priceDist = res.data.priceDist
            ? res.data.priceDist
            : null;
        });
      }
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    changeFirst(val) {
      // this.formItem.firstCategory = val
      let _this = this;
      this.firstCategorys.forEach(function(d) {
        if (d.value == val) {
          _this.secondCategorys = d.children;
        }
      });
      if (this.falg) {
        this.thirdCategorys = [];
        this.formItem.secondCategory = "";
        this.formItem.thirdCategory = "";
      }
      this.falg = true;
    },
    changeSecond(val) {
      let _this = this;
      this.secondCategorys.forEach(function(d) {
        if (d.value == val) {
          _this.thirdCategorys = d.children;
        }
      });
      if (this.secondFalg) {
        this.formItem.thirdCategory = "";
      }
      this.secondFalg = true;
    },
    getGorey() {
      apiGet("/product/api/mdse/categoryList").then(res => {
        let data = res.data;
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        data.map((item, index) => {
          if (item.hierarchy == 0) {
            arr1.push({
              id: item.id,
              value: item.id,
              label: item.mdseName,
              children: []
            });

            data.map((el, i) => {
              if (el.hierarchy == 1 && item.id == el.parentId) {
                arr2.push({
                  parentId: el.parentId,
                  value: el.id,
                  label: el.mdseName,
                  children: []
                });

                data.map((xitem, xindex) => {
                  if (xitem.hierarchy == 2 && el.id == xitem.parentId) {
                    arr3.push({
                      parentId: xitem.parentId,
                      value: xitem.id,
                      label: xitem.mdseName
                    });
                  }
                });
              }
            });
          }
        });
        arr2.map((el, i) => {
          arr3.map((item, index) => {
            if (el.value == item.parentId) {
              arr2[i].children.push(item);
            }
          });
        });
        arr1.map((el, i) => {
          arr2.map((item, index) => {
            if (el.id == item.parentId) {
              arr1[i].children.push(item);
            }
          });
        });
        this.firstCategorys = arr1;
      });
    },
    test() {
      window.location.href =
        window.location.href.split("/manage")[0] +
        "/admin/index#/product/mdseInfo/list";
    },
    setWapUrl(imgArr) {
      this.formItem.wapUrl = imgArr.join(",");
      this.$refs.formItem.validateField("wapUrl");
    },
    setWapListUrl(imgArr) {
      this.formItem.linkMobileImg = imgArr.join(",");
      this.$refs.formItem.validateField("linkMobileImg");
    },
    submit() {
      this.saveLoading = true;
      let _this = this;

      if (this.formItem.distType == "0") {
        this.$refs.formItem.validateField("priceShow");
        this.$refs.formItem.validateField("priceDist");
        this.$refs.formItem.validateField("priceLine");
        this.$refs.formItem.validateField("virtualSale");
      }
      if (this.formItem.distType == "1") {
        this.$refs.formItem.validateField("priceDist");
      }
      if (this.formItem.distType == "2") {
        this.$refs.formItem.validateField("priceShow");
        this.$refs.formItem.validateField("priceLine");
        this.$refs.formItem.validateField("virtualSale");
      }
      this.formItem.content = this.$refs.mustKnow8
        ? this.$refs.mustKnow8.getUEContent()
        : "";
      this.$refs.formItem.validateField("content");
      this.formItem.orderNotice = this.$refs.mustKnow3
        ? this.$refs.mustKnow3.getUEContent()
        : "";
      this.formItem.distPolicy = this.$refs.mustKnow4
        ? this.$refs.mustKnow4.getUEContent()
        : "";
      this.formItem.salePolicy = this.$refs.mustKnow5
        ? this.$refs.mustKnow5.getUEContent()
        : "";
      this.formItem.mdseInfoId = this.$route.query.id;
      this.formItem.distAreaType = "all";
      let url = "/product/api/mdse/saveMdseInfo";
      // this.common.formPost(this, {
      //   url,
      //   params: this.formItem,
      //   mold: "modal",
      //   callback(res) {
      //     if (res.status == 200) {
      //       _this.$Message.success("保存成功!");
      //       // _this.$router.push("/mdseInfo");
      //     }
      //   }
      // });
      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            // _this.$router.push("/mdseInfo");
            setTimeout(function() {
              window.location.href =
                window.location.href.split("/manage")[0] +
                "/admin/index#/product/mdseInfo/list";
            }, 300);
          } else if (res.status == 402) {
            _this.saveLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          this.saveLoading = false;
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 300);
        }
      });
      this.saveLoading = false;
    }
  },
  components: {
    ueditor,
    myImg
  }
};
</script>
<style scope lang="scss">
.mdseInfoList {
  width: 100%;
  .step {
    width: 60%;
    margin: 2.5rem auto;
  }
  .form-title {
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid rgba(100, 182, 255, 1);
    font-size: 16px;
    margin-bottom: 10px;
  }
  .page-title {
    margin-bottom: 15px;
  }
  .ivu-date-picker .ivu-select-dropdown {
    z-index: 1000;
  }

  .edui-default .edui-editor {
    z-index: 666 !important;
  }

  .senicInfo {
    margin-top: 10px;
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid rgba(35, 192, 250, 1);
    .address {
      color: #999;
    }
  }
  .fixed-box {
    position: fixed;
    top: 40%;
    right: 24px;
    background: #ffffff;
    z-index: 1000;
    ul {
      list-style: none;
      li {
        text-align: center;
        width: 100px;
        button {
          width: 100%;
        }
        a {
          display: block;
          color: #000;
          padding: 3px 7px;
          text-decoration: none;
          border-bottom: 1px solid #e2d5d5;
        }
        a.active {
          color: #2d8cf0;
        }
      }
      li:first-child a {
        color: #ffffff;
        background: #0099ff;
      }
    }
    .btn-primary-outline {
      color: #5a98de;
      background-color: transparent;
      background-image: none;
      border-color: #5a98de;
    }
  }
}
</style>