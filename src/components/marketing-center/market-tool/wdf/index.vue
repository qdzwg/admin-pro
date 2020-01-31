<template>
    <div class="wdf">
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
        <Col span="2"><Button type="primary" icon="android-add" style="margin-bottom:20px;" @click="addCoupon">添加</Button></Col>    
        <Col span="2" ><Button type="error" icon="android-delete" @click="delAll">删除</Button></Col>
        <Col span="2"><Button type="success" icon="android-add" @click="open">接口配置</Button></Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

    <Modal v-model="marketLptModal" title="接口配置" width=800>
        <Form :model="marketForm" :label-width="120" label-position="right" ref="marketForm" :rules="ruleMarketForm">
        <FormItem label="接口配置URL：">
            <span>{{marketForm.addrUrl}}</span>
            <span><Button v-clipboard:copy="marketForm.addrUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button></span>
            <span><Button @click="getList('flush')">刷新</Button></span>
        </FormItem>
        <FormItem label="appId：" prop="appid">
            <Input v-model="marketForm.appid"></Input>
            <p>来源于店铺设置，有变更刷新获取</p>
        </FormItem>
        <FormItem label="appsecret：" prop="appsecret">
            <Input v-model="marketForm.appsecret"></Input>
            <p>来源于店铺设置，有变更刷新获取</p>
        </FormItem>
        <FormItem label="Token：" prop="toket">             
             <Input v-model="marketForm.toket"></Input>
             <p>帮助信息<br/>
                登录微信公众号平台【服务号】 https://mp.weixin.qq.com/ 下滑页面点击左侧菜单“开发”→“基本配置”按钮→“服务器配置”→Token(令牌)→复制信息到此框内</p>
        </FormItem>
        <FormItem>           
           <Button type="primary" @click="submit">提交</Button>
           <Button @click="test">取消</Button>
        </FormItem>
        </Form>
    <div slot="footer"></div>
    </Modal>
    <Modal v-model="interestsModal" title="权益" width=600>
        <table class="table" :data="dataList">
                    <tr class="table-title">
                        <th>层级</th>
                        <th>邀请人数</th>
                        <th>活动权益</th>
                    </tr>
                    <tr v-for="(item,index) in dataList" :key="index">
                        <td>{{item.grade}}</td>
                        <td>{{item.inviteNum}}</td>
                        <td>送优惠券{{item.couponNum}}张</td>
                    </tr>
                </table>
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
        interestsModal:false,
      editModal: false,
      editForm: {
        id: "",
        validPeriodEnd: null,
        name: "",
        _method: "put"
      },
      marketLptModal: false,
      marketForm: {
        id:"",
        addrUrl: "",
        appid: "",
        appsecret: "",
        toket: "",
      },
      ruleMarketForm:{
          appid:[
              {required:true,message:"请填写appId",trigger:"blur"}
          ],
          appsecret:[
              {required:true,message:"请填写appsecret",trigger:"blur"}
          ],
          toket:[
              {required:true,message:"请填写toket",trigger:"blur"}
          ]
      },
      detailVoList: [],
      skuList: [],

      searchItems: [
          {
              label:"活动名称",
              type:"input",
              name:"activityName"
          },
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
              value: "finished",
              label: "已结束"
            },
            {
              value: "processing",
              label: "进行中"
            },
            {
              value: "disabled",
              label: "已失效"
            }
          ]
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          
        },
        {
          title: "活动名称",
          sortable: true,
          key: "activityName"
        },
        {
          title: "开始时间",
          key: "startDate",
          sortable: true
        },
        {
          title: "结束时间",
          sortable: true,
          key: "endDate"
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
                title: "权益",
                action: () => {
                  this.interestsModal = true;
                  apiGet(
                    "/marketing/marketWdfActivity/showDetailFL?id=" + params.row.id
                  ).then(res => {
                    if(res.status==200){
                        this.dataList=res.data.gradeList
                    }
                  });
                }
              },
               {
                  title: "编辑",
                  action: () => {
                    this.$router.push({path:'/newWdf',query:{id:params.row.id}})
                  }
                }
            ];
            if (
              params.row.status == "not_start" ||
              params.row.status == "processing"
            ) {
              actions.push(
                {
                  title: "失效",
                  action: () => {
                    this.mode = "done";
                    this.sucessMsg = "操作成功！";
                    this.content =
                      "确认失效？";
                    this.$refs.confirmModel.confirm(
                      "/marketing/marketWdfActivity/lnvalid?id=" + params.row.id
                    );
                  }
                },
               
              );
            }  if (
              params.row.status == "not_start" ||
              params.row.status == "finished" ||
              params.row.status == "disabled"
            ) {
              actions.push({
                title: "删除",
                action: () => {
                  this.mode = "done";
                  this.content = "确定删除吗？";
                  this.sucessMsg = "操作成功！";
                  this.$refs.confirmModel.confirm(
                    "/marketing/marketWdfActivity/del?id=" + params.row.id
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
      dataList: [],
      modalpay: false,
      modalTitle: "",
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      url: "/marketing/marketWdfActivity/grid"
    };
  },
  created() {},
  methods: {
    addCoupon() {
      this.$router.push("/newWdf");
    },
    getvalidEnd(time) {
      this.editForm.validPeriodEnd = time;
    },
    submit() {
      let _this=this
      let url="/marketing/marketWdfActivity/saveWxConfig"
       this.common.formPost(this, {
        url,
        params: this.marketForm,
        mold: "page",
        modalName:"marketForm",
        callback(res) {
          if (res.success) {
            _this.$Message.success("操作成功");
            _this.marketLptModal = false;
          } else {
            _this.$Message.warning(res.message);
          }
        }
      });
    },
    test() {
      this.marketLptModal = false;
    },
    delAll(){
        this.mode= "delete"
      this.content = "确认删除吗？"
      this.sucessMsg = "删除成功!"
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let arr = []
        selection.forEach(element => {
          arr.push(element.id)
        })
        this.$refs.confirmModel.confirm('/marketing/marketWdfActivity/' + arr.join(","))
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    open(){
        this.marketLptModal=true
       this.getList()
    },
    getList(text){
         apiGet('/marketing/marketWdfActivity/showWxConfigFL').then(res=>{
            if(res.status==200){
                this.marketForm=res.data.config
                if(text=='flush'){
                     this.$Message.success("刷新成功！");
                }
            }
        })
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
.wdf {
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
      text-align: center;
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









