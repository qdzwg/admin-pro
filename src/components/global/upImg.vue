<template>
  <div>
    <template v-if="uploadList.length">
      <div
        class="demo-upload-list"
        v-for="(item, index) in uploadList"
        :key="index"
      >
        <img :src="item" />
        <div class="demo-upload-list-cover" v-if="editFlag">
          <Icon
            type="ios-trash-outline"
            @click.native="handleRemove(index)"
          ></Icon>
        </div>
      </div>
    </template>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :on-exceeded-size="handleMaxSize"
      :format="['jpg', 'jpeg', 'png']"
      :max-size="2048"
      type="drag"
      action="/admin/api/ui/uplode"
      style="display: inline-block;width:58px;"
      v-if="uploadList.length !== limitNum && editFlag"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    limitNum: {
      type: Number,
      default: 9
    },
    editFlag: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  data() {
    return {
      uploadList: []
    };
  },
  watch: {
    value: {
      handler: function(val) {
        let uploadList = val ? val.split(",") : [];
        this.uploadList = uploadList;
      },
      immediate: true
    }
  },
  methods: {
    handleRemove(index) {
      this.uploadList.splice(index, 1);
      this.$emit("input", this.uploadList.join(","));
    },
    handleSuccess(res, file) {
      if (res.status == 200) {
        this.uploadList.push(res.message);
        this.$emit("input", this.uploadList.join(","));
      } else {
        this.$Message.warning("上传失败，请重新上传");
      }
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < this.limitNum;
      if (!check) {
        this.$Notice.warning({
          title: "上传的照片不能超过" + this.limitNum + "张"
        });
      }
      return check;
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "上传的照片文件过大",
        desc: "照片  " + file.name + " 过大, 不能超过 2M"
      });
    }
  },
  mounted() {}
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
