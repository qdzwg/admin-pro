<template>
  <div class="repastList">
    <Form inline>
      <FormItem>
        <Input placeholder="兑换券名称" v-model="couponName"></Input>
      </FormItem>
      <Button type="primary" icon="ios-search" @click="getList">搜索</Button>
      <Button type="primary" @click="refresh" style="float:right">刷新</Button>
    </Form>
    <div class="caterBox" v-for="(item,index) in data" :key="index">
      <div class="cater-list">
        <div class="cater-icon" @click="collpane(item.code,1)">
          <Icon v-if="openIndex==item.code" type="ios-arrow-down"></Icon>
          <Icon v-else type="ios-arrow-right"></Icon>
        </div>
        <div class="cater-img">
          <img :src="item.merchantLogo" alt="">
        </div>
        <div class="cater-title">
          <div>
            <h2 style="display: inline">{{item.simpleName}}</h2>
            <span class="coupon-tips tips-blue">直连</span>
            <span class="coupon-tips tips-orange">店铺</span>
          </div>
          <p>行业分类：{{item.industryName || '--'}}</p>
          <p>地址：{{item.areaName || ''}}{{item.address || ''}}</p>
          <p>创建时间：{{item.createTime || '--'}}</p>
        </div>
        <div class="cater-operation">
          <a @click="preview(item.code)">预览</a>
        </div>
      </div>
      <div style="clear:both"></div>
      <div v-if="openIndex==item.code" style="width:100%;">
        <Table :columns="columns" :data="tableData" no-data-text="暂无餐券信息">

        </Table>
      </div>
      <!-- <div v-if="tableData.length<couponTotal && couponTotal > 20" style="text-align:center;padding:3px 0;cursor:pointer;" @click="collpane(item.code, ++currentNum)">更多</div> -->
    </div>
    <div v-if="data.length==0">暂无数据</div>
    <div class="save-cancel">
      <Page :total="total" :current="current" :page-size="pageSize" class-name="pages" @on-change="changepage" @on-page-size-change='pageSizeChange' show-elevator show-sizer></Page>
    </div>

    <!-- 预览 modal -->
    <Modal width="550" v-model="preLookModal" title="预览">
      <div>
        <span>领取短链接：{{copyUrl}}</span>
        <Button v-clipboard:copy="copyUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
        <Button v-clipboard:copy="copyLongUrl" v-clipboard:success="onCopy2" v-clipboard:error="onError2">复制长链接</Button>
        <p>
          <span>领取二维码: <a :href="codeUrl" download>下载二维码</a> </span>
        </p>
        <p style="background:yellow;padding:5px 0;margin-top:5px;">
          扫一扫查看，推荐使用支付宝、微信、手机浏览器 全员推广请使用长链接
        </p>
        <center id="target" style="margin-top:20px;">
          <qrcode :value="qrcodeUrl" :options="{ size: 170}">
          </qrcode>
        </center>
      </div>
      <div slot="footer"></div>
    </Modal>

    <!-- 渠道价格 modal -->
    <Modal v-model="priceModal" class-name="ivu-confirm-modal">
      <p slot="header" style="color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>渠道&价格</span>
      </p>
      <div>
        <Form :model="modalForm" ref="modalForm1" :rules="modalFormRules">
          <FormItem style="display:inline-block;">
            <Checkbox v-model="modalForm.checkShop" true-value="T" false-value="F" @on-change='changeCheckShop'>LOTS 商城</Checkbox>
          </FormItem>
          <FormItem label="售价：" prop="salesPrice" style="display:inline-block;width:150px;">
            <Input :maxlength="9" placeholder="0.00" @on-blur="formatPrice('shopPrice')" v-model="modalForm.shopPrice" style="width:80px">
              <span slot="prefix" style="line-height: 32px;">￥</span>
            </Input>
          </FormItem>
        </Form>
        <Form :model="modalForm" ref="modalForm2" :rules="modalFormRules">
          <FormItem style="display:inline-block;">
            <Checkbox v-model="modalForm.checkSales" true-value="T" false-value="F" @on-change='changeCheckSales'>分销市场</Checkbox>
          </FormItem>
          <Poptip trigger="hover" width="220" word-wrap placement="top-start">
            <div slot="content">
              <p>售价：在同业分销渠道的实际售价</p>
              <p>分销价：对B端用户的实际售价</p>
            </div>
            <Icon type="ios-help" style="color: rgb(144, 147, 153);font-size:16px;line-height: 32px;margin-right:10px;"></Icon>
          </Poptip>
          <FormItem label="售价：" prop="salesPrice" style="display:inline-block;width:150px;">
            <Input :maxlength="9" placeholder="0.00" @on-blur="formatPrice('salesPrice')" v-model="modalForm.salesPrice" style="width:80px">
              <span slot="prefix" style="line-height: 32px;">￥</span>
            </Input>
          </FormItem>
          <FormItem label="分销价：" prop="salesPrice" style="display:inline-block;width:150px;">
            <Input :maxlength="9" placeholder="0.00" @on-blur="formatPrice('retailPrice')" v-model="modalForm.retailPrice" style="width:80px">
              <span slot="prefix" style="line-height: 32px;">￥</span>
            </Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="error" @click="ok">确认</Button>
        <Button type="ghost" @click="cancel">取消</Button>
      </div>
    </Modal>

    <!-- rms信息设置 -->
    <Modal v-model="configModal" :closable="false" :mask-closable="false" class-name="ivu-confirm-modal">
      <p slot="header" style="color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>RMS对接配置</span>
      </p>
      <Form :model="configForm" :label-width="100" ref="configForm" :rules="configFormRules">
        <FormItem label="appId: " prop="appid">
          <Input v-model="configForm.appid" style="width:300px"></Input>
        </FormItem>
        <FormItem label="appSecret: " prop="appSecret">
          <Input v-model="configForm.appSecret" style="width:300px"></Input>
        </FormItem>
        <FormItem label="code: " prop="code">
          <Input v-model="configForm.code" style="width:300px"></Input>
        </FormItem>
        <FormItem label="corpSecret: " prop="corpSecret">
          <Input v-model="configForm.corpSecret" style="width:300px"></Input>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="okConfig">确认</Button>
        <Button type="ghost" @click="cancelConfig">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import QRcode from '@xkeshi/vue-qrcode'
