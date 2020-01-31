<template>
  <div class="zybDistCorp">
    <div v-if='noBuyShow'>
      <no-buy></no-buy>
    </div>
    <Form v-else
          :model="formItem"
          label-position="right"
          ref="formItem"
          :label-width="160"
          :rules="ruleForm">
      <FormItem label="是否启用：">
        <RadioGroup v-model="formItem.enable">
          <Radio label="F">关闭</Radio>
          <Radio label="T">开启</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="类别："
                prop="apiType">
        <Select v-model="formItem.apiType"
                style="width:61.8%;">
          <Option v-for="(item,index) in types"
                  :value="item.value"
                  :key="index">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="账号名称："
                prop="appId">
        <Input :maxlength='60'
               v-model="formItem.appId"
               style="width:61.8%;"></Input>
      </FormItem>
      <FormItem label="接口公钥："
                prop="appKey">
        <Input :maxlength='60'
               v-model="formItem.appKey"
               style="width:61.8%;"></Input>
      </FormItem>
      <FormItem label="接口私钥："
                prop="secretKey">
        <Input :maxlength='60'
               v-model="formItem.secretKey"
               style="width:61.8%;"></Input>
      </FormItem>
      <FormItem label="其他："
                prop="comment">
        <Input :maxlength='60'
               v-model="formItem.comment"
               style="width:61.8%;"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit">确定</Button>
        <!-- <Button type="ghost" @click='cancel'>取消</Button> -->
      </FormItem>
    </Form>
  </div>
</template>

<script>
import noBuy from '@/components/marketing-center/notBuyService'
export default {
  data () {
    return {
      types: [],
      noBuyShow: false,
      formItem: {
        apiType: '',
        enable: 'F',
        appId: '',
        appKey: '',
        secretKey: '',
        comment: ''
      },
      ruleForm: {
        apiType: [
          { required: true, message: '请选择类别', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '请输入账号名称', trigger: 'blur' }
        ],
        appKey: [
          { required: true, message: '请输入接口私钥', trigger: 'blur' }
        ],
        secretKey: [
          { required: true, message: '请输入接口公钥', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.apiGet('/admin/api/sysParam/changeList', {
      key: 'aipType'
    }).then(res => {
      if (res.status == 200) {
        if (res.data) {
          this.types = res.data
          this.types.map(item => {
            item.label = item.value
            item.value = item.key
          })
        }
      } else {
        if (res.status == 402) {
          this.noBuyShow = true
        } else {
          this.$Message.warning(res.message)
        }
      }
    })
    this.getIdCard()
  },
  components: { noBuy },
  methods: {
    getIdCard () {
      this.apiGet('/marketing/webApi/marketBaiduService/idCardSelect').then(res => {
        if (res.status == 200) {
          if (res.data) {
            this.formItem = res.data
            this.formItem.apiType = String(this.formItem.apiType)
          }
        } else {
          if (res.status == 402) {
            this.noBuyShow = true
          } else {
            this.$Message.warning(res.message)
          }
        }
      })
    },
    cancel () {
      // let _this = this;
      // delete this.formItem.createTime
      // delete this.formItem.modifyTime
      // apiGet("/marketing/webApi/marketBaiduService/idCardDel").then(res => {
      //     if(res.status==200){
      //         this.$Message.success("删除成功!");
      //         this.getIdCard();
      //     }else{
      //         this.$Message.warning(res.message)
      //     }
      // });
    },
    submit () {
      let _this = this
      delete _this.formItem.createTime
      delete _this.formItem.modifyTime
      _this.$refs.formItem.validate(vaild => {
        if (vaild) {
          this.apiGet('/marketing/webApi/marketBaiduService/idCardEdit', _this.formItem).then(res => {
            if (res.status == 200) {
              _this.$Message.success('保存成功!')
              this.getIdCard()
            } else {
              _this.$Message.warning(res.message)
            }
          })
        } else {
        }
      })
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
