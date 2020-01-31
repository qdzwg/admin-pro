<template>
  <div class="groupingManagement">
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
import { apiGet, apiPost } from '@/fetch/api';
import list from '@/components/global/list';
import confirm from '@/components/global/confirm';
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
          label: '分组名称',
          type: 'input',
          name: 'name'
        }
      ],
      hannleItems: [
        {
          title: '新增分组',
          icon: 'android-add',
          callback: () => {
            this.add()
          }
        }
      ],
      columns: [
        {
          title: '分组名称',
          key: 'name'
        },
        {
          title: '分销商数量',
          key: 'num'
        },
        {
          title: '备注',
          key: 'remark'
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
                  this.$router.push({ path: '/distributorManagement', query: { id: params.row.id } })

                }
              },
              {
                title: '编辑',
                action: () => {
                  this.$router.push({ path: '/userGroupNotice', query: { id: params.row.id } })
                }
              },
              {
                title: '删除',
                action: () => {
                  this.mode = 'done'
                  this.content = '你是否确认删除这项内容?'
                  this.sucessMsg = '删除成功!'
                  this.$refs.confirmModel.confirm('/admin/webapi/userGroup/delete?id=' + params.row.id)
                }
              }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      url: '/admin/webapi/userGroup/list'

    }
  },
  methods: {
    add () {
      this.$router.push('/userGroupNotice')
    }

  }
}
</script>
