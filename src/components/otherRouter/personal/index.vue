<template>
  <div class="personal-custompage-box">
    <div :style="{width:width}" class="clearfix handel-box">
      <!-- <Button type="primary">预览</Button> -->
      <Button style="margin-right:10px;" class="save" @click="save" type="info">保存</Button>
    </div>
    <div style="margin-bottom:15px">
      <div>个人中心说明:</div>
      <div>店铺的个人中心聚合了买家属性的各个栏目，通过设置各个栏目入口是否开启。（注：每次更改配置需提交微信小程序审核，审核通过后小程序端才可生效。）</div>
    </div>
    <div class="clearfix">
      <div class="fl navigation-custom-show custom-item">
        <div @click="showHeadEdit" class="page-top">
          <img class="top-img" src="../../../assets/images/top.jpg" alt>
          <div class="page-name">{{pageSetData.title}}</div>
          <div v-if="headShow" class="head-edit-box">
            <div class="head-edit-title">页面设置
              <Icon class="name-icon" type="ios-information-outline" size="14"></Icon>
            </div>
            <div class="head-edit-body">
              <table class="head-set">
                <tr>
                  <td class="title">页面名称</td>
                  <td>
                    <Input v-model="pageSetData.title" :maxlength="10" size="small"></Input>
                  </td>
                </tr>
                <tr>
                  <td class="title">页面描述</td>
                  <td>
                    <Input v-model="pageSetData.describe" size="small"></Input>
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align: top;" class="title">页面背景</td>
                  <td>
                    <!-- {{pageSetData}} -->
                    <RadioGroup
                      @on-change="backgroundTypeChange"
                      v-model="pageSetData.backgroundSet"
                    >
                      <Radio label="default">默认背景色</Radio>
                      <Radio label="userDefault">自定义背景色</Radio>
                    </RadioGroup>
                    <div v-if="pageSetData.backgroundSet=='userDefault'">
                      <ColorPicker v-model="pageSetData.color"/>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div
          @click="showContentEdit"
          :style="{'background':pageSetData.color}"
          class="page-content"
        >
          <div
            class="content-head"
            :style="{'background-image':contentData.imgUrl?('url(' + contentData.imgUrl + ')'):'','text-align':contentData.position}"
          >
            <img class="default-head" src="../../../assets/images/default-head.png" alt>
          </div>
          <div class="content-warper">
            <img src="../../../assets/images/default-navigation.png" alt>
            <img src="../../../assets/images/default-menu.png" alt>
          </div>
          <div v-if="contentShow" class="personal-custom-edit custom-item">
            <div class="title-text">个人中心</div>
            <div class="navigation-edit-content">
              <!-- {{contentData}} -->
              <!-- <div>导航最少需要2个导航项，最多支持5个导航项。上传图标最小支持50×50像素，建议使用150×150像素，支持类型：jpg、png</div> -->
              <table class="navigation-edit-table">
                <tr>
                  <td>背景图</td>
                  <td>
                    <div class="img-cover-box" v-if="contentData.imgUrl">
                      <img style="height:60px;width:100px;" :src="contentData.imgUrl" alt>
                      <div class="tag-cover">
                        <Icon class="trash-icon" @click="delImgUrl" type="ios-trash-outline"></Icon>
                      </div>
                    </div>
                    <div v-else class="img-up-box">
                      <Upload
                        :format="['jpg','jpeg','png']"
                        :on-success="setImgUrl"
                        :show-upload-list="false"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        action="/static/manage/uiFileUpload/dispatch?action=upload"
                      >
                        <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>
                        <span class="text">添加图片</span>
                      </Upload>
                    </div>
                    <p style="margin-top:5px">建议上传尺寸750X310px的图片</p>
                  </td>
                </tr>
                <tr>
                  <td>头像位置</td>
                  <td>
                    <RadioGroup v-model="contentData.position">
                      <Radio label="left">
                        <span>左</span>
                      </Radio>
                      <Radio label="center">
                        <span>中</span>
                      </Radio>
                      <Radio label="right">
                        <span>右</span>
                      </Radio>
                    </RadioGroup>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiPost, apiGet } from "@/fetch/api";
