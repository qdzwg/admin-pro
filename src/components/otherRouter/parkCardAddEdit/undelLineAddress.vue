<template>
  <div>
    <Form ref="formItem" :model="formItem" :label-width="120" :rules="ruleComplteForm">
      <FormItem label="线下请求地址：" prop="nextRequestAddress">
        <Input v-model="formItem.nextRequestAddress" placeholder="请输入线下请求地址" style="width: 500px"></Input>
      </FormItem>
      <FormItem label="常见问题地址：" prop="wtUrl">
        <Input v-model="formItem.wtUrl" placeholder="请输入常见问题地址" style="width: 500px"></Input>
      </FormItem>
      <!-- <FormItem label="线下密钥：" prop="nextSecretKey">
        <Input v-model="formItem.nextSecretKey" placeholder="请输入线下密钥" style="width: 300px"></Input>
      </FormItem>
      <FormItem label="线下密钥1：" prop="nextAppKey">
        <Input v-model="formItem.nextAppKey" placeholder="请输入线下密钥1" style="width: 300px"></Input>
      </FormItem>
      <FormItem label="线下密钥2：" prop="nextVersion">
        <Input v-model="formItem.nextVersion" placeholder="请输入线下密钥2" style="width: 300px"></Input>
      </FormItem>-->
      <FormItem>
        <Button type="primary" @click="submit">保存</Button>
        <!-- <Button type="ghost" style="margin-left: 8px">取消</Button> -->
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
export default {
  mounted() {
    apiGet("/marketing/api/yearCardConfig/selectCofig").then(res => {
      if (res && res.data) {
        let item = res.data.find(item => item.type == "xx_url");
        if (item) {
          //线下地址
          this.formItem.id = item.id;
          this.formItem.nextRequestAddress = item.nextRequestAddress;
        } else {
          this.formItem.id = "";
          this.formItem.nextRequestAddress = "";
        }
        let wtitem = res.data.find(item => item.type == "wt_url");
        if (wtitem) {
          //常见问题
          this.formItem.wtid = wtitem.id;
          this.formItem.wtUrl = wtitem.nextRequestAddress;
        } else {
          this.formItem.wtid = "";
          this.formItem.wtUrl = "";
        }
      } else {
      }
    });
  },
  data() {
    return {
      ruleComplteForm: {
        nextRequestAddress: [
          { required: true, message: "请填写线下请求地址", trigger: "blur" }
        ],
        wtUrl: [
          { required: true, message: "请填写常见问题地址", trigger: "blur" }
        ]
        // nextSecretKey: [
        //   { required: true, message: "请填写线下密钥", trigger: "blur" }
        // ],
        // nextAppKey: [
        //   { required: true, message: "请填写线下密钥1", trigger: "blur" }
        // ],
        // nextVersion: [
        //   { required: true, message: "请填写线下密钥2", trigger: "blur" }
        // ]
      },
      formItem: {
        id: "", //xxid
        nextRequestAddress: "", //XXURL
        wtid: "",
        wtUrl: ""
        // nextSecretKey: "",
        // nextAppKey: "",
        // nextVersion: ""
      }
    };
  },
  methods: {
    submit() {
      let arr = [];
      if (this.formItem.nextRequestAddress) {
        //线下滴啊会
        arr.push({
          id:this.formItem.id,
          nextRequestAddress: this.formItem.nextRequestAddress,
          type: "xx_url"
        });
      }
      if (this.formItem.wtUrl) {
        //通知
        arr.push({
          id:this.formItem.wtid,
          nextRequestAddress: this.formItem.wtUrl,
          type: "wt_url"
        });
      }
      apiPostJson("/marketing/api/yearCardConfig/saveCofigList",arr).then(res=>{
        console.log(res)
        if(res.status==200){
          this.$Message.success("配置成功！")
          this.$router.back()
        }else{
          this.$Message.warning(res.message)
        }
      });
      // let _this = this;
      // this.formItem.nextRequestAddress = this.formItem.nextRequestAddress.trim();
      // let url = "/marketing/api/yearCardConfig/saveCofig";
      // this.common.formPost(this, {
      //   url,
      //   params: this.formItem,
      //   mold: "page",
      //   callback(res) {
      //     if (res.status == 200) {
      //       _this.$Message.success("保存成功!");
      //       _this.$router.back();
      //       // _this.$router.push("/publishParkTicket");
      //     }
      //   }
      // });
    }
  }
};
</script>