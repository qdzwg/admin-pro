<template>
  <div class="hotelAddEdit">
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <Form
      :model="hotelForm"
      label-position="right"
      :label-width="120"
      ref="hotelForm"
      :rules="ruleComplteForm"
    >
      <FormItem label="酒店名称：" prop="name">
        <Input
          v-model="hotelForm.name"
          style="width:33%"
          :maxlength="64"
        ></Input>
      </FormItem>
      <FormItem label="酒店别名：" prop="aliasName">
        <Input
          v-model="hotelForm.aliasName"
          style="width:33%"
          :maxlength="64"
        ></Input>
      </FormItem>
      <FormItem label="酒店编码：" prop="productCode">
        <Input
          v-model="hotelForm.productCode"
          disabled
          style="width:33%"
          :maxlength="64"
        ></Input>
      </FormItem>
      <FormItem label="商户：" prop="mchId">
        <Select
          v-model="hotelForm.mchId"
          style="width:180px"
          placeholder="请选择商户"
        >
          <Option
            v-for="(item, index) in mchList"
            :value="item.id"
            :key="index"
            >{{ item.mchName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="所属城市：" prop="cityId">
        <Select
          v-model="hotelForm.cityId"
          style="width:180px"
          placeholder="请选择所属城市"
        >
          <Option
            v-for="(item, index) in cityList"
            :value="item.id"
            :key="index"
            >{{ item.cityName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="联系电话：" prop="linkTel">
        <Input
          v-model="hotelForm.linkTel"
          style="width:33%"
          :maxlength="64"
        ></Input>
      </FormItem>
      <FormItem label="酒店标签：" prop="labels">
        <div style="" class="travellSubject">
          <div class="subject-list">
            <div
              v-for="(item, index) in tagNameList"
              :key="index"
              class="subject-list-item"
            >
              <Icon
                @click="subjectItemDel2(index)"
                class="subject-list-item-del"
                type="close-circled"
              ></Icon>
              <Button>{{ item }}</Button>
            </div>
          </div>
          <div class="subject-input" v-if="tagNameList.length < 4">
            <Input
              @on-enter="setSubjectTag2"
              :maxlength="4"
              v-model="tagName"
              placeholder="回车添加标签，如“日可定、立减20”"
              style="width: 200px"
            ></Input>
          </div>
          <div
            style="color:red;margin-left:10px;float:left"
            v-if="tagNameList.length < 4"
          >
            输入后，回车添加
          </div>
        </div>
        <Input v-model="hotelForm.labels" style="display:none"></Input>
      </FormItem>

      <FormItem label="酒店星级：" prop="hotelLevel">
        <Select v-model="hotelForm.hotelLevel" style="width:200px">
          <Option
            :value="item.value"
            v-for="(item, index) in hotelLevels"
            :label="item.label"
            :key="index"
          ></Option>
        </Select>
      </FormItem>
      <FormItem label="酒店地址：" class="address-select" required>
        <Col span="24">
          <city-select
            ref="select"
            @getProvince="getProvince"
            :addrCode="hotelForm.areaCode"
            @getCity="getCity"
            @getQu="getQu"
          >
          </city-select>
        </Col>
      </FormItem>
      <FormItem label="详细地址：" prop="addr">
        <Input
          v-model="hotelForm.addr"
          style="width:33%"
          placeholder="请输入详细地址"
          :maxlength="128"
        ></Input>
      </FormItem>
      <FormItem label="地图坐标：" prop="latitudeLongitude">
        <Input
          v-model="hotelForm.latitudeLongitude"
          style="width:33%"
          readonly
        ></Input>
        <Button @click="showMap" type="primary">获取坐标</Button>
      </FormItem>
      <FormItem label="酒店类别：" prop="hotelType">
        <Select v-model="hotelForm.hotelType" style="width:200px">
          <Option
            :value="item.value"
            :label="item.label"
            v-for="(item, index) in hotelTypes"
            :key="index"
          ></Option>
        </Select>
      </FormItem>

      <FormItem label="交通描述：">
        <Input
          type="textarea"
          v-model="hotelForm.trafficDesc"
          style="width:33%"
          :maxlength="500"
        ></Input>
      </FormItem>
      <FormItem label="服务设施：" class="clearfix" prop="serviceBuildNew">
        <CheckboxGroup v-model="hotelForm.serviceBuildNew" style="float:left">
          <Checkbox
            :label="item"
            v-for="(item, index) in buildList"
            :key="index"
          >
            <span>{{ item }}</span>
          </Checkbox>
        </CheckboxGroup>
        <div class="subject-input" style="float:left">
          <Input
            @on-enter="setSubjectTag"
            :maxlength="4"
            v-model="buildName"
            placeholder="回车添加标签，如“今日可定、立减20”"
            style="width: 200px"
          ></Input>
        </div>
        <div style="color:red;margin-left:10px;float:left">
          输入后，回车添加
        </div>
      </FormItem>

      <FormItem label="详情介绍：" prop="content">
        <ueditor v-model="hotelForm.content"></ueditor>
      </FormItem>

      <FormItem label="缩略图：" prop="linkMobileImg">
        <Input v-model="hotelForm.linkMobileImg" style="display:none"></Input>
        <my-img
          :limitNum="1"
          :uploadList="singleImgList"
          @getImgUrl="setWapUrl"
        ></my-img>
        <p>仅支持jpg、png两种格式, 大小不超过2 MB</p>
      </FormItem>
      <FormItem label="轮播图：" prop="picUrl">
        <Input v-model="hotelForm.picUrl" style="display:none"></Input>
        <my-img
          :limitNum="5"
          :uploadList="wapImgList"
          @getImgUrl="setWapListUrl"
        ></my-img>
        <p>仅支持jpg、png两种格式, 大小不超过2 MB</p>
      </FormItem>
      <FormItem label="详情页视频：">
        <my-video v-model="hotelForm.extendsParamTwo"></my-video>
      </FormItem>
      <FormItem label="前台展示起价：" prop="extendsParamOne">
        <Input
          number
          v-model="hotelForm.extendsParamOne"
          :maxlength="9"
          style="width:100px;"
        ></Input>
      </FormItem>
      <FormItem label="预订须知：" required>
        <ueditor v-model="hotelForm.noticeid"></ueditor>
      </FormItem>
      <FormItem label="售后政策：" required>
        <ueditor v-model="hotelForm.salePolicy"></ueditor>
      </FormItem>

      <!-- <FormItem label="订单短信通知："
                prop="tel">
        <Input v-model="hotelForm.tel"
               style="width:300px;"
               placeholder="用于接收需人工确认的下单提示短信"></Input>
        <Button type="primary"
                @click="getModal">设置模板</Button>
      </FormItem> -->
      <FormItem class="save-cancel">
        <Button type="primary" @click="submit">保存</Button>
        <Button type="ghost" @click="back" style="margin-left: 8px"
          >取消</Button
        >
      </FormItem>
    </Form>

    <Modal v-model="modal2" title="设置模板">
      <p>
        您有新的待确认酒店订单，订单号 {tradeNo}，请在 {time}
        分钟内确认，逾期将被取消。
      </p>
      <!-- <Input type="textarea" v-model="hotelForm.text"></Input> -->
    </Modal>
    <amap ref="getAddress" @getPoint="setPoint"></amap>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')"
            >基本信息</a
          >
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('senicInfo')"
            >酒店信息</a
          >
        </li>

        <li>
          <Button size="small" @click="submit" type="primary">保存</Button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import ueditor from "@/components/global/ueditor";
import ueditor from "@/components/global/vueUEditor";
import store from "@/store";
import citySelect from "@/components/global/selectList";
import amap from "@/components/global/amap";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import myVideo from "@/components/global/video";
import myImg from "@/components/global/singleImg";
export default {
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     if (
  //       !store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)
  //     ) {
  //       vm.$router.back(); //如果没有就不会跳转
  //     }
  //   });
  // },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      buildName: "",
      mchList: [],
      show: false,
      cmbProvince: "",
      cmbCity: "",
      cmbArea: "",
      hotelLevels: [],
      hotelTypes: [],
      parentIds: "",
      loading: true,
      model: false,
      modal2: false,
      spinShow: true, //加载效果
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      buildList: [],
      pcMainImgList: [],
      pcWapImgList: [],
      singleImgList: [],
      wapImgList: [],
      tagNameList: [],
      tagName: "",
      cityList: [],
      hotelForm: {
        cityId: "",
        extendsParamTwo: "",
        serviceBuildNew: [],
        mchId: "",
        name: "",
        hotelLevel: "",
        productCode: "",
        areaCode: "",
        areaName: "",
        addr: "",
        latitudeLongitude: "",
        salesNum: 0,
        summary: "",
        linkMobileImg: "",
        picUrl: "",
        noticeid: "",
        trafficDesc: "",
        content: "",
        extendsParamOne: null,
        hotelType: null,
        aliasName: "",
        salePolicy: "",
        linkTel: "",
        labels: ""
      },
      ruleComplteForm: {
        name: [
          { required: true, message: "请填写酒店名称", trigger: "blur" },
          { max: 64, message: "酒店名称字数不能超过64个" }
        ],
        aliasName: [
          { required: true, message: "请填写酒店别名", trigger: "blur" },
          { max: 64, message: "酒店别名字数不能超过64个" }
        ],
        productCode: [
          { required: true, message: "请填写酒店编码", trigger: "blur" }
        ],
        mchId: [
          {
            required: true,
            message: "请选择商户",
            trigger: "change",
            type: "number"
          }
        ],
        hotelLevel: [
          { required: true, message: "请选择酒店等级", trigger: "blur" }
        ],
        addr: [{ required: true, message: "请填写详细地址", trigger: "blur" }],
        latitudeLongitude: [
          { required: true, message: "请填写地图坐标", trigger: "blur" }
        ],
        serviceBuildNew: [{ required: true, message: "请选择服务设施" }],
        content: [
          { required: true, message: "请填写详情介绍", trigger: "blur" }
        ],
        linkMobileImg: [
          { required: true, message: "请选择缩略图", trigger: "blur" }
        ],
        picUrl: [{ required: true, message: "请选择轮播图", trigger: "blur" }],
        hotelType: [
          { required: true, message: "请选择酒店类别", trigger: "change" }
        ],
        extendsParamOne: [
          {
            required: true,
            type: "number",
            message: "请填写前台展示价"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        linkTel: [
          { required: true, message: "请填写联系电话", trigger: "blur" },
          {
            pattern: /(^1([0-9]{10})$)|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/,
            message: "格式不正确"
          }
        ],
        labels: [{ required: true, message: "请填写酒店标签", trigger: "blur" }]
      }
    };
  },
  computed: {
    // 属性计算  实现酒店品牌联动
  },
  created() {
    // this.getMchList();
    this.getHotelData();
  },
  // mounted() {},
  methods: {
    subjectItemDel2(index) {
      this.tagNameList.splice(index, 1);
      this.hotelForm.labels = JSON.stringify(this.tagNameList);
    },
    setSubjectTag2() {
      if (this.tagNameList && this.tagNameList.length < 4) {
        if (this.tagName) {
          this.tagNameList.push(this.tagName);
          this.hotelForm.labels = JSON.stringify(this.tagNameList);
          this.tagName = "";
        } else {
          this.$Message.warning("请输入标签名！");
        }
      } else {
        this.$Message.warning("最多添加四个标签！");
      }
    },
    getHotelData() {
      if (this.$route.query.id) {
        apiPost("/product/api/hotelPush/findHotelById", {
          hotelId: this.$route.query.id
        }).then(res => {
          if (res.status == 200 || res.success) {
            if (res.data && res.data.hotelInfoVo) {
              this.spinShow = false;
              this.hotelForm = res.data.hotelInfoVo;
              this.hotelForm.mchId = parseInt(res.data.hotelInfoVo.mchId);
              this.hotelForm.cityId = parseInt(res.data.hotelInfoVo.cityId);
              this.hotelForm.hotelType = res.data.hotelInfoVo.hotelType + "";
              this.hotelForm.extendsParamOne = res.data.hotelInfoVo
                .extendsParamOne
                ? +res.data.hotelInfoVo.extendsParamOne
                : null;
              this.hotelForm.serviceBuildNew = JSON.parse(
                res.data.hotelInfoVo.serviceBuild
              );
              this.singleImgList = res.data.hotelInfoVo.linkMobileImg
                ? res.data.hotelInfoVo.linkMobileImg.split(",")
                : [];
              this.wapImgList = res.data.hotelInfoVo.picUrl
                ? res.data.hotelInfoVo.picUrl.split(",")
                : [];
              this.tagNameList = res.data.hotelInfoVo.labels
                ? JSON.parse(res.data.hotelInfoVo.labels)
                : [];
              if (
                res.data.hotelInfoVo.labels &&
                JSON.parse(res.data.hotelInfoVo.labels).length > 0
              ) {
                this.hotelForm.labels = res.data.hotelInfoVo.labels;
              } else {
                this.hotelForm.labels = "";
              }
              if (
                res.data.areaName &&
                res.data.areaName.split("-").length == 3
              ) {
                //初始化省市区
                let arr = res.data.areaName.split("-");
                this.cmbProvince = arr[0];
                this.cmbCity = arr[1];
                this.cmbArea = arr[2];
              }
            }
            if (res.data.paramVoList && res.data.paramVoList.length) {
              let arr = [],
                paramVoList = res.data.paramVoList;
              paramVoList.forEach((item, index) => {
                arr.push(item.value);
              });
              this.buildList = arr;
            }
            this.show = true;
          }
        });
        this.getSysparam();
        this.getMchList();
        this.getCityList();
      }
    },
    //获取商户列表
    getMchList() {
      this.apiPost("/product/api/showTicketApi/add").then(res => {
        if (res.success || res.status == 200) {
          this.mchList = res.mch;
        }
      });
    },
    getCityList() {
      this.apiPost("/product/api/park/selectCityInfo").then(res => {
        if (res.success || res.status == 200) {
          this.cityList = res.data;
        }
      });
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    setSubjectTag() {
      if (this.buildName) {
        // let obj = {
        //   label: this.buildName,
        //   value: this.buildName
        // }
        this.buildList.push(this.buildName);
        this.buildName = "";
      } else {
        this.$Message.warning("请输入设施名称！");
      }
    },

    getSysparam() {
      apiPostJson("/admin/sysparam/findSysParamList", {
        types: ["hotelLevel", "hotelType"]
      }).then(res => {
        let hotelLevel = res.data.hotelLevel;
        let dataType = res.data.hotelType;
        dataType.map((item, index) => {
          this.hotelTypes.push({
            value: item.key,
            label: item.value
          });
        });

        hotelLevel.map((ele, i) => {
          this.hotelLevels.push({
            value: ele.key,
            label: ele.value
          });
        });
      });
    },
    getProvince(sheng) {
      console.log("sheng", sheng);
      this.cmbProvince = sheng;
    },
    getCity(city) {
      this.cmbCity = city;
    },
    getQu(qu) {
      this.cmbArea = qu;
    },
    setPoint(point) {
      this.hotelForm.latitudeLongitude = point.lng + "," + point.lat;
    },
    showMap() {
      this.$refs.getAddress.showModal();
    },
    setWapUrl(url) {
      let _this = this;
      this.hotelForm.linkMobileImg = url.join(",");
      _this.$refs.hotelForm.validateField("linkMobileImg");
    },
    setWapListUrl(url) {
      let _this = this;
      this.hotelForm.picUrl = url.join(",");
      _this.$refs.hotelForm.validateField("picUrl");
    },
    //设置模板
    getModal() {
      this.modal2 = true;
    },
    submit() {
      let _this = this;
      this.hotelForm.areaName =
        this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;
      this.hotelForm.areaCode =
        this.$refs.select.sheng +
        "-" +
        this.$refs.select.shi +
        "-" +
        this.$refs.select.qu;
      let postParams = JSON.parse(JSON.stringify(this.hotelForm));
      postParams.serviceBuildNew = JSON.stringify(postParams.serviceBuildNew);
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

      this.$refs.hotelForm.validate(async valid => {
        this.scrollError();
        if (valid) {
          let url = "/product/api/hotelPush/saveEditHotel";
          let res = await apiPost(url, postParams);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            window.location.href = "/hotelInfo";
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          //滚动到错误地方
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 500);
        }
      });
    },
    back() {
      this.$router.back();
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
  },
  components: {
    ueditor,
    citySelect,
    amap,
    myVideo,
    myImg
  }
};
</script>
<style scoped lang="scss">
.hotelAddEdit {
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
  .remark {
    color: red;
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
  .save-cancel {
    padding-bottom: 50px;
  }
  .travellSubject {
    height: 32px;
    .subject-list {
      float: left;
      margin-right: 10px;
      .subject-list-item {
        display: inline-block;
        margin-right: 10px;
        position: relative;
        .subject-list-item-del {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .subject-list-item:hover {
        .subject-list-item-del {
          display: inline-block;
        }
      }
    }
    .subject-input {
      float: left;
    }
  }
}
</style>
