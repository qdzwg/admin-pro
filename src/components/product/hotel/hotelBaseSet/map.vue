<template>
  <div class="amap-page-container">
    <div class="toolbar1">
      <el-amap-search-box
        class="search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box>
    </div>
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" :events="events" class="amap-demo">
      <el-amap-marker vid="component-marker" :position="position"></el-amap-marker>
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :events="marker.events"
        :vid="index"
      ></el-amap-marker>
    </el-amap>
  </div>
</template>

  <style>
.amap-demo {
  height: 300px;
}
.amap-page-container {
  height: 500px;
}
</style>
  <script>
export default {
  name: "amap-page",
  data() {
    let self = this;
    return {
      searchOption: {
        // city: '上海',
        citylimit: false
      },
      lng: 0,
      lat: 0,
      address: "",
      events: {
        click(e) {
          // console.log(e);
          self.getAddress(e)
        }
      },
      count: 1,
      slotStyle: {
        padding: "2px 8px",
        background: "#eee",
        color: "#333",
        border: "1px solid #aaa"
      },
      zoom: 14,
      center: [121.5273285, 31.21515044],
      markers: [],
      position: [121.5273285, 31.21315058]
    };
  },
  methods: {
    getAddress(e) {
      let self = this;
      console.log(e);
      let { lng, lat } = e.lnglat;
      self.lng = lng;
      self.lat = lat;
      self.markers = [];
      self.position = [lng, lat];
      // 这里通过高德 SDK 完成。
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      geocoder.getAddress([lng, lat], function(status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.regeocode) {
            console.log(result.regeocode);
            self.address = result.regeocode.formattedAddress;
            self.$nextTick();
          }
        }
      });
    },
    onSearchResult(pois) {
      console.log(pois);
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.markers.push({
            position: [poi.lng, poi.lat],
            events: {
              click: e => {
                this.getAddress(e);
              }
            }
          });
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.center = [center.lng, center.lat];
      }
    }
  }
};
</script>
  