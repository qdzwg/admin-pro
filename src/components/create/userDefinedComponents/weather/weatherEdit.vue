<template>
  <div class="line-edit-box">
    <div style="width:500px;height:500px;display:none" id="container"></div>
    <div>温馨提示：本天气组件仅可选择一地天气，且仅可查看当日天气，如需查看多日天气，可配置外部链接</div>
    <table class="edit-table">
      <tr>
        <td>选择城市</td>
        <td style="padding-top:25px">
          <Form>
            <select-list :span='8' @getProvince="getPro" @getCity="getC" @getQu="getQ" :addrCode="code"></select-list>
          </Form>
        </td>
      </tr>
      <tr>
        <td class="title">背景颜色</td>
        <td>
          <ColorPicker v-model="pageData.backgroundColor"/>
          <Input v-model="pageData.backgroundColor" placeholder="请填写颜色" style="width:100px"></Input>
          <Button @click="lineColorReset" type="primary" size="small">重置</Button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { mapState } from "vuex";
import selectList from "@/components/global/selectList";
export default {
  components: {
    draggable,
    selectList
  },
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    code() {
      let code = "";
      if (
        this.pageData.provinceCode &&
        this.pageData.cityCode &&
        this.pageData.areaCode
      ) {
        code =
          this.pageData.provinceCode +
          "-" +
          this.pageData.cityCode +
          "-" +
          this.pageData.areaCode;
      }
      if (
        this.pageData.provinceCode &&
        this.pageData.cityCode &&
        !this.pageData.areaCode
      ) {
        code = this.pageData.provinceCode + "-" + this.pageData.cityCode;
      }
      if (
        this.pageData.provinceCode &&
        !this.pageData.cityCode &&
        !this.pageData.areaCode
      ) {
        code = this.pageData.provinceCode;
      }
      return code;
    },
    pageData() {
      let _this = this;
      let data = this.list2[this.index].data;
      console.log(data);
      if (data.provinceCode) {
        AMap.plugin("AMap.Weather", function() {
          var weather = new AMap.Weather();
          //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
          weather.getLive(data.provinceCode, function(err, res) {
              console.log(res);
            if (res.weather) {
              data.weather = res.weather;
              data.temperature = res.temperature;
              if (data.cityCode) {
                weather.getLive(data.cityCode, function(err, res) {
                  console.log(res);
                  if (res.weather) {
                    data.weather = res.weather;
                    data.temperature = res.temperature;
                    if (data.areaCode) {
                      weather.getLive(_this.pageData.areaCode, function(
                        err,
                        res
                      ) {
                        console.log(res);
                        if (res.weather) {
                          data.weather = res.weather;
                          data.temperature = res.temperature;
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        });
      }
      return data;
    },
    ...mapState({
      list2: state => {
        //   console.log(state)
        return state.defined.list;
      },
      errorShow: state => {
        return state.defined.errorShow;
      }
    })
  },
  created() {
  },
  data() {
    return {
      num:0
      // code: ""
      // pageData: this.data
    };
  },
  methods: {
    test(){
      AMap.plugin("AMap.Weather", function() {
        var weather = new AMap.Weather();
        //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
        weather.getLive(e, function(err, data) {
      //      setInterval(()=>{

      // },1000)
        });
      });
     
    },
    getPro(name, e) {
      this.pageData.province = name;
      this.pageData.provinceCode = e;
      // console.log(name, e);
      this.pageData.city = null;
      this.pageData.area = null;
      let _this = this;
      this.pageData.city =''
      this.pageData.cityCode =''
      this.pageData.area =''
      this.pageData.areaCode =''
      AMap.plugin("AMap.Weather", function() {
        var weather = new AMap.Weather();
        //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
        weather.getLive(e, function(err, data) {
          _this.pageData.weather = data.weather;
          _this.pageData.temperature = data.temperature;
        });
      });
    },
    getC(name, e) {
      // console.log(name, e);
      let _this = this;
      this.pageData.city = name;
      this.pageData.cityCode = e;
      this.pageData.area = null;
       this.pageData.area =''
      this.pageData.areaCode =''
      // this.getWeatherData(this.pageData.city);
      AMap.plugin("AMap.Weather", function() {
        var weather = new AMap.Weather();
        //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
        weather.getLive(e, function(err, data) {
          // console.log(err)
          if (data.weather) {
            _this.pageData.weather = data.weather;
            _this.pageData.temperature = data.temperature;
          } else {
            weather.getLive(_this.pageData.provinceCode, function(err, data) {
              // console.log(err)
              if (data.weather) {
                // console.log(data);
                _this.pageData.weather = data.weather;
                _this.pageData.temperature = data.temperature;
              } else {
              }
            });
          }
        });
      });
    },
    getQ(name, e) {
      // console.log(name, e);
      this.pageData.area = name;
      this.pageData.areaCode = e;
      let _this = this;
      let city = this.pageData.cityCode;
      let province = this.pageData.provinceCode;
      AMap.plugin("AMap.Weather", function() {
        var weather = new AMap.Weather();
        //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
        weather.getLive(e, function(err, data) {
          // console.log(err)
          if (data.weather) {
            _this.pageData.weather = data.weather;
            _this.pageData.temperature = data.temperature;
          } else {
            weather.getLive(city, function(err, data) {
              // console.log(err)
              if (data.weather) {
                _this.pageData.weather = data.weather;
                _this.pageData.temperature = data.temperature;
              } else {
                weather.getLive(province, function(err, data) {
                  // console.log(err)
                  if (data.weather) {
                    _this.pageData.weather = data.weather;
                    _this.pageData.temperature = data.temperature;
                  } else {
                  }
                });
              }
            });
          }
        });
      });
    },
    lineColorReset() {
      //线条颜色重置为#999
      this.pageData.backgroundColor = "#999";
    },
    getWeatherData(data) {}
  },
  mounted() {}
};
</script>
<style lang='scss'>
.navigation-edit-box {
  // .img-text-list{
  //   .img-text-item{
  //     .img-add{
  //       width: 56px;
  //     }
  //   }
  // }
}
</style>

