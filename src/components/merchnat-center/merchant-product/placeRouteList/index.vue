<template>
  <div>
    <Form :model="searchForm"
          inline>
      <FormItem>
        <Input placeholder="请输入跟团游名称"
               v-model="searchForm.name"></Input>
      </FormItem>
      <FormItem>
        <Select v-model="searchForm.enabled"
                style="width:180px"
                placeholder="请选择状态">
          <Option value="">——请选择状态——</Option>
          <Option value="T">已上架</Option>
          <Option value="F">已下架</Option>
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

    <!-- 预览 -->
    <qrcode-modal :url='QRcodeUrl'
                  v-model="qrcodeShow"></qrcode-modal>

  </div>
</template>
<script>
export default {
  components: {

  },
  data () {
    return {
      QRcodeUrl: '',
      qrcodeShow: false,
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
          title: "跟团游名称",
          key: "name"
        },
        {
          title: "编码",
          key: "lineCode"
        },
        {
          title: "来源",
          key: "prodFrom",
          width: 150,
          render: (h, params) => {
            return h("span", params.row.src === "prod" ? "自营" : "分销");
          }
        },
        {
          title: "上下架",
          key: "enabled",
          width: 150,
          render: (h, params) => {
            return h("span", params.row.enabled === "T" ? "已上架" : "已下架");
          }
        },
        {
          title: "操作",

          key: "action",
          align: "center",
          render: (h, params) => {
            let { id, enabled } = params.row
            let actions = [
              {
                title: enabled === "T" ? "下架" : "上架",
                action: () => {
                  let enabled = enabled == "T" ? "F" : "T";
                  this.apiGet("merchant/api/merchantRouteInfo/enable", { id, enabled }).then(res => {
                    if (res.status == 200) {
                      this.$Message.success("操作成功!");
                      this.getList();
                    } else {
                      this.$Message.warning(res.message);
                    }
                  });
                }
              },
              //   {
              //     title: "价格日历",
              //     action: () => {
              //       this.$router.push("/placeCalendar/" + params.row.id);
              //     }
              //   },
              {
                title: "完善信息",
                action: () => {
                  this.$router.push({
                    path: "/placeRoute",
                    query: { id }
                  });
                }
              },
              {
                title: "规则",
                action: () => {
                  // apiGet()
                  this.$router.push("/placeRule/" + id);
                }
              },
              {
                title: "预览",
                action: () => {
                  this.QRcodeUrl = `merchant/api/merchantRouteInfo/preview?id=${id}`
                  this.qrcodeShow = true
                }
              }
            ];
            if (params.row.longPrice === "T") {
              actions.push({
                title: "价格日历",
                action: () => {
                  this.$router.push("/placeCalendar/" + id);
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      dataRoute: [],
      total: 0,
      current: 1,
      pageSize: 10,
      searchForm: {
        name: "",
        enabled: ""
      }
    };
  },
  mounted () {
    // this.loadpage(this.params)
  },
  created () {
    this.getList();
  },
  methods: {
    getList () {
      this.apiPost("/merchant/api/merchantRouteInfo/getMerchantRouteInfoPage", {
        routeName: this.searchForm.name,
        enabled: this.searchForm.enabled,
        currPage: this.current,
        pageSize: this.pageSize
      }).then(res => {
        if (res.status == 200) {
          this.dataRoute = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    changepage (num) {
      this.current = num;
      this.getList();
    },
    pageSizeChange (num) {
      this.pageSize = num;
      this.getList();
    }
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