export default {
  data() {
    return {
      width: "",
      show: false,
      contentData: {
        imgUrl: "",
        position: "center"
      },
      headImgUrl:
        "url(" + require("../../../assets/images/default-background.png") + ")",
      contentShow: true,
      headShow: false,
      pageSetData: {
        color: "#f7f7f7",
        backgroundSet: "default",
        describe: "",
        title: "页面标题"
      }
    };
  },
  created() {
    this.show = false;
    if (this.$route.query && this.$route.query.id) {
      apiGet(
        "/merchant/webApi/merchantRenovationTob/getRenovationById?id=" +
          this.$route.query.id
      ).then(res => {
        // console.log(res)
        if (res.status == 200) {
          if (res.data.content) {
            let data = JSON.parse(res.data.content);
            // console.log(data);
            this.pageSetData = data.pageSetData
              ? data.pageSetData
              : {
                  color: "#f7f7f7",
                  backgroundSet: "default",
                  describe: "",
                  title: "页面标题"
                };
            this.contentData.imgUrl = data.contentData.imgUrl;
            this.contentData.position = data.contentData.position
              ? data.contentData.position
              : "center";
            if (data.contentData && !data.contentData.imgUrl) {
              apiGet(
                "/merchant/api/merchantAdvManage/findPicInfo?merchantInfoId=" +
                  localStorage.getItem("xjsc_merchantInfoId_2018_11_13_czc") +
                  "&adType=person_center_bg"
              ).then(res => {
                if (res.status == 200) {
                  if (res.data.personCenterBg&&res.data.personCenterBg[0].picAddr) {
                    this.oldImg = res.data.personCenterBg[0].picAddr;
                    this.contentData.imgUrl =
                      res.data.personCenterBg[0].picAddr;
                  } else {
                    this.contentData.imgUrl =
                      "http://statics.lotsmall.cn/wx/img/default-memberbg.jpg";
                  }
                }
              });
            } else {
              this.contentData.imgUrl = data.contentData.imgUrl;
            }
          }
        } else {
          this.$Message.warning(res.message);
        }
      });
    } else {
    }
  },
  mounted() {
    let _this = this;
    this.width = $("#app").width() - 220 + "px";
    $(window).resize(function() {
      _this.width = $("#app").width() - 220 + "px";
      // console.log(_this.width)
    });
  },
  methods: {
    delImgUrl() {
      this.contentData.imgUrl = "";
    },
    setImgUrl(res, file) {
      this.contentData.imgUrl = res.prefix + res.url;
    },
    backgroundTypeChange(val) {
      if (val == "default") {
        this.pageSetData.color = "#f7f7f7";
      }
    },
    showHeadEdit() {
      this.headShow = true;
      this.contentShow = false;
    },
    showContentEdit() {
      this.headShow = false;
      this.contentShow = true;
    },
    save() {
      apiPost("/merchant/webApi/merchantRenovationTob/saveRenovation", {
        id: this.$route.query.id,
        content: JSON.stringify({
          pageSetData: this.pageSetData,
          contentData: this.contentData
        }),
        pageType: "centerPage",
        pageName: this.pageSetData.title,
        pageDescribe: this.pageSetData.describe
      }).then(res => {
        this.$Message.success("保存成功!");
        this.$router.push("/shop-decorate");
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "图片超过2M",
        desc: "图片：" + file.name + "太大， 不能超过2M"
      });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件： " + file.name + "格式错误, 请选择图片格式jpg,png上传"
      });
    }
  }
};
</script>
<style lang='scss'>
.personal-custompage-box {
  padding-bottom: 50px;
  .handel-box {
    position: fixed;
    z-index: 99;
    bottom: 0px;
    text-align: center;
    // background: #ffffff;
    padding-bottom: 7px;
  }
  .customlink {
    padding-left: 5px;
    background: #cbcbcb;
    width: 135px;
    position: relative;

    .text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .customlink-del {
      position: absolute;
      font-size: 16px;
      color: #f05b47;
      padding: 5px;
      top: -12px;
      right: -10px;
      cursor: pointer;
    }
  }
  .custom-item {
    width: 375px;
    margin-right: 15px;
    .title-text {
      background: rgba(228, 228, 228, 1);
      font-size: 14px;
      height: 35px;
      padding-left: 10px;
      line-height: 35px;
    }
  }
  .navigation-custom-edit {
    border: 1px solid rgba(215, 215, 215, 1);
    .navigation-edit-content {
      padding: 10px;
      .navigation-edit-table {
        width: 100%;
        tr {
          td {
            padding: 5px 0;
          }
          td:first-child {
            width: 85px;
          }
        }
      }
      .navigation-ul {
        .navigation-li {
          padding: 5px;
          margin-bottom: 10px;
          border: 1px solid rgba(215, 215, 215, 1);
          position: relative;
          .navigation-li-del {
            position: absolute;
            top: -10px;
            right: -8px;
            font-size: 18px;
            color: #f05b47;
            cursor: pointer;
          }
          .navigation-li-left {
            padding: 7px 5px;
            .left-item {
              cursor: pointer;
              text-align: center;
              width: 75px;
              height: 75px;
              border: 1px solid rgba(215, 215, 215, 1);
              .img-box {
                height: 100%;
                width: 100%;
                position: relative;
                .left-item-img {
                  width: 100%;
                  height: 100%;
                }
                .cover {
                  display: none;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  left: 0;
                  top: 0;
                  background: rgba(0, 0, 0, 0.6);
                  .del-icon {
                    font-size: 20px;
                    color: #fff;
                    margin-top: 22px;
                    cursor: pointer;
                    padding: 5px;
                  }
                }
              }
              .img-box:hover {
                .cover {
                  display: block;
                }
              }
              .ivu-upload.upload-div {
                padding: 13px 0;
                .upload-text {
                  margin-top: 12px;
                  color: rgb(59, 180, 242);
                }
                .add-icon {
                  font-size: 16px;
                }
              }
            }
            .left-item:first-child {
              border-right: none;
            }
          }
          .navigation-li-right {
            width: 175px;
            .navigation-right-table {
              width: 100%;
              td {
                padding: 5px 0;
              }
              td:first-child {
                width: 30px;
              }
            }
          }
        }
        .navigation-li:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .navigation-custom-show {
    .page-top {
      height: 75px;
      position: relative;
      .top-img {
        width: 100%;
        height: 75px;
      }
      .page-name {
        position: absolute;
        width: 100%;
        left: 0;
        top: 34px;
        text-align: center;
        color: #fff;
        font-size: 20px;
      }
      .head-edit-box {
        position: absolute;
        left: 390px;
        top: 0;
        width: 375px;
        border: 1px solid #e4e4e4;
        .head-edit-title {
          background: #e4e4e4;
          font-size: 14px;
          height: 35px;
          padding-left: 10px;
          line-height: 35px;
        }
        .head-edit-body {
          padding: 10px;
          table.head-set {
            tr {
              td {
                padding: 5px 0;
              }
              td:first-child {
                width: 60px;
              }
            }
          }
        }
      }
    }
    .page-content {
      border-left: 1px solid rgba(215, 215, 215, 1);
      border-right: 1px solid rgba(215, 215, 215, 1);
      border-bottom: 1px solid rgba(215, 215, 215, 1);

      position: relative;
      .content-head {
        padding: 0 25px;
        height: 185px;
        background-size: 100% 100%;
        text-align: center;
        // .default-backgroundimg {
        //   width: 100%;
        //   height: 185px;
        // }
        .default-head {
          width: 70px;
          height: 70px;
          margin-top: 57.5px;
        }
      }
      .content-warper {
        img {
          width: 100%;
        }
      }
      .personal-custom-edit {
        border: 1px solid rgba(215, 215, 215, 1);
        position: absolute;
        top: 0;
        left: 390px;
        .navigation-edit-content {
          padding: 10px;
          .navigation-edit-table {
            width: 100%;
            tr {
              td {
                padding: 5px 0;
                .img-up-box {
                  display: inline-block;
                  height: 60px;
                  width: 100px;
                  text-align: center;
                  line-height: 60px;
                  border: 1px solid #d9d9d9;
                  .text {
                    margin-left: 5px;
                  }
                }
                .img-cover-box {
                  height: 60px;
                  width: 100px;
                  position: relative;
                  .tag-cover {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    text-align: center;
                    line-height: 60px;
                    .trash-icon {
                      color: #fff;
                      font-size: 20px;
                      padding: 10px;
                      cursor: pointer;
                    }
                  }
                }
                .img-cover-box:hover {
                  .tag-cover {
                    display: block;
                  }
                }
              }
              td:first-child {
                width: 60px;
              }
            }
          }
          .navigation-ul {
            .navigation-li {
              padding: 5px;
              margin-bottom: 10px;
              border: 1px solid rgba(215, 215, 215, 1);
              position: relative;
              .navigation-li-del {
                position: absolute;
                top: -10px;
                right: -8px;
                font-size: 18px;
                color: #f05b47;
                cursor: pointer;
              }
              .navigation-li-left {
                padding: 7px 5px;
                .left-item {
                  cursor: pointer;
                  text-align: center;
                  width: 75px;
                  height: 75px;
                  border: 1px solid rgba(215, 215, 215, 1);
                  .img-box {
                    height: 100%;
                    width: 100%;
                    position: relative;
                    .left-item-img {
                      width: 100%;
                      height: 100%;
                    }
                    .cover {
                      display: none;
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      left: 0;
                      top: 0;
                      background: rgba(0, 0, 0, 0.6);
                      .del-icon {
                        font-size: 20px;
                        color: #fff;
                        margin-top: 22px;
                        cursor: pointer;
                        padding: 5px;
                      }
                    }
                  }
                  .img-box:hover {
                    .cover {
                      display: block;
                    }
                  }
                  .ivu-upload.upload-div {
                    padding: 13px 0;
                    .upload-text {
                      margin-top: 12px;
                      color: rgb(59, 180, 242);
                    }
                    .add-icon {
                      font-size: 16px;
                    }
                  }
                }
                .left-item:first-child {
                  border-right: none;
                }
              }
              .navigation-li-right {
                width: 175px;
                .navigation-right-table {
                  width: 100%;
                  td {
                    padding: 5px 0;
                  }
                  td:first-child {
                    width: 30px;
                  }
                }
              }
            }
            .navigation-li:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    .bottom-navigation-box {
      border: 1px solid rgba(215, 215, 215, 1);
      .bottom-navigation-item {
        padding: 10px 5px;
        float: left;
        text-align: center;
        cursor: pointer;
        .default-img {
          height: 40px;
          width: 40px;
        }
        .navigation-text {
          font-size: 12px;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .item-icon {
          font-size: 30px;
        }
      }
    }
    .no-list {
      border-bottom: 0;
      border-left: 0;
      border-right: 0;
    }
  }
  .page-range {
    border: 1px solid rgba(215, 215, 215, 1);
    height: 500px;

    .page-range-item {
      padding: 10px;
      .ivu-checkbox-wrapper.ivu-checkbox-group-item {
        width: 30%;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
