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
    <gridTable ref="gridTable" :columns="columns" :params="params" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="done"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" @on-ok="ok" @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position='right' :label-width="70" ref="formItem" :rules="ruleForm">
          <FormItem label="编码：" prop='code'>
				    <Select v-model="formItem.code" style="width:200px" prop="code" @on-change="toSelectOpt">
				        <Option v-for="val in codeList" :value="val.key" :key="val.value">{{ val.key }}</Option>
				    </Select>
          </FormItem>
          <FormItem label="名称：">
						<div style="width:415px; ">{{formItem.corpName}}</div>
          </FormItem>
          <FormItem label="账户：">
            <span class="canClick" @click="toShowCLC">+选择</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="canClick" @click="toShowRep">重选</span><br>
            <div style="width:415px; white-space:pre-wrap; word-break:break-all">已选账户: <span v-show="ZH_choosed!=''">(</span>{{ZH_choosed}}<span v-show="ZH_choosed!=''">)</span></div>
          </FormItem>
          <FormItem label="备注：">
            <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
        </Form>
    </Modal>
    <Modal v-model="selectZH" title="选择账户" :width="800">
			<Input v-model="addArg.name" placeholder="用户名" style="width:200px"></Input>
			<Button type="primary" icon="ios-search" @click="toFlt">搜索</Button>
			<div style="height:20px"></div>
      <Table ref="table2"
       border
       :columns="columns2"
       :data="ZHData"
       ></Table>
       <div style="height:15px"></div>
       <Page :page-size="20" :total="ZHtotal" />
    </Modal>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import {apiGet, apiPost} from "@/fetch/api.js"
export default {
  data () {
    return {
    	selectZH:false,
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
          title: '编码',
          key: 'code',
          sortable: true
        },
        {
          title: '名称',
          key: 'Name',
          sortable: true
        },
        {
          title: '账号',
          key: 'accName',
          sortable: true
        },
        {
          title: '个人/企业名称',
          key: 'corpName',
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          // width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('admin/userOption/delete?id=' + params.row.id);
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      columns2: [
        {
          title: '用户名',
          key: 'accName',
          sortable: true
        },
        {
          title: '个人/企业名称',
          key: 'corpName',
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          // width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '选择',
              action: () => {
          			if(this.ZH_choosed==''){
          				this.ZH_choosed+=params.row.accName;
          			}else{
          				this.ZH_choosed+=','+params.row.accName;
          			};
                if(this.ZH_choosed_ids==''){
                	this.ZH_choosed_ids+=params.row.id;
                }else{
                	this.ZH_choosed_ids+=','+params.row.id;
                };
                this.ZHform.selectIds=this.ZH_choosed_ids;
					  		apiPost('/admin/userOption/userGrid', this.ZHform).then(data=>{
					  			this.ZHtotal=data.total;
					  			this.ZHData=data.rows;
					  		}).catch(err=>{
					  			this.$Message.warning('用户列表获取失败!');
					  		});
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      addArg:{
      	name:''
      },
      formItem: {
        code:'',
        corpName:'',
        remark:'',
        selectIds:''
      },
      ZHData:[],
      ZH_choosed:'',
      ZH_choosed_ids:'',
      codeList:[],
      params: {page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
      url: 'admin/userOption/grid',
      searchItems: [
        {
          label: '名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '编码',
          type: 'input',
          name: 'code'
        },
        {
          label: '用户',
          type: 'input',
          name: 'accName'
        }
      ],
      modal: false,
      modalTitle: '新增角色',
      type: 'add',
      loading: true,
      ruleForm: {
        accName: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请选择编码'}
        ]
      },
      ZHform:{
      	page:1,
      	limit:20,
      	sort:'createTime',
      	order:'desc',
      	accName:'',
      	selectIds:''
      },
      ZHtotal:0
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: {searchForm, gridTable, confirm},
  methods: {
  	toSelectOpt(z){
  		this.codeList.forEach(val=>{
  			if(z==val.key)this.formItem.corpName=val.value;
  		});
  	},
  	toFlt(){

  	},
  	toShowCLC(){
  		apiPost('/admin/userOption/userGrid', this.ZHform).then(data=>{
  			this.ZHtotal=data.total;
  			this.ZHData=data.rows;
  		}).catch(err=>{
  			this.$Message.warning('用户列表获取失败!');
  		});
  		this.selectZH=true;
  	},
  	toShowRep(){
  		this.ZHform.selectIds='';
  		this.ZH_choosed_ids='';
  		this.ZH_choosed='';
  		apiPost('/admin/userOption/userGrid', this.ZHform).then(data=>{
  			this.ZHtotal=data.total;
  			this.ZHData=data.rows;
  		}).catch(err=>{
  			this.$Message.warning('用户列表获取失败!');
  		});
  		this.selectZH=true;
  	},
    test(){
      this.$router.push("/test")
    },
    ok () {
      if(this.ZH_choosed_ids==''){
      	this.$Message.warning('未选择账户!');
      	return;
      }
      this.formItem.selectIds=this.ZH_choosed_ids;
      apiPost('/admin/userOption/saveOption', this.formItem).then(data=>{
      	if(data.success==true){
      		this.$Message.success('保存成功!');
      		this.fresh();
      	}else{
      		this.$Message.warning('保存失败!');
      	};
      }).catch(err=>{
      	this.$Message.warning('保存失败!');
      });
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    showModal () {
    	this.formItem= {
        code:'',
        corpName:'',
        remark:'',
        selectIds:''
      };
      this.ZH_choosed='';
      this.ZH_choosed_ids='';
    	apiGet('/admin/userOption/addFL').then(data=>{
    		if(data.success){
    			let arr=[];
    			for(let key in data.data){
    				arr.push({
    					key,
    					value:data.data[key]
    				});
    			};
    			this.codeList=arr;
    		}else{
    			this.codeList=[];
    		}
    	}).catch(err=>{});
      this.modal = true
      this.formItem.code = ''
      this.modalTitle = '添加类型'
    },
    fresh(){
      this.$store.dispatch('postApi')
    }
  }
}
</script>

<style scoped>
.canClick {color:#1443FB; cursor:pointer;}
</style>