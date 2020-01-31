<template>
  <div class="merchant-wap">
    <searchForm :search-items='searchItems'></searchForm>

    <Row :gutter="16"
         class="btn-groups">
      <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2">
      <Button type="primary"
              icon="android-add"
              @click="showModal">新增</Button>
      </Col>
      <!-- <Col span="2">
        <Button type="error" icon="android-delete" sucessMsg="删除成功！" content="确认删除吗？" @click="delAll">删除</Button>
      </Col> -->
    </Row>

    <gridTable ref="gridTable"
               :columns="columns"
               :params="params"
               :data="data"
               :url="url"></gridTable>
    <confirm ref="confirmModel"
             sucessMsg="删除成功！"
             content="确认删除吗？"
             mode="delete"></confirm>

    <!-- 弹出层 -->
    <Modal v-model="modal"
           :title="modalTitle"
           :loading="loading"
           @on-ok="ok"
           @on-cancel="cancel"
           :type="type">
      <Form :model="formItem"
            label-position="right"
            :label-width="100"
            ref="formItem"
            :rules="ruleForm">
        <FormItem label="标签类型："
                  prop="pushType">
          <Select v-model="formItem.pushType"
                  style="width:200px">
            <Option v-for="item in searchItems[1].data"
                    :value="item.value"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="产品名称："
                  prop="productName">
          <Input v-model="formItem.productName"
                 readonly
                 style="width:78%"></Input>
          <Button type="primary"
                  @click="getproductName">选择产品</Button>
        </FormItem>
        <FormItem label="排序："
                  prop="sortNum">
          <Input v-model="formItem.sortNum"></Input>
        </FormItem>
        <FormItem label="投放渠道">
          <RadioGroup v-model="formItem.pushChannel">
            <Radio label="wap">WAP</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>

    <!-- 产品名称弹出 -->
    <Modal v-model="modal2"
           :title="modalTitle2"
           :loading="loading"
           @on-cancel="cancel"
           :type="type2"
           width=800>
      <!-- <searchForm :search-items='searchItems2'></searchForm> -->
      <Form :model="searchForm"
            inline
            :label-width="80">
        <FormItem v-for="item in searchItems2"
                  :label="item.label"
                  :key="item.label">
          <Input v-if="item.type=='input'"
                 v-model="searchForm[item.name]"
                 :placeholder="'请输入'+item.label"></Input>
          <DatePicker v-if="item.type=='date'"
                      type="date"
                      :placeholder="'请输入'+item.label"
                      v-model="searchForm[item.name]"></DatePicker>
          <Select v-if="item.type=='select'"
                  v-model="searchForm[item.name]"
                  style="width:180px">
            <Option v-for="sitem in item.data"
                    :value="sitem.value"
                    :key="sitem.value">{{ sitem.label }}</Option>
          </Select>
        </FormItem>
        <Button type="primary"
                icon="ios-search"
                @click="getproductList()">搜索</Button>
      </Form>
      <Table border
             ref="gridTable"
             :columns="columns2"
             :data="data2"></Table>
      <Page :total="totals"
            @on-change="pageChange"
            style="margin-top:20px;"></Page>
    </Modal>
  </div>
</template>


