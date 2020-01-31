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
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :test="test" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" mode="delete"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
          <FormItem label="主体账号：" prop="name">
            <Input v-model="formItem.name" placeholder="填写主体账号"></Input>
          </FormItem>
           <FormItem label="供应商企业编码：" prop="destCorpCode">
            <Input v-model="formItem.destCorpCode" placeholder="填写供应商企业编码"></Input>
          </FormItem>
           <FormItem label="目的地企业私钥：" prop="destPrivateKey">
            <Input v-model="formItem.destPrivateKey" placeholder="填写目的地企业私钥"></Input>
          </FormItem>
           <FormItem label="分销商企业编码：" prop="distCorpCode">
            <Input v-model="formItem.distCorpCode" placeholder="填写分销商企业编码"></Input>
          </FormItem>
           <FormItem label="联系人：" prop="linkMan">
            <Input v-model="formItem.linkMan" placeholder="填写联系人"></Input>
          </FormItem>
           <FormItem label="联系电话：" prop="tel">
            <Input v-model="formItem.tel" placeholder="填写联系电话"></Input>
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
          title: '用户名',
          key: 'name'
        },
        {
          title: '供应商企业编号',
          key: 'destCorpCode'
        },
        {
          title: '分销商企业编号',
          key: 'destDistPrivateKey'
        },
        {
          title: '目的企业私钥',
          key: 'destPrivateKey'
        },
        {
          title: '联系人',
          key: 'linkMan'
        },
        {
          title: '联系电话',
          key: 'tel'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '修改',
              action: () => {
                this.modal = true
                this.modalTitle = '编辑角色'
                this.formItem.name = params.row.name
                this.formItem.destCorpCode = params.row.destCorpCode
                this.formItem.destPrivateKey = params.row.destPrivateKey
                this.formItem.distCorpCode = params.row.distCorpCode
                this.formItem.linkMan = params.row.linkMan
                this.formItem.tel = params.row.tel
                this.formItem.id = params.row.id
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.$Message.warning("测试服不敢删除后续改过来")
                
                // this.$refs.confirmModel.confirm('list/admin/sysRole/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: 'dx/dxSysOptions/grid',
      searchItems: [
        {
          label: '用户名',
          type: 'input',
          name: 'name'
        },
        {
          label: '供应商编码',
          type: 'input',
          name: 'destCorpCode'
        },
        {
          label: '联系人',
          type: 'input',
          name: 'linkMan'
        },
        {
          label: '联系电弧',
          type: 'input',
          name: 'tel'
        }
      ],
      modal: false,
      formItem: {
        name: '',
        destCorpCode: '',
        destPrivateKey: '',
        distCorpCode: '',
        linkMan: '',
        tel: '',
        id: ''
      },
      modalTitle: '新增角色',
      type: 'add',
      loading: true,
      ruleForm: {
        name: [
          {required: true, message: '请输入主体账号', trigger: 'blur'}
        ],
        destCorpCode: [
          {required: true, message: '请输入供应商企业编码', trigger: 'blur'}
        ],
        destPrivateKey: [
          {required: true, message: '请输入目的地企业私钥', trigger: 'blur'}
        ],
        distCorpCode: [
          {required: true, message: '请输入分销商企业编码', trigger: 'blur'}
        ],
        linkMan: [
          {required: true, message: '请输入联系人', trigger: 'blur'}
        ],
        tel: [
          {required: true, message: '请输入联系电弧', trigger: 'blur'}
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
      let url = _this.type === 'add' ? 'list/dx/dxSysOptions/save' : 'list/dx/dxSysOptions/' + this.formItem.id
      this.common.formPost(this, {
        url,
        params: _this.type === 'add'?this.formItem:Object.assign(this.formItem,{_method:"put"}),
        mold: 'modal',
        callback (res) {
          if (res.success) {
            _this.$Message.success(_this.type === 'add'?'添加成功!':"修改成功!")
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
      this.formItem.destCorpCode = ''
      this.formItem.destPrivateKey = ''
      this.formItem.distCorpCode = ''
      this.formItem.linkMan = ''
      this.formItem.tel = ''
      this.formItem.id = ''
      this.modalTitle = '添加'
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
