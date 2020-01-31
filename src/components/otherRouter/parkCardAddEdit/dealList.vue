<template>
  <div class="deal-list">
    <!-- <searchForm :search-items='searchItems'>

    </searchForm>-->
    <div class="search-list">
      <Form ref="formInline"  inline >
        <FormItem>
          <Input class="deal-list-input" v-model="orderNo" placeholder="请输入交易订单号" />
        </FormItem>  
        <FormItem>
          <Input class="deal-list-input" v-model="telNo" placeholder="请输入手机号码" />
        </FormItem>  
        <FormItem>
          <Input class="deal-list-input" v-model="cardNo" placeholder="请输入身份证号" />
        </FormItem>  
        
        <FormItem  v-for="(item,index) in searchItems"  v-if="item.type=='select'" :key="index">
          <Select  v-model="formItem[item.name]" style="width:180px" :placeholder="'请选择'+item.label">
            <Option v-for="sitem in item.data" :value="sitem.value" :key="sitem.value">{{ sitem.label }}</Option>
          </Select>
        </FormItem>  
        <FormItem>
           <DatePicker
            @on-change="setStartTime"
            :options="options3"
            type="date"
            format="yyyy-MM-dd"
            placeholder="请选择交易开始日期"
          ></DatePicker>
        </FormItem>
        <FormItem>
           <DatePicker
            @on-change="setEndTime"
            :options="options4"
            type="date"
            format="yyyy-MM-dd"
            placeholder="请选择交易结束日期"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="ios-search" @click="getData">搜索</Button>
        </FormItem>   
        <FormItem>
          <Button :loading="exportLoading" @click="exportExcel">导出</Button>
        </FormItem>   
      </Form>
    </div>
    <!-- <Table border :columns="columns7" :data="data6"></Table> -->
    <table class="deal-list-table" width="100%">
      <thead>
        <tr>
          <th>
            <div class="title">第三方交易号</div>
          </th>
          <th>
            <div class="title">交易信息</div>
            <div class="info">交易单号|交易时间</div>
          </th>
          <th>
            <div class="title">年卡信息</div>
            <div class="info">年卡名称|线下编码</div>
          </th>
          <th>
            <div class="title">游客信息</div>
            <div class="info">姓名|手机|身份证|卡片ID</div>
          </th>
          <!-- <th>
            <div class="title">其它信息</div>
            <div class="info">邮箱|照片</div>
          </th>-->
          <th>
            <div class="title">支付信息</div>
            <div class="info">交易类型|金额</div>
          </th>
          <th>
            <div class="title">订单状态</div>
            <div class="info">订单状态</div>
          </th>
          <th>
            <div class="title">支付状态</div>
            <div class="info">支付状态</div>
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="pageList.length">
          <tr v-for="(item,index) in pageList" :key="index">
            <td>
              <div>{{item.gateWayTransNo}}</div>
            </td>
            <td>
              <div class="blue">{{item.orderNo?item.orderNo:''}}</div>
              <div>{{item.createTime}}</div>
            </td>
            <td>
              <div>{{item.yearCardName}}</div>
              <div>{{item.underLineCode}}</div>
            </td>
            <td>
              <div>{{item.accName}}{{item.telNo?('/' + item.telNo):''}}</div>
              <div>{{item.cardNo?item.cardNo:''}}</div>
            </td>
            <td>
              <span>充值</span>
              <template v-if="item.orderSum||item.orderSum=='0'">
                <span>/</span>
                <span class="red">{{item.orderSum}}</span>
                <span>元</span>
              </template>
            </td>
            <td>
              <span>{{item.orderStatusCH}}</span>
              <!-- <span style="color:#999">失败</span> -->
            </td>
            <td>
              <span>{{item.payStatusCH}}</span>
              <!-- <span>{{item.approvalStatus?('/'+filter.getRefundStaus(item.approvalStatus)):''}}</span> -->
            </td>
            <td>
              <Button
                @click="refund(item.id)"
                size="small"
              >退款</Button>
              <Button @click="dealDetail(item.payOrderNo)" size="small">交易详情</Button>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="7">暂无数据</td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-if="pageList.length" style="margin-top:10px">
      <!-- {{total}} -->
      <Page @on-change="pageChange" :total="total" show-elevator></Page>
    </div>
    <Modal v-model="modal1" title="退款" @on-ok="refundOk" @on-cancel="cancel">
      <!-- {{formItem}} -->
      <Form :model="formItem" :label-width="80">
        <FormItem label="退款原因">
          <Input
            v-model="formItem.reason"
            type="textarea"
            :rows="4"
            :maxlength="200"
            placeholder="请输入退款原因"
          />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="modal2"
      class="deal-modal"
      title="交易详情"
      width="1000"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <div class="deal-detail">
        <div class="title">订单信息</div>
        <table class="detail-table">
          <tr>
            <td>订单编号</td>
            <td>{{dealData.orderNo}}</td>
            <td>下单时间</td>
            <td>{{dealData.createTime}}</td>
            <td>交易流水号</td>
            <td>{{dealData.payOrderNo}}</td>
          </tr>
          <tr>
            <td>支付时间</td>
            <td>{{dealData.payTime?dealData.payTime:'无'}}</td>
            <td>支付方式</td>
            <td>{{dealData.payTypeCH?dealData.payTypeCH:'无'}}</td>
            <td>支付状态</td>
            <td>{{filter.getPayStaus(dealData.payStatus)}}</td>
          </tr>
          <tr>
            <td>退款状态</td>
            <td>{{dealData.refundStatusCH?dealData.refundStatusCH:'无'}}</td>
            <td>交易类型</td>
            <td>充值</td>
            <td>订单金额</td>
            <td>{{dealData.orderSum}}元</td>
          </tr>
        </table>
        <div class="title">年卡信息</div>
        <table class="detail-table">
          <tr>
            <td>年卡名称</td>
            <td>{{dealData.yearCardName}}</td>
            <td>线下编码</td>
            <td>{{dealData.underLineCode}}</td>
            <td>年卡介质类型</td>
            <td>{{dealData.cardTypeCh}}</td>
          </tr>
        </table>
        <div class="title">游客信息</div>
        <table class="detail-table">
          <tr>
            <td>姓名</td>
            <td>{{dealData.accName}}</td>
            <td>手机</td>
            <td>{{dealData.telNo?dealData.telNo:'无'}}</td>
          </tr>
          <tr>
            <td>身份证号</td>
            <td>{{dealData.cardNo?dealData.cardNo:'无'}}</td>
            <td>家庭地址</td>
            <td>{{dealData.address?dealData.address:'无'}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiPost, apiGet } from "@/fetch/api";
