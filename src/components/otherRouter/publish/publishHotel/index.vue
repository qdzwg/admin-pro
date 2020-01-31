<template>
  <div class="publish-hotel">
    <div class="step">
      <Steps :current="1">
        <Step title="产品类型"></Step>
        <Step title="酒店信息"></Step>
        <Step title="房型信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleComplteForm">
      <div id="base" class="form-title">基本信息</div>
      <FormItem label="酒店名称：" prop="name">
        <Input v-model="formItem.name" style="width:33%" :maxlength="64"></Input>      
      </FormItem>
      <FormItem label="酒店別名：" prop="aliasName">
        <Input v-model="formItem.aliasName" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="商户：" prop="mchId">    
        <Select v-model="formItem.mchId" style="width:180px" placeholder="请选择商户">
          <Option v-for="(item, index) in mchList" :value="item.id" :key="index">{{item.mchName}}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属城市：" prop="cityId">    
        <Select v-model="formItem.cityId" style="width:180px" placeholder="请选择所属城市">
          <Option v-for="(item, index) in cityList" :value="item.id+''" :key="index">{{item.cityName}}</Option>
        </Select>
      </FormItem>
      <FormItem label="联系电话：" prop="linkTel">    
        <Input v-model="formItem.linkTel" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="酒店标签：" prop="labels">
        <div style="" class="travellSubject">
          <div class="subject-list">
            <div v-for="(item,index) in tagNameList" :key="index" class="subject-list-item">
              <Icon
                @click="subjectItemDel2(index)"
                class="subject-list-item-del"
                type="close-circled"
              ></Icon>
              <Button>{{item}}</Button>
            </div>
          </div>
          <div class="subject-input" v-if="tagNameList.length<4">
            <Input
              @on-enter="setSubjectTag2"
              :maxlength="4"
              v-model="tagName"
              placeholder="回车添加标签，如“日可定、立减20”"
              style="width: 200px"
            ></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left" v-if="tagNameList.length<4">输入后，回车添加</div>
        </div>        
        <Input v-model="formItem.labels" style="display:none"></Input>
      </FormItem>
      <FormItem label="酒店星级：" prop="hotelLevel">
        <Select v-model="formItem.hotelLevel" style="width:200px">
          <Option :value="item.value" :label="item.label" v-for="(item,index) in hotelLevels" :key="index"></Option>
        </Select>
      </FormItem>
      <FormItem class="address-select" label="酒店地址：" required>
        <select-item ref="select" :addrCode="formItem.areaCode" @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
      </FormItem>
      <FormItem label="详细地址：" prop="addr">
        <Input v-model="formItem.addr" style="width:33%" :maxlength="128"></Input>
      </FormItem>
      <FormItem label="地图坐标：" prop="latitudeLongitude">
        <Input v-model="formItem.latitudeLongitude" placeholder="" style="width: 300px"></Input>
        <Button @click="getAdressLng" type="primary">获取坐标</Button>
      </FormItem>
      <FormItem label="酒店类别：" prop="hotelType">
        <Select v-model="formItem.hotelType" style="width:200px">
          <Option :value="item.value" :label="item.label" v-for="(item,index) in hotelTypes" :key="index"></Option>
        </Select>
      </FormItem>
      <FormItem label="交通描述：" prop="trafficDesc">
        <Input type="textarea" v-model="formItem.trafficDesc" style="width:33%" :maxlength="500"></Input>
      </FormItem>      
      <FormItem  label="服务设施：" class="clearfix">    
         
        <CheckboxGroup v-model="formItem.serviceBuildNew" style="float:left">
          <Checkbox 
          :label="item"
          v-for="(item, index) in buildList"            
          :key="index">
            <span>{{item}}</span>
          </Checkbox>            
        </CheckboxGroup>
        <!-- <div class="subject-input" style="float:left">
          <Input
            @on-enter="setSubjectTag"
            :maxlength="4"
            v-model="buildName"
            placeholder="回车添加标签，如“今日可定、立减20”"
            style="width: 200px"
          ></Input>
        </div>
        <div style="color:red;margin-left:10px;float:left">输入后，回车添加</div> -->
      </FormItem>
      <FormItem label="详情介绍：" prop="content">  
        <ueditor v-model="formItem.content"></ueditor>
      </FormItem>
      <FormItem label="缩略图：" prop="linkMobileImg">
        <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
        <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图：" prop="picUrl">
        <Input v-model="formItem.picUrl" style="display:none"></Input>
        <my-img :limitNum="5" :uploadList="wapImgList" @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于2M， 宽750px，高440px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="详情页视频：">
        <my-video v-model="formItem.extendsParamTwo"></my-video>
      </FormItem>
      <FormItem label="前台展示起价：" prop="extendsParamOne">
        <Input v-model="formItem.extendsParamOne" number :maxlength="9" style="width:200px;"></Input>
        <span class='money-unit'>元</span>
      </FormItem>
      <FormItem label="预订须知：" required>
        <ueditor v-model="formItem.noticeid"></ueditor>
      </FormItem>
      <FormItem label="售后政策：" required>
        <ueditor v-model="formItem.salePolicy"></ueditor>
      </FormItem>
      <FormItem>
        <div class="save-cancel">
          <Button type="primary" :loading='btnLoading' @click="submit">保存,下一步</Button>
          <Button type="ghost" style="margin-left: 8px" @click="test">取消</Button>
        </div>
      </FormItem>
    </Form>

    <Modal v-model="model2" title="查看模板">
      <p>
        您有新的待确认酒店订单，订单号 {tradeNo}，请在 {time} 分钟内确认，逾期将被取消。
      </p>
      <div slot="footer">
        <Button @click="cancel">关闭</Button>
      </div>
      <!-- <Input type="textarea" v-model="formItem.text"></Input> -->
    </Modal>

    <amap ref="bdMap" @getPoint="setLngAndLat" :mark="formItem.latitudeLongitude"></amap>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('senicInfo')">酒店信息</a>
        </li>
        <li>
          <Button size="small" :loading='btnLoading' @click="submit" type="primary">保存，下一步</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import ueditor from "@/components/global/ueditor";
