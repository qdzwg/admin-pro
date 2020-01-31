<template>
  <div>
    <page-template :search-items='searchItems'
                   :columns="columns"
                   pageFlag
                   :url="url"
                   ref="pageWrap">
    </page-template>

    <!-- 预览 -->
    <qrcode-modal :url='QRcodeUrl'
                  v-model="qrcodeShow"></qrcode-modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      extendId:'',
      extendType:'',
      url: "merchant/merchantHotelInfo/grid",
      QRcodeUrl: '', //缺少预览信息地址
      qrcodeShow: false,
      extendFlag: false,
      searchItems: [
        {
          label: "景区名称",
          type: "input",
          name: "name"
        },
        {
          label: "状态",
          type: "select",
          name: "enabled",
          data: [
            {
              value: "T",
              label: "已上架"
            },
            {
              value: "F",
              label: "已下架"
            }
          ]
        },
        {
          label: "来源",
          type: "select",
          name: "src",
          data: [
            {
              value: "prod",
              label: "自营"
            },
            {
              value: "dist_market",
              label: "分销"
            }
          ]
        }
      ],
      columns: [
        {
          title: '序号',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        },
        {
          title: '酒店名称',
          key: 'name'
        },
        {
          title: '酒店编码',
          key: 'productCode'
        },
        {
          title: "来源",
          key: "prodFrom",
          render: (h, params) => {
            return h("span", params.row.prodFrom === "prod" ? "产品中心" : "分销市场");
          }
        },
        {
          title: '上下架',
          key: 'enabled',
          render: (h, params) => {
            return h("span", params.row.enabled === "T" ? "在售中" : "已下架");
          }
        },
        {
          title: '操作',
          width: 400,
          key: 'action',
          align: 'center',
          render: (h, params) => {
            let { id, enabled, src, hotelType } = params.row;
            let actions = [
              {
                title: enabled === "T" ? "下架" : "上架",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: 'merchant/merchantHotelInfo/enabled',
                    param: { id },
                    title: enabled === "T" ? "下架" : "上架",
                    content: enabled === "T" ? "确认下架吗?" : "确认上架吗？",
                    sucessMsg: enabled === "T" ? "下架成功！" : "上架成功！"
                  })
                }
              },
              {
                title: '预览',
                action: () => {
                  this.$router.push('/hotelInfo/' + id)
                }
              },
              {
                title: "房型列表",
                action: () => {
                  this.$router.push("/houseTypeList/" + params.row.hotelInfoId);
                }
              },
              {
                title: "预览",
                action: () => {
                  this.QRcodeUrl = `merchant/merchantHotelInfo/previewInfo?id=${id}`
                  this.qrcodeShow = true

                }
              }
            ];

            return this.common.columnsHandle(h, actions)
          }
        }
      ]
    };
  },
  methods: {
    ok () {
      // 

    },
    cancel () {
    }
  }
}
</script>

<style scoped lang="scss">
.completeForm {
  height: 450px;
  overflow: auto;
}
.productTable {
  margin-top: 5px;
}
</style>
