<template>
    <div>
        <statistics-list ref="guideGridTable"
                         :columns="columns"
                         :url="url"
                         :params="params"
                         :searchItems="searchItems"
                         :hannleItems="hannleItems"></statistics-list>
    </div>
</template>

<script>
import { apiPost, apiGet } from '@/fetch/api'
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
          loading: false,
          //   icon: "android-add",
          callback: () => {
            let _this = this
            this.hannleItems[0].loading = true
            let obj = _this.$store.state.list.params
            // delete obj["page"];
            // delete obj["limit"];
            // apiPost("/statistics/statisticsData/grid", obj).then(res => {
            //   if (res && res.rows.length>0) {
            //     this.$refs.gridTable.exportData("店铺营业报表", res.rows);
            //   }else{
            //       this.$Message.error("报表没有记录");
            //   }
            // });
            let str = ''
            for (let ele in obj) {
              str += ele + '=' + obj[ele] + '&'
            }
            let url =
              '/statistics/webApi/statisticsData/getGuideDataExport?' +
              str.substring(0, str.length - 1)
            this.common.exportData(
              '导游业务报表',
              url,
              () => {
                _this.hannleItems[0].loading = false
              },
              _this
            )
          }
        }
      ],
      searchItems: [
        {
          label: '导游名称',
          type: 'input',
          name: 'operatorName'
        },
        {
          label: '产品名称',
          type: 'input',
          name: 'productName'
        },
        {
          label: '产品编码',
          type: 'input',
          name: 'productCode'
        },

        {
          label: '交易开始日期',
          type: 'date',
          name: 'startTime',
          today: ''
        },
        {
          label: '交易结束日期',
          type: 'date',
          name: 'endTime',
          today: ''
        }
      ],
      columns: [
        {
          title: '导游名称',
          key: 'operatorName'
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '产品编码',
          key: 'productCode'
        },
        {
          title: '订单数量',
          key: 'amount'
        },
        {
          title: '订单金额（元）',
          key: 'paySum'
        },
        // {
        //   title: '增补单价（元/每人）',
        //   key: 'goodsName'
        // },
        // {
        //   title: '增补人数',
        //   key: 'goodsName'
        // },
        // {
        //   title: '增补金额',
        //   key: 'goodsName'
        // },
        // {
        //   title: '服务合计金额（元）',
        //   key: 'payMethod'
        // }
      ],
      url: '/statistics/webApi/statisticsData/getGuideData',
      params: {
      }
    }
  },
  created () {
  },
  methods: {}
}
</script>
