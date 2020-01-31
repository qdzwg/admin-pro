<template>
  <div class="component-name-list">
    <!-- <button @click="test">test</button> -->
    <h3 class="component-title">
      产品分组编辑
    </h3>
    <div v-if="dataList.length<4" class="handle-div">
      <Button @click="addGroup">新增产品分组</Button>
    </div>
    <draggable v-model="dataList">
      <div v-for="(item,index) in dataList" class="productList-warper" :key="index">
        <Icon @click="productGroupDel(index)" type="close-circled" class="productList-del"></Icon>
        <table class="product-group-table">
          <tr>
            <td>分组名称：</td>
            <td>
              <Input v-model="item.groupName"></Input>
            </td>
          </tr>
          <tr>
            <td>分组类型：</td>
            <td>
              <Select @on-change="clearProduct(index)" v-model="item.type" style="width:200px">
                <Option value="ticket">景区门票</Option>
                <Option value="room">酒店住宿</Option>
                <Option value="mdse">特色商品</Option>
                <Option value="repast">餐饮餐券</Option>
                <Option value="route">跟团游</Option>
              </Select>
            </td>
          </tr>
          <tr>
            <td>已选产品：</td>
            <td>
              <Button v-if="item.data.length<6" class="addProduct" @click="addProduct(index,item.type)" size="small" type="primary">添加产品</Button>
              <Row class="product-list">
                <draggable v-model="item.data">
                  <Col v-for="(it,i) in item.data" :key="i" span="6">
                  <div class="product-list-item">
                    <div class="product-item">
                      <span @click="productDel(index,i)" class="product-item-del">x</span>
                      <img class="product-item-img" :src="it.linkMobileImg" alt="">
                      <div class="product-name">
                        <!-- {{it.parkNickName}}{{it.name}}{{it.nickName}} -->
                        <!-- <span v-if='it.businessType=="ticket"'>{{(it.nickName||it.name)?filter.cutstr(it.nickName||it.name,26):''}}</span> -->
                        <!-- {{((it.parkNickName?it.parkNickName:'') + ((it.name||it.nickName)?(it.name||it.nickName):''))}} -->
                        <!-- <span v-if='it.businessType=="room"'>{{(it.nickName||it.name)?filter.cutstr(it.nickName||it.name,26):''}}</span> -->
                        <!-- <span v-if='it.businessType=="mdse"'>{{(it.nickName||it.name)?filter.cutstr(it.nickName||it.name,26):''}}</span> -->
                        <span>{{(it.nickName||it.name)?filter.cutstr(it.nickName||it.name,15):''}}</span>
                      </div>
                    </div>
                  </div>
                  </Col>
                </draggable>
              </Row>
            </td>
          </tr>
        </table>
      </div>
    </draggable>
    <!-- 弹出层 -->
    <Modal width="800px" v-model="modal" :loading="loading" title="产品选择">
      <!-- <searchForm :search-items='searchItems'></searchForm> -->
      <p style="color:red;font-weight:600;font-size:14px;margin-bottom:5px;">产品下架或当日无价格，c端将无法展示和预览</p>
      <div class="search-warper">
        <Input placeholder="产品名称" v-model="modelName" style="width: 180px"></Input>
        <Input placeholder="产品编码" v-model="modelCode" style="width: 180px"></Input>
        <Button @click="getListData" type="primary">搜索</Button>
      </div>
      <Table :loading='tableLoading' height="350" ref="selection" @on-selection-change="selectChange" :columns="columns" :data="data"></Table>
      <div style="height:15px"></div>
      <Page @on-change="getPage" @on-page-size-change='pageSizeChange' :current='page' :total="total" size="small" show-elevator show-sizer></Page>
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
export default {
  props: {
    index: {
      type: Number
    },
    productList: {
      type: Array
    }
  },
  data() {
    return {
      limit: 10,
      tableLoading: false,
      total: null,
      // productList: this.indexProductGroupDataList,
      dataList: this.productList,
      modelName: "",
      modelCode: "",
      prodType: "",
      page: 1,
      item: {},
      selections: [],
      modal: false,
      loading: true,
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
          title: "产品编码",
          key: "productCode"
        },
        {
          title: "展示价",
          key: "priceShow",
          width: 80
        },
        {
          title: "已售票数",
          width: 120,
          key: "sellNum"
        }
      ],
      data: [],
      groupIndex: null
    };
  },
  watch: {
    dataList: {
      handler(val, oldVal) {
        this.$emit("indexProductGroupData", val, this.index);
      },
      deep: true
    }
  },
  methods: {
    pageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getListData();
    },
    productGroupDel(index) {
      this.dataList.splice(index, 1);
    },
    clearProduct(index) {
      this.dataList[index].data = [];
    },
    addGroup() {
      this.dataList.push({
        groupName: "默认名称",
        type: "ticket",
        data: []
      });
    },
    selectChange(selections) {
      this.selections = selections;
    },
    addProduct(index, type) {
      // console.log(type)
      if (type == "ticket") {
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
      } else if (type == "room") {
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
      } else if (type == "mdse") {
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
      } else if (type == "repast") {
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
      } else if (type == "route") {
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
        this.$Message.warning("请确定类别");
        return false;
      }
      this.modelName = "";
      this.modelCode = "";
      this.prodType = type;
      this.groupIndex = index;
      this.page = 1;
      this.limit = 10;
      // this.getListData();
      this.modal = true;
      this.getListData();
      this.$refs.selection.selectAll(false);
    },
    getPage(page) {
      this.page = page;
      this.getListData();
    },
    async getListData() {
      let _this = this;
      this.tableLoading = true;
      await apiPost("/merchant/merchantPushInfo/productCustomGrid", {
        page: this.page,
        limit: this.limit,
        sort: "createTime",
        order: "desc",
        prodType: this.prodType,
        modelName: this.modelName,
        modelCode: this.modelCode
      }).then(res => {
        // this.dataList[this.groupIndex].data.some(item => {
        //   res.rows.forEach(el => {
        //     if (el.productId == item.productId) {
        //       el._checked = true;
        //     }
        //   });
        // });
        res.rows = res.rows.filter(ele => {
          return !_this.dataList[this.groupIndex].data.some(item => {
            return ele.productId == item.productId;
          });
        });
        this.data = res.rows;
        this.total = res.total;
        this.tableLoading = false;
      });
    },
    ok() {
      // 已选 + 现选
      var length =
        this.dataList[this.groupIndex].data.length + this.selections.length;
      if (length > 6) {
        if (this.dataList[this.groupIndex].data.length > 0) {
          this.$Message.warning(
            "已经选取了" +
              this.dataList[this.groupIndex].data.length +
              "个产品，最多还能能选择" +
              (6 - this.dataList[this.groupIndex].data.length) +
              "个产品"
          );
        } else {
          this.$Message.warning("最多只能选择6个产品");
        }
      } else {
        // 添加成功!
        this.dataList[this.groupIndex].data = this.dataList[
          this.groupIndex
        ].data.concat(this.selections);
        this.modal = false;
      }
    },
    cancel() {
      this.modal = false;
    },
    productDel(index, i) {
      this.dataList[index].data.splice(i, 1);
    }
  },
  components: {
    draggable
  }
};
</script>
<style scoped lang="scss">
.search-warper {
  margin-bottom: 15px;
}
.handle-div {
  margin-bottom: 15px;
}
.img-list {
  margin-bottom: 15px;
}
.product-list {
  // width: 280px;
}
.product-list-item {
  .product-item {
    height:115px;
    border: 1px solid #dddee1;
    position: relative;
    .product-item-del {
      position: absolute;
      font-size: 1px;
      cursor: pointer;
      top: -8px;
      right: -8px;
      display: none;
      padding: 0 6px;
      border-radius: 50%;
      background: #999;
      color: #ffffff;
    }
  }
  .product-item:hover {
    .product-item-del {
      display: inline-block;
    }
  }
  .product-del {
    font-size: 18px;
    cursor: pointer;
  }
  padding: 15px;
  .product-item-img {
    // float: left;
    width: 100%;
    height: 65px;
  }
  .product-name {
    padding: 3px 5px;
  }
}
.product-group-table {
//   border: 1px solid #dddee1;
  margin-bottom: 15px;
  width: 100%;
  tr {
    td {
      padding: 10px 5px;
    }
    td:first-child {
      width: 75px;
      text-align: right;
    }
  }
}
.addProduct {
  margin-left: 15px;
}
.productList-warper {
  position: relative;
  .productList-del {
    position: absolute;
    top: -13px;
    right: -8px;
    font-size: 24px;
    z-index: 999;
    cursor: pointer;
    display: none;
  }
}
.productList-warper:hover {
  .productList-del {
    display: inline-block;
  }
}
</style>

