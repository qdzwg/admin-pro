<template>
  <div class="placeRoute">
    <div v-if='!isEdit' class="step">
      <Steps :current="1">
        <Step title="产品类型"></Step>
        <Step title="跟团游信息"></Step>
        <Step title="票型信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleComplteForm">
      <div id="base" class="form-title">基本信息</div>
      <FormItem label="跟团游名称：" >
          <span>{{formItem.name}}</span>
        <!-- <Input v-model="formItem.name" placeholder="控制在100个汉字内，产品名称+（行程特色）" style="width:33%" :maxlength="100"></Input> -->
      </FormItem>
      <FormItem label="出发地：" >
          <span>{{formItem.begAddress}}</span>
        <!-- <Input v-model="formItem.begAddress" placeholder="字数限制20个字" style="width:33%" :maxlength="20"></Input> -->
      </FormItem>
      <FormItem label="目的地：" >
          <span>{{formItem.endAddress}}</span>
        <!-- <Input v-model="formItem.endAddress" placeholder="字数限制20个字" style="width:33%" :maxlength="20"></Input> -->
      </FormItem>
      <FormItem label="跟团游主题：" >
        <!-- {{formItem.lineTheme}} -->
        <div style="height:32px;" class="travellSubject">
          <div class="subject-list">
            <div v-for='(item,index) in tagNameList' :key='index' class="subject-list-item">
              <!-- <Icon @click="subjectItemDel(index)" class="subject-list-item-del" type="close-circled"></Icon> -->
              <Button>{{item}}</Button>
            </div>
          </div>
          <!-- <div class="subject-input">
            <Input @on-enter='setSubjectTag' :maxlength="4" v-model='tagName' placeholder='回车添加标签，如“跟团游”' style="width: 200px"></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left">输入后，回车添加</div> -->
        </div>
        <Input v-model="formItem.lineTheme" style="display:none"></Input>
      </FormItem>
      <FormItem label="几天几夜：" >
        <!-- <FormItem style="width:100px;display:inline-block" >             
          <Input style="width:100px" v-model="formItem.useDay" :maxlength="2"></Input>
        </FormItem> -->
        <span>{{formItem.useDay}}</span>
        <span class="unit">天</span>
        <!-- <FormItem style="width:100px;display:inline-block" >             
          <Input style="width:100px" v-model="formItem.useNight" :maxlength="2"></Input>
        </FormItem> -->
        <span>{{formItem.useNight}}</span>
        <span class="unit">夜</span>
      </FormItem>
      <!-- <FormItem label="所属景区：">
        <Button @click="senicSelect" type="primary">景区选择</Button>
        </Button>
        <div v-if='showTableSelection&&showTableSelection.length'>
          <div v-for='(item,index) in showTableSelection' :key='index' class="senicInfo">
            <Icon @click="senicDel(index)" class="senicDel" type="close-circled"></Icon>
            <div class="name">{{item.name}}</div>
            <div class="address">{{item.areaAddr}}</div>
          </div>
        </div>
      </FormItem> -->

      <div id="senicInfo" class="form-title">跟团游信息</div>
      <FormItem label="跟团游描述：" prop="lineDescription">
        <Input type="textarea" v-model="formItem.lineDescription" :maxlength="100" placeholder="用于跟团游详情页，跟团游名称下方介绍" style="width:33%"></Input>
      </FormItem>
      <template v-if='dataShow'>
        <FormItem label="跟团游须知：" prop='lineNotes'>
          <!-- <quill-editor ref='quill1' :content='formItem.lineNotes'></quill-editor> -->
          <ueditor id="ue1" ref="lineNotes" :content="formItem.lineNotes" :config="config"></ueditor>
        </FormItem>
        <FormItem label="行程安排：" prop="lineArrange">
          <!-- <Input type="textarea" style="width:33%" v-model="formItem.content" :rows="4" placeholder="请输入景点描述"></Input> -->
          <!-- <quill-editor ref='quill2' :content='formItem.lineArrange'></quill-editor> -->
          <ueditor id="ue2" ref="lineArrange" :content="formItem.lineArrange" :config="config"></ueditor>
        </FormItem>
        <FormItem label="费用说明：" prop="costDescription">
          <!-- <Input type="textarea" style="width:33%" v-model="formItem.content" :rows="4" placeholder="请输入景点描述"></Input> -->
          <!-- <quill-editor ref='quill3' :content="formItem.costDescription"></quill-editor> -->
          <ueditor id="ue3" ref="costDescription" :content="formItem.costDescription" :config="config"></ueditor>
        </FormItem>
      </template>
      <FormItem label="缩略图：" prop='linkMobileImg'>
        <!-- <Input v-model="formItem.linkMobileImg" style="display:none"></Input> -->
        <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图：" prop="linkBreviaryImg">
        <!-- <Input v-model="formItem.linkBreviaryImg" style="display:none"></Input> -->
        <my-img :limitNum="5" :uploadList="wapImgList" @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <div id="distSet" class="form-title">分销设置</div>
      <!-- <FormItem label="分销渠道：" prop="sellType">
        <Select v-model="formItem.sellType" style="width:200px" disabled>
          <Option :value="item.value" v-for="(item,index) in sellTypeList" :key="index">{{item.label}}</Option>
        </Select>
      </FormItem> -->

      <FormItem label="跟团游别名："  prop="nickName">
        <Input  v-model="formItem.nickName" style="width:33%" :maxlength="100"></Input>
      </FormItem>
      <FormItem label="跟团游副标题："  prop="subtitle">
        <Input v-model="formItem.subtitle" style="width:33%" :maxlength="100"></Input>
      </FormItem>
      <FormItem  label="店铺展示起价：" prop="priceShow">
        <Input number v-model="formItem.priceShow" style="width:200px;" :maxlength="9"></Input>
        <span class='money-unit'>元</span>
      </FormItem>
      <FormItem  label="店铺虚拟销量：" prop="fictSaleNum">
        <Input number :maxlength="6" v-model="formItem.fictSaleNum" style="width:200px;"></Input>
      </FormItem>
    
      <FormItem>
        <div class="save-cancel">
          <Button type="primary" :loading='btnLoading' @click="submit">
            <template v-if='isEdit'>
              保存
            </template>
            <template v-else>
              保存,下一步
            </template>
          </Button>
          <Button v-if='isEdit' type="ghost" style="margin-left: 8px" @click="goback">取消</Button>
          <Button v-else type="ghost" style="margin-left: 8px" @click="test">取消</Button>
        </div>
      </FormItem>
    </Form>
    <Modal width="800" v-model="model" title="选择景区" :loading="loading" @on-ok='ok'>
      <div style="margin-bottom:10px">
        <Input placeholder="请输入对应景区关键字" v-model='keyword' style="width: 300px"></Input>
        <Button @click="selectHotel" type="primary">搜索</Button>
        <p style="color:red"> 备注：没有相关信息，请重新搜索或联系小鲸客服(400-875-9009)</p>
      </div>

      <div>
        <Table height='350' @on-selection-change='selectionChange' :loading='tableLoading' border :columns="columns7" :data="data6"></Table>
      </div>
      <div style="margin-top:10px">
        <Page @on-change="changePage" :total="total" size="small" show-elevator show-sizer></Page>
      </div>
      <!-- <div slot="footer"></div> -->
    </Modal>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('senicInfo')">跟团游信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('distSet')">分销设置</a>
        </li>
        <li>
          <Button size="small" :loading='btnLoading' @click="submit" type="primary">
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
  </div>
