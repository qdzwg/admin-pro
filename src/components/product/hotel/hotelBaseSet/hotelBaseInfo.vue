<template>
  <div class="hotel-baseinfo-p">
    <div class="step">
      <Steps :current="0">
        <Step title="酒店基础管理"></Step>
        <Step
          title="房型管理"
          class="step-hotelType"
          style="cursor:pointer"
        ></Step>
        <Step
          title="销售设置"
          class="step-distributy"
          style="cursor:pointer"
        ></Step>
      </Steps>
    </div>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div
        id="base"
        class="form-title"
      >酒店基本信息</div>
      <FormItem
        v-if="formItem.isDirect!='T'"
        label="酒店归属："
        prop="type"
      >
        <RadioGroup v-model="formItem.type">
          <Radio label="1">第三方酒店</Radio>
          <Radio label="0">自营酒店</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        v-if="$route.query.id&&pageData.isDirect=='T'"
        label="PMS酒店名称："
      >
        <span class="m-r-5">{{pageData.pmsName}}</span>
        <Button
          v-if="pageData.isDirect=='T'"
          type="success"
          size="small"
        >直连</Button>
        <Button
          v-if="pageData.type!=''"
          type="warning"
          size="small"
        >{{pageData.type=='0'?'自营':'第三方'}}</Button>
      </FormItem>
      <!-- <FormItem
        v-if="$route.query.id"
        label="向PMS下单方式："
        prop="isPush"
      >
        <RadioGroup v-model="formItem.isPush">
          <Radio label="1">自动向PMS下单</Radio>
          <Radio label="2">手动向PMS下单</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem
        v-if="formItem.isDirect=='T'"
        label="对外酒店别称："
        prop="name"
      >
        <Input
          v-model="formItem.name"
          style="width:33%"
          :maxlength="25"
        ></Input>
        <span style="color:#999;margin-left:5px">作为在线销售时对外展示的酒店名称</span>
      </FormItem>
      <FormItem
        v-else
        label="酒店名称："
        prop="name"
      >
        <Input
          v-model="formItem.name"
          style="width:33%"
          :maxlength="25"
        ></Input>
      </FormItem>
      <FormItem
        label="对外联系电话："
        prop="linkTel"
      >
        <Input
          v-model="formItem.linkTel"
          style="width:33%"
          :maxlength="64"
        ></Input>
        <Checkbox v-model="formItem.isShow">不对外展示</Checkbox>
      </FormItem>

      <FormItem
        label="地理位置："
        class="address-select"
        required
      >
        <Col span="6">
        <select-item
          span="8"
          ref="select"
          :addrCode="addressCode"
          @getProvince="getProvince"
          @getCity="getCity"
          @getQu="getQu"
          :disabled="formItem.isDirect=='T'"
        ></select-item>
        </Col>
        <Col
          style="margin-left:10px"
          span="4"
        >
        <FormItem prop="area">
          <Input
            :disabled="formItem.isDirect=='T'"
            v-model="formItem.area"
            placeholder="请填写详细地址"
            @on-blur="search"
            :maxlength="128"
          ></Input>
        </FormItem>
        </Col>
        <Col
          style="margin-left:10px"
          span="2"
        >
        <Button
          @click="search"
          type="primary"
        >搜索并在地图标注</Button>
        </Col>
        <Col
          style="margin-top:10px"
          span="24"
        >
        <Col
          style="margin-top:10px"
          class="map-warpper"
          span="12"
        >

        <div
          v-show="formItem.isDirect=='F'&&!coverShow"
          @click="coverShow=true"
          class="cover"
        >
          <span class="text">点击释放地图</span>
        </div>
        <div
          v-show="formItem.isDirect=='T'"
          class="cover"
        ></div>
        <div id="container"></div>
        </Col>
        </Col>
      </FormItem>
      <FormItem
        label="酒店类型："
        prop="hotelType"
      >
        <!-- {{formItem.hotelType}} -->
        <Select
          v-model="formItem.hotelType"
          style="width:200px"
        >
          <Option
            :value="item.key"
            :label="item.value"
            v-for="(item,index) in pmsHotelTypeList"
            :key="index"
          ></Option>
        </Select>
      </FormItem>
      <FormItem
        label="星级："
        prop="hotelLevel"
      >
        <!-- {{formItem.hotelLevel}} -->
        <Select
          v-model="formItem.hotelLevel"
          style="width:200px"
        >
          <Option
            :value="item.key"
            :label="item.value"
            v-for="(item,index) in pmsHotelLevelList"
            :key="index"
          ></Option>
        </Select>
      </FormItem>

      <FormItem
        label="开业时间："
        prop="openTimeYear"
      >
        <DatePicker
          type="year"
          v-model="formItem.openTimeYear"
          placeholder="如2019"
          :clearable="false"
          :editable="false"
          format="yyyy"
          style="width: 150px"
        ></DatePicker> 年
      </FormItem>
      <FormItem
        label="最新装修时间："
        prop="trimTimeYear"
      >
        <DatePicker
          type="year"
          v-model="formItem.trimTimeYear"
          placeholder="如2019"
          :clearable="false"
          :editable="false"
          format="yyyy"
          style="width: 150px"
        ></DatePicker> 年
      </FormItem>
      <FormItem
        label="列表推荐标签："
        required
      >
        <FormItem
          style="display:inline-block;"
          v-for="(item,index) in formItem.tag"
          :key="index"
          :prop="'tag.' + index + '.name'"
          :rules="{required: true, message: '列表推荐标签 ' + (index+1) +'不能为空', trigger: 'blur'}"
        >
          <Input
            style="width:150px;margin-right:10px;"
            v-model="item.name"
            placeholder="如“早餐好吃”"
            :maxlength="5"
          ></Input>
        </FormItem>

      </FormItem>
      <FormItem
        label="酒店图文介绍："
        prop="summary"
      >
      <p>（建议上传图片宽度为750px，大小小于1M，显示效果最佳）</p>
        <vueUEditor
          v-model="formItem.summary"
          @getText='getVueText'
          :config="config"
        ></vueUEditor>
      </FormItem>
      <FormItem
        label="酒店图片："
        prop="hotelImg"
      >
        <div class="image-box">
          <img
            class="show-img"
            v-if="formItem.hotelImg"
            :src="formItem.hotelImg"
            alt
          >
          <div
            class="show-img-cover"
            v-else
          >
            <i
              @click="showImgModal"
              class="xx-icon icon-edit"
            ></i>
          </div>
          <div
            class="img-cover"
            v-if="formItem.hotelImg"
          >
            <i
              @click="showImgModal"
              class="xx-icon icon-edit"
            ></i>
          </div>
        </div>
      </FormItem>

      <FormItem
        label="订单短信通知："
        prop="messagePhone"
      >
        <Input
          v-model="formItem.messagePhone"
          style="width:33%"
          :maxlength="11"
        ></Input>
        <Button
          type="primary"
          @click="getModal"
        >设置模板</Button>
      </FormItem>
      <div
        id="base"
        class="form-title"
      >酒店设施与服务</div>
      <FormItem
        label="酒店设施："
        prop="facility"
      >
        <Row>
          <Col span="12">
          <CheckboxGroup v-model="formItem.facility">
            <!-- {{formItem.facility}} -->
            <Checkbox
              v-for="(item,index) in hotelTypeFacilityList"
              :key="index"
              :label="item.id+''"
            >{{item.name}}</Checkbox>
            <Input
              style="width:100px;display:inline-block;"
              size="small"
              :maxlength="6"
              v-model="facilityName"
              @on-blur="newFacility"
              placeholder="自定义酒店设施"
            ></Input>
          </CheckboxGroup>

          </Col>
          <Col span="2">
          </Col>
        </Row>
      </FormItem>
      <FormItem
        label="酒店服务："
        prop="service"
      >
        <Row>
          <Col span="12">
          <CheckboxGroup v-model="formItem.service">
            <!-- {{formItem.facility}} -->
            <Checkbox
              v-for="(item,index) in pmsHotelServiceList"
              :key="index"
              :label="item.id+''"
            >{{item.name}}</Checkbox>
            <Input
              style="width:100px;display:inline-block;"
              :maxlength="6"
              size="small"
              v-model="serviceName"
              @on-blur="newService"
              placeholder="自定义酒店服务"
            ></Input>
          </CheckboxGroup>
          </Col>
        </Row>
      </FormItem>
      <div
        id="base"
        class="form-title"
      >入住须知</div>
      <FormItem
        label="入离时间："
        required
      >
        <!-- <Input
          v-model="formItem.checkInTime"
          style="width:150px;"
         
        ></Input>  -->
        <Row>
          <Col span="3">
          <FormItem prop="checkInTime">
            <TimePicker
              type="time"
              v-model="formItem.checkInTime"
              format="HH:mm"
              placeholder="如13:30"
              :clearable="false"
              :editable="false"
              @on-change="formItem.checkInTime=$event"
            ></TimePicker>
          </FormItem>
          </Col>

          <Col span="2">
          以后入住
          </Col>
          <Col span="3">
          <FormItem prop="checkOutTime">
            <TimePicker
              type="time"
              v-model="formItem.checkOutTime"
              @on-change="formItem.checkOutTime=$event"
              format="HH:mm"
              placeholder="如12:00"
              :clearable="false"
              :editable="false"
            ></TimePicker>
          </FormItem>
          </Col>
          <Col span="2">
          以前退房
          </Col>

        </Row>

        <!-- <Input
          v-model="formItem.checkOutTime"
          style="width:150px;"
          
        ></Input> -->

      </FormItem>
      <FormItem label="宠物携带：">
        <Select
          v-model="formItem.ifPet"
          style="width:200px"
        >
          <Option value="">请选择</Option>
          <Option value="F">不允许携带宠物入住</Option>
          <Option value="T">允许携带宠物入住</Option>
        </Select>
      </FormItem>

      <!-- <FormItem
        :label="item.key+'：'"
       
        
      >
        <Input
          type="textarea"
          style="width:500px"
          v-model="item.value"
          :placeholder="'请输入'+item.key+'，300个字符以内'"
          :maxlength="300"
          :rows="4"
        ></Input>
      </FormItem> -->
      <div
        style="margin:0 0 20px 40px;"
        v-for="(item,index) in formItem.checkInJson"
        :key="index"
      >
        <span>
          <span
            style="margin-left:10px;display:inline-block;"
            v-if="item.id&&item.id!=''"
          >{{item.key}}</span>
          <FormItem v-else class="checkInJsontag" style="display:inline-block;"
           :prop="'checkInJson.' + index + '.key'"
          :rules="{required: true, message: '第 ' + (index+1) +'不能为空', trigger: 'blur'}">
               <Input
            style="width:80px"
            v-model="item.key"
            
            :maxlength="4"
            placeholder="请输入"
          ></Input>
          </FormItem>
          ：
          </span>
        <span><Input
            type="textarea"
            style="width:500px"
            v-model="item.value"
            :placeholder="'请输入'+item.key+'，300个字符以内'"
            :maxlength="300"
            :rows="4"
          ></Input></span>
        <span
          v-if="!item.id"
          style="margin-left:20px;"
        ><a @click="delCheckIn(index)">删除</a></span>
      </div>

      <FormItem v-if="formItem.checkInJson.length<=6">
        <a @click="addCheckIn"> + 添加自定义项</a>
      </FormItem>

      <FormItem>
        <div class="save-cancel">
          <Button
            type="primary"
            :loading="btnLoading"
            @click="submit"
          >保存</Button>
          <Button
            type="ghost"
            @click="back"
            style="margin-left: 8px"
          >取消</Button>
        </div>
      </FormItem>
    </Form>
    <pics-modal
      @getImg="setImg"
      ref="picsModal"
      title="酒店图片"
      :coute="$route.query.id?'edit':'new'"
    ></pics-modal>
    <Modal
      v-model="model2"
      title="查看模板"
    >
      <p>
        您有新的待确认酒店订单，订单号 {tradeNo}，请在 {time} 分钟内确认，逾期将被取消。
      </p>
      <div slot="footer">
        <Button @click="cancel">关闭</Button>
      </div>
    </Modal>
    <!-- <amap ref="bdMap" @getPoint="setLngAndLat"></amap> -->
  </div>
