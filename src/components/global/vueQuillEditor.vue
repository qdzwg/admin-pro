<template>
  <!-- 不支持ie，舍弃，用原先的百度编辑器 -->
  <div class="quill-wrap">
    <!-- <quill-editor v-model="thiscontent" ref="myQuillEditor" :options="editorOption">
    </quill-editor> -->
    
  </div>
</template>
<script>
// import { quillEditor, Quill } from "vue-quill-editor";
// import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
// import ImageResize from "quill-image-resize-module";

// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";

// Quill.register("modules/ImageExtend", ImageExtend);
// Quill.register("modules/ImageResize", ImageResize);
export default {
  props: {
    content: {
      type: String,
      default: ""
    }
  },
  watch: {
    content: function(val) {
      this.thiscontent = val;
    }
  },
  components: { quillEditor },
  data() {
    return {
      thiscontent: this.content,
      // 富文本框参数设置
      editorOption: {
        placeholder: "",
        modules: {
          ImageResize: {},
          ImageExtend: {
            loading: true,
            name: "file",
            action: "/static/manage/uiFileUpload/dispatch?action=upload",
            response: res => {
              // console.log(res);
              return res.prefix + res.url;
            }
          },
          toolbar: {
            container: container,
            handlers: {
              image: function() {
                QuillWatch.emit(this.quill.id);
              }
            }
          }
        }
      }
    };
  }
};
</script>
<style lang="scss">
.ql-container {
  height: 150px;
}
</style>
