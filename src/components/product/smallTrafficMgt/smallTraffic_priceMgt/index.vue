<template>
  <div class="page-wrapper">
    <Row>
        <Input v-model="routeNo" class="top-right" placeholder="线路编号" style="width: 200px" />
        <Input v-model="routeName" class="top-right" placeholder="线路名称" style="width: 200px" />
        <Button type="primary" icon="md-search" @click="searchFun">搜索</Button>
    </Row>
    <Row class="p-top" type="flex">
      <Col style="width:500px;margin-right:16px;margin-bottom:16px;">
        <Table highlight-row :columns="lineColumn" :data="lineData" @on-row-click="slectRule" ></Table>
        <Page class="p-top" :current="currPage" :total="totalPage" @on-change="changePage"/>
      </Col>
      <Col v-show="siteList.length" style="position:relative;min-height:100px;">
        <price-table :siteList="siteList" :lineInfo="lineInfo" ref='priceTable' @edit-price="editPriceTable" ></price-table>
        <Spin fix size="large" v-if="loading"></Spin>
      </Col>
    </Row>

  </div>
</template>

<script>
import PriceTable from '../components/price_table.vue'
import { lineSiteAxios, addPriceAxios, editPriceAxios, lineListAxios } from '../apis/xjt_line.js'
export default {
  components: { PriceTable },
  props: {},
  data () {
    return {
      loading: false,
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      id: '',
      routeNo: '',
      routeName: '',
      lineColumn: [
        {
          title: '线路编号',
          key: 'routeCode'
        },
        {
          title: '线路名称',
          key: 'routeName'
        }
      ],
      priceColumn: [
        {
          title: '线路编号',
          key: 'lineNumber'
        }
      ],
      lineData: [],
      siteList: [],
      lineInfo: {},
      siteInfo: {}
    }
  },
  watch: {
    id: function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.getPriceList()
      }
    }
  },
  computed: {},
  methods: {
    slectRule (row) {
      this.lineInfo = row
      this.id = row.id
      // this.getPriceList();
    },
    getPriceList (id) {
      let params = {
        id: this.id
        // routeId: this.id
      }
      this.loading = true
      lineSiteAxios(params).then(res => {
        this.loading = false
        if (res.status === 200 && res.data.status === 200) {
          this.siteList = res.data.data
        }
      })
    },
    /**
     * flag[string]
     * '01'表示不可操作，'02'表示要调用新增接口。'03'表示要掉修改接口
     */
    editPriceTable ({ startIndex, endIndex, priceRetail, priceDist }) {
      let sitInfo = this.siteList[startIndex].trafficPriceInfo[endIndex]
      switch (sitInfo.flag) {
        case '01':
          break
        case '02':
          this.addPrice(startIndex, endIndex, priceRetail, priceDist)
          break
        case '03':
          this.editPrice(startIndex, endIndex, priceRetail, priceDist)
          break
      }
    },
    async editPrice (startIndex, endIndex, price) {
      let lineInfo = this.siteList[startIndex]
      let sitInfo = lineInfo.trafficPriceInfo[endIndex]
      let params = {
        routeId: lineInfo.routeId,
        startSiteId: sitInfo.startSiteId,
        endSiteId: sitInfo.endSiteId,
        priceSettle: price,
        id: sitInfo.id
      }
      let princeInfo = await editPriceAxios(params)
      if (princeInfo.success === true) {
        this.siteList[startIndex].trafficPriceInfo[endIndex].priceSettle = price
      }
      this.$refs.priceTable.cancelFun();
    },
    async addPrice (startIndex, endIndex, priceRetail, priceDist) {
      let lineInfo = this.siteList[startIndex]
      let sitInfo = lineInfo.trafficPriceInfo[endIndex]
      let params = {
        routeId: lineInfo.routeId,
        startSiteId: sitInfo.startSiteId,
        endSiteId: sitInfo.endSiteId,
        priceRetail: priceRetail,
        priceDist: priceDist,
        id: sitInfo.id
      }
      let princeInfo = await addPriceAxios(params)
      if (princeInfo.status === 200 && princeInfo.data.status === 200) {
        this.siteList[startIndex].trafficPriceInfo[endIndex].priceRetail = priceRetail
        this.siteList[startIndex].trafficPriceInfo[endIndex].priceDist = priceDist
        this.$refs.priceTable.cancelFun();
      } else {
        this.$Message.warning(princeInfo.data.message);
      }
    },
    searchFun () {
      this.currPage = 1
      this.getLineList()
    },
    changePage (num) {
      this.currPage = num
      this.getLineList()
    },
    getLineList () {
      let params = {
        routeName: this.routeName,
        routeCode: this.routeNo,
        currPage: this.currPage,
        pageSize: this.pageSize
      }
      lineListAxios(params).then(res => {
        if (res.status == 200 && res.data.status == 200) {
          let data = res.data.data.rows
          this.totalPage = res.data.data.recordsTotal
          this.lineData = data
          if (data.length) { // 默认展示列表第一条数据价格
            let row = data[0]
            this.slectRule(row)
            this.lineInfo = data[0];
            this.getPriceList(data[0].id);
            data[0]._highlight = true
          }else{
            this.siteList = [];
          }
        }
      })
    }
  },
  created () {},
  mounted () {
    if(this.$route.query.routeCode){
      this.routeNo = this.$route.query.routeCode
    }
    if(this.$route.query.routeName){
      this.routeName = this.$route.query.routeName
    }
    this.getLineList()
  }

}
</script>
<style lang="scss" scoped>
@import '../xjtCommon.scss'
</style>
