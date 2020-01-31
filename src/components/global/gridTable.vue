<template>
  <div :style="{'padding-bottom':padding}"
       class="grids">
    <Table border
           ref="table"
           :columns="columns"
           :data="res.rows"
           :url="url"
           @on-selection-change="changeSelection"
           :loading="loading">
      <slot name="footer"
            slot="footer"></slot>
    </Table>
    <Page :total="res.total"
          class-name="pages"
          @on-change="changepage"
          @on-page-size-change='pageSizeChange'
          show-elevator
          show-sizer></Page>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: '',
      // params: Object.assign({page: 1, limit: 10, sort: 'createTime', order: 'desc'},this.$route.params),
      selection: [],
      loading: false,
      padding: '0px',
      
    }
  },
  props: ['columns', 'url', 'params', 'extraParams', 'ifShowFoot'],
  created () {
    var agent = navigator.userAgent.toLowerCase()
    // firefox
    if (agent.indexOf('firefox') > 0) {
      this.padding = '50px'
    }
  },
  mounted () {
    if (this.searchItems && this.searchItems.length) {
      this.searchItems.map(ele => {
        if (ele.today) {
          this.searchForm[ele.name] = ele.today ? ele.today : ''
        }
      })
    }
  },
  watch: {
    url: {
      handler (value) {
        // console.log(value)
        this.$store.state.list.url = value
        this.$store.state.list.params = this.params
        if (!this.extraParams) {
          this.loadpage()
        }
      },
      immediate: true
    }
  },
  computed: {
    res () {
      return this.$store.state.list.res.data
        ? this.$store.state.list.res.data
        : this.$store.state.list.res
    }
  },
  methods: {
    changepage (num) {
      this.$store.state.list.params.page = num
      this.params.page = num
      this.$store.commit('setParams', this.params)
      this.loadpage()
    },
    changeSelection (selection) {
      this.selection = selection
    },
    pageSizeChange (pageSize) {
      this.$store.state.list.params.limit = pageSize
      this.params.limit = pageSize
      this.$store.commit('setParams', this.params)
      this.loadpage()
    },
    columnsHandle (h, actions) {
      let array = []
      actions.forEach(element => {
        let obj = h(
          'Button',
          {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                element.action()
              }
            }
          },
          element.title
        )
        array.push(obj)
      })
      return array
    },
    async loadpage () {
      this.selection = []
      this.loading = true
      // if(this.methods && this.methods == 'get'){        
      //   await this.$store.dispatch('getApiSc')
      // }else{
      //   await this.$store.dispatch('postApi')
      // }
      await this.$store.dispatch('postApi')
      // await this.$store.dispatch('getApiSc')
      this.loading = false
    }
  }
}
</script>
