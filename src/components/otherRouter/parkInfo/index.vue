<template>
  <div>
    <Form :model="formCompleteItem"
          label-position="right"
          :label-width="100"
          ref="formItem"
          :rules="ruleComplteForm">
      <FormItem label="景区名称">
        {{formCompleteItem.name}}
      </FormItem>
      <FormItem label="景区别名："
                prop="nickName">
        <Input v-model="formCompleteItem.nickName"
               :maxlength="64"
               style="width:33%;"
               placeholder="填写景区别名"></Input>
      </FormItem>
      <FormItem label="景区副标题："
                prop="subtitle">
        <Input v-model="formCompleteItem.subtitle"
               :maxlength="64"
               style="width:33%;"
               placeholder="填写景区副标题"></Input>
      </FormItem>
      <FormItem label="展示起价："
                prop="priceShow">
        <Input v-model="formCompleteItem.priceShow"
        style="width:200px;"
               placeholder="填写展示起价"></Input>
      </FormItem>
      <FormItem label="虚拟销量："
                prop="virtualSale">
        <Input v-model="formCompleteItem.virtualSale"
               :maxlength="11"
                style="width:200px;"
               placeholder="填写虚拟销量"></Input>
      </FormItem>
      <FormItem label="WAP端主图："
                prop="linkMobileImg">
        <uploadFile :limitNum="1"
                    v-model="formCompleteItem.linkMobileImg"></uploadFile>
      </FormItem>
      <FormItem label="WAP端轮播图："
                prop="wapUrl">
        <!-- <Input style="display:none;"
               v-model="formCompleteItem.wapUrl"></Input>
        <up-img :limitNum="5"
                :uploadList="wapImgList"
                @getImgUrl="setWapListUrl"></up-img> -->
        <uploadFile :limitNum="5"
                    v-model="formCompleteItem.wapUrl"></uploadFile>
      </FormItem>
      <FormItem label="景点介绍">
        <ueditor v-model="formCompleteItem.content"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="预订须知">
        <ueditor v-model="formCompleteItem.orderNotice"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit">提交</Button>
        <Button type="ghost"
                @click="cancel"
                style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import ueditor from '@/components/global/vueUEditor'
import uploadFile from '@/components/global/uploadFile'
export default {
  data () {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formCompleteItem: {
        detailIds: ''
      },
      ruleComplteForm: {
        nickName: [
          { required: true, message: '请输入景区别名', trigger: 'blur' }
        ],
        subtitle: [
          { required: true, message: '请输入景区副标题', trigger: 'blur' }
        ],
        priceShow: [
          { required: true, type: 'number', message: '请输入展示起价', trigger: 'blur', validator: this.common.validate.floatNumber }
        ],
        virtualSale: [
          { required: true, type: 'number', message: '请输入虚拟销量', trigger: 'blur', validator: this.common.validate.floatNumber }
        ],
        linkMobileImg: [
          { required: true, message: '请选择WAP端主图', trigger: 'blur' }
        ],
        wapUrl: [
          { required: true, message: '请选择WAP端轮播图', trigger: 'blur' }
        ]
      },
      columns1: [],
      data1: []
    }
  },
  mounted () {
    let url = '/merchant/merchantParkInfo/editPark?id=' + this.$route.params.id
    let _this = this
    this.common.listDone(this, {
      url,
      callback (res) {
        console.log(res)
        if (res.status == 200) {
          _this.formCompleteItem = res.data.merchantParkInfo
          _this.formCompleteItem.wapUrl = res.data.merchantParkInfo.merchantPictureLibVo.wapUrl
          // _this.singleImgList = res.data.merchantParkInfo.linkMobileImg ? [res.data.merchantParkInfo.linkMobileImg] : []
          _this.formCompleteItem.content = res.data.merchantParkInfo.content
          _this.formCompleteItem.orderNotice = res.data.merchantParkInfo.orderNotice
        } else {
          _this.$Message.warning(res.message)
        }
      }
    })
  },
  methods: {
    // setWapUrl (url) {
    //   this.formCompleteItem.linkMobileImg = url.join(',')
    // },
    // setWapListUrl (url) {
    //   this.formCompleteItem.wapUrl = url.join(',')
    // },
    cancel () {
      this.$router.go(-1)
    },
    submit () {
      let _this = this
      // _this.formCompleteItem.content = _this.$refs.introduce.getUEContent()
      // _this.formCompleteItem.orderNotice = _this.$refs.must.getUEContent()
      // _this.formCompleteItem.wapUrl = _this.wapImgList.join(',')
      // _this.formCompleteItem.linkMobileImg = _this.singleImgList.join(',')
      delete this.formCompleteItem.createTime
      delete this.formCompleteItem.modifyTime
      delete this.formCompleteItem.merchantPictureLibVo
      let url = '/merchant/merchantParkInfo/updateMerchantPark'
      this.common.formPost(this, {
        url,
        params: this.formCompleteItem,
        callback (res) {
          if (res.success || res.status == 200) {
            _this.$Message.info('保存成功')
            _this.$router.go(-1)
          } else {
            _this.$Message.warning(res.message)
          }
        }
      })
    }
  },
  components: {
    ueditor,
    uploadFile
  }
}
</script>
<style>
</style>
