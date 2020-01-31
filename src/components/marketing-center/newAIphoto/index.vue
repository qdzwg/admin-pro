<template>
    <div class="newAIphoto">
        <Form :model="formItem" :label-width="120" label-position="right" ref="formItem" :rules="ruleForm">
            <FormItem label="地标选择：" required>
                <Button type="primary" @click="attractions">选择</Button>
            </FormItem>

            <FormItem label="地标名称：" prop="productName">
                <Input v-model="formItem.productName" style="width:50%" :maxlength="20"></Input>
            </FormItem>

            <FormItem label="地标介绍：" prop="productContent">
                <Input type="textarea" v-model="formItem.productContent" style="width:50%" :maxlength="500"></Input>
            </FormItem>

            <FormItem label="地标用户引导图：" prop="guidePic">
                <Input v-model="formItem.guidePic" style="display:none;"></Input>
                <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
            </FormItem>

            <FormItem label="地标图像识别：">
                <my-img :limitNum="200" :uploadList="wapImgList" @getImgUrl="setWapListUrl"></my-img>
                <p style="color:red">建议素材尺寸为737*847的竖图</p>
            </FormItem>
            <FormItem label="添加优惠券：">
                <div style="height:32px;" class="travellSubject">
                    <div class="subject-list">
                        <!-- <div v-for='(item,index) in tagNameList' :key='index' class="subject-list-item" >
                            <Icon @click="subjectItemDel(index)" class="subject-list-item-del" type="close-circled"></Icon>
                            <Button>{{item.couponName}}
                            </Button>
                        </div> -->
                        <div v-for='(item,index) in tagNameList' :key='index' class="subject-list-item">
                            <Icon @click="subjectItemDel(index)" class="subject-list-item-del" type="close-circled"></Icon>
                            <Button>{{item.name?item.name:item.couponName}}
                            </Button>
                        </div>

                        <Button type="primary" @click="getCoupon">选择优惠券</Button>

                    </div>

                </div>

            </FormItem>
            <FormItem label="地标音频文件上传：">
                <my-video :limitNum="1" :uploadList="upAudio" @getImgUrl="setAudio"></my-video>
                <p style="color:red">只支持mp3格式 ，建议上传小于10M;</p>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="submit" :loading="loading">提交</Button>
                <Button @click="test">取消</Button>
            </FormItem>
        </Form>
        <Modal v-model="couponModal" title="选择优惠券" width=700>
            <div style="margin-bottom:10px">
                <Input placeholder="请输入优惠券名称" v-model='keyword' style="width: 200px;display:inline-block;"></Input>
                <Input placeholder="请输入优惠券编码" v-model='keycode' style="width: 200px;display:inline-block;"></Input>
                <Button @click="selectHotel" type="primary">搜索</Button>
            </div>
            <div>
                <Table height='350' @on-selection-change='selectionChange' :loading='tableLoading' border :columns="columns7" :data="data6"></Table>
            </div>
            <div style="margin-top:10px">
                <Page :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change='pageSizeChange' size="small" show-elevator show-sizer></Page>
            </div>
            <div slot='footer'>
                <Button type="primary" @click="ok">添加</Button>
                <Button @click='cancel'>取消</Button>
            </div>
        </Modal>
        <Modal v-model="attrShow" width=800 title="地标选择">
            <div style="margin-bottom:20px;">
                <Input v-model="attrName" style="width:33%" placeholder="请输入景区名称"></Input>
                <Button type="primary" @click="searchAttr">搜索</Button>
            </div>
            <Table no-data-text="" border ref="gridTable" :columns="columns" :data="data"></Table>
            <Page :total="total2" :current="params.currPage" :page-size="params.pageSize" class-name="pages" @on-change="changepage2" show-elevator></Page>

            <div slot="footer"></div>
        </Modal>
        <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    </div>
</template>