</template>
<script>
// import quillEditor from "@/components/global/vueQuillEditor";
import ueditor from "@/components/global/ueditor";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import myImg from "@/components/global/singleImg";
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      dataShow: false, //保证页面在有数据的情况下一定展示
      isEdit: "", //是否编辑页
      keyword: "",
      tagNameList: [], // 标签名数组
      tagName: "", // 主题标签名称
      showTableSelection: [], //页面展示选中项数组
      tableSelecttion: [], //弹框选中项
      tableLoading: false,
      branditems: [],
      btnLoading: false,
      singleImgList: [],
      wapImgList: [],
      page: 1,
      total: 0,
      columns7: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          key: "name",
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "景区名称",
          key: "name"
        },
        {
          title: "景区地址",
          key: "areaAddr"
        }
      ],
      data6: [],
      model: false,
      loading: true,
      type: "",
      sellTypeList: [
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
      //酒店品牌数据
      brandList: [],
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formItem: {
        id: "",
        name: "", //酒店名称
        begAddress: "", //出发地
        endAddress: "", // 目的地
        lineTheme: "", //主题
        useDay: "", //用时几天
        useNight: "", //用时几夜
        lineDescription: "", //线路描述
        lineNotes: "", //线路须知
        lineArrange: "", //线路安排
        costDescription: "", //费用说明
        linkMobileImg: "", //主图地址
        linkBreviaryImg: "", //缩略图地址
        sellType: "0", //渠道
        nickName: "", //线路别名
        subtitle: "", //线路副标题
        priceShow:null, //店铺展示起价
        fictSaleNum:null, //店铺虚拟销量
      },
      ruleComplteForm: {
        name: [
          { required: true, message: "请填写跟团游名称", trigger: "blur" }
        ],
        begAddress: [
          { required: true, message: "请填写出发地", trigger: "blur" }
        ],
        endAddress: [
          { required: true, message: "请填写目的地", trigger: "blur" }
        ],
        lineTheme: [
          { required: true, message: "请填添加跟团游主题", trigger: "blur" }
        ],
        useDay: [
          { required: true, message: "请填写几天", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "数据格式不正确"
          }
        ],
        useNight: [
          { required: true, message: "请填写几夜", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "数据格式不正确"
          }
        ],
        lineDescription: [
          { required: true, message: "请填写跟团游描述", trigger: "blur" }
        ],
        lineNotes: [
          { required: true, message: "请填写跟团游须知", trigger: "blur" }
        ],
        lineArrange: [
          { required: true, message: "请填写行程安排", trigger: "blur" }
        ],
        costDescription: [
          { required: true, message: "请填写费用说明", trigger: "blur" }
        ],
        lineDescription: [
          { required: true, message: "请填写跟团游描述", trigger: "blur" }
        ],
        linkMobileImg: [{ required: true, message: "请上传缩略图" }],
        linkBreviaryImg: [{ required: true, message: "请上传轮播图" }],
        sellType: [
          { required: true, message: "请选择分销渠道", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "请填写跟团游别名", trigger: "blur" },
          { max: 100, message: "酒店别名字数不能超过100个" }
        ],
        subtitle: [
          { required: true, message: "请填写跟团游副标题", trigger: "blur" },
          { max: 100, message: "酒店别名字数不能超过100个" }
        ],
        priceShow: [
          { required: true,type: "number", message: "请填写店铺展示起价" },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        fictSaleNum: [
          { required: true,type: "number", message: "请填写店铺虚拟销量" },
          {
            pattern: /^[0-9]\d*$/,
            message: "数据格式不正确"
          }
        ],
      }
    };
  },
  computed: {},
  created() {
    this.isEdit = this.$route && this.$route.query && this.$route.query.id;
    if (this.isEdit) {
      this.getPageData();
    } else {
      //缓存页面
      this.getRouteInfo();
    }
  },
  methods: {
    getPageData() {
      apiGet(
        "/merchant/api/merchantRouteInfo/editMerchantRouteInfo?id=" +
          this.$route.query.id
      ).then(res => {
        this.initData(res);
      });
    },
    getRouteInfo() {
      apiGet("/product/api/routePush/publishRoute").then(res => {
        this.initData(res);
      });
    },
    initData(res) {
      //初始化页面数据
      this.dataShow = true;
      if (res && res.data) {
        let _this = this;
        this.formItem = res.data;
        this.tagNameList =
          res.data && res.data.lineTheme ? res.data.lineTheme.split(",") : [];
        this.singleImgList =
          res.data && res.data.linkMobileImg
            ? res.data.linkMobileImg.split(",")
            : [];
        this.wapImgList =
          res.data && res.data.linkBreviaryImg
            ? res.data.linkBreviaryImg.split(",")
            : [];
            if(res.data.merchantPictureLibVo){
               delete res.data.merchantPictureLibVo
            }
      }
    },
    subjectItemDel(index) {
      this.tagNameList.splice(index, 1);
      this.formItem.lineTheme = this.tagNameList.join(",");
    },
    setSubjectTag() {
      // 回车添加标签名
      if (this.tagNameList && this.tagNameList.length < 5) {
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
    senicDel(index) {
      // 删除景区
      this.showTableSelection.splice(index, 1);
    },
    selectionChange(selection) {
      this.tableSelecttion = selection;
    },
    ok() {
      // 弹框确定
      this.showTableSelection = this.showTableSelection.concat(
        this.tableSelecttion
      );
      this.model = false;
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    setnickname() {
      this.formItem.aliasName = this.formItem.name;
    },
    selectChange(val) {
      let _this = this;
      this.brandList.forEach(function(d) {
        if (d.id == val) {
          _this.branditems = d.items;
        }
      });
      this.hotelBrandId = "";
    },
    test() {
      window.location.href =
        window.location.href.split("/manage")[0] +
        "/admin/index#/product/parkPublish/selectProduct";
      // this.$router.push("/publishParkTicket");
    },
    goback() {
      this.$router.back();
    },
    setWapUrl(imgArr) {
      this.formItem.linkMobileImg = imgArr[0];
      // this.formItem.linkMobileImg = imgArr.join(",");
      this.$refs.formItem.validateField("linkMobileImg");
    },
    setWapListUrl(imgArr) {
      this.formItem.linkBreviaryImg = imgArr.join(",");
      this.$refs.formItem.validateField("linkBreviaryImg");
    },
    changePage(page) {
      this.page = page;
      this.selectHotel();
    },
    //选择酒店
    selectHotel() {
      this.tableLoading = true;
      apiPost("/product/api/routePush/pageParkToRoute", {
        currPage: this.page,
        pageSize: 10,
        name: this.keyword
      }).then(res => {
        if (res.status == 200) {
          let _this = this;
          this.tableLoading = false;
          res.data.rows = res.data.rows.filter(ele => {
            return !_this.showTableSelection.some(item => {
              return ele.id == item.id;
            });
          });
          this.data6 = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    //选择酒店
    senicSelect() {
      this.model = true;
    //   this.selectHotel();
    },
    scrollError() {
      let errList = $(".ivu-form-item-error");
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top;
        $("#content").animate(
          {
            scrollTop: scroll_offset
          },
          300
        );
      }
    },
    submit() {
      this.btnLoading = true;
      let _this = this;
      this.formItem.lineNotes = this.$refs.lineNotes.getUEContent();
      this.formItem.lineArrange = this.$refs.lineArrange.getUEContent();
      this.formItem.costDescription = this.$refs.costDescription.getUEContent();

      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          let url = this.isEdit
            ? "/merchant/api/merchantRouteInfo/saveEditMerchantRouteInfo"
            : "/product/api/routePush/saveRoute";
          if (this.isEdit) {
            this.formItem.id = this.$route.query.id;
          }
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            if (this.isEdit) {
              _this.$router.push("/placeRouteList");
            } else {
              _this.$router.push("/travellingRouteInfo");
            }
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          this.btnLoading = false;
          //滚动到错误地方
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 500);
        }
      });
    }
  },
  components: {
    myImg,
    // quillEditor,
    ueditor
  }
};
</script>
<style lang="scss">
.placeRoute {
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





