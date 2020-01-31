<template>
  <Upload
    :format="['jpg','jpeg','png']"
    :on-success="setImgUrl"
    :show-upload-list="false"
    :max-size="2048"
    :on-format-error="handleFormatError"
    :on-exceeded-size="handleMaxSize"
    action="/static/manage/uiFileUpload/dispatch?action=upload"
  >
    <slot></slot>
  </Upload>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    setImgUrl(res, file) {
      let imgUrl = res.prefix + res.url;
      this.$emit("getImgUrl", Object.assign({ imgUrl: imgUrl }, this.params));
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "图片超过2M",
        desc: "图片：" + file.name + "太大， 不能超过2M"
      });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件： " + file.name + "格式错误, 请选择图片格式jpg,png上传"
      });
    }
  }
};
</script>