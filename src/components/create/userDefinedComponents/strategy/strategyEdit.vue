<template>
  <div class="strategy-edit-box">
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>
          列表样式
        </td>
        <td>
          <RadioGroup v-model="pageData.listType">
            <Radio label="singleRow">单列</Radio>
            <Radio label="biserial">双列</Radio>
            <!-- <Radio label="sideslip">横滑</Radio> -->
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">排序规则</td>
        <td>
          <RadioGroup v-model="pageData.sortRule">
            <Radio label="defaultSort">
              <span>默认排序</span>
            </Radio>
            <Radio label="randomSort">
              <span>随机排序</span>
            </Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">文字展示</td>
        <td>
          <RadioGroup v-model="pageData.showText">
            <Radio label="name">名称</Radio>
            <Radio label="time">发布时间</Radio>
          </RadioGroup>
        </td>
      </tr>
      <!-- <tr>
        <td class="title">文字位置</td>
        <td>
          <RadioGroup v-model="pageData.position">
            <Radio label="lb">左下角</Radio>
            <Radio label="lt">左上角</Radio>
          </RadioGroup>
        </td>
      </tr>-->
    </table>
    <div v-if="!custompageTemplate" class="product-group-item">
      <table class="edit-table">
        <tr>
          <td class="title">已选产品</td>
          <td>
            <Button
              v-if="pageData.dataList.length<50"
              @click="showModal"
              type="primary"
              size="small"
            >关联攻略</Button>
          </td>
        </tr>
      </table>
      <strategy-item :data="pageData"></strategy-item>
    </div>
    <strategy-modal
      ref="productModal"
      :selectedProduct="pageData.dataList"
      v-model="show"
      @selectProduct="getProduct"
    ></strategy-modal>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import customLink from "@/components/otherRouter/custompageLink";
import { mapState } from "vuex";
import strategyModal from "../../module/strategyModal";
import strategyItem from "../../module/strategyItem";
export default {
  components: {
    draggable,
    customLink,
    strategyModal,
    strategyItem
  },
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  created() {
    // console.log("prductg",this.$route)
    if (this.$route.name == "template-add-edit") {
      this.custompageTemplate = true;
    } else {
      this.custompageTemplate = false;
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
      show: false,
      custompageTemplate: false,
      activeIndex: null, //需要设置图片的下标
      // pageData: this.testData,
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
      ]
    };
  },
  methods: {
    getProduct(arr) {
      let initArr = new Array(arr.length).fill([]);
      let initImgArr = new Array(arr.length).fill("");
      this.pageData.tagArr = this.pageData.tagArr.concat(initArr);
      this.pageData.imgArr = this.pageData.imgArr.concat(initImgArr);
      this.pageData.dataList = this.pageData.dataList.concat(arr);
    },
    showModal() {
      let arr = this.pageData.dataList.map(item => item.merchantStrategyId);
      this.$refs.productModal.filterIds = arr;
      this.show = true;
    },
    delTagUrl() {
      this.pageData.tagUrl = "";
    },
    focus() {
      this.pageData.isFocus = true;
    },
    blur() {
      this.pageData.isFocus = false;
    },
    titleColorReset() {
      this.pageData.titleColor = "#413838";
    },
    backgroundColorReset() {
      this.pageData.backgroundColor = "#fff";
    },
    typeSelect(val) {
      this.pageData.type = val;
    },
    handleMaxSize() {},
    handleFormatError() {},
    del(index) {
      this.pageData.dataList.splice(index, 1);
    },
    delImg(index) {
      this.pageData.dataList[index].picAddr = "";
    },
    imgIndex(index) {
      this.activeIndex = index;
    },
    add() {
      this.pageData.dataList.push({
        picAddr: "",
        text: "",
        linkUrl: ""
      });
    }
  }
};
</script>
<style lang='scss'>
.strategy-edit-box {
  .img-edit-box {
    margin-top: 10px;
    .tag-up-box {
      display: inline-block;
      height: 60px;
      width: 100px;
      text-align: center;
      line-height: 60px;
      border: 1px solid #d9d9d9;
      .text {
        margin-left: 5px;
      }
    }
    .img-cover-box {
      height: 60px;
      width: 100px;
      position: relative;
      .tag-cover {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        text-align: center;
        line-height: 60px;
        .trash-icon {
          color: #fff;
          font-size: 20px;
          padding: 10px;
          cursor: pointer;
        }
      }
    }
    .img-cover-box:hover {
      .tag-cover {
        display: block;
      }
    }
  }
}
</style>

