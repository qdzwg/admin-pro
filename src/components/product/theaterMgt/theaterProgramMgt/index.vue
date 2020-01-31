<template>
  <div class="template-user-define">
    <searchForm :search-items="searchItems"></searchForm>
    <Row :gutter="16"
         class="btn-groups">
      <Col span="24">
      <Button @click="pullModal">拉取</Button>
      <Button @click="mutilDel">删除</Button>
      <Button @click="up">启用</Button>
      <Button @click="down">停用</Button>
      <Button @click="preview">店铺二维码</Button>

      </Col>
    </Row>
    <gridTable ref="gridTable"
               :columns="columns"
               :params="params"
               :data="data"
               :url="url"
               :extraParams="true"></gridTable>
    <confirm @okClick="okSure"
             ref="confirmModel"
             :mode="mode"
             :content="content"
             :sucessMsg="sucessMsg"></confirm>
    <Modal width="1000"
           v-model="modal1"
           title="拉取节目">
      <Form ref="formInline"
            inline>
        <!-- <FormItem style="margin-bottom:10px">
          <Input type="text" v-model="name" placeholder="请输入对应场所关键字"></Input>
        </FormItem> -->
        <FormItem style="margin-bottom:10px">
          <Select v-model="saleCorpCode"
                  @on-change="getList"
                  style="width:200px">
            <Option v-for="(item,index) in corpCodeList"
                    :value="item.corpCode"
                    :key="index">{{ item.corpName }}</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Button type="primary"
                  @click="getList">搜索</Button>
          <Button @click="pull">一键拉取</Button>
        </FormItem>
      </Form>
      <Table size="small"
             border
             ref="selection"
             @on-selection-change="mutiSelect"
             :columns="columns4"
             :data="data1"></Table>
      <Page @on-change="pageChange"
            style="margin-top:5px"
            :total="total"
            show-elevator></Page>
      <div slot="footer">
        <!-- <Button @click="set" type="primary">确定</Button>
        <Button @click="setCancel" type="ghost">取消</Button>-->
      </div>
    </Modal>
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
            <p>4、选择推广地址需与详情地址一致，否则无法正常进行推广分佣</p>
          </div>
          <!-- <Input type="textarea" readonly v-model="text" :autosize="{minRows:5,maxRows: 5}" style="width:90%"></Input>                  -->
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
import { apiGet, apiPost } from '@/fetch/api'
export default {
  data () {
    return {
      previewUrl: 'product/api/newTheaterShow/preview',
      previewParam: {},
      qrcodeShow: false,
      marketModal: false, // 显示全员营销
      marketTableModal: false, // 显示推广地址列表
      delMarketModal: false, // 取消绑定
      marketId: '', // 取消全员营销id
      paramsCode: '', // 取消全员营销code
      marketTableShow: false, // 是否替换已配置地址
      tableLoading: false, // 加载状态
      marketName: '',
      marketCode: '',
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
              'a',
              {
                props: {
                  type: 'primary',
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
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '节目名称',
          key: 'name'
        },
        {
          title: '外部节目编码',
          key: 'code'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      if (
                        params.row.endDate &&
                        params.row.startDate &&
                        params.row.saleCorpcode
                      ) {
                        apiPost(
                          '/product/api/newTheaterShow/batchSyncZybTheaterShow',
                          {
                            theaterShowInfo: JSON.stringify([
                              {
                                code: params.row.code ? params.row.code : '',
                                name: params.row.name ? params.row.name : '',
                                startDate: params.row.startDate
                                  ? params.row.startDate
                                  : '',
                                endDate: params.row.endDate
                                  ? params.row.endDate
                                  : '',
                                saleCorpcode: params.row.saleCorpcode
                                  ? params.row.saleCorpcode
                                  : ''
                              }
                            ]),
                            mainUserId: this.mainUserId
                          }
                        ).then(res => {
                          if (res.success) {
                            this.$Message.success('同步成功!')
                            this.modal1 = false
                            this.params.page = 1
                            this.$store.dispatch('postApi')
                          } else {
                            this.$Message.warning(res.message)
                          }
                        })
                      } else {
                        this.$Message.warning(
                          '请检查拉取节目数据的开始结束时间及场所编码'
                        )
                      }
                    }
                  }
                },
                '选择'
              )
            ])
          }
        }
      ],
      data1: [],
      name: '',
      modal1: false,
      content: '',
      sucessMsg: '',
      mode: '',
      searchItems: [
        {
          label: '节目名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '节目编码',
          type: 'input',
          name: 'code'
        },
        {
          label: '状态',
          type: 'select',
          name: 'enabled',
          default: 'xjsc_all',
          allValue: '',
          data: [
            {
              value: 'xjsc_all',
              label: '全部'
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
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '节目名称',
          key: 'name'
        },
        {
          title: '节目编码',
          key: 'code'
        },
        {
          title: '外部节目编码',
          key: 'code'
        },
        {
          title: '演出单位',
          key: 'playDepart'
        },
        {
          title: '开始日期',
          key: 'startDate',
          render: (h, params) => {
            return h(
              'span',
              params.row.startDate ? params.row.startDate.split(' ')[0] : ''
            )
          }
        },
        {
          title: '结束日期',
          key: 'endDate',
          render: (h, params) => {
            return h(
              'span',
              params.row.endDate ? params.row.endDate.split(' ')[0] : ''
            )
          }
        },
        {
          title: '节目状态',
          key: 'enabled',
          render: (h, params) => {
            return h('span', params.row.enabled == 'T' ? '启用' : '停用')
          }
        },
        {
          title: '操作',
          key: 'action',
          // width: 200,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '修改',
                action: () => {
                  this.$router.push('/program-edit?id=' + params.row.id)
                }
              },
              {
                title: '删除',
                action: () => {
                  this.del(params.row.id)
                }
              },
              {
                title: '全员营销',
                action: () => {
                  this.market(params.row.id, 'edit', params.row.code)
                }
              }
              //   {
              //     title: "推广",
              //     action: () => {
              //       this.preview(params.row.id, params.row.renovationPageType);
              //     }
              //   }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {
        page: 1,
        limit: 10,
        sort: 'modifyTime',
        order: 'desc'
      },
      url: '/product/api/newTheaterShow/getTheaterShowPage',
      modal: false,
      templateCode: '',
      type: '',
      status: '',
      currPage: 1,
      pageSize: 10,
      total: null,
      listData: [],
      templateName: '',
      typeList: [],
      wxxcx: false,
      selection: [],
      saleCorpCode: '',
      corpCodeList: [],
      mainUserId: ''
    }
  },
  created () {

  },
  mounted () {
    apiGet('/admin/userStore/detail').then(res => {
      if (res.status === 200 || res.success) {
        this.mainUserId = res.user.mainUserInfoId
        this.$refs.gridTable.loadpage()
      } else {
        this.$Message.error(res.message)
      }
    })
  },
  destroyed () {
    // console.log("destroyed sdfsf");
  },
  components: {
    gridTable,
    confirm,
    searchForm,
    qrcode: QRcode
  },
  methods: {
    // 全员营销
    market (id, text, code) {
      this.marketModal = true
      this.marketId = id
      this.paramsCode = code
      this.marketForm.name = ''
      apiGet(
        '/merchant/api/theater/toSaveQyCode?type=theate&code=' +
        code
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
            this.marketTableShow = false
            this.marketForm.name = ''
            this.marketName = ''
            this.marketCode = ''
            this.marketForm.proUrl = ''
            this.marketForm.codeid = ''
            this.marketForm.resellerid = ''
          }
          this.marketForm.merchantBusId = res.data.merchantBusId
          this.marketForm.busType = res.data.busType
          this.merchantWholeMarket = res.data.merchantWholeMarket

          if (text == 'del') {
            this.marketForm.name = ''
          }
        } else {
          this.marketName = ''
          this.marketCode = ''
          this.marketForm.name = ''
          this.$Message.warning(res.message)
        }
      })
    },
    // 全员推广地址
    marketTable () {
      this.marketTableModal = true
      this.tableLoading = true
      apiPost('/merchant/api/merchantWholeMarket/qyyxCodeGrid', {
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
        apiPost(url, this.marketForm).then(res => {
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
    ok (text) {
      apiPost(
        '/merchant/api/merchantWholeMarket/delQyCode',
        this.marketForm
      ).then(res => {
        if (res.success) {
          this.market(this.marketId, text, this.paramsCode)
          this.marketName = ''
          this.marketCode = ''
          this.marketTableShow = false
          this.delMarketModal = false; 7
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    marketCancel () {
      this.delMarketModal = false
    },
    // 取消全员营销
    cancel () {
      this.marketModal = false
    },
    // 预览   生成二维码
    preview () {
      this.previewParam = {},
        this.qrcodeShow = true;
    },
    qrcode () {

    },
    okSure () {
      this.$refs.gridTable.selection = []
    },
    pull () {
      if (this.selection.length > 0) {
        let arr = this.selection.map(item => {
          return {
            code: item.code ? item.code : '',
            name: item.name ? item.name : '',
            startDate: item.startDate ? item.startDate : '',
            endDate: item.endDate ? item.endDate : '',
            saleCorpcode: item.saleCorpcode ? item.saleCorpcode : ''
          }
        })
        apiPost('/product/api/newTheaterShow/batchSyncZybTheaterShow', {
          mainUserId: this.mainUserId,
          theaterShowInfo: JSON.stringify(arr)
        }).then(res => {
          if (res.success) {
            this.selection = []
            this.$Message.success('拉取成功!')
            this.$store.dispatch('postApi')
            this.modal1 = false
          } else {
            this.$Message.warning(res.message)
          }
        })
      } else {
        this.$Message.warning('请选择拉取项')
      }
    },
    mutiSelect (selection) {
      this.selection = selection
    },
    pullModal () {
      this.data1 = []
      apiGet('/product/api/NewTheaterTicket/getByCropCode').then(res => {
        this.corpCodeList = res.result
        this.saleCorpCode = res.result.length ? res.result[0].corpCode : ''
        this.modal1 = true
        this.getList()
      })
    },
    mutilDel () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        this.del(arr.join(','))
      } else {
        this.$Message.warning('请选择删除项')
      }
    },
    del (ids) {
      this.mode = 'post'
      this.content = '确认删除吗?'
      this.sucessMsg = '删除成功!'
      this.$refs.confirmModel.confirm(
        '/product/api/newTheaterShow/batchDeleteTheaterShow?ids=' + ids + '&mainUserId=' + this.mainUserId
      )
    },
    up () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        // this.$refs.gridTable.selection = [];
        this.mode = 'post'
        this.content = '确认启用吗?'
        this.sucessMsg = '启用成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/newTheaterShow/batchIsEnabledDisable?ids=' +
          arr.join(',') +
          '&enabled=T&mainUserId=' + this.mainUserId
        )
      } else {
        this.$Message.warning('请选择启用项')
      }
    },
    down () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        // this.$refs.gridTable.selection = [];
        this.mode = 'post'
        this.content = '确认停用吗?'
        this.sucessMsg = '停用成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/newTheaterShow/batchIsEnabledDisable?ids=' +
          arr.join(',') +
          '&enabled=F&mainUserId=' + this.mainUserId
        )
      } else {
        this.$Message.warning('请选择停用项')
      }
    },
    pageChange (page) {
      this.currPage = page
      this.getList()
    },
    getList () {
      if (this.saleCorpCode) {
        apiPost('/product/api/newTheaterShow/zybTheaterShow', {
          currPage: this.currPage,
          pageSize: this.pageSize,
          saleCorpCode: this.saleCorpCode
        }).then(res => {
          if (res.status == 200 || res.success) {
            this.total = res.data.total
            this.data1 = res.data.rows
          } else {
            this.total = null
            this.$Message.warning(res.message)
            this.data1 = []
          }
        })
      } else {
        this.$Message.warning('请前往剧院供应商企管理添加企业码')
      }
    }
  }
}
</script>
<style lang='scss'>
//   @import "../../../../assets/styles/font/iconfont.css";
.template-modal-select {
  .template-select-list {
    margin-bottom: 15px;
    .item-warper {
      padding: 0 25px;
      margin-bottom: 10px;
      .template-name {
        text-align: center;
        padding: 10px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .template-item {
        // margin: 0 5px;
        margin-bottom: 10px; // height: 190px;
        height: 180px;
        width: 125px;
        position: relative;
        margin: 0 auto;
        .template-item-img {
          height: 180px;
          width: 125px;
        }
        .cover {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          text-align: center;
          .template-use {
            margin-top: 85px;
          }
        }
      }
      .template-item:hover {
        .cover {
          display: block;
        }
      }
      .user-defined {
        border: 1px solid #eee;
        text-align: center;
        .userdefine-img {
          margin-top: 25px;
          height: 80px;
          width: 80px;
        }
      }
    }
  }
}
.template-user-define {
}
</style>
