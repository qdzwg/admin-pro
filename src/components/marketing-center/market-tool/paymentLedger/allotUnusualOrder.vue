<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"></list>
  </div>
</template>
<script>
import list from '@/components/global/list'
export default {
  data () {
    return {
      url: '',
      columns: [
        {
          title: '提交编号',
          key: 'productType'
        },
        {
          title: '主订单号',
          key: 'productType'
        },
        {
          title: '分账提交时间',
          key: 'productType'
        },
        {
          title: '分账产品名称',
          key: 'productType'
        },
        {
          title: '分账产品编码',
          key: 'productType'
        },
        {
          title: '分账子订单号',
          key: 'productType'
        },
        {
          title: '分账商户企业码',
          key: 'productType'
        },
        {
          title: '分账类型',
          key: 'productType'
        },
        {
          title: '分账数量',
          key: 'productType'
        },
        {
          title: '分账金额',
          key: 'productType'
        },
        {
          title: '状态',
          key: 'productType'
        },
        {
          title: '操作',
          key: 'productType'
        }
      ],
      searchItems: [
        {
          label: '订单号',
          type: 'input',
          name: 'productName'
        },
        {
          label: '产品名称',
          type: 'input',
          name: 'productName'
        },
        {
          label: '产品编码',
          type: 'input',
          name: 'productName'
        },
        {
          label: '子订单号',
          type: 'input',
          name: 'productName'
        },
        {
          label: '企业码',
          type: 'input',
          name: 'productName'
        },
        {
          label: '开始日期',
          type: 'date',
          name: 'productName'
        },
        {
          label: '结束日期',
          type: 'date',
          name: 'productName'
        }
      ]
    }
  },
  components: {
    list
  }
}
</script>
