<template>
  <Form :model="formCompleteItem"
        :label-width="100"
        ref="formItem"
        :rules="ruleComplteForm">
    <FormItem label="景区名称">
      {{formCompleteItem.nickName}}
    </FormItem>
    <FormItem label="景区别名："
              prop="nickName">
      <Input :value="formCompleteItem.nickName"
             :maxlength="64"
             placeholder="填写景区别名"></Input>
    </FormItem>
    <FormItem label="景区副标题："
              prop="subtitle">
      <Input v-model="formCompleteItem.subtitle"
             :maxlength="64"
             placeholder="填写景区副标题"></Input>
    </FormItem>
    <FormItem label="展示起价："
              prop="priceShow">
      <InputNumber v-model="formCompleteItem.priceShow"
                   :max="100000"
                   :min="1"></InputNumber>
    </FormItem>
    <FormItem label="虚拟销量："
              prop="virtualSale">
      <InputNumber v-model="formCompleteItem.virtualSale"
                   :max="100000"
                   :min="1"></InputNumber> + 实际销量
    </FormItem>
    <FormItem label="WAP端主图：">
      <!-- <up-img :limitNum="1"
              :uploadList="singleImgList"
              @getImgUrl="setWapUrl"></up-img> -->
      <up-img :limitNum="1"
              v-model="formCompleteItem.linkMobileImg"></up-img>
    </FormItem>
    <FormItem label="WAP端轮播图：">
      <up-img :limitNum="5"
              v-model="formCompleteItem.wapUrl"></up-img>
    </FormItem>
    <FormItem label="景点介绍">
      <ueditor id="introduce"
               v-model="formCompleteItem.content"
               :config="config"></ueditor>
    </FormItem>
    <FormItem label="预订须知">
      <ueditor id="must"
               :config="config"
               v-model="formCompleteItem.orderNotice"></ueditor>
    </FormItem>
    <FormItem>
      <Button type="primary"
              @click="submit">提交</Button>
      <Button type="ghost"
              style="margin-left: 8px"
              @click="cancel">取消</Button>
    </FormItem>
  </Form>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      name: '天下第一关',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 120,
        subtitle: '',
      },
      formCompleteItem: {
        id: '',
        productCode: "",
        nickName: '',
        subtitle: '',
        priceShow: 0,
        virtualSale: 0,
        linkMobileImg: '',
        wapUrl: '',
        content: '',
        orderNotice: ''
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
          { required: true, type: 'number', message: '请输入虚拟销量', trigger: 'blur' }
        ]
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    submit () {
      this.$refs.formItem.validate((valid) => {
        if (valid) {
          let url = 'merchant/merchantParkInfo/updateMerchantParkInfo'
          this.common.formPost(this, {
            url,
            params: this.formCompleteItem,
            mold: 'modal',
            callback (res) {
              if (res.success) {
                _this.$Message.info('保存成功')
                this.$router.go(-1)
              }
            }
          })
        }
      })

    },
  },
  created () { },
  mounted () {
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // this.name = name
      let id = to.params.id
      vm.apiGet('merchant/merchantParkInfo/editFL', { id }).then(res => {
        if (res.success) {
          let data = res.data
          let { productCode, nickName, subtitle, priceShow, virtualSale, linkMobileImg, content, orderNotice } = data.merchantParkInfo
          let wapUrl = data.pic.wapUrl
          vm.formCompleteItem = {
            id, productCode, nickName, subtitle, priceShow, virtualSale, linkMobileImg, wapUrl, content, orderNotice
          }
        }
      })
    })
  }
};
</script>
<style lang="scss" scoped>
</style>