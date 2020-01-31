<template>
    <div class="lptFound">
        <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleForm">
            <FormItem label="选择产品：">
                <Button type="primary" @click="getGoods">上架产品</Button>
            </FormItem>
            <FormItem label="活动名称：" prop="name">
                <Input v-model="formItem.name" style="width:33%" :maxlength="25"></Input >
            </FormItem>
            <FormItem label="参团人数：" prop="personQuantity">
                <Input v-model="formItem.personQuantity" style="width:33%" :maxlength="3"></Input>
            </FormItem>
            <FormItem label="有效时间：">

                <Row>
                <Col span="3">
                    <FormItem >
                         <DatePicker type="datetime" :value="formItem.validPeriodStart" @on-change="getvalidStart" placeholder="开始时间" ></DatePicker>
                    </FormItem>
                </Col>
                <Col span="1" style="text-align: center"> 至</Col>
                <Col span="3">
                    <FormItem >
                       <DatePicker type="datetime" :value="formItem.validPeriodEnd" @on-change="getvalidEnd" placeholder="结束时间"></DatePicker>
                    </FormItem>
                </Col>
            </Row>        
            </FormItem>
            <FormItem label="限购规则：" prop="purchaseLimitQuantity">
                 <Select v-model="formItem.purchaseLimitFlag" style="width:10%;">
                        <Option value="T">限制</Option>
                        <Option value="F">无限制</Option>
                    </Select>
                    <template v-if="formItem.purchaseLimitFlag=='T'">
                        <Input v-model="formItem.purchaseLimitQuantity" style="width:13%;"></Input>  件/人
                    </template>
                 
            </FormItem>
            <FormItem label="商品规格">
                 <table class="table">
                    <tr class="table-title">
                        <th v-for="(item,index) in skuList" :key="index">{{item}}</th>
                        <th>店铺零售价（元）</th>
                        <th>拼团价（元）</th>
                        <th>库存</th>
                    </tr>
                    <tr v-for="(el,i) in detailVoList" :key="i">
                        <td v-for="(o,l) in el.skuList" :key="l">{{o}}</td>
                        <td>￥{{el.sellPrice}}</td>
                        <td><Input style="width:100px" v-model="price" size="small"></Input></td>
                        <td>{{el.stockNum}}</td>
                    </tr>
                </table>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
                <Button @click="test">取消</Button>
            </FormItem>
        </Form>
        <Modal v-model="modalShow" width=600 title="已上架商品">
            <Table :columns="columns" :data="dataList"></Table>
            <Page :total="total" class-name="pages" @on-change="changepage" show-elevator></Page>
        </Modal>
    </div>
</template>


<script>
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      modalShow: false,
      formItem: {
        name: "",
        personQuantity: "",
        goodsId: "",
        detailIds: "",
        validPeriodStart: null,
        validPeriodEnd: null,
        purchaseLimitFlag: "T",
        purchaseLimitQuantity: ""
      },
      ruleForm: {
        name: [{ required: true, message: "请填写活动名称", trigger: "blur" }],
        personQuantity: [
          { required: true, message: "请填写参团人数", trigger: "blur" },
          { min:2,max:100, message: "最大值100", trigger: "blur" }
        ],
        purchaseLimitQuantity: [
          { required: true, message: "请填写限购参数", trigger: "blur" }
        ],
        validPeriodStart: [
          {
            required: true,
            type: "date",
            message: "请选择有效时间",
            trigger: "change"
          }
        ]
      },
      options3: {},
      options4: {},
      total: 0,
      price: "",
      columns: [
        {
          title: "商品名称",
          key: "name"
        },
        {
          title: "发布时间",
          key: "publishTime"
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
                  apiPost("/marketing/marketLptSku/getSkuInfo", {
                    id: params.row.id
                  }).then(res => {
                    this.formItem.name = res.merchantMsdeInfo.nickName;
                    this.formItem.goodsId = res.merchantMsdeInfo.id;
                    this.formItem.detailIds = res.detailIds;
                    this.detailVoList = res.detailVoList;
                    this.skuList = res.skuList;
                    this.modalShow = false;
                  });
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      dataList: [],
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      skuList: [],
      detailVoList: []
    };
  },
  methods: {
    getGoods() {
      this.modalShow = true;
      this.getList();
    },
    changepage() {},
    getList() {
      apiPost("/marketing/marketLpt/getGoodsGrid", this.params).then(res => {
        this.dataList = res.rows;
        this.total = res.total;
      });
    },
    submit() {
      let _this = this;
      this.formItem["price_" + this.formItem.detailIds] = this.price;
      let url = "/marketing/marketLpt/saveLpt";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "page",
        callback(res) {
          if (res.success) {
            _this.$Message.success("操作成功");
            _this.$router.back();
          } else {
            _this.$Message.warning(res.message);
          }
        }
      });
    },
    test(){
        this.$router.back();
    },
    getvalidStart(time) {
      this.formItem.validPeriodStart = time;
    },
    getvalidEnd(time) {
      this.formItem.validPeriodEnd = time;
    }
  }
};
</script>

<style lang="scss">
.lptFound {
  width: 100%;
  .table {
  margin-bottom: 15px;
  width: 70%;
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
    th {
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #dddddd;
      padding: 8px;
      line-height: 20px;
    }
  }
  .table-title {
    background-color: #f5fafe;
  }
}
}

</style>