export default {
  data() {
    let _this = this;
    return {
      options3: {
        disabledDate(date) {
          // console.log(date.valueOf());
          // console.log(_this.endTime);
          let endDate = new Date(_this.endTime);
          let endDateValue = endDate.valueOf();
          // console.log(endDateValue);
          if (endDateValue) {
            return date && date.valueOf() > endDateValue;
          } else {
            return false;
          }
        }
      },
      options4: {
        disabledDate(date) {
          let startDate = new Date(_this.startTime);
          let startDateValue = startDate.valueOf();
          // console.log(startDateValue);
          if (startDateValue) {
            return date && date.valueOf() < startDateValue - 86400000;
          } else {
            return false;
          }
        }
      },
      orderNo: "",
      yearCardName: "",
      telNo: "",
      cardNo:"",
      email: "",
      orderStatus:"",
      payStatus:"",
      startTime: "",
      endTime: "",
      dealData: {},
      orderTypeList: [
        "开通",
        "挂失",
        "解挂",
        "补卡",
        "退卡",
        "修改",
        "充值",
        "换卡",
        "公园卡转市民卡",
        "市民卡转公园卡",
        "注销"
      ],
      pageList: [],
      total: null,
      formItem: {
        reason: "",
        orderStatus:"",
        payStatus:""
      },
      modal2: false,
      modal1: false,
      searchItems: [
        {
          label: "交易订单号",
          type: "input",
          name: "keyword"
        },
        {
          label: "年卡名称",
          type: "input",
          name: "keyword"
        },
        {
          label: "手机号码",
          type: "input",
          name: "keyword"
        },
         {
          label: '身份证',
          type: 'input',
          name: 'cardNo'
        },
        {
          label: "邮箱",
          type: "input",
          name: "keyword"
        },
        {
          label: "交易开始日期",
          type: "date",
          name: "keyword"
        },
        {
          label: "交易结束日期",
          type: "date",
          name: "keyword"
        },
        {
          label: "全部订单状态",
          type: "select",
          name: "orderStatus",
          data: [
            {
              value: "",
              label: "--请选择订单状态--"
            },
            {
              value: "order_init",
              label: "订单初始化"
            },
            {
              value: "order_rechargeing",
              label: "充值中"
            },
            {
              value: "recharge_success",
              label: "充值成功"
            },
            {
              value: "recharge_failure",
              label: "充值失败"
            },
            {
              value: "order_close",
              label: "订单关闭"
            },
            {
              value: "order_refund",
              label: "订单已退款"
            }, 
            {
              value: "recharge_cancel",
              label: "充值取消"
            },
          ]
        },
        {
          label: "全部支付状态",
          type: "select",
          name: "payStatus",
          // 支付状态 wait_pay:待支付,pay_success:支付成功,pay_overdue:支付过期,pay_failure:支付失败
          data: [
            {
              value: "",
              label: "--请选择支付状态--"
            },
            {
              value: "wait_pay",
              label: "待支付"
            },
            {
              value: "pay_success",
              label: "支付成功"
            },
            {
              value: "pay_overdue",
              label: "支付过期"
            },
            {
              value: "pay_failure",
              label: "支付失败"
            },
          ]
        },
      ],
      data: "",
      params: { page: 1, limit: 10, sort: "modifyTime", order: "desc" },
      url: "list/admin/sysFunctions/grid",
      modal: false,
      page: 1,
      limit: 10,
      userData: null,
      exportLoading:false
    };
  },
  mounted() {
    apiGet("/admin/userStore/detail").then(res => {
      //获取店铺id
      // console.log(res);
      if (res && res.user && res.user.merchantInfoId) {
        this.userData = res.user;
        this.getData();
      } else {
        this.$Message.warning("登录超时，请先登录！");
      }
    });
  },
  components: { gridTable, confirm, searchForm },
  methods: {
    cancel() {
      this.formItem.reason = "";
    },
    refund(id) {
      this.modal1 = true;
      this.orderId = id;
    },
    refundOk() {
      apiGet(
        "/yearcard/yearCardOrderInfo/yearCardRefundB?orderId=" +
          this.orderId +
          "&reason=" +
          this.formItem.reason
      ).then(res => {
        this.formItem.reason = "";
        // console.log(res);
        if (res.success) {
          this.$Message.success("退款成功");
          this.getData();
        } else {
          this.$Message.warning(res.message);
          this.getData();
        }
      });
    },
    setStartTime(time) {
      // console.log(time);
      this.startTime = time;
      // console.log(time);
    },
    setEndTime(time) {
      // console.log(time);
      this.endTime = time;
    },
    dealDetail(id) {
      this.modal2 = true;
      apiGet(
        "/yearcard/yearCardOrderInfo/selectByPayOrderNo?payOrderNo=" + id
      ).then(res => {
        this.dealData = res.data[0];
      });
    },
    getData() {
      // console.log(this.startTime);
      // console.log(this.endTime);
      let _params = {
        merchantInfoId: this.userData.merchantInfoId,
        buyerId: this.userData.mainUserInfoId,
        page: this.page,
        limit: this.limit,
        orderNo: this.orderNo,
        yearCardName: this.yearCardName,
        telNo: this.telNo,
        cardNo: this.cardNo,
        orderStatus: this.formItem.orderStatus,
        payStatus: this.formItem.payStatus,
        // email: this.email,
        startTime: this.startTime,
        endTime: this.endTime
      };
      // console.log(params)
      apiGet("/yearcard/yearCardOrderInfo/selectTransList", _params).then(
        res => {
          this.total = res.data.total;
          // console.log(res);
          this.pageList = res.data.rows;
        }
      );
    },
    pageChange(page) {
      // console.log("pageChange");
      this.page = page;
      this.getData(this.userData);
    },
    limitChange(pageSize) {
      // console.log("limitChange");
      this.limit = pageSize;
      this.getData(this.userData);
    },
    add() {
      this.$router.push({ path: "/parkCardAddEdit" });
    },
    dealList() {
      this.$router.push({ path: "/dealList" });
    },
    splits(test) {
      return test.split(",");
    },
    ok() {
      this.formItem.accType = 0;
      this.formItem.useFlag = this.formItem.switch ? 1 : 0;
      let _this = this;
      let url =
        _this.type === "add"
          ? "list/admin/sysFunctions/saveRole"
          : "list/admin/sysFunctions/update";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback(res) {
          if (res.success) {
            _this.modal = false;
          }
        }
      });
    },
    showModal() {
      this.modal = true;
      this.formItem.funName = "";
      this.formItem.funCode = "";
      this.formItem.optType = "";
      this.formItem.sortNo = "";
      this.formItem.openModes = "";
      this.formItem.functionTypes = "";
      this.formItem.hierarchys = "";
      this.formItem.funTypes = [];
      this.type = "add";
      this.formItem.switch = true;
      this.modalTitle = "新增角色";
    },
    delAll() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("list/admin/sysFunctions/" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    exportExcel(){
      let _this = this;
      this.exportLoading = true
      let _params = {
        merchantInfoId: this.userData.merchantInfoId,
        buyerId: this.userData.mainUserInfoId,
        page: this.page,
        limit: this.limit,
        orderNo: this.orderNo,
        yearCardName: this.yearCardName,
        telNo: this.telNo,
        cardNo: this.cardNo,
        orderStatus: this.formItem.orderStatus,
        payStatus: this.formItem.payStatus,
        // email: this.email,
        startTime: this.startTime,
        endTime: this.endTime
      };
      let str = "";
      for (let ele in _params) {
        if (_params[ele] === 0 || _params[ele]) {
          str += ele + "=" + _params[ele] + "&";
        }    
      }
  
      let url = "/yearcard/yearCardOrderInfo/export?" + str.substring(0, str.length - 1);
      this.common.exportData(
        "公园年卡交易记录报表",
        url,
        () => {
          _this.exportLoading = false;
        },
        _this
      );
    }
  }
};
</script>
<style lang='scss'>
.deal-modal {
  .deal-detail {
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      background: #e1e0e4;
      margin-bottom: 10px;
    }
    .detail-table {
      border-collapse: collapse;
      margin: 0 auto;
      margin-bottom: 15px;
      width: 100%;
      tr {
        td {
          border: 1px solid #e9eaec;
          height: 40px;
          text-align: center;
        }
        td:nth-child(odd) {
          background: #cbcbcb;
          color: #fff;
          width: 100px;
        }
        td:nth-child(even) {
          width: 200px;
        }
      }
    }
  }
}
.deal-list {
  .search-list {
    margin-bottom: 15px;
    .deal-list-input {
      width: 150px;
      // margin-right: 10px;
    }
  }
  .deal-list-table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    .blue {
      color: rgb(102, 153, 255);
    }
    .red {
      color: rgb(255, 0, 0);
    }
  }
  .deal-list-table td,
  .deal-list-table th {
    border: 1px solid #e9eaec;
    // color: #666;
    // height: 30px;
  }
  .deal-list-table thead th {
    background-color: #f8f8f9;
    // width: 100px;
    height: 50px;
    .title {
    }
    .info {
      color: rgb(153, 153, 153);
    }
  }
  .deal-list-table tbody td {
    // background-color: #f8f8f9;
    // width: 100px;
    height: 48px;
  }
  // .deal-list-table tr:nth-child(odd) {
  //   background: #fff;
  // }
  // .deal-list-table tr:nth-child(even) {
  //   background: #f5fafa;
  // }
}
</style>

