<template>
  <div class="wrapper">
      <h4 class="edit-title">时刻表</h4>
      <Row>
        <ul class="time-wrap">
           <li :class="['time', currentSiteTime==item.driveBeginTime?'active':'']" v-if="item.driveBeginTime"
           v-for="(item,index) in getShowTimeList"
           @click="selectSiteTime(item)"
           :key="item.driveBeginTime"
            >{{item.driveBeginTime}}</li>
        </ul>
      </Row>
      <Table style="margin-top:20px" :columns="columns" :data="showTableList" class="row-style"
       :key="currentSiteTime" v-if="showTableList.length">
        <!-- <template slot-scope="{ column,row,index }" slot="arrive">
          <TimePicker format="HH:mm" :ref="'arriveEndTime'+index"  :value="row.arriveEndTime" :editable="false"
          :style="{border:endTipIndex==index?'1px solid red':''}"
          :key="currentSiteTime+index+'y'" :transfer="true" v-if="index!==0" @on-open-change="cumputeTime($event,column, row,index)" @on-clear="emptySiteTime(column,row,index)" @on-change="changeStart($event,column,row,index)"></TimePicker>
          <span style="text-align:center" v-else>/</span>
        </template>
        <template slot-scope="{ column,row,index }" slot="go">
          <TimePicker format="HH:mm" :ref="'arriveBeginTime'+index" :value="row.arriveBeginTime" :editable="false"
          :style="{border:startTipInex==index?'1px solid red':''}"
           :disabled="!index" :transfer="true" :key="currentSiteTime+index+'q'" v-model="row.arriveBeginTime" v-if="index!=showTableList.length-1" @on-open-change="cumputeTime($event,column, row,index)" @on-clear="emptySiteTime(column,row,index)" @on-change="changeEnd($event,column,row,index)"></TimePicker>
          <span v-else>/</span>
        </template> -->
      </Table>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import { setTimeout } from 'timers'
