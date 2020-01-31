<template>
  <div class="navigation-edit-box">
    <!-- {{data}} -->
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>
          公告内容
        </td>
        <td>
          <Input
            :maxlength="80"
            :class="{'error':!pageData.content&&errorShow}"
            v-model="pageData.content"
            :rows="4"
            type="textarea"
            placeholder="请输入公告内容"
          ></Input>
          <!-- <Input v-model="pageData.content" placeholder="请输入公告内容" :class="{'error':!pageData.content&&errorShow}" :maxlength="80"></Input> -->
        </td>
      </tr>
      <tr>
        <td class="title">文字颜色</td>
        <td>
          <ColorPicker v-model="pageData.textColor"/>
          <Input v-model="pageData.textColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="textColorReset" type="primary" size="small">重置</Button>
        </td>
      </tr>
      <tr>
        <td class="title">背景颜色</td>
        <td>
          <ColorPicker v-model="pageData.backgroundColor"/>
          <Input v-model="pageData.backgroundColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="backgroundColorReset" type="primary" size="small">重置</Button>
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
      color1: "#fff",
      activeIndex: null, //需要设置图片的下标
      // pageData: this.data,
      disabledGroup: "fill",
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      model1: ""
    };
  },
  methods: {
    backgroundColorReset() {
      //背景颜色重置为#fff
      this.pageData.backgroundColor = "#fff";
    },
    textColorReset() {
      //背景颜色重置为#fff
      this.pageData.textColor = "#999";
    },
    typeSelect(val) {
      this.pageData.type = val;
    },
    del(index) {
      this.pageData.list.splice(index, 1);
    },
    add() {
      this.pageData.list.push({
        picAddr: "",
        text: "",
        linkUrl: ""
      });
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

