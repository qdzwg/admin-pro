<template>
  <div class="mdsePostage">
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

    

    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok" width="800" :type="type">
    <Form :model="formItem" label-position="right" :label-width="150" :rules="ruleForm" ref="formItem" style="width:80%;margin:0 auto">
        
        <FormItem label="邮费模版名称：" prop="name">
         <Input v-model="formItem.name"></Input>
        </FormItem> 
        <FormItem label="结算方式：">
            <RadioGroup v-model="formItem.balanceType">
                <Radio label="0">普通结算</Radio>
            </RadioGroup>
        </FormItem> 
        <FormItem label="结算方式：">
            <RadioGroup v-model="formItem.costType">
                <Radio label="0">按重量</Radio>
                <Radio label="1">按件数</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="快递方式：" prop="postageType">
            <Select v-model="formItem.postageType" style="width:200px">
                <Option v-for="item in postageTypes" :value="item.value" :key="item.value">{{item.label}}</Option>   
            </Select>
        </FormItem> 
         <FormItem label="偏远邮寄地区：">
             <!-- 暂时这样处理吧？ -->
            
            <Button type="primary" @click="getAreaData('add2')">选择地区</Button>
            <div style="border:1px solid #ccc;min-height:5rem;max-height:5rem;margin-top:1rem;padding:5px;overflow-y:auto;">{{formItem.areaName}}</div>
        </FormItem> 
         
         <FormItem label="偏远地区邮费：">
            <Row>
                <Col span="6">
                   <FormItem prop="startWeight">
                        <span>运费</span> 
                        <Input v-model="formItem.startWeight" number style="width:39%"></Input>
                        <span v-if="formItem.costType==0">kg</span>
                        <span v-if="formItem.costType==1">件</span>
                        <span>内</span>
                    </FormItem>
                </Col>
                <Col span="6">
                     <FormItem prop="startPrice">
                        <Input v-model="formItem.startPrice" number style="width:39%"></Input>
                        <span> 元；每增加</span>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem prop="stepWeight">
                        <Input v-model="formItem.stepWeight" number style="width:39%"></Input>
                        <span v-if="formItem.costType==0">kg</span>
                        <span v-if="formItem.costType==1">件</span>
                         <span>,增加运费</span>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem prop="stepPrice">
                        <Input v-model="formItem.stepPrice" number style="width:39%"></Input>
                        <span>元</span>
                     </FormItem>
                </Col>
            </Row>
            <p style="margin-top:20px;color:#ef392b">不满 
                <span>{{formItem.stepWeight}}</span>
                <span v-if="formItem.costType==0">kg</span>
                <span v-if="formItem.costType==1">件</span> 
                 按 <span>{{formItem.stepWeight}}</span>
                <span v-if="formItem.costType==0">kg</span>
                <span v-if="formItem.costType==1">件</span> 算</p>
        </FormItem>
        <FormItem label="包邮地区：">
             <!-- 暂时这样处理吧？ -->
            <Button type="primary" @click="getAreaData('add3')">选择地区</Button>
            <div style="border:1px solid #ccc;min-height:5rem;max-height:5rem;margin-top:1rem;padding:5px;overflow-y:auto;">{{formItem.freeAreaName}}</div>
        </FormItem> 
        <FormItem label="偏远地区邮费：">
            <Row>
                <Col span="6">
                   <FormItem prop="defaultWeight">
                        <span>运费</span> 
                        <Input v-model="formItem.defaultWeight" number style="width:39%"></Input>
                        <span v-if="formItem.costType==0">kg</span>
                        <span v-if="formItem.costType==1">件</span>
                        <span>内</span>
                    </FormItem>
                </Col>
                <Col span="6">
                     <FormItem prop="defaultPrice">
                        <Input v-model="formItem.defaultPrice" number style="width:39%"></Input>
                        <span> 元；每增加</span>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem prop="defaultStepWeight">
                        <Input v-model="formItem.defaultStepWeight" number style="width:39%"></Input>
                        <span v-if="formItem.costType==0">kg</span>
                        <span v-if="formItem.costType==1">件</span>
                         <span>,增加运费</span>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem prop="defaultStepPrice">
                        <Input v-model="formItem.defaultStepPrice" number style="width:39%"></Input>
                        <span>元</span>
                     </FormItem>
                </Col>
            </Row>
            <p style="margin-top:20px;color:#ef392b">不满 
                <span>{{formItem.defaultStepWeight}}</span> 
                <span v-if="formItem.costType==0">kg</span>
                <span v-if="formItem.costType==1">件</span>
                 按 <span>{{formItem.defaultStepWeight}}</span> 
                 <span v-if="formItem.costType==0">kg</span>
                <span v-if="formItem.costType==1">件</span> 算</p>
        </FormItem>   
          
    </Form>  
   
    </Modal>
    <Modal v-model="modal2" :title="modalTitle2" :loading="loading2" @on-ok="ok2" :type="type2" style="z-index:1000">
        <Tree :data="data4" @on-check-change="getchecked" ref="tree" show-checkbox multiple></Tree>
    </Modal>
  </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      mode:"",
      content:"",
      sucessMsg:'',
      postageTypes:[
           {
	            label: "顺丰",
	            value: "shunfeng"
            }, {
	            label: "申通",
	            value: "shentong"
            }, {
	            label: "圆通速递",
	            value: "yuantong"
            }, {
	            label: "汇通快运",
	            value: "huitongkuaidi"
            }, {
	            label: "中通速递",
	            value: "zhongtong"
            }, {
	            label: "韵达快运",
	            value: "yunda"
            }, {
	            label: "天天快递",
	            value: "tiantian"
            }, {
	            label: "ems快递",
	            value: "ems"
            }, {
	            label: "德邦物流",
	            value: "debangwuliu"
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '模板名称',
          key: 'name',
          sortable: true,
        }, 
        {
          title: '计价方式',
          key: 'costType',
          sortable: true,
           render: (h,params) => {
            return h('span',params.row.costType=='0'?'按重量':'按件数')
          }
        },
        {
          title: '偏远邮寄地区',
          key: 'areaName',
          width:500,
          sortable: true,
        },  
        {
          title: '快递方式',
          key: 'postageType',
          sortable: true,
            render: (h,params) => {
            return h('span',this.filter.postageType(params.row.postageType))
          }
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [
            // {
            //   title: '修改',
            //   action: () => {
            //     this.modal = true
            //     this.type = 'edit'
            //     this.formItem.name =params.row.name
            //     this.formItem.balanceType =params.row.balanceType
            //     this.formItem.costType =params.row.costType
            //     this.formItem.isFree =params.row.isFree
            //     this.formItem.postageType =params.row.postageType
            //     this.formItem.areaId =params.row.areaId
            //     this.formItem.areaName =params.row.areaName
            //     this.formItem.startWeight =params.row.startWeight
            //     this.formItem.startPrice =params.row.startPrice
            //     this.formItem.stepWeight =params.row.stepWeight
            //     this.formItem.stepPrice =params.row.stepPrice
            //     this.formItem.inputStr =params.row.inputStr
            //     this.formItem.costStr =params.row.costStr
            //     this.formItem.freeAreaId =params.row.freeAreaId
            //     this.formItem.freeAreaName =params.row.freeAreaName
            //     this.formItem.defaultWeight =params.row.defaultWeight
            //     this.formItem.defaultPrice =params.row.defaultPrice
            //     this.formItem.defaultStepWeight =params.row.defaultStepWeight
            //     this.formItem.defaultStepPrice =params.row.defaultStepPrice
            //     this.formItem.id =params.row.id
            //     this.modalTitle = '修改'
            //   }
            // },
            {
                title:'修改',
                action: () => {
                this.$router.push({'path': '/postage',query:{id:params.row.id }})
              }
            },
            {
              title: '删除',
              action: () => {
                this.mode='delete'
                this.content='确定删除吗？'
                this.$refs.confirmModel.confirm('/product/mdsePostage/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: '/product/mdsePostage/grid',
      modal:false,
      modal2:false,
      loading:true,
      loading2:true,
      modalTitle:'',
      modalTitle2:'',
      formItem:{
          mainUserId: 1471
      },
      type:'add',
      type2:'add2',
      dataAreaName:[],
      dataAreaId:[],
      data4:[],         //地区数据
      ruleForm:{
          name:[
              {required:true,message:'请输入邮费模版名称',trigger:'blur'}
          ],
           postageType:[
              {required:true,message:'请选择快递方式',trigger:'change'}
          ],
           startWeight:[
              {required:true,type:"number",message:'输入重量',trigger:'blur'}
          ],
          startPrice:[
               {required:true,type:"number",message:'输入金额',trigger:'blur'}
          ],
          stepWeight:[
              {required:true,type:"number",message:'输入重量',trigger:'blur'} 
          ],
          stepPrice:[
               {required:true,type:"number",message:'输入金额',trigger:'blur'}
          ],
           defaultWeight:[
              {required:true,type:"number",message:'输入重量',trigger:'blur'}
          ],
          defaultPrice:[
               {required:true,type:"number",message:'输入金额',trigger:'blur'}
          ],
          defaultStepWeight:[
              {required:true,type:"number",message:'输入重量',trigger:'blur'} 
          ],
          defaultStepPrice:[
               {required:true,type:"number",message:'输入金额',trigger:'blur'}
          ],
      }
    }
  },
  components: { gridTable, confirm,},
  mounted(){
              
  },
  methods: {
      ok () {
            
            let _this = this
             let url = _this.type === 'add' ? '/product/mdsePostage/saveMdsePostage' : '/product/mdsePostage/updateMdsePostage'
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
    //删除
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.mode='delete'
        this.content='确定删除吗？'
        this.$refs.confirmModel.confirm('/product/mdsePostage/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    // 添加(需要后台对接)
    showModal(){
            this.modal = true
            this.type = 'add'
            this.formItem.name =''
            this.formItem.balanceType ='0'
            this.formItem.costType ='0'
            this.formItem.isFree ='0'
            this.formItem.postageType =''
            this.formItem.areaId =''
            this.formItem.areaName =''
            this.formItem.startWeight =''
            this.formItem.startPrice =''
            this.formItem.stepWeight =''
            this.formItem.stepPrice =''
            this.formItem.inputStr =''
            this.formItem.costStr =''
            this.formItem.freeAreaId =''
            this.formItem.freeAreaName =''
            this.formItem.defaultWeight =''
            this.formItem.defaultPrice =''
            this.formItem.defaultStepWeight =''
            this.formItem.defaultStepPrice =''
            this.modalTitle = '新增'
    },
    ok2(){
        let data=this.$refs.tree.getCheckedNodes()
        data.map((ele,i)=>{
            if(ele.checked==true){
            this.dataAreaName.push(ele.title)
            this.dataAreaId.push(ele.id)
            }
        })
       
        if(this.type2=='add2'&&this.type=='edit'){
         this.formItem.areaId=this.dataAreaId.join(',')+','+ this.formItem.areaId
         this.formItem.areaName=this.dataAreaName.join(',')+','+this.formItem.areaName
        }else if(this.type2=='add3'&&this.type=='edit'){
         this.formItem.freeAreaId=this.dataAreaId.join(',')+','+this.formItem.freeAreaId
         this.formItem.freeAreaName=this.dataAreaName.join(',')+','+this.formItem.freeAreaName
        }
        
        if(this.type2=='add2'&&this.type=='add'){
         this.formItem.areaId=this.dataAreaId.join(',')
         this.formItem.areaName=this.dataAreaName.join(',')
        }else if(this.type2=='add3'&&this.type=='add'){
         this.formItem.freeAreaId=this.dataAreaId.join(',')
         this.formItem.freeAreaName=this.dataAreaName.join(',')
        
        }
         this.dataAreaId=[]
         this.dataAreaName=[]
         this.modal2 = false
    },
    //选择地区即变化
    getchecked(){
         
    },
    //获取地区
    getAreaData(text){
        let _this=this
        this.modal2 = true
        this.modalTitle2 = '选择地区'
        this.type2 = text
        let params={}
        if(this.type2=='add2'){
             params.areaId= this.formItem.areaId
        }else{
            params.areaId= this.formItem.freeAreaId
        }
        //console.log(params)
        //请求数据后怎样会得到默认选中的数据？不能给后台传params的值，默认选中实现了！！！
        apiPost('/product/mdsePostage/loadAreaData').then(res=>{
           let data=res.data
           //console.log(data)
            let sheng=[] ,shi=[],arr=[]
           data.map(function(item,index){
                 if(item.pId==='156'){
                    sheng.push(item)
                }else{
                    shi.push(item)
                }   
          })
          sheng.map(function(item1,index){
              let obj={}
              obj.title=item1.name
              obj.id=item1.id
             //obj.checked=_this.conTains(params.areaId.split(','),item1.id),
             obj.selected=true,
              obj.children=[]
            
              shi.map(function(ele,i){
                  if(ele.pId==item1.id){
                      obj.children.push({
                          title:ele.name,
                          id:ele.id,
                          checked:_this.conTains(params.areaId.split(','),ele.id),
                      })
                  }        
              })
           arr.push(obj) 
          })
          //console.log(arr)
           this.data4=arr 
        })
    },
    //判断数组中是否包含某元素
    conTains(arr,obj){
        var i=arr.length;
        while (i--){
            if(arr[i]===obj){
                return true
            }
        }
        return false;
    } 
  }
}
</script>
