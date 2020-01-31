<template>
  <div>
    <h4 class="edit-title">班次信息</h4>
    <Form id="time" ref="formTime" :timeList="showTimeList" :label-width="80" style="padding:0 0 20px 30px;">
      <Row v-for="(item,index) in showTimeList" :key="item+index">
        <Row align="middle" type="flex">
          <div v-if="!carLineFlag">
            <span class="mb">班次编号:</span>
            <span class="mb" style="width:170px;display:inline-block">{{item.busNo}}</span>
          </div>
          <!-- <Col span="10"> -->
            <FormItem label="发车时间" class="mb"
             >
              <TimePicker
                format="HH:mm"
                placeholder="选择时间"
                :editable="false"
                :value="item.driveBeginTime"
                :disabled-minutes="disableMinu"
                @on-open-change="repeatTime($event,index)"
                @on-change="changeTime($event,index)"
                :clearable="false"
                style="width:80px"
              ></TimePicker>
            </FormItem>
          <!-- </Col> -->
          <div class="mb" style="display:flex;flex-wrap:nowrap">
            <Icon type="plus-circled" :size="26"  style="margin:0 8px" class="icon-action" @click="addTime(index)"></Icon>
            <Icon type="close-circled" :size="26"  class="icon-action" @click="deleteTime(index,item.driveBeginTime)"></Icon>
            <!-- <Icon type="md-add-circle"  :size="26"  style="margin:0 8px" class="icon-action" /> -->
            <!-- <Icon type="md-close-circle"  :size="26"  class="icon-action" @click="deleteTime(index,item.driveBeginTime)"/> -->
          </div>
        </Row>
      </Row>
    </Form>
  </div>
</template>

<script>
/** flag
 *0默认， 1更新;2修改,3删除
 */
