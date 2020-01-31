<template>
  <div>
    <searchForm ref="formInline" :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">新增</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>  
      <span style="color: #7092be">提示：当列表产品名称与产品中心不一致时，删除后重新添加即可</span>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content"></confirm>
    <Modal v-model="modal" title="添加" width=800>
     
     <Form ref="tableList" :model="searchForm2" inline>
      <FormItem v-for="item in searchItems2"  :key="item.label">
        <Input v-if="item.type=='input'" v-model="searchForm2[item.name]" :placeholder="'请输入'+item.label"></Input>
        <Select v-if="item.type=='select'" v-model="searchForm2[item.name]" style="width:180px">
            <Option v-for="sitem in item.data" :value="sitem.value" :key="sitem.value">{{ sitem.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
          <Button type="primary" icon="ios-search" @click="handleSubmit2()">搜索</Button>
      </FormItem>
      <Button type="primary" @click="selectionAll">批量选择</Button>
    </Form>
    
    <div class="grids">
      <Table border :columns="columns2" :data="dataList"  @on-selection-change="changeSelection2"></Table>
      <Page :total="total" :current="searchForm2.page" :page-size="searchForm2.limit" class-name="pages" @on-change="changepage2" show-elevator></Page>
    </div>
    <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import tableList from "@/components/global/list";
import { apiPost, apiGet } from "@/fetch/api";
export default {
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品编码",
          key: "productCode"
        },
        {
          title: "产品名称",
          key: "productName"
        },
        {
          title: "产品业态",
          key: "type",
          render: (h, params) => {
            return h("span", this.filter.orderType(params.row.type));
          }
        }
      ],
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc",
        sysProductRoleId: this.$route.query.id
      },
      url: "/admin/sysProductRoleplugs/grid",
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
        },
        {
          label: "产品业态",
          type: "select",
          name: "type",
          data: [
            {
              value: "",
              label: "--请选择--"
            },
            {
              value: "hotel",
              label: "酒店"
            },
            {
              value: "mdse",
              label: "商品"
            }
          ]
        }
      ],
      content: "",
      mode:'',
      modal: false,
      dataList: [],
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品编码",
          key: "code"
        },
        {
          title: "产品名称",
          key: "name"
        },
        {
          title: "产品业态",
          key: "type",
          render: (h, params) => {
            return h("span", this.filter.orderType(params.row.type));
          }
        }
      ],
      total: 0,
      searchForm2: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc",
        type: "hotel",
        code: "",
        name: "",
        sysProductRoleId: this.$route.query.id
      },
      selectData: [],
      searchItems2: [
        {
          label: "产品编码",
          type: "input",
          name: "code"
        },
        {
          label: "产品名称",
          type: "input",
          name: "name"
        },
        {
          label: "产品业态",
          type: "select",
          name: "type",
          data: [
            {
              value: "",
              label: "--请选择--"
            },
            {
              value: "hotel",
              label: "酒店"
            },
            {
              value: "mdse",
              label: "商品"
            }
          ]
        }
      ]
    };
  },

  components: { searchForm, gridTable, confirm, tableList },
  methods: {
    showModal() {
      this.modal = true;
      this.handleSubmit2();
    },
    handleSubmit2() {
      apiPost("/admin/sysProductRoleplugs/productGrid", this.searchForm2).then(
        res => {
          res.rows.forEach(function(item, index) {
            if (item.flag) {
              item._disabled = true;
              item._checked = true;
            }
          });
          this.dataList = res.rows;
          this.total = res.total;
        }
      );
    },
    changeSelection2(num) {
      let data = [];
      num.forEach((item, index) => {
        if (item.flag == false) {
          data.push(item);
        }
      });
      this.selectData = data;
    },
    selectionAll() {
    //   if (this.selectData.length) {
        let ids = '';
        for (let key in this.selectData) {
          ids +=JSON.stringify(this.selectData[key]) + ",";
        }
        apiGet("/admin/sysProductRoleplugs/addProds", {
          sysProductRoleId: this.$route.query.id,
          ids: ids
        }).then(res => {
          if (res.success) {
            this.modal = false;
            this.$Message.success('操作成功')
            this.selectData=[]
            this.$refs.formInline.handleSubmit()
          }
        });
    //   } else {
    //       this.modal = false;
    //   }
    },
    changepage2(num) {
        this.searchForm2.page=num
        this.handleSubmit2();
    },
    delAll() {
      let selection = this.$refs.gridTable.selection;
      this.content = "确定删除吗？";
      this.mode='delete'
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id+',' ;
        });
        this.$refs.confirmModel.confirm("/admin/sysProductRoleplugs/delete?id=" +ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    }
  }
};
</script>
