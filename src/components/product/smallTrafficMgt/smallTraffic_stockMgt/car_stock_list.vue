<template>
  <div class="wrapper">
    <Row>
      <DatePicker type="date" v-model="startTime" class="top-right" :editable="false" placeholder="开始时间" style="width: 200px"></DatePicker>
      <DatePicker type="date" v-model="endTime" class="top-right" :editable="false" placeholder="结束时间" style="width: 200px"></DatePicker>
      <Button type="primary" icon="md-search" class="top-right" @click="_initTableList">搜索</Button>
      <!-- <Button type="primary"  @click="importAll">批量录入</Button> -->
    </Row>
    <Row class="p-top">
      <Table border stripe :columns="columns5" :data="data5" :loading="loading" >
        <template slot-scope="{row}" slot="action">
          <Button type="text" style="margin-right:6px;"  @click="editFun(row)">修改</Button>
        </template>
      </Table>
      <Page class="p-top" :current="currPage" :total="totalPage" show-elevator  @on-change="changePage"/>
    </Row>
    <stock-modal :modalFlag="modalFlag" @save="saveStock" @cancel="cancelFun"></stock-modal>
    <modal-wrap title="修改库存" :flag="editModalFlag" @cancel="cancelEditFun" @confirm="confirmFun">
      <Form :label-width="80" ref="stockRef" :model="stockInfo" :rules="ruleValidate">
        <FormItem label="库存" prop="editstockNum">
          <InputNumber  :max="1000" v-model="stockInfo.editstockNum" style="width:100px" :min="0" @on-change="changeStockNum"></InputNumber>
        </FormItem>
      </Form>
    </modal-wrap>
  </div>

</template>

<script>
import { mapState } from 'vuex';
import common from '@/common/index.js';
import { insertStockList, importStockInsert, editStock } from '../apis/xjt_line.js';
import StockModal from '../components/stock_modal.vue';
import modalWrap from '../components/modalWrap.vue'
export default {
  components: { StockModal, modalWrap },
  props: {},
  data() {
    return {
      modalFlag: false,
      startTime: '',
      endTime: '',
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      editId: '',
      loading: false,
      editModalFlag: false,
      stockInfo: {
        editstockNum: 0
      },
      ruleValidate: {
        editstockNum: [
          { validator: common.validate.isInteger, trigger: 'blur' }
        ]
      },
      columns5: [
        {
          title: '线路名称',
          key: 'routeName'
        },
        {
          title: '班次时间',
          key: 'driveBeginTime'
        },
        {
          title: '车牌',
          key: 'carNumber'
        },
        {
          title: '日期',
          key: 'stockTime'
        },
        {
          title: '站点',
          key: 'siteAliasName'
        },
        {
          title: '库存',
          key: 'stockNum'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      data5: []
    };
  },
  watch: {},
  computed: {
    ...mapState({
      params: state => state.lineManage.stockListparams
    })
  },
  methods: {
    searchFun() {

    },
    importAll() {
      this.modalFlag = true;
    },
    changeStockNum(num) {
      if (num) {
        this.stockInfo.editstockNum = num;
      } else {
        this.stockInfo.editstockNum = 0;
      }
    },
    saveStock(stock) {
      let info = this.params;
      let params = {
        busId: info.busId,
        routeId: info.routeId,
        siteId: info.siteId,
        stockBgTime: stock.stockBgTime,
        stockEndTime: stock.stockEndTime,
        stockNum: stock.stockNum,
        trainNumberId: info.trainNumberId
      };
      importStockInsert(params).then(res => {
        if (res.success === true) {
          this.currPage = 1;
          this._initTableList();
          this.cancelFun();
        }
      });
    },
    cancelFun() {
      this.modalFlag = false;
    },
    confirmFun() {
      this.$refs['stockRef'].validate((valid) => {
        if (valid) {
          let param = {
            id: this.editId,
            stockNum: this.stockInfo.editstockNum
          };
          editStock(param).then(res => {
            if (res.success === true) {
              this.currPage = 1;
              this._initTableList();
              this.cancelEditFun();
            }
          });
        }
      });
    },
    cancelEditFun() {
      this.editModalFlag = false;
      this.$refs['stockRef'].resetFields();
    },
    changePage(num) {
      this.currPage = num;
      this._initTableList();
    },
    editFun(row) {
      this.editModalFlag = true;
      this.editId = row.id;
      this.stockInfo.editstockNum = row.stockNum;
    },
    _initTableList() {
      console.log(this.params);
      let lineInfo = this.params;
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        ...lineInfo
      };
      insertStockList(params).then(res => {
          let list = res.data.rows;
          let data = [];
          list.forEach(item => {
            data.push({
              id: item.id,
              stockNum: item.stockNum,
              stockTime: item.stockTime,
              routeName: lineInfo.routeName,
              driveBeginTime: lineInfo.driveBeginTime,
              carNumber: lineInfo.carNumber,
              siteAliasName: lineInfo.siteAliasName
            });
          });
          this.data5 = data;
          this.totalPage = res.data.total;
      });
    }
  },
  created() {},
  mounted() {
    this._initTableList();
  }
};
</script>
<style lang="scss" scoped>
.wrapper{
  .top-right{
    margin-right:20px;
  }
  .p-top{
    margin-top:20px;
  }
}
</style>
