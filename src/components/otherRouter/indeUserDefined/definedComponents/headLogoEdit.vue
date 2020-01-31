<template>
    <div class="component-name-list">
                <h3 class="component-title">图文logo编辑<span style="color:red;font-weight:200">（logo图片建议尺寸300X300px）</span></h3>
                 <div class="img-box">
                        <div class="cover-warper">
                          <template v-if='pageData.logoUrl'>
                             <img  style="width:100px;height:80px" :src="pageData.logoUrl" alt="">
                            <div class="del-cover">
                              <Icon @click="delImg" class="del-icon" type="ios-trash-outline"></Icon>
                            </div>
                          </template> 
                           <Icon class="icon-logo-img" v-else type="image"></Icon>
                        </div>
                        <div style="width:100px;">
                          <Upload
                                :format="['jpg','jpeg','png']"
                                :on-success="setImgUrl"
                                :show-upload-list="false"
                                :max-size="2048"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                action="/static/manage/uiFileUpload/dispatch?action=upload">
                                <Button @click="setIndex(index)" style="margin-top:5px" size="small" type="ghost">上传/更改</Button>
                            </Upload>
                        </div>
                    </div>
                    <div class="img-detail">
                      <div><span class="title">名称:</span><Input v-model='pageData.name' placeholder="请填写名称" class="content" ></Input></div>
                      <div><span class="title">名称及外框颜色:</span> <ColorPicker v-model="pageData.color" /></div>
                      <div><span class="title">简介:</span><Input v-model='pageData.intro' type="textarea"  placeholder="请填写简介" class="content"></Input></div>
                      <div><span class="title">客服电话:</span><Input v-model='pageData.tel' placeholder='请填写客户电话' style="width:calc(100% - 74px)" class="content"></Input></div>
                   
                    </div>
            </div>
</template>
<script>
export default {
  props: {
    index: {
      type: Number
    },
    pageData: {
      type: Object
    }
  },
  // computed:{
  //     imgList(){
  //         return this.data
  //     }
  // },
  data() {
    return {
      color1:'#19BE6B'
    };
  },
  mounted() {
    this.imgList = this.data;
  },
  watch: {
    pageData: {
      handler(val, oldVal) {
        // 深度监听，当值改变后，传真给上级组件
        // let _this = this
        // console.log(this.index)
        this.$emit("setHeadLogoUpData", this.index, val);
      },
      deep: true
    }
  },
  methods: {
    delImg() {
      this.pageData.logoUrl = "";
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件" + file.name + "的文件格式错误，请重新上传"
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
          picAddr: require("../../../../assets/images/login_bg.jpg"), //默认图片
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
        this.pageData.logoUrl = res.prefix + res.url;
        this.$Message.success("照片上传");
      } else {
        this.$Message.warning(res.message);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.icon-logo-img{
  color:#aaaaaa
}
.img-list {
  margin-bottom: 15px;
}
.cover-warper {
  .icon-logo-img{
    font-size: 90px;
  }
  height: 80px;
  width: 100px;
  position: relative;
  .del-cover {
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.6);
    .del-icon {
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      margin-top: 30px;
    }
  }
}
.cover-warper:hover {
  .del-cover {
    display: block;
  }
}
</style>

