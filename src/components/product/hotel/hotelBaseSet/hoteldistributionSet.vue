<template>
  <div class="hoteldistributionSet-page">
    <div class="step">
      <Steps :current="2">
        <Step
          title="酒店基础管理"
          class="step-hotelType"
          style="cursor:pointer"
        ></Step>
        <Step
          title="房型管理"
          class="step-distributy"
          style="cursor:pointer"
        ></Step>
        <Step title="销售设置"></Step>
      </Steps>
    </div>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div
        id="base"
        class="form-title"
      >店铺-销售设置</div>
      <FormItem
        label="虚拟销量："
        prop="virtualSales"
      >
        <Input
          v-model="formItem.virtualSales"
          :maxlength="9"
          style="width:200px;"
        ></Input>
      </FormItem>
      <FormItem
        label="展示起价："
        prop="showSales"
      >
        <Input
          v-model="formItem.showSales"
          :maxlength="9"
          style="width:200px;"
        ></Input>
        <span class="money-unit">元</span>
      </FormItem>
      <!-- <FormItem
        label="预定须知："
        prop="bookingInfo"
      >
        <Row>
          <Col span="12">
          <Input
            type="textarea"
            v-model="formItem.bookingInfo"
            :rows="4"
            placeholder="请输入预定须知"
          ></Input>
          </Col>
        </Row>
      </FormItem> -->
      <!-- <div
        id="base"
        class="form-title"
      >分销市场-销售设置</div>
      <FormItem
        label="虚拟销量："
        prop="distVirtualSales"
      >
        <Input
          v-model="formItem.distVirtualSales"
          :maxlength="9"
          style="width:200px;"
        ></Input>
      </FormItem>
      <FormItem
        label="展示起价："
        prop="distShowSales"
      >
        <Input
          v-model="formItem.distShowSales"
          :maxlength="9"
          style="width:200px;"
        ></Input>
        <span class="money-unit">元</span>
      </FormItem>
      <FormItem
        label="分销政策："
        prop="salesPolicy"
      >
        <Row>
          <Col span="12">
          <Input
            type="textarea"
            v-model="formItem.salesPolicy"
            :rows="4"
            placeholder="请输入分销政策"
          ></Input>
          </Col>
        </Row>
      
      </FormItem>
      <FormItem
        label="售后政策："
        prop="afterSalesPolicy"
      >
        <Row>
          <Col span="12">
          <Input
            type="textarea"
            v-model="formItem.afterSalesPolicy"
            :rows="4"
            placeholder="请输入售后政策"
          ></Input>
          </Col>
        </Row> 
      </FormItem> -->

      <FormItem>
        <div class="save-cancel">
          <Button
            type="primary"
            :loading="btnLoading"
            @click="submit"
          >保存</Button>
          <Button
            type="ghost"
            @click="back"
            style="margin-left: 8px"
          >取消</Button>
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import vueUEditor from "@/components/global/vueUEditor";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200,
        maximumWords: 500
      },
      btnLoading: false,
      testStr: "",
      formItem: {
        virtualSales: "", //店铺虚拟销量
        showSales: "", //店铺展示起价
        bookingInfo: "", //预定须知
        distVirtualSales: "", //分销市场虚拟销量
        distShowSales: "", //分销市场展示起价
        salesPolicy: "", //分销政策
        afterSalesPolicy: "" //售后政策
      },
      ruleComplteForm: {
        bookingInfo: [
          { required: true, message: "请填写预定须知" },
          { max: 500, message: "预定须知字数不能超过500个" }
        ],
        salesPolicy: [
          { required: true, message: "请填写分销政策", trigger: "blur" },
          { max: 500, message: "分销政策字数不能超过500个" }
        ],
        afterSalesPolicy: [
          { required: true, message: "请填写售后政策", trigger: "blur" },
          { max: 500, message: "售后政策字数不能超过500个" }
        ],
        virtualSales: [
          {
            required: true,
            message: "请填写店铺虚拟销量"
          },
          {
            max: 9,
            pattern: /^[1-9]\d*$/,
            message: "数据格式不正确"
          }
        ],
        showSales: [
          {
            required: true,
            message: "请填写店铺展示起价"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        distVirtualSales: [
          {
            required: true,
            message: "请填写分销市场虚拟销量"
          },
          {
            max: 9,
            pattern: /^[1-9]\d*$/,
            message: "数据格式不正确"
          }
        ],
        distShowSales: [
          {
            required: true,
            message: "请填写分销市场展示起价"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ]
      }
    };
  },
  computed: {},
  created() {
    apiPost("/pmsproduct/api/pmsDistSet/queryPmsDistSet", {
      mainUserId: this.$route.query.mainUserId,
      pmsHotelId: this.$route.query.id
    }).then(res => {
      if (res.status == 200) {
        this.pageData = res.data;
        this.formItem.virtualSales = res.data.virtualSales
          ? res.data.virtualSales
          : "";
        this.formItem.showSales = res.data.showSales ? res.data.showSales : "";
        this.formItem.bookingInfo = res.data.bookingInfo
          ? res.data.bookingInfo
          : "";
        this.formItem.distVirtualSales = res.data.distVirtualSales
          ? res.data.distVirtualSales
          : "";
        this.formItem.distShowSales = res.data.distShowSales
          ? res.data.distShowSales
          : "";
        this.formItem.salesPolicy = res.data.salesPolicy
          ? res.data.salesPolicy
          : "";
        this.formItem.afterSalesPolicy = res.data.afterSalesPolicy
          ? res.data.afterSalesPolicy
          : "";
      }
    });
  },
  mounted() {
    $(".step-hotelType").click(() => {
      this.$router.push(
        "/hotelBaseInfo?id=" +
          this.$route.query.id +
          "&mainUserId=" +
          this.$route.query.mainUserId
      );
    });
    $(".step-distributy").click(() => {
      this.$router.push(
        "/roomInfoSet?id=" +
          this.$route.query.id +
          "&mainUserId=" +
          this.$route.query.mainUserId
      );
    });
  },
  methods: {
    back() {
      this.$router.back();
    },
    scrollError() {
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
    submit() {
      // POST /api/pmsDistSet/editPmsDistSet
      this.btnLoading = true;
      let _this = this;

      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          let url = "/pmsproduct/api/pmsDistSet/editPmsDistSet";
          let res = await apiPost(
            url,
            Object.assign(this.formItem, {
              id: this.pageData.id ? this.pageData.id : "",
              mainUserId: this.$route.query.mainUserId,
              pmsHotelId: this.$route.query.id
            })
          );
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
             this.btnLoading = false;
            // _this.$router.push("/hotelBaseSet");
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message ? res.message : "");
          }
        } else {
          this.btnLoading = false;
          //滚动到错误地方
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 500);
        }
      });
    }
  },
  components: {
    vueUEditor
  }
};
</script>
<style scope lang="scss">
.hoteldistributionSet-page {
  width: 100%;
  .step {
    width: 60%;
    margin: 2.5rem auto;
  }
  .form-title {
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid rgba(100, 182, 255, 1);
    font-size: 16px;
    margin-bottom: 10px;
  }
  .page-title {
    margin-bottom: 15px;
  }
  .ivu-date-picker .ivu-select-dropdown {
    z-index: 1000;
  }

  .edui-default .edui-editor {
    z-index: 666 !important;
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
        td:first-child {
          // text-align: center
        }
      }
    }
  }
  .senicInfo {
    margin-top: 10px;
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid rgba(35, 192, 250, 1);
    .address {
      color: #999;
    }
  }
  .fixed-box {
    position: fixed;
    top: 40%;
    right: 24px;
    background: #ffffff;
    z-index: 1000;
    ul {
      list-style: none;
      li {
        text-align: center;
        width: 100px;
        button {
          width: 100%;
        }
        a {
          display: block;
          color: #000;
          padding: 3px 7px;
          text-decoration: none;
          border-bottom: 1px solid #e2d5d5;
        }
        a.active {
          color: #2d8cf0;
        }
      }
      li:first-child a {
        color: #ffffff;
        background: #0099ff;
      }
    }
    .btn-primary-outline {
      color: #5a98de;
      background-color: transparent;
      background-image: none;
      border-color: #5a98de;
    }
  }
}
.money-unit {
  margin-left: 8px;
}
.save-cancel {
  padding-bottom: 50px;
}
</style>





