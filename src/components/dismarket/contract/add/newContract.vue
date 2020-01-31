<template>
    <div class="newContract">
        <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleForm">
            <FormItem label="分销商：" prop="distMainUserName">
                <Input v-model="formItem.distMainUserName" style="width:33%;" :maxlength="30" disabled></Input>
                <Button type="primary" @click="choose">选择</Button>
            </FormItem>
            <FormItem label="合同模板：" prop="contractTemplateName">
                <Input v-model="formItem.contractTemplateName" style="width:33%;" :maxlength="30" disabled></Input>
                <Button type="primary" @click="contractTemp">选择</Button>
                <a style="margin-left:20px;" @click="contractTempLate">新建合同模板</a>
            </FormItem>
            <FormItem label="合同名称：" prop="contractName">
                <Input v-model="formItem.contractName" style="width:33%;" :maxlength="30"></Input>
            </FormItem>
            <FormItem label="合同期限：" required>
                <DatePicker transfer disabled :value="formItem.contractStartTime" @on-change="setBegDate" type="date" :options="options3" format="yyyy-MM-dd"></DatePicker>
                <span>-</span>
                <DatePicker transfer disabled :value="formItem.contractEndTime" @on-change="setEndDate" type="date" :options="options4" format="yyyy-MM-dd"></DatePicker>
            </FormItem>
            <FormItem label="合同内容预览：">
                <div v-html="formItem.contractContent"></div>
                <!-- <ueditor id="ue2" ref="mustKnow" :content="formItem.contractContent" :config="config"></ueditor> -->
                <!-- <vueUEditor v-model="formItem.contractContent" :config="config"></vueUEditor> -->
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">保存</Button>
                <Button @click="back">取消</Button>
            </FormItem>
        </Form>
        <Modal v-model="chooseModal" title="选择分销商">
            <div>
                <Table height='350' :loading='tableLoading' border :columns="columns" :data="data"></Table>
            </div>
            <div style="margin-top:10px">
                <Page :total="total" :current="page" :page-size="pageSize" @on-change="changePage" size="small"></Page>
            </div>
            <div slot='footer'>
            </div>
        </Modal>
        <Modal v-model="contractTempModal" title="选择合同模板" width=650>
            <div>
                <Table height='350' :loading='contractLoading' border :columns="columns2" :data="data2"></Table>
            </div>
            <div style="margin-top:10px">
                <Page :total="total2" :current="page2" :page-size="pageSize2" @on-change="changePage2" size="small"></Page>
            </div>
            <div slot='footer'>
            </div>
        </Modal>
    </div>
</template>

<script>
import ueditor from "@/components/global/ueditor";
import { apiPost, apiGet } from "@/fetch/api";
import vueUEditor from "@/components/global/vueUEditor";
export default {
  components: {
    ueditor,
    vueUEditor
  },
  data() {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formItem: {
        contractName: "",
        distMainUserId: "",
        contractTemplateName: "",
        contractTemplateId: "",
        contractStartTime: null,
        contractEndTime: null,
        contractContent: ""
      },
      ruleForm: {
        distMainUserName: [{ required: true, message: "请选择分销商" }],
        contractTemplateName: [{ required: true, message: "请选择合同模板" }],
        contractName: [
          { required: true, message: "请输入合同名称", trigger: "blur" }
        ],
        contractContent: [{ required: true, message: "请输入合同内容" }]
      },
      options4: {},
      options3: {},
      chooseModal: false,
      tableLoading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: "序号",
          key: "name",
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "分销商名称",
          key: "name"
        },
        {
          title: "分组名称",
          key: "group_name"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "选择",
                action: () => {
                  this.formItem.distMainUserName = params.row.name;
                  this.formItem.distMainUserId = params.row.distributorId;
                  this.chooseModal = false;
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: [],
      contractTempModal: false,
      contractLoading: false,
      total2: 0,
      page2: 1,
      pageSize2: 10,
      columns2: [
        {
          title: "序号",
          key: "name",
          width: 60,
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "合同名称",
          key: "name"
        },
        {
          title: "合同期限",
          render: (h, params) => {
            return h("span", params.row.startDate + " - " + params.row.endDate);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "选择",
                action: () => {
                  this.formItem.contractTemplateName = params.row.name;
                  this.formItem.contractTemplateId = params.row.id;
                  this.formItem.contractStartTime = params.row.startDate;
                  this.formItem.contractEndTime = params.row.endDate;
                  this.formItem.contractContent = params.row.content;
                  this.contractTempModal = false;
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data2: []
    };
  },
  methods: {
    setBegDate(time) {
      this.formItem.contractStartTime = time;
      this.options4 = {
        disabledDate: date => {
          let startTime = this.formItem.contractStartTime
            ? new Date(this.formItem.contractStartTime).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEndDate(time) {
      if (time) {
        this.formItem.contractEndTime = time;
        let endTime = this.formItem.contractEndTime
          ? new Date(this.formItem.contractEndTime).valueOf() -
            1 * 24 * 60 * 60 * 1000
          : "";
        this.options3 = {
          disabledDate(date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        this.options3 = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    choose() {
      this.chooseModal = true;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      apiPost("/admin/webapi/capitalAccount/grid", {
        page: this.page,
        limit: this.pageSize
      }).then(res => {
        if (res.status == 200) {
          this.tableLoading = false;
          this.data = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    changePage(val) {
      this.page = val;
      this.getList();
    },
    getList2() {
      this.contractLoading = true;
      apiPost("/admin/webApi/contractTemplate/page", {
        page: this.page2,
        limit: this.pageSize2,
        status:'T',
      }).then(res => {
        if (res.status == 200) {
          this.contractLoading = false;
          this.data2 = res.data.rows;
          this.total2 = res.data.total;
        }
      });
    },
    changePage2(val) {
      this.page2 = val;
      this.getList2();
    },
    contractTemp() {
      this.contractTempModal = true;
      this.getList2();
    },
    contractTempLate(){
        this.$router.push('/newContractTemplate')
    },
    back() {
      this.$router.back();
    },
    submit() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          apiPost("/admin/webApi/suppContract/addContract", this.formItem).then(
            res => {
              if (res.status == 200) {
                this.$Message.success(res.message);
                this.$router.back();
              } else {
                this.$Message.warning(res.message);
              }
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="scss">
.newContract {
}
</style>


