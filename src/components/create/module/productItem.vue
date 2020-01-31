<template>
  <div v-if="list.length" class="img-text-list">
    <draggable
      v-if="show"
      @update="datadragEnd"
      :options="{animation:150}"
      :no-transition-on-drag="true"
    >
      <div v-for="(it,i) in list" :key="i" class="img-text-item clearfix">
        <!-- {{itemdata.textTagList[i]}} -->
        <div class="no-img-show fl">
          <img
            class="img"
            v-if="itemdata.imgArr&&itemdata.imgArr.length&&itemdata.imgArr[i]"
            :src="itemdata.imgArr[i]"
            alt
          />
          <template v-else>
            <img class="img" v-if="it.linkMobileImg" :src="it.linkMobileImg" alt />
            <span v-else>主图</span>
          </template>
          <div class="del-cover">
            <Icon
              class="trash-icon"
              v-if="itemdata.imgArr&&itemdata.imgArr.length&&itemdata.imgArr[i]"
              @click="delImg(i)"
              type="ios-trash-outline"
            ></Icon>
            <img-upload :params="{index:i}" @getImgUrl="getImg" v-else>
              <span class="blue">更换</span>
            </img-upload>
          </div>
          <!-- <img-upload :params="{index:i}" @getImgUrl="getImg">
            <span class="blue">更换图片</span>
          </img-upload>-->
        </div>
        <!-- <img class="product-img" src="../../../../assets/images/bannertype2.png" alt=""> -->
        <div class="product-name fl">
          <div class="product-name-content">
            <div class="content-bar">
              <div class="name">{{it.nickName}}</div>
              <div>
                <span>文字标签：</span>
                <Input
                  :maxlength="5"
                  v-model.trim="itemdata.textTagList[i].tagTitle"
                  size="small"
                  style="width:100px"
                  placeholder="请填写标签名称"
                ></Input>
              </div>
              <div>
                <RadioGroup v-model="itemdata.textTagList[i].tagType">
                  <Radio label="type1">
                    <span>样式1</span>
                  </Radio>
                  <!-- <Radio label="type1">
                    <span>样式2</span>
                  </Radio>
                  <Radio label="type1">
                    <span>样式3</span>
                  </Radio>-->
                </RadioGroup>
              </div>
            </div>
          </div>
          <div @click="remove(i)" class="remove">
            <span class="remove-text">移除</span>
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import imgUpload from "./imgUpload";
export default {
  components: {
    draggable,
    imgUpload
  },
  props: {
    itemdata: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    list: {
      get() {
        if (this.itemdata.data && this.itemdata.data instanceof Array) {
          return this.itemdata.data;
        } else {
          return this.itemdata.list;
        }
      },
      set(val) {
        if (this.itemdata.data && this.itemdata.data instanceof Array) {
          this.itemdata.data = val;
        } else {
          this.itemdata.list = val;
        }
      }
    }
  },
  data() {
    return {
      show: true
    };
  },
  methods: {
    selectChange(arr) {},
    getImg(obj) {
      if (obj && obj.imgUrl && (obj.index || obj.index == 0)) {
        if (!(this.itemdata.imgArr instanceof Array)) {
          this.$set(this.itemdata, "imgArr", []);
        }
        this.itemdata.imgArr.splice(obj.index, 1, obj.imgUrl);
      } else {
        console.warn("图片上传或者index问题");
      }
    },
    delImg(index) {
      this.itemdata.imgArr.splice(index, 1, "");
    },
    datadragEnd(evt) {
      //位置调整
      evt.preventDefault();
      this.show = false;
      this.itemdata.imgArr[evt.newIndex] = this.itemdata.imgArr.splice(
        evt.oldIndex,
        1,
        this.itemdata.imgArr[evt.newIndex]
      )[0];
      this.itemdata.textTagList[evt.newIndex] = this.itemdata.textTagList.splice(
        evt.oldIndex,
        1,
        this.itemdata.textTagList[evt.newIndex]
      )[0];

      this.list[evt.newIndex] = this.list.splice(
        evt.oldIndex,
        1,
        this.list[evt.newIndex]
      )[0];

      this.$nextTick(() => {
        this.show = true;
      });
    },
    remove(index) {
      this.list.splice(index, 1);
      if (this.itemdata.imgArr && this.itemdata.imgArr.length) {
        this.itemdata.imgArr.splice(index, 1);
      }
      if (this.itemdata.textTagList && this.itemdata.textTagList.length) {
        this.itemdata.textTagList.splice(index, 1);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.img-text-list {
  .product-name {
    // margin-top: 7px;
    margin-left: 48px;
    display: inline-block;
    // height: 48px;
    .product-name-content {
      // height: 35px;
      width: 190px;
      vertical-align: middle;
      // border: 1px solid #d7d7d7;
      display: inline-block;
      padding: 0 8px;
      position: relative;
      .content-bar {
        width: 170px;
      }
      .name {
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }
    }
  }
  .img-text-item {
    position: relative;
    .remove {
      cursor: pointer;
      position: absolute;
      display: inline-block;
      height: 100%;
      line-height: 1;
      width: 48px;
      line-height: 34px;
      text-align: center;
      background: #2d8cf0;
      right: 0px;
      top: 0px;
      color: #fff;
      .remove-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .no-img-show {
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translate(0, -50%);
    display: inline-block;
    height: 48px;
    line-height: 48px;
    width: 48px;
    background-color: rgba(215, 215, 215, 1);
    text-align: center;
    &:hover {
      .del-cover {
        display: block;
      }
    }
    .img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
