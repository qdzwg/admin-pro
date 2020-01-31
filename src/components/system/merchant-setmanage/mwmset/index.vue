<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <p style="color:red;margin-bottom:15px">（注意：删除后如果新增的景区企业码与之前不同，会对推广人有影响，请慎重操作！！！）</p>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" mode="delete"></confirm>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      columns: [
        {
          title: "序号",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: '用户名',
          key: 'accName'
        },
        {
          title: '店铺编号',
          key: 'merchantInfoId'
        },
        {
          title: '景区企业码',
          key: 'marketDisAccount'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('list/admin/sysRole/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: 'merchant/merchantWholeMarket/manageGrid',
      searchItems: [
        {
          label: '用户名',
          type: 'input',
          name: 'accName'
        }
      ],
      loading: true
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: {searchForm, gridTable, confirm},
  methods: {
    test(){
      this.$router.push("/test")
    },
    ok () {
      this.formItem.accType = 0
      this.formItem.useFlag = this.formItem.switch ? 1 : 0
      let _this = this
      let url = _this.type === 'add' ? 'list/admin/sysRole/saveRole' : 'list/admin/sysRole/update'
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: 'modal',
        callback (res) {
          if (res.success) {
            _this.modal = false
          }
        }
      })
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    showModal () {
      this.modal = true
      this.type = 'add'
      this.formItem.roleName = ''
      this.formItem.switch = true
      this.formItem.remark = ''
      this.modalTitle = '新增角色'
    },
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('list/admin/sysRole/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>
