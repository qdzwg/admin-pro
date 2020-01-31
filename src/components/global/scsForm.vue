<template>
    <Form ref="formInline" :model="searchForm" inline >
        <FormItem label="景区名称：" :label-width="80">
            <Select v-model="searchForm.parkName" style="width:180px" placeholder="请选择景区名称">
                <Option v-for="(item, index) in searchList" :value="item.name" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="节目：" :label-width="80">
            <Input v-model="searchForm.name" placeholder="请输入节目名称"></Input>
        </FormItem>
        <!-- <FormItem  label="演出日期：" :label-width="90">
            <DatePicker type="date" @on-change="startDateSet" :value="nowTime"  placeholder="请选择开始日期" style="width: 150px"></DatePicker>
        </FormItem>
        <FormItem  label="" :label-width="0">
            <DatePicker type="date" @on-change="endDateSet" :value="nowTime"  placeholder="请选择结束日期" style="width: 150px"></DatePicker>
        </FormItem>
        <FormItem  label="导入时间：" :label-width="80">
            <DatePicker type="date" @on-change="startTimeSet" :value="nowTime"  placeholder="请选择开始时间" style="width: 150px"></DatePicker>
        </FormItem>
        <FormItem  label="" :label-width="0">
            <DatePicker type="date" @on-change="endTimeSet" :value="nowTime"  placeholder="请选择结束时间" style="width: 150px"></DatePicker>
        </FormItem> -->
        <FormItem label="演出日期：" :label-width="80">
            <Row>
            <Col span="11">
                <DatePicker type="date" @on-change="startDateSet" :value="nowTime"  placeholder="请选择开始日期"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
                <DatePicker type="date" @on-change="endDateSet" :value="nowTime"  placeholder="请选择结束日期"></DatePicker>
            </Col>
            </Row>
        </FormItem>
        <FormItem label="导入时间：" :label-width="80">
            <Row>
            <Col span="11">                
                <DatePicker type="date" @on-change="startTimeSet" :value="nowTime"  placeholder="请选择开始时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">                
                <DatePicker type="date" @on-change="endTimeSet" :value="nowTime"  placeholder="请选择结束时间"></DatePicker>
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
      nowTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
      searchForm: {
        begDate:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
        endDate:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
        showBegDate:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
        showEndDate:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate()
      }
    }
  },
  props: ['searchList'],
  mounted () {
    // console.log(new Date())
  },
  methods: {
    startTimeSet(time){
      this.searchForm.begDate = time
    },
    endTimeSet(time){
      this.searchForm.endDate = time
    },
    startDateSet(time) {
        this.searchForm.showBegDate = time
    },
    endDateSet(time) {
        this.searchForm.showEndDate = time
    },
    async search () {
      this.$store.state.list.params = Object.assign(this.$store.state.list.params, this.searchForm)
      await this.$store.dispatch('postApi')
    }
  }
}
</script>
