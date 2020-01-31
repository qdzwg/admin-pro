<template>
  <div class="merchantinfo-info"
       style=" width:800px;margin:0 auto;">
    <Form :model="formItem"
          label-position="right"
          :label-width="100"
          ref="formItem"
          :rules="ruleForm">
      <FormItem label="店铺名称："
                prop="name">
        <Input v-model="formItem.name"></Input>
      </FormItem>
      <FormItem label="店铺简介："
                prop="briefIntroduction">
        <Input v-model="formItem.briefIntroduction"></Input>
      </FormItem>
      <FormItem label="店铺唯一标识：">
        <Input v-model="formItem.merchantCode"></Input>
        <p style="color:#ed3f14">非必填,店铺唯一标识如:zhangsanlotsmall,仅可修改一次,请谨慎修改</p>
      </FormItem>
      <FormItem label="主营类目："
                prop="mainCategory">
        <Select v-model="formItem.mainCategory"
                style="width:200px">
          <Option v-for="item in authType"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="店铺logo：">
        <up-img :limitNum="1"
                :uploadList="formItem.logoAddr?formItem.logoAddr.split(','):[]"
                @getImgUrl="setWapUrlWap"></up-img>
      </FormItem>
      <FormItem label="客户热线："
                prop="customerService">
        <Input v-model="formItem.customerService"></Input>
      </FormItem>
      <FormItem label="店铺地址："
                prop="addrDetail">
        <select-item ref="select"
                     :addrCode="formItem.addrCode"
                     @getAll="getShopArea"></select-item>
        <Input v-model="formItem.addrDetail"
               style="margin-top:10px;"></Input>
      </FormItem>
      <FormItem label="地图定位："
                prop="latitudeLongitude">
        <Input v-model="formItem.latitudeLongitude"
               style="width:88%;"
               readonly></Input>
        <Button type="primary"
                @click="showModal">获取坐标</Button>
      </FormItem>
      <FormItem label="售后联系人："
                prop="sasContactMan">
        <Input v-model="formItem.sasContactMan"></Input>
      </FormItem>

      <FormItem label="售后电话："
                prop="sasPhone">
        <Input v-model="formItem.sasPhone"></Input>
      </FormItem>
      <FormItem label="售后地址："
                prop="sasAddrDetail">
        <select-item ref="select"
                     :addrCode="formItem.sasAddrCode"
                     @getAll="getAfterSaleArea"></select-item>
        <Input v-model="formItem.sasAddrDetail"
               style="margin-top:10px;"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="handleSubmit('formItem')">提交</Button>
      </FormItem>
    </Form>

    <!-- 弹出层 -->
    <amap ref="mapModel"
          @getPoint="getPoint"></amap>
  </div>
</template>

<script>
import confirm from "@/components/global/confirm";
import selectItem from "@/components/global/select";
import upload from "@/components/global/upload";
import amap from '@/components/global/amap'
export default {
  data () {
    return {
      authType: [
        {
          value: "hotel",
          label: "酒店名宿"
        },
        {
          value: "scenic",
          label: "门票"
        },
        {
          value: "material_object",
          label: "实物"
        },
        {
          value: "pwkq",
          label: "票务卡券"
        },
        {
          value: "food",
          label: "食品"
        },
        {
          value: "meizhuang",
          label: "美妆"
        },
        {
          value: "qinzi",
          label: "亲子"
        },
        {
          value: "shumajd",
          label: "数码家电"
        },
        {
          value: "jujiash",
          label: "居家生活"
        },
        {
          value: "other",
          label: "其他"
        }
      ],
      formItem: {
        name: "",
        briefIntroduction: "",
        merchantCode: '',
        mainCategory: '',
        logoAddr: '',
        customerService: '',
        addrCode: '410000-411700-411724',
        addrDetail: '',
        latitudeLongitude: '',
        sasContactMan: '',
        sasPhone: '',
        sasAddrCode: '410000-411700-411724',
        sasAddrDetail: '',
      },
      ruleForm: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        mainCategory: [
          { required: true, message: "请选择主营类目", trigger: "change" }
        ],
        customerService: [
          { required: true, message: "请输入客服热线", trigger: "blur" },
        ],
        addrDetail: [
          { required: true, message: "请选择店铺地址", trigger: "blur" }
        ],
        latitudeLongitude: [
          { required: true, message: "请输入地图定位", trigger: "change" }
        ],
        sasContactMan: [
          { required: true, message: "请输入售后联系人", trigger: "blur" }
        ],
        sasPhone: [
          { required: true, message: "请输入售后电话", trigger: "blur" }
        ],
        sasAddrDetail: [
          { required: true, message: "请选择售后地址", trigger: "blur" }
        ]
      },
    };
  },
  components: {
    selectItem,
    upload,
    amap
  },
  mounted () {
    this.apiGet('merchant/merchantInfo/getMerchantInfo').then(res => {
      if (res.status == 200) {
        let info = res.data
        let formItem = Object.assign(this.formItem)
        formItem.id = info.id
        formItem.name = info.name
        formItem.briefIntroduction = info.briefIntroduction
        formItem.merchantCode = info.merchantCode
        formItem.mainCategory = info.mainCategory
        formItem.logoAddr = info.logoAddr
        formItem.customerService = info.customerService
        formItem.addrCode = info.addrCode
        formItem.addrDetail = info.addrDetail
        formItem.latitudeLongitude = info.latitudeLongitude
        formItem.sasContactMan = info.sasContactMan
        formItem.sasPhone = info.sasPhone
        formItem.sasAddrCode = info.sasAddrCode
        formItem.sasAddrDetail = info.sasAddrDetail

        this.formItem=formItem;
      }
    });
  },
  methods: {

    setWapUrlWap (url) {
      this.formItemData.logoAddr = url.join(",");
    },
    showModal () {
      this.$refs.mapModel.modal = true
    },
    getPoint (point) {
      this.formItem.latitudeLongitude = point.lat + ',' + point.lng
    },
    getShopArea (data) {
      this.formItem.addrCode = data[0].code + '-' + data[1].code + '-' + data[2].code
    },
    getAfterSaleArea (data) {
      this.formItem.sasAddrCode = data[0].code + '-' + data[1].code + '-' + data[2].code
    },
    handleSubmit (name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = _this.formItem;
          this.apiPost('merchant/merchantInfo/updateInfo', params).then(res => {
            if (res.success) {
              this.$Message.success("操作成功!");
            } else {
              this.$Message.warn(res.message ? res.message : '操作失败');
            }
          });
        }
      });
    },

  }
};
</script>

