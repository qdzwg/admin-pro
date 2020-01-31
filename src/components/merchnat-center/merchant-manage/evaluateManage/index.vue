<template>
    <div class="commonService">
        <searchForm :search-items='searchItems'></searchForm>
        <gridTable ref="gridTable" :columns="columns" :params="params" :url="url"></gridTable>
        <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
        <!-- 弹出层 -->
        <Modal v-model="setModal" title="评价回复" width="666" @on-ok='ok'>
          <Form
            :model="formItem"
            label-position="right"
            :label-width="120"
            ref="formItem"
          >
              <Input type="textarea" v-model="formItem.replyContent"></Input>
          </Form>
          <!-- <div slot="footer">
            <Button type="primary" @click="setSave">保存</Button>
            <Button @click="setDel">取消</Button>
          </div> -->
        </Modal>
    </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import { apiPost, apiGet } from "@/fetch/api";
import confirm from "@/components/global/confirm";
import qrcode from "@xkeshi/vue-qrcode";
export default {
  components: {
    searchForm,
    gridTable,
    confirm,
    qrcode
  },
  data() {
    return {
      setModal:false,
      formItem: {
        replyContent: ''
      },
      searchItems: [
        {
          label: "状态",
          type: "select",
          name: 'enable',
          data: [
            {
              value: '',
              label: '请选择状态'
            },
            {
              value: 'T',
              label: '启用'
            },
            {
              value: 'F',
              label: '禁用'
            }           
          ]
        },
        {
          label: "业态",
          type: "select",
          name: "prodType",
          default: 'park',
          data: [
            {
              label: '景区',
              value: 'park'
            },
            {
              label: '酒店',
              value: 'hotel'
            },
            // {
            //   label: '商品',
            //   value: 'mdse'
            // },
            {
              label: '餐饮',
              value: 'eatery'
            },
            {
              label: '跟团游',
              value: 'route'
            },
            // {
            //   label: '剧院',
            //   value: 'theater'
            // },
            {
              label: '演出',
              value: 'show'
            }
          ]
        },
        {
          label: "评价等级",
          type: "select",
          name: "score",
          data: [
            {
              label: '请选择评价等级',
              value: ''
            },
            {
              label: '0级',
              value: '0'
            },
            {
              label: '1级',
              value: 1
            },
            {
              label: '2级',
              value: 2
            },
            {
              label: '3级',
              value: 3
            },
            {
              label: '4级',
              value: 4
            },
            {
              label: '5级',
              value: 5
            }
          ]
        },
        {
          label: "商品名称",
          type: "input",
          name: "name"
        },
      ],
      columns: [
        {
          title: "业态",
          width: 69,
          key: "productType",
          render:(h,params)=>{
            return h("span",this.filter.productType(params.row.productType))
          }
        },
        {
          title: "商品名称",
          // width: 120,
          key: "productName"
        },
        {
          title: "评价等级",
          width: 100,
          key: "score",
        },
        {
          title: "评价内容",
          key: "content",
          render:(h,params)=>{
              return h('div', {
                domProps: {
                  innerHTML: params.row.content+(params.row.replyContent?('</br>'+ '<div style="background:rgba(228, 228, 228, 1);">'+'【卖家回复】'+params.row.replyContent+'</br>'+params.row.replyTime+'</div>'):'')
                }
              })
          }
        },
        {
          title: "状态",
          width: 100,
          key: "enable",
          render: (h, params) => {
            return h("span", params.row.enable == "F" ? "禁用" : "启用");
          }
        },
        {
          title: "评价时间",
          key: "createTime"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 200,
          render: (h, params) => {
            let actions = [
              {
                title: "回复",
                action: () => {
                  this.setModal = true;
                  this.formItem.replyContent = params.row.replyContent?params.row.replyContent:'';
                  this.formItem.id = params.row.id;
                }
              },
              {
                title: params.row.enable == "T" ? "禁用" : "启用",
                action: () => {
                  apiPost("/merchant/api/merchantProdCommentsWebApi/enable", {
                    id: params.row.id,
                    enable: params.row.enable == "T" ? "F" : "T"
                  }).then(res => {
                    if (res.status == 200) {
                      let msg = res.message ? res.message : '操作成功！'
                      this.$Message.success(msg);
                      this.$refs.gridTable.loadpage();
                    }else{
                      let msg = res.message ? res.message : '操作失败！'
                      this.$Message.warning(msg);
                    }
                  });
                }
              },
              {
                title: params.row.top == "T" ? "取消置顶" : "置顶",
                action: () => {
                  apiGet("/merchant/api/merchantProdCommentsWebApi/top", {
                    id: params.row.id,
                    top: params.row.top == "T" ? "F" : "T"
                  }).then(res => {
                    if (res.status == 200) {
                      this.$Message.success("操作成功！");
                      this.$refs.gridTable.loadpage();
                    } else {
                      this.$Message.warning(res.message);
                    }
                  });
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      mode: "",
      content: "",
      sucessMsg: "",
      data: "",
      params: {
        page: 1,
        limit: 10,
        prodType: 'park',
        // sort: "createTime",
        // order: "desc",
        merchantInfoId: window.localStorage.getItem("xjsc_merchantInfoId_2018_11_13_czc")
      },
      url: "/merchant/api/merchantProdCommentsWebApi/commentGrid",
    };
  },
  created() {
    this.apiGet('/merchant/merchantInfo/getMerchantInfo').then(data=>{
      if(data.status==200){
        this.merchantInfoId=data.data.id;
      }else{
        this.$Message.warning('列表获取失败!');
      };
    }).catch(err=>{
      this.$Message.warning('列表获取失败!');
    });
  },
  methods: {
    ok() {
      apiPost('/merchant/api/merchantProdCommentsWebApi/replyComment',this.formItem).then(res=>{
          if(res.status==200){
              this.$Message.success(res.message)
              this.$refs.gridTable.loadpage()
          }else{
              this.$Message.warning(res.message) 
          }
      })
    }
  }
};
</script>

<style lang="scss">
.commonService {
  width: 100%;
}
</style>












