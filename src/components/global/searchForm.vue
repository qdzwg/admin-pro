<template>
  <Form ref="formInline" :model="searchForm" inline >
    <FormItem v-for="(item,index) in searchItems"  :key="index">
      <Input v-if="item.type=='input'" v-model="searchForm[item.name]" :placeholder="'请输入'+item.label"></Input>
      <DatePicker v-if="item.type=='date'" type="date" confirm @on-change="searchForm[item.name]=$event"  format="yyyy-MM-dd"  :placeholder="'请选择'+item.label" v-model="searchForm[item.name]"></DatePicker>
      <Select v-if="item.type=='select'" v-model="searchForm[item.name]" style="width:180px" :placeholder="'请选择'+item.label">
          <Option v-for="sitem in item.data" :value="sitem.value" :key="sitem.value">{{ sitem.label }}</Option>
      </Select>
    </FormItem>
     <Button type="primary" icon="ios-search" @click="handleSubmit()">搜索</Button>
    <!-- <FormItem>
        <Button type="success" @click="handleSubmit()">导出</Button>
    </FormItem> -->
  </Form>
</template>
<script>
export default {
  data () {
    return {
      searchForm: {}
    }
  },
  props: ['searchItems'],
  mounted () {
    // console.log(new Date())
  },
  methods: {
    async handleSubmit () {
      this.$store.state.list.params = Object.assign(this.$store.state.list.params, this.searchForm)
      await this.$store.dispatch('postApi')
    }
  }
}
</script>
