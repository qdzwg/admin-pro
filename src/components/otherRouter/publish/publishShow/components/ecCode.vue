// 电商编码
<template>
  <the-modal v-model="value" title="电商编码" noFooter @cancel="cancel">
    <page-template
      :search-items="searchItems"
      :columns="columns"
      hasDataKey
      :pageKey="pageKey"
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
      url: "/product/api/showTicketApi/dsProducts",
      searchItems: [
        {
          label: "演出票型编码",
          type: "input",
          name: "showTicketCode"
        },
        {
          label: "演出票型名称",
          type: "input",
          name: "showTicketName"
        }
      ],
      columns: [
        {
          title: "景区名称",
          key: "productlName"
        },
        {
          title: "演出票型编码",
          key: "goodsCode"
        },
        {
          title: "演出票型名称",
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
