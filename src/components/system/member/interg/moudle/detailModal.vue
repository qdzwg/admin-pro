<template>
  <Modal :width="1200" v-model="modal" title="积分明细">
    <Form ref="formInline" inline>
      <FormItem>
        <Input style="width:120px" v-model="formItem.name" placeholder="姓名"></Input>
      </FormItem>
      <FormItem>
        <Input style="width:120px" v-model="formItem.mobile" placeholder="手机号码"></Input>
      </FormItem>
      <FormItem>
        <Select v-model="formItem.changeType" style="width:120px">
          <Option value>积分类型</Option>
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Select style="width:200px" v-model="formItem.eventType">
          <Option value>积分活动</Option>
          <Option v-for="item in typeList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        操作开始结束时间
        <FormItem>
          <DatePicker
            style="width:120px"
            type="date"
            @on-change="setBegDate"
            :options="options3"
            :value="formItem.optStartTime"
            format="yyyy-MM-dd"
            placeholder="起始时间"
          ></DatePicker>
        </FormItem>
        <span style="margin-right:10px">至</span>
        <FormItem>
          <DatePicker
            type="date"
            :value="formItem.optEndTime"
            @on-change="setEndDate"
            :options="options4"
            format="yyyy-MM-dd"
            placeholder="结束时间"
            style="width:120px"
          ></DatePicker>
        </FormItem>
      </FormItem>
      <FormItem>
        <Button @click="getList" type="primary">搜索</Button>
      </FormItem>
    </Form>
    <Table :columns="columns1" :data="data1"></Table>
    <Page @on-change="pageChange" style="margin-top:10px;" :total="total"></Page>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import { apiGet } from "@/fetch/api";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options4: {},
      options3: {},
      formItem: {
        name: "",
        mobile: "",
        changeType: "",
        eventType: "",
        optStartTime: "",
        optEndTime: ""
      },
      typeList: [
        {
          value: "increase",
          label: "积分发放"
        },
        {
          value: "decrease",
          label: "积分消耗"
        }
      ],
      typeList1: [
        {
          value: "grantByAdmin",
          label: "管理员发放积分"
        },
        {
          value: "reduceByAdmin",
          label: "管理员减扣积分"
        },
        {
          value: "overSum",
          label: "每成功交易N元获得积分"
        },
        {
          value: "overAmount",
          label: "每成功交易N笔获得积"
        },
        {
          value: "reduceByRefund",
          label: "退款减扣"
        },
        {
          value: "consumeByMdse",
          label: "积分商品兑换消耗,"
        },
        {
          value: "overDue",
          label: "积分过期减扣"
        }
      ],
      modal: this.value,
      columns1: [
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "手机号",
          key: "mobile"
        },
        {
          title: "积分类型",
          key: "name",
          render: (h, params) => {
            let item = this.typeList.find(
              item => item.value == params.row.changeType
            );

            return h("span", item ? item.label : "");
          }
        },
        {
          title: "积分活动",
          key: "eventType",
          render: (h, params) => {
            let item = this.typeList1.find(
              item => item.value == params.row.eventType
            );

            return h("span", item ? item.label : "");
          }
        },
        {
          title: "操作时间",
          key: "createTime"
        },
        {
          title: "操作人",
          key: "createBy"
        },
        {
          title: "原因",
          key: "remark"
        },

        {
          title: "明细",
          key: "changeValue",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.changeType == "increase" ? "green" : "red"
                }
              },
              (params.row.changeType == "increase" ? "+" : "-") +
                (params.row.changeValue ? params.row.changeValue : "")
            );
          }
        }
      ],
      data1: [],
      currPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  watch: {
    value(val) {
      if (val) {
        this.getList();
      }
      this.modal = val;
    },
    modal(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getList() {
      apiGet(
        "/leaguer/web/bonus/manage/history/list",
        Object.assign(
          {
            pageSize: this.pageSize,
            currPage: this.currPage
          },
          this.formItem
        )
      ).then(res => {
        if (res.status == 200) {
          this.data1 = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    pageChange(page) {
      this.currPage = page;
      this.getList();
    },
    setBegDate(time) {
      this.formItem.optStartTime = time;
      this.options4 = {
        disabledDate: date => {
          let startTime = this.formItem.optStartTime
            ? new Date(this.formItem.optStartTime).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEndDate(time) {
      if (time) {
        this.formItem.optEndTime = time;
        let endTime = this.formItem.optEndTime
          ? new Date(this.formItem.optEndTime).valueOf() -
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
    }
  }
};
</script>