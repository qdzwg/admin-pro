<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
       <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">新增</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" mode="delete"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
          <FormItem label="角色名称：" prop="roleName">
            <Input v-model="formItem.roleName" placeholder="填写角色名称"></Input>
          </FormItem>
          <FormItem label="账户类型：">
            <!-- <Input v-model="formItem.accType" v-show=false></Input> -->
            管理员
          </FormItem>
          <FormItem label="状态：">
            <i-switch v-model="formItem.switch" size="large">
                <span slot="close">停用</span>
                <span slot="open">启用</span>
            </i-switch>
          </FormItem>
          <FormItem label="备注：">
            <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
        </Form>
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
            return h('span', this.filter.accountType(params.row.accType))
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
          width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '编辑',
              action: () => {
                this.modal = true
                this.modalTitle = '编辑角色'
                this.formItem.roleName = params.row.roleName
                this.formItem.remark = params.row.remark
                this.formItem.switch = params.row.useFlag === '1'
                this.formItem.id = params.row.id
                this.formItem._method = 'put'
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('list/admin/sysRole/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
      url: 'list/admin/sysRole/grid',
      searchItems: [
        {
          label: '角色名称',
          type: 'input',
          name: 'roleName'
        },
        // {
        //   label: '登录时间',
        //   type: 'date',
        //   name: 'createTime'
        // },
        {
          label: '状态',
          type: 'select',
          name: 'useFlag',
          data: [
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
      modal: false,
      formItem: {
        roleName: '',
        switch: true,
        remark: ''
      },
      modalTitle: '新增角色',
      type: 'add',
      loading: true,
      ruleForm: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: {searchForm, gridTable, confirm},
  methods: {
    test(){
      this.$router.push("/test")
    },
    ok () {
      this.formItem.accType = 0
      this.formItem.useFlag = this.formItem.switch ? 1 : 0
      let _this = this
      let url = _this.type === 'add' ? 'list/admin/sysRole/saveRole' : 'list/admin/sysRole/update'
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: 'modal',
        callback (res) {
          if (res.success) {
            _this.modal = false
          }
        }
      })
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    showModal () {
      this.modal = true
      this.type = 'add'
      this.formItem.roleName = ''
      this.formItem.switch = true
      this.formItem.remark = ''
      this.modalTitle = '新增角色'
    },
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('list/admin/sysRole/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>
