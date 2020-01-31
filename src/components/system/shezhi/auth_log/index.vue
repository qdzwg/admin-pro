<template>
  <div class="user-log">
    <template v-if="formPasswordShow">
      <Form :model="formPasswordItem"
            label-position="right"
            :label-width="180"
            ref="formPasswordItem"
            :rules="rulePassWord">
        <FormItem label="请输入主账户密码："
                  prop="passWord">
          <Input type="password"
                 v-model="formPasswordItem.passWord"
                 style="width:30%;"></Input>
          <Button type="primary"
                  @click="submit">提交</Button>
        </FormItem>
      </Form>
    </template>
    <template v-if="!formPasswordShow">
      <searchForm :search-items='searchItems'></searchForm>
      <gridTable ref="gridTable"
                 :columns="columns"
                 :data="data"
                 :url="url"></gridTable>
    </template>
    <!-- 弹出层 -->
    <Modal v-model="modal"
           width="800"
           title="认证明细">
<detailsTable :detailsData="formItem"></detailsTable>
      <!-- <Form :model="formItem"
            ref="formItem"
            :label-width="180">
        <FormItem label="认证类型：">
          <span>{{formItem.authType== "person" ? "个人" : "企业"}} </span>
        </FormItem>
        <FormItem label="姓名：">
          <span> {{formItem.name}} </span>
        </FormItem>
        <FormItem label="身份证：">
          <span>{{formItem.certNo}} </span>
        </FormItem>
        <FormItem label="身份证图片地址（正面）：">
          <img :src="formItem.certNoInHandAddr"
               alt="">
        </FormItem>
        <FormItem label="身份证图片地址（反面）：">
          <img :src="formItem.certNoPositiveAddr"
               alt="">
        </FormItem>
        <FormItem label="手持身份证图片地址：">
          <img :src="formItem.certNoReverseSideAddr"
               alt="">
        </FormItem>
        <FormItem label="所属地区：">
          <span>{{formItem.areaName}} </span>
        </FormItem>
        <FormItem label="审核状态：">
          <span>{{filter.accountauditStatus(formItem.auditStatus )}} </span>
        </FormItem>
        <FormItem label="审核信息：">
          <span>{{formItem.auditMsg}} </span>
        </FormItem>
        <FormItem label="创建时间：">
          <span>{{formItem.createTime}} </span>
        </FormItem>
      </Form> -->
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm';
import gridTable from '@/components/global/gridTable';
import { apiGet } from '@/fetch/api';
import detailsTable from './../add/detailsTable'
export default {
  data () {
    return {
      formPasswordShow: true,
      formPasswordItem: {
        passWord: ''
      },
      rulePassWord: {
        passWord: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      columns: [
        {
          title: '商户主账号',
          key: 'userName'
        },
        {
          title: '认证类型',
          key: 'authType',
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.authType == 'person' ? '个人' : '企业')
          }
        },
        {
          title: '姓名',
          key: 'name',
          sortable: true
        },
        {
          title: '身份证',
          key: 'certNo',
          sortable: true
        },
        {
          title: '企业名称',
          key: 'corpName',
          sortable: true
        },
        {
          title: '法人',
          key: 'legalPerson',
          sortable: true
        },
        {
          title: '法人证件号',
          key: 'legalPersonCertNo',
          sortable: true
        },
        {
          title: '营业执照号',
          key: 'businessLicenseNo',
          sortable: true
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          sortable: true,
          render: (h, params) => {
            return h(
              'span',
              this.filter.accountauditStatus(params.row.auditStatus)
            )
          }
        },
        {
          title: '申请时间',
          key: 'createTime',
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '明细',
                action: () => {
                  this.modal = true
                  this.formItem = params.row
                }
              }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: { page: 1, limit: 10, sort: 'createTime', order: 'desc' },
      url: '/admin/userAuth/grid',
      searchItems: [
        {
          label: '姓名',
          type: 'input',
          name: 'name'
        },
        {
          label: '身份证',
          type: 'input',
          name: 'certNo'
        },
        {
          label: '企业名称',
          type: 'input',
          name: 'corpName'
        },
        {
          label: '法人',
          type: 'input',
          name: 'legalPerson'
        },
        {
          label: '法人证件号',
          type: 'input',
          name: 'legalPersonCertNo'
        },
        {
          label: '状态',
          type: 'select',
          name: 'auditStatus',
          data: [
            {
              value: 'wait',
              label: '待审核'
            },
            {
              value: 'audit_success',
              label: '审核成功'
            },
            {
              value: 'audit_failure',
              label: '审核失败'
            }
          ]
        }
      ],
      modal: false,
      formItem: {}
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: { searchForm, gridTable,detailsTable },
  methods: {
    submit () {
      let _this = this
      let url = '/admin/userInfo/sensitiveCheck';
      this.common.formPost(this, {
        url,
        params: this.formPasswordItem,
        mold: 'page',
        modalName: 'formPasswordItem',
        callback (res) {
          if (res.success) {
            _this.formPasswordShow = false
          } else {
            _this.$Message.warning(res.message)
          }
        }
      })
    }
  }
}
</script>
