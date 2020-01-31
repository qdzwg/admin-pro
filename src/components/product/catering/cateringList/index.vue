<template>
  <div class="catering">
    <Form :model="searchForm" inline>
      <FormItem>
        <Input placeholder="餐馆名称" v-model="searchForm.eateryName"></Input>
      </FormItem>
      <FormItem>
        <Input placeholder="餐券名称" v-model="searchForm.couponName"></Input>
      </FormItem>
      <FormItem>
        <Input placeholder="餐馆名称或餐券名称" v-model="searchForm.searchName"></Input>
      </FormItem>
      <FormItem>
        <Select v-model="searchForm.enabled" style="width:180px" placeholder="请选择">
          <Option value="">——请选择状态——</Option>
          <Option value="T">已开馆</Option>
          <Option value="F">已闭馆</Option>
        </Select>
      </FormItem>
      <Button type="primary" icon="ios-search" @click="getList">搜索</Button>
      <Button type="primary" icon="android-add" @click="add" style="margin-left:20px;">新增</Button>
    </Form>
    <div class="caterBox" v-for="(item,index) in data" :key="index">

      <div class="cater-list">
        <div class="cater-icon"
             @click="collpane(item.id,1)">
          <Icon v-if="openIndex==item.id"
                type="ios-arrow-down"></Icon>
          <Icon v-else
                type="ios-arrow-right"></Icon>
        </div>

        <div class="cater-img">
          <img :src="item.linkImg" alt="">
        </div>

        <div class="cater-title">
          <h2>{{item.name}}</h2>
          <!-- <p>来源：商城自建-自核销（自供自核销，不放置分销市场）</p> -->
          <p>餐馆编码：{{item.code}}</p>
          <p>人均起价：{{item.priceShow}}元/人</p>
          <!-- <p>销售渠道：{{filter.sellType(item.sellType)}}</p> -->          
          <p>排序：<Input style="width:50px;"
                   size="small"
                   :maxlength="6"
                   @on-keyup="sort(index)"
                   v-model="item.sortNo"
                   @on-blur="addSortNo(item.id,item.sortNo)"
                   @on-change="alterSortNo"></Input></p>
        </div>

        <div class="cater-operation">
          <a v-if="item.enabled=='F'"
             @click="eayerOpen(item.id,'T')">开馆</a>
          <a v-else
             @click="eayerOpen(item.id,'F')">闭馆</a>
          <a @click="perInfo(item.id)">完善信息</a>
          <a @click="addCoupon(item.id)">新增餐券</a>
          <a @click="preview(item.id)">预览</a>
          <!-- <a @click="market(item.id,'edit')">全员营销</a> -->
        </div>

      </div>
      <div style="clear:both"></div>
      <div v-if="openIndex==item.id"
           style="width:100%;">
        <Table :columns="columns"
               :data="tableData"
               no-data-text="暂无餐券信息"></Table>
      </div>
      <div v-if="tableData.length>=20"
           style="text-align:center;padding:3px 0;cursor:pointer;"
           @click="collpane(item.id,currentNum++)">更多</div>
    </div>
    <div v-if="data.length==0">暂无数据</div>
    <div class="save-cancel">
      <Page :total="total"
            :current="current"
            :page-size="pageSize"
            class-name="pages"
            @on-change="changepage"
            @on-page-size-change='pageSizeChange'
            show-elevator
            show-sizer></Page>
    </div>
    <!-- 删除    -->
    <Modal v-model="delModal"
           class-name="ivu-confirm-modal">
      <p slot="header"
         style="color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>信息确认</span>
      </p>
      <p>删除后将影响已有订单退票、核销，请谨慎操作!</p>
      <div slot="footer"
           style="text-align:center">
        <Button type="error"
                @click="delCoupon">确认</Button>
        <Button type="ghost"
                @click="cancelCoupon">取消</Button>
      </div>
    </Modal>
    <!-- 预览 -->
    <qrcode-modal :url='previewUrl'
                  v-model="qrcodeShow"></qrcode-modal>
    <!-- 全员营销 -->
    <Modal width="600"
           v-model="marketModal"
           title="绑定全员推广地址"
           ok-text="提交">
      <Form :model="marketForm"
            label-position="right"
            ref="marketForm"
            :rules="ruleMarketForm"
            :label-width="130">
        <FormItem label="已配置地址:">
          <p v-if="marketTableShow">
            <span style="word-break:break-all; width:100%">
              {{marketName}} ({{marketCode}})</span>
            <a style="margin-left:20px;"
               @click="delMarket">取消绑定</a>
          </p>
          <span v-else>暂无</span>
        </FormItem>
        <FormItem label="全员推广地址名称:"
                  required>
          <Input style="width:62%"
                 v-model="marketForm.name"
                 readonly></Input>
          <Button type="primary"
                  @click="marketTable">选择推广地址</Button>
        </FormItem>
        <FormItem label="帮助信息:">
          <div style="width:100%;border:1px solid #ccc;padding:5px;background:#ddd">
            <p>1. 此处需在全员营销栏目，配置全员景区，以及全员专属分销商</p>
            <p>2. 根据配置拉取分销商推广地址</p>
            <p>3. 配置对应地址，用于店铺景区/酒店/商品/餐饮/跟团游c端详情页，获取推广地址或地址海报</p>
          </div>
          <!-- <Input type="textarea" disabled :value="text" :autosize="{minRows:5,maxRows: 5}" style="width:90%"></Input>                  -->
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="marketUpdate">提交</Button>
          <Button type="ghost"
                  @click="cancel">关闭</Button>
        </FormItem>

      </Form>
      <div slot="footer"></div>
    </Modal>
    <Modal width="700"
           v-model="marketTableModal"
           title="选择推广地址">
      <div style="max-height:400px; overflow-y:scroll">
        <Table :loading="tableLoading"
               :columns="columns2"
               :data="tableData2"
               no-data-text="暂无推广地址"></Table>
      </div>

      <div slot="footer"></div>
    </Modal>
    <Modal v-model="delMarketModal"
           class-name="ivu-confirm-modal">
      <p slot="header"
         style="color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>信息确认</span>
      </p>
      <p>确定要取消绑定吗？</p>
      <div slot="footer"
           style="text-align:center">
        <Button type="error"
                @click="ok('del')">确认</Button>
        <Button type="ghost"
                @click="marketCancel">取消</Button>
      </div>
    </Modal>
    <!-- 价格库存日历修改 -->
    <Modal width="550"
           v-model="priceModal"
           title="价格库存修改">
      <Form :model="priceForm"
            label-position="right"
            ref="priceForm"
            :label-width="120"
            :rules="rulePriceForm">
        <FormItem label="餐券名称：">
          {{priceForm.name}}
        </FormItem>
        <template v-if="priceForm.stockMode=='limit'">
          <FormItem label="总库存："
                    prop="totalStock">
            <Input number
                   v-model="priceForm.totalStock"
                   @on-keyup="prove"
                   style="width:65%"
                   :maxlength="9"></Input>
            <span style="margin-left:10px;color:red">已售库存:{{stockNum}}</span>
          </FormItem>
        </template>

        <FormItem label="成本价："
                  prop="costPrice">
          <Input number
                 v-model="priceForm.costPrice"
                 @on-keyup="proveCost"
                 style="width:65%"
                 :maxlength="8"></Input>
        </FormItem>
        <FormItem label="门市价："
                  prop="rackPrice">
          <Input number
                 v-model="priceForm.rackPrice"
                 @on-keyup="proveRack"
                 style="width:65%"
                 :maxlength="8"></Input>
        </FormItem>
        <FormItem number
                  label="零售价："
                  prop="priceSettle">
          <Input number
                 v-model="priceForm.priceSettle"
                 @on-keyup="proveSettle"
                 style="width:65%"
                 :maxlength="8"></Input>
        </FormItem>
        <FormItem label="最后修改时间：">
          {{priceForm.modifyTime}}
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="updatePrice">提交</Button>
          <Button type="ghost"
                  @click="priceCancel">取消</Button>
        </FormItem>

      </Form>
      <div slot="footer"></div>
    </Modal>
    <confirm ref="confirmModel"
             mode="post"
             content="确认推送全员营销？"
             sucessMsg="推送成功"></confirm>
  </div>
