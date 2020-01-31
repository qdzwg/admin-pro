// 电商编码
<template>
  <the-modal
    v-model="value"
    width="700"
    title="电商编码"
    noFooter
    @cancel="cancel"
  >
    <page-template
      :search-items="searchItems"
      :columns="columns"
      :pageKey="pageKey"
      hasDataKey
      pageFlag
      :url="url"
      ref="pageWrap"
    >
    </page-template>
  </the-modal>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Boolean
    }
  },
  data() {
    return {
      pageKey: {
        currPage: "currPage",
        pageSize: "pageSize"
      },
      url: "/product/api/park/dsProducts",
      searchItems: [
        {
          label: "景区名称",
          type: "input",
          name: "parkName"
        },
        {
          label: "门票编码",
          type: "input",
          name: "parkTicketCode"
        },
        {
          label: "门票名称",
          type: "input",
          name: "parkTicketName"
        }
      ],
      columns: [
        {
          title: "景区名称",
          key: "productlName"
        },
        {
          title: "门票编码",
          key: "goodsCode"
        },
        {
          title: "门票名称",
          key: "name"
        },
        {
          title: "操作",
          key: "action",
          render: (h, params) => {
            let { goodsCode } = params.row;
            const actions = [
              {
                title: "选择",
                action: () => {
                  this.$emit("get-code", goodsCode);
                  this.$emit("input", false);
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {
    cancel() {
      this.$emit("input", false);
    }
  },
  created() {},
  mounted() {}
};
</script>
