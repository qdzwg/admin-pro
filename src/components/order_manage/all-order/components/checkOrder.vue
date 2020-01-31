<template>
  <div class="newtable">
    <h4 class="table-title">订单信息</h4>
    <table class="table"
           border
           width=100%>
      <tr>
        <td class="title">订单编号</td>
        <td colspan="3"><span class="fontweight">{{orderInfo.orderNo}}</span></td>
      </tr>
      <tr>
        <td class="title">联系人</td>
        <td><span class="fontweight">{{orderInfo.linkName || '无'}}</span></td>
        <td class="title">下单时间</td>
        <td><span class="fontweight">{{orderInfo.createTime}}</span></td>
      </tr>
    </table>
    <h4 class="table-title ptop">订单详情</h4>
    <Table border
           size="small"
           :columns="columns"
           :data="details"></Table>
  </div>
</template>
<script>
import realName from './realName'
export default {
  data () {
    return {
      orderInfo: '',
      details: [],
      columns: [
        {
          title: '产品名称',
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
          title: '总数量',
          width: 80,
          align: 'center',
          key: 'amount'
        },
        {
          title: '已消费',
          width: 80,
          align: 'center',
          key: 'checkAmount'
        },
        {
          title: '已退',
          width: 80,
          align: 'center',
          key: 'refundAmount'
        },
        {
          title: '可核销',
          width: 80,
          align: 'center',
          key: 'leftAmount'
        },
        {
          title: '核销数量',
          width: 140,
          align: 'center',
          render: (h, params) => {
            if (params.row.orderType === 'route') {
              this.details[params.row._index].checkNum = params.row.leftAmount
              return h('span', params.row.leftAmount)
            } else {
              if(this.orderInfo.orderType == 'family'){
                if(params.row.isCanCheck=='T'){
                  return h('InputNumber', {
                    props: {
                      min: 0,
                      max: params.row.leftAmount,
                      value: 0
                    },
                    on: {
                      'on-change': (event) => {
                        this.details[params.row._index].checkNum = event
                      }
                    }
                  })
                }else{
                  return h('span', '外部订单不可手动核销')
                }    
              }else{
                return h('InputNumber', {
                  props: {
                    min: 0,
                    max: params.row.leftAmount,
                    value: 0
                  },
                  on: {
                    'on-change': (event) => {
                      this.details[params.row._index].checkNum = event
                    }
                  }
                })
              }                      
            }
          }
        }
      ]
    }
  },
  props: ['result'],
  watch: {
    result () {
      let expand =
        {
          title: '实名制',
          width: 80,
          align: 'center',
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
      let flag = false
      this.result.details.forEach((element, index) => {
        if (element.orderDetailModels && element.orderDetailModels.length) {
          this.result.details[index]['_disableExpand'] = false
          flag = true
        } else {
          this.result.details[index]['_disableExpand'] = true
        }
        element.checkNum = 0
      })
      if (flag) {
        this.columns.push(expand)
      }
      this.details = this.result.details
      this.orderInfo = this.result.orderInfo
      this.orderDetail = this.result.orderDetail
    }
  },
  components: { realName },
  methods: {
    handleSubmit () {
      let checkData = {
        id: this.orderInfo.id,
        orderType: this.orderInfo.orderType
      }
      let orderDetailId = []
      let checkAmount = []
      if(this.orderInfo.orderType=='family'){
        this.details.forEach(element => {    
          if(element.isCanCheck == 'T'){
            orderDetailId.push(element.id)
            checkAmount.push(element.checkNum||0)
          }                     
        })
      }else{
        this.details.forEach(element => {        
          orderDetailId.push(element.id)
          checkAmount.push(element.checkNum||0)           
        })
      }      
      checkData.orderDetailId = orderDetailId + ''
      checkData.checkAmount = checkAmount + ''
      return checkData
    }
  }
}
</script>
