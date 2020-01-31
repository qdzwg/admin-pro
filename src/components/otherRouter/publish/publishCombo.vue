<template>
  <div class="comboPublish-box">
    <div class="step">
        <Steps :current="1">
            <Step title="产品类型"></Step>
            <Step title="套票信息"></Step>
            <Step title="票型信息"></Step>
            <Step title="完成"></Step>
        </Steps>
      </div>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div id="base" class="form-title">基本信息</div>

      <FormItem label="套票名称：" prop="name">
        <Input v-model="formItem.name" style="width:33%;" :maxlength="20"></Input>
      </FormItem>
      <FormItem label="别名：" prop="nickName">
        <Input v-model="formItem.nickName" style="width:33%" :maxlength="20" placeholder="请输入别名"></Input>
      </FormItem>
      <FormItem label="副标题：" prop="subTitle">
        <Input v-model="formItem.subTitle" style="width:33%;" :maxlength="20" placeholder="用简短文字描述"></Input>
      </FormItem>
      <FormItem class="address-select" label="目的地：">        
        <select-item
          ref="select"
          @getProvince="getProvince"
          @getCity="getCity"
          @getQu="getQu"
          :addrCode="areaCode"
        ></select-item>
      </FormItem>
      <FormItem label="推荐理由：">
        <template v-if="formItem.recommendReason.length">
          <Row
            style="width:55%; margin-bottom:24px;"
            v-for="(item,index) in formItem.recommendReason"
            :key="index"
          >
            <Col span="6">
              <FormItem
                :prop="'recommendReason.' + index + '.reason'"
                :rules="{required: true, message: '请填写推荐理由', trigger: 'blur',}"
              >
                <Input v-model="item.reason" placeholder="请输入推荐理由" :maxlength="20"></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem>
                <Button
                  type="ghost"
                  icon="minus-round"
                  style="margin-left:2%;"
                  @click="delReasons(index)"
                ></Button>
                <Button
                  type="info"
                  icon="plus"
                  style="margin-left:2%;"
                  v-if="index===formItem.recommendReason.length-1&&index<4"
                  @click="addReasons"
                ></Button>
              </FormItem>
            </Col>
          </Row>
        </template>
        <Button type="info" icon="plus" v-else @click="addReasons"></Button>
      </FormItem>
      <!-- <FormItem label="虚拟销量" prop="salesNum">        
        <Input
          v-model="formItem.salesNum"
          style="width:150px;margin-right:5px;"
          placeholder="请输入虚拟销量"          
          :maxlength="6"
        ></Input>    
      </FormItem> -->
      <FormItem label="标签：" prop="labels">
        <div style="height:32px;" class="travellSubject">
          <div class="subject-list">
            <div v-for="(item,index) in tagNameList" :key="index" class="subject-list-item">
              <Icon
                @click="subjectItemDel(index)"
                class="subject-list-item-del"
                type="close-circled"
              ></Icon>
              <Button>{{item}}</Button>
            </div>
          </div>
          <div class="subject-input" v-if="tagNameList.length<4">
            <Input
              @on-enter="setSubjectTag"
              :maxlength="4"
              v-model="tagName"
              placeholder="回车添加标签，如“今日可定、立减20”"
              style="width: 200px"
            ></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left" v-if="tagNameList.length<4">输入后，回车添加</div>
          <div style="float:left; margin-left:20px;">
            <div class="label-item" v-for="(item, index) in labelList" :key="index" style="display:inline-block;margin-right: 10px; position: relative;">
              <Button @click="addTosubject(item)">{{item}}</Button>
            </div>
          </div>
        </div>
        <Input v-model="formItem.labels" style="display:none"></Input>
      </FormItem>
      <FormItem label="轮播图：" prop="carouselImg">
        <my-img :limitNum="5" 
          :uploadList="wapImgList"
          @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="产品详情：">
        <!-- <ueditor id="ue1" :content="formItem.proDetail" ref="proDetail" :config="config"></ueditor> -->
        <ueditor v-model="formItem.proDetail"></ueditor>
      </FormItem>
      <FormItem label="预订须知：">
        <!-- <ueditor id="ue2" :content="formItem.buyNotes" ref="buyNotes" :config="config"></ueditor> -->
        <ueditor v-model="formItem.buyNotes"></ueditor>
      </FormItem>
      <div id="distSet" class="form-title">分销设置</div>
      <FormItem label="分销渠道：" prop="sellType">
        <Select v-model="formItem.sellType" style="width:200px">
          <Option value>请选择</Option>         
          <Option value="2">仅店铺</Option>
        </Select>
      </FormItem>
      
      <FormItem label="店铺展示起价：" prop="merchantPriceShow">
        <Input
          v-model="formItem.merchantPriceShow"
          style="width:150px;margin-right:5px;"
          placeholder="请输入店铺展示起价"          
          :maxlength="8"
        ></Input>元
      </FormItem>
      <FormItem label="店铺虚拟销量：" prop="merchantFictSaleNum">
        <Input
          v-model="formItem.merchantFictSaleNum"
          style="width:150px;margin-right:5px;"
          placeholder="请输入虚拟销量"          
          :maxlength="6"
        ></Input>
      </FormItem>      
      <FormItem label="店铺预订须知：" prop="merchantBuyNotes">
        
        <!-- <ueditor id="ue3" :content="formItem.merchantBuyNotes" ref="merchantBuyNotes" :config="config"></ueditor> -->
        <ueditor v-model="formItem.merchantBuyNotes"></ueditor>
      </FormItem> 
      <FormItem label="套票日历：">
        <Checkbox v-model="isDisplayPrice">显示价格</Checkbox>
      </FormItem>   
      <FormItem label="下单信息填写：">
        <Checkbox v-model="mobile" disabled>手机号</Checkbox>
        <Checkbox v-model="name" disabled>姓名</Checkbox>        
        <Checkbox v-model="idCard">身份证</Checkbox>
      </FormItem>      
      <!-- <FormItem label="店铺留言：">
        <leave-word :leaveArr="formItem.orderCustomPlugins"></leave-word>
      </FormItem> -->
      <FormItem label="留言：">
        <template v-if="formItem.orderCustomPlugins.length">
          <Row :gutter="16"
               style="width:55%; margin-bottom:24px;"
               v-for="(item,index) in formItem.orderCustomPlugins"
               :key="index">
            <Col span="6">
            <FormItem :prop="'orderCustomPlugins.' + index + '.title'"
                      :rules="{required: true, message: '请填写留言标题', trigger: 'blur'}">
              <Input v-model="item.title"
                     placeholder="请输入留言标题"
                     :maxlength="8"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem :prop="'orderCustomPlugins.' + index + '.type'"
                      :rules="{required: true, message: '请选择留言类型', trigger: 'change'}">
              <Select v-model="item.type"
                      placeholder="请选择留言类型"
                      @on-change="typeChange($event,index)">
                <Option v-for="sitem in leaveType"
                        :value="sitem.value"
                        :key="sitem.value">{{sitem.key}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem>
              <Input v-model="item.tips"
                     placeholder="请输入提示语"
                     :maxlength="20"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem>
              <Checkbox v-model="item.isRequired">必填</Checkbox>
              <Button type="ghost"
                      icon="minus-round"
                      style="margin-left:2%;"
                      @click="delPlugins(index)"></Button>
              <Button type="info"
                      icon="plus"
                      style="margin-left:2%;"
                      v-if="index===formItem.orderCustomPlugins.length-1&&index<4"
                      @click="addPlugins"></Button>
            </FormItem>
            </Col>
          </Row>
        </template>
        <Button type="info"
                icon="plus"
                v-else
                @click="addPlugins"></Button>
      </FormItem>
      <FormItem label="订单通知："
                prop="tel"
                :rules="tel?{required: tel, validator: common.validate.phone, trigger: 'blur'}:{}">
        <Checkbox label="tel"
                  @on-change='telChange'
                  v-model="tel"></Checkbox>
        <Input v-model="formItem.tel"
               :disabled='!tel'
               style="width:300px;"
               placeholder="用于接收下单提示短信"></Input>
        <Button type="primary"
                @click="getModal">查看模板</Button>
      </FormItem>
      <FormItem prop="email" :rules="email?{required: email, validator: common.validate.email, trigger: 'blur'}:{}">
        <Checkbox label="email" @on-change='emailChange' v-model="email"></Checkbox>
        <Input v-model="formItem.email" :disabled='!email' style="width:300px;" placeholder="用于接收下单提示邮箱"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="saveToNext" :loading="btnLoading">
          <template v-if='isEdit'>
              保存
            </template>
            <template v-else>
              保存,下一步
            </template>
        </Button>
        <Button v-if='isEdit'
                  type="ghost"
                  style="margin-left: 8px"
                  @click="goback">返回列表</Button>
          <Button v-else
                  type="ghost"
                  style="margin-left: 8px"
                  @click="test">取消</Button>        
      </FormItem>
    </Form>

    <Modal v-model="model" title="查看模板">
      <p>
        您有新的套票订单，订单内容{OrderCode}，游玩日期{TravelDate} ，X份，实付金额XX，请即时处理。
      </p>
      <div slot="footer">
        <Button @click="templateCancel">关闭</Button>
      </div>      
    </Modal>
  </div>
</template>
<script>
// import ueditor from "@/components/global/ueditor";
import ueditor from '@/components/global/vueUEditor'
import myImg from '@/components/global/singleImg';
import selectItem from "@/components/global/selectList";
import leaveWord from "@/components/global/leaveWord";
import { apiPost, apiGet, apiPostJson } from '@/fetch/api'
export default {
  data() {
    return {
      model: false,
      loading: true,
      btnLoading: false,
      areaCode: '',
      tagNameList: [],
      tagName: "",
      labelList: [],
      model: false,
      formItem: {
        name: "",
        nickName: "",
        subTitle: "",        
        recommendReason: [],
        // salesNum: "",
        carouselImg: "",
        proDetail: "",
        buyNotes: "",
        sellType: "2",
        merchantPriceShow: "",
        merchantBuyNotes: "",      
        merchantFictSaleNum: "",                 
        areaName: '',
        areaCode: '',
        labels: '',        
        isDisplayPrice:"T",
        tel: '',
        email: '',
        orderCustomPlugins: [] // 留言和下单填写信息字段        
      },
      ruleComplteForm: {
        name: [{ required: true, message: "请填写套票名称", trigger: "blur" }],
        nickName: [{ required: true, message: "请填写别称", trigger: "blur" }],
        subTitle: [{ required: true, message: "请填写副标题", trigger: "blur" }],
        sellType: [{ required: true, message: "请选择分销渠道", trigger: "change" }],
        labels: [{ required: true, message: "请填写标签", trigger: "blur" }],
        areaCode: [{ required: true, message: "请选择目的地", trigger: "change" }],        
        // salesNum: [{ required: true,  message: "请填写店铺虚拟销量", trigger: "blur"}, { validator: this.common.validate.integer, trigger: "blur" }], 
        merchantFictSaleNum: [{ required: true, message: "请填写店铺虚拟销量", trigger: "blur"}, { validator: this.common.validate.integer, trigger: "blur" }],        
        merchantPriceShow: [{ required: true, message: "请填写店铺展示起价", trigger: "blur"},{ validator: this.common.validate.floatNumber, trigger: "blur" }],
        carouselImg: [{ required: true, message: "请上传缩略图" }],
        merchantBuyNotes: [{ required: true, message: "请填写店铺预订须知", trigger: "blur" }],
             
      },
      name: true,
      idCard: true,
      tel: false,    
      mobile: true,  
      email: false,
      wapImgList: [],
      leaveType: [],
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      isEdit: '',
      dataShow: false, // 保证页面在有数据的情况下一定展示
    }
  },
  computed:{
    isDisplayPrice:{
      get(){
        return this.formItem.isDisplayPrice === 'T'
      },
      set(value){
        this.formItem.isDisplayPrice = value ? 'T':'F'
      }
    }
  },
  watch: {},
  mounted () {
    apiGet(
      '/admin/api/sysParam/changeList?key=leaveType').then(res => {
      if (res.status === 200) {
        this.leaveType = res.data
      } else {
        this.$Message.warning(res.message)
      }
    })
  },
  methods: {
    setWapListUrl(imgArr) {
      if (imgArr.length > 5) {
        this.formItem.carouselImg = imgArr.slice(0, 5).join(',');
      } else {
        this.formItem.carouselImg = imgArr.join(',');
      }
      this.$refs.formItem.validateField('carouselImg');      
    },      
    //获取省市区
    getProvince(sheng, e) {
      //省
      this.cmbProvince = sheng;
      this.formItem.areaName = this.cmbProvince;
      this.provinceCode = e;  
      this.formItem.areaCode = '';    
    },
    getCity(city, e) {
      //市
      this.cmbCity = city;
      this.formItem.areaName = this.cmbProvince + "-" + this.cmbCity;    
      this.cityCode = e;   
      this.formItem.areaCode = '';
    },
    getQu(qu, e) {
      //区
      this.cmbArea = qu;
      this.formItem.areaName = this.cmbProvince + "-" + this.cmbCity + "-" + this.cmbArea;   
      this.quCode = e; 
      this.formItem.areaCode = this.provinceCode + '-' + this.cityCode + '-' + this.quCode;  
    },
    //增加推荐理由
    addReasons() {
      this.formItem.recommendReason.push({
        reason: ""             
      });
    },
    //删除推荐理由
    delReasons(index) {
      this.formItem.recommendReason.splice(index, 1);
    },
    //删除套票标签
    subjectItemDel(index) {
      this.tagNameList.splice(index, 1);
      this.formItem.labels = JSON.stringify(this.tagNameList);
      
    },
    // 回车添加标签名
    setSubjectTag() {      
      if (this.tagNameList && this.tagNameList.length < 5) {
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
    addTosubject(item) {
      if(this.tagNameList.length<4){
        this.tagNameList.push(item);
        this.formItem.labels = JSON.stringify(this.tagNameList);
      }else{
        this.$Message.warning("最多添加四个标签！");
      }      
    },
    //保存，下一步
    saveToNext() {
      let _this = this;
      this.btnLoading = true;
      // this.formItem.proDetail = this.$refs.proDetail.getUEContent();
      // this.formItem.buyNotes = this.$refs.buyNotes.getUEContent();
      // this.formItem.merchantBuyNotes = this.$refs.merchantBuyNotes.getUEContent();      
      let formParam = JSON.parse(JSON.stringify(this.formItem));  
      formParam.recommendReason = formParam.recommendReason.map((item)=>{
        return item.reason
      });
      formParam.recommendReason = JSON.stringify(formParam.recommendReason);
      formParam.orderCustomPlugins.unshift({
        title: '手机号',
        type: 'buyerMobile',
        tips: '请输入手机号',
        name: 'buyerMobile',
        isRequired: true
      })
      if (this.name) {
        formParam.orderCustomPlugins.unshift({
          title: '姓名',
          type: 'buyerName',
          tips: '请填写姓名',
          name: 'buyerName',
          isRequired: true
        })        
      }
      if (this.idCard) {
        var idCardObj = {
          title: '身份证号',
          type: 'buyerIdNo',
          tips: '请填写身份证号',
          name: 'buyerIdNo',
          isRequired: false
        }
        if (formParam.orderCustomPlugins[0].type === 'buyerMobile') {
          formParam.orderCustomPlugins.splice(1, 0, idCardObj)
        } else {
          formParam.orderCustomPlugins.splice(2, 0, idCardObj)
        }       
      }
      formParam.orderCustomPlugins = JSON.stringify(formParam.orderCustomPlugins);
      this.$refs.formItem.validate(async valid => {
        this.scrollError()
        if (valid) {
          let url = this.isEdit ? '/product/api/familyInfo/editFamilyInfo?id=' + this.$route.query.comboId : '/product/api/familyInfo/addFamilyInfo';
          if (this.isEdit) {
            this.formItem.id = this.$route.query.comboId
          }
          let res = await apiPost(url, formParam)
          if (res.status == 200) {
            _this.$Message.success('保存成功!')
            if (this.isEdit) {
              _this.$router.push('/comboInfo')
            } else {
              _this.$router.push('/comboAddOrEdit?nAdd=normalAdd')
            }
          } else {
            this.btnLoading = false
            _this.$Message.warning(res.message)
          }
        } else {
          this.btnLoading = false
          // 滚动到错误地方
          this.$nextTick(()=>{
            setTimeout(function () {
              $('#content').scrollTop(
                $('.ivu-form-item-error').offset().top -
                90 +
                $('#content').scrollTop()
              )
            }, 500)
          });
          return;
        }
      })
    },
    telChange (bool) {
      if (!bool) {
        this.formItem.tel = ''
      }
    },
    emailChange (bool) {
      if (!bool) {
        this.formItem.email = ''
      }
    },
    getModal () {
      this.model = true;
    },
    templateCancel () {
      this.model = false;
    },
    //编辑
    getPageData () {
      apiPost(
        '/product/api/familyInfo/familyInfoDetail?id=' +
        this.$route.query.comboId
      ).then(res => {
        this.initData(res)
      })
    },
    //缓存页面数据
    getRouteInfo () {
      apiPost('/product/api/familyInfo/getFamilyInfoCache', {
        params: new Date()
      }).then(res => {
        this.initData(res)
      })
    },
    //获取标签等展示参数
    getViewParams() {
      apiPost('/product/api/familyInfo/getViewParam', {
        
      }).then(res => {
        let labelArr = [];
        res.data.hotLabels.forEach((item, index)=>{
          labelArr.push(item);
        })       
        this.labelList = labelArr;
      })
    },
    //初始化页面数据
    initData(res) {
      this.dataShow = true;
      if(res&&res.data){
        let _this = this;
        this.formItem = res.data;
        this.formItem.merchantFictSaleNum = res.data.merchantFictSaleNum+'';
        this.formItem.merchantPriceShow = res.data.merchantPriceShow+'';
        // this.formItem.salesNum = res.data.salesNum+'';
        if (!res.data.orderCustomPlugins) {
          this.$set(this.formItem, 'orderCustomPlugins', [])
        } else{
          // let buyerName = false;
          let buyerIdNo = false;
          let orderCustomPluginsObj = JSON.parse(res.data.orderCustomPlugins).filter(element => {
            // if (element.type === 'buyerName') {
            //   buyerName = true
            // }
            if (element.type === 'buyerIdNo') {
              buyerIdNo = true
            }
            return element.type !== 'buyerMobile' && element.type !== 'buyerName' && element.type !== 'buyerIdNo'
          })
          // this.name = buyerName
          this.idCard = buyerIdNo
          this.$set(this.formItem, 'orderCustomPlugins', orderCustomPluginsObj)
        }
        this.tel = !!res.data.tel;
        this.email = !!res.data.email;
        this.tagNameList = res.data && res.data.labels ? JSON.parse(res.data.labels) : [];        
        this.wapImgList = res.data && res.data.carouselImg ? res.data.carouselImg.split(',') : [];        
        if(res.data && res.data.recommendReason){
          let arr = JSON.parse(res.data.recommendReason);
          let reaArr = [];
          for(let i = 0; i < arr.length; i++){
            let obj = {
              reason: arr[i]
            }
            reaArr.push(obj);
          }
          this.formItem.recommendReason = reaArr;
        }else{
          this.formItem.recommendReason = []
        }
        this.areaCode = res.data && res.data.areaCode ? res.data.areaCode : "";
      }
    },
    test() {
      window.location.href = window.location.href.split('/manage')[0] + '/admin/index#/product/parkPublish/selectProduct';
    },
    scrollError () {
      let errList = $('.ivu-form-item-error')
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top
        $('#content').animate(
          {
            scrollTop: scroll_offset
          },
          300
        )
      }
    },
    addPlugins () {
      this.formItem.orderCustomPlugins.push({
        title: '',
        type: '',
        tips: '',
        name: '',
        isRequired: false
      })
    },
    delPlugins (index) {
      this.formItem.orderCustomPlugins.splice(index, 1)
    },
    typeChange (value, index) {
      this.formItem.orderCustomPlugins[index].name = value
    },
    goback () {
      this.$router.back()
    },
  },
  created () {
    this.getViewParams();
    this.isEdit = this.$route && this.$route.query && this.$route.query.comboId
    if (this.isEdit) {
      this.getPageData()
    } else {
      // 缓存页面
      this.getRouteInfo()
    }
  },
  components: {
    ueditor,
    myImg,
    selectItem,
    leaveWord
  }
};
</script>
<style scope lang="scss">
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

.add-icon {
  cursor: pointer;
  color: green;
  font-size: 28px;
}
.delete-icon {
  cursor: pointer;
  color: red;
  font-size: 28px;
}
.center-td {
  text-align: center;
}
.step-list {
  padding-top: 20px;
  display: inline-block;
  margin: 0 auto;
}

.step-list .step-item {
  display: inline-block;
  width: 160px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.step-list .step-item .line-img {
  position: absolute;
  top: 10px;
  left: 92px;
}

.step-list .step-item .line-img.line-nodo-img {
  top: 3px;
  width: 157px;
  left: 84px;
}

.step-list .step-item .step-title {
  margin-top: 10px;
  color: #19a2fe;
}

.step-list .step-item .step-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.step-list .step-item .step-nodo {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 9px;
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
.comboPublish-box {
  .travellSubject {
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
