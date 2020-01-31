<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
       <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">添加</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-arrow-back" @click="back">返回</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="delete"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position='right' :label-width="70" ref="formItem" :rules="ruleForm">
          <FormItem label="名称：" prop="name">
            <Input v-model="formItem.name" placeholder="填写名称"></Input>
          </FormItem>
          <FormItem label="KEY：" prop='payKey'>
            <Input v-model="formItem.payKey"  placeholder="填写KEY" type="text"></Input>
          </FormItem>
           <FormItem label="内容：">
            <Input v-model="formItem.payValue"  placeholder="填写内容" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          <FormItem label="备注：">
            <Input v-model="formItem.remark" placeholder="填写备注" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import store from "@/store"
export default {
   beforeRouteEnter (to, from, next) {
            next(vm => {
                if(!store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)){
                     vm.$router.back()//如果没有就不会跳转
                }
            })
        },
  data () {
    return {
      columns: [
        {
          title: '序号',
          width: 120,
          align: 'center',
          render: (h,params) => {
             return h('span', params.index + 1)
          }
        },
        {
          title: '名称',
          key: 'name',
          sortable: true,
          width:150
        },
        {
          width:150,
          title: 'KEY',
          key: 'payKey',
          sortable: true
        },
         {
          title: '内容',
          key: 'payValue'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          // width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '修改',
              action: () => {
                this.modal = true
                this.modalTitle = '修改'
                this.formItem.name = params.row.name
                this.formItem.payKey = params.row.payKey
                this.formItem.payValue = params.row.payValue
                this.formItem.remark = params.row.remark
                this.formItem.id = params.row.id
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('/admin/accountDetail/' + params.row.id)
                this.$store.dispatch('postApi')
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'modifyTime', order: 'desc',payInfoId:this.$route.params.id},
      url: '/admin/accountDetail/grid?accountInfoId=' + this.$route.params.id,
      // admin/accountDetail/grid?accountInfoId=84
      searchItems: [
        {
          label: '名称',
          type: 'input',
          name: 'name'
        },
        {
          label: 'KEY',
          type: 'input',
          name: 'payKey'
        }
      ],
      modal: false,
      formItem: {
        payInfoId: this.$route.params.id,
        name: '',
        payKey: '',
        payValue: '',
        remark: '' ,
        id: ''
      },
      modalTitle: '新增角色',
      type: 'add',
      loading: true,
      ruleForm: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        payKey: [
          {required: true, message: '请输入KEY', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    
    // console.log(this.$route.params.id)
    // this.loadpage(this.params)
  },
  components: {searchForm, gridTable, confirm},
  methods: {
    test(){
      this.$router.push("/test")
    },
    ok () {
      let _this = this
      let url = _this.type === 'add' ? '/admin/accountDetail/save' : '/admin/accountDetail/updateAccountDetail'
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: 'modal',
        callback (res) {
          if (res.success) {
            _this.$Message.success(_this.type === 'add'?'添加成功!':'修改成功!')
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
      this.formItem.name = ''
      this.formItem.payKey = ''
      this.formItem.payValue = ''
      this.formItem.remark = ''
       this.formItem.id = ''
      this.modalTitle = '添加'
    },
    back(){
      this.$router.back()
    }
  }
}
</script>
