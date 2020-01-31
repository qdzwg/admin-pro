<template>
  <Form :model="formCompleteItem"
        label-position="right"
        :label-width="100"
        ref="formItem"
        :rules="ruleComplteForm">
    <FormItem label="酒店名称">
      {{name}}
    </FormItem>
    <FormItem label="酒店别名："
              prop="nickName">
      <Input v-model="formCompleteItem.nickName"
             placeholder="填写景区别名"></Input>
    </FormItem>
    <FormItem label="酒店副标题："
              prop="subtitle">
      <Input v-model="formCompleteItem.subtitle"
             placeholder="填写景区副标题"></Input>
    </FormItem>
    <FormItem label="展示起价："
              prop="priceShow">
      <InputNumber :max="100000"
                   :min="0"
                   v-model="formCompleteItem.priceShow"></InputNumber>
    </FormItem>
    <FormItem label="虚拟销量："
              prop="fictSaleNum">
      <InputNumber :max="100000"
                   :min="0"
                   v-model="formCompleteItem.fictSaleNum"></InputNumber>
      <p>+实际销量</p>
    </FormItem>
    <FormItem label="WAP端主图：">
      <up-img :limitNum="1"
              v-model="formCompleteItem.linkMobileImg"></up-img>
    </FormItem>
    <FormItem label="WAP端轮播图：">
      <up-img :limitNum="5"
              v-model="formCompleteItem.wapUrl"></up-img>
    </FormItem>
    <FormItem label="景点介绍">
      <ueditor id="introduce"
               :config="config"
               v-model="formCompleteItem.summary"></ueditor>
    </FormItem>
    <FormItem label="预订须知">
      <ueditor id="must"
               :config="config"
               v-model="formCompleteItem.noticeid"></ueditor>
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
      name: '',
      formCompleteItem: {
        nickName: '',
        subtitle: '',
        priceShow: 0,
        fictSaleNum: 0,
        linkMobileImg: "",
        wapUrl: '',
        summary: '',
        noticeid: ''
      },
      ruleComplteForm: {
        nickName: [
          { required: true, message: "请输入景区别名", trigger: "blur" }
        ],
        subtitle: [
          { required: true, message: "请输入景区副标题", trigger: "blur" }
        ],
        priceShow: [
          { required: true, type: 'number', message: "请输入数字", trigger: "blur" }
        ],
        fictSaleNum: [
          { required: true, type: 'number', message: "请输入虚拟销量", trigger: "blur" }
        ]
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 120
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    submit () {
      this.$refs.formItem.validate((valid) => {
        if (valid) {
          this.apiPost('merchant/merchantHotelInfo/doUpdate', { ...this.formCompleteItem }).then(res => {
            if (res && res.success) {
              this.$router.go(-1)
            } else {
              this.$Message(res.message ? res.message : '操作失败')
            }
          })
        }
      })
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  created () { },
  mounted () { },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let id = to.params.id
      vm.apiGet('merchant/merchantHotelInfo/editFL', { id }).then(res => {
        if (res.success) {
          let data = res.data
          let {
            name,
            nickName,
            subtitle,
            priceShow,
            fictSaleNum,
            linkMobileImg,
            summary,
            noticeid } = data.merchantHotelInfo
          let wapUrl = data.pic.wapUrl
          vm.name = name
          vm.formCompleteItem = {
            id,
            nickName,
            subtitle,
            priceShow: priceShow ? parseFloat(priceShow) : 0,
            fictSaleNum: fictSaleNum ? parseFloat(fictSaleNum) : 0,
            linkMobileImg,
            wapUrl,
            summary,
            noticeid
          }
        }
      })
    })
  }
};
</script>
<style lang="scss" scoped>
</style>