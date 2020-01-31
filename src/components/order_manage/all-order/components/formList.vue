<template>
  <div class="formList">
    <Form ref="formInline"
          :model="searchForm"
          inline
          v-show="searchItems&&searchItems.length">
      <Row class="btn-groups advgroups">
        <Col span="18">
        <FormItem v-for="item in searchItems"
                  :key="item.name"
                  :style="{'width':1/(searchItems.length+1)*100+'%'}">
          <Input v-if="item.type=='input'"
                 v-model="searchForm[item.name]"
                 :placeholder="'请输入'+item.label"></Input>
          <DatePicker v-if="item.type=='date'"
                      type="date"
                      :clearable="false"
                      :placeholder="'请输入'+item.label"
                      v-model="searchForm[item.name]"
                      :options='item.name=="startCreateTime"?options0:options1'
                      @on-change="setDate(item.name,$event)"
                      format="yyyy-MM-dd"></DatePicker>
          <Select v-if="item.type=='select'"
                  v-model="searchForm[item.name]"
                  :placeholder="'请选择'+item.label">
            <Option v-for="sitem in item.data"
                    :value="sitem.value"
                    :key="sitem.value">{{ sitem.label }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem v-for="item in hannleItems"
                  :key="item.title">
          <Button :type="item.type||'primary'"
                  :icon="item.icon"
                  @click="item.callback"
                  :loading="item.loading">{{ item.title }}</Button>
        </FormItem>
        </Col>
      </Row>
      <FormItem v-if="show"
                v-for="item in searchAdvanced"
                :key="item.name"
                :style="{'width':1/(searchItems.length+1)*100+'%'}">
        <Input v-if="item.type=='input'"
               v-model="searchForm[item.name]"
               :placeholder="'请输入'+item.label"></Input>
        <DatePicker v-if="item.type=='date'"
                    type="date"
                    :placeholder="'请输入'+item.label"
                    v-model="searchForm[item.name]"
                    format="yyyy-MM-dd"
                    @on-change="searchForm[item.name]=$event"></DatePicker>
        <Select v-if="item.type=='select'"
                v-model="searchForm[item.name]"
                :placeholder="'请选择'+item.label">
          <Option v-for="sitem in item.data"
                  :value="sitem.value"
                  :key="sitem.value">{{ sitem.label }}</Option>
        </Select>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  props: {
    searchItems: {
      type: Array
    },
    hannleItems: {
      type: Array
    },
    searchAdvanced: {
      type: Array
    }
  },
  data () {
    return {
      searchForm: {},
      options0: {},
      options1: {},
      show: false
    }
  },
  mounted () {
    this.searchItems.map(ele => {
      if (ele.value) {
        this.searchForm[ele.name] = ele.value ? ele.value : ''
      }
      if (ele.saleType) {
        this.searchForm[ele.name] = ele.saleType ? ele.saleType : ''
      }
      if (ele.today) {
        this.searchForm[ele.name] = ele.today ? ele.today : ''
      }
      if (ele.type == 'date') {
        this.setDate(ele.name, ele.value)
      }
    })
  },
  methods: {
    // 处理日期
    setDate (date, time) {
      if (date == 'orderStartTime') {
        this.searchForm.orderStartTime = time
        this.options1 = {
          disabledDate: date => {
            let startTime = this.searchForm.orderStartTime
              ? new Date(this.searchForm.orderStartTime).valueOf() -
              1 * 24 * 60 * 60 * 1000
              : ''
            return date && (date.valueOf() <= startTime || date.valueOf() > startTime + 365 * 24 * 60 * 60 * 1000)
          }
        }
      } else if (date == 'orderEndTime') {
        this.searchForm.orderEndTime = time
        let endTime = this.searchForm.orderEndTime
          ? new Date(this.searchForm.orderEndTime).valueOf()
          : ''
        this.options0 = {
          disabledDate (date) {
            return date && (date.valueOf() > endTime || date.valueOf() < endTime - 365 * 24 * 60 * 60 * 1000)
          }
        }
      }
      if (date == 'startCreateTime') {
        this.searchForm.startCreateTime = time
        this.options1 = {
          disabledDate: date => {
            let startTime = this.searchForm.startCreateTime
              ? new Date(this.searchForm.startCreateTime).valueOf() -
              1 * 24 * 60 * 60 * 1000
              : ''
            return date && (date.valueOf() <= startTime || date.valueOf() > startTime + 365 * 24 * 60 * 60 * 1000)
          }
        }
      } else if (date == 'endCreateTime') {
        this.searchForm.endCreateTime = time
        let endTime = this.searchForm.endCreateTime
          ? new Date(this.searchForm.endCreateTime).valueOf()
          : ''
        this.options0 = {
          disabledDate (date1) {
            return date1 && (date1.valueOf() > endTime)
          }
        }
      }
    },
    searchSubmit () {
      this.show = !this.show
    },
    async handleSubmit2 () {
      this.$store.state.list.params = Object.assign(this.$store.state.list.params, this.searchForm)
      await this.$store.dispatch('postApi')
    }
  }
}
</script>
