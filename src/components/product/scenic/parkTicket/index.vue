<template>
  <div>
    <page-template
      :search-items="searchItems"
      :columns="columns"
      pageFlag
      :url="url"
      ref="pageWrap"
    >
      <Row v-if="pageBtnParams.length" slot="topbtn" slot-scope="slotProps">
        <Button type="primary" icon="Button" @click="addTicket" v-if="parkId"
          >新增</Button
        >
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
    <!-- 预览 -->
    <qrcode-modal
      :url="previewUrl"
      :param="previewParam"
      v-model="qrcodeShow"
    ></qrcode-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      isSongCheng: true,
      parkId: this.$route.query.parkId ? this.$route.query.parkId : "",
      url:
        "product/api/park/api/gridTicketFL?parkId=" +
        (this.$route.query && this.$route.query.parkId
          ? this.$route.query.parkId
          : ""),
      previewUrl: "product/api/newTheaterShow/preview",
      previewParam: {},
      qrcodeShow: false,
      searchItems: [
        {
          label: "景区名称",
          type: "input",
          name: "parkName"
        },
        {
          label: "票型名称",
          type: "input",
          name: "modelName"
        },
        {
          label: "票型编码",
          type: "input",
          name: "modelCode"
        },
        {
          label: "是否上架",
          type: "select",
          name: "enabled",
          data: [
            {
              value: "",
              label: "请选择"
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
          btnType: "url",
          link: "",
          icon: "android-delete",
          type: "error",
          name: "删除"
        },
        {
          btnType: "url",
          link: "",
          icon: "android-done",
          type: "primary",
          name: "上架"
        },
        {
          btnType: "url",
          link: "",
          icon: "android-close",
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
          title: "票型名称",
          key: "modelName"
        },
        {
          title: "票型来源",
          key: "channel",
          render: (h, params) => {
            let { channel } = params.row;
            let list = [
              { label: "商城自建-自核销", value: -1 },
              { label: "商城自建-线下系统", value: 0 },
              { label: "智游宝拉取", value: 1 },
              { label: "自有-智游宝", value: 2 },
              { label: "智游宝-云票务核销", value: 3 }
            ];
            return h("span", this.$flType(channel, list));
          }
        },
        {
          title: "票型编码",
          key: "modelCode"
        },
        {
          title: "景区名称",
          key: "parkName"
        },
        {
          title: "是否上架",
          key: "enabled",
          width: 100,
          render: (h, params) => {
            return h("span", params.row.enabled == "F" ? "未上架" : "已上架");
          }
        },
        {
          title: "库存模式",
          key: "stockModel",
          width: 120,
          render: (h, params) => {
            let { stockModel } = params.row;
            let modelList = [
              { label: "日库存", value: "day" },
              { label: "无限库存", value: "unlimit" },
              { label: "有限库存", value: "limit" }
            ];
            return h("span", this.$flType(stockModel, modelList));
          }
        },
        {
          title: "排序",
          key: "sortNo",
          width: 110,
          render: (h, params) => {
            let { sortNo, id } = params.row;
            return h("InputNumber", {
              props: {
                value: sortNo ? sortNo : 0
              },
              on: {
                "on-change": val => {
                  params.row.sortNo = val;
                },
                "on-blur": () => {
                  this.$refs.pageWrap.request({
                    url: "product/api/park/api/updateTicketSortNo",
                    method: "get",
                    param: {
                      ticketId: id,
                      sortNo: params.row.sortNo
                    }
                  });
                }
              }
            });
          }
        },
        {
          title: "操作",
          key: "action",
          width: 360,
          // align: 'center',
          render: (h, params) => {
            let {
              id,
              isViewDate,
              isSyncYpw,
              existMerchantTicket,
              sellType,
              stockModel
            } = params.row;
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.$router.push({
                    path: "/publishParkTicket",
                    query: { id }
                  });
                }
              },
              {
                title: "删除",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: `/product/parkTicket/del`,
                    param: {
                      id
                    },
                    content: "删除后将影响已有订单退票、核销，请谨慎操作"
                  });
                }
              }
            ];
            if (this.isSongCheng) {
              actions.push({
                title: "价格库存日历",
                action: () => {
                  // '&modelType=ticket'
                  this.$router.push({
                    path: `/ticketInventoryCl`,
                    query: { id, stockModel }
                  });
                }
              });
            } else {
              actions.push({
                title: "推送全员营销",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: `/product/parkTicket/syncQyyx`,
                    param: {
                      id
                    },
                    content: "确定推送?",
                    isRefresh: false
                  });
                }
              });
              if (isViewDate === "T") {
                actions.push({
                  title: "价格库存日历",
                  action: () => {
                    this.$router.push(`/priceInventoryCl/${id}`);
                  }
                });
              }
            }

            if (isSyncYpw != null && isSyncYpw == "T") {
              actions.push({
                title: "推送云票务",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: `product/parkInfo/syncYpw`,
                    param: {
                      id
                    },
                    title: "确定推送?",
                    content: "推送云票务",
                    isRefresh: false
                  });
                }
              });
            }
            if (
              existMerchantTicket !== null &&
              sellType != -1 &&
              existMerchantTicket == "T"
            ) {
              // height: 500, width: 500
              actions.push({
                title: "预览",
                action: () => {
                  this.previewParam = { id };
                  this.qrcodeShow = true;
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters("ticket", ["songExtendsParam1"])
  },
  components: {},
  async created() {
    this.baseInfo = await this.getDiffInfo();
  },
  created() {
    let columns = this.columns;
    if (this.isSongCheng) {
      this.columns = columns.filter(item => {
        return item.key != "channel";
      });
    } else {
      this.columns = columns;
    }
  },
  mounted() {},
  methods: {
    ...mapActions("ticket", ["getDiffInfo"]),
    /**
     * 操作表格全局按钮
     * @param {number} index 全局按钮索引
     * @param {object} selectedList 已选择表格数据
     */
    actionBtns(index, selectedList) {
      const confirmFun = this.$refs.pageWrap.confirm;
      let ids = "";
      let { btnType } = this.pageBtnParams[index];
      if (btnType === "url" && (!selectedList || !selectedList.length)) {
        return this.$Message.warning("请至少选择一条数据!");
      } else {
        let idArr = [];
        selectedList.forEach(element => {
          idArr.push(element.id);
        });
        ids = idArr.join(",");
      }
      switch (index) {
        case 0:
          confirmFun({
            url: `product/parkTicket/${ids}`,
            method: "delete",
            content: "删除后将影响已有订单退票、核销，请谨慎操作"
          });
          break;
        case 1:
          confirmFun({
            url: `product/parkTicket/enable`,
            param: { enable: "T", ids: ids },
            title: "上架",
            content: "确认上架?"
          });
          break;
        case 2:
          confirmFun({
            url: `product/parkTicket/enable`,
            param: { enable: "F", ids: ids },
            title: "下架",
            content: "确认下架?"
          });
          break;
        default:
      }
    },
    addTicket() {
      this.$router.push({
        path: "/publishParkTicket",
        query: { parkId: this.parkId }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // let { id } = to.query;
      // if (id) {
      //   vm.$refs.pageWrap.getTableList({ id });
      // } else {
      //   vm.$refs.pageWrap.getTableList({ id });
      // }
    });
  }
};
</script>
