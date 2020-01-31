<template>
  <div class="card-add-edit">
    <Form :model="formItem"
          label-position="right"
          :label-width="140"
          ref="formItem"
          :rules="ruleComplteForm">
      <FormItem label="年卡名称："
                prop="cardName">
        <Input v-model="formItem.cardName"
               :maxlength="20"
               style="width:33%"
               placeholder="请输入年卡别名"></Input>
      </FormItem>
      <FormItem label="线下产品编码："
                prop="nextProductCode">
        <Input v-model="formItem.nextProductCode"
               :maxlength="20"
               style="width:33%"
               placeholder="请输入线下产品编码"></Input>
      </FormItem>
      <!-- <FormItem label="交易类型：" prop="tradeType">
        <Select v-model="formItem.tradeType" style="width:200px">
          <Option v-for="(item,index) in list1" :key="index" :value="item.key">{{item.value}}</Option>
        </Select>
      </FormItem>-->
      <!-- <FormItem label="开通录入信息：" prop="distType">
        {{social}}
        <CheckboxGroup class="information-list" v-model="social">
          <div>
            <Checkbox label="name">
              <span>姓名{{isName}}</span>
            </Checkbox>
            <RadioGroup v-model="isName">
              <Radio label="T">
                <span>必填</span>
              </Radio>
              <Radio label="F">
                <span>选填</span>
              </Radio>
            </RadioGroup>
          </div>
          <div>
            <Checkbox label="tel">
              <span>手机号{{isTel}}</span>
            </Checkbox>
            <RadioGroup v-model="isTel">
              <Radio label="T">
                <span>必填</span>
              </Radio>
              <Radio label="F">
                <span>选填</span>
              </Radio>
            </RadioGroup>
          </div>
          <div>
            <Checkbox label="email">
              <span>邮箱{{isEmail}}</span>
            </Checkbox>
            <RadioGroup v-model="isEmail">
              <Radio label="T">
                <span>必填</span>
              </Radio>
              <Radio label="F">
                <span>选填</span>
              </Radio>
            </RadioGroup>
          </div>
          <div>
            <Checkbox label="img">
              <span>照片{{isImg}}</span>
            </Checkbox>
            <RadioGroup v-model="isImg">
              <Radio label="T">
                <span>必填</span>
              </Radio>
              <Radio label="F">
                <span>选填</span>
              </Radio>
            </RadioGroup>
          </div>
          <div>
            <Checkbox label="address">
              <span>家庭地址{{isAddress}}</span>
            </Checkbox>
            <RadioGroup v-model="isAddress">
              <Radio label="T">
                <span>必填</span>
              </Radio>
              <Radio label="F">
                <span>选填</span>
              </Radio>
            </RadioGroup>
          </div>
          <div>
            <Checkbox label="card">
              <span>身份证{{isCard}}</span>
            </Checkbox>
            <RadioGroup v-model="isCard">
              <Radio label="T">
                <span>必填</span>
              </Radio>
              <Radio label="F">
                <span>选填</span>
              </Radio>
            </RadioGroup>
          </div>
          <div>
            <Checkbox label="city">
              <span>市民卡{{isCity}}</span>
            </Checkbox>
            <RadioGroup v-model="isCity">
              <Radio label="T">
                <span>必填</span>
              </Radio>
              <Radio label="F">
                <span>选填</span>
              </Radio>
            </RadioGroup>
          </div>
        </CheckboxGroup>
      </FormItem>-->
      <!-- <FormItem label="是否选择卡类型：" prop="cardTypeChoice">
        <RadioGroup @on-change="radioChange" v-model="formItem.cardTypeChoice">
          <Radio label="T">
            <span>是</span>
          </Radio>
          <Radio label="F">
            <span>否</span>
          </Radio>
        </RadioGroup>
      </FormItem>-->
      <!-- <FormItem label="年卡介质类型：" prop="cardType" v-if="formItem.cardTypeChoice=='T'">
        <Select v-model="selectList" multiple @on-change="selectChange" style="width:260px">
          <Option v-for="item in list2" :value="item.key" :key="item.value">{{ item.value }}</Option>
        </Select>
      </FormItem>-->
      <FormItem label="年卡LOGO："
                prop="cardLogo">
        <my-img :limitNum="1"
                :uploadList="singleImgList"
                @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="年卡封面图："
                prop="cardCover">
        <my-img :limitNum="1"
                :uploadList="wapImgList"
                @getImgUrl="setWapListUrl"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="咨询电话："
                prop="consultPhone">
        <Input v-model="formItem.consultPhone"
               :maxlength="20"
               style="width:33%"
               placeholder="请输入咨询电话"></Input>
      </FormItem>
      <FormItem label="上下年分隔日期："
                prop="halfYearSplitDate">
        <!-- <Input
          v-model="formItem.consultPhone"
          :maxlength="20"
          style="width:33%"
          placeholder="请输入咨询电话"
        ></Input>-->
        <!-- {{formItem.halfYearSplitDate}} -->
        <DatePicker type="date"
                    @on-change="halfYearSplitDateChange"
                    :value="formItem.halfYearSplitDate"
                    placeholder="请选择分隔日期"
                    format="MM-dd"
                    style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="售价："
                prop="cardPrice">
        <Input style="width:100px"
               v-model="formItem.cardPrice"></Input>
        <span style="margin-left:5px">元</span>
      </FormItem>
      <FormItem label="全年开卡金额："
                prop="fullYearOpenCardPrice">
        <Input v-model="formItem.fullYearOpenCardPrice"
               :maxlength="20"
               style="width:200px"
               placeholder="请输入全年开卡金额"></Input>
        <span style="margin-left:5px">元</span>
      </FormItem>
      <FormItem label="下半年开卡金额："
                prop="halfYearOpenCardPrice">
        <Input v-model="formItem.halfYearOpenCardPrice"
               :maxlength="20"
               style="width:200px"
               placeholder="请输入下半年开卡金额"></Input>
        <span style="margin-left:5px">元</span>
      </FormItem>
      <FormItem label="全年充值金额："
                prop="fullYearPrice">
        <Input v-model="formItem.fullYearPrice"
               :maxlength="20"
               style="width:200px"
               placeholder="请输入全年充值金额"></Input>
        <span style="margin-left:5px">元</span>
      </FormItem>
      <FormItem label="下半年充值金额："
                prop="halfYearPrice">
        <Input v-model="formItem.halfYearPrice"
               :maxlength="20"
               style="width:200px"
               placeholder="请输入下半年充值金额"></Input>
        <span style="margin-left:5px">元</span>
      </FormItem>
      <FormItem label="最小年龄："
                prop="minAge">
        <numSpinner v-model="formItem.minAge"
                    :min="0"
                    :max="150"></numSpinner>
      </FormItem>
      <FormItem label="最大年龄："
                prop="maxAge">
        <numSpinner v-model="formItem.maxAge"
                    :min="0"
                    :max="150"></numSpinner>
      </FormItem>
      <FormItem label="首页-使用期限：">
        <Input type="textarea"
               v-model="formItem.useDateLimit"
               :rows="4"
               :maxlength="500"
               placeholder="请输入使用期限"></Input>
      </FormItem>
      <FormItem label="首页-办理费用：">
        <Input type="textarea"
               v-model="formItem.handleCost"
               :rows="4"
               :maxlength="500"
               placeholder="请输入办理费用"></Input>
      </FormItem>
      <FormItem label="工作时间：">
        <Input v-model="formItem.workTimes"
               :maxlength="20"
               style="width:33%"
               placeholder="请输入工作时间"></Input>
      </FormItem>
      <!-- <FormItem label="使用说明：">
        <Input
          type="textarea"
          v-model="formItem.useContent"
          :rows="4"
          :maxlength="500"
          placeholder="请输入使用说明"
        ></Input>
      </FormItem>-->
      <FormItem label="业务办理-温馨提醒：">
        <Input type="textarea"
               v-model="formItem.warmPrompt"
               :rows="4"
               :maxlength="500"
               placeholder="请输入温馨提醒"></Input>
      </FormItem>
      <!-- <FormItem label="开卡充值说明：">
        <Input
          type="textarea"
          v-model="formItem.rechargeNotice"
          :rows="4"
          :maxlength="500"
          placeholder="请输入充值说明"
        ></Input>
      </FormItem>-->
      <FormItem label="个人信息\年卡详情-使用须知：">
        <Input type="textarea"
               v-model="formItem.useNotice"
               :rows="4"
               :maxlength="500"
               placeholder="请输入使用须知"></Input>
      </FormItem>
      <FormItem label="首页-使用范围：">
        <Input type="textarea"
               v-model="formItem.useScope"
               :rows="4"
               :maxlength="500"
               placeholder="请输入使用范围"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit">保存</Button>
        <Button type="ghost"
                @click="back"
                style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
    <Modal width="900"
           v-model="model"
           title="选择景区"
           :loading="loading">
      <div style="margin-bottom:10px">
        <Input v-model="keyword"
               placeholder="请输入对应景点关键字"
               style="width: 300px"></Input>
        <Button @click="selectSenicList"
                type="primary">搜索</Button>
        <span style="color:red">备注：输入景点名称关键字搜索，若有缺失景点，请联系运营【手机号：13606515045】</span>
      </div>
      <div>
        <Table border
               :columns="columns7"
               :data="data6"></Table>
      </div>
      <div style="margin-top:10px">
        <Page @on-change="changePage"
              :total="total"
              size="small"
              show-elevator
              show-sizer></Page>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import ueditor from '@/components/global/ueditor'
