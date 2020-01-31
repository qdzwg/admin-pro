<template>
  <div class="wrapper" id="line">
    <line-info ref="lineinfo" ></line-info>
    <site-list id="siteList"></site-list>
    <!-- <car-time ref="carTime" id="carTime"></car-time> -->
    <!-- <car-bus ref="busMan" id="carbus"></car-bus> -->
    <site-time ref="siteTime" id="siteTime"></site-time>
    <dist-type ref="distInfo" ></dist-type>
    <Row class="row-style" type="flex" justify="center">
      <Button type="primary" style="margin-right:20px;" @click="backFun">返回</Button>
      <Button type="primary" class="ml" @click="saveBtnFun($event)">保存</Button>
    </Row>
     <Spin size="large" fix v-if="isLoading"></Spin>
  </div>
</template>

<script>

import LineInfo from '../components/line_info.vue'
import DistType from '../components/dist_type.vue'
import SiteList from '../components/site_list.vue'
import CarTime from '../components/car_time.vue'
import SiteTime from '../components/site_time.vue'
// import CarBus from '../components/car_bus.vue'
import cloneDeep from 'lodash.clonedeep'
import { mapState, mapActions } from 'vuex'
import { addLineAxios, editLineAxios } from '../apis/xjt_line.js'
export default {
  components: { LineInfo, CarTime, SiteList, SiteTime, DistType },
  props: {},
  data () {
    return {
      isLoading: this.lineIsLoading
    }
  },
  watch: {},
  computed: {
    ...mapState('lineManage/', {
      lineIsLoading: state => state.lineIsLoading,
      carLineFlag: state => state.carLineFlag,
      lineInfo: state => state.lineInfo,
      distInfo: state => state.distInfo,
      lineTimeList: state => state.lineTimeList,
      siteList: state => state.siteList,
      carManTime: state => state.carManTime,
      busScheduleVos: state => state.busScheduleVos
    })
  },
  methods: {
    ...mapActions('lineManage/', ['initLine']),
    async saveBtnFun (event) {
      // 收集数据提交
      let lineFlag = await this.$refs.lineinfo.validateLine();
      let distFlag = await this.$refs.distInfo.validateDist();
      // let busFlag = await this.$refs.busMan.viliteBusFun()
      if (lineFlag&&distFlag) {
        let { runBeginTime, runEndTime } = this.lineInfo
        let start = new Date(runBeginTime).getTime()
        let end = new Date(runEndTime).getTime()
        if (end < start) {
          this.$Message.warning('线路结束时间不能大于线路开始时间')
          return
        }
        let showTime = cloneDeep(this.lineTimeList.show).filter(item => { return item.driveBeginTime })
        let hideTime = cloneDeep(this.lineTimeList.hide)
        let timeList = [].concat(showTime, hideTime)

        // let isHasTime = showTime.some(item => {
        //   return item.driveBeginTime
        // })
        if (!showTime || !showTime.length) {
          this.$Message.warning('请至少填写一个班次信息')
          this._scrollTop('carTime')
          return
        }
        let showSite = cloneDeep(this.siteList.show)
        let hideSite = cloneDeep(this.siteList.hide)
        let siteList = [].concat(showSite, hideSite)
        if (showSite.length < 2) {
          this.$Message.warning('请至少维护两个站点信息')
          this._scrollTop('siteList')
          return
        }
        // 判断每个时刻下都有排版信息
        // const busFlag = this.$refs.busMan.verifyBus()
        // if (busFlag) {
        //   this._scrollTop('carbus')
        //   return
        // }
        let carManList = cloneDeep(this.carManTime.showCarManList)

        /** 验证当前时刻表下数据是否为空
         *  */
        let hasTime = this.$refs.siteTime.verifyTime()
        if (hasTime) {
          this._scrollTop('siteTime')
          return
        }

        let busScheduleVos = cloneDeep(this.busScheduleVos)
        let siteTimeList = []
        let delList = busScheduleVos['hide']
        delete busScheduleVos['hide']

        const timeKeyList = Object.keys(busScheduleVos)
        let otherTimeFlag = this.$refs.siteTime.veryOtherTime(timeKeyList)
        if (otherTimeFlag) {
          this._scrollTop('siteTime')
          return
        }
        let compareFlag = this.$refs.siteTime.compareTime()
        if (compareFlag) return
        timeKeyList.forEach(item => {
          let list = busScheduleVos[item]
          if (delList.length) {
            delList.forEach(del => {
              del.driveBeginTime = list[0].driveBeginTime
              list.push(del)
            })
          }
          siteTimeList = siteTimeList.concat(busScheduleVos[item])
        })
        let params = { timeList, siteList, carManList, siteTimeList }
        if (this.carLineFlag) { // 新增
          this._addLine(params)
        } else {
          this._editLine(params)
        }
      }
    },
    backFun () {
      // 清空本地缓存
      this.$router.push({ name: 'car_line' })
    },
    _addLine (param) {
      this.isLoading = true

      let params = {
        ...this.lineInfo,
        trainNumbers: param.timeList, // 时间
        busSites: param.siteList, // 站点集合
        busInfoVos: param.carManList, // 车俩信息
        busScheduleVos: param.siteTimeList // 时刻表
      }
      addLineAxios(params).then(res => {
        this.isLoading = false
        if (res.success) {
          this.$router.replace({ name: 'car_line' })
        }
      }).catch(err => {
        this.isLoading = false
      })
    },
    _editLine (param) {
      this.isLoading = true
      let params = {
        ...this.lineInfo,
        // trainNumberVos: param.timeList,
        // busSiteVos: param.siteList,
        // busInfoVos: param.carManList,
        // busScheduleVos: param.siteTimeList
      }
      delete params.routeType;
      delete params.runBeginTime;
      delete params.runEndTime;
      editLineAxios(params).then(res => {
        this.isLoading = false
        if (res.status === 200 && res.data.status === 200) {
          this.$Message.success('保存成功')
          this.$router.replace({ name: 'routeMgt' })
        }
      }).catch(err => {
        this.isLoading = false
      })
    },
    _scrollTop (dom) {
      let carBusDom = document.getElementById(dom)
      let scrollTop = carBusDom.offsetTop
      carBusDom.style.cssText = 'border:1px solid red;padding:10px'

      document.getElementById('content').scrollTop = scrollTop
      // document.getElementsByClassName('content-bg')[0].scrollTop = scrollTop;
      this.timer = setTimeout(() => {
        carBusDom.style.cssText = ''
      }, 1000)
    }

  },
  created () {

  },
  mounted () {},
  distroyed () {
    this.timer = null
  },
  beforeRouteLeave (to, from, next) {
    next()
    this.initLine()
  }
  // beforeRouteLeave(to, from, next) {
  //   next();
  //   this.initLine();
  // }
}
</script>
<style lang="scss" scoped>
.wrapper{
  max-width: 900px;
  transform:translateZ(-300px);
  .time-wrap {
    display: flex;
    .time {
      box-sizing: border-box;
      width: 120px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      margin-right: 10px;
      border: 1px solid rgb(121, 121, 121);
      cursor: pointer;
    }
    .active {
      background-color: rgba(153, 204, 255, 1);
      border: none;
    }
  }
  .row-style{
    margin-top:20px;
  }
}
</style>
