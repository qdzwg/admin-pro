<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"></list>
    <confirm ref="confirmModel"
             :mode="mode"
             :content="content"
             :sucessMsg="sucessMsg"></confirm>
    <!-- 弹出层 -->
    <Modal width="800"
           v-model="modal"
           :title="modalTitle"
           :loading="loading"
           @on-ok="ok"
           @on-cancel="cancel"
           :type="type">
      <Form :model="formItem"
            label-position="right"
            :label-width="100"
            ref="formItem"
            :rules="ruleForm">
        <FormItem label="所属景区：">
          千岛湖东南湖区
        </FormItem>
        <FormItem label="票型名称：">
          {{formItem.modelName}}
        </FormItem>
        <FormItem label="库存：">
          {{formItem.stockModel=='unlimit'?'无限库存':formItem.stockModel}}
        </FormItem>
        <FormItem label="票型别名："
                  prop="nickName">
          <Input v-model="formItem.nickName"
                 placeholder="填写模板名称"></Input>
        </FormItem>
        <FormItem v-if="modal"
                  label="预订须知：">
          <ueditor v-model="formItem.bookRemind"></ueditor>
        </FormItem>
        <FormItem label="销售渠道：">
          <RadioGroup v-model="formItem.saleChannel">
            <Radio label="wap">
              <span>wap</span>
            </Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
    <!-- 预览 -->
    <qrcode-modal :url='QRcodeUrl'
                  ref="qrcodemodal"
                  v-model="qrcodeShow"></qrcode-modal>
  </div>
</template>
<script>
import list from '@/components/global/list'
import confirm from '@/components/global/confirm'
import store from '@/store'
import ueditor from '@/components/global/vueUEditor'
import qrcodeModal from '@/components/global/viewQrcode'
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (
        !store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)
      ) {
        vm.$router.back() // 如果没有就不会跳转
      }
    })
  },
  data () {
    return {
      phone: '',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 120
      },
      sucessMsg: '',
      content: '',
      mode: '',
      uploadList: {},
      typeList: [
        {
          value: '0',
          label: '基础'
        },
        {
          value: '1',
          label: '场景专题'
        },
        {
          value: '2',
          label: '付费专区'
        }
      ],
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '模板名称',
          key: 'modelName'
        },
        {
          title: '产品名称',
          key: 'nickName'
        },
        {
          title: '产品编号',
          key: 'modelCode'
        },
        {
          title: '来源',
          key: 'prodFrom',
          render: (h, params) => {
            let prodFrom =
              params.row.prodFrom === 'dist_market' ? '分销' : '自营'
            return h('span', prodFrom)
          }
        },
        {
          title: '上下架',
          key: 'enabled',
          render: (h, params) => {
            let enabled = params.row.enabled === 'T' ? '已上架' : '已下架'
            return h('span', enabled)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: params.row.enabled === 'T' ? '下架' : '上架',
                action: () => {
                  this.mode = 'done'
                  this.content =
                    params.row.enabled === 'T' ? '确认下架吗?' : '确认上架吗？'
                  this.sucessMsg =
                    params.row.enabled === 'T' ? '下架成功！' : '上架成功！'
                  this.$refs.confirmModel.confirm(
                    '/merchant/merchantParkTicket/enable?id=' +
                    params.row.id +
                    '&enable=' +
                    (params.row.enabled === 'T' ? 'F' : 'T') +
                    '&' +
                    params.row.id
                  )
                }
              },
              {
                title: '完善信息',
                action: () => {
                  this.modal = true
                  this.formItem.modelName = params.row.modelName
                  this.formItem.stockModel = params.row.stockModel
                  this.formItem.nickName = params.row.nickName
                  this.formItem.bookRemind = params.row.bookRemind
                  this.formItem.id = params.row.id
                  // this.$refs.mustKnow.init()
                }
              },
              {
                title: '预览',
                action: () => {
                  this.qrcodeShow = true
                  this.QRcodeUrl = '/merchant/merchantParkTicket/previewFL?id=' + params.row.id
                }
              }
            ]
            if (params.row.prodFrom === 'dist_market') {
              actions.push({
                title: '价格日历',
                action: () => {
                  this.$router.push({
                    path: '/parkCalendar/' + params.row.id,
                    query: {
                      ticketId: params.row.parkTicketId,
                      modelType: 'ticket',
                      modelCode: params.row.modelCode
                    }
                  })
                }
              })
            }
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      url: '/merchant/merchantParkTicket/grid?merchantParkId=' + this.$route.params.id,
      searchItems: [
        {
          label: '票型名称',
          type: 'input',
          name: 'modelName'
        },
        {
          label: '状态',
          type: 'select',
          name: 'enabled',
          data: [
            {
              value: '',
              label: '--请选择状态--'
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
        },
        {
          label: '来源',
          type: 'select',
          name: 'prodFrom',
          data: [
            {
              value: '',
              label: '--请选择来源--'
            },
            {
              value: 'prod',
              label: '自营'
            },
            {
              value: 'dist_market',
              label: '分销'
            }
          ]
        }
      ],
      // hannleItems: [
      //   {
      //     title: '同步票型',
      //     icon: 'android-refresh',
      //     callback: () => {
      //       this.asynTickets()
      //     }
      //   }
      // ],
      modal: false,
      formItem: {
        id: this.$route.params.id,
        nickName: '',
        bookRemind: '',
        saleChannel: ''
      },
      modalTitle: '完善信息',
      type: 'add',
      loading: true,
      ruleForm: {
        nickName: [
          { required: true, message: '请输入票型别名', trigger: 'blur' }
        ]
      },
      qrcodeShow: false,
      QRcodeUrl: ''
    }
  },
  mounted () {
    // console.log(this.$route)
    // this.loadpage(this.params)
  },
  components: { list, confirm, ueditor, qrcodeModal },
  methods: {
    ok () {
      let _this = this
      // this.formItem.bookRemind = this.$refs.mustKnow.getUEContent()
      let url = '/merchant/merchantParkTicket/updateMerchantParkTicket'
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: 'modal',
        callback (res) {
          if (res.success) {
            _this.$Message.success('保存成功！')
            _this.modal = false
          }
        }
      })
    },
    cancel () {
      this.$refs.formItem.resetFields()
    }
  }
}
</script>

<style scope>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
