<template>
  <div class="title-show-box">
    <!-- {{data}} -->
    <template v-if="data.position != 'right'">
      <div
        class="title-box"
        :style="{ background: data.backgroundColor, color: data.titleColor }"
      >
        <div
          v-if="data.navigationName"
          class="navigation-name navigation-style"
        >
          <span :style="{marginRight: data.ifIconColor=='T' ? '5px' : '0'}" style="color:#999">{{ data.navigationName }}</span>
          <!-- <img v-if="data.navigationNamePic" :src="data.navigationNamePic" />
          <i v-else class="xx-icon icon-iconfont-jiantou navigation-arrow"></i> -->
          <span v-if="data.ifIconColor=='T'" class="icon-bg" :style="{backgroundColor: data.nameBgColor ? data.nameBgColor : ''}">
            <i class="xx-icon icon-iconfont-jiantou navigation-arrow" :style="{color: data.nameColor}"></i>
          </span>
          <i v-else class="xx-icon icon-iconfont-jiantou navigation-arrow"></i>
        </div>
        <div
          class="main-title title-background"
          v-if="data.titlePic"
          :style="{
            'text-align': data.position,
            'font-size': data.titleFontSize + 'px',
            color: data.titleColor
          }"
          :class="{ 'have-title': data.title }"
        >
          <img :src="data.titlePic" />
        </div>
        <div
          class="main-title title-background"
          v-else
          :style="{
            'text-align': data.position,
            'font-size': data.titleFontSize + 'px',
            color: data.titleColor
          }"
          :class="{ 'have-title': data.title }"
        >
          {{ data.title ? data.title : "点击设置主标题" }}
        </div>
        <div
          v-if="data.subtitle || data.isFocus"
          :style="{ 'text-align': data.position }"
          :class="{ 'have-title': data.subtitle }"
          class="sub-title title-background"
        >
          {{ data.subtitle ? data.subtitle : "点击设置副标题" }}
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="title-box clearfix"
        :style="{ background: data.backgroundColor, color: data.titleColor }"
      >
        <div
          v-if="data.navigationName"
          class="navigation-style fr"
          :style="{ height: height + 'px', 'line-height': height + 'px' }"
        >
          <span>{{ data.navigationName }}</span>
          <!-- <img v-if="data.navigationNamePic" :src="data.navigationNamePic" />
          <i v-else class="xx-icon icon-iconfont-jiantou navigation-arrow"></i> -->
          <i class="xx-icon icon-iconfont-jiantou navigation-arrow"></i>
        </div>
        <div class="right-content fr">
          <div
            class="main-title right-main-title title-background"
            v-if="data.titlePic"
            :style="{
              'text-align': data.position,
              'font-size': data.titleFontSize + 'px'
            }"
            :class="{ 'have-title': data.title }"
          >
            <img :src="data.titlePic" />
          </div>
          <div
            class="main-title right-main-title title-background"
            v-else
            :style="{
              'text-align': data.position,
              'font-size': data.titleFontSize + 'px'
            }"
            :class="{ 'have-title': data.title }"
          >
            {{ data.title ? data.title : "点击设置主标题" }}
          </div>
          <div
            style="max-width:267px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
            v-if="data.subtitle || data.isFocus"
            :style="{ 'text-align': data.position }"
            :class="{ 'have-title': data.subtitle }"
            class="sub-title title-background"
          >
            {{ data.subtitle ? data.subtitle : "点击设置副标题" }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  watch: {
    navigationName() {
      this.getWidth();
    },
    title() {
      this.getWidth();
    },
    subTitle() {
      this.getWidth();
    },
    titleFontSize() {
      this.getWidth();
    },
    position() {
      this.getWidth();
    },
    isFocus(val) {
      this.getWidth();
    }
  },
  computed: {
    isFocus() {
      return this.data.isFocus;
    },
    position() {
      return this.data.position;
    },
    navigationName() {
      return this.data.navigationName;
    },
    title() {
      return this.data.title;
    },
    subTitle() {
      return this.data.subtitle;
    },
    titleFontSize() {
      return this.data.titleFontSize;
    }
  },
  data() {
    return {
      height: null,
      defaultImgList: [
        //默认图片
        {
          url: require("../../../../assets/images/login_bg.jpg")
        },
        {
          url: require("../../../../assets/images/login_bg.jpg")
        },
        {
          url: require("../../../../assets/images/login_bg.jpg")
        }
      ]
    };
  },
  mounted() {
    this.getWidth();
  },
  methods: {
    getWidth() {
      if (this.data.position == "right") {
        setTimeout(() => {
          this.height = $(".right-content").height();
          //  console.log();
        }, 150);
      }
    }
  }
};
</script>
<style lang="scss">
.title-show-box {
  .right-content {
    position: relative;
    padding-right: 10px;
  }
  .title-box {
    position: relative;
    padding: 15px 12px;
    .navigation-name {
      position: absolute;
      top: 50%;
      margin-top: -9px;
      right: 12px;
    }
    .navigation-style {
      color: #5c5c5c;
      .icon-bg{
        border-radius: 50%;
        display: inline-block;
        width: 15px;
        height: 15px;
        text-align: center;
        line-height: 15px;
      }
      .navigation-arrow {
        font-size: 12px;
        color: #999;
      }
      img {
        height: 12px;
      }
    }
    .main-title {
      img {
        // width: 20px;
        width: 100px;
        height: 30px;
        vertical-align: middle;
        display: inline-block;
      }
      span {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .main-title.right-main-title {
      // height: 24px;
      // line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 267px;
    }
    .title-background {
      padding: 0 10px;
      background: #f9f9f9;
      color: #999;
      font-size: 12px;
      // height: 24px;
      // line-height: 24px;
      border-radius: 4px;
    }
    .sub-title {
      margin-top: 10px;
      height: 17px;
      line-height: 17px;
    }
    .have-title {
      color: #413838;
      overflow: hidden;
      background: transparent;
      img {
        // height: 18px;
      }
    }
  }
  .set-notice {
    text-align: center;
    height: 100px;
    line-height: 100px;
    font-size: 16px;
    background: #cccccc;
  }
}
</style>
