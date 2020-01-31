<template>
    <div class="newBuyorsend">
        <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleForm">
            
            <FormItem label="活动名称：" prop="name">
                <Input v-model="formItem.name" style="width:33%" :maxlength="16"></Input >
            </FormItem> 
            <FormItem label="活动名称：" v-if="type=='edit'">
               <span>{{formItem.startTime}} 至 {{formItem.endTime}}</span>
            </FormItem>            
            <FormItem v-else label="活动时间：" required>
                
                <Row >
                <Col span="3">
                    <FormItem >
                         <DatePicker type="datetime" :value="formItem.startTime" @on-change="getvalidStart" placeholder="开始时间" ></DatePicker>
                    </FormItem>
                </Col>
                <Col span="1" style="text-align: center"> 至</Col>
                <Col span="3">
                    <FormItem >
                       <DatePicker type="datetime" :value="formItem.endTime" @on-change="getvalidEnd" placeholder="结束时间"></DatePicker>
                    </FormItem>
                </Col>
            </Row>        
            </FormItem>
              <FormItem v-if="type=='edit'" label="选择产品：">
                    <span>{{formItem.showName}}</span>                              
            </FormItem>
            <FormItem v-else label="选择产品：" prop="showName">                               
                    <Button type="primary" @click="getGoods">上架产品</Button>
                    <Input v-model="formItem.showName" style="width:33%" :maxlength="11"></Input>                             
            </FormItem>
            <FormItem label="购买数量：" prop="buyCount">
                <Input v-model="formItem.buyCount" style="width:33%" :maxlength="11"></Input>
            </FormItem>
            <FormItem v-if="type=='edit'" label="优惠券：">
                 <span >{{formItem.couponTempletName}}</span>
            </FormItem>
            <FormItem v-else label="优惠券：" prop="couponTempletCode">               
                 <Select v-model="formItem.couponTempletCode" style="width:23%;">
                        <Option :value="item.code" v-for="(item,index) in couponList" :key="index">{{item.name}}</Option>
                    </Select>                 
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
                <Button @click="test">取消</Button>
            </FormItem>
        </Form>
        <Modal v-model="modalShow" width=600 title="已上架商品">
            <Form inline :model="sendForm">
                <FormItem>
                    <Select v-model="sendForm.modelType" >
                        <Option value="">--请选择--</Option>
                        <Option value="park">景区</Option>
                        <Option value="hotel">酒店</Option>
                        <Option value="mdse">商品</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input  v-model="sendForm.name"></Input>
                </FormItem>
                <Button type="primary" @click="getList">搜索</Button>
            </Form>
            <Table :columns="columns" :data="dataList"></Table>
            <Page :total="total" class-name="pages" @on-change="changepage" show-elevator></Page>
        </Modal>
    </div>
</template>


<script>
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      modalShow: false,
      formItem: {
        name: "",
        buyCount: "",
        startTime: null,
        endTime: null,
        showName: "",
        parkCode:"",
        modelType:'',
        couponTempletName:"",
        couponTempletCode:"",
        gradeInfo:""
      },
      ruleForm: {
        name: [{ required: true, message: "请填写活动名称", trigger: "blur" }],
        buyCount: [
          { required: true, message: "请填写参团人数", trigger: "blur" },
        ],
        showName: [
          { required: true, message: "请填写限购参数", trigger: "blur" }
        ],
        couponTempletCode: [
          {
            required: true,
            message: "请选择优惠券",
            trigger: "change"
          }
        ]
      },
      options3: {},
      options4: {},
      total: 0,
      price: "",
      columns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "编码",
          key: "productCode"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "选择",
                action: () => {
                    this.formItem.modelType = params.row.modelType;
                    this.formItem.showName = params.row.name;
                    this.formItem.parkCode = params.row.productCode;
                    this.modalShow = false;
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      dataList: [],
      sendForm: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc",
        modelType:"",
        name:"",
      },
      skuList: [],
      detailVoList: [],
      type:'add',
      couponList:[]
    };
  },
  created(){
      apiGet('/marketing/marketBuySend/addFL').then(res=>{

          if(res.status==200){
              this.couponList=res.data.couponList
          }
      })
      if(this.$route.query.id){
          this.type='edit'
           apiGet('/marketing/marketBuySend/editFL?id='+this.$route.query.id).then(res=>{
               if(res.status==200){
                   this.formItem=res.data.marketBuySend
               }else{
                  this.$Message.warning(res.message)
              }

      }) 
      }else{
          this.type='add'
      }
    
  },
  methods: {
    getGoods() {
      this.modalShow = true;
      this.getList();
    },
    changepage() {},
    getList() {
      apiPost("/marketing/marketBuySend/productGrid", this.sendForm).then(res => {
        this.dataList = res.rows;
        this.total = res.total;
      });
    },
    submit() {
      let _this = this; 
      if(this.type=='add'){
          if(this.formItem.couponTempletCode=='MCT18040417141786'){
          this.formItem.couponTempletName = "优惠券001"
      }else if(this.formItem.couponTempletCode=='MCT18080213294041'){
          this.formItem.couponTempletName = "商品满即送优惠券"
      }
      let url = "/marketing/marketBuySend/saveBuySend";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "page",
        callback(res) {
          if (res.success) {
            _this.$Message.success("操作成功");
            _this.$router.back();
          } else {
            _this.$Message.warning(res.message);
          }
        }
      });
      }else if(this.type=='edit'){
          apiPost('/marketing/marketBuySend/doUpdate/'+this.$route.query.id,{
                _method: "put",
                name: this.formItem.name,
                buyCount: this.formItem.buyCount,
          }).then(res=>{
              if(res.success){
                  this.$Message.success('修改成功')
                  this.$router.back()
              }else{
                  this.$Message.warning(res.message)
              }
          })
      }    
      

    },
    test(){
        this.$router.back();
    },
    getvalidStart(time) {
      this.formItem.startTime = time;
    },
    getvalidEnd(time) {
      this.formItem.endTime = time;
    }
  }
};
</script>

<style lang="scss">
.newBuyorsend {
  width: 100%;
}
.table {
  margin-bottom: 15px;
  width: 70%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  tr {
    td {
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #dddddd;
      padding: 8px;
      line-height: 20px;
    }
    th {
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #dddddd;
      padding: 8px;
      line-height: 20px;
    }
  }
  .table-title {
    background-color: #f5fafe;
  }
}
</style>





