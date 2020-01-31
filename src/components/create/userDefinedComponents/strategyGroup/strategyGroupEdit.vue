<template>
  <div class="productgroup-edit-box">
    <!-- {{pageData}} -->
    <div class="s-p">
      <table class="edit-table">
        <tr>
          <td class="title">
            <span class="red">*</span>
            列表样式
          </td>
          <td>
            <RadioGroup v-model="pageData.listType">
              <Radio label="singleRow">
                <span>单列</span>
              </Radio>
              <Radio label="biserial">
                <span>双列</span>
              </Radio>
              <!-- <Radio label="sideslip">
                <span>横滑</span>
              </Radio>-->
            </RadioGroup>
          </td>
        </tr>
        <tr>
          <td class="title">
            排序规则
          </td>
          <td>
            <RadioGroup v-model="pageData.sortRule">
              <Radio label="defaultSort">
                <span>默认排序</span>
              </Radio>
              <Radio label="randomSort">
                <span>随机排序</span>
              </Radio>
            </RadioGroup>
          </td>
        </tr>
        <tr>
          <td class="title">选中颜色</td>
          <td>
            <ColorPicker v-model="pageData.activeColor" />
            <Input v-model="pageData.activeColor" placeholder="请填写颜色" style="width:100px"></Input>
            <Button @click="activeColorReset" type="primary" size="small">重置</Button>
          </td>
        </tr>
        <!-- <tr>
          <td class="title">
            <span class="red">*</span>
            模板样式
          </td>
          <td>
            <div class="type-select">

              <Col span="8">
                <div
                  class="type-item clearfix"
                  @click="typeSelect('productGroup1')"
                  :class="{active:pageData.type=='productGroup1'}"
                >
                  <div class="type-item-box">顶部菜单</div>
                </div>
              </Col>
              <Col span="8">
                <div
                  class="type-item clearfix"
                  @click="typeSelect('productGroup2')"
                  :class="{active:pageData.type=='productGroup2'}"
                >
                  <div class="type-item-box">左侧菜单</div>
                </div>
              </Col>
            </div>
          </td>
        </tr>-->
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
              <!-- <Radio label="type2">
                <span>样式二</span>
              </Radio>
              <Radio label="type3">
                <span>样式三</span>
              </Radio>-->
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
                <Radio label="normal">
                  <span>正常模式</span>
                </Radio>
                <Radio label="autoTop">
                  <span>自动吸顶</span>
                </Radio>
              </RadioGroup>
            </td>
          </tr>
          <tr>
            <td class="title">文字展示</td>
            <td>
              <RadioGroup v-model="pageData.showText">
                <Radio label="name">名称</Radio>
                <Radio label="time">发布时间</Radio>
              </RadioGroup>
            </td>
          </tr>
          <!-- <tr>
            <td class="title">文字位置</td>
            <td>
              <RadioGroup v-model="pageData.position">
                <Radio label="lb">左下角</Radio>
                <Radio label="lt">左上角</Radio>
              </RadioGroup>
            </td>
          </tr>-->
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
              <Input size="small" :maxlength="inputLength" v-model.trim="item.groupName"></Input>
            </td>
          </tr>
          <tr v-if="!custompageTemplate">
            <td>已选攻略</td>
            <td>
              <Button
                @click="showModal(index)"
                type="primary"
                v-if="item.dataList&&item.dataList.length<50"
                size="small"
              >关联攻略</Button>
            </td>
          </tr>
        </table>

        <strategy-item :data="pageData.list[index]"></strategy-item>
      </div>
    </draggable>
    <Button v-if="pageData.list&&pageData.list.length<limitNum" @click="add" long>
      <Icon class="add-icon" type="ios-plus-outline" color="#3BB4F2" size="14"></Icon>添加一个攻略分组
    </Button>

    <strategy-modal ref="productModal" v-model="show" @selectProduct="getProduct"></strategy-modal>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { apiPost } from "@/fetch/api";
