<template>
  <div>
    <Form ref="formInline"
          :model="searchForm"
          inline
          v-show="searchItems&&searchItems.length">
      <FormItem v-for="item in searchItems"
                :key="item.name">
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
                :placeholder="'请选择'+item.label"
                style="width:180px">
          <template v-for="sitem in item.data">
            <Option :value="sitem.value"
                    v-if="!sitem.hide"
                    :key="sitem.value">{{ sitem.label }}</Option>
          </template>

        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary"
                icon="ios-search"
                @click="handleSubmit()">搜索</Button>
        <span style="color:red">{{text}}</span>
      </FormItem>
    </Form>
    <Row :gutter="16"
         class="btn-groups"
         v-if="hannleItems">
      <Button :type="item.type||'primary'"
              :icon="item.icon"
              @click="item.callback"
              v-for="item in hannleItems"
              :key="item.title">{{ item.title }}</Button>
    </Row>
    <div class="grids">
      <Table ref="table"
             border
             :columns="columns"
             :data="res.rows"
             @on-selection-change="changeSelection"
             :loading="loading"></Table>
      <Page :total="res.total"
            class-name="pages"
            @on-change="changepage"
            @on-page-size-change='pageSizeChange'
            show-elevator
            show-sizer></Page>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      res: {},
      loading: false,
      defaultParams: { page: 1, limit: 10, sort: 'createTime', order: 'desc' },
      searchForm: {}
    }
  },
  props: {
    tableTotal: {
      type: String
    },
    text: {
      type: String
    },
    searchItems: {
      type: Array
    },
    hannleItems: {
      type: Array
    },
    columns: {
      type: Array,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    url: {
      handler (url) {
        if (url) {
          this.loadpage()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.searchItems.forEach(item => {
      if (typeof item.value !== 'undefined') {
        this.searchForm[item.name] = item.value
      }
    })
  },
  methods: {
    async loadpage () {
      this.loading = true
      let res = await this.apiPost(this.url, Object.assign(
        this.defaultParams,
        this.params,
        this.searchForm
      ))
      this.loading = false
      if (res.status === 200) {
        this.res = res.data
        this.$refs.table.selection = ''
      } else {
        this.$Message.error(res.message)
      }
    },
    changepage (num) {
      this.params.page = num
      this.loadpage()
    },
    pageSizeChange (page) {
      this.params.limit = page
      this.loadpage()
    },
    changeSelection (selection) {
      this.selection = selection
    },
    handleSubmit () {
      for (let val in this.searchForm) {
        if (this.searchForm[val] instanceof Date) {
          this.searchForm[val] = this.changeDate(this.searchForm[val])
        }
      }
      this.params.page = 1
      this.loadpage()
    }
  }
}
</script>
