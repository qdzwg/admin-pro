<template>
  <div class="base-rule">
    <slot name="title"></slot>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <FormItem label="跟团游名称：">
        {{ formItem.name }}
      </FormItem>
      <FormItem label="销售渠道：">
        {{ selTypeText }}
      </FormItem>
      <FormItem label="库存模式：">
        日库存
      </FormItem>
      <FormItem label="多票行：" prop="lineTheme" v-if="isSongcheng">
        <div style="height:32px;" class="travellSubject">
          <div class="subject-list">
            <template v-for="(item, index) in tagNameList">
              <div :key="item.ticketName" class="subject-list-item">
                <Icon
                  @click="subjectItemDel(index)"
                  class="subject-list-item-del"
                  type="close-circled"
                ></Icon>
                <Button>{{ item.ticketName }}</Button>
              </div>
            </template>
          </div>
          <div class="subject-input">
            <Input
              @on-enter="setSubjectTag"
              :maxlength="4"
              v-model.trim="tagName"
              placeholder="回车添加标签，如“跟团游”"
              style="width: 200px"
            ></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left">
            输入后，回车添加
          </div>
        </div>
        <Input v-model="formItem.lineTheme" style="display:none"></Input>
      </FormItem>
      <FormItem label="多票型：" prop="ticketType" v-else>
        <Select
          @on-change="changeTicketType"
          :disabled="id ? true : false"
          v-model="formItem.ticketType"
          multiple
          style="width:200px"
        >
          <Option
            :value="item.value"
            v-for="item in xjTicketList"
            :key="item.key"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>

      <FormItem
        :label="priceItem.name + ':'"
        v-for="(priceItem, index) in formItem.priceList"
        :key="priceItem.key"
      >
        <Button type="primary" icon="android-add" @click="addPriceList(index)"
          >新增</Button
        >
        <Table
          size="large"
          class="price-table"
          border
          @on-row-click="roClick"
          :columns="columns"
          :data="priceItem.ticketPriceStockDtos"
        ></Table>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const moment = require("moment");
