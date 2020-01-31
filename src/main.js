import Vue from "vue";
import App from "./App";
import "./validate";
import router from "./router";
import "babel-polyfill";
import store from "./store";
import iView from "iview";
import iviewArea from "iview-area";
// import $ from 'jquery'
import VueCookies from 'vue-cookies'
import 'iview/dist/styles/iview.css'
import VueClipboard from 'vue-clipboard2'
import VueAMap from 'vue-amap'
import './common/permission.js'
import myPlugin from './common/myPlugin.js'

import VueQrcode from '@xkeshi/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);

// window.$ = $;
// Vue.use(VueAMap);
Vue.use(iView);
Vue.use(VueCookies);
Vue.use(iviewArea);
Vue.use(VueClipboard);
Vue.use(myPlugin)
Vue.config.productionTip = false;
setTimeout(() => {
  localStorage.removeItem('_AMap_raster')
  Vue.use(VueAMap);
  VueAMap.initAMapApiLoader({
    key: "b547d05d07535668173a50b6d644ffce",
    plugin: [
      "AMap.Geocoder",
      "AMap.Autocomplete",
      "AMap.PlaceSearch",
      "AMap.Scale",
      "AMap.OverView",
      "AMap.ToolBar",
      "AMap.MapType",
      "AMap.PolyEditor",
      "AMap.CircleEditor"
    ],
    // 默认高德 sdk 版本为 1.4.4
    v: "1.4.4"
  });
}, 0)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: {
    App,
  },
  template: "<App/>"
});
