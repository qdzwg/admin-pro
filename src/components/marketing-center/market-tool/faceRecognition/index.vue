<template>
    <div class="faceRecognition">
    <searchForm :search-items='searchItems'></searchForm>
     <Row :gutter="16" class="btn-groups">
      <Col span="2">
        <Button type="primary" icon="android-add"  @click="addCoupon">添加</Button>
      </Col>
     <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
    </Row>
    
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <Modal v-model="modalpay" title="添加">
        <h1>您购买的服务已过期！</h1>

        <div slot="footer"></div>
    </Modal>
   </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import { apiPost, apiGet } from "@/fetch/api";
import confirm from "@/components/global/confirm";
export default {
  components: {
    searchForm,
    gridTable,
    confirm
  },
  data() {
    return {
      searchItems: [
        {
          label: "产品编码",
          type: "input",
          name: "productCode"
        },
        {
          label: "产品名称",
          type: "input",
          name: "productName"
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品编码",
          sortable: true,
          key: "productCode"
        },
        {
          title: "产品名称",
          key: "productName",
          sortable: true
        },
        {
          title: "产品业态",
          sortable: true,
          key: "type",
          render: (h, params) => {
            return h("span", this.filter.orderType(params.row.type));
          }
        },
        {
          title: "操作",
          key: "action",
          width: 260,
          align: "center",
          render: (h, params) => {
            let actions = [
              {
                title: "删除",
                action: () => {
                  this.mode = "delete";
                  this.content = "确定删除吗？";
                  this.sucessMsg = "操作成功！";
                  this.$refs.confirmModel.confirm(
                    "/marketing/marketFaceRecognitionProduct/" + params.row.id
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      mode: "",
      content: "",
      sucessMsg: "",
      dataList: {},
      modalpay: false,
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      url: "/marketing/marketFaceRecognitionProduct/grid"
    };
  },
  created() {},
  methods: {
    addCoupon() {
      this.modalpay=true
    },
     delAll(){
            let selection = this.$refs.gridTable.selection
            if (selection.length) {
            let ids = ''
            selection.forEach(element => {
                ids += element.id + ','
            })
            this.mode = "delete";
            this.content = "确定删除吗？";
            this.sucessMsg = "操作成功！";
            this.$refs.confirmModel.confirm('/admin/userAuth/userManage/' + ids)
            } else {
                this.$Message.warning('请选择一条数据！')
            }
        },
   
  }
};
</script>

<style lang="scss">
.faceRecognition {
  width: 100%;
}
.table {
  margin-bottom: 15px;
  width: 100%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  tr {
    td {
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #dddddd;
      padding: 8px;
      line-height: 20px;
    }
    .table-title {
      background-color: #f5fafe;
    }
  }
}
</style>







