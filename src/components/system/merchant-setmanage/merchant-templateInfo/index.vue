<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
       <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">添加</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :test="test" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" mode="delete"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
          <FormItem label="模板名称：" prop="name">
            <Input v-model="formItem.name" placeholder="填写模板名称"></Input>
          </FormItem>
          <FormItem label="模板类型：" prop="type">
            <Select v-model="formItem.type" size="large" style="width:100px">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="主题展示图图片：" prop="destPrivateKey">
          <div class="demo-upload-list" v-if="formItem.picUrl">
            <template>
              <img :src="formItem.picUrl">
              <div class="demo-upload-list-cover">
                <Icon type="ios-trash-outline"  @click.native="handleRemove"></Icon>
              </div>
            </template>
            <!-- <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template> -->
          </div>
          <div v-else>
             <Upload
               ref="upload"
                 :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                type="drag"
                action="list/static/manage/uiFileUpload/dispatch?action=upload"
                style="display: inline-block;width:58px;">
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
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
  data() {
    return {
      uploadList: {},
      typeList: [
        {
          value: "0",
          label: "基础"
        },
        {
          value: "1",
          label: "场景专题"
        },
        {
          value: "2",
          label: "付费专区"
        }
      ],
      columns: [
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
          title: "模板类型",
          key: "type",
          render: (h, params) => {
           
            if (params.row.type == 0) {
              return h("span", "基础");
            } else if (params.row.type == 1) {
              return h("span", "场景专题");
            } else if (params.row.type == 2) {
              return h("span", "付费专区");
            }
          }
        },
        {
          title: "模板编码",
          key: "code"
        },
        {
          title: "主题展示图图片",
          key: "picUrl"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.modal = true;
                  this.modalTitle = "修改";
                  this.formItem.name = params.row.name;
                  this.formItem.type = params.row.type;
                  this.formItem.picUrl = params.row.picUrl;
                  this.formItem.id = params.row.id;
                  this.type = "edit";
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
      url: "list/merchant/merchantTemplateInfo/grid",
      searchItems: [
        {
          label: "模板名称",
          type: "input",
          name: "name"
        },
        {
          label: "模板类型",
          type: "select",
          name: "type",
          data: [
            {
              value: "0",
              label: "基础"
            },
            {
              value: "1",
              label: "场景专题"
            },
            {
              value: "2",
              label: "付费专区"
            }
          ]
        }
      ],
      modal: false,
      formItem: {
        name: "",
        type: "",
        picUrl: "",
        file:""
      },
      modalTitle: "新增角色",
      type: "add",
      loading: true,
      ruleForm: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        type: [{ required: true, message: "请输选择模板类型" }]
      }
    };
  },
  mounted() {
    // this.loadpage(this.params)
  },
  components: { searchForm, gridTable, confirm },
  methods: {
    handleRemove(){
     this.formItem.picUrl = ''
    },
    handleSuccess(res, file) {
      if (res.state === 'SUCCESS') {
        this.formItem.picUrl = res.prefix + res.url
      }else {
        this.$Message.warning("上传失败，请重新上传")
      }
      // console.log(res);
      // console.log(file);
      // file.url =
      // file.name = "7eb99afb9d5f317c912f08b5212fd69a";
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
    test() {
      this.$router.push("/test");
    },
    ok() {
      let _this = this;
      let url =
        _this.type === "add"
          ? "list/merchant/merchantTemplateInfo/saveMerchantTemplate"
          : "list/merchant/merchantTemplateInfo/updateMerchantTemplate/" + this.formItem.id;
      this.common.formPost(this, {
        url,
        params:
          _this.type === "add"
            ? this.formItem
            : Object.assign(this.formItem, { _method: "put" }),
        mold: "modal",
        callback(res) {
          if (res.success) {
            _this.$Message.success(
              _this.type === "add" ? "添加成功!" : "修改成功!"
            );
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
      this.type = "add";
      this.formItem.name = "";
      this.formItem.type = "";
      this.modalTitle = "添加";
    },
    delAll() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("list/admin/sysRole/" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
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


