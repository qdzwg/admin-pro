<template>
  <div class="search-edit-box">
    <!-- {{pageData}} -->
    <table class="edit-table">
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
      <tr>
        <td class="title">文字</td>
        <td>
          <div class="edit-text-position">
            <Input v-model='pageData.text' placeholder="最多15个字" style="margin-right: 10px;" :maxlength="15" size='small'>
            </Input>
            <Button @click="getPosition" type="primary" size='small'>获取坐标</Button>
          </div>
        </td>
      </tr>
      <tr>
        <td class="title">文字位置</td>
        <td>
          <RadioGroup v-model="pageData.textPosition">
            <Radio label="left">左</Radio>
            <Radio label="center">中</Radio>
            <Radio label="right">右</Radio>
          </RadioGroup>
        </td>
      </tr>
      <tr>
        <td class="title">电话</td>
        <td>
          <Input v-model='pageData.phone' :maxlength="15" size='small'></Input>
        </td>
      </tr>
      <tr>
        <td class="title">电话位置</td>
        <td>
          <RadioGroup v-model="pageData.phonePosition">
            <Radio label="left">左</Radio>
            <Radio label="right">右</Radio>
          </RadioGroup>
        </td>
      </tr>
    </table>
    <amap ref="mapModel" @getPoint="getPoint"></amap>
  </div>
</template>
<script>
import { mapState } from "vuex";
import amap from '@/components/global/amap'
export default {
  components: {
    amap
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
    getPoint(point) {
      this.pageData.position = point.lat + "," + point.lng;
    },
    getPosition() {
      this.$refs.mapModel.modal = true;
    },
    textColorReset() {
      this.pageData.textColor = "#413838";
    },
    borderColorReset() {
      this.pageData.borderColor = "#cbcbcb";
    },
    backgroundColorReset() {
      this.pageData.backgroundColor = "#fff";
    }
  }
};
</script>
<style lang='scss'>
.search-edit-box {
  .edit-text-position {
    display: flex;
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

