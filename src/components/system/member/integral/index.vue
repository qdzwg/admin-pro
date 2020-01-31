<template>
  <div>
    <Form ref="formInline" :model="searchData" inline >
        <FormItem label="规则名称:" :label-width="80">
            <Input v-model="searchData.name" placeholder="请输入规则名称"></Input>
        </FormItem>
        <FormItem label="规则类型：" :label-width="80">
            <Select v-model="searchData.type" style="width:180px" placeholder="请选择规则类型">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="有效期：" :label-width="80">
            <Row>
            <Col span="11">                
                <DatePicker type="date" @on-change="startTimeSet"  placeholder="请选择开始时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">                
                <DatePicker type="date" @on-change="endTimeSet"  placeholder="请选择结束时间"></DatePicker>
            </Col>
            </Row>
        </FormItem>
        <Button style="margin-bottom:20px" type="primary" icon="ios-search" @click="getList">查询</Button>
        <Button style="margin-bottom:20px; margin-left:10px" type="primary" icon="ios-search" @click="goAdd(false)">添加新规则</Button>
    </Form>
    <Table ref="gridTable"
     border
     :columns="columns"
     :data="mainList"
     @on-selection-change="changeSelection2"
     ></Table>
     <Page class="page_class" :total="total" show-total show-sizer @on-change="toPage" @on-page-size-change="toChangeSize"/>

    <confirm ref="confirmModel" mode="done" :content="content" @okClick="getList"></confirm>

    <Modal v-model="proModal" @on-cancel="toCloseProductModal" width="1280" title="产品选择">
      <div class="pro-main">
          <div class="pro-left">
            <div style="height:30px; line-height:30px; background-color:#f1f1f1; margin-bottom:6px;">
                <span style="text-align: right; vertical-align: middle; font-size: 12px; color: #495060; line-height: 1; padding: 10px 12px 10px 5px; box-sizing: border-box;">添加产品</span>
            </div>
            <Form ref="formInline" :model="searchForm" inline >
                <FormItem label="产品类型：" :label-width="80" style="margin-bottom:6px;">
                    <Select v-model="searchForm.productType" clearable placeholder="请选择产品类型" style="width:100px">
                        <Option v-for="(item, index) in proType" :value="item.key" :key="index">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="景区名称：" :label-width="80" style="margin-bottom:6px;">
                    <Select v-model="searchForm.parkId" clearable placeholder="请选择景区名称" style="width:100px">
                        <Option v-for="(item,index) in senicList" :value="item.parkId" :key="index">{{ item.parkName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品名称：" :label-width="80" style="margin-bottom:6px;">
                    <Input v-model="searchForm.productName" placeholder="请输入产品名称" style="width:100px"></Input>
                </FormItem>
                <FormItem label="商户名称：" :label-width="80" style="margin-bottom:6px;">
                    <Input v-model="searchForm.mchName" placeholder="请输入商户名称" style="width:100px"></Input>
                </FormItem>
                <Button type="primary" icon="ios-search" @click="search_pro">查询</Button>
            </Form>
            <Table ref="protable"
             border
             :columns="columns_pro"
             :data="left_data_show"
             @on-selection-change="changeSelection"
             ></Table>
        </div>
        <div class="pro-center">
            <div style="margin-top: 50px;">
                <Button @click="addPro">添加</Button>
            </div>
            <div style="margin-top:10px;">
                <Button @click="delPro">删除</Button>
            </div>             
        </div>
        <div class="pro-right">
            <div style="height:30px; line-height:30px; background-color:#f1f1f1; margin-bottom:6px;">
                <span style="text-align: right; vertical-align: middle; font-size: 12px; color: #495060; line-height: 1; padding: 10px 12px 10px 5px; box-sizing: border-box;">添加产品</span>
            </div>
            <Form ref="formInline2" :model="searchForm2" inline >
                <FormItem label="产品类型：" :label-width="80" style="margin-bottom:6px;">
                    <Select v-model="searchForm2.productType" clearable placeholder="请选择产品类型" style="width:100px">
                        <Option v-for="(item, index) in proType" :value="item.key" :key="index">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="景区名称：" :label-width="80" style="margin-bottom:6px;">
                    <Select v-model="searchForm2.parkId" clearable placeholder="请选择景区名称" style="width:100px">
                        <Option v-for="(item,index) in senicList" :value="item.parkId" :key="index">{{ item.parkName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品名称：" :label-width="80" style="margin-bottom:6px;">
                    <Input v-model="searchForm2.productName" placeholder="请输入产品名称" style="width:100px"></Input>
                </FormItem>
                <FormItem label="商户名称：" :label-width="80" style="margin-bottom:6px;">
                    <Input v-model="searchForm2.mchName" placeholder="请输入商户名称" style="width:100px"></Input>
                </FormItem>
                <Button type="primary" icon="ios-search" @click="search_pro2">查询</Button>
            </Form>
            <Table ref="table2"
             border
             :columns="columns_pro2"
             :data="right_data_show"
             @on-selection-change="changeSelection2"
             ></Table>
        </div>
        <div style="clear:both;"></div>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" @click="toSaveChooseProduct">保存</Button>
        <Button type="ghost" @click="toCloseProductModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import list from '@/components/global/list'
import confirm from '@/components/global/confirm'
import modalForm from '@/components/global/modalForm'
export default {
  data () {
    return {
		  statusList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'fixed',
          label: '固定积分抵扣'
        },
			  {
					value: 'percent',
					label: '订单金额百分比'
			  }
		  ],

      total:0,
      searchData:{
        merchantInfoId:'',
        name:'',
        type:'',   // 固定金额:fixed,  百分比:percent
        startTime:'',
        endTime:'',
        currPage:1,
        pageSize:10
      },
      mainList:[],

		  proModal: false,
		  proType: [],
		  senicList:[],
      left_data_store: [],
      left_data_show: [],
      right_data_store: [],
      right_data_show: [],
      productSaved: [],
      searchForm: {
        productType: '',
        parkId: '',
        productName: '',
        mchName: ''
      },
      searchForm2: {
        productType: '',
        parkId: '',
        productName: '',
        mchName: ''
      },
      columns_pro: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品类型',
          key: 'productType'
        },
        {
          title: '景区名称',
          key: 'parkName'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '商户名称',
          key: 'mchName'
        }
      ],
      columns_pro2: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品类型',
          key: 'productType'
        },
        {
          title: '景区名称',
          key: 'parkName'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '商户名称',
          key: 'mchName'
        }
      ],
      selection: [],
      selection2: [],

	    content: '<div style="color:red">确定要删除吗?</div>',
	    setPermissionModal: false,
	    roleId: '',
	    columns: [
	      {
	        type: 'selection',
	        width: 60,
	        align: 'center'
	      },
	      {
	        title: '规则名称',
	        key: 'name'
	      },
	      {
	        title: '规则属性',
          render: (h, params) => {
            if(params.row.type=='fixed'){
              return h('span', `固定积分抵扣 - ${params.row.fixed}元`);
            }else if(params.row.type=='percent'){
              return h('span', `订单金额百分比 - ${params.row.percent}%`);
            }
          }
	      },
	      {
	        title: '有效期',
          render: (h, params) => {
            let modifyBy = params.row.startTime;
            let modifyTime = params.row.endTime;
            return h("div", [
              h('span', modifyBy),
              h('span', ' - '),
              h('span', modifyTime)
            ])
          }
	      },
        {
          title: '状态',
          render: (h, params) => {
            let str='', color='';
            if(params.row.status=='unused'){
              str='未开始';
              color='green';
            }else if(params.row.status=='used'){
              str='生效中';
              color='blue';
            }else if(params.row.status=='overtime'){
              str='已过期';
              color='red';
            }
            return h('span', {
              style:{
                color
              },
              domProps:{
                innerHTML:str
              }
            })
          }
        },
	      {
	        title: '禁启用',
          render: (h, params) => {
            return h('span', params.row.enable=='T'?'启用':'禁用');
          }
	      },
	      {
	        title: '创建时间',
	        key: 'createTime'
	      },
	      {
	        title: '操作',
	        key: 'action',
	        width: 200,
	        align: 'center',
	        render: (h, params) => {
	          const actions = [
	            {
	              title: '编辑',
	              action: () => {
	                this.goAdd(true, params.row);
	              }
	            },
	            {
	              title: '删除',
	              action: () => {
                  this.$refs.confirmModel.confirm('/leaguer/web/deduction/rule/manage/delete', {
                    merchantInfoId:this.searchData.merchantInfoId,
                    id:params.row.id
                  });
	              }
	            },
	            {
	              title: params.row.enable=='T'?'禁用':'启用',
	              action: () => {
	                this.apiGet('/leaguer/web/deduction/rule/manage/enable', {
                    merchantInfoId:this.searchData.merchantInfoId,
                    id:params.row.id,
                    enable:params.row.enable=='T'?'F':'T'
                  }).then(data=>{
                    if(data.status==200){
                      this.$Message.success(data.message);
                      this.getList();
                    }else{
                      this.$Message.warning(data.message);
                    };
                  }).catch(err=>{
                    this.$Message.warning('操作失败!');
                  });
	              }
	            },
	            /*{
	              title: '灰名单',
	              action: () => {
	                this.showProModal();
	              }
	            }*/
	          ]
	          return this.common.columnsHandle(h, actions)
	        }
	      }
	    ],
	    params: { accType: this.$cookies.get('accType') },
	    url: '/admin/web/deduction/rule/manage/query',
	    modalForm: false,
	    modalFormTitle: '',
	    formParams: {},
	    formAction: ''
    }
  },
  components: { list, confirm, modalForm },
  methods: {
    toPage(num){
      this.searchData.currPage=num;
      this.getList();
    },
    toChangeSize(size){
      this.searchData.pageSize=size;
      this.getList();
    },
    toSaveChooseProduct(){
      this.productSaved=JSON.parse(JSON.stringify(this.right_data_store));
      this.toCloseProductModal();
    },
    search_pro () {
      if(this.searchForm.productType=='' || this.searchForm.productType===undefined){
        this.$Message.warning('产品类型选项不能为空!');
        return;
      }

      let json={
        productType:this.searchForm.productType
      };
      if(this.searchForm.parkId!='' && this.searchForm.parkId!==undefined)json.parkId=this.searchForm.parkId;
      if(this.searchForm.productName.replace(/\s+/g, '')!='')json.productName=this.searchForm.productName.replace(/\s+/g, '');
      if(this.searchForm.mchName.replace(/\s+/g, '')!='')json.mchName=this.searchForm.mchName.replace(/\s+/g, '');

      this.apiPost('/admin/api/sys/role/loadProducts', json).then(res => {
        if(res.rows && res.rows.length){
          this.left_data_store = res.rows
          let result=[];
          this.left_data_store.forEach(val=>{
            let bl=this.right_data_store.some(_val=>{
              return _val.productCode==val.productCode;
            });
            if(!bl)result.push(val);
          });
          this.searchForm2 = {
            productType: '',
            parkId: '',
            productName: '',
            mchName: ''
          };
          this.left_data_show=result;
          this.right_data_show=JSON.parse(JSON.stringify(this.right_data_store));
        }else{
          this.left_data_store = [];
          this.left_data_show = [];
          this.$Message.warning('未查询到任何数据!');
        };
      })
    },
    search_pro2 () {
      let json={};
      if(this.searchForm2.productType!='' && this.searchForm2.productType!==undefined)json.productType=this.searchForm2.productType;
      if(this.searchForm2.parkId!='' && this.searchForm2.productType!==undefined)json.parkId=this.searchForm2.parkId;
      if(this.searchForm2.productName.replace(/\s+/g, '')!='')json.productName=this.searchForm2.productName.replace(/\s+/g, '');
      if(this.searchForm2.mchName.replace(/\s+/g, '')!='')json.mchName=this.searchForm2.mchName.replace(/\s+/g, '');

      if(Object.keys(json).length==0){
        this.right_data_show=JSON.parse(JSON.stringify(this.right_data_store));
      }else{
        let arr=[];
        for(let key in json){
          arr.push(`val.${key}==json.${key}`);
        };
        let result=arr.join(' && ');
        this.right_data_show=this.right_data_store.filter(val=>{
          return eval(result);
        });
      };
    },
    addPro() {
      if(this.selection.length==0){
        this.$Message.warning('请选择要添加的产品!');
        return;
      }
      this.searchForm2 = {
        productType: '',
        parkId: '',
        productName: '',
        mchName: ''
      };
      this.right_data_store=this.right_data_store.concat(this.selection);
      this.right_data_show=JSON.parse(JSON.stringify(this.right_data_store));
      this.selection=[];
      let result=[];
      this.left_data_store.forEach(val=>{
        let bl=this.right_data_store.some(_val=>{
          return _val.productCode==val.productCode;
        });
        if(!bl)result.push(val);
      });
      this.left_data_show=result;
    },
    delPro() {
      if(this.selection2.length==0){
        this.$Message.warning('请选择要删除的产品!');
        return;
      }
      let choosed=[];
      this.right_data_show.forEach(val=>{
        let bl=this.selection2.some(_val=>{
          return _val.productCode==val.productCode;
        });
        if(!bl)choosed.push(val);
      });
      this.right_data_show=choosed;

      let choosedStore=[];
      this.right_data_store.forEach(val=>{
        let bl=this.selection2.some(_val=>{
          return _val.productCode==val.productCode;
        });
        if(!bl)choosedStore.push(val);
      });
      this.right_data_store=choosedStore;

      this.selection2=[];

      let result=[];
      this.left_data_store.forEach(val=>{
        let bl=this.right_data_store.some(_val=>{
          return _val.productCode==val.productCode;
        });
        if(!bl)result.push(val);
      });
      this.left_data_show=result;
    },
    changeSelection(selection) {
      this.selection = selection;
    },
    changeSelection2(selection) {
      this.selection2 = selection;
    },
    toCloseProductModal(){
      this.searchForm = {
        productType: '',
        parkId: '',
        productName: '',
        mchName: ''
      };
      this.searchForm2 = {
        productType: '',
        parkId: '',
        productName: '',
        mchName: ''
      };
      this.left_data_show=[];
      this.left_data_store=[];
      this.right_data_show=[];
      this.right_data_store=[];
      this.proModal = false;
    },
    showProModal() {
      this.proModal = true;
      this.right_data_store=JSON.parse(JSON.stringify(this.productSaved));
      this.right_data_show=JSON.parse(JSON.stringify(this.productSaved));
      this.apiGet('/admin/api/sys/role/selectProduct').then(res => {
          if(res.status || res.success){
            this.proType = res.prodTypeList;
          }else{
              this.$Message.warning(res.message)
          }
      });
      this.apiGet('/admin/api/mchInfo/loadParks').then(res => {
          if(res.status || res.success){
            this.senicList = res.parks;
          }else{
              this.$Message.warning(res.message)
          }
      });
    },
    startTimeSet(time){
      if(time!=''){
        this.searchData.startTime = time + ' 00:00:00'
      }else{
        this.searchData.startTime = time
      };
    },
    endTimeSet(time){
      if(time!=''){
        this.searchData.endTime = time + ' 00:00:00'
      }else{
        this.searchData.endTime = time
      };
    },
    goAdd(bl, data) {
      if(bl){
        this.$router.push({path:'/integralEdit', query:{merchantInfoId:this.searchData.merchantInfoId, data}});
      }else{
        this.$router.push({path:'/integralEdit', query:{merchantInfoId:this.searchData.merchantInfoId}});
      };
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
    getList(){
      console.log('..........................')
      console.log(this.searchData)
      this.apiGet('/leaguer/web/deduction/rule/manage/query', this.searchData).then(data=>{
        if(data.status==200){
          this.total=data.data.total;
          this.mainList=data.data.rows;
        }else{
          this.$Message.warning(data.message);
        }
      }).catch(err=>{
        this.$Message.warning('列表获取失败!');
      });
    }
  },
  mounted:function(){
    this.apiGet('/merchant/merchantInfo/getMerchantInfo').then(data=>{
      if(data.status==200){
        this.searchData.merchantInfoId=data.data.id;
        this.getList();
      }else{
        this.$Message.warning('列表获取失败!');
      };
    }).catch(err=>{
      this.$Message.warning('列表获取失败!');
    });
  }
}
</script>

<style lang="scss" scoped>
.page_class {margin-top:15px;}
.pro-main {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    justify-content:center;
    flex-direction:row;
    // align-items : center;
    .pro-left{
        flex: 7;
    }
    .pro-center{
        flex: 1;
        text-align: center;
    }
    .pro-right{
        flex: 7;
    }
}
</style>
