<template>
  <div class="aiphoto">
      <Form inline :model="searchForm">
          <FormItem>
               <Select v-model="searchForm.status" placeholder="店铺展示" style="width:150px">
                    <Option value="">--请选择--</Option>
                    <Option value="T">开启</Option>
                    <Option value="F">关闭</Option>
                </Select>
          </FormItem>
          <!-- <FormItem>
               <Select v-model="searchForm.useThreshold" placeholder="训练状态" style="width:150px">
                    <Option value="">--请选择--</Option>
                    <Option value="F">未完成</Option>
                    <Option value="T">已完成</Option>
                </Select>
          </FormItem> -->
          <FormItem>
              <Input v-model="searchForm.productName" placeholder="地标名称"></Input>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="getList">搜索</Button>
            </FormItem>
           <FormItem>             
              <Button type="primary" icon="android-add" @click="add" >新增地标</Button>
            </FormItem>
            <FormItem>
            <Button type="primary" icon="android-add" @click="add2" >产品推荐</Button>
            </FormItem>
      </Form>
   
    <div class="caterBox" v-for="(item,index) in dataList" :key="index">
      <div class="cater-list">
        <div class="cater-img">
          <img :src="item.guidePic" alt="">
        </div>
        <div class="cater-title">
          <h4 style="width:350px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;">{{item.productName	}}</h4>
          <!-- <p>图库训练状态：</p> -->
          <p>店铺展示：{{item.status=='T'?'开启':'关闭'}}</p>
        </div>
        <div class="cater-operation">
          <a @click="complate(item.id,'F')" v-if="item.status=='T'">关闭</a>          
          <a @click="complate(item.id,'T')" v-if="item.status=='F'">开启</a>          
          <!-- <a @click='complate2(item.id)'>图库训练</a>           -->
          <a @click='complateInfo(item.id)'>完善信息</a>
        </div>
      </div>
    </div>
    <div v-if="dataList.length==0">暂无数据</div>
    <div class="save-cancel">
      <Page :total="total" :current="searchForm.currPage" :page-size="searchForm.pageSize" class-name="pages" @on-change="changepage" @on-page-size-change='pageSizeChange' show-elevator show-sizer></Page>
    </div>   
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
  </div>
</template>


<script>
import { apiGet, apiPost } from "@/fetch/api";
import gridTable from "@/components/global/gridTable";
import myImg from "@/components/global/singleImg";
import confirm from "@/components/global/confirm";
export default {
  components: {
    myImg,
    confirm,
    gridTable
  },
  data() {
    return {
      mode: "",
      content: "",
      sucessMsg: "",
      modal: false,
      attrShow: false,
      modalTitle: "",
      total: 0,
      current: 1,
      pageSize: 10,
      currentNum: 1,

      dataList: [],
      searchForm: {
        productName: "",
        status: "",
        currPage: 1,
        pageSize: 10
      },
      formItem: {
        productName: "",
        productContent: "",
        guidePic: "",
        merchantInfoId: "",
        status: "",
        productCode: "",
        materialPics: ""
      },
      ruleForm: {
        productName: [
          { required: true, message: "请填写产品名称", trigger: "blur" }
        ],
        productContent: [
          { required: true, message: "请填写产品介绍", trigger: "blur" }
        ]
      },
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
          title: "景区名称",
          sortable: true,
          key: "spotsName"
        },
        {
          title: "地址",
          key: "areaName",
          sortable: true
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
                  this.formItem.productCode = params.row.sysAreaCode;
                  this.formItem.productName = params.row.spotsName;
                  this.attrShow = false;
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      total2: 0,
      params: {
        currPage: 1,
        pageSize: 10
      },
      attrName: "",
      data: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    complateInfo(id) {
      this.$router.push({ path: "/newAIphoto", query: { id: id } });
    },
    complate(id, text) {
      apiGet("/marketing/api/pat/patProdcutEnabled", {
        id: id,
        status: text
      }).then(res => {
        if (res.status==200) {
          this.$Message.success(res.message);
          this.getList();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    complate2() {},
    //新增
    add() {
      this.$router.push("/newAIphoto");
    },

    add2() {
      this.$router.push("/addConfig");
    },
    getList() {
      apiPost("/marketing/api/pat/getProductPageToB", this.searchForm).then(
        res => {
          if (res.status == 200) {
            this.total = res.data.total;
            this.dataList = res.data.rows;
          }else{
              this.$router.push('/notBuyService')
          }
        }
      );
    },
    pageSizeChange(num) {
      this.searchForm.pageSize = num;
      this.getList();
    },
    changepage(num) {
      this.searchForm.currPage = num;
      this.getList();
    }
  }
};
</script>

<style lang="scss" >
.aiphoto {
  width: 100%;
  .caterBox {
    width: 100%;
    margin-bottom: 10px;
    .cater-list {
      width: 100%;
      height: 130px;
      margin: 0 auto;
      background-color: rgb(238, 238, 238);
      box-sizing: border-box;
      padding: 10px;
      .cater-icon {
        height: 100px;
        line-height: 100px;
        cursor: pointer;
        font-size: 25px;
        float: left;
      }
      .cater-img {
        width: 100px;
        height: 100px;
        margin: 0 50px 0 30px;
        float: left;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .cater-title {
        height: 100px;
        float: left;
        line-height: 30px;
      }
      .cater-operation {
        height: 100px;
        line-height: 100px;
        float: right;
        a {
          margin-right: 10px;
        }
      }
    }
  }
  .save-cancel {
    padding-bottom: 50px;
  }
}
</style>

