<template>
  <div class="product-edit-box">
    <!-- {{pageData}} -->
    <div>温馨提示：请注意组件绑定产品发生下架、删除或禁用店铺分销渠道时，店铺将不再展示该产品</div>
    <div class="s-p">
      <table class="edit-table">
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
            </RadioGroup>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: top;width:85px" class="title">
            <!-- <span class="red">*</span> -->
            <Checkbox @on-change="checkChange" v-model="pageData.productTagShow"></Checkbox>产品标签
          </td>
          <td>
            <RadioGroup v-if="pageData.productTagShow" v-model="pageData.productTag">
              <Radio label="fine">
                <span>精品</span>
              </Radio>
              <Radio label="type1">
                <span>特惠</span>
              </Radio>
              <Radio label="type2">
                <span>热销</span>
              </Radio>
              <Radio label="type3">
                <span>新品</span>
              </Radio>
              <Radio label="type4">
                <span>自定义</span>
              </Radio>
            </RadioGroup>

            <div class="img-edit-box" v-if="pageData.productTag=='type4'">
              <div class="img-cover-box" v-if="pageData.tagUrl">
                <img style="height:60px;width:100px;" :src="pageData.tagUrl" alt />
                <div class="tag-cover">
                  <Icon class="trash-icon" @click="delTagUrl" type="ios-trash-outline"></Icon>
                </div>
              </div>
              <div v-else class="tag-up-box">
                <Upload
                  :format="['jpg','jpeg','png']"
                  :on-success="setImgUrl"
                  :show-upload-list="false"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  action="/static/manage/uiFileUpload/dispatch?action=upload"
                >
                  <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>
                  <span class="text">添加图片</span>
                </Upload>
              </div>
              <p>推荐上传36*36px的pns格式图片</p>
            </div>
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
              <!-- <Checkbox label="sellNum">
                <span>销量</span>
              </Checkbox> -->
            </CheckboxGroup>
          </td>
        </tr>
      </table>
    </div>

    <div v-if="!custompageTemplate" class="product-group-item">
      <table class="edit-table">
        <tr>
          <td class="title">已选产品</td>
          <td>
            <Button
              v-if="pageData.list.length<50"
              @click="showModal"
              type="primary"
              size="small"
            >关联产品</Button>
          </td>
        </tr>
      </table>
      <product-item  :itemdata="pageData"></product-item>
    </div>
    <!-- <div class="notice">
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
import { apiPost } from "@/fetch/api";
import { mapState } from "vuex";
import productItem from "../../module/productItem";
export default {
  components: {
    draggable,
    productItem
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
    })
  },
  created() {
    // console.log("prductg",this.$route)
    if (this.$route.name == "template-add-edit") {
      this.custompageTemplate = true;
    } else {
      this.custompageTemplate = false;
    }
  },
  data() {
    return {
      custompageTemplate: null,
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
    checkChange(falg) {
      if (!falg) {
        this.pageData.productTag = "";
        this.pageData.tagUrl = "";
      }
    },
    delTagUrl() {
      this.pageData.tagUrl = "";
    },
    setImgUrl(res, file) {
      this.pageData.tagUrl = res.prefix + res.url;
    },
    // inputFocus(index) {
    //   console.log(index)
    //   this.editIndex = index;
    // },
    // inputChange(str) {

    //   this.pageData.list[this.editIndex].name = str;
    // },
    remove(index) {
      this.pageData.list.splice(index, 1);
    },
    showModal(index) {
      this.modal = true;
      this.getListData();
    },
    cancel() {
      this.modal = false;
    },
    ok() {
      //选中数量
      let selectionLength = this.selections.length;
      if (selectionLength > 0) {
        //当前数量
        let currenLength = this.pageData.list.length;
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
          this.$Message.success("添加成功!");
          this.pageData.list = this.pageData.list.concat(this.selections);
          let arr = [];
          this.selections.forEach(item => {
            arr.push({
              tagTitle: "",
              tagType: "type1"
            });
          });
          this.pageData.textTagList = this.pageData.textTagList.concat(arr);
          this.selections = [];
          this.modal = false;
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
      let arr = this.pageData.list.map(item => {
        return item.productCode;
      });
      await apiPost("/merchant/merchantPushInfo/productCustomGrid", {
        page: this.page,
        limit: this.limit,
        prodType: this.prodType,
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
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "图片超过2M",
        desc: "图片：" + file.name + "太大， 不能超过2M"
      });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件： " + file.name + "格式错误, 请选择图片格式jpg,png上传"
      });
    },
    del(index) {
      this.pageData.list.splice(index, 1);
    },
    delImg(index) {
      this.pageData.list[index].picAddr = "";
    },
    imgIndex(index) {
      this.activeIndex = index;
    }
  }
};
</script>
<style lang='scss'>
.product-edit-box {
  .img-edit-box {
    margin-top: 10px;
    .tag-up-box {
      display: inline-block;
      height: 60px;
      width: 100px;
      text-align: center;
      line-height: 60px;
      border: 1px solid #d9d9d9;
      .text {
        margin-left: 5px;
      }
    }
    .img-cover-box {
      height: 60px;
      width: 100px;
      position: relative;
      .tag-cover {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        text-align: center;
        line-height: 60px;
        .trash-icon {
          color: #fff;
          font-size: 20px;
          padding: 10px;
          cursor: pointer;
        }
      }
    }
    .img-cover-box:hover {
      .tag-cover {
        display: block;
      }
    }
  }

  .s-p {
    padding: 5px;
  }
  .product-group-item {
    border: 1px solid #d7d7d7;
    padding: 4px;
    margin-bottom: 10px;
    position: relative;
    width: 100%;
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
}
</style>

