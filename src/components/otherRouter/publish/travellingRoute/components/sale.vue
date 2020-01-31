<template>
  <Form
    :model="formItem"
    label-position="right"
    :label-width="120"
    ref="baseForm"
    class="ticket-base"
    :rules="baseRule"
    v-if="getSalesInfo"
  >
    <FormItem label="分销渠道：" prop="sellType">
      <Select v-model="formItem.sellType" style="width:200px">
        <Option
          :value="item.value"
          v-for="(item, index) in sellTypeList"
          :key="index"
          >{{ item.label }}</Option
        >
      </Select>
    </FormItem>
    <div v-if="formItem.sellType != 1 && isSongcheng">
      <FormItem
        label="跟团游别名："
        prop="lineAlias"
        :rules="baseRule.lineAlias"
      >
        <Input
          ref="hotelName"
          v-model="formItem.lineAlias"
          style="width:33%"
          :maxlength="64"
        ></Input>
      </FormItem>
      <FormItem
        label="跟团游副标题："
        prop="lineViceName"
        :rules="baseRule.lineViceName"
      >
        <Input
          v-model="formItem.lineViceName"
          style="width:33%"
          :maxlength="64"
        ></Input>
      </FormItem>
      <FormItem
        label="店铺展示起价："
        prop="merchatShowPrice"
        :rules="baseRule.merchatShowPrice"
      >
        <Input
          v-model="formItem.merchatShowPrice"
          style="width:200px;"
          :maxlength="8"
        ></Input>
        <span class="money-unit">元</span>
      </FormItem>
      <FormItem
        label="店铺虚拟销量："
        prop="virtualSell"
        :rules="baseRule.virtualSell"
      >
        <Input
          :maxlength="6"
          v-model="formItem.virtualSell"
          style="width:200px;"
        ></Input>
        <span class="money-unit"></span>
      </FormItem>
    </div>
    <div v-if="formItem.sellType != 2">
      <FormItem
        label="分销展示价："
        prop="distShowPrice"
        :rules="baseRule.distShowPrice"
      >
        <Input
          v-model="formItem.distShowPrice"
          style="width:200px;"
          :maxlength="8"
        ></Input>
        <span class="money-unit">元</span>
      </FormItem>
      <FormItem
        label="分销政策："
        prop="distPolicy"
        :rules="baseRule.distPolicy"
      >
        <ueditor v-model="formItem.distPolicy" :config="config"></ueditor>
      </FormItem>
      <FormItem
        label="售后政策："
        prop="soldPolicy"
        :rules="baseRule.soldPolicy"
      >
        <ueditor v-model="formItem.soldPolicy" :config="config"></ueditor>
      </FormItem>
      <FormItem label="分销区域限制：">无限制</FormItem>
    </div>
    <FormItem label="下单信息填写：">
      <Checkbox v-model="nameIsRequire">姓名</Checkbox>
      <Checkbox v-model="idCardIsRequire">身份证</Checkbox>
    </FormItem>
    <FormItem label="留言：">
      <Button
        type="info"
        icon="plus"
        v-if="
          !formItem.orderCustomPlugins || !formItem.orderCustomPlugins.length
        "
        @click="addPlugins"
      ></Button>
      <!-- <template v-if="formItem.orderCustomPlugins.length"> -->
      <Row
        :gutter="16"
        style="width:55%; margin-bottom:24px;"
        v-for="(item, index) in formItem.orderCustomPlugins"
        :key="index"
      >
        <Col span="6">
          <FormItem
            :prop="'orderCustomPlugins.' + index + '.title'"
            :rules="{
              required: true,
              message: '请填写留言标题',
              trigger: 'blur'
            }"
          >
            <Input
              v-model="item.title"
              placeholder="请输入留言标题"
              :maxlength="8"
            ></Input>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem
            :prop="'orderCustomPlugins.' + index + '.type'"
            :rules="{
              required: true,
              message: '请选择留言类型',
              trigger: 'change'
            }"
          >
            <Select
              v-if="leaveType.length"
              v-model="item.type"
              placeholder="请选择留言类型"
              @on-change="typeChange($event, index)"
            >
              <Option
                v-for="sitem in leaveType"
                :value="sitem.value"
                :key="sitem.value"
                >{{ sitem.key }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem>
            <Input
              v-model="item.tips"
              placeholder="请输入提示语"
              :maxlength="12"
            ></Input>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem>
            <Checkbox v-model="item.isRequired">必填</Checkbox>
            <Button
              type="ghost"
              icon="minus-round"
              style="margin-left:2%;"
              @click="delPlugins(index)"
            ></Button>
            <Button
              type="info"
              icon="plus"
              style="margin-left:2%;"
              v-if="
                index === formItem.orderCustomPlugins.length - 1 && index < 4
              "
              @click="addPlugins"
            ></Button>
          </FormItem>
        </Col>
      </Row>
      <!-- </template> -->
    </FormItem>
    <FormItem label="预定人工确认：">
      <Row style="width:30%">
        <Col span="12">
          <Select
            v-model="formItem.peopleConfirm"
            placeholder="请选择预定人工确认"
            style="width:90%"
            @on-change="peopleConfirmChange"
          >
            <Option value="T">是</Option>
            <Option value="F">否</Option>
          </Select></Col
        >
        <Col span="12" v-if="formItem.peopleConfirm === 'T'">
          <FormItem prop="peopleConfirmTime">
            <Input
              v-model="formItem.peopleConfirmTime"
              number
              placeholder="请输入过期时间"
              style="width:60%;"
            ></Input>
            分钟
          </FormItem>
        </Col>
      </Row>
    </FormItem>
    <FormItem
      label="订单通知："
      prop="tel"
      :rules="
        telFlag
          ? {
              required: telFlag,
              validator: common.validate.phone,
              trigger: 'blur'
            }
          : {}
      "
    >
      <Checkbox label="tel" @on-change="telChange" v-model="telFlag"></Checkbox>
      <Input
        v-model="formItem.tel"
        :disabled="!telFlag"
        style="width:300px;"
        placeholder="用于接收下单提示短信"
      ></Input>
      <Button type="primary" @click="getModal">查看模板</Button>
    </FormItem>

    <FormItem
      prop="email"
      :rules="
        emailFlag
          ? {
              required: emailFlag,
              validator: common.validate.email,
              trigger: 'blur'
            }
          : {}
      "
    >
      <Checkbox
        label="email"
        @on-change="emailChange"
        v-model="emailFlag"
      ></Checkbox>
      <Input
        v-model="formItem.email"
        :disabled="!emailFlag"
        style="width:300px;"
        placeholder="用于接收下单提示邮箱"
      ></Input>
    </FormItem>
    <Modal v-model="model2" title="查看模板">
      <p>
        您有新的线路订单，订单内容{OrderCode}，X份，实付金额XX，请即时处理。
      </p>
      <div slot="footer">
        <Button @click="templateCancel">关闭</Button>
      </div>
      <!-- <Input type="textarea" v-model="formItem.text"></Input> -->
    </Modal>
  </Form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    const validateTime = (rule, value, callback) => {
      if (value > 1440) {
        callback(new Error("最大值1440"));
      } else {
        callback();
      }
    };
    return {
      telFlag: false,
      emailFlag: false,
      model2: false,
      nameIsRequire: false,
      idCardIsRequire: false,
      leaveType: [],
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
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      formItem: {},
      baseRule: {
        sellType: [
          {
            required: true,
            message: "请选择分销渠道",
            trigger: "blur",
            type: "number"
          }
        ],
        lineAlias: [
          { required: true, message: "请填写跟团游别名", trigger: "blur" },
          { max: 100, message: "跟团游别名字数不能超过100个" }
        ],
        lineViceName: [
          { required: true, message: "请填写跟团游副标题", trigger: "blur" },
          { max: 100, message: "跟团游副标题字数不能超过100个" }
        ],
        merchatShowPrice: [
          { required: true, message: "请填写店铺展示起价" },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        virtualSell: [
          { required: true, message: "请填写店铺虚拟销量" },
          {
            pattern: /^[0-9]\d*$/,
            message: "数据格式不正确"
          }
        ],
        distShowPrice: [
          { required: true, message: "请填写分销展示价" },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        distPolicy: [
          { required: true, message: "请填写分销政策", trigger: "blur" }
        ],
        peopleConfirmTime: [
          {
            required: true,
            type: "number",
            message: "请输入过期时间",
            trigger: "blur"
          },
          {
            pattern: /^\d+$/,
            message: "数据格式不正确"
          },
          {
            validator: validateTime,
            message: "数值不能大于1440"
          }
        ],
        soldPolicy: [
          { required: true, message: "请填写售后政策", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    getSalesInfo: {
      handler: function(val) {
        this.formItem = this.cloneDeep(val);
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters("travelling", ["getSalesInfo", "isSongcheng"])
  },
  methods: {
    addPlugins() {
      console.log(this.formItem);
      this.formItem.orderCustomPlugins.push({
        title: "",
        type: "",
        tips: "",
        name: "",
        isRequired: false
      });
    },
    delPlugins(index) {
      this.formItem.orderCustomPlugins.splice(index, 1);
    },
    peopleConfirmChange(value) {
      if (value === "T") {
        this.formItem.peopleConfirmTime = 1440;
      } else {
        this.formItem.peopleConfirmTime = "";
      }
    },
    // 设置模板
    getModal() {
      this.model2 = true;
    },
    templateCancel() {
      this.model2 = false;
    },
    typeChange(value, index) {
      this.formItem.orderCustomPlugins[index].name = value;
    },
    telChange(bool) {
      if (!bool) {
        this.formItem.tel = "";
      }
    },
    emailChange(bool) {
      if (!bool) {
        this.formItem.email = "";
      }
    },
    handleSubmit() {
      return new Promise((resolve, reject) => {
        try {
          this.$refs.baseForm.validate(valid => {
            if (valid) {
              let info = this.cloneDeep(this.formItem);
              info.orderCustomPlugins.unshift({
                title: "手机号",
                type: "buyerMobile",
                tips: "请输入手机号",
                name: "buyerMobile",
                isRequired: true
              });
              if (this.nameIsRequire) {
                info.orderCustomPlugins.unshift({
                  title: "姓名",
                  type: "buyerName",
                  tips: "请填写姓名",
                  name: "buyerName",
                  isRequired: true
                });
              }
              if (this.idCardIsRequire) {
                var idCardObj = {
                  title: "身份证号",
                  type: "buyerIdNo",
                  tips: "请填写身份证号",
                  name: "buyerIdNo",
                  isRequired: false
                };
                if (info.orderCustomPlugins[0].type === "buyerMobile") {
                  info.orderCustomPlugins.splice(1, 0, idCardObj);
                } else {
                  info.orderCustomPlugins.splice(2, 0, idCardObj);
                }
              }

              info.orderCustomPlugins = JSON.stringify(info.orderCustomPlugins);
              resolve(info);
            } else {
              this.$Message.warning("分销设置信息验证不通过");
              reject("Fail!");
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  created() {
    this.apiGet("/admin/api/sysParam/changeList?key=leaveType").then(res => {
      if (res.status === 200) {
        this.leaveType = res.data;
      } else {
        this.$Message.warning(res.message);
      }
    });
    // this.apiPost("/product/api/park/selectMchInfo").then(res => {
    //   if (res.status == "200") {
    //     this.mchList = res.data.map(item => {
    //       return { id: item.id, label: item.mchName };
    //     });
    //   }
    // });
  },
  mounted() {}
};
</script>
