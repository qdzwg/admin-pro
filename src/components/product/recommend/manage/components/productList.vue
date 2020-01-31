<template>
  <the-modal
    v-model="value"
    :title="title"
    width="850"
    noFooter
    @ok="ok"
    @cancel="cancel"
  >
    <page-template
      :search-items="searchItems"
      :columns="columns"
      firstUnload
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
  </the-modal>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    searchItems: {
      type: Array
    },
    productList: {
      type: Array
    },
    type: {
      type: String,
      required: true,
      validator: function(val) {
        return ["pull", "bind"].indexOf(val) != -1;
      }
    }
  },
  data() {
    return {
      url: "/product/api/recommend/product",
      pageBtnParams: [
        {
          type: "primary",
          name: "添加"
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
            let { productType } = params.row;
            return h("span", this.$flType(productType, this.productList));
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
          key: "productName"
        }
      ]
    };
  },
  watch: {
    value: function(val) {
      if (val) {
        let tableRef = this.$refs.pageWrap;
        tableRef.initPage();
        tableRef.searchForm.productType = this.productList[0].value;
        tableRef.getTableList();
      }
    }
  },
  computed: {
    title: function() {
      if (this.type == "pull") {
        return "拉取";
      } else if (this.type == "bind") {
        return "添加";
      }
    }
  },
  methods: {
    ok() {},
    cancel() {
      this.$emit("input", false);
    },
    actionBtns(index, data) {
      if (!data.length) {
        this.$Message.warning("请选择要操作的数据！");
        return;
      }
      if (this.type == "pull") {
        let list = data.map(item => {
          let {
            mchId,
            mchName,
            parkId,
            parkName,
            productCode: recommendedProductCode,
            productId: recommendedProductId,
            productName: recommendedProductName,
            productType: recommendedProductType
          } = item;
          return {
            mchId,
            mchName,
            parkId,
            parkName,
            recommendedProductCode,
            recommendedProductId,
            recommendedProductName,
            recommendedProductType
          };
        });
        this.$emit("get-data", list);
      } else if (this.type == "bind") {
        let list = data.map(item => {
          //  productMchCode
          let {
            mchCode: productMchCode,
            mchId: productMchId,
            mchName: productMchName,
            parkId: productParkId,
            parkName: productParkName,
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
        this.$emit("get-data", list);
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
