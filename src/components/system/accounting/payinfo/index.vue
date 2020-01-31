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
        <Button type="error" icon="android-refresh" @click="fresh">刷新账户信息</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="done"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position='right' :label-width="70" ref="formItem" :rules="ruleForm">
          <FormItem label="名称：" prop="name">
            <Input v-model="formItem.name" placeholder="填写名称"></Input>
          </FormItem>
          <FormItem label="编码：" prop='payCode'>
            <Input v-model="formItem.payCode"  placeholder="填写编码" type="text"></Input>
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
import {apiGet} from "@/fetch/api.js"
export default {
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
          sortable: true
        },
        {
          title: '编码',
          key: 'payCode',
          sortable: true
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
            const actions = [{
              title: '账户信息详情',
              action: () => {
                this.$router.push("/accountTypeDetail/" + params.row.id)
              }
            },
            {
              title: '修改',
              action: () => {
                this.modal = true
                this.modalTitle = '修改类型'
                this.formItem.name = params.row.name
                this.formItem.payCode = params.row.payCode
                this.formItem.remark = params.row.remark
                this.formItem.id = params.row.id
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('/admin/accountInfo/del?id=' + params.row.id)
                this.$store.dispatch('postApi');
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
      url: '/admin/accountInfo/grid',
      searchItems: [
        {
          label: '名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '编码',
          type: 'input',
          name: 'payCode'
        }
      ],
      modal: false,
      formItem: {
        name: '',
        payCode: '',
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
        payCode: [
          {required: true, message: '请输入编码', trigger: 'blur'}
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
      let _this = this
      let url = _this.type === 'add' ? '/admin/accountInfo/save' : '/admin/accountInfo/updateAccountInfo'
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
      this.formItem.payCode = ''
      this.formItem.remark = ''
       this.formItem.id = ''
      this.modalTitle = '添加类型'
    },
    fresh(){
      apiGet("/admin/accountInfo/refreshPayInfo").then(res => {
        if(res.success || res.status == 200){
          let msg = res.message ? res.message : '操作成功！'
          this.$Message.success(msg);
          this.$store.dispatch('postApi')
        }else{
          let msg = res.message ? res.message : '操作失败！'
          this.$Message.warning(msg)
        }        
      })
    }
  }
}
</script>
