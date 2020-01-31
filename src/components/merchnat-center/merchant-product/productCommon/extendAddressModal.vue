<template>
    <div>
        <Modal width="800" v-model="extentmodal" title="选择推广地址">
            <Table height="440" size="small" :columns="columns1" :data="data2"></Table>
            <Page @on-change="changePage" class="page" :total="40" size="small" show-elevator show-sizer></Page>
            <div slot="footer"></div>
        </Modal>
    </div>    
</template>
<script>
import { apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      extentmodal: false,
      page: 1,
      columns1: [
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
                    this.extentmodal = false;
                    this.remove(params.index);
                  }
                }
              },
              "选择"
            );
          }
        }
      ],
      data2: []
    };
  },
  mounted() {},
  methods: {
    remove(index){
      this.$emit('getExtendUrl',this.data2[index])
    },
    changePage(page) {
      this.page = page;
      this.getDataList();
    },
    getDataList() {
      apiPost(
        "/merchant/merchantQyyx/qyyxCodeGrid?marketDisAccount=qhyxiaojing",
        {
          page: this.page,
          limit: -1,
          sort: "createTime",
          order: "desc"
        }
      ).then(data => {
        this.data2 = data.rows||[];
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  margin-top: 15px;
}
</style>
