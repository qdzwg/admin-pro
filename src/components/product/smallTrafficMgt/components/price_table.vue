<template>
  <div class="price-table">
      <div class="table-head">
          <h4>班次价格</h4>
          <p>查询时间:{{time}}</p>
      </div>
      <ul>
          <li class="station" v-for="(station,index) in siteList" :key="station.siteId">
              <span class="station-name">{{station.siteName}}</span>
              <span :class="[site.flag==='01'?'disable-price':'','bottom-name price']" v-for="(site,key) in station.trafficPriceInfo" :key="key" @click="editPrice(index,key,site.flag)">{{site.flag!=='01'?(site.priceRetail?site.priceRetail:0):''}}</span>
          </li>
      </ul>
      <div class="station bottom-wrap">
          <span class="station-text">站点</span>
          <span class="bottom-name" v-for="(station,index) in siteList" :key="station.siteId">{{station.siteName}}</span>
      </div>
      <modal-wrap  :flag="priceFlag" @cancel="cancelFun" @confirm="okFun">
        <!-- <Row class="price-edit">
            <Col span="12" class="label">日期:</Col>
            <Col>{{time}}</Col>
        </Row> -->
        <Row class="price-edit">
            <Col span="12" class="label">线路编号:</Col>
            <Col>{{siteInfo.routeCode}}</Col>
        </Row>
        <Row class="price-edit">
            <Col span="12" class="label">线路名称:</Col>
            <Col>{{siteInfo.lineName}}</Col>
        </Row>
        <Row class="price-edit">
            <Col span="12" class="label">修改价格站点:</Col>
            <Col>{{siteInfo.bgSiteName}}->{{siteInfo.edSiteName}}</Col>
        </Row>
        <Row class="price-edit">
            <Col span="12" class="label">店铺零售价:</Col>
            <InputNumber :min="0" :max='99999999' v-model="siteInfo.priceRetail" @on-change="changePriceRetail"></InputNumber>
        </Row>
        <Row class="price-edit">
            <Col span="12" class="label">分销市场供货价:</Col>
            <InputNumber :min="0" :max='99999999' v-model="siteInfo.priceDist" @on-change="changePriceDist"></InputNumber>
        </Row>
      </modal-wrap>
  </div>
</template>

<script>
import modalWrap from '../components/modalWrap.vue'
export default {
  components: {modalWrap},
  props: {
    siteList: Array,
    lineInfo: Object
  },
  data () {
    return {
      priceFlag: false,
      price: 0,
      time: new Date().format('yyyy-MM-dd hh:mm:ss'),
      siteInfo: {
        lineNumber: '线路编号',
        lineName: '线路名称',
        startSiteName: 'a',
        endSiteName: 'b',
        price: 0
      },
      priceList: [
        {
          title: 'A',
          list: [{ price: 0 }, { price: 1 }, { price: 1 }, { price: 1 }, { price: 1 }, { price: 1 }]
        }
      ]
    }
  },
  watch: {},
  computed: {},
  methods: {
    editPrice (startIndex, endIndex, flag) {
      if (flag == '01') return
      this.priceFlag = true
      let lineInfo = this.siteList[startIndex]
      let sitInfo = lineInfo.trafficPriceInfo[endIndex]
      this.siteInfo = {
        startIndex: startIndex,
        endIndex: endIndex,
        routeCode: this.lineInfo.routeCode,
        lineName: this.lineInfo.routeName,
        bgSiteName: sitInfo.bgSiteName,
        edSiteName: sitInfo.edSiteName,
        priceRetail: sitInfo.priceRetail || 0,
        priceDist: sitInfo.priceDist || 0
      }
    },
    okFun () {
      // this.priceFlag = false
      this.$emit('edit-price', this.siteInfo)
    },
    cancelFun () {
      this.priceFlag = false
      this.price = 0
    },
    changePriceRetail (price) {
      if (!price) {
        this.siteInfo.priceRetail = 0
      }
    },
    changePriceDist (price) {
      if (!price) {
        this.siteInfo.priceDist = 0
      }
    }
  },
  filters: {
    filterPrice: function (value) {
      if (value) {
        return value + '元'
      } else {
        return value
      }
    }
  },
  created () {},
  mounted () {}
}
</script>
<style lang="scss" scoped>
.price-table{
  .table-head{
    box-sizing: content-box;
    height:60px;
    border:1px solid #dcdee2;
    padding:10px;
    h4{
      font-size: 16px;
      height:40px;
      line-height: 40px;
      text-align:center;
    }
    p{
      font-size: 14px;
      height:20px;
      text-align:right;
    }
  }
  .station{
    display: flex;
    border-bottom:1px solid #dcdee2 ;
    border-left:1px solid #dcdee2 ;
    .station-name{
       width:180px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // flex:1;
      height:36px;
      line-height: 36px;
      text-align: center;
      border-right:1px solid #dcdee2 ;
      cursor: pointer;
    }
    .disable-price{
      background-color: #EBEEF9;
      cursor: default;
      color: #EBEEF9;
    }
    .bottom-name{
      box-sizing: border-box;
      padding:2px 36px;
      width:80px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // flex:1;
      height:180px;
      line-height: 16px;
      text-align: center;
      border-right:1px solid #dcdee2 ;
      white-space: pre-wrap;
      padding-top:20px;
    }
    .price{
      height:36px;
      padding:4px;
      width:80px;
      line-height: 36px;
    }
    .station-text{
      width:180px;
      height: 180px;
      line-height: 176px;
      font-size: 16px;
      text-align: center;
      border-right:1px solid #dcdee2 ;
    }
  }
  .bottom-wrap{
    height:180px;
  }
}
.price-edit{
  font-size: 14px;
  margin-top:12px;
  display: flex;
  align-items: center;
  .label{
    text-align: right;
    padding-right:20px;
  }
}
</style>
