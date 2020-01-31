<template>
  <div class="member-rule-page">
    <Row class="score-info">
      <Col span="6">
        <div class="txt">可用积分</div>
        <div class="num">{{pageData.available}}</div>
      </Col>
      <Col span="6">
        <div class="txt">保护期积分</div>
        <div class="num">{{pageData.proctectBonus}}</div>
      </Col>
      <Col class="canPointer" span="6" @click.native="detailShow=true">
        <div class="txt">累计发放积分</div>
        <div class="num blue">{{pageData.totalGrant}}</div>
      </Col>
      <Col class="canPointer" span="6" @click.native="detailShow=true">
        <div class="txt">累计消耗积分</div>
        <div class="num blue">{{pageData.totalConsume}}</div>
      </Col>
    </Row>
    <!-- <Table style="margin-top:10px" border :columns="columns7" :data="data6"></Table> -->
    <table class="rule-table">
      <thead>
        <tr>
          <th>规则名称</th>
          <th>规则详情</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>积分有效期</td>
          <td>{{pageData.validType?(pageData.validType=='forever'?'永久有效':'从'+ pageData.startYear +'年开始，每间隔'+ pageData.year +'年的' + pageData.month + '月' + pageData.day + '日'):''}}</td>
          <td>{{pageData.validtimeModifyTime}}</td>
          <td>
            <Button type="primary" @click="timeLimitSet" size="small">设置</Button>
          </td>
        </tr>
        <tr>
          <td>积分保护期</td>
          <td>-</td>
          <td>-</td>
          <td>
            <Button size="small" disabled>设置</Button>
          </td>
        </tr>
        <tr>
          <td>自定义积分名称</td>
          <td>{{pageData.name}}</td>
          <td>{{pageData.nameModifyTime}}</td>
          <td>
            <Button type="primary" @click="nameSet" size="small">设置</Button>
          </td>
        </tr>
        <!-- <tr>
          <td>积分抵扣产品</td>
          <td></td>
          <td></td>
          <td>
            <Button type="primary" @click="$router.push('/deduction/productsMg')" size="small">设置</Button>
            <span>可抵扣产品 /不可抵扣产品</span>
          </td>
        </tr> -->
        <tr>
          <td>现金与积分折算关系</td>
          <td></td>
          <td></td>
          <td>
            <Button type="primary" @click="cashIntegralConversionSet" size="small">设置</Button>
          </td>
        </tr>
        <tr>
          <td>积分抵扣现金开关</td>
          <td>{{pageData.deductionEnable=='T'?'开启':'关闭'}}</td>
          <td></td>
          <td>
            <Button
              type="primary"
              size="small"
              v-if="pageData.deductionEnable=='F'"
              @click="handel"
            >开启</Button>
            <Button type="default" size="small" v-else @click="handel">关闭</Button>
          </td>
        </tr>
        <tr>
          <td>订单金额积分抵扣规则</td>
          <td></td>
          <td></td>
          <td>
            <Button type="primary" @click="$router.push('/integral')" size="small">设置</Button>
          </td>
        </tr>
      </tbody>
    </table>
    <Button style="margin-top:10px" @click="addRule" type="primary">新建积分发放规则</Button>
    <Modal width="300" v-model="modal3" title="自定义积分名称">
      <span>积分名称:</span>
      <Input v-model.trim="ruleName" :maxlength="5" style="width: 180px"></Input>
      <div slot="footer">
        <Button @click="modal3=false">取消</Button>
        <Button type="primary" @click="nameSubmit">确定</Button>
      </div>
    </Modal>
    <Table style="margin-top:10px" border :columns="columns8" :data="data7"></Table>
    <Modal width="600" v-model="modal1" title="设置积分有效期">
      <!-- {{phone}} -->
      <RadioGroup v-model="formItemData.validType">
        <div>
          <Radio label="forever">
            <span>永久有效</span>
          </Radio>
        </div>
        <div style="margin-top:10px">
          <Radio label="relative">
            <span>从</span>
          </Radio>
          <DatePicker
            v-model="formItemData.startYear"
            type="year"
            placeholder="选择年"
            style="width: 80px"
          ></DatePicker>
          <span>年开始，每间隔</span>
          <Select v-model="formItemData.year" style="width:70px">
            <Option v-for="(item,index) in 20" :value="item" :key="index">{{ item }}</Option>
          </Select>
          <span>年的</span>
          <Select v-model="formItemData.month" style="width:100px">
            <Option v-for="(item,index) in 12" :value="item" :key="index">{{ item }}月</Option>
          </Select>
          <Select v-model="formItemData.day" style="width:100px">
            <Option v-for="(item,index) in 31" :value="item" :key="index">{{ item }}日</Option>
          </Select>
        </div>
      </RadioGroup>
      <div slot="footer">
        <Button @click="modal1=false">取消</Button>
        <Button @click="ruleSubmit" type="primary">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="modal2"
      :title="modalType=='add'?'设置积分发放规则':'编辑积分发放规则'"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="handleReset('formValidate')"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="发放规则" required>
          <RadioGroup @on-change="change" v-model="formValidate.type">
            <div>
              <Radio label="overSum">
                <span>每购买</span>
              </Radio>
              <FormItem
                style="display:inline-block"
                :rules="[{ required:formValidate.type=='overSum', message: '请填写金额'},{ pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]"
                prop="consume"
              >
                <Input
                  :disabled="formValidate.type!='overSum'"
                  size="small"
                  v-model="formValidate.consume"
                  style="width: 100px"
                ></Input>
                <span>元</span>
              </FormItem>
            </div>
            <div style="margin-top:10px">
              <Radio label="overAmount">
                <span>每交易</span>
              </Radio>
              <FormItem
                style="display:inline-block"
                :rules="[{ required:formValidate.type=='overAmount', message: '请填写数量'},{ pattern:/^(0|\+?[1-9][0-9]*)$/, message: '数据格式不正确'}]"
                prop="orderNum"
              >
                <Input
                  :disabled="formValidate.type!='overAmount'"
                  size="small"
                  v-model="formValidate.orderNum"
                  style="width: 100px"
                ></Input>
                <span>笔</span>
              </FormItem>
            </div>
          </RadioGroup>
        </FormItem>
        <FormItem label="发放积分值" prop="bonus">
          <Input v-model="formValidate.bonus" style="width: 100px"></Input>
        </FormItem>
        <FormItem label="会员生日发放倍率" prop="birthdayRate">
          <Input v-model="formValidate.birthdayRate" style="width: 100px"></Input>
          <span>倍</span>
        </FormItem>
        <FormItem label="会员日发放倍率">
          <FormItem style="display: inline-block;" prop="leaguerDateRate">
            <Input v-model="formValidate.leaguerDateRate" style="width: 100px"></Input>
          </FormItem>
          <span>倍，每月</span>
          <Select v-model="formValidate.day" style="width:100px">
            <Option v-for="(item,index) in 31" :value="item" :key="index">{{ item }}号</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="modal2=false">取消</Button>
        <Button @click="handleSubmit('formValidate')" type="primary">确定</Button>
      </div>
    </Modal>
    <detail-modal v-model="detailShow"></detail-modal>
    <!-- 设置现金积分抵扣比例 -->
    <cash-integral-conversion
      :deductionBonus="pageData.deductionBonus"
      v-model="cashIntegralConversionShow"
      @handleOver="handleOver"
    ></cash-integral-conversion>
  </div>
