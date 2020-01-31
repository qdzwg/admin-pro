<template>
    <div class="newCoupons">
    <Form :model="formItem" ref="formItem" :rules="ruleForm" :label-width="120" label-position="right">   
        <div class="iconCoupon">
            <div class="couponbgc">
                <div class="coupon-group">
                    <span class="amount-icon">￥</span>
                    <span class="amount">{{formItem.amount==''?'00':formItem.amount}}</span>
                </div>
                <div class="userShopld">
                    <span>订单满 <span>{{formItem.targetAmout==''?'0':formItem.targetAmout}}</span> 元可用</span>
                </div>
                <div class="timeBottom">
                    <span>有效期日期:</span>
                    <span>{{formItem.validStartDate==null?'':formItem.validStartDate.substr(0,10)}} 
                        - {{formItem.validEndDate==null?'':formItem.validEndDate.substr(0,10)}}</span>
                </div>
            </div>
        </div>
        <div class="couponInfo">           
                <div class="coupon-title">基本信息</div>
                <FormItem label="券类型:" prop="couponType" v-if="songCouponType && songCouponType.show">
                    <Select v-model="formItem.couponType" placeholder="请选择产品类型" style="width:100px">
                        <Option v-for="(item, index) in couponType" :value="item.key" :key="index">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="归属景区:" prop="parkId" v-if="songOrderParkId && songOrderParkId.show">
                  <Select v-model="formItem.parkId" placeholder="请选择归属景区" style="width:100px" @on-change="selectNameId">
                    <Option v-for="(item, index) in parkList" :value="item.id+''" :key="index">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="优惠券名称:" prop="name">
                    <Input v-model="formItem.name" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="发放总量:" prop="totalNum">
                    <Input v-model="formItem.totalNum" style="width:23%;"></Input> 张
                </FormItem>
                <FormItem label="面值:" prop="amount" v-if="formItem.couponType!='1'">
                    <Input  v-model="formItem.amount" style="width:13%;"></Input> 元
                </FormItem>
                <FormItem label="使用门槛:" prop="useThreshold">
                    <Select  v-model="formItem.useThreshold" style="width:10%;">
                        <Option value="T">限制</Option>
                        <Option value="F">无限制</Option>
                    </Select>   
                    <FormItem v-if="formItem.useThreshold=='T'" style="display:inline-block; margin-left: 12px;">
                      满    
                      <Input v-model="formItem.targetAmout" style="width:80px;"></Input> 元可用
                    </FormItem>                 
                </FormItem>
                
            <div class="coupon-title">基本规则</div>
            <FormItem label="领取限制:" prop="receiveType">
                    <Select v-model="formItem.receiveType" style="width:10%;">
                        <Option value="T">公开</Option>
                        <Option value="F">不公开</Option>
                    </Select>
            
                </FormItem>
                <FormItem label="领取张数限制:" prop="receiveCondition">
                    <Select v-model="formItem.receiveCondition" style="width:10%;">
                        <Option value="T">限制</Option>
                        <Option value="F">无限制</Option>
                    </Select>
                    <template v-if="formItem.receiveCondition=='T'">
                      每人每天最多领取 <Input v-model="formItem.receiveLimit" style="width:13%;"></Input> 张
                    </template>
                
                </FormItem>
                <!-- <FormItem label="已领的券核销完后是否可再次领取:" prop="receiveAgain" v-if="songReceiveAgain && songReceiveAgain.show">
                    <RadioGroup v-model="formItem.receiveAgain" >
                      <Radio label="F">
                        <span>否</span>
                      </Radio>
                      <Radio label="T">
                        <span>是</span>
                      </Radio>
                    </RadioGroup>
                </FormItem> -->
                <!-- <FormItem label="每笔订单最多可使用:" prop="orderMaxUse" v-if="songOrderMaxUse && songOrderMaxUse.show && formItem.receiveAgain =='T'">
                    <Input v-model="formItem.orderMaxUse" style="width:80px;"></Input> 张
                </FormItem> -->
                <FormItem label="可用范围:" prop="usableRange" v-if="songUsableRange && songUsableRange.show">
                    <CheckboxGroup v-model="formItem.usableRange">
                      <Checkbox :label="item.key" v-for="(item, index) in useRange" :key="index">
                        <span>{{item.value}}</span>
                      </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="发放路径:" prop="distributionPath" v-if="songDistributionPath && songDistributionPath.show">
                    <CheckboxGroup
                      v-model="formItem.distributionPath"                      
                    >
                      <Checkbox :label="item.key" v-for="(item, index) in distributionPath" :key="index">
                        <span>{{item.value}}</span>
                      </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="券发放时间:" >
            <DatePicker type="datetime" :value="formItem.grantStartDate" @on-change="getStartDate" placeholder="请选择券发放时间" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="券结束时间:" >
            <DatePicker type="datetime" :value="formItem.grantEndDate" @on-change="getEndDate" placeholder="请选择券结束时间" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="使用有效期:" prop="validityDateType">
                    <Select v-model="formItem.validityDateType" style="width:23%;">
                        <Option value="fixed">固定时间</Option>
                        <Option value="relative">相对时间</Option>
                    </Select>
                    <template v-if="formItem.validityDateType=='fixed'">
                        <Row style="margin-top:20px;">
                        <Col span="6">
                        <DatePicker type="datetime" :value="formItem.validStartDate" @on-change="getvalidStart" :options="options3" placeholder="开始时间" style="width:85%"></DatePicker>
                        </Col>
                        <Col span="1">-</Col>
                        <Col span="6">
                        <DatePicker type="datetime" :value="formItem.validEndDate" @on-change="getvalidEnd" :options="options4" placeholder="结束时间" style="width:85%"></DatePicker>
                        </Col>
                        </Row>
                    </template>
                    <template v-if="formItem.validityDateType=='relative'">
                        领到 
                        <Input v-model="formItem.relativeDay" style="width:13%;"></Input>
                        天后失效
                    </template>
                </FormItem>
                <FormItem label="可用商户:" required v-if="songMerchantIds && songMerchantIds.show">
                    <Button type="primary" @click="add2">选择</Button>
                </FormItem>
                <FormItem label="可用产品:">
                    <Button type="primary" @click="add">选择</Button>
                </FormItem>
                <FormItem label="使用说明:" >
                    <Input type="textarea" v-model="formItem.useExplain" style="width:50%;"></Input> 
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit">发布</Button>
                    <Button @click="test">取消</Button>
                </FormItem>
        </div>
    </Form>
    <!--可用商户选择-->
    <Modal v-model="modal2" width=800 title="商户选择">
      <div class="pro-main">
        <div class="pro-left">
          <div style="height:30px; line-height:30px; background-color:#f1f1f1; margin-bottom:6px;">
            <span style="text-align: right; vertical-align: middle; font-size: 12px; color: #495060; line-height: 1; padding: 10px 12px 10px 5px; box-sizing: border-box;">添加商户</span>
          </div>
          <Form inline :model="searchForm3" :label-width="80" label-position="right">
            <FormItem label="归属景区：">
              <Input type="text" v-model="searchForm3.parkName" disabled></Input>               
            </FormItem>
            <FormItem label="商户编码：">
                <Input v-model="searchForm3.merchantCode" placeholder="商户编码" ></Input>
            </FormItem>
            <FormItem label="商户名称：">
                <Input v-model="searchForm3.merchantName" placeholder="商户名称" ></Input>
            </FormItem>
            <Button type="primary" @click="getList3('stop4')">查询</Button>
          </Form>
          <Table border ref="couponTable" :columns="columns3" :data="dataList3" @on-selection-change="changeSelection3"></Table>
        </div>
        <div class="pro-center">
            <div style="margin-top: 50px;">
                <Button @click="addPro2">添加</Button>
            </div>
            <div style="margin-top:10px;">
                <Button @click="delPro2">删除</Button>
            </div>             
        </div>
        <div class="pro-right">
          <div style="height:30px; line-height:30px; background-color:#f1f1f1; margin-bottom:6px;">
            <span style="text-align: right; vertical-align: middle; font-size: 12px; color: #495060; line-height: 1; padding: 10px 12px 10px 5px; box-sizing: border-box;">可用商户</span>
          </div>
          <Form inline :model="searchForm4" :label-width="80" label-position="right">
            <FormItem label="归属景区：">
              <Input type="text" v-model="searchForm4.parkName" disabled></Input>               
            </FormItem>
            <FormItem label="商户编码：">
                <Input v-model="searchForm4.merchantCode" placeholder="商户编码" ></Input>
            </FormItem>
            <FormItem label="商户名称：">
                <Input v-model="searchForm4.merchantName" placeholder="商户名称" ></Input>
            </FormItem>
            <Button type="primary" @click="getList4">查询</Button>
          </Form>
          <Table border ref="couponTable2" :columns="columns4" :data="dataList4" @on-selection-change="changeSelection4"></Table>
        </div>
      </div>
      <div slot="footer">
        
      </div>
    </Modal>
    <!--可用产品选择-->
    <Modal v-model="modal" width=1000 title="产品选择">
      <div class="pro-main">
        <div class="pro-left">
          <div style="height:30px; line-height:30px; background-color:#f1f1f1; margin-bottom:6px;">
            <span style="text-align: right; vertical-align: middle; font-size: 12px; color: #495060; line-height: 1; padding: 10px 12px 10px 5px; box-sizing: border-box;">添加产品</span>
          </div>
          <Form inline :model="searchForm" :label-width="80" label-position="right">
            <FormItem label="产品类型：">
                <Select v-model="searchForm.productType" placeholder="产品类型">
                  <Option value="">--请选择--</Option>
                  <Option :value="item.key" v-for="(item, index) in productType" :key="index">{{item.value}}</Option> 
                </Select>
            </FormItem>
            <FormItem label="商户名称：">
              <Select v-model="searchForm.searchMerchantCode" placeholder="商户名称">
                <Option value="">--请选择--</Option>
                <Option :value="item.mchId" v-for="(item, index) in mchList" :key="index">{{item.mchName}}</Option> 
              </Select>
            </FormItem>
            <FormItem label="产品名称：">
                <Input v-model="searchForm.productName" placeholder="产品名称" ></Input>
            </FormItem>
            <Button type="primary" @click="getList('stop2')">查询</Button>
          </Form>
          <Table border ref="couponTable" :columns="columns" :data="dataList" @on-selection-change="changeSelection"></Table>
        </div>
        <div class="pro-center">
            <div style="margin-top: 50px;">
                <Button @click="addPro">添加</Button>
            </div>
            <div style="margin-top:10px;">
                <Button @click="delPro">删除</Button>
            </div>             
        </div>
        <div class="pro-right">
          <div style="height:30px; line-height:30px; background-color:#f1f1f1; margin-bottom:6px;">
            <span style="text-align: right; vertical-align: middle; font-size: 12px; color: #495060; line-height: 1; padding: 10px 12px 10px 5px; box-sizing: border-box;">可用产品</span>
          </div>
          <Form inline :model="searchForm2" :label-width="80" label-position="right">
            <FormItem label="产品类型：">
                <Select v-model="searchForm2.productType" placeholder="产品类型">
                  <Option value="">--请选择--</Option>
                  <Option :value="item.key" v-for="(item, index) in productType" :key="index">{{item.value}}</Option> 
                </Select>
            </FormItem>
            <FormItem label="商户名称：">
              <Select v-model="searchForm2.searchMerchantCode" placeholder="商户名称">
                <Option value="">--请选择--</Option>
                <Option :value="item.mchId" v-for="(item, index) in mchList" :key="index">{{item.mchName}}</Option> 
              </Select>
            </FormItem>
            <FormItem label="产品名称：">
                <Input v-model="searchForm2.productName" placeholder="产品名称" ></Input>
            </FormItem>
            <Button type="primary" @click="getList2">查询</Button>
          </Form>
          <Table border ref="couponTable2" :columns="columns2" :data="dataList2" @on-selection-change="changeSelection2"></Table>
        </div>
      </div>
      <div slot="footer">
        
      </div>
    </Modal>

    <Modal v-model="noticeModal">
      <div style="line-height:30px; padding: 50px 0; color:red">
        请在30分支以内完成操作，否则您所选的可用商户和可用产品会失效！
      </div>
      <div slot="footer">
        <Button type="primary" @click="cancelNoticeModal">确定</Button>
        <Button type="ghost" @click="cancelNoticeModal">关闭</Button>
      </div>
    </Modal>
