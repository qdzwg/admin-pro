<template>
  <Modal v-model="modalShow" title="设置现金积分抵扣比例">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <FormItem label="积分抵扣产品规则" prop="bonus">
        <Input style="width:120px" v-model="formValidate.bonus" placeholder></Input>
        <span>积分等于1元</span>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button @click="close" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import { apiGet } from "@/fetch/api";
export default {
  props: {
    deductionBonus: {
      type: Number | String,
      default: 1
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    deductionBonus(val) {
      this.formValidate.bonus = val + "";
    },
    value(val) {
      this.modalShow = val;
    },
    modalShow(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      modalShow: this.value,
      formValidate: {
        bonus: this.deductionBonus + ""
      },
      ruleValidate: {
        bonus: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur"
          },
          {
            pattern: /^\+?[1-9][0-9]*$/,
            message: "数据格式不正确"
          }
        ]
      }
    };
  },
  methods: {
    close() {
      this.handleReset("formValidate");
      this.modalShow = false;
    },
    handleSubmit(name) {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          let url = "/leaguer/web/bonus/rule/manage/update/deduction/rate";
          apiGet(url, this.formValidate).then(res => {
            if (res.status == 200) {
              this.$Message.success("设置成功");
              this.modalShow = false;
              this.$emit("handleOver");
            } else {
              this.$Message.warning(res.message);
            }
          });
        } else {
          //   this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>