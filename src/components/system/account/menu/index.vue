<template>
  <div>
    <Row :gutter="16" class="btn-groups"> 
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">添加</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-add" @click="saveFuns">同步缓存信息</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="done"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
          <FormItem label="名称：" prop="funName">
            <Input v-model="formItem.funName" placeholder="填写角色名称"></Input>
          </FormItem>
          <FormItem label="唯一编码：" prop="funCode">
            <Input v-model="formItem.funCode" ></Input>
          </FormItem>
          <FormItem label="功能图标：" prop="funIco">
            <Input v-model="formItem.funIco" ></Input>
          </FormItem>
          <FormItem label="URL：" >
            <Input v-model="formItem.funUrl"></Input>
          </FormItem>
          <FormItem label="所属类型：">
                <CheckboxGroup v-model="formItem.funTypes" >
                    <Checkbox v-for="item in funType" :key="item.value" :label="item.value" :value="item.value">{{item.label}}</Checkbox>
                </CheckboxGroup>
          </FormItem>
          <FormItem label="打开方式：" prop="openType">
            <Select v-model="formItem.openType"  style="width:200px">
                <Option v-for="item in openMode" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="标识：">
            <Input v-model="formItem.optType"></Input>
          </FormItem>
          <FormItem label="排序：" prop="sortNo">
            <Input v-model="formItem.sortNo"></Input>
          </FormItem>
         <FormItem label="层级深度：" prop="hierarchy">
            <Select v-model="formItem.hierarchy" style="width:200px">
                <Option v-for="item in Hierarchys" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="功能类型" prop="functionType">
            <Select v-model="formItem.functionType" style="width:200px">
                <Option v-for="item in functionType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      openMode:[
        {             
            value: '_blank',
            label: '打开新页面'                    
        },
        {             
            value: '_self',
            label: '当前页面打开'                    
        }
        ],
      Hierarchys:[
            {
              value: 0,
              label: '一级菜单'  
            },
            {
              value: 1,
              label: '二级菜单'  
            },
            {
              value: 2,
              label: '三级菜单'  
            },
            {
              value: 3,
              label: '四级菜单'  
            }
        ],
        funType:[
            {
              value: '-1',
              label: '系统管理员'  
            },
            {
              value: '0',
              label: '平台管理员'  
            } ,
            {
              value: '1',
              label: '供应商'  
            } ,
            {
              value: '3',
              label: '分销商'  
            } ,
            {
              value: '4',
              label: '店铺用户'  
            }  
        ],
    
      functionType:[
            {
                value:'menu',
                label:'菜单'
            },
            {
                value:'column',
                label:'栏目'
            },
            {
                value:'button',
                label:'按钮'
            }
        ],
      columns: [
         {
            title: '序号',
            align: 'center',
            render: (h,params) => {
                return h('span', params.index + 1)
            }
        },
        {
          title: '名称',
          key: 'funName',
          sortable: true,
        },
        {
          title: '唯一编码',
          key: 'funCode',
          sortable: true,
        
        },
        {
          title: 'URL',
          key: 'funUrl',
          width:250,
          sortable: true,
        },
        {
          title: '所属类型',
          key: 'funType',
          width:150,
          sortable: true,
          render: (h, params) => {
              let _this = this
            // return h('span', this.filter.accountType(params.row.funType))   1,2,3,4 => [1,2,3,4]
            let strArr = []
            this.splits(params.row.funType||"").forEach(function(item,index){
                strArr.push(_this.filter.accountfunType(item))
            })
            return h('span', strArr.join(" "))
          }
        },
        {
          title: '标识',
          key: 'optType',
          sortable: true,
        
        },
        {
          title: '权限类型',
          key: 'functionType',
          sortable: true,
          render: (h, params) => {
            return h('span', this.filter.accountfunctionType(params.row.functionType))
          }
        
        },
        {
          title: '层级深度',
          key: 'hierarchy',
          sortable: true,
          render: (h, params) => {
            return h('span', this.filter.accountHierarchy(params.row.hierarchy))
          }
        
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '添加', 
              action:()=>{
                this.modal = true
                this.modalTitle = '新增菜单'                
                this.formItem.funName = ''
                this.formItem.funCode = ''
                this.formItem.optType = ''
                this.formItem.sortNo =''
                this.formItem.openType = ''
                this.formItem.functionType = ''
                this.formItem.hierarchy = ''
                this.formItem.funTypes = []
                // this.formItem.switch = params.row.useFlag === '1'
                // this.formItem.id = ''
                // this.formItem._method = 'put'
                this.type = 'add'
                this.formItem.parentId = params.row.id
                this.formItem.funIco = params.row.funIco
                this.formItem.funUrl = params.row.funUrl
              }             
            },
            {
                title:'修改',
                action: () => {
                this.modal = true
                this.modalTitle = '编辑角色'                
                this.formItem.funName = params.row.funName
                this.formItem.funCode = params.row.funCode
                this.formItem.optType = params.row.optType
                this.formItem.sortNo = String(params.row.sortNo)
                this.formItem.openType = params.row.openType
                this.formItem.functionType = params.row.functionType
                this.formItem.hierarchy = params.row.hierarchy
                this.formItem.funTypes = this.splits(params.row.funType||"")
                // this.formItem.switch = params.row.useFlag === '1'
                this.formItem.id = params.row.id
                this.formItem._method = 'put'
                this.type = 'edit'
                this.formItem.parentId = params.row.parentId
                this.formItem.funIco = params.row.funIco
                this.formItem.funUrl = params.row.funUrl
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('/admin/sysFunctions/del?id='+params.row.id)
              }
            }            
            ]
            if(params.row.hierarchy===3){
                actions.splice(0,1)
            }
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
      url: '/admin/sysFunctions/grid',
      modal: false,
      formItem: {
        funName: '',
        funCode:'',
        // switch: true,
        optType: '',
        sortNo:'',
        openType:'',
        functionType:'',
        hierarchy:'',
        funTypes:[],
        parentId: '',
        funIco: '',
        funUrl: ''
      },
      modalTitle: '新增角色',
      type: 'add',
      loading: true,
      ruleForm: {
        funName: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          
        ],
        funCode:[
            {required: true, message: '请输入唯一编码', trigger: 'blur'},
        ],
        openType:[
            { required: true, message: '请选择打开方式', trigger: 'change' }
        ],
        sortNo:[
            {required: true, message: '请输入排序', trigger: 'blur'},
        ],
        hierarchy:[
            { required: true, message: '请选择层级深度', type: 'number', trigger: 'change' }
        ],
        functionType:[
            { required: true, message: '请选择功能类别', trigger: 'change' }
        ],
      },
      
    }
  },
  mounted () {
    // this.loadpage(this.params)
   
  },
  components: { gridTable, confirm},
  methods: {
    test(){
      this.$router.push("/test")
    },
    splits(test){
       return test.split(',')
    },
    ok () {
      // this.formItem.accType = 0
      // this.formItem.useFlag = this.formItem.switch ? 1 : 0
      let _this = this
      let url = _this.type === 'add' ? '/admin/sysFunctions/saveFuns' : '/admin/sysFunctions/update'
      this.formItem.funType = this.formItem.funTypes.join(',')
      delete this.formItem.funTypes
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: 'modal',
        callback (res) {
          if (res.success) {
            _this.modal = false
            _this.$Message.success('保存成功.')
            _this.$refs['formItem'].resetFields();
          }
        }
      })
    },
    cancel () {
      this.$refs['formItem'].resetFields();
    },
    saveFuns() {
      let _this = this
      _this.common.listDone(_this, {
        url: '/admin/sysFunctions/saveBufferRole',
        params: {},
        callback (res) {
          if (res.success) {
            _this.$Message.success('操作成功.')
          }
        }
      })
      _this.$store.dispatch('postApi')
    },
    showModal () {
      this.modal = true
      this.formItem.funName = ''
      this.formItem.funCode = ''
      this.formItem.optType = ''
      this.formItem.sortNo =''
      this.formItem.openType = ''
      this.formItem.functionType = ''
      this.formItem.hierarchy = ''
      this.formItem.funTypes = []
      this.formItem._method = ''
      this.formItem.id = ''
      this.type = 'add'
      // this.formItem.switch = true
      this.modalTitle = '添加'
    },
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('/admin/sysFunctions/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>
