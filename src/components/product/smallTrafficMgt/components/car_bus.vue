<template>
  <div class="wrapper">
      <h4 class="edit-title">车辆排班</h4>
      <div :class="isAdd?'indent-content':''">
        <Row>
          <ul class="time-wrap" >
            <li :class="['time', currentCarTime==item.driveBeginTime?'active':'']" v-if="item.driveBeginTime"
              v-for="(item,index) in getShowTimeList"
              @click="selectCarTime(item)"
            >{{item.driveBeginTime}}</li>
          </ul>
        </Row>
        <Row v-if="isAdd">
          <Button  type="primary"  icon="ios-add" @click="addCarManTime()" v-if="getShowTimeList.length">新增</Button>
          <span style="margin-left:20px;">一条线路有多辆车牌在运行，请点击新增车辆</span>
        </Row>
        <Form :label-width="80" ref="carManTime" :model="carManTime">
          <ul :class="!isAdd?'edit-car':'number-wrap'">
            <!-- v-show="(style.driveBeginTime == currentCarTime || !style.driveBeginTime) && style.flag != 3" -->
            <li class="number-item" v-for="(style,index) in carManTime.showCarManList"  v-show="(style.driveBeginTime == currentCarTime ) && style.flag != 3">
              <div class="car-th">
                <FormItem label="车型"
                  :prop="'showCarManList.' + index + '.busTypeId'"
                  :rules="{required: true,type: 'number',message: '车型必选', trigger: 'change'}"
                >
                  <Select v-model="style.busTypeId" :value="style.busTypeId"  style="width:200px;"  @on-change="selectCarStyle($event,index)">
                      <Option v-for="item in styleNumberList" :value="item.id" :key="item.id">{{ item.carTypeName }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="司机"
                  :prop="'showCarManList.' + index + '.driverId'"
                  :rules="{required: true, type: 'number', message:'司机必选', trigger: 'change'}"
                >
                  <Select v-model="style.driverId" :value="style.driverId" style="width:200px;" @on-change="selectCarMan($event,index)">
                      <Option v-for="item in allManList" :value="item.id" :key="item.id" v-if="item.enabled==='T'">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="车牌号"
                  :prop="'showCarManList.' + index + '.licencePlateId'"
                  :rules="{required: true,type:'number', message: '车牌号必选', trigger: 'change'}"
                >
                  <Select v-model="style.licencePlateId" :value="style.licencePlateId" style="width:200px;" :label-in-value="true" @on-change="selectCarNumber($event,index)">
                      <Option v-for="item in style.carNumberList" :value="item.id" :label="item.carNumber" :key="item.id">{{ item.carNumber}}</Option>
                  </Select>
                </FormItem>
              </div>
              <span @click="deleteCarManTime(index)" v-if="isAdd">
                <Icon
                  type="md-close-circle"
                  :size="26"
                  class="icon-action delete"
                />
              </span>
            </li>
          </ul>
        </Form>
      </div>

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
export default {
  components: {},
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentCarTime: ''
    }
  },
  watch: {
    getShowTimeList: {
      handler: function (newVal, oldVal) {
        if (newVal.length) {
          // 选中时间初始化
          if (!this.currentCarTime) {
            this.currentCarTime = newVal[0].driveBeginTime
          } else {
            let time = this.currentCarTime
            let timeInfo = newVal.filter(item => {
              return item.preTime === time
            }) || []
            if (!timeInfo.length) {
              timeInfo = newVal.filter(item => {
                return item.driveBeginTime === time
              }) || []
            }
            if (timeInfo.length) {
              this.currentCarTime = timeInfo[0].driveBeginTime
            } else {
              this.currentCarTime = newVal[0].driveBeginTime
            }
          }
        } else {
          this.currentCarTime = ''
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState('lineManage/', {
      carManTime: state => cloneDeep(state.carManTime),
      allManList: state => state.allManList,
      styleNumberList: state => state.styleNumberList,
      carLineFlag: state => state.carLineFlag
    }),
    ...mapGetters('lineManage/', ['getShowTimeList', 'getHideTimeList'])
  },
  methods: {
    ...mapActions('lineManage/', ['getStyleAndNumber']),
    ...mapMutations('lineManage/', ['setCarManTime']),
    // 选择排班时刻或保存时需要调用
    async selectCarTime (item) {
      let showCarManList = this.carManTime.showCarManList
      if (showCarManList.length > 0) {
        let flag = await this.viliteBusFun()
        if (!flag) return
      }
      this.currentCarTime = item.driveBeginTime
    },
    // 选择车型，
    selectCarStyle (val, index) {
      let data = this.carManTime.showCarManList
      data[index].licencePlateId = ''
      if (!this.carLineFlag && data[index].flag && data[index].id) {
        data[index].flag = 1
      }
      data[index].busTypeId = val
      let list = this.styleNumberList.filter(item => {
        return item.id == val
      })

      if (list.length) {
        data[index].carNumberList = list[0].singleCarList
      }
      this.setCarManTime({ carManTimeList: this.carManTime.showCarManList })
    },
    // 选择司机
    selectCarMan (val, index) {
      let data = this.carManTime.showCarManList
      if (!this.carLineFlag && data[index].flag && data[index].id) {
        data[index].flag = 1
      }
      data[index].driverId = val
      this.setCarManTime({ carManTimeList: this.carManTime.showCarManList })
    },
    // 选择车牌
    selectCarNumber (val, index) {
      let data = this.carManTime.showCarManList
      if (!data.length || !val) {
        return
      }
      if (!this.carLineFlag && data[index].flag && data[index].id) {
        data[index].flag = 1
      }
      data[index].licencePlateId = val.value
      data[index].carNumber = val.label
      this.setCarManTime({ carManTimeList: this.carManTime.showCarManList })
    },
    async addCarManTime () {
      let showCarManList = this.carManTime.showCarManList
      if (showCarManList.length > 0) {
        let flag = await this.viliteBusFun()
        if (!flag) return
      }
      let obj = {
        busTypeId: '', // 车型Id
        driverId: '', // 司机id
        licencePlateId: '', // 车牌id
        driveBeginTime: this.currentCarTime,
        carNumberList: [],
        carNumber: ''
      }
      if (!this.carLineFlag) {
        obj.flag = 2
      }
      showCarManList.push(obj)
      this.setCarManTime({ carManTimeList: showCarManList })
    },
    deleteCarManTime (index) {
      let showCarManList = this.carManTime.showCarManList
      // !this.carLineFlag &&
      if (showCarManList[index].id) {
        showCarManList[index].flag = 3
      } else {
        showCarManList.splice(index, 1)
      }
      this.setCarManTime({ carManTimeList: showCarManList })
    },
    viliteBusFun () {
      return new Promise((resolve, reject) => {
        let list = this.carManTime.showCarManList
        if (!list.length) return resolve(true)
        this.$refs['carManTime'].validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            this.$Message.info('请填写完整排班信息')
          }
        })
      })
    },
    handleReset () {
      this.$refs['carManTime'].resetFields()
    },
    /** return Boolean
     * true 表示时刻下无排版信息
     */
    verifyBus () {
      let carManList = cloneDeep(this.carManTime.showCarManList)
      let showTime = this.getShowTimeList
      for (let i = 0; i < showTime.length; i++) {
        let time = showTime[i].driveBeginTime
        let isHas = carManList.some(item => {
          return item.flag != 3 && time == item.driveBeginTime
        })
        if (!isHas) {
          this.$Message.warning('每个时刻下至少维护一条排班信息')
          this.selectCarTime({ driveBeginTime: time })
          return true
        }
      }
      return false
    }

  },
  created () {},
  mounted () {
    this.getStyleAndNumber()
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  .edit-title {
    margin-bottom: 12px;
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid #64b6ff;
    font-size: 16px;
  }
  .indent-content{
    padding:0 0 20px 30px;
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
  .time-wrap {
    display: flex;
    flex-wrap:wrap;
    .time {
      box-sizing: border-box;
      width: 120px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      margin-right: 10px;
      margin-bottom:10px;
      border: 1px solid rgb(121, 121, 121);
      cursor: pointer;
    }
    .active {
      background-color: rgba(153, 204, 255, 1);
      border: none;
    }
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
  .edit-car{
    margin-top:10px;
    .number-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .car-th{
        display: flex;
      }
    }

  }
  .mb{
    margin-bottom:2px;
  }
}
</style>