export default {
  components: {
    qrcode: QRcode
  },
  data () {
    const validateNum = (rule, value, callback) => {
      if (value > 99999) {
        callback(new Error('最大值99999'))
      } else {
        callback()
      }
    }
    const validateNum2 = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error('最大值999999'))
      } else {
        callback()
      }
    }
    return {
      codeUrl: '', // 二维码图片
      qrcodeUrl: '', // 生成二维码地址
      copyUrl: '', // 短链接
      copyLongUrl: '', // 长链接
      preLookModal: false, // 显示预览
      openIndex: null, // 控制哪个餐馆下面的餐券显示
      priceModal: false, // 渠道价格modal
      total: 0,
      current: 1,
      pageSize: 10,  
      currentNum: 1,  // 券列表的分页
      couponTotal: 0,
      priceId: '', // 保存餐馆id
      couponName: '',
      modalForm: {
        accountId: '1898', // 餐馆id
        conversionCode: '', // 兑换券编码
        checkShop: false,
        shopPrice: '', // lots商城售价
        checkSales: false,
        salesPrice: '', // 分销市场售价
        retailPrice: '' // 分销市场分销价
      },
      modalFormRules: {
        salesPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          {
            pattern: /^(([1-9]{1}\d{0,5})|(0{1}))(\.\d{0,2})?$/,
            message: '数据格式不正确'
          }
        ],
        shopPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          {
            pattern: /^(([1-9]{1}\d{0,5})|(0{1}))(\.\d{0,2})?$/,
            message: '数据格式不正确'
          }
        ],
        retailPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          {
            pattern: /^(([1-9]{1}\d{0,5})|(0{1}))(\.\d{0,2})?$/,
            message: '数据格式不正确'
          }
        ]
      },
      configModal: false,
      configForm: {
        modalName:'configForm',
        userName:localStorage.getItem('phone'),
        appid: '',
        appSecret: '',
        code: '',
        corpSecret: ''
      },
      configFormRules: {
        appid: [{required: true, message: "请输入appId", trigger: "blur" }],
        appSecret: [{required: true, message: "请输入appSecret", trigger: "blur" }],
        code: [{required: true, message: "请输入code", trigger: "blur" }],
        corpSecret: [{required: true, message: "请输入corpSecret", trigger: "blur"}]
      },
      ruleForm: {
        appid: [{required: true, message: "请输入appId", trigger: "blur" }],
        appSecret: [{required: true, message: "请输入appSecret", trigger: "blur" }],
        code: [{required: true, message: "请输入code", trigger: "blur" }],
        corpSecret: [{required: true, message: "请输入corpSecret", trigger: "blur" }]
      },
      data: [],
      tableData: [],
      columns: [
        {
          title: ' ',
          width: 80,
          render: (h, params) => {
            return <div style="padding: 5px 0">
              <p class="coupon-tips tips-blue">直连</p>
              {params.row.enabled === 'T' ? <p class="coupon-tips">上架</p> : <p class="coupon-tips tips-gray">下架</p>}
            </div>
          }
        },
        {
          title: '券名称',
          render: (h, params) => {
            let fontColor = params.row.enabled == 'T' ? '#303133' : '#C0C4CC'
            return h('div', {
              style: {
                color: `${fontColor}`
              }
            }, [h('p', params.row.conversionName), h('p', params.row.conversionCode)])
          }
        },
        {
          title: '状态/有效期',
          align: 'center',
          render: (h, params) => {
            let dateArr = params.row.validTima ? params.row.validTima.split(',') : ['', '']
            let fontColor = params.row.enabled == 'T' ? '#303133' : '#C0C4CC'
            return h('div', {
              style: {
                color: `${fontColor}`
              }
            }, [
              h('p', params.row.isFlag ? '未过期' : '已过期'),
              h('p', params.row.validType == 0 ? params.row.validTime.split(',')[0]+' - '+params.row.validTime.split(',')[1] : `领取后${params.row.validTime.split(',')[0]}天${params.row.validTime.split(',')[1]}小时生效，有效期${params.row.validTime.split(',')[2]}天`)
            ])
          }
        },
        {
          title: '投放数量(张)',
          align: 'center',
          render: (h, params) => {
            let fontColor = params.row.enabled == 'T' ? '#303133' : '#C0C4CC'
            return h('div', {
              style: {
                color: `${fontColor}`
              }
            }, params.row.launchType === 'UNLIMIT' ? '无限制' : params.row.totalNum)
          }
        },
        {
          title: '售价(￥)',
          align: 'center',
          width: 180,
          render: (h, params) => {
            let fontColor = params.row.enabled == 'T' ? '#303133' : '#C0C4CC'
            let element = []
            params.row.checkShop === 'T' && element.push(h('p', 'LOTS 商城：￥' + (params.row.shopPrice || '--')))
            params.row.checkSales === 'T' && element.push(h('p', '分销市场：￥' + (params.row.salesPrice || '--')))
            element.length === 0 && element.push(h('p', '--'))
            return h('div', {
              style: {
                color: `${fontColor}`
              }
            }, element)
          }
        },
        {
          title: '投放时间',
          align: 'center',
          render: (h, params) => {
            let fontColor = params.row.enabled == 'T' ? '#303133' : '#C0C4CC'
            return h('span', {
              style: {
                color: `${fontColor}`
              }
            }, params.row.createTime ? params.row.createTime : "--")
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            let elememt = []
            if (params.row.isFlag) {
              elememt = [
                h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.priceModal = true
                        this.priceId = params.row.corpCode
                        this.modalForm = {
                          accountId: '1898', // 餐馆id
                          conversionCode: params.row.conversionCode, // 兑换券编码
                          checkShop: params.row.checkShop || 'F',
                          shopPrice: String(params.row.shopPrice || ''), // lots商城售价
                          checkSales: params.row.checkSales || 'F',
                          salesPrice: String(params.row.salesPrice || ''), // 分销市场售价
                          retailPrice: String(params.row.retailPrice || '') // 分销市场分销价
                        }
                      }
                    }
                  },
                  '渠道价格'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.previewCoupon(params.row.conversionCode, params.row.corpCode)
                      }
                    }
                  },
                  '预览'
                )
              ]
            }
            return h('div', elememt)
          }
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 刷新
    refresh () {
      console.log('刷新')
      this.getList()
    },
    formatPrice (prop) {
      if (this.modalForm[prop] && !isNaN(this.modalForm[prop])) {
        this.modalForm[prop] = Number(this.modalForm[prop]).toFixed(2)
      }
    },
    // 预览   生成二维码
    preview (code) {
      let _this = this
      this.apiGet('/rmsrepast/repastGoods/preview?code=' + code).then(
        res => {
          if (res.status == 200) {
            this.preLookModal = true
            this.qrcodeUrl = res.data.qrCodeLongUrl
            this.copyUrl = res.data.qrCodeUrl
            this.copyLongUrl = res.data.qrCodeLongUrl
            // 把生成的二维码转换成图片
            this.$nextTick(function () {
              let canvasData = $('#target').children('canvas')
              _this.codeUrl = canvasData[0].toDataURL()
            })
          } else {
            this.$Message.warning(res.message)
          }
        }
      ).catch(err=>{
        console.log('/rmsrepast/repastGoods/preview 接口错误!')
      });
    },
    // 预览   生成二维码
    previewCoupon (id, code) {
      let _this = this
      this.apiGet('/rmsrepast/repastGoods/previewConversion?conversionCode=' + id+'&code='+code).then(
        res => {
          if (res.status == 200) {
            this.preLookModal = true
            this.qrcodeUrl = res.data.qrCodeLongUrl
            this.copyUrl = res.data.qrCodeUrl
            this.copyLongUrl = res.data.qrCodeLongUrl
            // 把生成的二维码转换成图片
            this.$nextTick(function () {
              let canvasData = $('#target').children('canvas')
              _this.codeUrl = canvasData[0].toDataURL()
            })
          } else {
            this.$Message.warning(res.message)
          }
        }
      )
    },
    // 渠道价 confirm
    ok () {
      let validArr = []
      if (this.modalForm.checkShop === 'T') {
        let lost = this.$refs.modalForm1.validate()
        validArr.push(lost)
      }
      if (this.modalForm.checkSales === 'T') {
        let market = this.$refs.modalForm2.validate()
        validArr.push(market)
      }
      Promise.all(validArr).then(data => {
        for (let index = 0; index < data.length; index++) {
          if (!data[index]) {
            return
          }
        }
        this.apiPost(`/rmsrepast/repastGoods/repastEdit`, this.modalForm).then(res => {
          if (res.status == 200) {
            this.$Message.success('设置成功')
            this.priceModal = false
            this.getList()
          } else {
            this.$Message.warning(res.message)
          }
        })
      })
    },
    // 渠道价 cancel
    cancel () {
      this.$refs.modalForm1.resetFields()
      this.$refs.modalForm2.resetFields()
      this.priceModal = false
    },
    changeCheckShop (value) {
      this.modalForm.checkShop = value
    },
    changeCheckSales (value) {
      this.modalForm.checkSales = value
    },
    // 预览 copyUrl success
    onCopy () {
      this.$Message.success('复制成功！')
    },
    // 预览 copyUrl fail
    onError () {
      this.$Message.error('复制失败！')
    },
    // 预览 copyUrl success
    onCopy2 () {
      this.$Message.success('复制成功！')
    },
    // 预览 copyUrl fail
    onError2 () {
      this.$Message.error('复制失败！')
    },
    // 列表数据展开/合并
    collpane (id, num) {
      this.openIndex = id
      this.apiGet(`/rmsrepast/repastGoods/repastGrid?name=${this.couponName}&page=${num}&limit=${this.pageSize}`).then(res => {
        if (res.status == 200) {
          // this.couponTotal = res.data.total
          this.total=res.data.total;
          if (num == 1) {
            this.tableData = res.data.rows
          } else {
            this.tableData = this.tableData.concat(res.data.rows)
          }
        }
      })
    },
    pageTurn (id, num) {
      this.openIndex = id
      this.apiGet(`/rmsrepast/repastGoods/repastGrid?name=${this.couponName}&page=${num}&limit=${this.pageSize}`).then(res => {
        if (res.status == 200) {
          // this.couponTotal = res.data.total
          this.total=res.data.total;
          this.tableData = res.data.rows
        }
      })
    },
    getList () {
      this.apiGet('/rmsrepast/repastGoods/merchant').then(res => {
        if(res.httpCode==600){
          this.data=[];
          this.tableData=[];
          this.configModal=true;
        }else{
          // 目前一个账号只对应一家门店，如果后期云餐饮的集团账号对接小鲸，才会有多个门店列表
          // this.total = 1
          this.data = [res.data]
          this.collpane(this.data[0].code, 1)
        };
      })
    },
    changepage (num) {
      this.current = num
      this.pageTurn(this.data[0].code, this.current);
    },
    pageSizeChange (num) {
      this.pageSize = num
      this.getList()
    },
    // 若进来没有配置参数，去往参数配置
    cancelConfig () {
      this.$refs.configForm.resetFields()
      this.configModal = false
    },
    okConfig () {
      let _this=this;
      this.common.formPost(this, {
        url: '/rmsrepast/repast/bindRmsAccountInfo',
        params: this.configForm,
        modalName: 'configForm',
        callback (res) {
          if (res.status == 200) {
            _this.$Message.success(res.message)
            _this.configModal = false
            _this.getList()
          } else {
            _this.$Message.warning(res.message)
          }
        }
      })
    },
    showConfig () {
      this.configModal = true
    }
  }
}
</script>

