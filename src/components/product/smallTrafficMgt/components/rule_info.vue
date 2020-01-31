<template>
  <div>
    <Modal
    v-model="ruleShow"
    title="规则查看"
    :mask-closable='false'
    class-name="modal-wrap"
    :width="800"
    @on-cancel="cancelFun">
    <div>
      <h3 class="edit-title">购买规则</h3>
      <Form ref="formValidate"  :model="ruleBuy" :label-width="160" >
        <FormItem label="规则名称：">{{ruleBuy.name}}</FormItem>
        <FormItem label="可购时间限制：">{{ruleBuy.buyFarthestType == 'any'?"不限":(ruleBuy.buyFarthestDay+'天')}}</FormItem>
        <FormItem label="提前预定天数：">{{ruleBuy.earlyBookDay}}天</FormItem>
        <FormItem label="是否实名制：">{{ruleBuy.isRealnameAuth == 'T' ? '是':'否'}}</FormItem>
        <FormItem label="结束售票时间：">发车时间前{{ruleBuy.buyFartMinute}}分钟/开始检票</FormItem>
        <FormItem label="备注：">{{ruleBuy.remark}}</FormItem>
      </Form>
      <h3 class="edit-title">售后规则</h3>
      <Form ref="formValidate"  :model="ruleSold" :label-width="160" >
        <!-- <FormItem label="规则类型：">{{ruleSold.type=='buy'?'购买':(ruleSold.type=='return'?'退单':ruleSold.type=='endorse'?'改签':'')}}</FormItem> -->
        <FormItem label="规则名称：">{{ruleSold.name}}</FormItem>
        <FormItem label="是否可退：">{{ruleSold.isRetreat == 'T' ? '是':'否'}}</FormItem>
        <FormItem label="退单时间限制：" v-show="ruleSold.isRetreat == 'T'">{{ruleSold.retreatPeriodType === '0'?'提前退票':(ruleSold.retreatPeriodType === '1'?'不限':(ruleSold.retreatPeriodType === '2'?'不限':''))}}</FormItem>
        <FormItem label="退单是否收取手续费：" v-show="ruleSold.isRetreat == 'T'">{{ruleSold.isReCommission == 'T' ? '是':'否'}}</FormItem>
        <FormItem label="手续费设置：" v-show="ruleSold.isRetreat == 'T'&&ruleSold.isReCommission == 'T'">
          <div>{{ruleSold.refundChargeType==1?'按比例':'固定值'}}</div>
          <div v-if='ruleSold.ruleSoldRefundCharges&&ruleSold.ruleSoldRefundCharges.length'>{{(ruleSold.ruleSoldRefundCharges[0].refundType==1?'延后':'提前')+(ruleSold.refundChargeType==1?ruleSold.ruleSoldRefundCharges[0].refundChargeDay:ruleSold.ruleSoldRefundCharges[0].refundChargeFixedDay)}}天，收{{ruleSold.refundChargeType==1?(ruleSold.ruleSoldRefundCharges[0].refundChargeRelativeRate+'%'):(ruleSold.ruleSoldRefundCharges[0].refundChargeFixedRate+'元')}}</div>
        </FormItem>
      <h3 class="edit-title">改签规则</h3>
        <FormItem label="是否可改：">{{ruleSold.isChange == 'T' ? '是':'否'}}</FormItem>
        <FormItem label="改签是否收取手续费：" v-show="ruleSold.isChange == 'T'">{{ruleSold.isChCommission == 'T' ? '是':'否'}}</FormItem>
        <FormItem label="手续费设置：" v-show="ruleSold.isChange == 'T'&&ruleSold.isChCommission == 'T'">
          <div>{{ruleSold.changeChargeType==1?'按比例':'固定值'}}</div>
          <div v-if='ruleSold.ruleSoldChangeCharges&&ruleSold.ruleSoldChangeCharges.length'>{{(ruleSold.ruleSoldChangeCharges[0].changeType==1?'延后':'提前')+(ruleSold.changeChargeType==1?ruleSold.ruleSoldChangeCharges[0].changeChargeDay:ruleSold.ruleSoldChangeCharges[0].changeChargeFixedDay)}}天，收{{ruleSold.changeChargeType==1?(ruleSold.ruleSoldChangeCharges[0].changeChargeRelativeRate+'%'):(ruleSold.ruleSoldChangeCharges[0].changeChargeFixedRate+'元')}}</div>
        </FormItem>
        <FormItem label="备注：">{{ruleSold.remark}}</FormItem>
      </Form>
    </div>
    <div slot='footer'>
      <Button type="primary" @click="cancelFun">关闭</Button>
    </div>
  </Modal>
    
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex'
import Img from './uploadFile.vue'
import common from '@/common/index.js'
import uEditor from '@/components/global/vueUEditor.vue'
export default {
  components: { Img, uEditor },
  props: {
    ruleShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  watch: {},
  computed: {
    ...mapState('lineManage/', {
      ruleSold: state => state.ruleSold,
      ruleBuy: state => state.ruleBuy
    })
  },
  methods: {
    ...mapMutations('lineManage/', ['setRuleInfo']),
    cancelFun () {
      this.$emit('ruleClose')
    },
  },
  created () { },
  mounted () {

  }
}
</script>
<style lang="scss" scoped>
.edit-title{
  margin-bottom: 12px;
  background: #dedbdb;
  padding: 5px;
  border-left: 4px solid #64b6ff;
  font-size: 16px;
}
.tip-none{
  height:0;
  overflow: hidden;
  position: absolute;
}
.pic-tip{
  display: flex;
  align-items: center;
  .tip{
    margin-left:6px;
    margin-bottom:12px;
    white-space: nowrap;
  }
}

.require-icon{
    position: absolute;
    top: 2px;
    left: -70px;
    z-index: 99;
    font-size: 14px;
    color: red;
}
</style>
