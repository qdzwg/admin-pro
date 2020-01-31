<template>
  <div>
    <Form ref="formInline" :model="searchForm" inline >
        <FormItem label="">
            <Input v-model="searchForm.accName" placeholder="名称"></Input>
        </FormItem>         
        <FormItem label="">
            <Select v-model="searchForm.plugCode" style="width:180px" placeholder="请选择服务类型">
                <Option value="">--请选择状态--</Option>
                <Option v-for="(item, index) in serviceList" :value="item.key" :key="index">{{ item.value }}</Option>
            </Select>
        </FormItem>
        <FormItem label="">
            <Select v-model="searchForm.enabled" style="width:180px" placeholder="请选择状态">
                <Option v-for="(item, index) in statusList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
        </FormItem>       
        <Button type="primary" icon="ios-search" @click="search()">搜索</Button>        
    </Form>
    <Row :gutter="16" class="btn-groups">
      <Col span="3">
        <Button type="primary" icon="android-add" @click="showModal('add')">发布</Button>
      </Col>
    </Row>
    <gridTable
      ref="gridTable"
      :params="params"
      :columns="columns"
      :data="data"
      :url="url"
    ></gridTable>
    <confirm
      ref="confirmModel"
      :mode="mode"
      :content="content"
      :sucessMsg="sucessMsg"
    ></confirm>

    <!--新增编辑-->
    <Modal v-model="modal" width="700" :title="doTitle">
      <Form
        :model="formItemt"
        label-position="right"
        ref="formItemt"
        :rules="ruleFormt"
      >       
        <FormItem label="服务名称：" prop="name" :label-width="100">
          <Input
            v-model="formItemt.name"
            placeholder="请输入服务名称"
            style="width: 180px;"
          ></Input>
        </FormItem>
        <FormItem label="服务类型：" :label-width="100" prop="plugCode">
          <Select
            v-model="formItemt.plugCode"
            :disabled="type=='edit'"
            style="width:180px"
            placeholder="请选择服务类型"
          >
            <Option
              v-for="(item, index) in serviceList"
              :value="item.key"
              :key="index"
              >{{ item.value }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="服务图片：" prop="linkMobileImg" :label-width="100">
            <Input v-model="formItemt.linkMobileImg" style="display:none"></Input>
          <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
        </FormItem>
        <FormItem label="服务简介：" prop="introduce" :label-width="100">
            <Input type="textarea" v-model="formItemt.introduce" style="width:50%;"></Input>            
        </FormItem>
        <FormItem label="服务价格：" :label-width="100">
            <table class="table">
                <thead>
                    <tr>
                        <th>有效期</th>
                        <th>原价</th>
                        <th>现价</th>
                        <!-- <th><span @click="addTable">添加</span></th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="center-td">
                            <FormItem prop="dateValue1" v-if="formItemt.date1!='4'" style="display:inline-block; vertical-align:middle">
                                <Input style="width:80px;" v-model="formItemt.dateValue1"></Input>
                            </FormItem>
                            <FormItem prop="date1" style="display:inline-block; vertical-align:middle">
                                <Select v-model="formItemt.date1" style="width:80px; position: relative; z-index: 1000">
                                    <Option v-for="(item,index) in dateArr" :key="index" :value="item.key">
                                        {{item.value}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="originalPrice1">
                                <Input style="width:80px;" v-model="formItemt.originalPrice1"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="presentPrice1">
                                <Input style="width:80px;" v-model="formItemt.presentPrice1"></Input>
                            </FormItem>
                        </td>
                        <!-- <td>
                            <span @click="delTable(index)">刪除</span>
                        </td> -->
                    </tr>
                    <!-- <template v-for="(item,index) in formItemt.tableList">
                        <tr>
                            <td class="center-td">
                                <Input style="width:80px;" v-model="item.dateValue1"></Input>
                                <Select v-model="item.date1" style="width:80px; position: relative; z-index: 1000">
                                    <Option v-for="(it,ind) in item.dateArr" :key="ind" :value="it.key">
                                        {{it.value}}
                                    </Option>
                                </Select>
                            </td>
                            <td>
                                <Input style="width:80px;" v-model="item.originalPrice1"></Input>
                            </td>
                            <td>
                                <Input style="width:80px;" v-model="item.presentPrice1"></Input>
                            </td>
                            <td>
                                <span @click="delTable(index)">刪除</span>
                            </td>
                        </tr>
                    </template> -->
                </tbody>
            </table>
        </FormItem>        
        <FormItem label="服务详情：" prop="summary" :label-width="100">
            <ueditor v-model="formItemt.summary"></ueditor>
        </FormItem>
        <FormItem style="text-align: center;">
          <Button type="primary" @click="submit">
              <template v-if="type == 'add'">发布</template>
              <template v-else>提交</template>
          </Button>
          <Button type="ghost" @click="cancel">关闭</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import myImg from "@/components/global/singleImg";
import ueditor from '@/components/global/vueUEditor';
import { apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      type: "",
      id: "",
      userId: "",
      modal: false,
      doTitle: "",
      serviceList: [],
      mode: "",
      content: "",
      sucessMsg: "",
      singleImgList: [],
      
      columns: [
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
          title: "服务类型",
          key: "plugCode",
          render: (h, params) => {
              let str = ''
              for(let i = 0; i < this.serviceList.length; i++){
                  if(this.serviceList[i].key == params.row.plugCode){
                      str = this.serviceList[i].value;
                  }
              }
              return h("span", str)
          }  
        },
        {
          title: "图片",
          key: "picture",
          render: (h, params) => {
            return h('div', [
                h('img', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    attrs: {
                        src: params.row.picture, style: 'width: 100px;height: 60px;border-radius: 2px; margin: 5px 0;'
                    },
                    style: {
                    },
                }),
            ]);
          }
        },
        {
          title: "服务简介",
          key: "introduce"
        },
        {
          title: "状态",
          key: "enabled",
          render: (h, params) => {
            return h("span", params.row.enabled == "F" ? "已下架" : "已上架");
          }
        },        
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            let { id, enabled } = params.row;
            const actions = [
              {
                title: enabled == "F" ? "上架" : "下架",
                action: () => {
                  this.mode = "done";
                  this.sucessMsg =
                    (enabled == "F" ? "上架" : "下架") + "成功！";
                  this.content =
                    "确认" + (enabled == "F" ? "上架" : "下架") + "？";
                  this.$refs.confirmModel.confirm(
                    "/marketing/marketService/enabled?id=" +
                      id +
                      "&enabled=" +
                      (enabled == "F" ? "T" : "F")
                  );
                }
              },             
              {
                title: "修改",
                action: () => {
                  this.showModal("edit", params.row);
                }
              } 
            ];           
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      statusList: [
        {
          value: "",
          label: "--请选择状态--"
        },
        {
          value: "T",
          label: "上架"
        },
        {
          value: "F",
          label: "下架"
        }
      ],
      data: "",
      params: { page: 1, limit: 10 },
      url: "/marketing/marketService/publishGrid",
      dateArr: [{
            "key": '1',
            "value": '天(试用)'
        },{
            "key": '2',
            "value": '月'
        },{
            "key": '3',
            "value": '年'
        },{
            "key": '4',
            "value": '永久'
        }],
      formItemt: {
        plugCode: "",
        name: "",
        picture: '',
        summary: '',
        introduce: '',
        dateValue1: '',
        date1: '',
        originalPrice1: '',
        presentPrice1: '',   
        linkMobileImg: '',
        priceIds: 1
        // tableList: [
        //     {            
        //         dateValue1: '',
        //         date1: '',
        //         dateArr: [{
        //             "key": '1',
        //             "value": '天(试用)'
        //         },{
        //             "key": '2',
        //             "value": '月'
        //         },{
        //             "key": '3',
        //             "value": '年'
        //         },{
        //             "key": '4',
        //             "value": '永久'
        //         }],
        //         originalPrice1: '',
        //         presentPrice1: '',            
        //     }
        // ], 
      },
      ruleFormt: {
        name: [{ required: true, message: "请填写服务名称", trigger: "blur" }],
        plugCode: [{ required: true, message: "请选择服务类型", trigger: "change" }],
        linkMobileImg: [{ required: true, message: "请选择服务图片", trigger: "blur" }],
        introduce: [{ required: true, message: "请填写服务简介", trigger: "blur" }],
        dateValue1: [{ required: true, message: "请填写", trigger: "blur" }],
        date1: [{ required: true, message: "请选择", trigger: "change" }],
        originalPrice1: [{ required: true, message: "请填写原价", trigger: "blur" }],
        presentPrice1: [{ required: true, message: "请填写现价", trigger: "blur" }],
      },
      searchForm: {}
    };
  },
  components: { gridTable, confirm, myImg, ueditor },
  mounted() {
    this.apiGet("/marketing/marketService/toPublishFL").then(res => {
      if (res.success || res.status == 200) {
        this.serviceList = res.data.marketTool;
      }
    });
  },
  methods: {
    // addTable() {
    //     this.formItemt.tableList.push({

    //     })
    // },
    setWapUrl(imgArr) {
      this.formItemt.picture = imgArr.join(",");
      this.formItemt.linkMobileImg = imgArr.join(",");
      this.$refs.formItemt.validateField("linkMobileImg");
    },
    async search () {
      this.$store.state.list.params = Object.assign(this.$store.state.list.params, this.searchForm)
      await this.$store.dispatch('postApi')
    },
    del(id) {
      this.mode = "done";
      this.content = "确认删除吗?";
      this.sucessMsg = "删除成功!";
      this.$refs.confirmModel.confirm("/admin/userInfo/delete/?id=" + id);
    },
    showModal(wTd, data) {
      this.type = wTd;
      this.modal = true;
      if (this.type == "add") {
        this.doTitle = "发布服务";  
        this.formItemt.name = '';
        this.formItemt.plugCode = '';
        this.formItemt.picture = '';
        this.formItemt.introduce = '';
        this.formItemt.dateValue1 = '';
        this.formItemt.date1 = '';
        this.formItemt.originalPrice1 = '';
        this.formItemt.presentPrice1 = '';
        this.formItemt.summary = '';
        this.singleImgList = [];
      } else if (this.type == "edit") {
        this.doTitle = "修改服务";
        this.apiGet('/marketing/marketService/editFL',{id: data.id}).then(res => {
            let serviceData = res.data.marketService;
            this.id = serviceData.id;
            this.formItemt.name = serviceData.name;
            this.formItemt.plugCode = serviceData.plugCode;
            this.formItemt.picture = serviceData.picture;
            this.formItemt.linkMobileImg = serviceData.picture;            
            this.singleImgList.push(serviceData.picture);
            this.formItemt.introduce = serviceData.introduce;
            this.formItemt.dateValue1 = res.data.priceList[0].dateValue1;
            this.formItemt.date1 = res.data.priceList[0].dateType;
            this.formItemt.originalPrice1 = res.data.priceList[0].originalPrice+'';
            this.formItemt.presentPrice1 = res.data.priceList[0].presentPrice+'';
            this.formItemt.summary = serviceData.summary;
        })
      } else {
        
      }
    },   
    cancel() {
      this.modal = false;
    },
    submit() {
      this.$refs.formItemt.validate(async valid => {
        this.scrollError();
        if (valid) {
          let url = "";
          if (this.type == "add") {
            url = "/marketing/marketService/doPublish";
          }
          if (this.type == "edit") {
            url = "/marketing/marketService/doUpdate";
            this.formItemt.id = this.id;
          }
          this.apiPost(url, this.formItemt).then(res => {
            if (res.status == 200 || res.success) {
              let msg = res.message ? res.message : "操作成功";
              this.$Message.success(msg);
              this.$store.dispatch("postApi");
              this.modal = false;
            } else {
              let msg = res.message ? res.message : "操作失败";
              this.$Message.warning(msg);
            }
          });
        }
      });
    },
    scrollError() {
      let errList = $(".ivu-form-item-error");
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top;
        $("#content").animate(
          {
            scrollTop: scroll_offset
          },
          300
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.choose-file {
  color: #2d8cf0;
  display: block;
  border: 1px solid #2d8cf0;
  padding: 0 30px;
  border-radius: 5px;
  height: 28px;
  line-height: 28px;
}
.table {
    margin-bottom: 15px;
    width: 100%;
    border-spacing: 0;
    border: 1px solid #ddd;
    border-collapse: separate;
    border-left: 0;
    border-bottom: 0;
    thead {
      tr {
        th {
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #dddddd;
          padding: 8px;
          line-height: 20px;
          text-align: center;
        }
      }
    }
    tbody {
      tr {
        td {
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #dddddd;
          padding: 8px;
          line-height: 20px;
          text-align: center;
          .tr-img {
            height: 58px;
            width: 58px;
            margin: 0 auto;          
            margin-bottom: 5px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
  td.time {
    width: 330px;
  }
  .add-icon {
    cursor: pointer;
    color: green;
    font-size: 28px;
  }
  .delete-icon {
    cursor: pointer;
    color: red;
    font-size: 28px;
  }
  .center-td {
    text-align: center;
    
  }
  .ivu-select-dropdown{
    z-index: 1000 !important;
  }
</style>