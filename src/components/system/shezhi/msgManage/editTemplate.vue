<template>
  <div class="edit-template">
    <the-page-template
      :search-items="searchItems"
      :columns="columns"
      :params="params"
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
    </the-page-template>
    <theModal v-model="flag" width="800" noFooter @cancel="recordCancelFun">
      <the-page-template
        :search-items="searchItems"
        :columns="allColumns"
        hasDataKey
        pageFlag
        firstUnload
        :url="allUrl"
        ref="recordPageWrap"
      >
        <Row slot="topbtn" slot-scope="slotProps">
          <Button type="primary" @click="selectAll(slotProps.selectedList)"
            >批量选择</Button
          >
        </Row>
      </the-page-template>
    </theModal>
  </div>
</template>

<script>
import thePageTemplate from "@/components/global/thePageTemplate.vue";
import theModal from "@/components/global/theModal.vue";
import { orderType } from "@/common";
export default {
  components: { thePageTemplate, theModal },
  props: {},
  data() {
    return {
      id: "",
      flag: false,
      url: "/merchant/api/merchantMessage/product/grid",
      allUrl: "/merchant/api/merchantMessage/product/search",
      searchItems: [
        {
          label: "请输入产品名称",
          type: "input",
          name: "productName"
        },
        {
          label: "请选择产品类型",
          type: "select",
          name: "productType",
          data: [
            {
              value: "",
              label: "--请选择产品类型--"
            },
            { value: "mdse", label: "商品" },
            { value: "room", label: "房型" },
            { value: "ticket", label: "门票" },
            { value: "family", label: "套票" },
            { value: "guide", label: "导游" },
            { value: "pmsHotelTypeProduct", label: "云PMS酒店" },
            { value: "repast", label: "餐券" },
            { value: "route", label: "线路" },
            { value: "hotel", label: "酒店" }
          ]
        }
      ],
      pageBtnParams: [
        {
          btnType: "router",
          link: "",
          icon: "android-add",
          type: "primary",
          name: "新增"
        },
        {
          btnType: "url",
          link: "",
          icon: "android-delete",
          type: "error",
          name: "批量删除"
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品编码",
          key: "productCode",
          align: "center"
        },
        {
          title: "业态",
          key: "productType",
          align: "center",
          render: (h, params) => {
            let { productType } = params.row;
            let text = this.prodType.filter(item => {
              return item.value == productType;
            });
            return h("span", {}, text[0].label);
          }
        },
        {
          title: "产品名称",
          key: "productName",
          align: "center"
        },
        {
          title: "操作",
          key: "out",
          align: "center",
          render: (h, params) => {
            let { id } = params.row;
            return h(
              "Button",
              {
                on: {
                  click: () => {
                    this.deleteFun(id);
                  }
                }
              },
              "删除"
            );
          }
        }
      ],
      allColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品编码",
          key: "modelCode",
          align: "center"
        },
        {
          title: "业态",
          key: "prodType",
          align: "center",
          render: (h, params) => {
            let { prodType } = params.row;
            let text = this.prodType.filter(item => {
              return item.value == prodType;
            });
            return h("span", {}, text[0].label);
          }
        },
        {
          title: "产品名称",
          key: "modelName",
          align: "center"
        },
        {
          title: "操作",
          key: "insert",
          align: "center",
          render: (h, params) => {
            let { id } = params.row;
            return h(
              "Button",
              {
                on: {
                  click: () => {
                    let {
                      modelCode: productCode,
                      prodType: productType,
                      modelName: productName
                    } = params.row;
                    this.selectFun([
                      {
                        productCode,
                        productType,
                        productName
                      }
                    ]);
                  }
                }
              },
              "选择"
            );
          }
        }
      ],
      prodType: [
        { value: "mdse", label: "商品" },
        { value: "room", label: "房型" },
        { value: "ticket", label: "门票" },
        { value: "family", label: "套票" },
        { value: "guide", label: "导游" },
        { value: "pmsHotelTypeProduct", label: "云PMS酒店" },
        { value: "repast", label: "餐券" },
        { value: "route", label: "线路" },
        { value: "hotel", label: "酒店" }
      ],
      params: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    actionBtns(index, list) {
      switch (index) {
        case 0:
          this.flag = true;
          this.$refs.recordPageWrap.getTableList();
          break;
        case 1:
          if (!list || !list.length) {
            this.$Message.warning("请选择要操作的数据！");
            return;
          }
          let ids = list.map(item => {
            return item.id;
          });
          this.deleteFun(ids);
          break;
      }
    },
    deleteFun(ids) {
      this.$refs.pageWrap.request({
        url: "/merchant/api/merchantMessage/product/deleteProduct",
        param: {
          ids: ids
        }
      });
    },
    selectAll(list) {
      if (!list || !list.length) {
        this.$Message.warning("请选择要操作的数据");
        return;
      }
      let info = list.map(item => {
        let {
          modelCode: productCode,
          prodType: productType,
          modelName: productName
        } = item;
        return { productCode, productType, productName };
      });
      this.selectFun(info);
    },
    async selectFun(list) {
      list.forEach(item => {
        item.messageTemplateId = this.id;
      });
      let info = await this.$refs.pageWrap.request({
        url: "/merchant/api/merchantMessage/product/addProducts",
        param: {
          products: JSON.stringify(list),
          messageTemplateId: this.id
        },
        curRefresh: false
      });
      if (info) {
        this.flag = false;
      }
    },
    recordCancelFun() {
      this.flag = false;
    }
  },
  created() {},
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let id = to.query.id;
      vm.id = id;
      vm.$set(vm.params, "messageTemplateId", id);
    });
  }
};
</script>
<style lang="scss" scoped>
.edit-template {
  .page-btn {
    margin-right: 10px;
  }
}
</style>
