<template>
  <div>
    <Modal width="900" v-model="modalFlag" :title="title" :type="type">
      <Form
        class="completeForm"
        height="600"
        :model="formCompleteItem"
        :rules="ruleValidate"
        label-position="right"
        :label-width="100"
        ref="formItem"
      >
        <FormItem label="选择产品:" prop="productName">
          {{ formCompleteItem.productName }}
          <Button
            type="primary"
            size="small"
            @click="getPro"
            v-if="type == 'add'"
            >选择</Button
          >
        </FormItem>
        <FormItem label="产品编码:" v-if="formCompleteItem.productCode">
          {{ formCompleteItem.productCode }}
        </FormItem>
        <FormItem label="展示价:" v-if="formCompleteItem.totalPrice">
          {{ formCompleteItem.totalPrice }}
        </FormItem>
        <FormItem label="分账方式:" prop="splitMode">
          <Select
            v-model="formCompleteItem.splitMode"
            style="width:200px"
            @on-change="exchangeType"
          >
            <Option
              value="form_price"
              v-if="formCompleteItem.productType == 'family'"
              >组成价</Option
            >
            <template v-if="formCompleteItem.productType == 'ticket'">
              <Option value="fix_money">固定金额</Option>
              <Option value="fix_scale">固定比例</Option>
            </template>
          </Select>
        </FormItem>
        <FormItem label="分账内容:" class="table-content">
          <Button
            type="primary"
            icon="android-add"
            style="margin-bottom:6px;"
            @click="addAccount"
            v-if="formCompleteItem.splitMode != 'form_price'"
            >新增</Button
          >
          <Table :columns="columns" :data="formCompleteItem.details"></Table>
        </FormItem>
        <FormItem v-if="formCompleteItem.splitMode == 'fix_money'">
          <p>
            固定金额说明：<br />
            如实际支付金额超出分账设置金额，超出金额默认分配给第一个分账企业码<br />
            如实际支付金额少于分账设置金额，按分账顺序进行分账（排序靠后的企业码可能存在分不到设定的固定金额的情况<br />
            如分账银行不支持多方分账，默认按排序一企业码分账
          </p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelFun" style="margin-left: 8px"
          >取消</Button
        >
        <Button type="primary" @click="completeFormOK">确定</Button>
      </div>
    </Modal>
    <!-- 选择产品 -->
    <Modal width="800" v-model="selectPro" title="选择产品">
      <gridlist
        ref="proTable"
        :columns="proColumns"
        :url="proUrl"
        :searchItems="proSearchItems"
      ></gridlist>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import gridlist from "@/components/global/gridList";
