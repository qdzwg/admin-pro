<template>
  <div class="productgroup-edit-box">
    <!-- {{pageData}} -->
    <!-- {{inputLength}} -->
    <div class="s-p">
      <div class="edit-notice">温馨提示：请注意组件绑定产品发生下架、删除或禁用店铺分销渠道时，店铺将不再展示该产品</div>
      <table class="edit-table">
        <tr>
          <td class="title">
            <span class="red">*</span>
            模板样式
          </td>
          <td>
            <div class="type-select">
              <!-- 图文导航 -->
              <Col span="8">
                <div
                  class="type-item clearfix"
                  @click="typeSelect('productGroup1')"
                  :class="{active:pageData.type=='productGroup1'}"
                >
                  <div class="type-item-box">顶部菜单</div>
                  <!-- <img @click="typeSelect('productGroup1')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
                </div>
              </Col>
              <!-- 文字导航 -->
              <Col span="8">
                <div
                  class="type-item clearfix"
                  @click="typeSelect('productGroup2')"
                  :class="{active:pageData.type=='productGroup2'}"
                >
                  <div class="type-item-box">左侧菜单</div>
                  <!-- <img @click="typeSelect('productGroup2')" class="type-img fl" src="http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg" alt=""> -->
                </div>
              </Col>
            </div>
          </td>
        </tr>
        <tr>
          <td class="title">
            <span class="red">*</span>
            菜单样式
          </td>
          <td>
            <RadioGroup v-model="pageData.menuType">
              <Radio label="type1">
                <span>样式一</span>
              </Radio>
              <Radio label="type2">
                <span>样式二</span>
              </Radio>
              <Radio label="type3">
                <span>样式三</span>
              </Radio>
              <Radio label="type4" v-if="pageData.type=='productGroup1'">
                <span>样式四</span>
              </Radio>
            </RadioGroup>
          </td>
        </tr>
        <tr>
          <td class="title">
            图片样式
          </td>
          <td>
            <RadioGroup v-model="pageData.imgStyle">
              <Radio label="rightAngle">
                <span>直角边</span>
              </Radio>
              <Radio label="fillet">
                <span>圆角边</span>
              </Radio>
              <Radio label="halfFillet">
                <span>半圆角边</span>
              </Radio>
            </RadioGroup>
          </td>
        </tr>
        <template v-if="pageData.type=='productGroup1'">
          <tr>
            <td class="title">
              <span class="red">*</span>
              页面交互
            </td>
            <td>
              <RadioGroup v-model="pageData.pageInteraction">
                <Radio label="type1">
                  <span>正常模式</span>
                </Radio>
                <Radio label="type2">
                  <span>自动吸顶</span>
                </Radio>
              </RadioGroup>
            </td>
          </tr>
          <tr>
            <td class="title">
              <span class="red">*</span>
              列表样式
            </td>
            <td>
              <RadioGroup v-model="pageData.listType">
                <Radio label="type1">
                  <span>单列</span>
                </Radio>
                <Radio label="type2">
                  <span>双列</span>
                </Radio>
                <Radio label="type3">
                  <span>横滑</span>
                </Radio>
              </RadioGroup>
            </td>
          </tr>
          <tr>
          <td class="title">
            <span class="red">*</span>
            详情展示
          </td>
          <td>
            <RadioGroup v-model="pageData.pxType">
              <Radio label="all">
                <span>全部票型</span>
              </Radio>
              <Radio label="single">
                <span>单票型</span>
              </Radio>
            </RadioGroup>
          </td>
        </tr>
         <tr>
          <td class="title">
            <span class="red">*</span>
            文字展示
          </td>
          <td>
            <CheckboxGroup v-model="pageData.textType">
              <Checkbox label="mdseName">
                <span>商品名</span>
              </Checkbox>
              <Checkbox label="productName">
                <span>产品名</span>
              </Checkbox>
            </CheckboxGroup>
          </td>
        </tr>
        <tr>
            <td>分组背景图</td>
            <td>
              <div class='shop-info-img'>
                <template v-if='pageData.menuBgUrl'>                 
                  <img class="img-show" :src="pageData.menuBgUrl" alt="">
                  <div class="cover-del">
                    <Icon @click="menuBgUrlDel" class="del-svg" type="ios-trash-outline"></Icon>
                  </div>                
                </template>                
                <Upload v-else class="img-up" :format="['jpg','jpeg','png']" :on-success="menuImgUrl" :show-upload-list="false" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" action="/static/manage/uiFileUpload/dispatch?action=upload">
                  <Icon class="add-icon" type="ios-plus-outline" size='14'></Icon>
                </Upload>               
              </div>              
            </td>
          </tr>
        </template>
      </table>
    </div>
    <draggable :list="pageData.list" :options="{animation:150}" :no-transition-on-drag="true">
      <div
        v-for="(item,index) in pageData.list"
        :key="index"
        v-if="index<limitNum"
        class="product-group-item"
      >
        <Icon @click="del(index)" type="close-circled del-icon"></Icon>
        <table class="edit-table">
          <tr>
            <td>分组名称</td>
            <td>
              <Input size="small" :maxlength="inputLength" v-model="item.groupName"></Input>
            </td>
          </tr>
          <tr>
            <td>分组副标题</td>
            <td>
              <Input size="small" :maxlength="inputLength" v-model="item.subTitle"></Input>
            </td>
          </tr>
          
          <tr v-if="!custompageTemplate">
            <td>已选产品</td>
            <td>
              <Button
                @click="showModal(index)"
                type="primary"
                v-if="item.data.length<50"
                size="small"
              >关联产品</Button>
            </td>
          </tr>
        </table>
        <!-- <div v-if="item.data&&item.data.length" class="img-text-list">
          <draggable :list="item.data" :options="{animation:150}" :no-transition-on-drag="true">
            <div v-for="(it,i) in item.data" :key="i" class="img-text-item clearfix">
              <div class="no-img-show fl">
                <img class="img" v-if="it.linkMobileImg" :src="it.linkMobileImg" alt>
                <span v-else>主图</span>
        </div>-->
        <!-- <img class="product-img" src="../../../../assets/images/bannertype2.png" alt=""> -->
        <!-- <div class="product-name fl">
                <div class="product-name-content">
                  <span class="name">{{it.nickName}}</span>
                  <span @click="remove(index,i)" class="remove">移除</span>
                </div>
              </div>
            </div>
        </draggable>-->
        <!-- </div> -->

        <product-item :itemdata="pageData.list[index]" ></product-item>
      </div>
    </draggable>
    <Button v-if="pageData.list&&pageData.list.length<limitNum" @click="add" long>
      <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>添加一个产品分组
    </Button>
    <!-- <div class="product-group-notice" style='margin-top:15px;'>
      最多支持添加4行20个导航，拖动选中的图文导航可对其排序
    </div>-->
    <!-- 弹出层 -->
    <Modal width="800px" v-model="modal" :loading="loading" title="产品选择">
      <!-- <searchForm :search-items='searchItems'></searchForm> -->
      <p style="color:red;font-weight:600;font-size:14px;margin-bottom:5px;">产品下架或当日无价格，c端将无法展示和预览</p>
      <div class="search-warper" style="margin-bottom:5px;">
        <Input placeholder="产品名称" v-model="modelName" style="width: 180px"></Input>
        <Input placeholder="产品编码" v-model="modelCode" style="width: 180px"></Input>
        <Select placeholder="产品类型" v-model="prodType" style="width:200px">
          <!-- <Option value="">全部</Option> -->
          <Option value="ticket">景区门票</Option>
          <Option value="room">酒店住宿</Option>
          <Option value="mdse">特色商品</Option>
          <Option value="repast">餐饮餐券</Option>
          <Option value="route">跟团游</Option>
          <Option value="theater">剧院</Option>
          <Option value="strategy">攻略</Option>
          <Option value="family">套票</Option>
        </Select>
        <Button @click="getListData" type="primary">搜索</Button>
      </div>
      <Table
        :loading="tableLoading"
        height="350"
        ref="selection"
        @on-selection-change="selectChange"
        :columns="columns"
        :data="tableData"
      ></Table>
      <div style="height:15px"></div>
      <Page
        @on-change="getPage"
        @on-page-size-change="pageSizeChange"
        :current="page"
        :total="total"
        size="small"
        show-elevator
        show-sizer
      ></Page>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button @click="ok" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import imgUpload from "../../module/imgUpload";
