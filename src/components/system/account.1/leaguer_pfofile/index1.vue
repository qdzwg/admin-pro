<template>
  <div>
    <list :columns="columns" :searchItems="searchItems" :hannleItems="hannleItems"></list>
  </div>
</template>
<script>
import list from '@/components/global/list'
export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '信息',
          key: 'message'
        },
        {
          title: '登录ip',
          key: 'ip'
        },
        {
          title: '登录os',
          key: 'system'
        },
        {
          title: '登录浏览器',
          key: 'browser'
        },
        {
          title: '登录时间',
          key: 'createTime'
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: 'list/admin/userLog/grid',
      searchItems: [
        {
          label: '信息1',
          type: 'input',
          name: 'message'
        },
        // {
        //   label: '登录时间',
        //   type: 'date',
        //   name: 'createTime'
        // },
        {
          label: '浏览器',
          type: 'select',
          name: 'browser',
          data: [
            {
              value: 'Chrome',
              label: 'Chrome'
            },
            {
              value: 'Firefox',
              label: 'Firefox'
            },
            {
              value: 'ie11',
              label: 'ie11'
            }
          ]
        }
      ],
      hannleItems: [
        {
          title: '新增',
          icon: 'android-add',
          callback: () => {
          }
        }
      ]
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: {list}
}
</script>
