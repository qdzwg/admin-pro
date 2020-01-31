<template>
  <div class="accountStated">
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :params="params"
          :searchItems="searchItems"></list>

    <Modal v-model="modalpay"
           :title="modalTitle">
      <table :data="dataList"
             class="table">
        <tr>
          <td class="table-title">流水号</td>
          <td>{{dataList.serialNo}}</td>
        </tr>
        <tr>
          <td class="table-title">供应商名称</td>
          <td>{{dataList.supplyerName}}</td>
        </tr>
        <tr>
          <td class="table-title">交易类型</td>
          <td>{{dataList.opType|opType}}</td>
        </tr>
        <tr>
          <td class="table-title">交易金额</td>
          <td>{{dataList.opValue}}</td>
        </tr>
        <tr>
          <td class="table-title">账户余额</td>
          <td>{{dataList.leftValue}}</td>
        </tr>
        <tr>
          <td class="table-title">备注信息</td>
          <td>{{dataList.remark}}</td>
        </tr>
      </table>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import list from '@/components/global/list';
import { apiPost } from '@/fetch/api';
export default {
  components: {
    list
  },
  data () {
    return {
      searchItems: [
        {
          label: '交易方式',
          type: 'select',
          name: 'opType',
          data: [
            {
              value: '',
              label: '--请选择交易方式--'
            },
            {
              value: '0',
              label: '充值'
            },
            {
              value: '1',
              label: '缴存'
            },
            {
              value: '2',
              label: '提现'
            },
            {
              value: '3',
              label: '代销'
            },
            {
              value: '4',
              label: '退款'
            }
          ]
        },
        {
          label: '交易开始日期',
          type: 'date',
          name: 'beginDate'
        },
        {
          label: '交易结束日期',
          type: 'date',
          name: 'endDate'
        },
        {
          label: '供应商名称',
          type: 'input',
          name: 'supplyerName'
        },
        {
          label: '流水号',
          type: 'input',
          name: 'serialNo'
        },
        {
          label: '交易流水号',
          type: 'input',
          name: 'orderNo'
        }
      ],
      columns: [
        {
          title: '序号',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '流水号',
          sortable: true,
          key: 'serialNo'
        },
        {
          title: '交易流水号',
          sortable: true,
          key: 'orderNo'
        },
        {
          title: '供应商名称',
          key: 'supplyerName',
          sortable: true,
          width: 120
        },
        {
          title: '交易方式',
          key: 'opType',
          sortable: true,
          width: 110,
          render: (h, params) => {
            return h('span', this.filter.opType(params.row.opType))
          }
        },
        {
          title: '交易金额（元）',
          sortable: true,
          key: 'opValue',
          width: 150
        },
        {
          title: '备用金余额',
          key: 'leftValue',
          sortable: true,
          width: 120
        },
        {
          title: '操作员',
          key: 'opernatorName',
          sortable: true,
          width: 120
        },
        {
          title: '操作时间',
          key: 'createTime',
          sortable: true,
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const actions = [
              {
                title: '详情',
                action: () => {
                  this.modalTitle = '详情';
                  this.modalpay = true
                  this.dataList = params.row
                }
              }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      dataList: {},
      modalpay: false,
      modalTitle: '',
      params: {
        capitalAccountId: this.$route.query.id,
        accountType: 'capital'
      },
      url: '/admin/capitalAccountDetail/grid'
    }
  },
  created () { },
  methods: {}
}
</script>

<style lang="scss">
.accountStated {
  width: 100%;
}
</style>
