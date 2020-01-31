<template>
  <div class="recommend-wrap">
    <page-template
      :search-items="searchItems"
      :columns="columns"
      hasDataKey
      pageFlag
      :url="url"
      ref="pageWrap"
    >
      <Row v-if="pageBtnParams.length" slot="topbtn" slot-scope="slotProps">
        <Button
          class="page-btn"
          :type="item.type"
          :icon="item.icon"
          v-for="(item, index) in pageBtnParams"
          @click="actionBtns(index, slotProps.selectedList)"
          :key="index"
          >{{ item.name }}</Button
        >
      </Row>
    </page-template>
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
      :searchItems="addSearchItems"
      :productList="productList"
      @get-data="getProduct"
    ></product-list>
  </div>
</template>

<script>
import pushCom from "./components/pushCom.vue";
import productList from "./components/productList.vue";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: { pushCom, productList },
  props: {},
  data() {
    return {
      url: "/product/api/recommend/grid",
      searchItems: [
        {
          label: "产品名称",
          type: "input",
          name: "recommendedProductName"
        },
        {
          label: "商户名称",
          type: "input",
          name: "mchName"
        },
        {
          label: "景区名称",
          type: "select",
          name: "parkId",
          data: []
        },
        {
          label: "产品类型",
          type: "select",
          name: "recommendedProductType",
          data: []
        }
      ],
      addSearchItems: [
        {
          label: "产品名称",
          type: "input",
          name: "productName"
        },
        {
          label: "商户名称",
          type: "input",
          name: "mchName"
        },
        {
          label: "景区名称",
          type: "select",
          name: "parkId",
          data: []
        },
        {
          label: "产品类型",
          type: "select",
          name: "productType",
          data: []
        }
      ],
      pageBtnParams: [
        {
          type: "primary",
          name: "拉取"
        },
        {
          type: "primary",
          name: "推荐到城市"
        },
        {
          type: "primary",
          name: "推荐到景区"
        },
        {
          type: "primary",
          name: "推荐到产品"
        },
        {
          icon: "android-delete",
          type: "error",
          name: "删除"
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品类型",
          align: "center",
          key: "merchantName",
          render: (h, params) => {
            let { recommendedProductType } = params.row;
            return h(
              "span",
              this.$flType(recommendedProductType, this.productList)
            );
          }
        },
        {
          title: "景区名称",
          align: "center",
          key: "parkName"
        },
        {
          title: "商户名称",
          align: "center",
          key: "mchName"
        },
        {
          title: "产品名称",
          algin: "center",
          key: "recommendedProductName"
        },
        {
          title: "操作",
          key: "action",
          width: 360,
          align: "center",
          render: (h, params) => {
            let { id, qyAccount, qyPassword } = params.row;
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.$router.push({ path: "/recommendEdit", query: { id } });
                }
              },
              {
                title: "删除",
                action: () => {
                  let { id } = params.row;
                  this.deleteFun(id);
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      pushFlag: false,
      pushType: "city",
      originFlag: false,
      originType: "pull",
      recomendedList: [], //  被推荐产品列表
      selectedList: []
    };
  },
  watch: {
    scenicList(val) {
      let list = this.cloneDeep(val);
      list.unshift({ value: "", label: "全部" });
      this.searchItems[2].data = list;
      this.addSearchItems[2].data = list;
    },
    productList(val) {
      let list = this.cloneDeep(val);
      list.unshift({ value: "", label: "全部" });
      this.searchItems[3].data = list;
      this.addSearchItems[3].data = val;
    }
  },
  computed: {
    ...mapState("recommend", ["cityList", "scenicList", "productList"])
  },
  methods: {
    ...mapActions("recommend", ["getScenicAndCity"]),
    ok() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.$refs.pageWrap
            .request({
              url: "merchant/merchantWholeMarket/toSaveWhole",
              method: "get",
              param: { ...this.formItem }
            })
            .then(res => {
              if (res.data) {
                this.modal = false;
              }
            });
        }
      });
    },
    cancel() {
      this.modal = false;
      this.$refs.formValidate.resetFields();
    },
    /**
     * 操作表格全局按钮
     * @param {number} index 全局按钮索引
     * @param {object} selectedList 已选择表格数据
     */
    actionBtns(index, selectedList) {
      if (index != 0 && !selectedList.length) {
        this.$Message.warning("请选择要操作的数据！");
        return;
      }
      this.selectedList = selectedList;
      switch (index) {
        case 0:
          this.originFlag = true;
          this.originType = "pull";
          break;
        case 1:
          this.pushFlag = true;
          this.pushType = "city";
          break;
        case 2:
          this.pushFlag = true;
          this.pushType = "scenic";
          break;
        case 3:
          this.originFlag = true;
          this.originType = "bind";
          let recomendedList = selectedList.map(item => {
            let {
              recommendedProductId,
              recommendedProductName,
              recommendedProductCode,
              recommendedProductType
            } = item;
            return {
              recommendedProductId,
              recommendedProductName,
              recommendedProductCode,
              recommendedProductType
            };
          });
          this.recomendedList = recomendedList;
          break;
        case 4:
          let ids = selectedList
            .map(item => {
              let { id } = item;
              return id;
            })
            .join(",");
          this.deleteFun(ids);
          break;
      }
    },
    deleteFun(ids) {
      this.$refs.pageWrap.request({
        url: "/product/api/recommend/delete",
        param: { ids: ids }
      });
    },
    getProduct(data) {
      let params = { products: JSON.stringify(data) };
      if (this.originType == "pull") {
        this.addProduct(params);
      } else if (this.originType == "bind") {
        this.bindProduct(params);
      }
    },
    getCityScenic(data) {
      let params = {};
      let ids = data.join(",");
      if (this.pushType == "city") {
        params.cities = ids;
      } else if (this.pushType == "scenic") {
        params.parks = ids;
      }
      this.bindProduct(params);
    },
    async addProduct(params) {
      let info = await this.$refs.pageWrap.request({
        url: "/product/api/recommend/addRecommededProduct",
        param: { ...params }
      });
      if (info) {
        this.originFlag = false;
      }
    },
    async bindProduct(params) {
      let list = this.selectedList.map(item => {
        let {
          id,
          recommendedProductId,
          recommendedProductCode,
          recommendedProductType
        } = item;
        return {
          id,
          recommendedProductId,
          recommendedProductCode,
          recommendedProductType
        };
      });
      let info = await this.$refs.pageWrap.request({
        url: "/product/api/recommend/bind",
        param: {
          recommendedProducts: JSON.stringify(list),
          ...params
        }
      });
      if (info) {
        this.pushFlag = false;
        this.originFlag = false;
      }
    }
  },
  created() {
    this.getScenicAndCity();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.recommend-wrap {
}
</style>
