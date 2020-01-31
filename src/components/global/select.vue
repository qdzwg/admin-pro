<template>
  <div class="linkage">
    <Select
      v-model="sheng"
      @on-change="choseProvince"
      placeholder="省级地区"
      transfer
      :label-in-value="labelValue"
      style="width:32%"
    >
      <Option
        v-for="item in province"
        :key="item.id"
        :label="item.value"
        :value="item.id"
      >
      </Option>
    </Select>

    <Select
      v-model="shi"
      @on-change="choseCity"
      :label-in-value="labelValue"
      transfer
      placeholder="市级地区"
      style="width:32%"
    >
      <Option
        v-for="item in city"
        :key="item.id"
        :label="item.value"
        :value="item.id"
      >
      </Option>
    </Select>

    <Select
      v-model="qu"
      @on-change="choseBlock"
      transfer
      :label-in-value="labelValue"
      placeholder="区级地区"
      style="width:32%"
    >
      <Option
        v-for="item in block"
        :key="item.id"
        :label="item.value"
        :value="item.id"
      >
      </Option>
    </Select>
  </div>
</template>

<script>
import mapJson from "../../../static/json/map.json";
export default {
  data() {
    return {
      labelValue: true,
      province: [],
      cityAll: [],
      blockAll: [],
      sheng: "",
      shi: "",
      qu: "",
      areaList: [] //存放省市区
    };
  },
  props: {
    areaCode: {
      type: String,
      default: "130000-130100-130102"
    }
  },
  mounted() {},
  watch: {
    areaCode: {
      handler: function(newVal) {
        if (newVal) {
          let list = newVal.split("-");
          if (list.length === 3) {
            this.sheng = list[0].trim();
            this.shi = list[1].trim();
            this.qu = list[2].trim();
          }
        }
      },
      immediate: true
    }
  },
  created() {
    this.initProvince();
  },
  computed: {
    city: function() {
      let cidyCode = this.sheng.slice(0, 2);
      let city = [];
      if (cidyCode) {
        city = this.cityAll.filter(item => {
          return cidyCode === item.id.slice(0, 2);
        });
      }
      return city;
    },
    block: function() {
      let quCode = this.shi.slice(0, 4);
      let block = [];
      if (quCode) {
        block = this.blockAll.filter(item => {
          return quCode === item.id.slice(0, 4);
        });
      }
      return block;
    }
  },
  methods: {
    /**一次遍历出省市区初始数据 */
    initProvince() {
      let data = mapJson;
      let province = [];
      let cityAll = [];
      let blockAll = [];
      for (var item in data) {
        if (item.match(/0000$/)) {
          //省
          province.push({
            id: item,
            value: data[item]
          });
        } else if (item.match(/00$/)) {
          //市
          cityAll.push({ id: item, value: data[item] });
        } else {
          //区
          blockAll.push({ id: item, value: data[item] });
        }
      }
      this.province = province;
      this.cityAll = cityAll;
      this.blockAll = blockAll;
    },
    choseProvince(info) {
      this.shen = info.value;
      let cityList = this.city;
      let hasCode = this._hasCode(this.shi, cityList);
      if (!hasCode) {
        //this.block会发生变化
        this.shi = cityList[0].id;
      }
      let blockList = this.block;
      hasCode = this._hasCode(this.qu, blockList);
      if (!hasCode) {
        this.qu = blockList[0].id;
      }

      this._emit("getProvince", info.label, info.value);
      this._emit("getCity", cityList[0].value, cityList[0].id);
      this._emit("getQu", blockList[0].value, blockList[0].id);

      this.areaList = [
        { name: info.label, code: info.value },
        { name: cityList[0].value, code: cityList[0].id },
        { name: blockList[0].value, code: blockList[0].id }
      ];
      this._pushAll(this.areaList);
    },
    // 选市
    choseCity(info) {
      this.shi = info.value;
      let blockList = this.block;
      let hasCode = this._hasCode(this.qu, blockList);
      if (!hasCode) {
        this.qu = blockList[0].id;
      }

      this._emit("getCity", info.label, info.value);
      this._emit("getQu", blockList[0].value, blockList[0].id);

      this.areaList.splice(
        1,
        2,
        { name: info.label, code: info.value },
        { name: blockList[0].value, code: blockList[0].id }
      );
      this._pushAll(this.areaList);
    },
    // 选区
    choseBlock(info) {
      this.qu = info.value;

      this._emit("getQu", info.label, info.value);

      this.areaList.splice(2, 1, { name: info.label, code: info.value });
      this._pushAll(this.areaList);
    },
    /**编码是否在已有的列表中
     * @param {string} code 省市区编码
     * @param {array} list 省市区列表
     * @return {boolean}
     */
    _hasCode(code, list) {
      let isHas = list.some(item => {
        return item.id == code;
      });
      return isHas;
    },
    /**传递数据
     * @param {string} eventName 事件名称
     * @param {string} name 省市区名字
     * @param {string} code 省市区编码
     */
    _emit(eventName, name, code) {
      this.$emit(eventName, name, code);
    },
    /**返回省市区信息
     * @param {array} list {name:名字,code:编码}
     *
     */
    _pushAll(list) {
      this.$emit("getAll", list);
    }
  }
};
</script>
