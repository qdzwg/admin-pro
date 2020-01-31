<template>
  <div class="subblank-edit-box">
    <!-- {{data}} -->
    <table class="edit-table">
      <tr class="title">
        <td>
          <span class="red">*</span>
          空白高度
        </td>
        <td class="clearfix">
          <div class="slide-box">
            <Slider v-model="pageData.height" show-input></Slider>
          </div>
          <span class="silde-unit">px</span>
        </td>
      </tr>
      <tr>
        <td class="title">空白颜色</td>
        <td>
          <ColorPicker v-model="pageData.backgroundColor" />
          <Input v-model="pageData.backgroundColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="lineColorReset" type="primary" size='small'>重置</Button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
// import draggable from "vuedraggable";
import { mapState } from "vuex";
export default {
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  watch: {},
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
  data() {
    return {
      // pageData: this.data
    };
  },
  methods: {
    lineColorReset() {
      //线条颜色重置为#999
      this.pageData.backgroundColor = "#fff";
    }
  }
};
</script>
<style lang='scss'>
.subblank-edit-box {
  .slide-box {
    display: inline-block;
    width: 230px;
  }
  .silde-unit {
    float: right;
    font-size: 14px;
    color: #999;
    margin-top: 8px;
  }
}
</style>

