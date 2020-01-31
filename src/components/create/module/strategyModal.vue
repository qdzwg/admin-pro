<template>
  <Modal :width="1000" v-model="modalValue" title="攻略产品选择">
    <Form ref="formInline" inline>
      <FormItem>
        <Input v-model="modelName" placeholder="攻略名称"></Input>
      </FormItem>
      <FormItem>
        <Select placeholder="攻略名称类型" clearable v-model="strategyTypes" style="width:200px">
          <Option v-for="(item,index) in typeList" :value="item.key" :key="index">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="getData">搜索</Button>
      </FormItem>
    </Form>
    <Table
      @on-selection-change="selectionChange"
      border
      ref="selection"
      :columns="columns4"
      :data="data1"
    ></Table>
    <Page @on-change="pageChange" style="margin-top:10px;" :total="total"></Page>
    <div slot="footer">
      <Button @click="sure" type="primary">确定</Button>
      <Button @click="modalValue=false">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { apiPost, apiGet } from "@/fetch/api";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectedProduct: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterIds: [],
      typeList: [],
      currPage: 1,
      pageSize: 10,
      modelName: "",
      strategyTypes: "",
      modalValue: this.value,
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "时间",
          key: "createTime"
        },
        {
          title: "简介",
          key: "address"
        }
      ],
      data1: [],
      total: 0
    };
  },
  created() {},
  methods: {
    pageChange(page) {
      this.currPage = page;
      this.getData();
    },
    getData() {
      apiPost("/merchant/webApi/merchantStrategy/gridNew", {
        currPage: this.currPage,
        pageSize: this.pageSize,
        modelName: this.modelName,
        strategyTypes: this.strategyTypes,
        filteIds: this.filterIds.join(",")
      }).then(res => {
        if (res.status == 200) {
          this.data1 = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    sure() {
      if (this.selectArr && this.selectArr.length) {
        this.$emit("selectProduct", this.selectArr);
        this.modalValue = false;
      } else {
        this.$Message.warning("请选择添加项");
      }
    },
    selectionChange(arr) {
      this.selectArr = arr;
    },
    getTypeList() {
      apiGet("/merchant/merchantStrategy/changeList", {
        key: "merchantStrategyType"
      }).then(res => {
        if (res.status == 200) {
          this.typeList = res.data;
        } else {
          this.$Message.warning(res.message);
        }
      });
    }
  },
  watch: {
    selectedProduct(val) {
      this.selectedArr = val;
    },
    value(val) {
      if (val) {
        this.getData();
        this.getTypeList();
      }
      this.modalValue = val;
    },
    modalValue(val) {
      this.$emit("input", val);
    }
  }
};
</script>
<style lang="">
</style>