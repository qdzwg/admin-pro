<template>
  <div class="recommend-edit">
    <div class="form-title">
      <p class="name">已选城市</p>
      <Button
        type="primary"
        icon="android-add"
        @click="addCityAndScenic('city')"
        >添加城市</Button
      >
    </div>
    <select-list :tagNameList="selectCity"></select-list>
    <div class="form-title">
      <p class="name">已选景区</p>
      <Button
        type="primary"
        icon="android-add"
        @click="addCityAndScenic('scenic')"
        >添加景区</Button
      >
    </div>
    <select-list :tagNameList="selectScenic"></select-list>
    <div class="form-title">
      <p class="name">已选产品</p>
      <Button type="primary" icon="android-add" @click="addProduct"
        >添加产品</Button
      >
    </div>
    <pushCom
      v-model="pushFlag"
      :cityList="cityList"
      :scenicList="scenicList"
      :type="pushType"
      @get-data="getCityScenic"
    ></pushCom>
    <product-list
      v-model="originFlag"
      :type="originType"
      :searchItems="searchItems"
      :productList="productList"
      @get-data="getProduct"
    ></product-list>
    <Form
      class="search-wrap"
      ref="formInline"
      v-if="searchItems.length"
      :model="searchForm"
      inline
    >
      <FormItem v-for="(item, index) in searchItems" :key="index">
        <Input
          v-if="item.type == 'input'"
          v-model="searchForm[item.name]"
          :placeholder="'请输入' + item.label"
        ></Input>
        <Select
          v-if="item.type == 'select'"
          v-model="searchForm[item.name]"
          style="width:180px"
          :placeholder="'请选择' + item.label"
        >
          <Option
            v-for="sitem in item.data"
            :value="sitem.value"
            :key="sitem.value"
            >{{ sitem.label }}</Option
          >
        </Select>
      </FormItem>
      <Button type="primary" icon="ios-search" @click="_handleSubmit"
        >搜索</Button
      >
      <Button type="primary" icon="trash-a" @click="deleteFun">删除</Button>
    </Form>
    <Table
      :columns="columns"
      :data="showTable"
      @on-selection-change="changTable"
    ></Table>
    <div class="btn-wrap">
      <Button type="primary" @click="submit">保存</Button>
      <Button type="ghost" @click="cancelFun" style="margin-left: 8px"
        >关闭</Button
      >
    </div>
  </div>
</template>

