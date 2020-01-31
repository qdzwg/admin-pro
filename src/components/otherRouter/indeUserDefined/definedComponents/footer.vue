<template>
  <div class="footer p-t-30">
    <div class="handler">
      <Button size="small" @click="del" type="error">删除</Button>
      <Button size="small" @click="footerEdit" type="primary">编辑</Button>
    </div>
    <Row :style="{background:footerListData.bgColor}" v-if="footerListData.list.length">
      <Col v-for="(item,index) in footerListData.list" :key="index" :span="24/footerListData.list.length">
      <div  class="tab-item" @click="selectIndex = index" :style="{background:selectIndex == index?footerListData.selectColor:''}">
        <img v-if="item.picAddr" class="tab-img" :src="item.picAddr" alt="">
        <div style="height:35px;" v-else>
          <i class="icon iconfont footer-icon xx-icon" :class="item.icon"></i>
        </div>

        <span class="tab-title">{{item.name}}</span>
      </div>
      </Col>
    </Row>
    <Row v-else class="no-footer-list">
      <Col span="24"> 请编辑底部菜单，导航图建议尺寸100*100px
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    footerListData: {
      type: Object,
      default:{
        list:[]
      }
    }
  },
  computed: {
    // imgList(){
    //     return this.data
    // }
  },
  // watch:{
  //     data(val){
  //         this.imgList.splice(0, this.imgList.length,val)
  //     }
  // },
  data() {
    return {
      bgColor: "red",
      selectIndex:null
    };
  },
  methods: {
    del(index) {
      this.$emit("footerDel");
    },
    footerEdit(index) {
      this.$emit("showFooterEdit");
      this.$store.dispatch("setIndex", index);
    }
  }
};
</script>
<style scoped lang="scss">
.footer {
  z-index: 99;
  position: relative;
  bottom: 0px;
  width: 373px;
  .footer-icon {
    font-size: 24px;
    display: inline-block;
    color: #fff;
    margin-bottom: 1px;
  }
  .tab-item {
    // padding-top: 8px;
    text-align: center;
    .tab-img {
      width: 24px;
      height: 24px;
      margin-top: 6px;
    }
    .tab-title {
      display: block;
      font-size: 13px;
      color: #ffffff;
      padding-bottom: 8px;
    }
  }
  .handler {
    position: absolute;
    top: 3px;
    right: 8px;
  }
  .no-footer-list {
    height: 61px;
    background: #aaaaaa;
    font-size: 16px;
    text-align: center;
    line-height: 61px;
  }
}
</style>
