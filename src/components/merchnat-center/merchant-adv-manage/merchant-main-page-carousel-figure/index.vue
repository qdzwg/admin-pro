<template>
  <div>
    <page-template :search-items='searchItems'
                   :columns="columns"
                   pageFlag
                   :url="url"
                   ref="pageWrap">
      <Row v-if="pageBtnParams.length"
           slot="topbtn"
           slot-scope="slotProps">
        <Button class="page-btn"
                :type="item.type"
                :icon="item.icon"
                v-for="(item,index) in pageBtnParams"
                @click="actionBtns(index,slotProps.selectedList)"
                :key="index">{{item.name}}</Button>
      </Row>
    </page-template>
    <!-- 弹出层 -->
    <the-modal width="800" v-model="modal"
               :title="modalTitle"
               @ok="ok"
               @cancel="cancel">
      <Form :model="formItem"
            label-position="right"
            :label-width="100"
            ref="formValidate"
            :rules="ruleForm">
        <FormItem label="类型："
                  prop="adType">
          <Select v-model="formItem.adType"
                  placeholder="请选择类型"
                  style="width:200px">
            <Option v-for="item in typeList"
                    :value="item.value"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="编码："
                  v-if="formItem.code">
          <Input v-model="formItem.code"
                 placeholder="填写编码"
                 type="text"
                 disabled></Input>
        </FormItem>
        <FormItem label="标题：">
          <Input v-model="formItem.title"
                 placeholder="填写标题"></Input>
        </FormItem>
        <FormItem label="图片：">
          <up-img :limitNum="1"
                  v-model="formItem.picAddr"></up-img>
          <p>仅支持jpg、png两种格式,大小不超过640*310像素</p>
        </FormItem>
        <FormItem label="链接：">
          <Input v-model="formItem.picLink"
                 placeholder="填写链接"></Input>
        </FormItem>
        </FormItem>
        <FormItem label="排序：">
          <InputNumber v-model="formItem.sortList"
                       :min="0"></InputNumber>
        </FormItem>
      </Form>
    </the-modal>
    <!-- 弹出层 - 明细 -->
    <Modal width="800"
           v-model="detailmodal"
           title="明细">
      <Form :model="formDetailItem"
            label-position="right"
            :label-width="100"
            ref="formItem">
        <FormItem label="编码："
                  prop="roleName">
          {{formDetailItem.code}}
        </FormItem>
        <FormItem label="标题：">
          {{formDetailItem.title}}
        </FormItem>
        <FormItem label="图片：">
           <up-img  v-model="formDetailItem.picAddr" :editFlag="false"></up-img>
        </FormItem>
        <FormItem label="链接：">
          {{formDetailItem.picAddr}}
        </FormItem>
        <FormItem label="类型：">
          <!-- $flType(formDetailItem.adType,typeList) -->
          {{$flType(formDetailItem.adType,typeList)}}
        </FormItem>
        <FormItem label="排序：">
          {{formDetailItem.sortList}}
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
const TypeList = [
  {
    value: 'main_page_top',
    label: '首页顶部轮播'
  },
  {
    value: 'person_center_bg',
    label: '个人中心背景'
  },
  {
    value: 'pay_page_ad',
    label: '支付成功页广告'
  },
  {
    value: 'main_page_fix',
    label: '首页顶部横条'
  }
]
export default {
  data () {
    return {
      typeList: TypeList,
      searchItems: [
        {
          label: "编码",
          type: "input",
          name: "code"
        },
        {
          label: "地址",
          type: "input",
          name: "picAddr"
        },
        {
          label: '请选择类型',
          type: 'select',
          name: 'adType',
          data: TypeList
        }
      ],
      columns: [
        {
          title: "编码",
          key: "code"
        },
        {
          title: "标题",
          key: "title"
        },
        {
          title: "地址",
          key: "picAddr"
        },
        {
          title: "类型",
          key: "adType",
          render: (h, params) => {
            let { adType } = params.row;
            return h("span", this.$flType(adType, this.typeList));
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            let { code, title, picAddr, adType, sortList, picLink, id } = params.row
            const actions = [
              {
                title: "明细",
                action: () => {
                  this.detailmodal = true;
                  this.formDetailItem.code = code;
                  this.formDetailItem.title = title;
                  this.formDetailItem.picAddr = picAddr;
                  this.formDetailItem.adType = adType;
                  this.formDetailItem.sortList = sortList;
                }
              },
              {
                title: "修改",
                action: () => {
                  this.modal = true;
                  this.modalTitle = "修改"
                  this.formItem.picAddr = picAddr
                  this.formItem.title = title;
                  this.formItem.code = code;
                  this.formItem.adType = adType;
                  this.formItem.picLink = picLink;
                  this.formItem.sortList = sortList;
                  this.formItem._method = 'put'
                  this.id = id
                }
              },
              {
                title: "删除",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: `/merchant/merchantAdvManage/del`,
                    param: {
                      id
                    },
                    content: '删除后将影响已有订单退票、核销，请谨慎操作'
                  })
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      pageBtnParams: [
        {
          btnType: 'router',
          link: '',
          icon: 'android-add',
          type: 'primary',
          name: '添加'
        }
      ],

      id: "",
      formDetailItem: {},
      detailmodal: false,
      url: "/merchant/merchantAdvManage/grid",
      modal: false,
      modalTitle: "新增",
      formItem: {
      },
      ruleForm: {
        adType: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ]
      }
    };
  },
  created () {

  },
  mounted () {
  },
  // searchForm, gridTable, confirm, 
  components: {},
  methods: {
    ok (val) {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let url =
            this.modalTitle.includes('新增')
              ? "/merchant/merchantAdvManage/doSave"
              : `/merchant/merchantAdvManage/doEdit/${this.id}`
          this.$refs.pageWrap.request({ url, param: this.formItem }).then(res => {
            if (res.success) {
              this.modal = false
            }
          })
        }
      })

    },
    cancel (val) {
      this.modal = false
    },
    /**
     * 操作表格全局按钮
     * @param {number} index 全局按钮索引
     * @param {object} selectedList 已选择表格数据
     */
    actionBtns (index, selectedList) {
      this.modal = true;
      this.modalTitle = "新增"
      this.formItem = {
        picAddr: '',
        title: '',
        code: '',
        adType: '',
        picLink: '',
        sortList: 0,
      }
    },
  }
};
</script>
<style lang="scss" scope>
.wapImg {
  width: 450px;
}
</style>

