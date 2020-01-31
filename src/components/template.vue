<template>
  <div class="peizhi-wrap">
    <page-template :search-items='searchItems'
                   :columns="columns"
                   pageFlag
                   :url="url"
                   ref="pageWrap">
      <Row v-if="pageBtnParams.length"
           slot="topbtn"
           slot-scope="slotProps">
        <Button class="page-btn"
                :type="item.type"
                :icon="item.icon"
                v-for="(item,index) in pageBtnParams"
                @click="actionBtns(index,slotProps.selectedList)"
                :key="index">{{item.name}}</Button>
      </Row>
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
        {
          label: "产品名称",
          type: "input",
          name: "name"
        },
        {
          label: "商户名称",
          type: "input",
          name: "mchname"
        },
        
        {
          label: "景区名称",
          type: "select",
          name: "scenicName",
          data:[
            {
              value:'',
              label:'全部'
            },
            {
              value:0,
              label:'杭州宋城'
            },
            {
              value:1,
              label:'杭州乐园'
            },
            {
              value:2,
              label:'三亚千古情'
            },
            {
              value:3,
              label:'丽江千古情'
            }
          ]
        },
        {
          label: "产品类型",
          type: "select",
          name: "proType",
          data:[
            {
              value:'',
              label:'全部'
            },
             {
              value:'',
              label:'演出'
            },
             {
              value:'',
              label:'乐园'
            },
             {
              value:'',
              label:'酒店'
            },
          ]
        },
      ],
      pageBtnParams: [
        {
          btnType: 'router',
          link: '',
          icon: 'android-add',
          type: 'primary',
          name: '添加'
        },
        {
          btnType: 'url',
          link: '',
          icon: 'android-delete',
          type: 'error',
          name: '删除'
        },
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
    },
    /**
    * 操作表格全局按钮
    * @param {number} index 全局按钮索引
    * @param {object} selectedList 已选择表格数据
    */
    actionBtns (index, selectedList) {
      const confirmFun = this.$refs.pageWrap.confirm
      let ids = ''
      let idArr = []
      let { btnType } = this.pageBtnParams[index]
      if (btnType === 'url' && (!selectedList || !selectedList.length)) {
        return this.$Message.warning('请至少选择一条数据!')
      } else if (btnType === 'url' && selectedList && selectedList.length) {
        selectedList.forEach(element => {
          idArr.push(element.id)
        })
        ids = idArr.join(',')
      }
      switch (index) {

      }
    },
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