<template>
    <Form ref="formInline" :model="searchForm" inline >
        <FormItem label="归属景区：" :label-width="80">
            <Select v-model="searchForm.parkId" style="width:180px" placeholder="请选择景区名称">
                <Option v-for="(item, index) in searchList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="状态：" :label-width="60">
            <Select v-model="searchForm.useFlag" style="width:180px" :placeholder="'请选择状态'">
                <Option v-for="(item,index) in statusArr" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="票型名称：" :label-width="80">
            <Input v-model="searchForm.name" placeholder="请输入票型名称"></Input>
        </FormItem>
        <FormItem label="票型别名：" :label-width="80">
            <Input v-model="searchForm.alias" placeholder="请输入票型别名"></Input>
        </FormItem>
        <FormItem label="提前购电商编码：" :label-width="120">
            <Input v-model="searchForm.code" placeholder="请输入提前购电商编码"></Input>
        </FormItem>
        <FormItem label="当天购电商编码：" :label-width="120">
            <Input v-model="searchForm.code" placeholder="请输入当天购电商编码"></Input>
        </FormItem>
        <FormItem label="商户名称：" :label-width="80">
            <Input v-model="searchForm.mchName" placeholder="商户名称"></Input>
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
                value: '',
                label: '请选择'
            },
            {
                value: 'T',
                label: '已上架'
            },
            {
                value: 'F',
                label: '已下架'
            }
        ],
        nowTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
        searchForm: {
            // begDate:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
            // endDate:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
            // showBegDate:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
            // showEndDate:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate()
        }
    }
  },
  props: ['searchList'],
  mounted () {
    // console.log(new Date())
  },
  methods: {
    startTimeSet(time){
      this.searchForm.begModifyDate = time
    },
    endTimeSet(time){
      this.searchForm.endModifyDate = time
    },
    startDateSet(time) {
        this.searchForm.begCreateDate = time
    },
    endDateSet(time) {
        this.searchForm.endCreateDate = time
    },
    async search () {
      this.$store.state.list.params = Object.assign(this.$store.state.list.params, this.searchForm)
      await this.$store.dispatch('postApi')
    }
  }
}
</script>
