<template>
  <div class="mdseSpec">
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
     
      <Col span="2">
       <Button type="primary" icon="android-add" @click="showModal">添加</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

     <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok" width="500" :type="type">
        <Form :model="formItem" label-position="right" :label-width="100" ref="formItem" :rules="ruleForm">
        <FormItem label="类目" prop="category">
            <Select v-model="formItem.category" style="width:200px">
                <Option v-for="item in searchItems[1].data" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="规格名字">
          <Input v-model="formItem.name" ></Input> 
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
      mode:"",
      content:"",
      sucessMsg:'',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '规格名字',
          key: 'name',
          align:'center',
          sortable: true,
        },   
        {
          title: '类目',
          key: 'category',
          align:'center',
          sortable: true,
          render: (h,params) => {
            return h('span',this.filter.productCategory(params.row.category))
          }
        },
        
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '属性值',
              action: () => {
               this.$router.push({'path': '/mdseSpecAttr/' + params.row.id,params:{id:params.row.id}})
              }
            },
            {
              title: '修改',
              action: () => {
                this.modal = true
                this.modalTitle = '编辑角色'
                this.formItem.name = params.row.name
                this.formItem.category = params.row.category
                this.formItem.switch = params.row.useFlag === '1'
                this.formItem.id = params.row.id
                this.formItem._method = 'put'
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.mode='delete'  
                this.content='确定删除吗？'
                this.$refs.confirmModel.confirm('list/product/mdseSpec/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: 'list/product/mdseSpec/grid',
      modal:false,
      loading:true,
      modalTitle:'',
      formItem:{
          name:'',
          category:''
      },
      type:'',
      searchItems: [
        {
          label: '规格名字',
          type: 'input',
          name: 'name'
        },
       
        {
          label: '类目',
          type: 'select',
          name: 'category',
          data: [
            {
              value: '1',
              label: '食品'
            },
            {
              value: '2',
              label: '服饰'
            },
            {
              value: '3',
              label: '美妆'
            },
            {
              value: '4',
              label: '亲子'
            },
            {
              value: '5',
              label: '数码家电'
            },
            {
              value: '6',
              label: '居家生活'
            },
            {
              value: '7',
              label: '其他'
            }
          ]
        }
      ],
      ruleForm:{
          category:[
              {required:true,message:'其选择类目',tirgger:'change'}
          ]
      }
    }
  },
  components: {searchForm, gridTable, confirm},
  methods: {
      ok () {
            this.formItem.accType = 0
            this.formItem.useFlag = this.formItem.switch ? 1 : 0
            let _this = this
            let url = _this.type === 'add' ? 'list/product/mdseSpec/save' : 'list/product/mdseSpec/save'
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
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.content='确定删除吗？'
        this.mode='delete'
        this.$refs.confirmModel.confirm('list/product/mdseSpec/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    showModal(){
            this.modal = true
            this.type = 'add'
            this.formItem.name =''
            this.formItem.picAddr = ''
            this.thiscontent = ''
            this.formItem.switch = true
            this.modalTitle = '新增'
            
        },
  
  }
}
</script>
