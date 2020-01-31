<template>
  <div class="navigation-edit-box">
    <!-- {{data}} -->
    <p>实际大小以手机自适应为准</p>
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>
          文本内容
        </td>
        <td>
          <Input v-model="pageData.content" :class="{'error':!pageData.content&&errorShow}" type="textarea" :maxlength="100" :rows="4" placeholder="请输入文本内容"></Input>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>
          字号
        </td>
        <td>
          <Select v-model="pageData.fontSize" style="width:200px">
            <Option v-for="item in fontSizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </td>
      </tr>
      <tr>
        <td>显示位置</td>
        <td>
          <RadioGroup v-model="pageData.position">
            <Radio label="left">
              <span>居左</span>
            </Radio>
            <Radio label="center">
              <span>居中</span>
            </Radio>
            <Radio label="right">
              <span>居右</span>
            </Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">文字颜色</td>
        <td>
          <ColorPicker v-model="pageData.textColor" />
          <Input v-model="pageData.textColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="textColorReset" type="primary" size='small'>重置</Button>
        </td>
      </tr>
      <tr>
        <td class="title">背景颜色</td>
        <td>
          <ColorPicker v-model="pageData.backgroundColor" />
          <Input v-model="pageData.backgroundColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="backgroundColorReset" type="primary" size='small'>重置</Button>
        </td>
      </tr>
      <tr>
        <td>链接</td>
        <td>
          <custom-link :itemData='pageData'></custom-link>
          <!-- <Select v-model="pageData.linkUrl" style="width:200px">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select> -->
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import customLink from "@/components/otherRouter/custompageLink";
import { mapState } from "vuex";
export default {
  components: {
    draggable,
    customLink
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
      typeList: [
        {
          value: "ticket",
          label: "景区门票"
        },
        {
          value: "hotel",
          label: "酒店"
        },
        {
          value: "shop",
          label: "特色商品"
        },
        {
          value: "strategy",
          label: "游玩攻略"
        },
        {
          value: "route",
          label: "跟团游"
        },
        {
          value: "repast",
          label: "餐饮"
        }
      ],
      fontSizeList: [
        // {
        //   value: "10px",
        //   label: "10px"
        // },
        {
          value: "11px",
          label: "11px"
        },
        {
          value: "12px",
          label: "12px"
        },
        {
          value: "14px",
          label: "14px"
        },
        {
          value: "16px",
          label: "16px"
        },
        {
          value: "17px",
          label: "17px"
        },
        {
          value: "18px",
          label: "18px"
        },
        {
          value: "20px",
          label: "20px"
        },
        {
          value: "24px",
          label: "24px"
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
    handleMaxSize() {},
    handleFormatError() {},
    setImgUrl(res, file) {
      this.pageData.list[this.activeIndex].picAddr = res.prefix + res.url;
    },
    del(index) {
      this.pageData.list.splice(index, 1);
    },
    delImg(index) {
      this.pageData.list[index].picAddr = "";
    },
    imgIndex(index) {
      this.activeIndex = index;
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

