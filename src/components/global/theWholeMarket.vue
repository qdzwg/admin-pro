<template>
  <div>
    <the-modal
      width="750"
      v-model="modalFlag"
      title="绑定会员推广地址"
      @ok="ok"
      @cancel="cancel"
    >
      <Form
        height="450"
        :model="formdata"
        label-position="right"
        :label-width="120"
        :rules="ruleForm"
        ref="formItem"
      >
        <FormItem label="已配置地址" v-if="selectedInfo.name">
          <div>
            {{ selectedInfo.name }} ({{ selectedInfo.code }})
            <Button
              type="primary"
              @click="cancelBinding"
              style="padding-left:10px;"
              >取消绑定</Button
            >
          </div>
        </FormItem>
        <FormItem label="全员推广地址名称" prop="name">
          <Input readonly style="width: 200px" v-model="formdata.name"></Input>
          <Button @click="addressSelect" type="primary">选择推广地址</Button>
        </FormItem>
        <FormItem label="帮助信息" prop="nickName">
          <div>
            <p>1. 此处需在全员营销栏目，配置全员景区，以及全员专属分销商</p>
            <p>2. 根据配置拉取分销商推广地址</p>
            <p>
              3.
              配置对应地址，用于店铺景区/酒店/商品c端详情页，获取推广地址或地址海报
            </p>
          </div>
        </FormItem>
      </Form>
    </the-modal>
    <the-modal v-model="modal" width="750" :title="modalTitle" noFooter>
      <page-template
        :columns="columns"
        :params="params"
        pageFlag
        hasDataKey
        :url="url"
        firstUnload
        ref="pageWrap"
      ></page-template>
    </the-modal>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    },
    id: {
      required: true
    }
  },
  data() {
    return {
      modalFlag: this.value,
      merchantBusId: "",
      merchantWholeMarket: "",
      url: "/merchant/api/merchantWholeMarket/qyyxCodeGrid",
      params: {
        marketDisAccount: "qhyxiaojing"
      },
      // extentmodal: false,
      modal: false,
      modalTitle: "选择推广地址",
      selectedInfo: {},
      formdata: {
        merchantBusId: "", //id
        code: "",
        name: "",
        resellerid: "",
        codeid: ""
      }, //已配置的信息
      ruleForm: {
        name: [
          { required: true, message: "请选择全员推广地址名称", trigger: "blur" }
        ]
      },
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
          title: "推广编号",
          key: "code"
        },
        {
          title: "推广名称",
          key: "name"
        },
        {
          title: "推广地址",
          key: "proUrl"
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                on: {
                  click: () => {
                    let { name, codeid, code, resellerid } = params.row;
                    this.formdata.name = name;
                    this.formdata.codeid = codeid;
                    this.formdata.code = code;
                    this.formdata.resellerid = resellerid;
                    this.modal = false;
                  }
                }
              },
              "选择"
            );
          }
        }
      ]
    };
  },
  watch: {
    value: function(val) {
      this.modalFlag = val;
      if (val) {
        this.market();
      }
    }
  },
  components: {},
  mounted() {},
  methods: {
    ok() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.$refs.pageWrap
            .request({
              url: "merchant/api/merchantWholeMarket/saveQyCode",
              method: "POST",
              param: {
                ...this.formdata,
                merchantBusId: this.merchantBusId,
                busType: this.type
              }
            })
            .then(res => {
              this.modalFlag = false;
              this.formdata = {
                merchantBusId: "", //id
                code: "",
                name: "",
                resellerid: "",
                codeid: ""
              };
              this.$emit("input", false);
            });
        }
      });
    },
    cancel() {
      this.modalFlag = false;
      this.$emit("input", false);
    },
    addressSelect() {
      this.modal = true;
      this.$refs.pageWrap.getTableList({
        marketDisAccount: this.merchantWholeMarket
      });
    },
    cancelBinding() {
      console.log(this.selectedInfo);
      this.$Modal.confirm({
        title: "取消绑定",
        content: "确定要取消绑定么？",
        onOk: function() {
          this.apiPost("merchant/api/merchantWholeMarket/delQyCode", {
            ...this.selectedInfo,
            merchantBusId: this.merchantBusId,
            busType: this.type
          }).then(res => {
            if (res.success) {
              this.$Message.success("取消绑定成功");
              this.selectedInfo = {};
            } else {
              this.$Message.warn(res.message ? res.message : "操作失败");
            }
          });
        },
        onCancel: function() {}
      });
    },
    // 全员营销
    market() {
      this.apiGet(
        `/merchant/api/merchantWholeMarket/toSaveQyCode?type=${this.type}&businessId=${this.id}`
      ).then(res => {
        if (res.status == 200) {
          if (res.data.merchantQyyx) {
            this.selectedInfo = res.data.merchantQyyx;
          }
          this.merchantBusId = res.data.merchantBusId;
          this.merchantWholeMarket = res.data.merchantWholeMarket;
        } else {
          this.$Message.warning(res.message);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss"></style>
