<template>
  <div class="component-name-list">
    <h3 class="component-title">图文导航编辑{{guide}}<span v-if='navigationType == "Nav__normal"' style="color:red">【此组件需成对出现】</span></h3>
    <draggable v-model="dataList">
      <div v-for="(item,index) in dataList" :key="index" class="img-list">

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
            <span class="title">标题：</span>
            <Input style="width:calc(100% - 53px)" v-model="item.title" class="content"></Input>
          </div>
          <div v-if="!item.picAddr">
            <span class="title">icon颜色：</span>
            <ColorPicker v-model="item.iconColor" />
          </div>
          <div style='margin-bottom:8px'>
            <span class="title">导航类型选择：</span>
            <Select v-model="item.businessType" style="width:200px">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div v-if='navigationType=="Nav__normal"'>
            <!-- 只有这种类型才需要展示副标题 -->
            <span class="title">副标题：</span>
            <Input style="width:calc(100% - 65px)" v-model="item.subtitle" class="content"></Input>
          </div>
          <div>
            <span class="title">背景色：</span>
            <ColorPicker v-model="item.bgColor" />
          </div>
          <div>
            <span class="title">手动输入背景色：</span>
            <Input style="width:calc(100% - 113px)" v-model="item.bgColor" class="content"></Input>
            <p style="color:red">手动输入格式:rgb(57, 114, 174)或者#17E8E1</p>
          </div>
        </div>
        <Icon @click="del(index)" class="img-delete" type="close-circled"></Icon>
      </div>
    </draggable>

    <div v-if='navigationType == "Nav__normal2"'>
      <div v-if="dataList.length<5" class="img-add-btn-box">
        <Button @click="add">点击增加一个图文导航，
          <span style="color:red">导航图建议尺寸100*100px</span>
        </Button>
      </div>
    </div>
    <div v-else>
      <div v-if="dataList.length<6" class="img-add-btn-box">
        <Button @click="add">点击增加一个图文导航，
          <span style="color:red">导航图建议尺寸100*100px</span>
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { apiGet } from "@/fetch/api";
export default {
  props: {
    index: {
      type: Number
    },
    navigationData: {
      type: Array
    },
    navigationType: {
      type: String
    }
  },
  mounted() {
    this.dataList = this.navigationData;
  },
  data() {
    return {
      guide:false,
      imgIndex: null,
      dataList: [],
      iconData: {
        ticket: "icon-nav-ticket",
        hotel: "icon-nav-hotel",
        shop: "icon-nav-goods",
        strategy: "icon-nav-raiders",
        route: "icon-nav-tours",
        repast: "icon-nav-foods",
        publicServer: "icon-new1"
      },
      typeList: [
        {
          value: "ticket",
          label: "景区门票"
        },
        {
          value: "hotel",
          label: "酒店"
        },
        {
          value: "shop",
          label: "特色商品"
        },
        {
          value: "strategy",
          label: "游玩攻略"
        },
        {
          value: "route",
          label: "跟团游"
        },
        {
          value: "repast",
          label: "餐饮"
        },
        {
          value: "publicServer",
          label: "公共服务"
        }
      ]
    };
  },
  watch: {
    dataList: {
      handler(val, oldVal) {
        val.forEach(ele => {
          ele.icon = this.iconData[ele.businessType];
        });
        this.$emit("setNavigationData", this.index, val);
      },
      deep: true
    },
    navigationData: {
      handler(val) {
        this.dataList = val;
      },
      deep: true
    }
  },
  created() {
    apiGet(
      "/marketing/api/market/selectServiceUse?merchantInfoId=" +
        window.localStorage.getItem("xjsc_merchantInfoId_2018_11_13_czc") +
        "&serviceType=guide"
    ).then(res => {
      if(!res.data['guide']){
        this.typeList.splice(6,1)
      }
    });
  },
  methods: {
    delImg(index) {
      this.dataList[index].picAddr = "";
    },
    changeIcon(val) {
      console.log(val);
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
      if (this.navigationType == "Nav__normal") {
        this.dataList.push(
          {
            picAddr: "", //默认图片
            icon: "icon-nav-ticket",
            iconColor: "#fff",
            title: "默认名称",
            businessType: "ticket",
            subtitle: "副标题",
            bgColor: "rgb(57, 114, 174)"
          },
          {
            picAddr: "", //默认图片
            icon: "icon-nav-ticket",
            iconColor: "#fff",
            title: "默认名称",
            businessType: "ticket",
            subtitle: "副标题",
            bgColor: "rgb(57, 114, 174)"
          }
        );
      } else {
        this.dataList.push({
          picAddr: "", //默认图片
          icon: "icon-nav-ticket",
          iconColor: "#fff",
          title: "默认名称",
          businessType: "ticket",
          subtitle: "副标题",
          bgColor: "rgb(57, 114, 174)"
        });
      }
    },
    del(index) {
      if (this.navigationType == "Nav__normal") {
        if (index == 0 || index == 1) {
          this.dataList.splice(0, 2);
        } else {
          this.dataList.splice(2, 2);
        }
      } else {
        this.dataList.splice(index, 1);
      }

      // this.dataList.splice(index, 1);
      this.$Message.success("图文导航删除成功");
    },
    setIndex(index) {
      this.imgIndex = index;
    },
    setImgUrl(res, file, fileList) {
      // console.log(res)
      if (res.state === "SUCCESS") {
        this.dataList[this.imgIndex].picAddr = res.prefix + res.url;
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
.img-box {
  width: 100px;
}
.img-list {
  margin-bottom: 15px;
}

.defaultImg {
  color: #aaa;
  font-size: 45px;
  padding: 5px;
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
.up-btn {
  margin-top: 5px;
}
</style>

