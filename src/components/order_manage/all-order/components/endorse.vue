<template>
  <div>
    <Table border
           ref="selection"
           :columns="columns"
           :data="data"
           :loading="loading"
           @on-current-change="changeSelection"
           highlight-row></Table>
    <Form :model="endorseForm"
          :label-width="120"
          style="margin-top:20px;"
          :rules="ruleValidate"
          ref="endorseForm"
          inline>
      <FormItem label="改签游玩时间："
                prop="startTime">
        <DatePicker type="date"
                    placeholder="选择改签时间"
                    v-model="endorseForm.startTime"
                    format="yyyy-MM-dd"
                    @on-change="changeDate"
                    :transfer="true"></DatePicker>
      </FormItem>
      <FormItem label="游玩时段："
                prop="fsTime"
                v-if="divisionTime.length">
        <Select v-model="endorseForm.fsTime"
                :transfer="true">
          <Option v-for="item in divisionTime"
                  :key="item.startTime"
                  :value="item.startTime+'-'+item.endTime">{{item.startTime}} - {{item.endTime}}</Option>
        </Select>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import realName from './realName'
import { apiPost } from '@/fetch/api'
export default {
  data () {
    return {
      columns: [
        {
          title: '产品名称',
          key: 'orderInfo',
          render: (h, params) => {
            let text = params.row.orderInfo
            if (params.row.orderType === 'route' && params.row.detailType === '0') {
              text += '【成人票】'
            } else if (params.row.orderType === 'route' && params.row.detailType === '1') {
              text += '【儿童票】'
            }
            return h('span', text)
          }
        },
        {
          title: '子订单号',
          key: 'orderDetailNo',
          width: 120
        },
        {
          title: '游玩日期',
          key: 'startDate',
          render: (h, params) => {
            return h('span', this.filter.formatDate(params.row.startDate, 'yyyy-MM-dd'))
          }
        },
        {
          title: '总数量',
          key: 'amount'
        },
        {
          title: '已消费数量',
          key: 'checkAmount'
        },
        {
          title: '已退数量',
          key: 'refundAmount'
        }

      ],
      data: [],
      loading: true,
      endorseForm: {
        startTime: ''
      },
      ruleValidate: {
        startTime: { required: true, type: 'date', message: '请选择改签时间', trigger: 'change' }
      },
      selection: '',
      divisionTime: [],
      merchantInfoId: ''
    }
  },
  props: ['result'],
  watch: {
    result () {
      let expand =
        {
          title: '实名制信息',
          type: 'expand',
          render: (h, params) => {
            if (params.row.orderDetailModels && params.row.orderDetailModels.length > 0) {
              return h(realName, {
                props: {
                  row: params.row.orderDetailModels
                }
              })
            }
          }
        }
      this.columns.forEach((el, num) => {
        if (el.type === 'expand') {
          this.columns.splice(num, 1)
        }
      })
      // this.result.details[0]['_disableExpand'] = true
      let flag = false
      this.result.details.forEach((element, index) => {
        if (element.orderDetailModels && element.orderDetailModels.length) {
          this.result.details[index]['_disableExpand'] = false
          flag = true
        } else {
          this.result.details[index]['_disableExpand'] = true
        }
      })
      if (flag) {
        this.columns.push(expand)
      }
      this.data = this.result.details
      this.merchantInfoId = this.result.merchantInfoId
      this.externalCodes = this.result.externalCodes
      this.endorseForm.startTime = ''
      this.selection = ''
      this.loading = false
    }
  },
  components: { realName },
  methods: {
    handleSubmit () {
      let checkData = this.endorseForm
      if (!this.selection) {
        this.$Message.error('请选择改签记录！')
        return
      }
      this.$refs['endorseForm'].validate((valid) => {
        if (valid) {
          checkData = this.endorseForm
          checkData.orderId = this.selection.orderId
          checkData.detailId = this.selection.id
        } else {
          checkData = false
        }
      })
      return checkData
    },
    async changeSelection (selection) {
      this.selection = selection
      if (this.merchantInfoId && selection.startDate && this.externalCodes[selection.modelCode]) {
        let res = apiPost('/order/api/timeReserveList', {
          externalCode: this.expCode[selection.modelCode],
          startTime: selection.startDate,
          endTime: selection.startDate,
          merchantInfoId: this.merchantInfoId
        })
        if (res.status === 200 && res.data) {
          this.divisionTime = res.data
        }
      }
    },
    changeDate (date) {
      this.endorseForm.startDate = date
    },
    rest (value) {
      this.$refs['endorseForm'].resetFields()
    }
  }
}
</script>
