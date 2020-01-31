<template>
  <div v-if="data.dataList&&data.dataList.length" class="img-text-list">
    <draggable
      v-if="show"
      :list="data.list"
      @update="datadragEnd"
      :options="{animation:150}"
      :no-transition-on-drag="true"
    >
      <div v-for="(item,index) in data.dataList" :key="index" class="img-text-item clearfix">
        <div class="no-img-show fl">
          <img
            class="img"
            v-if="data.imgArr&&data.imgArr.length&&data.imgArr[index]"
            :src="data.imgArr[index]"
            alt
          />
          <template v-else>
            <img class="img" v-if="item.picAddr" :src="item.picAddr" alt />
            <span v-else>主图</span>
          </template>
          <div class="del-cover">
            <Icon
              class="trash-icon"
              v-if="data.imgArr&&data.imgArr.length&&data.imgArr[index]"
              @click="delImg(index)"
              type="ios-trash-outline"
            ></Icon>
            <img-upload :params="{index:index}" @getImgUrl="getImg" v-else>
              <span class="blue">更换图片</span>
            </img-upload>
          </div>
        </div>
        <div class="product-name fl clearfix">
          <!-- {{item.newlabelVoList}} -->
          <template v-if="item.newlabelVoList&&item.newlabelVoList.length">
            <span class>显示标签</span>
            <!-- {{data.tagArr[index]}} -->
            <CheckboxGroup @on-change="selectChange" v-model="data.tagArr[index]">
              <Checkbox v-for="(it,i) in item.newlabelVoList" :key="i" :label="it.labelName">
                <span>{{it.labelName}}</span>
              </Checkbox>
            </CheckboxGroup>
          </template>
          <span v-else>当前攻略暂无标签</span>
        </div>
        <div class="stragegy-close" @click="remove(index)">删除</div>
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
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: true
    };
  },
  methods: {
    selectChange(arr) {
      console.log(arr);
    },
    getImg(obj) {
      if (obj && obj.imgUrl && (obj.index || obj.index == 0)) {
        this.data.imgArr.splice(obj.index, 1, obj.imgUrl);
      } else {
        console.warn("图片上传或者index问题");
      }
    },
    datadragEnd(evt) {
      //位置调整
      evt.preventDefault();
      this.show = false;
      this.data.imgArr[evt.newIndex] = this.data.imgArr.splice(
        evt.oldIndex,
        1,
        this.data.imgArr[evt.newIndex]
      )[0];
      // if (this.data.imgArr && this.data.imgArr.length) {

      // }
      this.data.tagArr[evt.newIndex] = this.data.tagArr.splice(
        evt.oldIndex,
        1,
        this.data.tagArr[evt.newIndex]
      )[0];
      // if (this.data.tagArr && this.data.tagArr.length) {

      // }
      this.data.dataList[evt.newIndex] = this.data.dataList.splice(
        evt.oldIndex,
        1,
        this.data.dataList[evt.newIndex]
      )[0];

      this.$nextTick(() => {
        this.show = true;
      });
    },
    delImg(index) {
      this.data.imgArr.splice(index, 1, "");
    },
    remove(index) {
      this.data.dataList.splice(index, 1);
      if (this.data.imgArr && this.data.imgArr.length) {
        this.data.imgArr.splice(index, 1);
      }
      if (this.data.tagArr && this.data.tagArr.length) {
        this.data.tagArr.splice(index, 1);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.img-text-list {
  .img-text-item {
    position: relative;
  }
  .no-img-show {
    position: relative;
    display: inline-block;
    height: 75px;
    line-height: 75px;
    width: 75px;
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
  .stragegy-close {
    position: absolute;
    top: -1px;
    right: -1px;
    height: 87px;
    line-height: 87px;
    color: #fff;
    background: #2d8cf0;
    padding: 0 15px;
    cursor: pointer;
  }
  .product-name {
    margin-top: 7px;
    margin-left: 5px;
    display: inline-block;
    // height: 48px;
    width: 180px;

    .tag-bar {
      // width: 200px;
    }
    .product-name-content {
      height: 35px;
      width: 220px;
      vertical-align: middle;
      border: 1px solid #d7d7d7;
      display: inline-block;
      padding: 8px;
      position: relative;
      .name {
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }
      .remove {
        position: absolute;
        display: inline-block;
        height: 34px;
        width: 48px;
        line-height: 34px;
        text-align: center;
        background: #2d8cf0;
        right: 0px;
        top: 0px;
        color: #fff;
      }
    }
  }
}
</style>