import { mapState, mapMutations } from 'vuex'
// import { addLineAxios } from '../apis/xjt_line.js'
import cloneDeep from 'lodash.clonedeep'
import { setTimeout } from 'timers'
export default {
  components: {},
  props: [],
  data () {
    return {
      deleTime: '', // 当前删除的时间
      currentTime: '',
      disableMinu: [],
      showTimeList: []
    }
  },
  computed: {
    ...mapState('lineManage/', {
      carLineFlag: state => state.carLineFlag,
      lineInfo: state => state.lineInfo,
      lineTimeList: state => state.lineTimeList,
      carManTime: state => state.carManTime,
      busScheduleVos: state => state.busScheduleVos
    })
  },
  watch: {
    lineTimeList: {
      handler: function (newVal, oldVal) {
        this.showTimeList = cloneDeep(newVal.show)
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('lineManage/', ['setLineTimeList', 'setCarManTime', 'setBusScheduleVos']),
    addTime (index) {
      let obj = {
        busNo: '',
        driveBeginTime: ''
      }
      if (!this.carLineFlag) {
        obj.flag = 2
      }
      this.lineTimeList.show.push(obj)
    },
    /** 删除时间
     * 对排班数据处理
     * 对站点时刻数据处理
     */
    deleteTime (index, time) {
      this.deleTime = time
      let showTimeList = this.lineTimeList.show
      let delTimeList = this.lineTimeList.hide
      if (this.carLineFlag) {
        if (showTimeList.length !== 1) {
          showTimeList.splice(index, 1)
        } else {
          showTimeList[0].driveBeginTime = ''
        }
      } else {
        if (showTimeList.length !== 1) {
          let obj = showTimeList.splice(index, 1)[0]
          if (obj.id) {
            obj.flag = 3
            delTimeList.push(obj)
          }
        } else {
          showTimeList[0].driveBeginTime = ''
          if (showTimeList[0].id) {
            showTimeList[0].flag = 1
          }
        }
      }
      // 删除对应排班和站点数据
      this._delAddCarTime()
      this._delAddSiteTime()
      this.setLineTimeList(this.lineTimeList)
    },
    _delAddCarTime () {
      let deleTime = this.deleTime
      let carTimeList = this.carManTime.showCarManList
      let list = []
      if (carTimeList.length && deleTime) {
        carTimeList.forEach(item => {
          if (item.driveBeginTime == deleTime) {
            if (!this.carLineFlag && item.id) {
              item.flag = 3
              list.push(item)
            }
          } else {
            list.push(item)
          }
        })
        this.setCarManTime({ carManTimeList: list })
      }
    },
    _delAddSiteTime () {
      let deleTime = this.deleTime
      let busScheduleVos = this.busScheduleVos
      if (deleTime && busScheduleVos.hasOwnProperty([deleTime])) {
        if (!this.carLineFlag) {
          let list = busScheduleVos[deleTime]
          if (list.length && list[0].id) {
            list.forEach(item => {
              item.flag = 3
            })
          } else {
            delete busScheduleVos[deleTime]
          }
        } else {
          delete busScheduleVos[deleTime]
        }
        this.setBusScheduleVos({ sitTimeList: busScheduleVos })
      }
    },
    changeTime (date, index) {
      this.currentTime = date
      // 设置不可选的重复时间
      let showList = this.lineTimeList.show
      if (showList.length > 1) {
        let limit = showList.filter(item => {
          return item.driveBeginTime && (item.driveBeginTime.split(':')[0] === date.split(':')[0])
        })
        let disableMinu = []
        if (limit.length) {
          limit.forEach(item => {
            disableMinu.push(parseFloat(item.driveBeginTime.split(':')[1]))
          })
        }
        this.disableMinu = [...new Set(disableMinu)]
      }
    },
    repeatTime (val, index) {
      if (typeof val === 'boolean' && !val) {
        let data = this.showTimeList
        // 缓存当前时间，再清空(防止未操作时间)
        let curTime = this.currentTime
        let preTime = data[index].driveBeginTime
        if (!curTime) return
        if (data.length > 1) {
          let prvList = data.slice(0, data.length - 1)
          // 如果在已有的数据里有,
          let flag = prvList.some(item => {
            return item.driveBeginTime == curTime
          })
          if (flag) {
            this.$Message.warning('时刻不能重复')
            this.showTimeList[index].driveBeginTime = curTime
            // 显示原先时间的处理(刷新数据)
            this.timer = setTimeout(() => {
              this.setLineTimeList(cloneDeep(this.lineTimeList))
            })

            this.currentTime = '' // 防止未操作当前时间没有变化
            return
          }
        }
        let timeInfo = data[index]
        if (timeInfo.id) {
          timeInfo.flag = 1
        }
        timeInfo.preTime = preTime // 说明是现有编辑操作
        timeInfo.driveBeginTime = curTime
        this.setLineTimeList({ show: data })
        this.currentTime = ''// 防止未操作当前时间没有变化
        this.changeBus(preTime, curTime)
        if (preTime) {
          this.changeSiteTime(preTime, curTime)
        }
        // this.changeSite(preTime, curTime);
      }
    },
    /** 班次时间修改
     *editprvTime 修改之前的时间
     *editcurTime 修改后时间
     */
    changeBus (editprvTime, editcurTime) {
      if (editprvTime && editcurTime) {
        let carmanList = this.carManTime.showCarManList
        carmanList.forEach(item => {
          if (item.driveBeginTime === editprvTime) {
            if (item.id) {
              item.flag = 1
            }
            item.driveBeginTime = editcurTime
          }
        })
      }
    },
    /** 班次站点时间修改
     *editprvTime 修改之前的时间
     *editcurTime 修改后时间
     */
    changeSite (preTime, curTime) {
      if (preTime && curTime) {
        let siteList = this.busScheduleVos[preTime]
        this.busScheduleVos[curTime] = siteList
        delete this.busScheduleVos[curTime]
        if (siteList && siteList.length) {
          siteList.forEach(item => {
            if (item.id) {
              item.flag = 1
            }
            item.driveBeginTime = curTime
          })
          siteList[0].arriveBeginTime = curTime
        }
      }
    },
    changeSiteTime (preTime, curTime) {
      let busScheduleVos = this.busScheduleVos
      let prevList = busScheduleVos[preTime]
      if (prevList && prevList.length) {
        let startInfo = prevList[0]
        if (startInfo.id) {
          startInfo.flag = 1
        }
        busScheduleVos[curTime] = busScheduleVos[preTime]
        busScheduleVos[curTime].forEach(item => {
          item.driveBeginTime = curTime
        })
        delete busScheduleVos[preTime]
        this.setBusScheduleVos({ sitTimeList: busScheduleVos })
      }
      // let newTimeInfo = this.getShowTimeList.filter(item => {
      //       return item.driveBeginTime === curTime;
      //     })[0] || {};
      //     if (!newTimeInfo.preTime) {
      //       // this._initTableData();
      //     } else {
      //       // 编辑操作，对现有表格数据处理
      //       let busScheduleVos = this.busScheduleVos;
      //       let prevList = busScheduleVos[newTimeInfo.preTime];
      //       if (prevList && prevList.length) {
      //         let startInfo = prevList[0];
      //         if (startInfo.id) {
      //           startInfo.flag = 1;
      //         }
      //         busScheduleVos[curTime] = busScheduleVos[newTimeInfo.preTime];
      //         busScheduleVos[curTime].forEach(item => {
      //           item.driveBeginTime = curTime;
      //         });
      //         delete busScheduleVos[newTimeInfo.preTime];
      //         this.setBusScheduleVos({ sitTimeList: busScheduleVos });
      //       }
    }
  },

  created () { },
  mounted () {
    this.showTimeList = cloneDeep(this.lineTimeList.show)
  },
  distroyed () {
    this.timer = null
  }
}
</script>
<style lang="scss" scoped>
.edit-title {
    margin-bottom: 12px;
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid #64b6ff;
    font-size: 16px;
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
.mb{
  margin-bottom:2px;
}
</style>
