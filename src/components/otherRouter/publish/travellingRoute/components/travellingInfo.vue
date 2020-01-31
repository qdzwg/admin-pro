<template>
  <Form
    :model="formItem"
    label-position="right"
    :label-width="120"
    ref="baseForm"
    class="ticket-base"
    :rules="baseRule"
    v-if="getTravellIngInfo"
  >
    <FormItem label="跟团游描述：" prop="lineDescription">
      <Input
        type="textarea"
        v-model="formItem.lineDescription"
        :maxlength="100"
        placeholder="用于跟团游详情页，跟团游名称下方介绍"
        style="width:33%"
      ></Input>
    </FormItem>
    <template>
      <FormItem label="跟团游须知：" prop="lineNotes">
        <ueditor
          id="ue1"
          ref="ue1"
          v-model="formItem.lineNotes"
          :config="config"
        ></ueditor>
      </FormItem>
      <FormItem label="行程安排：" prop="lineArrange">
        <ueditor v-model="formItem.lineArrange"></ueditor>
      </FormItem>
      <FormItem label="费用说明：" prop="costDescription">
        <ueditor v-model="formItem.costDescription" :config="config"></ueditor>
      </FormItem>
    </template>
    <FormItem label="缩略图：" prop="linkMobileImg">
      <up-img :limitNum="1" v-model="formItem.linkMobileImg"></up-img>
      <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
    </FormItem>
    <FormItem label="轮播图：" prop="linkBreviaryImg">
      <up-img :limitNum="5" v-model="formItem.linkBreviaryImg"></up-img>
      <p>最多上传5张，建议上传小于2M， 宽750px，高440px的JPG/PNG格式的图片</p>
    </FormItem>
    <FormItem
      label="详情页视频："
      v-if="s_extendParamTwo && s_extendParamTwo.show"
    >
      <my-video v-model="formItem.extendParamTwo"></my-video>
    </FormItem>
    <template v-if="isSongcheng">
      <FormItem
        label="前台展示起价："
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
        label="售后政策："
        v-if="s_extendParamThree && s_extendParamThree.show"
      >
        <ueditor v-model="formItem.extendParamThree" :config="config"></ueditor>
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
        <Checkbox
          label="tel"
          @on-change="telChange"
          v-model="telFlag"
        ></Checkbox>
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
    </template>
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
import myVideo from "@/components/global/video";
export default {
  components: { myVideo },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      telFlag: false,
      emailFlag: false,
      model2: false,
      formItem: {},
      baseRule: {
        lineDescription: [
          { required: true, message: "请填写跟团游描述", trigger: "blur" }
        ],
        lineNotes: [
          { required: true, message: "请填写跟团游须知", trigger: "blur" }
        ],
        lineArrange: [
          { required: true, message: "请填写行程安排", trigger: "blur" }
        ],
        costDescription: [
          { required: true, message: "请填写费用说明", trigger: "blur" }
        ],
        linkMobileImg: [{ required: true, message: "请上传缩略图" }],
        linkBreviaryImg: [{ required: true, message: "请上传轮播图" }],
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
        soldPolicy: [
          { required: true, message: "请填写售后政策", trigger: "blur" }
        ]
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      }
    };
  },
  watch: {
    getTravellIngInfo: function(val) {
      this.formItem = this.cloneDeep(val);
    }
  },
  computed: {
    ...mapGetters("travelling", [
      "getTravellIngInfo",
      "isSongcheng",
      "s_extendParamTwo",
      "s_extendParamThree"
    ])
  },
  methods: {
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
    // 设置模板
    getModal() {
      this.model2 = true;
    },
    templateCancel() {
      this.model2 = false;
    },
    peopleConfirmChange(value) {
      if (value === "T") {
        this.formItem.peopleConfirmTime = 1440;
      } else {
        this.formItem.peopleConfirmTime = "";
      }
    },
    handleSubmit() {
      return new Promise((resolve, reject) => {
        try {
          this.$refs.baseForm.validate(valid => {
            if (valid) {
              let info = this.cloneDeep(this.formItem);
              resolve(info);
            } else {
              this.$Message.warning("跟团游信息验证不通过");
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
