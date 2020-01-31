<template>
    <div class="editCoupons">
    <Form :model="formItem" ref="formItem" :rules="ruleForm" :label-width="120" label-position="right">   
        <div class="iconCoupon">
            <div class="couponbgc">
              <div v-if="formItem.validityDateType=='fixed'">
                  <div class="coupon-group">
                    <span class="amount-icon">￥</span>
                    <span class="amount">{{formItem.amount==''?'00':formItem.amount}}</span>
                  </div>
                  <div class="userShopld">
                      <span>订单满 <span>{{formItem.targetAmout==''?'0':formItem.targetAmout}}</span> 元可用</span>
                  </div>
                  <div class="timeBottom" v-if="formItem.validityDateType=='fixed'">
                      <span>有效期日期:</span>
                      <span>{{formItem.validStartDate==null?'':formItem.validStartDate}} 
                          ~ {{formItem.validEndDate==null?'':formItem.validEndDate}}</span>
                  </div>
                  <div class="timeBottom" v-if="formItem.validityDateType=='relative'">
                    <span>领到 {{formItem.relativeDay}} 天后失效</span>
                  </div>
              </div>   
              <div v-if="formItem.validityDateType=='relative'" style="position:absolute; bottom: 25px; left:50%; width:100%; margin-left: -50%;">
                <div class="timeBottom">
                    <span>领到 {{formItem.relativeDay}} 天后失效</span>
                  </div>
              </div>             
            </div>
        </div>
        <div class="couponInfo">           
                <div class="coupon-title">基本信息</div>
                <FormItem label="券类型:" v-if="songCouponType && songCouponType.show">
                  {{formItem.couponTypeName}}
                </FormItem>
                <FormItem label="归属景区:" v-if="songOrderParkId && songOrderParkId.show">
                  {{formItem.parkName}}
                </FormItem>
                <FormItem label="优惠券名称:" prop="name">
                    <Input v-model="formItem.name" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="发放总量:" prop="totalNum">
                    <Input number v-model="formItem.totalNum" style="width:23%;"></Input> 张
                </FormItem>
                <FormItem label="面值:" v-if="formItem.couponType!='1'"> 
                    <span>{{formItem.amount}}</span>元
                </FormItem>
                <FormItem label="使用门槛:">
                    <span v-if="formItem.useThreshold=='T'">满 {{formItem.targetAmout}} 元可用</span>
                    <span v-else>不限制</span>
                </FormItem>
            <div class="coupon-title">基本规则</div>
                <FormItem label="领取限制:">
                    <span>{{formItem.receiveType=='T'?'公开':'不公开'}}</span>
                </FormItem>
                <FormItem label="领取张数限制:"> 
                    <span v-if="formItem.receiveCondition=='T'">每人每天最多领取 {{formItem.receiveLimit}} 张</span>
                    <span v-else>无限制</span>
                </FormItem>
                <!-- <FormItem label="已领的券核销完后是否可再次领取:" v-if="songReceiveAgain && songReceiveAgain.show">
                    <span v-if="formItem.receiveAgain == 'T'">是</span>
                    <span v-if="formItem.receiveAgain == 'F'">否</span>
                </FormItem> -->
                <!-- <FormItem label="每笔订单最多可使用:" v-if="songOrderMaxUse && songOrderMaxUse.show && formItem.receiveAgain =='T'">
                    {{formItem.orderMaxUse}} 张
                </FormItem> -->
                <FormItem label="可用范围:" v-if="songUsableRange && songUsableRange.show">
                    <CheckboxGroup v-model="formItem.usableRange">
                      <Checkbox disabled :label="item.key" v-for="(item, index) in useRange" :key="index">
                        <span>{{item.value}}</span>
                      </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="发放路径:" v-if="songDistributionPath && songDistributionPath.show">
                    <CheckboxGroup
                      v-model="formItem.distributionPath"                      
                    >
                      <Checkbox disabled :label="item.key" v-for="(item, index) in distributionPath" :key="index">
                        <span>{{item.value}}</span>
                      </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="券发放时间:" >
                   <span> {{formItem.grantStartDate}}</span>           
                </FormItem>
                <FormItem label="券结束时间:" >
                   <span> {{formItem.grantEndDate}}</span>   
                </FormItem>
                <FormItem label="使用有效期:">
                    <template v-if="formItem.validityDateType=='fixed'">
                        <span>{{formItem.validStartDate}}至{{formItem.validEndDate}}</span>
                    </template>
                    <template v-if="formItem.validityDateType=='relative'">                                                
                        <span> 领到 {{formItem.relativeDay}} 天后失效</span>                        
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

    <!--提醒弹框-->
    <Modal v-model="noticeModal">
      <div style="line-height:30px; padding: 50px 0; color:red">
        请在30分支以内完成操作，否则您所选的可用商户和可用产品会失效！
      </div>
      <div slot="footer">
        <Button type="primary" @click="cancelNoticeModal">确定</Button>
        <Button type="ghost" @click="cancelNoticeModal">关闭</Button>
      </div>
    </Modal>

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
            <Button type="primary" @click="getList4('stop3')">查询</Button>
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
            <Button type="primary" @click="getList2('stop1')">查询</Button>
          </Form>
          <Table border ref="couponTable2" :columns="columns2" :data="dataList2" @on-selection-change="changeSelection2"></Table>
        </div>
      </div>
      <div slot="footer">
        
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
      options3: {},
      options4: {},
      parkList: [],
      mchList: [],
      productType: [],
      modal: false,
      modal2: false,
      templetCode: "",
      formItem: {
        name: "",
        totalNum: null,
        amount: "",
        useThreshold: "T",
        targetAmout: "",
        receiveType: "T",
        receiveCondition: "T",
        receiveLimit: "",
        grantStartDate: null,
        grantEndDate: null,
        validityDateType: "fixed",
        relativeDay: null,
        useExplain: "",
        usableRange: [],
        distributionPath: [],
        receiveAgain: 'F'
      },
      ruleForm: {
        name: [
          { required: true, message: "请填写优惠券名称", trigger: "blur" }
        ],
        totalNum: [
          {
            required: true,
            type: "number",
            message: "请填写发放总量",
            trigger: "blur"
          }
        ]
      },
      distributionPath: [],
      useRange: [],
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
    // apiGet("/marketing/marketCouponTemplet/addFL").then(res => {
    //   this.templetCode = res.data.code;
    // });
    apiGet('/marketing/marketCouponTemplet/findAllCouponOfParks').then(res => {
      if(res.status == 200 || res.success){
        this.parkList = res.data;
      }
    });
    if (this.$route.query.id) {
      apiGet('/marketing/marketCouponTemplet/getNeumContent').then(res => {
        if(res.status == 200 || res.success){
          this.distributionPath = res.data.distributionPath;
          this.useRange = res.data.useRange;
          this.productType = res.data.productType;
          apiGet(
            "/marketing/marketCouponTemplet/editFL?id=" + this.$route.query.id
          ).then(res => {
            if (res.success) {
              this.formItem = res.data.marketCouponTemplet;
              this.templetCode = res.data.marketCouponTemplet.code;
              
              this.formItem.usableRange = res.data.marketCouponTemplet.usableRange ? res.data.marketCouponTemplet.usableRange.split(',') : [];
              this.formItem.distributionPath = res.data.marketCouponTemplet.distributionPath ? res.data.marketCouponTemplet.distributionPath.split(',') : [];
            }
          })
        }           
      })
    }
    let info = await this.getDiffInfo();
    let params = {      
      ...this.diffValue,
      ...this.formItem
    };
    this.formItem = params;    
    console.log('this.formItem', this.formItem)
  },
  methods: {
    ...mapActions("coupons", ["getDiffInfo"]),
    cancelNoticeModal() {
      this.noticeModal = false;
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
          // this.getList();  
          this.getList2();        
        }else{
          this.$Message.warning(res.message);
          return;
        }
      });
    },
    add2() {
      this.getList4();
    },
     addPro() {      
      if(!this.selection || !this.selection.length){
        this.$Message.warning('请选择添加项！')
      }else{
        let operateJsonDate = JSON.stringify(this.selection);
        this.apiPost('/marketing/marketCouponTemplet/operateAvailableProduct',{parkId: this.formItem.parkId,operateJsonDate: operateJsonDate,operateFlag: 'add', couponCode: this.templetCode,templateId: this.$route.query.id}).then(res => {
          if(res.status == 200 || res.success){
            this.getList2();
            this.getList();            
          }else {
            this.$Message.warning(res.message);
          }
        })
      }      
    },
    addPro2() {
      let operateJsonDate = JSON.stringify(this.selection3);
      if(!this.selection3 || !this.selection3.length){
        this.$Message.warning('请选择添加项！')
      }else{
        this.apiPost('/marketing/marketCouponTemplet/operateAvailableMerchants',{parkId: this.formItem.parkId,operateJsonDate: operateJsonDate,operateFlag: 'add', couponCode: this.templetCode,templateId: this.$route.query.id}).then(res => {
          if(res.status == 200 || res.success){
            this.getList4();
            this.getList3();                   
          }else {
            this.$Message.warning(res.message);
          }
        })        
      }      
    },
    delPro() {
      if(!this.selection2 || !this.selection2.length){
        this.$Message.warning('请选择删除项！')
      }else{
        let operateJsonDate = JSON.stringify(this.selection2);
        this.apiPost('/marketing/marketCouponTemplet/operateAvailableProduct',{parkId: this.formItem.parkId,operateJsonDate: operateJsonDate,operateFlag: 'delete', couponCode: this.templetCode, templateId: this.$route.query.id}).then(res => {
          if(res.status == 200 || res.success){
            // this.getList();
            this.getList2();            
          }else {
            this.$Message.warning(res.message);
          }
        })
      }      
    },
    delPro2() {      
      if(!this.selection4 || !this.selection4.length){
        this.$Message.warning('请选择删除项！')
      }else{
        let operateJsonDate = JSON.stringify(this.selection4);
        this.apiPost('/marketing/marketCouponTemplet/operateAvailableMerchants',{parkId: this.formItem.parkId,operateJsonDate: operateJsonDate,operateFlag: 'delete', couponCode: this.templetCode, templateId: this.$route.query.id}).then(res => {
          if(res.status == 200 || res.success){
            this.getList3();
            this.getList4();            
          }else {
            this.$Message.warning(res.message);
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
     getList(ifNext) {
      let url = "/marketing/marketCouponTemplet/findAvailableProducts";
      this.searchForm.parkId = this.formItem.parkId;
      this.searchForm.templateId = this.$route.query.id;
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
          this.modal = true;
        }else {
          this.$Message.warning(res.message);
          return;
        }            
      });
    },
    getList2(ifNext) {
      let url = "/marketing/marketCouponTemplet/selectedProductByCondition";
      this.searchForm2.parkId = this.formItem.parkId;
      this.searchForm2.templateId = this.$route.query.id;
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
          if(ifNext != 'stop1'){
            this.getList();
          }             
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
      this.searchForm3.templateId = this.$route.query.id;
      this.searchForm3.couponCode = this.templetCode;
      apiPost(url, this.searchForm3).then(res => {
        if(res.status == 200 || res.success){
          this.dataList3 = res.data;
          this.selection3 = [];      
          this.modal2 = true; 
        }else{
          this.$Message.warning(res.message);
          return;
        }        
      });
    },
    getList4(ifNext) {
      let url = "/marketing/marketCouponTemplet/selectedMerchantsByCondition";
      this.searchForm4.parkId = this.formItem.parkId;
      this.searchForm4.parkName = this.formItem.parkName;
      this.searchForm4.templateId = this.$route.query.id;
      this.searchForm4.couponCode = this.templetCode;
      apiPost(url, this.searchForm4).then(res => {
        if(res.status == 200 || res.success){
          this.dataList4 = res.data;
          this.selection4 = [];    
          if(ifNext != 'stop3') {
            this.getList3();
          }          
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
.editCoupons {
  width: 100%;
  .iconCoupon {
    width: 30%;
    float: left;
    .couponbgc {
      width: 290px;
      height: 220px;
      text-align: center;
      margin: 0 auto;
      position: relative;
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
        padding: 1px 0;
        margin: 4px auto;
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


