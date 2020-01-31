<template>
  <div class="pmsConfig">
    <Form
      :model="formItem"
      ref="formItem"
      :rules="ruleForm"
      inline
    >
      <FormItem prop="dockCorpName">
        <Input
          placeholder="请输入需要PMS对接的企业全称"
          style="width:230px;"
          v-model="formItem.dockCorpName"
        ></Input>
      </FormItem>
      <FormItem prop="dockCorpCode">
        <Input
          placeholder="请输入需要对接的企业编码"
          style="width:230px;"
          v-model="formItem.dockCorpCode"
        ></Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          @click="submit"
          :loading="loading"
        >生成对接私钥</Button>
      </FormItem>  
    </Form>
    <div style="margin-bottom:20px;">
      <span style="background:yellow;fontSize:16px;padding:5px 10px;">
        对接私钥是指某企业酒店云PMS与某LOTS商城对接的验证机制，酒店PMS方在申请开通网销功能时需要填写，只有私钥正确才能对接。企业编码请联系需求对接的企业获取
      </span>
    </div>
    <Table
      border
      :columns="columns"
      :data="tableList"
    >
    </Table>

  </div>
</template>


<script>
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
export default {
  data() {
    return {
      columns: [
        {
          title: "企业编码",
          key: "dockCorpCode"
        },
        {
          title: "对接企业名称",
          key: "dockCorpName"
        },
        {
          title: "对接私钥",
          key: "secretKey"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              //   {
              //     title: "更新",
              //     action: () => {}
              //   }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      tableList: [],
      loading: false,
      formItem: {
        dockCorpName: "",
        dockCorpCode: ""
      },
      ruleForm: {
        dockCorpName: [
          {
            required: true,
            message: "请填写PMS对接的企业全称",
            triggle: "blur"
          }
        ],
        dockCorpCode: [
          {
            required: true,
            message: "请填写PMS对接的企业编码",
            triggle: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    submit() {
      this.loading = true;
      this.$refs.formItem.validate(async vaild => {
        if (vaild) {
          apiPost(
            "/pmsproduct/webApi/pmsDockingConfig/addConfig",
            this.formItem
          ).then(res => {
            if (res.status == 200) {
              this.$Message.success("生成成功");
              this.getList();
              this.loading = false;
            } else {
              this.$Message.warning(res.message);
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      });
    },
    getList() {
      apiGet("/pmsproduct/webApi/pmsDockingConfig/listConfig").then(res => {
        if (res.status == 200) {
          this.tableList = res.data;
        } else {
          this.$Message.warning(res.message);
        }
      });
    }
  }
};
</script>


<style lang="scss">
.pmsConfig {
}
</style>