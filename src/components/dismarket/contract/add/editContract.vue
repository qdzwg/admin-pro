<template>
    <div class="editContract">
        <Form :model="formItem" label-position="right" :label-width="120">
            <FormItem label="分销商：">
                {{formItem.distName}}
            </FormItem>
            <FormItem label="合同模板：">
                {{formItem.contractTemplateName}}
            </FormItem>
            <FormItem label="合同名称：">
                {{formItem.contractName}}  
            </FormItem>
            <FormItem label="合同期限：">
                <div v-if="formItem.contractStartTimeStr">
                    <span>{{formItem.contractStartTimeStr}}</span>   
                <span>-</span>
            <span>{{formItem.contractEndTimeStr}}</span>
                </div>
             
                
            </FormItem>
            <FormItem label="合同内容预览：">
                <div v-html="formItem.contractContent"></div>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="back">返回</Button>
            </FormItem>
        </Form>
        
    </div>
</template>

<script>
import { apiGet } from "@/fetch/api";
export default {
  data() {
    return {
      
      formItem: {
      },
    };
  },
  created(){
      if(this.$route.query.id){
           apiGet('/admin/webApi/suppContract/selectById?contractId='+this.$route.query.id).then(res=>{
                     this.formItem=res.data
            })
      }else if(this.$route.query.contractId){
           apiGet('/admin/webApi/distContract/selectById?contractId='+this.$route.query.contractId).then(res=>{
                     this.formItem=res.data
            })
      }
  },
  methods:{
      back(){
          this.$router.back()
      }
  }

  
};
</script>

<style lang="scss">

</style>


