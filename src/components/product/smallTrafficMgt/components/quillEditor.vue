<template>
<div :id="id">
  <Upload
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png','gif']"
      :max-size="2048"
      multiple
      :action="url"
      >
      <Button icon="ios-cloud-upload-outline" ></Button>
  </Upload>
  <quill-editor
    ref="QuillEditor"
    :content="currentValue"
    :options="editorOption"
    @change="onEditorChange">
  </quill-editor>
</div>

</template>

<script>
// import { barseUrlFun } from 'api/config.js';
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'direction': 'rtl' }], // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }],
  [{ 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
]
// 标题
const titleConfig = {
  'ql-bold': '加粗',
  'ql-color': '颜色',
  'ql-font': '字体',
  'ql-code': '插入代码',
  'ql-italic': '斜体',
  'ql-link': '添加链接',
  'ql-background': '背景颜色',
  'ql-size': '字体大小',
  'ql-strike': '删除线',
  'ql-script': '上标/下标',
  'ql-underline': '下划线',
  'ql-blockquote': '引用',
  'ql-header': '标题',
  'ql-indent': '缩进',
  'ql-list': '列表',
  'ql-align': '文本对齐',
  'ql-direction': '文本方向',
  'ql-code-block': '代码块',
  'ql-formula': '公式',
  'ql-image': '图片',
  'ql-video': '视频',
  'ql-clean': '清除字体样式',
  'ql-upload': '文件'
}
// import { quillEditor } from 'vue-quill-editor';
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';
export default {
  components: { },
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      url: '',
      currentValue: this.value,
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': (value) => {
                if (value) {
                  // console.log(document.getElementById(self.id));
                  console.log(this)
                  console.log(document.getElementById(this.id))
                  // console.log(this.container.parent);
                  document.getElementById(this.id).querySelector('.ivu-upload .ivu-btn').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }

    }
  },
  watch: {
    value: function (newVal) {
      this.currentValue = newVal
    }
  },
  computed: {
  },
  methods: {
    onEditorChange ({ html }) {
      console.log(this.currentValue)
      //   const value = event.target.value;
      this.currentValue = html
      this.$emit('input', this.currentValue) // key code
    },
    handleSuccess (res) {
      // 获取富文本组件实例
      let quill = this.$refs.QuillEditor.quill
      // 如果上传成功
      if (res.status === 200) {
        console.log(res)
        let url = res.prefix + res.url
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, 'image', url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        // 提示信息，需引入Message
        this.$Message.error('图片插入失败')
      }
    },
    addQuillTitle () {
      console.log(document.getElementById(this.id))
      const oToolBar = document.getElementById(this.id).querySelector('.ql-toolbar')
      const aButton = oToolBar.querySelectorAll('button')
      const aSelect = oToolBar.querySelectorAll('select')
      aButton.forEach(function (item) {
        if (item.className === 'ql-script') {
          item.value === 'sub' ? item.title = '下标' : item.title = '上标'
        } else if (item.className === 'ql-indent') {
          item.value === '+1' ? item.title = '向右缩进' : item.title = '向左缩进'
        } else {
          item.title = titleConfig[item.classList[0]]
        }
      })
      aSelect.forEach(function (item) {
        item.parentNode.title = titleConfig[item.classList[0]]
      })
    }
  },
  created () {},
  mounted () {
    let url = '' // barseUrlFun();
    this.url = url + '/product/api/file/upload'
    this.$nextTick(() => {
      this.addQuillTitle()
    })
  }
}
</script>
<style lang="scss" scoped>
.ivu-upload {
   width: 0;
    height: 0;
    display: none;
}
</style>
