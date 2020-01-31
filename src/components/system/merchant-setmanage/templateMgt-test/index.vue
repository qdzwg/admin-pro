<template>
  <div :style="{'padding':padding}">
    <Form inline>
      <FormItem>
        <Input v-model='templateName' placeholder="请输入模板名称">
        </Input>
      </FormItem>
      <FormItem>
        <Input v-model='templateCode' placeholder="请输入模板编码">
        </Input>
      </FormItem>
      <Select style="width:200px" v-model='status' placeholder="请选择模板状态">
        <Option v-for="(item,index) in stateList" :value="item.key" :key='index'>{{ item.value }}</Option>
      </Select>
      <Select style="width:200px" v-model='type' placeholder="请选择模板类型">
        <Option value="" key='-1'>全部</Option>
        <Option v-for="(item,index) in typeList" :value="item.key" :key='index'>{{ item.value }}</Option>
      </Select>
      <FormItem>
        <Button icon="ios-search" @click="getList" type="primary">搜索</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="android-add" @click="templateAdd">添加</Button>
      </FormItem>
    </Form>
    <Table border :columns="columns7" :data="data6"></Table>
    <Page style="margin-top:10px" @on-change='pageChange' @on-page-size-change='limitChange' :total="total" show-elevator show-sizer></Page>
    <!-- <confirm ref="confirmModel" mode="done" :content='content' :sucessMsg='sucessMsg'></confirm> -->
    <Modal v-model="modal1" width="360">
      <p slot="header" style="color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>信息确认</span>
      </p>
      <p style="color:#f60">{{content}}</p>
      <div slot="footer" style="text-align:center">
        <Button type="error" :loading="modal_loading" @click="ok">确认</Button>
        <Button type="ghost" @click="modal1=false">取消</Button>
      </div>
    </Modal>
    <!-- 弹出层 -->
    <Modal v-model="modal2" :title="modalTitle" :loading="loading" @on-ok="addOk" @on-cancel="cancel" :type="type">
      <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
        <FormItem label="模板名称：" prop="name">
          <Input :maxlength="10" v-model="formItem.name" placeholder="填写模板名称"></Input>
        </FormItem>
        <FormItem label="模板类型：" prop="type">
          <Select v-model="formItem.type" size="large" style="width:100px">
            <Option v-for="item in typeList" :value="item.key" :key="item.value">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="主题展示图图片：" prop="picUrl">
          <div class="demo-upload-list" v-if="formItem.picUrl">
            <template>
              <img :src="formItem.picUrl">
              <div class="demo-upload-list-cover">
                <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
              </div>
            </template>
          </div>
          <div v-else>
            <Upload ref="upload" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" action="/static/manage/uiFileUpload/dispatch?action=upload" style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
              </div>
            </Upload>
          </div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import testimg from "@/components/global/img";