export default {
  components: {},
  props: {},
  data () {
    return {
      currentSiteTime: '',
      showTableList: [],
      columns: [
        {
          title: '站序',
          key: 'siteSerial',
          width: 60
        },
        {
          title: '站点',
          key: 'siteAliasName'
        },
        {
          title: '到达时间',
          key: 'arriveEndTime',
          // slot: 'arrive',
          render: (h, params) => {
            let {index, row, column} = params
            if (index !== 0) {
              return (h('TimePicker', {
                props: {
                  format: 'HH:mm',
                  ref: 'arriveEndTime' + index,
                  value: row.arriveEndTime,
                  disabled: true,
                  editable: false,
                  readonly: true,
                  key: this.currentSiteTime + index + 'y',
                  transfer: true
                },
                style: {
                  border: this.endTipIndex == index ? '1px solid red' : ''
                },
                on: {
                  // 'on-open-change': (val) => {
                  //   this.cumputeTime(val, column, row, index)
                  // },
                  // 'on-change': (val) => {
                  //   this.changeStart(val, column, row, index)
                  // },
                  // 'on-clear': () => {
                  //   this.emptySiteTime(column, row, index)
                  // }
                }
              }))
            } else {
              return (h('span', {
                style: {
                  textAlign: 'center'
                }
              }, '/'))
            }
          }
        },
        {
          title: '出发时间',
          key: 'arriveBeginTime',
          // slot: 'go',
          render: (h, params) => {
            let {index, column, row} = params
            if (index !== (this.showTableList.length - 1)) {
              return (h('TimePicker', {
                props: {
                  format: 'HH:mm',
                  ref: this.arriveBeginTime + index,
                  value: row.arriveBeginTime,
                  editable: false,
                  disabled: true,
                  readonly: true,
                  transfer: true,
                  key: this.currentSiteTime + index + 'q'
                },
                style: {
                  border: this.startTipInex == index ? '1px solid red' : ''
                },
                on: {
                  // 'on-open-change': (val) => {
                  //   this.cumputeTime(val, column, row, index)
                  // },
                  // 'on-change': (val) => {
                  //   this.changeEnd(val, column, row, index)
                  // },
                  // 'on-clear': () => {
                  //   this.emptySiteTime(column, row, index)
                  // }
                }
              }))
            } else {
              return (h('span', {
                style: {
                  textAlign: 'center'
                }
              }, '/'))
            }
          }
        },
        {
          align: 'center',
          title: '历时',
          key: 'betweenTime'
        },
        {
          maxWidth: 0,
          width: 1,
          title: '',
          filters: [{
            label: '修改删除',
            value: '3'
          }],
          filterMethod (value, row) {
            return row.id || row.flag != value
          },
          key: 'filter'
        }
      ],
      data: [],
      startTipInex: -1,
      endTipIndex: -1
    }
  },
  watch: {
    getShowTimeList: {
      handler: function (newVal, oldVal) {
        console.log(newVal)
        if (newVal.length && !this.currentSiteTime) {
          // 先设置当前要操作的时间，根据时间做数据更新
          this.currentSiteTime = newVal[0].driveBeginTime
          return
          // this._initTableData();
        }
        if (newVal.length && this.currentSiteTime) { // 是否要更新currentSiteTime
          let time = this.currentSiteTime
          let timeInfo = newVal.filter(item => {
            return item.preTime === time
          }) || []

          if (!timeInfo.length) {
            timeInfo = newVal.filter(item => {
              return item.driveBeginTime === time
            }) || []
          }
          if (timeInfo.length) {
            this.currentSiteTime = timeInfo[0].driveBeginTime
          } else {
            this.currentSiteTime = newVal[0].driveBeginTime
          }
        } else {
          this.currentSiteTime = ''
        }
      },
      immediate: true
    },
    editSiteList: {
      handler: function (newVal, oldVal) {
        // 当站点发生变化，先更新站点表格数据
        let currentTime = this.currentSiteTime
        if (currentTime) {
          this._initTableData()
        }
        if (!currentTime || !newVal.show.length) {
          this.showTableList = []
        }
      },
      immediate: true
    },
    currentSiteTime: {
      handler: function (newVal, oldVal) {
        if (newVal === oldVal) {
          return
        }
        //  else {
        //   this.showTableList = [];
        // }
        // 时间变化做数据更新
        if (newVal) {
          // let newTimeInfo = this.getShowTimeList.filter(item => {
          //   return item.driveBeginTime === newVal;
          // })[0] || {};
          // if (!newTimeInfo.preTime) {
          //   // this._initTableData();
          // } else {
          //   // 编辑操作，对现有表格数据处理
          //   let busScheduleVos = this.busScheduleVos;
          //   let prevList = busScheduleVos[newTimeInfo.preTime];
          //   if (prevList && prevList.length) {
          //     let startInfo = prevList[0];
          //     if (startInfo.id) {
          //       startInfo.flag = 1;
          //     }
          //     busScheduleVos[newVal] = busScheduleVos[newTimeInfo.preTime];
          //     busScheduleVos[newVal].forEach(item => {
          //       item.driveBeginTime = newVal;
          //     });
          //     delete busScheduleVos[newTimeInfo.preTime];
          //     this.setBusScheduleVos({ sitTimeList: busScheduleVos });
          //   }
          // }
          this._initTableData()
        }
      }
      // immediate: true
    },
    lineIsLoading: function (newVal, oldVal) {
      if (!newVal && oldVal && !this.showTableList.length) {
        this._initTableData()
      }
    }
    // busScheduleVos: function(newVal, oldVal) {
    //   if (!this.lineIsLoading && !this.showTableList.length) {
    //     this._initTableData();
    //   }
    // }

  },
  computed: {
    ...mapGetters('lineManage/', ['getShowTimeList', 'getHideTimeList']),
    ...mapState('lineManage/', {
      lineIsLoading: state => state.lineIsLoading,
      editSiteList: state => state.siteList,
      busScheduleVos: state => state.busScheduleVos,
      carLineFlag: state => state.carLineFlag
    })
  },
  methods: {
    ...mapMutations('lineManage/', ['setBusScheduleVos', 'setCarManTime']),
    // 选择站点时刻
    selectSiteTime (item) {
      let flag = this.verifyTime()
      if (flag) {
        return
      }
      let compareFlag = this.compareTime()
      if (compareFlag) return
      this.currentSiteTime = item.driveBeginTime
    },
    changeStart (val, column, row, index) {
      let key = column['key']
      let data = this.showTableList
      data[index][key] = val
      if (!this.carLineFlag && data[index].flag && data[index].id) {
        this.showTableList[index].flag = 1
      }
      // this.setBusScheduleVos({ sitTimeList: this.showTableList });
    },
    changeEnd (val, column, row, index) {
      let key = column['key']
      let data = this.showTableList
      data[index][key] = val
      if (!this.carLineFlag && data[index].flag && data[index].id) {
        this.showTableList[index].flag = 1
      }
      // this.setBusScheduleVos({ sitTimeList: this.showTableList });
    },
    emptySiteTime (column, row, index) {
      let key = column.key
      this.showTableList[index][key] = ''
      let data = this.showTableList
      if (!this.carLineFlag && data[index].flag && data[index].id) {
        data[index].flag = 1
      }
    },
    cumputeTime (val, column, row, index) {
      console.log(val, column, row, index)
      let busScheduleVos = this.busScheduleVos
      if (typeof val === 'boolean' && !val) {
        let key = column['key']
        let list = this.showTableList[index]
        let arrive = list['arriveEndTime']
        let go = list['arriveBeginTime']

        if (arrive && go) {
          let arriList = arrive.split(':')
          let goList = go.split(':')
          let dur1 = Number(goList[0]) - Number(arriList[0])
          let dur2 = Number(goList[1]) - Number(arriList[1])
          if ((dur1 == 0 && dur2 > 0) || dur1 > 0) {
            if (dur2 < 0) {
              dur1 = dur1 - 1
              dur2 = 60 + dur2
            }
            dur1 = dur1 > 9 ? dur1 : '0' + dur1
            dur2 = dur2 > 9 ? dur2 : '0' + dur2
            list['betweenTime'] = dur1 + ':' + dur2

            // let key = column['key'];
            // list[index][key] = val;
            // if (!this.carLineFlag) {
            //   list[index].flag = 1;
            // }
          } else {
            this.$Message.info('请校对发车与到站时间')
            let ref = key + index
            this.$refs[ref].handleClear()
            list['betweenTime'] = ''
            return
          }
        }
        if (arrive || go) {
          busScheduleVos[this.currentSiteTime] = this.showTableList
          this.setBusScheduleVos({ sitTimeList: busScheduleVos })
        }
      }
    },
    /** 生成时刻表数据(添加用)
     * 根据上一步站点列表数据生成时刻表数据
     * 再根据站点flag值筛选出展示数据
     * */
    _initTableData () {
      let busScheduleVos = cloneDeep(this.busScheduleVos) ? cloneDeep(this.busScheduleVos) : {}
      let timeKeyList = busScheduleVos ? Object.keys(busScheduleVos) : []
      let currentTime = this.currentSiteTime
      if (!currentTime) return
      if (!this.carLineFlag && (this.lineIsLoading || !currentTime || !timeKeyList.length)) {
        return
      }
      let showList = this.editSiteList.show
      // let hideList = this.editSiteList.hide;
      // let list = [].concat(showList, hideList);
      let showData = []

      if (timeKeyList.length && busScheduleVos.hasOwnProperty(currentTime)) {
        showData = busScheduleVos[currentTime]
        if (showData.length) {
          showData[0].arriveBeginTime = currentTime
        }

        this.showTableList = showData
      } else {
        showList.forEach(item => {
          let obj = {
            driveBeginTime: currentTime,
            arriveBeginTime: '',
            arriveEndTime: '',
            betweenTime: '',
            siteName: item.siteName,
            siteAliasName: item.siteAliasName,
            serialNumber: item.serialNumber
          }
          if (!this.carLineFlag) {
            obj.flag = 2
          }
          showData.push(obj)
        })
        if (showList.length) {
          showData[0].arriveBeginTime = currentTime
        }
        busScheduleVos[currentTime] = showData
        this.showTableList = showData
      }
      this.setBusScheduleVos({ sitTimeList: busScheduleVos })
    },
    compareTime () {
      let flag = false
      let list = this.showTableList
      let sortList = []
      list.forEach((item, index) => {
        if (index !== 0) {
          sortList.push({
            time: parseFloat(item.arriveEndTime.replace(':', '')),
            name: item.siteAliasName,
            timeName: '到达时间',
            colorIndex: index
          })
        }
        if (index !== list.length - 1) {
          sortList.push({
            time: parseFloat(item.arriveBeginTime.replace(':', '')),
            name: item.siteAliasName,
            timeName: '出发时间',
            colorIndex: index
          })
        }
      })
      let timeInfo = null
      for (let i = 1; i < sortList.length; i++) {
        if (sortList[i].time <= sortList[i - 1].time) {
          timeInfo = sortList[i]
          break
        }
      }
      // 定位问题所在
      if (timeInfo) {
        if (timeInfo.timeName === '出发时间') {
          this.startTipInex = timeInfo.colorIndex
        } else {
          this.endTipIndex = timeInfo.colorIndex
        }
        this.timer = setTimeout(() => {
          this.endTipIndex = -1
          this.startTipInex = -1
        }, 1000)
        flag = true
        this.$Message.warning(timeInfo.name + timeInfo.timeName + '应大于于上一站出发时间')
      }
      return flag
    },
    /**
     * return Boolean
     * true:需要完善信息
     * 不传参，说明检查当前表，传参检查其它时刻表
     * */
    verifyTime (tableList = []) {
      let list = tableList.length ? cloneDeep(tableList) : cloneDeep(this.showTableList)
      if (list && list.length) {
        let startTimeList = list.slice(0, list.length - 1)
        let endTimeList = list.slice(1).reverse()
        let startFlag = startTimeList.some(item => {
          return !item.arriveBeginTime
        })
        if (startFlag) {
          this.$Message.warning('请填写出发时间')
          return true
        }
        let endFlag = endTimeList.some(item => {
          return !item.arriveEndTime
        })
        if (endFlag) {
          this.$Message.warning('请填写到达时间')
          return true
        }
        return false
      }
    },
    /** 传入有效排版时刻信息
     * timeKeyList：已经生成站点时刻数据
     * return Boolean
     * true 其他时刻下无站点时刻信息
     */
    veryOtherTime (timeKeyList) {
      // 当前显示的时间列表
      let showTime = this.getShowTimeList.filter(item => {
        return item.driveBeginTime !== this.currentSiteTime
      })
      if (showTime && showTime.length) {
        // 检查时刻下是否有表
        for (let i = 0; i < showTime.length; i++) {
          let time = showTime[i].driveBeginTime
          let tableList = this.busScheduleVos[time]
          if (tableList && tableList.length) {
            // 检查表是否完整
            let needPerfect = this.verifyTime(tableList)
            if (needPerfect) {
              this.selectSiteTime({ driveBeginTime: time })
              return true
            }
          } else {
            // 检查是否有表
            this.$Message.warning('请维护时刻信息')
            this.selectSiteTime({ driveBeginTime: time })
            return true
          }
        }
      }
      return false
    }
  },
  created () {},
  mounted () {}
}
</script>

<style lang="scss" scoped>
.wrapper{
  position: relative;
  z-index:-10;
  .edit-title {
    margin-bottom: 12px;
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid #64b6ff;
    font-size: 16px;
  }
}
.ivu-row {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
}
.icon-tip {
  margin-right: 6px;
  color: red;
}
.icon-action {
  cursor: pointer;
}
.icon-action:first-child {
  margin-right: 6px;
}

.ivu-modal-wrap .row-style .label-style {
  text-align: left;
}

.number-wrap {
  .number-item {
    background-color: #f8f8f9;
    width: 420px;
    padding: 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .delete {
      width: 60px;
      height: 30px;
    }
  }
}
.time-wrap {
  display: flex;
  flex-wrap:wrap;
  list-style: none;
  .time {
    box-sizing: border-box;
    list-style: none;
    width: 120px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid rgb(121, 121, 121);
    cursor: pointer;
  }
  .active {
    background-color: rgba(153, 204, 255, 1);
    border: none;
  }
}
.mb{
  margin-bottom:2px;
}
</style>
