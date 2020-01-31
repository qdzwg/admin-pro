<template>
  <div class="page-template">
    <Form ref="formInline" v-if="searchData.length" :model="searchForm" inline>
      <FormItem v-for="(item, index) in searchData" :key="index">
        <Input
          v-if="item.type == 'input'"
          v-model="searchForm[item.name]"
          :placeholder="'请输入' + item.label"
        ></Input>
        <DatePicker
          v-if="item.type == 'date'"
          type="date"
          confirm
          @on-change="searchForm[item.name] = $event"
          format="yyyy-MM-dd"
          :placeholder="'请选择' + item.label"
          v-model="searchForm[item.name]"
        ></DatePicker>
        <Select
          v-if="item.type == 'select'"
          v-model="searchForm[item.name]"
          style="width:180px"
          :placeholder="'请选择' + item.label"
        >
          <Option
            v-for="sitem in item.data"
            :value="sitem.value"
            :key="sitem.value"
            >{{ sitem.label }}</Option
          >
        </Select>
      </FormItem>
      <Button type="primary" icon="ios-search" @click="_handleSubmit()"
        >搜索</Button
      >
    </Form>
    <slot name="remark"></slot>
    <slot name="topbtn" :selectedList="selectedList"> </slot>
    <Table
      :border="border"
      ref="table"
      class="table-style"
      :columns="columns"
      :data="tableList"
      :show-header="showHeader"
      @on-selection-change="_changeSelection"
      :loading="loading"
    >
    </Table>
    <Page
      :total="total"
      :current="currPage"
      class="page-style"
      v-if="pageFlag && tableList.length"
      @on-change="_changepage"
      show-elevator
      show-sizer
    ></Page>
    <Modal
      v-model="confirmModel"
      width="360"
      class-name="ivu-confirm-modal"
      class="v-confirm-dom"
    >
      <p slot="header" style="color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>{{ modalTitle ? modalTitle : "信息确认" }}</span>
      </p>
      <div>
        <p>{{ modalContent }}</p>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="error" @click="_ok">确认</Button>
        <Button type="ghost" @click="_cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { apiPost, apiGet, apiDelete } from "@/fetch/api";
export default {
  components: {},
  props: {
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    searchItems: {
      type: Array,
      default: function() {
        return [];
      }
    },
    columns: {
      type: Array,
      required: true,
      default: function() {
        return [];
      }
    },
    url: {
      type: String,
      required: true
    },
    pageFlag: {
      type: Boolean,
      default: false
    },
    firstUnload: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: function() {
        return {};
      }
    },
    pageKey: {
      type: Object,
      default: function() {
        return {
          currPage: "page",
          pageSize: "limit"
        };
      }
    },
    hasDataKey: {
      //判断列表返回数据是否有 data
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchData: this.cloneDeep(this.searchItems),
      searchForm: {},
      tableList: [],
      selectedList: [],
      currPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      confirmModel: false,
      confirmParam: {},
      method: "get",
      confirmUrl: "",
      modalContent: "",
      modalTitle: "",
      sucessMsg: "",
      // params: {},
      isRefresh: false
    };
  },
  watch: {
    searchItems: {
      handler: function(val) {
        this.searchData = this.cloneDeep(val);
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    getTableList(param = {}) {
      this.loading = true;
      // this.params = param
      this.$nextTick(() => {
        let paramsInfo = {
          [this.pageKey.currPage]: this.currPage,
          [this.pageKey.pageSize]: this.pageSize,
          ...this.params,
          ...param,
          ...this.searchForm
        };
        apiPost(this.url, paramsInfo)
          .then(res => {
            this.loading = false;
            if (!this.hasDataKey) {
              this.tableList = res.rows;
              this.total = res.total;
            } else {
              this.tableList = res.data.rows;
              this.total = res.data.total;
            }
            cb();
          })
          .catch(err => {
            this.loading = false;
          });
      });
    },
    initPage() {
      this.currPage = 1;
    },
    getSelectData() {
      return this.selectedList;
    },
    _handleSubmit() {
      this.currPage = 1;
      this.getTableList();
    },
    _changeSelection(data) {
      this.selectedList = data;
    },
    _changepage(page) {
      this.currPage = page;
      this.getTableList();
    },
    /**
     * @param {string} url 请求地址
     * @param {string} param 请求参数
     * @param {string} title 确认弹框头部
     * @param {string} content 确认弹框内容
     * @param {string} sucessMsg 弹框成功时提示
     * @param {string} method 目前支持post、get
     */
    confirm({
      url,
      param = {},
      method = "get",
      title = "信息",
      content = "",
      sucessMsg = "",
      isRefresh = true
    }) {
      this.confirmUrl = url;
      this.confirmParam = param;
      this.method = method;
      this.modalContent = content;
      this.modalTitle = title;
      this.sucessMsg = sucessMsg;
      this.confirmModel = true;
      this.isRefresh = isRefresh;
    },
    _cancel() {
      this.confirmModel = false;
    },
    _ok() {
      let request = apiGet;
      if (this.method === "post") request = apiPost;
      if (this.method === "delete") request = apiDelete;
      request(this.confirmUrl, this.confirmParam).then(res => {
        if (res.success || res.status == 200) {
          this.confirmModel = false;
          if (this.isRefresh) {
            this.getTableList();
          }
          this.$Message.success(this.sucessMsg ? this.sucessMsg : "操作成功!");
        } else {
          this.$Message.warning(res.message ? res.message : "操作失败");
        }
      });
    },
    request({ url, method = "post", param, curRefresh = true, isTip = true }) {
      let request = apiPost;
      if (method === "get") request = apiGet;
      return new Promise(async (resolve, reject) => {
        let info = await request(url, param);

        if (info.success || info.status == 200) {
          if (curRefresh) {
            this.getTableList();
          } else {
            this.currPage = 1;
            this.getTableList();
          }

          // if (isRefresh) {
          //   this.currPage = 1;
          //   this.getTableList();
          // }
          if (isTip) {
            this.$Message.success(info.message ? info.message : "操作成功!");
          }
          resolve({ ...info });
        } else {
          reject(new Error("出错了"));
          this.$Message.warning(info.message ? info.message : "操作失败");
        }
      });
    }
  },
  created() {
    if (!this.firstUnload) {
      this.getTableList();
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.page-template {
  .table-style {
    margin-top: 15px;
  }
  .page-style {
    margin-top: 15px;
  }
}
</style>
