<template>
  <div class="muti-photo-page">
    <div class="h5-p">
      <!-- <h2>H5拍照</h2> -->
      <input
        type="file"
        accept="image/*"
        :id="id"

        multiple="multiple"
        style="display:none"
        @change="fileChange"
        capture="user"
        value="上传"
      >
      <label class="change-label" :for="id">
        <slot></slot>
      </label>
    </div>
  </div>
</template>
<script>
// import { isWxAli } from "@/common/common";
export default {
  props: {
    maxNum: {
      type: Number,
      default: 10
    },
    maxSize: {
      type: Number,
      default: 2 * 1024 * 1024
    }
  },
  data() {
    return {
      // isWx: false,
      // isAli: false,
      id:'editor_' + Math.random().toString(16).slice(-6),
      qulity: [],
      imgArr: [],
      imgUrl: "",
      faceUrl: "",
      imgs: []
    };
  },
  created() {
    // let env = isWxAli();
    // this.isWx = env.isWx;
    // this.isAli = env.isAliPay;
  },
  methods: {
    getUrlBase64(url, i) {
      let _this = this;
      let canvas = document.createElement("canvas"); //创建canvas DOM元素
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        let h = img.height;
        let w = img.width;
        canvas.height = h/1.5; //指定画板的高度,自定义
        canvas.width = w/1.5; //指定画板的宽度，自定义
         // 在canvas绘制前填充白色背景
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, w/1.5, h/1.5); //参数可自定义
        console.log(i, _this.qulity[i]);
        let dataURL = canvas.toDataURL(
          "image/jpeg",
          parseFloat(_this.qulity[i])
        );
        // _this.imgUrl = dataURL;
        // console.log(this.imgUrl)
        // console.log(_this.qulity);
        // console.log(dataURL);
        _this.imgArr.push(dataURL);
        if (_this.imgArr.length == _this.upImgLength) {
          // console.log();
          _this.$emit("returnDataURL", _this.imgArr);
        }
      };
      img.src = url;
    },
    fileChange(e) {
      this.$Loading.start()
      let file = e.target.files || e.dataTransfer.files;
      //批量上传数量控制在10张
      this.upImgLength = file.length;

      if (this.upImgLength > this.maxNum) {
        this.$Message.warning(
          "照片批量上传，一次不能超过" + this.maxNum + "张"
        );
        return false;
      }

      //重置
      this.imgArr = [];

      //初始化this.qulity数组长度为图片张数及默认值为1
      this.qulity = Array.apply(null, Array(this.upImgLength)).map(() => 1);
      console.log(this.qulity);

      for (let i = 0; i < file.length; i++) {
        let imgfile = file[i];
        if(imgfile.size>10 * 1024 * 1024){
          this.$Message.warning("上传的第"+ (i+1) +"张图片大小能超过10M,不能上传")
          return false
        }
        if (imgfile.size > this.maxSize) {
          //图片大于2M
          console.log("大于2M");
          this.qulity[i] = (this.maxSize / imgfile.size).toFixed(5);
        }
        // console.log(this.qulity)
        let imgUrl = this.getObjectURL(imgfile);
        this.getUrlBase64(imgUrl, i);
        
      }
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    }
  }
};
</script>
<style lang='scss'>
.muti-photo-page {
  display:inline-block;
  cursor: pointer
}
</style>


