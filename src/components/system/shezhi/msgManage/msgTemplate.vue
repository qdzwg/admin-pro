<template>
  <div class="msg-template">
    <the-page-template
      :search-items="searchItems"
      :columns="columns"
      pageFlag
      :url="url"
      ref="pageWrap"
    >
      <Row slot="topbtn">
        <Button type="primary" icon="android-add" @click="addFun"
          >创建新模板</Button
        >
      </Row>
    </the-page-template>
    <record-com v-model="recordFlag" :id="id"></record-com>
    <crowd-com v-model="crowdFlag" :id="id"></crowd-com>
    <edit-com
      v-model="editFlag"
      :id="id"
      :msgTemplate="msgTemplate"
      :msgStatus="statusList"
      :massTextingFlag="massTextingFlag"
    ></edit-com>
  </div>
</template>

<script>
import thePageTemplate from "@/components/global/thePageTemplate.vue";
import theModal from "@/components/global/theModal.vue";
import recordCom from "./components/record.vue";
import editCom from "./components/edit.vue";
import crowdCom from "./components/crowd.vue";
const StatusList = [
  { value: "17", label: "退单成功", msgTemplate: 1 },
  {
    value: "18",
    label: "定时自动退单，提示供应商短信",
    msgTemplate: 1
  },
  { value: "15ticket_sync", label: "同步门票下单成功", msgTemplate: 1 },
  {
    value: "15cloud_repast_ordinary",
    label: "云餐饮下单成功",
    msgTemplate: 1
  },
  {
    value: "15hotel_waitconfirm",
    label: "酒店下单成功等待供货方确认",
    msgTemplate: 1
  },
  { value: "15ticket_ordinary", label: "门票下单成功", msgTemplate: 1 },
  {
    value: "15repast_notify",
    label: "餐饮下单成功通知供货方",
    msgTemplate: 1
  },
  { value: "15eatery_ordinary", label: "餐饮下单成功", msgTemplate: 1 },
  { value: "15family_ordinary", label: "套票下单成功", msgTemplate: 1 },
  {
    value: "15mdse_notify",
    label: "商品下单成功通知供货方",
    msgTemplate: 1
  },
  {
    value: "15guide_notify",
    label: "导游下单成功通知卖方",
    msgTemplate: 1
  },
  {
    value: "15route_confirm",
    label: "线路下单二次确认成功后通知买方",
    msgTemplate: 1
  },
  {
    value: "15family_notify",
    label: "套票下单成功通知供货方",
    msgTemplate: 1
  },
  {
    value: "15route_waitconfirm",
    label: "线路下单成功通知供货方确认",
    msgTemplate: 1
  },
  {
    value: "15route_ordinary",
    label: "跟团游下单成功",
    msgTemplate: 1
  },
  {
    value: "15route_notify",
    label: "线路下单成功通知供货方",
    msgTemplate: 1
  },
  {
    value: "15guide_ordinary",
    label: "导游下单成功通知买方",
    msgTemplate: 1
  },
  {
    value: "15pms_hotel_ordinary",
    label: "PMS酒店下单成功",
    msgTemplate: 1
  },
  {
    value: "15hotel_confirmcancel",
    label: "酒店下单供货方确认取消",
    msgTemplate: 1
  },
  {
    value: "15hotel_notify",
    label: "酒店下单成功通知供货方确认",
    msgTemplate: 1
  },
  { value: "1_notice_fail", label: "订单异常短信通知", msgTemplate: 1 },
  { value: "15hotel", label: "酒店下单成功", msgTemplate: 1 },
  { value: "30", label: "拼团成功通知", msgTemplate: 3 },
  { value: "31", label: "拼团失败通知", msgTemplate: 3 },
  { value: "32", label: "团长开团通知", msgTemplate: 3 },
  { value: "40alliance", label: "联盟推广", msgTemplate: 4 }
];
export default {
  components: { thePageTemplate, theModal, recordCom, editCom, crowdCom },
  props: {},
  data() {
    return {
      id: "",
      massTextingFlag: false, //短信群发
      editFlag: false, //模板新增或编辑
      recordFlag: false, //记录
      crowdFlag: false, //选择人群
      url: "/merchant/api/merchantMessage/template/grid",
      searchItems: [
        {
          label: "请选择消息类型",
          type: "select",
          name: "msgType",
          data: [
            {
              value: "",
              label: "--请选择消息类型--"
            },
            {
              value: "0",
              label: "短信"
            }
          ]
        },
        {
          label: "请选择状态",
          type: "select",
          name: "status",
          data: [
            {
              value: "",
              label: "--请选择状态--"
            },
            ...StatusList
          ]
        }
      ],
      columns: [
        {
          title: "消息类型",
          key: "msgType",
          width: 120,
          align: "center",
          render: (h, params) => {
            let { msgType } = params.row;
            let text = this.filterType(msgType, this.msgTypeList);
            return h("p", {}, text);
          }
        },
        {
          title: "模板类型",
          key: "templateType",
          width: 120,
          align: "center",
          render: (h, params) => {
            let { templateType } = params.row;
            let text = this.filterType(templateType, this.msgTemplate);
            return h("p", {}, text);
          }
        },
        {
          title: "状态",
          key: "status",
          width: 200,
          align: "center",
          render: (h, params) => {
            let { status } = params.row;
            let text = this.filterType(status, StatusList);
            return h("p", {}, text);
          }
        },
        {
          title: "标题",
          key: "title",
          align: "center"
        },
        {
          title: "模板内容",
          key: "info",
          align: "center"
        },
        {
          title: "模板描述",
          key: "descContent",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 280,
          align: "center",
          render: (h, params) => {
            let { id, templateType, sysTemplateId } = params.row;
            let actions = [
              h(
                "Button",
                {
                  style: {
                    marginRight: "10px"
                  },
                  props: {
                    type: "ghost",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.id = id;
                      this.editFlag = true;
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  style: {
                    marginRight: "10px"
                  },
                  props: {
                    type: "ghost",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.id = id;
                      this.recordFlag = true;
                    }
                  }
                },
                "发送记录"
              )
            ];
            //非系统模板切订单类型
            if (!sysTemplateId && templateType == 1) {
              actions.push(
                h(
                  "Button",
                  {
                    style: {
                      marginRight: "10px"
                    },
                    props: {
                      type: "ghost",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          path: "/msgEditTemplate",
                          query: { id }
                        });
                      }
                    }
                  },
                  "编辑商品"
                )
              );
            }
            //短信群发，选择人群按钮
            if (!sysTemplateId && templateType == 4 && this.massTextingFlag) {
              actions.push(
                h(
                  "Button",
                  {
                    style: {
                      marginRight: "10px"
                    },
                    props: {
                      type: "ghost",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.id = id;
                        this.crowdFlag = true;
                      }
                    }
                  },
                  "选择人群"
                )
              );
            }
            //非系统模板带删除
            if (!sysTemplateId) {
              actions.push(
                h(
                  "Button",
                  {
                    style: {
                      marginRight: "10px"
                    },
                    props: {
                      type: "ghost",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.deleteTmeplateFun(id);
                      }
                    }
                  },
                  "删除"
                )
              );
            }
            return h("div", actions);
          }
        }
      ],
      msgTypeList: [
        {
          value: "0",
          label: "短信"
        },
        {
          value: "3",
          label: "联盟推广短信"
        }
      ],
      msgTemplate: [
        {
          value: "1",
          label: "订单"
        },
        {
          value: "3",
          label: "营销中心"
        },
        {
          value: "4",
          label: "短信群发"
        }
      ],
      statusList: StatusList
    };
  },
  watch: {},
  computed: {},
  methods: {
    filterType(value, list) {
      if (!Array.isArray(list)) {
        console.error(`第二个参数期望值是数组`);
        return "";
      }
      let key = value.toString().trim();
      let text = list.filter(item => {
        return item.value == key;
      });
      return text.length ? text[0].label : "";
    },
    addFun() {
      this.id = "";
      this.editFlag = true;
    },
    deleteTmeplateFun(id) {
      let ids = id.toString();
      this.$refs.pageWrap.request({
        url: "/merchant/api/merchantMessage/template/delete",
        param: { ids: ids.split(",") }
      });
    }
  },
  async created() {
    let massTextingInfo = await this.apiGet(
      "/merchant/api/merchantMessage/template/showBatchSmsButton"
    );
    if (massTextingInfo.status == 200 && massTextingInfo.showButton) {
      this.massTextingFlag = massTextingInfo.showButton;
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
.msg-template {
  .form-width {
    width: 200px;
  }
  .total-num {
    color: #1c2438;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  }
}
</style>
s