</div>
</template>
<script>
import { apiPost, apiGet } from "@/fetch/api";
import store from "@/store";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      noticeModal: true,
      // parkName: "",
      couponType: [],
      parkList: [],
      mchList: [],
      useRange: [],
      prefixDate: [],
      distributionPath: [],
      productType: [],
      modal: false,
      modal2: false,
      options3: {},
      options4: {},
      templetCode: "",
      formItem: {
        name: "",   
        parkName: "",     
        totalNum: "",
        amount: "",
        useThreshold: "T",
        targetAmout: "",
        receiveType: "T",
        receiveCondition: "T",
        receiveLimit: "",
        grantStartDate: null,
        grantEndDate: null,
        validityDateType: "fixed",
        validStartDate: null,
        validEndDate: null,
        relativeDay: null,
        useExplain: "",
        couponType: '',
        parkId: '',
        receiveAgain: 'F',
        usableRange: [],
        distributionPath: [],
        code: ''
      },
      ruleForm: {
        name: [
          { required: true, message: "请填写优惠券名称", trigger: "blur" }
        ],
        couponType: [{ required: true, message: "请选择优惠券类型", trigger: "change" }],
        parkId: [{ required: true, message: "请选择归属景区", trigger: "change" }],
        totalNum: [
          { required: true, message: "请填写发放总量", trigger: "blur" }
        ],
        amount: [{ required: true, message: "请填写面值", trigger: "blur" }],
        targetAmout: [
          { required: true, message: "请选择使用门槛", trigger: "blur" }
        ],
        receiveType: [
          { required: true, message: "请选择领取限制", trigger: "change" }
        ],
        receiveCondition: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        validityDateType: [
          { required: true, message: "请选择有效使用时间", trigger: "change" }
        ]
      },
      total: 0,

      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "产品类型",
          key: "productType",
          render: (h, params) => {
            return h('span', this.filter.orderType(params.row.productType))
          }
        },
        {
          title: "商户名称",
          // key: "merchantName"
          render: (h, params) => {
            let merchantName = params.row.merchantName;
            let merchantCode = params.row.merchantCode;
            return h("div", [
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                merchantCode
              ),
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                merchantName
              )
            ]);
          }
        },
        {
          title: "产品名称",
          // key: "productName"
          render: (h, params) => {
            let productName = params.row.productName;
            let productCode = params.row.productCode;
            return h("div", [
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                productCode
              ),
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                productName
              )
            ]);
          }
        }
      ],
      columns2: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "产品类型",
          key: "productType",
          render: (h, params) => {
            return h('span', this.filter.orderType(params.row.productType))
          }
        },
        {
          title: "商户名称",
          // key: "merchantName"
          render: (h, params) => {
            let merchantName = params.row.merchantName;
            let merchantCode = params.row.merchantCode;
            return h("div", [
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                merchantCode
              ),
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                merchantName
              )
            ]);
          }
        },
        {
          title: "产品名称",
          // key: "productName"
          render: (h, params) => {
            let productName = params.row.productName;
            let productCode = params.row.productCode;
            return h("div", [
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                productCode
              ),
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                productName
              )
            ]);
          }
        }
      ],
      columns3: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "归属景区",
          key: "parkName"
        },
        {
          title: "商户编码",
          key: "merchantCode"
        },
        {
          title: "商户名称",
          key: "merchantName"
        }
      ],
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "归属景区",
          key: "parkName"
        },
        {
          title: "商户编码",
          key: "merchantCode"
        },
        {
          title: "商户名称",
          key: "merchantName"
        }
      ],
      dataList: [],
      dataList2: [],
      dataList3: [],
      dataList4: [],
      searchForm: {
        merchantCode: '',
        productType: '',
        productName: '',
        couponCode: '',
        searchMerchantCode: ''
      },
      searchForm2: {        
        merchantCode: '',
        productType: '',
        productName: '',
        couponCode: '',
        searchMerchantCode: ''
      },
      searchForm3: {        
        merchantCode: '',
        merchantName: '',
        couponCode: '',
      },
      searchForm4: {        
        merchantCode: '',
        merchantName: '',
        couponCode: '',
      }
    };
  },
  async created() {
    apiGet("/marketing/marketCouponTemplet/addFL").then(res => {
      this.templetCode = res.data.code;
      this.formItem.code = res.data.code;
    });
    apiGet('/marketing/marketCouponTemplet/getNeumContent').then(res => {
      this.couponType = res.data.couponType;
      this.distributionPath = res.data.distributionPath;
      this.useRange = res.data.useRange;
      this.prefixDate = res.data.prefixDate;
      this.productType = res.data.productType;
    })
    apiGet('/marketing/marketCouponTemplet/findAllCouponOfParks').then(res => {
      if(res.status == 200 || res.success){
        this.parkList = res.data;
      }
    });
    
    let info = await this.getDiffInfo();
    let params = {
      ...this.formItem,
      ...this.diffValue
    };
    this.formItem = params;
    // this.formItem.receiveAgain = this.formItem.receiveAgain ? this.formItem.receiveAgain : 'F'
    this.formItem.receiveAgain = 'F'
    this.formItem.usableRange = this.formItem.usableRange ? this.formItem.usableRange.split(',') : []
    this.formItem.distributionPath = this.formItem.distributionPath ? this.formItem.distributionPath.split(',') : []
    this.formItem.parkId = this.formItem.parkId ? this.formItem.parkId + '' : ''
  },
  methods: {
    ...mapActions("coupons", ["getDiffInfo"]),
    selectNameId(e) {
      console.log(e);
    },
    cancelNoticeModal() {
      this.noticeModal = false;
    },
    addPro() {      
      if(!this.selection || !this.selection.length){
        this.$Message.warning('请选择添加项！')
      }else{
        let operateJsonDate = JSON.stringify(this.selection);
        this.apiPost('/marketing/marketCouponTemplet/operateAvailableProduct',{parkId: this.formItem.parkId,operateJsonDate: operateJsonDate,operateFlag: 'add', couponCode: this.templetCode}).then(res => {
          if(res.status == 200 || res.success){
            this.getList2();
            this.getList();            
          }else{
            this.$Message.warning(res.message)
          }
        })
      }      
    },
    addPro2() {
      let operateJsonDate = JSON.stringify(this.selection3);
      if(!this.selection3 || !this.selection3.length){
        this.$Message.warning('请选择添加项！')
      }else{
        this.apiPost('/marketing/marketCouponTemplet/operateAvailableMerchants',{parkId: this.formItem.parkId,operateJsonDate: operateJsonDate,operateFlag: 'add', couponCode: this.templetCode}).then(res => {
          if(res.status == 200 || res.success){
            this.getList4();
            this.getList3();                   
          }else{
            this.$Message.warning(res.message)
          }
        })        
      }      
    },
    delPro() {
      if(!this.selection2 || !this.selection2.length){
        this.$Message.warning('请选择删除项！')
      }else{
        let operateJsonDate = JSON.stringify(this.selection2);
        this.apiPost('/marketing/marketCouponTemplet/operateAvailableProduct',{parkId: this.formItem.parkId,operateJsonDate: operateJsonDate,operateFlag: 'delete', couponCode: this.templetCode}).then(res => {
          if(res.status == 200 || res.success){
            this.getList();
            this.getList2();            
          }else{
            this.$Message.warning(res.message)
          }
        })
      }      
    },
    delPro2() {      
      if(!this.selection4 || !this.selection4.length){
        this.$Message.warning('请选择删除项！')
      }else{
        let operateJsonDate = JSON.stringify(this.selection4);
        this.apiPost('/marketing/marketCouponTemplet/operateAvailableMerchants',{parkId: this.formItem.parkId,operateJsonDate: operateJsonDate,operateFlag: 'delete', couponCode: this.templetCode}).then(res => {
          if(res.status == 200 || res.success){
            this.getList3();
            this.getList4();            
          }else{
            this.$Message.warning(res.message)
          }
        })
        
      }      
    },
    changeSelection(selection) {
      this.selection = selection
    },
    changeSelection2(selection) {
      this.selection2 = selection
    },
    changeSelection3(selection) {
      this.selection3 = selection
    },
    changeSelection4(selection) {
      this.selection4 = selection
    },
    getStartDate(time) {
      this.formItem.grantStartDate = time;
    },
    getEndDate(time) {
      this.formItem.grantEndDate = time;
    },
    getvalidStart(time) {
      this.formItem.validStartDate = time;
    },
    getvalidEnd(time) {
      this.formItem.validEndDate = time;
    },
    add() {      
      let merchantArr = '';
      if(this.dataList4 && this.dataList4.length){    
        let arr = [];    
        this.dataList4.forEach((item, index) => {
          arr.push(item.merchantCode)
        })
        merchantArr = arr.join(',');
      }      
      apiPost('/marketing/marketCouponTemplet/selectAllMerchantByParkId', {parkId: this.formItem.parkId, couponCode: this.templetCode, merchantCode: merchantArr}).then(res => {
        if(res.status == 200 || res.success){
          this.mchList = res.data;
          this.getList();          
        }else{
          this.$Message.warning(res.message);
          return;
        }
      });
      
    },
    add2() {
      let mId = this.formItem.parkId;
      this.parkList.forEach((item, index) => {
        if(item.id == mId){
          this.formItem.parkName = item.name;
        }
      })
      this.getList3();
    },
    submit() {    
      let postParams = JSON.parse(JSON.stringify(this.formItem));
      console.log(postParams);
      postParams.distributionPath = (postParams.distributionPath).join(',');
      postParams.usableRange = (postParams.usableRange).join(',');
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
            let url = "/marketing/marketCouponTemplet/saveFL";
            this.apiPost(url, postParams).then(res => {
              if(res.status == 200) {
                this.$router.push('/marketCoupon');
              }else{
                this.$Message.warning(res.message)
              }
            });            
        }
      })
    },
    test() {
      this.$router.back();
    },
    getList(ifNext) {
      // console.log(this.dataList4)
      let url = "/marketing/marketCouponTemplet/findAvailableProducts";
      this.searchForm.parkId = this.formItem.parkId;
      this.searchForm.parkName = this.formItem.parkName;
      this.searchForm.couponCode = this.templetCode;
      if(this.dataList4 && this.dataList4.length){
        let arr = [];
        this.dataList4.forEach((item, index) => {
          arr.push(item.merchantCode)
        })
        this.searchForm.merchantCode = arr.join(',');
      }      
      apiPost(url, this.searchForm).then(res => {
        if(res.status == 200 || res.success){
          this.dataList = res.data;
          this.selection = [];
          // if(res.data && !res.data.length){
          //   this.selection = [];            
          // }
          if(ifNext != 'stop2'){
            this.getList2();
          }          
        }else {
          this.$Message.warning(res.message);
          return;
        }            
      });
    },
    getList2() {
      let url = "/marketing/marketCouponTemplet/selectedProductByCondition";
      this.searchForm2.parkId = this.formItem.parkId;
      this.searchForm2.parkName = this.formItem.parkName;
      this.searchForm2.couponCode = this.templetCode;
      if(this.dataList4 && this.dataList4.length){
        let arr = [];
        this.dataList4.forEach((item, index) => {
          arr.push(item.merchantCode)
        })
        this.searchForm2.merchantCode = arr.join(',');
      }
      apiPost(url, this.searchForm2).then(res => {           
        if(res.status == 200 || res.success){
          this.dataList2 = res.data;
          this.selection2 = [];
          // this.selection2 = res.data;
          // if(res.data && !res.data.length){
            
          // }       
          this.modal = true;   
        }else {
          this.$Message.warning(res.message);
          return;
        }    
      });
    },
    getList3(ifNext) {
      let url = "/marketing/marketCouponTemplet/findAvailableMerchants";
      this.searchForm3.parkId = this.formItem.parkId;
      this.searchForm3.parkName = this.formItem.parkName;
      this.searchForm3.couponCode = this.templetCode;
      apiPost(url, this.searchForm3).then(res => {
        if(res.status == 200 || res.success){
          this.dataList3 = res.data;
          this.selection3 = [];
          // if(res.data && !res.data.length){
            
          // }
          if(ifNext != 'stop4') {
            this.getList4();
          }          
        }else{
          this.$Message.warning(res.message);
          return;
        }        
      });
    },
    getList4() {
      let url = "/marketing/marketCouponTemplet/selectedMerchantsByCondition";
      this.searchForm4.parkId = this.formItem.parkId;
      this.searchForm4.parkName = this.formItem.parkName;
      this.searchForm4.couponCode = this.templetCode;
      apiPost(url, this.searchForm4).then(res => {
        if(res.status == 200 || res.success){
          this.dataList4 = res.data;
          // this.selection4 = res.data;
          this.selection4 = [];
          // if((res.data && !res.data.length) || !res.data){
          //   this.selection4 = [];
          // }
          this.modal2 = true;
        }else{
          this.$Message.warning(res.message);
          return;
        }        
      });
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
    }
  },
  computed: {
    ...mapState("coupons", ["diffValue"]),
    ...mapGetters("coupons", [
      "songApplyType",
      "songCouponType",
      "songDistributionPath",
      "songMerchantIds",
      "songOrderMaxUse",
      "songOrderParkId",
      "songPrefixDateLimit",
      "songProductCodes",
      "songReceiveAgain",
      "songUsableRange"
    ])
  }

};
</script>