import myImg from '@/components/global/singleImg'
import numSpinner from '@/components/global/numSpinner'
export default {
  mounted () {
    if (this.$route.query && this.$route.query.id) {
      this.apiGet(
        '/marketing/api/yearCardTob/selectById?id=' + this.$route.query.id
      ).then(res => {
        this.selectList = res.data.cardTypeList
        //   {
        //   id: "",
        //   cardName: "",
        //   nextProductCode: "",
        //   cardPrice: "",
        //   tradeType: "",
        //   cardLogo: "",
        //   cardCover: "",
        //   useContent: "",
        //   cardTypeChoice: "T",
        //   warmPrompt:'',
        //   rechargeNotice:'',
        //   useScope:'',
        //   useNotice:'',
        //   consultPhone:'',
        //   workTimes:'',
        //   fullYearOpenCardPrice:'',
        //   halfYearOpenCardPrice:'',
        //   fullYearPrice:'',
        //   halfYearPrice:''
        // }
        let data = res.data
        this.formItem.id = data.id
        this.formItem.cardName = data.cardName
        this.formItem.nextProductCode = data.nextProductCode
        this.formItem.cardPrice = data.cardPrice
        // this.formItem.tradeType = data.tradeType;
        this.formItem.cardLogo = data.cardLogo
        this.formItem.cardCover = data.cardCover
        // this.formItem.useContent = data.useContent;
        // this.formItem.cardTypeChoice = data.cardTypeChoice;
        this.formItem.warmPrompt = data.warmPrompt
        // this.formItem.rechargeNotice = data.rechargeNotice;
        this.formItem.useScope = data.useScope
        this.formItem.useNotice = data.useNotice
        this.formItem.consultPhone = data.consultPhone
        this.formItem.workTimes = data.workTimes
        this.formItem.fullYearOpenCardPrice = data.fullYearOpenCardPrice + ''
        this.formItem.halfYearOpenCardPrice = data.halfYearOpenCardPrice + ''
        this.formItem.fullYearPrice = data.fullYearPrice + ''
        this.formItem.halfYearPrice = data.halfYearPrice + ''
        this.formItem.useDateLimit = data.useDateLimit ? data.useDateLimit : ''
        this.formItem.handleCost = data.handleCost ? data.handleCost : ''
        this.formItem.halfYearSplitDate = data.halfYearSplitDate
          ? data.halfYearSplitDate
          : ''
        this.formItem.minAge = data.minAge
        this.formItem.maxAge = data.maxAge
        this.singleImgList.push(res.data.cardLogo)
        this.wapImgList.push(res.data.cardCover)
      })
    }

    this.apiGet('/admin/api/sysParam/getSysParamByKey?key=cardTradeType').then(
      res => {
        this.list1 = this.formArr(res.message)
      }
    )
    this.apiGet('/admin/api/sysParam/getSysParamByKey?key=cardMediumType').then(
      res => {
        this.list2 = this.formArr(res.message)
      }
    )
  },
  data () {
    const validateNum = (rule, value, callback) => {
      if (value > 99999) {
        callback(new Error('数值不能大于99999'))
      } else if (value <= 0) {
        callback(new Error('最小值大于0'))
      } else {
        callback()
      }
    }
    return {
      selectList: [],
      list1: [],
      list2: [],
      mediumTypeList: [
        {
          value: '122',
          label: '身份证'
        }
      ],
      phone: 'apple',
      test: 'apple',
      isName: 'T',
      isTel: 'T',
      isEmail: 'T',
      isImg: 'T',
      isAddress: 'T',
      isCity: 'T',
      isCard: 'T',
      singleImgList: [],
      wapImgList: [],
      page: 1,
      senicInfo: {
        lon: '',
        lat: ''
      },
      senicAddress: '',
      total: 0,
      keyword: '',
      columns7: [
        {
          title: '序号',
          key: 'name',
          render: (h, params) => {
            return h('div', params.index + 1)
          }
        },
        {
          title: '景区名称',
          key: 'scenicName'
        },
        {
          title: '景区地址',
          key: 'areaName'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // 判断是否已经发布过的
                      this.checkSenicName(params.row.spotsName).then(res => {
                        if (res.success) {
                          this.formItem.name = params.row.scenicName
                          this.formItem.zybParkId = params.row.id
                          this.formItem.parkLevel = params.row.rank
                          this.formItem.areaAddr = params.row.areaName
                          this.formItem.addr = params.row.address
                          this.formItem.belongTo = params.row.spotsName
                          this.formItem.latitudeLongitude =
                            params.row.lon && params.row.lat
                              ? params.row.lon + ',' + params.row.lat
                              : ''
                          this.formItem.tralveBase = '暂无'
                          this.senicInfo = params.row
                          this.model = false
                        } else {
                          this.$Message.warning(
                            params.row.spotsName + '已发布过!'
                          )
                        }
                      })
                    }
                  }
                },
                '选择'
              )
            ])
          }
        }
      ],
      data6: [],
      model: false,
      loading: true,
      limitType: 'any',
      isSelect: 'F',
      tableList: [
        {
          week: [],
          startTime: '',
          endTime: '',
          costPrice: 0,
          rackPrice: 0,
          retailPrice: 0,
          supplyPrice: 0
        }
      ],
      social: [],
      type: '',
      distributionWay: '0',
      lmitList: [
        {
          value: 'all',
          label: '无限制'
        }
      ],
      list: [
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
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      formItem: {
        id: '',
        cardName: '',
        nextProductCode: '',
        cardPrice: '',
        // tradeType: "",
        cardLogo: '',
        cardCover: '',
        // useContent: "",
        // cardTypeChoice: "T",
        warmPrompt: '',
        // rechargeNotice: "",
        useScope: '',
        useNotice: '',
        consultPhone: '',
        workTimes: '',
        fullYearOpenCardPrice: '',
        halfYearOpenCardPrice: '',
        fullYearPrice: '',
        halfYearPrice: '',
        useDateLimit: '',
        handleCost: '',
        halfYearSplitDate: '',
        minAge: '',
        maxAge: ''
      },
      ruleComplteForm: {
        // 卡名称
        cardName: [
          { required: true, message: '请填写年卡名称', trigger: 'blur' }
        ],
        // 上下年分隔日期
        halfYearSplitDate: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        // 线下产品编码
        nextProductCode: [
          { required: true, message: '请填写线下产品编码', trigger: 'blur' }
        ],
        // cardTypeChoice: [
        //   { required: true, message: "请选择是否选择卡类型", trigger: "change" }
        // ],
        // 年卡介质类型
        // cardType: [
        //   { required: true, message: "请选择年卡介质类型", trigger: "change" }
        // ],
        // 年卡价格
        cardPrice: [
          { required: true, message: '请填写年卡价格' },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum
            // message: "数值不能大于99999"
          }
        ],
        // //交易类型
        // tradeType: [
        //   { required: true, message: "请选择交易类型", trigger: "change" }
        // ],
        // 年卡logo
        cardLogo: [{ required: true, message: '请上传年卡logo' }],
        // 年卡封面图
        cardCover: [{ required: true, message: '请上传年卡封面图' }],
        // 使用说明
        // useContent: [
        //   { required: true, message: "请填写使用说明", trigger: "blur" }
        // ],
        // 温馨提醒
        // warmPrompt: [
        //   { required: true, message: "请填写温馨提醒", trigger: "blur" }
        // ],
        // 开卡充值说明
        // rechargeNotice: [
        //   { required: true, message: "请填写开卡充值说明", trigger: "blur" }
        // ],
        // 使用范围
        // useScope: [
        //   { required: true, message: "请填写使用范围", trigger: "blur" }
        // ],
        // 使用须知
        // useNotice: [
        //   { required: true, message: "请填写使用须知", trigger: "blur" }
        // ],
        // 使用期限
        // useDateLimit: [
        //   { required: true, message: "请填写使用期限", trigger: "blur" }
        // ],
        // 办理费用
        // handleCost: [
        //   { required: true, message: "请填写办理费用", trigger: "blur" }
        // ],
        // 咨询电话
        consultPhone: [
          { required: true, message: '请填写咨询电话', trigger: 'blur' },
          {
            pattern: /(^1([0-9]{10})$)|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/,
            message: '数据格式不正确'
          }
        ],
        // 工作时间
        // workTimes: [
        //   { required: true, message: "请填写工作时间", trigger: "blur" }
        // ],
        // 全年开卡金额
        fullYearOpenCardPrice: [
          { required: true, message: '请填写全年开卡金额', trigger: 'blur' },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum
          }
        ],
        // 下半年开卡金额
        halfYearOpenCardPrice: [
          { required: true, message: '请填写下半年开卡金额', trigger: 'blur' },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum
          }
        ],
        // 全年充值金额
        fullYearPrice: [
          { required: true, message: '请填写全年充值金额', trigger: 'blur' },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum
          }
        ],
        // 下半年充值金额
        halfYearPrice: [
          { required: true, message: '请填写下半年充值金额', trigger: 'blur' },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: '数据格式不正确'
          },
          {
            validator: validateNum
          }
        ]
      }
    }
  },
  watch: {
    'formItem.sellType': 'handle'
  },
  methods: {
    halfYearSplitDateChange (date) {
      // console.log(date)
      this.formItem.halfYearSplitDate = date
    },
    radioChange (val) {
      // console.log(val)
      if (val == 'F') {
        this.selectList = []
      }
    },
    back () {
      this.$router.back()
    },
    // selectChange(arr) {
    //   // console.log(e)
    //   this.selectList = arr;
    //   this.formItem.cardType = arr.join(",");
    // },
    formArr (str) {
      let objArr = []
      let arr = str.split(',')
      // console.log(arr);
      arr.forEach((item, index) => {
        let optArr = item.split(':')
        let obj = {}
        obj.key = optArr[0]
        obj.value = optArr[1]
        // obj[optArr[0]] = optArr[1];
        objArr.push(obj)
      })
      return objArr
    },
    testScroll () {
      document.querySelector('.ivu-layout').scrollTop = 500
    },
    handleScroll () {
      var offsetTop = document.querySelector('#base').offsetTop
    },
    // test() {
    //   // this.$router.push("/publishParkTicket");
    // },
    setWapUrl (imgArr) {
      this.formItem.cardLogo = imgArr[0]
      this.$refs.formItem.validateField('cardLogo')
    },
    setWapListUrl (imgArr) {
      this.formItem.cardCover = imgArr[0]
      this.$refs.formItem.validateField('cardCover')
    },
    async checkSenicName (postName) {
      // 检测是否发不过
      return this.apiGet(
        '/product/parkPublish/selectParkInfoByName?spotsName=' + postName
      )
    },
    setLngAndLat (point) {
      this.formItem.latitudeLongitude = point.lng + ',' + point.lat
    },
    getAdressLng () {
      this.$refs.bdMap.showModal()
    },
    changePage (page) {
      this.page = page
      this.selectSenicList()
    },
    change (arr) {
      this.optArr = []
      arr.forEach((item, index) => {
        let opt = this.cityList.find((el, i) => {
          return item == el.value
        })
        this.optArr.push(opt)
      })
    },
    selectSenicList () {
      this.apiPost('/product/parkPublish/grid', {
        page: this.page,
        limit: 10,
        sort: 'createTime',
        order: 'desc',
        name: this.keyword
      }).then(res => {
        this.data6 = res.rows
        this.total = res.total
      })
    },
    senicSelect () {
      this.model = true
    },
    handle () {
      // 用于初始化第一个tr
      this.tableList.splice(0, this.tableList.length, {
        week: [],
        startTime: '',
        endTime: '',
        costPrice: 0,
        rackPrice: 0,
        retailPrice: 0,
        supplyPrice: 0
      })
    },
    submit () {
      let falg = true
      let _this = this
      this.formItem.nextProductCode = this.formItem.nextProductCode.trim()
      let url = '/marketing/api/yearCardTob/saveCard'
      // this.common.formPost(this, {
      //   url,
      //   params: this.formItem,
      //   mold: "page",
      //   callback(res) {
      //     if (res.status == 200) {
      //       _this.$Message.success("保存成功!");
      //       _this.$router.back();
      //       // _this.$router.push("/publishParkTicket");
      //     }
      //   }
      // });
      if (falg) {
        falg = false
        this.$refs.formItem.validate(async valid => {
          if (valid) {
            this.apiPost(url, this.formItem).then(res => {
              if (res.status == 200) {
                falg = true
                _this.$Message.success('保存成功!')
                _this.$router.back()
              } else {
                _this.$Message.warning(res.message)
              }
            })
          } else {
            // 滚动制定高度
            // this.scrollError()
            this.$nextTick(() => {
              $('#content').scrollTop(
                $('.ivu-form-item-error').offset().top -
                90 +
                $('#content').scrollTop()
              )
              falg = true
            })
          }
        })
      }
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
    }
  },
  components: {
    ueditor,
    myImg,
    numSpinner
  }
}
</script>
<style scope lang="scss">
.card-add-edit {
  .information-list {
    .information-item {
      display: block;
    }
  }
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
td.time {
  width: 330px;
}
.add-icon {
  cursor: pointer;
  color: green;
  font-size: 28px;
}
.delete-icon {
  cursor: pointer;
  color: red;
  font-size: 28px;
}
.center-td {
  text-align: center;
}
.step-list {
  padding-top: 20px;
  display: inline-block;
  margin: 0 auto;
}

.step-list .step-item {
  display: inline-block;
  width: 160px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.step-list .step-item .line-img {
  position: absolute;
  top: 10px;
  left: 92px;
}

.step-list .step-item .line-img.line-nodo-img {
  top: 3px;
  width: 157px;
  left: 84px;
}

.step-list .step-item .step-title {
  margin-top: 10px;
  color: #19a2fe;
}

.step-list .step-item .step-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.step-list .step-item .step-nodo {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 9px;
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
</style>
