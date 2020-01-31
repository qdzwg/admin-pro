<template>
  <div class="physical-commodity">
    <div class="step">
      <Steps :current="1">
        <Step title="产品类型"></Step>
        <Step title="商品信息"
              class="step-back"></Step>
        <Step title="商品规格信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleForm">
      <div id="base"
           class="form-title">基本信息</div>
      <FormItem label="商品名称："
                prop="name">
        <Input v-model="formItem.name"
               style="width:33%"
               :maxlength="50"></Input>
      </FormItem>
      <FormItem label="商品类型："
                required>
        <Row>
          <Col span="3">
          <FormItem prop="firstCategory"
                    :lable-width="1">
            <Select v-model="formItem.firstCategory"
                    style="width:65%"
                    @on-change="changeFirst">
              <Option v-for="(item,index) in firstCategorys"
                      :key="index"
                      :value="item.value +''"
                      :label="item.label">
              </Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="3">
          <FormItem :lable-width="1">
            <Select v-model="formItem.secondCategory"
                    style="width:65%"
                    @on-change="changeSecond">
              <Option v-for="(el,i) in secondCategorys"
                      :value="el.value + ''"
                      :key="i"
                      :label="el.label"></Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="3">
          <FormItem :lable-width="1">
            <Select v-model="formItem.thirdCategory"
                    style="width:65%">
              <Option v-for="(el,i) in thirdCategorys"
                      :value="el.value + ''"
                      :key="i"
                      :label="el.label"></Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="产地："
                prop="address">
        <Input v-model="formItem.address"
               style="width:33%"
               :maxlength="50"></Input>
      </FormItem>
      <div id="senicInfo"
           class="form-title">商品信息</div>

      <FormItem label="商品描述："
                prop="summary">
        <Input v-model="formItem.summary"
               type="textarea"
               :autosize="{minRows: 4,maxRows: 10}"
               style="width:33%"
               :maxlength="500"></Input>
        <!-- <ueditor v-if='ueditorShow' id="ue7" ref="mustKnow7" :content="formItem.summary" :config="config"></ueditor> -->
      </FormItem>
      <FormItem label="商品详情："
                prop="content">
        <Input v-model="formItem.content"
               style="display:none"></Input>
        <ueditor v-if='ueditorShow'
                 id="ue2"
                 ref="mustKnow"
                 :content="formItem.content"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="缩略图："
                prop="linkMobileImg">
        <Input v-model="formItem.linkMobileImg"
               style="display:none"></Input>
        <my-img :limitNum="1"
                :uploadList="wapImgList"
                @getImgUrl="setWapListUrl"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图："
                prop="wapUrl">
        <Input v-model="formItem.wapUrl"
               style="display:none"></Input>
        <my-img :limitNum="5"
                :uploadList="singleImgList"
                @getImgUrl="setWapUrl"></my-img>
        <p>最多上传5张，建议上传小于1M， 宽750px，高440px的JPG/PNG格式的图片</p>
      </FormItem>
      <div id="distSet"
           class="form-title">分销设置</div>
      <FormItem label="分销渠道："
                prop="distType">
        <Select v-model="formItem.distType"
                style="width:200px">
          <Option :value="item.value"
                  v-for="(item,index) in list"
                  :key="index">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品别名："
                prop="nickName"
                v-if="formItem.distType!='1'">
        <Input v-model="formItem.nickName"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="商品副标题："
                prop="subTitle"
                v-if="formItem.distType!='1'">
        <Input v-model="formItem.subTitle"
               placeholder="用简短文字描述"
               style="width:33%"
               :maxlength="100"></Input>
      </FormItem>

      <FormItem v-if="formItem.distType=='0' ||formItem.distType=='2'"
                label="店铺展示起价："
                prop="priceShow">
        <InputNumber v-model="formItem.priceShow"
                     :min="0"
                     :max="100000"></InputNumber> 元
      </FormItem>
      <FormItem v-if="formItem.distType=='0'||formItem.distType=='2'"
                label="店铺门市价："
                prop="priceLine">
        <InputNumber v-model="formItem.priceLine"
                     :min="0"
                     :max="100000"></InputNumber> 元
      </FormItem>
      <FormItem v-if="formItem.distType=='0' ||formItem.distType=='2'"
                label="店铺虚拟销量："
                prop="virtualSale">
        <InputNumber v-model="formItem.virtualSale"
                     :min="0"
                     :max="100000"></InputNumber>
      </FormItem>
      <FormItem v-if="formItem.distType=='0'||formItem.distType=='1'"
                label="分销展示价："
                prop="priceDist">
        <InputNumber v-model="formItem.priceDist"
                     :min="0"
                     :max="100000"></InputNumber> 元
      </FormItem>
      <template v-if='ueditorShow'>
        <FormItem v-show="formItem.distType=='0'||formItem.distType=='2'"
                  id="ue3"
                  label="预订须知：">
          <ueditor ref="mustKnow3"
                   :content="formItem.orderNotice"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem v-show="formItem.distType=='0'||formItem.distType=='1'"
                  label="分销政策：">
          <!-- <Input v-model="formItem.distPolicy" style="display:none"></Input> -->
          <ueditor id="ue4"
                   ref="mustKnow4"
                   :content="formItem.distPolicy"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem v-show="formItem.distType=='0'||formItem.distType=='1'"
                  label="售后政策：">
          <!-- <Input v-model="formItem.salePolicy" style="display:none"></Input> -->
          <ueditor id="ue5"
                   ref="mustKnow5"
                   :content="formItem.salePolicy"
                   :config="config"></ueditor>
        </FormItem>
      </template>

      <!-- <FormItem v-show="formItem.distType=='0'||formItem.distType=='1'" label="分销区域限制：" prop="distAreaType">
                <Select v-model="formItem.distAreaType" style="width:200px">
                    <Option value="all">无限制</Option>
                    <Option value="all2">限制区域</Option>
                </Select>
            </FormItem> -->
      <FormItem label="是否立即上架："
                prop="enabled">
        <Select v-model="formItem.enabled"
                style="width:200px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
      </FormItem>
      <FormItem>
        <div class="save-cancel">
          <Button type="primary"
                  @click="submit"
                  :disabled="disabled">保存,下一步</Button>
          <Button type="ghost"
                  @click="test"
                  style="margin-left: 8px">取消</Button>
        </div>
      </FormItem>
    </Form>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('senicInfo')">商品信息</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('distSet')">分销设置</a>
        </li>
        <li>
          <Button size="small"
                  @click="submit"
                  type="primary"
                  :disabled="disabled">保存，下一步</Button>
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
  data () {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      ueditorShow: false, //控制请求数据成功后，让富文本显示
      firstCategorys: [], //保存商品一级类别
      secondCategorys: [], //保存商品二级类别
      thirdCategorys: [], //保存商品三级类别
      singleImgList: [], //显示缩略图
      wapImgList: [], //显示轮播图
      disabled: false, //控制按钮是否可点击
      toFlag: false, //首次渲染数据不清空二三级类别
      flag: false, //首次渲染数据不清空三级类别
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
        //配置富文本参数
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formItem: {
        firstCategory: "", //商品一级类别
        secondCategory: "", //商品二级类别
        thirdCategory: "", //商品三级类别
        name: "", //商品名称
        address: "", //产地
        summary: "", //商品描述
        distType: "0", //分销渠道
        nickName: "", //商品别名
        subTitle: "", //商品副标题
        priceLine: null, //店铺门市价
        priceShow: null, //店铺展示起价
        virtualSale: null, //店铺虚拟销量
        priceDist: null, //分销展示价
        content: "", // 景点介绍
        wapUrl: "", //轮播图
        linkMobileImg: "", //缩略图
        orderNotice: "", //预定须知
        distPolicy: "", // 分销政策
        salePolicy: "", // 售后政策,
        distAreaType: "all", //分销区域限制
        enabled: "T" //是否立即上下架
      },

      ruleForm: {
        name: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        firstCategory: [{ required: true, message: "请选择商品类型" }],
        distAreaType: [
          { required: true, message: "请选择分销区域限制", trigger: "change" }
        ],
        enabled: [
          { required: true, message: "请选择是否上下架", trigger: "change" }
        ],
        distType: [
          { required: true, message: "请选择分销渠道", trigger: "change" }
        ],
        nickName: [
          { required: true, message: "请填写商品别名", trigger: "blur" }
        ],
        subTitle: [
          { required: true, message: "请填写商品副标题", trigger: "blur" }
        ],
        linkMobileImg: [
          { required: true, message: "请选择缩略图", trigger: "blur" }
        ],
        wapUrl: [{ required: true, message: "请选择轮播图", trigger: "blur" }],
        summary: [
          { required: true, message: "请填写商品描述", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请填写商品须知", trigger: "blur" }
        ],
        //  orderNotice:[
        //     {required: true, message: "请填写预订须知", trigger: "blur" }
        // ],
        //  distPolicy:[
        //     {required: true, message: "请填写分销政策", trigger: "blur" }
        // ],
        //  salePolicy:[
        //     {required: true, message: "请填写售后政策", trigger: "blur" }
        // ],
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
            max: 6,
            message: "数值不能大于999999"
          }
        ],
        address: [{ required: true, message: "请填写产地", trigger: "blur" }]
      }
    };
  },
  mounted () {
    $(".step-back").click(() => {
      this.$router.back(-1);
    });
  },
  watch: {
    "formItem.firstCategory": "changeFirst",
    "formItem.secondCategory": "changeSecond"
  },
  created () {
    this.getGorey();
  },
  methods: {
    hashClick (val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    //商品一级类别
    changeFirst (val) {
      let _this = this;

      this.firstCategorys.forEach(function (d) {
        if (d.value == val) {
          _this.secondCategorys = d.children;
        }
      });
      if (this.flag) {
        this.thirdCategorys = [];
        this.formItem.secondCategory = "";
        this.formItem.thirdCategory = "";
      }
      this.flag = true;
    },
    //商品二级类别
    changeSecond (val) {
      let _this = this;
      this.secondCategorys.forEach(function (d) {
        if (d.value == val) {
          _this.thirdCategorys = d.children;
        }
      });
      if (this.toFlag) {
        this.formItem.thirdCategory = "";
      }
      this.toFlag = true;
    },
    async getList () {
      await apiGet("/product/api/mdse/getMdseInfo").then(res => {
        this.ueditorShow = true;
        if (res.data) {
          this.formItem = res.data;

          this.formItem.firstCategory = res.data.firstCategory
            ? res.data.firstCategory
            : "";
          this.formItem.secondCategory = res.data.secondCategory
            ? res.data.secondCategory
            : "";
          this.formItem.thirdCategory = res.data.thirdCategory
            ? res.data.thirdCategory
            : "";
          (this.formItem.priceLine = res.data.priceLine
            ? res.data.priceLine
            : null),
            (this.formItem.priceShow = res.data.priceShow
              ? res.data.priceShow
              : null),
            (this.formItem.virtualSale = res.data.virtualSale
              ? res.data.virtualSale
              : null),
            (this.formItem.priceDist = res.data.priceDist
              ? res.data.priceDist
              : null),
            //   this.$router.push("/commodityAttribute");
            (this.singleImgList = res.data.wapUrl
              ? res.data.wapUrl.split(",")
              : []);
          this.wapImgList = res.data.linkMobileImg
            ? res.data.linkMobileImg.split(",")
            : [];
        }
      });
    },
    //请求类别数据
    getGorey () {
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
        this.getList();
      });
    },
    test () {
      //   this.$router.back(-1);
      window.location.href =
        window.location.href.split("/manage")[0] +
        "/admin/index#/product/parkPublish/selectProduct";
    },
    setWapUrl (imgArr) {
      this.formItem.wapUrl = imgArr.join(",");
      this.$refs.formItem.validateField("wapUrl");
    },
    setWapListUrl (imgArr) {
      this.formItem.linkMobileImg = imgArr.join(",");
      this.$refs.formItem.validateField("linkMobileImg");
    },
    scrollError () {
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
    },
    submit () {
      let _this = this;
      this.formItem.content = this.$refs.mustKnow
        ? this.$refs.mustKnow.getUEContent()
        : "";
      this.$refs.formItem.validateField("content");
      this.formItem.orderNotice = this.$refs.mustKnow3
        ? this.$refs.mustKnow3.getUEContent()
        : "";
      // this.$refs.formItem.validateField('orderNotice')
      this.formItem.distPolicy = this.$refs.mustKnow4
        ? this.$refs.mustKnow4.getUEContent()
        : "";
      // this.$refs.formItem.validateField('distPolicy')
      this.formItem.salePolicy = this.$refs.mustKnow5
        ? this.$refs.mustKnow5.getUEContent()
        : "";

      this.disabled = true;
      setTimeout(() => {
        this.disabled = false;
      }, 3000);
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          if (this.formItem.distType == "0") {
            if (!this.formItem.distPolicy) {
              this.$Message.warning("请填写分销政策");
              return false;
            }
            if (!this.formItem.orderNotice) {
              this.$Message.warning("请填写预订须知");
              return false;
            }
            if (!this.formItem.salePolicy) {
              this.$Message.warning("请填写售后政策");
              return false;
            }
          }
          if (this.formItem.distType == "1") {
            if (!this.formItem.distPolicy) {
              this.$Message.warning("请填写分销政策");
              return false;
            }
            if (!this.formItem.salePolicy) {
              this.$Message.warning("请填写售后政策");
              return false;
            }
          }
          if (this.formItem.distType == "2") {
            if (!this.formItem.orderNotice) {
              this.$Message.warning("请填写预订须知");
              return false;
            }
          }
          let url = "/product/api/mdse/saveMdseInfo";
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            _this.$router.push("/commodityAttribute");
          } else {
            _this.$Message.warning(res.message);
          }
        } else {
          //滚动到错误地方
          setTimeout(function () {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
              90 +
              $("#content").scrollTop()
            );
          }, 500);
        }
      });
    }
  },
  components: {
    ueditor,
    myImg
  }
};
</script>
<style scope lang="scss">
.physical-commodity {
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
  .table {
    margin-bottom: 15px;
    width: 100%;
    border-spacing: 0;
    border: 1px solid #ddd;
    border-collapse: separate;
    border-left: 0;
    border-bottom: 0;
    thead {
      tr {
        th {
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #dddddd;
          padding: 8px;
          line-height: 20px;
        }
        th:first-child {
          text-align: center;
        }
      }
    }
    tbody {
      tr {
        td {
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #dddddd;
          padding: 8px;
          line-height: 20px;
        }
        td:first-child {
          // text-align: center
        }
      }
    }
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
.save-cancel {
  padding-bottom: 50px;
}
</style>