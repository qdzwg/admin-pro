<template>
  <div class="roomInfoSet-page">
    <div class="step">
      <Steps :current="1">
        <Step
          title="酒店基础管理"
          class="step-hotelType"
          style="cursor:pointer"
        ></Step>
        <Step title="房型管理"></Step>
        <Step
          title="销售设置"
          class="step-distributy"
          style="cursor:pointer"
        ></Step>
      </Steps>
    </div>
    <Button
    v-if="isDirect=='F'"
      type="primary"
      icon="android-add"
      @click="newHotelType"
    >新建房型</Button>
    <div class="ul clearfix">
      <draggable
        v-model="pageData"
        v-bind="{animation:150}"
        :no-transition-on-drag="true"
        @update="dragEnd"
      >
        <div
          class="li fl"
          v-for="(item,index) in pageData"
          :key="index"
        >
          <div class="li-content">
            <div
              v-if="item.recommend=='T'"
              class="li-content-bottom"
            >
              <i class="xx-icon icon-iconfont-shoucang1"></i>
              <span>优先推荐</span>
            </div>
            <div class="li-img">
              <template v-if="item.typeImg">
                <img
                  :src="item.typeImg"
                  alt
                >
                <div
                  @click="imgShow(item.id)"
                  class="img-cover"
                >修改图片</div>
              </template>

              <div
                v-if="!item.typeImg"
                class="select-img"
              >
                <span
                  class="up-text"
                  @click="imgShow(item.id)"
                >
                  <Icon
                    type="plus-round"
                    color="#1a8fe0"
                    size="16"
                  ></Icon>
                  <span class="text">上传图片</span>
                </span>
              </div>
            </div>
            <div class="li-body">
              <table>
                <tr>
                  <td >
                    <Button
                      type="success"
                      size="small"
                      v-if="item.isDirect&&item.isDirect=='T'"
                    >直连</Button>
                    <Button
                    v-else
                      type="success"
                      size="small"
                    >非直连</Button>
                  </td>
                  <td>
                    <div class="room-name">{{item.pmsName?item.pmsName:''}}</div>
                  </td>
                  <td class="icon-td">
                    <i
                      @click="roomShow(item)"
                      class="xx-icon icon-edit"
                    ></i>
                  </td>
                </tr>
                <tr>
                  <td>别名：</td>
                  <td colspan="2">
                    <div class='name-td'>{{item.name?item.name:''}}</div>
                  </td>
                </tr>
                <tr>
                  <td>编码：</td>
                  <td colspan="2">{{item.code?item.code:''}}</td>
                </tr>

                <tr>
                  <td>楼层：</td>
                  <td colspan="2">
                    <template v-if='item.floor'>
                      {{item.floor}}层
                    </template>
                  </td>
                </tr>
                <tr>
                  <td>面积：</td>
                  <td colspan="2">
                    <template v-if='item.acreage'>
                      {{item.acreage}}平方米
                    </template>
                  </td>
                </tr>
                <tr>
                  <td>窗户：</td>
                  <td colspan="2">
                    {{item.ifWindow=='0'?'有窗':item.ifWindow=='1'?'无窗':item.ifWindow=='2'?'落地窗':''}}
                  </td>
                </tr>
                <tr>
                  <td>人数：</td>
                  <td colspan="2">{{item.numberValue?item.numberValue:''}}</td>
                </tr>
                <tr>
                  <td>床型：</td>
                  <td colspan="2">{{item.bedTypeValue?item.bedTypeValue:""}}</td>
                </tr>
                <tr>
                  <td>设施：</td>
                  <td colspan="2">
                    <div class='facilityValue-td'>
                      {{item.facilityValue?item.facilityValue:''}}
                    </div>

                  </td>
                </tr>
                <tr>
                  <td>简介：</td>
                  <td colspan="2">
                    <div class='summary-td'>{{item.summary?item.summary:''}}</div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </draggable>
    </div>

    <div
      v-if='pageData.length'
      style="margin-top:15px"
    >
      <Page
        @on-change="pageChange"
        :page-size="limit"
        :total="total"
      ></Page>
    </div>
    <div
      v-else
      class='no-room-data'
    >暂无房型</div>
    <Modal
      width="1000"
      class="room-edit-modal"
      v-model="roomEditShow"
      :title="roomTypeTitle"
    >
      <div
        v-if='contentShow'
        class="hotel-roomType-content"
      >
        <Form
          :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm"
        >
          <FormItem label="房型图片：" prop="typeImg">
            <div class="image-box">
              <img
                class="show-img"
                v-if="formItem.typeImg"
                :src="formItem.typeImg"
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
                v-if="formItem.typeImg"
              >
                <i
                  @click="imgShow(formItem.id)"
                  class="xx-icon icon-edit"
                ></i>
              </div>
            </div>
          </FormItem>
          <FormItem
            label="房型名称："
            v-if="roomTypeTitle=='编辑房型'"
          >{{hotelTypeData.pmsName}}</FormItem>
          <FormItem
            label="房型名称："
            prop="pmsName"
            v-else
          ><Input v-model="formItem.pmsName" :maxlength="30"></Input></FormItem>
          <FormItem
            label="对外别名："
            prop="name"
          >
            <Input
              v-model="formItem.name"
              :maxlength="30"
            ></Input>
          </FormItem>
          <FormItem
            label="楼层："
            prop="floor"
          >
            <Input
              v-model="formItem.floor"
              :maxlength="10"
              style="width:200px;"
            ></Input>
            <span class="money-unit">层</span>
          </FormItem>
          <FormItem
            label="面积："
            prop="acreage"
          >
            <Input
              v-model="formItem.acreage"
              :maxlength="10"
              style="width:200px;"
            ></Input>
            <span class="money-unit">平方米</span>
          </FormItem>
          <FormItem
            label="窗户："
            prop="ifWindow"
          >
            <Select
              v-model="formItem.ifWindow"
              style="width:200px"
            >
              <Option value="">请选择</Option>
              <Option value="0">有窗</Option>
              <Option value="1">无窗</Option>
              <Option value="2">落地窗</Option>
            </Select>
          </FormItem>
          <FormItem
            label="可住人数："
            prop="number"
          >
            <Select
              v-model="formItem.number"
              style="width:200px"
            >
              <Option
                v-for="(item,index) in pmsHotelTypeLiveNumList"
                :value="item.key"
                :key="index"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem
            label="床型："
            prop="bedType"
          >
            <Select
              v-model="formItem.bedType"
              style="width:200px"
            >
              <Option
                v-for="(item,index) in pmsHotelBedTypeList"
                :value="item.key"
                :key="index"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem
            label="设施："
            prop="facility"
          >
            <CheckboxGroup v-model="formItem.facility">
              <Checkbox
                v-for="(item,index) in pmsHotelTypeFacilityList"
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
          </FormItem>
          <FormItem
            label="房型简介："
            prop="summary"
          >
            <Input
              type="textarea"
              :maxlength="200"
              v-model="formItem.summary"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="请输入简介"
            ></Input>
          </FormItem>
          <FormItem
            label="房屋类型："
            prop="isCivilian"
          >
            <RadioGroup
              @on-change="isCivilianChange"
              v-model="formItem.isCivilian"
            >
              <Radio label="F">非民宿套房</Radio>
              <Radio label="T">民宿套房</Radio>
            </RadioGroup>
          </FormItem>
          <template v-if="formItem.isCivilian=='T'">
            <FormItem
              label="卧室数量："
              prop="bedroomNum"
            >
              <Select
                v-model="formItem.bedroomNum"
                style="width:200px"
              >
                <Option
                  v-for="(item,index) in pms_bedroom_num_typeList"
                  :value="item.key"
                  :key="index"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem
              label="卫生间数量："
              prop="bathroomNum"
            >
              <Select
                v-model="formItem.bathroomNum"
                style="width:200px"
              >
                <Option
                  v-for="(item,index) in pms_bathroom_num_typeList"
                  :value="item.key"
                  :key="index"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem
              class='address-content'
              label="地址："
            >
              <Col span="9">
              <!-- <select-item
                  span="8"
                  ref="select"
                  :addrCode="addressCode"
                  @getProvince="getProvince"
                  @getCity="getCity"
                  @getQu="getQu"
                ></select-item>-->
              <select-item
                v-if="roomEditShow"
                span="8"
                ref="select"
                :addrCode="addressCode"
                @getProvince="getProvince"
                @getCity="getCity"
                @getQu="getQu"
              ></select-item>
              </Col>
              <Col
                style="margin-left:10px"
                span="6"
              >
              <Input
                v-model="formItem.area"
                placeholder="请填写详细地址"
                :maxlength="128"
              ></Input>
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
                span="24"
              >
              <div
                v-if="coverShow"
                @click="coverShow=!coverShow"
                class="cover"
              >
                <span class="text">点击释放地图</span>
              </div>
              <div id="container"></div>
              </Col>
              </Col>
            </FormItem>
          </template>
          <!-- <FormItem>
            <div class="save-cancel">
              
            </div>
          </FormItem> -->
        </Form>
      </div>
      <div slot="footer">
        <Button
          type="primary"
          :loading="btnLoading"
          @click="submit"
        >保存</Button>
        <Button @click="close">取消</Button>
      </div>
    </Modal>

    <pics-modal
      @getImg="setImg"
      ref="picsModal"
      title="房型图片"
      :imgType="'hotel_type'"
      :coute="roomTypeTitle=='编辑房型'?'edit':'new'"
    ></pics-modal>
  </div>
