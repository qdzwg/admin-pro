<template>
  <div>
    <Row type="flex"
         :gutter="16">
      <Col span="8">
      <Select v-model="area.province"
              placeholder="请选择省..."
              not-found-text="省数据为空"
              @on-change="choseProvince">
        <Option v-for="item in provinceList"
                :key="item.areaCode"
                :value="item.areaCode">
          {{item.areaName}}
        </Option>
      </Select>
      </Col>
      <Col span="8">
      <Select v-model="area.city"
              @on-change="choseCity"
              placeholder="请选择市..."
              not-found-text="市数据为空">
        <Option v-for="item in cityList"
                :key="item.areaCode"
                :value="item.areaCode">
          {{item.areaName}}
        </Option>
      </Select>
      </Col>
      <Col span="8">
      <Select v-model="area.county"
              @on-change="choseCounty"
              placeholder="请选择区..."
              not-found-text="区数据为空">
        <Option v-for="item in countyList"
                :key="item.areaCode"
                :value="item.areaCode">
          {{item.areaName}}
        </Option>
      </Select>
      </Col>
    </Row>
  </div>

</template>
<script>
import { apiGet } from '@/fetch/api'
export default {
  data () {
    return {
      area: {
        province: '',
        city: '',
        county: ''
      },
      provinceList: [],
      cityList: [],
      countyList: []
    }
  },
  mounted () {
    this.getData('', 'provinceList')
  },
  props: ['value'],
  methods: {
    // 加载数据
    async getData (code, array) {
      let url = code ? '/admin/api/area/selectByPcode?parentCode=' + code : '/admin/api/area/selectByPcode'
      let res = await apiGet(url)
      if (res.status === 200) {
        this[array] = res.data
        if (this.value[0] && array === 'provinceList') {
          this.area.province = this.value[0].code
        }
        if (this.value[1] && array === 'cityList') {
          this.area.city = this.value[1].code
        }
        if (this.value[2] && array === 'countyList') {
          this.area.county = this.value[2].code
        }
      } else {
        this.$Message.error(res.message)
      }
    },
    // 选择省
    choseProvince (e) {
      this.getData(e, 'cityList')
      // this.area.province = e.value
      this.value[0] = {
        text: this.getName(e, this.provinceList),
        code: e
      }
      if (this.area.city) {
        this.area.city = ''
        this.area.county = ''
        this.value.splice(1, 2)
      }
    },
    // 选择市
    choseCity (e) {
      this.getData(e, 'countyList')
      // this.area.city = e
      if (this.area.city) {
        this.value[1] = {
          text: this.getName(e, this.cityList),
          code: e
        }
      }
      if (this.area.county) {
        this.area.county = ''
        this.value.splice(2, 1)
      }
    },
    // 选择区
    choseCounty (e) {
      // this.area.county = e.value
      if (this.area.county) {
        this.value[2] = {
          text: this.getName(e, this.countyList),
          code: e
        }
      }
    },
    // 取name值
    getName (code, array) {
      let name = ''
      array.forEach(element => {
        if (element.areaCode === code) {
          name = element.areaName
        }
      })
      return name
    }
  }
}
</script>
