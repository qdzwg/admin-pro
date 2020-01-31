<template>
  <div>
    <Form height="450"
          :model="formCompleteItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm">
      <h2 class="page-title">修改</h2>
      <div class="form-title">基本信息</div>
      <FormItem label="景点名称：">
        {{formCompleteItem.name}}
      </FormItem>
      <FormItem label="景点等级：">
        {{formCompleteItem.parkLevel | parkLevel}}
      </FormItem>
      <FormItem label="下单类型："
                prop="orderType">
        <Select v-model="formCompleteItem.orderType"
                style="width:200px;">
          <Option value="1">多票型</Option>
          <Option value="2">单票型</Option>
        </Select>
        <p style="color:red">备注：切换后C端用户刷新页面后生效</p>
      </FormItem>
      <FormItem label="景区地址：">
        {{formCompleteItem.areaAddr}}
      </FormItem>
      <FormItem label="详细地址：">
        {{formCompleteItem.addr}}
      </FormItem>
      <FormItem label="地图坐标：">
        {{formCompleteItem.latitudeLongitude}}
      </FormItem>
      <FormItem label="所属景区：">
        {{formCompleteItem.belongTo}}
      </FormItem>
      <FormItem label="旅游主题：">
        {{formCompleteItem.tralveBase?formCompleteItem.tralveBase:"暂无"}}
      </FormItem>
      <div class="form-title">景点信息</div>
      <FormItem label="景点类型：">
        {{formCompleteItem.channel | accountChannel}}
      </FormItem>
      <FormItem v-if="formCompleteItem.channel=='-1'"
                label="是否推送云票务：">
        {{formCompleteItem.isSyncYpw=='T'?"是":"否"}}
      </FormItem>
      <FormItem v-if="formCompleteItem.channel=='1'"
                label="发码类型：">
        <Select v-model="formCompleteItem.oneCode"
                style="width:200px;">
          <Option value="F">一单一码</Option>
          <Option value="T">一票一码</Option>
        </Select>
        <p style="color:red">
          备注： </br>
          1.设为一单一码，同一批次支付的订单智游宝发一个码一条短信，智游宝生成一个订单；设为一票一码，同一批次支付的订单智游宝按票型发码和短信，智游宝生成多个订单</br>
          2.分销市场旅行社下单仅一单一码
        </p>
      </FormItem>
      <FormItem label="开园时间：">
        <Row>
          <Col span="2">
          <FormItem prop="openTime">
            <TimePicker v-model="formCompleteItem.openTime"
                        format="HH:mm"
                        placeholder="开始时间"
                        style="width: 112px"></TimePicker>
          </FormItem>
          </Col>
          <Col span="1"
               style="text-align: center">-</Col>
          <Col span="2">
          <FormItem prop="endTime">
            <TimePicker v-model="formCompleteItem.endTime"
                        format="HH:mm"
                        placeholder="结束时间"
                        style="width: 112px"></TimePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="景点描述："
                prop="summary">
        <Input v-model="formCompleteItem.summary"
               type="textarea"
               :rows="4"
               style="width:33%;"></Input>
      </FormItem>
      <FormItem label="景点介绍："
                prop="content">
        <ueditor v-model="formCompleteItem.content"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="缩略图：">
        <up-img :limitNum="1"
                v-model="formCompleteItem.linkMobileImg"></up-img>
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图：">
        <up-img :limitNum="5"
                v-model="formCompleteItem.wapUrl"></up-img>
        <p>最多上传5张，建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <div class="form-title">分销设置</div>
      <FormItem label="分销渠道："
                prop="distType">
        <Select v-model="formCompleteItem.distType"
                style="width:200px">
          <Option v-for="item in list"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
        <p class="remark">备注：渠道切换后，原渠道信息不做清理，仅直接下架对应渠道产品</p>
      </FormItem>
      <template v-if="formCompleteItem.distType=='2'||formCompleteItem.distType=='0'">
        <FormItem label="景点别名："
                  prop="nickName">
          <Input v-model="formCompleteItem.nickName"
                 placeholder="填写景区别名"
                 style="width:33%;"></Input>
        </FormItem>
        <FormItem label="景点副标题："
                  prop="subTitle">
          <Input v-model="formCompleteItem.subTitle"
                 placeholder="景点副标题"
                 style="width:33%;"></Input>
        </FormItem>
        <FormItem label="店铺展示起价："
                  prop="priceShow">
          <InputNumber :min="0"
                       v-model="formCompleteItem.priceShow"></InputNumber>元
        </FormItem>
        <FormItem label="店铺虚拟销量："
                  prop="virtualSale">
          <InputNumber :min="0"
                       v-model="formCompleteItem.virtualSale"></InputNumber>
        </FormItem>
        <FormItem label="预订须知：">
          <ueditor v-model="formCompleteItem.orderNotice"
                   :config="config"></ueditor>
        </FormItem>

      </template>
      <template v-if="formCompleteItem.distType=='1'||formCompleteItem.distType=='0'">
        <FormItem label="分销展示价："
                  prop="priceDist">
          <InputNumber :min="0"
                       v-model="formCompleteItem.priceDist"></InputNumber>元
        </FormItem>

        <FormItem label="分销政策：">
          <ueditor v-model="formCompleteItem.distPolicy"
                   :config="config"></ueditor>
        </FormItem>
        <FormItem label="售后政策：">
          <ueditor v-model="formCompleteItem.salePolicy"
                   :config="config"></ueditor>
        </FormItem>
      </template>
      <FormItem label="分销区域限制：">
        <Select v-model="formCompleteItem.distAreaType"
                style="width:200px">
          <Option v-for="item in lmitList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit">保存</Button>
        <Button type="ghost"
                style="margin-left: 8px"
                @click="test">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
import ueditor from "@/components/global/vueUEditor";
import store from "@/store";
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (
        !store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)
      ) {
        vm.$router.back(); //如果没有就不会跳转
      }
    });
  },
  data () {
    return {
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
      pcMainImgList: [],
      pcWapImgList: [],
      singleImgList: [],
      wapImgList: [],
      msg: "3121213asda313",
      oldDistType: "",
      formCompleteItem: {
        detailIds: this.$route.params.id
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
          { required: true, type: "number", message: "请填写店铺展示起价", trigger: "blur" }
        ],
        virtualSale: [
          { required: true, type: "number", message: "请填写店铺虚拟销量", trigger: "blur" }
        ],
        priceDist: [
          { required: true, type: "number", message: "请填写分销展示价", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    if (this.$route.query.id) {
      apiGet("/product/parkInfo/editFL?id=" + this.$route.query.id).then(
        res => {
          if (res.success) {
            this.formCompleteItem = res.data.parkInfoDto;
            this.oldDistType = res.data.parkInfoDto.distType
          }
        }
      );
    }
  },
  methods: {
    submit () {
      let _this = this;
      // this.formCompleteItem.summary = this.$refs.mdseInfo.getUEContent();
      this.formCompleteItem.oldDistType = this.oldDistType;

      let url = "/product/parkInfo/updateParkInfo";
      this.common.formPost(this, {
        url,
        params: this.formCompleteItem,
        mold: "page",
        callback (res) {
          if (res.success) {
            _this.$Message.success("操作成功！")
            _this.$router.back()
          }
        }
      });
    },
    test () {
      this.$router.back()
    },
  },
  components: {
    ueditor
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
</style>

