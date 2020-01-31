<template>
    <div class="zybDistCorp">
        <Form :model="formItem" ref="formItem" :lable-width="250" :rules="ruleForm">
            <template v-if="flag">
                <FormItem label="智游宝分销商企业码：">
                    <span>{{formItem.distCorpCode}}</span>
                </FormItem>
                <FormItem label="智游宝分销商企业私钥：">
                    <span>{{formItem.distCorpKey}}</span>
                </FormItem>
                <FormItem label="智游宝分销商用户名：">
                    <span>{{formItem.distZybUserName}}</span>
                </FormItem>
            </template>
            <template v-else>
                <FormItem label="智游宝分销商企业码：" prop="distCorpCode">
                    <Input v-model="formItem.distCorpCode" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="智游宝分销商企业私钥：" prop="distCorpKey">
                    <Input v-model="formItem.distCorpKey" style="width:33%;"></Input>
                </FormItem>
                <FormItem label="智游宝分销商用户名：" prop="distZybUserName">
                    <Input v-model="formItem.distZybUserName" style="width:33%;"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit">提交</Button>
                </FormItem>
            </template>

        </Form>
    </div>
</template>

<script>
import { apiGet, apiPost } from "@/fetch/api.js";
export default {
  data() {
    return {
        flag:false,
      formItem: {
        distCorpCode: "",
        distCorpKey: "",
        distZybUserName: ""
      },
      ruleForm: {
        distCorpCode: [
          {
            required: true,
            message: "请填写智游宝分销商企业码",
            trigger: "blur"
          }
        ],
        distCorpKey: [
          {
            required: true,
            message: "请填写智游宝分销商企业私钥",
            trigger: "blur"
          }
        ],
        distZybUserName: [
          {
            required: true,
            message: "请填写智游宝分销商用户名",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    apiGet("/admin/webapi/userConfig/edit?id=").then(res => {
      if (res.status==200) {
          if(res.data.userConfig.distCorpCode!=""){
        this.flag=true
          }else{
             this.flag=false 
          }
        this.formItem = res.data.userConfig;
      }
    });
  },
  methods: {
    submit() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          apiPost(
            "/admin/webapi/userConfig/userConfigSave",
            this.formItem
          ).then(res => {
            if (res.status == 200) {
              this.$Message.success("操作成功");
            }else{
                 this.$Message.warning(res.message);
            }
          });
        }
      });
    }
  }
};
</script>


<style >
.zybDistCorp {
  width: 100%;
  padding-left: 100px;
}
</style>

