<template>
    <Form ref="formInline" :model="searchForm" inline >
        <FormItem label="券类型：" :label-width="80">
            <Select v-model="searchForm.couponType" style="width:180px" placeholder="请选择券类型">
                <Option v-for="(item, index) in couponType" :value="item.key" :key="index">{{ item.value }}</Option>
            </Select>
        </FormItem>
        <FormItem label="归属景区：" :label-width="80">
            <Select v-model="searchForm.parkId" style="width:180px" placeholder="请选择归属景区">
                <Option v-for="(item, index) in parkList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="券名称：" :label-width="80">
            <Input v-model="searchForm.name" placeholder="请输入券名称"></Input>
        </FormItem>
        <FormItem label="券编码：" :label-width="120">
            <Input v-model="searchForm.code" placeholder="请输入券编码"></Input>
        </FormItem>
        <FormItem label="状态：" :label-width="60">
            <Select v-model="searchForm.status" style="width:180px" :placeholder="'请选择状态'">
                <Option v-for="(item,index) in statusArr" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
        </FormItem>   
        <FormItem label="创建时间：" :label-width="80">
            <Row>
            <Col span="11">
                <DatePicker type="date" @on-change="startDateSet"   placeholder="请选择开始创建时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
                <DatePicker type="date" @on-change="endDateSet"  placeholder="请选择结束创建时间"></DatePicker>
            </Col>
            </Row>
        </FormItem>
        <FormItem label="更新时间：" :label-width="80">
            <Row>
            <Col span="11">                
                <DatePicker type="date" @on-change="startTimeSet"  placeholder="请选择开始更新时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">                
                <DatePicker type="date" @on-change="endTimeSet" placeholder="请选择结束更新时间"></DatePicker>
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
        statusArr: [
            {
              value: "",
              label: "--请选择状态--"
            },
            {
              value: "1",
              label: "未开始"
            },
            {
              value: "2",
              label: "进行中"
            },
            {
              value: "3",
              label: "已结束"
            },
            {
              value: "4",
              label: "已失效"
            }
        ],
        searchForm: {         
        }
    }
  },
  props: ['parkList','couponType'],
  mounted () {
  },
  methods: {
    startTimeSet(time){
      this.searchForm.modifyBeginTime = time
    },
    endTimeSet(time){
      this.searchForm.modifyEndTime = time
    },
    startDateSet(time) {
        this.searchForm.createBeginTime = time
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
