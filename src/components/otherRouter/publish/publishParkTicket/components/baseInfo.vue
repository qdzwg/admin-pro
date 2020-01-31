<template>
  <Form
    :model="baseInfo"
    label-position="right"
    :label-width="120"
    ref="baseForm"
    class="ticket-base"
    :rules="baseRule"
    v-if="baseInfo"
  >
    <!-- <FormItem
      label="景区名称："
      v-if="songName.show"
      display="flex"
      prop="name"
      :rules="{
        required: true,
        message: '请选择景区',
        triggle: 'change'
      }"
    >
      <Input
        v-model="baseInfo.name"
        style="width:200px"
        disabled
        placeholder="请选择景区"
      ></Input>
      <Button type="primary" icon="android-add" @click="selectSenic"
        >选择景区</Button
      >
    </FormItem> -->
    <!-- :rules="{
        required: true,
        message: '请选择商户名称',
        triggle: 'change'
      }" -->
    <FormItem
      label="商户名称："
      v-if="songMchId && songMchId.show"
      prop="mchId"
      :rules="{ required: true, message: '请选择商户名称' }"
    >
      <Select v-model="baseInfo.mchId" style="width:200px">
        <Option :value="item.mchId" v-for="item in mchList" :key="item.mchId">{{
          item.label
        }}</Option>
      </Select>
    </FormItem>
    <FormItem label="门票名称：" prop="modelName">
      <Input
        v-model="baseInfo.modelName"
        placeholder="请输入门票名称"
        style="width:33%"
        :maxlength="30"
      ></Input>
      <p>
        注：名称构成:地名+产品名称+数量+另一产品名称+数量+特色，例如“北京顺景温泉(含鱼疗)1张
      </p>
    </FormItem>
    <FormItem label="门票别名：" prop="nickName">
      <Input
        v-model="baseInfo.nickName"
        placeholder="请输入门票别名"
        style="width:33%"
        :maxlength="30"
      ></Input>
    </FormItem>
    <FormItem label="门票编码：" prop="nickName" v-if="baseInfo.modelCode">
      <span>{{ baseInfo.modelCode }}</span>
    </FormItem>

    <FormItem
      label="价格模式："
      prop="extendsParam1"
      v-if="songExtendsParam1 && songExtendsParam1.show"
      :rules="{ required: true, message: '请选择价格模式', triggle: 'change' }"
    >
      <RadioGroup v-model="baseInfo.extendsParam1">
        <Radio label="0">
          <span>标准模式</span>
        </Radio>
        <Radio label="1">
          <span>提前订、当天订双价模式</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      label="是否电商核销："
      prop="extendsParam2"
      :rules="{
        required: true,
        message: '请选择是否电商核销',
        triggle: 'change'
      }"
    >
      <RadioGroup v-model="baseInfo.extendsParam2">
        <Radio label="T">
          <span>是</span>
        </Radio>
        <Radio label="F">
          <span>否</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <template v-if="baseInfo.extendsParam2 == 'T'">
      <FormItem
        v-if="
          songExtendsParam3 &&
            songExtendsParam3.show &&
            baseInfo.extendsParam1 == 1
        "
        label=" 提前购电商编码："
        prop="extendsParam3"
        :rules="{
          required: true,
          message: '请选择提前购电商编码',
          triggle: 'blur'
        }"
      >
        <Input
          v-model="baseInfo.extendsParam3"
          disabled
          placeholder="请选择提前购电商编码"
          style="width:200px"
        ></Input>
        <Button type="primary" @click="selectCode('extendsParam3')"
          >选择</Button
        >
      </FormItem>
      <FormItem
        v-if="
          songExtendsParam4 &&
            songExtendsParam4.show &&
            baseInfo.extendsParam1 == 0
        "
        label="电商编码："
        prop="extendsParam4"
        :rules="{
          required: true,
          message: '请选择电商编码',
          triggle: 'blur'
        }"
      >
        <Input
          v-model="baseInfo.extendsParam4"
          placeholder="请选择电商编码"
          disabled
          style="width:200px"
        ></Input>
        <Button type="primary" @click="selectCode('extendsParam4')"
          >选择</Button
        >
      </FormItem>
      <FormItem
        label="当天购电商编码："
        v-if="
          songExtendsParam4 &&
            songExtendsParam4.show &&
            baseInfo.extendsParam1 == 1
        "
        prop="extendsParam4"
        :rules="{
          required: true,
          message: '请选择提前购电商编码',
          triggle: 'blur'
        }"
      >
        <Input
          v-model="baseInfo.extendsParam4"
          disabled
          placeholder="请选择电商编码"
          style="width:200px"
        ></Input>
        <Button type="primary" @click="selectCode('extendsParam4')"
          >选择</Button
        >
      </FormItem>
    </template>

    <template v-if="songTicketType && songTicketType.show">
      <FormItem
        label="产品类型："
        prop="ticketType"
        :rules="{
          required: true,
          message: '请选择产品类型',
          triggle: 'change'
        }"
      >
        <Select v-model="baseInfo.ticketType" style="width:200px">
          <Option value="1">门票</Option>
          <Option value="2">年票</Option>
        </Select>
      </FormItem>
      <template v-if="baseInfo.ticketType == 2">
        <FormItem
          label="可用成人数："
          prop="adultNum"
          :rules="{
            required: true,
            message: '请输入可用成人数',
            triggle: 'change'
          }"
        >
          <InputNumber
            :max="10"
            :min="1"
            v-model="baseInfo.adultNum"
          ></InputNumber>
        </FormItem>
        <FormItem
          label="可用儿童数："
          prop="childNum"
          :rules="{
            required: true,
            message: '请输入可用儿童数',
            triggle: 'change'
          }"
        >
          <InputNumber
            :max="10"
            :min="1"
            v-model="baseInfo.childNum"
          ></InputNumber>
        </FormItem>
      </template>
    </template>

    <!-- <FormItem label="外部编码：" prop="externalCode">
      <Input
        v-model="baseInfo.externalCode"
        placeholder="请输外部编码"
        style="width:33%"
        :maxlength="30"
      ></Input>
    </FormItem> -->

    <FormItem
      label="是否推送云票务："
      v-if="songIsSyncYpw && songIsSyncYpw.show"
      prop="isSyncYpw"
      :rules="{
        required: true,
        message: '请选择是否推送云票务',
        triggle: 'change'
      }"
    >
      <Select v-model="baseInfo.isSyncYpw" style="width:200px">
        <Option value="F">否</Option>
        <Option value="T">是</Option>
      </Select>
    </FormItem>
    <FormItem label="票型说明：">
      <Input
        v-model="baseInfo.modelExplain"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="请填写门票说明"
        style="width:33%"
      ></Input>
    </FormItem>
    <FormItem label="预订须知：" prop="bookRemind">
      <ueditor id="bookRemind" v-model="baseInfo.bookRemind"></ueditor>
    </FormItem>
    <FormItem label="产品分组：" v-if="songGroupName && songGroupName.show">
      <Button
        type="primary"
        @click="addGroup"
        style="margin-bottom:10px"
        icon="android-add"
        >新增分组</Button
      >
      <Table
        :columns="groupColumns"
        width="500"
        border
        class="group-wrap"
        :data="baseInfo.groupItems"
      ></Table>
    </FormItem>
    <FormItem
      label="是否实名制票型："
      prop="isRealName"
      v-if="songIsRealName && songIsRealName.show"
    >
      <Select v-model="baseInfo.isRealName" style="width:200px">
        <Option value="F">否</Option>
        <Option value="T">是</Option>
      </Select>
    </FormItem>
    <FormItem label="是否立即上架：" prop="enabled">
      <Select v-model="baseInfo.enabled" style="width:200px">
        <Option value="T">是</Option>
        <Option value="F">否</Option>
      </Select>
    </FormItem>
    <FormItem
      label="特殊渠道销售："
      prop="isSpecial"
      v-if="songIsSpecial && songIsSpecial.show"
    >
      <Select v-model="baseInfo.isSpecial" style="width:200px">
        <Option value="T">是</Option>
        <Option value="F">否</Option>
      </Select>
      <span style="color: red;"
        >备注：“否”则正常展示对应销售渠道，选择“是”则需从“店铺设置-店铺二维码”中获取特殊渠道二维码方可显示</span
      >
    </FormItem>
    <FormItem
      label="销售渠道："
      prop="sellType"
      v-if="songSellType && songSellType.show"
    >
      <Select v-model="baseInfo.sellType" style="width:200px">
        <Option value="">请选择</Option>
        <Option v-for="item in list" :key="item.value" :value="item.value">{{
          item.label
        }}</Option>
      </Select>
    </FormItem>

    <FormItem label="库存模式：" prop="stockModel">
      <RadioGroup v-model="baseInfo.stockModel">
        <Radio v-for="item in stockList" :label="item.value" :key="item.value">
          <span>{{ item.label }}</span>
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      v-if="baseInfo.stockModel == 'limit'"
      label="有限库存数量："
      :prop="
        songLeftStockNum && songLeftStockNum.show
          ? 'leftStockNum'
          : 'totalStockNum'
      "
      :rules="{
        required: true,
        message: '请输入库存数量',
        triggle: 'blur',
        type: 'number'
      }"
    >
      <InputNumber
        :max="10000"
        :min="1"
        v-model="baseInfo.leftStockNum"
        v-if="songLeftStockNum && songLeftStockNum.show"
      ></InputNumber>
      <InputNumber
        :max="10000"
        :min="1"
        v-model="baseInfo.totalStockNum"
        v-else
      ></InputNumber>
    </FormItem>
    <template v-if="baseInfo.sellType != '2'">
      <FormItem label="建议最低零售价：" prop="priceMin">
        <InputNumber
          :max="10000"
          :min="1"
          v-model="baseInfo.priceMin"
        ></InputNumber>
        元
      </FormItem>
      <FormItem label="建议最高零售价：" prop="priceMax">
        <InputNumber
          :max="10000"
          :min="1"
          v-model="baseInfo.priceMax"
        ></InputNumber>
        元
      </FormItem>
    </template>
    <FormItem label="购票是否提醒：" v-if="songIsShowTicketNotice.show">
      <Select v-model="baseInfo.isShowTicketNotice" style="width:200px">
        <Option value="T">是</Option>
        <Option value="F">否</Option>
      </Select>
    </FormItem>
    <FormItem label="提醒说明：" v-if="baseInfo.isShowTicketNotice == 'T'">
      <ueditor id="ticketNotice" v-model="baseInfo.ticketNotice"></ueditor>
    </FormItem>
    <FormItem
      label="缩略图："
      prop="linkMobileImg"
      v-if="songLinkMobileImg && songLinkMobileImg.show"
      :rules="{ required: true, message: '请选择缩略图' }"
    >
      <up-img :limitNum="1" v-model="baseInfo.linkMobileImg"></up-img>
      <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
    </FormItem>
    <!-- 双价模式不展示 -->
    <FormItem v-if="baseInfo.extendsParam1 != 1">
      <Button type="primary" icon="android-add" @click="addPriceList"
        >新增</Button
      >
      <Table
        size="large"
        border
        :columns="columns"
        :data="baseInfo.priceListJson"
      ></Table>
    </FormItem>
    <!-- 弹出层 -->
    <the-modal
      v-model="modal"
      :title="modalTitle"
      width="900"
      @ok="ok"
      @cancel="cancel"
    >
      <page-template
        :search-items="searchItems"
        :columns="scenicColumns"
        :url="url"
        pageFlag
        firstUnload
        ref="pageWrap"
      >
      </page-template>
    </the-modal>
    <ec-code v-model="ecFlag" @get-code="getEcCode"></ec-code>
  </Form>
