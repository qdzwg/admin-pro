<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             mode="delete"
             :content="content"></confirm>
    <modalForm v-model="modalForm"
               :title="modalFormTitle"
               :formRef="$refs.formItem"
               :formAction="formAction"
               :formParams="formParams">
      <Form :model="formItem"
            label-position="right"
            :label-width="150"
            ref="formItem"
            :rules="ruleForm">
        <FormItem label="角色名称："
                  prop="roleName">
          <Input v-model="formItem.roleName"
                 placeholder="填写角色名称"></Input>
        </FormItem>
        <FormItem label="账户类型：">
          {{accName}}
        </FormItem>
        <FormItem label="状态：">
          <i-switch v-model="switchStatue"
                    size="large"
                    @on-change="switchChange">
            <span slot="close">停用</span>
            <span slot="open">启用</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="formItem.remark"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
      </Form>
    </modalForm>
  </div>
</template>
<script>
import list from '@/components/global/list'
import confirm from '@/components/global/confirm'
import modalForm from '@/components/global/modalForm'
export default {
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '角色名称',
          key: 'roleName'
        },
        {
          title: '账户类型',
          key: 'accType',
          render: (h, params) => {
            return h('span', this.filter.accountfunType(params.row.accType))
          }
        },
        {
          title: '状态',
          key: 'useFlag',
          render: (h, params) => {
            return h('span', this.filter.accountState(params.row.useFlag))
          }
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '权限',
                action: () => {
                  this.$router.push({ path: '/productRoleAuthority', query: { id: params.row.id } })
                }
              },
              {
                title: '编辑',
                action: () => {
                  this.showModal('edit', params.row)
                }
              },
              {
                title: '删除',
                action: () => {
                  this.content = '确定要删除吗？'
                  this.$refs.confirmModel.confirm('/admin/sysProductRole/' + params.row.id)
                }
              }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      params: { accType: this.$cookies.get('accType') },
      url: '/admin/sysProductRole/grid',
      searchItems: [
        {
          label: '角色名称',
          type: 'input',
          name: 'roleName'
        },
        {
          label: '状态',
          type: 'select',
          name: 'useFlag',
          data: [
            {
              value: '',
              label: '--请选择--'
            },
            {
              value: '1',
              label: '启用'
            },
            {
              value: '0',
              label: '禁用'
            }
          ]
        }
      ],
      hannleItems: [
        {
          title: '新增',
          icon: 'android-add',
          callback: () => {
            this.showModal('add')
          }
        },
        {
          title: '删除',
          icon: 'android-delete',
          type: 'error',
          callback: () => {
            this.delAll()
          }
        }
      ],
      content: '',
      formItem: {
        roleName: '',
        remark: '',
        accType: this.$cookies.get('accType'),
        userInfoId: this.$cookies.get('userInfoId')
      },
      switchStatue: true,
      ruleForm: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      modalForm: false,
      modalFormTitle: '',
      formParams: {},
      formAction: '',
      accName: this.filter.accountfunType(this.$cookies.get('accType'))
    }
  },
  components: { list, confirm, modalForm },
  methods: {
    showModal (type, row) {
      this.modalForm = true
      if (type === 'add') {
        delete this.formItem.id
        delete this.formItem._method
        this.formItem.roleName = ''
        this.switchStatue = true
        this.formItem.remark = ''
        this.modalFormTitle = '新增产品角色'
        this.formAction = '/admin/sysProductRole/save'
      } else if (type === 'edit') {
        this.modalFormTitle = '编辑产品角色'
        this.formItem.roleName = row.roleName
        this.formItem.remark = row.remark
        this.switchStatue = row.useFlag === '1'
        this.formItem.id = row.id
        this.formItem._method = 'put'
        this.formAction = '/admin/sysProductRole/updateNew'
      }
      this.formItem.useFlag = this.switchStatue ? 1 : 0
      this.formParams = this.formItem
    },
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.content = '确定要删除吗？'
        this.$refs.confirmModel.confirm('/admin/sysProductRole/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    switchChange (value) {
      this.formItem.useFlag = value ? 1 : 0
    }
  }
}
</script>