import confirm from "@/components/global/confirm";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      type: "add",
      loading: true,
      ruleForm: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        type: [{ required: true, message: "请输选择模板类型" }],
        picUrl: [{ required: true, message: "请上传图片" }]
      },
      formItem: {
        name: "",
        type: "",
        picUrl: "",
        file: ""
      },
      modalTitle: "模板信息填写",
      modal2: false,
      modal_loading: false,
      modal1: false,
      columns7: [],
      data6: [],
      stateList: [
        {
          key: "",
          value: "全部"
        },
        {
          key: "T",
          value: "上架"
        },
        {
          key: "F",
          value: "下架"
        }
      ],
      typeList: [],
      content: "",
      sucessMsg: "",
      page: 1,
      limit: 10,
      total: 0,
      templateName: "",
      templateCode: "",
      status: "",
      type: "",
      id: null,
      flag: null,
      padding: "0"
    };
  },
  created() {
    apiGet("/admin/api/sysParam/changeList?key=mercantTemplateType").then(
      res => {
        this.typeList = res.data;
      }
    );
    // alert(1)
    apiGet("/admin/api/sysParam/changeList?key=mercantTemplateType").then(
      res => {
        this.typeList = res.data;
        let arr = res.data.map((item, index) => {
          return;
        });
        this.columns7 = [
          {
            title: "序号",
            align: "center",
            width: 80,
            render: (h, params) => {
              return h("span", params.index + 1);
            }
          },
          {
            title: "模板名称",
            key: "name"
          },
          {
            title: "上下架状态",
            key: "status",
            render: (h, params) => {
              if (params.row.status == "T") {
                return h("span", "上架");
              } else if (params.row.status == "F") {
                return h("span", "下架");
              }
            }
          },
          {
            title: "模板类型",
            key: "type",
            render: (h, params) => {
              let item = res.data.find((item, index) => {
                return item.key == params.row.type;
              });
              return h("span", item.value);
            }
          },
          {
            title: "模板编码",
            key: "code"
          },
          {
            title: "主题展示图片",
            key: "img",
            align: "center",
            render: (h, params) => {
              return h(testimg, {
                props: {
                  url: params.row.picUrl,
                  width: "45px",
                  height: "45px"
                }
              });
            }
          },
          {
            title: "操作",
            key: "action",
            // width: 150,
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
                        this.modal2 = true;
                        this.content = params.row.templateContent;
                        this.formItem = {
                          name: params.row.name,
                          type: params.row.type,
                          picUrl: params.row.picUrl
                        };
                        this.templateId = params.row.id;
                        this.$refs.formItem.resetFields();
                        // this.$router.push(
                        //   "/template-add-edit?id=" + params.row.id
                        // );
                      }
                    }
                  },
                  "修改"
                ),
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
                        this.$router.push(
                          "/template-add-edit?id=" + params.row.id
                        );
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.flag = params.row.status == "T" ? "F" : "T";
                        this.id = params.row.id;
                        this.content =
                          "确认" +
                          (params.row.status == "T" ? "下架" : "上架") +
                          "?";
                        this.sucessMsg =
                          (params.row.status == "T" ? "下架" : "上架") +
                          "成功!";
                        this.modal1 = true;
                      }
                    }
                  },
                  params.row.status == "T" ? "下架" : "上架"
                )
              ]);
            }
          }
        ];
        //  alert(22)
      }
    );

    var agent = navigator.userAgent.toLowerCase();
    // console.log(agent)
    // var regStr_ie = /msie [\d.]+;/gi;
    // var regStr_ff = /firefox\/[\d.]+/gi;
    // var regStr_chrome = /chrome\/[\d.]+/gi;
    // var regStr_saf = /safari\/[\d.]+/gi;
    //IE
    // if (agent.indexOf("msie") > 0) {
    //   return agent.match(regStr_ie);
    // }

    //firefox
    if (agent.indexOf("firefox") > 0) {
      this.padding = "50px";
    }
  },
  mounted() {
    // this.loadpage(this.params)
    this.getList();
  },
  components: { confirm, testimg },
  methods: {
    handleRemove() {
      this.formItem.picUrl = "";
      this.$refs.formItem.validateField("picUrl");
    },
    handleSuccess(res, file) {
      if (res.state === "SUCCESS") {
        this.formItem.picUrl = res.prefix + res.url;
        this.$refs.formItem.validateField("picUrl");
      } else {
        this.$Message.warning("上传失败，请重新上传");
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "图片格式错误",
        desc: "文件" + file.name + "格式错误,请选择jpg或者png格式"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件太大",
        desc: "文件：" + file.name + " 太大, 不能超过2M."
      });
    },
    limitChange(limit) {
      this.limit = limit;
      this.getList();
    },
    addOk() {
      let _this = this;
      let url = "/merchant/webApi/merchantTemplateInfoTob/saveTemplate";
      this.common.formPost(this, {
        url,
        params: {
          id: this.templateId ? this.templateId : "",
          type: _this.formItem.type,
          name: _this.formItem.name,
          picUrl: _this.formItem.picUrl,
          templateContent: this.content
        },
        mold: "modal",
        callback(res) {
          // console.log("sdfsdfs", res);
          if (res.status == 200) {
            _this.$Message.success(
              _this.templateId ? "修改成功!" : "添加成功!"
            );
            _this.modal2 = false;
            _this.page = 1;
            _this.getList();
            // _this.$router.push("/templateMng");
          } else {
            if (res.message == "业务异常:模板名称已存在") {
              //名字重复了
              this.$Message.warning("模板名称已存在，请重新填写");
            } else {
              this.$Message.warning(res.message ? res.message : "保存出错!");
            }
          }
        }
      });
    },
    cancel() {
      this.modal2 = false;
    },
    ok() {
      apiGet(
        "/merchant/webApi/merchantTemplateInfoTob/enabled?id=" +
          this.id +
          "&status=" +
          this.flag
      ).then(res => {
        this.$Message.success(this.flag == "T" ? "上架成功!" : "下架成功!");
        this.modal1 = false;
        this.getList();
      });
    },
    pageChange(page) {
      this.page = page;
      this.getList();
    },
    getList() {
      apiPost("/merchant/webApi/merchantTemplateInfoTob/selectPage", {
        page: this.page,
        limit: this.limit,
        templateName: this.templateName,
        templateCode: this.templateCode,
        status: this.status,
        type: this.type
      }).then(res => {
        this.data6 = res.data.rows;
        this.total = res.data.total;
        // alert(333)
      });
    },
    templateAdd() {
      this.content = "[]";
      this.modal2 = true;
      this.formItem = {
        name: "",
        type: "",
        picUrl: ""
      };
      this.templateId = null;
      this.$refs.formItem.resetFields();
      // this.$router.push("/template-add-edit");
    }
  }
};
</script>

<style scope>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>


