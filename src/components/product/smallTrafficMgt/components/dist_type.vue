<template>
  <div>
    <Form ref="distFormValidate" id="distFormValidate" :model="lineInfo"  :rules="ruleValidate" :label-width="120" >
      <FormItem label="产品简介" style="margin-top: 20px;" prop="goodBriefIntr">
        <div class="pic-tip">
          <Input
            v-model="lineInfo.goodBriefIntr"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入产品简介"
            style="width:80%"
          ></Input>
          <span style="margin-left:6px;"><i style="color:red">注:</i> 300字以内;</span>
        </div>
      </FormItem>
      <FormItem label="产品详情">
        <u-editor v-model="lineInfo.goodDetailIntr"></u-editor>
      </FormItem>
      <h3 class="edit-title">分销设置</h3>
      <FormItem label="分销渠道" prop="distType">
        <Select v-model="lineInfo.distType" @on-change='validItem' style="width:180px;position:relative;z-index:1000;" placeholder="请选择">
          <Option v-for="(key,value) in distList" :value="value" :key="value">{{ key }}</Option>
        </Select>
      </FormItem>
      <FormItem label="分销政策" v-show='lineInfo.distType==1||lineInfo.distType==0'>
        <u-editor v-model="lineInfo.distPolicy"></u-editor>
      </FormItem>
      <FormItem label="售后政策" v-show='lineInfo.distType==1||lineInfo.distType==0'>
        <u-editor v-model="lineInfo.salePolicy"></u-editor>
      </FormItem>
      <FormItem label="起始价" prop="priceDist" v-if='lineInfo.distType==1||lineInfo.distType==0'>
        <Input v-model.trim="lineInfo.priceDist" placeholder="请输入起始价" style="width:260px"></Input>
      </FormItem>
      <FormItem label="轮播图" prop="wapUrl" v-if='lineInfo.distType==1||lineInfo.distType==0'>
        <div class="pic-tips">
          <Img  v-model="lineInfo.wapUrl" :limitNum="5"></Img>
          <span class="tip"><i style="color:red">注:</i> 5张以内;大小3M以内;</span>
        </div>
      </FormItem>
      <FormItem label="缩略图" prop="linkMobileImg" v-if='lineInfo.distType==1||lineInfo.distType==0'>
        <div class="pic-tip">
          <Img  v-model="lineInfo.linkMobileImg" :limitNum="1"></Img>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
import Img from './uploadFile.vue'
import common from '@/common/index.js'
import uEditor from '@/components/global/vueUEditor.vue'
export default {
  components: { Img, uEditor },
  props: {

  },
  data () {
    return {
      ruleValidate: {
        distType: [
          { required: true, message: '请选择分销渠道', trigger: 'blur' },
        ],
        goodBriefIntr: [
          { required: false, message: '请输入产品简介', trigger: 'blur' }
        ],
        freeIntr: [
          { max: 300, message: '300字以内', trigger: 'blur' }
        ],
        priceDist: [
          { required: true, message: '请输入起始价', trigger: 'blur',type:'string'},
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
        ],
        wapUrl: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        linkMobileImg: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {},
  computed: {
    ...mapState('lineManage/', {
      carLineFlag: state => state.carLineFlag,
      lineInfo: state => state.lineInfo,
      distList: state => state.distList
    })
  },
  methods: {
    validItem() {
      this.$refs.distFormValidate.validateField("distType");
    },
    validateDist () {
      return new Promise((resolve, reject) => {
        this.$refs['distFormValidate'].validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            // this.$Message.info('请检查线路信息');
            // if (!this.lineInfo.routeName) {
            //   document.getElementById('content').scrollTop = 0
            // } else {
            //   let carBusDom = document.getElementById('distFormValidate')
            //   let scrollTop = carBusDom.offsetTop
            //   document.getElementById('content').scrollTop = scrollTop
            // }
            reject(false)
          }
        })
      })
    },
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
