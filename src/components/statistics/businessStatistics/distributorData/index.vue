<template>
    <div class="distributorData">
        <statistics-list ref="gridTable" :columns="columns" :url="url" :params="params" :searchItems="searchItems" :hannleItems="hannleItems"></statistics-list>
    </div>
</template>

<script>
import { apiPost,apiGet } from "@/fetch/api";
import statisticsList from "@/components/global/statisticsList";
export default {
  components: {
    statisticsList
  },
  data() {
    return {
      hannleItems: [
        {
          title: "导出",
          type: "success",
          loading:false,
          //   icon: "android-add",
          callback: () => {
            let _this = this;
             this.hannleItems[0].loading=true
            let obj = _this.$store.state.list.params;
            // delete obj["page"];
            // delete obj["limit"];
            // apiPost("/statistics/statisticsData/grid", obj).then(res => {
            //   if (res && res.rows.length > 0) {
            //       if(res.rows){
            //           res.rows.map(ele=>{
            //               ele.goodsName=ele.goodsName.replace(/,/g,';')
            //           })
            //       }
            //     this.$refs.gridTable.exportData("分销营业报表", res.rows);
            //   } else {
            //     this.$Message.error("报表没有记录");
            //   }
            // });

            let str=''
            for (let ele in obj){
                str+=ele+'='+obj[ele]+'&'
            }
            var url =
              "/statistics/statisticsData/export?"+str.substring(0, str.length-1);
               this.common.exportData("分销营业报表", url,()=>{
                   _this.hannleItems[0].loading=false
               },_this);
          }
        }
      ],
      searchItems: [
        {
          label: "业务类型",
          type: "select",
          name: "productType",
          data: [
            {
              value: "",
              label: "--请选择业务类型--"
            },
            {
              value: "park",
              label: "景区"
            },
            {
              value: "hotel",
              label: "酒店"
            },
            {
              value: "mdse",
              label: "商品"
            },
            {
              value: "route",
              label: "跟团游"
            },
            {
              value: "eatery",
              label: "餐饮"
            },
            {
              value: "theater_ticket",
              label: "剧院"
            }
          ]
        },
        {
          label: "分销商名称",
          type: "input",
          name: "distributorName"
        },
        {
          label: "产品名称",
          type: "input",
          name: "goodsName"
        },
        {
          label: "交易开始日期",
          type: "date",
          name: "startTimeLower",
          today: new Date()
        },
        {
          label: "交易结束日期",
          type: "date",
          name: "startTimeUpper",
          today: new Date()
        },
        {
          label: "检票开始日期",
          type: "date",
          name: "checkTimeLower"
        },
        {
          label: "检票结束日期",
          type: "date",
          name: "checkTimeUpper"
        },
        {
          label: "支付类型",
          type: "select",
          name: "payMethod",
          data: [
          ]
        }
      ],
      columns: [
        {
          title: "分销商名称",
          key: "distributorName"
        },
        {
          title: "产品名称",
          key: "goodsName"
        },
          {
          title: "支付类型",
          key: "payMethod"
        },
        {
          title: "单价",
          key: "price",
          sortable: true
        },
        {
          title: "销售总数",
          key: "amountNum",
          sortable: true
        },
        {
          title: "销售金额(元)",
          key: "amountSum",
          sortable: true
        },
        {
          title: "退单总数",
          key: "refundNum",
          sortable: true
        },
        {
          title: "退单金额(元)",
          key: "refundSum",
          sortable: true
        },
        {
          title: "检票数量",
          sortable: true,
          key: "checkNum"
        },
        {
          title: "检票金额(元)",
          key: "checkSum",
          sortable: true
        },
        {
          title: "未检数量",
          key: "leftNum",
          sortable: true
        },
        {
          title: "未检金额(元)",
          key: "leftSum",
          sortable: true
        }
      ],
      url: "/manage/statistics/statisticsData/grid",
      params: {
        statisticsType: "distributor",
        startTimeLower: new Date().toLocaleDateString(),
        startTimeUpper: new Date().toLocaleDateString()
      }
    };
  },
  created() {
        apiGet("/admin/api/sysParam/changeList?key=payTypeStatis").then(res => {
      if (res.status == 200) {
        let arr = [
          {
            value: "",
            label: "--请选择支付类型--"
          }
        ];
        res.data.map(item => {
          let obj = {};
          obj.value = item.key;
          obj.label = item.value;
          arr.push(obj);
        });
        this.searchItems[7].data = arr;
      }
    });
  },
  methods: {}
};
</script>






