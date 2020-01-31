<template>
    <Form ref="formInline" :model="searchForm" inline >
        <FormItem label="商户名称：" :label-width="80">
            <Input v-model="searchForm.mchName" placeholder="请输入商户名称"></Input>
        </FormItem>
        <FormItem label="商户编码：" :label-width="80">
            <Input v-model="searchForm.mchId" placeholder="请输入商户编码"></Input>
        </FormItem>
        <FormItem label="法人姓名：" :label-width="80">
            <Input v-model="searchForm.legalName" placeholder="请输入法人姓名"></Input>
        </FormItem>
        <FormItem label="法人手机号：" :label-width="100">
            <Input v-model="searchForm.legalPhone" placeholder="请输入法人手机号"></Input>
        </FormItem>
        <FormItem label="状态：" :label-width="80">
            <Select v-model="searchForm.status" style="width:180px" placeholder="请选择状态">
                <Option v-for="(item, index) in statusList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="归属景区：" :label-width="80">
            <Select v-model="searchForm.parkId" style="width:180px" placeholder="请选择景区名称">
                <Option v-for="(item, index) in searchList" :value="item.parkId" :key="index">{{ item.parkName }}</Option>
            </Select>
        </FormItem>
        <FormItem label="创建时间：" :label-width="80">
            <Row>
            <Col span="11">
                <DatePicker type="date" @on-change="startDateSet" placeholder="请选择开始时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
                <DatePicker type="date" @on-change="endDateSet"  placeholder="请选择结束时间"></DatePicker>
            </Col>
            </Row>
        </FormItem>
        <FormItem label="更新时间：" :label-width="80">
            <Row>
            <Col span="11">                
                <DatePicker type="date" @on-change="startTimeSet"  placeholder="请选择开始时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">                
                <DatePicker type="date" @on-change="endTimeSet"  placeholder="请选择结束时间"></DatePicker>
            </Col>
            </Row>
        </FormItem> 
        <Button type="primary" icon="ios-search" @click="search()">查询</Button>        
    </Form>
</template>
<script>
export default {
  data () {
    return {
        statusList: [{
            value: '',
            label: '全部'
        },
        {
            value: 'T',
            label: '启用'
        },
        {
            value: 'F',
            label: '禁用'
        }],
        // nowTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
        /*searchForm: {
            // createStartTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
            // createEndTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
            // modifyStartTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
            // modifyEndTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate()
        }*/
    }
  },
  props: ['searchList', 'searchForm'],
  mounted () {
  },
  methods: {
    startTimeSet(time){
      this.searchForm.modifyStartTime = time
    },
    endTimeSet(time){
      this.searchForm.modifyEndTime = time
    },
    startDateSet(time) {
        this.searchForm.createStartTime = time
    },
    endDateSet(time) {
        this.searchForm.createEndTime = time
    },
    async search () {
      this.$store.state.list.params = Object.assign(this.$store.state.list.params, this.searchForm)
      await this.$store.dispatch('postApi')
    }
  }
}
</script>
