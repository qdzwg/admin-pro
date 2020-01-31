<template>
  <div>
    <list ref="gridTable" :columns="columns" :params="params" :search-items='searchItems' :url="url"></list>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
  </div>
</template>
<script>
import list from "@/components/global/list";
import confirm from "@/components/global/confirm";
export default {
  data() {
    return {
      sucessMsg: "",
      content: "",
      mode: "",
      columns: [
        {
          title: "序号",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "房型产品名称",
          key: "typeProductName"
        },
        {
          title: "房型产品编号",
          key: "typeProductCode"
        },
        {
          title: "上下架",
          key: "enabled",
          render: (h, params) => {
            let enabled = params.row.enabled === "T" ? "在售中" : "已下架";
            return h("span", enabled);
          }
        }
      ],
      params: {
        page: 1,
        limit: 10,
        merchantHtoleId: this.$route.params.id
      },
      url: "/merchant/webApi/pmsMerchantHotelinfoTob/typeHotelGrid",
      searchItems: [
        {
          label: "房型产品名称",
          type: "input",
          name: "typeProductName"
        }
      ]
    };
  },
  mounted() {
    console.log('----')
    apiGet("/merchant/merchantHotelInfo/editHotel?id=" + this.$route.params.id).then(res => {
      if (res.success||res.status==200) {
        this.hotelName = res.data.merchantHotelInfo.name;
      } else {
        this.$Message.warning(res.message);
      }
    });
  },
  components: { list, confirm },
  methods: {
   
  }
};
</script>

