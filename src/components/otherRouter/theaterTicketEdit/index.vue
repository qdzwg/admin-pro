<template>
  <div class="theater-ticket-edit">
    <Form :model="formItem"
          label-position="right"
          :label-width="145"
          ref="formItem"
          :rules="ruleComplteForm">
      <div id="base"
           class="form-title">基本信息</div>
      <FormItem v-if="formItem.parkName"
                label="景点名称："
                prop="parkName">
        <Input disabled
               v-model="formItem.parkName"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="票型名称："
                prop="name">
        <Input v-model="formItem.name"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>

      <FormItem label="外部编码：">
        <Input disabled
               v-model="formItem.code"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="票型价格："
                prop="price"
                :rules="[{required: true, message: '不能为空' },{validator:priceMax},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
        <Input v-model="formItem.price"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="票型类型："
                prop="enabled">
        <Select v-model="formItem.type"
                style="width:200px">
          <Option value="theater">剧院票</Option>
        </Select>
      </FormItem>
      <FormItem label="票型说明：">
        <Input v-model="formItem.ticketExplain"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="是否立即上架："
                prop="enabled">
        <Select v-model="formItem.enabled"
                style="width:200px">
          <Option value="T">上架</Option>
          <Option value="F">下架</Option>
        </Select>
      </FormItem>
      <FormItem label="默认票型："
                prop="enabled">
        <RadioGroup v-model="formItem.isAutoTicket">
          <Radio label="T">是</Radio>
          <Radio label="F">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="缩略图：">
        <Input v-model="formItem.linkMobileImg"
               style="display:none"></Input>
        <my-img :limitNum="1"
                :uploadList="singleImgList"
                @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <div id="bookingRule"
           class="form-title">预订规则</div>
      <FormItem label="可购时间限制：">
        <RadioGroup v-model="formItem.isBookingTime"
                    @on-change='radioChange'
                    class="time-limit">
          <Radio label="noLimit">
            <span>不限</span>
          </Radio>
          <Radio label="earlyLimit">
            <div class="time-limit-content">
              <span style="margin-right:5px">最近可购</span>
              <!-- <Input v-model="formItem.earlyBookDay" :maxlength="3"></Input> -->
              <InputNumber :max="100"
                           :min="1"
                           v-model="formItem.earlyBookDay"
                           style="width:120px"></InputNumber>
              <span style="margin-left:5px">天</span>
              <span style="margin-left:10px">（控制预订开始时间，当为1时则当天可预订）</span>
            </div>
          </Radio>
          <Radio label="timeRangeLimit">
            <div class="time-limit-content">
              <span style="margin-right:5px">可购时间段限制</span>
              <DatePicker :value="formItem.startTime"
                          @on-change="setBegDate"
                          type="date"
                          :options="options3"
                          format="yyyy-MM-dd"></DatePicker>
              <span>至</span>
              <DatePicker :value="formItem.endTime"
                          @on-change="setEndDate"
                          type="date"
                          :options="options4"
                          format="yyyy-MM-dd"></DatePicker>
            </div>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="购买数量限定："
                required>
        <!-- {{formItem.lowPrice}} -->
        <FormItem prop="minNum"
                  :rules="[{required: true, message: '不能为空' },{validator:min},{ pattern: /^[1-9]\d*$/, message: '数据格式不正确'}]"
                  style="display:inline-block">
          <Input v-model="formItem.minNum"
                 style="width:100px"
                 :maxlength="8"></Input>
        </FormItem>
        <span>至</span>
        <FormItem prop="maxNum"
                  :rules="[{required: true, message: '不能为空' },{validator:max},{ pattern:/^[1-9]\d*$/, message: '数据格式不正确'}]"
                  style="display:inline-block">
          <Input v-model="formItem.maxNum"
                 style="width:100px"
                 :maxlength="8"></Input>
        </FormItem>
      </FormItem>
      <FormItem label="下单人身份证：">
        <RadioGroup v-model="formItem.isNeedIdcard">
          <Radio label="F">
            <span>选填</span>
          </Radio>
          <Radio label="T">
            <span>必填</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <div id="bookingRule"
           class="form-title">退票规则</div>
      <FormItem label="支持游客发起退款：">
        <RadioGroup v-model="formItem.isRetreat">
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="是否审核：">
        <RadioGroup v-model="formItem.retreatAuditType"
                    @on-change='retreatAuditTypeC'>
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="自动退款："
                v-if="formItem.isRetreat==='T'&&formItem.retreatAuditType==='T'">
        <Checkbox v-model="formItem.isAutoAudit"></Checkbox>
        退票时间在游玩时间
        <FormItem prop="beforePlayDay"
                  :rules="formItem.isAutoAudit?[{required: true, message: '该项不能为空' },{ pattern:/^[1-9]\d*$/, message: '数据格式不正确'}]:[]"
                  style="display:inline-block;">
          <Input v-model="formItem.beforePlayDay"
                 style="width:100px"
                 :maxlength="8"></Input>
        </FormItem>
        天
        <TimePicker format="HH:mm"
                    placeholder="选择时间"
                    style="width: 112px"
                    v-model="formItem.beforeStopHour"></TimePicker>
        点前（按自然日计算），可自动退款
      </FormItem>
      <FormItem label="退款手续费 ：">
        <RadioGroup v-model="formItem.refundFeeType"
                    @on-change='refundFeeTypeC'
                    class="time-limit">
          <Radio label="type1">
            <div class="time-limit-content">
              <span style="margin-right:5px">金额按比例</span>
              <InputNumber :max="100"
                           :min="1"
                           v-model="formItem.refundScale"
                           style="width:120px"></InputNumber>
              <span>%</span>
            </div>
            <div v-if="formItem.refundFeeType === 'type1'"
                 class="time-limit-content">
              <Checkbox style="margin-left:5px"
                        v-model="refundPlayDayVaild">
                <span>仅游玩日当天退票生效</span>
              </Checkbox>
            </div>
          </Radio>
          <Radio label="type2">
            <div class="time-limit-content">
              <span style="margin-right:5px">固定金额</span>
              <InputNumber :precision="2"
                           :max="formItem.price"
                           v-model="formItem.refundFixedAmount"
                           style="width:120px"></InputNumber>
            </div>
            <div v-if="formItem.refundFeeType === 'type2'"
                 class="time-limit-content">
              <Checkbox style="margin-left:5px"
                        v-model="refundPlayDayVaild">
                <span>仅游玩日当天退票生效</span>
              </Checkbox>
            </div>
          </Radio>
          <Radio label="type3"
                 v-show='formItem.retreatAuditType=="T"'>
            <div class="time-limit-content">
              <span style="margin-right:5px">自定义金额</span>
            </div>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <div class="save-cancel">
          <Button type="primary"
                  :loading="btnLoading"
                  @click="submit">保存</Button>
          <Button type="ghost"
                  style="margin-left: 8px"
                  @click="back">取消</Button>
        </div>
      </FormItem>
    </Form>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('bookingRule')">分销设置</a>
        </li>
        <li>
          <Button size="small"
                  :loading="btnLoading"
                  @click="submit"
                  type="primary">保存</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ueditor from '@/components/global/ueditor'
