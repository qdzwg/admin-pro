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
            <hotel-calendar ref="fullCa" class="test-fc" :action="action" :extend="extend" :param="calendarParam" @getCheckInfo="getCheckInfo">
            </hotel-calendar>
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
                                <FormItem prop="price" :rules="[{required: true, message: '该项不能为空！'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                    <Input v-model="formItem.price"></Input>
                                </FormItem>

                            </td>
                        </tr>
                        <tr>
                            <td>零售价</td>
                            <td>
                                <FormItem prop="salePrice" :rules="[{required: true, message: '该项不能为空！'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                    <Input v-model="formItem.salePrice"></Input>
                                </FormItem>
                            </td>
                        </tr>                        
                        <tr>
                            <td>库存</td>
                            <td>                               
                                <FormItem prop="stock" :rules="[{required: true, message: '该项不能为空！'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                    <Input v-model="formItem.stock"></Input>
                                </FormItem>
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
import hotelCalendar from "@/components/global/hotelCalendar";
import moment from "moment";
import { apiPost,apiGet } from "@/fetch/api";

export default {
  mounted() {
  },
  data() {
    return {
      routeName: "",
      action: "/product/productPriceStockCalendar/getCalendarNew",
      extend: [
       
        {
          title: "成本价",
          key: "price",
          render: (h, params) => {
            let price =
              typeof params.row.price === "undefined"
                ? "--"
                : params.row.price;
            return h("b", price);
          }
        },
        {
          title: "销售价",
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
          title: "库存",
          render: (h, params) => {
            let stock = params.row.stock ? params.row.stock : "--";
            return h("b", stock);
          }
        }
      ],
      calendarParam: {
        prodCode: this.$route.params.id,
        modelType: "room"
      },
      formItem: {
        dates: "",
        price: "",
        salePrice: "",
        stock: "",
      },
      ruleForm: {},

    };
  },
  methods: {
    save() {
      this.formItem.modelType = "room";
      this.formItem.prodCode = this.$route.params.id;
      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let res = await this.apiPost(
            "/product/productPriceStockCalendar/savePriceStockNew",
            this.formItem
          );
          if (res.success) {
            this.$Message.success("修改成功！");
            this.$refs.fullCa.reload();
          } else {
            this.$Message.warning(res.message);
          }
        }
      });
    },
    reset() {
      (this.formItem = {
        price: "", // 成本价    
        salePrice: "", // 分销价
        stock: "", // 库存
        dates: ''
      }),
        this.$refs.formItem.resetFields();
    },
    getCheckInfo(items) {
      console.log(items)
      if (items.length) {
        // this.formItem = items[0];
        let dates = [];
        items.forEach(element => {
          dates.push(element.date);
        });
        this.formItem.dates = dates.join(',');     
      }
    },
  },
  components: {
    hotelCalendar
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