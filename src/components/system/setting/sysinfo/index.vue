<template>
    <div class="sysinfo" style="width:800px;margin:0 auto;">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
          <FormItem label="系统名称：" prop="sysName">
            <Input v-model="formItem.sysName" ></Input>
          </FormItem>
         <FormItem label="系统版本号：" prop="sysVersion">
            <Input v-model="formItem.sysVersion" ></Input>
          </FormItem>
          <FormItem label="登录界面图片：">              
              <upload :multiple="true"></upload>
          </FormItem>
          <FormItem label="logo图片：">
              <upload :multiple="true"></upload>
          </FormItem>
          <FormItem >
              <Button type="primary" @click="ok">保存</Button>
          </FormItem>
        </Form>
    </div>
</template>

<script>
import upload from '@/components/global/upload'
export default {
    data(){
        return{
            formItem:{
                sysName:'',
                sysVersion:'',
            },
            ruleForm: {
            sysName: [
            {required: true, message: '请输入系统名称', trigger: 'blur'}
            ],
            sysVersion:[
                {required: true, message: '请输入系统版本号', trigger: 'blur'}
            ]
        }
        }
    },
    components:{
        upload
    },
    methods:{
        ok () {
            this.formItem.accType = 0
            this.formItem.useFlag = this.formItem.switch ? 1 : 0
            let _this = this
            let url =  'list/admin/sysAnnouncement/saveRole'
            this.common.formPost(this, {
                url,
                params: this.formItem,
                mold: 'modal',
                callback (res) {
                if (res.success) {
                    _this.modal = false
                }
                }
            })
        },
    }
}
</script>

