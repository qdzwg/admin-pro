<template>
  <div>
    <Form :model="searchForm"
          inline>
      <FormItem>
        <Input placeholder="请输入线路名称"
               v-model="searchForm.name"></Input>
      </FormItem>
      <FormItem>
        <Select v-model="searchForm.enabled"
                style="width:180px"
                placeholder="请选择状态">
          <Option value="T">已上架</Option>
          <Option value="F">未上架</Option>
        </Select>
      </FormItem>
      <Button type="primary"
              icon="ios-search"
              @click="getList">搜索</Button>
    </Form>
    <Table :columns="columns"
           :data="dataRoute"
           no-data-text="暂无线路信息"></Table>
    <Page :total="total"
          :current="current"
          :page-size="pageSize"
          class-name="pages"
          @on-change="changepage"
          @on-page-size-change='pageSizeChange'
          show-elevator
          show-sizer></Page>

    <!-- 获取景区产品 -->
    <Modal width="800"
           v-model="productModal"
           title="获取景区产品"
           :loading="loading"
           @on-ok="ok">

      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data () {
    return {
      productModal: false,
      completeInfo: false,
      mode: "",
      content: "",
      sucessMsg: "",
      columns: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "线路名称",
          key: "name"
        },
        {
          title: "线路编码",
          key: "productCode"
        },
        {
          title: "来源",
          key: "prodFrom",
          render: (h, params) => {
            return h("span", params.row.src === "prod" ? "自营" : "分销");
          }
        },
        {
          title: "上下架",
          key: "enabled",
          render: (h, params) => {
            return h("span", params.row.enabled === "T" ? "已上架" : "已下架");
          }
        },
        {
          title: "操作",
          width: 400,
          key: "action",
          align: "center",
          render: (h, params) => {
            let actions = [
              {
                title: params.row.enabled === "T" ? "下架" : "上架",
                action: () => {
                  let enabled = params.row.enabled == 'T' ? 'F' : 'T'
                  apiGet(
                    "/merchant/api/merchantRouteInfo/enable?id=" +
                    params.row.id +
                    "&" + "enabled=" +
                    enabled
                  ).then(res => {
                    if (res.status == 200) {
                      this.$Message.success("操作成功!");
                      this.getList()
                    }
                  })
                }
              },
              {
                title: "价格日历",
                action: () => {
                  this.$router.push("/houseTypeList/" + params.row.hotelInfoId);
                }
              },
              {
                title: "完善信息",
                action: () => {
                  this.$router.push({ path: "/placeRoute", query: { id: params.row.id } });
                }
              },
              {
                title: "规则",
                action: () => {
                  // apiGet()
                  this.$refs.qrcodemodal.preLookModal = true;
                }
              },
              {
                title: "预览",
                action: () => {
                  // apiGet()
                  this.$refs.qrcodemodal.preLookModal = true;
                }
              }
            ];
            if (params.row.prodFrom === "prod") {
              actions.push({
                title: "全员推广",
                action: () => {
                  this.$refs.extendmodal.extentmodal = true;
                }
              });
            }

            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      types: "new",
      dataRoute: [],
      total: 0,
      current: 1,
      pageSize: 10,
      searchForm: {
        name: '',
        enabled: '',
      },
      modal: false,
      loading: true,
    };
  },
  mounted () {
    // this.loadpage(this.params)
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      apiPost("/merchant/api/merchantRouteInfo/getMerchantRouteInfoPage", {
        routeName: this.searchForm.name,
        enabled: this.searchForm.enabled,
        currPage: this.current,
        pageSize: this.pageSize,
      }).then((res) => {
        if (res.status == 200) {
          this.dataRoute = res.data.rows
          this.total = res.data.total
        }
      })
    },
    changepage (num) {
      this.current = num;
      this.getList();
    },
    pageSizeChange (num) {
      this.pageSize = num;
      this.getList();
    },
    ok () { },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
  }
};
</script>

<style scope lang="scss">
.completeForm {
  height: 450px;
  overflow: auto;
}
.productTable {
  margin-top: 5px;
}
.ivu-modal-body {
  padding-top: 0px;
}
</style>

