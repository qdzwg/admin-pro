<template>
    <div class="zybDistCorp">
        <Form :model="formItem" label-position="right" ref="formItem" :label-width="100" :rules="ruleForm">
            <FormItem label="企业编码：" prop="storeCode">
                <Input v-model="formItem.storeCode" style="width:30%;"></Input>
            </FormItem>
            <FormItem label="主账号：" prop="accountCode">
                <Input v-model="formItem.accountCode" style="width:30%;"></Input>
            </FormItem>
            <FormItem label="key值：" prop="privateKey">
                <Input v-model="formItem.privateKey" style="width:30%;"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { apiGet, apiPost } from '@/fetch/api.js'
export default {
  data () {
    return {
      formItem: {
        storeCode: '',
        accountCode: '',
        privateKey: '',
      },
      ruleForm: {
        storeCode: [
          {required: true, message: '请输入企业编码', trigger: 'blur'}
        ],
        accountCode: [
          {required: true, message: '请输入主账号', trigger: 'blur'}
        ],
        privateKey: [
          {required: true, message: '请输入key值', trigger: 'blur'}
        ],
      }
    }
  },
  created () {
    apiPost('/admin/webApi/userPayInfo/trafficEdit').then(res => {
      if (res.status == 200) {
        this.formItem.storeCode = res.data.storeCode;
        this.formItem.accountCode = res.data.accountCode;
        this.formItem.privateKey = res.data.privateKey;
      } else {
        this.$Message.warning(res.message)
      }
    })
  },
  methods: {
    submit () {
      let _this = this;
      _this.common.formPost(_this, {
        url: '/admin/webApi/userPayInfo/trafficSave',
        params: _this.formItem,
        callback (res) {
          if (res.status == 200) {
            _this.$Message.success(res.message)
          } else {
            _this.$Message.warning(res.message)
          }
        }
      })
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
