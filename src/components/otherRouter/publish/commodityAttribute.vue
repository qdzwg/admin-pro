<template>
  <div class="commodity-attribute">
    <div class="step">
      <Steps :current="2">
        <Step title="产品类型"></Step>
        <Step title="商品信息" class="step-back" style="cursor:pointer"></Step>
        <Step title="商品规格信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleForm">
      <div id="base" class="form-title">基本信息</div>
      <FormItem label="商品名称：">
        {{ formItem.name}}
      </FormItem>

      <FormItem label="配送方式：" prop="shipType">
        <checkbox size="small" v-model="isGetBySelf" @on-change="getBySelf" label="">仅支持自提</checkbox>
        <RadioGroup @on-change='shipTypeChange' v-model="formItem.shipType">
          <Radio :disabled="isGetBySelf" label="0">包邮</Radio>
          <Radio :disabled="isGetBySelf" label="1">统一快递费</Radio>
          <Radio :disabled="isGetBySelf" label="2">快递模板</Radio>
        </RadioGroup>
        <checkbox size="small" :disabled="isGetBySelf" :value="formItem.isExpress=='T'" @on-change="change" label="">指定地点取货</checkbox>
      </FormItem>

      <FormItem label="统一快递费" v-if="formItem.shipType=='1'" required>
        <Input v-model="formItem.expressFee" style="width:15%"></Input>
      </FormItem>
      <FormItem label="快递模板" v-if="formItem.shipType=='2'" required>

        <Select @on-change="changeId" v-model="formItem.postageId" style="width:200px">
          <Option :value="item.value" v-for="(item,index) in postage" :key="index">
            {{item.label}}

          </Option>
        </Select>
        <a target='_blank' :href='preUrl+"/manage/?mold=/postage#/"'>
          创建快递模板
        </a>
        <a @click="getPostage" style="margin-left:20px;">刷新</a>
      </FormItem>
      <FormItem label="指定地点取货" prop="mdsePlaceIds" v-if="formItem.isExpress=='T'" style="margin-top:10px;" :rules="[{required:true,message:'请选择指定地点取货'}]">
        <Select v-model="formItem.mdsePlaceIds" style="width:200px" multiple>
          <Option :value="ele.id" v-for="(ele,i) in mdsePlace" :key="i">{{ele.name}}</Option>
        </Select>

        <a target="_blank" :href="preUrl+'/admin/index#/product/mdsePlace/list'">创建取货地点</a>
        <a @click="getmdsePlace" style="margin-left:20px;">刷新</a>
        <!-- <p style="margin:10px 0 0 0;"> 截止时间下单后 <InputNumber v-model="formItem.expressDay"></InputNumber>天后未取货、将自动取消订单、退款</p> -->
      </FormItem>

      <!-- <FormItem label="销售渠道：">             
                <span v-if="formItem.distType=='0'">分销市场+店铺</span>
                <span v-if="formItem.distType=='1'">仅分销市场</span>
                <span v-if="formItem.distType=='2'">店铺</span>                            
          </FormItem> -->
      <FormItem label="商品规格：" required>
        <div class="attribute">
          <div v-for="(item,index) in formItem.dataList" :key="index">
            <div class="attr-title">
              <FormItem label="规格名" :label-width="80" :prop="'dataList.'+index+'.attrName'" :rules="[{required:true,message:'请输入规格名',tirgger:'blur'}]">
                <Input style="width:20%" v-model="item.attrName" :maxlength="5" @on-blur="changeOutAttr(index)" placeholder="请输入"></Input>
                <Checkbox v-model="single" v-if="index=='0'" style="display:none">添加规格图片</Checkbox>
              </FormItem>
              <div class="dell-icon" @click="del(index)">x</div>
            </div>
            <div>
              <FormItem label="规格值" style="padding:1rem 0;">
                <div style="margin-left:120px;">
                  <div v-for="(xitem,xindex) in item.attrParam" :key="xindex" class="attrBox">
                    <FormItem :label-width="1" :prop="'dataList.'+index+'.attrParam.'+xindex+'.name'" :rules="[{required:true,message:'请输入规格值',tirgger:'blur'}]">
                      <Input @on-blur="changeOut2(index,xindex)" v-model="xitem.name" placeholder="请输入" style="width:80%;" name="attrdelName" :maxlength="15">
                      </Input>
                    </FormItem>
                    <div class="dell-input" @click="dellInput(index,xindex)">x</div>
                    <div v-if="xitem.attrPics=='T'">

                      <div class="attrimg" v-show="xitem.attrPic.length">
                        <img :src="xitem.attrPic[0]">
                        <div class="demo-upload-list-cover">
                          <Icon type="ios-trash-outline" @click.native="handleRemove(xindex)"></Icon>
                        </div>
                      </div>
                      <Upload :format="['jpg','jpeg','png']" :on-success="setImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload" style="display: inline-block;width:58px;">
                        <div @click="setIndex(xindex)" v-show="xitem.attrPic.length==0" style="width: 58px;height:58px;line-height: 58px;
                                        border:1px dashed #ccc;
                                        border-radius:5px;
                                        text-align: center;
                                        margin-top:5px;">
                          <Icon type="camera" size="20"></Icon>
                        </div>
                        <!-- <Button @click="setIndex(index)" size="small" type="ghost">上传</Button> -->
                      </Upload>
                    </div>

                  </div>
                  <a @click="addInput(index)" :disabled="formItem.dataList[index].attrParam.length>='5'">添加规格值</a>
                  <p v-if="single==true&&index=='0'">仅支持第一组规格项目设置图片，最多上传5张，建议上传小于1M， 宽800px，高800px的JPG/PNG格式的图片</p>
                </div>
              </FormItem>
            </div>

          </div>
          <div class="attr-title " style="padding-left:2.5rem">
            <Button @click="addAttr" :disabled="formItem.dataList.length>=3">添加规格项目</Button>
          </div>

        </div>

      </FormItem>
      <FormItem label="规格明细" required>
        <div id="createTable">

        </div>
        <!-- <div id="createTable" style="display:none">
          <table class="table">
            <thead>
              <tr>
                <th width=100 v-for="(item,index) in titles" :key="index">
                  <span>{{item}}</span>
                </th>
                <th>成本价</th>
                <th>门市价</th>
                <th v-if="formItem.distType!='1'">零售价</th>
                <th v-if="formItem.distType!='2'">供货价</th>
                <th v-if="formItem.distType!='2'">建议零售价</th>
                <th>库存</th>
                <th v-if="formItem.distType!='2'">分销库存</th>
                <th v-if="Weight=='0'">重量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ele,i) in formItem.tables" :key="i">
                <td v-for="(el,j) in ele.specs" :key="j">
                  <span>{{el.value}}</span>
                </td>
                <td>
                  <FormItem :prop="'tables.'+i+'.price'" :rules="[{required: true, message: '成本价不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                    <Input v-model="ele.price" number :maxlength="9" style="width:80%"></Input>
                  </FormItem>
                </td>
                <td>
                  <FormItem :prop="'tables.'+i+'.priceShow'" :rules="[{required: true, message: '门市价不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                    <Input v-model="ele.priceShow" number :maxlength="9" style="width:80%"></Input>
                  </FormItem>
                </td>
                <td v-if="formItem.distType!='1'">
                  <FormItem :prop="'tables.'+i+'.priceSell'" :rules="[{required: true, message: '零售价不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                    <Input v-model="ele.priceSell" number :maxlength="9" style="width:80%"></Input>
                  </FormItem>
                </td>
                <td v-if="formItem.distType!='2'">
                  <FormItem :prop="'tables.'+i+'.priceSupply'" :rules="[{required: true, message: '供货价不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                    <Input v-model="ele.priceSupply" number :maxlength="9" style="width:80%"></Input>
                  </FormItem>
                </td>
                <td v-if="formItem.distType!='2'">
                  <div style="display:inline-block">
                    <FormItem style="width:48%;display:inline-block; " :prop="'tables.'+i+'.priceMin'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                      <Input v-model="ele.priceMin" number :maxlength="9" placeholder="最低价" style="width:80%"></Input>
                    </FormItem>
                    <FormItem style="width:48%;display:inline-block; " :prop="'tables.'+i+'.priceMax'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                      <Input v-model="ele.priceMax" number :maxlength="9" placeholder="最高价" style="width:80%"></Input>
                    </FormItem>
                  </div>

                </td>
                <td>
                  <FormItem :prop="'tables.'+i+'.stockNum'" :rules="[{required: true, message: '库存不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                    <Input @on-change="getStock" v-model="ele.stockNum" number :maxlength="9" style="width:80%"></Input>
                  </FormItem>
                </td>
                <td v-if="formItem.distType!='2'">
                  <FormItem :prop="'tables.'+i+'.distStockNum'" :rules="[{required: true, message: '分销库存不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                    <Input v-model="ele.distStockNum" number :maxlength="9" style="width:80%"></Input>
                  </FormItem>
                </td>
                <td v-if="Weight=='0'">
                  <FormItem :prop="'tables.'+i+'.weight'" :rules="[{required: true, message: '重量不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                    <Input v-model="ele.weight" number :maxlength="9" style="width:80%"></Input>
                  </FormItem>
                </td>
              </tr>
            </tbody>
          </table>
        </div> -->

        <FormItem label="批量设置值" style="border:1px solid #ccc;padding:.5rem;margin-top:-.75rem;">
          <RadioGroup v-model="button1" type="button">
            <Radio label=".price">成本价</Radio>
            <Radio label=".priceShow">门市价</Radio>
            <Radio label=".priceSell" v-show="formItem.distType!=1">零售价</Radio>
            <Radio v-show="formItem.distType!=2" label=".priceSupply">供货价</Radio>
            <Radio label=".txt5" v-show="formItem.distType!=2">建议零售价</Radio>
            <Radio label=".stockNum">库存</Radio>
            <Radio v-show="formItem.distType!=2" label=".distStockNum">分销库存</Radio>
            <Radio v-show="Weight=='0'" label=".weight">重量</Radio>
          </RadioGroup>
          <div style="margin:.8rem 0 0 6.2rem;">
            <Input v-if="button1!='.txt5'" style="width:15%" v-model="priceAll" :placeholder="'请输入'+this.filter.priceType(button1)"></Input>
            <span v-else>
              <Input style="width:10%" v-model="priceBgain" placeholder="最低价"></Input>
              <Input style="width:10%" v-model="priceOut" placeholder="最高价"></Input>
            </span>
            <Button type="primary" @click="addPrice(button1)">保存</Button>
            <Button @click="dellPrice">取消</Button>
          </div>

        </FormItem>
      </FormItem>
      <FormItem label="总库存：">
        <Input v-model="stocks" disabled placeholder="请填写库存" style="width:33%"></Input>
      </FormItem>
      <div id="rule" class="form-title">预订规则</div>

      <FormItem label="预订日期限制：">
        <!-- <Select  v-model="orderType" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select> -->
        <template>
          在
          <DatePicker :editable="false" v-model="ruleBuys.orderBegDay" @on-change="setBegDate" type="date" :options="options3" format="yyyy-MM-dd"></DatePicker>
          <span>至</span>
          <DatePicker :editable="false" v-model="ruleBuys.orderEndDay" @on-change="setEndDate" type="date" :options="options4" format="yyyy-MM-dd"></DatePicker>
          期间内可预订
        </template>
      </FormItem>
      <FormItem label="预订时间限制：">
        <!-- <Select  v-model="orderdayType" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select> -->
        <template>
          在
          <TimePicker :editable="false" v-model="ruleBuys.dayBegTime" format="HH:mm"></TimePicker>
          <span>至</span>
          <TimePicker :editable="false" v-model="ruleBuys.dayEndTime" format="HH:mm"></TimePicker>
          时间内可预订
        </template>
      </FormItem>
      <FormItem label="预订数量限制：">
        <!-- <Select  v-model="ordernum" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select> -->

        <template>

          每次下单数量最少
          <Input v-model="ruleBuys.minOrder" style="width:100px;" :maxlength="2"></Input>
          个，最多
          <Input v-model="ruleBuys.maxOrder" style="width:100px;" :maxlength="2"></Input>
          个
        </template>
      </FormItem>
      <!-- <FormItem label="限购限制：">
               <Select  v-model="formItem.buyFarthestType" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select>
              <template v-if="formItem.buyFarthestType=='T'">
                    
                每个用户
                <Select  v-model="formItem.orderdaya" style="width:120px">
                    <Option value="1">整个销售时间段</Option>
                    <Option value="2">每日</Option>
                    <Option value="3">每周</Option>
                    <Option value="4">每月</Option>
                    <Option value="5">每三月</Option>
               </Select>
                限购
                <InputNumber></InputNumber>
                <Select  v-model="formItem.orderdays" style="width:120px">                    
                    <Option value="1">个</Option>
                    <Option value="2">笔订单</Option>
                </Select>
            </template>
          </FormItem> -->
      <!-- <FormItem label="下单地域限制：">
             <Select  v-model="formItem.orderdays" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select>
          </FormItem> -->

      <div id="backRule" class="form-title">退改规则</div>

      <FormItem label="退单是否允许：">
        <RadioGroup v-model="ruleSolds.isRetreat">
          <Radio label="T">是</Radio>
          <Radio label="F">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="退单是否需要审核：">
        <RadioGroup v-model="ruleSolds.isRetreatAudit">
          <Radio label="T" disabled>是</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="过期是否核销：">
        <RadioGroup v-model="ruleSolds.isOverDueCheck">
          <Radio label="T" disabled>是</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="发货日期：" prop='checkRelativeDay'>
        <Input v-model="formItem.checkRelativeDay" style="width:10%" :maxlength="2"></Input>
        <span> 天后自动核销</span>
        <p style="color:#5a98de">备注：订单发货后，有退单的交易，只能手动核销</p>
      </FormItem>

      <FormItem style="padding-bottom:5rem">
        <Button :loading="loading" type="primary" @click="submit" style="width:8rem;" :disabled="disabled">保存</Button>
        <Button type="ghost" @click="back" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('rule')">预订规则</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('backRule')">退改规则</a>
        </li>
        <li>
          <Button size="small" :loading="loading" @click="submit" type="primary" :disabled="disabled">保存</Button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { apiGet, apiPost } from "@/fetch/api";
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
    return {
      preUrl: window.location.href.split("/manage")[0],
      tableArr: [], //表格数据(拼接)
      attrList: [], //属性值数据
      array1: [], //价格是数据
      single: false, //是否添加规格图片
      priceAll: "", //批量填充价格数据
      button1: "", //选择到要批量填充什么价
      priceBgain: "", //起始建议零售价
      priceOut: "", //结束建议零售价
      trIndex: "", //上传当前图片的索引
      loading: false, //按钮加载状态
      disabled: false, //按钮禁用
      options3: {}, //控制选怎事件范围
      options4: {},
      preventPopout: false, //控制是否全验证通过再发起提交的  开关
      list: [
        //销售渠道
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
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      orderType: "F",
      orderdayType: "F",
      ordernum: "F",
      ruleSolds: {
        //退改规则
        isRetreat: "F",
        isRetreatAudit: "T",
        isOverDueCheck: "T",
        checkRelativeDay: 15
      },
      ruleBuys: {
        //购买规则
        orderBegDay: "",
        orderEndDay: "",
        dayBegTime: "",
        dayEndTime: "",
        minOrder: "",
        maxOrder: ""
      },
      formItem: {
        shipType: 0, //是否包邮
        ruleSold: "", //是否退单
        ruleBuy: "", //预订规则
        mdseSpec: "",
        mdseSpecDetail: "",
        linkMobileImg: "",
        name: "",
        distType: "0",
        isExpress: "F",
        expressFee: "",
        postageId: "",
        mdsePlaceId: "",
        mdsePlaceIds: [],
        weight: "",
        // expressDay:'',
        checkRelativeDay: 15,
        dataList: [], //规格数据
        tables: [] //表格数据
      },
      mdsePlaceId: [],
      Weight: "1", //表格中是否显示重量
      postage: [],
      mdsePlace: [],
      stocks: 0, //总库存
      ruleForm: {
        checkRelativeDay: [{ required: true, message: "请填写发货日期" }],
        // shipType: [
        //   { required: true, message: "请选择配送方式", trigger: "change" }
        // ]
      },
      titles: [], //表格头部
      isGetBySelf:false // 仅支持自提
    };
  },
  watch: {
    Weight: "creatTable"
  },
  mounted() {
    $(".step-back").click(() => {
      this.$router.back(-1);
    });
    let _this = this;
    $("#submit").click(() => {});
  },
  created() {
    this.getList();
    // this.creatTable();        //初始化表格
    this.getPostage(); //获取邮费模板
    this.getmdsePlace(); //获取指定地点取货
  },
  methods: {
    //点击快捷导航
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    //是否是指点地点取货
    change(val) {
      if (val == true) {
        this.formItem.isExpress = "T";
      } else {
        this.formItem.isExpress = "F";
      }
    },
    //处理起始日期
    setBegDate(time) {
      this.ruleBuys.orderBegDay = time;
      this.options4 = {
        disabledDate: date => {
          let startTime = this.ruleBuys.orderBegDay
            ? new Date(this.ruleBuys.orderBegDay).valueOf() -
              1 * 24 * 60 * 60 * 1000
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    //处理结束日期
    setEndDate(time) {
      if (time) {
        this.ruleBuys.orderEndDay = time;
        let endTime = this.ruleBuys.orderEndDay
          ? new Date(this.ruleBuys.orderEndDay).valueOf()
          : "";
        this.options3 = {
          disabledDate(date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        this.options3 = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    //选择快递模板，筛出按重量计算
    changeId(val) {
      this.postage.forEach((el, i) => {
        if (el.value == val) {
          this.Weight = el.type;
        }
      });
    },
    shipTypeChange(val){
      if(val!=2){
        this.Weight = '1';
      }
    },
    getBySelf(val){
      if (val) {
        this.formItem.isExpress = "T";
        this.formItem.shipType = "";
      } else {
        this.formItem.shipType = '0';
      }
    },
    //获取上一页刚保存的商品基本信息
    getList() {
      let _this = this;
      apiGet("/product/api/mdse/getMdseInfo").then(function(res) {
        _this.formItem.name = res.data.name ? res.data.name : "";
        _this.formItem.distType = res.data.distType ? res.data.distType : "";
      });
    },
    //获取邮费模板
    getPostage() {
      let _this = this;
      apiGet("/product/api/mdsePostage/getAllPostageInfo").then(function(res) {
        _this.postage = [];
        res.data.map(item => {
          _this.postage.push({
            value: item.id,
            label: item.name,
            type: item.costType
          });
        });
      });
    },
    //获取指定地点取货
    getmdsePlace() {
      let _this = this;
      apiGet("/product/api/mdse/placeList").then(function(res) {
        _this.mdsePlace = res.data;
      });
    },
    //删除一组规格
    del(index) {
      this.formItem.dataList.splice(index, 1);
      this.creatTable();
      //   this.creatTableAll()
    },
    //删除单个属性值
    dellInput(i, e) {
      let _this = this;
      this.formItem.dataList[i].attrParam.splice(e, 1);
      if (this.formItem.dataList[i].attrParam.length == 0) {
        _this.del(i);
      } else {
        this.creatTable();
        // this.creatTableAll()
      }
    },
    //删除图片
    handleRemove(i) {
      this.formItem.dataList[0].attrParam[i].attrPic.splice(0, 1);
    },
    //取消  返回上一页
    back() {
      this.$router.back(-1);
    },
    //添加规格属性
    addAttr() {
      if (this.formItem.dataList.length == "0") {
        this.formItem.dataList.push({
          attrName: "",
          attrParam: [
            {
              name: "",
              attrPics: "T",
              attrPic: []
            }
          ]
        });
      } else {
        this.formItem.dataList.push({
          attrName: "",
          attrParam: [
            {
              name: ""
            }
          ]
        });
      }
    },
    //添加属性值
    addInput(i) {
      if (i == 0) {
        this.formItem.dataList[i].attrParam.push({
          name: "",
          attrPics: "T",
          attrPic: [],
          a: false
        });
      } else {
        this.formItem.dataList[i].attrParam.push({
          name: "",
          a: false
        });
      }
    },
    //上传图片
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件" + file.name + "的文件格式错误，请重新上传"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "文件  " + file.name + "太大,不能超过2M"
      });
    },
    setIndex(index) {
      this.trIndex = index;
    },
    setImgUrl(res, file, fileList) {
      if (res.state === "SUCCESS") {
        this.formItem.dataList[0].attrParam[this.trIndex].attrPic.push(
          res.prefix + res.url
        );
        this.$Message.success("照片上传");
      } else {
        this.$Message.warning(res.message);
      }
    },
    //规格名改变时，重新生成表格
    changeOutAttr(index) {
      this.creatTable();
      // this.creatTableAll();
    },
    //删除input按钮隐藏
    changeOut2(i, e) {
      if (
        this.formItem.dataList[i].attrName == "" ||
        this.formItem.dataList[i].attrParam[e].name == ""
      ) {
        this.$Message.warning("请先填写规格/规格值!");
      } else {
        this.creatTable();
        // this.creatTableAll()
      }
    },
    //生成表格数据
    creatTableAll() {
      var arrayTitle = []; //表格标题
      var arrayInfor = []; //每组属性值
      var arrayColumn = []; //指定列 用来合并那些列
      var columnIndex = 0;
      let _this = this;
      if (_this.formItem.dataList.length) {
        _this.formItem.dataList.map(function(item, index) {
          arrayColumn.push(columnIndex++);
          arrayTitle.push(item.attrName.replace(/(^\s*)|(\s*$)/g, ""));
          var arr = [];
          _this.formItem.dataList[index].attrParam.map(function(ele, i) {
            arr.push(ele.name.replace(/(^\s*)|(\s*$)/g, ""));
          });
          arrayInfor.push(arr);
        });
        this.titles = arrayTitle;
        var zuheData = this.doExchange(arrayInfor);

        let arrs = [];
        zuheData.map((item, index) => {
          let obj = {};
          let data = item.split(",");
          let nameSize = data.length;
          if (nameSize == 1) {
            obj.specValue1 = data[0];
          } else if (nameSize == 2) {
            obj.specValue1 = data[0];
            obj.specValue2 = data[1];
          } else if (nameSize == 3) {
            obj.specValue1 = data[0];
            obj.specValue2 = data[1];
            obj.specValue3 = data[2];
          }

          arrs.push(obj);
        });
        let lastArr = [];
        arrs.forEach((ele, i) => {
          let lastArrObj = {};
          lastArrObj.specs = [];
          for (let key in ele) {
            lastArrObj.specs.push({ key: key, value: ele[key] });
          }
          lastArrObj.price = "";
          lastArrObj.priceShow = "";
          lastArrObj.priceSell = "";
          lastArrObj.priceSupply = "";
          lastArrObj.priceMin = "";
          lastArrObj.priceMax = "";
          lastArrObj.stockNum = "";
          lastArrObj.distStockNum = "";
          lastArrObj.weight = null;

          lastArr.push(lastArrObj);
        });
        this.formItem.tables = lastArr;
      }
      this.getStock();
    },

    //生成表格
    creatTable() {
      this.hebingFunction();
      var arrayTitle = []; //表格标题
      var arrayInfor = []; //每组属性值
      var arrayColumn = []; //指定列 用来合并那些列
      var columnIndex = 0;
      let _this = this;
      if (_this.formItem.dataList.length) {
        _this.formItem.dataList.map(function(item, index) {
          arrayColumn.push(columnIndex++);
          arrayTitle.push(item.attrName.replace(/(^\s*)|(\s*$)/g, ""));
          var arr = [];
          _this.formItem.dataList[index].attrParam.map(function(ele, i) {
            arr.push(ele.name.replace(/(^\s*)|(\s*$)/g, ""));
          });
          arrayInfor.push(arr);
        });

        $("#createTable").html("");
        var table = $('<table class="table"></table>');
        table.appendTo($("#createTable"));
        var thead = $("<thead></thead>");
        thead.appendTo(table);
        var trhead = $("<tr></tr>");
        trhead.appendTo(thead);
        //创建表头
        var str = "";
        arrayTitle.map(function(ele, i) {
          if (ele) {
            _this.disabled = false;
          } else {
            _this.disabled = true;
          }
          str += '<th width="120">' + ele + "</th>";
        });
        str += "<th >成本价</th>";
        str += "<th >门市价</th>";
        str += '<th class="fenxiao">零售价</th>';
        str += '<th class="sell">供货价</th>';
        str += '<th class="sell" width="200">建议零售价</th>';
        str += "<th >库存(个)</th>";
        str += '<th class="sell">分销库存(个)</th>';
        str += '<th class="weight">重量(kg)</th>';
        trhead.append(str);
        var tbody = $("<tbody></tbody>");
        tbody.appendTo(table);
        var zuheData = this.doExchange(arrayInfor);
        let arrs = [];
        zuheData.map(function(item, index) {
          let obj = {};
          let data = item.split(",");
          let nameSize = data.length;
          if (nameSize == 1) {
            obj.specValue1 = data[0];
          } else if (nameSize == 2) {
            obj.specValue1 = data[0];
            obj.specValue2 = data[1];
          } else if (nameSize == 3) {
            obj.specValue1 = data[0];
            obj.specValue2 = data[1];
            obj.specValue3 = data[2];
          }
          arrs.push(obj);
        });
        this.attrList = arrs;

        if (zuheData.length > 0) {
          //创建行
          zuheData.map(function(ele, i) {
            var td_array = ele.split(",");
            var tr = $("<tr></tr>");
            tr.appendTo(tbody);
            var str = "";
            td_array.map((val, index) => {
              if (val) {
                _this.disabled = false;
              } else {
                _this.disabled = true;
              }
              str += "<td>" + val + "</td>";
            });
            str +=
              '<td> <input type="number"  oninput="if(value.length>6)value=value.slice(0,6)" class="price inpbox inpbox-mini"> </td>';
            str +=
              '<td > <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" class="priceShow inpbox inpbox-mini"> </td>';
            str +=
              '<td class="fenxiao"> <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" class="priceSell inpbox inpbox-mini"> </td>';
            str +=
              '<td class="sell"> <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" class="priceSupply inpbox inpbox-mini"> </td>';
            str +=
              '<td class="sell"> <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" class="txtbegin priceMin inpbox inpbox1 inpbox-mini" placeholder="最低价"> <input placeholder="最高价" type="number" oninput="if(value.length>6)value=value.slice(0,6)"  class="txtout priceMax inpbox inpbox1 inpbox-mini"> </td>';
            str +=
              '<td> <input type="number" name="scoknum" oninput="if(value.length>6)value=value.slice(0,6)" class="stockNum inpbox inpbox-mini"> </td>';

            str +=
              '<td class="sell"> <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" class="distStockNum inpbox inpbox-mini"> </td>';

            str +=
              '<td class="weight"> <input type="number" oninput="if(value.length>6)value=value.slice(0,6)" class="weight inpbox inpbox-mini"> </td>';

            tr.append(str);
          });
          //仅店铺
          if (this.formItem.distType == 2) {
            $(".sell").remove();
          }
          //仅分销
          if (this.formItem.distType == 1) {
            $(".fenxiao").remove();
          }
          //显示重量
          if (this.Weight == "1") {
            $(".weight").remove();
          }
          $("input[name=scoknum]").change(function() {
            //   alert('sdbjs')
            _this.getTableNum();
          });
        }

        arrayColumn.pop(); //删除数组中最后一项
        //合并表格
        $(table).mergeCell({
          cols: arrayColumn //目前只有cols这么一个配置项，用数组表示列的索引，从0开始
        });
      }
    },
    hebingFunction() {
      $.fn.mergeCell = function(options) {
        return this.each(function() {
          var cols = options.cols;
          for (var i = cols.length - 1; cols[i] != undefined; i--) {
            mergeCell($(this), cols[i]);
          }
          dispose($(this));
        });
      };
      function mergeCell($table, colIndex) {
        $table.data("col-content", ""); //存放单元格内容
        $table.data("col-rowspan", 1); //存放计算的rowspan值  默认为1
        $table.data("col-td", $()); //存放发现的第一个与前一行比较结果不同td（jquery封装过的）默认一个空的jquery对象
        $table.data("trNum", $("tbody tr", $table).length); //要处理表格的总行数，用于最后一行做特殊处理时进行判断之用

        $("tbody tr", $table).each(function(index) {
          //进行“扫面”处理 关键是定位col-td,和其对应的rowspan
          var $td = $("td:eq(" + colIndex + ")", this); //td:eq中的colIndex即列索引
          var currentContent = $td.html(); //获取单元格的当前内容
          if ($table.data("col-content") == "") {
            //第一次时走次分支
            $table.data("col-content", currentContent);
            $table.data("col-td", $td);
          } else {
            if ($table.data("col-content") == currentContent) {
              //上一行与当前行内容相同
              var rowspan = $table.data("col-rowspan") + 1; //上一行与当前行内容相同则col-rowspan累加，保存新值
              $table.data("col-rowspan", rowspan);
              $td.hide(); //值得注意的是 如果用了$table.remove()就会对其他列的处理造成影响
              if (++index == $table.data("trNum")) {
                //最后一行的情况比较特殊一点
                //比如最后两行 td中的内容是一样的，那么到最后一行就应该把此时的col-td里保存的td设置rowspan
                $table
                  .data("col-td")
                  .attr("rowspan", $table.data("col-rowspan")); //最后一行不会向下判断是否有不同的内容
              }
            } else {
              //上一行与当前行内容不同
              if ($table.data("col-rowspan") != 1) {
                //col-rowspan默认为1，如果统计出的col-rowspan没有变化，不处理
                $table
                  .data("col-td")
                  .attr("rowspan", $table.data("col-rowspan"));
              } //保存第一次出现不同内容的td，和其内容，重置col-rowspan
              $table.data("col-td", $td);
              $table.data("col-content", $td.html());
              $table.data("col-rowspan", 1);
            }
          }
        });
      }
      //同样是个private函数 清理内存用
      function dispose($table) {
        $table.removeData();
      }
    },
    //二维数组，最先两个数组组合成一个数组，与后边的数组组成新的数组，依次类推，直到二维数组变成一维数组，所有数组两两组合
    doExchange(arr) {
      var len = arr.length;
      if (len >= 2) {
        var arr1 = arr[0];
        var arr2 = arr[1];
        var len1 = arr1.length;
        var len2 = arr2.length;
        var newLen = len1 * len2;
        var temp = new Array(newLen);
        var index = 0;
        for (var i = 0; i < len1; i++) {
          for (var j = 0; j < len2; j++) {
            temp[index++] = arr1[i] + "," + arr2[j];
          }
        }
        var newArray = new Array(len - 1); //拿到当前数组最后一项
        newArray[0] = temp;
        if (len > 2) {
          var _count = 1;
          for (var i = 2; i < len; i++) {
            newArray[_count++] = arr[i];
          }
        }
        return this.doExchange(newArray);
      } else {
        //  this.formItem.array1=arr[0]
        //  this.count=this.formItem.array1.length
        return arr[0];
      }
    },
    getTableNum() {
      let gooArr = [];
      for (let i = 0; i < $(".price").length; i++) {
        
        this.array1[i] +=
          "," +
          $(".price")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".priceShow")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".priceSell")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".priceSupply")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".priceMin")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".priceMax")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".stockNum")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".distStockNum")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $("input.weight").eq(i).val();
      }
      for (let k = 0; k < this.array1.length; k++) {
        let obj2 = {};
        let str = this.array1[k].split(",");
        let strSize = str.length;
        if (strSize > 9) {
          obj2.price = str[strSize - 9];
          obj2.priceShow = str[strSize - 8];
          obj2.priceSell = str[strSize - 7];
          obj2.priceSupply = str[strSize - 6];
          obj2.priceMin = str[strSize - 5];
          obj2.priceMax = str[strSize - 4];
          obj2.stockNum = str[strSize - 3];
          obj2.distStockNum = str[strSize - 2];
          obj2.weight = str[strSize - 1];
        }
        gooArr.push(obj2);
      }
      let lastArr = [];
      this.attrList.forEach(function(ele, index) {
        lastArr.push({ ...ele, ...gooArr[index] });
      });
      this.tableArr = lastArr;
      this.getStock();
    },
    getStock() {
    //   let size = this.formItem.tables.length;
      let size =  $(".price").length;
      this.stocks = 0;
      for (let i = 0; i < size; i++) {
        // this.stocks += this.formItem.tables[i].stockNum - 0;
        this.stocks += $(".stockNum").eq(i).val()-0;
      }
    },
    addPrice(text) {
      if (text == ".txt5") {
        $(".priceMin").val(this.priceBgain);
        $(".priceMax").val(this.priceOut);
      } else {
        $(text).val(this.priceAll);
      }
      if (text == ".stockNum") {
        this.getTableNum();
      }
      this.priceAll = "";
      //     if (text == ".txt5") {
      //     this.formItem.tables.map((item, index) => {
      //       item["priceMin"] = +this.priceBgain;
      //       item["priceMax"] = +this.priceOut;
      //     });
      //     this.priceBgain = "";
      //     this.priceOut = "";
      //   } else {
      //     this.formItem.tables.map((item, index) => {
      //       item[text] = +this.priceAll;
      //     });
      //     this.priceAll = "";
      //   }

      //   if (text == "stockNum") {
      //     this.getStock();
      //   }
    },
    dellPrice() {
      this.priceAll = "";
    },
    submit() {
      this.getTableNum();
      this.loading = true;
      this.ruleSolds.checkRelativeDay = this.formItem.checkRelativeDay;
      this.formItem.mdseSpec = JSON.stringify(this.formItem.dataList);
      this.formItem.mdseSpecDetail = JSON.stringify(this.tableArr);
      this.formItem.ruleSold = JSON.stringify(this.ruleSolds);
      this.formItem.ruleBuy = JSON.stringify(this.ruleBuys);
      let _this = this;

      //   this.disabled = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      if (this.formItem.isExpress == "T") {
        this.formItem.mdsePlaceId = this.formItem.mdsePlaceIds.join(",");
      }
      //不合并表格方法
      //      this.$refs.formItem.validate(async valid => {
      //     if (valid) {
      //         let url = "/product/api/mdse/saveMdseDetail";
      //         return;
      //         let res = await apiPost(url, this.formItem);
      //         if (res.status == 200) {
      //           _this.$Message.success("修改成功!");
      //         } else if(res.status==402) {
      //             _this.$Message.warning(res.message);
      //         }
      //     }else{
      //          //滚动到错误地方
      //       setTimeout(function(){
      //         $("#content").scrollTop(
      //           $(".ivu-form-item-error").offset().top -90 + $("#content").scrollTop()
      //         );
      //       },500);
      //     }
      //   });

      //合并表格方法
      if (this.formItem.dataList.length) {
        if (this.tableArr.length) {
          let pricePop = true;
          let priceShowPop = true;
          let priceSellPop = true;
          let priceSupplyPop = true;
          let priceMinPop = true;
          let priceMaxPop = true;
          let stockNumPop = true;
          let distStockNumPop = true;
          let weightPop = true;

          let pricePop2 = true;
          let priceShowPop2 = true;
          let priceSellPop2 = true;
          let priceSupplyPop2 = true;
          let priceMinPop2 = true;
          let priceMaxPop2 = true;
          let stockNumPop2 = true;
          let distStockNumPop2 = true;
          let weightPop2 = true;
          this.tableArr.map(function(ele, i) {
            if (ele.price == "") {
              $(".price").focus();
              pricePop = false;
            } else if (ele.priceShow == "") {
              $(".priceShow").focus();
              priceShowPop = false;
            } else if (ele.priceSell == "") {
              $(".priceSell").focus();
              priceSellPop = false;
            } else if (ele.priceSupply == "") {
              $(".priceSupply").focus();
              priceSupplyPop = false;
            } else if (ele.priceMin == "") {
              $(".priceMin").focus();
              priceMinPop = false;
            } else if (ele.priceMax == "") {
              $(".priceMax").focus();
              priceMaxPop = false;
            } else if (ele.stockNum == "") {
              $(".stockNum").focus();
              stockNumPop = false;
            } else if (ele.distStockNum == "") {
              $(".distStockNum").focus();
              distStockNumPop = false;
            }
            if (_this.Weight == "0") {
              if (ele.weight == "") {
                $(".weight").focus();
                weightPop = false;
              }
            }
          });
          this.tableArr.map(function(ele, i) {
            // let reg = /^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/;
            let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
            if (!ele.priceShow || !reg.test(ele.priceShow)) {
              priceShowPop2 = false;
            } else if (_this.formItem.distType!=1&&(!ele.priceSell || !reg.test(ele.priceSell))) {
              priceSellPop2 = false;
            } else if (_this.formItem.distType!=2&&(!ele.priceSupply || !reg.test(ele.priceSupply))) {
              priceSupplyPop2 = false;
            } else if (_this.formItem.distType!=2&&(!ele.priceMin || !reg.test(ele.priceMin))) {
              priceMinPop2 = false;
            } else if (_this.formItem.distType!=2&&(!ele.priceMax || !reg.test(ele.priceMax))) {
              priceMaxPop2 = false;
            } else if (!ele.stockNum || !reg.test(ele.stockNum)) {
              stockNumPop2 = false;
            } else if (_this.formItem.distType!=2&&(!ele.distStockNum|| !reg.test(ele.distStockNum))) {
              distStockNumPop2 = false;
            }
            if (_this.Weight == "0") {
              if (!reg.test(ele.weight)) {
                weightPop2 = false;
              }
            }
          });
          if (pricePop == false) {
            _this.$Message.warning("成本价不能为空!");
          } else if (priceShowPop == false) {
            _this.$Message.warning("门市价不能为空!");
          } else if (priceSellPop == false) {
            _this.$Message.warning("零售价不能为空!");
          } else if (priceSupplyPop == false) {
            _this.$Message.warning("供货价不能为空!");
          } else if (priceMinPop == false) {
            _this.$Message.warning("建议零售价不能为空!");
          } else if (priceMaxPop == false) {
            _this.$Message.warning("建议零售价不能为空!");
          } else if (stockNumPop == false) {
            _this.$Message.warning("库存不能为空!");
          } else if (distStockNumPop == false) {
            _this.$Message.warning("分销库存不能为空!");
          } else if (weightPop == false) {
            _this.$Message.warning("重量不能为空!");
          } else if (pricePop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else if (priceShowPop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else if (priceSellPop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else if (priceSupplyPop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else if (priceMinPop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else if (priceMaxPop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else if (stockNumPop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else if (distStockNumPop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else if (weightPop2 == false) {
            _this.$Message.warning("您输入的格式不正确!");
          } else {
            _this.preventPopout = true;
          }

          if (_this.preventPopout == true) {
            let url = "/product/api/mdse/saveMdseDetail";
            this.common.formPost(this, {
              url,
              params: this.formItem,
              mold: "modal",
              callback(res) {
                if (res.status == 200) {
                  _this.$Message.success("新增成功!");
                  // _this.$router.push("/mdseInfo");
                  window.location.href =
                    window.location.href.split("/manage")[0] +
                    "/admin/index#/product/parkPublish/selectProduct";
                }
              }
            });
          } else {
            //滚动到错误地方
            setTimeout(function() {
              $("#content").scrollTop(
                $(".inpbox").offset().top - 90 + $("#content").scrollTop()
              );
            }, 500);
          }
        }
      } else {
        this.$Message.warning("请增加规格属性!");
      }
    }
  }
};
</script>

<style scope lang="scss">
.commodity-attribute {
  width: 100%;
  .step {
    width: 60%;
    margin: 2.5rem auto;
  }
  .attribute {
    width: 63%;
    border: 1px solid #ccc;
    padding: 1rem;

    .attrBox {
      margin: 0.5rem 0.5rem;
      display: inline-block;
      position: relative;
      vertical-align: top;
      .dell-input {
        display: none;
      }
    }
    .attrBox:hover .dell-input {
      display: block;
    }
    .attr-title {
      width: 100%;
      background: rgb(247, 244, 244);
      padding: 0.25rem 0;
      position: relative;
      .dell-icon {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        display: none;
        background-color: rgba(110, 109, 109, 0.473);
        color: #fff;
        text-align: center;
        line-height: 1.25rem;
        cursor: pointer;
        position: absolute;
        top: 25%;
        right: 1rem;
        z-index: 99;
      }
    }
    .attr-title:hover .dell-icon {
      display: block;
    }
    .dell-input {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background-color: rgba(110, 109, 109, 0.473);
      color: #fff;
      text-align: center;
      line-height: 1.25rem;
      cursor: pointer;
      position: absolute;
      top: -0.45rem;
      right: 1.5rem;
      z-index: 99;
    }
    .attrimg {
      height: 58px;
      width: 58px;
      margin-top: 5px;
      img {
        width: 100%;
        height: 100%;
      }

      .demo-upload-list-cover {
        display: none;
        width: 58px;
        height: 58px;
        text-align: center;
        line-height: 58px;
        position: absolute;
        top: 38px;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
      }

      .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
      }
    }
  }
  .attrimg:hover .demo-upload-list-cover {
    display: block;
  }

  .form-title {
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid rgba(100, 182, 255, 1);
    font-size: 16px;
    margin-bottom: 10px;
  }
  .table2 {
    margin-top: 20px;
    border: 1px solid #ccc;
    border-collapse: collapse;
    text-align: center;
    tbody {
      tr {
        td {
          padding: 5px;
        }
      }
    }
  }
  #createTable {
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
            text-align: center;
            .inpbox {
              text-indent: 10px;
              border: none;
              border: 1px solid #ddd;
              border-radius: 5px;
              outline: none;
              width: 100%;
            }
            .inpbox1 {
              width: 40%;
              display: inline-block;
            }
          }
        }
      }
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
          padding: 3px 7px;
          text-decoration: none;
          border-bottom: 1px solid #e2d5d5;
        }
      }
      li:first-child a {
        color: #ffffff;
        background: #0099ff;
      }
    }
  }
}
</style>

