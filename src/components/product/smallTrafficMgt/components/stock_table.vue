<template>
  <div class="price-table">
      <div class="table-head">
          <h4>班次库存</h4>
          <p>查询时间:{{searchDate}}</p>
      </div>
      <ul>
        <li class="station" v-for="(station,index) in siteList" :key="station.siteId">
          <span class="station-name" :title="station.siteName">{{station.siteName}}</span>
          <span :class="[site.flag==='01'?'disable-price':'','bottom-name price']" v-for="(site,key) in station.busDailyStockDto" :key="key" @click="editPrice(index,key,site.flag)">{{site.flag!=='01'?(site.stockNum?site.stockNum:0):''}}</span>
        </li>
      </ul>
      <div class="station bottom-wrap">
          <span class="station-text">站点</span>
          <span class="bottom-name" :title="station.siteName" v-for="(station,index) in siteList" :key="station.siteId">{{station.siteName}}</span>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  components: {},
  props: {
    siteList: Array,
    lineInfo: Object,
    searchDate: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
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
    ...mapMutations('lineManage/', ['setStockListparams']),
    editPrice (index, key, flag) {
      if (flag == '01') return
      let siteInfo = this.siteList[index]
      let lineInfo = this.lineInfo
      let siteDetail = siteInfo.busDailyStockDto[key]
      let params = {
        routeId: siteInfo.routeId,
        routeName: lineInfo.routeName,
        routeNo: lineInfo.routeNo,
        siteId: siteInfo.id,
        siteAliasName: siteInfo.siteName,
        carNumber: lineInfo.carNumber,
        driveBeginTime: lineInfo.driveBeginTime,
        trainNumberId: siteDetail.trainNumberId,
        busId: lineInfo.id
      }
      this.setStockListparams(params)
      this.$router.push({ name: 'car_stock_list' })
    }
  },
  filters: {
    filterPrice: function (value) {
      console.log(value)
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
