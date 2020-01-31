<template>
  <div class="page-wrapper">
    <Row>
        <DatePicker class="top-right" :value="searchDate" type="date" :editable="false" @on-change="selectTime" format="yyyy-MM-dd" placeholder="日期" style="width: 200px"></DatePicker>
        <Input v-model="carTimeNo" class="top-right" placeholder="班次编号" style="width: 200px" />
        <Select v-model="routeId" style="width:200px" class="top-right">
          <Option value="all">全部</Option>
          <Option v-for="item in lineList" :value="item.routeCode" :key="item.routeCode">{{ item.routeName }}</Option>
      </Select>
        <Button type="primary" icon="md-search" @click="searchFun" class="top-right">搜索</Button>
        <!-- <Button type="primary"  @click="importFun" v-if="lineData.length">批量导入</Button> -->
    </Row>
    <Row class="p-top" type="flex" >
      <Col style="width:500px;margin-right:16px;margin-bottom:16px">
        <Table highlight-row  :columns="lineColumn" :data="lineData" @on-row-click="slectRule" ></Table>
        <Page class="p-top" :current="currPage" :total="totalPage" @on-change="changePage"/>
      </Col>
      <Col v-show="siteList.length" style="position:relative;min-height:100px;">
        <stock-table :siteList="siteList" :lineInfo="lineInfo" :searchDate="searchDate"></stock-table>
        <Spin fix size="large" v-if="loading"></Spin>
      </Col>
    </Row>
    <stock-modal :modalFlag="modalFlag" @save="saveStock" @cancel="cancelFun"></stock-modal>
  </div>
</template>

<script>
import StockTable from '../components/stock_table.vue'
import StockModal from '../components/stock_modal.vue'
import { getStockAxios, importStockOut, carInfoListAxios } from '../apis/xjt_line.js'
// import { carInfoListAxios } from '@/api/car.js'
import { mapActions, mapState } from 'vuex'
export default {
  components: { StockTable, StockModal },
  props: {},
  data () {
    return {
      loading: false,
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      searchDate: new Date().format('yyyy-MM-dd'),
      carTimeNo: '',
      routeId: '',
      busId: '',
      modalFlag: false,
      lineColumn: [
        {
          title: '线路编号',
          key: 'routeNo'
        },
        {
          title: '线路名称',
          key: 'routeName'
        },
        {
          title: '班次编号',
          key: 'busNo'
        },
        {
          title: '班次时间',
          key: 'driveBeginTime'
        },
        {
          title: '车辆',
          key: 'carNumber'
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
      currentId: '',
      currentCode: '',
      busNo: '',
      lineInfo: {},
      siteInfo: {}
    }
  },
  watch: {
    searchDate: function (newVal, oldVal) {
      if (newVal != oldVal && newVal) {
        this.getPriceList()
      }
    },
    busId: function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.getPriceList()
      }
    }
  },
  computed: {
    ...mapState({
      lineList: state => state.lineManage.lineList
    })
  },
  methods: {
    ...mapActions('lineManage/', ['getLineAction']),
    slectRule (row) {
      this.lineInfo = row
      this.currentId = row.routeId
      this.currentCode = row.routeNo
      this.busNo = row.busNo
      this.busId = row.id
      // this.getPriceList();
    },
    getPriceList () {
      let params = {
        dateStr: this.searchDate,
        busId: this.busId,
        routeCode: this.currentCode,
        trainNumberCode: this.busNo
      }
      this.loading = true
      getStockAxios(params).then(res => {
        this.loading = false
        if (res.status === 200 && res.data.status == 200) {
          this.siteList = res.data.data
        }
      })
    },
    changePage (num) {
      this.currPage = num
      this.getCatimeList()
    },
    selectTime (date) {
      this.searchDate = date
    },
    searchFun () {
      this.currPage = 1
      this.getCatimeList()
    },
    importFun () {
      this.modalFlag = true
    },
    cancelFun () {
      this.modalFlag = false
    },
    saveStock (stock) {
      let lineInfo = this.lineInfo
      let params = {
        busId: lineInfo.id,
        routeId: lineInfo.routeId,
        stockBgTime: stock.stockBgTime,
        stockEndTime: stock.stockEndTime,
        stockNum: stock.stockNum,
        trainNumberId: lineInfo.trainNumberId
      }
      importStockOut(params).then(res => {
        if (res.success) {
          this.modalFlag = false
          this.getPriceList()
        }
      })
    },
    /**
     * flag[string]
     * '01'表示不可操作，'02'表示要调用新增接口。'03'表示要掉修改接口
     */
    getCatimeList () {
      let params = {
        routeCode: this.routeId === 'all' ? '' : this.routeId,
        busCode: this.carTimeNo,
        currPage: this.currPage,
        pageSize: this.pageSize
      }
      carInfoListAxios(params).then(res => {
        if (res.status === 200 && res.data.status === 200) {
          let data = res.data.data.rows
          this.totalPage = res.data.data.recordsTotal
          this.lineData = data
          if (data.length) { // 默认展示列表第一条数据价格
            let row = data[0]
            this.slectRule(row)
            // this.lineInfo = data[0];
            // this.currentId = data[0].routeId;
            this.getPriceList()
            data[0]._highlight = true
          }
        }
      })
    }
  },
  created () {},
  mounted () {
    this.getLineAction()
    this.getCatimeList()
  }

}
</script>
<style lang="scss" scoped>
@import '../xjtCommon.scss'
</style>
