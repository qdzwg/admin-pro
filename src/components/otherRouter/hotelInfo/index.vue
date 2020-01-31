<template>
    <div>
        <Form height="450" :model="formCompleteItem" label-position="right" :label-width="100" ref="formItem" :rules="ruleComplteForm">
            <FormItem label="酒店名称：" prop="name">
                {{formCompleteItem.name}}
            </FormItem>
            <FormItem label="酒店别名：" prop="nickName">
                <Input v-model="formCompleteItem.nickName" style="width:33%;" :maxlength="20" placeholder="填写酒店别名"></Input>
            </FormItem>
            <FormItem label="酒店副标题" prop="subtitle">
                <Input v-model="formCompleteItem.subtitle" style="width:33%;" :maxlength="20" placeholder="填写酒店副标题"></Input>
            </FormItem>
            <FormItem label="展示起价：" prop="priceShow">
                <Input v-model="formCompleteItem.priceShow" number placeholder="填写展示起价" style="width:200px"></Input>
            </FormItem>
            <FormItem label="虚拟销量：" prop="fictSaleNum">
                <Input v-model="formCompleteItem.fictSaleNum" :maxlength="11" number placeholder="填写虚拟销量" style="width:200px"></Input> +实际销量
                <!-- <InputNumber v-model="formCompleteItem.fictSaleNum"
                     :min="1"></InputNumber>+实际销量 -->
            </FormItem>
            <FormItem label="WAP端主图：">
                <uploadFile :limitNum="1" v-model="formCompleteItem.linkMobileImg"></uploadFile>
            </FormItem>
            <FormItem label="WAP端轮播图：">
                <uploadFile :limitNum="5" v-model="formCompleteItem.wapUrl"></uploadFile>
            </FormItem>
            <FormItem label="详情介绍">
                <ueditor :config="config" v-model="formCompleteItem.summary"></ueditor>
            </FormItem>
            <FormItem label="预订须知">
                <ueditor :config="config" v-model="formCompleteItem.noticeid"></ueditor>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
                <Button type="ghost" @click="cancel" style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import ueditor from "@/components/global/vueUEditor";
import uploadFile from "@/components/global/uploadFile";
export default {
  data() {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formCompleteItem: {
        detailIds: ""
      },
      ruleComplteForm: {
        nickName: [{ required: true, message: "请输入别名", trigger: "blur" }],
        subtitle: [
          { required: true, message: "请输入酒店副标题", trigger: "blur" }
        ],
        priceShow: [
          {
            required: true,
            type: "number",
            message: "请输入展示起价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "输入格式不正确",
            trigger: "blur",
            validator: this.common.validate.floatNumber
          }
        ],
        fictSaleNum: [
          {
            required: true,
            type: "number",
            message: "请输入虚拟销量",
            trigger: "blur",
            validator: this.common.validate.floatNumber
          }
        ],
        linkMobileImg: [
          { required: true, message: "请选择WAP端主图", trigger: "blur" }
        ],
        wapUrl: [
          { required: true, message: "请选择WAP端轮播图", trigger: "blur" }
        ]
      },
      columns1: [],
      data1: []
    };
  },
  mounted() {
    let url =
      "/merchant/merchantHotelInfo/editHotel?id=" + this.$route.params.id;
    let _this = this;
    this.common.listDone(this, {
      url,
      callback(res) {
        console.log(res.data);
        if (res.status === 200) {
          _this.formCompleteItem = res.data.merchantHotelInfo;
          _this.formCompleteItem.nickName =
            res.data.merchantHotelInfo.nickName ||
            res.data.merchantHotelInfo.name;
          // _this.singleImgList = res.data.merchantHotelInfo.linkMobileImg ? [res.data.merchantHotelInfo.linkMobileImg] : []
          // _this.wapImgList = res.data.pic.wapUrl ? [res.data.pic.wapUrl] : []
          _this.formCompleteItem.wapUrl = res.data.pic.wapUrl;
          _this.formCompleteItem.noticeid = res.data.merchantHotelInfo.noticeid;
          _this.formCompleteItem.summary = res.data.merchantHotelInfo.summary;
        } else {
          _this.$Message.warning(res.message);
        }
      }
    });
  },
  methods: {
    submit() {
      let _this = this;
      // _this.formCompleteItem.summary = _this.$refs.mdseInfo.getUEContent()
      // _this.formCompleteItem.noticeid = _this.$refs.must.getUEContent()
      // _this.formCompleteItem.linkMobileImg = _this.singleImgList.join(',')
      // _this.formCompleteItem.wapUrl = _this.wapImgList.join(',')
      delete this.formCompleteItem.createTime;
      delete this.formCompleteItem.modifyTime;
      let url = "/merchant/merchantHotelInfo/doUpdateHotel";
      this.common.formPost(this, {
        url,
        params: this.formCompleteItem,
        callback(res) {
          if (res.success || res.status === 200) {
            _this.$Message.info("保存成功");
            _this.$router.go(-1);
          } else {
            _this.$Message.warning(res.message);
          }
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    }
  },
  components: {
    uploadFile,
    ueditor
  }
};
</script>
<style>
</style>
