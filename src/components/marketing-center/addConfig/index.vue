<template>
    <div class="addConfig">
         <Button type="primary" icon="android-add" @click="down" style="margin-bottom:20px;">新增推荐</Button>
        <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
        <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
        <Modal v-model="modalShow" title="选择" width=800>
            <div style="margin-bottom:20px;">
            <Select v-model="searchForm.productType" style="width:23%;" placeholder="请选择类型">
                <Option value="mdse">商品</Option>
                <Option value="hotel">酒店</Option>
                <Option value="park">景区</Option>
            </Select>
            <Button type="primary" @click="getProduct">搜索</Button>
            </div>
            <Table border ref="newTable" :columns="columns2" :data="dataList" @on-selection-change="changeSelect"></Table>
            <Page :total="total" :current="searchForm.currPage" :page-size="searchForm.pageSize"  class-name="pages" @on-change="changepage" @on-page-size-change="changepageSize" show-elevator show-sizer></Page>
            <div slot="footer">
                <!-- <Button type="primary">确定</Button>
                <Button @click="test">取消</Button> -->
            </div>
        </Modal>
    </div>
</template>

<script>
import { apiGet, apiPost } from "@/fetch/api";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
  components: { gridTable, confirm },
  data() {
    return {
      columns: [
         {
          title: "编码",
          sortable: true,
          key: "productCode"
        },
        {
          title: "名称",
          key: "productName",
          sortable: true
        },
        {
          title: "业态",
          sortable: true,
          key: "productType",
          render:(h,params)=>{
              return h("span",this.filter.orderType(params.row.productType))
          }
          },
           {
          title: "状态",
          sortable: true,
          key: "status",
          render:(h,params)=>{
              return h("span",params.row.status=='T'?'开启':'关闭')
          }
          },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: params.row.status=='T'?'关闭':'开启',
                action: () => {
                  this.mode = "done";
                  this.content = "确定此操作吗？";
                  this.sucessMsg = "操作成功!";
                  this.$refs.confirmModel.confirm(
                    "/marketing/api/patRecommend/prodcutEnable?id=" + params.row.id+'&status='+(params.row.status=='T'?'F':'T') 
                  );
                }
              },
               {
                title: "移除",
                action: () => {
                  this.mode = "done";
                  this.content = "确定移除吗？";
                  this.sucessMsg = "移除成功!";
                  this.$refs.confirmModel.confirm(
                    "/marketing/api/patRecommend/prodcutDeleted?id=" + params.row.id 
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { currPage: 1, pageSize: 10 },
      url: "/marketing/api/patRecommend/getRecommendListToB",
      modalShow: false,
      mode: "",
      content: "",
      sucessMsg: "",
      selection:[],
      total: 0,
      dataList: [],
      searchForm:{
        currPage: 1,
        pageSize: 10,
        productType:'park', 
      },
      columns2: [
        {
          title: "编码",
          sortable: true,
          key: "productCode"
        },
        {
          title: "名称",
          key: "productName",
          sortable: true
        },
        {
          title: "业态",
          sortable: true,
          key: "productType",
          render:(h,params)=>{
              return h("span",this.filter.orderType(params.row.productType))
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
                 apiPost('/marketing/api/patRecommend/saveProduct',{
                     productCode:params.row.productCode,
                     productType:params.row.productType
                 }).then(res=>{
                     if(res.status==200){
                         this.$Message.success(res.message)
                         this.modalShow=false
                         this.$refs.gridTable.loadpage()
                     }else{
                          this.$Message.warning(res.message)
                     }
                 })
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ]
    };
  },
  methods: {
    down() {
      this.modalShow = true;
      this.getProduct()
    },
    getProduct(){
        apiPost('/marketing/api/patRecommend/getMerchantProduct',this.searchForm).then(res=>{
            if(res.status==200){
                this.dataList=res.data.rows
                this.total=res.data.total
            }
        })
    },
    changeSelect(val){
        this.selection=val
    },
    test(){
        this.modalShow=false
    },
      changepage(num){
        this.searchForm.currPage=num
        this.getProduct()
    },
    changepageSize(num){
        this.searchForm.pageSize=num
        this.getProduct()
    }
  }
};
</script>

<style lang="scss">
.addConfig {

}
</style>


