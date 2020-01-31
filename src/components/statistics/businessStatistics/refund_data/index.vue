<template>
  <div class="refund_data">
    <statistics-list ref="gridTable"
          :tableTotal="tableTotal"
          :params="params"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></statistics-list>
  </div>
</template>

<script>
import { apiGet, apiPost, apiPostJson } from '@/fetch/api'
import statisticsList from '@/components/global/statisticsList'
export default {
  components: {
    statisticsList
  },
  data () {
    return {
      hannleItems: [
        {
          title: '导出',
          type: 'success',
          loading:false,
          //   icon: "android-add",
          callback: () => {
            let _this = this
             this.hannleItems[0].loading=true
            let obj = _this.$store.state.list.params
            // delete obj['page']
            // delete obj['limit']
            // apiPost('/statistics/refundData/grid', obj).then(res => {
            //   if (res && res.rows.length > 0) {
            //     res.rows.map(ele => {
            //       ele.orderNo = '\t' + ele.orderNo
            //       ele.thirdNo = '\t' + ele.thirdNo
            //       ele.refundTime = '\t' + ele.refundTime
            //       ele.saleType = ele.saleType == '0' ? '直营' : '分销'
            //       ele.payType = _this.filter.payType(ele.payType)
            //     })
            //     this.$refs.gridTable.exportData('退款报表', res.rows)
            //   } else {
            //     this.$Message.error('报表没有记录')
            //   }
            // })

            let str=''
            for (let ele in obj){
                str+=ele+'='+obj[ele]+'&'
            }
            var url =
              "/etlcenter/api/refundOrdersExport?"+str.substring(0, str.length-1);
               this.common.exportData("退款报表", url,()=>{
                    _this.hannleItems[0].loading=false
               },_this);
          }
        }
      ],
      searchItems: [
        {
          label: '业务类型',
          type: 'select',
          name: 'businessType',
          data: [
            {
              value: '',
              label: '--请选择业务类型--'
            },
            {
              value: "park",
              label: "景区"
            },
            {
              value: "hotel",
              label: "酒店"
            },
            {
              value: "mdse",
              label: "商品"
            },
            {
              value: "route",
              label: "跟团游"
            },
            {
              value: "eatery",
              label: "餐饮"
            },
            {
              value: "theater_ticket",
              label: "剧院"
            }
          ]
        },
        {
          label: '支付渠道',
          type: 'select',
          name: 'payType',
          data: []
        },
        {
          label: '销售类型',
          type: 'select',
          name: 'saleType',
          data: [
            {
              value: '',
              label: '--请选择销售类型--'
            },
            {
              value: '0',
              label: '直营'
            },
            {
              value: '1',
              label: '分销'
            }
          ],
          saleType: '0'
        },
        {
          label: '企业名称',
          type: 'input',
          name: 'corpName'
        },
        {
          label: '产品名称',
          type: 'input',
          name: 'productName'
        },
        {
          label: '订单编号',
          type: 'input',
          name: 'orderNo'
        },
        {
          label: '第三方交易号',
          type: 'input',
          name: 'thirdNo'
        },
        {
          label: '退款到账日期',
          type: 'date',
          name: 'refundStartTime',
          today: new Date()
        },
        {
          label: '退款到账日期',
          type: 'date',
          name: 'refundEndTime',
          today: new Date()
        }
      ],
      columns: [
        {
          title: '企业名称',
          key: 'corpName',
          width: 150
        },
        {
          title: '销售类型',
          key: 'saleType',
          width: 110,
          render: (h, params) => {
            return h('span', params.row.saleType == '0' ? '直营' : '分销')
          }
        },

        {
          title: '产品名称',
          key: 'productName',
          width: 200
        },
        {
          title: '退款方式',
          key: 'payType',
          width: 180,
          render: (h, params) => {
            return h('span', this.filter.payType(params.row.payType))
          }
        },
        {
          title: '订单编号',
          key: 'orderNo',
          sortable: true,
          width: 200
        },
        {
          title: '第三方交易号',
          key: 'thirdNo',
          sortable: true,
          width: 240
        },
        {
          title: '退单数量',
          key: 'refundAmount',
          width: 110,
          sortable: true,
          fixed: 'right'
        },
        {
          title: '退单单价',
          sortable: true,
          width: 110,
          key: 'price',
          fixed: 'right'
        },
        {
          title: '退款总额(元)',
          key: 'refundPrice',
          sortable: true,
          width: 130,
          fixed: 'right'
        },
        {
          title: '退款手续费',
          key: 'refundFee',
          width: 120,
          sortable: true,
          fixed: 'right'
        },
        {
          title: '退款到账时间',
          key: 'refundTime',
          sortable: true,
          width: 160,
          fixed: 'right'
        }
      ],
      url: '/statistics/refundData/grid',
      params: {
        saleType: '0',
        contentType: 'order_refund',
        refundStartTime: new Date().toLocaleDateString(),
        refundEndTime: new Date().toLocaleDateString()
      },
      tableTotal: '/statistics/webApi/refundData/getTotal' // 汇总接口
    }
  },
  created () {
    let _this = this
    apiPostJson('/admin/sysparam/findSysParamList', {
      types: ['payType']
    }).then(res => {
      if (res.data.payType) {
        res.data.payType.map(item => {
          let obj = {}
          obj.value = item.key
          obj.label = item.value
          _this.searchItems[1].data.push(obj)
        })
      }
    })
  },
  methods: {}
}
</script>
