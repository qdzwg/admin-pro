<template>
  <div>
    <Form height="450"
          :model="formCompleteItem"
          label-position="right"
          :label-width="100"
          ref="formItem"
          :rules="ruleComplteForm">
      <FormItem label="商品名称："
                prop="nickName">
        asdada
      </FormItem>
      <FormItem label="商品别名："
                prop="subtitle">
        <Col span="8"><Input v-model="formCompleteItem.nickName"
               placeholder="填写景区别名"></Input></Col>
      </FormItem>
      <FormItem label="商品类目："
                prop="priceShow">
        食品
      </FormItem>
      <FormItem label="商品编号："
                prop="virtualSale">
        MS2018041316330274
      </FormItem>
      <FormItem label="商品体重："
                prop="virtualSale">
        0.5kg
      </FormItem>
      <FormItem label="商品规格："
                prop="virtualSale">
        <Table stripe
               :columns="columns1"
               :data="data1"></Table>
      </FormItem>
      <FormItem label="总库存："
                prop="virtualSale">
        <InputNumber :min="1"></InputNumber>
        <Checkbox>页面不显示商品总库存</Checkbox>
      </FormItem>
      <FormItem label="虚拟销量："
                prop="virtualSale">
        <InputNumber v-model="formCompleteItem.virtualSale"
                     :min="1"></InputNumber>+实际销量
      </FormItem>
      <FormItem label="展示起价："
                prop="virtualSale">
        <InputNumber v-model="formCompleteItem.priceShow"
                     :min="1"></InputNumber>
      </FormItem>
      <FormItem label="门市价："
                prop="virtualSale">
        <InputNumber v-model="formCompleteItem.merchantLinePrice"
                     :min="1"></InputNumber>
      </FormItem>
      <FormItem label="WAP端主图：">
        <up-img :limitNum="1"
                v-model="formCompleteItem.linkMobileImg"></up-img>
      </FormItem>
      <FormItem label="WAP端轮播图：">
        <up-img :limitNum="5"
                v-model="formCompleteItem.wapUrl"></up-img>
      </FormItem>
      <FormItem label="pc主图">
        <up-img :limitNum="1"
                v-model="formCompleteItem.linkImg"></up-img>
      </FormItem>
      <FormItem label="pc轮播图">
        <up-img :limitNum="5"
                v-model="formCompleteItem.pcUrl"></up-img>
      </FormItem>
      <FormItem label="商品详情">
        <ueditor id="mdseInfo"
                 v-model="formCompleteItem.summary"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit">提交</Button>
        <Button type="ghost"
                style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      msg: "3121213asda313",
      formCompleteItem: {
        detailIds: this.$route.params.id
      },
      ruleComplteForm: [],
      columns1: [
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        }
      ],
      data1: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ]
    };
  },
  methods: {
    pcSetWapUrl (url) {
      this.formCompleteItem.linkImg = url.join(",");
    },
    submit () {
      let _this = this;
      let url = "list/merchant/merchantMdseInfo/saveMerchantMdseInfo11";
      this.common.formPost(this, {
        url,
        params: this.formCompleteItem,
        mold: "modal",
        callback (res) {
          if (res.success) {
            _this.completeInfo = false;
          }
        }
      });
    }
  },
  components: {
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let id = to.params.id
      vm.apiGet('merchant/merchantMdseInfo/editFL', { id }).then(res => {
        if (res.success) {
          let data = res.data
          // let { productCode, nickName, subtitle, priceShow, virtualSale, linkMobileImg, content, orderNotice } = data.merchantParkInfo
          // let wapUrl = data.pic.wapUrl
          // vm.formCompleteItem = {
          //   id, productCode, nickName, subtitle, priceShow, virtualSale, linkMobileImg, wapUrl, content, orderNotice
          // }
        }
      })
    })
  }
};
</script>
<style>
</style>

