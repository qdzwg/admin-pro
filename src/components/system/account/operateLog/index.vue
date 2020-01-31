<template>
  <div class="operateLog">
    <list ref="gridTable"
          :text="text"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"></list>
  </div>
</template>

<script>
import list from '@/components/global/list'
export default {
  components: {
    list
  },
  data () {
    return {
      text: '日志每小时收集一次',
      searchItems: [
        {
          label: '开始日期',
          type: 'date',
          name: 'startTime'
        },
        {
          label: '结束日期',
          type: 'date',
          name: 'endTime'
        }
      ],
      columns: [
        {
          title: '账号',
          sortable: true,
          key: 'accName'
        },
        {
          title: '请求地址',
          sortable: true,
          key: 'url'
        },
        {
          title: '备注',
          key: 'remark',
          sortable: true
        },
        {
          title: '操作时间',
          key: 'operateTime',
          sortable: true
        }
      ],
      url: '/admin/operateLog/grid'
    }
  }
}
</script>