import ueditor from '@/components/global/vueUEditor';
import store from "@/store";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import amap from "@/components/global/amap";
import myImg from "@/components/global/singleImg";
import selectItem from "@/components/global/selectList";
import myVideo from '@/components/global/video'
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      mchList: [],
      cityList: [],
      tableLoading: false,
      btnLoading: false,
      singleImgList: [],
      wapImgList: [],
      page: 1,
      total: 0,
      cmbProvince: "",
      cmbCity: "",
      cmbArea: "",
      cmbProvinceId: "",
      cmbCityId: "",
      cmbAreaId: "",

      data6: [],
      model: false,
      model2: false,
      model3: false,
      loading: true,
      type: "",
      hotelLevels: [],
      hotelTypes: [],
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },

      buildName: '',
      buildList: [],        
      formItem: {
        labels: '',
        id: "",
        linkTel: '',
        mchId: '', //商户名称
        cityId: '', //所屬城市
        extendsParamTwo: '', //详情页视频
        name: "", //酒店名称
        aliasName: "", //酒店别名
        trafficDesc: "", //交通描述
        hotelCode: "", //输入酒店关键字
        extendsParamOne: null, //前台展示价
        serviceBuildNew: [], //酒店设施
        systemCode: "", //外部编码
        areaCode: "", //地区编码
        areaName: "", //地区名字
        addr: "", //酒店地址  详细地址
        latitudeLongitude: "", //地图坐标
        hotelType: "", //酒店类型
        sellType: "2", //分销渠道
        content: "", // 详情介绍
        linkImg: "", //主图 缩略图
        picUrl: "", //轮播图
        noticeid: "", //预订须知
        salePolicy: "", // 售后政策,
        distAreaType: "all", //分销区域限制
        tel: "", //短信接收手机号,        
      },
      tagNameList: [],
      tagName: "",
      parentIds: "",
      ruleComplteForm: {
        name: [{ required: true, message: "请填写酒店名称", trigger: "blur" }, { max: 64, message: "酒店别名字数不能超过64个" }],
        aliasName: [ { required: true, message: "请填写酒店别名", trigger: "blur" }, { max: 64, message: "酒店别名字数不能超过64个" }],
        trafficDesc: [ {max: 500, message: "交通描述字数不能超过500" }],
        mchId: [{ required: true, message: "请选择商户", trigger: "change", type: 'number' }],
        hotelLevel: [ { required: true, message: "请选择酒店星级", trigger: "change" } ],
        labels: [ { required: true, message: "请填写酒店标签", trigger: "blur" } ],
        addr: [{ required: true, message: "请填写详细地址", trigger: "blur" }],
        latitudeLongitude: [{ required: true, message: "请选择地图坐标", trigger: "blur" }],
        hotelType: [ { required: true, message: "请选择酒店类别", trigger: "change" }],
        serviceBuildNew: [ { required: true, message: "请选择服务设施" } ],  
        content: [{ required: true, message: "请填写详情介绍", trigger: "blur" }],        
        linkMobileImg: [{ required: true, message: "请选择缩略图", trigger: "blur" }],
        picUrl: [{ required: true, message: "请选择轮播图", trigger: "blur" }],
        extendsParamOne: [ { required: true, type: "number", message: "请填写前台展示起价"},{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "数据格式不正确"},
          {validator: validateNum, message: "数值不能大于999999"}],
        mchId: [{ required: true, message: "请选择商户", trigger: "change", type: 'number' }],
        linkTel: [{ required: true, message: "请填写联系电话", trigger: "blur" }, {pattern: /(^1([0-9]{10})$)|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/, message: "格式不正确" }],
        cityId: [ { required: true, message: "请选择所属城市", trigger: "change" }]
      }
    };
  },
  computed: {
   
  },
  created() {
    this.getMchList();
    this.getCityList();
    this.getSysparam();    
  },
  mounted() {},
  methods: {
    //删除套票票型标签
    subjectItemDel2(index) {
      this.tagNameList.splice(index, 1);
      this.formItem.labels = JSON.stringify(this.tagNameList);
    },
    // 回车添加标签名
    setSubjectTag2() {
      if (this.tagNameList && this.tagNameList.length < 4) {
        if (this.tagName) {
          this.tagNameList.push(this.tagName);
          this.formItem.labels = JSON.stringify(this.tagNameList);
          this.tagName = "";
        } else {
          this.$Message.warning("请输入标签名！");
        }
      } else {
        this.$Message.warning("最多添加四个标签！");
      }
    },
    // setSubjectTag() {
    //   if (this.buildName) {
    //     // let obj = {
    //     //   label: this.buildName,
    //     //   value: this.buildName
    //     // }
    //     this.buildList.push(this.buildName);
        
    //     this.buildName = "";
    //   } else {
    //     this.$Message.warning("请输入标签名！");
    //   }
    // },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    test() {
      window.location.href = '/hotelInfo';
    },
    //初始化发布页面
    getpublishHotel() {
      apiGet("/product/api/hotelPush/publishHotel").then(res => {
        if (res.data && res.data.hotelInfo) {
          this.formItem = res.data.hotelInfo;       
          this.formItem.extendsParamOne = res.data.hotelInfo.extendsParamOne ? res.data.hotelInfo.extendsParamOne : null;
          this.formItem.serviceBuildNew = res.data.hotelInfo.serviceBuildNew ? JSON.parse(res.data.hotelInfo.serviceBuildNew) : [];
          this.formItem.mchId = parseInt(res.data.hotelInfo.mchId);
          this.formItem.cityId = res.data.hotelInfo.cityId;
          this.formItem.hotelType = res.data.hotelInfo.hotelType + "";          
          this.tagNameList = res.data.hotelInfo.labels ? JSON.parse(res.data.hotelInfo.labels) : [];  
          if(res.data.hotelInfo.labels&&JSON.parse(res.data.hotelInfo.labels).length>0){
            this.formItem.labels = res.data.hotelInfo.labels; 
          }else{
            this.formItem.labels = '';
          } 
          this.singleImgList.push(res.data.hotelInfo.linkMobileImg);
          this.wapImgList = res.data.hotelInfo.picUrl ? res.data.hotelInfo.picUrl.split(",") : [];
          if (res.data.hotelInfo.areaName) {
            let arr = res.data.hotelInfo.areaName.split("-");
            this.cmbProvince = arr[0];
            this.cmbCity = arr[1];
            this.cmbArea = arr[2];
          }
        }
        if(res.data && res.data.paramVoList && res.data.paramVoList.length){
          let arr = [], paramVoList = res.data.paramVoList;
          paramVoList.forEach((item, index) => {
            arr.push(item.value)
          })
          this.buildList = arr;
        } else {
        }
        
      });
    },
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
    setWapUrl(imgArr) {
      this.formItem.linkImg = imgArr.join(",");
      this.formItem.linkMobileImg = imgArr.join(",");
      this.$refs.formItem.validateField("linkMobileImg");
    },
    setWapListUrl(imgArr) {
      this.formItem.picUrl = imgArr.join(",");
      this.$refs.formItem.validateField("picUrl");
    },
    setLngAndLat(point) {
      this.formItem.latitudeLongitude = point.lng + "," + point.lat;
      this.$refs.formItem.validateField("latitudeLongitude");
    },
    getAdressLng() {
      this.$refs.bdMap.showModal();
    },
    changePage(page) {
      this.page = page;
    },
    getProvince(sheng, e) {
      //省
      this.cmbProvince = sheng;
      this.formItem.areaName = this.cmbProvince;
      // this.formItem.province = e;
      // this.formItem.city = '';
      //  this.formItem.area = '';
    },

    getCity(city, e) {
      //市
      this.cmbCity = city;
      this.formItem.areaName = this.cmbProvince + "-" + this.cmbCity;
      // this.formItem.city = e;
      //  this.formItem.area = '';
    },
    getQu(qu, e) {
      //区
      this.cmbArea = qu;
      this.formItem.areaName =
        this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;
    },

    //关闭
    cancel() {
      this.model2 = false;
    },

    delData() {
      this.formItem = {
        id: "",
        mchId: '',
        extendsParamTwo: '',
        name: "", //酒店名称
        aliasName: "", //酒店别名
        trafficDesc: "", //交通描述
        hotelCode: "", //输入酒店关键字
        extendsParamOne: null, //前台展示起价
        systemCode: "", //外部编码
        areaCode: "", //地区编码
        areaName: "", //地区名字
        addr: "", //酒店地址  详细地址
        latitudeLongitude: "", //地图坐标
        hotelType: "", //酒店类型
        sellType: "2", //分销渠道
        serviceBuildNew: [], //服务设施
        content: "", // 详情介绍
        linkImg: "", //主图 缩略图
        picUrl: "", //轮播图
        noticeid: "", //预订须知
        salePolicy: "", // 售后政策,
        distAreaType: "all", //分销区域限制
        tel: "", //短信接收手机号,
        linkTel: '',
        labels: ''
      };
      this.singleImgList = [];
      this.wapImgList = [];
      this.model = false;
    },

    //设置模板
    getModal() {
      this.model2 = true;
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
    submit() {
      this.btnLoading = true;
      let _this = this;
      this.formItem.areaCode = this.$refs.select.sheng + "-" + this.$refs.select.shi + "-" + this.$refs.select.qu;
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
          let postParams = JSON.parse(JSON.stringify(this.formItem));
          postParams.serviceBuildNew = JSON.stringify(postParams.serviceBuildNew);
          let url = "/product/api/hotelPush/saveHotel";
          let res = await apiPost(url, postParams);          
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            _this.$router.push("/houseType");
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
    //获取商户列表
    getMchList() {
      this.apiPost('/product/api/showTicketApi/add').then(res => {
        if(res.success || res.status == 200){          
          this.mchList = res.mch;
          this.getCityList();
        }        
      })
    },
    //获取城市列表
    getCityList() {
      this.apiPost('/product/api/park/selectCityInfo').then(res => {
        if(res.success || res.status == 200){          
          this.cityList = res.data;
          this.getpublishHotel();
        }        
      })
    }
  },
  components: {
    ueditor,
    amap,
    myImg,
    selectItem,
    myVideo
  }
};
</script>
<style scope lang="scss">
.publish-hotel {
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
.money-unit {
  margin-left: 8px;
}
.save-cancel {
  padding-bottom: 50px;
}
</style>





