<template>
  <div>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="150"
      ref="formItem"
      :rules="ruleForm"
    >
      <FormItem label="角色名称：" prop="roleName">
        <Input v-model="formItem.roleName" placeholder="填写角色名称" style="width: 300px;"></Input>
      </FormItem>
      <FormItem label="数据权限：">
          <!-- {{formItem.parks}} -->
        <Button type="primary" @click="showSenicModal">选择景区</Button>
        <Button type="primary" @click="showProModal" style="margin-left:10px;">选择产品</Button>
      </FormItem>
      <FormItem label="状态：" prop="useFlag">
        <Select v-model="formItem.useFlag" style="width:180px" placeholder="请选择状态">
          <Option v-for="item in useFlagList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="备注：">
        <Input
          v-model="formItem.remark"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
          style="width: 300px;"
        ></Input>
      </FormItem>
      <FormItem>
        <div class="save-cancel">
          <Button type="primary" @click="submit">保存</Button>
          <Button type="ghost" @click="back" style="margin-left: 8px">返回列表</Button>
        </div>
      </FormItem>
    </Form>
    <!--选择景区-->
    <Modal v-model="senicModal" width="600" title="景区选择">
      <div>
        <Checkbox v-model="checkAll" @on-change="handleCheckAll">&nbsp;&nbsp;全选</Checkbox>
      </div>
      <div style="height:15px"></div>
      <CheckboxGroup
        class="jingqu_group"
        v-model="parksShow"
        style="float:left"
        @on-change="checkAllGroupChange"
      >
        <Checkbox class="jingqu_checkbox" :label="item.parkId" v-for="(item, index) in parksList" :key="index">&nbsp;&nbsp;{{item.parkName}}</Checkbox>
      </CheckboxGroup>

      <div slot="footer" style="text-align:center">
        <Button type="primary" @click="saveSenic">保存</Button>
        <Button type="ghost" @click="senicCancel">关闭</Button>
      </div>
    </Modal>
    <!--选择产品-->
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
                <Button type="primary" icon="ios-search" @click="search">查询</Button>
            </Form>
            <Table ref="protable"
             border
             :columns="columns"
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
                <Button type="primary" icon="ios-search" @click="search2">查询</Button>
            </Form>
            <Table ref="table2"
             border
             :columns="columns2"
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
import { apiGet, apiPost } from "@/fetch/api";
import gridTable from '@/components/global/gridTable'
export default {
  data() {
    return {
      left_data_store: [],
      left_data_show: [],
      right_data_store: [],
      right_data_show: [],
      productSaved: [],
      ifShowFoot: false,
      type: '',
      senicModal: false,
      proModal: false,
      parksList: [],
      checkAll: false,

      useFlagList: [
        {
          value: "0",
          label: "停用"
        },
        {
          value: "1",
          label: "启用"
        }
      ],
      parksShow:[],
      formItem: {
        // accType: this.filter.accountfunType(this.$cookies.get("accType")),
        accType: this.$cookies.get("accType"),
        roleName: "",
        remark: "",
        useFlag: "1",
        parks: [],
        sysRoleProducts: []
      },
      ruleForm: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        useFlag: [{ required: true, message: "请选择状态", trigger: "change" }]
      },

      proType: [], 
      senicList: [], 
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
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品类型',
          key: 'productType',
          render: (h, params) => {
            let str='';
            if(params.row.productType=='hotel'){
              str='酒店';
            }else if(params.row.productType=='park-ticket'){
              str='乐园';
            }else if(params.row.productType=='eatery'){
              str='餐饮';
            }else if(params.row.productType=='route'){
              str='线路';
            }else if(params.row.productType=='theater'){
              str='剧院';
            }else if(params.row.productType=='show'){
              str='演出';
            }
            return h('span', str);
          }
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
      columns2: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品类型',
          key: 'productType',
          render: (h, params) => {
            let str='';
            if(params.row.productType=='hotel'){
              str='酒店';
            }else if(params.row.productType=='park-ticket'){
              str='乐园';
            }else if(params.row.productType=='eatery'){
              str='餐饮';
            }else if(params.row.productType=='route'){
              str='线路';
            }else if(params.row.productType=='theater'){
              str='剧院';
            }else if(params.row.productType=='show'){
              str='演出';
            }
            return h('span', str);
          }
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
      loading: true,
      selection: [],
      selection2: [],
    };
  },
  methods: {
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
    changeSelection(selection) {
      this.selection = selection;
    },
    changeSelection2(selection) {
      this.selection2 = selection;
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
    toSaveChooseProduct(){
      this.productSaved=JSON.parse(JSON.stringify(this.right_data_store));
      this.toCloseProductModal();
    },
    handleCheckAll() {
      if (this.checkAll) {
        let arr=[];
        this.parksList.forEach(val=>{
          arr.push(val.parkId);
        });
        this.parksShow = arr;
      } else {
        this.parksShow = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.parksList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    back() {
      this.$router.push("/role");
    },
    showSenicModal() {
      this.senicModal = true;
      this.parksShow = JSON.parse(JSON.stringify(this.formItem.parks));
      this.apiGet("/admin/api/mchInfo/loadParks").then(res => {
        this.parksList = res.parks;
        if(this.parksShow.length===this.parksList.length)this.checkAll = true;
      });
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
    senicCancel() {
      this.parksShow=[];
      this.senicModal = false;
    },
    saveSenic() {
      if (this.parksShow.length==0) {
        this.$Message.warning("请选择景区！");
      } else {
        this.formItem.parks = JSON.parse(JSON.stringify(this.parksShow));
        this.senicModal = false;
      }
    },
    submit() {
        this.$refs.formItem.validate(async valid => {
            this.scrollError();
            if (valid) {
                let url = "";
                if(this.type == 'add'){
                  url = '/admin/api/sys/role/saveRole';
                }else{
                  url = '/admin/api/sys/role/updateRole';
                };

                let json={
                  accType: this.formItem.accType,
                  roleName: this.formItem.roleName.replace(/\s+/g, ''),
                  useFlag: this.formItem.useFlag
                };
                if(this.$route.query.id)json.id=this.$route.query.id;
                if(this.formItem.remark.replace(/\s+/g, '')!='')json.remark=this.formItem.remark;

                if(this.formItem.parks.length==0){
                  /*this.$Message.warning("请选择景区!");
                  return;*/
                }else{
                  let arr=[];
                  this.formItem.parks.forEach(val=>{
                    let result=this.parksList.filter(_val=>{
                      return _val.parkId==val;
                    });
                    arr=arr.concat(result);
                  });
                  json.parks=JSON.stringify(arr);
                };

                if(this.productSaved.length==0){
                  /*this.$Message.warning("请选择产品!");
                  return;*/
                }else{
                  json.products=JSON.stringify(this.productSaved);
                };

                this.apiPost(url, json).then(data=>{
                  if(data.status==200){
                    this.$Message.success(data.message);
                    this.back();
                  }else{
                    this.$Message.warning(data.message);
                  };
                }).catch(err=>{
                  this.$Message.warning("保存失败!");
                });
            }else{
              this.$Message.warning("资料填写不完整!");
            };
        })
    },
    scrollError () {
      let errList = $(".ivu-form-item-error");
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top;
        $("#content").animate(
          {
            scrollTop: scroll_offset
          },
          300
        );
      }
    },
    search () {
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
    search2 () {
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
    }
  },
  components: {gridTable},
  created() {
      if(this.$route.query && this.$route.query.id){
          this.type = 'edit';
          this.apiGet(`/admin/api/sys/role/edit?id=${this.$route.query.id}`).then(data=>{
            if(data.status==200){
              this.formItem.roleName=this.$route.query.roleName;
              this.formItem.useFlag=this.$route.query.useFlag;
              let result_park=[];
              data.roleAuthority.sysRoleParks.forEach(val=>{
                result_park.push(val.parkId);
              });
              this.parksShow=JSON.parse(JSON.stringify(result_park));
              this.formItem.parks=JSON.parse(JSON.stringify(result_park));
              this.productSaved=JSON.parse(JSON.stringify(data.roleAuthority.sysRoleProducts));
            }else{
              this.$Message.warning(data.message);
            };
          }).catch(err=>{
            // this.$Message.warning('请选择要添加的产品!');
          });
      }else{
          this.type = 'add';
      }
  }
};
</script>
<style lang="scss" scoped>
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
>>> .ivu-modal-body {min-height:400px;}
.jingqu_group {width:260px;}
.jingqu_checkbox {min-width:120px; margin-right:10px; margin-bottom:10px;}
</style>