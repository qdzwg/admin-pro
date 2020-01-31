<template>
    <div>
        <list ref="gridTable" :columns="columns" :url="url" :searchItems="searchItems"></list>
        <!-- 弹出层 -->
        <Modal v-model="modalpay" :title="modalTitle" :type="type">
            <Form :model="formItem" :label-width="100" ref="formItem" :rules="ruleForm">
                <FormItem label="分销商名称：">
                    <span>{{formItem.cropName}}</span>
                </FormItem>
                <FormItem label="账户余额：">
                    <span>{{formItem.leftValue}}</span>
                </FormItem>
                <FormItem label="充值金额：" prop="money">
                    <Input number v-model="formItem.money" :maxlength="8" style="width:200px;"></Input>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="orderPay">提交</Button>
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
          title: "分销商名称",
          sortable: true,
          key: "distributorName"
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
                title: "缴存",
                action: () => {
                  this.modalTitle = "缴存";
                  this.modalpay = true;
                  this.type = "pay";
                  this.formItem.id = params.row.id;
                  this.formItem.leftValue = params.row.leftValue;
                  this.formItem.cropName = params.row.cropName;
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
      url: "/admin/capitalAccount/supplier/grid",
      searchItems: [
        {
          label: "分销商名称",
          type: "input",
          name: "distributorName"
        }
      ],
      modalpay: false,
      formItem: {
        id: "",
        money: ""
      },
      modalTitle: "充值",
      type: "pay",
      loading: true,
      ruleForm: {
        money: [
          {
            required: true,
            type: "number",
            message: "请输入缴存金额",
            trigger: "blur"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
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
    orderPay() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          apiPost(
            "/admin/capitalAccount/suplier/doRecharge",
            this.formItem
          ).then(res => {
            if (res.success) {
              this.$Message.success("操作成功");
              this.modalpay = false;
              this.$refs.gridTable.loadpage();
            } else {
              this.$Message.warning(res.message);
            }
          });
        }
      });
    },
    test() {
      this.modalpay = false;
      this.$refs.formItem.resetFields();
    }
  }
};
</script>

