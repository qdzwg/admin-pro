<template>
  <div class="linkUrl">
    <!-- {{show}} -->
    <!-- asdasda
    {{itemData}}-->
    <!-- {{show}} -->
    <!-- {{itemData}} -->
    <Select
      size="small"
      :class="{'error':!itemData.linkUrl&&errorShow&&show}"
      v-if="(itemData.linkUrl!='customlink'||!itemData.customLinkurl)&&(itemData.linkUrl!='custompage'||!itemData.customPageId)&&(itemData.linkUrl!='information'||!itemData.columnId)&&(itemData.linkUrl!='customtel'||!itemData.customTel)&&itemData.linkUrl != 'strategy'"
      placeholder="设置链接页面"
      @on-change="change"
      v-model="itemData.linkUrl"
    >
      <Option v-for="item in linkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <template v-else>
      <!-- 攻略分组 -->
      <template v-if="itemData.linkUrl=='strategy'">
        <div @click="strageShow=true" class="customlink">
          <template v-if="itemData.strategyArr&&itemData.strategyArr.length">
            <div class="custom-link-text">
              已选攻略:
              <span v-for="(item,index) in itemData.strategyArr" :key="index">{{item.value}}</span>
            </div>
            <Icon @click.stop="strategyDel" type="ios-close customlink-del"></Icon>
          </template>
          <div v-else class="custom-link-text">请选择攻略分组</div>
        </div>
      </template>
      <template v-if="itemData.linkUrl=='customlink'">
        <div @click="showModal" class="customlink">
          <div class="custom-link-text">自定义地址:{{itemData.customLinkurl}}</div>
          <Icon @click.stop="customlinkDel" type="ios-close customlink-del"></Icon>
        </div>
      </template>
      <template v-if="itemData.linkUrl=='custompage'">
        <div @click="showModal2" class="customlink">
          <div class="custom-link-text">自定义页面:{{itemData.customPageName}}</div>
          <Icon @click.stop="customPageDel" type="ios-close customlink-del"></Icon>
        </div>
      </template>
      <template v-if="itemData.linkUrl=='customtel'">
        <div @click="showModal3" class="customlink">
          <div class="custom-link-text">自定义电话:{{itemData.customTel}}</div>
          <Icon @click.stop="telDel" type="ios-close customlink-del"></Icon>
        </div>
      </template>
      <template v-if="itemData.linkUrl=='information'">
        <div @click="showModal0" class="customlink">
          <div class="custom-link-text">
            资讯链接:
            {{colName}}
          </div>
          <Icon @click.stop="colSelectDel" type="ios-close customlink-del"></Icon>
        </div>
      </template>
    </template>
    <Modal v-model="modal1" title="自定义链接" :mask-closable="false" :closable="false">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <FormItem label="链接地址：" prop="custompageLinkUrl">
          <Input @on-enter="ok" v-model="formValidate.custompageLinkUrl" placeholder="请输入地址"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="ok" type="primary">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal3" title="自定义电话" :mask-closable="false" :closable="false">
      <Form
        ref="formValidateTel"
        :model="formValidateTel"
        :rules="ruleValidateTel"
        :label-width="110"
      >
        <FormItem label="电话号码：" prop="tel">
          <Input @on-enter="telOk" v-model="formValidateTel.tel" placeholder="请输入电话号码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="telOk" type="primary">确定</Button>
        <Button @click="telCancel">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" title="自定义页选择" width="1000" @on-cancel="cancel">
      <Form ref="formInline" inline>
        <FormItem>
          <Input v-model="pageName" placeholder="页面名称"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList">搜索</Button>
        </FormItem>
      </Form>
      <Table border size="small" :columns="columns7" :data="data6"></Table>
      <Page @on-change="pageChange" style="margin-top:10px" :total="total" show-elevator></Page>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="modal0" title="资讯栏目选择" width="400" @on-cancel="colDel">
      <Cascader :data="data11" @on-change='cascaderSelect' change-on-select v-model="itemData.columnId"></Cascader>
      <div slot="footer">
        <Button @click="colOk" type="primary">确定</Button>
        <Button @click="colDel">取消</Button>
      </div>
    </Modal>
    <strage-modal
      :arr="itemData.strategyArr"
      @modalCancel="modalCancel1"
      @getStrategy="getStrategyArr"
      v-model="strageShow"
    ></strage-modal>
  </div>