<script>
import { apiGet, apiPost } from "@/fetch/api";
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import myImg from "@/components/global/singleImg";
import confirm from "@/components/global/confirm";
import myVideo from "@/components/global/video";
export default {
  components: {
    myImg,
    confirm,
    searchForm,
    gridTable,
    myVideo
  },
  data() {
    return {
      mode: "",
      content: "",
      sucessMsg: "",
      attrShow: false,
      singleImgList: [],
      wapImgList: [],
      searchForm: {
        name: "",
        enabled: "",
        currPage: 1,
        pageSize: 10
      },
      formItem: {
        productName: "",
        productContent: "",
        guidePic: "",
        merchantInfoId: "",
        status: "F",
        id: "",
        productId: "",
        materialPics: "",
        couponCodes: "",
        voice: ""
      },
      ruleForm: {
        productName: [
          { required: true, message: "请填写地标名称", trigger: "blur" }
        ],
        productContent: [
          { required: true, message: "请填写地标介绍", trigger: "blur" }
        ],
        guidePic: [
          { required: true, message: "请选择地标用户引导图", trigger: "blur" }
        ]
      },
      columns: [
        {
          title: "序号",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "地标名称",
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
                  this.formItem.productId = params.row.id;
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
      data: [],
      couponModal: false,
      tableSelecttion: [],
      tagNameList: [],
      serviceModal: false,
      tableLoading: false,
      keyword: "",
      keycode: "",
      page: 1,
      pageSize: 10,
      total: 0,
      columns7: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          key: "name",
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "优惠券名称",
          key: "name"
        },
        {
          title: "优惠券编码",
          key: "code"
        }
      ],
      data6: [],
      social: [],
      upAudio: [],
      loading: false,
      seletedList: [],
    };
  },
  created() {
    if (this.$route.query.id) {
      apiGet(
        "/marketing/api/pat/getProductById?id=" + this.$route.query.id
      ).then(res => {
        if (res.status == 200) {
          this.singleImgList=res.data.guidePic?res.data.guidePic.split(','):[];
          this.wapImgList = res.data.materialPics;
          this.upAudio=res.data.voice?res.data.voice.split(','):[]
          this.tagNameList =
            res.data && res.data.patCouponDtos ? res.data.patCouponDtos : [];

          this.formItem = res.data;
        } else {
          this.$Message.warning(res.message);
        }
      });
    }
  },
  watch: {
    social: function(val) {
      if (val.length != 10) {
        //没有全选
        this.active = false;
      } else {
        this.active = true;
      }
    }
  },
  methods: {
    setAudio(audio) {
      this.formItem.voice = audio[0];
      //   console.log(audio);
    },
    changePage(page) {
      this.page = page;
      this.selectHotel();
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectHotel();
    },
    //选择景区
    selectHotel() {
      this.tableLoading = true;
      apiPost("/marketing/api/pat/patSelectCouponPage", {
        currPage: this.page,
        pageSize: this.pageSize,
        couponName: this.keyword,
        couponCode: this.keycode,
        patId: this.$route.query.id ? this.$route.query.id : ""
      }).then(res => {
        if (res.status == 200) {
          let _this = this;
          this.tableLoading = false;
          // res.data.rows = res.data.rows.filter(ele => {
          //   return !_this.tagNameList.some(item => {
          //     return ele.id == item.id;
          //   });
          // });
          this.social = this.tagNameList.map(function(item, index) {
            return item.id;
          });
          this.data6 = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    selectionChange(selection) {
      this.tableSelecttion = selection;
    },
    cancel() {
      this.couponModal = false;
      this.keyword = "";
      this.keycode = "";
      this.page = 1;
    },
    ok() {
      // 弹框确定
      //和已存在的景区对比，获取未存在的景区
      let _this = this;
      // 重复的
      this.seletedList = this.tableSelecttion.filter(function(item, index) {
        return _this.tagNameList.find(function(it, i) {
          return item.code == it.couponCode;
        });
      });
      //不重复的
      this.tableSelecttion = this.tableSelecttion.filter(function(item, index) {
        return !_this.tagNameList.find(function(it, i) {
          return item.code == it.couponCode;
        });
      });
      if (
        this.tagNameList &&
        this.tableSelecttion &&
        this.tableSelecttion.length + this.tagNameList.length > 5
      ) {
        this.$Message.warning(
          "最多选择5张优惠券，已选" +
            this.tagNameList.length +
            "张优惠券,至多还能选择" +
            (5 - this.tagNameList.length) +
            "张优惠券"
        );
      } else {
        this.tagNameList = this.tagNameList.concat(this.tableSelecttion);
        // console.log(this.tagNameList)
        this.couponModal = false;
      }
      this.keyword = "";
      this.keycode = "";
      this.page = 1;
    },
    getCoupon() {
      this.couponModal = true;
      this.selectHotel();
    },
    subjectItemDel(index) {
      this.tagNameList.splice(index, 1);
      if (this.tagNameList) {
        let data = [];
        this.tagNameList.map((item, index) => {
          data.push(item.code);
        });
        this.formItem.couponCodes = data.join(",");
      }
    },
    searchAttr() {
      apiPost("/product/api/park/zybParkList", {
        currPage: this.params.currPage,
        pageSize: this.params.pageSize,
        name: this.attrName
      }).then(res => {
        if (res.status == 200) {
          this.total2 = res.total;
          this.data = res.data.rows;
        }
      });
    },
    setWapUrl(imgArr) {
      this.formItem.guidePic = imgArr[0];
    },
    setWapListUrl(imgArr) {
      if (imgArr.length > 200) {
        this.formItem.materialPics = imgArr.slice(0, 200).join(",");
      } else {
        this.formItem.materialPics = imgArr.join(",");
      }
    },
    test() {
      this.$router.back();
    },
    // 景点选择
    attractions() {
      this.attrShow = true;
    },
    submit() {
      let _this = this;
      this.formItem.id = this.$route.query.id ? this.$route.query.id : "";

      if (this.tagNameList) {
        let data = [];
        this.tagNameList.map((item, index) => {
          data.push(item.couponCode);
          data.push(item.code);
        });
        this.formItem.couponCodes = data.join(",");
      }

      delete this.formItem.patCouponDtos;
      this.loading = true;
      let url = "/marketing/api/pat/saveProduct";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "page",
        callback(res) {
          if (res.status == 200) {
            _this.loading = false;
            _this.$Message.success("操作成功");
            _this.$router.back();
          } else {
            _this.$Message.warning(res.message);
          }
        }
      });
    },
    changepage2(num) {
      this.params.currPage = num;
      this.searchAttr();
    }
  }
};
</script>


<style lang="scss">
.newAIphoto {
  .travellSubject {
    // border: 1px solid red;
    .subject-list {
      width: 800px;
      float: left;
      margin-right: 10px;
      word-wrap: break-word;
      word-break: normal;
      .subject-list-item {
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 10px;
        position: relative;
        .subject-list-item-del {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 14px;
          cursor: pointer;
        }
        .icon-map {
          margin: 0 10px;
          font-size: 16px;
          cursor: pointer;
        }
        .icon-map2 {
          margin: 0 10px;
          font-size: 16px;
          color: #fff;
        }
      }

      .subject-list-item:hover {
        .subject-list-item-del {
          display: inline-block;
        }
      }
    }
    .subject-input {
      width: 80px;
      height: 32px;
      font-size: 16px;
      border: 1px solid #dddee1;
      border-radius: 4px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      display: inline-block;
      //   float: left;
    }
  }
}
</style>


