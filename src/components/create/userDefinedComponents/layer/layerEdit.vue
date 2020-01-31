<template>
  <div class="layer-edit-box">
    <table class="edit-table">
      <tr>
        <td class="title">
          <span class="red">*</span>
          选择图片
        </td>
        <td>
          <div class="layer-img-upload-box">
            <img class="img-show" :src="pageData.picAddr" v-if="pageData.picAddr"/>
            <div>
              <!-- <Icon class="trash-icon" @click="delImg(index)" type="ios-trash-outline"></Icon> -->
              <Upload
                :format="['jpg','jpeg','png']"
                :on-success="setImgUrl"
                :show-upload-list="false"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                action="/static/manage/uiFileUpload/dispatch?action=upload"
              >
                <!-- <Icon class="add-icon" type="ios-plus-outline" color='#3BB4F2' size='14'></Icon> -->
                <Button v-if="pageData.picAddr" type="primary" size='small'>更换图片</Button>
                <Button v-else type="primary" size='small'>选择图片</Button>
              </Upload>
            </div>
          </div>
          <span class="img-upload-tip">建议图片尺寸325*450</span>
        </td>
      </tr>
      <!-- <tr>
        <td class="title">
          &nbsp;&nbsp;图片链接</td>
        <td>
          <div class="link">
            <customLink :itemData="pageData"></customLink>
          </div>
        </td>
      </tr> -->
      <tr>
        <td class="title"><span class="red">*</span>优惠券编码</td>
        <td>
          <div class="">
            <Input v-model="pageData.couponCode" placeholder="请填写券码"></Input>
          </div>
        </td>
      </tr>
      <!-- <tr>
        <td class="title" style="vertical-align: baseline">
          <span class="red">*</span>
          弹窗频率
        </td>
        <td style="vertical-align:baseline">
          <div style="margin-bottom: 10px">
            <span>用户</span>
            <Select style="width:100px;" v-model="pageData.interval">
              <Option v-for="(item,index) in intervalList" :value="item.key" :key="index">{{ item.value }}</Option>
            </Select>
            <span>打开页面的前</span>
          </div>
          <div>
            <Select style="width:100px;" v-model="pageData.rate">
              <Option v-for="(item,index) in rateList" :value="item.key" :key="index">{{ item.value }}</Option>
            </Select>
            <span>次显示弹窗</span>
          </div>
        </td>
      </tr>
      <tr>
        <td class="title">
          <span class="red">*</span>
          展示时间
        </td>
        <td>
          <Select style="width:100px;" v-model="pageData.time">
            <Option v-for="(item,index) in timeList" :value="item.key" :key="index">{{ item.value }}</Option>
          </Select>
        </td>
      </tr> -->
      <tr>
        <td class="title">
          <span class="red">*</span>
          投放渠道
        </td>
        <td>
          <CheckboxGroup v-model="pageData.channel">
            <Checkbox label="wap">WAP端</Checkbox>
            <Checkbox label="miniApp">小程序</Checkbox>
          </CheckboxGroup>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import customLink from "@/components/otherRouter/custompageLink";
export default {
  components: {
    customLink
  },
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    pageData () {
      let pageData = this.list2[this.index].data
      if (!Array.isArray(pageData.channel)) {
        pageData.channel = [pageData.channel]
      }
      return pageData
    },
    ...mapState({
      list2: state => {
        //   console.log(state)
        return state.defined.list
      },
      errorShow: state => {
        return state.defined.errorShow
      }
    })
  },
  watch: {
    // pageData: {
    //   handler(val, oldVal) {
    //     console.log("val", val);
    //   },
    //   deep: true
    // }
  },
  data () {
    return {
      intervalList: [
        {key: '', value: '选择间隔'},
        {key: 'oneDay', value: '一天内'},
        {key: 'oneWeek', value: '一周内'},
        {key: 'oneMonth', value: '一月内'},
        {key: 'oneYear', value: '一年内'}
      ],
      rateList: [
        {key: '', value: '选择次数'},
        {key: '1', value: '1'},
        {key: '2', value: '2'},
        {key: '3', value: '3'},
        {key: '4', value: '4'},
        {key: '5', value: '5'},
        {key: '6', value: '6'},
        {key: '7', value: '7'},
        {key: '8', value: '8'},
        {key: '9', value: '9'}
      ],
      timeList: [
        {key: '', value: '选择时间'},
        {key: '1', value: '1秒'},
        {key: '3', value: '3秒'},
        {key: '5', value: '5秒'},
        {key: '10', value: '10秒'},
        {key: '20', value: '20秒'},
        {key: '30', value: '30秒'},
        {key: '60', value: '1分钟'},
        {key: 'unlimit', value: '不限'}
      ]
    }
  },
  methods: {
    // 上传成功后，设置图片地址
    setImgUrl (res) {
      this.list2[this.index].data.picAddr = res.prefix + res.url
    },
    // multipleChange(arr) {
    //   let filterArr = this.typeList.filter((item, index) => {
    //     return arr.indexOf(item.businessType) > -1;
    //   });
    //   this.pageData.layerDetailList = filterArr;
    // },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片超过2M',
        desc: '图片：' + file.name + '太大， 不能超过2M'
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件： ' + file.name + '格式错误, 请选择图片格式jpg,jpeg,png上传'
      })
    }
  }
}
</script>
<style lang='scss'>
  .layer-edit-box {
    .layer-img-upload-box{
      display: inline-block;
      vertical-align: middle;
    }
    .img-upload-tip{
      color: #999;
      padding-left: 10px;
    }
    .img-show{
      height: 56px;
      width: 56px;
    }
  }
</style>