</template>
<style lang="scss" scoped>
.member-rule-page {
  .rule-table {
    margin-top: 10px;
    border-spacing: 0;
    border-top: 1px solid #e9eaec;
    border-right: 1px solid #e9eaec;
    width: 100%;
    th,
    td {
      padding: 5px 7px;
      text-align: center;
      border-left: 1px solid #e9eaec;
      border-bottom: 1px solid #e9eaec;
      font-size: 14px;
    }
    td {
      height: 48px;
    }
    th {
      background-color: #f8f8f9;
      height: 40px;
    }
  }
  .score-info {
    background: #cccccc;
    text-align: center;
    padding: 15px 0;
    .txt {
      font-size: 16px;
      font-weight: 500;
    }
    .num {
      margin-top: 5px;
      font-size: 18px;
      font-weight: 500;
      &.blue {
        color: #57a3f3;
      }
    }
  }
}
</style>
<script>
import { apiPost, apiGet } from "@/fetch/api";
import detailModal from "./moudle/detailModal";
import cashIntegralConversion from "./moudle/cashIntegralConversion";
export default {
  components: {
    detailModal,
    cashIntegralConversion
  },
  data() {
    return {
      cashIntegralConversionShow: false, //现金积分换算
      detailShow: false,
      modal3: false,
      data7: [],
      modalType: "add",
      modal1: false,
      modal2: false,
      formItemData: {
        validType: "forever",
        startYear: "",
        year: "",
        month: "",
        day: ""
      },
      formValidate: {
        id: "",
        type: "overSum",
        consume: "",
        orderNum: "",
        bonus: "",
        birthdayRate: "",
        leaguerDateRate: "",
        day: ""
      },
      ruleValidate: {
        type: [
          {
            required: true,
            message: "请选择类别"
          }
        ],
        bonus: [
          {
            required: true,
            message: "请填写发放积分",
            trigger: "blur"
          },
          {
            pattern: /^(([1-9][0-9]*))$/,
            message: "数据格式不正确"
          }
        ],
        birthdayRate: [
          {
            pattern: /^(([1-9][0-9]*))$/,
            message: "数据格式不正确"
          }
        ],
        leaguerDateRate: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1}|[1-9][0-9]*\.\d{1})))$/,
            message: "数据格式不正确"
          }
        ]
      },
      columns8: [
        {
          title: "发放条件",
          key: "name",
          render: (h, params) => {
            return h(
              "span",
              params.row.type == "overSum"
                ? "每购买" + params.row.consume + "元"
                : "每交易" + params.row.orderNum + "笔"
            );
          }
        },
        {
          title: "单笔发放积分",
          key: "bonus"
        },
        {
          title: "生日发放倍率",
          key: "birthdayRate"
        },
        {
          title: "会员日发放倍率",
          key: "leaguerdateRate"
        },
        {
          title: "更新时间",
          key: "modifyTime"
        },
        {
          title: "已发放总积分",
          key: "grantBonus"
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            return h("span", params.row.status == "T" ? "有效" : "无效");
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      let item = params.row;
                      //                 formValidate: {
                      //   id: "",
                      //   type: "overSum",
                      //   consume: "",
                      //   orderNum: "",
                      //   bonus: "",
                      //   birthdayRate: "",
                      //   leaguerDateRate: "",
                      //   day: ""
                      // },
                      this.modalType = "edit";
                      this.$refs["formValidate"].resetFields();
                      this.formValidate.id = item.id;
                      this.formValidate.type = item.type;
                      this.formValidate.consume = item.consume
                        ? item.consume + ""
                        : "";
                      this.formValidate.orderNum = item.orderNum
                        ? item.orderNum + ""
                        : "";
                      this.formValidate.bonus = item.bonus
                        ? item.bonus + ""
                        : "";
                      this.formValidate.birthdayRate = item.birthdayRate
                        ? item.birthdayRate + ""
                        : "";
                      this.formValidate.leaguerDateRate = item.leaguerdateRate
                        ? item.leaguerdateRate + ""
                        : "";
                      this.formValidate.day = item.day ? item.day + "" : "";

                      this.$nextTick(() => {
                        this.modal2 = true;
                      });
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: "确认删除吗？",
                        onOk: () => {
                          apiGet("/leaguer/web/bonus/rule/manage/delete", {
                            id: params.row.id,
                            corpCode: this.$cookies.get("corpCode")
                          }).then(res => {
                            if (res.status == 200) {
                              this.$Message.success("删除成功!");
                              this.getRule();
                            } else {
                              this.$Message.warning(res.message);
                            }
                          });
                        },
                        onCancel: () => {}
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      columns7: [
        {
          title: "规则名称",
          key: "name"
        },
        {
          title: "规则详情",
          key: "age"
        },
        {
          title: "更新时间",
          key: "address"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modal1 = true;
                    }
                  }
                },
                "设置"
              )
            ]);
          }
        }
      ],
      pageData: {},
      ruleName: "",
      data6: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park"
        }
      ],
      integralDeductionShow: false
    };
  },
  created() {
    this.getPageData();
    this.getRule();
    apiGet('/leaguer/web/bonus/rule/manage/update/deduction/type?corpCode=xjtestfx&type=all').then(data=>{}).catch(err=>{});
  },
  methods: {
    handleOver() {
      this.getPageData();
    },
    handel() {
      this.$Modal.confirm({
        title: "提示",
        content:
          "确认" +
          (this.pageData.deductionEnable == "T" ? "关闭" : "开启") +
          "吗？",
        onOk: () => {
          apiGet("/leaguer/web/bonus/rule/manage/update/deduction/enable", {
            deduction: this.pageData.deductionEnable == "T" ? "F" : "T"
          }).then(res => {
            this.handleData(res, this.getPageData);
          });
        },
        onCancel: () => {}
      });
    },
    handleData(res, fn) {
      if (res.status == 200) {
        fn && typeof fn == "function" && fn();
      } else {
        this.$Message.warning(res.message);
      }
    },
    cashIntegralConversionSet() {
      this.cashIntegralConversionShow = true;
    },
    nameSubmit() {
      if (!this.ruleName) {
        this.$Message.warning("请输入名称");
        return false;
      }
      apiPost("/leaguer/web/bonus/rule/manage/name/update", {
        bonusName: this.ruleName,
        corpCode: this.$cookies.get("corpCode")
      }).then(res => {
        if (res.status == 200) {
          this.$Message.success("设置成功！");
          this.modal3 = false;
          this.getPageData();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    nameSet() {
      this.ruleName = this.pageData.name;
      this.modal3 = true;
    },
    getPageData() {
      apiGet("/leaguer/web/bonus/rule/manage/base", {
        corpCode: this.$cookies.get("corpCode")
      }).then(res => {
        if (res.status == 200) {
          this.pageData = res.data ? res.data : {};
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    ruleSubmit() {
      let data = JSON.parse(JSON.stringify(this.formItemData));
      data.startYear = data.startYear
        ? new Date(data.startYear).getFullYear()
        : "";
      apiPost(
        "/leaguer/web/bonus/rule/manage/valid/update",
        Object.assign(data, {
          corpCode: this.$cookies.get("corpCode")
        })
      ).then(res => {
        if (res.status == 200) {
          this.$Message.success("设置成功！");
          this.modal1 = false;
          this.getPageData();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    timeLimitSet() {
      let item = this.pageData;

      //  type: "overSum",
      //   consume: "",
      //   orderNum: "",
      //   bonus: "",
      //   birthdayRate: "",
      //   leaguerDateRate: "",
      //   day: ""
      this.formItemData.validType = item.validType ? item.validType : "forever";
      this.formItemData.startYear = item.startYear ? item.startYear + "" : "";
      this.formItemData.year = item.year ? item.year : "";
      this.formItemData.month = item.month ? item.month : "";
      this.formItemData.day = item.day ? item.day : "";
      console.log(this.formItemData);
      this.modal1 = true;
    },
    addRule() {
      this.modalType = "add";
      this.$refs["formValidate"].resetFields();
      this.modal2 = true;
      this.formValidate.id = "";
    },
    change(type) {
      console.log(type);
      if (type == "overSum") {
        this.formValidate.orderNum = "";
      }
      if (type == "overAmount") {
        this.formValidate.consume = "";
      }
      this.$nextTick(() => {
        if (type == "overSum") {
          this.$refs.formValidate.validateField("orderNum");
        } else {
          this.$refs.formValidate.validateField("consume");
        }
      });
    },
    getRule() {
      apiGet("/leaguer/web/bonus/rule/manage/list", {
        corpCode: this.$cookies.get("corpCode")
      }).then(res => {
        this.data7 = res.data;
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          apiPost(
            this.modalType == "add"
              ? "/leaguer/web/bonus/rule/manage/add"
              : "/leaguer/web/bonus/rule/manage/update",
            Object.assign(
              { corpCode: this.$cookies.get("corpCode") },
              this.formValidate
            )
          ).then(res => {
            if (res.status == 200) {
              this.$Message.success(
                this.modalType == "add" ? "添加成功" : "编辑成功"
              );
              this.modal2 = false;
              this.handleReset("formValidate");
              this.getRule();
            } else {
              this.$Message.warning(res.message);
            }
          });
        } else {
          // this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>

<style scoped>
.canPointer {cursor:pointer;}
</style>