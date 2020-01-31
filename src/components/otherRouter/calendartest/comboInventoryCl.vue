<template>
    <div class="inventoryCl">
        <Row>
            <Col span="18">
            <div class="head-box">
                <h3 class="i-b calendar-title"> {{routeName}}</h3>
            </div>
            <div style="font-size:14px;color:red; padding-bottom:10px;">
                选择日期（点击鼠标单个选中）（日历中价格单位为人民币,多票型共享一个日库存）
            </div>
            <combo-calendar ref="fullCa" class="test-fc" :action="action" :extend="extend" :param="calendarParam" @getCheckInfo="getCheckInfo">
            </combo-calendar>
            </Col>
            <Col span="6">
            <Form style='margin-top:66px;margin-left:10px;' ref="formItem" :model="formItem" :rules="ruleForm">
                <table class="table">
                    <thead>
                        <tr>
                            <th colspan="2">编辑价格和库存（人民币）</th>
                        </tr>                
                        <tr>
                            <th>名称</th>
                            <th>值</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>成本价</td>
                            <td>       
                                <div  v-for="(item, index) in formItem.costPriceDtoList" :key="index" style="width:100%; margin: 5px 0 24px 0">
                                    <span style="max-width:60%; width:40%; display:inline-block; vertical-align:middle; text-align:center">{{item.nickName}}</span>
                                    <FormItem style="width:30%; display:inline-block; vertical-align:middle; margin-bottom:0" :prop="'costPriceDtoList.' + index + '.costPrice'"
                                    :rules="[{ pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">                                        
                                        <Input v-model="item.costPrice" :maxlength="8"></Input>
                                    </FormItem>
                                    <span>*{{item.formNum}}</span>
                                </div>
                                <div v-if="formItem.costPriceDtoList.length>0">
                                    <span style="max-width:60%; width:40%; display:inline-block; vertical-align:middle; text-align:center">合计</span>
                                    <FormItem prop="price" style="width:30%; display:inline-block; vertical-align:middle; margin-bottom:0" :rules="[{required: true, message: '该项不能为空！', trigger: 'blur'},{ pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">                                        
                                        <Input v-model="formItem.price" :maxlength="6" disabled></Input>
                                    </FormItem>                                    
                                </div>
                                                       
                            </td>
                        </tr>
                        <tr>
                            <td>门市价</td>
                            <td>
                                <FormItem prop="merchantLinePrice" :rules="[{required: true, message: '该项不能为空！', trigger: 'blur'},{ pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                    <Input v-model="formItem.merchantLinePrice" :maxlength="6"></Input>
                                </FormItem>
                            </td>
                        </tr>
                        
                        <tr>
                            <td>零售价（由组成价汇总而成）</td>
                            <td>
                                <div  v-for="(item, index) in formItem.salePriceDtoList" :key="index" style="width:100%; margin: 5px 0">
                                    <span style="max-width:60%; width:40%; display:inline-block; vertical-align:middle; text-align:center">{{item.nickName}}</span>
                                    <FormItem style="width:30%; display:inline-block; vertical-align:middle; margin-bottom:0" :prop="'salePriceDtoList.' + index + '.salePrice'"
                                    :rules="[{ pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">                                        
                                        <Input v-model="item.salePrice" :maxlength="8"></Input>                                        
                                    </FormItem>
                                    <span>*{{item.formNum}}</span>
                                </div>    
                                <div v-if="formItem.salePriceDtoList.length>0">
                                    <span style="max-width:60%; width:40%; display:inline-block; vertical-align:middle; text-align:center">合计</span>
                                    <FormItem prop="salePrice" style="width:30%; display:inline-block; vertical-align:middle; margin-bottom:0" :rules="[{ pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">                                        
                                        <Input v-model="formItem.salePrice" :maxlength="6" disabled></Input>
                                    </FormItem>  
                                </div>                            
                            </td>
                        </tr>
                        
                        <tr>
                            <td>日库存</td>
                            <td>
                                <FormItem prop="totalNum" :rules="[{required: true, message: '该项不能为空！', trigger: 'blur'},{ pattern: /^(([1-9][0-9]*))$/, message: '数据格式不正确'}]">
                                    <Input v-model="formItem.totalNum" :maxlength="8"></Input>                                
                                </FormItem>                                
                            </td>
                        </tr>
                        <tr>
                            <td>零售状态</td>
                            <td>
                                <Select v-model="formItem.salePriceStatus" style="width:150px;">
                                    <Option value="T">在售</Option>
                                    <Option value="F">停售</Option>
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <span>调整原因:</span>
                                <Input class="reason" v-model="formItem.remark" type="textarea" :rows="4"></Input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="handleTd">
                                <Button type="primary" @click="save">保存</Button>
                                <Button type="ghost" @click="reset">重置</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Form>
            </Col>
        </Row>
    </div>
</template>
<script>
import comboCalendar from "@/components/global/comboCalendar";
import moment from "moment";
import { apiPost,apiGet } from "@/fetch/api";

