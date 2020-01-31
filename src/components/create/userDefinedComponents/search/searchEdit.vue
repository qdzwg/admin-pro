<template>
  <div class="search-edit-box">
    <!-- {{pageData}} -->
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>
          模板样式
        </td>
        <td>
          <div class="banner-type-select">
            <Col span="8">
            <div @click="typeSelect('search1')" class="type-item clearfix" :class='{active:pageData.type=="search1"}'>
              <div class="type-item-box">直角</div>
              <!-- <img @click="typeSelect('search1')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
            </div>
            </Col>
            <Col span="8">
            <div @click="typeSelect('search2')" class="type-item clearfix" :class='{active:pageData.type=="search2"}'>
              <div class="type-item-box">圆角</div>
              <!-- <img @click="typeSelect('search2')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
            </div>
            </Col>
          </div>
        </td>
      </tr>
      <tr>
        <td class="title">搜索提示</td>
        <td>
          <Input v-model='pageData.placeholder' :maxlength="15" size='small'></Input>
        </td>
      </tr>
      <tr>
        <td class="title">文本颜色</td>
        <td>
          <ColorPicker v-model="pageData.textColor" />
          <Input v-model="pageData.textColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="textColorReset" type="primary" size='small'>重置</Button>
        </td>
      </tr>
      <tr>
        <td class="title">文本位置</td>
        <td>
          <RadioGroup v-model="pageData.position">
            <Radio label="left">居左</Radio>
            <Radio label="center">居中</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">搜索高度</td>
        <td class="clearfix">
          <div class="slide-box">
            <Slider :min='28' :max='40' v-model="pageData.height" show-input></Slider>
          </div>
          <span class="silde-unit">px</span>
        </td>
      </tr>
      <tr>
        <td class="title">搜索热词</td>
        <td>
          <div style="margin-bottom:5px" v-for='(item,index) in pageData.hostWordList' :key='index' class="hot-word-list">
            <Input v-model='item.hotWord' placeholder="最多15个字" :maxlength="15" size='small'>
            <Button @click="hotWordDel(index)" slot="append" icon="trash-a"></Button>
            </Input>
          </div>
          <Button @click="hotWordAdd" style="margin-top:5px;" icon="plus" size='small' type="primary">添加热词</Button>
        </td>
      </tr>
      <tr>
        <td class="title">边框颜色</td>
        <td>
          <ColorPicker v-model="pageData.borderColor" />
          <Input v-model="pageData.borderColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="borderColorReset" type="primary" size='small'>重置</Button>
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
      activeIndex: null, //需要设置图片的下标
      // pageData: this.data,
      disabledGroup: "fill",
      typeList: [
        {
          businessType: "ticket",
          name: "景区门票"
        },
        {
          businessType: "hotel",
          name: "酒店"
        },
        {
          businessType: "shop",
          name: "特色商品"
        },
        {
          businessType: "strategy",
          name: "游玩攻略"
        },
        {
          businessType: "route",
          name: "跟团游"
        },
        {
          businessType: "repast",
          name: "餐饮"
        }
      ]
    };
  },
  methods: {
    hotWordAdd() {
      this.pageData.hostWordList.push({ hotWord: "" });
    },
    hotWordDel(index) {
      this.pageData.hostWordList.splice(index, 1);
    },
    // multipleChange(arr) {
    //   let filterArr = this.typeList.filter((item, index) => {
    //     return arr.indexOf(item.businessType) > -1;
    //   });
    //   this.pageData.searchDetailList = filterArr;
    // },
    textColorReset() {
      this.pageData.textColor = "#413838";
    },
    borderColorReset() {
      this.pageData.borderColor = "#cbcbcb";
    },
    backgroundColorReset() {
      this.pageData.backgroundColor = "#fff";
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
.search-edit-box {
  .hot-word-list {
    .ivu-icon.ivu-icon-trash-a {
      font-size: 14px;
      color: #999;
    }
  }
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

