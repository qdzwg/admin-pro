<template>
    <div class="lpt">
    <searchForm :search-items='searchItems'></searchForm>
    <Button type="primary" icon="android-add" style="margin-bottom:20px;" @click="addCoupon">创建拼团活动</Button>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

    <Modal v-model="marketLptModal" title="详情" width=800>
        <Form :model="marketForm" :label-width="120" label-position="right">
        <FormItem label="选择产品：">
            <img :src="marketForm.linkMobileImg" alt="" style="width:100px;height:100px;">
        </FormItem>
        <FormItem label="活动名称：">
            <Input v-model="marketForm.name" disabled style="width:200px" ></Input>
        </FormItem>
        <FormItem label="参团人数：">
            <Input v-model="marketForm.personQuantity" disabled style="width:200px"></Input>
        </FormItem>
        <FormItem label="有效时间：">            
            <span><DatePicker type="datetime" :value="marketForm.validPeriodStart" disabled style="width: 200px"></DatePicker></span> 至
            <span><DatePicker type="datetime" :value="marketForm.validPeriodEnd" disabled style="width: 200px"></DatePicker></span>
        </FormItem>
        <FormItem label="限购规则：">           
            开启      
            <Input v-model="marketForm.purchaseLimitQuantity" disabled style="width:100px"></Input>
            件/人
        </FormItem>
        <FormItem label="优惠设置：">
            <table class="table">
                    <tr class="table-title">
                        <th v-for="(item,index) in skuList" :key="index">{{item}}</th>
                        <th>店铺零售价（元）</th>
                        <th>拼团价（元）</th>
                        <th>库存</th>
                        <th>状态</th>
                    </tr>
                    <tr v-for="(el,i) in detailVoList" :key="i">
                        <td v-for="(o,l) in el.skuList" :key="l">{{o}}</td>
                        <td>￥{{el.sellPrice}}</td>
                        <td>{{el.lptPrice}}</td>
                        <td>{{el.stockNum}}</td>
                        <td>{{el.status=='0'?'正常':''}}</td>
                    </tr>
                </table>
        </FormItem>
        </Form>
    <div slot="footer"></div>
    </Modal>
    <!-- 推广 -->
    <Modal v-model="modalpay" :title="modalTitle">
       <span>领取短链接：{{copyUrl}}</span>
        <Button v-clipboard:copy="copyUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
        <p>
          <span>领取二维码:
            <a :href="codeUrl" download>下载二维码</a>
          </span>
        </p>
        <center id="target" style="margin-top:20px;">
          <qrcode :value="qrcodeUrl" :options="{ size: 170}">
          </qrcode>
        </center>
        <div slot="footer"></div>
    </Modal>
    <!-- 编辑 -->
    <Modal v-model="editModal" title="修改">
        <Form :model="editForm" :label-width="120">
            <FormItem label="活动名称：">
                <Input v-model="editForm.name" style="width:60%;" :maxlength="25"></Input>
            </FormItem>
            <FormItem label="结束日期：">
                <DatePicker type="datetime" :value="editForm.validPeriodEnd" @on-change="getvalidEnd" placeholder="结束时间" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">提交</Button>
                <Button @click="test">取消</Button>
            </FormItem>
        </Form>
        <div slot="footer"></div>
    </Modal>
   </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import { apiPost, apiGet } from "@/fetch/api";
