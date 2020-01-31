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
    <!-- 弹出层 -->
    <the-modal
      v-model="modal"
      width="600"
      :title="modalTitle"
      @ok="ok"
      @cancel="cancel"
    >
      <Form
        :model="formItem"
        label-position="right"
        :label-width="120"
        ref="formValidate"
        :rules="ruleForm"
      >
        <FormItem label="标签类型：" prop="pushType">
          <Select
            v-model="formItem.pushType"
            placeholder="请选择类型"
            style="width:200px"
          >
            <Option
              v-for="item in pushTypeList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="产品名称：" prop="productName">
          <Input
            v-model="formItem.productName"
            style="width:200px"
            placeholder="请选择产品"
            type="text"
            disabled
          ></Input>
          <Button @click="openProduct">选则产品</Button>
        </FormItem>
        <FormItem label="排序：" prop="sortNum">
          <InputNumber
            :max="10000"
            :min="1"
            v-model="formItem.sortNum"
          ></InputNumber>
        </FormItem>
        <FormItem label="图片：">
          <up-img :limitNum="1" v-model="formItem.linkImg"></up-img>
          <p>仅支持jpg、png两种格式,大小不超过640*310像素</p>
        </FormItem>
        <FormItem label="投放通道：">
          <RadioGroup v-model="formItem.pushChannel">
            <Radio label="wap">WAP</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="帮助信息:">
          <Input
            v-model="helpTip"
            disabled
            :autosize="{ minRows: 8, maxRows: 12 }"
            type="textarea"
          ></Input>
        </FormItem>
      </Form>
    </the-modal>
    <Modal v-model="productModal" title="选择产品" width="800" footer>
      <page-template
        :search-items="productSearch"
        :columns="productColumns"
        pageFlag
        :url="productUrl"
        ref="productPage"
      >
      </page-template>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchItems: [
        {
          label: "产品名称",
          type: "input",
          name: "productName"
        },
        {
          label: "请选择页面类型",
          type: "select",
          name: "pushType",
          data: [
            {
              value: "fine",
              label: "精品推荐"
            },
            {
              value: "sell_well",
              label: "热销推荐"
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
          name: "添加"
        }
      ],
      columns: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            let { index } = params;
            return h("span", ++index);
          }
        },
        {
          title: "页面类型",
          key: "pushType",
          render: (h, params) => {
            let { pushType } = params.row;
            return h("span", this.$flType(pushType, this.pushTypeList));
          }
        },
        {
          title: "名称",
          key: "productName"
        },
        {
          title: "产品编码",
          key: "productCode"
        },
        {
          title: "业态",
          key: "businessType",
          render: (h, params) => {
            let { businessType } = params.row;
            return h("span", this.$flType(businessType, this.businessTypeList));
          }
        },
        {
          title: "排序",
          key: "sortNum",
          render: (h, params) => {
            return h("span", params.row.sortNum);
          }
        },
        {
          title: "投放渠道",
          key: "pushChannel",
          render: (h, params) => {
            return h("span", params.row.pushChannel);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            let {
              id,
              pushType,
              productName,
              sortNum,
              merchantProdcutId,
              linkimg,
              pushChannel
            } = params.row;
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.apiGet("merchant/merchantPushInfo/editFL", { id }).then(
                    res => {
                      this.modal = true;
                      this.modalTitle = "修改";
                      this.formItem.id = id;
                      this.formItem.pushType = pushType;
                      this.formItem.productName = productName;
                      this.formItem.sortNum = sortNum;
                      this.formItem.merchantProdcutId = merchantProdcutId;
                      this.formItem.linkImg = linkimg;
                      this.formItem.pushChannel = pushChannel;
                    }
                  );
                }
              },
              {
                title: "删除",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: `merchant/merchantPushInfo/${id}`,
                    method: "delete",
                    param: {
                      id
                    },
                    content: "删除后将影响已有订单退票、核销，请谨慎操作"
                  });
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      businessTypeList: [
        { label: "门票", value: "ticket" },
        { label: "房型", value: "room" },
        { label: "商品", value: "mdse" },
        { label: "餐券", value: "repast" },
        { label: "线路", value: "route" },
        { label: "年卡", value: "yearcard" }
      ],
      pushTypeList: [
        { label: "精品推荐", value: "fine" },
        { label: "热销推荐", value: "sell_well" }
      ],
      url: "merchant/merchantPushInfo/grid",
      helpTip: `1、如未上传图片，wap默认展示景区、酒店、商品的主图。
2、图片仅支持jpg、png两种格式, 大小建议不超过1MB。
3、图片建议尺寸如下(单位:像素)：
    精品推荐：模板一 200x190；模板二 640x250；模板三 610x250。
    热销推荐：模板一 180x140；模板二 290x170；模板三 280x170；模板四 210x150。`,
      modal: false,
      modalTitle: "新增",
      formItem: {
        id: "",
        pushType: "",
        productName: "",
        sortNum: 0,
        merchantProdcutId: "",
        linkImg: "",
        pushChannel: "wap"
      },
      ruleForm: {
        pushType: [
          { required: true, message: "请选择标签类型", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "请选择产品名称", trigger: "blur" }
        ]
      },
      productModal: false,
      productUrl: "merchant/merchantPushInfo/productGrid",
      productSearch: [
        {
          label: "请选择来源",
          type: "select",
          name: "prodFrom",
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
        },
        {
          label: "请选择产品类型",
          type: "select",
          name: "prodType",
          data: [
            {
              value: "ticket",
              label: "门票"
            },
            {
              value: "room",
              label: "房型"
            },
            {
              value: "mdse",
              label: "商品"
            }
          ]
        },
        {
          label: "产品名称",
          type: "input",
          name: "modelName"
        }
      ],
      productColumns: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            let { index } = params;
            return h("span", ++index);
          }
        },
        {
          title: "产品名称",
          key: "modelName"
        },
        {
          title: "产品编码",
          key: "modelCode"
        },
        {
          title: "来源",
          width: 120,
          key: "prodFrom",
          render: (h, params) => {
            let prodFromList = [
              { value: "自营", key: "prod" },
              { value: "分销", key: "dist_market" }
            ];
            let { prodFrom } = params.row;
            return h("span", this.$flType(prodFrom, prodFromList));
          }
        },
        {
          title: "产品类型",
          width: 120,
          key: "prodType",
          render: (h, params) => {
            let prodTypeList = [
              { value: "门票", key: "ticket" },
              { value: "房型", key: "room" },
              { value: "商品", key: "mdse" },
              { value: "餐券", key: "repast" },
              { value: "线路", key: "route" },
              { value: "年卡", key: "yearcard" }
            ];
            return h("span", this.$flType(params.row.prodType, prodTypeList));
          }
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            let { id, modelName } = params.row;
            const actions = [
              {
                title: "选择",
                action: () => {
                  this.formItem.merchantProdcutId = id;
                  this.formItem.productName = modelName;
                  this.productModal = false;
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ]
    };
  },
  components: {},
  mounted() {},
  methods: {
    /**
     * 操作表格全局按钮
     * @param {number} index 全局按钮索引
     * @param {object} selectedList 已选择表格数据
     */
    actionBtns(index, selectedList) {
      this.modal = true;
      this.modalTitle = "新增";
      this.formItem.pushType = "";
      this.formItem.productName = "";
      this.formItem.sortNum = 0;
      this.formItem.merchantProdcutId = "";
      this.formItem.linkImg = "";
      this.formItem.pushChannel = "wap";
    },
    ok(val) {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          let url = this.modalTitle.includes("新增")
            ? "merchant/merchantPushInfo/saveMerchantPushInfo"
            : "merchant/merchantPushInfo/updateMerchantPushInfo";

          this.$refs.pageWrap
            .request({ url, param: this.formItem })
            .then(res => {
              if (res && res.success) {
                this.modal = false;
              }
            });
        }
      });
    },
    cancel(val) {
      this.modal = false;
    },
    openProduct() {
      this.productModal = true;
      this.$refs.productPage.getTableList();
    }
  }
};
</script>
