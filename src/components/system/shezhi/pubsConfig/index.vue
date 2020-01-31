<template>
    <div class="zybDistCorp">
        <Form :model="formItem" label-position="right" ref="formItem" :label-width="100" :rules="ruleForm">
            <FormItem label="中台appid：" prop="pus_appId">
                <Input v-model="formItem.pus_appId" style="width:30%;"></Input>
            </FormItem>
            <FormItem label="中台私钥：" prop="pus_privateKey">
                <Input v-model="formItem.pus_privateKey" style="width:30%;"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { apiGet,apiPost } from "@/fetch/api.js";
export default {
    data(){
        return{
            formItem:{
                pus_appId:'',
                pus_privateKey:''
            },
            ruleForm: {
                pus_appId:[
                    {required:true,message:"请输入中台appid",trigger:"blur"}
                ],
                pus_privateKey:[
                    {required:true,message:"请输入中台私钥",trigger:"blur"}
                ],
            }
        }
    },created(){
        apiGet('/admin/userPayInfo/pubsEditFL').then(res=>{
            if(res.status==200){
                this.formItem=res.data.pubsConfig
            }else{
                this.$Message.warning(res.message);
            }
        })
    },
    methods: {
        submit() {
            let _this = this
            _this.common.formPost(_this, {
                url: "/admin/userPayInfo/pubsSaveFL",
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