export default {
  components: {},
  props: ["id"],
  data() {
    return {
      name: "",
      tagName: "",
      selTypeText: "",
      xjTicketList: [
        { value: 0, key: "ticketPriceJsonAduit", name: "成人" },
        { value: 1, key: "ticketPriceJsonChild", name: "儿童" }
      ],
      // ticketArr: [],  //0成人，1儿童
      tagNameList: [],
      deleteHasIdTag: [],
      modalPrice: {
        weeks: "1,2,3,4,5,6,0",
        beginDate: "",
        endDate: "",
        costPrice: 0,
        showPrice: 0,
        retailPrice: 0,
        supplyPrice: 0,
        minRetailPrice: 0,
        maxRetailPrice: 0,
        stockModel: "day",
        ticketType: "",
        salePrice: 0,
        totalStockNum: 0
      },
      formItem: {
        ticketType: [],
        priceList: [
          // {
          //   key: '',
          //   ticketPriceStockDtos: []
          // },
          // {
          //   key: '',
          //   ticketPriceStockDtos: []
          // }
        ]
        // ticketPriceJsonAduit: [],
        // ticketPriceJsonChild: [],
      },
      ruleComplteForm: {
        ticketType: [
          {
            required: true,
            message: "请选择票型",
            trigger: "change",
            type: "array"
          }
        ]
      },
      sellTypeList: [
        {
          value: 0,
          label: "分销市场+店铺"
        },
        {
          value: 1,
          label: "仅分销市场"
        },
        {
          value: 2,
          label: "仅店铺"
        }
      ],
      stockModel: "day",
      stockList: [
        { label: "日库存", value: "day" },
        { label: "无限库存", value: "unlimit" },
        { label: "有限库存", value: "limit" }
      ],
      baseColumns: [
        //价格table基础模板
        {
          title: "操作",
          key: "action",
          width: 70,
          align: "center",
          render: (h, params) => {
            let { index } = params;
            let { priceIndex } = params.row;
            return h("Icon", {
              class: {
                "delete-icon": true
              },
              props: {
                type: "android-remove-circle"
              },
              on: {
                click: () => {
                  this.adultDel(priceIndex, index);
                }
              }
            });
          }
        },
        {
          title: "时间段/星期（预订周期不能重复）",
          key: "dateCom",
          align: "center",
          width: 350,
          render: (h, params) => {
            let { index, row } = params;
            let { priceIndex, beginDate, endDate, weeks } = params.row;
            let weeksList = weeks ? weeks.split(",") : "";
            let list = [
              { value: "1", label: "一" },
              { value: "2", label: "二" },
              { value: "3", label: "三" },
              { value: "4", label: "四" },
              { value: "5", label: "五" },
              { value: "6", label: "六" },
              { value: "0", label: "七" }
            ];
            let chcekList = list.map(item => {
              return h(
                "Checkbox",
                {
                  props: {
                    label: item.value
                  }
                },
                item.label
              );
            });
            let btnList = [
              { value: 0, label: "全选" },
              { value: 1, label: "平时" },
              { value: 2, label: "周末" }
            ];
            let btnRneder = btnList.map((item, key) => {
              return h(
                "Button",
                {
                  props: { type: "ghost" },
                  class: { "margin-lr": key == 1 ? true : false },
                  on: {
                    click: () => {
                      let weekList = [];
                      switch (key * 1) {
                        case 0:
                          weekList = [1, 2, 3, 4, 5, 6, 0];
                          break;
                        case 1:
                          weekList = [1, 2, 3, 4, 5];
                          break;
                        case 2:
                          weekList = [6, 0];
                          break;
                      }
                      // console.log();
                      this.formItem.priceList[priceIndex].ticketPriceStockDtos[
                        index
                      ].weeks = weekList.join(",");
                    }
                  }
                },
                item.label
              );
            });
            return h("div", { class: { "date-week": true } }, [
              h("div", { class: { "date-wrap": true } }, [
                h(
                  "FormItem",
                  {
                    props: {
                      prop:
                        "priceList." +
                        priceIndex +
                        ".ticketPriceStockDtos." +
                        index +
                        ".beginDate",
                      rules: {
                        required: true,
                        message: "请选择开始时间",
                        pattern: /.+/
                      }
                    }
                  },
                  [
                    h("DatePicker", {
                      props: {
                        type: "date",
                        value: beginDate,
                        format: "yyyy-MM-dd",
                        placeholder: "开始时间",
                        options: {
                          disabledDate(date) {
                            let endValue = new Date(endDate).valueOf();
                            return (
                              date &&
                              (date.valueOf() > endValue ||
                                date.valueOf() < Date.now() - 86400000)
                            );
                          }
                        }
                      },
                      on: {
                        "on-change": date => {
                          this.formItem.priceList[
                            priceIndex
                          ].ticketPriceStockDtos[index].beginDate = date;
                        }
                      }
                    })
                  ]
                ),

                h("span", {}, "-"),
                h(
                  "FormItem",
                  {
                    props: {
                      prop:
                        "priceList." +
                        priceIndex +
                        ".ticketPriceStockDtos." +
                        index +
                        ".endDate",
                      rules: {
                        required: true,
                        // type: "date",
                        message: "请选择开始时间",
                        pattern: /.+/
                      }
                    }
                  },
                  [
                    h("DatePicker", {
                      props: {
                        type: "date",
                        value: endDate,
                        format: "yyyy-MM-dd",
                        placeholder: "结束时间",
                        options: {
                          disabledDate(date) {
                            let startValue = new Date(beginDate).valueOf();
                            return date && date.valueOf() < startValue;
                          }
                        }
                      },
                      on: {
                        "on-change": date => {
                          this.formItem.priceList[
                            priceIndex
                          ].ticketPriceStockDtos[index].endDate = date;
                        }
                      }
                    })
                  ]
                )
              ]),
              h(
                "CheckboxGroup",
                {
                  props: {
                    value: weeksList
                  },
                  on: {
                    "on-change": week => {
                      this.formItem.priceList[priceIndex].ticketPriceStockDtos[
                        index
                      ].weeks = week.join(",");
                    }
                  }
                },
                chcekList
              ),
              h("div", { class: { "week-wrap": true } }, btnRneder)
            ]);
          }
        },
        {
          title: "库存模式",
          align: "center",
          key: "stockModel",
          render: (h, params) => {
            let { totalStockNum, priceIndex } = params.row;
            let { index } = params;
            let list = this.stockList;
            let stockModel = this.stockModel;
            let text = list.filter(item => {
              return item.value == stockModel;
            })[0].label;
            return (
              "FormItem",
              {},
              [
                h("p", {}, text),
                h("InputNumber", {
                  props: {
                    value: totalStockNum,
                    min: 0,
                    max: 100000
                  },
                  on: {
                    "on-change": value => {
                      params.row.totalStockNum = value;
                    },
                    "on-blur": () => {
                      this.formItem.priceList[priceIndex].ticketPriceStockDtos[
                        index
                      ].totalStockNum = params.row.totalStockNum;
                    }
                  }
                })
              ]
            );
            return h("span", {}, text);
          }
        },
        {
          title: "成本价",
          align: "center",
          key: "costPrice",
          render: (h, params) => {
            let { costPrice, priceIndex } = params.row;
            let { index } = params;
            return h(
              "FormItem",
              {
                props: {
                  prop: "ticketPriceJsonAduit." + index + "costPrice",
                  rules: {
                    // required: true,
                    // message: "请输入成本价",
                    // triggle: "blur",
                    // type: "number"
                  }
                }
              },
              [
                h("InputNumber", {
                  props: {
                    value: costPrice,
                    min: 0,
                    max: 100000
                  },
                  on: {
                    "on-change": value => {
                      params.row.costPrice = value;
                    },
                    "on-blur": () => {
                      this.formItem.priceList[priceIndex].ticketPriceStockDtos[
                        index
                      ].costPrice = params.row.costPrice;
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "销售价",
          align: "center",
          key: "salePrice",
          render: (h, params) => {
            let { salePrice, priceIndex } = params.row;
            let { index } = params;
            return h(
              "FormItem",
              {
                props: {
                  prop: "ticketPriceJsonAduit." + index + "salePrice",
                  rules: {
                    // required: true,
                    // message: "请输入成本价",
                    // triggle: "blur",
                    // type: "number"
                  }
                }
              },
              [
                h("InputNumber", {
                  props: {
                    value: salePrice,
                    min: 0,
                    max: 100000
                  },
                  on: {
                    "on-change": value => {
                      params.row.salePrice = value;
                    },
                    "on-blur": () => {
                      this.formItem.priceList[priceIndex].ticketPriceStockDtos[
                        index
                      ].salePrice = params.row.salePrice;
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "门市价",
          align: "center",
          key: "rackPrice",
          render: (h, params) => {
            let { index } = params;
            let { rackPrice, priceIndex } = params.row;
            return h(
              "FormItem",
              {
                props: {
                  prop: "ticketPriceJsonAduit." + index + "rackPrice",
                  rules: {
                    // required: true,
                    // message: "请输入门市价",
                    // triggle: "blur",
                    // type: "number"
                  }
                }
              },
              [
                h("InputNumber", {
                  props: {
                    value: params.row.rackPrice,
                    min: 0,
                    max: 100000
                  },
                  on: {
                    "on-change": value => {
                      params.row.rackPrice = value;
                    },
                    "on-blur": () => {
                      this.formItem.priceList[priceIndex].ticketPriceStockDtos[
                        index
                      ].rackPrice = params.row.rackPrice;
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "渠道类别",
          key: "chenel",
          align: "center",
          className: "table-chenel",
          render: (h, params) => {
            let { index } = params;
            let sellType = this.sellType;
            let list = [];
            switch (sellType * 1) {
              case 0:
                list = [
                  h("p", { class: { "td-item": true } }, "店铺"),
                  h("p", { class: { "td-item": true } }, "分销市场")
                ];
                break;
              case 1:
                list = [h("p", { class: { "td-item": true } }, "分销市场")];
                break;
              case 2:
                list = [h("p", { class: { "td-item": true } }, "店铺")];
                break;
            }
            return h("div", {}, list);
          }
        },
        {
          title: "零售价",
          align: "center",
          key: "retailPrice",
          className: "table-chenel",
          render: (h, params) => {
            let { index } = params;
            let { retailPrice, priceIndex } = params.row;
            let sellType = this.sellType;
            let list = [];
            switch (sellType * 1) {
              case 0:
                list = [
                  h("div", { class: { "td-item": true } }, [
                    h(
                      "FormItem",
                      {
                        props: {
                          prop: "ticketPriceJsonAduit." + index + "retailPrice"
                          // rules: {
                          //   message: "请输入零售价",
                          //   triggle: "blur",
                          //   validator: this.common.validate.floatNumber
                          // }
                        }
                      },
                      [
                        h("InputNumber", {
                          props: {
                            value: retailPrice,
                            min: 0,
                            max: 100000
                          },
                          on: {
                            "on-change": value => {
                              params.row.retailPrice = value;
                            },
                            "on-blur": () => {
                              this.formItem.priceList[
                                priceIndex
                              ].ticketPriceStockDtos[index].retailPrice =
                                params.row.retailPrice;
                              // console.log(this.formItem.ticketPriceJsonAduit[index]);
                            }
                          }
                        })
                      ]
                    )
                  ]),
                  h("div", { class: { "td-item": true } })
                ];
                break;
              case 1:
                list = [h("div", { class: { "td-item": true } })];
                break;
              case 2:
                list = [
                  h("div", { class: { "td-item": true } }, [
                    h(
                      "FormItem",
                      {
                        props: {
                          prop: "ticketPriceJsonAduit." + index + "retailPrice",
                          rules: {
                            // required: true,
                            // message: "请输入零售价",
                            // validator: this.common.validate.floatNumber,
                            // triggle: "blur"
                          }
                        }
                      },
                      [
                        h("InputNumber", {
                          props: {
                            value: params.row.retailPrice,
                            min: 0,
                            max: 100000
                          },
                          on: {
                            "on-change": value => {
                              params.row.retailPrice = value;
                            },
                            "on-blur": () => {
                              this.formItem.priceList[
                                priceIndex
                              ].ticketPriceStockDtos[index].retailPrice =
                                params.row.retailPrice;
                            }
                          }
                        })
                      ]
                    )
                  ])
                ];
                break;
            }
            return h("div", {}, list);
          }
        },
        {
          title: "供货价",
          key: "supplyPrice",
          align: "center",
          className: "table-chenel",
          render: (h, params) => {
            let { index } = params;
            let { supplyPrice, priceIndex } = params.row;
            let sellType = this.sellType;
            let list = [];
            switch (sellType * 1) {
              case 0:
                list = [
                  h("div", { class: { "td-item": true } }),
                  h("div", { class: { "td-item": true } }, [
                    h(
                      "FormItem",
                      {
                        props: {
                          prop: "ticketPriceJsonAduit." + index + "supplyPrice",
                          rules: {
                            // required: true,
                            // message: "请输入供货价",
                            // triggle: "blur",
                            // type: "number"
                          }
                        }
                      },
                      [
                        h("InputNumber", {
                          props: {
                            value: supplyPrice
                          },
                          on: {
                            "on-change": value => {
                              params.row.supplyPrice = value;
                            },
                            "on-blur": () => {
                              this.formItem.priceList[
                                priceIndex
                              ].ticketPriceStockDtos[index].supplyPrice =
                                params.row.supplyPrice;
                            }
                          }
                        })
                      ]
                    )
                  ])
                ];
                break;
              case 1:
                list = [
                  h("div", { class: { "td-item": true } }, [
                    h(
                      "FormItem",
                      {
                        props: {
                          prop: "ticketPriceJsonAduit." + index + "supplyPrice",
                          rules: {
                            // required: true,
                            // message: "请输入供货价",
                            // triggle: "blur",
                            // type: "number"
                          }
                        }
                      },
                      [
                        h("InputNumber", {
                          props: {
                            value: supplyPrice
                          },
                          on: {
                            "on-change": value => {
                              params.row.supplyPrice = value;
                            },
                            "on-blur": () => {
                              this.formItem.priceList[
                                priceIndex
                              ].ticketPriceStockDtos[index].supplyPrice =
                                params.row.supplyPrice;
                            }
                          }
                        })
                      ]
                    )
                  ])
                ];
                break;
              case 2:
                list = [h("div", { class: { "td-item": true } })];
                break;
            }
            return h("div", {}, list);
          }
        },
        {
          title: "建议最低零售价",
          key: "minRetailPrice",
          align: "center",
          className: "table-chenel",
          render: (h, params) => {
            let { index } = params;
            let { minRetailPrice, priceIndex } = params.row;
            let sellType = this.sellType;
            let list = [];
            switch (sellType * 1) {
              case 0:
                list = [
                  h("div", { class: { "td-item": true } }),
                  h("div", { class: { "td-item": true } }, [
                    h(
                      "FormItem",
                      {
                        props: {
                          prop:
                            "ticketPriceJsonAduit." + index + "minRetailPrice",
                          rules: {
                            // required: true,
                            // message: "请输入供货价",
                            // triggle: "blur",
                            // type: "number"
                          }
                        }
                      },
                      [
                        h("InputNumber", {
                          props: {
                            value: minRetailPrice
                          },
                          on: {
                            "on-change": value => {
                              params.row.minRetailPrice = value;
                            },
                            "on-blur": () => {
                              this.formItem.priceList[
                                priceIndex
                              ].ticketPriceStockDtos[index].supplyPrice =
                                params.row.supplyPrice;
                            }
                          }
                        })
                      ]
                    )
                  ])
                ];
                break;
              case 1:
                list = [
                  h("div", { class: { "td-item": true } }, [
                    h(
                      "FormItem",
                      {
                        props: {
                          prop:
                            "ticketPriceJsonAduit." + index + "minRetailPrice",
                          rules: {
                            // required: true,
                            // message: "请输入供货价",
                            // triggle: "blur",
                            // type: "number"
                          }
                        }
                      },
                      [
                        h("InputNumber", {
                          props: {
                            value: minRetailPrice
                          },
                          on: {
                            "on-change": value => {
                              params.row.minRetailPrice = value;
                            },
                            "on-blur": () => {
                              this.formItem.priceList[
                                priceIndex
                              ].ticketPriceStockDtos[index].supplyPrice =
                                params.row.supplyPrice;
                            }
                          }
                        })
                      ]
                    )
                  ])
                ];
                break;
              case 2:
                list = [h("div", { class: { "td-item": true } })];
                break;
            }
            return h("div", {}, list);
          }
        },
        {
          title: "建议最高零售价",
          key: "maxRetailPrice",
          align: "center",
          className: "table-chenel",
          render: (h, params) => {
            let { index } = params;
            let { maxRetailPrice, priceIndex } = params.row;
            let sellType = this.sellType;
            let list = [];
            switch (sellType * 1) {
              case 0:
                list = [
                  h("div", { class: { "td-item": true } }),
                  h("div", { class: { "td-item": true } }, [
                    h(
                      "FormItem",
                      {
                        props: {
                          prop:
                            "ticketPriceJsonAduit." + index + "maxRetailPrice",
                          rules: {
                            // required: true,
                            // message: "请输入供货价",
                            // triggle: "blur",
                            // type: "number"
                          }
                        }
                      },
                      [
                        h("InputNumber", {
                          props: {
                            value: maxRetailPrice
                          },
                          on: {
                            "on-change": value => {
                              params.row.maxRetailPrice = value;
                            },
                            "on-blur": () => {
                              this.formItem.priceList[
                                priceIndex
                              ].ticketPriceStockDtos[index].supplyPrice =
                                params.row.supplyPrice;
                            }
                          }
                        })
                      ]
                    )
                  ])
                ];
                break;
              case 1:
                list = [
                  h("div", { class: { "td-item": true } }, [
                    h(
                      "FormItem",
                      {
                        props: {
                          prop:
                            "ticketPriceJsonAduit." + index + "maxRetailPrice",
                          rules: {
                            // required: true,
                            // message: "请输入供货价",
                            // triggle: "blur",
                            // type: "number"
                          }
                        }
                      },
                      [
                        h("InputNumber", {
                          props: {
                            value: maxRetailPrice
                          },
                          on: {
                            "on-change": value => {
                              params.row.maxRetailPrice = value;
                            },
                            "on-blur": () => {
                              this.formItem.priceList[
                                priceIndex
                              ].ticketPriceStockDtos[index].supplyPrice =
                                params.row.supplyPrice;
                            }
                          }
                        })
                      ]
                    )
                  ])
                ];
                break;
              case 2:
                list = [h("div", { class: { "td-item": true } })];
                break;
            }
            return h("div", {}, list);
          }
        }
      ],
      columns: []
    };
  },
  watch: {
    getBaseRule: {
      handler: function(val) {
        //页面数据初始化
        val.ticketType = val.ticketType ? val.ticketType : [];
        this.formItem = this.cloneDeep(val);
        if (!this.isSongcheng) {
          this.tagNameList = this.cloneDeep(val.ticketType);
          this._changePriceTable(val.ticketType);
          this.createcolumn(false);
        } else {
          this.tagNameList = this.cloneDeep(val.routeTicketVos);
          this.songChnagePrice(val.routeTicketVos);
          this.createcolumn(true);
        }
        let sellType = val.sellType;
        this.selTypeText = this.$flType(
          parseFloat(sellType),
          this.sellTypeList
        );
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters("travellingRule", ["getBaseRule", "isSongcheng"]),
    sellType: function() {
      return this.formItem.sellType;
    }
  },
  methods: {
    changeTicketType(val) {
      this._changePriceTable(val);
    },
    _changePriceTable(typeList) {
      if (!typeList || !typeList.length) {
        return;
      }
      let xjTicketList = this.xjTicketList;
      let list = [];
      typeList.forEach(item => {
        let flag = xjTicketList.filter(type => {
          return type.value == item;
        });
        let index = list.length;
        if (flag && flag.length) {
          list.push({
            key: flag[0].key,
            name: flag[0].name,
            routeTicketName: flag[0].name,
            ticketPriceStockDtos: [{ ...this.modalPrice, priceIndex: index }]
          });
        }
      });
      this.$set(this.formItem, "priceList", list);
    },
    songChnagePrice(list) {
      let priceList = [];
      if (list && list.length) {
        list.forEach((item, index) => {
          priceList.push({
            key: item.ticketName,
            name: item.ticketName,
            routeTicketName: item.ticketName,
            id: item.id,
            ticketPriceStockDtos: [] //[{ ...this.modalPrice, priceIndex: index }]
          });
        });
      }
      this.$set(this.formItem, "priceList", priceList);
    },
    //添加主题
    setSubjectTag() {
      if (this.tagNameList && this.tagNameList.length < 5) {
        let isrepeat = this.tagNameList.some(item => {
          return item.ticketName == this.tagName;
        });
        let index = this.tagNameList.length;
        if (isrepeat) {
          this.$Message.warning("主题名字重复");
          return;
        }
        if (this.tagName) {
          if (this.id) {
            this.tagNameList.push({ ticketName: this.tagName, operateFlag: 1 });
          } else {
            this.tagNameList.push({ ticketName: this.tagName });
          }
          let list = [];
          this.tagNameList.forEach(item => {
            list.push(item.ticketName);
          });
          this.formItem.lineTheme = list.join(",");
          let priceList = this.formItem.priceList;
          priceList.splice(index, 1, {
            key: this.tagName,
            name: this.tagName,
            routeTicketName: this.tagName,
            ticketPriceStockDtos: [{ ...this.modalPrice, priceIndex: index }]
          });
          this.tagName = "";
        } else {
          this.$Message.warning("请输入标签名！");
        }
      } else {
        this.$Message.warning("最多添加五个标签！");
      }
    },
    //删除主题
    subjectItemDel(index) {
      if (this.id) {
        let info = this.tagNameList[index];
        if (info.id) {
          let info = this.tagNameList.splice(index, 1)[0];
          info.operateFlag = 2;
          this.deleteHasIdTag.push(info);
        } else {
          this.tagNameList.splice(index, 1);
        }
      } else {
        this.tagNameList.splice(index, 1);
      }
      this.formItem.priceList.splice(index, 1);
    },
    // 新增价格表数据
    addPriceList(index) {
      let tableList = this.formItem.priceList[index].ticketPriceStockDtos;
      if (tableList.length == 10) {
        this.$Message.warning("最多添加10条数据");
        return;
      }
      tableList.push({
        ...this.modalPrice,
        priceIndex: index
      });
    },
    adultDel(priceIndex, index) {
      this.formItem.priceList[priceIndex].ticketPriceStockDtos.splice(index, 1);
    },
    handleSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs.formItem.validate(valid => {
          if (valid) {
            try {
              let info = this.cloneDeep(this.formItem);
              let priceList = this.cloneDeep(info.priceList);

              priceList.forEach(item => {
                let priceInfo = item.ticketPriceStockDtos;
                if (priceInfo) {
                  priceInfo.forEach(info => {
                    info.beginDate = moment(info.beginDate).format(
                      "YYYY-MM-DD"
                    );
                    info.endDate = moment(info.endDate).format("YYYY-MM-DD");
                  });
                }
              });
              if (this.isSongcheng) {
                info.ticketPriceStockJson = JSON.stringify(priceList);
                info.ticketPriceJsonAduit = "";
                info.ticketPriceJsonChild = "";
                if (!this.id) {
                  let list = this.tagNameList.map(item => {
                    return item.ticketName;
                  });
                  info.ticketNames = JSON.stringify(list);
                } else {
                  let tagNameList = this.tagNameList.concat(
                    this.deleteHasIdTag
                  );
                  tagNameList.forEach(item => {
                    if (item.id && item.operateFlag != 2) {
                      item.operateFlag = 3;
                    }
                  });
                  info.routeTicketOperateJson = JSON.stringify(tagNameList);
                  // info.ticketNames = JSON.stringify(this.tagNameList);
                }
                delete info.routeTicketVos;
              } else {
                info.ticketType = info.ticketType.join(",");
                let ticketPriceJsonAduit = priceList.filter(item => {
                  return item.key == "ticketPriceJsonAduit";
                })[0];
                let ticketPriceJsonChild = priceList.filter(item => {
                  return item.key == "ticketPriceJsonChild";
                })[0];
                info.ticketPriceJsonAduit = ticketPriceJsonAduit
                  ? JSON.stringify(ticketPriceJsonAduit.ticketPriceStockDtos)
                  : "";
                info.ticketPriceJsonChild = ticketPriceJsonChild
                  ? JSON.stringify(ticketPriceJsonChild.ticketPriceStockDtos)
                  : "";
              }
              info.sellType = this.sellType;
              delete info.priceList;
              resolve(info);
            } catch (err) {
              console.log(err);
            }
          } else {
            this.$Message.warning("基础信息验证不通过");
            reject("Fail!");
          }
        });
      });
    },
    createcolumn(isSong) {
      let columns = this.baseColumns.filter(item => {
        if (isSong) {
          let actions = [
            "action",
            "dateCom",
            "stockModel",
            "costPrice",
            "salePrice"
          ];
          let flag = actions.some(key => {
            return key == item.key;
          });
          return flag;
        } else {
          item.key != "stockModel" ||
            item.key != "costPrice" ||
            item.key != "salePrice";
        }
      });
      this.columns = columns;
    }
  },
  created() {
    // getRouteInfo() {
    //   this.apiGet("/product/api/routePush/publishRoute").then(res => {
    //     //初始化线路和分销渠道信息
    //     this.name = res.data && res.data.name ? res.data.name : "";
    //     this.formItem.sellType =
    //       res.data && res.data.sellType ? res.data.sellType : "";
    //   });
    // }
  },
  mounted() {}
};
</script>
<style lang="scss">
.base-rule {
  .add-icon {
    cursor: pointer;
    color: green;
    font-size: 28px;
  }
  .delete-icon {
    cursor: pointer;
    color: red;
    font-size: 28px;
  }
  .travellSubject {
    // border: 1px solid red;
    .subject-list {
      float: left;
      margin-right: 10px;
      .subject-list-item {
        display: inline-block;
        margin-right: 10px;
        position: relative;
        .subject-list-item-del {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .subject-list-item:hover {
        .subject-list-item-del {
          display: inline-block;
        }
      }
    }
    .subject-input {
      float: left;
    }
  }
  .ivu-table {
    overflow: initial;
    .ivu-table-cell {
      overflow: initial;
    }
  }
  .table-chenel {
    .ivu-table-cell {
      padding: 0;
    }
    .td-item {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #e9eaec;
    }
    .td-item:last-child {
      border-bottom: none;
    }
  }
  .price-table {
    .ivu-input-number-handler-wrap {
      display: none;
    }
  }
  .date-week {
    .date-wrap {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
      .ivu-form-item-content {
        margin-left: 0 !important;
      }
      .ivu-table-cell {
        .ivu-form-item {
          margin: 0;
        }
      }
      .ivu-form-item {
        margin: 0;
      }
    }
    .week-wrap {
      margin-bottom: 10px;
    }
    .margin-lr {
      margin: 0 8px;
    }
  }
}
</style>
