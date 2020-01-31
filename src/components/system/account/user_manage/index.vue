<template>
  <div class="user-manage">
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :mode="mode"
             :sucessMsg="sucessMsg"></confirm>

    <!-- 权限 -->
    <Modal v-model="authorityModal"
           title="权限"
           @on-ok="ok2"
           @on-cancel="cancel2">
      <Tree :data="data2"
            ref="tree"
            show-checkbox
            multiple></Tree>
    </Modal>
    <modalForm v-model="modalForm"
               :title="modalFormTitle"
               :formRef="$refs.formItem"
               :formAction="formAction"
               :formParams="formParams">
      <Form :model="formItem"
            ref="formItem"
            :label-width="120"
            :rules="ruleForm">
        <FormItem label="用户编号"
                  v-show="type=='edit'">
          {{formItem.accNo}}
        </FormItem>
        <FormItem label="用户名"
                  v-show="type=='edit'">
          {{formItem.accName}}
        </FormItem>
        <FormItem label="用户名"
                  prop="accName"
                  v-show="type=='add'">
          <Input v-model="formItem.accName"
                 style="width:65%"></Input>
        </FormItem>
        <FormItem label="真实姓名"
                  prop="realName">
          <Input v-model="formItem.realName"
                 style="width:65%"></Input>
        </FormItem>
        <FormItem label="用户类型"
                  v-show="type=='edit'">
          {{formItem.accType | accountfunType}}
        </FormItem>
        <FormItem label="用户状态"
                  prop="accStatus">
          <Select v-model="formItem.accStatus"
                  style="width:200px">
            <Option value="T">正常</Option>
            <Option value="F">锁定</Option>
          </Select>
        </FormItem>
        <FormItem label="用户角色"
                  prop="userRole">
          <Select v-model="formItem.userRole"
                  style="width:200px"
                  placeholder="请选择用户角色"
                  transfer>
            <Option v-for="(item,index) in userRoles"
                    :value="item.value"
                    :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="formItem.gender">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否导游">
          <RadioGroup v-model="formItem.isGuide">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="终端权限">
          <CheckboxGroup v-model="pageData.terminalFun">
            <Checkbox label="admin">
              <span>管理后台</span>
            </Checkbox>
            <Checkbox label="lotsApp">
              <span>lots商城app</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="电子邮箱"
                  prop="email">
          <Input v-model="formItem.email"
                 style="width:65%"></Input>
        </FormItem>
        <FormItem label="手机"
                  prop="mobile">
          <Input v-model="formItem.mobile"
                 style="width:65%"></Input>
        </FormItem>
        <FormItem label="生日">
          <DatePicker type="date"
                      :editable="false"
                      :value="formItem.birthday"
                      format="yyyy-MM-dd"
                      @on-change="setBegDate"
                      transfer></DatePicker>
        </FormItem>
        <FormItem label="证件号码"
                  prop="certificateNo">
          <Input v-model="formItem.certificateNo"
                 style="width:65%"></Input>
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
      authorityModal: false,
      data2: [],
      authorityId: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'accName',
          sortable: true
        },
        {
          title: '用户编号',
          key: 'accNo',
          sortable: true
        },
        {
          title: '真实姓名',
          key: 'realName',
          sortable: true
        },
        {
          title: '用户类型',
          key: 'accType',
          sortable: true,
          render: (h, params) => {
            return h('span', this.filter.accountfunType(params.row.accType))
          }
        },
        {
          title: '用户状态',
          key: 'accStatus',
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.accStatus == 'T' ? '正常' : '锁定')
          }
        },
        {
          title: '管理员标识',
          key: 'ifAdmin',
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.ifAdmin == 'T' ? '是' : '否')
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '重置密码',
                action: () => {
                  this.content = '确认重置密码？'
                  this.mode = 'done'
                  this.sucessMsg = '重置成功！'
                  this.$refs.confirmModel.confirm(
                    '/admin/userInfo/resetPassword?id=' + params.row.id
                  )
                }
              },
              {
                title: '编辑',
                action: async () => {
                  let res = await this.apiPost('/admin/webapi/userInfo/edit?id=' + params.row.id)
                  if (res.data) {
                    this.userAdd('edit', res.data)
                  }
                }
              },
              {
                title: '删除',
                action: () => {
                  this.content = '确认删除？'
                  this.mode = 'done'
                  this.sucessMsg = '删除成功！'
                  this.$refs.confirmModel.confirm(
                    '/admin/userInfo/delete/?id=' + params.row.id
                  )
                }
              }
            ]
            if (params.row.ifAdmin === 'F') {
              actions.push({
                title: '权限',
                action: () => {
                  this.authorityModal = true
                  this.authorityId = params.row.id
                  this.apiPost(
                    '/admin/webapi/userProductRole/permission?userInfoId=' +
                    this.authorityId
                  ).then(res => {
                    if (res.data) {
                      res.data.map(ele => {
                        ele.title = ele.funName
                      })
                      this.data2 = res.data
                    }
                  })
                }
              })
            }
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      url: '/admin/userInfo/grid',
      searchItems: [
        {
          label: '用户名',
          type: 'input',
          name: 'accName'
        },
        {
          label: '用户编号',
          type: 'input',
          name: 'accNo'
        },
        {
          label: '真实姓名',
          type: 'input',
          name: 'realName'
        },
        {
          label: '状态',
          type: 'select',
          name: 'accStatus',
          data: [
            {
              value: '',
              label: '--请选择用户状态--'
            },
            {
              value: '0',
              label: '正常'
            },
            {
              value: '1',
              label: '锁定'
            }
          ]
        }
      ],
      hannleItems: [
        {
          title: '新增',
          icon: 'android-add',
          callback: () => {
            this.userAdd('add')
          }
        },
        {
          title: '启用',
          icon: 'android-done',
          callback: () => {
            this.doneAll()
          }
        },
        {
          title: '禁用',
          icon: 'android-close',
          type: 'error',
          callback: () => {
            this.forbiddenAll()
          }
        }
      ],
      modal: false,
      content: '',
      mode: '',
      sucessMsg: '',
      formItem: {
        id: '',
        accNo: '',
        ifAdmin: '',
        accType: '',
        accName: '',
        accStatus: '',
        realName: '',
        gender: '',
        isGuide: '0',
        terminalFun: [],
        email: '',
        mobile: '',
        birthday: '',
        certificateNo: '',
        userRole: ''
      },
      modalTitle: '操作员管理',
      userRoles: [],
      type: 'add',
      ruleForm: {
        accName: [
          {
            required: true,
            validator: this.common.validate.floatNumber,
            trigger: 'blur'
          }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        email: [{ type: 'email', message: '邮箱格式错误', trigger: 'blur' }],
        mobile: [{ validator: this.common.validate.phone, trigger: 'blur' }],
        certificateNo: [
          { validator: this.common.validate.IdCodeValid, trigger: 'blur' }
        ],
        userRole: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ],
        accStatus: [
          { required: true, message: '请选择用户状态', trigger: 'change' }
        ]
      },
      modalForm: false,
      modalFormTitle: '',
      formParams: {},
      formAction: ''
    }
  },
  mounted () {
    // this.loadpage(this.params)
    this.apiPost('/admin/sysRole/grid', {
      page: 1,
      limit: 10,
      sort: 'createTime',
      order: 'desc',
      accType: 4
    }).then(res => {
      if (res.rows && res.rows.length) {
        res.rows.map(ele => {
          this.userRoles.push({
            value: ele.id.toString(),
            label: ele.roleName
          })
        })
      }
    })
  },
  components: { list, confirm, modalForm },
  methods: {
    setBegDate (time) {
      this.formItem.birthday = time
    },
    ok2 () {
      let data = this.$refs.tree.getCheckedNodes()
      let arr = []
      data.map(item => {
        if (item.checked) {
          arr.push(item.id)
        }
      })
      this.apiPost('/admin/userProductRole/addFunToRole.htm', {
        userInfoId: this.authorityId,
        ids: arr.join(',')
      }).then(res => {
        if (res.success) {
          this.$Message.success('操作成功')
          this.authorityModal = false
        }
      })
    },
    cancel2 () {
      this.authorityModal = false
    },
    ok () {
      let _this = this

      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let url =
            _this.type === 'add'
              ? '/admin/userInfo/saveUserInfo'
              : '/admin/webapi/userInfo/saveUserInfo'
          if (_this.type === 'add') {
            delete this.formItem.id
            delete this.formItem.ifAdmin
          } else {
            delete this.formItem.certificateType
          }
          let res = await this.apiPost(url, this.formItem)
          if (res.status === 200) {
            this.modal = false
            this.$Message.success(res.message)
          }
        }
      })
    },
    userAdd (type, row) {
      this.modalForm = true
      this.type = type
      if (type === 'add') {
        this.formItem.accName = ''
        this.formItem.accNo = ''
        this.formItem.accType = ''
        this.formItem.accStatus = ''
        this.formItem.realName = ''
        this.formItem.gender = ''
        this.formItem.email = ''
        this.formItem.mobile = ''
        this.formItem.birthday = ''
        this.formItem.certificateNo = ''
        this.modalFormTitle = '新增操作员'
        this.formAction = '/admin/userInfo/saveUserInfo'
      } else if (type === 'edit') {
        this.formItem = row.UserInfoEditDto
        this.modalFormTitle = '编辑操作员'
        this.formAction = '/admin/webapi/userInfo/saveUserInfo'
        console.log(this.formItem)
      }
      this.formParams = this.formItem
    },
    doneAll () {
      this.content = '确认启用？'
      this.sucessMsg = '操作成功！'
      this.mode = 'done'
      let selection = this.$refs.gridTable.selection
      if (selection && selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        ids = ids.slice(0, ids.length - 1)
        this.$refs.confirmModel.confirm(
          '/admin/webapi/userInfo/enable?enable=T&ids=' + ids
        )
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    forbiddenAll () {
      this.content = '确认禁用？'
      this.sucessMsg = '操作成功！'
      this.mode = 'done'
      let selection = this.$refs.gridTable.selection
      if (selection && selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        ids = ids.slice(0, ids.length - 1)
        this.$refs.confirmModel.confirm(
          '/admin/webapi/userInfo/enable?enable=F&ids=' + ids
        )
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.user-manage {
  .userInfo {
    border-top: 1px solid #dddddd;
  }
  .userInfo-table {
    width: 100%;
  }
  .userInfo-table td {
    padding: 8px;
    border-bottom: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
  }
  .userInfo-table tr td:last-child {
    border-right: 2px solid #dddddd;
  }
}
</style>
