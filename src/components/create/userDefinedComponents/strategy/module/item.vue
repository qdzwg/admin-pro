<template>
  <div
    class="item"
    :class="{'side-item':type=='sideslip','sigle-item':type=='singleRow','biserial-item':type=='biserial','demo-item':demo}"
  >
    <!-- {{pageData}} -->
    <!-- {{data}} -->
    <div class="img-bar">
      <img class="p-img" :src="showImg" alt />
      <!-- <tag-list :arr="tagArr"></tag-list> -->
    </div>
    <div class="item-box">
      <div class="item-info">      
        <div class="title" :class="{'demo-title':demo}">
          <tag-list-song :arr="tagArr"></tag-list-song>
          {{pageData.name}}
        </div>
        <div v-if="!demo" class="user">
          <!-- <template v-if="data.showText=='name'">
            <img class="head-img" v-if="pageData.headImg" :src="pageData.headImg" alt />
          </template>
          <img class="head-img" v-else :src="timeUrl" alt /> -->
          <img class="head-img" v-if="data.showText!='name'" :src="timeUrl" alt />
          <span class="name">{{data.showText=='name'?pageData.nickName:formatterTime(pageData.createTime)}}</span>
        </div>
        <div v-else class="user-demo">
          <div class="demo-img"></div>
          <span class="demo-name"></span>
        </div>
      </div>
      <div class="more-circle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    
  </div>
</template>
<script>
// import tagList from "./tagList";
import tagListSong from "./tagListSong";
export default {
  components: {
    // tagList
    tagListSong
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    demo: {
      type: Boolean,
      default: false
    },
    tagArr: {
      type: Array,
      default: () => []
    },
    imgSrc: {
      type: String,
      default: ""
    },
    itemData: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: "sideslip"
    }
  },
  computed: {
    showTime() {
      let time = "";
      if (this.pageData.createTime) {
        let date = new Date(this.pageData.createTime);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        time = year + "年" + month + "月" + day + "日";
      }
      return time;
    },
    showImg() {
      return this.imgUrl
        ? this.imgUrl
        : this.pageData.picAddr
        ? this.pageData.picAddr
        : "";
    }
  },
  methods: {
    formatterTime(time) {
      if (time) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        return year + "年" + month + "月" + day + "日";
      } else {
        return "";
      }
    }
  },
  watch: {
    imgSrc(val) {
      this.imgUrl = val;
    },
    itemData(val) {
      this.pageData = val;
    }
  },
  data() {
    return {
      timeUrl: require("@/assets/images/time.png"),
      imgUrl: this.imgSrc,
      pageData: this.itemData
    };
  }
};
</script>
<style lang="scss" scoped>
.item {
  &.demo-item {
  }
  .img-bar {
    .tag {
      color: #fff;
      font-size: 10px;
    }
  }
  .item-box{
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; 
    .item-info {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      flex: 6;
      .title {
        font-size: 14px;
        color: #333;
        font-weight: bold;
      }
      .user {
        font-size: 10px;
        color: #999;
      }      
    }
    .more-circle{
      // position: absolute;
      // top: 25px;
      // right: 15px;
      flex: 1;
      span{
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #e9e9e9;
        margin: 0 1px;
      }
    }
  }
  
}
.strategy-page {
  .biserial-item {
    &:nth-child(2n) {
      margin-left: 10px;
    }
  }
}
.biserial-item {
  width: calc(50% - 5px);
  float: left;
  // background: #fff;
  margin-bottom: 10px;
  .img-bar {
    height: 100px;
    .p-img {
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
  }
  .item-info {
    height: 85px;
    padding-top: 12px;
    .user {
      padding-left: 10px;
    }
    .title {
      margin-bottom: 10px;
      padding: 0 10px;
      word-break: break-all;
      height: 35px;
      line-height: 18px;
      display: -webkit-box;
      /* ! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
      &.demo-title {
        background: #f9f9f9;
        height: 22px;
        line-height: 22px;
      }
    }
    .user-demo {
      .demo-img {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #f9f9f9;
        display: inline-block;
      }
      .demo-name {
        display: inline-block;
        height: 20px;
        width: 78px;
        background: #f9f9f9;
      }
    }
  }
}
.side-item {
  width: 130px;
  float: left;
  .img-bar {
    height: 80px;
    .t-l {
      left: -16px;
      top: 2px;
    }
    .tag {
      height: 20px;
      line-height: 20px;
      width: 56px;
    }
  }
  .item-info {
    .title {
      margin-top: 10px;
    }
  }
}

.sigle-item {
  float: none;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  margin-bottom: 10px;
  .img-bar {
    height: 140px;
    .p-img {
      border-bottom-right-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }
  .item-info {
    // height: 65px;
    background: #fff;
    // padding-top: 10px;
    padding: 10px 0;
    .title {
      // margin-bottom: 8px;
      margin-bottom: 5px;
      padding: 0 10px;
      -webkit-line-clamp: 1;
      &.demo-title {
        background: #f9f9f9;
        height: 22px;
        line-height: 22px;
      }
    }
    .user {
      padding: 0 5px;
      // margin-bottom: 10px;
      .name {
        display: inline-block;
      }
    }
    .user-demo {
      .demo-img {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #f9f9f9;
        display: inline-block;
      }
      .demo-name {
        display: inline-block;
        height: 20px;
        width: 78px;
        background: #f9f9f9;
      }
    }
  }
}
.list-bar {
  .sigle-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>