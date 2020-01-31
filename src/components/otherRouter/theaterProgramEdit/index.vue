<template>
  <div class="place-edit-warper">
    <!-- {{formItem}} -->
    <!-- <TimePicker format="HH:mm" placeholder="选择时间" style="width: 112px"></TimePicker> -->
    <Form :model="formItem"
          label-position="right"
          :label-width="145"
          ref="formItem"
          :rules="ruleComplteForm">
      <div id="base"
           class="form-title">基本信息</div>
      <FormItem label="节目名称："
                prop="name">
        <Input v-model="formItem.name"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="场所编码：">
        <Input disabled
               v-model="formItem.code"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="节目状态："
                prop="enabled">
        <Select v-model="formItem.enabled"
                style="width:200px">
          <Option value="T">上架</Option>
          <Option value="F">下架</Option>
        </Select>
      </FormItem>
      <FormItem label="日期限制：">
        <!-- <DatePicker
          disabled
          :value="formItem.startDate"
          @on-change="setBegDate"
          type="date"
          :options="options3"
          format="yyyy-MM-dd"
        ></DatePicker> -->
        <Input v-model="formItem.startDate"
               disabled
               style="width:120px"
               :maxlength="64"></Input>
        <span>至</span>
        <Input v-model="formItem.endDate"
               disabled
               style="width:120px"
               :maxlength="64"></Input>
        <!-- <DatePicker
        disabled
          :value="formItem.endDate"
          @on-change="setEndDate"
          type="date"
          :options="options4"
          format="yyyy-MM-dd"
        ></DatePicker> -->
      </FormItem>
      <FormItem label="演出单位：">
        <Input v-model="formItem.playDepart"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="价格区间："
                required>
        <!-- {{formItem.lowPrice}} -->
        <FormItem prop="lowPrice"
                  :rules="[{required: true, message: '不能为空' },{validator:min},{ pattern: /^(0|\+?[1-9][0-9]*)$/, message: '数据格式不正确'}]"
                  style="display:inline-block">
          <Input v-model="formItem.lowPrice"
                 style="width:100px"
                 :maxlength="8"></Input>
        </FormItem>
        <span>至</span>
        <FormItem prop="highPrice"
                  :rules="[{required: true, message: '不能为空' },{validator:max},{ pattern:/^(0|\+?[1-9][0-9]*)$/, message: '数据格式不正确'}]"
                  style="display:inline-block">
          <Input v-model="formItem.highPrice"
                 style="width:100px"
                 :maxlength="8"></Input>
        </FormItem>
      </FormItem>
      <!-- <FormItem label="节目销量：" required>
         <RadioGroup v-model="formItem.theatreSalesType">
          <Radio label="no_show">
              <span>不显示</span>
          </Radio>
          <Radio label="actual_sales">
              <span>实际销量</span>
          </Radio>
          <Radio label="virtual_sales">
              <span>虚拟销量</span>
              <FormItem prop="theatreSales" style="display:inline-block" :rules="[{required: formItem.theatreSalesType === 'virtual_sales' , message: '不能为空' },{ pattern: /^([1-9]\d*)$/, message: '数据格式不正确'}]">
                <Input v-model="formItem.theatreSales" style="width:100px" :maxlength="64" />
              </FormItem>     
          </Radio>
        </RadioGroup>   
      </FormItem> -->
      <FormItem label="缩略图：">
        <Input v-model="formItem.linkMobileImg"
               style="display:none"></Input>
        <my-img :limitNum="1"
                :uploadList="singleImgList"
                @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图："
                prop="linkImg">
        <Input v-model="formItem.linkImg"
               style="display:none"></Input>
        <my-img :limitNum="5"
                :uploadList="wapImgList"
                @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于1M， 宽750px，高440px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="预订须知提醒：">
        <Select v-model="formItem.purchaseDesc"
                style="width:200px">
          <Option value="T">开启提醒</Option>
          <Option value="F">不开启提醒</Option>
        </Select>
      </FormItem>
      <FormItem label="预订须知："
                required>
        <!-- {{formItem.bookingNotice}} -->
        <ueditor v-if="show"
                 id="ue3"
                 ref="noticeid"
                 :content="formItem.bookingNotice"
                 @contentChange="bookingNoticeChange"
                 :config="config"></ueditor>
      </FormItem>
      <div id="programDetail"
           class="form-title">节目详情</div>
      <FormItem label="简介描述："
                required>
        <ueditor v-if="show"
                 id="ue4"
                 ref="detail"
                 :content="formItem.introduction"
                 @contentChange="introductionChange"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="详情介绍：">
        <ueditor v-if="show"
                 id="ue5"
                 ref="detailIntro"
                 :content="formItem.summary"
                 @contentChange="summaryChange"
                 :config="config"></ueditor>
      </FormItem>
      <div id="bookRule"
           class="form-title">预订规则</div>
      <FormItem label="当日限制购票时间："
                prop="isIntradayBookingTime">
        <RadioGroup v-model="formItem.isIntradayBookingTime">
          <Radio label="F">
            <span>不限</span>
          </Radio>
          <Radio label="T">
            <span>限制时间</span>
          </Radio>
        </RadioGroup>
        <template v-if="formItem.isIntradayBookingTime=='T'">
          <FormItem style="display:inline-block"
                    prop="earlyBookHour">
            <TimePicker @on-change="timeChange"
                        format="HH:mm"
                        :value="time"
                        placeholder="选择时间"
                        style="width: 112px"></TimePicker>
          </FormItem>
          <span>（限制时间为当天最迟可购时间）</span>
        </template>
      </FormItem>
      <FormItem label="整单购票数量限制："
                prop="maxNum">
        <Input v-model="formItem.maxNum"
               style="width:150px"
               :maxlength="64"></Input>
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
             @click="hashClick('programDetail')">节目详情</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('bookRule')">预定规则</a>
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
      show: false,
      time: '',
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
      formItem: {
        mainUserId: '',
        id: '',
        name: '', // 节目名称
        code: '', // 节目编码(外部节目编码)
        playDepart: '', // 演出单位
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        enabled: '', // 节目状态 F下架 T上架
        lowPrice: '', // 最低价格
        highPrice: '', // 最高价格
        linkMobileImg: '', // 移动端图片 缩略图
        linkImg: '', // 主图 轮播图
        bookingNotice: '', // 预定须知
        introduction: '', // 简介
        summary: '', // 详情
        isIntradayBookingTime: 'F', // 当日限制购票时间,'F'不限制,'T'有限制
        earlyBookHour: '', // 限制时间小时数
        earlyBookMinute: '', // 限制时间分钟数
        maxNum: null, // 整单购票数量限制
        purchaseDesc: 'T',
        // theatreSalesType:"no_show",
        // theatreSales:""
      },
      ruleComplteForm: {
        name: [{ required: true, message: '请填写节目名称', trigger: 'blur' }],
        enabled: [{ required: true, message: '请选择节目状态' }],
        // linkMobileImg: [{ required: true, message: "请上传缩略图" }],
        linkImg: [{ required: true, message: '请上传轮播图' }],
        bookingNotice: [{ required: true, message: '请填写预订须知' }],
        introduction: [{ required: true, message: '请填写预订须知' }],
        maxNum: [
          { required: true, message: '请填写数量' },
          {
            max: 9,
            pattern: /^[1-9]\d*$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum,
            message: '数值不能大于999999'
          }
        ],
        isIntradayBookingTime: [
          { required: true, message: '请选择当日限制购票时间' }
        ],
        earlyBookHour: [{ required: true, message: '请选择时间' }]
      }
    }
  },
  computed: {},
  created () {
    // this.gethotelBrand(); //查询酒店品牌
    // this.getSysparam();
    apiGet('/admin/userStore/detail').then(resdata => {
      if (resdata.status == 200 || resdata.success) {
        this.mainUserId = resdata.user.mainUserInfoId
        if (this.$route.query.id) {
          apiGet(
            '/product/api/newTheaterShow/queryTheaterShow?id=' + this.$route.query.id + '&mainUserId=' + this.mainUserId
          ).then(res => {
            let data = res.data
            this.formItem.mainUserId = this.mainUserId
            this.formItem.id = this.$route.query.id
            this.formItem.name = data.name ? data.name : '' // 节目名称
            this.formItem.code = data.code ? data.code : '' // 节目编码(外部节目编码)
            this.formItem.playDepart = data.playDepart ? data.playDepart : '' // 演出单位
            this.formItem.startDate = data.startDate
              ? data.startDate.split(' ')[0]
              : '' // 开始日期
            if (data.startDate) {
              // this.formItem.startDate = time;
              this.options4 = {
                disabledDate: date => {
                  let startTime = this.formItem.startDate
                    ? new Date(this.formItem.startDate).valueOf()
                    : ''
                  return date && date.valueOf() < startTime
                }
              }
            }

            this.formItem.endDate = data.endDate ? data.endDate.split(' ')[0] : '' // 结束日期
            if (data.endDate) {
              // this.formItem.endDate = time;
              let endTime = this.formItem.endDate
                ? new Date(this.formItem.endDate).valueOf() -
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

            this.formItem.enabled = data.enabled ? data.enabled : '' // 节目状态 F下架 T上架
            this.formItem.lowPrice = (data.lowPrice || data.lowPrice == 0) ? data.lowPrice : '' // 最低价格
            this.formItem.highPrice = (data.highPrice || data.highPrice == 0) ? data.highPrice : '' // 最高价格
            this.formItem.linkMobileImg = data.linkMobileImg
              ? data.linkMobileImg
              : '' // 移动端图片 缩略图
            this.singleImgList = data.linkMobileImg ? [data.linkMobileImg] : []
            this.formItem.linkImg = data.linkImg ? data.linkImg : '' // 主图 轮播图
            this.wapImgList = data.linkImg ? data.linkImg.split(',') : []
            this.formItem.bookingNotice = data.bookingNotice
              ? data.bookingNotice
              : '' // 预定须知
            this.formItem.introduction = data.introduction ? data.introduction : '' // 简介
            this.formItem.summary = data.summary ? data.summary : '' //	详情
            this.formItem.isIntradayBookingTime = data.isIntradayBookingTime
              ? data.isIntradayBookingTime
              : 'F' // 当日限制购票时间,'F'不限制,'T'有限制
            this.formItem.earlyBookHour = (data.earlyBookHour || data.earlyBookHour == 0)
              ? data.earlyBookHour
              : '' // 限制时间小时数
            this.formItem.earlyBookMinute = (data.earlyBookMinute || data.earlyBookMinute == 0)
              ? data.earlyBookMinute
              : '' // 限制时间分钟数
            if ((data.earlyBookHour || data.earlyBookHour == 0) && (data.earlyBookMinute || data.earlyBookMinute == 0)) {
              this.time = data.earlyBookHour + ':' + data.earlyBookMinute
            } else {
              this.time = ''
            }
            this.formItem.maxNum = data.maxNum ? data.maxNum : '' // 整单购票数量限制
            this.formItem.purchaseDesc = data.purchaseDesc
            this.show = true
          })
        }
      }
    })
  },
  mounted () {
    // this.getSysparam()            //获取下拉框内容
    // this.$refs.hotelName.focus()
  },
  methods: {
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
        this.formItem.lowPrice &&
        parseFloat(value) > parseFloat(this.formItem.highPrice)
      ) {
        callback(new Error('不能大于' + this.formItem.highPrice))
      } else {
        callback()
      }
    },
    max (rule, value, callback) {
      if (
        this.formItem.highPrice &&
        parseFloat(value) < parseFloat(this.formItem.lowPrice)
      ) {
        callback(new Error('不能小于' + this.formItem.lowPrice))
      } else {
        callback()
      }
    },
    setBegDate (time) {
      if (time) {
        this.formItem.startDate = time
        this.options4 = {
          disabledDate: date => {
            let startTime = this.formItem.startDate
              ? new Date(this.formItem.startDate).valueOf()
              : ''
            return date && date.valueOf() < startTime
          }
        }
      } else {
        this.formItem.startDate = ''
      }
    },
    setEndDate (time) {
      if (time) {
        this.formItem.endDate = time
        let endTime = this.formItem.endDate
          ? new Date(this.formItem.endDate).valueOf() - 1 * 24 * 60 * 60 * 1000
          : ''
        this.options3 = {
          disabledDate (date) {
            return date && date.valueOf() > endTime
          }
        }
      } else {
        this.formItem.endDate = ''
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
      this.formItem.linkMobileImg = imgArr.join(',')
      // this.$refs.formItem.validateField("linkMobileImg");
    },
    setWapListUrl (imgArr) {
      this.formItem.linkImg = imgArr.join(',')
      this.$refs.formItem.validateField('linkImg')
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
      // console.log(this.formItem);
      this.btnLoading = true
      let _this = this
      this.$refs.formItem.validate(async valid => {
        this.scrollError()
        if (valid) {
          if (!this.formItem.bookingNotice) {
            this.$Message.warning('请填写预订须知')
            this.btnLoading = false
            return
          }
          if (!this.formItem.introduction) {
            this.$Message.warning('请填写简介描述')
            this.btnLoading = false
            return
          }
          let res = await apiPost(
            '/product/api/newTheaterShow/editTheaterShowSave',
            this.formItem
          )
          if (res.status == 200) {
            _this.$Message.success('保存成功!')
            _this.$router.push('/theaterProgramMgt')
          } else {
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
.place-edit-warper {
  width: 100%;
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
  .page-title {
    margin-bottom: 15px;
  }
  .ivu-date-picker .ivu-select-dropdown {
    z-index: 1000;
  }

  .edui-default .edui-editor {
    z-index: 666 !important;
  }
  .table {
    margin-bottom: 15px;
    width: 100%;
    border-spacing: 0;
    border: 1px solid #ddd;
    border-collapse: separate;
    border-left: 0;
    border-bottom: 0;
    thead {
      tr {
        th {
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #dddddd;
          padding: 8px;
          line-height: 20px;
        }
        th:first-child {
          text-align: center;
        }
      }
    }
    tbody {
      tr {
        td {
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #dddddd;
          padding: 8px;
          line-height: 20px;
        }
        td:first-child {
          // text-align: center
        }
      }
    }
  }
  .senicInfo {
    margin-top: 10px;
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid rgba(35, 192, 250, 1);
    .address {
      color: #999;
    }
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
.money-unit {
  margin-left: 8px;
}
.save-cancel {
  padding-bottom: 50px;
}
</style>
