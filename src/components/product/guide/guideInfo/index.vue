<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2">
        <Button type="primary" icon="android-add" @click="addGuide">新增</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-done" @click="onLine">上架</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-close" @click="offLine">下架</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

    <!-- 预览 -->
    <Modal width="550" v-model="preLookModal" title="预览">
      <div>
        <span>领取短链接：{{copyUrl}}</span>
        <Button v-clipboard:copy="copyUrl"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError">复制</Button>
        <Button v-clipboard:copy="copyLongUrl"
                v-clipboard:success="onCopy2"
                v-clipboard:error="onError2">复制长链接</Button>
        <p>
          <span>领取二维码: <a :href="codeUrl"
               download>下载二维码</a> </span>
        </p>
        <p style="background:yellow;padding:5px 0;margin-top:5px;">
          扫一扫查看，推荐使用支付宝、微信、手机浏览器 全员推广请使用长链接
        </p>
        <center id="target"
                style="margin-top:20px;">
          <qrcode :value="qrcodeUrl"
                  :options="{ size: 170}">
          </qrcode>
        </center>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 全员营销 -->
    <Modal width="600" v-model="marketModal" title="绑定全员推广地址" ok-text="提交">
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
    <!--服务过期弹框-->
    <Modal v-model="isOverDate">
      <p>导游产品服务已到期，不可操作，续订成功后，可继续使用</p>
      <p>服务咨询电话：4008759009</p>
      <div slot="footer"
           style="text-align:center">
        <Button type="primary"
                @click="addServer">去续订</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import QRcode from '@xkeshi/vue-qrcode'
export default {
  data () {
    return {
      isOverDate: false,
      mode: '',
      content: '',
      sucessMsg: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '导游产品名称',
          key: 'productName'
        },
        {
          title: '产品来源',
          key: 'channel',
          render: (h, params) => {
            return h('span', this.filter.accountChannel(params.row.channel))
          }
        },
        {
          title: '导游产品编码',
          key: 'productCode'
        },
        {
          title: '产品归属',
          key: 'belongTo'
        },
        {
          title: '是否上架',
          key: 'enabled',
          render: (h, params) => {
            return h('span', params.row.enabled == 'F' ? '已下架' : '已上架')
          }
        },
        {
          title: '排序',
          key: 'sortNo',
          width: 150,
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
                      this.apiPost('/product/api/chargeGuideInfo/editSortNo', {
                        id: params.row.id,
                        sortNo: params.row.sortNo
                      }).then(res => {
                        if (res.status === 200) {
                          this.blurGet = false
                          this.$Message.success('操作成功!')
                          this.$refs.gridTable.loadpage()
                        } else {
                          this.$Message.warning(res.message)
                        }
                      })
                    }
                  },
                  'on-keyup': value => {
                    if (params.row.sortNo.length) {
                      params.row.sortNo = params.row.sortNo.replace(/[^\.\d]/g, '')
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
          key: 'stockModel',
          render: (h, params) => {
            let stockModel = {
              day: '日库存',
              unlimit: '无限库存',
              limit: '有限库存'
            }
            return h(
              'span',
              stockModel[params.row.stockModel]
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '价格库存日历',
                action: () => {
                  this.gotoRouter(params.row.id, params.row.productName)
                }
              },
              {
                title: '修改',
                action: async () => {
                  await this.checkServer()
                  if (this.isOverDate) {
                    return
                  }
                  this.$router.push('/publishGuide?id=' + params.row.id)
                }
              },
              {
                title: '删除',
                action: () => {
                  this.del(params.row.id)
                }
              }, {
                title: '预览',
                action: () => {
                  this.preview(params.row.id)
                }
              }
            // {
            //   title: '全员推广',
            //   action: () => {
            //     this.market(params.row.id,'edit')
            //   }
            // }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10},
      url: '/product/api/chargeGuideInfo/chargeGuideInfoList',
      searchItems: [
        {
          label: '导游产品名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '产品归属',
          type: 'input',
          name: 'belongTo'
        }
      ],
      codeUrl: '', // 二维码图片
      qrcodeUrl: '', // 生成二维码地址
      copyUrl: '', // 短链接
      copyLongUrl: '', // 长链接
      preLookModal: false, // 显示预览
      marketModal: false, // 显示全员营销
      marketTableModal: false, // 显示推广地址列表
      marketTableShow: false, // 是否替换已配置地址
      tableLoading: false, // 加载状态
      marketName: '',
      marketCode: '',
      blurGet: false, // 排序是否请求接口
      delMarketModal: false, // 取消绑定
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
      tableData2: [] // 推广地址数据
    }
  },
  components: {searchForm, gridTable, confirm, qrcode: QRcode},
  methods: {
    addServer () {
      window.location.href = window.location.href.split('/manage')[0] + '/manage/#/market-apply'
    },
    // 导游订购是否过期
    async checkServer () {
      let res = await this.apiPost('/product/api/chargeGuideInfo/checkService')
      if (res.data && res.data.isOverDate == 'T') {
        this.isOverDate = true
      }
      // this.isOverDate = true
      return this.isOverDate
    },
    gotoRouter (id, productName) {
      this.$router.push({
        path: '/guideInventoryCl/' + id,
        query: {productName}
      })
      // let year = new Date().getFullYear(), month = new Date().getMonth()
      // let fMonth = year + '-' + (month + 1)
      // this.apiPost('/product/api/chargeGuideInfo/selectGuideCalendar?guideId=' + id + '&month=' + fMonth).then(res => {
      //   if (res.status == 200) {
      //     this.$router.push('/comboInventoryCl/' + id)
      //   } else {
      //     this.$Message.warning(res.message)
      //   }
      // })
    },
    delAll () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        this.del(arr.join(','))
      } else {
        this.$Message.warning('请选择删除项')
      }
    },
    async addGuide () {
      await this.checkServer()
      if (this.isOverDate) {
        return
      }
      this.$router.push('/publishGuide')
    },

    async onLine () {
      await this.checkServer()
      if (this.isOverDate) {
        return
      }
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        this.mode = 'post'
        this.content = '确认上架吗?'
        this.sucessMsg = '上架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/chargeGuideInfo/enableAndDisable?ids=' +
          arr.join(',') +
          '&enabled=T'
        )
      } else {
        this.$Message.warning('请选择上架项')
      }
    },
    offLine () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        this.mode = 'post'
        this.content = '确认下架吗?'
        this.sucessMsg = '下架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/chargeGuideInfo/enableAndDisable?ids=' +
          arr.join(',') +
          '&enabled=F'
        )
      } else {
        this.$Message.warning('请选择下架项')
      }
    },
    del (ids) {
      this.mode = 'post'
      this.content = '确认删除吗?'
      this.sucessMsg = '删除成功!'
      this.$refs.confirmModel.confirm(
        '/product/api/chargeGuideInfo/delChargeGuideInfo?ids=' + ids
      )
    },
    preview (id) {
      let _this = this
      this.apiPost('/product/api/chargeGuideInfo/preview?guideInfoId=' + id).then(res => {
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
      })
    },
    // 全员营销
    market (id, text) {
      this.marketModal = true
      this.marketId = id
      this.marketForm.name = ''
      this.apiGet(
        '/merchant/api/merchantWholeMarket/toSaveQyCode?type=family&id=' +
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
    onCopy () {
      this.$Message.success('复制成功！')
    },
    onError () {
      this.$Message.error('复制失败！')
    },
    onCopy2 () {
      this.$Message.success('复制成功！')
    },
    onError2 () {
      this.$Message.error('复制失败！')
    }
  }
}
</script>