import { apiPost } from "@/fetch/api";
import { mapState } from "vuex";
import productItem from "../../module/productItem";
export default {
  components: {
    draggable,
    imgUpload,
    productItem
  },
  created() {
    // console.log("prductg",this.$route)
    if (this.$route.name == "template-add-edit") {
      this.custompageTemplate = true;
    } else {
      this.custompageTemplate = false;
    }
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
    type() {
      return this.pageData.type;
    },
    limitNum() {
      return this.pageData.type == "productGroup1" ? 5 : 10;
    },
    pageData() {
      return this.list2[this.index].data;
    },
    ...mapState({
      list2: state => {
        //   console.log(state)
        return state.defined.list;
      },
      errorShow: state => {
        return state.defined.errorShow;
      }
    }),
    inputLength() {
      return this.pageData.type == "productGroup1" ? 6 : 8;
    }
  },
  watch: {
    type(val) {
      if (val == "productGroup1") {
        this.pageData.list.forEach((item, index) => {
          this.pageData.list[index].groupName = item.groupName.substring(0, 6);
        });
      } else {
        this.pageData.list.forEach((item, index) => {
          this.pageData.list[index].groupName = item.groupName.substring(0, 8);
        });
      }
    },
    limitNum(val, oldVal) {
      //数量限制改变的时候
      if (val == 5 && this.pageData.list.length > 5) {
        this.pageData.list = this.pageData.list.splice(0, 5);
      }
    }
  },
  data() {
    return {
      custompageTemplate: null, //是否自定义基础模板
      numCh: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
      prodType: "ticket",
      selections: [],
      editIndex: null,
      tableData: [],
      total: null,
      limit: 10,
      page: 1,
      modal: false,
      loading: true,
      tableLoading: false,
      modelName: "",
      modelCode: "",
      color1: "#fff",
      activeIndex: null, //需要设置图片的下标
      // pageData: this.data,
      disabledGroup: "fill",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品名称",
          key: "name"
        },
        {
          title: "产品别名",
          key: "nickName"
        },
        {
          title: "产品编码",
          key: "productCode"
        }
      ],
      model1: ""
    };
  },
  methods: {
    // inputFocus(index) {
    //   console.log(index)
    //   this.editIndex = index;
    // },
    // inputChange(str) {

    //   this.pageData.list[this.editIndex].name = str;
    // },
    remove(index, i) {
      this.pageData.list[index].data.splice(i, 1);
    },
    showModal(index) {
      this.modal = true;
      this.editIndex = index;
      this.getListData();
    },
    cancel() {
      this.modal = false;
    },
    ok() {
      // console.log(this.selections);
      //选中数量
      let selectionLength = this.selections.length;
      if (selectionLength > 0) {
        //当前数量
        let currenLength = this.pageData.list[this.editIndex].data.length;
        if (currenLength + selectionLength > 50) {
          this.$Message.warning(
            "已经选取了" +
              currenLength +
              "个产品，最多还能能选择" +
              (50 - currenLength) +
              "个产品"
          );
        } else {
          // <=50
          this.pageData.list[this.editIndex].data = this.pageData.list[
            this.editIndex
          ].data.concat(this.selections);
          let arr = [];
          this.selections.forEach(item => {
            arr.push({
              tagTitle: "",
              tagType: "type1"
            });
          });
          this.pageData.list[this.editIndex].textTagList = this.pageData.list[
            this.editIndex
          ].textTagList.concat(arr);
          this.$Message.success("添加成功!");
          this.modal = false;
          this.selections = [];
        }
      } else {
        this.$Message.warning("请选择产品");
      }
    },
    pageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getListData();
    },
    getPage(page) {
      this.page = page;
      this.getListData();
    },
    selectChange(selections) {
      this.selections = selections;
    },
    async getListData() {
      let _this = this;
      this.tableLoading = true;
      let arr = this.pageData.list[this.editIndex].data.map(item => {
        return item.productCode;
      });

      if (this.prodType == "ticket") {
        this.columns = [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "景区名称",
            key: "parkNickName"
          },
          {
            title: "产品名称",
            key: "name"
          },
          {
            title: "产品别名",
            key: "nickName"
          },
          {
            title: "产品编码",
            key: "productCode"
          },
          {
            title: "展示价",
            key: "priceShow",
            width: 80
          },
          {
            title: "店铺销量",
            width: 120,
            render: (h, params) => {
              return h(
                "span",
                params.row.businessType == "mdse"
                  ? params.row.virtualSale
                  : params.row.sellNum
              );
            }
          }
        ];
      } else if (this.prodType == "room") {
        this.columns = [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "酒店名称",
            key: "parkNickName"
          },
          {
            title: "产品名称",
            key: "name"
          },
          {
            title: "产品别名",
            key: "nickName"
          },
          {
            title: "产品编码",
            key: "productCode"
          },
          {
            title: "展示价",
            key: "priceShow",
            width: 80
          },
          {
            title: "店铺销量",
            width: 120,
            render: (h, params) => {
              return h(
                "span",
                params.row.businessType == "mdse"
                  ? params.row.virtualSale
                  : params.row.sellNum
              );
            }
          }
        ];
      } else if (this.prodType == "mdse") {
        this.columns = [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "产品名称",
            key: "name"
          },
          {
            title: "产品别名",
            key: "nickName"
          },
          {
            title: "产品编码",
            key: "productCode"
          },
          {
            title: "展示价",
            key: "priceShow",
            width: 80
          },
          {
            title: "店铺销量",
            width: 120,
            render: (h, params) => {
              return h(
                "span",
                params.row.businessType == "mdse"
                  ? params.row.virtualSale
                  : params.row.sellNum
              );
            }
          }
        ];
      } else if (this.prodType == "repast") {
        //餐饮
        this.columns = [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "餐券名称",
            key: "name"
          },
          {
            title: "餐券编码",
            key: "productCode"
          },
          {
            title: "展示价",
            key: "priceShow",
            width: 80
          },
          {
            title: "餐券销量",
            render: (h, params) => {
              return h(
                "span",
                params.row.businessType == "repast"
                  ? params.row.virtualSale
                  : params.row.sellNum
              );
            }
          }
        ];
      } else if (this.prodType == "route") {
        //线路
        this.columns = [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "跟团游名称",
            key: "name"
          },
          {
            title: "跟团游编码",
            key: "productCode"
          },
          {
            title: "展示价",
            key: "parkPriceShow",
            width: 80
          },
          {
            title: "跟团游销量",
            render: (h, params) => {
              return h(
                "span",
                params.row.businessType == "route"
                  ? params.row.virtualSale
                  : params.row.sellNum
              );
            }
          }
        ];
      } else {
        this.columns = [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "产品名称",
            key: "name"
          },
          {
            title: "产品别名",
            key: "nickName"
          },
          {
            title: "产品编码",
            key: "productCode"
          }
        ];
      }

      await apiPost("/merchant/merchantPushInfo/productCustomGrid", {
        page: this.page,
        limit: this.limit,
        // prodType: this.prodType,
        sort: "createTime",
        order: "desc",
        prodType: this.prodType,
        modelName: this.modelName,
        modelCode: this.modelCode,
        filterCodes: arr.join(",")
      }).then(res => {
        
        this.tableData = res.rows;

        this.total = res.total;
        this.tableLoading = false;
      });
    },
    backgroundColorReset() {
      //背景颜色重置为#fff
      this.pageData.backgroundColor = "#fff";
    },
    textColorReset() {
      //背景颜色重置为#fff
      this.pageData.textColor = "#000";
    },
    typeSelect(val) {
      this.pageData.type = val;
    },
    handleMaxSize() {},
    handleFormatError() {},
    
    del(index) {
      this.pageData.list.splice(index, 1);
    },
    
    imgIndex(index) {
      this.activeIndex = index;
    },
    add() {
      this.pageData.list.push({
        groupName: "默认分组",
        subTitle: "",        
        // showName: "默认分组" + this.numCh[this.pageData.list.length],
        data: []
      });
    },
    getImg(obj) {
      if (obj && obj.imgUrl && (obj.index || obj.index == 0)) {
        this.data.imgArr.splice(obj.index, 1, obj.imgUrl);
      } else {
        console.warn("图片上传或者index问题");
      }
    },
    menuImgUrl(res, file){
      this.pageData.menuBgUrl = res.prefix + res.url;      
    },
    menuBgUrlDel(){
      this.pageData.menuBgUrl = '';
    }
  }
};
</script>
<style lang='scss'>
.productgroup-edit-box {
  .s-p {
    padding: 5px;
  }
  .product-group-item {
    border: 1px solid #d7d7d7;
    padding: 4px;
    margin-bottom: 10px;
    position: relative;
    width: 95%;
    .del-icon {
      position: absolute;
      top: -11px;
      right: -9px;
      font-size: 18px;
      z-index: 888;
      color: #999;
      cursor: pointer;
    }
  }
  .img-text-list {
    .no-img-show {
      display: inline-block;
      height: 48px;
      line-height: 48px;
      width: 48px;
      background-color: rgba(215, 215, 215, 1);
      text-align: center;
      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .shop-info-img {
    // height: 75px;
    // width: 75px;
    height: 40px;
    width: 40px;
    // border: 1px solid red;
    position: relative;
    .img-up {
      border: 1px solid #d7d7d7;
      height: 75px;
      width: 75px;
      text-align: center;
      line-height: 75px;
      color: #3BB4F2;
      cursor: pointer;
      .ivu-upload.ivu-upload-select {
        width: 100%;
      }
    }
    .img-up.error{
      border-color: red;
      color: red;
    }
    .img-show {
      width: 100%;
      height: 100%;
    }
    .cover-del {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      text-align: center;
      // line-height: 75px;
      .del-svg {
        color: #fff;
        font-size: 24px;
        padding: 10px;
        cursor: pointer;
        margin-top: 0
      }
    }
  }
  .shop-info-img:hover .cover-del {
    display: block;
  }
}
</style>

