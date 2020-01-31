<template>
  <div class="mdseInfo">
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
     
      <Col span="2">
       <Button type="primary" icon="android-add" @click="addCode">添加</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
      <Col span="4">
        <Button type="success" icon="checkmark-round" @click=" showModal"> 代销单退款审核设置</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="checkmark-round" @click="addUp">上架</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="close-round" @click="addDown">下架</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

     <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok" width="500" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem">
        
        <FormItem label="代销单退款审核设置：">
         <RadioGroup v-model="formItem.types">
                <Radio label="T">是</Radio>
                <Radio label="F">否</Radio>
            </RadioGroup>
        </FormItem>    
        </Form> 
    </Modal>
  </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
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
          title: '商品名称',
          key: 'name',
          align:'center',
          sortable: true,
        }, 
        {
          title: '商品编码',
          key: 'productCode',
          align:'center',
          sortable: true,
        },
        {
          title: '门市价',
          key: 'priceShow',
          align:'center',
          sortable: true,
        },  
        {
          title: '起价',
          key: 'price',
          align:'center',
          sortable: true,
        },
       
        {
          title: '是否上下架',
          key: 'enabled',
          align:'center',
          sortable: true,
          render: (h,params) => {
            return h('span',params.row.enabled=='T'?'已上架':'已下架')
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
              title: '复制',
              action: () => {
               this.$router.push({'path': '/mdseInfoAttr',query:{id:params.row.id}})
              }
            },
            {
              title: '修改',
              action: () => {
                this.$router.push({'path': '/mdseInfoAttr',query:{id:params.row.id }})
              }
            },
            {
              title: '删除',
              action: () => {
                this.content='确定删除吗？'
                this.$refs.confirmModel.confirm('/product/mdseInfo/del/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: '/product/mdseInfo/grid',
      modal:false,
      loading:true,
      modalTitle:'',
      formItem:{
          types:''
      },
      type:'',
      searchItems: [
        {
          label: '商品名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '商品编码',
          type: 'input',
          name: 'productCode'
        },
        {
          label: '是否上架',
          type: 'select',
          name: 'enabled',
          data: [
            {
              value: 'T',
              label: '已上架'
            },
            {
              value: 'F',
              label: '已下架'
            },
            
          ]
        }
      ]
    }
  },
  components: {searchForm, gridTable, confirm},
  mounted(){
                 
  },
  methods: {
      ok () {
            this.formItem.accType = 0
            this.formItem.useFlag = this.formItem.switch ? 1 : 0
            let _this = this
            let url = 
            apiGet('/product/mdseInfo/zybCorpCode?types=' +this.formItem.types).then(res=>{
                if (res.success) {
                    _this.modal = false
                }
            })
    },
    //删除
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.content='确定删除吗？'
        this.$refs.confirmModel.confirm('/product/mdseInfo/del/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    //上架
    addUp(){
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.content='确定上架？'
        this.$refs.confirmModel.confirm('/product/mdseInfo/enabled/?enabled=T' + ids)
        }else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    //下架
    addDown(){
        let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.content='确定下架？'
        this.$refs.confirmModel.confirm('/product/mdseInfo/enabled/?enabled=F' + ids)
        }else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    // 代销单退款审核设置
    showModal(){
            this.modal = true
            this.type = 'add'
            this.formItem.types =''
            this.formItem.switch = true
            this.modalTitle = '代销单退款审核设置'
    },
    //添加(需要后台对接)
    addCode(){
            this.$router.push({'path': '/mdseInfoAttr'})     
        },
  
  }
}
</script>
