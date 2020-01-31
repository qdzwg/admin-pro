<template>
  <div class="strategy-page" :class="{'white-bg':data.dataList.length==0}">
    <!-- {{comData}} -->
    <template v-if="data.dataList.length">
      <div v-if="listType=='sideslip'" class="warper">
        <div class="list-bar clearfix slip-warper" :style="{width:sideWidth}">
          <item
            v-for="(item,index) in data.dataList"
            :key="index"
            :data="comData"
            type="sideslip"
            :itemData="item"
            :imgSrc="data.imgArr[index]"
          ></item>
        </div>
      </div>
      <!-- 单列 -->
      <div v-if="listType=='singleRow'" class="warper">
        <div class="list-bar clearfix single-warper">
          <item
            v-for="(item,index) in data.dataList"
            :key="index"
            :data="comData"
            type="singleRow"
            :itemData="item"
            :tagArr="formatterTagList(item,data.tagArr[index])"
            :imgSrc="data.imgArr[index]"
          ></item>
        </div>
      </div>
      <!-- 双列 -->
      <div v-if="listType=='biserial'" class="warper">
        <div class="list-bar clearfix row-warper">
          <item
            v-for="(item,index) in data.dataList"
            :key="index"
            :data="comData"
            type="biserial"
            :itemData="item"
            :tagArr="formatterTagList(item,data.tagArr[index])"
            :imgSrc="data.imgArr[index]"
          ></item>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- <div v-if="listType=='sideslip'" class="warper">
        <div class="list-bar clearfix slip-warper" :style="{width:sideWidth}">
          <item
            v-for="(item,index) in data.dataList"
            :key="index"
            type="sideslip"
            :itemData="item"
            :imgSrc="data.imgArr[index]"
          ></item>
        </div>
      </div>-->
      <!-- 单列 -->
      <div v-if="listType=='singleRow'" class="warper singleRow-no-data">
        <div class="list-bar clearfix single-warper">
          <item
            v-for="(item,index) in demoDataList"
            :demo="true"
            :key="index"
            type="singleRow"
            :itemData="item"
            :tagArr="data.tagArr[index]"
            :imgSrc="demoImg"
          ></item>
        </div>
      </div>
      <!-- 双列 -->
      <div v-if="listType=='biserial'" class="warper singleRow-no-data">
        <div class="list-bar clearfix row-warper">
          <item
            v-for="(item,index) in demoDataList"
            :demo="true"
            :key="index"
            type="biserial"
            :itemData="item"
            :tagArr="data.tagArr[index]"
            :imgSrc="demoImg"
          ></item>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import item from "./module/item";
export default {
  data() {
    return {
      demoImg: require("../../../../assets/images/bannertype2.png"),
      demoDataList: [
        {
          name: "名称",
          showText: "name"
        },
        {
          name: "名称",
          showText: "name"
        }
      ]
    };
  },
  components: {
    item
  },
  computed: {
    sideWidth() {
      let length = this.data.dataList.length;
      return length > 0 ? length * 140 + "px" : "1000px";
    }
  },
  props: {
    comData: {
      type: Object,
      default: () => {}
    },
    listType: {
      type: String
    },
    data: {
      type: Object
    }
  },
  methods: {
    formatterTagList(itemData, arr) {
      // console.log(itemData, arr);
      let tagList = [];
      if (itemData.newlabelVoList && itemData.newlabelVoList.length) {
        tagList = itemData.newlabelVoList.filter(
          item => arr.indexOf(item.labelName) > -1
        );
      }
      return tagList;
    }
  }
};
</script>
<style lang="scss">
.strategy-page {
  padding: 0 12.5px;
  &.white-bg {
    background: #fff;
  }
  .singleRow-no-data {
    .row-warper {
      .biserial-item {
        .img-bar {
          text-align: center;
          img.p-img {
            width: 106px;
            height: 56.5px;
            margin-right: 13px;
            margin-top: 48px;
            display: inline-block;
          }
        }
      }
    }
    .single-warper {
      .sigle-item {
        .img-bar {
          text-align: center;
          img.p-img {
            width: 174px;
            height: 93px;
            margin-right: 21px;
            margin-top: 20px;
            display: inline-block;
          }
        }
      }
    }
  }
  .slip-warper {
    .item {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .warper {
    overflow-x: hidden;
    .list-bar {
      .item {
        .item-info {
          background: #fff;
          .user {
            .head-img {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              margin-right: 3px;
              display: inline-block;
              vertical-align: middle;
            }
          }
          .title {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            word-break: break-all;
          }
        }
        .img-bar {
          width: 100%;
          position: relative;
          overflow: hidden;
          .p-img {
            height: 100%;
            width: 100%;
            display: block;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>