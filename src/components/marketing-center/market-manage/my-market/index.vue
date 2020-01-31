<template>
    <div class="my-market">
    <Tabs :animated="false" @on-click="paneMarket">        
        <TabPane label="所有服务" name="all">
            <p>订购服务{{all}}个   即将到期服务{{due}}个    已过期服务{{overdue}}个</p>
            <Table border :data="dataList" :columns="columns"></Table>
            <Page :total="total" class-name="pages" @on-change="changepage"  @on-page-size-change="changepageSize" show-elevator show-sizer></Page>
        </TabPane>
        <TabPane label="即将到期" name="due">
            <p>订购服务{{all}}个   即将到期服务{{due}}个    已过期服务{{overdue}}个</p>
            <Table border :data="dataList" :columns="columns"></Table>
            <Page :total="total" class-name="pages" @on-change="changepage"  @on-page-size-change="changepageSize" show-elevator show-sizer></Page>
        </TabPane>
        <TabPane label="已过期" name="overdue">
            <p>订购服务{{all}}个   即将到期服务{{due}}个    已过期服务{{overdue}}个</p>
            <Table border :data="dataList" :columns="columns"></Table>
            <Page :total="total" :current="params.page" :page-size="params.limit" class-name="pages" @on-change="changepage" @on-page-size-change="changepageSize" show-elevator show-sizer></Page>
        </TabPane>
    </Tabs>
    </div>
</template>

<script>
import { apiPost, apiGet } from "@/fetch/api";
export default {
  data() {
    return {
      url:'',
      all:'',
      due:'',
      overdue:'',
      dataList: [],
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      total: 0,
      columns: [
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "应用名",
          sortable: true,
          key: "name"
        },
        {
          title: "服务类型",
          sortable: true,
          key: "plugCode",
          render:(h,params)=>{
              return h("span",this.filter.plugCode(params.row.plugCode))
          }
        },
        {
          title: "到期时间",
          sortable: true,
          key: "vaildEndTime",
           render:(h,params)=>{
              return h("span",(params.row.vaildEndTime==''||params.row.vaildEndTime==null)?'永久':params.row.vaildEndTime)
          }
        },
        {
          title: "服务状态",
          sortable: true,
          key: "state",
          render:(h,params)=>{
              return h("span",this.filter.marketState(params.row.state))
          }

        },
        {
          title: "操作",
          key: "action",
          width: 130,
          align: "center",
          render: (h, params) => {
            const actions = [];
            if (params.row.state == "1") {
              actions.push(
                {
                  title: "支付",
                  action: () => {
                     
                      this.$router.push({path:'/orderPay',query:{orderId:params.row.orderNo}})
                //     this.modalTitle = "查看备注";
                //     this.modalpay = true;
                //     this.dataList = params.row;
                  }
                },
                {
                  title: "取消",
                  action: () => {
                    this.modalTitle = "查看备注";
                    this.modalpay = true;
                    this.dataList = params.row;
                  }
                }
              );
            } else if (params.row.state == "2") {
              actions.push({
                title: "订购",
                action: () => {
                    apiPost('/marketing/marketService/tobuy?id='+params.row.serviceId).then(res=>{
                        if(res.success){
                            this.$router.push({path:'/orderList',query:{id:params.row.serviceId}})
                        }else{
                            this.$Message.warning(res.message)
                        }
                    })
                }
              });
            } else if (params.row.state == "3" || params.row.state == "4") {
              actions.push({
                title: "续期",
                action: () => {
                    apiPost('/marketing/marketService/tobuy?id='+params.row.serviceId).then(res=>{
                        if(res.success){
                            this.$router.push({path:'/orderList',query:{id:params.row.serviceId}})
                        }else{
                            this.$Message.warning(res.message)
                        }
                    })
                }
              });
            }
            return this.common.columnsHandle(h, actions);
          }
          
        }
      ]
    };
  },
  created() {
      this.getList('/marketing/marketServiceOrder/allGrid');
  },
  methods: {
    paneMarket(val) {
      if (val == "all") {
          this.url="/marketing/marketServiceOrder/allGrid"
        this.getList(this.url,'all');
      }else if(val=='due'){
          this.url="/marketing/marketServiceOrder/dueGrid"
          this.getList(this.url,'due');
      }else if(val=='overdue'){
        this.url="/marketing/marketServiceOrder/overdueGrid"
          this.getList(this.url,'overdue');  
      }
    },
    getList(url,text) {
      apiPost(url, this.params).then(
        res => {
            this.dataList = res.rows;
            this.total = res.total;
            if(text=='all'){
                this.all=res.total
            }else if(text=='due'){
                this.due=res.total
            }else if(text=='overdue'){
                this.overdue=res.total
            }else{
                res.rows.forEach(item =>{
                    if(item.state=='4'){
                         this.overdue=2 
                    }
                })
               this.all=res.total 
               this.due=0 
              
            }
                      
        }
      );
    },
    changepage(num){
        this.params.page=num
        this.getList()
    },
    changepageSize(num){
        this.params.limit=num
        this.getList()
    }
  }
};
</script>


<style lang="scss">
.my-market {
  width: 100%;
}
</style>