<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import { apiGet } from "@/fetch/api.js"
import { apiPost } from "@/fetch/api.js"
export default {
  data () {
    return {
      searchForm: {},
      searchItems: [
        {
          label: '产品名称',
          type: 'input',
          name: 'productName'
        },
        {
          label: '页面类型',
          type: 'select',
          name: 'pushType',
          data: [
            {
              value: 'fine',
              label: '精品推荐'
            },
            {
              value: 'sell_well',
              label: '热销推荐'
            },
          ]
        }
      ],
      searchItems2: [
        {
          label: '来源类型',
          type: 'select',
          name: 'prodFrom',
          data: [
            {
              value: 'prod',
              label: '自营'
            },
            {
              value: 'dist_market',
              label: '分销'
            },
          ]
        }, {
          label: '产品类型',
          type: 'select',
          name: 'prodType',
          data: [
            {
              value: 'ticket',
              label: '门票'
            },
            {
              value: 'room',
              label: '房型'
            },
            {
              value: 'mdse',
              label: '商品'
            },
          ]
        },
        {
          label: '产品名称',
          type: 'input',
          name: 'modelName'
        }
      ],
      columns2: [
        {
          title: '序号',
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '名称',
          sortable: true,
          key: 'modelName'
        },
        {
          title: '产品编码',
          sortable: true,
          key: 'modelCode',

        },
        {
          title: '来源',
          sortable: true,
          key: 'prodFrom',
          render: (h, params) => {
            return h('span', this.filter.accountmodelprodFrom(params.row.prodFrom))
          }
        },
        {
          title: '产品类型',
          sortable: true,
          key: 'prodType',
          render: (h, params) => {
            return h('span', this.filter.accountbusinessType(params.row.prodType))
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '选择',
              action: () => {
                this.modal2 = false
                this.modalTitle = '添加'
                this.formItem.productName = params.row.modelName
                this.formItem.id = params.row.id
              }
            },
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      columns: [
        {
          title: '序号',
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '页面类型',
          key: 'pushType',
          sortable: true,
          render: (h, params) => {
            return h('span', this.filter.accountpushType(params.row.pushType))
          }
        },
        {
          title: '名称',
          sortable: true,
          key: 'productName'
        },
        {
          title: '产品编码',
          sortable: true,
          key: 'productCode',

        },
        {
          title: '业态',
          sortable: true,
          key: 'businessType',
          render: (h, params) => {
            return h('span', this.filter.accountbusinessType(params.row.businessType))
          }
        },
        {
          title: '排序',
          sortable: true,
          key: 'sortNum',

        },
        {
          title: '投放渠道',
          sortable: true,
          key: 'pushChannel',

        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '修改',
              action: () => {
                this.modal = true
                this.modalTitle = '修改'
                this.formItem.productName = params.row.productName
                this.formItem.pushType = params.row.pushType
                this.formItem.sortNum = params.row.sortNum
                this.formItem.switch = params.row.useFlag === '1'
                this.formItem.id = params.row.id
                this.formItem._method = 'put'
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('list/merchant/merchantPushInfo/grid' + params.row.id)
              }
            },
            ]
            return this.common.columnsHandle(h, actions)
          }
        }

      ],
      data: '',
      data2: [],
      totals: 0,
      pages: 1,
      params: { page: 1, limit: 10, sort: 'modifyTime', order: 'desc' },
      url: 'merchant/merchantPushInfo/grid',
      modal: false,
      modal2: false,
      formItem: {
        productName: '',
        pushType: '',
        sortNum: '',
        pushChannel: 'wap',
        switch: true
      },
      modalTitle: '新增角色',
      modalTitle2: '',
      type: 'add',
      type2: 'list',
      loading: true,
      ruleForm: {
        productName: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        pushType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        sortNum: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    searchForm,
    gridTable,
    confirm,
  },
  mounted () {


  },
  methods: {
    ok () {
      this.formItem.accType = 0
      this.formItem.useFlag = this.formItem.switch ? 1 : 0
      let _this = this
      let url = 'list/merchant/merchantPushInfo/add'
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
      this.formItem.productName = ''
      this.formItem.pushType = ''
      this.formItem.sortNum = ''
      this.formItem.switch = true
      this.modalTitle = '新增'

    },
    getproductName () {
      this.modal2 = true
      this.type2 = 'list'
      this.modalTitle2 = '选择'
      this.getproductList()
    },
    pageChange (num) {
      this.pages = num
      this.getproductList()
    },
    getproductList () {
      let paramslist = {
        page: this.pages,
        limit: 10,
        sort: "createTime",
        order: "desc",
      };
      let params = Object.assign(paramslist, this.searchForm)
      apiPost('list/merchant/merchantPushInfo/productGrid', params).then((res) => {
        this.data2 = res.rows
        this.totals = res.total
      })
    },
    delAll () {
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('admin/userAuth/userManageList/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
  }
}
</script>

<style>
#mImg {
  max-width: 100px;
}
</style>




