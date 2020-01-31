
<template>
  <div class="zybDistCorp">
    <Form :model="formItem" label-position="right" ref="formItem" :label-width="100" :rules="ruleForm">
      <FormItem label="appId：" prop="appId">
        <Input v-model="formItem.appId" style="width:300px;"></Input>
      </FormItem>
      <FormItem label="appSecret：" prop="appSecret">
        <Input v-model="formItem.appSecret" style="width:300px;"></Input>
      </FormItem>
      <FormItem label="code：" prop="code">
        <Input v-model="formItem.code" style="width:300px;"></Input>
      </FormItem>
      <FormItem label="corpSecret：" prop="corpSecret">
        <Input v-model="formItem.corpSecret" style="width:300px;"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submit">提交</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { apiGet } from '@/fetch/api.js'
export default {
  data () {
    return {
      code: '',
      formItem: {
        userName: localStorage.getItem('phone'),
        appId: '',
        appSecret: '',
        code: '',
        corpSecret: ''
      },
      ruleForm: {
        appId: [{ required: true, message: "请输入appId", trigger: "blur" }],
        appSecret: [
          { required: true, message: "请输入appSecret", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入code", trigger: "blur" }],
        corpSecret: [
          { required: true, message: "请输入corpSecret", trigger: "blur" }
        ]
      }
    }
  },
  created:function(){
    this.getCode()
  },
  mounted:function(){
    console.log();
  },
  methods: {
    submit () {
      let _this = this;
      _this.formItem.appid=_this.formItem.appId;
      _this.common.formPost(_this, {
        url: '/rmsrepast/repast/bindRmsAccountInfo',
        params: _this.formItem,
        callback (res) {
          if (res.status == 200) {
            _this.$Message.success(res.message);
          } else {
            console.log(res)
            _this.$Message.warning(res.message);
          }
        }
      });
    },
    async getCode () {
      let useInfo = await apiGet('/admin/userStore/detail')
      let userName = ''
      if (useInfo.success && useInfo.user) {
        userName = useInfo.user.name
        this.formItem.userName = userName
      }
      console.log(userName)
      // apiGet('/rmsrepast/repast/getRmsAccountInfo?userName=' + userName).then(
      apiGet('/rmsrepast/repast/getRmsAccountInfo?userName=' + userName).then(
        res => {
          console.log(res)
          if (res.status == 200) {
            let form = {}
            if (res.data && res.data.length) {
              res.data.map(v => {
                form[v.payKey] = v.payValue
              })
              this.formItem = Object.assign(this.formItem, form)
            }
          } else {
            this.$Message.warning(res.message)
          }
        }
      )
    }
  }
}
</script>
<style >
.zybDistCorp {
  width: 100%;
  padding-left: 100px;
}
</style>

