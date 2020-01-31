<template>
  <div>
    <!-- <div class='place-test demo'>1231</div>
    <button class='btn1'>asdadsad11</button>
    <button class='btn2'>asdads22</button>-->
    <searchForm :search-items="searchItems"></searchForm>
    <Row :gutter="16"
         class="btn-groups">
      <Col span="24">
      <Button @click="pullModal">拉取</Button>
      <Button @click="mutilDel">删除</Button>
      <Button @click="up">上架</Button>
      <Button @click="down">下架</Button>
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
           title="拉取场所">
      <Form ref="formInline"
            inline>
        <!-- <FormItem style="margin-bottom:10px">
          <Input type="text" v-model="name" placeholder="请输入对应场所关键字"></Input>
        </FormItem> -->
        <FormItem style="margin-bottom:10px">
          <Select v-model="saleCorpCode"
                  @on-change="getList"
                  style="width:250px">
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
import { apiGet, apiPost } from '@/fetch/api'
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
          title: '场所名称',
          key: 'name'
        },
        {
          title: '外部场所编码',
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
                      apiPost('/product/api/newTheaterPlace/syncZybTheaterPlace', {
                        code: params.row.code ? params.row.code : '',
                        name: params.row.name ? params.row.name : '',
                        saleCorpcode: params.row.saleCorpcode
                          ? params.row.saleCorpcode
                          : '',
                        mainUserId: this.mainUserId
                      }).then(res => {
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
          label: '场所名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '场所编码',
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
          title: '场所名称',
          key: 'name'
        },
        {
          title: '场所编码',
          key: 'code'
        },
        {
          title: '外部场所编码',
          key: 'code'
        },
        {
          title: '场所状态',
          key: 'enabled',
          render: (h, params) => {
            return h('span', params.row.enabled == 'T' ? '上架' : '下架')
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
                  this.$router.push('/place-edit?id=' + params.row.id)
                }
              },
              {
                title: '删除',
                action: () => {
                  this.del(params.row.id)
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
      url: '/product/api/newTheaterPlace/getTheaterPlacePage',
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
      corpCodeList: [],
      saleCorpCode: '',
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
        apiPost('/product/api/newTheaterPlace/batchSyncZybTheaterPlace', {
          mainUserId: this.mainUserId,
          theaterPlaceInfo: JSON.stringify(arr)
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
        '/product/api/newTheaterPlace/batchDeleteTheaterPlace?ids=' + ids + '&mainUserId=' + this.mainUserId
      )
    },
    up () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        // this.$refs.gridTable.selection = [];
        this.mode = 'post'
        this.content = '确认上架吗?'
        this.sucessMsg = '上架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/newTheaterPlace/batchIsPlaceEnabledDisable?ids=' +
          arr.join(',') +
          '&enabled=T&mainUserId=' + this.mainUserId
        )
      } else {
        this.$Message.warning('请选择上架项')
      }
    },
    down () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        // this.$refs.gridTable.selection = [];
        this.mode = 'post'
        this.content = '确认下架吗?'
        this.sucessMsg = '下架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/newTheaterPlace/batchIsPlaceEnabledDisable?ids=' +
          arr.join(',') +
          '&enabled=F&mainUserId=' + this.mainUserId
        )
      } else {
        this.$Message.warning('请选择下架项')
      }
    },
    pageChange (page) {
      this.currPage = page
      this.getList()
    },
    getList () {
      if (this.saleCorpCode) {
        apiPost('/product/api/newTheaterPlace/zybTheaterPlace', {
          mainUserId: this.mainUserId,
          currPage: this.currPage,
          pageSize: this.pageSize,
          saleCorpCode: this.saleCorpCode,
          name: this.name
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
@import "../../../../assets/styles/config.scss";
// @import url("@/assets/styles/config.scss");
@mixin border-radius {
  border-radius: 10px;
}
@mixin border-width($bw: 10px) {
  border-width: $bw;
}
$divwidth: 300px;
.place-test {
  border: 1px solid red;
  @include border-radius;
  @include border-width(5px);
  height: 100px;
  width: $testwidth;

  &.demo:after {
    content: "";
    background: red;
    height: 100px;
    width: 250px;
    display: inline-block;
  }
}
.btn {
  width: 120px;
  text-align: center;
  height: 32px;
  line-height: 32px;
}
.btn1 {
  background: red;
  @extend .btn;
}
.btn2 {
  background: yellow;
  @extend .btn;
}
</style>
