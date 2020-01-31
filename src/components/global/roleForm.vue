<template>
    <Form ref="formInline" :model="searchForm" inline >
        <FormItem label="角色名称：" :label-width="80">
            <Input v-model="searchForm.roleName" placeholder="请输入商户名称"></Input>
        </FormItem>
        <FormItem label="状态：" :label-width="80">
            <Select v-model="searchForm.useFlag" style="width:180px" placeholder="请选择状态">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
            value: '1',
            label: '启用'
        },
        {
            value: '0',
            label: '禁用'
        }],
        searchForm: {}
    }
  },
  props: [],
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
