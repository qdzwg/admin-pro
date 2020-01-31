<template>
  <div class="wtravelling-wrap">
    <page-template
      :search-items="searchItems"
      :columns="columns"
      :showHeader="showHeader"
      :border="border"
      :pageKey="pageKey"
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
    <qrcode-modal v-model="previewFlag" :url="QRcodeUrl"></qrcode-modal>
    <the-whole-market
      type="route"
      v-model="qyyxFlag"
      :id="id"
    ></the-whole-market>
  </div>
</template>
<script>
import theWholeMarket from "@/components/global/theWholeMarket";
export default {
  components: { theWholeMarket },
  props: {},
  data() {
    return {
      isSongCheng: true,
      url: "product/api/routeProduct/pageRouteInfo",
      id: "", //全员推广时ID
      qyyxFlag: false,
      pageKey: {
        currPage: "currPage",
        pageSize: "pageSize"
      },
      showHeader: false,
      border: false,
      previewFlag: false,
      QRcodeUrl: "",
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
              value: "",
              label: "--请选择状态--"
            },
            {
              value: "T",
              label: "已上架"
            },
            {
              value: "F",
              label: "已下架"
            }
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
          btnType: "btn",
          link: "",
          type: "primary",
          name: "全选"
        },
        {
          btnType: "url",
          link: "",
          type: "primary",
          name: "上架"
        },
        {
          btnType: "url",
          link: "",
          type: "primary",
          name: "下架"
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "图片",
          key: "linkMobileImg",
          width: 140,
          align: "center",
          render: (h, params) => {
            let { linkMobileImg } = params.row;
            return h("img", {
              attrs: {
                src: linkMobileImg,
                style: "width:100px;height:100px"
              }
            });
          }
        },
        {
          title: "内容",
          align: "center",
          render: (h, params) => {
            let { index } = params;
            let {
              id,
              name,
              begAddress,
              endAddress,
              sellType,
              distEnabled,
              merchantEnabled,
              productCode,
              sortNo
            } = params.row;
            let sellTypeText = "";
            let begAddressText = `出发地：${begAddress ? begAddress : ""} `;
            let endAddressText = `目的地：${endAddress ? endAddress : ""} `;
            let productCodeText = `产品编码: ${
              productCode ? productCode : ""
            } `;
            switch (Number(sellType)) {
              case 0:
                sellTypeText = `销售渠道：分销市场 【${
                  distEnabled == "F" ? "已下架" : "已上架"
                }】、店铺【${merchantEnabled == "F" ? "已下架" : "已上架"}】`;
                break;
              case 1:
                sellTypeText = `销售渠道：分销市场 【${
                  distEnabled == "F" ? "已下架" : "已上架"
                }】`;
                break;
              case 2:
                sellTypeText = `销售渠道：店铺【${
                  merchantEnabled == "F" ? "已下架" : "已上架"
                }】`;
                break;
            }
            return h(
              "div",
              {
                style: {
                  padding: "6px 0",
                  textAlign: "left"
                },
                class: {
                  tablemain: true
                }
              },
              [
                h(
                  "h4",
                  {
                    class: {
                      title: true
                    }
                  },
                  name
                ),
                h("p", {}, "来源：商城自建-自核销"),
                h("p", {}, begAddressText),
                h("p", {}, endAddressText),
                h("p", {}, sellTypeText),
                h("p", {}, productCodeText),
                h("p", {}, [
                  h("span", {}, "排序："),
                  h("InputNumber", {
                    props: {
                      value: params.row.sortNo,
                      size: "small",
                      style: "width:50px;"
                    },
                    on: {
                      "on-change": num => {
                        params.row.sortNo = num;
                      },
                      "on-blur": () => {
                        this.addSortNo(id, params.row.sortNo);
                        this.$refs.pageWrap.getTableList();
                      }
                    }
                  })
                ])
              ]
            );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            let {
              id,
              sellType,
              distEnabled,
              merchantEnabled,
              enabled,
              productCode,
              name
            } = params.row;
            //上下架的筛选工作
            let sellAction = [];
            let baseSellAction = [
              {
                title: distEnabled === "T" ? "分销市场下架" : "分销市场上架",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: "product/api/routeProduct/isDistEnabledDisable",
                    param: {
                      productCode
                    },
                    method: "post",
                    title: "信息",
                    content:
                      distEnabled === "T" ? "确认下架吗?" : "确认上架吗？",
                    sucessMsg: distEnabled === "T" ? "下架成功！" : "上架成功！"
                  });
                }
              },
              {
                title: merchantEnabled === "T" ? "店铺下架" : "店铺上架",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: "product/api/routeProduct/isMerchantEnabledDisable",
                    param: {
                      productCode
                    },
                    method: "post",
                    title: "信息",
                    content:
                      merchantEnabled === "T" ? "确认下架吗?" : "确认上架吗？",
                    sucessMsg:
                      merchantEnabled === "T" ? "下架成功！" : "上架成功！"
                  });
                }
              },
              //宋城上下架
              {
                title: enabled === "T" ? "下架" : "上架",
                action: () => {
                  let actionEnable = enabled === "T" ? "F" : "T";
                  this.enableFun(productCode, actionEnable);
                  // this.$refs.pageWrap.confirm({
                  //   url: "product/api/routeProduct/isEnabledDisable",
                  //   param: {
                  //     productCode,
                  //     enabled: enabled === "T" ? "F" : "T"
                  //   },
                  //   method: "post",
                  //   title: "信息",
                  //   content: enabled === "T" ? "确认下架吗?" : "确认上架吗？",
                  //   sucessMsg: enabled === "T" ? "下架成功！" : "上架成功！"
                  // });
                }
              }
            ];
            switch (Number(sellType)) {
              case 0:
                sellAction = baseSellAction.slice(0, 2);
                break;
              case 1:
                sellAction = baseSellAction.slice(0, 1);
                break;
              case 2:
                sellAction = this.isSongCheng
                  ? baseSellAction.slice(2)
                  : baseSellAction.slice(1, 2);
                break;
            }
            let actions = [
              {
                title: "完善信息",
                action: () => {
                  this.$router.push("/travellingRoute?id=" + id);
                  // this.complateInfo(id);
                }
              },
              {
                title: "规则编辑",
                action: () => {
                  this.$router.push({
                    path: "/travellingRouteInfo",
                    query: { id }
                  });
                }
              },
              {
                title: "日历库存",
                action: () => {
                  this.$router.push({
                    path: "/scTravellCalendar",
                    query: { id, name }
                  });
                  // this.$router.push({ path: '/xjTravellCalendar', query: { id } });
                }
              },
              {
                title: "删除",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    method: "post",
                    url: "/product/api/routeProduct/delRouteLine",
                    param: {
                      routeid: id
                    },
                    title: "信息",
                    content: "删除后将影响已有订单退票、核销，请谨慎操作",
                    sucessMsg: "删除成功！"
                  });
                }
              }
            ];
            if (sellType != 1) {
              if (!this.isSongCheng) {
                actions.push({
                  title: "全员营销",
                  action: () => {
                    this.id = id;
                    this.qyyxFlag = true;
                    // this.market(id, "edit");
                    // this.QRcodeUrl = `/product/api/routeProduct/preview?routeInfoId=${id}`;
                    // this.previewFlag = true;
                  }
                });
              }
              actions.push({
                title: "预览",
                action: () => {
                  this.QRcodeUrl = `/product/api/routeProduct/preview?routeInfoId=${id}`;
                  this.previewFlag = true;
                }
              });
            }
            if (!this.isSongCheng) {
              actions.push({
                title: "推送全员营销",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: `/product/api/product/syncQyyx`,
                    param: {
                      id,
                      businessType: "route"
                    },
                    method: "post",
                    content: "确定推送?",
                    isRefresh: false
                  });
                }
              });
            }
            return this.common.columnsHandle(h, [...sellAction, ...actions]);
          }
        }
      ],
      isSelectAll: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    actionBtns(index, selectData) {
      switch (index) {
        case 0:
          this.$router.push("/travellingRoute");
          break;
        case 1:
          let flag = !this.isSelectAll;
          this.isSelectAll = flag;
          if (flag) {
            this.pageBtnParams[index].name = "取消选中";
          } else {
            this.pageBtnParams[index].name = "全选";
          }
          this.$refs.pageWrap.$refs.table.selectAll(flag);
          break;
        case 2:
        case 3:
          if (!selectData.length) {
            this.$Message.warning("前先选择要操作的数据");
            return;
          }
          let codes = [];
          selectData.forEach(item => {
            codes.push(item.productCode);
          });
          codes = codes.join(",");
          this.enableFun(codes, index == 2 ? "T" : "F");
          break;
      }
    },
    // 排序
    addSortNo(id, num) {
      this.apiPost("/product/api/routeProduct/updateRouteLineSortNo", {
        routeId: id,
        sortNo: num
      }).then(res => {
        if (res.status == 200) {
          this.$Message.success("操作成功！");
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    /**宋城上下架
     * @param {codes} 字符串id集合
     * @param {enable} 'T/F'
     */
    enableFun(codes, enable) {
      this.$refs.pageWrap.confirm({
        url: "product/api/routeProduct/isEnabledDisable",
        param: {
          productCode: codes,
          enabled: enable
        },
        method: "post",
        title: "信息",
        content: enable === "F" ? "确认下架吗?" : "确认上架吗？",
        sucessMsg: enable === "F" ? "下架成功！" : "上架成功！"
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.wtravelling-wrap {
}
</style>