</template>

<script>
import { mapGetters } from "vuex";
import ecCode from "./ecCode.vue";
export default {
  components: { ecCode },
  data() {
    return {
      ecFlag: false, //电商编码弹框
      searchItems: [
        {
          label: "景区名称",
          type: "input",
          name: "name"
        },
        {
          label: "景区编码",
          type: "input",
          name: "productCode"
        },
        {
          label: "景区等级",
          type: "select",
          name: "parkLevel",
          data: [
            {
              value: "0",
              label: "无等级"
            },
            {
              value: "1",
              label: "1A"
            },
            {
              value: "2",
              label: "2A"
            },
            {
              value: "3",
              label: "3A"
            },
            {
              value: "4",
              label: "4A"
            },
            {
              value: "5",
              label: "5A"
            }
          ]
        },
        {
          label: "是否开园",
          type: "select",
          name: "enabled",
          data: [
            {
              value: "",
              label: "请选择"
            },
            {
              value: "T",
              label: "开园中"
            },
            {
              value: "F",
              label: "已关闭"
            }
          ]
        }
      ],
      scenicColumns: [
        {
          title: "景区名称",
          key: "name"
        },
        {
          title: "景区类型",
          key: "channel",
          render: (h, params) => {
            let { channel } = params.row;
            let list = [
              { label: "商城自建-自核销", value: -1 },
              { label: "商城自建-线下系统", value: 0 },
              { label: "智游宝拉取", value: 1 },
              { label: "自有-智游宝", value: 2 },
              { label: "智游宝-云票务核销", value: 3 }
            ];
            return h("span", this.$flType(channel, list));
          }
        },
        {
          title: "景区编码",
          key: "productCode"
        },
        {
          title: "景区等级",
          key: "parkLevel",
          render: (h, params) => {
            return h("span", this.filter.parkLevel(params.row.parkLevel));
          }
        },
        {
          title: "同步状态",
          key: "synced",
          render: (h, params) => {
            return h("span", params.row.synced == "F" ? "否" : "是");
          }
        },
        {
          title: "状态",
          key: "enabled",
          render: (h, params) => {
            return h("span", params.row.enabled == "F" ? "已闭园" : "开园中");
          }
        },
        {
          title: "操作",
          key: "action",
          // width: 250,
          // align: 'center',
          render: (h, params) => {
            let { id, name } = params.row;
            return h(
              "Button",
              {
                props: { type: "primary" },
                on: {
                  click: () => {
                    this.baseInfo.name = name;
                    this.baseInfo.parkId = id;
                    this.modal = false;
                  }
                }
              },
              "选择"
            );
          }
        }
      ],
      url: "product/parkInfo/grid",
      modalTitle: "景区",
      modal: false,
      mchList: [
        {
          value: "",
          label: "---请选择---"
        },
        {
          value: "hotel",
          label: "酒店名宿"
        },
        {
          value: "scenic",
          label: "门票"
        }
      ],
      baseInfo: this.cloneDeep(this.baseData),
      groupDisabled: true,
      baseRule: {
        modelName: [
          { required: true, message: "请输入门票名称", triggle: "blur" }
        ],
        nickName: [
          { required: true, message: "请输入门票别名", triggle: "blur" }
        ],
        externalCode: [
          { required: true, message: "请输入外部编码", triggle: "blur" }
        ],
        isRealName: [
          { required: true, message: "请选择是否是实名制票型", triggle: "blur" }
        ],
        enabled: [
          { required: true, message: "请选择是否立即上架", triggle: "blur" }
        ],
        isSpecial: [
          { required: true, message: "请选择是否特殊渠道销售", triggle: "blur" }
        ],
        sellType: [
          { required: true, message: "请选择销售渠道", triggle: "blur" }
        ],
        bookRemind: [
          { required: true, message: "请输入预订须知", triggle: "blur" }
        ],
        stockModel: [
          { required: true, message: "请选择库存模式", triggle: "blur" }
        ],
        priceMin: [
          {
            required: true,
            message: "请输入最低零售价",
            triggle: "blur",
            type: "number"
          }
        ],
        priceMax: [
          {
            required: true,
            message: "请输入最高零售价",
            triggle: "blur",
            type: "number"
          }
        ],
        stockModel: [
          { required: true, message: "请选择库存模式", triggle: "blur" }
        ]
      },
      baseColumns: [
        //价格table基础模板
        {
          title: "操作",
          key: "action",
          width: 70,
          align: "center",
          render: (h, params) => {
            let { index } = params;
            return h("Icon", {
              class: {
                "delete-icon": true
              },
              props: {
                type: "android-remove-circle"
              },
              on: {
                click: () => {
                  this.del(index);
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
            let { index } = params;
            let { startTime, endTime, weeks } = params.row;
            startTime = startTime ? new Date(startTime) : "";
            endTime = endTime ? new Date(endTime) : "";
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
                      this.baseInfo.priceListJson[index].weeks = weekList.join(
                        ","
                      );
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
                      prop: "priceListJson." + index + ".startTime",
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
                        value: startTime,
                        format: "yyyy-MM-dd",
                        placeholder: "开始时间",
                        options: {
                          disabledDate(date) {
                            let endValue = new Date(endTime).valueOf();
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
                          console.log(date);
                          this.baseInfo.priceListJson[index].startTime = date;
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
                      prop: "priceListJson." + index + ".endTime",
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
                        value: endTime,
                        format: "yyyy-MM-dd",
                        placeholder: "结束时间",
                        options: {
                          disabledDate(date) {
                            let startValue = new Date(startTime).valueOf();
                            return date && date.valueOf() < startValue;
                          }
                        }
                      },
                      on: {
                        "on-change": date => {
                          this.baseInfo.priceListJson[index].endTime = date;
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
                      console.log(this.baseInfo.priceListJson);
                      this.baseInfo.priceListJson[index].weeks = week.join(",");
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
            // let { stockModel } = params.row;
            let list = this.stockList;
            let stockModel = this.baseInfo.stockModel;
            let text = list.filter(item => {
              return item.value == stockModel;
            })[0].label;
            return h("span", {}, text);
            // let renderList = list.map(item => {
            //   return h(
            //     "Option",
            //     {
            //       props: {
            //         value: item.value,
            //         key: item.value
            //       }
            //     },
            //     item.label
            //   );
            // });
            // return h("Select", { props: { value: stockModel } }, renderList);
          }
        },
        {
          title: "成本价",
          align: "center",
          key: "costPrice",
          render: (h, params) => {
            let { costPrice } = params.row;
            let { index } = params;
            return h(
              "FormItem",
              {
                props: {
                  prop: "priceListJson." + index + "costPrice",
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
                      this.baseInfo.priceListJson[index].costPrice =
                        params.row.costPrice;
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
            let { rackPrice } = params.row;
            return h(
              "FormItem",
              {
                props: {
                  prop: "priceListJson." + index + "rackPrice",
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
                    value: rackPrice,
                    min: 0,
                    max: 100000
                  },
                  on: {
                    "on-change": value => {
                      params.row.rackPrice = value;
                    },
                    "on-blur": () => {
                      this.baseInfo.priceListJson[index].rackPrice =
                        params.row.rackPrice;
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
            let { retailPrice } = params.row;
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
                          prop: "priceListJson." + index + "retailPrice"
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
                              this.baseInfo.priceListJson[index].retailPrice =
                                params.row.retailPrice;
                              // console.log(this.baseInfo.priceListJson[index]);
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
                          prop: "priceListJson." + index + "retailPrice",
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
                            value: retailPrice,
                            min: 0,
                            max: 100000
                          },
                          on: {
                            "on-change": value => {
                              params.row.retailPrice = value;
                            },
                            "on-blur": () => {
                              this.baseInfo.priceListJson[index].retailPrice =
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
            let { supplyPrice } = params.row;
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
                          prop: "priceListJson." + index + "supplyPrice",
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
                              this.baseInfo.priceListJson[index].supplyPrice =
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
                          prop: "priceListJson." + index + "supplyPrice",
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
                              this.baseInfo.priceListJson[index].supplyPrice =
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
      columns: [], //价格table展示
      groupColumns: [
        {
          title: "选择分组",
          width: 90,
          align: "center",
          key: "defaultLabel",
          render: (h, params) => {
            let { defaultLabel } = params.row;
            return h("Radio", {
              props: {
                value: defaultLabel == "T" ? true : false
              },
              on: {
                "on-change": value => {
                  let defaultLabel = value ? "T" : "F";
                  this.baseInfo.groupItems.defaultLabel = defaultLabel;
                }
              }
            });
          }
        },
        {
          title: "分组名称",
          key: "labelValue",
          render: (h, params) => {
            let { labelValue } = params.row;
            let { index } = params;
            return h(
              "FormItem",
              {
                props: {
                  prop: "groupItems." + index + ".labelValue",
                  rules: {
                    required: true,
                    message: "请输入分组名称",
                    triggle: "blur"
                  }
                }
              },
              [
                h("Input", {
                  props: {
                    value: labelValue
                  },
                  on: {
                    "on-blur": value => {
                      this.baseInfo.groupItems.labelValue = value;
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "排序",
          key: "sortNo",
          width: 120,
          render: (h, params) => {
            let { sortNo = 0 } = params.row;
            let { index } = params;
            return h(
              "FormItem",
              {
                props: {
                  prop: "groupItems." + index + ".sortNo",
                  rules: {
                    required: true,
                    message: "请输入排序",
                    triggle: "blur",
                    type: "number"
                  }
                }
              },
              [
                h("InputNumber", {
                  props: {
                    value: sortNo,
                    min: 0,
                    max: 100000
                  },
                  on: {
                    "on-change": value => {
                      params.row.sortNo = value;
                    },
                    "on-blur": () => {
                      this.baseInfo.groupItems.sortNo = params.row.sortNo;
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
          width: 90,
          render: (h, params) => {
            let { index } = params;
            return index
              ? h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.removeGroup(index);
                      }
                    }
                  },
                  "删除"
                )
              : "";
          }
        }
      ],
      list: [
        { value: "0", label: "分销市场+店铺" },
        { value: "1", label: "仅分销市场" },
        { value: "2", label: "仅店铺" }
      ],
      stockList: [
        { label: "日库存", value: "day" },
        { label: "无限库存", value: "unlimit" },
        { label: "有限库存", value: "limit" }
      ],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      ecCodeType: ""
    };
  },
  watch: {
    getBaseInfo: function(val) {
      this.baseInfo = this.cloneDeep(val);
    },
    songStockModel1: function(val) {
      if (val && val.hasOwnProperty("show")) {
        this.createCom();
      }
    }
  },
  computed: {
    sellType: function() {
      return this.baseInfo.sellType;
    },
    ...mapGetters("ticket", [
      "getBaseInfo",
      "songName",
      "songMchId",
      "songTicketType",
      "songIsSyncYpw",
      "songExtendsParam3",
      "songExtendsParam4",
      "songGroupName",
      "songIsRealName",
      "songIsSpecial",
      "songSellType",
      "songIsShowTicketNotice",
      "songStockModel1",
      "songExtendsParam1",
      "songLinkMobileImg",
      "songLeftStockNum"
    ])
  },
  methods: {
    selectSenic() {
      this.modal = true;
      this.$refs.pageWrap.getTableList();
    },
    ok() {
      this.modal = false;
    },
    cancel() {
      this.modal = false;
    },
    createCom() {
      if (this.songStockModel1.show) {
        this.columns = this.baseColumns.filter(col => {
          return (
            col.key !== "chenel" &&
            col.key !== "rackPrice" &&
            col.key !== "supplyPrice"
          );
        });
      } else {
        this.columns = this.baseColumns.filter(col => {
          return col.key !== "stockModel";
        });
      }
    },
    addGroup() {
      let groupItems = this.baseInfo.groupItems;
      if (groupItems.length == 10) {
        this.$Message.warning("最多添加10条分组数据");
      }
      groupItems.push({
        defaultLabel: "F",
        labelValue: "",
        sortNo: 0
      });
    },
    removeGroup(index) {
      this.baseInfo.groupItems.splice(index, 1);
    },
    selectCode(type) {
      this.ecCodeType = type;
      this.ecFlag = true;
    },
    getEcCode(code) {
      this.baseInfo[this.ecCodeType] = code;
    },
    handleSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs.baseForm.validate(valid => {
          if (valid) {
            let info = this.cloneDeep(this.baseInfo);
            let priceList = this.baseInfo.priceListJson;
            priceList.forEach(item => {
              item.startTime = item.startTime
                ? this.filter.formatDate(
                    this.common.changeDate(item.startTime),
                    "yyyy-MM-dd"
                  )
                : "";
              item.endTime = item.endTime
                ? this.filter.formatDate(
                    this.common.changeDate(item.endTime),
                    "yyyy-MM-dd"
                  )
                : "";
            });
            info.parkTicketPriceJson = priceList;
            delete info.priceListJson;
            resolve(info);
          } else {
            reject("Fail!");
          }
        });
      });
    },
    // 新增价格表数据
    addPriceList() {
      let tableList = this.baseInfo.priceListJson;
      if (tableList.length == 10) {
        this.$Message.warning("最多添加10条数据");
      }
      tableList.push({
        weeks: "1,2,3,4,5,6,0",
        startTime: "",
        endTime: "",
        costPrice: 0,
        rackPrice: 0,
        retailPrice: 0,
        supplyPrice: 0
      });
    },
    del(index) {
      let tableList = this.baseInfo.priceListJson;
      if (tableList.length > 1) {
        tableList.splice(index, 1);
      } else {
        tableList.splice(index, 1, {
          weeks: "1,2,3,4,5,6,0",
          startTime: "",
          endTime: "",
          costPrice: 0,
          rackPrice: 0,
          retailPrice: 0,
          supplyPrice: 0,
          stockModel: "day"
        });
      }
    }
  },
  created() {
    this.apiPost("/product/api/park/selectMchInfo").then(res => {
      if (res.status == "200") {
        this.mchList = res.data.map(item => {
          return { mchId: item.id, label: item.mchName };
        });
      }
    });
  },
  mounted() {}
};
</script>
<style lang="scss">
.ticket-base {
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
      text-indent: 18px;
      border-bottom: 1px solid #e9eaec;
    }
    .td-item:last-child {
      border-bottom: none;
    }
  }
  .group-wrap {
    .ivu-table-row {
      height: 62px;
    }
    .ivu-form-item-error-tip {
      padding-top: 1px;
    }
  }
  .ivu-input-number-handler-wrap {
    display: none;
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
