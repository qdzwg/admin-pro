<template>
  <div>
    <div class="step">
      <Steps :current="1">
        <Step title="产品类型"></Step>
        <Step title="景区信息"></Step>
        <Step title="门票信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div id="base" class="form-title">基本信息</div>
      <the-form-item></the-form-item>
      <FormItem label="景点选择：" v-if="!isNameText">
        <Button @click="senicSelect" type="primary">景点选择</Button>
        <div>
          <div class="senicInfo" v-if="formItem.name">
            <div class="name">{{ formItem.name }}</div>
            <div class="address">{{ formItem.areaAddr }}</div>
          </div>
        </div>
      </FormItem>
      <FormItem
        label="景区名称："
        v-if="isNameText"
        :rules="{
          required: true,
          message: '请输入景区名称',
          trigger: 'change'
        }"
        prop="name"
      >
        <Input v-model="formItem.name" style="width:33%;"></Input>
      </FormItem>
      <FormItem
        label="景区别名："
        :rules="{
          required: true,
          message: '请填写景区别名',
          trigger: 'change'
        }"
        prop="nickName"
      >
        <Input
          v-model="formItem.nickName"
          style="width:33%"
          placeholder="请输入景点别名"
        ></Input>
      </FormItem>
      <FormItem
        label="所属城市："
        prop="cityId"
        v-if="songCityId.show"
        :rules="{ required: true, message: '请选择所属城市' }"
      >
        <Select v-model="formItem.cityId" style="width:200px">
          <Option
            :value="item.cityId"
            v-for="item in cityList"
            :key="item.cityId"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem
        label="景点等级："
        :rules="{
          required: true,
          message: '请选择景点等级',
          trigger: 'change'
        }"
        prop="parkLevel"
      >
        <Select v-model="formItem.parkLevel" style="width:200px">
          <Option
            :value="item.value"
            v-for="item in rankList"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="下单类型：" v-if="songOrderType && songOrderType.show">
        <Select v-model="formItem.orderType" style="width:200px">
          <Option value="1">多票型</Option>
          <Option value="2">单票型</Option>
        </Select>
      </FormItem>
      <FormItem
        label="景区地址："
        v-if="songAreaAddr && songAreaAddr.fieldType != 'select'"
      >
        {{ formItem.areaAddr }}
      </FormItem>
      <FormItem
        label="景区地址："
        style="width:33%;"
        v-if="songAreaAddr && songAreaAddr.fieldType == 'select'"
      >
        <area-select
          :areaCode="formItem.areaCode"
          @getAll="setAreaInfo"
        ></area-select>
      </FormItem>
      <FormItem
        label="详细地址："
        :rules="{
          required: true,
          message: '请填写详细地址',
          trigger: 'change'
        }"
        prop="addr"
      >
        <Input v-model="formItem.addr" style="width:33%;"></Input>
      </FormItem>
      <FormItem
        label="地图坐标："
        :rules="{
          required: true,
          message: '请选择地图坐标',
          trigger: 'change'
        }"
        prop="latitudeLongitude"
      >
        <Input
          v-model="formItem.latitudeLongitude"
          placeholder=""
          readonly
          style="width:33%;"
        ></Input>
        <Button @click="getAdressLng" type="primary">获取坐标</Button>
      </FormItem>
      <FormItem label="所属景区：" v-if="songBelongTo && songBelongTo.show">
        {{ formItem.belongTo }}
      </FormItem>
      <FormItem
        label="旅游主题："
        v-show="songExtendsParam4 && songExtendsParam4.show"
        prop="lineTheme"
      >
        <div style="height:32px;" class="travellSubject">
          <div class="subject-list">
            <div
              v-for="(item, index) in tagNameList"
              :key="index"
              class="subject-list-item"
            >
              <Icon
                @click="subjectItemDel(index)"
                class="subject-list-item-del"
                type="close-circled"
              ></Icon>
              <Button>{{ item }}</Button>
            </div>
          </div>
          <div class="subject-input">
            <Input
              @on-enter="setSubjectTag"
              :maxlength="4"
              v-model="tagName"
              placeholder="回车添加标签，如“跟团游”"
              style="width: 200px"
            ></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left">
            输入后，回车添加
          </div>
        </div>
        <Input v-model="formItem.extendsParam4" style="display:none"></Input>
      </FormItem>
      <FormItem
        label="旅游主题："
        v-show="songTralveBase && songTralveBase.show"
      >
        {{ formItem.tralveBase }}
      </FormItem>
      <div id="senicInfo" class="form-title">景点信息</div>
      <FormItem
        label="景点类型："
        v-if="songChannel && songChannel.show"
        :rules="{
          required: true,
          message: '请选择景点类型',
          trigger: 'change'
        }"
        prop="channel"
      >
        <Select v-model="formItem.channel" style="width:200px">
          <Option value="-1">商城自建-自核销</Option>
          <Option value="0">商城自建-线下系统</Option>
          <Option value="1">智游宝拉取</Option>
        </Select>
        <span style="color:red; margin-left:5px;"
          >备注：智游宝拉取 主要用于拉取智游宝产品</span
        >
      </FormItem>
      <FormItem
        label="是否推送云票务："
        v-if="formItem.channel == '-1' && songIsSyncYpw && songIsSyncYpw.show"
        :rules="{
          required: true,
          message: '请选择是否推送云票务',
          trigger: 'change'
        }"
        prop="isSyncYpw"
      >
        <Select v-model="formItem.isSyncYpw" style="width:200px">
          <Option value="F">否</Option>
          <Option value="T">是</Option>
        </Select>
      </FormItem>
      <FormItem
        label="发码类型："
        v-if="formItem.channel == '1' && songOneCode && songOneCode.show"
      >
        <Select v-model="formItem.oneCode" style="width:200px">
          <Option value="F">一单一码</Option>
          <Option value="T">一票一码</Option>
        </Select>
        <p style="color:red; margin-left:5px;">
          备注：<br />
          1.设为一单一码，同一批次支付的订单智游宝发一个码一条短信，智游宝生成一个订单；设为一票一码，同一批次支付的订单智游宝按票型发码和短信，智游宝生成多个订单<br />
          2.分销市场旅行社下单仅一单一码
        </p>
      </FormItem>
      <FormItem label="开园时间：" 
        :rules="{
            required: true,
            message: '请填写开始时间',
            trigger: 'blur'
          }" prop="openTime">
        <Input v-model="formItem.openTime" style="width:33%;"></Input>
      </FormItem>
      <!-- <FormItem label="开园时间：" required>
        <FormItem
          style="width:120px;display:inline-block"
          :rules="{
            required: true,
            message: '请填写开始时间',
            trigger: 'change'
          }"
          prop="openTime"
        >
          <TimePicker
            v-model="formItem.openTime"
            format="HH:mm"
            placeholder="开始时间"
            style="width: 112px"
          ></TimePicker>
        </FormItem>
        <span>-</span>
        <FormItem
          style="width:120px;display:inline-block"
          :rules="{
            required: true,
            message: '请填写结束时间',
            trigger: 'change'
          }"
          prop="endTime"
        >
          <TimePicker
            v-model="formItem.endTime"
            format="HH:mm"
            placeholder="结束时间"
            style="width: 112px"
          ></TimePicker>
        </FormItem>
      </FormItem> -->
      <FormItem label="景点描述：" v-if="songSummary && songSummary.show">
        <Input
          type="textarea"
          v-model="formItem.summary"
          :rows="4"
          placeholder="请输入景点描述"
        ></Input>
      </FormItem>
      <FormItem
        label="景点介绍："
        :rules="{
          required: true,
          message: '请填写景点介绍',
          trigger: 'change'
        }"
        prop="content"
      >
        <ueditor v-model="formItem.content"></ueditor>
      </FormItem>
      <FormItem
        label="缩略图："
        :rules="{ required: true, message: '请上传缩略图', trigger: 'change' }"
        prop="linkMobileImg"
      >
        <my-img :limitNum="1" v-model="formItem.linkMobileImg"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图：">
        <my-img :limitNum="5" v-model="formItem.wapUrl"></my-img>
        <p>最多上传5张，建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem
        label="详情页视频："
        v-if="songExtendsParam3 && songExtendsParam3.show"
      >
        <my-video v-model="formItem.extendsParam3"></my-video>
      </FormItem>
      <div id="distSet" class="form-title">分销设置</div>
      <FormItem
        label="分销渠道："
        v-if="songDistType && songDistType.show"
        :rules="{
          required: true,
          message: '请选择分销渠道',
          trigger: 'change'
        }"
        prop="distType"
      >
        <Select
          v-model="formItem.distType"
          @on-change="changeDist"
          style="width:200px"
        >
          <Option value="0">分销市场+店铺</Option>
          <Option value="1">仅分销市场</Option>
          <Option value="2">仅店铺</Option>
        </Select>
      </FormItem>
      <template v-if="formItem.distType != '1'">
        <!-- <FormItem label="景点别名："
                  v-if="songNickName&&songNickName.show"
                  :rules="{ required: true, message: '请填写景点别名', trigger: 'change' }"
                  prop="nickName">
          <Input v-model="formItem.nickName"
                 style="width:33%"
                 placeholder="请输入景点别名"></Input>
        </FormItem> -->
        <FormItem
          label="景点副标题："
          v-if="songSubTitle && songSubTitle.show"
          :rules="{
            required: true,
            message: '请填写景点副标题',
            trigger: 'change'
          }"
          prop="subTitle"
        >
          <Input
            v-model="formItem.subTitle"
            style="width:33%"
            placeholder="请输入景点副标题"
          ></Input>
        </FormItem>
        <FormItem
          label="店铺展示起价："
          v-if="songPriceShow && songPriceShow.show"
          prop="priceShow"
          :rules="[
            {
              required: true,
              type: 'number',
              message: '请填写店铺展示起价',
              trigger: 'change'
            },
            { validator: this.common.validate.floatNumber, trigger: 'change' }
          ]"
        >
          <InputNumber
            :max="100000"
            :min="0"
            v-model="formItem.priceShow"
          ></InputNumber
          >元
        </FormItem>
        <FormItem
          label="店铺虚拟销量："
          v-if="songVirtualSale && songVirtualSale.show"
          prop="virtualSale"
          :rules="[
            {
              required: true,
              type: 'number',
              message: '请填写店铺虚拟销量',
              trigger: 'change'
            },
            { validator: this.common.validate.integer, trigger: 'change' }
          ]"
        >
          <InputNumber
            :max="100000"
            :min="0"
            v-model="formItem.virtualSale"
          ></InputNumber>
        </FormItem>
      </template>
      <FormItem
        label="分销展示价："
        v-if="formItem.distType != '2' || (songPriceDist && songPriceDist.show)"
        prop="priceDist"
        :rules="[
          {
            required: true,
            type: 'number',
            message: '请填写分销展示价',
            trigger: 'change'
          },
          { validator: this.common.validate.floatNumber, trigger: 'change' }
        ]"
      >
        <InputNumber
          :max="100000"
          :min="0"
          v-model="formItem.priceDist"
        ></InputNumber
        >元
      </FormItem>
      <FormItem
        label="预订须知："
        v-if="
          formItem.distType != '1' || (songOrderNotice && songOrderNotice.show)
        "
        :rules="{
          required: true,
          message: '请填写预定须知',
          trigger: 'change'
        }"
        prop="orderNotice"
      >
        <ueditor v-model="formItem.orderNotice"></ueditor>
      </FormItem>
      <FormItem
        label="售后政策："
        v-if="songExtendsParam2 && songExtendsParam2.show"
        :rules="{
          required: true,
          message: '请填写售后政策',
          trigger: 'change'
        }"
        prop="extendsParam2"
      >
        <ueditor v-model="formItem.extendsParam2"></ueditor>
      </FormItem>
      <template v-if="formItem.distType != '2'">
        <FormItem
          label="分销政策："
          v-if="songDistPolicy && songDistPolicy.show"
          :rules="{
            required: true,
            message: '请填写分销政策',
            trigger: 'change'
          }"
          prop="distPolicy"
        >
          <ueditor v-model="formItem.distPolicy"></ueditor>
        </FormItem>
        <FormItem
          label="售后政策："
          :rules="{
            required: true,
            message: '请填写售后政策',
            trigger: 'change'
          }"
          prop="salePolicy"
        >
          <ueditor v-model="formItem.salePolicy"></ueditor>
        </FormItem>
        <FormItem
          label="分销区域限制："
          v-if="songDistAreaType && songDistAreaType.show"
          prop="distAreaType"
        >
          <Select v-model="formItem.distAreaType" style="width:200px">
            <Option value="all">无限制</Option>
          </Select>
        </FormItem>
      </template>
      <FormItem>
        <Button type="primary" @click="submit">保存,下一步</Button>
        <Button type="ghost" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
    <!-- 景区列表 -->
    <the-modal width="900" v-model="model" noFooter title="选择景区">
      <page-template
        :search-items="searchItems"
        :columns="columns7"
        :btn-params="pageBtnParams"
        pageFlag
        :url="url"
        ref="pageWrap"
      >
        <p slot="remark" style="color:red;margin-top:-15px;">
          备注：输入景点名称关键字搜索，若有缺失景点，请联系运营【手机号：13606515045】
        </p>
      </page-template>
    </the-modal>
    <amap
      @getPoint="setPoint"
      :mark="formItem.latitudeLongitude"
      ref="address"
    ></amap>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="handleScroll('base')"
            >基本信息</a
          >
        </li>
        <li>
          <a
            href="javascript:;"
            class="tartg-a"
            @click="handleScroll('senicInfo')"
            >景点信息</a
          >
        </li>
        <li>
          <a
            href="javascript:;"
            class="tartg-a"
            @click="handleScroll('distSet')"
            >分销设置</a
          >
        </li>
        <li>
          <Button size="small" @click="submit" type="primary"
            >保存，下一步</Button
          >
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import theFormItem from "@/components/global/theFormItem";
import ueditor from "@/components/global/vueUEditor";
import myImg from "@/components/global/uploadFile";
import amap from "@/components/global/amap";
import areaSelect from "@/components/global/select";
import myVideo from "@/components/global/video";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      tagName: "",
      cityList: [],
      tagNameList: [],
      url: "product/parkPublish/grid",
      pageBtnParams: [],
      searchItems: [
        {
          label: "请输入对应景点关键字",
          type: "input",
          name: "name"
        }
      ],
      senicInfo: {
        lon: "",
        lat: ""
      },
      rankList: [
        { value: "", label: "请选择" },
        { value: "1", label: "1A" },
        { value: "2", label: "2A" },
        { value: "3", label: "3A" },
        { value: "4", label: "4A" },
        { value: "5", label: "5A" },
        { value: "6", label: "其它" }
      ],
      columns7: [
        {
          title: "序号",
          key: "name",
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "景区名称",
          key: "scenicName"
        },
        {
          title: "景区地址",
          key: "areaName"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      // 判断是否已经发布过的
                      this.checkSenicName(params.row.spotsName).then(res => {
                        if (res.success) {
                          this.formItem.name = params.row.scenicName;
                          this.formItem.zybParkId = params.row.id;
                          this.formItem.parkLevel = params.row.rank;
                          this.formItem.areaAddr = params.row.areaName;
                          this.formItem.addr = params.row.address;
                          this.formItem.belongTo = params.row.spotsName;
                          this.formItem.latitudeLongitude =
                            params.row.lon && params.row.lat
                              ? params.row.lon + "," + params.row.lat
                              : "";
                          this.formItem.tralveBase = "暂无";
                          this.senicInfo = params.row;
                          this.model = false;
                        } else {
                          this.$Message.warning(
                            params.row.spotsName + "已发布过!"
                          );
                        }
                      });
                    }
                  }
                },
                "选择"
              )
            ]);
          }
        }
      ],
      model: false,
      type: "",
      distributionWay: "0",
      lmitList: [
        {
          value: "all",
          label: "无限制"
        }
      ],
      list: [
        {
          value: "0",
          label: "分销市场+店铺"
        },
        {
          value: "1",
          label: "仅分销市场"
        },
        {
          value: "2",
          label: "仅店铺"
        }
      ],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      formItem: {
        cityId: "",
        name: "",
        zybParkId: "",
        parkLevel: "",
        orderType: "",
        areaCode: "",
        areaAddr: "",
        addr: "",
        latitudeLongitude: "",
        belongTo: "",
        tralveBase: "",
        channel: -1,
        isSyncYpw: "F",
        oneCode: "F",
        openTime: "",
        endTime: "",
        summary: "",
        content: "",
        linkMobileImg: "",
        wapUrl: "",
        distType: 2,
        nickName: "",
        subTitle: "",
        priceShow: 1,
        virtualSale: 1,
        priceDist: 1,
        orderNotice: "",
        distPolicy: "",
        salePolicy: "",
        distAreaType: "all",
        extendsParam1: "",
        extendsParam2: "",
        extendsParam3: "",
        extendsParam4: ""
      },
      ruleComplteForm: {
        // name: [
        //   { required: true, message: '请输入景区名称', trigger: 'change' }
        // ],
        // extendsParam1: [
        // //   { required: true, message: '请输入景区别名', trigger: 'change' }
        // // ],
        // parkLevel: [
        //   { required: true, message: '请选择景点等级', trigger: 'change' }
        // ],
        // channel: [
        //   { required: true, message: '请选择景点类型', trigger: 'change' }
        // ],
        // openTime: [
        //   { required: true, message: '请填写开始时间', trigger: 'change' }
        // ],
        // endTime: [
        //   { required: true, message: '请填写结束时间', trigger: 'change' }
        // ],
        // distType: [
        //   { required: true, message: '请选择分销渠道', trigger: 'change' }
        // ],
        // addr: [
        //   { required: true, message: '请填写详细地址', trigger: 'change' }
        // ],
        // latitudeLongitude: [
        //   { required: true, message: '请选择地图坐标', trigger: 'change' }
        // ],
        // nickName: [
        //   { required: true, message: '请填写景点别名', trigger: 'change' }
        // ],
        // subTitle: [
        //   { required: true, message: '请填写景点副标题', trigger: 'change' }
        // ],
        // priceShow: [
        //   { required: true, type: 'number', message: '请填写店铺展示起价', trigger: 'change' },
        //   { validator: this.common.validate.floatNumber, trigger: 'change' }
        // ],
        // virtualSale: [
        //   { required: true, type: 'number', message: '请填写店铺虚拟销量', trigger: 'change' },
        //   { validator: this.common.validate.integer, trigger: 'change' }
        // ],
        // priceDist: [
        //   { required: true, type: 'number', message: '请填写分销展示价', trigger: 'change' },
        //   { validator: this.common.validate.floatNumber, trigger: 'change' }
        // ],
        // isSyncYpw: [
        //   { required: true, message: '请选择是否推送云票务', trigger: 'change' }
        // ],
        // content: [
        //   { required: true, message: '请填写景点介绍', trigger: 'change' }
        // ],
        // wapUrl: [
        //   { required: true, message: '请上传轮播图', trigger: 'blur' }
        // ],
        // linkMobileImg: [
        //   { required: true, message: '请上传缩略图', trigger: 'change' }
        // ],
        // orderNotice: [
        //   { required: true, message: '请填写预定须知', trigger: 'change' }
        // ],
        // distPolicy: [
        //   { required: true, message: '请填写分销政策', trigger: 'change' }
        // ],
        // salePolicy: [
        //   { required: true, message: '请填写售后政策', trigger: 'change' }
        // ]
      }
    };
  },
  computed: {
    ...mapState("scenic", ["diffValue"]),
    ...mapGetters("scenic", [
      "isNameText",
      "songBelongTo",
      "songOrderType",
      "songAreaAddr",
      "songTralveBase",
      "songExtendsParam4",
      "songChannel",
      "songIsSyncYpw",
      "songOneCode",
      "songSummary",
      "songExtendsParam3",
      "songDistType",
      "songSubTitle",
      "songPriceShow",
      "songVirtualSale",
      "songDistPolicy",
      "songExtendsParam2",
      "songDistAreaType",
      "songOrderNotice",
      "songPriceDist",
      "songCityId"
    ])
  },
  watch: {},
  created() {
    this.apiPost("/product/api/park/selectCityInfo").then(res => {
      if (res.status == 200) {
        this.cityList = res.data.map(item => {
          return { cityId: item.id, label: item.cityName };
        });
      }
    });
  },
  async mounted() {
    let info = await this.getDiffInfo();
    let res = await this.apiGet("/product/parkPublish/publishParkFL");

    if (res.success && res.data.parkInfoDto) {
      this.formItem = res.data.parkInfoDto;
    }
    let params = {
      ...this.diffValue,
      ...this.formItem
    };
    this.tagNameList = this.formItem.extendsParam4
      ? this.formItem.extendsParam4.split(",")
      : [];
    this.formItem = params;
  },
  methods: {
    ...mapActions("scenic", ["getDiffInfo"]),
    handleScroll(str) {
      let offsetTop = document.getElementById(str).offsetTop;
      let content = document.getElementById("content");
      content.scrollTop = offsetTop - 60;
    },

    async checkSenicName(postName) {
      // 检测是否发不过
      return this.apiGet(
        "product/parkPublish/selectParkInfoByName?spotsName=" + postName
      );
    },
    setAreaInfo(data) {
      let areaAddr = "";
      let areaCode = "";
      data.forEach(item => {
        areaAddr += item.name + "-";
        areaCode += item.code + "-";
      });
      this.formItem.areaAddr = areaAddr.slice(0, -1);
      this.formItem.areaCode = areaCode.slice(0, -1);
    },
    // setLngAndLat (point) {
    //   this.formItem.latitudeLongitude = point.lng + ',' + point.lat
    // },
    changeDist(value) {
      // console.log(this.$refs.formItem)
      // let fieldsList = this.$refs.formItem.fields
      // fieldsList.forEach(fields => {
      //   fields.resetField()
      // });
      // this.formItem.distType = value
    },
    getAdressLng() {
      //   this.$refs.bdMap.showModal();
      this.$refs.address.showModal();
    },
    setPoint(point) {
      this.formItem.latitudeLongitude = point.lng + "," + point.lat;
    },
    getModal() {
      this.$refs.address.showModal();
    },
    senicSelect() {
      this.$refs.pageWrap.getTableList();
      this.model = true;
    },
    //添加主题
    setSubjectTag() {
      if (this.tagNameList && this.tagNameList.length < 5) {
        let isrepeat = this.tagNameList.some(item => {
          return item == this.tagName;
        });
        if (isrepeat) {
          this.$Message.warning("主题名字重复");
          return;
        }
        if (this.tagName) {
          this.tagNameList.push(this.tagName);
          this.formItem.extendsParam4 = this.tagNameList.join(",");
          this.tagName = "";
        } else {
          this.$Message.warning("请输入标签名！");
        }
      } else {
        this.$Message.warning("最多添加五个标签！");
      }
    },
    //删除主题
    subjectItemDel(index) {
      this.tagNameList.splice(index, 1);
    },
    async submit() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          let _this = this;
          let url = "product/parkPublish/saveParkInfo";
          this.common.formPost(this, {
            url,
            params: this.formItem,
            callback(res) {
              if (res.success) {
                _this.$Message.success("保存成功");
                _this.$router.push("/publishParkTicket");
              }
            }
          });
        }
      });
    }
  },
  components: {
    ueditor,
    myImg,
    amap,
    areaSelect,
    myVideo,
    theFormItem
  }
};
</script>
<style scope lang="scss">
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
