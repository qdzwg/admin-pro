<template>
    <div class="myDistCom">
        <list ref="gridTable" :columns="columns" :url="url" :searchItems="searchItems"></list>
        <confirm ref="confirmModel" :title='title' :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
        <Modal v-model="mangerShow" title="详情" wdith=600>
            <Form :model="formItem" label-position="right" :label-width="120" ref="formItem">
                <FormItem label="联系人姓名：">
                    <span>{{formItem.name}}</span>
                </FormItem>
                <FormItem label="联系人手机号：">
                    <span>{{formItem.phone}}</span>
                </FormItem>
                <FormItem label="身份证号：">
                    <span>{{formItem.idNo}}</span>
                </FormItem>
                <FormItem label="公司名称：">
                    <span>{{formItem.corpName}}</span>
                </FormItem>
                <FormItem label="导游证号：">
                    <span>{{formItem.guideNo}}</span>
                </FormItem>
                <FormItem label="导游证图片：">
                    <img v-if="formItem.guideImg" class="guideImg" :src="formItem.guideImg" alt="">
                </FormItem>
                <FormItem label="联系人地址：">
                    <p>{{formItem.locationName}}{{formItem.address}}</p>
                    <!-- <select-item style="display:none;" ref="select" :addrCode="formItem.locationCode" @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item> -->
                    <!-- <span>{{formItem.address}}</span> -->
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>

        <Modal v-model="reviewModal" :title="reviewName">
            <Form label-position="right" :label-width="120">
                <template v-if="reviewName=='审核结果'">
                    <FormItem label="审核状态：">
                        <RadioGroup v-model="review">
                            <Radio :disabled="disabled" label="T">审核成功</Radio>
                            <Radio :disabled="disabled" label="F">审核失败</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="审核备注：">
                        <Input type="textarea" v-model="remark" :rows="4" :disabled="disabled"></Input>
                    </FormItem>
                </template>
                <template v-else>
                    <FormItem label="审核状态：">
                        <RadioGroup v-model="review">
                            <Radio label="T">审核成功</Radio>
                            <Radio label="F">审核失败</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="审核备注：">
                        <Input type="textarea" :maxlength="100" v-model="remark" :rows="4"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="updateReview">确定</Button>
                        <Button @click="test">取消</Button>
                    </FormItem>
                </template>

            </Form>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>


<script>
import { apiGet, apiPost } from "@/fetch/api";
import list from "@/components/global/list";
import confirm from "@/components/global/confirm";
import selectItem from "@/components/global/selectList";
export default {
  components: {
    confirm,
    list,
    selectItem
  },
  data() {
    return {
      reviewModal: false,
      reviewName: "",
      review: "T",
      remark: "",
      distributorId: "",
      guideId: "",
      disabled: false,
      mangerShow: false,
      formItem: {},
      mode: "",
      title: "",
      content: "",
      sucessMsg: "",
      searchItems: [
        {
          label: "导游姓名",
          type: "input",
          name: "name"
        },
        {
          label: "身份证号码",
          type: "input",
          name: "idNo"
        }
      ],
      columns: [
        {
          title: "导游姓名",
          key: "name"
        },
        {
          title: "联系方式",
          key: "phone"
        },
        {
          title: "身份证号码",
          key: "idNo"
        },
        {
          title: "导游证号",
          key: "guideNo"
        },
        {
          title: "所属公司",
          key: "corpName"
        },
         {
          title: "分销商名称",
          key: "distributorName"
        },
        {
          title: "添加时间",
          key: "createTime"
        },
        {
          title: "审批状态",
          key: "review",
          render: (h, params) => {
            return h("span", this.filter.review(params.row.review));
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "查看详情",
                action: () => {
                  this.mangerShow = true;
                  this.formItem = params.row;
                }
              },
              {
                title: params.row.enable == "F" ? "解禁" : "禁单",
                action: () => {
                  this.mode = "post";
                  this.title = "确定是否" + (params.row.enable == "F" ? "解禁" : "禁单");
                  this.content = params.row.enable == "F" ? "解禁后，可以正常下单购买！" : "禁单后，不可下单购买！";
                  this.sucessMsg = "操作成功!";
                  this.$refs.confirmModel.confirm(
                    "/admin/webapi/userGuideReview/updateEnable",
                    {
                      distributorId: params.row.userId,
                      guideId: params.row.id,
                      status: params.row.enable == "F" ? "T" : "F"
                    }
                  );
                }
              }
            ];
            if (params.row.review == "P") {
              actions.push({
                title: "审核",
                action: () => {
                  this.reviewModal = true;
                  this.reviewName = "审核";
                  this.remark = params.row.remark;
                  this.review =
                    params.row.review == "P" ? "T" : params.row.review;
                  this.distributorId = params.row.userId;
                  this.guideId = params.row.id;
                }
              });
            } else if(params.row.review == "T"||params.row.review == "F") {
              actions.push({
                title: "审核结果",
                action: () => {
                  this.reviewModal = true;
                  this.reviewName = "审核结果";
                  this.remark = params.row.remark;
                  this.review =
                    params.row.review == "P" ? "T" : params.row.review;
                  this.disabled = true;
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      url: "/admin/webapi/guide/getAll"
    };
  },
  methods: {
    add() {
      this.$router.push("/newAddManger");
    },
    updateReview() {
      apiPost("/admin/webapi/userGuideReview/updateReview", {
        distributorId: this.distributorId,
        guideId: this.guideId,
        remark: this.remark,
        status: this.review
      }).then(res => {
        if (res.status == 200) {
          this.$Message.success(res.message);
          this.reviewModal = false;
          this.$refs.gridTable.loadpage();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    test() {
      this.reviewModal = false;
      this.disabled = true;
    }
  }
};
</script>


<style lang="scss">
.myDistCom {
}
.guideImg {
  width: 100px;
  height: 100px;
}
</style>


