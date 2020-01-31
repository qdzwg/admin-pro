<template>
  <div>
    <h3 class="edit-title">线路信息</h3>
    <Form ref="formValidate"  :model="lineInfo"  :rules="ruleValidate" :label-width="120" >
      <FormItem label="线路编号" v-if="lineInfo.routeCode">
        <span>{{lineInfo.routeCode}}</span>
      </FormItem>
      <FormItem label="线路名称"  prop="routeName" >
        <span>{{lineInfo.routeName}}</span>
      </FormItem>
      <FormItem label="线路类型" prop="routeType">
        <span>{{lineInfo.routeType=="01"?"单线":"单线"}}</span>
      </FormItem>
      <!-- <FormItem  label="行程说明">
        <Input  v-model="lineInfo.routeIntr"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:80%"  placeholder="请输入行程说明" ></Input>
      </FormItem> -->
      <!-- <FormItem  label="行程说明">
        <u-editor v-model="lineInfo.routeIntr"></u-editor>
      </FormItem>
      <FormItem  label="预定须知">
        <u-editor v-model="lineInfo.orderNotice"></u-editor> -->
        <!-- <Input
          v-model="lineInfo.orderNotice"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
          style="width:80%"
          placeholder="请输入预定须知"
        ></Input> -->
      <!-- </FormItem> -->
      <!-- <FormItem label="费用说明" >
        <u-editor v-model="lineInfo.freeIntr"></u-editor> -->
        <!-- <div class="pic-tip">
          <Input
            v-model="lineInfo.freeIntr"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入费用说明"
            style="width:80%"
          ></Input>
          <span style="margin-left:6px;"><i style="color:red">注:</i> 300字以内;</span> -->
        <!-- </div> -->
      <!-- </FormItem> -->
      <!-- <FormItem label="wap主图" prop="wapImg">
        <div class="pic-tip">
          <Img  v-model="lineInfo.wapImg" :limitNum="1"></Img>
          <Input v-model.trim="lineInfo.wapImg" placeholder="请上传wap主图" class="tip-none"></Input>
          <span class="tip"><i style="color:red">注:</i> 1张;大小3M以内;</span>
        </div>
      </FormItem>
      <FormItem label="wap轮播图">
        <div class="pic-tip">
          <Img  v-model="lineInfo.wapCarouselImg"  :limitNum="5"></Img>
          <span class="tip"><i style="color:red">注:</i> 5张以内;大小3M以内;</span>
        </div>
      </FormItem>
      <FormItem label="pc主图" prop="pcImg">
        <div class="pic-tip" >
          <Img  v-model="lineInfo.pcImg" :limitNum="1"></Img>
          <Input v-model.trim="lineInfo.pcImg" placeholder="请上传wap主图" class="tip-none"></Input>
          <span class="tip"><i style="color:red">注:</i> 1张;大小3M以内;</span>
        </div>
      </FormItem>
      <FormItem label="pc轮播图">
        <div class="pic-tip">
          <Img  v-model="lineInfo.pcCarouselImg" :limitNum="5"></Img>
          <span class="tip"><i style="color:red">注:</i> 5张以内;大小3M以内;</span>
        </div>
      </FormItem> -->
      <!-- :parser="value => parseInt(value)" -->
      <!-- <FormItem  label="线路里程">
        <InputNumber
          :min="1"
          :max='5000000'
          :step="1"
          v-model="lineInfo.routeMileage"
        ></InputNumber>
      </FormItem> -->
      <FormItem label="运营日期" style="position:relative" id="line-date">
        {{lineInfo.runBeginTime}}-{{lineInfo.runEndTime}}
      </FormItem>
    </Form>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
// import Img from '@/components/global/upImg';
// import ueditor from "@/components/global/ueditor";
import Img from './uploadFile.vue'
import common from '@/common/index.js'
import uEditor from '@/components/global/vueUEditor.vue'
export default {
  components: { Img, uEditor },
  props: {

  },
  data () {
    return {
      // dateOption: {
      //   disabledDate(date) {
      //     return date && date.valueOf() < Date.now() - 86400000;
      //   }
      // },
      // content: '<h2>I am Example</h2>',
      // editorOption: {
      //   // something config
      // },
      ruleValidate: {
        routeName: [
          { required: true, message: '线路名称必填', trigger: 'blur' },
          { validator: common.validate.routeName, trigger: 'blur' },
          { type: 'string', max: 16, message: '线路名称不能超过16个字符', trigger: 'blur' }
        ],
        routeType: [
          { required: true, message: '请选择线路类型', trigger: 'blur' }
        ],
        freeIntr: [
          { max: 300, message: '300字以内', trigger: 'blur' }
        ],
        wapImg: [
          { required: true, message: '请上传wap主图', trigger: 'blur' }
        ],
        pcImg: [
          { required: true, message: '请上传pc主图', trigger: 'blur' }
        ],
        runBeginTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        runEndTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {
    ...mapState('lineManage/', {
      carLineFlag: state => state.carLineFlag,
      lineInfo: state => state.lineInfo
    })
  },
  methods: {
    ...mapMutations('lineManage/', ['setLineInfo']),
    validateLine () {
      return new Promise((resolve, reject) => {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            // this.$Message.info('请检查线路信息');
            if (!this.lineInfo.routeName) {
              document.getElementById('content').scrollTop = 0
            } else {
              let carBusDom = document.getElementById('line-date')
              let scrollTop = carBusDom.offsetTop
              document.getElementById('content').scrollTop = scrollTop
            }
            reject(false)
          }
        })
      })
    },
    runBeginTime (val) {
      this.lineInfo.runBeginTime = val
      this.setLineInfo({ lineInfo: this.lineInfo })
    },
    runEndTime (val) {
      this.lineInfo.runEndTime = val
      this.setLineInfo({ lineInfo: this.lineInfo })
    },
    escapeStringHTML (str) {
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      return str
    }
  },
  created () { },
  mounted () {

  }
}
</script>
<style lang="scss" scoped>
.edit-title{
  margin-bottom: 12px;
  background: #dedbdb;
  padding: 5px;
  border-left: 4px solid #64b6ff;
  font-size: 16px;
}
.tip-none{
  height:0;
  overflow: hidden;
  position: absolute;
}
.pic-tip{
  display: flex;
  align-items: center;
  .tip{
    margin-left:6px;
    margin-bottom:12px;
    white-space: nowrap;
  }
}

.require-icon{
    position: absolute;
    top: 2px;
    left: -70px;
    z-index: 99;
    font-size: 14px;
    color: red;
}
</style>