</template>
<script>
import { apiPost, apiGet } from "@/fetch/api";
import { mapState } from "vuex";
import strageModal from "./module/strateModal";
import { linkList } from "@/common/data";
export default {
  components: {
    strageModal
  },
  props: {
    itemData: {
      type: Object
    },
    show: {
      //默认是不验证的，在vux配置errorShow，并且父组件中prop中设置了show为true时候才显示错误提示
      type: Boolean,
      default: false
    }
  },
  watch:{
    completedColId(val){
      this.setColName()
    }
  },
  computed: {
    ...mapState({
      errorShow: state => {
        return state.defined.errorShow;
      }
    }),
    completedColId(){
      return this.itemData.columnId
    }
  },
  data() {
    return {
      strageShow: false,
      linkList: linkList,
      columns7: [
        {
          title: "页面名称",
          key: "renovationPageName"
        },
        {
          title: "更新时间",
          key: "modifyTime"
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
                      this.itemData.customPageId = params.row.id;
                      this.itemData.customPageName =
                        params.row.renovationPageName;
                      this.modal2 = false;
                    }
                  }
                },
                "选择"
              )
            ]);
          }
        }
      ],
      data6: [],
      modal0: false,
      data11: [],
      colName: '',
      treeList: [],
      modal2: false,
      modal3: false,
      formValidate: {
        custompageLinkUrl: ""
      },
      formValidateTel: {
        tel: ""
      },
      ruleValidate: {
        custompageLinkUrl: [
          {
            required: true,
            message: "请输入自定义链接",
            trigger: "blur"
          }
        ]
      },
      ruleValidateTel: {
        tel: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur"
          },
          {
            pattern: /(^1([0-9]{10})$)|(^0[0-9]{2,3}-[0-9]{7,8}$)|(^400[0-9]{7}$)/,
            message: "格式不正确"
          }
        ]
      },
      modal1: false,
      selectIndex: null,
      page: 1,
      limit: 10,
      pageName: "",
      total: 0
    };
  },
  created() {
    
  },
  methods: {
    modalCancel1() {
      //老数据兼容，老自定义链接没有strategyArr字段
      if (this.itemData.strategyArr) {
        //新数据
        if (this.itemData.strategyArr.length == 0) {
          this.strategyDel();
        }
      } else {
        //新数据
        this.strategyDel();
      }
    },
    getStrategyArr(arr) {
      this.itemData.strategyArr = arr;
    },
    pageChange(page) {
      this.page = page;
      this.getList();
    },
    getList() {
      apiPost("/merchant/webApi/merchantRenovationTob/selectCustomPage", {
        page: this.page,
        limit: this.limit,
        pageName: this.pageName
      }).then(res => {
        this.data6 = res.data.rows;
        this.total = res.data.total;
      });
    },
    customPageDel(index) {
      this.itemData.customPageId = "";
      this.itemData.linkUrl = "";
      this.itemData.customPageName = "";
    },
    telDel() {
      this.itemData.customTel = "";
      this.itemData.linkUrl = "";
    },
    strategyDel() {
      this.itemData.linkUrl = "";
      this.itemData.strategyArr = [];
    },
    customlinkDel(index) {
      this.itemData.customLinkurl = "";
      // this.itemData.customLinkurlType = "http";
      this.itemData.linkUrl = "";
    },
    showModal(index) {
      this.modal1 = true;
      this.formValidate.custompageLinkUrl = this.itemData.customLinkurl;
    },
    showModal0() {
      this.modal0 = true;
      // this.getTree();
    },
    colSelectDel() {
      this.itemData.columnId = [];
      this.itemData.linkUrl = "";
    },
    setColName() {
      if (
        this.itemData.columnId &&
        Array.isArray(this.itemData.columnId) &&
        this.itemData.columnId.length&&this.treeList&&this.treeList.length
      ) {
        let item = this.treeList.find(
          item =>
            this.itemData.columnId[this.itemData.columnId.length - 1] == item.id
        );
        if (item) {
          this.colName = item.name
        } else {
          this.colName = ''
        }
      } else {
        this.colName = ''
      }
    },
    colOk() {
      if (this.itemData.columnId&&this.itemData.columnId.length) {
        this.modal0 = false;
      } else {
        this.$Message.warning("请选择栏目");
      }
    },
    colDel() {
      if(!(this.itemData.columnId&&this.itemData.columnId.length)){
        //没有选择对应栏目
        this.itemData.linkUrl = ''
      }
      this.modal0 = false;
    },
    getTree() {
      apiGet("/merchant/api/merchantFamilyInfo/listCmsInfoMenu").then(res => {
        console.log(res)
        if(res.status == 200) {
          this.modal0 = true;
          this.treeList = res.data;
          this.treeFormatter(res.data);
          if(this.itemData.columnId&&this.itemData.columnId.length){
            //初始化，节点名称
            this.setColName()
          }
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    treeFormatter(dataArr) {
      //遍历数组
      let arr = [];
      dataArr.forEach((item, index) => {
        //判断是否有parentid，有-子级，无-顶级
        if (item.pid) {
          //寻找父级
          testArr(arr, item);
        } else {
          //顶级
          arr.push({
            label: item.name,
            value: item.id
            // expand: true,
            // selected: item.id == preNodeSelectedId,
            // showStyle: item.showStyle
          });
        }
      });
      function testArr(arr, item) {
        for (let i = 0; i < arr.length; i++) {
          if (item.pid == arr[i].value) {
            if (!arr[i].children) {
              arr[i].children = [];
            }
            arr[i].children.push({
              label: item.name,
              value: item.id,
              parentId: item.pid
              // expand: true,
              // selected: item.id == preNodeSelectedId,
              // showStyle: item.showStyle
            });
            return;
          }
          if (arr[i].children && arr[i].children.length) {
            testArr(arr[i].children, item);
          }
        }
      }
      this.data11 = arr;
    },
    cascaderSelect(val){
      console.log(val)
    },
    showModal2(index) {
      this.modal2 = true;
      this.getList();
    },
    showModal3(index) {
      this.modal3 = true;
      this.formValidateTel.tel = this.itemData.customTel;
    },
    ok() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.itemData.customLinkurl = this.formValidate.custompageLinkUrl;
          this.modal1 = false;
        }
      });
    },
    telOk() {
      this.$refs.formValidateTel.validate(valid => {
        if (valid) {
          this.itemData.customTel = this.formValidateTel.tel;
          this.modal3 = false;
        }
      });
    },
    cancel() {
      if (this.formValidate.custompageLinkUrl) {
        // this.itemData.customLinkurl = this.formValidate.custompageLinkUrl;
        this.modal1 = false;
      } else {
        this.itemData.customLinkurl = "";
        this.itemData.linkUrl = "";
        this.modal1 = false;
      }
    },
    telCancel() {
      this.itemData.customTel = "";
      this.itemData.linkUrl = "";
      this.modal3 = false;
      // if (this.formValidateTel.tel) {
      //   this.modal3 = false;
      // } else {
      //   this.itemData.customTel = "";
      //   this.itemData.linkUrl = "";
      //   this.modal3 = false;
      // }
    },
    change(val) {
      if (val == "custompage") {
        //自定义页面
        this.modal2 = true;
        this.getList();
      } else if (val == "customlink") {
        //自定义链接
        this.modal1 = true;
        this.formValidate.custompageLinkUrl = "";
      } else if (val == "customtel") {
        //自定义电话
        this.modal3 = true;
        this.formValidateTel.tel = "";
      } else if (val == "strategy") {
        this.strageShow = true;
      } else if (val == "information") {
        //资讯
        this.getTree()
      }
    }
  }
};
</script>
<style lang="scss">
.linkUrl {
  .customlink {
    padding-left: 5px;
    background: #cbcbcb;
    width: 160px;
    height: 24px;
    line-height: 24px;
    position: relative;

    .custom-link-text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .customlink-del {
      position: absolute;
      font-size: 16px;
      color: #f05b47;
      padding: 5px;
      top: -12px;
      right: -10px;
      cursor: pointer;
    }
  }
}
</style>
