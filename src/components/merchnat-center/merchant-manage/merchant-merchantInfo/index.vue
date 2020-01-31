<template>
  <div>
    <template v-if="showMerchant">
      <div class="merchanat">
        <img
          class="merchanat-logo"
          src="https://www.lotsmall.cn/static/fileupload/20180329/20180329133748a36evj.jpg"
          alt=""
        />
        <div class="merchanat-info">
          <a class="merchanat-name" @click.prevent="showShopModal"
            >汀端直营店</a
          >
          <Button @click="gotozx" type="primary">店铺装修</Button>
        </div>
      </div>
      <!-- <Row type="flex"
         justify="center"
         class="list">
      <Col span="4">
      <div class="item">
        <div class="item-num">123</div>
        <div class="item-title">昨日浏览量</div>
      </div>
      </Col>
      <Col span="4">
      <div class="item">
        <div class="item-num">1231</div>
        <div class="item-title">昨日访客数</div>
      </div>
      </Col>
      <Col span="4">
      <div class="item">
        <div class="item-num">22</div>
        <div class="item-title">昨日产品浏览量</div>
      </div>
      </Col>
      <Col span="4">
      <div class="item">
        <div class="item-num">33</div>
        <div class="item-title">昨日产品访客数</div>
      </div>
      </Col>
      <Col span="4">
      <div class="item">
        <div class="item-num blue-num">44</div>
        <div class="item-title">自有商品</div>
      </div>
      </Col>
      <Col span="4">
      <div class="item">
        <div class="item-num blue-num">55</div>
        <div class="item-title">分销商品</div>
      </div>
      </Col>
    </Row> -->
      <!-- <div class="echart-wraper">
      <div>
        <div class="echart-goal">
          <span class="echart-title">流量分析</span>
          <Icon class="help-icon" type="help-circled"></Icon>
        </div>
        <div class="search-box">
          <Button class="select-button"
                  v-for="item in buttonList"
                  :type="buttonValue==item.value?'primary':'ghost'"
                  :key="item.value"
                  @click="buttonSearch(item.value)">{{item.name}}</Button>

          <Form ref="formInline"
                :model="searchForm"
                inline
                class="form"
                :rules="ruleInline">
            <FormItem prop="startDate">
              <DatePicker type="date"
                          @on-change="startTimeSet"
                          placeholder="开始时间"
                          style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem prop="endDate">
              <DatePicker type="date"
                          @on-change="endTimeSet"
                          placeholder="结束时间"
                          style="width: 200px"></DatePicker>
            </FormItem>
            <Button type="primary"
                    icon="ios-search"
                    @click="search('formInline')">搜索</Button>
          </Form>
        </div>
      </div>
    <div class="echart-box">
        <schart class="wrapper"
                :canvasId="canvasId"
                type="line"
                :data="data"
                :options="options"></schart>
    </div>
  </div> -->

      <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok">
        <Form
          class="shopinfoform"
          :model="formItem"
          label-position="right"
          :label-width="150"
          ref="formItem"
          :rules="ruleForm"
        >
          <FormItem label="名称：" prop="name">
            <Input readonly v-model="formItem.name"></Input>
          </FormItem>
          <FormItem label="店铺logo：">
            <div class="demo-upload-list" v-if="formItem.logoAddr">
              <template>
                <img :src="formItem.logoAddr" />
                <div class="demo-upload-list-cover">
                  <Icon
                    type="ios-trash-outline"
                    @click.native="handleRemove"
                  ></Icon>
                </div>
              </template>
              <!-- <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template> -->
            </div>
            <div v-else>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                type="drag"
                action="list/static/manage/uiFileUpload/dispatch?action=upload"
                style="display: inline-block;width:58px;"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
          </FormItem>
          <FormItem label="主营类目：" prop="mainCategory">
            <Select v-model="formItem.mainCategory">
              <Option
                v-for="item in list"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="店铺简介：" prop="briefIntroduction">
            <Input v-model="formItem.briefIntroduction"></Input>
          </FormItem>
          <FormItem label="店铺地址：" prop="addrCode">
            <Input readonly v-model="formItem.addrCode"></Input>
          </FormItem>
          <FormItem label="店铺详细地址：" prop="addrDetail">
            <Input v-model="formItem.addrDetail"></Input>
          </FormItem>
          <FormItem label="联系人：" prop="contactMan">
            <Input v-model="formItem.contactMan"></Input>
          </FormItem>
          <FormItem label="手机号码：" prop="tel">
            <Input v-model="formItem.tel"></Input>
          </FormItem>
          <FormItem label="QQ号码：" prop="qqCode">
            <Input v-model="formItem.qqCode"></Input>
          </FormItem>
          <FormItem label="微信号：" prop="wxCode">
            <Input v-model="formItem.wxCode"></Input>
          </FormItem>
          <FormItem label="创建时间：">
            2018-03-27 19:15:42
          </FormItem>
        </Form>
      </Modal>
    </template>

    <template v-else>
      <div style="width:960px; margin:0 auto;">
        <p style="font-size: 36px; margin-bottom:20px;">创建店铺</p>
        <!-- <Steps :current="1" >
          <Step title=""></Step>
          <Step title=""></Step>
          <Step title=""></Step>
        </Steps> -->
        <div style="margin-top: 20px;">
          <Form
            :model="firstForm"
            label-position="right"
            :label-width="120"
            ref="firstForm"
            :rules="ruleComplteForm"
          >
            <FormItem
              label="请求选择主营类目："
              prop="mainCategory"
              :label-width="150"
            >
              <Select
                v-model="firstForm.mainCategory"
                style="width:180px"
                placeholder="请选择主营类目"
              >
                <Option
                  v-for="(item, index) in merchantInfoMainCategoryList"
                  :value="item.key"
                  :key="index"
                  >{{ item.value }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="店铺名称：" prop="name">
              <Input v-model="firstForm.name"></Input>
            </FormItem>
            <FormItem class="address-select" label="店铺地址：" prop="addrCode">
              <select-item
                ref="select"
                :addrCode="firstForm.addrCode"
                @getProvince="getProvince"
                @getCity="getCity"
                @getQu="getQu"
              ></select-item>
            </FormItem>
            <FormItem label=" " prop="addrDetail">
              <Input
                v-model="firstForm.addrDetail"
                placeholder="店铺详细地址"
              ></Input>
            </FormItem>
            <FormItem>
              <div class="save-cancel">
                <Button type="primary" @click="saveMerchant">创建店铺</Button>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import Schart from "vue-schart";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import selectItem from "@/components/global/selectList";
export default {
  data() {
    return {
      showMerchant: false,
      list: [
        {
          value: "hotel",
          label: "酒店名宿"
        },
        {
          value: "scenic",
          label: "门票"
        },
        {
          value: "material_object",
          label: "实物"
        },
        {
          value: "pwkq",
          label: "票务卡券"
        },
        {
          value: "food",
          label: "食品"
        },
        {
          value: "meizhuang",
          label: "美妆"
        },
        {
          value: "qinzi",
          label: "亲子"
        },
        {
          value: "shumajd",
          label: "数码家电"
        },
        {
          value: "jujiash",
          label: "居家生活"
        },
        {
          value: "other",
          label: "其他"
        }
      ],
      firstForm: {
        mainCategory: "",
        name: "",
        cmbProvince: "",
        cmbCity: "",
        cmbArea: "",
        addrCode: "",
        addrDetail: ""
      },
      merchantInfoMainCategoryList: [],
      ruleComplteForm: {
        mainCategory: [
          { required: true, message: "请填写主营类目", trigger: "change" }
        ],
        name: [{ required: true, message: "请填写店铺名称", trigger: "blur" }],
        addrDetail: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      formItem: {
        name: "",
        logoAddr: "",
        mainCategory: "",
        briefIntroduction: "",
        addrCode: "",
        addrDetail: "",
        contactMan: "",
        tel: "",
        qqCode: "",
        wxCode: ""
      },
      ruleForm: {
        name: [
          {
            required: true,
            message: "请填写名称",
            trigger: "blur"
          }
        ],
        mainCategory: [
          {
            required: true,
            message: "请填写主营类目",
            trigger: "change"
          }
        ],
        briefIntroduction: [
          {
            required: true,
            message: "请填写店铺简介",
            trigger: "blur"
          }
        ],
        addrCode: [
          {
            required: true,
            message: "请填写店铺地址",
            trigger: "blur"
          }
        ],
        addrDetail: [
          {
            required: true,
            message: "请填写店铺详细地址",
            trigger: "blur"
          }
        ],
        contactMan: [
          {
            required: true,
            message: "请填写联系人",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "blur"
          }
        ],
        qqCode: [
          {
            required: true,
            message: "请填写QQ号码",
            trigger: "blur"
          }
        ],
        wxCode: [
          {
            required: true,
            message: "请填写微信号",
            trigger: "blur"
          }
        ]
      },
      modal: false,
      modalTitle: "店铺编辑",
      loading: true,
      buttonValue: "1",
      buttonList: [
        {
          name: "今日",
          value: "1"
        },
        {
          name: "本周",
          value: "2"
        },
        {
          name: "本月",
          value: "3"
        }
      ],
      canvasId: "myCanvas",
      type: "line",
      data: [],
      options: {
        title: "浏量"
      },
      searchForm: {
        startDate: "",
        endDate: ""
      },
      ruleInline: {
        startDate: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "blur"
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.apiGet("/merchant/merchantInfo/surveyFL").then(res => {
      this.showMerchant = res.data.hasInit;
      this.merchantInfoMainCategoryList = res.data.merchantInfoMainCategoryList;
      if (this.showMerchant) {
        this.getData();
      }
    });
  },
  components: { Schart, selectItem },
  methods: {
    getProvince(sheng, e) {
      //省
      this.firstForm.cmbProvince = sheng;
      this.firstForm.areaName = this.firstForm.cmbProvince;
    },
    getCity(city, e) {
      //市
      this.firstForm.cmbCity = city;
      this.firstForm.areaName =
        this.firstForm.cmbProvince + "-" + this.firstForm.cmbCity;
    },
    getQu(qu, e) {
      //区
      this.firstForm.cmbArea = qu;
      this.firstForm.areaName =
        this.firstForm.cmbProvince +
        "-" +
        this.firstForm.cmbCity +
        "-" +
        this.firstForm.cmbArea;
    },
    gotozx() {
      this.$router.push("/merchant-decorate-new");
    },
    handleSuccess(res, file) {
      if (res.state === "SUCCESS") {
        this.formItem.logoAddr = res.prefix + res.url;
      } else {
        this.$Message.warning("上传失败，请重新上传");
      }
    },
    handleRemove() {
      this.formItem.logoAddr = "";
    },
    ok() {
      this.formItem.accType = 0;
      this.formItem.useFlag = this.formItem.switch ? 1 : 0;
      let _this = this;
      let url =
        _this.type === "add"
          ? "/list/admin/sysRole/saveRole"
          : "/list/admin/sysRole/update";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback(res) {
          if (res.success) {
            _this.modal = false;
          }
        }
      });
    },
    showShopModal() {
      this.modal = true;
    },
    search(name) {
      this.buttonValue = "4";
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getData(true);
        } else {
          // this.$Message.error('请填写开始时间和结束时间!');
        }
      });
    },
    saveMerchant() {
      this.firstForm.addrCode =
        this.$refs.select.sheng +
        "-" +
        this.$refs.select.shi +
        "-" +
        this.$refs.select.qu;
      this.$refs.firstForm.validate(async valid => {
        this.scrollError();
        if (valid) {
          if (
            // 省市区联动验证
            !(
              this.$refs.select.sheng &&
              this.$refs.select.shi &&
              this.$refs.select.qu
            )
          ) {
            this.$Message.warning("请选择省市区");
            $("#content").scrollTop(
              $(".address-select").offset().top - 90 + $("#content").scrollTop()
            );
            return false;
          }
          this.apiPost("/merchant/merchantInfo/doAdd", this.firstForm).then(
            res => {
              if (res.success) {
                this.$Message.success("创建成功！");
                this.showMerchant = true;
              } else {
                let msg = res.message ? res.message : "创建成功！";
                this.$Message.warning(msg);
              }
            }
          );
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
    },
    buttonSearch(type) {
      this.buttonValue = type;
      this.getData();
    },
    getData(flag) {
      this.apiPost(
        "merchant/merchantInfo/getVisitList?type=" + this.buttonValue,
        flag ? this.searchForm : {}
      ).then(data => {
        this.formaterData(data.data);
      });
    },
    formaterData(data) {
      let arr = [];
      data.dataList.forEach((item, index) => {
        let obj = {
          name: item,
          value: data.visitList[index]
        };
        arr.push(obj);
      });
      this.data = arr;
    },
    formDate() {},
    startTimeSet(time) {
      this.searchForm.startDate = time;
    },
    endTimeSet(time) {
      this.searchForm.endDate = time;
    }
  }
};
</script>

<style>
.merchanat {
  overflow: hidden;
}
.merchanat-logo {
  float: left;
  width: 100px;
  height: 100px;
}
.merchanat-info {
  float: left;
  margin-left: 15px;
}
.merchanat-info .merchanat-name {
  display: block;
  color: #000000;
  margin-bottom: 24px;
  font-size: 24px;
}
.merchanat-name:hover {
  color: #2b85e4;
}
.list .item .item-num {
  font-size: 20px;
  color: #666666;
  font-weight: bold;
  line-height: 40px;
}
.list .item .item-title {
  font-size: 14px;
}
.list .item {
  text-align: center;
  border-left: 1px dashed #c6c6c6;
  padding: 7px 0px;
}
.list .ivu-col-span-4:first-child .item {
  border: none;
}
.list {
  padding: 30px;
}
.wrapper {
  height: 400px;
  width: 85%;
}
.echart-box {
  padding: 25px 50px;
}
.help-icon {
  font-size: 16px;
  margin-left: 10px;
}
.echart-title {
  font-size: 18px;
}
.echart-goal {
  float: left;
}
.search-box {
  float: right;
}
.echart-wraper {
  padding: 20px;
  border: 1px solid #c6c6c6;
}
.search-box .avtive {
  background: #2b85e4;
  color: #ffffff;
}
.select-button {
  margin-right: 8px;
}
.form {
  display: inline-block;
}
.blue-num {
  color: #52a7ef !important;
}
.shopinfoform {
  height: 450px;
  overflow: auto;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
