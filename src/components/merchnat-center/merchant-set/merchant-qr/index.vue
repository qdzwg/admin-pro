<template>
  <div class="merchant-qr">
    <page-template :search-items='searchItems'
                   :columns="columns"
                   pageFlag
                   :url="url"
                   ref="pageWrap">
    </page-template>
    <!-- 预览 -->
    <qrcode-modal :url='QRcodeUrl'
                  :title="modalTitle"
                  v-model="qrcodeShow"></qrcode-modal>
  </div>
</template>


<script>
const typeList = [
  { value: "main_page", label: "首页" },
  { value: "hotel", label: "酒店" },
  { value: "scenic", label: "门票" },
  { value: "product", label: "商品" },
  { value: "personal", label: "个人中心" },
  { value: "repast", label: "餐饮" },
  { value: "route", label: "跟团游" },
  { value: "theater", label: "剧院" },
  { value: "pcWebsite", label: "官网首页" }
]
export default {
  data () {
    return {
      searchItems: [
        {
          label: '页面类型',
          type: 'select',
          name: 'pageType',
          data: typeList
        }
      ],
      columns: [
        {
          title: '页面类型',
          align: 'center',
          key: 'pageType',
          render: (h, params) => {
            let { pageType } = params.row
            return h('span', this.$flType(pageType, typeList))
          }
        },
        {
          title: '链接地址',
          align: 'center',
          key: 'qrLink',
        },
        {
          title: '内部渠道地址',
          align: 'center',
          key: 'qrLinkSpecial',
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '查看并下载二维码',
              action: () => {
                this.qrcodeShow = true
                this.modalTitle = '二维码信息'
              }
            }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }

      ],
      url: 'merchant/merchantQr/grid',
      qrcodeShow: false,
      modalTitle: '新增角色',
      QRcodeUrl: "",
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    ok () {

    },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    onCopy () {
      this.$Message.success('复制成功！')
    },
    onError () {
      this.$Message.error('复制失败！')
    },
  }
}
</script>

<style>
#mImg {
  max-width: 100px;
}
</style>




