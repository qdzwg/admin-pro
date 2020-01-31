<template>
  <div class="template-custompage">
    <div :style='{width:width}' class="clearfix handel-box">
      <!-- <Button class="" type="primary">预览</Button> -->
      <Button style="margin-right:10px;" class="save" @click="save" type="info">保存</Button>
    </div>
    <create @updata='getdata' ref='custompageTemplate'></create>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok" @on-cancel="cancel" :type="type">
      <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
        <FormItem label="模板名称：" prop="name">
          <Input v-model="formItem.name" placeholder="填写模板名称"></Input>
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
import { apiPost, apiGet } from "@/fetch/api";
import create from "@/components/create";
import { mapState } from "vuex";
export default {
  data() {
    return {
      codeArr: [
        //特定模板，轮播图图替换成xsjc_banner_normal和xsjc_banner_top
        "MTI20180316172401",
        "MTI20180316172801",
        "MTI20180316173101",
        "MTI18062213232769",
        "MTI18111911405880"
      ],
      templateCode: "",
      width: "",
      typeList: [],
      modal: false,
      modalTitle: "模板信息填写",
      loading: true,
      formItem: {
        name: "",
        type: "",
        picUrl: "",
        file: ""
      },
      type: "add",
      ruleForm: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        type: [{ required: true, message: "请输选择模板类型" }],
        picUrl: [{ required: true, message: "请上传图片" }]
      }
    };
  },
  components: {
    create
  },
  created() {
    apiGet("/admin/api/sysParam/changeList?key=mercantTemplateType").then(
      res => {
        this.typeList = res.data;
      }
    );
  },
  computed: {
    ...mapState({
      list2: state => {
        return state.defined.list;
      }
    })
  },
  mounted() {
    // console.log("zz");
    let _this = this;
    this.width = $("#content").width() - 220 + "px";
    $(window).resize(function() {
      _this.width = $("#content").width() - 220 + "px";
      // console.log(_this.width);
    });
    if (this.$route.query && this.$route.query.id) {
      this.$refs.custompageTemplate.getData(
        "/merchant/webApi/merchantTemplateInfoTob/getTemplateById"
      );
    }
  },
  methods: {
    getdata(res) {
      this.templateCode = res.code;
      this.formItem = {
        name: res.name,
        picUrl: res.picUrl,
        type: res.type
      };
    },
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
    save() {
      if (this.list2 && this.list2.length) {
        this.$refs.custompageTemplate.check();
        if (this.$refs.custompageTemplate.checkVal) {
          // this.modal = true;
          this.ok();
        }
      } else {
        this.$Message.warning("请添加组件");
      }
    },
    ok() {
      let _this = this;
      //用于后端替换
      //克隆数据
      let jsonStr = JSON.stringify(_this.list2);
      let parseArr = JSON.parse(jsonStr);
      let flag = true;
      parseArr.forEach((item, index) => {
        // console.log("asdada");
        //如果是老的基础模板
        if (this.templateCode && this.codeArr.indexOf(this.templateCode) > -1) {
          //判断是否是基础模板
          if (item.category == "product") {
            //产品组件
            if (item.data.productTag == "type2") {
              //热销
              parseArr[index].data.list = "xjscHotSell";
            } else if (item.data.productTag == "fine") {
              //精品
              parseArr[index].data.list = "xjscFine";
            } else if (!item.data.productTag) {
              //无标签
              parseArr[index].data.list = "xjscproduct_no_tag";
            }
          }
          if (item.category == "banner") {
            if (index == 0 && item.data.type == "banner2") {
              //轮播图再顶部并且是banner2的时候替换成xsjc_banner_top
              parseArr[index].data.list = "xsjc_banner_top";
            } else {
              //替换成xsjc_banner_normal
              parseArr[index].data.list = "xsjc_banner_normal";
            }
          }
          if (item.category == "productGroup") {
            if (parseArr[index].data.list.length >= 3) {
              parseArr[index].data.list[0].data = "xjsctype_park";
              parseArr[index].data.list[1].data = "xjsctype_hotel";
              parseArr[index].data.list[2].data = "xjsctype_mdse";
            } else {
              this.$refs.custompageTemplate.scrolltest(index);
              flag = false;
              return false;
            }
          }
          // if(item.category == "product"){
          //   item.data
          // }
        }

        if (item.category == "freeLayout") {
          //自定义布局,根据当前样式去除多余的
          let limitNum = 4;
          let val = item.data.type;
          if (val == "freeLayout1") {
            limitNum = 4;
          } else if (val == "freeLayout2") {
            limitNum = 2;
          } else if (val == "freeLayout3") {
            limitNum = 3;
          } else if (val == "freeLayout4") {
            limitNum = 3;
          } else if (val == "freeLayout5") {
            limitNum = 4;
          } else if (val == "freeLayout6") {
            limitNum = 3;
          } else if(val == "freeLayout7"){
            limitNum = 2;
          } else {
          }
          parseArr[index].data.list = parseArr[index].data.list.splice(
            0,
            limitNum
          );
        }
      });
      if (flag) {
        let url = "/merchant/webApi/merchantTemplateInfoTob/saveTemplate";
        this.common.formPost(this, {
          url,
          params: {
            id: this.$route.query.id ? this.$route.query.id : "",
            type: _this.formItem.type,
            name: _this.formItem.name,
            picUrl: _this.formItem.picUrl,
            templateContent: JSON.stringify(parseArr)
          },
          mold: "modal",
          callback(res) {
            if (res.status == 200) {
              _this.$Message.success(
                _this.$route.query.id ? "修改成功!" : "添加成功!"
              );
              // _this.modal = false;
              _this.$router.push("/templateMgt");
            } else {
              if (res.message == "业务异常:模板名称已存在") {
                //名字重复了
                $("#content").animate(
                  {
                    scrollTop: 0
                  },
                  300
                );
                this.$Message.warning("模板名称已存在，请重新填写");
                this.$refs.custompageTemplate.headShow = true;
                this.$refs.custompageTemplate.editIndex = null;
              } else {
                this.$Message.warning(res.message ? res.message : "保存出错!");
              }
            }
          }
        });
      } else {
        this.$Message.warning(
          "当前基础模板为兼容新老版本，产品分组数量不能小于3"
        );
      }
    },
    cancel() {
      this.modal = false;
    }
  }
};
</script>
<style lang="scss">
.template-custompage {
  .handel-box {
    position: fixed;
    z-index: 99;
    bottom: 0px;
    text-align: center;
    // background: #ffffff;
    padding-bottom: 7px;
  }
}

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
