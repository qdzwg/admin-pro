<template>
  <div>
    <Form :model="formItem"
          :label-width="120"
          :rules="ruleValidate"
          ref="formValidate">
      <FormItem label="订单编号：">
        {{orderInfo.orderNo}}
      </FormItem>
      <FormItem label="买家地址：">
        {{orderInfo.linkAddr}}
      </FormItem>
      <FormItem label="需发货物品信息：">
        <div v-if="details.length"
             v-for="detail in details"
             :key="detail.id">
        <Row v-if="detail.leftAmount">
          <Col>
          {{detail.orderInfo}}
          <span v-if="detail.mdseDetail">
            规格信息：{{detail.mdseDetail.specParam}}
          </span>
          </Col>
        </Row>
        </div>
      </FormItem>
      <FormItem label="物流类型："
                prop="expressType">
        <Select v-model="formItem.expressType"
                style="width:200px;"
                transfer>
          <Option v-for="item in expressList"
                  :key="item.key"
                  :value="item.key">{{item.value}}</Option>
        </Select>
      </FormItem>
      <FormItem label="物流单号："
                prop="expressNo"
                v-if="formItem.expressType!='sjtcps'">
        <Input v-model="formItem.expressNo"
               placeholder="请填写物流单号..."></Input>
      </FormItem>
      <FormItem label="发货信息："
                prop="expressMsg"
                v-if="formItem.expressType=='sjtcps'">
        <Input v-model="formItem.expressMsg"
               type="textarea"
               :maxlength=100
               placeholder="请填写发货信息..."></Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formItem: {
        orderId: '',
        orderNo: '',
        expressType: ''
      },
      details: [],
      expressList: [],
      orderInfo: '',
      ruleValidate: {
        expressType: [{
          required: true, message: '请选择物流类型', trigger: 'change'
        }],
        expressNo: [
          { required: true, message: '请填写物流单号', trigger: 'blur' }
        ],
        expressMsg: [
          { required: true, message: '请填写发货信息', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['result'],
  watch: {
    result () {
      this.details = this.result.details
      this.expressList = this.result.expressType
      this.orderInfo = this.result.orderInfo
      this.formItem.orderId = this.result.orderInfo.id
      this.formItem.orderNo = this.result.orderInfo.orderNo
      this.$refs.formValidate.resetFields()
    }
  },
  methods: {
    handleSubmit () {
      let deliverData = false
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          deliverData = this.formItem
        }
      })
      return deliverData
    },
    rest (value) {
      this.$refs['formValidate'].resetFields()
    }
  }
}
</script>
