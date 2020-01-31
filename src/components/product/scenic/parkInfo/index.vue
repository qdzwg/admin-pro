<template>
  <div>
    <page-template
      :search-items="searchItems"
      :columns="columns"
      :btn-params="pageBtnParams"
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
    <Modal v-model="modalFlag" title="同步智游宝门票" width="800" footer-hide>
      <page-template
        :search-items="zybSearchItems"
        :columns="zybColumns"
        firstUnload
        pageFlag
        :url="zybUrl"
        ref="zybPageWrap"
      >
      </page-template>
    </Modal>
    <the-modal
      v-model="tpFlag"
      title="同步智游宝套票"
      @ok="taoPiaoOk"
      @cancel="taoPiaoCancel"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
        <FormItem label="智游宝套票编码" :label-width="120" prop="zybComboCode">
          <Input
            v-model="formValidate.zybComboCode"
            placeholder="请输入智游宝套票编码"
          ></Input>
        </FormItem>
      </Form>
    </the-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isSongCheng: true,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "景区名称",
          key: "name"
        },
        {
          title: "景区类型",
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
          title: "景区编码",
          key: "productCode"
        },
        {
          title: "景区等级",
          key: "parkLevel",
          render: (h, params) => {
            return h("span", this.filter.parkLevel(params.row.parkLevel));
          }
        },
        {
          title: "同步状态",
          key: "synced",
          render: (h, params) => {
            return h("span", params.row.synced == "F" ? "否" : "是");
          }
        },
        {
          title: "状态",
          key: "enabled",
          render: (h, params) => {
            return h("span", params.row.enabled == "F" ? "已闭园" : "开园中");
          }
        },
        {
          title: "排序",
          key: "sortNo",
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
                    url: "product/api/park/api/updateParkSortNo",
                    method: "get",
                    param: {
                      parkInfoId: id,
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
          // width: 250,
          // align: 'center',
          render: (h, params) => {
            let { id, enabled, channel, isSyncYpw } = params.row;
            let enabledText = enabled == "F" ? "开园" : "闭园";
            const actions = [
              {
                title: enabledText,
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: `product/parkInfo/enable`,
                    param: {
                      ids: id,
                      enable: enabled == "F" ? "T" : "F"
                    },
                    content: `确认${enabledText}?`,
                    sucessMsg: enabledText + "成功！"
                  });
                }
              },
              {
                title: "门票",
                action: () => {
                  this.$router.push({
                    path: "/parkTicket",
                    query: { parkId: id }
                  });
                }
              },
              {
                title: "修改",
                action: () => {
                  // this.$router.push("ticketEdit" + params.row.id)
                  this.$router.push({ path: "/ticketEdit/" + id });
                }
              },
              {
                title: "删除",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: `product/parkInfo/del`,
                    param: {
                      id
                    },
                    content: "删除后将影响已有订单退票、核销，请谨慎操作"
                  });
                }
              }
            ];
            if (!this.isSongCheng) {
              if (channel == 1 || channel == 3) {
                actions.push({
                  title: "同步智游宝门票",
                  action: () => {
                    // this.zybParams =
                    this.parkId = id;
                    this.modalFlag = true;
                    this.$refs.zybPageWrap.getTableList({
                      parkId: id,
                      type: "scenic"
                    });
                  }
                });
              }
              if (channel != 0 || channel == -1) {
                actions.push({
                  title: "同步智游宝套票",
                  action: () => {
                    this.tpFlag = true;
                    this.parkId = id;
                  }
                });
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
                      title: "推送云票务",
                      content: "确定推送?",
                      isRefresh: false
                    });
                  }
                });
              }
            }

            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      pageBtnParams: [
        {
          btnType: "router",
          link: "",
          icon: "android-add",
          type: "primary",
          name: "添加"
        },
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
          name: "开园"
        },
        {
          btnType: "url",
          link: "",
          icon: "android-close",
          type: "primary",
          name: "闭园"
        }
      ],
      parkId: "",
      url: "/product/api/park/api/gridParkFL",
      zybUrl: "/product/parkTicket/zybTicketGrid",
      searchItems: [
        {
          label: "景区名称",
          type: "input",
          name: "name"
        },
        {
          label: "景区编码",
          type: "input",
          name: "productCode"
        },
        {
          label: "景区等级",
          type: "select",
          name: "parkLevel",
          data: [
            {
              value: "0",
              label: "无等级"
            },
            {
              value: "1",
              label: "1A"
            },
            {
              value: "2",
              label: "2A"
            },
            {
              value: "3",
              label: "3A"
            },
            {
              value: "4",
              label: "4A"
            },
            {
              value: "5",
              label: "5A"
            }
          ]
        },
        {
          label: "是否开园",
          type: "select",
          name: "enabled",
          data: [
            {
              value: "",
              label: "请选择"
            },
            {
              value: "T",
              label: "开园中"
            },
            {
              value: "F",
              label: "已关闭"
            }
          ]
        }
      ],
      // zybParams: {},
      zybSearchItems: [
        {
          label: "搜索名称",
          type: "input",
          name: "searchName"
        }
      ],
      zybColumns: [
        {
          title: "票型名称",
          key: "name",
          width: 260
        },
        {
          title: "票型编码",
          key: "goodsCode",
          width: 260
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                on: {
                  click: () => {
                    this.selectZyb(params.row);
                  }
                }
              },
              "选择"
            );
          }
        }
      ],
      modalFlag: false,
      tpFlag: false,
      formValidate: {
        zybComboCode: ""
      },
      ruleValidate: {
        zybComboCode: [
          { required: true, message: "智游宝套票编码必填", trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  created() {
    let columns = this.columns;
    if (this.isSongCheng) {
      this.columns = columns.filter(item => {
        return item.key != "channel" && item.key != "synced";
      });
    }
  },
  mounted() {},
  methods: {
    /**
     * 操作表格全局按钮
     * @param {number} index 全局按钮索引
     * @param {object} selectedList 已选择表格数据
     */
    actionBtns(index, selectedList) {
      const confirmFun = this.$refs.pageWrap.confirm;
      let ids = "";
      let idArr = [];
      let { btnType } = this.pageBtnParams[index];
      if (btnType === "url" && (!selectedList || !selectedList.length)) {
        return this.$Message.warning("请至少选择一条数据!");
      } else if (btnType === "url" && selectedList && selectedList.length) {
        selectedList.forEach(element => {
          idArr.push(element.id);
        });
        ids = idArr.join(",");
      }
      switch (index) {
        case 0:
          this.$router.push("/publishPark");
          break;
        case 1:
          confirmFun({
            url: `product/parkInfo/${ids}`,
            method: "delete",
            content: "删除后将影响已有订单退票、核销，请谨慎操作"
          });
          break;
        case 2:
          confirmFun({
            url: `product/parkInfo/enable`,
            param: { enable: "T", ids: ids },
            title: "上架",
            content: "确认开园?"
          });
          break;
        case 3:
          confirmFun({
            url: `product/parkInfo/enable`,
            param: { enable: "F", ids: ids },
            title: "下架",
            content: "确认闭园?"
          });
          break;
        default:
      }
    },
    selectZyb(params) {
      let { name, goodsCode, checkModel } = params;
      let parkId = this.parkId;
      this.apiGet("product/parkTicket/syncZybParkTicket", {
        name,
        goodsCode,
        checkModel,
        parkId
      }).then(res => {
        this.$Message.success(res.message);
      });
    },
    taoPiaoOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.loading = false;
          this.apiPost("product/parkTicket/syncZybCombo", {
            parkId: this.parkId,
            zybComboCode: this.formValidate.zybComboCode
          }).then(res => {
            if (res.success) {
              this.$Message.success(res.message);
              this.tpFlag = false;
            } else {
              this.$Message.warning(res.message);
            }
          });
        }
      });
    },
    taoPiaoCancel() {
      this.tpFlag = false;
      this.$refs.formValidate.resetFields();
    }
  }
};
</script>
<style lang="scss">
.ivu-input-number-handler-wrap {
  display: none;
}
</style>
