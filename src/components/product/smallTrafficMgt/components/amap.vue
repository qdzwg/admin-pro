<template>
    <div class="box">
        <Modal v-model="modal" width=800 title="选择经纬度" class="map-wrap" @on-cancel="cancelMap" :mask-closable="false" :footer-hide="true">
            <div id="container" ref="container">

            </div>
            <label class="map-search">关键词：<input id="input" @onfocus='this.value=""' placeholder="请输入关键字进行搜索"></label>

        </Modal>
        <Modal v-model="confirm" width=300   :footer-hide="true" :mask-closable="false" @on-cancel="cancelStation">
          <Form ref="stationName" :model="station" :rules="valitStation" :label-width="60" style="margin-top:20px">
            <FormItem label="地址 :" style="margin-bottom:6px;line-height:18px">
              <p>{{station.address}}</p>
            </FormItem>
            <FormItem label="站名 :" prop="stationName">
              <Input v-model="station.stationName" placeholder="请输入站点名称"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" style="width:100px" @click="saveStation">设为站点</Button>
            </FormItem>
          </Form>
        </Modal>
    </div>
</template>

<script>
export default {
  data () {
    return {
      map: '',
      placeSearch: '',
      geocoder: '',
      modal: false,
      confirm: false,
      markers: [],
      keyword: '',
      station: {
        point: '',
        address: '',
        stationName: ''
      },
      valitStation: {
        stationName: [
          { required: true, message: '请输入站点名称', trigger: 'blur' },
          { type: 'string', max: 12, message: '最大输入长度12个字符', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['mark'],
  created () {

  },
  // beforeMount() {
  //   window.onLoad = this.init;
  //   let url = 'https://webapi.amap.com/maps?v=1.4.14&key=b547d05d07535668173a50b6d644ffce&callback=onLoad';
  //   let jsapi = document.createElement('script');
  //   jsapi.charset = 'utf-8';
  //   jsapi.src = url;
  //   jsapi.id = 'amapjs';
  //   document.head.appendChild(jsapi);

  //   let uiUrl = '//webapi.amap.com/ui/1.0/main.js';
  //   let uiScript = document.createElement('script');
  //   uiScript.src = uiUrl;
  //   uiScript.id = 'amapui';
  //   document.head.appendChild(uiScript);
  // },
  mounted () {

  },
  watch: {
    modal: function (newVal) {
      if (newVal) {
        this.markFun()
      }
    }
  },
  methods: {
    showModal (mark) {
      this.modal = true
      this.init(mark)
    },
    cancelMap () {
      this.distoryMap()
    },
    saveStation () {
      this.$refs['stationName'].validate((valid) => {
        if (valid) {
          this.distoryMap()
          this.$emit('getpoit', this.station)
          this.modal = false
          this.confirm = false
          this.cancelStation()
        }
      })
    },
    cancelStation () {
      this.$refs['stationName'].resetFields()
    },
    init (mark) {
      let _this = this
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: mark || [120.116747, 30.290213], // 地图中心点
        zoom: 15 // 地图显示的缩放级别
      }) // 添加构造器
      AMap.plugin(
        [
          'AMap.Autocomplete',
          'AMap.ElasticMarker',
          'AMap.Marker',
          'AMap.PlaceSearch',
          'AMap.Geocoder'
        ],
        function () {
          _this.map.addControl(new AMap.ElasticMarker())
          _this.map.addControl(new AMap.Marker())
          _this.map.addControl(new AMap.Autocomplete())
          _this.map.addControl(new AMap.PlaceSearch())
          _this.map.addControl(new AMap.Geocoder())
        }
      )
      if (!this.geocoder) {
        this.geocoder = new AMap.Geocoder({
          // city: '010', // 城市设为北京，默认：“全国”
          radius: 1000 // 范围，默认：500
        })
      }
      this._placeSearch()
      this.markFun(mark)
      // 为地图注册click事件获取鼠标点击出的经纬度坐标
      var clickEventListener = _this.map.on('click', function (e) {
        // let test = [];
        // test.push(e.lnglat.getLng() + "," + e.lnglat.getLat());
        // _this.markers = test;
        // map.add(marker);
        _this._regoCode(e.lnglat)

        // _this.$emit('getPoint', e.lnglat);
        _this.keyword = ''
      })
    },
    _regoCode (lnglat) {
      let _this = this
      // if (!this.geocoder) {
      //   this.geocoder = new AMap.Geocoder({
      //     // city: '010', // 城市设为北京，默认：“全国”
      //     radius: 1000 // 范围，默认：500
      //   });
      // }
      this.geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.regeocode) {
          var addressInfo = result.regeocode.formattedAddress
          let district = result.regeocode.addressComponent.district
          let index = addressInfo.indexOf(district)
          let address = addressInfo.substring(index + district.length)
          let point = lnglat.lat + ',' + lnglat.lng
          _this.station.address = address
          _this.station.point = point
          _this.confirm = true
        } else {
          _this.$Message.error('根据经纬度查询地址失败')
          // log.error('根据经纬度查询地址失败');
        }
      })
    },
    _placeSearch () {
      let self = this
      let auto = new AMap.Autocomplete({ input: 'input' })
      this.placeSearch = new AMap.PlaceSearch({
        map: this.map
      }) // 构造地点查询类
      AMap.event.addListener(auto, 'select', this.selectFun)// 注册监听，当选中某条记录时会触发
      AMap.event.addListener(this.placeSearch, 'markerClick', function (result) {
        // console.log(result);
        // self._regoCode(event.lnglat);
        let point = result.event.lnglat.lat + ',' + result.event.lnglat.lng
        self.station.address = result.data.address
        self.station.point = point
        self.confirm = true
      })
    },
    markFun (mark) {
      // 构造点标记
      let marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: mark || [120.116747, 30.290213],
        offset: new AMap.Pixel(-13, -30)
      })
      if (mark) {
        // marker.setMap(this.map);
        this.map.add(marker)
        marker.setAnimation('AMAP_ANIMATION_BOUNCE')
        AMap.event.addListener(marker, 'click', this.selectMark)
      }
    },
    selectFun (e) {
      this.placeSearch.setCity(e.poi.adcode)
      this.placeSearch.search(e.poi.name) // 关键字查询查询
    },
    selectMark (e) {
      this._regoCode(e.lnglat)
    },
    distoryMap () {
      this.map.destroy()
      document.getElementById('input').value = ''
      this.value = ''
    }
  }
  // destroyed() {
  //   let head = document.getElementsByTagName('head')[0];
  //   head.removeChild(document.getElementById('amapjs'));
  //   head.removeChild(document.getElementById('amapui'));
  // }
}
</script>

<style lang="scss" scoped>
// .box {
//   width: 100%;
//   height: 400px;
// }

#container {
  width: 100%;
  height: 400px;
}
.map-search {
  position: absolute;
  top: 75px;
  left: 25px;
  z-index: 9999;
  width: 240px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  padding: 5px;
  font-size: 14px;
}
.map-search input {
  border: none;
  outline: none;
  height: 28px;
  line-height: 28px;
  width: 160px;
}
.name-show{
  min-height:140px;
  padding-top:10px;
  display:flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
  text-align:center;
  p{
    width:100%;
    border:1px solid #e5e5e5;
    margin-bottom:6px;
    line-height:16px;
    text-align:center;
    padding:8px 0;
  }
}
.amap-sug-result{
  z-index:9999999;
}
</style>
