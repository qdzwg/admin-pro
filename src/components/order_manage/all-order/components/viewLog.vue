<template>
  <div class="newtable">
    <h4 class="table-title">订单状态</h4>
    <Table border
           size="small"
           :columns="statusColumns"
           :data="statusItems"></Table>
    <h4 class="table-title ptop">订单费用</h4>
    <table class="table"
           border
           width=100%>
      <tr>
        <td class="title">订单号</td>
        <td><span class="fontweight">{{orderInfo.orderNo}}</span></td>
        <td class="title">供应商名称</td>
        <td><span class="fontweight">{{orderInfo.supplierName}}</span></td>
      </tr>
      <tr>
        <td class="title">金额</td>
        <td><span class="fontweight">{{orderInfo.orderSum}}</span></td>
        <td class="title">时间</td>
        <td><span class="fontweight">{{orderInfo.createTime}}</span></td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      statusColumns: [
        {
          title: '时间',
          align: 'center',
          width: 150,
          key: 'createTime'
        },
        {
          title: '状态',
          align: 'center',
          width: 150,
          key: 'title'
        },
        {
          title: '日志内容',
          key: 'content'
        }
      ],
      statusItems: [],
      orderInfo: ''
    }
  },
  props: ['result'],
  watch: {
    result () {
      this.statusItems = this.result.optLogs
      this.orderInfo = this.result.orderInfo
    }
  }
}
</script>
