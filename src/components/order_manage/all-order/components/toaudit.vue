<template>
  <div class="newtable">
    <Form ref="toauditForm"
          :model="toaudit"
          :rules="ruleInline">
      <table class="table"
             border
             width=100%>
        <tr>
          <td class="title">订单号：</td>
          <td><span class="fontweight">{{refundAudit.orderNo}}</span></td>
          <td class="title">退单类别：</td>
          <td><span class="fontweight">{{refundTypeMap[refundAudit.refundType]}}</span></td>
          <td class="title">产品名称：</td>
          <td><span class="fontweight">{{refundAudit.info}} <span v-if="mdse">规格信息:{{mdse.specParam}}</span></span></td>
        </tr>
        <template v-if="orderInfo.orderType == 'theater_ticket'">
          <tr>
            <td class="title">演出日期：</td>
            <td><span class="fontweight">{{theaterMap.showTime}}</span></td>
            <td class="title">场次：</td>
            <td><span class="fontweight">{{theaterMap.placeAndTime}}</span></td>
            <td class="title">座位号：</td>
            <td><span class="fontweight">{{theaterMap.refundSeats}}</span></td>
          </tr>
        </template>
        <tr>
          <td class="title">订单金额(元)：</td>
          <td><span class="fontweight">{{refundAudit.orderSum}}</span></td>
          <td class="title">退单金额(元)：</td>
          <td><span class="fontweight">{{refundAudit.refundSum}}</span></td>
          <td class="title">手续费(元)：</td>
          <td v-if='inputRefundFee'>
            <InputNumber :precision="2"
                         :max="refundAudit.refundSum"
                         v-model="refundAudit.refundFee"
                         style="width:120px"></InputNumber>
          </td>
          <td v-else><span class="fontweight">{{refundAudit.refundFee}}</span></td>
        </tr>
        <tr v-if="refundAudit.reason">
          <td class="title">退单理由：</td>
          <td colspan="5"><span class="fontweight">{{refundAudit.reason}}</span></td>
        </tr>
        <tr v-if="orderInfo.orderType == 'hotel'">
          <td class="title">入住-离店日期：</td>
          <td colspan="5"><span class="fontweight">{{orderInfo.startTime | formatDate('yyyy-MM-dd')}} ~ {{orderInfo.endTime | formatDate('yyyy-MM-dd')}}</span></td>
        </tr>
        <tr v-else-if="orderInfo.orderType == 'park'">
          <td class="title">游玩日期：</td>
          <td colspan="5"><span class="fontweight">{{refundAudit.travelDate | formatDate('yyyy-MM-dd')}}</span></td>
        </tr>
        <tr>
          <td class="title">审核结果：</td>
          <td colspan="5">
            <FormItem style="margin-bottom:0;">
              <RadioGroup v-model="toaudit.audit">
                <Radio label="1">
                  <span>通过</span>
                </Radio>
                <Radio label="2">
                  <span>驳回</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </td>
        </tr>
        <tr v-if="toaudit.audit=='2'">
          <td class="title">驳回理由：</td>
          <td colspan="5">
            <FormItem prop="rejectReason"
                      style="margin-bottom:0;"
                      required>
              <Input v-model="toaudit.rejectReason"
                     type="textarea"
                     placeholder="请填写驳回理由..."
                     :maxlength="100"></Input>
            </FormItem>
          </td>
        </tr>
      </table>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      refundAudit: '',
      orderInfo: '',
      refundTypeMap: '',
      mdse: '',
      theaterMap: '',
      inputRefundFee: false,
      toaudit: {
        audit: '1',
        rejectReason: ''
      },
      ruleInline: {
        refundFee: [
          { required: true, message: '请输入手续费', trigger: 'blur' }
        ],
        rejectReason: [
          { required: true, message: '请输入驳回理由', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['result'],
  watch: {
    result () {
      this.inputRefundFee = this.result.inputRefundFee
      this.orderInfo = this.result.orderInfo
      this.refundAudit = this.result.refundAudit
      this.refundTypeMap = this.result.refundTypeMap
      this.mdse = this.result.mdse
      this.theaterMap = this.result.theaterMap
    }
  },
  methods: {
    handleSubmit () {
      let checkData = this.toaudit
      console.log(this.inputRefundFee)
      if (this.inputRefundFee) {
        if (!this.refundAudit.refundFee && this.refundAudit.refundFee !== 0) {
          this.$Message.warning('请填写手续费！')
          return
        }
        checkData.refundFee = this.refundAudit.refundFee
      }
      checkData.refundNo = this.refundAudit.refundNo
      checkData.orderNo = this.orderInfo.orderNo
      this.$refs['toauditForm'].validate((valid) => {
        if (valid) {
          checkData = this.toaudit
        } else {
          checkData = false
        }
      })
      return checkData
    },
    rest () {
      this.$refs['toauditForm'].resetFields()
    }
  }
}
</script>
