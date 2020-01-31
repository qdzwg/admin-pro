<template>
  <div class="template-user-define">
    <searchForm :search-items="searchItems"></searchForm>
    <Row :gutter="16"
         class="btn-groups">
      <Col span="24">
      <!-- <Button @click="pullModal">拉取</Button> -->
      <!-- <Button @click="mutilDel">删除</Button> -->
      <Button type="primary"
              @click="add">新增</Button>
      <!-- <Button @click="down">下架</Button> -->
      </Col>
    </Row>
    <gridTable ref="gridTable"
               :columns="columns"
               :params="params"
               :url="url"
               :extraParams="true"></gridTable>
    <confirm ref="confirmModel"
             :mode="mode"
             :content="content"
             :sucessMsg="sucessMsg"></confirm>

    <Modal width="600"
           v-model="modal1"
           :title="pageType=='add'?'新增':'修改'">
      <Form :model="formItem"
            label-position="right"
            :label-width="120"
            ref="formItem"
            :rules="ruleComplteForm">
        <FormItem label="供应商名称："
                  prop="corpName">
          <Input v-model="formItem.corpName"
                 :maxlength="20"></Input>
        </FormItem>
        <FormItem label="供应商编码："
                  prop="corpCode">
          <Input v-model="formItem.corpCode"></Input>
        </FormItem>
        <template v-if="pageType!='add'">
          <FormItem label="线下锁库时间：">{{offlineUnlockTime}}</FormItem>
          <FormItem label="小鲸锁库时间：">{{xjCloseOrderTime}}</FormItem>
          <FormItem label="智游宝锁库时间：">{{zybCloseOrderTime}}</FormItem>
        </template>
      </Form>
      <div slot="footer">
        <Button @click="realAdd"
                :loading="btnLoading"
                type="primary">确定</Button>
        <Button @click="addCancel"
                type="ghost">取消</Button>
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
      btnLoading: false,
      formItem: {
        id: '',
        corpName: '',
        corpCode: '',
        mainUserId: ''
      },
      ruleComplteForm: {
        corpName: [
          { required: true, message: '请填写供应商名称', trigger: 'blur' }
        ],
        corpCode: [
          { required: true, message: '请填写供应商编码', trigger: 'blur' }
        ]
      },
      pageType: 'add',
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
          key: 'age'
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
                      this.pullApi(params.row.id + '')
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
          label: '供应商名称',
          type: 'input',
          name: 'cropName'
        },
        {
          label: '供应商编码',
          type: 'input',
          name: 'corpcode'
        }
      ],
      columns: [
        {
          title: '供应商名称',
          key: 'corpName'
        },
        {
          title: '供应商编码',
          key: 'corpCode'
        },
        {
          title: '线下锁库时间',
          key: 'offlineUnlockTime'
        },
        {
          title: '小鲸锁库时间',
          key: 'xjCloseOrderTime'
        },
        {
          title: '智游宝锁库时间',
          key: 'zybCloseOrderTime'
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
                  this.formItem = {
                    id: params.row.id,
                    corpCode: params.row.corpCode ? params.row.corpCode : '',
                    corpName: params.row.corpName ? params.row.corpName : ''
                  }
                  this.offlineUnlockTime = params.row.offlineUnlockTime
                    ? params.row.offlineUnlockTime
                    : ''
                  this.xjCloseOrderTime = params.row.xjCloseOrderTime
                    ? params.row.xjCloseOrderTime
                    : ''
                  this.zybCloseOrderTime = params.row.zybCloseOrderTime
                    ? params.row.zybCloseOrderTime
                    : ''
                  this.pageType = 'edit'
                  this.modal1 = true
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
      params: {
        page: 1,
        limit: 10,
        sort: 'modifyTime',
        order: 'desc'
      },
      offlineUnlockTime: '',
      xjCloseOrderTime: '',
      zybCloseOrderTime: '',
      url: '/product/api/NewTheaterTicket/getTheaterSaleCorpcodePage',
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
    addCancel () {
      this.modal1 = false
    },
    realAdd () {
      this.btnLoading = true
      this.formItem.mainUserId = this.mainUserId
      this.$refs.formItem.validate(val => {
        if (val) {
          apiPost(
            this.pageType == 'add'
              ? '/product/api/NewTheaterTicket/saveTheaterSaleCorpcode'
              : '/product/api/NewTheaterTicket/editTheaterSaleCorpcodeVoSave',
            this.formItem
          ).then(res => {
            if (res.status == 200) {
              this.$Message.success(
                this.pageType == 'add' ? '新增成功!' : '编辑成功!'
              )
              this.modal1 = false
              this.$store.dispatch('postApi')
            } else {
              this.$Message.warning(res.message)
            }
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
        }
      })
    },
    add () {
      this.pageType = 'add'
      this.formItem = {
        id: '',
        corpCode: '',
        corpName: ''
      }
      this.modal1 = true
    },
    mutiSelect (selection) {
      this.selection = selection
    },
    del (id) {
      this.mode = 'post'
      this.content = '确认删除吗?'
      this.sucessMsg = '删除成功!'
      this.$refs.confirmModel.confirm(
        '/product/api/NewTheaterTicket/deleteTheaterSaleCorpcodeVoById?id=' + id + '&mainUserId=' + this.mainUserId
      )
    },
    up () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        this.mode = 'post'
        this.content = '确认上架吗?'
        this.sucessMsg = '上架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/NewTheaterPlace/batchIsPlaceEnabledDisable?ids=' +
          arr.join(',') +
          '&enabled=T' + '&mainUserId=' + this.mainUserId
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
        this.mode = 'post'
        this.content = '确认下架吗?'
        this.sucessMsg = '下架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/NewTheaterPlace/batchIsPlaceEnabledDisable?ids=' +
          arr.join(',') +
          '&enabled=F' + '&mainUserId=' + this.mainUserId
        )
      } else {
        this.$Message.warning('请选择下架项')
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
