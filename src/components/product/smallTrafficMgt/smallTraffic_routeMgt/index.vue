<template>
  <div class="page-wrapper">
    <Row>
      <Input v-model="lineNumber" class="top-right" style="width: 200px" placeholder="线路编号"/>
      <Input v-model="lineName" class="top-right" style="width: 200px" placeholder="线路名称"/>
      <Button type="primary" icon="ios-search" @click="serchLine">搜索</Button>
      <Button type="primary" class="top-right" icon="ios-add"  @click="pullRouteInfo">拉取</Button>
      <Button type="primary" class="top-right" icon="md-trash" @click="batchEnabled('T')">上架</Button>
      <Button type="primary" class="top-right" icon="md-trash" @click="batchEnabled('F')">下架</Button>
    </Row>
    <Row class="p-top">
      <Table border stripe :columns="columns5" :data="data5" :loading="loading" @on-selection-change="selectTr"></Table>
      <Page class="p-top" :current="currPage" :total="totalPage"  show-elevator @on-change="changePage" />
    </Row>
    <modal-wrap title="排班表" :width=900 :flag="schedule" @cancel="cancelCarTime" @confirm="saveCarTime">
      <car-bus ref="carBus" :isAdd="false"></car-bus>
    </modal-wrap>
    <rule-info :ruleShow='ruleShow' @ruleClose='setRuleShow(false)'></rule-info>
  </div>
</template>

