<template>
  <div class="capitalAccount">
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"></list>
    <!-- 驳回申请 -->
    <Modal v-model="rejestModal"
           :title="modalTitle"
           width=600>
      <Form :model="formItem"
            ref="formItem"
            :rules="ruleForm"
            label-position="right"
            :label-width="100">
        <FormItem label="驳回理由："
                  prop="reason">
          <Input v-model="formItem.reason"
                 type="textarea"
                 :rows="4"
                 style="width:80%"
                 :maxlength="50"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="rejest">提交</Button>
          <Button @click="test">取消</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <!-- 详情 -->
    <Modal v-model="modalpay"
           :title="modalTitle">
           <div class="newtable">
      <table border
             class="table">
        <tr>
          <td class="details-title">流水号</td>
          <td>{{dataList.serialNo}}</td>
        </tr>
        <tr>
          <td class="details-title">供应商名称</td>
          <td>{{dataList.supplyerName}}</td>
        </tr>
        <tr>
          <td class="details-title">交易类型</td>
          <td>{{dataList.opType|opType}}</td>
        </tr>
        <tr>
          <td class="details-title">交易金额</td>
          <td>{{dataList.opValue}}</td>
        </tr>
        <tr>
          <td class="details-title">账户余额</td>
          <td>{{dataList.leftValue}}</td>
        </tr>
        <tr>
          <td class="details-title">备注信息</td>
          <td>{{dataList.remark}}</td>
        </tr>
      </table>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 同意提现 -->
    <Modal v-model="drawModal"
           @on-ok="drawUp"
           :loading="loading">
      <p slot="header"
         style="color:#ff9900;">
        <Icon type="information-circled"></Icon>
        <span>信息确认</span>
      </p>
      <p>确认提现？</p>
    </Modal>
  </div>
</template>

<script>
import list from '@/components/global/list';
import { apiPost, apiGet } from '@/fetch/api';
export default {
  components: {
    list
  },
  data () {
    return {
      searchItems: [
        {
          label: '分销商名称',
          type: 'input',
          name: 'distributorName'
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
          width: 180
        },
        {
          title: '分销商名称',
          key: 'distributorName',
        },
        {
          title: '提现金额(元)',
          sortable: true,
          key: 'opValue'
        },
        {
          title: '备用金余额',
          key: 'leftValue',
          sortable: true
        },
        {
          title: '操作时间',
          key: 'createTime',
          sortable: true
        },
        {
          title: '操作员',
          key: 'opernatorName',
        },
        {
          title: '状态',
          key: 'opStatus',
          width: 120,
          render: (h, params) => {
            return h('span', this.filter.opStatusAccount(params.row.opStatus))
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 230,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '详情',
                action: () => {
                  this.modalTitle = '查看详情';
                  this.modalpay = true
                  this.dataList = params.row
                }
              }
            ]
            if (params.row.opStatus == '0') {
              actions.push(
                {
                  title: '同意提现',
                  action: () => {
                    this.modalTitle = '同意提现';
                    this.drawModal = true
                    this.drawId = params.row.id
                  }
                },
                {
                  title: '驳回申请',
                  action: () => {
                    this.modalTitle = '驳回';
                    this.rejestModal = true
                    this.formItem.capitalAccountDetailId = params.row.id
                  }
                }
              )
            }
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      dataList: {},
      formItem: {
        capitalAccountDetailId:"",
        reason: ''
      },
      ruleForm: {
        reason: [{ required: true, message: '请输入驳回理由', trigger: 'blur' }]
      },
      modalpay: false,
      rejestModal: false,
      drawModal: false,
      drawId: '',
      loading: false,
      modalTitle: '',
      url: '/admin/capitalAccountDetail/draw/grid'
    }
  },
  created () { },
  methods: {
    rejest () {
      let _this = this
      let url = '/admin/capitalAccountDetail/applyReject';
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: 'page',
        callback (res) {
          if (res.success) {
            _this.$Message.success('操作成功')
            _this.rejestModal = false
            _this.$refs.gridTable.loadpage()
          } else {
            _this.$Message.warning(res.message)
          }
        }
      })
    },
    test () {
      this.rejestModal = false
    },
    drawUp () {
      apiGet('/admin/capitalAccountDetail/applyPass?id=' + this.drawId).then(res => {
        if (res.success) {
          this.$Message.success('操作成功')
          this.drawModal = false
          this.$refs.gridTable.loadpage()
        } else {
          this.$Message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.capitalAccount {
  width: 100%;
}
</style>