<style lang="scss">
.newCoupons {
  width: 100%;
  .iconCoupon {
    width: 30%;
    float: left;
    .couponbgc {
      width: 290px;
      height: 220px;
      text-align: center;
      margin: 0 auto;
      background: url(../../../assets/images/coupon-bg.jpg) no-repeat center;
      .coupon-group {
        display: inline-block;
        margin-top: 35px;
        color: #fff;
        .amount-icon {
          font-size: 33px;
        }
        .amount {
          font-size: 90px;
          line-height: 90px;
        }
      }
      .userShopld {
        height: 25px;
        font-size: 14px;
        color: #fff;
        margin-top: 10px;
      }
      .timeBottom {
        background: #fff;
        font-size: 12px;
        color: #fc6262;
        width: 85%;
        padding: 3px 0;
        margin: 10px auto;
        border-radius: 15px;
      }
    }
  }
  .couponInfo {
    width: 68%;
    padding: 20px;
    float: left;
    border: 1px solid #ccc;
    .coupon-title {
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      padding-bottom: 10px;
    }
  }  
}
.pro-main {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    justify-content:center;
    flex-direction:row;
    .pro-left{
        flex: 7;
    }
    .pro-center{
        flex: 2;
        text-align: center;
    }
    .pro-right{
        flex: 7;
    }
  }
</style>


