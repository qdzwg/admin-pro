<template>
  <div class="line-edit-box">
    <!-- {{data}} -->

    <table class="edit-table">
      <tr>
        <td>边距</td>
        <td>
          <RadioGroup v-model="pageData.sideWidth">
            <Radio label="type1">
              <span>顶边</span>
            </Radio>
            <Radio label="type2">
              <span>左右留边</span>
            </Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td>样式</td>
        <td>
          <RadioGroup v-model="pageData.style">
            <Radio label="solid">
              <span>实线</span>
            </Radio>
            <Radio label="dashed">
              <span>虚线</span>
            </Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">线条颜色</td>
        <td>
          <ColorPicker v-model="pageData.lineColor" />
          <Input v-model="pageData.lineColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="lineColorReset" type="primary" size='small'>重置</Button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { mapState } from "vuex";
export default {
  components: {
    draggable
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
  watch: {},
  data() {
    return {
      // pageData: this.data
    };
  },
  methods: {
    lineColorReset() {
      //线条颜色重置为#999
      this.pageData.lineColor = "#999";
    }
  }
};
</script>
<style lang='scss'>
.navigation-edit-box {
  // .img-text-list{
  //   .img-text-item{
  //     .img-add{
  //       width: 56px;
  //     }
  //   }
  // }
}
</style>

