<template>
    <div class="electroniclnvoices">
    <searchForm :search-items='searchItems'></searchForm>
    <!-- <Row :gutter="16" class="btn-groups">
        <Col span="3"><Button type="primary" icon="android-add" style="margin-bottom:20px;" @click="addCoupon">参数配置</Button></Col>
        <Col span="3"><Button type="success" icon="android-done" @click="open">C端入口开启</Button></Col>
        <Col span="2" ><Button type="error" icon="android-close" @click="down">C端入口关闭</Button></Col>
    </Row> -->
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url" :extraParams='extraParams'></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <!-- 弹出层 -->
    
   </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import { apiPost, apiGet } from "@/fetch/api";
import confirm from "@/components/global/confirm";
export default {
  components: {
    searchForm,
    gridTable,
    confirm
  },
  data() {
    return {
      setModal: false,
      extraParams: true,
      searchItems: [
        {
          label: "交易订单号",
          type: "input",
          name: "orderNo"
        },
        {
          label: "购方名称",
          type: "input",
          name: "buyDutyName"
        },
        {
          label: "手机号",
          type: "input",
          name: "buyTel"
        },
        {
          label: "邮箱",
          type: "input",
          name: "receiveEmail"
        },
        {
          label: "开票开始日期",
          type: "date",
          name: "invoiceTimeLower"
        },
        {
          label: "开票结束日期",
          type: "date",
          name: "invoiceTimeUpper"
        }
      ],
      columns: [
        {
          title: "订单号信息交易号|开票时间",
          sortable: true,
          key: "showOrder",
          render:(h,params)=>{
              return h("span",params.row.showOrder.replace("<br/>"," / "))          
          }
        },
        {
          title: "第三方流水号",
          sortable: true,
          key: "thirdSerialNo",
           render:(h,params)=>{
              return h("span",params.row.thirdSerialNo)
           }
        },
        {
          title: "电票商",
          key: "seller",
          sortable: true,
          render:(h,params)=>{
              return h("span",params.row.seller)
           }
        },
        {
          title: "纳税人信息纳税人识别名称|纳税人识别号",
          key: "ratepayerInfo",
          sortable: true,
           render:(h,params)=>{
              return h("span",params.row.ratepayerInfo.replace("<br/>"," / "))              
           }
        },
        {
          title: "发票信息发票代码|发票号码",
          key: "showInvoice",
          sortable: true,
          render:(h,params)=>{
            return h("span",params.row.showInvoice.replace("<br/>"," / "))
          }
        },
        {
          title: "购方信息姓名|手机",
          key: "showBuyer",
          sortable: true,
          render:(h,params)=>{
            return h("span",params.row.showBuyer.replace("<br/>"," / "))
          }
        },
        {
          title: "地址邮箱|下载地址",
          key: "showAddress",
          sortable: true,
          render:(h,params)=>{
            return h("span",params.row.receiveEmail + ' / ' + params.row.downloadUrl)
          }
        },
        {
          title: "金额不含税金额|合计税额",
          key: "sumAmount",
          sortable: true,
          render:(h,params)=>{
            return h("span",params.row.sumAmount ? params.row.sumAmount.toFixed(2): '' + ' / ' + params.row.taxAmount)
          }
        },        
        {
          title: "状态请求状态|返回状态",
          key: "showStatus",
          sortable: true,
        },        
      ],
      mode: "",
      content: "",
      sucessMsg: "",
      dataList: {},
      modalpay: false,
      modalTitle: "",
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      url: ""
    };
  },
  created() {
      this.apiPost('/marketing/marketElectronicInvoices/listFL').then(res => {
          if(res.success){
              this.extraParams = false;
              this.url = '/marketing/marketElectronicInvoices/adminGrid'
          }
      })
  },
  methods: {
    // ok() {

    // },
    // setDel() {
    //   this.setModal = false;
    // },
    // addCoupon() {
    //   this.$router.push("/electronicConfig");
    // },
    // open(){
    //     this.content="确定开启吗？"
    //     this.mode="done"
    //     this.sucessMsg="操作成功!"
    //     this.$refs.confirmModel.confirm('/marketing/marketElectronicInvoices/enable?enable=true')
    // },
    // down(){
    //     this.content="确定关闭吗？"
    //     this.mode="done"
    //     this.sucessMsg="操作成功!"
    //     this.$refs.confirmModel.confirm('/marketing/marketElectronicInvoices/enable?enable=false')
    // },
  }
};
</script>

<style lang="scss">
.electroniclnvoices {
  width: 100%;
}
.table {
  margin-bottom: 15px;
  width: 100%;
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
    .table-title {
      background-color: #f5fafe;
    }
  }
}
</style>







