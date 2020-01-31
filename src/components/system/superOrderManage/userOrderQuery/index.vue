<template>
  <div>
   <Form ref="formInline" :model="searchForm" inline :label-width="80">
    <FormItem v-for="item in searchItems" :label="item.label" :key="item.label">
      <Input v-if="item.type=='input'" v-model="searchForm[item.name]" :placeholder="'请输入'+item.label"></Input>
      <Select v-if="item.type=='select'" v-model="searchForm[item.name]" style="width:180px">
          <Option v-for="sitem in item.data" :value="sitem.value" :key="sitem.value">{{ sitem.label }}</Option>
      </Select>
    </FormItem>
    <FormItem  label="开始时间">
       <DatePicker type="date" @on-change="startTimeSet" :value="nowTime" placeholder="请选择开始时间" style="width: 150px"></DatePicker>
    </FormItem>
     <FormItem  label="结束时间">
       <DatePicker type="date" @on-change="endTimeSet" :value="nowTime"  placeholder="请选择结束时间" style="width: 150px"></DatePicker>
    </FormItem>
     <Button type="primary" icon="ios-search" @click="search">搜索</Button>
  </Form>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
  </div>
</template>
<script>
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      nowTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
      searchForm:{
        orderStartTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
        orderEndTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate()
      },
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
          title: '订单编号',
          key: 'orderNo'
        },
        {
          title: '业态类型',
          key: 'orderType',
          render:(h,params) => {
            return h("span",this.filter.orderType(params.row.orderType))
          }
        },
        {
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '下单人姓名',
          key: 'buyName'
        },{
          title: '下单人手机号',
          key: 'buyPhone'
        },{
          title: '下单人身份证',
          key: 'buyCard'
        },{
          title: '检票状态',
          key: 'payAmountNum'
        },{
          title: '支付方式',
          key: 'payAmountNum'
        },{
          title: '支付订单号',
          key: 'payOrderNo'
        },{
          title: '支付状态',
          key: 'payStatus'
        },{
          title: '下单时间',
          key: 'create_time'
        },{
          title: '游玩时间',
          key: 'palyTime'
        },{
          title: '需检票量',
          key: 'needCheckAmout'
        },{
          title: '剩余票量',
          key: 'noCheckAmout'
        },{
          title: '单价',
          key: 'price'
        },{
          title: '数量',
          key: 'amount'
        },{
          title: '销售总价',
          key: 'saleSum'
        },{
          title: '优惠价格',
          key: 'couponSum'
        },{
          title: '成交金额',
          key: 'finalPaySum'
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: '/admin/userOrder/orderQueryGrid',
      searchItems: [
        {
          label: '用户名',
          type: 'input',
          name: 'accName'
        },
         {
          label: '业态类型',
          type: 'select',
          name: 'orderType',
          data: [
            {
              value: 'park',
              label: '景区'
            },
            {
              value: 'hotel',
              label: '酒店'
            },
            {
              value: 'mdse',
              label: '商品'
            }
          ]
        },{
          label: '订单编号',
          type: 'input',
          name: 'orderNo'
        },{
          label: '支付订单号',
          type: 'input',
          name: 'payOrderNo'
        }
      ],
      loading: true
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: {gridTable, confirm},
  methods: {
    async search(){
      this.$store.state.list.params = Object.assign(this.$store.state.list.params, this.searchForm)
      await this.$store.dispatch('postApi')
    },
    startTimeSet(time){
      this.searchForm.orderStartTime = time
    },
    endTimeSet(time){
      this.searchForm.orderEndTime = time
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
