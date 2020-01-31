<template>
  <div class="travellRoute-box">
    <div v-if='!isEdit'
         class="step">
      <Steps :current="1">
        <Step title="产品类型"></Step>
        <Step title="跟团游信息"></Step>
        <Step title="票型信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm">
      <div id="base"
           class="form-title">基本信息</div>
      <FormItem label="跟团游名称："
                prop="name">
        <Input v-model="formItem.name"
               placeholder="控制在100个汉字内，产品名称+（行程特色）"
               style="width:33%"
               :maxlength="64"></Input>
      </FormItem>
      <FormItem label="出发地："
                prop="begAddress" v-if="s_begAddress.show">
        <Input v-model="formItem.begAddress"
               placeholder="字数限制20个字"
               style="width:33%"
               :maxlength="20"></Input>
      </FormItem>
      <FormItem label="目的地："
                prop="endAddress" v-if="s_extendParamOne.show">
                <!-- s_projectName -->
        <area-select style="width:500px" :areaCode="formItem.extendParamOne" @getAll="getAllAreaList" v-if="s_projectName.defaultValue=='scxcx'"></area-select>
        <Input v-model="formItem.endAddress"
               placeholder="字数限制20个字"
               style="width:33%" 
               :maxlength="20" v-else></Input>
      </FormItem>
      <FormItem label="跟团游主题："
                prop="lineTheme">
        <!-- {{formItem.lineTheme}} -->
        <div style="height:32px;"
             class="travellSubject">
          <div class="subject-list">
            <div v-for='(item,index) in tagNameList'
                 :key='index'
                 class="subject-list-item">
              <Icon @click="subjectItemDel(index)"
                    class="subject-list-item-del"
                    type="close-circled"></Icon>
              <Button>{{item}}</Button>
            </div>
          </div>
          <div class="subject-input">
            <Input @on-enter='setSubjectTag'
                   :maxlength="4"
                   v-model='tagName'
                   placeholder='回车添加标签，如“跟团游”'
                   style="width: 200px"></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left">输入后，回车添加</div>
        </div>
        <Input v-model="formItem.lineTheme"
               style="display:none"></Input>
      </FormItem>
      <FormItem label="几天几夜："
                required>
        <FormItem style="width:100px;display:inline-block"
                  prop="useDay">
          <Input style="width:100px"
                 v-model="formItem.useDay"
                 :maxlength="2"></Input>
        </FormItem>
        <span class="unit">天</span>
        <FormItem style="width:100px;display:inline-block"
                  prop="useNight">
          <Input style="width:100px"
                 v-model="formItem.useNight"
                 :maxlength="2"></Input>
        </FormItem>
        <span class="unit">夜</span>
      </FormItem>
      <FormItem label="所属景区：" v-if="s_merchantParkInfoId.show">
        <Button @click="senicSelect"
                v-if='showTableSelection.length<20'
                type="primary">景区选择</Button>
        </Button>
        <div v-if='showTableSelection&&showTableSelection.length'>
          <div v-for='(item,index) in showTableSelection'
               :key='index'
               class="senicInfo">
            <Icon @click="senicDel(index)"
                  class="senicDel"
                  type="close-circled"></Icon>
            <div class="name">{{item.name}}</div>
            <div class="address">{{item.areaAddr}}</div>
          </div>
          <!-- <div v-else class="senicInfo" v-show="formItem.areaName">请选择酒店/新增酒店</div> -->
        </div>
      </FormItem>

      <div id="senicInfo"
           class="form-title">跟团游信息</div>
      <FormItem label="跟团游描述："
                prop="lineDescription">
        <Input type="textarea"
               v-model="formItem.lineDescription"
               :maxlength="100"
               placeholder="用于跟团游详情页，跟团游名称下方介绍"
               style="width:33%"></Input>
      </FormItem>
      <template v-if='dataShow'>
        <FormItem label="跟团游须知："
                  prop='lineNotes'>
          <!-- <quill-editor ref='quill1' :content='formItem.lineNotes'></quill-editor> -->
          <ueditor id="ue1"
                   ref="lineNotes"
                   :content="formItem.lineNotes"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem label="行程安排："
                  prop="lineArrange">
          <!-- <Input type="textarea" style="width:33%" v-model="formItem.content" :rows="4" placeholder="请输入景点描述"></Input> -->
          <!-- <quill-editor ref='quill2' :content='formItem.lineArrange'></quill-editor> -->
          <ueditor id="ue2"
                   ref="lineArrange"
                   :content="formItem.lineArrange"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem label="费用说明："
                  prop="costDescription">
          <!-- <Input type="textarea" style="width:33%" v-model="formItem.content" :rows="4" placeholder="请输入景点描述"></Input> -->
          <!-- <quill-editor ref='quill3' :content="formItem.costDescription"></quill-editor> -->
          <ueditor id="ue3"
                   ref="costDescription"
                   :content="formItem.costDescription"
                   :config="config"></ueditor>
        </FormItem>
      </template>
      <FormItem label="缩略图："
                prop='linkMobileImg'>
        <!-- <Input v-model="formItem.linkMobileImg" style="display:none"></Input> -->
        <my-img :limitNum="1"
                :uploadList="singleImgList"
                @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图："
                prop="linkBreviaryImg">
        <!-- <Input v-model="formItem.linkBreviaryImg" style="display:none"></Input> -->
        <my-img :limitNum="5"
                :uploadList="wapImgList"
                @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于2M， 宽750px，高440px的JPG/PNG格式的图片</p>
      </FormItem>
      <div id="distSet"
           class="form-title">分销设置</div>
      <FormItem label="分销渠道："
                prop="sellType">
        <Select v-model="formItem.sellType"
                style="width:200px">
          <Option :value="item.value"
                  v-for="(item,index) in sellTypeList"
                  :key="index">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="跟团游别名："
                v-if="formItem.sellType!='1'"
                prop="lineAlias">
        <Input ref="hotelName"
               v-model="formItem.lineAlias"
               style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="跟团游副标题："
                v-if="formItem.sellType!='1'"
                prop="lineViceName">
        <Input v-model="formItem.lineViceName"
               style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem v-if="formItem.sellType=='0'||formItem.sellType=='2'"
                label="店铺展示起价："
                prop="merchatShowPrice">
        <Input v-model="formItem.merchatShowPrice"
               style="width:200px;" :maxlength="8"></Input>
        <span class='money-unit'>元</span>
      </FormItem>
      <FormItem v-if="formItem.sellType=='0'"
                label="店铺虚拟销量："
                prop="virtualSell">
        <Input :maxlength="6"
               v-model="formItem.virtualSell"
               style="width:200px;"></Input>
        <span class='money-unit'></span>
      </FormItem>
      <FormItem v-if="formItem.sellType=='2'"
                label="店铺虚拟销量："
                prop="virtualSell">
        <Input :maxlength="6"
               v-model="formItem.virtualSell"
               style="width:200px;"></Input>
        <span class='money-unit'></span>
      </FormItem>
      <FormItem v-if="formItem.sellType=='0'||formItem.sellType=='1'"
                label="分销展示价："
                prop="distShowPrice">
        <Input v-model="formItem.distShowPrice"
               style="width:200px;" :maxlength="8"></Input>
        <span class='money-unit'>元</span>
      </FormItem>
      <template v-if='dataShow'>
        <FormItem v-if="formItem.sellType=='0'||formItem.sellType=='1'"
                  label="分销政策："
                  prop='distPolicy'>
          <!-- <quill-editor ref='quill4' :content='formItem.distPolicy'></quill-editor> -->
          <ueditor id="ue4"
                   ref="distPolicy"
                   :content="formItem.distPolicy"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem v-if="formItem.sellType=='0'||formItem.sellType=='1'"
                  label="售后政策："
                  prop='soldPolicy'>
          <!-- <quill-editor ref='quill5' :content='formItem.soldPolicy'></quill-editor> -->
          <ueditor id="ue5"
                   ref="soldPolicy"
                   :content="formItem.soldPolicy"
                   :config="config"></ueditor>
        </FormItem>
      </template>

      <FormItem v-if='formItem.sellType!="2"'
                label="分销区域限制：">
        无限制
        <!-- <Select style="width:200px">
          <Option value="1">无限制</Option>
          <Option value="1">限制区域</Option>
        </Select> -->
      </FormItem>
      <!-- <FormItem v-if='!isEdit' label="是否立即上架：">
        <Select v-model='formItem.enabled' style="width:200px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
      </FormItem> -->
      <FormItem label="下单信息填写：">
        <Checkbox v-model="name">姓名</Checkbox>
        <Checkbox v-model="idCard">身份证</Checkbox>
      </FormItem>
      <FormItem label="留言：">
        <template v-if="formItem.orderCustomPlugins.length">
          <Row :gutter="16"
               style="width:55%; margin-bottom:24px;"
               v-for="(item,index) in formItem.orderCustomPlugins"
               :key="index">
            <Col span="6">
            <FormItem :prop="'orderCustomPlugins.' + index + '.title'"
                      :rules="{required: true, message: '请填写留言标题', trigger: 'blur'}">
              <Input v-model="item.title"
                     placeholder="请输入留言标题"
                     :maxlength="8"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem :prop="'orderCustomPlugins.' + index + '.type'"
                      :rules="{required: true, message: '请选择留言类型', trigger: 'change'}">
              <Select v-model="item.type"
                      placeholder="请选择留言类型"
                      @on-change="typeChange($event,index)">
                <Option v-for="sitem in leaveType"
                        :value="sitem.value"
                        :key="sitem.value">{{sitem.key}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem>
              <Input v-model="item.tips"
                     placeholder="请输入提示语"
                     :maxlength="12"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem>
              <Checkbox v-model="item.isRequired">必填</Checkbox>
              <Button type="ghost"
                      icon="minus-round"
                      style="margin-left:2%;"
                      @click="delPlugins(index)"></Button>
              <Button type="info"
                      icon="plus"
                      style="margin-left:2%;"
                      v-if="index===formItem.orderCustomPlugins.length-1&&index<4"
                      @click="addPlugins"></Button>
            </FormItem>
            </Col>
          </Row>
        </template>
        <Button type="info"
                icon="plus"
                v-else
                @click="addPlugins"></Button>
      </FormItem>
      <FormItem label="预定人工确认：">
        <Row style="width:30%">
          <Col span="12">
          <Select v-model="formItem.peopleConfirm"
                  placeholder="请选择预定人工确认"
                  style="width:90%"
                  @on-change="peopleConfirmChange">
            <Option value="T">是</Option>
            <Option value="F">否</Option>
          </Select></Col>
          <Col span="12"
               v-if="formItem.peopleConfirm==='T'">
          <FormItem prop="peopleConfirmTime">
            <Input v-model="formItem.peopleConfirmTime"
                   number
                   placeholder="请输入过期时间"
                   style="width:60%;"></Input> 分钟
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="订单通知："
                prop="tel"
                :rules="tel?{required: tel, validator: common.validate.phone, trigger: 'blur'}:{}">
        <Checkbox label="tel"
                  @on-change='telChange'
                  v-model="tel"></Checkbox>
        <Input v-model="formItem.tel"
               :disabled='!tel'
               style="width:300px;"
               placeholder="用于接收下单提示短信"></Input>
        <Button type="primary"
                @click="getModal">查看模板</Button>
      </FormItem>

      <FormItem prop="email"
                :rules="email?{required: email, validator: common.validate.email, trigger: 'blur'}:{}">
        <Checkbox label="email"
                  @on-change='emailChange'
                  v-model="email"></Checkbox>
        <Input v-model="formItem.email"
               :disabled='!email'
               style="width:300px;"
               placeholder="用于接收下单提示邮箱"></Input>
      </FormItem>
      <FormItem>
        <div class="save-cancel">
          <Button type="primary"
                  :loading='btnLoading'
                  @click="submit">
            <template v-if='isEdit'>
              保存
            </template>
            <template v-else>
              保存,下一步
            </template>
          </Button>
          <Button v-if='isEdit'
                  type="ghost"
                  style="margin-left: 8px"
                  @click="goback">返回列表</Button>
          <Button v-else
                  type="ghost"
                  style="margin-left: 8px"
                  @click="test">取消</Button>
        </div>
      </FormItem>
    </Form>
    <Modal class="test"
           width="800"
           v-model="model"
           title="选择景区"
           @on-cancel="cancel"
           :loading="loading">
      <div style="margin-bottom:10px">
        <Input placeholder="请输入对应景区关键字"
               v-model='keyword'
               style="width: 300px"></Input>
        <Button @click="selectHotel"
                type="primary">搜索</Button>
        <p style="color:red"> 备注：没有相关信息，请重新搜索或联系小鲸客服(400-875-9009)</p>
      </div>
      <div>
        <Table height='350'
               @on-selection-change='selectionChange'
               :loading='tableLoading'
               border
               :columns="columns7"
               :data="data6"></Table>
      </div>
      <div style="margin-top:10px">
        <Page :total="total"
              :current="page"
              :page-size="pageSize"
              @on-change="changePage"
              @on-page-size-change='pageSizeChange'
              size="small"
              show-elevator
              show-sizer></Page>
      </div>
      <div slot='footer'>
        <Button type="primary"
                @click="ok">添加</Button>
        <Button @click='cancel'>取消</Button>
      </div>
    </Modal>
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
             @click="hashClick('senicInfo')">跟团游信息</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="hashClick('distSet')">分销设置</a>
        </li>
        <li>
          <Button size="small"
                  :loading='btnLoading'
                  @click="submit"
                  type="primary">
            <template v-if='isEdit'>
              保存
            </template>
            <template v-else>
              保存,下一步
            </template>
          </Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
    <Modal v-model="model2"
           title="查看模板">
      <p>
        您有新的线路订单，订单内容{OrderCode}，X份，实付金额XX，请即时处理。
      </p>
      <div slot="footer">
        <Button @click="templateCancel">关闭</Button>
      </div>
      <!-- <Input type="textarea" v-model="formItem.text"></Input> -->
    </Modal>
  </div>
</template>
<script>
// import quillEditor from "@/components/global/vueQuillEditor";
import ueditor from '@/components/global/ueditor'
import areaSelect from "@/components/global/select"
import { apiPost, apiGet, apiPostJson } from '@/fetch/api'
import myImg from '@/components/global/singleImg'
import {mapActions, mapGetters} from "vuex"
export default {
  data () {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error('最大值999999'))
      } else {
        callback()
      }
    }
    const validateTime = (rule, value, callback) => {
      if (value > 1440) {
        callback(new Error('最大值1440'))
      } else {
        callback()
      }
    }
    return {
      model2: false,
      pageSize: 10,
      seletedList: [],
      active: false,
      social: [],
      selectAll: false,
      dataShow: false, // 保证页面在有数据的情况下一定展示
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      isEdit: '', // 是否编辑页
      keyword: '',
      editorOption: {
        placeholder: ''
      },
      tagNameList: [], // 标签名数组
      tagName: '', // 主题标签名称
      showTableSelection: [], // 页面展示选中项数组
      tableSelecttion: [], // 弹框选中项
      tableLoading: false,
      branditems: [],
      btnLoading: false,
      singleImgList: [],
      wapImgList: [],
      page: 1,
      total: 0,
      columns7: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'name',
          render: (h, params) => {
            return h('div', params.index + 1)
          }
        },
        {
          title: '景区名称',
          key: 'name'
        },
        {
          title: '景区地址',
          key: 'areaAddr'
        }
      ],
      data6: [],
      model: false,
      loading: true,
      type: '',
      hotelLevels: [],
      hotelTypes: [],
      sellTypeList: [
        {
          value: '0',
          label: '分销市场+店铺'
        },
        {
          value: '1',
          label: '仅分销市场'
        },
        {
          value: '2',
          label: '仅店铺'
        }
      ],
      // 酒店品牌数据
      brandList: [],
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      // 新增品牌
      formBrand: {
        name: '',
        level: 2,
        parentId: ''
      },
      formItem: {
        id: '',
        name: '', // 酒店名称
        begAddress: '', // 出发地
        endAddress: '', // 目的地
        lineTheme: '', // 主题
        useDay: '', // 用时几天
        useNight: '', // 用时几夜
        merchantParkInfoId: '', // 所属景区，存店铺上架景区id，逗号隔开
        lineDescription: '', // 线路描述
        lineNotes: '<p>【报名方式】</p><p></p><p>【集合地点】</p><p></p><p>【变更说明】</p><p></p><p>【发票说明】</p><p></p><p>【退改说明】</p><p></p><p>【温馨提示】</p><p></p><p>【联系电话】</p>', // 线路须知
        lineArrange: '<p>【产品特色】</p><p></p><p>【行程安排】</p><p></p><p>第一天/出发地-目的地：</p><p></p><p>第二天/出发地-目的地：</p><p></p>', // 线路安排
        costDescription: '<p>【费用包含】</p><p></p><p>景点：</p><p></p><p>住宿：</p><p></p><p>用餐：</p><p></p><p>交通：</p><p></p><p>保险：</p><p></p><p>服务：</p><p></p><p>【费用不包含】</p><p></p><p>【自费项目】</p><p></p><p>【购物说明】</p><p></p>', // 费用说明
        linkMobileImg: '', // 主图地址
        linkBreviaryImg: '', // 缩略图地址
        sellType: '0', // 渠道
        lineAlias: '', // 线路别名
        lineViceName: '', // 线路副标题
        merchatShowPrice: '', // 店铺展示起价
        virtualSell: '', // 店铺虚拟销量
        distShowPrice: '', // 分销展示价
        distPolicy: '', // 分销政策
        soldPolicy: '', // 售后政策
        enabled: '',
        orderCustomPlugins: [], // 留言字段
        peopleConfirm: 'F',
        peopleConfirmTime: '',
        tel: '',
        email: ''
      },
      parentIds: '',
      ruleComplteForm: {
        name: [
          { required: true, message: '请填写跟团游名称', trigger: 'blur' }
        ],
        begAddress: [
          { required: true, message: '请填写出发地', trigger: 'blur' }
        ],
        endAddress: [
          { required: true, message: '请填写目的地', trigger: 'blur' }
        ],
        lineTheme: [
          { required: true, message: '请填添加跟团游主题', trigger: 'blur' }
        ],
        useDay: [
          { required: true, message: '请填写几天', trigger: 'blur' },
          {
            pattern: /^\d+$/,
            message: '数据格式不正确'
          }
        ],
        useNight: [
          { required: true, message: '请填写几夜', trigger: 'blur' },
          {
            pattern: /^\d+$/,
            message: '数据格式不正确'
          }
        ],
        lineDescription: [
          { required: true, message: '请填写跟团游描述', trigger: 'blur' }
        ],
        lineNotes: [
          { required: true, message: '请填写跟团游须知', trigger: 'blur' }
        ],
        lineArrange: [
          { required: true, message: '请填写行程安排', trigger: 'blur' }
        ],
        costDescription: [
          { required: true, message: '请填写费用说明', trigger: 'blur' }
        ],
        linkMobileImg: [{ required: true, message: '请上传缩略图' }],
        linkBreviaryImg: [{ required: true, message: '请上传轮播图' }],
        sellType: [
          { required: true, message: '请选择分销渠道', trigger: 'blur' }
        ],
        lineAlias: [
          { required: true, message: '请填写跟团游别名', trigger: 'blur' },
          { max: 100, message: '跟团游别名字数不能超过100个' }
        ],
        lineViceName: [
          { required: true, message: '请填写跟团游副标题', trigger: 'blur' },
          { max: 100, message: '跟团游副标题字数不能超过100个' }
        ],
        merchatShowPrice: [
          { required: true, message: '请填写店铺展示起价' },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum,
            message: '数值不能大于999999'
          }
        ],
        virtualSell: [
          { required: true, message: '请填写店铺虚拟销量' },
          {
            pattern: /^[0-9]\d*$/,
            message: '数据格式不正确'
          }
        ],
        distShowPrice: [
          { required: true, message: '请填写分销展示价' },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum,
            message: '数值不能大于999999'
          }
        ],
        distPolicy: [
          { required: true, message: '请填写分销政策', trigger: 'blur' }
        ],
        peopleConfirmTime: [
          { required: true, type: 'number', message: '请输入过期时间', trigger: 'blur' },
          {
            pattern: /^\d+$/,
            message: '数据格式不正确'
          },
          {
            validator: validateTime,
            message: '数值不能大于1440'
          }
        ],
        soldPolicy: [
          { required: true, message: '请填写售后政策', trigger: 'blur' }
        ]
      },
      name: true,
      idCard: true,
      tel: false,
      leaveType: [],
      email: false
    }
  },
  computed: {
    ...mapGetters('travelling',[
      's_projectName',
      's_merchantParkInfoId',
      's_begAddress',
      's_extendParamOne'
    ])
  },
  watch: {
    social: function (val) {
      if (val.length !== 10) {
        // 没有全选
        this.active = false
      } else {
        this.active = true
      }
    }
  },
  created () {
    this.isEdit = this.$route && this.$route.query && this.$route.query.id
    if (this.isEdit) {
      this.getPageData()
    } else {
      // 缓存页面
      this.getRouteInfo()
    }
  },
  mounted () {
    apiGet(
      '/admin/api/sysParam/changeList?key=leaveType').then(res => {
      if (res.status === 200) {
        this.leaveType = res.data
      } else {
        this.$Message.warning(res.message)
      }
    })
  },
  methods: {
    ...mapActions('travelling',['getDiffInfo']),
    getAllAreaList(list){
      this.formItem.extendParamOne=list[0].code+'-'+list[1].code+'-'+list[2].code
      this.formItem.endAddress=list[0].name+'-'+list[1].name+'-'+list[2].name
    },
    allSelect () {
      this.active = !this.active
      if (this.active) {
        this.social = this.data6.map(function (item, index) {
          return item.id
        })
      } else {
        this.social = []
      }
    },
    cancel () {
      this.model = false
      this.keyword = ''
      this.page = 1
    },
    getPageData () {
      apiGet(
        '/product/api/routeProduct/editRouteInfo?routeId=' +
        this.$route.query.id
      ).then(res => {
        this.initData(res)
      })
    },
    getRouteInfo () {
      apiGet('/product/api/routePush/publishRoute', {
        params: new Date()
      }).then(res => {
        this.initData(res)
      })
    },
    async initData (res) {
      // 初始化页面数据
      let info=await this.getDiffInfo()
      let diffValue={}
      if(info&&info.data){
        diffValue=info.data
      }
      this.dataShow = true
      if (res && res.data) {
        let _this = this
        this.formItem={
          ...diffValue,
          ...res.data
        }
        // this.formItem.orderCustomPlugins = res.data.orderCustomPlugins || []
        if (!res.data.orderCustomPlugins) {
          this.$set(this.formItem, 'orderCustomPlugins', [])
        } else {
          let buyerName = false
          let buyerIdNo = false
          let orderCustomPluginsObj = JSON.parse(res.data.orderCustomPlugins).filter(element => {
            if (element.type === 'buyerName') {
              buyerName = true
            }
            if (element.type === 'buyerIdNo') {
              buyerIdNo = true
            }
            return element.type !== 'buyerMobile' && element.type !== 'buyerName' && element.type !== 'buyerIdNo'
          })
          this.name = buyerName
          this.idCard = buyerIdNo
          this.$set(this.formItem, 'orderCustomPlugins', orderCustomPluginsObj)
        }
        this.tel = !!res.data.tel
        this.email = !!res.data.email
        this.tagNameList =
          res.data && res.data.lineTheme ? res.data.lineTheme.split(',') : []
        this.singleImgList =
          res.data && res.data.linkMobileImg
            ? res.data.linkMobileImg.split(',')
            : []
        this.wapImgList =
          res.data && res.data.linkBreviaryImg
            ? res.data.linkBreviaryImg.split(',')
            : []
        if (res.data && res.data.merchantParkInfoId) {
          apiGet(
            '/product/api/routePush/listMerchantParkById?ids=' +
            res.data.merchantParkInfoId
          ).then(res => {
            _this.showTableSelection = res && res.data ? res.data : []
          })
        }
      }
    },
    subjectItemDel (index) {
      this.tagNameList.splice(index, 1)
      this.formItem.lineTheme = this.tagNameList.join(',')
    },
    setSubjectTag () {
      // 回车添加标签名
      if (this.tagNameList && this.tagNameList.length < 5) {
        if (this.tagName) {
          this.tagNameList.push(this.tagName)
          this.formItem.lineTheme = this.tagNameList.join(',')
          this.tagName = ''
        } else {
          this.$Message.warning('请输入标签名！')
        }
      } else {
        this.$Message.warning('最多添加五个标签！')
      }
    },
    senicDel (index) {
      // 删除景区
      this.showTableSelection.splice(index, 1)
    },
    selectionChange (selection) {
      this.tableSelecttion = selection
    },
    ok () {
      // 弹框确定
      // 和已存在的景区对比，获取未存在的景区
      let _this = this
      // 重复的
      this.seletedList = this.tableSelecttion.filter(function (item, index) {
        return _this.showTableSelection.find(function (it, i) {
          return item.id == it.id
        })
      })
      // 不重复的
      this.tableSelecttion = this.tableSelecttion.filter(function (item, index) {
        return !_this.showTableSelection.find(function (it, i) {
          return item.id == it.id
        })
      })
      if (
        this.showTableSelection &&
        this.tableSelecttion &&
        this.tableSelecttion.length + this.showTableSelection.length > 20
      ) {
        this.$Message.warning(
          '最多选择20个景区，已选' +
          this.showTableSelection.length +
          '个景区,至多还能选择' +
          (20 - this.showTableSelection.length) +
          '个景区'
        )
      } else {
        this.showTableSelection = this.showTableSelection.concat(
          this.tableSelecttion
        )
        this.model = false
      }
      this.keyword = ''
      this.page = 1
    },
    hashClick (val) {
      $('#content').scrollTop(
        $('#' + val).offset().top - 63 + $('#content').scrollTop()
      )
    },
    setnickname () {
      this.formItem.aliasName = this.formItem.name
    },
    selectChange (val) {
      let _this = this
      this.brandList.forEach(function (d) {
        if (d.id == val) {
          _this.branditems = d.items
        }
      })
      this.hotelBrandId = ''
    },
    test () {
      window.location.href =
        window.location.href.split('/manage')[0] +
        '/admin/index#/product/parkPublish/selectProduct'
      // this.$router.push("/publishParkTicket");
    },
    goback () {
      this.$router.back()
    },
    setWapUrl (imgArr) {
      this.formItem.linkMobileImg = imgArr[0]
      // this.formItem.linkMobileImg = imgArr.join(",");
      this.$refs.formItem.validateField('linkMobileImg')
    },
    setWapListUrl (imgArr) {
      if (imgArr.length > 5) {
        this.formItem.linkBreviaryImg = imgArr.slice(0, 5).join(',')
      } else {
        this.formItem.linkBreviaryImg = imgArr.join(',')
      }
      this.$refs.formItem.validateField('linkBreviaryImg')
    },
    changePage (page) {
      this.page = page
      this.selectHotel()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.selectHotel()
    },
    // 选择景区
    selectHotel () {
      this.tableLoading = true
      apiPost('/product/api/routePush/pageParkToRoute', {
        currPage: this.page,
        pageSize: this.pageSize,
        name: this.keyword
      }).then(res => {
        if (res.status == 200) {
          let _this = this
          this.tableLoading = false
          // res.data.rows = res.data.rows.filter(ele => {
          //   return !_this.showTableSelection.some(item => {
          //     return ele.id == item.id;
          //   });
          // });
          this.social = this.showTableSelection.map(function (item, index) {
            return item.id
          })
          this.data6 = res.data.rows
          this.total = res.data.total
        }
      })
    },
    // 选择酒店
    senicSelect () {
      this.model = true
      this.selectHotel()
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
    addPlugins () {
      this.formItem.orderCustomPlugins.push({
        title: '',
        type: '',
        tips: '',
        name: '',
        isRequired: false
      })
    },
    delPlugins (index) {
      this.formItem.orderCustomPlugins.splice(index, 1)
    },
    typeChange (value, index) {
      this.formItem.orderCustomPlugins[index].name = value
    },
    submit () {
      this.btnLoading = true
      let _this = this
      let arr = this.showTableSelection.map((item, index) => {
        return item.id
      })
      this.formItem.merchantParkInfoId = arr.join(',')
      this.formItem.lineNotes = this.$refs.lineNotes.getUEContent()
      this.formItem.lineArrange = this.$refs.lineArrange.getUEContent()
      this.formItem.costDescription = this.$refs.costDescription.getUEContent()
      this.formItem.distPolicy = this.$refs.distPolicy
        ? this.$refs.distPolicy.getUEContent()
        : this.formItem.distPolicy
      this.formItem.soldPolicy = this.$refs.soldPolicy
        ? this.$refs.soldPolicy.getUEContent()
        : this.formItem.soldPolicy
      let formParam = JSON.parse(JSON.stringify(this.formItem))
      // <Checkbox v-model="name">姓名</Checkbox>
      //   <Checkbox v-model="idCard">身份证</Checkbox>
      formParam.orderCustomPlugins.unshift({
        title: '手机号',
        type: 'buyerMobile',
        tips: '请输入手机号',
        name: 'buyerMobile',
        isRequired: true
      })
      if (this.name) {
        formParam.orderCustomPlugins.unshift({
          title: '姓名',
          type: 'buyerName',
          tips: '请填写姓名',
          name: 'buyerName',
          isRequired: true
        })
      }
      if (this.idCard) {
        var idCardObj = {
          title: '身份证号',
          type: 'buyerIdNo',
          tips: '请填写身份证号',
          name: 'buyerIdNo',
          isRequired: false
        }
        if (formParam.orderCustomPlugins[0].type === 'buyerMobile') {
          formParam.orderCustomPlugins.splice(1, 0, idCardObj)
        } else {
          formParam.orderCustomPlugins.splice(2, 0, idCardObj)
        }
      }
      formParam.orderCustomPlugins = JSON.stringify(formParam.orderCustomPlugins)
      this.$refs.formItem.validate(async valid => {
        this.scrollError()
        if (valid) {
          let url = this.isEdit
            ? '/product/api/routeProduct/saveEditRouteInfo'
            : '/product/api/routePush/saveRoute'
          if (this.isEdit) {
            this.formItem.id = this.$route.query.id
          }
          let res = await apiPost(url, formParam)
          if (res.status == 200) {
            _this.$Message.success('保存成功!')
            if (this.isEdit) {
              _this.$router.push('/travellingRouteList')
            } else {
              _this.$router.push('/travellingRouteInfo')
            }
          } else {
            this.btnLoading = false
            _this.$Message.warning(res.message)
          }
        } else {
          this.btnLoading = false
          // 滚动到错误地方
          setTimeout(function () {
            $('#content').scrollTop(
              $('.ivu-form-item-error').offset().top -
              90 +
              $('#content').scrollTop()
            )
          }, 500)
        }
      })
    },
    telChange (bool) {
      if (!bool) {
        this.formItem.tel = ''
      }
    },
    emailChange (bool) {
      if (!bool) {
        this.formItem.email = ''
      }
    },
    // 设置模板
    getModal () {
      this.model2 = true
    },
    templateCancel () {
      this.model2 = false
    },
    peopleConfirmChange (value) {
      if (value === 'T') {
        this.formItem.peopleConfirmTime = 1440
      } else {
        this.formItem.peopleConfirmTime = ''
      }
    }
  },
  components: {
    myImg,
    // quillEditor,
    ueditor,
    areaSelect
  }
}
</script>
<style lang="scss">
.modal-table {
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
        text-align: center;
      }
    }
  }
}
.travellRoute-box {
  .ql-container {
    height: 150px;
  }
  .money-unit {
    margin-left: 8px;
  }
  .save-cancel {
    padding-bottom: 50px;
  }
  .unit {
    padding: 0 10px;
  }
  .travellSubject {
    // border: 1px solid red;
    .subject-list {
      float: left;
      margin-right: 10px;
      .subject-list-item {
        display: inline-block;
        margin-right: 10px;
        position: relative;
        .subject-list-item-del {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .subject-list-item:hover {
        .subject-list-item-del {
          display: inline-block;
        }
      }
    }
    .subject-input {
      float: left;
    }
  }
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
  .senicInfo {
    position: relative;
    margin-top: 10px;
    display: inline-block;
    padding: 5px 10px;
    margin-right: 10px;
    border: 1px solid rgba(35, 192, 250, 1);
    .senicDel {
      position: absolute;
      top: -9px;
      right: -8px;
      background: #fff;
      font-size: 18px;
      cursor: pointer;
      display: none;
    }
    .address {
      color: #999;
    }
  }
  .senicInfo:hover {
    .senicDel {
      display: inline-block;
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
</style>
