<template>
  <div class="address-phone-box" :style='{background:data.backgroundColor,}'>
    <!-- {{data}} -->
    <div class="address-phone">
      <div class="address-icon" v-if="data.phonePosition==='right'"><span class="icon-phone-span"><i class='xx-icon icon-dingwei'></i></span></div>
      <div class="phone-block" v-if="data.phonePosition==='left'" :style='{background:data.phoneBackgroundColor,}'>
        <i style="font-size:18px;width:20px;height:20px;" class='xx-icon icon-contact'></i>
      </div>
      <div class="address-block" :style='{border:"1px solid"+ data.borderColor,"text-align":data.textPosition,color:data.textColor}'>
        <div class="address-text">{{data.text}}</div>  
      </div>
      <div class="address-icon" v-if="data.phonePosition==='left'"><span class="icon-phone-span"><i class='xx-icon icon-dingwei'></i></span></div>
      <div class="phone-block" v-if="data.phonePosition==='right'" :style='{background:data.phoneBackgroundColor,}'>
        <i style="font-size:18px;width:20px;height:20px;" class='xx-icon icon-contact'></i>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        type: Object
      }
    },
    // watch: {
    //   comSearchDetailList: {
    //     handler(val, oldVal) {
    //       this.showItemStr = "";
    //     },
    //     deep: true
    //   }
    // },
    // computed: {
    //   comSearchDetailList() {
    //     return this.data.searchDetailList;
    //   }
    // },
    data() {
      return {
        show: false,
        showItemStr: ""
      };
    },
    methods: {
      // showList() {
      //   if (this.data.searchDetailList && this.data.searchDetailList.length) {
      //     this.show = !this.show;
      //   } else {
      //     this.$Message.info("请添加搜索内容");
      //   }
      // },
      // itemSelect(str) {
      //   this.show = false;
      //   this.showItemStr = str;
      // }
    }
  };
</script>
<style lang="scss">
  .address-phone-box {
    padding: 10px 15px;
    .address-phone {
      display: flex;
      .address-icon {
        font-size: 14px;
        height: 40px;
        width: 40px;
        text-align: center;
        color: #ff7628;
        .icon-phone-span {
          display: inline-block;
          background-color: #F1F1F1;
          height: 30px;
          margin-top: 5px;
          line-height: 30px;
          border-radius: 50%;
          width: 30px;
        }
      }
      .address-block {
        flex-grow: 1;
        height: 40px;
        padding: 0px 10px;
        display: flex;
        align-items: center;
        div {
          flex-grow: 1;
        }
      }
      .phone-block {
        width: 40px;
        color: #fff;
        text-align: center;
        flex-shrink: 0;
        height: 40px;
        line-height: 40px;
      }
    }
  }
</style>
