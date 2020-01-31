<template>
  <div class="shopRuleProduct">
    <searchForm :search-items="searchItems"></searchForm>
    <Row :gutter="16" class="btn-groups">
     
      <Col span="3">
       <Button type="primary" icon="android-add" @click="addCode">添加购买规则</Button>
      </Col>
      <Col span="3">
        <Button type="primary" icon="android-add" @click=" showModal">添加售后规则</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

    <!-- 添加售后规则  /修改 -->
    <!-- 添加购买规则 -->
     <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok" width="800" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
        <FormItem label="产品规则名称：" prop="name">
            <Input v-model="formItem.name"></Input>
        </FormItem>
        <FormItem label="产品规则类型：">
            {{formItem.type=='0'?'购买':'售后'}}
        </FormItem>
        <FormItem label="备注：">
            <Input type="textarea" v-model="formItem.remark"></Input>
        </FormItem>
        <!-- 购买 -->
        <FormItem label="下单日期限制：" v-if="type=='0'">
             <DatePicker type="date" confirm v-model="formItem.orderBegDay" @on-change="formItem.orderBegDay=$event"  format="yyyy-MM-dd" placeholder="请选择开始时间" ></DatePicker >
            至
            <DatePicker type="date" confirm v-model="formItem.orderEndDay" @on-change="formItem.orderEndDay=$event"  format="yyyy-MM-dd" placeholder="请选择结束时间" ></DatePicker >
        </FormItem>
        <FormItem label="下单时间限制：" v-if="type=='0'">
             <TimePicker confirm v-model="formItem.dayBegTime" format="HH:mm" placeholder="请选择开始时间" ></TimePicker >
            至
            <TimePicker confirm v-model="formItem.dayEndTime" format="HH:mm" placeholder="请选择结束时间" ></TimePicker >
        </FormItem>
        <FormItem label="购买数量限定：" v-if="type=='0'">
            <Input v-model="formItem.minOrder" style="width:30%"></Input> -
            <Input v-model="formItem.maxOrder" style="width:30%"></Input>
        </FormItem>
        <!-- 售后 -->
        <FormItem label="退单是否允许：" v-if="type=='1'">
         <RadioGroup v-model="formItem.isRetreat">
                <Radio label="T">是</Radio>
                <Radio label="F">否</Radio>
            </RadioGroup>
        </FormItem>  
        <FormItem label="退单是否需要审核：" v-if="type=='1'">
         <RadioGroup v-model="formItem.isRetreatAudit">
                <Radio label="T" disabled>是</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="过期是否核销：" v-if="type=='1'">
         <RadioGroup v-model="formItem.isOverDueCheck">
                <Radio label="T" disabled>是</Radio>
            </RadioGroup>
        </FormItem>  
        <FormItem label="发货日期：" v-if="type=='1'" prop="checkRelativeDay" required>
            <Input v-model="formItem.checkRelativeDay" style="width:10%"></Input> <span> 天后自动核销</span>
            <p style="color:#5a98de">备注：订单发货后，有退单的交易，只能手动核销</p>
        </FormItem>
        </Form> 
    </Modal>
  </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
  data() {
    return {
      mode: "",
      content: "",
      sucessMsg: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "产品规则名称",
          key: "name",
          align: "center",
          sortable: true
        },
        {
          title: "产品规则编码",
          key: "code",
          align: "center",
          sortable: true
        },
        {
          title: "产品规则类型",
          key: "type",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("span", params.row.type == "0" ? "购买" : "售后");
          }
        },
        {
          title: "备注",
          key: "remark",
          align: "center",
          sortable: true
        },

        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.modal = true;
                  this.type = params.row.type; //判断是 购买还是售后 页面要显示的内容
                  this.modalTitle = "修改";
                  
                  this.formItem.name = params.row.name;
                  this.formItem.code = params.row.code;
                  this.formItem.type = params.row.type;
                  this.formItem.remark = params.row.remark;

                  this.formItem.orderBegDay = params.row.orderBegDay;
                  this.formItem.orderEndDay = params.row.orderEndDay;
                  this.formItem.dayBegTime = params.row.dayBegTime;
                  this.formItem.dayEndTime = params.row.dayEndTime;
                  this.formItem.minOrder = params.row.minOrder;
                  this.formItem.maxOrder = params.row.maxOrder;

                  this.formItem.isRetreat = params.row.isRetreat;
                  this.formItem.isRetreatAudit = params.row.isRetreatAudit;
                  this.formItem.isOverDueCheck = params.row.isOverDueCheck;
                  this.formItem.checkRelativeDay = params.row.checkRelativeDay;

                  
                }
              },
              {
                title: "删除",
                action: () => {
                  this.mode='done'
                  this.content = "确定删除吗？";
                  this.$refs.confirmModel.confirm(
                    "list/product/ruleProduct/del?ids=" + params.row.id
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc",
        modelType: "spec"
      },
      url: "product/ruleProduct/grid",
      modal: false,
      loading: true,
      modalTitle: "",
      formItem: {
        modelType: "spec",
        name: "", //产品规则名称
        code: "", //产品规则编码
        type: "", //产品规则类型
        remark: "", //备注
        // 购买
        orderBegDay: "", //下单日期选择开始
        orderEndDay: "", //下单日期选择结束
        dayBegTime: "", //下单时间选择开始
        dayEndTime: "", //下单时间选择结束
        minOrder: "", //购买数量范围开始（最小值）
        maxOrder: "", //购买数量范围结束（最大值）
        //   售后
        isRetreat: "", //是否允许退单
        isRetreatAudit: "T", //退单是否允许审核
        isOverDueCheck: "T", //过期是否核销
        checkRelativeDay: "" //发货日期
      },
      type: "",
      searchItems: [
        {
          label: "产品规则名称",
          type: "input",
          name: "name"
        },
        {
          label: "产品规则编码",
          type: "input",
          name: "code"
        },
        {
          label: "产品规则类型",
          type: "select",
          name: "type",
          data: [
            {
              value: "0",
              label: "购买"
            },
            {
              value: "1",
              label: "售后"
            }
          ]
        }
      ],
       ruleForm: {
           name:[
               {required:true,message:'请输入产品规则名称',trigger:'blur'}
           ],
           checkRelativeDay:[
               {required:true,message:'请输入发货日期',trigger:'blur'}
           ]
       },
    };
  },
  components: { searchForm, gridTable, confirm },
  mounted() {},
  methods: {
    ok() {
      let _this = this;
      let url =
        _this.type === "0"
          ? "product/ruleProduct/save/ruleBuy"
          : "product/ruleProduct/save/ruleSold";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback(res) {
          if (res.success) {
            _this.modal = false;
          }
        }
      });
    },
    //删除
    delAll() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.content = "确定删除吗？";
        this.mode='done'
        this.$refs.confirmModel.confirm("product/ruleProduct/del?ids=" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    // 添加售后规则(需要后台对接)
    showModal() {
      this.modal = true;
      this.type = "1";
      this.formItem.name = "";
      this.formItem.code = "";
      this.formItem.type = "1";
      this.formItem.remark = "";

      this.formItem.isRetreat = "F";
      this.formItem.isRetreatAudit = "T";
      this.formItem.isOverDueCheck = "T";
      this.formItem.checkRelativeDay = "";
      this.formItem.switch = true;
      this.modalTitle = "添加售后规则";
    },
    // 添加购买规则(需要后台对接)
    addCode() {
      this.modal = true;
      this.type = "0";
      this.formItem.name = "";
      this.formItem.code = "";
      this.formItem.type = "0";
      this.formItem.remark = "";

      this.formItem.orderBegDay = "";
      this.formItem.orderEndDay = "";
      this.formItem.dayBegTime = "";
      this.formItem.dayEndTime = "";
      this.formItem.minOrder = "";
      this.formItem.maxOrder = "";
      this.formItem.switch = true;
      this.modalTitle = " 添加购买规则";
    }
  }
};
</script>
