<template>
  <div class="peizhi-wrap">
    <page-template :search-items='searchItems'
                   :columns="columns"
                   pageFlag
                   :url="url"
                   ref="pageWrap">
    </page-template>
    <the-modal v-model="modal"
               :title="modalTitle"
               @ok="ok"
               @cancel="cancel">
      <Form :model="formItem"
            label-position="left"
            :label-width="100"
            ref="formValidate"
            :rules="ruleForm">
        <FormItem label="管理员账号："
                  prop="qyAccount">
          <Input v-model="formItem.qyAccount"
                 placeholder="请输入管理员账号"></Input>
        </FormItem>
        <FormItem label="密码："
                  prop="qyPassword">
          <Input v-model="formItem.qyPassword"
                 placeholder="请输入密码"
                 type="password"></Input>
        </FormItem>
        </FormItem>
      </Form>
    </the-modal>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      url: "merchant/merchantWholeMarket/grid",
      searchItems: [
      ],
      columns: [
        {
          title: '店铺名称',
          align: 'center',
          key: 'merchantName',
          render: (h, params) => {
            let { merchantName } = params.row
            return h('span', merchantName)
          }
        },
        {
          title: '景区企业码',
          align: 'center',
          key: 'marketDisAccount',
        },
        {
          title: '景区管理员账户',
          align: 'center',
          key: 'qyAccount',
        },
        {
          title: '专属分销商账户',
          algin: 'center',
          key: 'disAccname',
        },
        {
          title: '操作',
          key: 'action',
          width: 360,
          align: 'center',
          render: (h, params) => {
            let { id, qyAccount, qyPassword } = params.row
            const actions = [
              {
                title: '修改/添加管理员帐户',
                action: () => {
                  // /merchant/merchantWholeMarket/toSaveWhole
                  this.modal = true
                  this.formItem.qyAccount = qyAccount
                  this.formItem.qyPassword = qyPassword
                  this.formItem.id = id
                }
              },
              {
                title: '一键登录管理员',
                action: () => {
                  this.$refs.pageWrap.request({
                    url: "merchant/merchantWholeMarket/loginQy",
                    method: 'get',
                    param: { id },
                    isTip: false
                  }).then(res => {
                    if (res.data) {
                      window.open(res.data.qyxxLogin);
                    }
                  })
                }
              },
              {
                title: '综合设置',
                action: () => {
                  this.$refs.pageWrap.request({
                    url: "merchant/merchantWholeMarket/loginQy",
                    method: 'get',
                    param: {
                      id: id,
                      isCompreSet: 'T'
                    },
                    isTip: false
                  }).then(res => {
                    console.log(res)
                    let data = res.data
                    if (data.success) {
                      window.open(data.qyxxLogin);
                    }
                  })


                }
              }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }

      ],
      modal: false,
      modalTitle: '修改或添加管理员',
      formItem: {},
      ruleForm: {
        qyAccount: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        qyPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    ok () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$refs.pageWrap.request({
            url: "merchant/merchantWholeMarket/toSaveWhole",
            method: 'get',
            param: { ...this.formItem }
          }).then(res => {
            if (res.data) {
              this.modal = false
            }
          })
        }
      })
    },
    cancel () {
      this.modal = false
      this.$refs.formValidate.resetFields()
    }
  },
  created () { },
  mounted () {
  }
};
</script>
<style lang="scss" scoped>
.peizhi-wrap {
}
</style>