<template>
  <div class="mydraw">
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"
          :params="params"></list>
    <Modal v-model="modalpay"
           :title="modalTitle">
      <Form :data="dataList">
        <FormItem label="申请备注：">
          <span>{{dataList.remark}}</span>
        </FormItem>
        <FormItem label="审核备注：">
          <span>{{dataList.reason}}</span>
        </FormItem>
      </Form>
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
          label: '提现状态',
          type: 'select',
          name: 'opStatus',
          data: [
            {
              value: '',
              label: '--请选择提现状态--'
            },
            {
              value: '0',
              label: '待审核'
            },
            {
              value: '1',
              label: '提现成功'
            },
            {
              value: '2',
              label: '提现失败'
            }
          ]
        },
        {
          label: '交易流水号',
          type: 'input',
          name: 'serialNo'
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
          key: 'serialNo',
          width: 200
        },
        {
          title: '供应商账号',
          key: 'supplyerName',
          sortable: true
        },
        {
          title: '供应商名称',
          key: 'suppCorpName',
          sortable: true
        },
        {
          title: '提现金额（元）',
          sortable: true,
          key: 'opValue'
        },
        {
          title: '备用金余额',
          key: 'leftValue',
          sortable: true
        },
        {
          title: '操作员',
          key: 'opernatorName',
          sortable: true
        },
        {
          title: '操作时间',
          key: 'createTime',
          sortable: true
        },
        {
          title: '状态',
          key: 'opStatus',
          sortable: true,
          render: (h, params) => {
            return h('span', this.filter.opStatus(params.row.opStatus))
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '查看备注',
                action: () => {
                  this.modalTitle = '查看备注';
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
        opType: '2'
      },
      url: '/admin/capitalAccountDetail/myDraw/grid'
    }
  },
  created () { },
  methods: {}
}
</script>

<style lang="scss">
.mydraw {
  width: 100%;
}
</style>
