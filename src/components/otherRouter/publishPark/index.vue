<template>
  <div>
    <div style="text-align: center;margin-bottom:15px">
      <div class="step-list">
        <div class="step-item">
          <img class="step-img"
               src="../../../assets/images/step-complete.png"
               alt>
          <div class="step-title">产品类型</div>
          <img class="line-img"
               src="../../../assets/images/line-no.png"
               alt>
        </div>
        <div class="step-item">
          <img class="step-img"
               src="../../../assets/images/step-doing.png"
               alt>
          <div class="step-title">景区信息</div>
          <img style="width: 154px;"
               class="line-img"
               src="../../../assets/images/line-complete.png"
               alt>
        </div>
        <div class="step-item">
          <img class="step-nodo"
               src="../../../assets/images/step-no.png"
               alt>
          <div class="step-title">门票信息</div>
          <img class="line-img line-nodo-img"
               src="../../../assets/images/line-complete.png"
               alt>
        </div>
        <div class="step-item">
          <img class="step-nodo"
               src="../../../assets/images/step-no.png"
               alt>
          <div class="step-title">完成</div>
        </div>
      </div>
    </div>
    <Form height="450"
          :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm">
      <div id="base"
           class="form-title">基本信息</div>
      <FormItem label="景点选择：">
        <Button @click="senicSelect"
                type="primary">景点选择</Button>
        <div>
          <div v-if="senicInfo.id"
               class="senicInfo">
            <div class="name">{{senicInfo.scenicName}}</div>
            <div class="address">{{senicInfo.areaName}}</div>
          </div>
        </div>
      </FormItem>
      <FormItem label="景点等级：">{{senicInfo.rank}}</FormItem>
      <FormItem label="景区地址：">{{senicInfo.areaName}}</FormItem>
      <FormItem label="详细地址：">{{senicInfo.address}}</FormItem>
      <FormItem label="地图坐标：">
        <Input v-model="formItem.latitudeLongitude"
               placeholder
               readonly
               style="width: 300px"></Input>
        <Button @click="getAdressLng"
                type="primary">获取坐标</Button>
      </FormItem>
      <FormItem label="所属景区：">{{senicInfo.scenicName}}</FormItem>
      <FormItem label="旅游主题：">暂无</FormItem>
      <div id="senicInfo"
           class="form-title">景点信息</div>
      <FormItem label="景点类型："
                prop="channel">
        <Select v-model="formItem.channel"
                style="width:200px">
          <Option value>请选择</Option>
          <Option value="-1">商城自建-自核销</Option>
          <Option value="0">商城自建-线下系统</Option>
          <Option value="1">智游宝拉取</Option>
        </Select>
      </FormItem>
      <FormItem label="开园时间：">
        <FormItem style="width:120px;display:inline-block"
                  prop="openTime">
          <TimePicker v-model="formItem.openTime"
                      format="HH:mm"
                      placeholder="开始时间"
                      style="width: 112px"></TimePicker>
        </FormItem>
        <span>-</span>
        <FormItem style="width:120px;display:inline-block"
                  prop="endTime">
          <TimePicker v-model="formItem.endTime"
                      format="HH:mm"
                      placeholder="结束时间"
                      style="width: 112px"></TimePicker>
        </FormItem>
      </FormItem>
      <FormItem label="景点描述：">
        <Input type="textarea"
               v-model="formItem.summary"
               :rows="4"
               placeholder="请输入景点描述"></Input>
      </FormItem>
      <FormItem label="景点介绍：">
        <ueditor id="ue2"
                 ref="mustKnow"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="缩略图：">
        <my-img :limitNum="1"
                :uploadList="singleImgList"
                @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图：">
        <my-img :limitNum="5"
                :uploadList="wapImgList"
                @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <div id="distSet"
           class="form-title">分销设置</div>
      <FormItem label="销售渠道："
                prop="distType">
        <Select v-model="formItem.distType"
                style="width:200px">
          <Option value>请选择</Option>
          <Option value="0">分销市场+店铺</Option>
          <Option value="1">仅分销市场</Option>
          <Option value="2">仅店铺</Option>
        </Select>
      </FormItem>
      <FormItem v-if="formItem.distType=='1'"
                label="分销展示价：">
        <InputNumber v-model="formItem.priceDist"
                     :min="1"></InputNumber>
      </FormItem>
      <template v-if="formItem.distType=='2'">
        <FormItem label="景点别名："
                  prop="nickName">
          <Input v-model="formItem.nickName"
                 style="width:33%"
                 placeholder="请输入景点别名"></Input>
        </FormItem>
        <FormItem label="景点副标题："
                  prop="subTitle">
          <Input v-model="formItem.subTitle"
                 style="width:33%"
                 placeholder="请输入景点副标题"></Input>
        </FormItem>
        <FormItem label="店铺展示起价：">
          <InputNumber v-model="formItem.priceShow"
                       :min="1"></InputNumber>
        </FormItem>
        <FormItem label="店铺虚拟销量：">
          <InputNumber v-model="formItem.virtualSale"
                       :min="1"></InputNumber>
        </FormItem>
      </template>
      <template v-if="formItem.distType=='0'">
        <FormItem label="景点别名："
                  prop="nickName">
          <Input v-model="formItem.nickName"
                 style="width:33%"
                 placeholder="请输入景点别名"></Input>
        </FormItem>
        <FormItem label="景点副标题："
                  prop="subTitle">
          <Input v-model="formItem.subTitle"
                 style="width:33%"
                 placeholder="请输入景点副标题"></Input>
        </FormItem>
        <FormItem label="店铺展示起价：">
          <InputNumber v-model="formItem.priceShow"
                       :min="1"></InputNumber>
        </FormItem>
        <FormItem label="店铺虚拟销量：">
          <InputNumber v-model="formItem.virtualSale"
                       :min="1"></InputNumber>
        </FormItem>
        <FormItem label="分销展示价：">
          <InputNumber v-model="formItem.priceDist"
                       :min="1"></InputNumber>
        </FormItem>
      </template>
      <FormItem label="预订须知："
                prop="totalStockNum">
        <ueditor id="ue3"
                 ref="mustKnow3"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="分销政策："
                prop="totalStockNum">
        <ueditor id="ue4"
                 ref="mustKnow4"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="售后政策："
                prop="totalStockNum">
        <ueditor id="ue5"
                 ref="mustKnow5"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem label="分销区域限制：">
        <Select v-model="formItem.distAreaType"
                style="width:200px">
          <Option value="all">无限制</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit">保存,下一步</Button>
        <Button type="ghost"
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
    <amap ref="bdMap"
          @getPoint="setLngAndLat"></amap>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="#base"
             class="tartg-a">基本信息</a>
        </li>
        <li>
          <a href="#senicInfo"
             class="tartg-a">景点信息</a>
        </li>
        <li>
          <a href="#distSet"
             class="tartg-a">分销设置</a>
        </li>
        <li>
          <Button size="small"
                  type="primary">保存，下一步</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