import store from '@/store'
import { apiPost, apiGet, apiPostJson } from '@/fetch/api'
import myImg from '@/components/global/singleImg'
import selectItem from '@/components/global/selectList'
export default {
  data () {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error('最大值999999'))
      } else {
        callback()
      }
    }
    return {
      time: '1:22',
      options4: {},
      options3: {},
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 300,
        autoHeightEnabled: false
      },
      btnLoading: false,
      singleImgList: [],
      wapImgList: [],
      mainUserId: '',
      formItem: {
        mainUserId: '',
        id: '',
        name: '', // 票型名称
        code: '', // 票型编码(外部票型编码)
        parkName: '', // 景区名称
        price: null, // 票价
        type: 'theater', // 票型类型：theater 剧院票
        ticketExplain: '', // 票型说明
        enabled: '', // 上下架 F下架 T上架
        linkMobileImg: '', // 缩略图
        isBookingTime: 'noLimit',
        startTime: '', // 允许结束下单日期
        endTime: '', // 允许结束下单日期
        earlyBookDay: null, // 最近可购天数
        minNum: '', // 最小购票数目
        maxNum: '', // 最大购票数目
        isNeedIdcard: 'F', // 下单人身份证,'F'不填,'T'需要填
        retreatAuditType: 'F', // 是否审核
        refundFeeType: null, // 退款手续费类型
        refundScale: null, // 扣款比例
        refundFixedAmount: null, // 固定金额
        isRetreat: 'T',
        isAutoAudit: false,
        beforePlayDay: '',
        beforeStopHour: '00:00',
        refundPlayDayVaild: 'F',
        isAutoTicket: 'F'
      },
      // 票型名称、票型价格、是否立即上架、预订数量限定
      ruleComplteForm: {
        name: [{ required: true, message: '请填写票型名称', trigger: 'blur' }],
        price: [{ required: true, message: '请填写票价' }],
        enabled: [{ required: true, message: '请选择上下架状态' }]
      }
    }
  },
  computed: {
    refundPlayDayVaild: {
      get () {
        return this.formItem.refundPlayDayVaild === 'T'
      },
      set (val) {
        this.formItem.refundPlayDayVaild = val ? 'T' : 'F'
      }
    }
  },
  created () {
    apiGet('/admin/userStore/detail').then(resdata => {
      if (resdata.status == 200 || resdata.success) {
        this.mainUserId = resdata.user.mainUserInfoId
        if (this.$route.query.id) {
          apiGet(
            '/product/api/newTheaterTicket/queryTheaterTicket?id=' +
            this.$route.query.id + '&mainUserId=' + this.mainUserId
          ).then(res => {
            let data = res.data
            this.formItem.mainUserId = this.mainUserId
            this.formItem.id = this.$route.query.id
            this.formItem.name = data.name ? data.name : '' // 票型名称
            this.formItem.code = data.code ? data.code : '' // 票型编码(外部票型编码)
            this.formItem.parkName = data.parkName ? data.parkName : '' // 景区名称
            this.formItem.price = data.price ? data.price : '' // 票价
            this.formItem.type = data.type ? data.type : 'theater' // 票型类型：theater 剧院票
            this.formItem.ticketExplain = data.ticketExplain
              ? data.ticketExplain
              : '' // 票型说明
            this.formItem.enabled = data.enabled ? data.enabled : '' // 上下架 F下架 T上架
            this.formItem.linkMobileImg = data.linkMobileImg
              ? data.linkMobileImg
              : '' // 缩略图
            this.singleImgList = data.linkMobileImg ? [data.linkMobileImg] : []
            this.formItem.isBookingTime = data.isBookingTime
              ? data.isBookingTime
              : '' // 可购时间限制,'F'不限制,'T'有限制
            this.formItem.startTime = data.startTime ? data.startTime : '' // 允许开始下单日期
            // 退单规则
            this.formItem.retreatAuditType = data.retreatAuditType // 是否审核
            this.formItem.refundFeeType = data.refundFeeType ? 'type' + data.refundFeeType : '' // 退款手续费类型 +type解决不选中问题
            this.formItem.refundScale = data.refundScale ? ~~data.refundScale : null // 扣款比例
            this.formItem.refundFixedAmount = data.refundFixedAmount ? Number(data.refundFixedAmount) : null // 固定金额
            this.formItem.isRetreat = data.isRetreat || 'T'
            if (data.startTime) {
              // this.formItem.startDate = time;
              this.options4 = {
                disabledDate: date => {
                  let startTime = this.formItem.startTime
                    ? new Date(this.formItem.startTime).valueOf()
                    : ''
                  return date && date.valueOf() < startTime
                }
              }
            }

            this.formItem.endTime = data.endTime ? data.endTime : '' // 允许结束下单日期
            if (data.endTime) {
              // this.formItem.endDate = time;
              let endTime = this.formItem.endTime
                ? new Date(this.formItem.endTime).valueOf() -
                1 * 24 * 60 * 60 * 1000
                : ''
              this.options3 = {
                disabledDate (date) {
                  return date && date.valueOf() > endTime
                }
              }
            } else {
              this.options3 = {
                disabledDate (date) {
                  return false
                }
              }
            }

            this.formItem.earlyBookDay = data.earlyBookDay
              ? data.earlyBookDay
              : null // 最近可购天数

            this.formItem.minNum = (data.minNum || data.minNum == 0) ? data.minNum : '' // 最小购票数目
            this.formItem.maxNum = (data.maxNum || data.maxNum == 0) ? data.maxNum : '' // 最大购票数目
            this.formItem.isNeedIdcard = data.isNeedIdcard
              ? data.isNeedIdcard
              : 'F' // 下单人身份证,'F'不填,'T'需要填
            this.formItem.isAutoAudit = data.isAutoAudit === 'T'
            this.formItem.refundPlayDayVaild = data.refundPlayDayVaild
            this.formItem.beforePlayDay = data.beforePlayDay
            this.formItem.beforeStopHour = data.beforeStopHour
            this.formItem.isAutoTicket = data.isAutoTicket || 'F'
          })
        }
      }
    })
  },
  mounted () { },
  methods: {
    retreatAuditTypeC (val) {
      this.formItem.refundFeeType = null
      this.formItem.refundScale = null
      this.formItem.refundFixedAmount = null
    },
    refundFeeTypeC (val) {
      this.formItem.refundScale = null
      this.formItem.refundFixedAmount = null
      this.refundPlayDayVaild = false
    },
    radioChange (val) {
      // console.log(val)
      if (val == 'noLimit') {
        this.formItem.earlyBookDay = null
        this.formItem.startTime = ''
        this.formItem.endTime = ''
      } else if (val == 'earlyLimit') {
        this.formItem.startTime = ''
        this.formItem.endTime = ''
      } else if (val == 'timeRangeLimit') {
        this.formItem.earlyBookDay = null
      }
    },
    priceMax (rule, value, callback) {
      if (value > 999999) {
        callback(new Error('最大值999999'))
      } else {
        callback()
      }
    },
    summaryChange (content) {
      this.formItem.summary = content
    },
    introductionChange (content) {
      this.formItem.introduction = content
    },
    bookingNoticeChange (content) {
      this.formItem.bookingNotice = content
    },
    hashClick (val) {
      $('#content').scrollTop(
        $('#' + val).offset().top - 63 + $('#content').scrollTop()
      )
    },
    timeChange (val) {
      if (val) {
        //   earlyBookHour: "", //限制时间小时数
        // earlyBookMinute:
        this.formItem.earlyBookHour = val.split(':')[0]
        this.formItem.earlyBookMinute = val.split(':')[1]
      } else {
        this.formItem.earlyBookHour = ''
        this.formItem.earlyBookMinute = ''
      }
    },
    min (rule, value, callback) {
      if (
        this.formItem.minNum &&
        parseFloat(value) > parseFloat(this.formItem.maxNum)
      ) {
        callback(new Error('不能大于' + this.formItem.maxNum))
      } else {
        callback()
      }
    },
    max (rule, value, callback) {
      if (
        this.formItem.maxNum &&
        parseFloat(value) < parseFloat(this.formItem.minNum)
      ) {
        callback(new Error('不能小于' + this.formItem.minNum))
      } else {
        callback()
      }
    },
    setBegDate (time) {
      if (time) {
        this.formItem.startTime = time
        this.options4 = {
          disabledDate: date => {
            let startTime = this.formItem.startTime
              ? new Date(this.formItem.startTime).valueOf()
              : ''
            return date && date.valueOf() < startTime
          }
        }
      } else {
        this.formItem.startTime = ''
      }
    },
    setEndDate (time) {
      if (time) {
        this.formItem.endTime = time
        let endTime = this.formItem.endTime
          ? new Date(this.formItem.endTime).valueOf() -
          1 * 24 * 60 * 60 * 1000
          : ''
        this.options3 = {
          disabledDate (date) {
            return date && date.valueOf() > endTime
          }
        }
      } else {
        this.formItem.endTime = ''
        this.options3 = {
          disabledDate (date) {
            return false
          }
        }
      }
    },
    back () {
      this.$router.back()
    },
    // 初始化发布页面
    setWapUrl (imgArr) {
      // console.log(imgArr)
      this.formItem.linkMobileImg = imgArr.join(',')
      // this.$refs.formItem.validateField("linkMobileImg");
    },
    scrollError () {
      let errList = $('.ivu-form-item-error')
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top
        $('#content').animate(
          {
            scrollTop: scroll_offset
          },
          300
        )
      }
    },
    submit () {
      this.radioChange(this.formItem.isBookingTime ? this.formItem.isBookingTime : '')
      if (this.formItem.refundFeeType == 'type1') {
        this.formItem.refundFixedAmount = null
      } else if (this.formItem.refundFeeType == 'type2') {
        this.formItem.refundScale = null
        if (this.formItem.refundFixedAmount > this.formItem.price) {
          return this.$Message.warning('退票固定金额不能大于价格！')
        }
      } else {
        this.formItem.refundScale = null
        this.formItem.refundFixedAmount = null
      }
      if (this.formItem.refundFeeType) { this.formItem.refundFeeType = this.formItem.refundFeeType.substr(-1) }
      let formParam = JSON.parse(JSON.stringify(this.formItem))
      formParam.isAutoAudit = formParam.isAutoAudit ? 'T' : 'F'
      this.btnLoading = true
      let _this = this
      this.$refs.formItem.validate(async valid => {
        this.scrollError()
        if (valid) {
          let res = await apiPost(
            '/product/api/newTheaterTicket/editTheaterTicketSave',
            formParam
          )
          if (res.status === 200) {
            _this.$Message.success('保存成功!')
            _this.$router.push('/theaterTicketMgt')
          } else {
            this.formItem.refundFeeType = this.formItem.refundFeeType ? 'type' + this.formItem.refundFeeType : '' // 退款手续费类型 +type解决不选中问题
            this.btnLoading = false
            _this.$Message.warning(res.message)
          }
        } else {
          this.btnLoading = false
        }
      })
    }
  },
  components: {
    ueditor,
    myImg,
    selectItem
  }
}
</script>
<style scope lang="scss">
.theater-ticket-edit {
  width: 100%;

  .time-limit {
    .ivu-radio-wrapper.ivu-radio-group-item {
      width: 100%;
      margin-bottom: 15px;
      .time-limit-content {
        display: inline-block;
      }
    }
    .ivu-radio-wrapper.ivu-radio-group-item:last-child {
      margin-bottom: 0;
    }
  }
  .step {
    width: 60%;
    margin: 2.5rem auto;
  }
  .form-title {
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid rgba(100, 182, 255, 1);
    font-size: 16px;
    margin-bottom: 10px;
  }
  .fixed-box {
    position: fixed;
    top: 40%;
    right: 24px;
    background: #ffffff;
    z-index: 1000;
    ul {
      list-style: none;
      li {
        text-align: center;
        width: 100px;
        button {
          width: 100%;
        }
        a {
          display: block;
          color: #000;
          padding: 3px 7px;
          text-decoration: none;
          border-bottom: 1px solid #e2d5d5;
        }
        a.active {
          color: #2d8cf0;
        }
      }
      li:first-child a {
        color: #ffffff;
        background: #0099ff;
      }
    }
    .btn-primary-outline {
      color: #5a98de;
      background-color: transparent;
      background-image: none;
      border-color: #5a98de;
    }
  }
}
.save-cancel {
  padding-bottom: 50px;
}
</style>
