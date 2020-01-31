<template>
  <theModal v-model="value" width="600" @cancel="cancelFun" @ok="okFun">
    <Form
      ref="formItem"
      :model="formItem"
      :rules="ruleValidate"
      :label-width="100"
    >
      <FormItem label="模板类型：" prop="templateType">
        <Select
          v-model="formItem.templateType"
          style="width:200px"
          :disabled="isDisable"
          @on-change="changeMsgTemplate"
        >
          <Option
            v-for="item in msgTemplate"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <template v-if="formItem.templateType">
        <FormItem
          label="短信类型："
          prop="msgType"
          :rules="{ required: true, message: '请选择短信类型' }"
        >
          <Select
            v-model="formItem.msgType"
            style="width:200px"
            :disabled="isDisable"
          >
            <Option value="0" v-show="!jointPromotionFlag">短信</Option>
            <Option value="3" v-show="jointPromotionFlag">联盟推广短信</Option>
          </Select>
          <span v-if="jointPromotionFlag && name">归属成员：{{ name }}</span>
        </FormItem>
        <FormItem
          label="状态："
          prop="status"
          :rules="{
            required: true,
            message: '请选择状态',
            triggle: 'blur'
          }"
        >
          <Select
            v-model="formItem.status"
            style="width:200px"
            :disabled="isDisable"
          >
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
      </template>

      <FormItem label="标题：" prop="title">
        <Input
          v-model="formItem.title"
          placeholder="标题请使用【】包裹"
        ></Input>
      </FormItem>
      <FormItem label="模板内容：">
        <Input
          v-model="formItem.info"
          type="textarea"
          placeholder="预留参数请使用${}包裹"
          :autosize="{ minRows: 2, maxRows: 12 }"
        ></Input>
        <p>
          备注：修改内容中字符代码${}将导致发送短信内容与模板不符，请谨慎操作
        </p>
      </FormItem>
      <template v-if="jointPromotionFlag">
        <FormItem
          label="推广链接："
          prop="recommendUrl"
          :rules="{ required: true, message: '请输入推广链接' }"
        >
          <Input v-model="formItem.recommendUrl" maxlength="120"></Input>
        </FormItem>
        <FormItem
          label="短信签名："
          prop="sign"
          :rules="{ required: true, message: '请选择短信签名' }"
        >
          <Select v-model="formItem.sign" style="width:200px">
            <Option
              v-for="item in signatureList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
      </template>
      <FormItem label="模板描述：">
        <Input
          v-model="formItem.descContent"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
        ></Input>
      </FormItem>
    </Form>
  </theModal>
</template>

<script>
import theModal from "@/components/global/theModal.vue";
export default {
  components: { theModal },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      required: true
    },
    msgTemplate: {
      type: Array,
      required: true
    },
    msgStatus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      name: "",
      sysTemplateId: "",
      formItem: {
        templateType: "",
        msgType: "",
        status: "",
        title: "",
        info: "", //${spreadCode}
        descContent: "",
        recommendUrl: "",
        sign: ""
      },
      signatureList: [
        { value: 0, label: "【智游宝】" },
        { value: 1, label: "【千岛湖】" }
      ],
      ruleValidate: {
        templateType: [{ required: true, message: "请选则模板类型" }],
        messageTemplateId: [
          { required: true, message: "请选择模板类型", triggle: "blur" }
        ],
        title: [
          { required: true, message: "请输入标题", triggle: "blur" },
          { max: 30, message: "输入字符长度最大30", triggle: "blur" }
        ],
        info: [
          { required: true, message: "请输入模板内容" },
          { max: 120, message: "输入字符长度最大120" }
        ],
        descContent: [
          { required: true, message: "请输入模板描述", triggle: "blur" },
          { max: 120, message: "输入字符长度最大120", triggle: "blur" }
        ]
      }
    };
  },
  watch: {
    value: function(val) {
      if (val) {
        // if (!this.name) {
        //   this.getName();
        // }
        if (this.id) {
          this.getMsgDetail();
        } else {
          this.$refs.formItem.resetFields();
        }
      }
    }
  },
  computed: {
    //是否为联名推广
    jointPromotionFlag: function() {
      return this.formItem.templateType == 4;
    },
    isDisable: function() {
      return this.id ? true : false;
    },
    statusList: function() {
      let list = this.msgStatus.filter(item => {
        return item.msgTemplate == this.formItem.templateType;
      });
      return list;
    }
  },
  methods: {
    cancelFun() {
      this.$emit("input", false);
      this.$refs.formItem.resetFields();
    },
    okFun() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          let params = this.cloneDeep(this.formItem);
          params.sysTemplateId = this.sysTemplateId ? this.sysTemplateId : 0;
          params.extra = JSON.stringify({
            recommendUrl: params.recommendUrl,
            sign: params.sign
          });
          delete params.recommendUrl;
          delete params.sign;
          //短信群发字符串替换
          if (params.templateType == 4) {
            params.info = params.info.replace(
              /\$\{推广链接\}/g,
              "${spreadCode}"
            );
          }
          if (this.id) {
            this.editTemplateFun(params);
          } else {
            this.addTemplateFun(params);
          }
        }
      });
    },
    getMsgDetail(id) {
      this.apiGet("/merchant/api/merchantMessage/template/edit", {
        id: this.id
      }).then(res => {
        if (res.status == 200) {
          /** 后端针对短信联盟新增字段
           * @param {Object} extra,前端对此字段拍平处理（recommendUrl，sign），
           */
          let {
            templateType,
            status,
            title,
            info,
            descContent,
            msgType = 0,
            sysTemplateId,
            extra = { recommendUrl: "", sign: "" } //后端接口返回格式
          } = res.template;
          extra = typeof extra == "string" ? JSON.parse(extra) : extra;
          this.sysTemplateId = sysTemplateId;
          this.formItem = {
            templateType,
            msgType,
            status,
            title,
            info,
            descContent,
            ...extra
          };
          this.flag = true;
        }
      });
    },
    async editTemplateFun(params) {
      let info = await this.$parent.$refs.pageWrap.request({
        url: "/merchant/api/merchantMessage/template/update",
        param: {
          ...params,
          id: this.id
        }
      });
      if (info) {
        this.$emit("input", false);
      }
    },
    async addTemplateFun(params) {
      let info = await this.$parent.$refs.pageWrap.request({
        url: "/merchant/api/merchantMessage/template/save",
        param: {
          ...params
        }
      });
      if (info) {
        this.$emit("input", false);
      }
    },
    //如果切换到短信群发需要做默认内容处理
    changeMsgTemplate(type) {
      this.formItem.msgType = "";
      this.formItem.status = "";
      if (type == 4) {
        this.formItem.info = "${推广链接}";
        this.formItem.recommendUrl = "";
        this.formItem.sign = "";
      } else {
        this.formItem.info = "";
      }
    },
    getName() {
      this.apiGet("/merchant/api/merchantMessage/template/getalliance").then(
        res => {
          if (res.status == 200) {
            this.name = res.alliance ? res.alliance : "";
          }
        }
      );
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