export default {
  mounted() {
  },
  computed: {
    price() {
        let totalcbj = 0;
        //成本价合计
        let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        this.formItem.costPriceDtoList.forEach((item, index)=> {            
            if(reg.test(item.costPrice)){
                let ictotal = (item.costPrice)*(item.formNum);
                totalcbj += parseFloat(ictotal*100);
            }            
        });        
        return (totalcbj/100).toFixed(2);
    },
    salePrice() {
        let totallsj = 0;        
        //零售价合计
        let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        this.formItem.salePriceDtoList.forEach((item, index)=> {
            if(reg.test(item.salePrice)){
                let istotal = (item.salePrice)*(item.formNum);
                totallsj += parseFloat(istotal*100);
            }            
        });
        return (totallsj/100).toFixed(2);        
    }
  },
  watch:{
    price:{
        handler: function(val){          
          this.formItem.price = val;
        },
        immediate: true
    },
    salePrice: {
      handler: function(val){
        this.formItem.salePrice = val;
      },
      immediate: true  
    }
  },
  data() {
    return {
      routeName: "",
      salePriceStatus:"T",      
      action: "/product/api/familyTicket/selectFamilyCalendar",
      extend: [
        {
          title: "零售价",
          key: "salePrice",
          render: (h, params) => {
            let salePrice =
              typeof params.row.salePrice === "undefined"
                ? "--"
                : params.row.salePrice;
            return h("b", salePrice);
          }
        },       
        {
          title: "状态",
          key: "salePriceStatus",
          render: (h, params) => {
            if (typeof params.row.salePriceStatus === "undefined") {
              return h("a", "--");
            } else {
              if (params.row.salePriceStatus == "T") {
                return h("a", { style: { color: "#2b85e4" } }, "在售");
              } else {
                return h("a", { style: { color: "#f40" } }, "停售");
              }
            }
          }
        },
        {
          title: "已售",
          key: "saleNum",
          render: (h, params) => {
            let saleNum =
              typeof params.row.saleNum === "undefined"
                ? "--"
                : params.row.saleNum;
            return h("b", saleNum);
          }
        },
        {
          title: "库存",
          render: (h, params) => {
            let stock = (params.row.stock||params.row.stock==0) ? params.row.stock : "--";
            let totalNum = params.row.totalNum ? params.row.totalNum : "--";
            return h("b", stock + "/" + totalNum);            
          }
        }
      ],
      calendarParam: {
        familyTicketId: this.$route.params.id        
      },
      formItem: {        
        dates: "",
        merchantLinePrice: "0",
        totalNum: "",
        remark: "",        
        salePriceStatus:"",        
        costPriceDtoList: [],
        salePriceDtoList: [],
        price: '',              //成本价(合计)
        salePrice: ''           //零售价(合计)
      },
      ruleForm: {}     
    };
  },
  methods: {
    save() {
      // this.formItem.salePriceStatus = this.formItem.salePriceStatus;
      this.formItem.familyTicketId = this.$route.params.id;
      let formData = JSON.parse(JSON.stringify(this.formItem)); 
      formData.costPriceDtoList = JSON.stringify(formData.costPriceDtoList);
      formData.salePriceDtoList = JSON.stringify(formData.salePriceDtoList);
      console.log(formData);
      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let res = await this.apiPost(
            "/product/api/familyTicket/saveFamilyDailyPriceStock",
            formData
          );
          if (res.status == 200) {           
            this.$Message.success("修改成功！");
            this.$refs.fullCa.reload();
            this.formItem.dates = "";
            console.log('this.formItem', this.formItem)
          } else {
            this.$Message.warning(res.message);
          }
        }
      });      
    },
    reset() {
      (this.formItem = {
        price: "", // 成本价合计
        merchantLinePrice: "0", // 门市价
        salePrice: '',// 零售价合计
        costPriceDtoList: [],
        salePriceDtoList: [],        
        totalNum: "", // 库存
        remark: "", // 调整原因
        salePriceStatus: '',
        dates: '',        
      }),
        this.$refs.formItem.resetFields();
    },
    getCheckInfo(items) {
      if (items.length) {
        console.log(items);
        // this.formItem = items[0];
        let dates = [];
        items.forEach(element => {
          dates.push(element.date);
        });
        this.formItem.costPriceDtoList = items[0].costPriceDtoList ? JSON.parse(items[0].costPriceDtoList) : [];     
        this.formItem.salePriceDtoList = items[0].salePriceDtoList ? JSON.parse(items[0].salePriceDtoList) : [];
        this.formItem.costPriceDtoList.forEach((item, index)=>{
          if(this.formItem.costPriceDtoList[index].costPrice){
            this.formItem.costPriceDtoList[index].costPrice = this.formItem.costPriceDtoList[index].costPrice + '';
          }          
        })
        this.formItem.salePriceDtoList.forEach((item, index)=>{
          this.formItem.salePriceDtoList[index].salePrice = this.formItem.salePriceDtoList[index].salePrice + '';
        })
        this.formItem.dates = dates.join(',');
        // console.log(this.formItem.dates)
        this.formItem.merchantLinePrice = items[0].merchantLinePrice?items[0].merchantLinePrice+'':'';
        this.formItem.totalNum = items[0].totalNum?items[0].totalNum+'':'';
        this.formItem.salePriceStatus = items[0].salePriceStatus;   
        this.formItem.remark = items[0].remark;
      }
    },
  },
  components: {
    comboCalendar
  }
};
</script>
<style lang='scss'>
.inventoryCl{
 .head-box {
    .calendar-title {
      width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 35px;
      line-height: 35px;
    }
    
  }
.handleTd {
  text-align: center;
}
.reason {
  display: inline-block;
  width: calc(100% - 70px);
  margin-left: 10px;
}
.app {
  color: green;
}
.table {
  margin-bottom: 15px;
  width: 100%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  thead {
    tr {
      th {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
      }
      th:first-child {
        text-align: center;
      }
    }
  }
  tbody {
    tr {
      td {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
      }
    }
  }
}
}
</style>