<script>
import selectList from "./components/selectList.vue";
import pushCom from "./components/pushCom.vue";
import productList from "./components/productList.vue";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: { selectList, pushCom, productList },
  props: {},
  data() {
    return {
      selectCity: [],
      selectScenic: [],
      allProduct: [],
      showTable: [],
      selectProduct: [],
      tagNameList: [{ name: "21" }],
      pushFlag: false,
      pushType: "city",
      originFlag: false,
      originType: "bind",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品类型",
          key: "productType",
          render: (h, params) => {
            let { productType } = params.row;
            return h("span", this.$flType(productType, this.productList));
          }
        },
        {
          title: "景区名称",
          key: "productParkName"
        },
        {
          title: "商户名称",
          key: "productMchName"
        },
        {
          title: "产品名称",
          key: "productName"
        }
      ],
      searchItems: [
        {
          label: "产品名称",
          type: "input",
          name: "productName"
        },
        {
          label: "商户名称",
          type: "input",
          name: "productMchName"
        },
        {
          label: "景区名称",
          type: "select",
          name: "productParkId",
          data: []
        },
        {
          label: "产品类型",
          type: "select",
          name: "productType",
          data: []
        }
      ],
      searchForm: {
        productName: "",
        productMchName: "",
        productParkId: "",
        productType: ""
      }
      // recommendedProducts: []
    };
  },
  watch: {
    scenicList: function(val) {
      let list = this.cloneDeep(val);
      list.unshift({ value: "", label: "全部" });
      this.searchItems[2].data = list;
    },
    productList: function(val) {
      let list = this.cloneDeep(val);
      list.unshift({ value: "", label: "全部" });
      this.searchItems[3].data = list;
    }
  },
  computed: {
    ...mapState("recommend", ["cityList", "scenicList", "productList"])
  },
  methods: {
    ...mapActions("recommend", ["getScenicAndCity"]),
    getProduct(data) {
      let allProduct = this.allProduct;
      for (let i = 0; i < data.length; i++) {
        let flag = allProduct.some(sle => {
          return sle.productId == data[i].productId;
        });
        if (flag) {
          break;
        } else {
          allProduct.unshift(data[i]);
        }
      }
      this.originFlag = false;
      this._handleSubmit();
    },
    getCityScenic(data) {
      if (this.pushType == "city") {
        data.forEach(item => {
          let info = this.cityList.find(cur => {
            return cur.value == item;
          });
          let flag = this.selectCity.some(sle => {
            return sle.id == item;
          });
          if (!flag) {
            this.selectCity.push({ name: info.label, id: info.value });
          }
        });
      } else if (this.pushType == "scenic") {
        data.forEach(item => {
          let info = this.scenicList.find(cur => {
            return cur.value == item;
          });
          let flag = this.selectScenic.some(sle => {
            return sle.id == item;
          });
          if (!flag) {
            this.selectScenic.push({ name: info.label, id: info.value });
          }
        });
      }
      this.pushFlag = false;
    },
    addCityAndScenic(type) {
      this.pushFlag = true;
      this.pushType = type;
    },
    addProduct() {
      this.originFlag = true;
    },
    changTable(list) {
      this.selectProduct = list;
    },

    _handleSubmit() {
      let {
        productName,
        productMchName,
        productParkId,
        productType
      } = this.searchForm;
      if (!this.allProduct.length) return;
      let list = this.cloneDeep(this.allProduct);
      if (productName) {
        list = this.allProduct.filter(item => {
          return item.productName == productName;
        });
      }
      if (productMchName && list.length) {
        list = list.filter(item => {
          return item.productMchName == productMchName;
        });
      }
      if (productParkId && list.length) {
        list = list.filter(item => {
          return item.productParkId == productParkId;
        });
      }
      if (productType && list.length) {
        list = list.filter(item => {
          return item.productType == productType;
        });
      }
      this.showTable = list;
    },
    deleteFun() {
      if (!this.selectProduct.length) {
        this.$Message.warning("请选择要操作的数据！");
      }
      let showTable = this.showTable;
      let allProduct = this.allProduct;
      let selectList = this.selectProduct;
      selectList.forEach(item => {
        let productId = item.productId;
        for (let i = 0; i < allProduct.length; i++) {
          if (allProduct[i].productId == productId) {
            allProduct.splice(i, 1);
            --i;
          }
        }
      });
      selectList.forEach(item => {
        let productId = item.productId;
        for (let i = 0; i < showTable.length; i++) {
          if (showTable[i].productId == productId) {
            showTable.splice(i, 1);
            --i;
          }
        }
      });
    },
    submit() {
      let cities = this.selectCity
        .map(item => {
          return item.id;
        })
        .join(",");
      let parks = this.selectScenic
        .map(item => {
          return item.id;
        })
        .join(",");
      let params = {
        recommendedInfoId: this.id,
        cities: cities,
        parks: parks,
        // recommendedProducts: JSON.stringify(this.recommendedProducts),
        products: JSON.stringify(this.allProduct)
      };
      this.apiPost("/product/api/recommend/rebind", params).then(res => {
        if (res.status == 200) {
          this.$router.go(-1);
          res.message && this.$Message.success(res.message);
        } else {
          res.message && this.$Message.wraning(res.message);
        }
      });
    },
    cancelFun() {
      this.$router.go(-1);
    }
  },
  created() {
    this.getScenicAndCity();
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      let id = to.query.id;
      vm.id = id;
      let info = await vm.apiPost("/product/api/recommend/info", {
        recommendedProductId: id
      });
      if (info.status == 200) {
        let data = info.data;
        if (data.hasOwnProperty("cities")) {
          vm.selectCity = data.cities.map(item => {
            let { id, cityName: name } = item;
            return { id, name };
          });
        }
        if (data.hasOwnProperty("parks")) {
          vm.selectScenic = data.parks.map(item => {
            let { id, name } = item;
            return { id, name };
          });
        }
        if (data.hasOwnProperty("products")) {
          let list = data.products.map(item => {
            let {
              productMchCode,
              productMchId,
              productMchName,
              productParkId,
              productParkName,
              productCode,
              productId,
              productName,
              productType
            } = item;
            return {
              productMchCode,
              productMchId,
              productMchName,
              productParkId,
              productParkName,
              productCode,
              productId,
              productName,
              productType
            };
          });
          vm.allProduct = vm.cloneDeep(list);
          vm.showTable = vm.cloneDeep(list);
          let {
            recommendedProductCode,
            recommendedProductId,
            recommendedProductType
          } = data.products[0];
          // vm.recommendedProducts = [
          //   {
          //     id: id,
          //     recommendedProductCode,
          //     recommendedProductId,
          //     recommendedProductType
          //   }
          // ];
        }
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.recommend-edit {
  .form-title {
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid rgba(100, 182, 255, 1);
    font-size: 16px;
    display: flex;
    align-items: center;
    .name {
      margin-right: 16px;
    }
  }
  .search-wrap {
    padding-top: 10px;
  }
  .btn-wrap {
    padding-top: 20px;
    padding-left: 40px;
    display: flex;
    // justify-content: center;
  }
}
</style>
