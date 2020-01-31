<template>
  <div class="shopinfo-edit-box">
    <!-- {{data}} -->
    <table class="edit-table">
      <tr>
        <td class='title'>
          <span class="red">*</span>
          店铺名称
        </td>
        <td>
          <Input :maxlength="12" :class="{'error':!pageData.name&&errorShow}" v-model="pageData.name" placeholder="请填写店铺名称"></Input>
        </td>
      </tr>
      <tr>
        <td class="title">
          字体颜色
        </td>
        <td>
          <ColorPicker v-model="pageData.textColor" />
          <Input v-model="pageData.textColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="textColorReset" type="primary" size='small'>重置</Button>
        </td>
      </tr>
      <tr>
        <td class="title">
          店铺简介
        </td>
        <td>
          <Input :maxlength="40" v-model="pageData.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入简介"></Input>
        </td>
      </tr>
      <tr>
        <td class="title">
          服务电话
        </td>
        <td>
          <Input :class="{'error':!correct}" v-model="pageData.tel" placeholder="请输入电话"></Input>
          <p v-if='correct' style="margin-top:5px;">请输入手机号码,400电话或者座机号码</p>
          <p v-else style="margin-top:5px;color:red">输入电话号码格式错误</p>
        </td>
      </tr>
      <tr>
        <td class="title">
          店铺logo
        </td>
        <td>
          <div class='shop-info-img'>
            <template v-if='pageData.logoUrl'>
              <img class="img-show" :src="pageData.logoUrl" alt="">
              <div class="cover-del">
                <Icon @click="logoUrlDel" class="del-svg" type="ios-trash-outline"></Icon>
              </div>
            </template>
            <Upload v-else class="img-up" :class="{'error':errorShow&&!pageData.logoUrl}" :format="['jpg','jpeg','png']" :on-success="setImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload">
              <Icon class="add-icon" type="ios-plus-outline" size='14'></Icon>
            </Upload>
          </div>
        </td>
      </tr>
      <tr>
        <td class="title">店招背景</td>
        <td>
          <div class='shop-info-img'>
            <template v-if='pageData.backUrl'>
              <img class="img-show" :src="pageData.backUrl" alt="">
              <div class="cover-del">
                <Icon @click="backUrlDel" class="del-svg" type="ios-trash-outline"></Icon>
              </div>
            </template>
            <Upload v-else class="img-up" :format="['jpg','jpeg','png']" :on-success="backImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload">
              <Icon class="add-icon" type="ios-plus-outline" size='14'></Icon>
            </Upload>
          </div>
          <div>
            <!-- <Upload class="" :format="['jpg','jpeg','png']" :on-success="backImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload">
              <Icon class="add-icon" type="ios-plus-outline" color='#3BB4F2' size='14'></Icon>
            </Upload> -->
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
// import draggable from "vuedraggable";
import { mapState } from "vuex";
export default {
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  watch: {
    tel(val) {
      if (val) {
        var regu = /(^1([0-9]{10})$)|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/
        var re = new RegExp(regu);
        this.correct = re.test(val);
      } else {
        this.correct = true;
      }
    }
  },
  computed: {
    tel() {
      return this.pageData.tel;
    },
    pageData() {
      return this.list2[this.index].data;
    },
    ...mapState({
      list2: state => {
        //   console.log(state)
        return state.defined.list;
      },
      errorShow: state => {
        return state.defined.errorShow;
      }
    })
  },
  data() {
    return {
      correct: true
      // pageData: this.data
    };
  },
  methods: {
    logoUrlDel() {
      this.pageData.logoUrl = "";
    },
    backUrlDel() {
      this.pageData.backUrl = "";
    },
    handleMaxSize (file) {
                this.$Notice.warning({
                    title: '图片超过2M',
                    desc: '图片：' + file.name + '太大， 不能超过2M'
                });
            },
    handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式错误',
                    desc: '文件： ' + file.name + '格式错误, 请选择图片格式jpg,png上传'
                });
            },
    setImgUrl(res, file) {
      this.pageData.logoUrl = res.prefix + res.url;
    },
    backImgUrl(res, file) {
      this.pageData.backUrl = res.prefix + res.url;
    },
    textColorReset() {
      //线条颜色重置为#999
      this.pageData.textColor = "#999";
    }
  }
};
</script>
<style lang='scss'>
.shopinfo-edit-box {
  .shop-info-img {
    height: 75px;
    width: 75px;
    // border: 1px solid red;
    position: relative;
    .img-up {
      border: 1px solid #d7d7d7;
      height: 75px;
      width: 75px;
      text-align: center;
      line-height: 75px;
      color: #3BB4F2;
      cursor: pointer;
      .ivu-upload.ivu-upload-select {
        width: 100%;
      }
    }
    .img-up.error{
      border-color: red;
      color: red;
    }
    .img-show {
      width: 100%;
      height: 100%;
    }
    .cover-del {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      text-align: center;
      // line-height: 75px;
      .del-svg {
        color: #fff;
        font-size: 24px;
        padding: 10px;
        cursor: pointer;
        margin-top: 14px;
      }
    }
  }
  .shop-info-img:hover .cover-del {
    display: block;
  }
}
</style>

