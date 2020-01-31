<template>
    <div class="restaurant">
      <div class="step" v-if="type=='add'">
        <Steps :current="1">
            <Step title="产品类型"></Step>
            <Step title="餐饮信息"></Step>
            <Step title="餐券信息"></Step>
            <Step title="完成"></Step>
        </Steps>
      </div>
    <Form :model="formItem" label-position="right"  :label-width="120" ref="formItem" :rules="ruleComplteForm">
    <div id="base" class="form-title">基本信息</div>
          <FormItem label="餐馆名称：" prop="name">    
              <Input v-model="formItem.name" style="width:33%" :maxlength="20"></Input>
          </FormItem>
          <FormItem label="商户：" prop="mchId">    
              <Select v-model="formItem.mchId" style="width:180px" placeholder="请选择商户">
                <Option v-for="(item, index) in mchList" :value="item.id" :key="index">{{item.mchName}}</Option>
              </Select>
          </FormItem>
          <FormItem label="所属城市：" prop="cityId">    
            <Select v-model="formItem.cityId" style="width:180px" placeholder="请选择所属城市">
              <Option v-for="(item, index) in cityList" :value="item.id" :key="index">{{item.cityName}}</Option>
            </Select>
          </FormItem>
           <FormItem label="人均起价：" prop="priceShow">
              <Input v-model="formItem.priceShow" style="width:15%"  number :maxlength="5"></Input>  /人
          </FormItem>
           <FormItem label="服务电话：" prop="linkTel">
                <Input v-model="formItem.linkTel" style="width:33%" placeholder="手机或固话（固话格式：区号-电话号码）"></Input>
                <Checkbox v-model="linked">是否页面展示</Checkbox>
            </FormItem>
            
           <FormItem class="address-select" label="餐饮地区：" required>
              <select-item  ref="select" :addrCode="formItem.areaCode"  @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
          </FormItem>
           <FormItem label="详细地址：" prop="addr">
              <Input v-model="formItem.addr" style="width:33%" :maxlength="50"></Input>
          </FormItem>
           <FormItem label="地图坐标：" prop="latitudeLongitude">
              <Input v-model="formItem.latitudeLongitude"  placeholder="" readonly style="width: 300px"></Input>
              <Button @click="getAdressLng" type="primary">获取坐标</Button>
          </FormItem>
         <FormItem label="临近商圈：">    
              <Input v-model="formItem.tradingArea" placeholder="最多可添加10个字，用于列表标题下方展示" style="width:33%" :maxlength="10"></Input>
          </FormItem>
         <FormItem label="营业时间：" prop='businessHours'>
            <Input type="textarea" placeholder="周一至周日 8:00-13:30  16:00-22:00" v-model="formItem.businessHours" style="width:33%" :maxlength="200"></Input>
         </FormItem>

      <div id="senicInfo" class="form-title">餐饮信息</div>
      <FormItem label="餐馆描述：" >
        <Input type="textarea" v-model="formItem.summary" style="width:33%" :maxlength="500"></Input>
      </FormItem>

      <FormItem label="自定义标签：" >
        <div style="height:32px;" class="travellSubject">
          <div class="subject-list">
            <div v-for='(item,index) in texts' :key='index' class="subject-list-item">
              <Icon @click="dellInput(index)" class="subject-list-item-del" type="close-circled"></Icon>
              <Button>{{item}}</Button>
            </div>
          </div>
          <div class="subject-input">
            <Input @on-enter='sub' :maxlength="5" :disabled="texts.length>=3" v-model='text' placeholder='回车添加标签，如“武林商圈”' style="width: 200px"></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left">输入后，回车添加</div>
        </div>


      </FormItem>
      <template v-if="dataShow">
           <FormItem  label="餐馆介绍：" prop="content">
            <!-- <ueditor id="ue2" ref="mustKnow" :content="formItem.content" :config="config"></ueditor> -->
            <!-- <quill-editor ref="mustKnow" :content='formItem.content'></quill-editor> -->
            <ueditor v-model="formItem.content"></ueditor>
          </FormItem>
          <FormItem  label="购买须知：" prop="noticeid">
            <!-- <ueditor id="ue7" ref="mustKnow7" :content="formItem.noticeid" :config="config"></ueditor> -->
            <!-- <quill-editor ref="mustKnow7" :content='formItem.noticeid'></quill-editor> -->
            <ueditor v-model="formItem.noticeid"></ueditor>
          </FormItem>
      </template>
     
      
      <FormItem label="缩略图：" prop="linkImg">
        <Input v-model="formItem.linkImg" style="display:none"></Input>
        <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图：">
        <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
        <my-img :limitNum="20" :uploadList="wapImgList" @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传20张，建议上传小于2M， 宽750px，高440px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="详情页视频：">
        <my-video v-model="formItem.linkVedio"></my-video>
      </FormItem>
      <FormItem>
        <div class="save-cancel"> 
           <Button v-if="type=='edit'" type="primary" :loading='btnLoading' @click="submit">保存</Button>
           <Button v-else type="primary" :loading='btnLoading' @click="submit">保存,下一步</Button>
           <Button v-if="type=='edit'" style="margin-left: 8px" @click="test2">返回列表</Button>
           <Button v-else style="margin-left: 8px" @click="test">取消</Button>
        </div>
      </FormItem>
    </Form>
    <amap ref="bdMap" @getPoint="setLngAndLat" :mark="formItem.latitudeLongitude" :name="adressName"></amap>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('senicInfo')">餐饮信息</a>
        </li>
        <li>
          <Button v-if="type=='edit'" size="small" :loading='btnLoading' @click="submit" type="primary">保存</Button>
          <Button v-else size="small" :loading='btnLoading' @click="submit" type="primary">保存，下一步</Button>
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
// import quillEditor from "@/components/global/vueQuillEditor";
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 99999) {
        callback(new Error("最大值99999"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
        let ph=/^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let mb=/^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
      if (!ph.test(value)&&!mb.test(value)) {
        callback(new Error("最大值99999"));
      } else {
        callback();
      }
    };
    return {
      adressName:'',
      type:'',
      text: "",
      texts: [],
      tableLoading: false,
      btnLoading: false,
      singleImgList: [],
      wapImgList: [],
      cmbProvince: "",
      cmbCity: "",
      cmbArea: "",
      loading: true,
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      dataShow:false,
      formItem: {
        linkVedio: '',
        mchId: '',
        cityId: '',
        id:this.$route.query.id,
        name: "",               //餐馆名称
        priceShow: null,        //人均起价
        linkTel: "",            //联系电话
        isShowTel:'',           //是否显示服务电话
        areaCode: "",           //地区编码
        areaName: "",           //地区名字
        addr: "",               //详细地址
        latitudeLongitude: "",  //地图坐标
        tradingArea: "",        //临近商圈
        businessHours: "",      //营业时间
        summary: "",            //餐馆描述
        labels: "",             //标签
        content: "",            // 餐馆介绍
        noticeid: "",           //购买须知
        linkImg: "",            //主图 缩略图
        linkMobileImg: ""       //轮播图
      },
      linked: false,
      ruleComplteForm: {
        businessHours: [
            { required: true, message: "请填写营业时间", trigger: "blur" },
          {
            max: 200,
            message: "营业时间字数不能超过200"
          }
        ],
        name: [{ required: true, message: "请填写餐馆名称", trigger: "blur" }],
        linkTel: [
          {
            required: true,
            message: "请填写联系电话",
            trigger: "blur"
          },
           {
             pattern: /^[1][3,4,5,7,8][0-9]{9}$|(^0[0-9]{2,3}-[0-9]{7,8}$)/,
            message: "号码格式不正确",
            trigger: "blur"
          }
        ],
        latitudeLongitude: [
          { required: true, message: "请选择地图坐标", trigger: "blur" }
        ],
        cityId: [
          { required: true, message: "请选择所属城市" }
        ],
        addr: [{ required: true, message: "请填写详细地址", trigger: "blur" }],
        priceShow: [
          {
            required: true,
            type: "number",
            message: "请填写人均起价"
          },
          {
            pattern: /^[1-9]{1,}[\d]*$/,
            message: "请输入正整数"
          },
          {
            validator: validateNum,
            message: "数值不能大于99999"
          }
        ],
        linkImg: [{ required: true, message: "请选择缩略图", trigger: "blur" }],
        linkMobileImg: [
          { required: true, message: "请选择轮播图", trigger: "blur" }
        ],
        content: [{ required: true, message: "请填写餐馆介绍" ,trigger: "blur" }],
        noticeid: [{ required: true, message: "请填写购买须知" ,trigger: "blur" }]
      },
      mchList: [],
      cityList: []
    };
  },
  computed: {},
  created() {
    
    this.getMchList();
  },
  mounted() {

  },
  methods: {
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    test() {
      window.location.href = '/cateringList';
    },
    test2(){
        this.$router.back(-1);
    },
    getList() {
        let _this=this
      apiGet("/product/api/RepastPush/publishRepast",{
           params:new Date()
      }).then(res => {
        if (res.status == 200) {
            this.dataShow=true
            if(res.data){
              this.formItem = res.data?res.data:{};
              this.formItem.mchId = res.data.mchId;
            this.formItem.cityId = res.data.cityId;
          this.texts=res.data.labels?res.data.labels.split(","):[];
          this.linked=res.data.isShowTel=='T'?true:false
          this.singleImgList.push(res.data.linkImg);
          this.wapImgList = res.data.linkMobileImg
            ? res.data.linkMobileImg.split(",")
            : [];

          if (res.data.areaName) {
            let arr = res.data.areaName.split("-");
            this.cmbProvince = arr[0];
            this.cmbCity = arr[1];
            this.cmbArea = arr[2];
          }  
            }
          
        }
      });
    },
    //初始化发布页面
    getpublishRepast() {
        let _this=this
      if (this.$route.query.id) {
          this.type='edit'
        apiGet(
          "/product/api/repastProduct/queryEateryInfo?eateryId=" +
            this.$route.query.id
        ).then(res => {
            this.dataShow=true
          if (res.data) {
            this.formItem = res.data?res.data:{};
            this.formItem.mchId = res.data.mchId;
            this.formItem.cityId = res.data.cityId;
            this.texts =res.data.labels?res.data.labels.split(","):[];
            this.linked=res.data.isShowTel=='T'?true:false
            this.singleImgList.push(res.data.linkImg);
            this.wapImgList = res.data.linkMobileImg
              ? res.data.linkMobileImg.split(",")
              : [];
            if (res.data.areaName) {
              let arr = res.data.areaName.split("-");
              this.cmbProvince = arr[0];
              this.cmbCity = arr[1];
              this.cmbArea = arr[2];
            }
        this.$nextTick(function(){
            _this.hashClick('base')
        })
          } else {
             
          }
        });
      } else {
        this.type='add'        
        this.getList();              
      }
    },
    setWapUrl(imgArr) {
      this.formItem.linkImg = imgArr[0];
      this.$refs.formItem.validateField("linkImg");
    },
    setWapListUrl(imgArr) {
        if(imgArr.length>20){
            this.formItem.linkMobileImg = imgArr.slice(0,20).join(",");
        }else{
            this.formItem.linkMobileImg = imgArr.join(",");
        }
      
    //   this.$refs.formItem.validateField("linkMobileImg");
    },
    setLngAndLat(point) {
      this.formItem.latitudeLongitude = point.lng + "," + point.lat;
      this.$refs.formItem.validateField("latitudeLongitude");
    },
    getAdressLng() {
      this.$refs.bdMap.showModal();
      this.adressName=this.formItem.areaName+"-"+this.formItem.addr
    },
    changePage(page) {
      this.page = page;
      this.selectHotel();
    },
    getProvince(sheng, e) {
      //省
      this.cmbProvince = sheng;
      this.formItem.areaName = this.cmbProvince;
    },

    getCity(city, e) {
      //市
      this.cmbCity = city;
      this.formItem.areaName = this.cmbProvince + "-" + this.cmbCity;
    },
    getQu(qu, e) {
      //区
      this.cmbArea = qu;
      this.formItem.areaName =
        this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;
    },
    sub() {
      if (this.text) {
        this.texts.push(this.text);
      }
      this.text = "";
    },
    dellInput(i) {
      this.texts.splice(i, 1);
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
      let _this = this;
      this.formItem.areaCode =
        this.$refs.select.sheng +
        "-" +
        this.$refs.select.shi +
        "-" +
        this.$refs.select.qu;
      this.formItem.labels = this.texts.join(",");
      this.formItem.isShowTel=this.linked==true?'T':'F'
      // this.formItem.content = this.$refs.mustKnow
      //   ? this.$refs.mustKnow.getUEContent()
      //   : "";
      // this.$refs.formItem.validateField("content");
      // this.formItem.noticeid = this.$refs.mustKnow7
      //   ? this.$refs.mustKnow7.getUEContent()
      //   : "";
      // this.$refs.formItem.validateField("noticeid");
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
          if (!this.formItem.noticeid) {
            this.$Message.warning("请填写购买须知");
            return false;
          }
          if (!this.formItem.content) {
            this.$Message.warning("请填写餐馆介绍");
            this.btnLoading = false;
            return false;
          }
        this.btnLoading = true;  
        setTimeout(function() {
            _this.btnLoading = false;
        }, 3000);
          let url =this.type=='edit'?"/product/api/repastProduct/editEateryInfoSave":"/product/api/RepastPush/saveEatery";
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            if(_this.type=='edit'){
                _this.$router.push("/cateringList");                
            }else{
                _this.$router.push("/mealCoupon");
            }
            
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
        if(res.success){
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
          this.getpublishRepast(); //初始化发布页面
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
    // quillEditor
  }
};
</script>
<style lang="scss">
.restaurant {
  width: 100%;
  .ql-container {
    height: 150px;
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

  .travellSubject {
    // border: 1px solid red;
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

  .custom-tag {
    width: 33%;
    height: 35px;
    border-radius: 4px;
    border: 1px solid #ccc;
    .custom {
      display: inline-block;
      position: relative;
      .dell-input {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        background-color: rgba(243, 10, 10, 0.568);
        color: #fff;
        text-align: center;
        line-height: 0.75rem;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0.25rem;
        z-index: 99;
        display: none;
      }
    }
    .custom:hover .dell-input {
      display: block;
    }
    .inptext {
      text-indent: 5px;
      border: none;
      outline: none;
      width: 30%;
      height: 100%;
      display: inline-block;
      margin-left: 5px;
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






