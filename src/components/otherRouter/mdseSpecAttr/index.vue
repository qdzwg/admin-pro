<template>
  <div class="mdseSpecAttr">
      <Row style="margin-bottom:20px;">
      <Col span="2">
       <Button type="primary" icon="android-add" @click="showModal">添加</Button>
      </Col>
      
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

     <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok" width="500" :type="type">
        <Form :model="formItem" label-position="right" :label-width="100" ref="formItem" :rules="ruleForm">
        <FormItem label="属性名" prop="attrName">
            <Input v-model="formItem.attrName" ></Input> 
        </FormItem>
        <FormItem label="属性参数">
          <Input v-model="formItem.attrParam" placeholder="输入内容后按回车键添加标签  多个请用 \ 隔开"
           @on-keyup.enter="attrParamText(formItem.attrParam,$event)"></Input> 
        </FormItem>
        <FormItem label="标签">
            <div class="formControls">
                <div class="controltext" v-for="(item,index) in formItem.attrParamText" :key="index">
                    <span>{{item}}</span>
                    <span class="icondel" @click="del(index)">X</span>
                </div>
            </div>
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
          title: '属性名',
          key: 'attrName',
          align:'center',
          sortable: true,
        },   
        {
          title: '属性参数',
          key: 'attrParam',
          align:'center',
          sortable: true,
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '修改',
              action: () => {
                this.modal = true
                this.modalTitle = '编辑角色'
                this.formItem.attrName = params.row.attrName
                this.formItem.attrParam = params.row.attrParam
                this.formItem.attrParamText = params.row.attrParam.split('\\')
                this.formItem.id = params.row.id
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.content='确定删除吗？',
                this.$refs.confirmModel.confirm('list/product/mdseSpecAttr/grid/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: 'list/product/mdseSpecAttr/grid?specId='+this.$route.params.id,
      modal:false,
      loading:true,
      modalTitle:'',
      formItem:{
          id:'',
          attrName:'',      //属性名
          attrParam:'',     //属性参数
          attrParamText:[]  //标签
      },
      type:'',
      ruleForm:{
          attrName:[
              {required:true,message:'请输入属性名',tirgger:'blur'}
          ]
      }
    }
  },
  components: {searchForm, gridTable, confirm},
  methods: {
      ok () {
            let _this = this
            let url = _this.type === 'add' ? 'list/product/mdseSpecAttr/save' : 'list/product/mdseSpecAttr/'+this.formItem.id
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
        showModal(){
            this.modal = true
            this.type = 'add'
            this.formItem.attrName =''
            this.formItem.attrParam = ''
            this.formItem.attrParamText =[]
            this.modalTitle = '添加'
        },
        //标签
        attrParamText(text,ev){
            if(text){
              this.formItem.attrParamText.push(text)
            }
        },
        //删除当前标签
        del(i){
            this.formItem.attrParamText.splice(i, 1)
        }
  
  }
}
</script>
<style scope lang="scss">
.formControls{
    padding:10px;
    width:90%;
    min-height:8rem;
    border:1px solid #ccc;
    .controltext{
        text-align:center;
        margin:5px 0;
        background-color: #c8e0f0;
        .icondel{
            float:right;
            margin-right:10px;
            color:red;
            cursor:pointer;
        }
}
}

</style>

