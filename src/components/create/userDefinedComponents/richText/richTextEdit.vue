<template>
  <div class="rich-edit-box">
    <!-- {{pageData}} -->
    <table class="edit-table">
      <tr>
        <td class="title">背景颜色</td>
        <td>
          <ColorPicker v-model="pageData.backgroundColor" />
          <Input v-model="pageData.backgroundColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="backgroundColorReset" type="primary" size='small'>重置</Button>
        </td>
      </tr>
    </table>
    <ueditor id="ue2" @contentChange='change' @editorFoucus='foucus' @editorBlur='blur' :content='pageData.content' :config="config"></ueditor>
  </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    ueditor
  },
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    pageData() {
      return this.list2[this.index].data;
    },
    ...mapState({
      list2: state => {
        //   console.log(state)
        return state.defined.list;
      },
      errorShow: state => {
        return state.defined.errorShow;
      }
    })
  },
  watch: {
    // pageData: {
    //   handler(val, oldVal) {
    //     console.log("val", val);
    //   },
    //   deep: true
    // }
  },
  data() {
    return {
      // pageData: this.data,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 300,
        autoHeightEnabled: false
      }
    };
  },
  methods: {
    ...mapActions("defined", ["setDisable"]),
    foucus() {
      //失去焦点的时候设置成不能拖拽的
      this.setDisable(true);
    },
    blur() {
      //失去聚焦后并且判断图片缩放是否在使用，使用的话设置true（不能拖拽），不使用的时候设置成false
      if (document.getElementsByClassName("edui-editor-imagescale").length) {
        let cssStr = document.getElementsByClassName(
          "edui-editor-imagescale"
        )[0].style.display;
        if (cssStr == "block") {
          this.setDisable(true);
        } else {
          this.setDisable(false);
        }
      } else {
        this.setDisable(false);
      }
    },
    change(val) {
      this.pageData.content = val;
    },
    backgroundColorReset() {
      this.pageData.backgroundColor = "#fff";
    }
  }
};
</script>
<style lang='scss'>
.rich-edit-box {
  .ivu-select-dropdown {
    z-index: 1000;
  }
  iframe {
    // background: red;
    html {
      background: blue;
    }
    img {
      width: 100% !important;
    }
  }
}
</style>