import strategyModal from "../../module/strategyModal";
import strategyItem from "../../module/strategyItem";
import { mapState } from "vuex";
export default {
  components: {
    draggable,
    strategyModal,
    strategyItem
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
      return this.pageData.type == "productGroup1" ? 4 : 10;
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
    })
    // inputLength() {
    //   return this.pageData.type == "productGroup1" ? 6 : 8;
    // }
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
      if (val == 4 && this.pageData.list.length > 4) {
        this.pageData.list = this.pageData.list.splice(0, 4);
      }
    }
  },
  data() {
    return {
      inputLength: 3,
      show: false,
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
    activeColorReset() {
      //线条颜色重置为#999
      this.pageData.activeColor = "#f05b47";
    },
    getProduct(arr) {
      let item = this.pageData.list[this.editIndex];
      let initArr = new Array(arr.length).fill([]);
      let initImgArr = new Array(arr.length).fill("");
      item.tagArr = item.tagArr.concat(initArr);
      item.imgArr = item.imgArr.concat(initImgArr);
      item.dataList = item.dataList.concat(arr);
    },
    remove(index, i) {
      this.pageData.list[index].dataList.splice(i, 1);
    },
    showModal(index) {
      this.show = true;
      // console.log( this.pageData.list[index])

      let arr = this.pageData.list[index].dataList.map(
        item => item.merchantStrategyId
      );
      this.$refs.productModal.filterIds = arr;
      this.editIndex = index;
      // this.getListData();
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
        let currenLength = this.pageData.list[this.editIndex].dataList.length;
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
          this.pageData.list[this.editIndex].dataList = this.pageData.list[
            this.editIndex
          ].dataList.concat(this.selections);
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
      let arr = this.pageData.list[this.editIndex].dataList.map(item => {
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
        // this.dataList[this.groupIndex].data.some(item => {
        //   res.rows.forEach(el => {
        //     if (el.productId == item.productId) {
        //       el._checked = true;
        //     }
        //   });
        // });
        // res.rows = res.rows.filter(ele => {
        //   return !_this.pageData.list[this.editIndex].data.some(item => {
        //     return ele.productId == item.productId;
        //   });
        // });
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
    setImgUrl(res, file) {
      this.pageData.list[this.activeIndex].picAddr = res.prefix + res.url;
    },
    del(index) {
      this.pageData.list.splice(index, 1);
    },
    delImg(index) {
      this.pageData.list[index].picAddr = "";
    },
    imgIndex(index) {
      this.activeIndex = index;
    },
    add() {
      this.pageData.list.push({
        groupName: "组名",
        dataList: [],
        imgArr: [],
        tagArr: []
      });
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
  // .img-text-list {
  //   .no-img-show {
  //     display: inline-block;
  //     height: 48px;
  //     line-height: 48px;
  //     width: 48px;
  //     background-color: rgba(215, 215, 215, 1);
  //     text-align: center;
  //     .img {
  //       width: 100%;
  //       height: 100%;
  //     }
  //   }
  //   .product-name {
  //     margin-top: 7px;
  //     margin-left: 5px;
  //     display: inline-block;
  //     height: 48px;
  //     .product-name-content {
  //       height: 35px;
  //       width: 220px;
  //       vertical-align: middle;
  //       border: 1px solid #d7d7d7;
  //       display: inline-block;
  //       padding: 8px;
  //       position: relative;
  //       .name {
  //         width: 150px;
  //         overflow: hidden;
  //         text-overflow: ellipsis;
  //         white-space: nowrap;
  //         display: inline-block;
  //       }
  //       .remove {
  //         position: absolute;
  //         display: inline-block;
  //         height: 34px;
  //         width: 48px;
  //         line-height: 34px;
  //         text-align: center;
  //         background: #2d8cf0;
  //         right: 0px;
  //         top: 0px;
  //         color: #fff;
  //       }
  //     }
  //   }
  // }
}
</style>