</template>
<script>
// import upImg from "./upImg";
import picsModal from "@/components/global/picsModal";
import axios from "axios";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import selectItem from "@/components/global/selectList";
import draggable from "vuedraggable";
export default {
  components: {
    picsModal,
    selectItem,
    draggable
  },
  created() {
    this.pageInitData();
  },
  mounted() {
    $(".step-hotelType").click(() => {
      this.$router.push(
        "/hotelBaseInfo?id=" +
          this.$route.query.id +
          "&mainUserId=" +
          this.$route.query.mainUserId
      );
    });
    $(".step-distributy").click(() => {
      this.$router.push(
        "/hoteldistributionSet?id=" +
          this.$route.query.id +
          "&mainUserId=" +
          this.$route.query.mainUserId
      );
    });
  },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
        isDirect:'',
      facilityName: "",
      contentShow: false,
      addressCode: "",
      coverShow: true,
      hotelTypeData: {},
      pageData: [],
      total: 0,
      limit: 4,
      page: 1,
      pmsHotelTypeFacilityList: [],
      pms_bathroom_num_typeList: [],
      pms_bedroom_num_typeList: [],
      pmsHotelBedTypeList: [],
      pmsHotelTypeLiveNumList: [],
      type: 1,
      btnLoading: false,
      arr: [1, 2, 3, 4],
      imgModalShow: false,
      roomEditShow: false,
      roomTypeTitle: "新增房型",
      imgList: [],
      formItem: {
        name: "", //房型名称
        pmsCode: "", //
        latitudeLongitude: "", //经纬度
        provinceCode: "", //省市区
        cityCode: "",
        regionCode: "",
        areaName: "", //省-市-区
        area: "", //详细地址
        pmsName: "", //PMS房型别名
        typeImg: "", //房型图片
        floor: "", //楼层
        acreage: "", //面积
        number: "2", //可住人数
        facility: [], //设施
        summary: "", //简介
        isCivilian: "", //F非民宿 T民宿
        bedroomNum: "", //卧室数量
        bathroomNum: "", //卫生间数量
        bedType: "", //BED_TYPE床型
        // bedBreadth: "", //床型宽度
        // bedBreadth: "", //床型类型（大床、小床、单人床等）
        // bedNum: "" //床型张数
        ifWindow: ""
      },
      ruleComplteForm: {
          typeImg:[{ required: true, message: "请选择图片" }],
        pmsName: [
          { required: true, message: "请填写房型名称", triggle: "blur" }
        ],
        name: [{ required: true, message: "请填写对外别名", trigger: "blur" }],
        floor: [
          {
            required: true,
            message: "请填写楼层",
            trigger: "blur"
          },
        ],
        acreage: [
          {
            required: true,
            message: "请填写面积",
            trigger: "blur"
          },
         
        ],
        number: [
          { required: true, message: "请选择可住人数", trigger: "change" }
        ],
        bedType: [
          { required: true, message: "请选择可住人数", trigger: "change" }
        ],
        ifWindow: [
          {
            required: true,
            message: "请选择窗户",
            trigger: "change"
          }
        ],
        facility: [
          {
            required: true,
            type: "array",
            min: 4,
            message: "至少选择4项",
            trigger: "change"
          }
        ],
        summary: [
          { required: true, message: "请填写简介", trigger: "blur" },
          { max: 500, message: "请填写简介" }
        ],
        bedroomNum: [
          { required: true, message: "请选择卧室数量", trigger: "change" }
        ],
        bathroomNum: [
          { required: true, message: "请选择卫生间数量", trigger: "change" }
        ]
      }
    };
  },

  methods: {
    dragEnd(e) {
      e.preventDefault(); //通知 Web 浏览器不要执行与事件关联的默认动作
      let obj = {},
        arr = [];
      this.pageData.forEach((item, index) => {
        obj = {
          id: item.id,
          sort: index + 1
        };
        arr.push(obj);
      });
      this.getSort(arr);
    },
    getSort(arr) {
      apiPostJson("/pmsproduct/api/pmsHotelType/updateSort", arr).then(res => {
        if (res.status == 200) {
          this.$Message.success(res.message);
          this.getData();
        }
      });
    },
    newFacility() {
      if (this.facilityName) {
        apiPost("/pmsproduct/api/pmsHotelFacilityService/insertCustom", {
          name: this.facilityName,
          type: "typeFacility "
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
    newHotelType() {
      this.roomEditShow = true;
      this.contentShow = true;
      this.roomTypeTitle = "新增房型";
      this.formItem.provinceCode = "";
      this.formItem.cityCode = "";
      this.formItem.regionCode = "";
      this.formItem.id = "";
      this.formItem.area = "";
      this.formItem.areaName = "";
      this.formItem.pmsCode = "";
      this.formItem.name = "";
      this.formItem.pmsName = "";
      this.formItem.typeImg = "";
      this.formItem.floor = "";
      this.formItem.acreage = "";
      this.formItem.number = "";
      this.formItem.facility = [];
      this.formItem.summary = "";
      this.formItem.isCivilian = "F";
      this.formItem.bedroomNum = "";
      this.formItem.bathroomNum = "";
      this.formItem.bedType = "";
      this.formItem.ifWindow = "";
      setTimeout(()=>{
        this.$refs.formItem.resetFields();
      },200)
    },
    showImgModal() {
      // this.imgModalShow = true;
      // this.getImgList();
      if(this.roomTypeTitle == "新增房型"){
        this.$refs.picsModal.show();
      }else{
           this.upImgId = this.formItem.id;
        this.$refs.picsModal.show(this.formItem.id);  
      }
    },
    pageInitData() {
      apiGet(
        "/pmsproduct/api/pmsHotel/listKeys?keys=" + "pmsHotelTypeFacility"
      ).then(res => {
        this.pmsHotelTypeFacilityList = res.data.pmsHotelTypeFacility;
      });
      apiPostJson("/admin/sysparam/findSysParamList", {
        types: [
          "pmsHotelBedType",
          "pmsHotelTypeLiveNum",
          "pms_bathroom_num_type",
          "pms_bedroom_num_type"
        ]
      }).then(res => {
        this.pmsHotelBedTypeList = res.data.pmsHotelBedType;
        this.pmsHotelTypeLiveNumList = res.data.pmsHotelTypeLiveNum;
        this.pms_bathroom_num_typeList = res.data.pms_bathroom_num_type;
        this.pms_bedroom_num_typeList = res.data.pms_bedroom_num_type;
        this.getData();
      });
    },
    getFacility() {
      apiGet(
        "/pmsproduct/api/pmsHotel/listKeys?keys=" + "pmsHotelTypeFacility"
      ).then(res => {
        this.pmsHotelTypeFacilityList = res.data.pmsHotelTypeFacility;
      });
    },
    setImg(item) {
      // console.log(item)

      if (this.roomTypeTitle == "新增房型") {
        this.formItem.typeImg = item[0].imgUrl;
        item.forEach(ele => {
          delete ele.id;
        });
        this.formItem.imgJson = JSON.stringify(item);
      } else {
           this.formItem.typeImg = item.imgUrl;
          if(item.imgUrl){
             
            apiPost("/pmsproduct/api/pmsImg/savePmsTypeMainImg", {
          pmsTypeId: this.upImgId,
          mainUserId: this.$route.query.mainUserId,
          imgUrl: item.imgUrl
        }).then(res => {
          this.pageInitData();
        });  
          }
        
      }
    },
    isCivilianChange(flag) {
      if (flag == "T") {
        this.$nextTick(() => {
          this.mapInit();
        });
      }
    },
    getProvince(sheng, e) {
      //省
      // console.log(sheng, e);
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
      // console.log(city, e);
      this.cmbCity = city;
      this.formItem.cityCode = e;
      this.cmbArea = "";
      this.formItem.regionCode = "";
      // this.formItem.city = e;
      //  this.formItem.area = '';
    },
    getQu(qu, e) {
      //区
      // console.log(qu, e);
      this.cmbArea = qu;
      this.formItem.regionCode = e;
    },
    mapInit() {
      let _this = this;
      let setObj = {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11 //初始化地图层级
      };
      if (this.lng && this.lat) {
        setObj = Object.assign(setObj, { center: [_this.lng, _this.lat] });
      }
      this.map = new AMap.Map("container", setObj);
      this.map.on("complete", function() {
        if (_this.lng && _this.lat) {
          _this.marker = new AMap.Marker({
            icon:
              "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
            position: [_this.lng, _this.lat]
            // offset: new AMap.Pixel(-13, -30)
          });
          _this.map.add(_this.marker);
        }

        _this.map.on("click", _this.clickHandler);
      });
    },
    clickHandler(e) {
      // console.log(e);
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
    clearMarker() {
      if (this.marker) {
        this.map.remove(this.marker);
      }
    },
    getData() {
      apiPost("/pmsproduct/api/pmsHotelType/getTheaterPlacePage", {
        limit: this.limit,
        page: this.page,
        pmsHotelId: this.$route.query.id
      }).then(res => {
        this.total = res.data && res.data.total ? res.data.total : 0;
        this.isDirect =  res.isDirect
        res.data.rows.forEach((item, index) => {
          //人数
          if (item.number) {
            for (let i = 0; i < this.pmsHotelTypeLiveNumList.length; i++) {
              if (item.number + "" == this.pmsHotelTypeLiveNumList[i].key) {
                res.data.rows[index].numberValue = this.pmsHotelTypeLiveNumList[
                  i
                ].value;
                break;
              }
            }
          }
          //床型
          if (item.bedType) {
            for (let i = 0; i < this.pmsHotelBedTypeList.length; i++) {
              if (item.bedType + "" == this.pmsHotelBedTypeList[i].key) {
                res.data.rows[index].bedTypeValue = this.pmsHotelBedTypeList[
                  i
                ].value;
                break;
              }
            }
          }
          //设施
          if (item.facility) {
            let facilityStr = [];
            item.facility.split(",").forEach(key => {
              for (let i = 0; i < this.pmsHotelTypeFacilityList.length; i++) {
                if (key == this.pmsHotelTypeFacilityList[i].id) {
                  facilityStr.push(this.pmsHotelTypeFacilityList[i].name);
                  break;
                }
              }
            });
            res.data.rows[index].facilityValue = facilityStr.join(",");
          }
        });
        this.pageData =
          res.data && res.data.rows && res.data.rows.length
            ? res.data.rows
            : [];
        // console.log(this.pageData);
      });
    },
    pageChange(page) {
      this.page = page;
      this.getData();
    },
    scrollError() {
      this.$nextTick(() => {
        let errList = $(".ivu-form-item-error");
        let list = $(".room-edit-modal .ivu-form-item");
        if (errList.length > 0) {
          let scroll_offset = errList.eq(0).offset().top;
          let top = $(".room-edit-modal .ivu-modal-body").offset().top;
          let test = list.eq(0).offset().top;
          console.log(scroll_offset);
          console.log(test);
          console.log(scroll_offset - test);
          // console.log($(".room-edit-modal .ivu-modal-body").scrollTop())
          // // console.log($(".room-edit-modal .hotel-roomType-content").offset().top)
          // console.log("top",top)
          // console.log("scroll_offset",scroll_offset)

          // // console.log( $(".room-edit-modal .ivu-modal-body"))
          $(".room-edit-modal .ivu-modal-body").animate(
            {
              scrollTop: scroll_offset - test
            },
            300
          );
        }
      });
    },
    submit() {
      this.btnLoading = true;
      let _this = this;
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          if (
            // 省市区联动验证
            this.formItem.isCivilian == "T" &&
            !(
              this.$refs.select.sheng &&
              this.$refs.select.shi &&
              this.$refs.select.qu
            )
          ) {
            let list = $(".room-edit-modal .ivu-form-item");
            let top = list.eq(0).offset().top;
            this.$Message.warning("请选择省市区");
            $(".room-edit-modal .ivu-modal-body").animate(
              {
                scrollTop:
                  $(".room-edit-modal .address-content").offset().top - top
              },
              300
            );
            this.btnLoading = false;
            return false;
          }
          let url =
            this.roomTypeTitle == "编辑房型"
              ? "/pmsproduct/api/pmsHotelType/editPmsHotelType"
              : "/pmsproduct/api/pmsHotelType/insertHotelType";

          //深度复制
          let formData = JSON.parse(JSON.stringify(this.formItem));
          formData.facility = formData.facility.join(",");
          if (this.formItem.isCivilian == "T") {
            formData.areaName =
              this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;
          }
          formData.pmsHotelId = this.$route.query.id;
          let res = await apiPost(
            url,
            Object.assign(formData, {
              mainUserId: this.$route.query.mainUserId
            })
          );
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            this.roomEditShow = false;
            this.btnLoading = false;
            this.pageInitData();
            this.$refs.picsModal.imgarr=[]
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          this.btnLoading = false;
          //滚动到错误地方
          // setTimeout(function() {
          //   $("#content").scrollTop(
          //     $(".ivu-form-item-error").offset().top -
          //       90 +
          //       $("#content").scrollTop()
          //   );
          // }, 500);
        }
      });
    },
    close() {
      this.roomEditShow = false;
      this.contentShow = false;
    },
    roomShow(item) {
      this.contentShow = true;
      this.roomEditShow = true;
      this.roomTypeTitle = "编辑房型";
      this.addressCode = "";
      this.$nextTick(() => {
        this.$refs.formItem.resetFields();
      });
      apiGet("/pmsproduct/api/pmsHotelType/queryPmsHotelType", {
        id: item.id,
        mainUserId: this.$route.query.mainUserId
      }).then(res => {
        this.hotelTypeData = res.data;
        this.formItem.provinceCode = res.data.provinceCode
          ? res.data.provinceCode
          : "";
        this.formItem.cityCode = res.data.cityCode ? res.data.cityCode : "";
        this.formItem.regionCode = res.data.regionCode
          ? res.data.regionCode
          : "";
        this.formItem.id = res.data.id ? res.data.id : "";
        this.formItem.area = res.data.area ? res.data.area : "";
        this.formItem.areaName = res.data.areaName ? res.data.areaName : "";
        this.formItem.pmsCode = res.data.pmsCode ? res.data.pmsCode : "";
        this.formItem.name = res.data.name ? res.data.name : "";
        this.formItem.pmsName = res.data.pmsName ? res.data.pmsName : "";
        this.formItem.typeImg = res.data.typeImg ? res.data.typeImg : "";
        this.formItem.floor = res.data.floor ? res.data.floor : "";
        this.formItem.acreage = res.data.acreage ? res.data.acreage : "";
        this.formItem.number = res.data.number ? res.data.number + "" : "";
        this.formItem.facility = res.data.facility
          ? res.data.facility.split(",")
          : [];
        this.formItem.summary = res.data.summary ? res.data.summary : "";
        this.formItem.isCivilian = res.data.isCivilian
          ? res.data.isCivilian
          : "F";
        this.formItem.bedroomNum = res.data.bedroomNum
          ? res.data.bedroomNum + ""
          : "";
        this.formItem.bathroomNum = res.data.bathroomNum
          ? res.data.bathroomNum + ""
          : "";
        this.formItem.bedType = res.data.bedType ? res.data.bedType + "" : "";
        this.formItem.ifWindow = res.data.ifWindow ? res.data.ifWindow : "";
        if (res.data.provinceCode && res.data.cityCode && res.data.regionCode) {
          this.addressCode =
            res.data.provinceCode +
            "-" +
            res.data.cityCode +
            "-" +
            res.data.regionCode;
          // console.log(this.addressCode);
        } else {
          this.addressCode = "";
        }
        //初始化

        if (res.data.areaName && res.data.areaName.split("-").length == 3) {
          let cityArr = res.data.areaName.split("-");
          this.cmbProvince = cityArr[0];
          this.cmbCity = cityArr[1];
          this.cmbArea = cityArr[2];
        } else {
          this.cmbProvince = "";
          this.cmbCity = "";
          this.cmbArea = "";
        }

        //初始化lng，lat
        this.lng = "";
        this.lat = "";
        var arr = res.data.latitudeLongitude
          ? res.data.latitudeLongitude.split(",")
          : [];
        if (arr.length == 2) {
          this.lng = arr[0];
          this.lat = arr[1];
        }

        this.coverShow = true;
        this.$nextTick(() => {
          this.mapInit();
        });
      });
    },
    getUrls(arr) {
      // console.log(arr);
      let apiArr = [];
      arr.forEach(item => {
        let base64 = item.replace(/^(data:\s*image\/(\w+);base64,)/, "");
        apiArr.push(
          axios({
            method: "POST",
            url: "/admin/api/ui/uplodeBase64",
            data: base64,
            headers: {
              "content-type": "application/json"
            }
            // baseURL: process.env.NODE_ENV !== "production" ? baseUrl : ""
          })
        );
      });
      axios.all(apiArr).then(resArr => {
        // console.log(resArr);
        let objArr = resArr.map(item => {
          return item.data.message;
        });
        // console.log(objArr);
        this.$Loading.finish();

        apiPost("/pmsproduct/api/pmsImg/savePmsImg", {
          pmsId: this.$route.query.id,
          mainUserId: this.$route.query.mainUserId,
          type: "hotel_type",
          imgUrlList: JSON.stringify(objArr)
        }).then(res => {
          this.getImgList();
        });
      });
    },
    imgShow(id) {
    //   this.roomTypeTitle = "编辑房型";
    if(id){
       this.$nextTick(() => {
        this.upImgId = id;
        this.$refs.picsModal.show(id);
      }, 30); 
    }else{
       this.$nextTick(() => {
        this.$refs.picsModal.show();
      }, 30);
    }
      
    },
    getImgList() {
      apiPost("/pmsproduct/api/pmsImg/queryPmsImg", {
        pmsId: this.$route.query.id,
        mainUserId: this.$route.query.mainUserId,
        type: "hotel_type"
      }).then(res => {
        this.imgList = res.data;
      });
    }
  }
  // created(){
  //     apiPost("/pmsproduct/api/pmsHotelType/getTheaterPlacePage",{
  //         id:this.$route.query.id,
  //         mainUserId:this.$route.query.mainUserId
  //     })
  // }
};
</script>
<style lang="scss">
.hotel-roomType-content {
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
}

.roomInfoSet-page {
  .step {
    width: 60%;
    margin: 1.5rem auto;
  }
  .no-room-data {
    height: 250px;
    line-height: 250px;
    font-size: 18px;
    text-align: center;
  }
  .ul {
    margin-top: 30px;
    .li {
      display: inline-block;
      width: 25%;

      .li-content {
        width: 95%;
        height: 610px;
        max-width: 375px;
        min-width: 275;
        padding: 7px 5px;
        border: 1px solid #cccccc;
        margin: 0 auto;
        position: relative;
        padding-bottom: 40px;
        .li-content-bottom {
          position: absolute;
          left: 0;
          width: 100%;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          .xx-icon {
            font-size: 18px;
          }
        }
        .li-img {
          width: 100%;
          height: 200px;
          line-height: 200px;
          text-align: center;
          font-size: 16px;
          // background: #cccccc;
          position: relative;
          img {
            height: 100%;
            width: 100%;
            display: inline-block;
          }
          .img-cover {
            cursor: pointer;
            position: absolute;
            left: 0;
            bottom: 0;
            height: 40px;
            line-height: 40px;
            text-align: center;
            width: 100%;
            font-size: 14px;
            color: #fff;
            background: rgba(0, 0, 0, 0.3);
          }
          .select-img {
            display: block;
            height: 200px;
            line-height: 200px;
            background: #cccccc;
            .up-text {
              cursor: pointer;
            }
            .text {
              font-size: 16px;
              color: #1a8fe0;
            }
          }
        }
        .li-body {
          table {
            width: 100%;
            tr {
              td {
                word-break: break-word;
                padding: 5px;
                font-size: 14px;
                &:first-child {
                  width: 60px;
                }
                &.icon-td {
                  text-align: right;
                  .xx-icon {
                    font-size: 22px;
                    cursor: pointer;
                  }
                }
                .room-name {
                  font-size: 16px;
                  font-weight: 600;
                  overflow: hidden;
                  -webkit-line-clamp: 2;
                  /* ! autoprefixer: off */
                  -webkit-box-orient: vertical;
                  /* autoprefixer: on */
                  display: -webkit-box;
                }
                .facilityValue-td {
                  width: 100%;
                  overflow: hidden;
                  word-break: break-word;
                  -webkit-line-clamp: 2;
                  /* ! autoprefixer: off */
                  -webkit-box-orient: vertical;
                  /* autoprefixer: on */
                  display: -webkit-box;
                }
                .summary-td {
                  width: 100%;
                  overflow: hidden;
                  word-break: break-word;
                  -webkit-line-clamp: 2;
                  /* ! autoprefixer: off */
                  -webkit-box-orient: vertical;
                  /* autoprefixer: on */
                  display: -webkit-box;
                }
                .name-td {
                  width: 100%;
                  overflow: hidden;
                  word-break: break-word;
                  -webkit-line-clamp: 2;
                  /* ! autoprefixer: off */
                  -webkit-box-orient: vertical;
                  /* autoprefixer: on */
                  display: -webkit-box;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>


