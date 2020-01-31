<template>
  <div class="template-user-define">
    <searchForm :search-items="searchItems"></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="24">
        <Button @click="pullModal">拉取</Button>
        <Button @click="del">删除</Button>
        <Button @click="up">上架</Button>
        <Button @click="down">下架</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <Modal
      class="template-modal-select"
      width="850"
      v-model="modal"
      title="选择页面模板"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form ref="formInline" inline>
        <FormItem>
          <Input v-model="templateName" placeholder="请输入模板名称"></Input>
        </FormItem>
        <!-- <FormItem>
              <Select placeholder='请选择状态' v-model="status" style="width:160px">
                <Option value="">全部</Option>
                <Option value="T">上架</Option>
                <Option value="F">下架</Option>
              </Select>
        </FormItem>-->
        <FormItem>
          <Select placeholder="请选择模板类型" v-model="type" style="width:160px">
            <Option value>全部</Option>
            <Option v-for="(item,index) in typeList" :key="index" :value="item.key">{{item.value}}</Option>
          </Select>
        </FormItem>
        <Button type="primary" icon="ios-search" @click="getList">搜索</Button>
      </Form>
      <div class="template-select-list clearfix">
        <Col class="item-warper" span="6">
          <div class="template-item user-defined">
            <!-- <img class="userdefine-img" src="http://f.hiphotos.baidu.com/image/h%3D300/sign=0eaa7d0c75f0f736c7fe4a013a54b382/f603918fa0ec08faf4f358d454ee3d6d54fbdad6.jpg" alt=""> -->
            <i style="font-size:65px;" class="icon xx-icon icon-moban2"></i>
            <div>自定义页面</div>
            <Button @click="create">立即新建</Button>
          </div>
        </Col>
        <Col v-for="(item,index) in listData" :key="index" class="item-warper" span="6">
          <div class="template-item">
            <img class="template-item-img" :src="item.picUrl" alt>
            <div class="cover">
              <Button @click="useTemplete(item.id)" class="template-use">使用模板</Button>
            </div>
          </div>
          <div class="template-name">{{item.name}}</div>
        </Col>
      </div>
      <!-- <Page @on-change='pageChange' :total="total" show-elevator></Page> -->
      <Page @on-change="pageChange" :page-size="7" :total="total"></Page>
      <div slot="footer"></div>
    </Modal>
    <Modal width="1000" v-model="modal1" title="拉取场所">
      <Form ref="formInline" inline>
        <FormItem>
          <Input type="text" v-model="name" placeholder="请输入对应场所关键字"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList">搜索</Button>
          <Button @click="pull">一键拉取</Button>
        </FormItem>
      </Form>
      <Table
        border
        ref="selection"
        @on-selection-change="mutiSelect"
        :columns="columns4"
        :data="data1"
      ></Table>
      <div slot="footer">
        <!-- <Button @click="set" type="primary">确定</Button>
        <Button @click="setCancel" type="ghost">取消</Button>-->
      </div>
    </Modal>
  </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import { apiGet, apiPost } from "@/fetch/api";
