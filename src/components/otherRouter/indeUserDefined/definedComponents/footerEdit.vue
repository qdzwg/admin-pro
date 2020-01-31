<template>
  <div class="component-name-list">
    <!-- <i class="icon iconfont icon-nav-raiders"></i>
      <i class="icon iconfont icon-nav-ticket"></i> -->
    <h3 class="component-title">底部菜单编辑</h3>
    <div class="default-box">
      <div>
        <span class="title">背景色：</span>
        <ColorPicker v-model="footerData.bgColor" />
      </div>
      <div>
        <span class="title">手动输入背景色：</span>
        <Input style="width:calc(100% - 113px);padding-bottom:0px" v-model="footerData.bgColor" class="content"></Input>
        <p style="color:red">手动输入格式:rgb(57, 114, 174)或者#17E8E1</p>
      </div>
      <div style="height:15px;"></div>
      <div>
        <span class="title">选中背景色：</span>
        <ColorPicker v-model="footerData.selectColor" />
      </div>
      <div>
        <span class="title">手动输入选中背景色：</span>
        <Input style="width:calc(100% - 133px)" v-model="footerData.selectColor" class="content"></Input>
        <p style="color:red">手动输入格式:rgb(57, 114, 174)或者#17E8E1</p>
      </div>
    </div>
    <draggable v-model="dataList.list">
      <div v-for="(item,index) in dataList.list" :key="index" class="img-list">
        <div class="img-box">
          <div v-if="item.picAddr" class="img-icon-warper">
            <img style="width:100px" :src="item.picAddr" alt="">
            <div class="del-cover">
              <Icon @click="delImg(index)" class="del-icon" type="ios-trash-outline"></Icon>
            </div>
          </div>
          <Icon v-else class="defaultImg" type="image"></Icon>
          <div>
            <Upload :format="['jpg','jpeg','png']" :on-success="setImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload">
              <Button @click="setIndex(index)" class="up-btn" size="small" type="ghost">上传/更改</Button>
            </Upload>
          </div>
        </div>
        <div class="img-detail">
          <div>
            <span class="title">名称：</span>
            <Input v-model="item.name" class="content"></Input>
          </div>
          <!-- <div><span class="title">链接选择：</span><Input v-model="item.link" class="content" ></Input></div> -->
          <div>
            <span class="title">链接选择：</span>
            <Select class="content" v-model="item.linkType" style="width:200px">
              <Option v-for="item in footerList" :value="item.key" :key="item.key">{{ item.value }}</Option>
            </Select>
          </div>
          <!-- <div>
            <span class="title">背景色：</span>
            <ColorPicker v-model="item.bgColor" />
          </div>
          <div>
            <span class="title">手动输入背景色：</span>
            <Input style="width:calc(100% - 113px)" v-model="item.bgColor" class="content"></Input>
            <p style="color:red">手动输入格式:rgb(57, 114, 174)或者#17E8E1</p>
          </div> -->
        </div>
        <Icon @click="del(index)" class="img-delete" type="close-circled"></Icon>
      </div>
    </draggable>
    <div v-if="dataList.list&&dataList.list.length<4" class="img-add-btn-box">
      <Button @click="add">点击增加一个底部菜单，
        <span style="color:red">导航图建议尺寸100*100px</span>
      </Button>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { apiPostJson } from "@/fetch/api";
import axios from "axios";
export default {
  props: {
    footerData: {
      type: Object,
      default: {
        list: []
      }
    }
  },
  created() {
    apiPostJson("/admin/sysparam/findSysParamList", {
      types: ["bottomMenu"]
    }).then(res => {
      this.footerList = res.data.bottomMenu;
      // console.log(this.footerList);
    });
  },
  mounted() {
    // console.log(this.footerData);
    this.dataList = this.footerData;
  },
  data() {
    return {
      bgColor: "#17E8E1",
      imgIndex: null,
      dataList: [],
      footerList: [],
      iconData: {
        "/": "icon-nav-home",
        "/list/order": "icon-nav-orders",
        "/member": "icon-member",
        "/group/orderList": "icon-shopping-car"
      }
    };
  },
  watch: {
    dataList: {
      handler(val, oldVal) {
        val.list.forEach((element, index) => {
          val.list[index].icon = this.iconData[element.linkType];
        });
        // console.log(val);
        this.$emit("setFooterData", val);
      },
      deep: true
    },
    footerData: {
      handler(val) {
        // console.log(val);
        this.dataList = val;
      },
      deep: true
    }
  },
  methods: {
    delImg(index) {
      this.dataList.list[index].picAddr = "";
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
    add() {
      this.dataList.list.push({
        picAddr: "", //默认图片
        name: "默认名称",
        linkType: "/",
        icon: "",
        bgColor: "rgb(57, 114, 174)"
      });
    },
    del(index) {
      this.dataList.list.splice(index, 1);
      this.$Message.success("菜单删除成功");
    },
    setIndex(index) {
      this.imgIndex = index;
    },
    setImgUrl(res, file, fileList) {
      // console.log(res)
      if (res.state === "SUCCESS") {
        this.dataList.list[this.imgIndex].picAddr = res.prefix + res.url;
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
<style scoped lang="scss">
// @import "../../../../assets/styles/font/iconfont.css";
@import "../../../../assets/styles/font/iconfont.css";
.default-box {
  margin-bottom: 15px;
  .content {
    padding: 10px;
  }
}
.img-list {
  margin-bottom: 15px;
  padding-bottom: 15px;
}
.img-icon-warper {
  position: relative;
  width: 100px;
  height: 57px;
  .del-cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    .del-icon {
      font-size: 20px;
      padding: 6px;
      cursor: pointer;
      color: #ffffff;
      margin-top: 13px;
    }
  }
}
.img-icon-warper:hover {
  .del-cover {
    display: block;
  }
}
.defaultImg {
  color: #aaa;
  font-size: 45px;
  padding: 5px;
}
.img-box {
  width: 100px;
}
.up-btn {
  margin-top: 5px;
}
</style>

