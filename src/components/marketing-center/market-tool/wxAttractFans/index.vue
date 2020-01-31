<template>
    <div class="zybDistCorp">
        <div v-if='noBuyShow'>
            <no-buy></no-buy>
        </div>
        <Form v-else :model="formItem" label-position="right" ref="formItem" :label-width="160" :rules="ruleForm">
            <FormItem label="购票吸粉功能：">
              <RadioGroup v-model="formItem.status">
                  <Radio label="F">关闭</Radio>
                  <Radio label="T">开启</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="关联公众号名称：" prop="publicName">
                <Input :maxlength='60' v-model="formItem.publicName" style="width:30%;"></Input>
            </FormItem>
            <FormItem label="关联公众号微信：" prop="publicWxNumbel">
                <Input :maxlength='60' v-model="formItem.publicWxNumbel" style="width:30%;"></Input>
            </FormItem>
            <FormItem label="关联公众号其他设置：" prop="extend">
                <Input :maxlength='60' v-model="formItem.extend" style="width:30%;"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { apiGet,apiPost } from "@/fetch/api.js";
import noBuy from "@/components/marketing-center/notBuyService";
export default {
    data(){
        return{
            noBuyShow: false,
            formItem:{
                status: "F",
                publicName: '',
                publicWxNumbel: '',
                extend: '',
            },
            ruleForm: {
                publicName:[
                    {required:true,message:"请输入关联公众号名称",trigger:"blur"}
                ],
                publicWxNumbel:[
                    {required:true,message:"请输入关联公众号微信",trigger:"blur"}
                ],
            }
        }
    },created(){
        apiGet('/marketing/webApi/wxAttractFansTob/getConfigInfo').then(res=>{
            if(res.status==200){
              if(res.data){
                this.formItem = res.data
                this.formItem.status = this.formItem.status?this.formItem.status:'F'
              }
            }else{
                if(res.status == 402){
                    this.noBuyShow = true;
                }else{
                    this.$Message.warning(res.message);
                }
            }
        })
    },
    components: { noBuy },
    methods: {
        submit() {
            let _this = this;
            delete this.formItem.createTime
            delete this.formItem.modifyTime
            _this.common.formPost(_this, {
                url: "/marketing/webApi/wxAttractFansTob/saveConfigInfo",
                params: _this.formItem,
                callback(res) {
                  if (res.status==200) {
                    _this.$Message.success(res.message);
                  } else {
                    _this.$Message.warning(res.message);
                  }
                }
            });
        }
    }
}
</script>


<style >
.zybDistCorp{
    width:100%;
    padding-left:100px;
}
</style>

