<template>
  <div>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="100"
      ref="formItem"
    >
      <FormItem
        v-for="(item, index) in formItems"
        :key="index"
        :label="item.label + '：'"
        :prop="item.validate ? item.name : ''"
        :rules="item.validate || {}"
      >
        <span v-if="item.type == 'word'">
          {{ formItem[item.name] }}
        </span>
        <Input
          v-model="formItem[item.name]"
          :maxlength="64"
          :placeholder="'请输入' + item.label"
          v-if="item.type == 'text'"
        ></Input>
        <uploadFile
          :limitNum="(item.config && item.config.limitNum) || 1"
          v-model="formItem[item.name]"
          v-if="item.type == 'uploadFile'"
        ></uploadFile>
        <ueditor
          v-model="formItem[item.name]"
          v-if="item.type == 'ueditor'"
        ></ueditor>
        <Select
          v-model="formItem[item.name]"
          v-if="item.type == 'select'"
          style="width:200px"
        >
          <Option
            v-for="sitem in item.data"
            :value="sitem.value"
            :key="sitem.value"
            >{{ sitem.label }}</Option
          >
        </Select>
        <p v-if="item.tip" class="tip" v-html="item.tip"></p>
      </FormItem>
      <FormItem>
        <Button type="primary" size="large" @click="submit" :loading="loading"
          >提交</Button
        >
        <Button
          type="ghost"
          size="large"
          @click="cancel"
          style="margin-left: 8px"
          >取消</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import ueditor from "@/components/global/vueUEditor";
import uploadFile from "@/components/global/uploadFile";
export default {
  data() {
    return {
      formItem: {},
      loading: false
    };
  },
  props: {
    formItems: {
      type: Array,
      default: () => {
        return [];
      }
    },
    formAction: {
      type: String,
      required: true
    },
    formData: {
      type: Object
    }
  },
  components: {
    ueditor,
    uploadFile
  },
  watch: {
    formData() {
      this.formItem = this.formData || {};
    }
  },
  methods: {
    submit() {
      this.loading = true;
      this.$refs["formItem"].validate(async valid => {
        if (valid) {
          let res = await this.apiPost(this.formAction, this.formItem);
          this.loading = false;
          if (res.success || res.status === 200) {
            this.$Message.info(res.message || "操作成功！");
            this.$router.go(-1);
          } else {
            this.$Message.error(res.message);
          }
        } else {
          // this.$Message.error('Fail!')
          this.loading = false;
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scope>
.tip {
  color: red;
  position: relative;
  line-height: 22px;
  padding-bottom: 20px;
  margin-bottom: -24px;
}
</style>
