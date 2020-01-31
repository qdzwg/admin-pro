<template>
    <div class="commonManger">
        <list ref="gridTable" :columns="columns" :url="url" :searchItems="searchItems" :hannleItems="hannleItems"></list>
        <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
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
      mangerShow: false,
      formItem: {},
      mode: "",
      content: "",
      sucessMsg: "",
      searchItems: [
        {
          label: "联系人姓名",
          type: "input",
          name: "name"
        }
      ],
      hannleItems: [
        {
          title: "新增",
          icon: "android-add",
          callback: () => {
            this.add();
          }
        }
      ],
      columns: [
        {
          title: "联系人姓名",
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
          title: "邮箱",
          key: "email"
        },
        {
          title: "添加时间",
          key: "createTime"
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
                title: "编辑",
                action: () => {
                  this.$router.push({
                    path: "/newAddManger",
                    query: { id: params.row.id }
                  });
                }
              },
              {
                title: "删除",
                action: () => {
                  this.mode = "done";
                  this.content = "你是否确认删除这项内容?";
                  this.sucessMsg = "删除成功!";
                  this.$refs.confirmModel.confirm(
                    "/admin/webapi/guide/delete?Id=" + params.row.id
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      url: "/admin/webapi/guide/grid"
    };
  },
  methods: {
    add() {
      this.$router.push("/newAddManger");
    }
  }
};
</script>


<style lang="scss">
.commonManger {
}
.guideImg {
  width: 100px;
  height: 100px;
}
</style>


