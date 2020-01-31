<template>
  <div class="search-show-box">
    <!-- {{data}} -->
    <div class="search-input" :class="{'circle-border':data.type=='search2'}" :style="{border:'1px solid'+ data.borderColor,'background-color':data.backgroundColor}">
      <input :style='{background:data.backgroundColor,height:data.height+"px","text-align":data.position,color:data.textColor}' class="input-text" type="text" :placeholder="data.placeholder?data.placeholder:'请输入您要搜索的产品'">
      <Icon class="search-icon" type="ios-search-strong"></Icon>
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
  .search-show-box {
    padding: 10px 15px;
    .set-notice {
      text-align: center;
      height: 100px;
      line-height: 100px;
      font-size: 16px;
      background: #cccccc;
    } // .search-input {
    //   input {
    //     border: none;
    //   }
    // }
    .search-input {
      padding: 1px 0;
      background: #ffffff;
      border: 1px solid #cbcbcb;
      padding-left: 16px;
      padding-right: 25px;
      position: relative;
      .select-box {
        width: 63px;
        height: 33px;
        position: relative;
        display: inline-block;
        cursor: pointer;
        .select-content {
          text-align: right;
          height: 33px;
          line-height: 33px;
          font-size: 14px;
          color: #413838;
          .text {
            margin-right: 6px;
          }
        }
        .arrow-svg {
          transition: all 0.2s;
        }
        .active-svg {
          transform: rotate(90deg);
          -moz-transform: rotate(90deg);
          /* Firefox 4 */
          -webkit-transform: rotate(90deg);
          /* Safari and Chrome */
          -o-transform: rotate(90deg);
          /* Opera */
        }
        .select-list {
          position: absolute;
          top: 39px;
          left: 0;
          background: #fff;
          width: 70px;
          z-index: 999;
          border: 1px solid #e9e8e8;
          .select-item {
            font-size: 14px;
            color: #413838;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            text-align: center;
            border-bottom: 1px solid #e9e8e8;
          }
          .select-item:last-child {
            border-bottom: none;
          }
        }
        .slide-fade-enter-active {
          transition: all 0.5s ease;
        }
        .slide-fade-leave-active {
          transition: all 0.8s;
        }
        .slide-fade-enter,
        .slide-fade-leave-to {
          transform: translateX(10px); // height: 0;
          // height: auto;
          opacity: 0; // height: 0px;
        }
        .slide-fade-enter-to {
          height: auto;
        }
      }
      .input-text::-webkit-input-placeholder {
        color: #999;
        font-size: 14px;
        text-align: center;
      }
      .input-text:-moz-placeholder {
        color: #999;
        font-size: 14px;
        text-align: center;
      }
      .input-text:-ms-input-placeholder {
        color: #999;
        font-size: 14px;
        text-align: center;
      }
      .input-text {
        color: #413838;
        outline: none;
        border: 0px;
        font-size: 14px;
        padding-left: 5px; // height: 33px;
        width: 100%;
      }
      .search-icon {
        // float: right;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -10px;
        font-size: 20px;
        color: #999;
        margin-right: 7px;
        cursor: pointer;
      }
    }
    .circle-border {
      border-radius: 22px;
    }
  }
</style>
