<template>
    <div class="mdseInfoAttr">
        <Spin size="large" fix v-if="spinShow">
            <Icon type="load-c" size=30 class="demo-spin-icon-load"></Icon>
            <div>加载中...</div>
        </Spin>
        <Form :model="skuForm" label-position="right" :label-width="120" ref="skuForm" :rules="ruleForm">
            <div id="base" class="form-title">基本信息</div>
            <FormItem label="商品名称：">
                {{skuForm.name}}
            </FormItem>

            <FormItem label="配送方式：" prop="shipType">
                <checkbox size="small" v-model="isGetBySelf" @on-change="getBySelf" label="">仅支持自提</checkbox>
                <RadioGroup v-model="skuForm.shipType" @on-change="shipTypeChange">
                    <Radio :disabled="isGetBySelf" label="0">包邮</Radio>
                    <Radio :disabled="isGetBySelf" label="1">统一快递费</Radio>
                    <Radio :disabled="isGetBySelf" label="2">快递模板</Radio>
                </RadioGroup>
                <checkbox size="small" :disabled="isGetBySelf" :value="skuForm.isExpress=='T'" @on-change="change"></checkbox>指定地点取货
            </FormItem>
            <FormItem label="统一快递费" v-if="skuForm.shipType=='1'" required>
                <Input v-model="skuForm.expressFee" style="width:15%"></Input>
            </FormItem>
            <FormItem label="快递模板" v-if="skuForm.shipType=='2'" required>

                <Select @on-change="changeId" v-model="skuForm.postageId" style="width:200px">
                    <Option :value="item.value" v-for="(item,index) in postage" :key="index">
                        {{item.label}}
                    </Option>
                </Select>
                <a target='_blank' :href='preUrl+"/manage/?mold=/postage#/"'>
                    创建快递模板
                </a>
                <a @click="getPostage" style="margin-left:20px;">刷新</a>
            </FormItem>
            <FormItem label="指定地点取货" prop="mdsePlaceIds" v-if="skuForm.isExpress=='T'" style="margin-top:10px;" :rules="[{required:true,message:'请选择指定地点取货'}]">
                <Select v-model="skuForm.mdsePlaceIds" style="width:200px" multiple>
                    <Option :value="ele.id" v-for="(ele,i) in mdsePlace" :key="i">{{ele.name}}</Option>
                </Select>
                <a target="_blank" :href="preUrl+'/admin/index#/product/mdsePlace/list'">创建取货地点</a>
                <a @click="getmdsePlace" style="margin-left:20px;">刷新</a>
                <!-- <p style="margin:10px 0 0 50px;"> 截止时间下单后 <InputNumber v-model="skuForm.expressDay"></InputNumber>天后未取货、将自动取消订单、退款</p> -->
            </FormItem>

            <!-- <FormItem label="销售渠道：" >
                <span v-if="skuForm.distType=='0'">分销市场+店铺</span>
                <span v-if="skuForm.distType=='1'">仅分销市场</span>
                <span v-if="skuForm.distType=='2'">店铺</span>    
          </FormItem> -->
            <FormItem label="商品规格：" required>
                <div class="attribute">
                    <div v-for="(item,index) in dataList" :key="index">
                        <div class="attr-title">
                            <FormItem label="规格名">
                                <span v-if="item.id">{{item.attrName}}</span>
                                <Input v-else @on-change='setDiff(index)' @on-blur="changeOutAttr(index)" style="width:20%" v-model="item.attrName" :maxlength="5"></Input>
                                <Checkbox v-model="single" v-if="index=='0'" style="display:none">添加规格图片</Checkbox>
                            </FormItem>
                            <div class="dell-icon" @click="del(index)">x</div>
                        </div>
                        <div>
                            <FormItem label="规格值" style="padding:1rem 0;">
                                <div style="margin-left:120px;">
                                    <div v-for="(xitem,xindex) in item.attrParam" :key="xindex" class="attrBox">

                                        <Input :autofocus="autoFoucusIndex==(index+''+xindex)" :ref='"input" + index + xindex' @on-blur="changeOut2(index,xindex)" v-model="xitem.name" placeholder="请输入" style="width:80%;" :maxlength="15"></Input>
                                        <div class="dell-input" @click="dellInput(index,xindex)">x</div>
                                        <div v-if="single==true&&xitem.attrPic">

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
                                    <a @click="addInput(index)" :disabled="dataList[index].attrParam.length>='5'">添加规格值</a>
                                    <p v-if="single==true&&index=='0'">仅支持第一组规格项目设置图片，最多上传5张，建议上传小于1M， 宽800px，高800px的JPG/PNG格式的图片</p>
                                </div>
                            </FormItem>
                        </div>
                    </div>
                    <div class="attr-title " style="padding-left:2.5rem">
                        <Button @click="addAttr" :disabled="dataList.length>=3">添加规格项目</Button>
                    </div>

                </div>

            </FormItem>
            <FormItem label="规格明细">
                <!-- <div id="createTable"> 
             </div> -->

                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th width=100 v-for="(item,index) in titles" :key="index">{{item}}</th>
                                <th>成本价</th>
                                <th>门市价</th>
                                <th v-if="skuForm.distType!='1'">零售价</th>
                                <th v-if="skuForm.distType!='2'">供货价</th>
                                <th v-if="skuForm.distType!='2'">建议零售价</th>
                                <th>库存</th>
                                <th v-if="skuForm.distType!='2'">分销库存</th>
                                <!-- <th>销量</th> -->
                                <th v-if="Weight=='0'">重量(kg)</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(et,i) in skuForm.tables" :key="i">
                                <td v-for="(itemtd,j) in et.specs">
                                    <span>{{itemtd.value}}</span>
                                </td>
                                <td>
                                    <FormItem :prop="'tables.'+i+'.price'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                        <Input number v-model="et.price" style="width:80%" :maxlength="99999"></Input>
                                    </FormItem>
                                </td>
                                <td>
                                    <FormItem :prop="'tables.'+i+'.priceShow'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                        <Input number v-model="et.priceShow" style="width:80%" :maxlength="99999"></Input>
                                    </FormItem>
                                </td>
                                <td v-if="skuForm.distType!='1'">
                                    <FormItem :prop="'tables.'+i+'.priceSell'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                        <Input number v-model="et.priceSell" style="width:80%" :maxlength="99999"></Input>
                                    </FormItem>
                                </td>
                                <td v-if="skuForm.distType!='2'">
                                    <FormItem :prop="'tables.'+i+'.priceSupply'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                        <Input number v-model="et.priceSupply" style="width:80%" :maxlength="99999"></Input>
                                    </FormItem>
                                </td>
                                <td v-if="skuForm.distType!='2'">
                                    <div style="display:inline-block; ">

                                        <FormItem :label-width="1" style="width:48%;display:inline-block; " :prop="'tables.'+i+'.priceMin'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                            <Input number placeholder="最低价" v-model="et.priceMin" :maxlength="99999"></Input>
                                        </FormItem>

                                        <FormItem :label-width="1" style=" width:48%;display:inline-block;" :prop="'tables.'+i+'.priceMax'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                            <Input number placeholder="最高价" v-model="et.priceMax" :maxlength="99999"></Input>
                                        </FormItem>
                                    </div>
                                </td>
                                <td>
                                    <FormItem :prop="'tables.'+i+'.stockNum'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                        <Input @on-change="getStock" number v-model="et.stockNum" style="width:80%" :maxlength="99999"></Input>
                                    </FormItem>
                                </td>

                                <td v-if="skuForm.distType!='2'">
                                    <FormItem :prop="'tables.'+i+'.distStockNum'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                        <Input number @on-blur="contrast(i)" v-model="et.distStockNum" style="width:80%" :maxlength="99999"></Input>
                                    </FormItem>
                                </td>
                                <!-- <td>
                    <Input v-model="salesNum" disabled style="width:80%"></Input>
                </td> -->
                                <td v-if="Weight=='0'">
                                    <FormItem :prop="'tables.'+i+'.weight'" :rules="[{required: true, message: '该项不能为空', trigger: 'blur',type:'number'},{pattern:/^((([1-9][0-9]*))|(([0]\.([0-9][1-9])|([0]\.[1-9])|[1-9][0-9]*\.(([0-9][1-9])|([1-9])))))$/,message:'数据格式不正确'}]">
                                        <Input number v-model="et.weight" style="width:80%" :maxlength="99999"></Input>
                                    </FormItem>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>

                <FormItem label="批量设置值" style="border:1px solid #ccc;padding:.5rem;margin-top:-.75rem;">
                    <RadioGroup v-model="button1" type="button">
                        <Radio label="price">成本价</Radio>
                        <Radio label="priceShow">门市价</Radio>
                        <Radio v-if="skuForm.distType!='1'" label="priceSell">零售价</Radio>
                        <Radio v-if="skuForm.distType!='2'" label="priceSupply">供货价</Radio>
                        <Radio v-if="skuForm.distType!='2'" label=".txt5">建议零售价</Radio>
                        <Radio label="stockNum">库存</Radio>
                        <Radio v-if="skuForm.distType!='2'" label="distStockNum">分销库存</Radio>
                        <Radio v-if="Weight=='0'" label="weight">重量</Radio>
                    </RadioGroup>
                    <div style="margin:.8rem 0 0 6.2rem;">
                        <Input v-if="button1!='.txt5'" style="width:15%" v-model="priceAll" :placeholder="'请输入'+this.filter.priceType2(button1)"></Input>
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
                    <DatePicker :editable="false" :value="ruleBuys.orderBegDay" @on-change="setBegDate" type="date" :options="options3" format="yyyy-MM-dd"></DatePicker>
                    <span>至</span>
                    <DatePicker :editable="false" :value="ruleBuys.orderEndDay" @on-change="setEndDate" type="date" :options="options4" format="yyyy-MM-dd"></DatePicker>
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
               <Select  v-model="skuForm.buyFarthestType" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select>
              <template v-if="skuForm.buyFarthestType=='T'">
                    
                每个用户
                <Select  v-model="skuForm.orderdaya" style="width:120px">
                    <Option value="1">整个销售时间段</Option>
                    <Option value="2">每日</Option>
                    <Option value="3">每周</Option>
                    <Option value="4">每月</Option>
                    <Option value="5">每三月</Option>
               </Select>
                限购
                <InputNumber></InputNumber>
                <Select  v-model="skuForm.orderdays" style="width:120px">                    
                    <Option value="1">个</Option>
                    <Option value="2">笔订单</Option>
                </Select>
            </template>
          </FormItem> -->
            <!-- <FormItem label="下单地域限制：">
             <Select  v-model="skuForm.orderdays" style="width:200px">
                <Option value="F">无限制</Option>
                <Option value="T">有限制</Option>
              </Select>
          </FormItem> -->
            <!-- <FormItem label="指定地点取货" v-if="skuForm.isExpress[0]=='T'" style="margin-top:10px">
                   <Select  v-model="skuForm.mdsePlaceId" style="width:200px">
                    <Option :value="ele.value" v-for="(ele,i) in mdsePlace" :key="i">{{ele.label}}</Option>
               </Select>
                <a window.location.href="">创建取货地点</a>       <a @clcik="getmdsePlace" style="margin-left:20px;">刷新</a>
            </FormItem>
            
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
            <FormItem label="发货日期：" prop="checkRelativeDay">
                <Input v-model="skuForm.checkRelativeDay" style="width:10%" :maxlength="2"></Input>
                <span> 天后自动核销</span>
                <p style="color:#5a98de">备注：订单发货后，有退单的交易，只能手动核销</p>
            </FormItem>

            <FormItem style="padding-bottom:5rem">
                <Button :loading="loading" type="primary" @click="submit('skuForm')" style="width:8rem;" :disabled="disabled">保存</Button>
                <Button type="ghost" @click="test" style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
        <div class="fixed-box">
            <ul>
                <li>
                    <a>快捷导航</a>
                </li>
                <li>
                    <a href="#base" class="tartg-a" @click="hashClick('base')">基本信息</a>
                </li>
                <li>
                    <a href="#senicInfo" class="tartg-a" @click="hashClick('rule')">预订规则</a>
                </li>
                <li>

                    <a href="#distSet" class="tartg-a" @click="hashClick('backRule')">退改规则</a>
                </li>
                <li>
                    <Button size="small" :loading="loading" @click="submit('skuForm')" type="primary" :disabled="disabled">保存</Button>
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
      autoFoucusIndex: null,
      tableList: [],
      tableArr: [], //表格数据(拼接)
      attrList: [], //属性值数据
      array1: [], //价格是数据
      single: false, //是否添加规格图片
      singleImgList: [], //图片
      priceAll: "", //批量填充价格数据
      button1: "", //选择到要批量填充什么价
      priceBgain: "", //起始建议零售价
      priceOut: "", //结束建议零售价
      trIndex: "",
      disabled: false,
      loading: false,
      options4: {},
      options3: {},
      spinShow: true, //加载效果
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
      dataList: [], //规格数据
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      orderType: "F",
      orderdayType: "F",
      ordernum: "F",
      ruleSolds: {
        isRetreat: "F",
        isRetreatAudit: "T",
        isOverDueCheck: "T",
        checkRelativeDay: 15
      },
      ruleBuys: {
        orderBegDay: "",
        orderEndDay: "",
        dayBegTime: "",
        dayEndTime: "",
        minOrder: "",
        maxOrder: ""
      },
      skuForm: {
        mdseInfoId: "",
        shipType: "0", //是否包邮
        ruleSold: "", //是否退单
        ruleBuy: "", //预订规则
        mdseSpec: "",
        mdseSpecDetail: "",
        linkMobileImg: "",
        name: "",
        distType: "0",
        isExpress: "",
        expressFee: "",
        postageId: "",
        mdsePlaceId: "",
        weight: "",
        expressDay: null,
        checkRelativeDay: 15,
        mdsePlaceIds: [],
        tables: []
      },
      mdsePlaceId: [],
      showDel: false,
      Weight: "1", //是否按重量生成表格
      postage: [],
      mdsePlace: [],
      stocks: 0, //总库存
      salesNum: 0, //销量
      ruleForm: {
        // modelName: [
        //   { required: true, message: "请填写商品名称", trigger: "blur" }
        // ],
        // sellType: [
        //   { required: true, message: "请选择分销渠道", trigger: "change" }
        // ],
        checkRelativeDay: [{ required: true, message: "请填写发货日期" }],
        // shipType: [
        //   { required: true, message: "请选择配送方式", trigger: "change" }
        // ]
      },
      titles: [],
      attrs: [],
      priceTrue: false,
      ShowTrue: true,
      isGetBySelf:false, // 仅支持自提
      preUrl: window.location.href.split("/manage")[0]
    };
  },
  watch: {
    // "skuForm.distType": "creatTable",
    // Weight: "changeOut2"
  },
  created() {
    
    this.getPostage(); //获取邮费模板
    this.getmdsePlace(); //获取指定地点取货
    this.getList();
  },
  methods: {
    setDiff(index) {
      // alert(this.dataList[index].attrName)
      this.dataList.forEach((item, i) => {
        if (index != i && item.attrName == this.dataList[index].attrName) {
          this.$Message.warning(
            "规格名称" + item.attrName + "有重复，请修改规格名称"
          );
        }
      });
    },
    //分销库存对比
    contrast(i) {
      if (this.skuForm.tables && this.skuForm.tables[i].stockNum) {
        if (
          this.skuForm.tables[i].distStockNum >= this.skuForm.tables[i].stockNum
        ) {
          this.$Message.warning("分销库存不能大于库存!");
        }
      }
    },
    changeOutAttr(index) {
      this.creatTableAll();
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    change(val) {
      if (val == true) {
        this.skuForm.isExpress = "T";
      } else {
        this.skuForm.isExpress = "F";
      }
    },
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
    setEndDate(time) {
      this.ruleBuys.orderEndDay = time;
      this.options3 = {
        disabledDate: date => {
          let endTime = this.ruleBuys.orderEndDay
            ? new Date(this.ruleBuys.orderEndDay).valueOf()
            : "";
          return date && date.valueOf() > endTime;
        }
      };
    },
    changeId(val) {
      this.postage.forEach((el, i) => {
        if (el.value == val) {
          this.Weight = el.type;
        }
      });
    },
    shipTypeChange(val) {
      if (val != 2) {
        this.Weight = "1";
      } else {
        if (this.postage) {
          this.postage.map(ele => {
            if (this.skuForm.postageId == ele.value) {
              this.Weight = ele.type;
            }
          });
        }
      }
    },
    getBySelf(val){
      if (val) {
        this.skuForm.isExpress = "T";
        this.skuForm.shipType = "";
      } else {
        this.skuForm.shipType = '0';
      }
    },
    getList() {
      if (this.$route.query && this.$route.query.id) {
        apiGet(
          "/product/api/mdse/getByMdseInfoId?mdseInfoId=" + this.$route.query.id
        )
          .then(res => {
            if (res.status == 200) {
              this.spinShow = false;
              this.skuForm = res.data.mdseInfo;
              if(!res.data.mdseInfo.shipType && res.data.mdseInfo.shipType !== '0') {
                this.isGetBySelf = true;
              }
              this.skuForm.mdsePlaceIds = res.data.mdsePlaceIds;
              this.skuForm.mdseInfoId = this.$route.query.id;
              this.skuForm.checkRelativeDay =
                res.data.ruleSold.checkRelativeDay;

              this.dataList = res.data.mdseSpecAttrList;
              this.tableList = res.data.mdseDetailList;
              this.ruleBuys = res.data.ruleBuy;
              this.ruleSolds = res.data.ruleSold;
              if (this.skuForm.shipType == "2") {                
                if (this.postage) {
                  this.postage.map(ele => {                      
                    if (this.skuForm.postageId == ele.value) {            
                      this.Weight = ele.type;
                    }
                  });
                }
              }
              let mdslist = res.data.mdseDetailList;
              mdslist.forEach((item, i) => {
                item.specs = [];
                if (item.specValue1) {
                  item.specs.push({
                    key: "specValue1",
                    value: item.specValue1
                  });
                }
                if (item.specValue2) {
                  item.specs.push({
                    key: "specValue2",
                    value: item.specValue2
                  });
                }
                if (item.specValue3) {
                  item.specs.push({
                    key: "specValue3",
                    value: item.specValue3
                  });
                }
                // if((item.stockNum||item.stockNum==0)&&(item.leftStockNum||item.leftStockNum==0)){
                //     this.salesNum=item.stockNum-item.leftStockNum
                // }
              });

              let titleData = res.data.mdseSpecAttrList;
              titleData.forEach((item, index) => {
                this.titles.push(item.attrName);
                if (item.attrParam[0].attrPic) {
                  this.single = true;
                }
              });
              this.skuForm.tables = res.data.mdseDetailList;
              // this.creatTableAll();
              //   this.getTableNum();
              this.getStock();
            }
          })
          .catch(() => {
            this.$Message.error("初始化数据出错！");
          });
      }
    },
    //获取邮费模板
    getPostage() {
      apiGet("/product/api/mdsePostage/getAllPostageInfo").then(res => {
        this.postage = [];
        res.data.map(item => {
          this.postage.push({
            value: item.id,
            label: item.name,
            type: item.costType
          });
        });
      });
    },
    //获取指定地点取货
    getmdsePlace() {
      apiGet("/product/api/mdse/placeList").then(res => {
        this.mdsePlace = res.data;
      });
    },
    //删除一组规格
    del(index) {
      this.dataList.splice(index, 1);
      //   this.creatTable();
      this.creatTableAll();
    },
    //删除单个属性值
    dellInput(i, e) {
      let _this = this;
      this.dataList[i].attrParam.splice(e, 1);
      if (this.dataList[i].attrParam.length == 0) {
        _this.del(i);
      } else {
        this.creatTableAll();
      }
      //   this.creatTable();
    },
    handleRemove(i) {
      this.dataList[0].attrParam[i].attrPic.splice(0, 1);
    },
    test() {
      //  this.$Message.warning(res.message);
      //   this.$router.back(-1)
      window.location.href =
        window.location.href.split("/manage")[0] +
        "/admin/index#/product/mdseInfo/list";
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    //添加规格属性
    addAttr() {
      this.tableList = []; //每添加一次规格，直接清空原来数据
      if (this.dataList.length == "0") {
        this.dataList.push({
          attrName: "",
          attrParam: [
            {
              name: "",
              attrPic: []
            }
          ]
        });
      } else {
        this.dataList.push({
          attrName: "",
          attrParam: [
            {
              name: ""
            }
          ]
        });
      }
      this.ShowTrue = false;
    },
    //添加属性值
    addInput(i) {
      if (i == 0) {
        this.dataList[i].attrParam.push({
          name: "",
          attrPic: []
        });
      } else {
        this.dataList[i].attrParam.push({
          name: ""
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
        this.dataList[0].attrParam[this.trIndex].attrPic.push(
          res.prefix + res.url
        );

        this.$Message.success("照片上传");
      } else {
        this.$Message.warning(res.message);
      }
    },
    //删除input按钮隐藏
    changeOut2(i, e) {
      if (this.dataList[i].attrParam[e].name)
        //   this.creatTable();
        this.dataList[i].attrParam.forEach((item, index) => {
          if (index != e && this.dataList[i].attrParam[e].name == item.name) {
            this.autoFoucusIndex = i + "" + e;
            this.$Message.warning("规格值" + item.name + "重复！");
            //   this.$refs['input' + i + e].focus()
            return false;
          }
        });
      this.creatTableAll();
    },
    creatTableAll() {
      //   this.skuForm.tables = [];
      var arrayTitle = []; //表格标题
      var arrayInfor = []; //每组属性值
      var arrayColumn = []; //指定列 用来合并那些列
      var columnIndex = 0;
      this.dataList.map((item, index) => {
        arrayColumn.push(columnIndex++);
        arrayTitle.push(item.attrName.replace(/(^\s*)|(\s*$)/g, ""));
        var arr = [];
        this.dataList[index].attrParam.map((ele, i) => {
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
        //如果没有值，保存按钮置灰
        if (item) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        arrs.push(obj);
      });
      let lastArr = [];

      arrs.forEach((ele, index) => {
        let tableListIndex = null;
        let tableDatas = this.skuForm.tables;
        tableDatas.forEach((item, i) => {
          switch (item.specs.length) {
            case 1:
              if (ele.specValue1 == item.specs[0].value) {
                tableListIndex = i;
                return;
              }
              break;
            case 2:
              if (
                ele.specValue1 == item.specs[0].value &&
                ele.specValue2 == item.specs[1].value
              ) {
                tableListIndex = i;
                return;
              }
              break;
            case 3:
              if (
                ele.specValue1 == item.specs[0].value &&
                ele.specValue2 == item.specs[1].value &&
                ele.specValue3 == item.specs[2].value
              ) {
                tableListIndex = i;
                return;
              }
              break;
          }
        });
        let lastArrObj = {};
        lastArrObj.specs = [];
        for (let key in ele) {
          lastArrObj.specs.push({ key: key, value: ele[key] });
        }
        if (tableListIndex || tableListIndex == 0) {
          lastArrObj.price = tableDatas[tableListIndex].price
            ? tableDatas[tableListIndex].price
            : null;
          lastArrObj.priceShow = tableDatas[tableListIndex].priceShow
            ? tableDatas[tableListIndex].priceShow
            : null;
          lastArrObj.priceSell = tableDatas[tableListIndex].priceSell
            ? tableDatas[tableListIndex].priceSell
            : null;
          lastArrObj.priceSupply = tableDatas[tableListIndex].priceSupply
            ? tableDatas[tableListIndex].priceSupply
            : null;
          lastArrObj.priceMin = tableDatas[tableListIndex].priceMin
            ? tableDatas[tableListIndex].priceMin
            : null;
          lastArrObj.priceMax = tableDatas[tableListIndex].priceMax
            ? tableDatas[tableListIndex].priceMax
            : null;
          lastArrObj.stockNum = tableDatas[tableListIndex].stockNum
            ? tableDatas[tableListIndex].stockNum
            : null;
          lastArrObj.distStockNum = tableDatas[tableListIndex].distStockNum
            ? tableDatas[tableListIndex].distStockNum
            : null;
          lastArrObj.weight = tableDatas[tableListIndex].weight
            ? tableDatas[tableListIndex].weight
            : null;
          lastArrObj.modelCode = tableDatas[tableListIndex].modelCode
            ? tableDatas[tableListIndex].modelCode
            : "";
        } else {
          lastArrObj.price = "";
          lastArrObj.priceShow = "";
          lastArrObj.priceSell = "";
          lastArrObj.priceSupply = "";
          lastArrObj.priceMin = "";
          lastArrObj.priceMax = "";
          lastArrObj.stockNum = "";
          lastArrObj.distStockNum = "";
          lastArrObj.weight = null;
          lastArrObj.modelCode = "";
        }
        lastArr.push(lastArrObj);
      });
      this.skuForm.tables = lastArr;
      this.getStock();
    },
    //生成表格
    creatTable() {
      let _this = this;
      this.hebingFunction();
      var arrayTitle = []; //表格标题
      var arrayInfor = []; //每组属性值
      var arrayColumn = []; //指定列 用来合并那些列
      var columnIndex = 0;
      this.dataList.map((item, index) => {
        arrayColumn.push(columnIndex++);
        arrayTitle.push(item.attrName);
        var arr = [];
        this.dataList[index].attrParam.map((ele, i) => {
          arr.push(ele.name);
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
      arrayTitle.map((ele, i) => {
        str += '<th width="120">' + ele + "</th>";
      });
      str += "<th >成本价</th>";
      str += '<th class="menshi">门市价</th>';
      str += "<th >零售价</th>";
      str += '<th class="sell">供货价</th>';
      str += '<th class="sell" width="200">建议零售价</th>';
      str += "<th >库存(个)</th>";
      str += '<th class="sell">分销库存(个)</th>';
      str += '<th class="weight">重量(g)</th>';
      trhead.append(str);
      var tbody = $("<tbody></tbody>");
      tbody.appendTo(table);
      var zuheData = this.doExchange(arrayInfor);
      let arrs = [];
      zuheData.map((item, index) => {
        let obj = {};
        let data = item.split(",");
        let nameSize = data.length;
        data.map((ele, i) => {
          obj.specValue1 = data[nameSize - 3];
          obj.specValue2 = data[nameSize - 2];
          obj.specValue3 = data[nameSize - 1];
        });
        arrs.push(obj);
      });
      this.attrList = arrs;

      if (zuheData.length > 0) {
        //创建行
        zuheData.map((ele, i) => {
          var td_array = ele.split(",");
          var tr = $("<tr></tr>");
          tr.appendTo(tbody);
          var str = "";
          td_array.map((val, index) => {
            str += "<td>" + val + "</td>";
          });
          str +=
            '<td> <input type="number" class="txt1 inpbox inpbox-mini" value="' +
            this.tableList[i].price +
            '"> </td>';
          str +=
            '<td class="menshi"> <input type="number" class="txt2 inpbox inpbox-mini" value="' +
            this.tableList[i].priceShow +
            '"> </td>';
          str +=
            '<td> <input type="number" class="txt3 inpbox inpbox-mini" value="' +
            this.tableList[i].priceSell +
            '"> </td>';
          str +=
            '<td class="sell"> <input type="number" class="txt4 inpbox inpbox-mini" value="' +
            this.tableList[i].priceSupply +
            '"> </td>';
          str +=
            '<td class="sell"> <input type="number" class="txtbegin txt5 inpbox inpbox1 inpbox-mini"value="' +
            this.tableList[i].priceMin +
            '" > <input type="number"  class="txtout txt6 inpbox inpbox1 inpbox-mini" value="' +
            this.tableList[i].priceMax +
            '"> </td>';
          str +=
            '<td> <input type="number" name="scoknum" class="txt7 inpbox inpbox-mini" value="' +
            this.tableList[i].stockNum +
            '"> </td>';

          str +=
            '<td class="sell"> <input type="number" class="txt8 inpbox inpbox-mini" value="' +
            this.tableList[i].distStockNum +
            '"> </td>';
          str +=
            '<td class="weight"> <input type="number" class="txt9 inpbox inpbox-mini" value="' +
            this.tableList[i].weight +
            '"> </td>';

          tr.append(str);
        });
        //仅店铺
        if (this.skuForm.sellType == 2) {
          $(".sell").remove();
        }
        //仅分销
        if (this.skuForm.sellType == 1) {
          $(".menshi").remove();
        }
        if (this.Weight == "1") {
          $(".weight").remove();
        }
        let _this = this;
        $("input[name=scoknum]").change(function() {
          //   alert('sdbjs')
          //   _this.getTableNum();
        });
      }

      arrayColumn.pop(); //删除数组中最后一项
      //合并表格
      $(table).mergeCell({
        cols: arrayColumn //目前只有cols这么一个配置项，用数组表示列的索引，从0开始
      });
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
        //  this.skuForm.array1=arr[0]
        //  this.count=this.skuForm.array1.length
        return arr[0];
      }
    },
    getTableNum() {
      let gooArr = [];
      for (let i = 0; i < $(".txt1").length; i++) {
        this.array1[i] +=
          "," +
          $(".txt1")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".txt2")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".txt3")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".txt4")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".txt5")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".txt6")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".txt7")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".txt8")
            .eq(i)
            .val();
        this.array1[i] +=
          "," +
          $(".txt9")
            .eq(i)
            .val();
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

      this.attrList.forEach((ele, index) => {
        lastArr.push({ ...ele, ...gooArr[index] });
      });
      this.tableArr = lastArr;
      //   this.getStock();

      //   let temp={}
      //     this.tableArr.map((item,index)=>{
      //     this.tableList.map((ele,i)=>{

      //     })

      // })

      // this.tableArr.push(temp)
    },
    getStock() {
      let size = this.skuForm.tables.length;
      this.stocks = 0;
      for (let i = 0; i < size; i++) {
        this.stocks += this.skuForm.tables[i].stockNum - 0;
      }
    },
    addPrice(text) {
      if (text == ".txt5") {
        this.skuForm.tables.map((item, index) => {
          item["priceMin"] = +this.priceBgain;
          item["priceMax"] = +this.priceOut;
        });
        this.priceBgain = "";
        this.priceOut = "";
      } else {
        this.skuForm.tables.map((item, index) => {
          item[text] = +this.priceAll;
        });
        this.priceAll = "";
      }

      if (text == "stockNum") {
        this.getStock();
      }
    },
    dellPrice() {
      this.priceAll = "";
      this.priceBgain = "";
      this.priceOut = "";
    },
    submit(name) {
      //   this.getTableNum();
      this.dataList.map((item, index) => {
        item.attrName.replace(/(^\s*)|(\s*$)/g, "");
        item.attrParam.forEach((ele, i) => {
          ele.name.replace(/(^\s*)|(\s*$)/g, "");
        });
      });
      this.ruleSolds.checkRelativeDay = this.skuForm.checkRelativeDay;
      this.skuForm.mdseSpec = JSON.stringify(this.dataList);
      this.skuForm.mdseSpecDetail = JSON.stringify(this.skuForm.tables);
      this.skuForm.ruleSold = JSON.stringify(this.ruleSolds);
      this.skuForm.ruleBuy = JSON.stringify(this.ruleBuys);
      let _this = this;
      this.skuForm.mdsePlaceId = this.skuForm.mdsePlaceIds.join(",");

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      this.$refs[name].validate(async valid => {
        if (valid) {
          if (this.dataList.length) {
            let url = "/product/api/mdse/saveMdseDetail";
            let res = await apiPost(url, this.skuForm);
            if (res.status == 200) {
              _this.$Message.success("修改成功!");
              window.location.href =
                window.location.href.split("/manage")[0] +
                "/admin/index#/product/mdseInfo/list";
            } else if (res.status == 402) {
              _this.$Message.warning(res.message);
            }
          } else {
            this.$Message.warning("请增加规格属性!");
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
    }
  }
};
</script>

<style scope lang="scss">
.mdseInfoAttr {
  width: 100%;
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
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
  //   #createTable {
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
  //   }

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