export default {
  components: { gridlist },
  props: {
    title: {
      type: String,
      default: "修改"
    },
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "edit"
    },
    formCompleteData: {
      type: Object
    },
    banktype: {
      type: String
    }
  },
  data() {
    return {
      modalFlag: false,
      proUrl: "",
      selectPro: false,
      proColumns: [
        {
          title: "产品编码",
          key: "productCode"
        },
        {
          title: "产品名称",
          key: "productName"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            let {
              productCode,
              productName,
              productType,
              totalPrice,
              details,
              splitCorpCode = ""
            } = params.row;
            let actions = [
              {
                title: "选择",
                action: () => {
                  this.formCompleteItem.productCode = productCode;
                  this.formCompleteItem.productName = productName;
                  this.formCompleteItem.productType = productType;
                  this.formCompleteItem.totalPrice = totalPrice;
                  let data = details;

                  if (productType == "family") {
                    let list = [];
                    data.forEach(item => {
                      list.push({
                        splitCorpCode,
                        ...item
                      });
                    });
                    this.formCompleteItem.details = list;
                    this.formCompleteItem.splitMode = "form_price";
                    this.columns = this.columns1;
                  } else {
                    this.formCompleteItem.splitMode = "fix_money";
                    this.formCompleteItem.details = this.data2;
                    this.columns = this.columns2;
                  }
                  this.selectPro = false;
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      proSearchItems: [
        {
          label: "业态",
          type: "select",
          name: "productType",
          data: [
            {
              value: "family",
              label: "套票",
              hide: this.banktype == "11102" ? true : false
            },
            {
              value: "ticket",
              label: "单票",
              hide: this.banktype == "11102" ? false : true
            }
          ],
          value: this.banktype == "11102" ? "ticket" : "family"
        },
        {
          label: "产品编码",
          type: "input",
          name: "productCode"
        },
        {
          label: "产品名称",
          type: "input",
          name: "productName"
        }
      ],
      formCompleteItem: {
        productCode: "",
        productName: "",
        productType: "",
        totalPrice: 0,
        details: [],
        splitCorpCode: "",
        splitMode: ""
      },
      ruleValidate: {
        productName: [
          { required: true, message: "请选择产品！", triggle: "blur" }
        ],
        splitMode: [
          { required: true, message: "请选择分账方式！", triggle: "blur" }
        ]
      },
      columns: this.columns1,
      columns1: [
        {
          title: "子产品",
          key: "nickName"
        },
        {
          title: "子票产品编码",
          key: "modelCode"
        },
        {
          title: "参考组成价",
          key: "formPrice"
        },
        {
          title: "分账企业码",
          key: "splitCorpCode",
          render: (h, params) => {
            let { index } = params;
            let { splitCorpCode } = params.row;
            return h(
              "FormItem",
              {
                props: {
                  prop: "details." + index + ".splitCorpCode",
                  rules: [
                    {
                      validator: this.validatePassCheck,
                      triggle: "blur"
                    }
                  ]
                }
              },
              [
                h("Input", {
                  props: {
                    value: splitCorpCode
                  },
                  on: {
                    "on-blur": event => {
                      this.formCompleteItem.details[index].splitCorpCode =
                        event.target.value + "";
                    }
                  }
                })
              ]
            );
          }
        }
      ],
      data1: [],
      columns2: [
        {
          title: "序号",
          key: "order",
          width: 60,
          render: (h, params) => {
            let { index } = params;
            return h("span", {}, index + 1);
          }
        },
        {
          title: "分账企业码",
          key: "splitCorpCode",
          render: (h, params) => {
            let { splitCorpCode } = params.row;
            let { index } = params;
            return h(
              "FormItem",
              {
                props: {
                  prop: "details." + index + ".splitCorpCode",
                  rules: {
                    validator: this.validatePassCheck,
                    triggle: "blur"
                  }
                }
              },
              [
                h("Input", {
                  props: {
                    value: splitCorpCode
                  },
                  on: {
                    "on-blur": event => {
                      this.formCompleteItem.details[index].splitCorpCode =
                        event.target.value;
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "分账金额",
          key: "amount",
          render: (h, params) => {
            let { amount } = params.row;
            amount = amount ? amount : 0;
            let { index } = params;
            let self = this;
            return h(
              "FormItem",
              {
                props: {
                  prop: "details." + index + ".amount",
                  rules: {
                    required: true,
                    message: "请输入分账金额",
                    triggle: "blur",
                    type: "number"
                  }
                }
              },
              [
                h("InputNumber", {
                  props: {
                    min: 0,
                    max: 100000,
                    value: amount
                  },
                  on: {
                    "on-change": value => {
                      params.row.amount = value;
                    },
                    "on-blur": () => {
                      this.formCompleteItem.details[index].amount =
                        params.row.amount;
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          render: (h, params) => {
            let { index } = params;
            return index
              ? h(
                  "Button",
                  {
                    on: {
                      click: () => {
                        if (index) {
                          this.formCompleteItem.details.splice(index, 1);
                        }
                      }
                    }
                  },
                  "删除"
                )
              : "";
          }
        }
      ],
      data2: [
        {
          splitCorpCode: "",
          amount: 0
        }
      ],
      columns3: [
        {
          title: "序号",
          width: 60,
          key: "order",
          render: (h, params) => {
            let { index } = params;
            return h("span", {}, index + 1);
          }
        },
        {
          title: "分账企业码",
          key: "splitCorpCode",
          render: (h, params) => {
            let { index } = params;
            let { splitCorpCode } = params.row;
            return h(
              "FormItem",
              {
                props: {
                  prop: "details." + index + ".splitCorpCode",
                  rules: {
                    validator: this.validatePassCheck,
                    triggle: "blur"
                  }
                }
              },
              [
                h("Input", {
                  props: {
                    value: splitCorpCode
                  },
                  on: {
                    "on-blur": event => {
                      this.formCompleteItem.details[index].splitCorpCode =
                        event.target.value + "";
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "分账比例",
          key: "amount",
          render: (h, params) => {
            let { amount } = params.row;
            amount = amount ? amount : 0;
            let { index } = params;
            return (
              "FormItem",
              {
                props: {
                  prop: "details." + index + ".amount",
                  rules: {
                    required: true,
                    message: "请输入分账比例",
                    triggle: "blur",
                    type: "number"
                  }
                }
              },
              [
                h("InputNumber", {
                  props: {
                    min: 0,
                    max: 100,
                    formatter: value => `${value}%`,
                    parser: value => value.replace("%", ""),
                    value: amount
                  },
                  on: {
                    "on-change": value => {
                      params.row.amount = value;
                    },
                    "on-blur": () => {
                      this.formCompleteItem.details[index].amount =
                        params.row.amount;
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          render: (h, params) => {
            let { index } = params;
            return index
              ? h(
                  "Button",
                  {
                    on: {
                      click: () => {
                        if (index) {
                          this.formCompleteItem.details.splice(index, 1);
                        }
                      }
                    }
                  },
                  "删除"
                )
              : "";
          }
        }
      ],
      data3: [
        {
          splitCorpCode: "",
          amount: 0
        }
      ]
    };
  },
  watch: {
    value: {
      handler: function(val) {
        this.modalFlag = val;
      },
      immediate: true
    },
    modalFlag: {
      handler: function(val) {
        this.$emit("input", val);
        if (val) {
          this.formCompleteItem = this.cloneDeep(this.formCompleteData);
          let { splitMode, details } = this.formCompleteItem;
          this.changType(splitMode, !details || !details.length);
        }
      },
      immediate: true
    }
  },
  computed: {},
  methods: {
    /**用户切换表格数据
     * @param {string} type 表格数据类型
     * @param {boolean} isInitData 是否初始化数据
     */
    changType(type, isInitData = true) {
      let details = this.formCompleteItem.details;
      details.forEach(item => {
        if (item.amount) {
          item.amount = parseFloat(item.amount);
        }
      });
      switch (type) {
        case "form_price":
          this.columns = this.columns1;
          if (isInitData) {
            details = this.data1;
          } else {
            this.data1 = details;
          }
          break;
        case "fix_money":
          this.columns = this.columns2;
          if (isInitData) {
            details = this.data2;
          } else {
            this.data2 = details;
          }
          break;
        case "fix_scale":
          this.columns = this.columns3;
          if (isInitData) {
            details = this.data3;
          } else {
            this.data3 = details;
          }
          break;
        default:
      }
      this.formCompleteItem.splitMode = type;
    },
    exchangeType(type) {
      this.changType(type);
    },
    addAccount() {
      let { splitMode, details } = this.formCompleteItem;
      if (details.length == 15) {
        let msg = "按比例";
        if (splitMode == "fix_money") {
          msg = "固定金额";
        }
        this.$Message.warning("固定金额或按比例最多可添加15个");
        return;
      }
      let obj = {
        splitCorpCode: "",
        amount: 0
      };
      this.formCompleteItem.details.push(obj);
    },
    cancelFun() {
      this.modalFlag = false;
    },
    completeFormOK() {
      this.$refs["formItem"].validate(async valid => {
        if (valid) {
          let res = await this.apiPostJson(
            "/marketing/webApi/marketPayAccount/save",
            this.formCompleteItem
          );
          if (res.status === 200) {
            this.$emit("on-ok");
            this.modalFlag = false;
          } else {
            this.$Message.error(res.message);
          }
        }
      });
    },
    getPro() {
      this.selectPro = true;
      let random = new Date().getTime();
      this.proUrl =
        "/marketing/webApi/marketPayAccount/selectProduct?random=" + random;
    },
    validatePassCheck(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入分账企业码"));
      } else if (value.length > 20) {
        callback(new Error("分账企业码长度限制20字符以内"));
      } else {
        callback();
      }
    }
  },
  created() {},
  mounted() {
    //banktype == "11102"只有建行支持单票
  }
};
</script>
<style lang="scss">
.table-content {
  .ivu-table td {
    height: 68px;
    line-height: 68px;
    .ivu-form-item-error-tip {
      padding-top: 2px;
      right: -30px;
    }
    .ivu-table-cell {
      padding-bottom: 10px;
    }
  }
}
</style>