</template>
<script>
import draggable from "vuedraggable";
import axios from "axios";
// import AMap from "vue-amap";
import store from "@/store";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
// import amap from "@/components/global/amap";
import myImg from "@/components/global/singleImg";
import selectItem from "@/components/global/selectList";
import picsModal from "@/components/global/picsModal";
import vueUEditor from "@/components/global/vueUEditor";
// import upImg from "./upImg";
export default {
  data() {
    let self = this;
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 350,
        maximumWords: 1000
      },
      sortFlag: true,
      btnLoading: false,
      coverShow: false,
      lng: 120.14606,
      lat: 30.279242,
      addressCode: "", //地区编码
      pmsHotelTypeList: [], //酒店类型
      pmsHotelLevelList: [], //酒店级别
      imgList: [], //图片类表
      hotelTypeFacilityList: [], //酒店设施列表
      pmsHotelServiceList: [], //酒店服务列表
      pageData: {},
      cmbProvince: "",
      cmbCity: "",
      cmbArea: "",
      loading: true,
      model2: false,
      facilityName: "",
      serviceName: "",
      formItem: {
        isDirect: "F",
        pmsCode: "", //PMS-酒店编码
        pmsName: "", //PMS-酒店名称
        name: "", // 对外酒店别称
        linkTel: "", //酒店联系人电话
        hotelLevel: "", //酒店星级
        hotelType: "", //酒店类型
        summary: "", //酒店简介
        isInland: "T", //T:国内,F:国外
        provinceCode: "", //省CODE
        cityCode: "", //市CODE
        regionCode: "", //区CODE
        area: "", //地区详细信息
        latitudeLongitude: "", //地图坐标
        hotelImg: "", //酒店图片
        facility: [], //设施信息
        service: [], //服务信息
        isShow: false,
        messagePhone: "",
        openTimeYear: "",
        trimTimeYear: "",
        checkInTime: "",
        checkOutTime: "",
        type: "",
        tag: [
          {
            name: ""
          },
          {
            name: ""
          },
          {
            name: ""
          }
        ],
        checkInJson: [
          {
            key: "儿童政策",
            value: "",
            id: "1"
          },
          {
            key: "特别说明",
            value: "",
            id: "2"
          }
        ]
      },

      ruleComplteForm: {
        pmsName: [{ required: true }],
        name: [
          { required: true, message: "请填写对外酒店别名", trigger: "blur" },
          { max: 64, message: "酒店别名字数不能超过64个" }
        ],
        type:[
          { required: true, message: "请选择酒店归属", trigger: "change" }
        ],
        linkTel: [
          { required: true, message: "请填写联系电话", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/,
            message: "请填写正确的号码",
            trigger: "blur"
          }
        ],
        messagePhone: [
          { required: true, message: "请填写联系电话", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "请填写正确的号码",
            trigger: "blur"
          }
        ],
        hotelLevel: [
          { required: true, message: "请选择酒店星级", trigger: "change" }
        ],
        hotelType: [
          { required: true, message: "请选择酒店类型", trigger: "change" }
        ],
        // isPush: [
        //   { required: true, message: "请选择向PMS下单方式", trigger: "change" }
        // ],
        summary: [
          { required: true, message: "请填写酒店简介", trigger: "blur" },
          {
            max: 1000,
            message: "酒店简介字数不能超过1000"
          }
        ],
        hotelImg: [{ required: true, message: "请选择图片" }],
        facility: [
          {
            required: true,
            type: "array",
            min: 4,
            message: "至少选择4项",
            trigger: "change"
          }
        ],
        service: [
          {
            required: true,
            type: "array",
            min: 4,
            message: "至少选择4项",
            trigger: "change"
          }
        ],

        openTimeYear: [
          {
            required: true,
            type: "date",
            message: "请选择开业时间",
            trigger: "change"
          }
        ],
        trimTimeYear: [
          {
            required: true,
            type: "date",
            message: "请选择最新装修时间",
            trigger: "change"
          }
        ],
        checkInTime: [
          {
            required: true,
            message: "请选择入离时间",
            trigger: "change"
          }
        ],
        checkOutTime: [
          {
            required: true,
            message: "请选择入离时间",
            trigger: "change"
          }
        ],
        area: [{ required: true, message: "请填写详细地址", trigger: "blur" }]
      },
      ifQueryId: false,
      mainUserId: "",
      hotelId: ""
    };
  },
  watch: {},
  computed: {},
  mounted() {
    $(".step-hotelType").click(() => {
      if (this.ifQueryId) {
        this.$router.push(
          "/roomInfoSet?id=" + this.hotelId + "&mainUserId=" + this.mainUserId
        );
      }
    });
    $(".step-distributy").click(() => {
      if (this.ifQueryId) {
        this.$router.push(
          "/hoteldistributionSet?id=" +
            this.hotelId +
            "&mainUserId=" +
            this.mainUserId
        );
      }
    });
  },
  created() {
    if (this.$route.query.id) {
      this.getList();
      this.ifQueryId = true;
      this.hotelId = this.$route.query.id;
      this.mainUserId = this.$route.query.mainUserId;
    } else {
      this.ifQueryId = false;
      this.$nextTick(() => {
          this.mapInit();
        });
    }
    this.getchangeList();
  },
  methods: {
    getList() {
      apiGet("/pmsproduct/api/pmsHotel/queryPmsHotelInfo", {
        id: this.$route.query.id,
        mainUserId: this.$route.query.mainUserId
      }).then(res => {
        this.pageData = res.data;
        // this.formItem.id =res.data.id
        this.formItem.pmsCode = res.data.pmsCode;
        this.formItem.pmsName = res.data.pmsName;
        this.formItem.name = res.data.name;
        //   this.formItem.isPush = res.data.isPush;
        this.formItem.linkTel = res.data.linkTel;
        this.formItem.messagePhone = res.data.messagePhone;
        this.formItem.hotelLevel = res.data.hotelLevel
          ? res.data.hotelLevel + ""
          : "";
        this.formItem.hotelType = res.data.hotelType
          ? res.data.hotelType + ""
          : "";

        this.formItem.summary = res.data.summary ? res.data.summary : "";
        this.formItem.isInland = res.data.isInland;
        this.formItem.provinceCode = res.data.provinceCode;
        this.formItem.cityCode = res.data.cityCode;
        this.formItem.regionCode = res.data.regionCode;
        this.formItem.area = res.data.area;
        this.formItem.service = res.data.service
          ? res.data.service.split(",")
          : [];
        this.formItem.checkInTime = res.data.checkInTime;
        this.formItem.checkOutTime = res.data.checkOutTime;
        this.formItem.trimTimeYear = res.data.trimTimeYear;
        this.formItem.openTimeYear = res.data.openTimeYear;
        this.formItem.ifPet = res.data.ifPet;
        if (res.data.tag) {
          this.formItem.tag = JSON.parse(res.data.tag);
        }
        if (res.data.checkInJson) {
          this.formItem.checkInJson = JSON.parse(res.data.checkInJson);
        }
        if (res.data.isShow && res.data.isShow == "T") {
          this.formItem.isShow = true;
        } else {
          this.formItem.isShow = false;
        }
        this.formItem.latitudeLongitude = res.data.latitudeLongitude;
        this.formItem.hotelImg = res.data.hotelImg ? res.data.hotelImg : "";
        if (!res.data.hotelImg && this.$route.query.id) {
          //不存在图片的情况下请求接口
          apiPost("/pmsproduct/api/pmsImg/queryPmsImg", {
            pmsId: this.$route.query.id,
            mainUserId: this.$route.query.mainUserId,
            type: "hotel"
          }).then(res => {
            if (res.data && res.data.length) {
              this.formItem.hotelImg = res.data[0].imgUrl;
            }
          });
        }
        this.addressCode =
          res.data.provinceCode +
          "-" +
          res.data.cityCode +
          "-" +
          res.data.regionCode;
        // this.cmbProvince +"-"+this.cmbCity +"-"+this.cmbArea
        let arr =
          res.data.areaName && res.data.areaName.split("-").length == 3
            ? res.data.areaName.split("-")
            : [];
        if (arr.length == 3) {
          this.cmbProvince = arr[0];
          this.cmbCity = arr[1];
          this.cmbArea = arr[2];
        } else {
          this.cmbProvince = "";
          this.cmbCity = "";
          this.cmbArea = "";
        }

        // this.formItem.hotelTypeNum =res.data.hotelTypeNum
        this.formItem.type = res.data.type;
        this.formItem.isDirect = res.data.isDirect;
        // this.formItem.mainUserId =res.data.id
        this.formItem.facility = res.data.facility
          ? res.data.facility.split(",")
          : [];
        if (
          res.data.latitudeLongitude &&
          res.data.latitudeLongitude.split(",").length == 2
        ) {
          this.lng = res.data.latitudeLongitude.split(",")[0];
          this.lat = res.data.latitudeLongitude.split(",")[1];
        }
        this.$nextTick(() => {
          this.mapInit();
        });
      });
    },
    getchangeList() {
      apiGet(
        "/pmsproduct/api/pmsHotel/listKeys?keys=" +
          "pmsHotelFacility,pmsHotelLevel,pmsHotelType,pmsHotelService"
      ).then(res => {
        this.hotelTypeFacilityList = res.data.pmsHotelFacility;
        this.pmsHotelServiceList = res.data.pmsHotelService;
        this.pmsHotelLevelList = res.data.pmsHotelLevel;
        this.pmsHotelTypeList = res.data.pmsHotelType;
      });
    },
    getFacility() {
      apiGet(
        "/pmsproduct/api/pmsHotel/listKeys?keys=" + "pmsHotelFacility"
      ).then(res => {
        this.hotelTypeFacilityList = res.data.pmsHotelFacility;
      });
    },
    getService() {
      apiGet(
        "/pmsproduct/api/pmsHotel/listKeys?keys=" + "pmsHotelService"
      ).then(res => {
        this.pmsHotelServiceList = res.data.pmsHotelService;
      });
    },
    addCheckIn() {
      this.formItem.checkInJson.push({ key: "", value: "" });
    },
    delCheckIn(i) {
      this.formItem.checkInJson.splice(i, 1);
    },
    newFacility() {
      if (this.facilityName) {
        apiPost("/pmsproduct/api/pmsHotelFacilityService/insertCustom", {
          name: this.facilityName,
          type: "hotelFacility"
        }).then(res => {
          if (res.status == 200) {
            this.$Message.success("添加成功");
            this.getFacility();
            this.facilityName = "";
          } else {
            this.$Message.warning(res.message);
          }
        });
      } else {
        this.$Message.warning("自定义酒店设施不能为空");
      }
    },
    newService() {
      if (this.serviceName) {
        apiPost("/pmsproduct/api/pmsHotelFacilityService/insertCustom", {
          name: this.serviceName,
          type: "service"
        }).then(res => {
          if (res.status == 200) {
            this.$Message.success("添加成功");
            this.getService();
            this.serviceName = "";
          } else {
            this.$Message.warning(res.message);
          }
        });
      } else {
        this.$Message.warning("自定义酒店服务不能为空");
      }
    },
    getVueText() {},
    //设置模板
    getModal() {
      this.model2 = true;
    },
    //关闭
    cancel() {
      this.model2 = false;
    },
    setImg(item) {
      if (this.$route.query.id) {
        this.formItem.hotelImg = item&&item.imgUrl ? item.imgUrl : "";
      } else {
        this.formItem.hotelImg = item.length?item[0].imgUrl:'';
        if(item.length){
           item.forEach(ele => {
          delete ele.id;
        }); 
        }
        this.formItem.imgJson = JSON.stringify(item);
      }
    },
    mapInit() {
      let _this = this;
      this.map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11, //初始化地图层级
        center: [_this.lng, _this.lat] //初始化地图中心点
      });
      this.map.on("complete", function() {
        _this.marker = new AMap.Marker({
          icon:
            "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          position: [_this.lng, _this.lat]
          // offset: new AMap.Pixel(-13, -30)
        });
        // _this.marker.setMap(_this.map);
        _this.map.add(_this.marker);
        _this.map.on("click", _this.clickHandler);
      });
    },
    search() {
      let _this = this;
      let keyword =
        (this.cmbProvince ? this.cmbProvince : "") +
        (this.cmbCity ? this.cmbCity : "") +
        (this.cmbArea ? this.cmbArea : "") +
        (this.formItem.area ? this.formItem.area : "");
      console.log(keyword);
      AMap.plugin("AMap.PlaceSearch", function() {
        var autoOptions = {
          city: "全国"
        };
        var placeSearch = new AMap.PlaceSearch(autoOptions);
        placeSearch.search(keyword, function(status, result) {
          // 搜索成功时，result即是对应的匹配数据
          // console.log(status);
          // console.log(result);

          if (
            status == "complete" &&
            result.poiList &&
            result.poiList.pois.length
          ) {
            // let length = result.poiList.pois.length;
            // let latSum = 0;
            // let lngSum = 0;
            // result.poiList.pois.forEach(poi => {
            //   let { lng, lat } = poi.location;
            //   lngSum += lng;
            //   latSum += lat;
            // });
            // let center = {
            //   lng: lngSum / length,
            //   lat: latSum / length
            // };
            let lng = result.poiList.pois[0].location.lng;
            let lat = result.poiList.pois[0].location.lat;
            _this.formItem.latitudeLongitude = lng + "," + lat;
            _this.map.setZoomAndCenter(14, [lng, lat]);
            _this.clearMarker();
            _this.marker = new AMap.Marker({
              icon:
                "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
              position: [lng, lat]
              // offset: new AMap.Pixel(-13, -30)
            });
            // _this.marker.setMap(_this.map);
            _this.map.add(_this.marker);
          } else {
            _this.$Message.warning("没有找到对应地点");
          }
        });
      });
    },
    clickHandler(e) {
      console.log(e);
      let _this = this;
      this.clearMarker();
      let lng = e.lnglat.lng;
      let lat = e.lnglat.lat;
      this.marker = new AMap.Marker({
        icon:
          "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: [lng, lat]
        // offset: new AMap.Pixel(-13, -30)
      });
      this.formItem.latitudeLongitude = lng + "," + lat;
      this.marker.setMap(this.map);
      //经纬度获取地点名称
      // AMap.plugin("AMap.Geocoder", function() {
      //   var geocoder = new AMap.Geocoder({
      //     // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      //     city: "全国"
      //   });

      //   var lnglat = [lng, lat];

      //   geocoder.getAddress(lnglat, function(status, result) {
      //     if (status === "complete" && result.info === "OK") {
      //       // result为对应的地理位置详细信息
      //       console.log(result);
      //       _this.formItem.area = result.regeocode.formattedAddress;
      //     }
      //   });
      // });
    },
    clearMarker() {
      if (this.marker) {
        this.map.remove(this.marker);
      }
    },
    showImgModal() {
      // this.imgModalShow = true;
      // this.getImgList();
      this.$refs.picsModal.show();
    },

    //初始化发布页面

    //获取下拉框内容
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
    getProvince(sheng, e) {
      //省
      console.log(sheng, e);
      this.cmbProvince = sheng;
      this.formItem.provinceCode = e;
      this.cmbCity = "";
      this.formItem.cityCode = "";
      this.cmbArea = "";
      this.formItem.regionCode = "";
      // this.formItem.province = e;
      // this.formItem.city = '';
      //  this.formItem.area = '';
    },

    getCity(city, e) {
      //市
      console.log(city, e);
      this.cmbCity = city;
      this.formItem.cityCode = e;
      this.cmbArea = "";
      this.formItem.regionCode = "";
      // this.formItem.city = e;
      //  this.formItem.area = '';
    },
    getQu(qu, e) {
      //区
      console.log(qu, e);
      this.cmbArea = qu;
      this.formItem.regionCode = e;
    },

    //选择酒店
    selectHotel() {
      this.tableLoading = true;
      apiPost("/pmsproduct/api/hotelPush/pageHotel", {
        currPage: this.page,
        pageSize: 10,
        name: this.formItem.name
      }).then(res => {
        if (res.status == 200) {
          this.tableLoading = false;
          this.data6 = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    //选择酒店
    senicSelect() {
      this.model = true;
      this.selectHotel();
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
    back() {
      this.$router.back();
    },
    submit() {
      this.btnLoading = true;
      let _this = this;
      this.$refs.formItem.validate(async valid => {
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
            this.btnLoading = false;
            return false;
          }
          if (this.formItem.latitudeLongitude == "") {
            this.$Message.warning("请选择地址坐标");
            $("#content").scrollTop(
              $(".address-select").offset().top - 90 + $("#content").scrollTop()
            );
            this.btnLoading = false;
            return false;
          }

          //   let url = "/pmsproduct/api/pmsHotel/editPmsHotelSave";
          let url = this.hotelId
            ? "/pmsproduct/api/pmsHotel/editPmsHotelSave"
            : "/pmsproduct/api/pmsHotel/insertPmsHotel";
          //深度复制
          let formData = JSON.parse(JSON.stringify(this.formItem));
          formData.areaName =
            this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;
          formData.trimTimeYear = this.GetbDate(formData.trimTimeYear);
          formData.openTimeYear = this.GetbDate(formData.openTimeYear);
          formData.facility = formData.facility.join(",");
          formData.service = formData.service.join(",");
          formData.checkInJson = JSON.stringify(formData.checkInJson);
          formData.tag = JSON.stringify(formData.tag);
          formData.isShow = formData.isShow ? "T" : "F";
          formData.mainUserId = this.$route.query.mainUserId;
          formData.id = this.$route.query.id;
          console.log(formData);
          let res = await apiPost(
            url,
            Object.assign(formData, {
              id: this.$route.query.id,
              mainUserId: this.$route.query.mainUserId
            })
          );
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            this.ifQueryId = true;
            this.hotelId =
              res.data && res.data.id ? res.data.id : this.$route.query.id;
            this.mainUserId =
              res.data && res.data.mainUserId
                ? res.data.mainUserId
                : this.$route.query.mainUserId;
            setTimeout(function() {
              $("#content").animate(
                {
                  scrollTop: 0
                },
                300
              );
            }, 500);
            this.btnLoading = false;
            // _this.$router.back();
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          this.btnLoading = false;
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
    GetbDate(day) {
      var dd = new Date(day);
      var y = dd.getFullYear();
      return y;
    }
  },
  components: {
    myImg,
    selectItem,
    // upImg,
    draggable,
    picsModal,
    vueUEditor
  }
};
</script>
<style scope lang="scss">
.hotel-baseinfo-p {
  width: 100%;
  .checkInJsontag{
      margin-top:30px!important;
      .ivu-form-item-content{
          margin-left:0 !important;
      }
  }
  .map-warpper {
    height: 400px;
    position: relative;
    .cover {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 100;
      line-height: 400px;
      text-align: center;
      .text {
        font-size: 24px;
        font-weight: 600;
        color: #fff;
      }
    }
  }
  #container {
    width: 100%;
    height: 400px;
    .amap-icon img,
    .amap-marker-content img {
      width: 25px;
      height: 34px;
    }
  }
  .amap-demo {
    height: 400px;
  }
  .amap-page-container {
    height: 400px;
  }
  .search-box {
    height: 32px;
    box-shadow: none;
    border: 1px solid #dddee1;
  }
  .image-box {
    height: 150px;
    width: 200px;
    position: relative;
    .show-img {
      height: 100%;
      width: 100%;
    }
    .show-img-cover {
      background: rgba(0, 0, 0, 0.3);
      height: 100%;
      width: 100%;
      height: 150px;
      line-height: 150px;
      text-align: center;
      .xx-icon {
        font-size: 50px;
        color: #fff;
        cursor: pointer;
      }
    }
    .img-cover {
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.3);
      height: 150px;
      line-height: 150px;
      text-align: center;

      .icon-edit {
        font-size: 50px;
        color: #fff;
        cursor: pointer;
      }
    }
    &:hover {
      .img-cover {
        display: block;
      }
    }
  }
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
.money-unit {
  margin-left: 8px;
}
.save-cancel {
  padding-bottom: 50px;
}
</style>





