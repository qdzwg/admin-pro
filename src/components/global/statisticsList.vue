<template>
    <div>
        <Form ref="formInline" :model="searchForm" inline v-show="searchItems&&searchItems.length">
            <Row>
                <Col span="20">
                <FormItem v-for="item in searchItems" :key="item.name" :style="{'width':1/(searchItems.length+1)*100+'%'}">
                    <Input v-if="item.type=='input'" v-model="searchForm[item.name]" :placeholder="'请输入'+item.label"></Input>
                    <DatePicker v-if="item.type=='date'" type="date" :placeholder="'请输入'+item.label" v-model="searchForm[item.name]" format="yyyy-MM-dd" @on-change="searchForm[item.name]=$event"></DatePicker>
                    <Select v-if="item.type=='select'" v-model="searchForm[item.name]" :placeholder="'请选择'+item.label">
                        <Option v-for="sitem in item.data" :value="sitem.value" :key="sitem.value">{{ sitem.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem>
                    <Button type="primary" icon="ios-search" style="margin-right:10px;" @click="handleSubmit2()">搜索</Button>
                    <span v-for="item in hannleItems" :key="item.title" style="margin-right:10px;">
                        <Button :type="item.type||'primary'" :icon="item.icon" @click="item.callback" :loading="item.loading">{{ item.title }}</Button>
                    </span>
                </FormItem>
                </Col>
            </Row>
        </Form>
        <div :style="{'padding-bottom':padding}" class="grids">
            <Table ref="table" border :columns="columns" :data="res2.rows" :url="url" @on-selection-change="changeSelection2" :loading="loading"></Table>
            <table v-if="tableTotal" style="width:100%;color:red;margin-top:-1px;" class="refund-table" border>
                <tr>
                    <td style="width:4.8%;padding-left:18px;"> 汇总：</td>
                    <td colspan="1" style="width:17.7%"></td>
                    <td style="width:3.5%;padding-left:16px;">{{refundData.refundTotalNum}}</td>
                    <td style="width:3.5%"></td>
                    <td style="width:4%;padding-left:15px;">{{refundData.refundTotalSum}}</td>
                    <td style="width:8.8%;padding-left:18px;">{{refundData.refundTotalFee}}</td>
                </tr>
            </table>
            <Page :total="res2.total" class-name="pages" @on-change="changepage2" @on-page-size-change='pageSizeChange2' show-elevator show-sizer></Page>
        </div>
    </div>
</template>
<script>
import { apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      res: {},
      padding: "0px",
      refundData: {},
      searchForm: {},
      loading: false,
      params1:{},
      defaultParams: { page: 1, limit: 10, sort: "createTime", order: "desc" }
    };
  },
  props: {
    tableTotal: {
      type: String
    },
    text: {
      type: String
    },
    searchItems: {
      type: Array
    },
    hannleItems: {
      type: Array
    },
    columns: {
      type: Array,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  created() {
    var agent = navigator.userAgent.toLowerCase();

    //firefox
    if (agent.indexOf("firefox") > 0) {
      this.padding = "50px";
    }
  },
  mounted() {
    this.searchItems.map(ele => {
      if (ele.value) {
        this.searchForm[ele.name] = ele.value ? ele.value : "";
      }
      if (ele.saleType) {
        this.searchForm[ele.name] = ele.saleType ? ele.saleType : "";
      }
      if (ele.today) {
        this.searchForm[ele.name] = ele.today ? ele.today : "";
      }
    });

    // this.$store.state.list.url = this.url;
    // this.$store.state.list.params = Object.assign(
    //   this.defaultParams,
    //   this.params
    // );
    this.params1 =  Object.assign(
      this.defaultParams,
      this.params
    )
    this.loadpage();
  },
  computed: {
    res2() {
      // return this.$store.state.list.res.data
      //   ? this.$store.state.list.res.data
      //   : this.$store.state.list.res;
      return this.res.data
        ? this.res.data
        : this.res;
    }
  },
  methods: {
    changepage2(num) {
      // this.$store.state.list.params.page = num;
      this.params1.page = num;
      this.loadpage();
    },
    pageSizeChange2(page) {
      this.params1.limit = page;
      // this.$store.state.list.params.limit = page;
      this.loadpage();
    },
    changeSelection2(selection) {
      this.selection = selection;
    },
    async handleSubmit2() {
      for (let item in this.searchForm) {
        if (typeof this.searchForm[item] === "object") {
          this.searchForm[item] = this.searchForm[item].toLocaleDateString();
        }
        // console.log(item+":"+typeof this.searchForm[item])
      }
      // this.$store.state.list.params = Object.assign(
      //   this.$store.state.list.params,
      //   this.searchForm
      // );
      this.params1 = Object.assign(
        this.params1,
        this.searchForm
      );
      this.params1.page = 1
      this.loadpage();
    },
    async loadpage() {
      this.loading = true;
      // await this.$store.dispatch("postApi");
      this.res = await apiPost(this.url, this.params1)
      if (this.tableTotal) {
        this.refundTodal();
      }
      this.loading = false;
    },
    async refundTodal() {
      apiPost(this.tableTotal, this.params1).then(res => {
        this.refundData = res.data;
      });
    }
  }
};
</script>

<style scoped>
.refund-table {
  border: 1px solid #e9eaec;
  border-collapse: collapse; /*关键代码*/
}
.refund-table tr {
  height: 40px;
}
</style>