<style lang='scss' >
.repastList {
  width: 100%;
  .caterBox {
    width: 100%;
    margin-bottom: 10px;
    .cater-list {
      width: 100%;
      height: 120px;
      margin: 0 auto;
      background-color: rgb(238, 238, 238);
      box-sizing: border-box;
      padding: 10px;
      .cater-icon {
        height: 100px;
        line-height: 100px;
        cursor: pointer;
        font-size: 25px;
        float: left;
      }
      .cater-img {
        width: 100px;
        height: 100px;
        margin: 0 50px 0 30px;
        float: left;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .cater-title {
        height: 100px;
        float: left;
      }
      .cater-operation {
        height: 100px;
        line-height: 100px;
        float: right;
        a {
          margin-right: 10px;
        }
      }
    }
  }
  .save-cancel {
    padding-bottom: 50px;
  }
  .coupon-tips {
    color: #f05b47;
    border: 1px solid #f05b47;
    border-radius: 2px;
    display: inline-block;
    padding: 0 5px;
    margin: 2px;
  }
  .tips-blue {
    border: 1px solid #00b7ee;
    color: #00b7ee;
  }
  .tips-gray {
    border: 1px solid #999;
    color: #999;
  }
  .tips-orange {
    border: 1px solid #f85924;
    color: #f85924;
  }
}
</style>
