<template>
  <theModal v-model="value" width="800" noFooter @cancel="recordCancelFun">
    <the-page-template
      style="margin:0"
      :search-items="rescordSearch"
      :columns="recordColumns"
      :params="params"
      pageFlag
      hasDataKey
      firstUnload
      :url="recordUrl"
      class="record"
      ref="recordPageWrap"
    >
      <p
        style="color: #1c2438;font-size: 14px;line-height: 20px;"
        slot="bottom"
      >
        总发送条数：{{ totalNum }}
      </p>
    </the-page-template>
  </theModal>
</template>

<script>
import thePageTemplate from "@/components/global/thePageTemplate.vue";
import theModal from "@/components/global/theModal.vue";
export default {
  components: { thePageTemplate, theModal },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      required: true
    }
  },
  data() {
    return {
      recordUrl: "/merchant/api/merchantMessage/send/grid",
      totalNum: 0,
      recordColumns: [
        {
          title: "发送时间",
          key: "createTime",
          align: "center"
        },
        {
          title: "联系人",
          key: "linkName",
          align: "center"
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center"
        },
        {
          title: "订单编号",
          key: "orderNo",
          align: "center"
        },
        {
          title: "发送状态",
          key: "msgType",
          align: "center",
          render: (h, params) => {
            let { status } = params.row;
            let text = "发送成功";
            if (status == 2) {
              text = "发送失败";
            }
            return h("p", {}, text);
          }
        },
        {
          title: "发送条数",
          key: "sendCount",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            let { id, status } = params.row;
            return status == 2
              ? h(
                  "Button",
                  {
                    props: { type: "ghost" },
                    on: {
                      click: () => {
                        if (status == 2) {
                          this.reSend(id);
                        }
                      }
                    }
                  },
                  "短信重发"
                )
              : "";
          }
        }
      ],
      rescordSearch: [
        {
          label: "请输入联系人",
          type: "input",
          name: "linkName"
        },
        {
          label: "请输入手机号",
          type: "input",
          name: "mobile"
        },
        {
          label: "请输入订单编号",
          type: "input",
          name: "orderNo"
        },
        {
          label: "请选择开始时间",
          type: "date",
          name: "startTime"
        },
        {
          label: "请选择结束时间",
          type: "date",
          name: "endTime"
        },
        {
          label: "请选择发送状态",
          type: "select",
          name: "status",
          data: [
            {
              value: "",
              label: "--请选择发送状态--"
            },
            {
              value: "1",
              label: "发送成功"
            },
            {
              value: "2",
              label: "发送失败"
            }
          ]
        }
      ],
      params: {}
    };
  },
  watch: {
    id: function(val, oldVal) {
      if (val && val != oldVal) {
        this.params.messageTemplateId = val;
        this.$refs.recordPageWrap.getTableList();
        this.apiPost("/merchant/api/merchantMessage/send/count", {
          messageTemplateId: val
        }).then(res => {
          if (res.status == 200) {
            this.totalNum = res.data;
          }
        });
      }
    }
  },
  computed: {},
  methods: {
    recordCancelFun() {
      this.$emit("input", false);
    },
    reSend(id) {
      this.$refs.recordPageWrap.request({
        url: "/merchant/api/merchantMessage/send/resend",
        method: "get",
        param: { sendId: id }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