import { apiPost, apiGet } from "@/fetch/api";
import amap from "@/components/global/amap";
import myImg from "@/components/global/singleImg";
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
      singleImgList: [],
      wapImgList: [],
      page: 1,
      senicInfo: {
        lon: "",
        lat: ""
      },
      senicAddress: "",
      total: 0,
      keyword: "",
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
      data6: [],
      model: false,
      loading: true,
      limitType: "any",
      isSelect: "F",
      tableList: [
        {
          week: [],
          startTime: "",
          endTime: "",
          costPrice: 0,
          rackPrice: 0,
          retailPrice: 0,
          supplyPrice: 0
        }
      ],
      social: [],
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
        name: "",
        zybParkId: "",
        parkLevel: "",
        areaAddr: "",
        addr: "",
        belongTo: "",
        tralveBase: "暂无",
        latitudeLongitude: "",
        channel: "-1",
        openTime: "",
        endTime: "",
        summary: "",
        distType: "0",
        nickName: "",
        subTitle: "",
        priceShow: 0,
        virtualSale: 0,
        priceDist: 0,
        content: "", // 景点介绍
        wapUrl: "",
        linkMobileImg: "",
        orderNotice: "", //预 定须知
        distPolicy: "", // 分销政策
        salePolicy: "", // 售后政策,
        distAreaType: "all"
      },
      ruleComplteForm: {
        channel: [
          { required: true, message: "请选择景点类型", trigger: "change" }
        ],
        openTime: [
          { required: true, message: "请填写开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请填写结束时间", trigger: "blur" }
        ],
        distType: [
          { required: true, message: "请选择分销渠道", trigger: "change" }
        ],
        nickName: [
          { required: true, message: "请填写景点别名", trigger: "blur" }
        ],
        subTitle: [
          { required: true, message: "请填写景点副标题", trigger: "blur" }
        ],
        priceShow: [
          { required: true, message: "请填写店铺展示起价", trigger: "blur" }
        ],
        virtualSale: [
          { required: true, message: "请填写店铺虚拟销量", trigger: "blur" }
        ],
        priceDist: [
          { required: true, message: "请填写分销展示价", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    "formItem.sellType": "handle"
  },
  methods: {

    setWapUrl (imgArr) {
      this.formItem.wapUrl = imgArr.join(",");
    },
    setWapListUrl (imgArr) {
      this.formItem.linkMobileImg = imgArr.join(",");
    },
    async checkSenicName (postName) {
      // 检测是否发不过
      return apiGet(
        "/product/parkPublish/selectParkInfoByName?spotsName=" + postName
      );
    },
    setLngAndLat (point) {
      this.formItem.latitudeLongitude = point.lng + "," + point.lat;
    },
    getAdressLng () {
      this.$refs.bdMap.showModal();
    },
    changePage (page) {
      this.page = page;
      this.selectSenicList();
    },
    selectSenicList () {
      apiPost("/product/parkPublish/grid", {
        page: this.page,
        limit: 10,
        sort: "createTime",
        order: "desc",
        name: this.keyword
      }).then(res => {
        this.data6 = res.rows;
        this.total = res.total;
      });
    },
    senicSelect () {
      this.model = true;
    },
    handle () {
      // 用于初始化第一个tr
      this.tableList.splice(0, this.tableList.length, {
        week: [],
        startTime: "",
        endTime: "",
        costPrice: 0,
        rackPrice: 0,
        retailPrice: 0,
        supplyPrice: 0
      });
    },
    selectAll (index) {
      this.tableList[index].week = ["1", "2", "3", "4", "5", "6", "0"];
    },
    selectTime (index) {
      this.tableList[index].week = ["1", "2", "3", "4", "5"];
    },
    selectWeekend (index) {
      this.tableList[index].week = ["6", "0"];
    },
    add () {
      this.tableList.push({
        week: [],
        startTime: "",
        endTime: "",
        costPrice: 0,
        rackPrice: 0,
        retailPrice: 0,
        supplyPrice: 0
      });
    },
    del (index) {
      this.tableList.splice(index, 1);
    },
    submit () {
      let _this = this;
      // this.formCompleteItem.summary = this.$refs.mdseInfo.getUEContent();
      this.formItem.content = this.$refs.mustKnow.getUEContent();
      this.formItem.orderNotice = this.$refs.mustKnow3.getUEContent();
      this.formItem.distPolicy = this.$refs.mustKnow4.getUEContent();
      this.formItem.salePolicy = this.$refs.mustKnow5.getUEContent();
      let url = "/product/parkPublish/saveParkInfo";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "page",
        callback (res) {
          if (res.success) {
            _this.completeInfo = false;
          }
        }
      });
    }
  },
  components: {
    ueditor,
    amap,
    myImg
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
      a {
        display: block;
        padding: 3px 7px;
        text-decoration: none;
        border-bottom: 1px solid #e2d5d5;
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

