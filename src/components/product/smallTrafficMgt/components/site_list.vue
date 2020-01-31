<template>
    <div class="site-wrap">
      <h3 class="edit-title">线路站点信息</h3>
      <div style="padding:0 0 20px 30px;">
        <!-- <Row class="p-top" style="margin-bottom:20px;">
            <Button  type="primary" class="top-right"  icon="md-add"  @click="addFun">新增</Button>
          </Row> -->
        <Table size='small' :columns="columns1" :data="originData.show">
          <!-- <template slot-scope="{ index }" slot="key">
            <span>{{index+1}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="text" size='small' @click="editFun(row,index)">修改</Button>
            <Button type="text" size='small' @click="deleteFun(index)">删除</Button>
          </template> -->
        </Table>
      </div>
      <a-map  class="map-wrap" ref="mapModal" :mark="mark" @getpoit="getpoitFun"></a-map>
    </div>
  </template>

<script>
import AMap from './amap.vue'
import { mapState, mapMutations } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
export default {
  components: { AMap },
  props: {

  },
  data () {
    return {
      gaoDeFlag: false,
      listIndex: 0,
      isAdd: false,
      mark: '',
      columns1: [
        {
          title: '序号',
          key: 'serialNumber',
          width: 60,
          // slot: 'key',
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '站名',
          key: 'siteAliasName'
        },
        {
          title: '地址',
          key: 'siteName'
        },
        {
          title: '坐标',
          key: 'siteCoordinate'
        },
        // {
        //   title: '操作',
        //   key: 'action',
        //   width: 150,
        //   align: 'center',
        //   // slot: 'action',
        //   render: (h, params) => {
        //     return h('div', [
        //       h('Button', {
        //         props: {
        //           type: 'text',
        //           size: 'small'
        //         },
        //         style: {
        //           marginRight: '5px'
        //         },
        //         on: {
        //           click: () => {
        //             let {row, index} = params
        //             this.editFun(row, index)
        //           }
        //         }
        //       }, '修改'),
        //       h('Button', {
        //         props: {
        //           type: 'text',
        //           size: 'small'
        //         },
        //         on: {
        //           click: () => {
        //             let {index} = params
        //             this.deleteFun(index)
        //           }
        //         }
        //       }, '删除')
        //     ])
        //   }
        // }
      ]
    }
  },
  watch: {
  },
  computed: {
    ...mapState('lineManage/', {
      carLineFlag: state => state.carLineFlag,
      originData: state => state.siteList,
      busScheduleVos: state => state.busScheduleVos,
      lineTimeList: state => state.lineTimeList
    })
  },
  mounted () {
    window.onLoad = this.$refs.mapModal.init
    let url = 'https://webapi.amap.com/maps?v=1.4.14&key=b547d05d07535668173a50b6d644ffce&callback=onLoad'
    let jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    jsapi.src = url
    jsapi.id = 'amapjs'
    document.head.appendChild(jsapi)

    let uiUrl = '//webapi.amap.com/ui/1.0/main.js'
    let uiScript = document.createElement('script')
    uiScript.src = uiUrl
    uiScript.id = 'amapui'
    document.head.appendChild(uiScript)
  },
  methods: {
    ...mapMutations('lineManage/', ['setSiteList', 'setBusScheduleVos']),
    addFun () {
      this.isAdd = true
      this.$refs.mapModal.showModal()
    },
    /** 对坐标数据处理
     *carLineFlag:true新增;表示线路新增或修改操作
     * isAdd :true新增;表示是否新增操作
     * listIndex：表示当前操作索引
     */
    getpoitFun (val) {
      let self = this
      let busScheduleVos = cloneDeep(this.busScheduleVos)
      // let showTimeList = this.lineTimeList.show;
      let originData = cloneDeep(this.originData.show)

      if (originData.length) {
        // 对重复站名做限制
        let flag = originData.some(item => {
          return item.siteAliasName == val.stationName
        })
        if (flag) {
          this.$Message.info('不允许添加重复站名')
          return
        }
      }

      let index = this.listIndex
      if (this.isAdd) {
        let obj = {
          siteAliasName: val.stationName,
          siteName: val.address,
          siteCoordinate: val.point
        }
        if (!this.carLineFlag) {
          obj.flag = 2
        }
        originData.push(obj)
        let keyList = Reflect.ownKeys(busScheduleVos)
        if (keyList.length) {
          keyList.forEach(function (key) {
            if (key != 'hide') {
              let list = busScheduleVos[key]
              let obj = {
                driveBeginTime: key,
                arriveBeginTime: '',
                arriveEndTime: '',
                betweenTime: '',
                siteName: val.address,
                siteAliasName: val.stationName,
                serialNumber: list.length + 1
              }
              if (!self.carLineFlag) {
                obj.flag = 2
              }
              busScheduleVos[key].push(obj)
              // showTimeList.forEach(time => {
              //   let obj = {
              //     driveBeginTime: time.driveBeginTime,
              //     arriveBeginTime: '',
              //     arriveEndTime: '',
              //     betweenTime: '',
              //     siteName: val.address,
              //     siteAliasName: val.stationName,
              //     serialNumber: list.length + 1
              //   };
              //   if (!self.carLineFlag) {
              //     obj.flag = 2;
              //   }
              //   busScheduleVos[key].push(obj);
              // });
            }
          })
        }
        this.setBusScheduleVos({ sitTimeList: busScheduleVos })
      } else {
        let siteObj = originData[index]
        const editObj = { siteName: val.address, siteCoordinate: val.point, siteAliasName: val.stationName }
        if (siteObj.id) {
          editObj.flag = 1
        }
        originData[index] = Object.assign(siteObj, editObj)
        Object.keys(busScheduleVos).forEach(item => {
          if (item != 'hide') {
            let siteTimeInfo = busScheduleVos[item][index]
            siteTimeInfo.siteAliasName = val.stationName
            if (siteTimeInfo.id) {
              siteTimeInfo.flag = 1
            }
          }
        })
        this.setBusScheduleVos({ sitTimeList: busScheduleVos })
      }
      originData.forEach((item, index) => {
        item.serialNumber = index + 1
      })
      this.setSiteList({ show: originData, hide: this.originData.hide })
    },
    editFun (row, index) {
      this.isAdd = false
      this.listIndex = index
      // this.gaoDeFlag = true;
      let poit = row.siteCoordinate.split(',')

      this.mark = [parseFloat(poit[1]), parseFloat(poit[0])]
      this.$refs.mapModal.showModal(this.mark)
    },
    deleteFun (index) {
      this.$Modal.confirm({
        title: '删除',
        content: '<p>确认删除么</p>',
        onOk: () => {
          if (!this.carLineFlag) {
            let obj = this.originData.show.splice(index, 1)[0]
            if (obj.id) {
              obj.flag = 3
              this.originData.hide.push(obj)
            }
            this._deleteSiteTime(index)
          } else {
            this.originData.show.splice(index, 1)
            this._deleteSiteTime(index)
          }
          // 从新排序
          let list = this.originData.show
          if (list.length) {
            list.forEach((item, index) => {
              item.serialNumber = ++index
            })
          }
          // 删除对应的站点时刻
          this.setSiteList(this.originData)
        }
      })
    },
    _deleteSiteTime (acIndex) {
      let busScheduleVos = this.busScheduleVos
      Object.keys(busScheduleVos).forEach(item => {
        if (item != 'hide') {
          let isPush = 1
          let list = busScheduleVos[item]
          let obj = list.splice(acIndex, 1)[0]
          let len = list.length
          if (len && len >= 1) {
            list[0].arriveEndTime = ''
            list[0].betweenTime = ''
            if (!this.carLineFlag && list[0].id) {
              list[0].flag = 1
            }

            list.forEach((site, index) => {
              site.serialNumber = ++index
            })
            if (obj.id && isPush == 1) {
              isPush++
              obj.flag = 3
              busScheduleVos['hide'].push(obj)
            }
          }
          if (len > 1) {
            list[len - 1].arriveBeginTime = ''
            list[len - 1].betweenTime = ''
            if (!this.carLineFlag && list[len - 1].id) {
              list[len - 1].flag = 1
            }
          }
        }
      })
      this.setBusScheduleVos({ sitTimeList: busScheduleVos })
    },
    cancelMap () {
      // this.gaoDeFlag = false;
    }
  },
  destroyed () {
    let head = document.getElementsByTagName('head')[0]
    head.removeChild(document.getElementById('amapjs'))
    head.removeChild(document.getElementById('amapui'))
  }
}
</script>
<style lang="scss" scoped>
.site-wrap{
  position:relative;
  .edit-title {
    margin-bottom: 12px;
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid #64b6ff;
    font-size: 16px;
  }
  .map-wrap{
    position:absolute;
    top:0;
    height:400px;
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
.mb{
  margin-bottom:2px;
}
</style>
