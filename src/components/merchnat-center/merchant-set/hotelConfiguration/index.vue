<template>
  <div class="hotelConfiguration">
    <div style="font-size:14px;">
      <p>酒店列表说明：</p>
      <p>自定义酒店列表展示形式和拍讯筛选栏的显示与否。（注：每次更改酒店列表配置需提交微信小程序审核，审核通过后小程序端才可生效。）</p>
    </div>
    <div class="config-box">
      <div class="img-left ">
        <img
          v-if="formItem.listShow=='small'&&formItem.selectShow=='F'&&formItem.scoreShow=='F'"
          src="./../../../../assets/images/big-img1.png"
          alt=""
        >
        <img
          v-if="formItem.listShow=='small'&&formItem.selectShow=='T'&&formItem.scoreShow=='F'"
          src="./../../../../assets/images/big-img2.png"
          alt=""
        >
        <img
          v-if="formItem.listShow=='small'&&formItem.selectShow=='F'&&formItem.scoreShow=='T'"
          src="./../../../../assets/images/big-img3.png"
          alt=""
        >
        <img
          v-if="formItem.listShow=='small'&&formItem.selectShow=='T'&&formItem.scoreShow=='T'"
          src="./../../../../assets/images/big-img4.png"
          alt=""
        >
        <img
          v-if="formItem.listShow=='big'&&formItem.selectShow=='F'&&formItem.scoreShow=='F'"
          src="./../../../../assets/images/big-img5.png"
          alt=""
        >
        <img
          v-if="formItem.listShow=='big'&&formItem.selectShow=='T'&&formItem.scoreShow=='F'"
          src="./../../../../assets/images/big-img6.png"
          alt=""
        >
        <img
          v-if="formItem.listShow=='big'&&formItem.selectShow=='F'&&formItem.scoreShow=='T'"
          src="./../../../../assets/images/big-img7.png"
          alt=""
        >
        <img
          v-if="formItem.listShow=='big'&&formItem.selectShow=='T'&&formItem.scoreShow=='T'"
          src="./../../../../assets/images/big-img8.png"
          alt=""
        >
      </div>
      <div class="form-box ">
        <Form :model="formItem">
          <FormItem label="1.C端店铺酒店列表形式：">
            <RadioGroup v-model="formItem.listShow">
              <Radio label="small">图文形式</Radio>
              <Radio label="big">大图形式</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="2. 是否显示排序筛选栏：">
            <RadioGroup v-model="formItem.selectShow">
              <Radio label="T">是</Radio>
              <Radio label="F">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="3. 是否显示评分信息：">
            <RadioGroup v-model="formItem.scoreShow">
              <Radio label="T">是</Radio>
              <Radio label="F">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>

            <Button
              type="primary"
              @click="submit"
            >保存</Button>
          </FormItem>
        </Form>
      </div>
    </div>

  </div>
</template>

<script>
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
export default {
  data() {
    return {
      formItem: {
        id: "",
        listShow: "small",
        selectShow: "T",
        scoreShow: "F"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      apiGet("/merchant/api/merchantPmsInfoApi/getByInfoId").then(res => {
        if (res.status == 200) {
          this.formItem.id = res.data.id;
          this.formItem.listShow = res.data.listShow;
          this.formItem.selectShow = res.data.selectShow;
          this.formItem.scoreShow = res.data.scoreShow;
        }
      });
    },
    submit() {
      apiPost("/merchant/api/merchantPmsInfoApi/update", this.formItem).then(
        res => {
          if (res.status == 200) {
            this.$Message.success("保存成功");
            this.getList();
          }
        }
      );
    }
  }
};
</script>

<style lang="scss">
.hotelConfiguration {
  .config-box {
    display: flex;
    .img-left {
      width: 30%;
      margin-top: 20px;
      img {
        width: 300px;
        height: 534;
      }
    }
    .form-box {
      margin-top: 20px;
      width: 70%;
    }
  }
}
</style>