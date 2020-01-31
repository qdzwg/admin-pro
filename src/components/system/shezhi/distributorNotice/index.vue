<template>
  <div class="distributorNotice">
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :mode="mode"
             :content="content"
             :sucessMsg="sucessMsg"></confirm>
  </div>
</template>

<script>
import { apiGet, apiPost } from '@/fetch/api'
import list from '@/components/global/list'
import confirm from '@/components/global/confirm'
export default {
  components: {
    confirm,
    list
  },
  data () {
    return {
      mode: '',
      content: '',
      sucessMsg: '',
      searchItems: [
        {
          label: '公告标题',
          type: 'input',
          name: 'title'
        }
      ],
      hannleItems: [
        {
          title: '发布公告',
          icon: 'android-add',
          callback: () => {
            this.add()
          }
        }
      ],
      columns: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '创建人',
          key: 'modifyBy'
        },
        {
          title: '修改时间',
          key: 'modifyTime'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '查看详情',
                action: () => {
                  this.$router.push({ path: '/newAddNotice', query: { id: params.row.id, back: 'back' } })
                }
              },
              {
                title: '编辑',
                action: () => {
                  this.$router.push({ path: '/newAddNotice', query: { noticeId: params.row.id } })
                }
              },
              {
                title: '删除',
                action: () => {
                  this.mode = 'done'
                  this.content = '你是否确认删除这项内容?'
                  this.sucessMsg = '删除成功!'
                  this.$refs.confirmModel.confirm('/admin/webapi/userNotice/delete?id=' + params.row.id)
                }
              }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      url: '/admin/webapi/userNotice/grid'
    }
  },
  methods: {
    add () {
      this.$router.push('/newAddNotice')
    }
  }
}
</script>