import QRcode from "@xkeshi/vue-qrcode";
export default {
  data() {
    return {
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "场所名称",
          key: "name"
        },
        {
          title: "外部场所编码",
          key: "age"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.pullApi(params.row.id + "");
                    }
                  }
                },
                "选择"
              )
            ]);
          }
        }
      ],
      data1: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ],
      name: "",
      modal1: false,
      content: "",
      sucessMsg: "",
      mode: "",
      searchItems: [
        {
          label: "场所名称",
          type: "input",
          name: "pageName1"
        },
        {
          label: "场所编码",
          type: "input",
          name: "pageName2"
        },
        {
          label: "状态(票型)",
          type: "select",
          name: "enabled",
          data: [
            {
              value: "T",
              label: "已上架"
            },
            {
              value: "F",
              label: "已下架"
            }
          ]
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "场所名称",
          key: "modifyTime",
          sortable: true
        },
        {
          title: "场所编码",
          key: "modifyTime",
          sortable: true
        },
        {
          title: "外部场所编码",
          key: "modifyTime",
          sortable: true
        },
        {
          title: "场所状态",
          key: "modifyTime",
          sortable: true
        },
        {
          title: "操作",
          key: "action",
          // width: 200,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.$router.push("/place-edit?id=" + params.row.id);
                }
              },
              {
                title: "删除",
                action: () => {
                  apiGet(
                    "/merchant/webApi/merchantRenovationTob/copePage?id=" +
                      params.row.id
                  ).then(res => {
                    // console.log(res);
                    this.$Message.success("复制成功!");
                    this.$refs.gridTable.loadpage();
                  });
                }
              }
              //   {
              //     title: "推广",
              //     action: () => {
              //       this.preview(params.row.id, params.row.renovationPageType);
              //     }
              //   }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "modifyTime",
        order: "desc"
      },
      url: "/merchant/webApi/merchantRenovationTob/selectCustomPage",
      modal: false,
      templateCode: "",
      type: "",
      status: "",
      page: 1,
      total: null,
      listData: [],
      templateName: "",
      typeList: [],
      wxxcx: false,
      selection: []
    };
  },
  created() {
    // apiGet("/admin/api/sysParam/changeList?key=" + "mercantTemplateType").then(
    //   res => {
    //     this.typeList = res.data;
    //   }
    // );
    // apiGet(
    //   "/marketing/api/market/selectServiceUse?merchantInfoId=" +
    //     window.localStorage.getItem("xjsc_merchantInfoId_2018_11_13_czc") +
    //     "&serviceType=wxxcx"
    // ).then(res => {
    //   this.wxxcx = res.data["wxxcx"];
    // });
  },
  mounted() {
    // this.loadpage(this.params)
    // console.log("created mo");
  },
  destroyed() {
    // console.log("destroyed sdfsf");
  },
  components: {
    gridTable,
    confirm,
    searchForm
    // qrcode: QRcode
  },
  methods: {
    pullApi(ids) {
    },
    pull() {
      if (this.selection.length > 0) {
        this.pullApi(this.selection.split(","));
      } else {
        this.$Message.warning("请选择拉取项");
      }
    },
    mutiSelect(selection) {
      this.selection = selection;
    },
    pullModal() {
      this.modal1 = true;
    },
    del() {
      if (this.$refs.gridTable.selection.length > 0) {
        this.mode = "done";
        this.content = "确认删除吗?";
        this.sucessMsg = "删除成功!";
        this.$refs.confirmModel.confirm(
          "/merchant/webApi/merchantRenovationTob/delRenovationById?id=12321312312312312"
          //   params.row.id  
        );
      } else {
        this.$Message.warning("请选择删除项");
      }
    },
    up() {
      if (this.$refs.gridTable.selection.length > 0) {
        this.mode = "done";
        this.content = "确认上架吗?";
        this.sucessMsg = "删除成功!";
        this.$refs.confirmModel.confirm(
          "/merchant/webApi/merchantRenovationTob/delRenovationById?id=12321312312312312"
          //   params.row.id
        );
      } else {
        this.$Message.warning("请选择上架项");
      }
    },
    down() {
      if (this.$refs.gridTable.selection.length > 0) {
        this.mode = "done";
        this.content = "确认下架吗?";
        this.sucessMsg = "删除成功!";
        this.$refs.confirmModel.confirm(
          "/merchant/webApi/merchantRenovationTob/delRenovationById?id=12321312312312312"
          //   params.row.id
        );
      } else {
        this.$Message.warning("请选择下架项");
      }
    },
    fresh() {
      apiGet("/merchant/webApi/merchantRenovationTob/deleteRedis").then(res => {
        if (res.status == 200) {
          this.$Message.success("缓存清除成功!");
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    pageChange(page) {
      this.page = page;
      this.getList();
    },
    getList() {
      apiPost("/merchant/webApi/merchantTemplateInfoTob/selectPage", {
        page: this.page,
        limit: 7,
        templateName: this.templateName,
        status: "T",
        type: this.type
      }).then(res => {
        // console.log(res)
        this.total = res.data.total;
        this.listData = res.data.rows;
      });
    },
    create() {
      this.$router.push("/create");
    },
    add() {
      this.modal = true;
      this.getList();
    },
    splits(test) {
      return test.split(",");
    },
    ok() {
      this.formItem.accType = 0;
      this.formItem.useFlag = this.formItem.switch ? 1 : 0;
      let _this = this;
      let url =
        _this.type === "add"
          ? "list/admin/sysFunctions/saveRole"
          : "list/admin/sysFunctions/update";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback(res) {
          if (res.success) {
            _this.modal = false;
          }
        }
      });
    },
    cancel() {
      // this.$Message.info('Clicked cancel')
    },
    showModal() {
      this.modal = true;
      this.formItem.funName = "";
      this.formItem.funCode = "";
      this.formItem.optType = "";
      this.formItem.sortNo = "";
      this.formItem.openModes = "";
      this.formItem.functionTypes = "";
      this.formItem.hierarchys = "";
      this.formItem.funTypes = [];
      this.type = "add";
      this.formItem.switch = true;
      this.modalTitle = "新增角色";
    },
    delAll() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("list/admin/sysFunctions/" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    }
  }
};
</script>
<style lang='scss'>
//   @import "../../../../assets/styles/font/iconfont.css";
.template-modal-select {
  .template-select-list {
    margin-bottom: 15px;
    .item-warper {
      padding: 0 25px;
      margin-bottom: 10px;
      .template-name {
        text-align: center;
        padding: 10px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .template-item {
        // margin: 0 5px;
        margin-bottom: 10px; // height: 190px;
        height: 180px;
        width: 125px;
        position: relative;
        margin: 0 auto;
        .template-item-img {
          height: 180px;
          width: 125px;
        }
        .cover {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          text-align: center;
          .template-use {
            margin-top: 85px;
          }
        }
      }
      .template-item:hover {
        .cover {
          display: block;
        }
      }
      .user-defined {
        border: 1px solid #eee;
        text-align: center;
        .userdefine-img {
          margin-top: 25px;
          height: 80px;
          width: 80px;
        }
      }
    }
  }
}
.template-user-define {
}
</style>

