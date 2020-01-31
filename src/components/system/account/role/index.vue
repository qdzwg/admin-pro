<template>
  <div>
    <roleForm></roleForm>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"   
          
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel" mode="delete" :content="content"></confirm>
    <!-- 弹出树形结构层 -->
    <Modal v-model="setPermissionModal"
           title="设置权限"
           @on-ok="ok2"
           @on-cancel="test2">
      <Tree :data="data2"
            ref="tree"
            show-checkbox
            multiple></Tree>
    </Modal>
    <!-- <modalForm v-model="modalForm"
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
          <i-switch v-model="formItem.switch"
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
    </modalForm> -->
  </div>
</template>
<script>
import list from '@/components/global/list'
import confirm from '@/components/global/confirm'
import modalForm from '@/components/global/modalForm'
import roleForm from '@/components/global/roleForm'
export default {
  data () {
    return {
      content: '<div style="color:red">确定要删除吗?</div>',
      setPermissionModal: false,
      roleId: '',
      data2: [],
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
          title: '状态',
          key: 'useFlag',
          render: (h, params) => {
            return h('span', this.filter.accountState(params.row.useFlag))
          }
        },
        // {
        //   title: '账户类型',
        //   key: 'accType',
        //   render: (h, params) => {
        //     return h('span', this.filter.accountfunType(params.row.accType))
        //   }
        // },        
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '创建人/时间',
          render: (h, params) => {
            let createBy = params.row.createBy;
            let createTime = params.row.createTime;
            return h("div", [
              h('p', { style: {
                fontSize: '12px'
              }}, createBy),
              h('p',{ style: {
                fontSize: '12px'
              }}, createTime)
            ])
          }
        },
        {
          title: '更新人/时间',
          render: (h, params) => {
            let modifyBy = params.row.modifyBy;
            let modifyTime = params.row.modifyTime;
            return h("div", [
              h('p', modifyBy),
              h('p', modifyTime)
            ])
          }
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
                  this.setPermissionModal = true
                  this.roleId = params.row.id
                  this.apiGet(
                    '/admin/sysRole/funTree.htm?roleId=' + this.roleId
                  ).then(res => {
                    let data = res
                    let sheng = [] // 主菜单
                    let shi = [] // 副菜单
                    let arr = []
                    data.map(item => {
                      item.title = item.funName
                    })
                    // 第一级
                    data.map(item => {
                      if (!item.parentId) {
                        sheng.push(item)
                      } else {
                        shi.push(item)
                      }
                    })
                    // 第二级
                    sheng.map(function (item, index) {
                      delete item.checked
                      item.children = []
                      shi.map(function (ele, i) {
                        if (item.id === ele.parentId) {
                          delete ele.checked
                          item.children.push(ele)
                        } else {
                          //   shi.push(item);
                        }
                      })
                    })
                    // 第三级
                    shi.map(item => {
                      item.children = []
                      data.map(ele => {
                        if (item.id == ele.parentId) {
                          item.children.push(ele)
                        }
                      })
                    })
                    this.data2 = sheng
                  })
                }
              },
              {
                title: '编辑',
                action: () => {
                  this.goAdd(params.row.id, params.row.roleName, params.row.useFlag);
                }
              },
              {
                title: '删除',
                action: () => {
                  this.$refs.confirmModel.confirm(
                    '/admin/sysRole/' + params.row.id
                  )
                }
              }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      params: { accType: this.$cookies.get('accType') },
      url: '/admin/sysRole/grid',
      hannleItems: [
        {
          title: '新增',
          icon: 'android-add',
          callback: () => {
            // this.showModal('add')
            this.goAdd();
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
      modalForm: false,
      modalFormTitle: '',
      formParams: {},
      formAction: ''
    }
  },
  components: { list, confirm, modalForm, roleForm },
  methods: {
    goAdd(id, roleName, useFlag) {
      if(id){
        this.$router.push({path:'/roleAddOrEdit', query:{id, roleName, useFlag}});
      }else{
        this.$router.push('/roleAddOrEdit');
      };
    },
    ok2 () {
      let data = this.$refs.tree.getCheckedNodes()
      let arr = []
      data.map(item => {
        if (item.checked == true) {
          arr.push(item.id)
        }
      })
      this.apiPost('/admin/sysRole/addFunToRole.htm', {
        roleId: this.roleId,
        ids: arr.join(',')
      }).then(res => {
        if (res.success) {
          this.$Message.success('操作成功')
          this.setPermissionModal = false
        }
      })
    },
    test2 () {
      this.setPermissionModal = false
    },
    test () {
      this.$router.push('/test')
    },
    showModal (type, row) {
      // this.modal = true
      this.modalForm = true
      if (type === 'add') {
        this.formItem.roleName = ''
        this.formItem.switch = true
        this.formItem.remark = ''
        this.modalFormTitle = '新增角色'
        this.formAction = '/admin/sysRole/saveRole'
      } else if (type === 'edit') {
        this.modalFormTitle = '编辑角色'
        this.formItem.roleName = row.roleName
        this.formItem.remark = row.remark
        this.formItem.switch = row.useFlag === '1'
        this.formItem.id = row.id
        this.formAction = '/admin/sysRole/updateRole'
      }
      this.formItem.accType = this.$cookies.get('accType')
      this.formItem.useFlag = this.formItem.switch ? 1 : 0
      this.formParams = this.formItem
    },
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection && selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('/admin/sysRole/' + ids)
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
