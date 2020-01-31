<template>
    <div>
        <list ref="gridTable" :columns="columns" :url="url" :searchItems="searchItems"></list>
        <!-- 弹出层 -->
        <Modal v-model="modalpay" :title="modalTitle" :type="type">
            <Form :model="formItem" :label-width="100" ref="formItem" :rules="ruleForm">
                <FormItem label="账户余额：">
                    <span>{{formItem.leftValue}}</span>
                </FormItem>
                <FormItem label="充值金额：" prop="money">
                    <Input number v-model="formItem.money" :maxlength="8" style="width:200px;"></Input>
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="orderPay">去支付</Button>
                    <Button @click="test1">取消</Button>
                </FormItem>
            </Form>

            <div slot="footer"></div>
        </Modal>
        <!-- 提现 -->
        <Modal v-model="modaldraw" :title="modalTitle" :type="type">
            <Form :model="formItem2" :label-width="100" ref="formItem2" :rules="ruleForm2">
                <FormItem label="供应商账号：">
                    <span>{{formItem2.supplyerName}}</span>
                </FormItem>
                <FormItem label="可提现额度：">
                    <span>{{formItem2.leftValue}}</span>
                </FormItem>
                <FormItem label="提现金额：" prop="money">
                    <Input number v-model="formItem2.money" :maxlength="8" style="width:200px;"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="orderDraw">提交</Button>
                    <Button @click="test">取消</Button>
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import list from "@/components/global/list";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
        const validateNum = (rule, value, callback) => {
      if (value > 9999999) {
        callback(new Error("最大值9999999"));
      } else {
        callback();
      }
    };
    return {
      columns: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "供应商账号",
          sortable: true,
          key: "supplyerName"
        },
        {
          title: "供应商名称",
          sortable: true,
          key: "suppCorpName"
        },
        {
          title: "备用金余额（元）",
          key: "leftValue",
          sortable: true
        },
        {
          title: "累计消费",
          key: "totalConsume",
          sortable: true
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "充值",
                action: () => {
                  this.modalTitle = "充值";
                  this.modalpay = true;
                  this.type = "pay";
                  this.formItem.capitalAccountId = params.row.id;
                  this.formItem.leftValue = params.row.leftValue;
                }
              },
              {
                title: "提现",
                action: () => {
                  this.modalTitle = "提现";
                  this.modaldraw = true;
                  this.type = "draw";
                  this.formItem2.capitalAccountId = params.row.id;
                  this.formItem2.leftValue = params.row.leftValue;
                  this.formItem2.supplyerName = params.row.supplyerName;
                }
              },
              {
                title: "流水明细",
                action: () => {
                  this.$router.push({
                    path: "/accountStated",
                    query: { id: params.row.id }
                  });
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      url: "/admin/capitalAccount/grid",
      searchItems: [
        {
          label: "供应商账号",
          type: "input",
          name: "supplyerName"
        }
      ],
      modalpay: false,
      modaldraw: false,
      formItem: {
        capitalAccountId: "",
        leftValue: "",
        money: "",
        remark: ""
      },
      modalTitle: "充值",
      type: "pay",
      loading: true,
      formItem2: {
        capitalAccountId: "",
        leftValue: "",
        money: ""
      },
      ruleForm: {
        money: [
          {
            required: true,
            type: "number",
            message: "请输入充值金额",
            trigger: "blur"
          },
          {
            validator: validateNum,
            message: "数值不能大于9999999"
          }
        ]
      },
      ruleForm2: {
        money: [
          {
            required: true,
            type: "number",
            message: "请输入提现金额",
            trigger: "blur"
          },
          {
            validator: validateNum,
            message: "数值不能大于9999999"
          }
        ]
      }
    };
  },
  mounted() {
    // this.loadpage(this.params)
  },
  components: { list },
  methods: {
    test() {
      this.modaldraw = false;
      this.$refs.formItem2.resetFields();
    },
    test1() {
      this.modalpay = false;
      this.$refs.formItem.resetFields();
      this.formItem.remark=""
    },
    orderPay() {
      apiPost("/order/capitalAccount/recharge/saveOrder", this.formItem).then(
        res => {
          if (res.success) {
            apiGet(
              "/order/webapi/capitalAccountPay/recharge/toPay?payOrderNo=" +
                res.data.payOrderNo
            ).then(res => {
              if (res.status==200) {
                  this.$router.push({path:'/lockerPay',query:{payOrder:res.data.payOrder,zybAlipayFlag:res.data.zybAlipayFlag}})
              } else {
                this.$Message.warning(res.message);
              }
            });
          } else {
            this.$Message.warning(res.message);
          }
        }
      );
    },
    orderDraw() {
      apiPost("/admin/capitalAccount/doWithdraw", this.formItem2).then(res => {
        if (res.success) {
          this.$Message.success("操作成功");
          this.modaldraw = false;
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.warning(res.message);
        }
      });
    }
  }
};
</script>

