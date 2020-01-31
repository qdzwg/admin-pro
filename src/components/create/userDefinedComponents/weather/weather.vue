<template>
  <div class="weather-show-box" :style="{'background':data.backgroundColor}">
    <!-- {{data}} -->
    <!-- <div class="weather">
      <span>今日天气</span>
      <span>{{data.province?data.province:''}}{{data.city?data.city:''}}{{data.area?data.area:''}}</span>
      <span>{{data.weather?data.weather:''}}</span>
      <span>{{data.temperature?(data.temperature+'℃'):''}}</span>
      <span>{{weekDay}}</span>
    </div>-->
    <div class="clearfix weather">
      <div class="fl weather-left">
        <div class="weather-left-top">
          <span class="weather-text">{{data.weather?data.weather:''}}</span><span>{{weekDay}}</span>
        </div>
        <div
          class="weather-left-bottom"
        >
        {{data.province?data.province:''}}
        {{data.city?data.city:''}}
        {{data.area?data.area:''}}
        </div>
      </div>
      <div class="fr weather-right">{{data.temperature?(data.temperature+'℃'):''}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  created() {
    let arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let date = new Date().getDay();
    this.weekDay = arr[date];
  },
  data() {
    return {
      weekDay: ""
    };
  },
  methods: {}
};
</script>
<style lang="scss">
.weather-show-box {
  .weather {
    padding: 0 10px;
    .weather-left {
      .weather-left-top {
        font-size: 14px;
        color: #413838;
        margin-top: 11px;
        .weather-text{
          margin-right: 10px;
        }
      }
      .weather-left-bottom {
        font-size: 11px;
        color: #413838;
      }
    }
    .weather-right {
      height: 59px;
      line-height: 59px;
      font-size: 30px;
      color: #413838;
    }
  }
}
</style>
