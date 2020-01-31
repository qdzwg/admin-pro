<template>
  <Form
    :model="formItem"
    label-position="right"
    :label-width="120"
    ref="formItem"
    :rules="ruleComplteForm"
  >
    <div id="base" class="form-title">基本信息</div>
    <template v-if="songCityId && !songCityId.show">
      <FormItem label="景区名称：" v-if="isNameText">
        {{ formItem.name }}
      </FormItem>
      <FormItem label="景区别名：">
        {{ formItem.nickName }}
      </FormItem>
      <FormItem label="景点等级：">
        {{ formItem.parkLevel }}
      </FormItem>
      <FormItem label="景区地址：">
        {{ formItem.areaAddr }}
      </FormItem>
      <FormItem label="详细地址：">
        {{ formItem.addr }}
      </FormItem>
      <FormItem label="地图坐标：">
        {{ formItem.latitudeLongitude }}
      </FormItem>
    </template>
    <template v-else>
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
      <FormItem label="景区编码：" v-if="formItem.productCode">
        <span>{{ formItem.productCode }}</span>
      </FormItem>
      <FormItem
        label="所属城市："
        prop="cityId"
        v-if="songCityId && songCityId.show"
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
      <FormItem label="旅游主题：" prop="extendsParam4">
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
    </template>

    <div id="senicInfo" class="form-title">景点信息</div>
    <FormItem
      label="景点类型："
      v-if="songChannel && songChannel.show"
      prop="channel"
    >
      {{ formItem.channel }}
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
      :rules="{ required: true, message: '请填写景点介绍', trigger: 'change' }"
      prop="content"
    >
      <ueditor v-model="formItem.content"></ueditor>
    </FormItem>
    <FormItem
      label="缩略图："
      :rules="{ required: true, message: '请上传缩略图', trigger: 'change' }"
      prop="linkMobileImg"
    >
      <up-img :limitNum="1" v-model="formItem.linkMobileImg"></up-img>
      <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
    </FormItem>
    <FormItem label="轮播图：">
      <up-img :limitNum="5" v-model="formItem.wapUrl"></up-img>
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
      :rules="{ required: true, message: '请选择分销渠道', trigger: 'change' }"
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
      :rules="{ required: true, message: '请填写预定须知', trigger: 'change' }"
      prop="orderNotice"
    >
      <ueditor v-model="formItem.orderNotice"></ueditor>
    </FormItem>
    <FormItem
      label="售后政策："
      v-if="songExtendsParam2 && songExtendsParam2.show"
      :rules="{ required: true, message: '请填写售后政策', trigger: 'change' }"
      prop="salePolicy"
    >
      <ueditor id="extendsParam2" v-model="formItem.extendsParam2"></ueditor>
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
      >
        <ueditor id="salePolicy" v-model="formItem.salePolicy"></ueditor>
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
      <Button type="primary" @click="submit">保存</Button>
      <Button type="ghost" style="margin-left: 8px" @click="cancel"
        >取消</Button
      >
    </FormItem>
    <amap
      @getPoint="setPoint"
      :mark="formItem.latitudeLongitude"
      ref="address"
    ></amap>
  </Form>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
import amap from "@/components/global/amap";
import areaSelect from "@/components/global/select";
import ueditor from "@/components/global/vueUEditor";
import store from "@/store";
import myVideo from "@/components/global/video";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      tagName: "",
      tagNameList: [],
      rankList: [
        { value: "", label: "请选择" },
        { value: "1", label: "1A" },
        { value: "2", label: "2A" },
        { value: "3", label: "3A" },
        { value: "4", label: "4A" },
        { value: "5", label: "5A" },
        { value: "6", label: "其它" }
      ],
      cityList: [],
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
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      oldDistType: "",
      formItem: {
        // detailIds: this.$route.params.id
      },
      ruleComplteForm: {
        openTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
        endTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
        nickName: [
          { required: true, message: "请填写景点别名", trigger: "blur" }
        ],
        subTitle: [
          { required: true, message: "请填写景点副标题", trigger: "blur" }
        ],
        priceShow: [
          {
            required: true,
            type: "number",
            message: "请填写店铺展示起价",
            trigger: "blur"
          }
        ],
        virtualSale: [
          {
            required: true,
            type: "number",
            message: "请填写店铺虚拟销量",
            trigger: "blur"
          }
        ],
        priceDist: [
          {
            required: true,
            type: "number",
            message: "请填写分销展示价",
            trigger: "blur"
          }
        ]
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
  async created() {
    this.apiPost("/product/api/park/selectCityInfo").then(res => {
      if (res.status == 200) {
        this.cityList = res.data.map(item => {
          return { cityId: item.id, label: item.cityName };
        });
      }
    });
    let info = await this.getDiffInfo();
    let params = {
      ...this.formItem,
      ...this.diffValue
    };
    this.formItem = params;
  },
  methods: {
    ...mapActions("scenic", ["getDiffInfo"]),
    submit() {
      let _this = this;
      // this.formCompleteItem.summary = this.$refs.mdseInfo.getUEContent();
      this.formItem.oldDistType = this.oldDistType;
      this.formItem.extendsParam4 = this.tagNameList.join(",");
      let url = "/product/parkInfo/updateParkInfo";
      this.common.formPost(this, {
        url,
        params: { ...this.diffValue, ...this.formItem },
        mold: "page",
        callback(res) {
          if (res.success) {
            _this.$Message.success("操作成功！");
            _this.$router.go(-1);
          }
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    test() {
      this.$router.go(-1);
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
    getAdressLng() {
      //   this.$refs.bdMap.showModal();
      this.$refs.address.showModal();
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
          this.formItem.lineTheme = this.tagNameList.join(",");
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
    setPoint(point) {
      this.formItem.latitudeLongitude = point.lng + "," + point.lat;
    }
  },
  components: {
    ueditor,
    myVideo,
    areaSelect,
    amap
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let id = to.params.id;
      if (id) {
        vm.apiGet("/product/parkInfo/editFL", { id }).then(res => {
          if (res.success) {
            vm.formItem = res.data.parkInfoDto;
            vm.tagNameList = vm.formItem.extendsParam4
              ? vm.formItem.extendsParam4.split(",")
              : [];
            vm.formItem.detailIds = id;
            vm.oldDistType = res.data.parkInfoDto.distType;
          }
        });
      }
    });
  }
};
</script>
<style scope lang="scss">
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
.remark {
  color: red;
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
</style>
