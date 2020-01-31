<template>
  <div>
    <Upload ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            :format="type?[type]:['mp3','mp4']"
            :on-format-error="handleFormatError"
            :max-size="10240"
            multiple
            :on-exceeded-size="handleMaxSize"
            action="/admin/api/ui/uplode">
      <Button type="primary">点击上传</Button>
    </Upload>
    <div v-for="(item,index) in uploadList" :key="index">
      <div class="video"
           :key="index">
        <video :src="item"
               v-if="type=='mp4'"
               height=100
               width=200
               autoplay="autoplay">
          您的浏览器不支持 video 标签。
        </video>
        <audio :src="item"
               height="40"
               controls="controls"
               v-else>
          您的浏览器不支持 audio 标签。
        </audio>
        <div class="file-item-handle">
          <Icon type="trash-a"
                style="color:#fff;font-size:16px"
                @click.native="handleRemove(index)"></Icon>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  data () {
    return {
      
    };
  },
  props:['uploadList', 'value', 'limitNum', 'type'],
  methods: {
    handleRemove (index) {
      this.uploadList.splice(index, 1)
      this.$emit("input", this.uploadList.join(','))
    },
    handleSuccess (res, file) {
      if (res.status == 200) {
        this.uploadList.push(res.message)
        this.$emit("input", this.uploadList.join(','))
      } else {
        this.$Message.warning("上传失败，请重新上传")
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '不支持此文件格式',
        desc: '不支持 ' + file.name + ' 文件格式'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < this.limitNum;
      if (!check) {
        this.$Notice.warning({
          title: "上传的文件不能超过" + this.limitNum + "个"
        });
      }
      return check;
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '上传的文件过大',
        desc: '文件  ' + file.name + ' 过大, 不能超过 10M'
      });
    }

  },
  mounted () {
    
  }
};
</script>
<style>
.ivu-upload-list {
  width: 50%;
}
.demo-upload-list-box {
  display: inline-block;
  width: 50%;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  background: #fff;
  position: relative;
  margin-top: 10px;
  padding-left: 10px;
}
.demo-upload-list-box span .icon-music {
  margin-right: 10px;
}
.demo-upload-list-del {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
}
.demo-upload-list-box:hover {
  background: #f3f3f3;
}
.demo-upload-list-box:hover .demo-upload-list-del {
  display: block;
}
.demo-upload-list-del i {
  color: #495060;
  font-size: 20px;
  cursor: pointer;
  margin-right: 5px;
}
.video {
  position: relative;
  display: inline-block;
  overflow: hidden;
  margin-top: 10px;
}
.video .file-item-handle {
  position: absolute;
  top: -30px;
  left: 0;
  right: 0;
  height: 24px;
  line-height: 24px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: right;
  padding: 0 4px;
  transition: top 0.25s;
}
.video:hover .file-item-handle {
  top: 0;
}
</style>