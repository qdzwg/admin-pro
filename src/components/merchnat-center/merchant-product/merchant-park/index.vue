<template>
  <div>
    <page-template
      :search-items="searchItems"
      :columns="columns"
      pageFlag
      :url="url"
      ref="pageWrap"
    >
    </page-template>
    <!-- 预览 -->
    <qrcode-modal :url="QRcodeUrl" v-model="qrcodeShow"></qrcode-modal>
    <!-- 景区公告 -->
    <the-modal
      width="500"
      v-model="extendShow"
      title="景区公告"
      @ok="extendOK"
      @cancel="cancel"
    >
      <Form
        :model="extend"
        label-position="right"
        :label-width="100"
        ref="completeForm"
        style="margin-top:10px;"
      >
        <FormItem label="景区公告：">
          <Input
            v-model="extend.parkNotice"
            :autosize="{ minRows: 3, maxRows: 6 }"
            type="textarea"
            :maxlength="50"
            placeholder="填写景区公告"
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
      extendId:'',
      extendType:'',
      url: "merchant/merchantParkInfo/grid",
      extendmodal: false,
      formdata: {},
      qyCode: {},
      extendShow: false,
      extend: {},
      qrcodeData: {},
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
          title: "景区名称",
          key: "name"
        },
        {
          title: "景区编码",
          key: "productCode"
        },
        {
          title: "来源",
          key: "prodFrom",
          render: (h, params) => {
            return h("span", params.row.prodFrom === "prod" ? "自营" : "分销");
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
          width: 500,
          key: "action",
          align: "center",
          render: (h, params) => {
            let { id, enabled  } = params.row;
            let actions = [
              {
                title: params.row.enabled === "T" ? "下架" : "上架",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: "merchant/merchantParkInfo/enable",
                    param: { id, enabled: enabled === "T" ? "F" : "T" },
                    title: "信息",
                    content: enabled === "T" ? "确认下架吗?" : "确认上架吗？",
                    sucessMsg: enabled === "T" ? "下架成功！" : "上架成功！"
                  });
                }
              },
              {
                title: "完善信息",
                action: () => {
                  this.$router.push(`/merchantParkInfo/${id}`);
                }
              },
              {
                title: "门票列表",
                action: () => {
                  this.$router.push(`/parkTickets/${id}`);
                }
              },
              {
                title: "预览",
                action: () => {
                  this.QRcodeUrl = `merchant/merchantParkInfo/previewInfo?id=${id}`;
                  this.qrcodeShow = true;
                }
              }
            ];
            actions.push({
              title: "景区公告",
              action: () => {
                this.apiGet(
                  `merchant/merchantParkInfo/getNotice?id=${id}`
                ).then(res => {
                  if (res.success || res.status == 200) {
                    this.extendShow = true;
                    let { productCode, parkNotice, id } = res.data;
                    this.extend = { productCode, parkNotice, id };
                  } else {
                    this.$Message.warning(res.message);
                  }
                });
              }
            });
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
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
        },
        {
          label: "来源",
          type: "select",
          name: "prodFrom",
          data: [
            {
              value: "",
              label: "--请选择来源--"
            },
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
      QRcodeUrl: ""
    };
  },
  methods: {
    cancel() {
      this.extendShow = false;
    },
    extendOK() {
      this.apiPost("merchant/merchantParkInfo/updateNotice", {
        id: this.extend.id,
        productCode: this.extend.productCode,
        parkNotice: this.extend.parkNotice
      }).then(res => {
        if (res.success || res.status == 200) {
          this.extendShow = false;
          this.$Message.success("保存成功！");
        } else {
          this.$Message.warning(res.message);
        }
      });
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
</style>