</template>

<script>
import confirm from '@/components/global/confirm'
export default {
  components: {
    confirm
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
      // previewUrl: 'product/api/repastProduct/preview?repastId=',
      previewUrl: '',
      qrcodeShow: false,
      sortNo: false, // 是否排序
      marketModal: false, // 显示全员营销
      marketTableModal: false, // 显示推广地址列表
      marketTableShow: false, // 是否替换已配置地址
      tableLoading: false, // 加载状态
      marketName: '',
      marketCode: '',
      priceModal: false, // 价格库存日历
      blurGet: false, // 排序是否请求接口
      delMarketModal: false, // 取消绑定
      delModal: false, // 删除餐券
      delId: '', // 保存要删除项的id
      openIndex: null, // 控制哪个餐馆下面的餐券显示
      total: 0,
      current: 1,
      pageSize: 10,
      currentNum: 1,
      priceId: '', // 保存餐馆id
      marketId: '', // 取消全员营销id
      priceForm: {
        couponId: '',
        name: '',
        costPrice: '', // 成本价
        rackPrice: '', // 门市价
        priceSettle: '', // 零售价
        totalStock: '' // 总库存
        //   modifyTime:'',   //最后修改时间
      },
      stockNum: 0, // 已售库存
      rulePriceForm: {
        totalStock: [
          {
            required: true,
            type: 'number',
            message: '请填写库存数量',
            trigger: 'blur'
          },
          {
            validator: validateNum2,
            message: '数值不能大于999999'
          }
        ],
        costPrice: [
          {
            required: true,
            type: 'number',
            message: '请填写成本价',
            trigger: 'blur'
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum,
            message: '数值不能大于99999'
          }
        ],
        rackPrice: [
          {
            required: true,
            type: 'number',
            message: '请填写门市价',
            trigger: 'blur'
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum,
            message: '数值不能大于99999'
          }
        ],
        priceSettle: [
          {
            required: true,
            type: 'number',
            message: '请填写零售价',
            trigger: 'blur'
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum,
            message: '数值不能大于99999'
          }
        ]
      },
      searchForm: {
        eateryName: '',
        couponName: '',
        searchName: '',
        enabled: ''
      },
      marketForm: {
        // 全员营销
        merchantBusId: '',
        busType: '',
        name: '',
        code: '',
        proUrl: '',
        codeid: '',
        resellerid: ''
      },
      merchantWholeMarket: '',
      text:
        '1. 此处需在全员营销栏目，配置全员景区，以及全员专属分销商 /n2. 根据配置拉取分销商推广地址 /n3. 配置对应地址，用于店铺景区/酒店/商品c端详情页，获取推广地址或地址海报',
      ruleMarketForm: {
        name: [{ required: true, message: '请填写全员推广地址' }]
      },
      columns2: [
        // 推广地址列表
        {
          title: '序号',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '推广编号',
          key: 'code'
        },
        {
          title: '推广名称',
          key: 'name'
        },
        {
          title: '推广地址',
          key: 'proUrl'
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.marketForm.name = params.row.name
                    this.marketForm.code = params.row.code
                    this.marketForm.proUrl = params.row.proUrl
                    this.marketForm.codeid = params.row.codeid
                    this.marketForm.resellerid = params.row.resellerid
                    this.marketTableModal = false
                  }
                }
              },
              '选择'
            )
          }
        }
      ],
      tableData2: [], // 推广地址数据
      data: [],
      tableData: [],
      columns: [
        {
          title: '餐券编号',
          key: 'code',
          width: 200
        },
        {
          title: '餐券名称',
          key: 'name'
        },
        {
          title: '餐馆名称',
          key: 'repastEateryName',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  color: '#999'
                }
              },
              params.row.repastEateryName
            )
          }
        },
        {
          title: '门市价',
          key: 'rackPrice'
        },
        {
          title: '零售价',
          key: 'priceSettle'
        },
        {
          title: '排序',
          key: 'sortNo',
          align: 'center',
          render: (h, params) => {
            return h(
              'Input',
              {
                props: {
                  value: params.row.sortNo,
                  size: 'small',
                  maxlength: 3
                },
                on: {
                  input: value => {
                    params.row.sortNo = value
                    this.blurGet = true
                  },
                  'on-blur': () => {
                    if (this.blurGet) {
                      this.apiPost('/product/api/repastProduct/updateCouponSortNo', {
                        couponId: params.row.id,
                        sortNo: params.row.sortNo
                      }).then(res => {
                        if (res.status == 200) {
                          this.blurGet = false
                          this.$Message.success('操作成功!')
                          this.collpane(params.row.repastEateryId, 1)
                        } else {
                          this.$Message.warning(res.message)
                        }
                      })
                    }
                  },
                  'on-keyup': value => {
                    if (params.row.sortNo.length) {
                      params.row.sortNo = params.row.sortNo.replace(
                        /[^\.\d]/g,
                        ''
                      )
                    }
                  }
                }
              },
              ''
            )
          }
        },
        {
          title: '库存模式',
          key: 'stockMode',
          render: (h, params) => {
            return h(
              'span',
              params.row.stockMode == 'limit' ? '有限库存' : '无限库存'
            )
          }
        },
        {
          title: '上架状态',
          key: 'enabled',
          render: (h, params) => {
            return h('span', params.row.enabled == 'T' ? '已上架' : '未上架')
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.apiPost(
                        '/product/api/repastProduct/isCouponEnabledDisable',
                        {
                          couponId: params.row.id,
                          enabled: params.row.enabled === 'T' ? 'F' : 'T'
                        }
                      ).then(res => {
                        if (res.status == 200) {
                          this.$Message.success('操作成功!')
                          this.collpane(params.row.repastEateryId, 1)
                        } else {
                          this.$Message.warning(res.message)
                        }
                      })
                    }
                  }
                },
                params.row.enabled == 'T' ? '下架' : '上架'
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
                      this.$router.push({
                        path: '/newMealCoupon',
                        query: { id: params.row.id }
                      })
                    }
                  }
                },
                '修改'
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
                      this.priceModal = true
                      this.priceId = params.row.repastEateryId
                      this.apiGet(
                        '/product/api/repastProduct/queryCouponInfo?couponId=' +
                        params.row.id
                      ).then(res => {
                        if (res.status == 200) {
                          this.priceForm = res.data
                          if (
                            res.data &&
                            (res.data.totalStock || res.data.totalStock == 0) &&
                            (res.data.leftStockNum ||
                              res.data.leftStockNum == 0)
                          ) {
                            this.stockNum =
                              res.data.totalStock - res.data.leftStockNum
                          }
                          this.priceForm.couponId = params.row.id
                        } else {
                          this.$Message.warning(res.message)
                        }
                      })
                    }
                  }
                },
                '价格库存'
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
                      this.delModal = true
                      this.delId = params.row.id
                      this.priceId = params.row.repastEateryId
                    }
                  }
                },
                '删除'
              ),
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'text',
              //       size: 'small'
              //     },
              //     on: {
              //       click: () => {
              //         this.$refs.confirmModel.confirm('/product/api/product/syncQyyx', { id: params.row.id, businessType: 'repast' })
              //       }
              //     }
              //   },
              //   '推送全员营销'
              // )
            ])
          }
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 排序
    addSortNo (id, num) {
      if (this.sortNo) {
        this.apiGet('/product/api/repastProduct/updateSortNo', {
          id: id,
          sortNo: num
        }).then(res => {
          if (res.status == 200) {
            this.$Message.success('操作成功！')
            this.sortNo = false
            this.getList()
          } else {
            this.$Message.success(res.message)
          }
        })
      } else {
        this.$Message.warning('没有更改序号')
      }
    },
    // 序号是否改变了
    alterSortNo () {
      this.sortNo = true
    },
    sort (i) {
      if (this.data[i].sortNo && this.data[i].sortNo.length) {
        this.data[i].sortNo = this.data[i].sortNo.replace(/[^\.\d]/g, '')
      }
    },
    prove () {
      if (this.formItem.totalStock.length) {
        this.formItem.totalStock = this.formItem.totalStock.replace(
          /[^\.\d]/g,
          ''
        )
      }
    },
    proveCost () {
      if (this.priceForm.costPrice.length) {
        this.priceForm.costPrice = this.priceForm.costPrice.replace(
          /[^\.\d]/g,
          ''
        )
      }
    },
    proveRack () {
      if (this.priceForm.rackPrice.length) {
        this.priceForm.rackPrice = this.priceForm.rackPrice.replace(
          /[^\.\d]/g,
          ''
        )
      }
    },
    proveSettle () {
      if (this.priceForm.priceSettle.length) {
        this.priceForm.priceSettle = this.priceForm.priceSettle.replace(
          /[^\.\d]/g,
          ''
        )
      }
    },
    // 新增餐馆
    add () {
      this.$router.push('/restaurantInfo')
    },
    // 开闭馆
    eayerOpen (id, text) {
      this.apiPost('/product/api/repastProduct/isEateryEnabledDisable', {
        eateryId: id,
        enabled: text
      }).then(res => {
        if (res.status == 200) {
          this.$Message.success('操作成功!')
          this.getList()
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    // 完善信息
    perInfo (id) {
      this.$router.push({ path: '/newRestaurantInfo', query: { id: id } })
    },
    // 新增餐券
    addCoupon (id) {
      this.$router.push({ path: '/newMealCoupon', query: { eateryId: id } })
    },
    delCoupon () {
      this.apiPost('/product/api/repastProduct/deleteCouponInfo', {
        couponId: this.delId
      }).then(res => {
        if (res.status == 200) {
          this.$Message.success('删除成功!')
          this.collpane(this.priceId, 1)
          this.delModal = false
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    cancelCoupon () {
      this.delModal = false
    },
    // 预览   生成二维码
    preview (id) {
      this.qrcodeShow = true;
      this.previewUrl = 'product/api/repastProduct/preview?repastId='+id;
    },
    // 全员营销
    market (id, text) {
      this.marketModal = true
      this.marketId = id
      this.marketForm.name = ''
      this.apiGet(
        '/merchant/api/merchantWholeMarket/toSaveQyCode?type=eatery&businessId=' +
        id
      ).then(res => {
        if (res.status == 200) {
          if (res.data.merchantQyyx) {
            this.marketTableShow = true
            this.marketName = res.data.merchantQyyx.name
            this.marketCode = res.data.merchantQyyx.code
            this.marketForm.proUrl = res.data.merchantQyyx.proUrl
            this.marketForm.codeid = res.data.merchantQyyx.codeid
            this.marketForm.resellerid = res.data.merchantQyyx.resellerid
          } else {
            this.marketForm.name = ''
          }
          this.marketForm.merchantBusId = res.data.merchantBusId
          this.marketForm.busType = res.data.busType
          this.merchantWholeMarket = res.data.merchantWholeMarket
          if (text == 'del') {
            this.marketForm.name = ''
          }
        } else {
          this.marketForm.name = ''
          this.$Message.warning(res.message)
        }
      })
    },
    // 全员推广地址
    marketTable () {
      this.marketTableModal = true
      this.tableLoading = true
      this.apiPost('/merchant/api/merchantWholeMarket/qyyxCodeGrid', {
        marketDisAccount: this.merchantWholeMarket
      }).then(res => {
        if (res.status == 200) {
          this.tableLoading = false
          this.tableData2 = res.data.rows
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    // 提交全员营销
    marketUpdate () {
      if (this.marketForm.name) {
        let url = '/merchant/api/merchantWholeMarket/saveQyCode'
        this.apiPost(url, this.marketForm).then(res => {
          if (res.success) {
            this.$Message.success('提交成功!')
            this.marketTableShow = true
            this.marketName = this.marketForm.name
            this.marketCode = this.marketForm.code
          } else {
            this.$Message.warning(res.message)
          }
        })
      } else {
        this.$Message.warning('请选择全员推广地址名称')
      }
    },
    // 取消绑定
    delMarket () {
      this.delMarketModal = true
    },
    // 确定取消绑定
    ok (text) {
      this.apiPost(
        '/merchant/api/merchantWholeMarket/delQyCode',
        this.marketForm
      ).then(res => {
        if (res.success) {
          this.market(this.marketId, text)
          this.marketName = ''
          this.marketCode = ''
          this.marketTableShow = false
          this.delMarketModal = false
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    marketCancel () {
      this.delMarketModal = false
    },
    // 关闭全员营销
    cancel () {
      this.marketModal = false
      //   this.marketForm.name = "";
    },
    // 修改价格日历提交
    updatePrice () {
      this.$refs.priceForm.validate(async valid => {
        if (valid) {
          let url = '/product/api/repastProduct/updateCouponPrice'
          let res = await this.apiPost(url, this.priceForm)
          if (res.status == 200) {
            this.$Message.success('修改成功!')
            this.collpane(this.priceId, 1)
            this.priceModal = false
          } else {
            this.$Message.warning(res.message)
          }
        }
      })
    },
    // 修改价格日历取消
    priceCancel () {
      this.priceModal = false
    },
    collpane (id, num) {
      let _this = this
      this.openIndex = id
      this.apiPost('/product/api/repastProduct/getRepastCouponList', {
        eateryId: id,
        currPage: num,
        pageSize: 20
      }).then(res => {
        if (res.status == 200) {
          this.tableData = res.data
        }
      })
    },
    getList () {
      let _this = this
      let params = {}
      params = {
        eateryName: this.searchForm.eateryName,
        couponName: this.searchForm.couponName,
        searchName: this.searchForm.searchName,
        enabled: this.searchForm.enabled,
        currPage: this.current,
        pageSize: this.pageSize
      }
      this.apiPost('/product/api/repastProduct/getRepastProductPage', params).then(
        function (res) {
          if (res.status == 200) {
            _this.total = res.data.total
            _this.data = res.data.rows
            _this.collpane(_this.data[0].id, 1)
          }
        }
      )
    },
    changepage (num) {
      this.current = num
      this.getList()
    },
    pageSizeChange (num) {
      this.pageSize = num
      this.getList()
    }
  }
}
</script>

<style lang="scss" >
.catering {
  width: 100%;
  .caterBox {
    width: 100%;
    margin-bottom: 10px;
    .cater-list {
      width: 100%;
      height: 142px;
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
}
</style>
