<template>
  <div class="layer-show-box">
    <div class="layer-show-content">
      <div class="layer-img-box" v-if="data.picAddr">
        <img class="img"
             :src="data.picAddr"
             ref="img"
             :style="imgStyle"
             @load="loadImage">
      </div>
      <div v-else class="layer-img-box layer-noimg-box">
        <img class="no-img" src="../../../../assets/images/bannertype2.png" alt>
        <div class="no-text">请在右侧添加你需要的图片</div>
      </div>
      <div class="layer-close-box">
        <span @click.prevent.stop="close">X</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions} from 'vuex'
export default {
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      weekDay: '',
      imgStyle: {
        marginTop: ''
      }
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    ...mapActions('defined', [
      'setEditIndex',
      'setShowLayer'
    ]),
    close () {
      this.setShowLayer(false)
      // $('.my-layer-box').addClass('hide')
      this.setEditIndex(null)
    },
    // 图片加载完成时
    loadImage () {
      // 图片高度过高，截取头部图片
      this.$nextTick(() => { this.resetImgPosition() })
    },
    // 图片高度过高，截取头部图片
    // 图片高度过高，截取头部图片
    resetImgPosition () {
      if (this.$refs.img) {
        let imgh = this.$refs.img.offsetHeight
        let maxH = 500
        if (imgh > maxH) {
          this.imgStyle.marginTop = -(imgh - maxH) + 'px'
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .my-layer-box{
    position: absolute;
    top: 0;
    /*padding-top:50%;*/
    background-color: rgba(0,0,0,.5);
    z-index: 999;
    height: 100%;
    min-height: 600px;
    box-sizing: border-box;
  }
  .my-layer-box .component-content{
    position: absolute;
    height: 100%;
    top: 100px;
  }
  .my-layer-box .right{
    width: unset!important;
  }
  .my-layer-box.hide{
    display: none;
  }
  .layer-show-box {
    padding: 10px;
    .layer-show-content{
      /*border-radius: 10px;*/
      overflow: hidden;
    }
    .layer-img-box {
      text-align: center;
      margin: 0 auto;
      width: 325px;
      border-radius: 10px;
      overflow: hidden;
      .img{
        width: 100%;
        border-radius: 10px;
      }
      .no-img {
        /*border-radius: 10px;*/
        width: 174px;
        height: 101px;
        margin-top: 30px;
        margin-right: 21px;
      }
      .no-text{
        font-size: 13px;
        color: #999;
        margin-top: 6px;
      }
    }
    .layer-noimg-box{
      padding: 10px 0;
      background-color: #fff;
      border-radius: 10px;
    }
    .layer-close-box{
      margin-top: 10px;
      text-align: center;
      font-size: 23px;
      /*background-color:#fff;*/
      color: #fff;
    }
  }
</style>
