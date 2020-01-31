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
      </Col>
    </Row>
    <gridTable ref="gridTable"
               :columns="columns"
               :params="params"
               :url="url"
               :extraParams="true"></gridTable>
    <confirm @okClick="okSure"
             ref="confirmModel"
             :mode="mode"
             :content="content"
             :sucessMsg="sucessMsg"></confirm>
    <Modal width="1000"
           v-model="modal1"
           title="拉取票型">
      <Form ref="formInline"
            inline>
        <FormItem style="margin-bottom:10px">
          <Input type="text"
                 v-model="name"
                 placeholder="请输入对应场所关键字"></Input>
        </FormItem>
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
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '票型名称',
          key: 'name'
        },
        {
          title: '票型编码',
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
                      // /product/api/theaterTicket/syncZybTheaterTicket
                      this.apiPost(
                        '/product/api/newTheaterTicket/syncZybTheaterTicket',
                        {
                          code: params.row.code ? params.row.code : '',
                          name: params.row.name ? params.row.name : '',
                          saleCorpcode: params.row.saleCorpcode
                            ? params.row.saleCorpcode
                            : '',
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
          label: '票型名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '票型编码',
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
              label: '全部票状态'
            },
            {
              value: 'T',
              label: '启用'
            },
            {
              value: 'F',
              label: '禁用'
            }
          ]
        },
        {
          label: '退票规则',
          type: 'select',
          name: 'isRetreat',
          default: '',
          allValue: '',
          data: [
            {
              value: '',
              label: '全部退票规则'
            },
            {
              value: 'T',
              label: '可退'
            },
            {
              value: 'F',
              label: '不可退'
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
          title: '票型名称',
          key: 'name'
        },
        {
          title: '票型编码',
          key: 'code'
        },
        // {
        //   title: "景区名称",
        //   key: "parkName"
        // },
        // {
        //   title: "景区来源",
        //   key: "code"
        // },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '票状态',
          key: 'enabled',
          render: (h, params) => {
            return h('span', params.row.enabled === 'T' ? '启用' : '停用')
          }
        },
        {
          title: '退票规则',
          render: (h, params) => {
            return h('span', params.row.isRetreat === 'T' ? '可退' : '不可退')
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
                  this.$router.push('/theater-ticket-edit?id=' + params.row.id)
                }
              },
              {
                title: '删除',
                action: () => {
                  this.del(params.row.id)
                }
              },
              {
                title: '推送全员营销',
                action: () => {
                  this.mode = 'post'
                  this.content = '确认推送全员营销?'
                  this.sucessMsg = '推送成功!'
                  this.$refs.confirmModel.confirm(
                    '/product/api/product/syncQyyx', { id: params.row.id, businessType: 'theater' }
                  )
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
      url: '/product/api/newTheaterTicket/getTheaterTicketPage',
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
    this.apiGet('/admin/userStore/detail').then(res => {
      if (res.status == 200 || res.success) {
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
    searchForm
    // qrcode: QRcode
  },
  methods: {
    okSure () {
      this.$refs.gridTable.selection = []
    },
    pull () {
      if (this.selection.length > 0) {
        let arr = this.selection.map(item => {
          return {
            code: item.code ? item.code : '',
            name: item.name ? item.name : '',
            saleCorpcode: item.saleCorpcode ? item.saleCorpcode : ''
          }
        })
        this.apiPost('/product/api/newTheaterTicket/batchSyncZybTheaterTicket', {
          theaterTicketInfo: JSON.stringify(arr),
          mainUserId: this.mainUserId
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
      this.apiGet('/product/api/NewTheaterTicket/getByCropCode').then(res => {
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
        '/product/api/newTheaterTicket/batchDeleteTheaterTicket?ids=' + ids + '&mainUserId=' + this.mainUserId
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
          '/product/api/newTheaterTicket/batchIsTicketEnabledDisable?ids=' +
          arr.join(',') +
          '&enabled=T' + '&mainUserId=' + this.mainUserId
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
          '/product/api/newTheaterTicket/batchIsTicketEnabledDisable?ids=' +
          arr.join(',') +
          '&enabled=F' + '&mainUserId=' + this.mainUserId
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
        this.apiPost('/product/api/newTheaterTicket/zybTheaterTicket', {
          mainUserId: this.mainUserId,
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
