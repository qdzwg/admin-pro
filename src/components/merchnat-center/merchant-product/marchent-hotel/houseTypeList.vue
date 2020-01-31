<template>
  <div>
    <page-template :search-items='searchItems'
                   :columns="columns"
                   :params="params"
                   pageFlag
                   :url="url"
                   ref="pageWrap">
    </page-template>
    <!-- 弹出层 -->
    <the-modal v-model="modal"
               :title="modalTitle"
               width="900"
               @ok="ok"
               @cancel="cancel">
      <Form class="defaultHieght"
            :model="formItem"
            :label-width="100"
            ref="formItem"
            :rules="ruleForm">
        <FormItem label="所属酒店：">
          {{formItem.hotelName}}
        </FormItem>
        <FormItem label="房型名称：">
          {{formItem.modelName}}
        </FormItem>
        <FormItem label="库存模式：">
          <span style="color:blue">{{formItem.stockModel}}</span>
        </FormItem>

        <FormItem label="房型别名："
                  prop="nickName">
          <Input v-model="formItem.nickName"
                 placeholder="Enter something..."></Input>
        </FormItem>

        <FormItem label="房型说明：">
          <ueditor id="havetoKnow"
                   v-model="formItem.modelDetail"></ueditor>
        </FormItem>

        <FormItem label="WAP端主图：">
          <up-img :limitNum="1"
                  v-model="formItem.linkMobileImg"></up-img>
        </FormItem>
        <FormItem label="渠道：">
          <RadioGroup v-model="formItem.saleChannel">
            <Radio label="wap">
              <span>WAP</span>
            </Radio>
          </RadioGroup>
        </FormItem>

      </Form>
    </the-modal>
  </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
export default {
  data () {
    return {
      url: "/merchant/merchantHotelRoom/grid",
      params: {},
      searchItems: [
        {
          label: "票型名称",
          type: "input",
          name: "modelName"
        },
        {
          label: "状态",
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
        },
        {
          label: "来源",
          type: "select",
          name: "src",
          data: [
            {
              value: "prod",
              label: "自营"
            },
            {
              value: "dist_market",
              label: "分销"
            }
          ]
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
          title: "房型名称",
          key: "modelName"
        },
        {
          title: "房型产品编号",
          key: "modelCode"
        },
        {
          title: "来源",
          key: "prodFrom",
          render: (h, params) => {
            let prodFrom =
              params.row.prodFrom === "dist_market" ? "分销" : "自营";
            return h("span", prodFrom);
          }
        },
        {
          title: "上下架",
          key: "enabled",
          render: (h, params) => {
            let enabled = params.row.enabled === "T" ? "已上架" : "已下架";
            return h("span", enabled);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            let { id, hotelName, modelName, stockModel, nickName, modelDetail, saleChannel = 'wap', enabled, linkMobileImg } = params.row
            const actions = [
              {
                title: enabled === "T" ? "下架" : "上架",
                action: () => {
                  this.$refs.pageWrap.confirm({
                    url: 'merchant/merchantHotelRoom/enabled',
                    param: { id },
                    title: enabled === "T" ? "下架" : "上架",
                    content: enabled === "T" ? "确认下架吗?" : "确认上架吗？",
                    sucessMsg: enabled === "T" ? "下架成功！" : "上架成功！"
                  })
                }
              },
              {
                title: "完善信息",
                action: () => {
                  this.modal = true;
                  this.formItem = {
                    id, hotelName, modelName, stockModel, nickName, modelDetail, saleChannel, linkMobileImg
                  }
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      ruleForm: {
        nickName: [
          { required: true, message: "请输入房型别名", trigger: "blur" }
        ],
        linkMobileImg: [
          { required: true, message: "请选择图片", trigger: "blur" }
        ],
      },
      formItem: {},
      modalTitle: '',
      modal: false
    };
  },
  mounted () {
  },
  components: { ueditor },
  methods: {
    ok () {
      this.$refs.formItem.validate((valid) => {
        if (valid) {
          this.$refs.pageWrap.request({
            url: 'merchant/merchantHotelRoom/doUpdat',
            param: this.formItem
          }).then(res => {
            if (res && res.data) {
              this.modal = false
            } else {
              this.modal = true
            }
          })
        }
      })
    },
    cancel () {
      this.modal = false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.params.hotelId = to.params.id
    });
  },
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
.ivu-date-picker .ivu-select-dropdown {
  z-index: 1000;
}
.time-list {
  float: left;
}
.startToEnd {
  width: 30px;
  text-align: center;
}
.defaultHieght {
  height: 450px;
  overflow: auto;
}
</style>


