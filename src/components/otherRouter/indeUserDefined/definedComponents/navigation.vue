<template>
  <div class="navigation-warper p-t-30">
    <div class="banner-handler">
      <Button size="small" @click="del(index)" type="error">删除</Button>
      <Button size="small" @click="navigationEdit(index)" type="primary">编辑</Button>
    </div>
    <template v-if="navigationList.length">
      <Row v-if="styleTpye=='Nav__normal'">
        <template v-for="(item,index) in navigationList">
          <Col v-if="index==0" span="15">
          <div :style="{background:item.bgColor}" class="navigation-item1 navigation-item m-r-10 p-l-20">
            <navigation-info :data="item"></navigation-info>
          </div>
          </Col>
          <Col v-if="index==1" span="9">
          <div :style="{background:item.bgColor}" class="navigation-item2 navigation-item fiexed-text p-l-8">
            <navigation-info :data="item"></navigation-info>
          </div>
          </Col>
          <Col v-if="index==2" span="12">
          <div :style="{background:item.bgColor}" class="navigation-item3 navigation-item m-r-5 p-l-10">
            <navigation-info :data="item"></navigation-info>
          </div>
          </Col>
          <Col v-if="index==3" span="12">
          <div :style="{background:item.bgColor}" class="navigation-item4 navigation-item m-l-5 p-l-10">
            <navigation-info :data="item"></navigation-info>
          </div>
          </Col>
           <Col v-if="index==4" span="15">
          <div :style="{background:item.bgColor}" class="navigation-item5 navigation-item m-r-10 p-l-20">
            <navigation-info :data="item"></navigation-info>
          </div>
          </Col>
          <Col v-if="index==5" span="9">
          <div :style="{background:item.bgColor}" class="navigation-item6 navigation-item fiexed-text p-l-8">
            <navigation-info :data="item"></navigation-info>
          </div>
          </Col>
        </template>
      </Row>
      <Row v-if="styleTpye=='Nav__normal2'" class="navagation-style-2">
        <Col v-for="(item,index) in navigationList" :key='index' :span="24/navigationList.length">
        <div class="navigation-item">
          <div :style='{background:item.bgColor}' class="navigaiton-item-content" v-if="item.picAddr">
            <img :src="item.picAddr" alt="">
          </div>
          <i :style="{background:item.bgColor,color:item.iconColor}" v-else class="icon iconfont item-icon xx-icon" :class="item.icon"></i>
          <div class="title">{{item.title}}</div>
        </div>
        </Col>
      </Row>
    </template>

    <Row v-else>
      <Col span="24">
      <div class="no-data">
        请编辑图文导航，导航图建议尺寸100x100px
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import navigationInfo from "./navigationInfo";
export default {
  components: {
    navigationInfo
  },
  props: {
    index: {
      type: Number
    },
    navigationList: {
      type: Array
    },
    styleTpye: {
      type: String
    }
  },
  mounted() {},
  computed: {},
  data() {
    return {
      bgColor: "red"
    };
  },
  methods: {
    del(index) {
      this.$emit("delteCom", index);
    },
    navigationEdit(index) {
      this.$emit("showNavigationEdit", index);
      this.$store.dispatch("setIndex", index);
    }
  }
};
</script>
<style scoped lang="scss">
.navigation-warper {
  padding-left: 10px;
  padding-right: 10px;
}
.navigation-item {
  border-radius: 3px;
  margin-bottom: 9px;
  padding: 10px 0px;
  //   overflow: hidden;
  height: 87px;
  .navigation-item-img {
    width: 35px;
    height: 35px;
    float: left;
    margin-top: 15px;
  }
  .navigation-item-info {
    margin-top: 7px;
    float: left;
    color: #ffffff;
    margin-left: 5px;
    .title {
      font-size: 16px;
      margin-bottom: 4px;
    }
    .text {
      font-size: 11px;
    }
  }
}
.navigation-item1 {
  .title {
    width: 100px;
    text-align: center;
  }
}
.p-l-20 {
  padding-left: 20px !important;
}
.p-l-8 {
  padding-left: 8px !important;
}
.p-l-10 {
  padding-left: 10px !important;
}
.fiexed-text {
  .text {
    width: 80px;
  }
  .title {
    max-width: 80px;
  }
}
.m-l-5 {
  margin-left: 4px;
}
.m-r-5 {
  margin-right: 4px;
}
.m-l-8{
   margin-left: 8px; 
}
.m-r-10 {
  margin-right: 8px;
}
.img-l-20 {
  margin-left: 20px;
}
.img-l-10 {
  margin-left: 10px;
}
.img-l-8 {
  margin-left: 8px;
}
.no-data {
  height: 200px;
  background: #cccccc;
  text-align: center;
  font-size: 18px;
  padding-top: 80px;
}
.navagation-style-2 {
    display:flex;
    justify-content: space-around;
  .navigation-item {
    text-align: center;
    margin-bottom: 12px;
    .navigaiton-item-content {
      display: inline-block;
      padding: 8px;
      padding-top: 9px;
      border-radius: 50%;
      // background: red;
      img {
        width: 31px;
        height: 30px;
        vertical-align: middle;
      }
    }

    .title {
      height: 30px;
      line-height: 30px;
      font-size: 13px;
      color: #666;
    }
    .item-icon {
      font-size: 35px;
      padding: 6px;
      border-radius: 50%;
      color: #000;
      background: red;
    }
  }
}
</style>
