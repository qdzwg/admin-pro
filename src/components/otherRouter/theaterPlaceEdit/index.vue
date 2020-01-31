<template>
  <div class="place-edit-warper">
    <Form
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div id="base" class="form-title">基本信息</div>
      <FormItem label="场所名称：" prop="name">
        <Input v-model="formItem.name" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="场所编码：" prop="code">
        <Input disabled v-model="formItem.code" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="场所地址：" prop="addr">
        <Input v-model="formItem.addr" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="联系电话：" prop="linkTel">
        <Input v-model="formItem.linkTel" style="width:33%" :maxlength="64"></Input>
      </FormItem>
      <FormItem label="场所状态：" prop="enabled">
        <Select v-model="formItem.enabled" style="width:200px">
          <Option value="T">上架</Option>
          <Option value="F">下架</Option>
        </Select>
      </FormItem>
      <FormItem label="座位分布图：" prop="locationImg">
        <!-- <Input v-model="formItem.imgUrl" style="display:none"></Input> -->
        <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="备注：" prop="remark">
        <Input
          v-model="formItem.remark"
          style="width:33%"
          type="textarea"
          :rows="4"
          placeholder="备注"
        ></Input>
      </FormItem>
      <FormItem>
        <div class="save-cancel">
          <Button type="primary" :loading="btnLoading" @click="submit">保存</Button>
          <Button type="ghost" style="margin-left: 8px" @click="back">取消</Button>
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>
// import ueditor from "@/components/global/ueditor";
import store from "@/store";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import myImg from "@/components/global/singleImg";
import selectItem from "@/components/global/selectList";
export default {
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      mainUserId:'',
      btnLoading: false,
      singleImgList: [],
      // wapImgList: [],
      formItem: {
        mainUserId:'',
        id: "",
        name: "",
        code: "",
        addr: "",
        linkTel: "",
        enabled: "",
        locationImg: "",
        remark: ""
      },
      ruleComplteForm: {
        name: [{ required: true, message: "请填写场所名称", trigger: "blur" }],
        enabled: [
          { required: true, message: "请选择场所状态", trigger: "change" }
        ],
        locationImg: [{ required: true, message: "请上传座位分布图" }],
        linkTel: [
          {
            pattern: /(^1([0-9]{10})$)|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/,
            message: "格式不正确"
          }
        ]
      }
    };
  },
  computed: {},
  created() {
    // this.gethotelBrand(); //查询酒店品牌
    // this.getSysparam();
  },
  mounted() {
    // console.log(this.$route.query.id)
    apiGet("/admin/userStore/detail").then(resdata => {
      if(resdata.status==200||resdata.success){
        this.mainUserId = resdata.user.mainUserInfoId
        if (this.$route.query.id) {
      apiGet(
        "/product/api/newTheaterPlace/queryTheaterPlace?id=" + this.$route.query.id + '&mainUserId=' + this.mainUserId
      ).then(res => {
        // console.log(res)
        let data = res.data;
        this.formItem.mainUserId = this.mainUserId ?this.mainUserId :'';
        this.formItem.id = this.$route.query.id;
        this.formItem.name = data.name ? data.name : "";
        this.formItem.code = data.code ? data.code : "";
        this.formItem.addr = data.addr ? data.addr : "";
        this.formItem.linkTel = data.linkTel ? data.linkTel : "";
        this.formItem.enabled = data.enabled ? data.enabled : "";
        this.formItem.locationImg = data.locationImg ? data.locationImg : "";
        if (data.locationImg) {
          this.singleImgList = [data.locationImg];
        }

        this.formItem.remark = data.remark ? data.remark : "";
        // this.formItem = res.data;
      });
    }
      }
    });
    
    //this.getSysparam()            //获取下拉框内容
    // this.$refs.hotelName.focus()
  },
  methods: {
    back() {
      this.$router.back();
    },
    //初始化发布页面
    setWapUrl(imgArr) {
      this.formItem.locationImg = imgArr.join(",");
      this.$refs.formItem.validateField("locationImg");
    },
    submit() {
      this.btnLoading = true;
      let _this = this;
      let url = "/product/api/newTheaterPlace/editTheaterPlaceSave";
      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            _this.$router.back()
            this.btnLoading = false;
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          this.btnLoading = false;
        }
      });
    }
  },
  components: {
    // ueditor,
    myImg,
    selectItem
  }
};
</script>
<style scope lang="scss">
.place-edit-warper {
  width: 100%;
  .step {
    width: 60%;
    margin: 2.5rem auto;
  }
  .form-title {
    background: #dedbdb;
    padding: 5px;
    border-left: 4px solid rgba(100, 182, 255, 1);
    font-size: 16px;
    margin-bottom: 10px;
  }
  .page-title {
    margin-bottom: 15px;
  }
  .ivu-date-picker .ivu-select-dropdown {
    z-index: 1000;
  }

  .edui-default .edui-editor {
    z-index: 666 !important;
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
        }
        th:first-child {
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
        }
        td:first-child {
          // text-align: center
        }
      }
    }
  }
  .senicInfo {
    margin-top: 10px;
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid rgba(35, 192, 250, 1);
    .address {
      color: #999;
    }
  }
  .fixed-box {
    position: fixed;
    top: 40%;
    right: 24px;
    background: #ffffff;
    z-index: 1000;
    ul {
      list-style: none;
      li {
        text-align: center;
        width: 100px;
        button {
          width: 100%;
        }
        a {
          display: block;
          color: #000;
          padding: 3px 7px;
          text-decoration: none;
          border-bottom: 1px solid #e2d5d5;
        }
        a.active {
          color: #2d8cf0;
        }
      }
      li:first-child a {
        color: #ffffff;
        background: #0099ff;
      }
    }
    .btn-primary-outline {
      color: #5a98de;
      background-color: transparent;
      background-image: none;
      border-color: #5a98de;
    }
  }
}
.money-unit {
  margin-left: 8px;
}
.save-cancel {
  padding-bottom: 50px;
}
</style>