<script>
import CarBus from '../components/car_bus.vue'
import ModalWrap from '../components/modalWrap.vue'
import RuleInfo from '../components/rule_info.vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import { getRoutePricesAxios, batchEnabledAxios, pullRouteInfoAxios, lineListAxios, deletLineAxios, saveCarManAxios, getBusInfoListAxios } from '../apis/xjt_line.js'
export default {
  components: {
    RuleInfo,
    CarBus,
    ModalWrap
  },
  props: {},
  data () {
    return {
      loading: false,
      schedule: false, // 排班表
      lineNumber: '',
      lineName: '',
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      editFlag: -1,
      timeIndex: 0, // 排版时刻索引
      columns5: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '线路编号',
          key: 'routeCode'
        },
        {
          title: '线路名称',
          key: 'routeName'
        },
        {
          title: '是否上架',
          width: 120,
          key: 'channel',
          render: (h,params) => {
            return h('span',params.row.enabled=="T"?"上架":"下架")
          }
        },
        // {
        //   title: '起始地',
        //   key: 'startSiteName'
        // },
        // {
        //   title: '目的地',
        //   key: 'endSiteName'
        // },
        {
          title: '操作',
          key: 'action',
          width: 360,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    let { row: { id } } = params
                    this.setCarLineFlag({ flag: false })
                    getBusInfoListAxios({ id: id }).then(res => {
                      console.log(res)
                    // getBusInfoListAxios({ routeId: id }).then(res => {
                      if (res.status == 200 && res.data.status == 200) {
                        let list = res.data.data
                        list.id = id
                        // this.setLineTimeList({ show: list, hide: [] })
                        this.getLineDetail(list)
                        this.$router.push({ name: 'xjtRoteEdit' })
                      } else {
                        // this.$Message.info(res.message ? res.message : '班次信息为空');
                        this.currPage = 1
                        this._lineListAxios()
                      }
                    })
                  }
                }
              }, '线路信息维护'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    let { row: { routeCode, routeName } } = params
                    this.$router.push({path: 'priceMgt',query:{
                      routeName: routeName,
                      routeCode: routeCode,
                    }})
                    // getRoutePricesAxios({ id: id }).then(res => {
                    //   if (res.status == 200 && res.data.status == 200) {
                    //   } else {
                    //     this.$Message.info(res.message);
                    //   }
                    // })
                  }
                }
              }, '价格维护'),
              // h('Button', {
              //   props: {
              //     type: 'text',
              //     size: 'small'
              //   },
              //   on: {
              //     click: () => {
              //       let { row: { id } } = params
              //       getRoutePricesAxios({ id: id }).then(res => {
              //         if (res.status == 200 && res.data.status == 200) {

              //         } else {
              //           this.$Message.info(res.message);
              //         }
              //       })
              //     }
              //   }
              // }, '库存查看'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.getRuleInfo();
                  }
                }
              }, '规则查看'),
            ])
          }
        }
      ],
      data5: [],
      formValidate: {
        busTypeId: '',
        driverId: '',
        licencePlateId: '',
        driveBeginTime: ''
      },
      ruleValidate: {
        busTypeId: [
          { required: true, type: 'number', message: '请选择车型', trigger: 'change' }
        ],
        driverId: [
          { required: true, type: 'number', message: '请选择司机', trigger: 'change' }
        ],
        licencePlateId: [
          { required: true, type: 'number', message: '请选择车牌', trigger: 'change' }
        ]
      },
      selectLineList: [], // 已选中的线路列表数据
      carNumberList: []
    }
  },
  watch: {
  },
  computed: {
    ...mapState('lineManage/', {
      carLineFlag: state => state.carLineFlag,
      lineTimeList: state => state.lineTimeList,
      styleNumberList: state => state.styleNumberList,
      allManList: state => state.allManList,
      carManTime: state => state.carManTime,
      ruleShow: state => state.ruleShow
    })
  },
  methods: {
    ...mapActions('lineManage/', ['getStyleAndNumber', 'getRuleInfo', 'getCarManList', 'getLineDetail', 'initLine']),
    ...mapMutations('lineManage/', ['setRuleShow', 'setLineInfo', 'setSiteList', 'setSiteTimeList', 'setCarLineFlag', 'setLineTimeList']),
    pullRouteInfo() {
      pullRouteInfoAxios().then(res=>{
        if (res.status == 200 && res.data.status == 200) {
          this.$Message.success('操作成功')
        } else {
          this.$Message.console.error(res.data.message)
        }
        this._lineListAxios()
      })
    },
    batchEnabled(enabled) {
      let list = this.selectLineList
      if (!list.length) {
        this.$Message.info('请至少选择一条数据')
        return
      };
      let idList = []
      let mainUserId = null
      list.forEach(item => {
        idList.push(item.id)
        mainUserId = item.mainUserId
      })
      batchEnabledAxios({
        enabled: enabled,
        jsonIds: JSON.stringify(idList),
        mainUserId: mainUserId
      }).then(res=>{
        if (res.status == 200 && res.data.status == 200) {
          this.$Message.success('操作成功')
        } else {
          this.$Message.console.error(res.data.message)
        }
        this._lineListAxios()
      })
    },
    addFun () {
      this.initLine()
      this.$router.push({ name: 'xjtRoteEdit' })
      this.setCarLineFlag({ flag: true })
    },
    serchLine () {
      this.currPage = 1
      this._lineListAxios()
    },
    // 分页
    changePage (page) {
      this.currPage = page
      this._lineListAxios()
    },
    selectTr (list) {
      // 收集多选模式数据,分页请求时清空
      this.selectLineList = list
    },
    deleteAll () {
      // 获取选中数据，重新分页请求
      let list = this.selectLineList
      if (!list.length) {
        this.$Message.info('请至少选择一条数据')
        return
      };
      let idList = []
      list.forEach(item => {
        idList.push(item.id)
      })
      this._deletLineAxios(idList)
    },
    cancelEdit () {
      this.initLine()
    },
    async saveCarTime (name) {
      let flag = await this.$refs.carBus.viliteBusFun()
      let params = {
        busInfoVos: this.carManTime.showCarManList
      }
      console.log(params)
      if (flag) {
        saveCarManAxios(params).then(res => {
          if (res.success == true) {
            this.schedule = false
          }
          this.initLine()
        })
      }
    },
    cancelCarTime () {
      this.schedule = false
      this.initLine()
      this.$refs.carBus.handleReset()
    },
    selectCarStyle (val) {
      let list = this.styleNumberList.filter(item => {
        return item.id == val
      })
      if (list.length) {
        this.carNumberList = list[0].singleCarList
      }
    },
    selectCarTime (index) {
      this.timeIndex = index
    },
    _deletLineAxios (idList) {
      this.$Modal.confirm({
        title: '删除',
        content: '<p>确认删除？</p>',
        onOk: () => {
          let params = {
            routeIds: idList
          }
          deletLineAxios(params).then(res => {
            this.currPage = 1
            this._lineListAxios()
          })
        }
      })
    },
    _lineListAxios () {
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        routeName: this.lineName,
        routeCode: this.lineNumber
      }
      this.loading = true
      lineListAxios(params).then(res => {
        if (res.status == 200 && res.data.status == 200) {
          this.loading = false
          this.totalPage = res.data.data.total
          this.data5 = res.data.data.rows
        }
        this.selectLineList = []
      })
    }
  },
  created () { },
  mounted () {
    this._lineListAxios()
    // this.getStyleAndNumber()
  },
  beforeRouteLeave (to, from, next) {
    if (!this.carLineFlag) {
      to.meta.title = '修改线路'
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
@import '../xjtCommon.scss'
// .time-wrap {
//   display: flex;
//   .time {
//     box-sizing: border-box;
//     width: 120px;
//     height: 36px;
//     text-align: center;
//     line-height: 36px;
//     margin-right: 10px;
//     border: 1px solid rgb(121, 121, 121);
//     cursor: pointer;
//   }
//   .active {
//     background-color: rgba(153, 204, 255, 1);
//     border: none;
//   }
// }
// .ml {
//   margin-left: 8px;
//   margin-right: 6px;
// }
// .mr {
//   margin-right: 24px;
// }
</style>
