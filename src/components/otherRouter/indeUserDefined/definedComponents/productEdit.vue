<template>
  <div class="component-name-list">
    <!-- <button @click="test">test</button> -->
    <h3 class="component-title">产品编辑
    </h3>
    <!-- <div class="handle-div">
                   <Button @click="addGroup">新增产品</Button>
                </div> -->

    <div class="productList-warper">
      <table class="table">
        <tr>
          <td>标题：</td>
          <td>
            <Input v-model="productData.title"></Input>
          </td>
        </tr>
        <tr>
          <td>已选产品：</td>
          <td>
            <Button v-if="productData.list.length<5" @click="addProduct" class="addProduct" size="small" type="primary">添加产品</Button>
            <Row class="product-list">
              <draggable v-model="productData.list">
                <Col v-for="(item,index) in productData.list" :key="index" span="8">
                <div class="product-list-item">
                  <div class="product-item">
                    <span @click="del(index)" class="product-item-del">x</span>
                    <img class="product-item-img" :src="item.linkMobileImg" alt="">
                    <div class="product-name">
                      <template v-if='productType=="Product__normal"'>
                        <span>{{(item.nickName||item.name)?(item.nickName||item.name):''}}</span>
                      </template>
                      <template v-if='productType=="Product__normal2"'>
                        <span v-if='item.businessType=="ticket"'>{{item.parkNickName?item.parkNickName:''}}</span>
                        <span v-if='item.businessType=="room"'>{{item.parkNickName?item.parkNickName:''}}</span>
                        <span v-if='item.businessType=="mdse"'>{{(item.nickName||item.name)?(item.nickName||item.name):''}}</span>
                        <span v-if='item.businessType=="repast"'>{{(item.nickName||item.name)?(item.nickName||item.name):''}}</span>
                        <span v-if='item.businessType=="route"'>{{item.parkNickName?item.parkNickName:''}}</span>
                      </template>

                      <!-- <Icon @click="del(index)" class="product-del" type="ios-trash">删除</Icon> -->
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
    <!-- 弹出层 -->
    <Modal width="800px" v-model="modal" :loading="loading" title="产品选择">
      <p style="color:red;font-weight:600;font-size:14px;margin-bottom:5px;">产品下架或当日无价格，c端将无法展示和预览</p>
      <div class="search-warper">
        <Input placeholder="产品名称" v-model="modelName" style="width: 180px"></Input>
        <Input placeholder="产品编码" v-model="modelCode" style="width: 180px"></Input>
        <Select v-model="prodType" style="width:200px">
          <Option value="ticket">景区门票</Option>
          <Option value="room">酒店住宿</Option>
          <Option value="mdse">特色商品</Option>
          <Option value="repast">餐饮餐券</Option>
          <Option value="route">跟团游</Option>
          <Option value="family">套票</Option>
        </Select>
        <Button @click="getListData" type="primary">搜索</Button>
      </div>
      <Table height='350' :loading='tableLoading' ref="selection" @on-selection-change="selectChange" :columns="columns" :data="data"></Table>
      <div style="height:15px"></div>
      <Page @on-change="getPage" :page-size='limit' @on-page-size-change='pageSizeChange' :current='page' :total="total" size="small" show-elevator show-sizer></Page>
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
    productType: {
      type: String
    },
    index: {
      type: Number
    },
    productData: {
      type: Object
    }
  },
  data() {
    return {
      tableLoading: false,
      total: null,
      page: 1,
      limit: 10,
      modelName: "",
      modelCode: "",
      prodType: "ticket",
      selections: [],
      modal: false,
      loading: true,
      searchItems: [
        {
          label: "产品名称",
          type: "input",
          name: "name"
        },
        {
          label: "产品类型",
          type: "select",
          name: "payKey",
          data: [
            {
              value: "key1",
              label: "景区门票"
            },
            {
              value: "key2",
              label: "酒店住宿"
            },
            {
              value: "key3",
              label: "特色商品"
            }
          ]
        }
      ],
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
          title: "店铺销量",
          width: 120,
          render: (h, params) => {
            // console.log(params);
            return h(
              "span",
              params.row.businessType == "mdse"
                ? params.row.virtualSale
                : params.row.sellNum
            );
          }
        }
      ],
      data: [],
      groupIndex: null
    };
  },
  watch: {
    productData: {
      handler(val, oldVal) {
        this.$emit("indexProductUpData", val, this.index);
      },
      deep: true
    }
  },
  methods: {
    pageSizeChange(pageSize) {
      this.limit = pageSize;
      this.getListData();
    },
    selectChange(selections) {
      this.selections = selections;
    },
    addProduct() {
      this.modal = true;
      this.page = 1;
      this.limit = 10;
      this.prodType = "ticket";
      this.modelName = "";
      this.modelCode = "";
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
        this.$Message.warning("请确定类别");
        return false;
      }
      await apiPost("/merchant/merchantPushInfo/productCustomGrid", {
        page: this.page,
        limit: this.limit,
        sort: "createTime",
        order: "desc",
        prodType: this.prodType,
        modelName: this.modelName,
        modelCode: this.modelCode
      }).then(res => {
        res.rows = res.rows.filter(ele => {
          return !_this.productData.list.some(item => {
            return ele.productId == item.productId;
          });
        });
        this.data = res.rows;
        this.total = res.total;
        this.tableLoading = false;
      });
    },
    ok() {
      let length = this.productData.list.length + this.selections.length;
      if (length > 5) {
        if (this.productData.list.length > 0) {
          this.$Message.warning(
            "已经选取了" +
              this.productData.list.length +
              "个产品，最多还能能选择" +
              (5 - this.productData.list.length) +
              "个产品"
          );
        } else {
          this.$Message.warning("最多只能选择5个产品");
        }
      } else {
        this.modal = false;
        this.productData.list = this.productData.list.concat(this.selections);
      }
    },
    del(index) {
      this.productData.list.splice(index, 1);
    },
    cancel() {
      this.modal = false;
    }
  },
  components: {
    draggable
  }
};
</script>
<style scoped lang="scss">
.handle-div {
  margin-bottom: 15px;
}
.img-list {
  margin-bottom: 15px;
}
.product-list {
  width: 420px;
}
.product-list-item {
  height: 160px;
  .product-item {
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
    height: 70px;
  }
  .product-name {
    padding: 3px 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.table {
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
.search-warper {
  margin-bottom: 15px;
}
</style>

