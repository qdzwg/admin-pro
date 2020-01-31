<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16"
         class="btn-groups">
      <Col span="2">
      <Button type="error"
              icon="android-delete"
              @click="delAll">删除</Button>
      </Col>
      <Col span="2">
      <Button type="primary"
              icon="android-add"
              @click="addCombo">新增</Button>
      </Col>
      <Col span="2">
      <Button type="primary"
              icon="android-done"
              @click="onLine">上架</Button>
      </Col>
      <Col span="2">
      <Button type="primary"
              icon="android-close"
              @click="offLine">下架</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable"
               :params="params"
               :columns="columns"
               :data="data"
               :url="url"></gridTable>
    <confirm ref="confirmModel"
             :mode="mode"
             :content="content"
             :sucessMsg="sucessMsg"></confirm>

    <!-- 预览 -->
    <qrcode-modal :url='previewUrl'
                  :param="previewParam"
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

  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  components: { searchForm, gridTable, confirm },
  data () {
    return {
      previewUrl: 'product/api/familyInfo/preview',
      previewParam: {},
      mode: "",
      content: "",
      sucessMsg: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '套票编号',
          key: 'productCode'
        },
        {
          title: '套票名称',
          key: 'name'
        },
        {
          title: '套票数量',
          key: 'familyTicketNum'
        },
        {
          title: '状态',
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
                      this.apiPost('/product/api/familyInfo/editSortNo', {
                        id: params.row.id,
                        sortNo: params.row.sortNo
                      }).then(res => {
                        if (res.success) {
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
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params) => {
            let { id, enabled } = params.row
            const actions = [{
              title: enabled == 'F' ? '上架' : '下架',
              action: () => {
                this.mode = 'post'
                this.sucessMsg = (enabled == 'F' ? '上架' : '下架') + '成功！'
                this.content = '确认' + (enabled == 'F' ? '上架' : '下架') + '？'
                this.$refs.confirmModel.confirm('/product/api/familyInfo/enableAndDisable?ids=' + id + '&enabled=' + (enabled == 'F' ? 'T' : 'F'))
              }
            },
            {
              title: '票型',
              action: () => {
                this.$router.push({ 'path': '/comboTicket?comboId=' + id })
              }
            },
            {
              title: '修改',
              action: () => {
                this.$router.push("/publishCombo?comboId=" + id)
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
                this.previewParam = { familyInfoId: id }
                this.qrcodeShow = true
              }
            },
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
      params: { page: 1, limit: 10 },
      url: '/product/api/familyInfo/familyInfoList',
      searchItems: [
        {
          label: '套票编码',
          type: 'input',
          name: 'productCode'
        },
        {
          label: '套票名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '状态',
          type: 'select',
          name: 'enabled',
          data: [
            {
              value: '',
              label: '请选择'
            },
            {
              value: 'T',
              label: '已上架'
            },
            {
              value: 'F',
              label: '已下架'
            }
          ]
        }
      ],
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
      tableData2: [], // 推广地址数据
    }
  },
  methods: {
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
    addCombo () {
      this.$router.push('/publishCombo')
    },

    onLine () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        this.mode = 'post'
        this.content = '确认上架吗?'
        this.sucessMsg = '上架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/familyInfo/enableAndDisable?ids=' +
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
          '/product/api/familyInfo/enableAndDisable?ids=' +
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
        '/product/api/familyInfo/delFamilyInfo?ids=' + ids
      )
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
    }
  }
}
</script>