import confirm from "@/components/global/confirm";
import QRcode from "@xkeshi/vue-qrcode";
export default {
  components: {
    searchForm,
    gridTable,
    confirm,
    qrcode: QRcode
  },
  data() {
    return {
      editModal: false,
      editForm: {
        id: "",
        validPeriodEnd: null,
        name: "",
        _method: "put"
      },
      marketLptModal: false,
      marketForm: {
        linkMobileImg: "",
        name: "",
        personQuantity: "",
        purchaseLimitQuantity: "",
        validPeriodEnd: "",
        validPeriodStart: ""
      },
      detailVoList: [],
      skuList: [],

      copyUrl: "",
      qrcodeUrl: "",
      codeUrl: "",
      searchItems: [
        {
          label: "状态",
          type: "select",
          name: "status",
          data: [
            {
              value: "",
              label: "--请选择状态--"
            },
            {
              value: "not_start",
              label: "未开始"
            },
            {
              value: "start",
              label: "已开始"
            },
            {
              value: "finished",
              label: "已结束"
            },
            {
              value: "processing",
              label: "进行中"
            },
            {
              value: "abandoned",
              label: "已废弃"
            }
          ]
        }
      ],
      columns: [
        // {
        //   title: "序号",
        //   width: 60,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("span", params.index + 1);
        //   }
        // },
        {
          title: "活动名称",
          sortable: true,
          key: "name"
        },
        {
          title: "开始时间",
          key: "validPeriodStart",
          sortable: true
        },
        {
          title: "结束时间",
          sortable: true,
          key: "validPeriodEnd"
        },
        {
          title: "状态",
          key: "status",
          sortable: true,
          render: (h, params) => {
            return h("span", this.filter.lptStatus(params.row.status));
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            let actions = [
              {
                title: "详情",
                action: () => {
                  this.marketLptModal = true;
                  apiGet(
                    "/marketing/marketLpt/lptInfoPageFL?id=" + params.row.id
                  ).then(res => {
                    this.marketForm = res.data.marketLpt;
                    this.marketForm.linkMobileImg =
                      res.data.merchantMdseInfo.linkMobileImg;
                    this.detailVoList = res.data.detailVoList;
                    this.skuList = res.data.skuList;
                  });
                }
              },
              {
                title: "订单",
                action: () => {
                  this.$router.push({
                    path: "/lptOrder",
                    query: { id: params.row.id }
                  });
                }
              }
            ];
            if (
              params.row.status == "start" ||
              params.row.status == "not_start" ||
              params.row.status == "processing"
            ) {
              actions.push(
                {
                  title: "废弃",
                  action: () => {
                    this.mode = "done";
                    this.sucessMsg = "操作成功！";
                    this.content =
                      "进行中的拼团活动一经废弃，活动立即结束且不可在编辑，已成团的订单仍需及时处理。";
                    this.$refs.confirmModel.confirm(
                      "/marketing/marketLpt/abandonedLpt?id=" + params.row.id
                    );
                  }
                },
                {
                  title: "推广",
                  action: () => {
                    let _this = this;
                    this.modalTitle = "推广";
                    apiGet(
                      "/marketing/marketLpt/extendFL?id=" + params.row.id
                    ).then(res => {
                      if (res.status == 200) {
                        this.modalpay = true;
                        this.qrcodeUrl = res.data.qrCodeUrl;
                        this.copyUrl = res.data.qrCodeUrl;
                        //把生成的二维码转换成图片
                        this.$nextTick(function() {
                          let canvasData = $("#target").children("canvas");
                          _this.codeUrl = canvasData[0].toDataURL();
                        });
                      } else {
                        this.$Message.warning(res.message);
                      }
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.editModal = true;
                    this.editForm.id = params.row.id;
                    this.editForm.name = params.row.name;
                    this.editForm.validPeriodEnd = params.row.validPeriodEnd;
                  }
                }
              );
            } else if (
              params.row.status == "finished" ||
              params.row.status == "abandoned"
            ) {
              actions.push({
                title: "删除",
                action: () => {
                  this.mode = "done";
                  this.content = "确定删除吗？";
                  this.sucessMsg = "操作成功！";
                  this.$refs.confirmModel.confirm(
                    "/marketing/marketLpt/del?id=" + params.row.id
                  );
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      mode: "",
      content: "",
      sucessMsg: "",
      dataList: {},
      modalpay: false,
      modalTitle: "",
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      url: "/marketing/marketLpt/grid"
    };
  },
  created() {},
  methods: {
    addCoupon() {
      this.$router.push("/lptFound");
    },
    getvalidEnd(time) {
      this.editForm.validPeriodEnd = time;
    },
    submit() {
      apiPost("/marketing/marketLpt/"+this.editForm.id, this.editForm).then(res => {
        if (res.success) {
          this.$Message.success("修改成功");
          this.editModal = false;
          this.$refs.gridTable.loadpage();
        }
      });
    },
    test() {
      this.editModal = false;
    },
    onCopy() {
      this.$Message.success("复制成功！");
    },
    onError() {
      this.$Message.error("复制失败！");
    }
  }
};
</script>

<style lang="scss">
.lpt {
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
</style>








