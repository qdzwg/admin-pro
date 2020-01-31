<template>
    <div class="component-name-list">
                <h3 class="component-title">{{bannerType=='Banner__swiper1'?'轮播图':'腰部广告'}}编辑</h3>
                 <draggable v-model="imgList">
                  <div v-for="(item,index) in imgList" :key="index" class="img-list">
                    <div class="img-box">
                        <img style="width:100px" v-if='item.picAddr'  :src="item.picAddr" alt="">
                        <img style="width:100px" v-else src="../../../../assets/images/default.jpg" alt="">
                        <div>
                          <Upload
                                :format="['jpg','jpeg','png']"
                                :on-success="setImgUrl"
                                :show-upload-list="false"
                                :max-size="2048"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                action="/static/manage/uiFileUpload/dispatch?action=upload">
                                <Button @click="setIndex(index)" size="small" type="ghost">上传/更改</Button>
                            </Upload>
                        </div>
                    </div>
                    <div class="img-detail">
                      <div><span class="title">标题:</span><Input v-model="item.title" class="content" ></Input></div>
                      <div><span class="title">链接:</span><Input  v-model="item.picLink" class="content"></Input></div>
                    </div>
                    <Icon @click="deletImg(index)" class="img-delete" type="close-circled"></Icon>
                  </div>
                  </draggable>
                  <div v-if="imgList.length<5" class="img-add-btn-box">
                    <Button @click="addImg">点击增加一个{{bannerType=='Banner__swiper1'?'轮播图':'腰部广告'}}，<span style="color:red">{{bannerType=='Banner__swiper1'?'轮播图':'腰部广告'}}建议尺寸{{bannerType=='Banner__swiper1'?'640*310px':'640*110px'}}</span></Button>
                  </div>
            </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  props: {
    bannerType:{
      type:String
    },
    index: {
      type: Number
    },
    data: {
      type: Array
    }
  },
  // computed:{
  //     imgList(){
  //         return this.data
  //     }
  // },
  data() {
    return {
      imgIndex: null,
      imgList: []
    };
  },
  mounted() {
    this.imgList = this.data;
  },
  watch: {
    imgList: {
      handler(val, oldVal) {
        // 深度监听，当值改变后，传真给上级组件
        // let _this = this
        // console.log(this.index)
        this.$emit("setImgData", this.index, val);
      },
      deep: true
    },
    data: {
      handler(val, oldVal) {
        this.imgList = this.data;
      },
      deep: true
    }
  },
  methods: {
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc:
          "文件" +
          file.name +
          "的文件格式错误，请重新上传"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "文件  " + file.name + "太大,不能超过2M"
      });
    },
    addImg() {
      if (this.imgList.length < 5) {
        this.imgList.push({
          picAddr:'', //默认图片
          title: "",
          picLink: ""
        });
      } else {
        this.$Message.warning("最多上传5张图片!");
        // this.$Message.warning('This is a warning tip');
      }
    },
    deletImg(index) {
      this.imgList.splice(index, 1);
      this.$Message.success("照片删除成功");
    },
    setIndex(index) {
      this.imgIndex = index;
    },
    setImgUrl(res, file, fileList) {
      // console.log(res)
      if (res.state === "SUCCESS") {
        this.imgList[this.imgIndex].picAddr = res.prefix + res.url;
        this.$Message.success("照片上传");
      } else {
        this.$Message.warning(res.message);
      }
    }
  },
  components: {
    draggable
  }
};
</script>
<style scope lang="scss">
.img-list {
  margin-bottom: 15px;
}
</style>

