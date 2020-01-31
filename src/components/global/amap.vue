<template>
  <div>
    <Modal v-model="modal"
           title="选择经纬度"
           width="75%">
      <div class="amap-page-container">
        <el-amap-search-box class="search-box"
                            :search-option="searchOption"
                            :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap :plugin="plugin"
                 vid="amapDemo"
                 :events="events"
                 :center="mapCenter"
                 :zoom="12"
                 class="amap-demo">
          <!-- <el-amap-marker v-for="(marker,index) in markers" :key='index' ></el-amap-marker> -->
          <el-amap-marker v-for="(marker, index) in markers"
                          :key='index'
                          :position="marker.position"
                          :events="marker.events"
                          :visible="marker.visible"
                          :draggable="marker.draggable"
                          :vid="index"></el-amap-marker>
        </el-amap>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    let vm = this
    return {
      keyword: '',
      modal: false,
      plugin: [
        {
          pName: 'ToolBar', // 工具条插件
          position: 'LB'
        },
        {
          pName: 'PlaceSearch' // 卫星与地图切换
        },
        {
          pName: 'OverView'
          // isOpen:true//鹰眼是否打开
        },
        {
          pName: 'Scale'
        },
        {
          pName: 'Geolocation', // 定位插件
          showMarker: false,
          events: {
            init (o) {
              // 定位成功 自动将marker和circle移到定位点
              o.getCurrentPosition((status, result) => {
                // console.log(result)
                vm.center = [result.position.lng, result.position.lat]
              })
            }
          }
        }
      ],
      markers: [],
      events: {
        init: (o) => {
          // console.log(o)
          o.getCity(result => {
            // console.log(result)
          })
        },
        'click': (e) => {
          // console.log(e.lnglat)
          vm.modal = false
          vm.$emit('getPoint', e.lnglat)
          // var geocoder = new AMap.Geocoder({
          //     radius: 1000,
          //     extensions: "all"
          // });
          // _this.initData.longitude = e.lnglat.lng; // 经度
          // _this.initData.latitude = e.lnglat.lat; // 纬度
          // _this.center = [ e.lnglat.lng, e.lnglat.lat]; // 地图切换到该位置
          // _this.circleList[0].center = [ e.lnglat.lng, e.lnglat.lat]; // 地图切换到该位置
          // geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function(status, result) {
          //     if (status === 'complete' && result.info === 'OK') {
          //           if (result && result.regeocode) {
          //                 _this.initData.province = result.regeocode.addressComponent.province; // 省
          //                 _this.initData.city = result.regeocode.addressComponent.city; // 市
          //                 _this.initData.county = result.regeocode.addressComponent.district; // 区 / 镇
          //                 _this.initData.address = result.regeocode.formattedAddress; // 具体地址
          //                 _this.$nextTick();
          //             }
          //     }
          // });
        }
      },
      searchOption: {
        city: '全国',
        citylimit: true
      },
      mapCenter: [120.230102, 30.279867]
    }
  },
  watch: {
    name (val) {
      this.keyword = (val.split('-')[0] + val.split('-')[1] + val.split('-')[2] + val.split('-')[3])
    }
  },
  // components: { addressComponent },
  props: ['mark', 'name'],
  mounted () {
    if (this.mark) {
      this.mapCenter = this.mark
      let _this = this
      this.markers.push({
        position: this.mark,
        events: {
          click: (e) => {
            // console.log(e.lnglat)
            _this.modal = false
            _this.$emit('getPoint', e.lnglat)
          }
        },
        visible: true,
        draggable: false,
        template: '<span>1</span>'
      })
    }
  },
  methods: {
    showModal () {
      this.modal = true
    },
    onSearchResult (pois) {
      this.markers = []
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        let _this = this
        pois.forEach(poi => {
          let { lng, lat } = poi
          lngSum += lng
          latSum += lat
          // this.markers.push([poi.lng, poi.lat]);
          this.markers.push({
            position: [poi.lng, poi.lat],
            events: {
              click: (e) => {
                // console.log(e.lnglat)
                _this.modal = false
                _this.$emit('getPoint', e.lnglat)
              }
            },
            visible: true,
            draggable: false,
            template: '<span>1</span>'
          })
        })
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapCenter = [center.lng, center.lat]
      }
      // console.log(this.markers)
    }
  }
}
</script>

<style>
.amap-page-container .search-box {
  position: absolute;
  top: 25px;
  left: 20px;
}

.amap-page-container {
  position: relative;
  overflow: hidden;
  height: 500px;
}
</style>
