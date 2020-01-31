<template>
  <div>
    <Form ref="formInline"
          :model="searchForm"
          inline>
      <FormItem label="广告商名称："
                :label-width="100">
        <Input v-model="searchForm.advertiserName"
               placeholder="请输入广告商名称"></Input>
      </FormItem>
      <FormItem label="推广码："
                :label-width="100">
        <Input v-model="searchForm.spreadCode"
               placeholder="请输入推广码"></Input>
      </FormItem>
      <FormItem label="联系人："
                :label-width="100">
        <Input v-model="searchForm.contact"
               placeholder="请输入联系人"></Input>
      </FormItem>
      <FormItem label="联系人电话："
                :label-width="100">
        <Input v-model="searchForm.contactPhone"
               placeholder="请输入联系人电话"></Input>
      </FormItem>
      <Button class="btn_class"
              type="primary"
              icon="ios-search"
              @click="search">查询</Button>
      <Button class="btn_class"
              type="primary"
              icon="android-add"
              @click="toShowAdd(false)">新增广告商</Button>
    </Form>
    <list :columns="columns"
          :url="url"
          :params="params"></list>
    <confirm ref="confirmModel"
             mode="delete"
             :content="content"></confirm>

    <!-- 新增广告商弹框 -->
    <Modal v-model="addAndEditModal"
           @on-cancel="toCloseAdd"
           width="600"
           :mask-closable="false"
           :footer-hide="true"
           :title="isEdit?'修改广告商':'新增广告商'">
      <div style="height:20px"></div>
      <Form :model="addData"
            label-position="right"
            :label-width="150"
            :rules="ruleForm"
            ref="addOrEditForm">
        <FormItem label="广告商名称："
                  prop="advertiserName">
          <Input v-model="addData.advertiserName"
                 placeholder="填写广告商名称"
                 style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="推广码：">
          <div style="color:#D3D3D3"
               v-if="!isEdit">系统自动生成</div>
          <div v-if="isEdit">{{addData.spreadCode}}</div>
        </FormItem>
        <FormItem label="联系人：">
          <Input v-model="addData.contact"
                 placeholder="填写联系人"
                 style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="联系人电话：">
          <Input v-model="addData.contactPhone"
                 placeholder="填写联系人电话"
                 style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="地址：">
          <Input v-model="addData.address"
                 placeholder="填写地址"
                 style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="addData.remark"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="填写备注"
                 style="width: 300px;"></Input>
        </FormItem>
        <div style="text-align:center">
          <Button type="primary"
                  @click="toSaveOrEdit"
                  v-if="!isEdit">保存</Button>
          <Button type="primary"
                  @click="toSaveOrEdit"
                  v-if="isEdit">修改</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary"
                  @click="toCloseAdd">返回</Button>
        </div>
      </Form>
    </Modal>

    <!-- 生成推广链接弹框 -->
    <Modal v-model="proModal"
           @on-cancel="toCloseModal_bone"
           width="600"
           :footer-hide="true"
           title="生成推广链接">
      <div style="height:20px"></div>
      <Form :model="boneData"
            label-position="right"
            :label-width="150"
            :rules="ruleForm"
            ref="boneQrForm">
        <FormItem label="广告商名称：">
          <div>{{boneData.advertiserName}}</div>
        </FormItem>
        <FormItem label="推广码：">
          <div>{{boneData.spreadCode}}</div>
        </FormItem>
        <FormItem label="页面名称："
                  prop="pageName">
          <Input v-model="boneData.pageName"
                 placeholder="填写页面名称"
                 style="width: 300px;"></Input>
        </FormItem>
        <FormItem label="原页面地址："
                  prop="originalPageAddress">
          <Input v-model="boneData.originalPageAddress"
                 placeholder="填写原页面地址"
                 style="width: 300px;"></Input>
        </FormItem>
        <FormItem>
          <div>
            <Button type="primary"
                    @click="toBoneQr">生成推广码</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary"
                    @click="toCloseModal_bone">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
          </div>
        </FormItem>
        <div v-show="showBone">
          <FormItem label="推广地址：">
            <div>{{boneData.spreadAddress}}</div>
          </FormItem>
          <FormItem label="推广二维码：">
            <qrcode v-if="boneData.spreadAddress"
                    :value="boneData.spreadAddress"
                    :options="{ size: 140 }"></qrcode>
          </FormItem>
        </div>
      </Form>
    </Modal>

    <!-- 推广码弹框 -->
    <Modal v-model="qrListModal"
           @on-cancel="toCloseQrListModal_bone"
           width="900"
           :mask-closable="false"
           :footer-hide="true"
           title="推广码">
      <div style="height:20px"></div>
      <Table ref="protable"
             border
             :columns="qrColumns"
             :data="proData"></Table>
      <confirm ref="QrModel"
               mode="delete"
               :content="content"
               @okClick="isDone"></confirm>
    </Modal>
  </div>
</template>
<script>
import list from '@/components/global/list'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      statusList: [
        {
          value: 'T',
          label: '启用'
        },
        {
          value: 'F',
          label: '禁用'
        }
      ],
      searchForm: {
        advertiserName: '',
        spreadCode: '',
        contact: '',
        contactPhone: ''
      },

      addAndEditModal: false,
      isEdit: false,
      addData: {
        advertiserId: null,
        advertiserName: '',
        contact: '',
        contactPhone: '',
        address: '',
        remark: '',
        spreadCode: ''
      },

      proModal: false,
      showBone: false,
      boneData: {
        advertiserId: '',  // 广告商id
        spreadCode: '',  // 推广码
        advertiserName: '', // 广告商名称
        pageName: '',  // 页面名称
        originalPageAddress: '',  // 原页面地址
        spreadAddress: '' // 推广地址
      },
      ruleForm: {
        pageName: [
          { required: true, message: "页面名称不能为空", trigger: "blur" }
        ],
        originalPageAddress: [
          { required: true, message: "原页面地址不能为空", trigger: "blur" }
        ],
        advertiserName: [
          { required: true, message: "广告商名称不能为空", trigger: "blur" }
        ],
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        useFlag: [{ required: true, message: "请选择状态", trigger: "change" }]
      },

      qrListModal: false,

      content: '<div style="color:red">确定要删除吗?</div>',
      setPermissionModal: false,
      roleId: '',
      columns: [
	      /*{
	        type: 'selection',
	        width: 60,
	        align: 'center'
	      },*/
        {
          title: '广告商',
          key: 'advertiserName'
        },
        {
          title: '推广码',
          key: 'spreadCode'
        },
        {
          title: '联系人',
          key: 'contact'
        },
        {
          title: '联系人电话',
          key: 'contactPhone'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '生成推广链接',
                action: () => {
                  this.boneData.advertiserId = params.row.id;
                  this.boneData.spreadCode = params.row.spreadCode;
                  this.boneData.advertiserName = params.row.advertiserName;
                  this.toShowModal_bone();
                }
              },
              {
                title: '推广码',
                action: () => {
                  this.toShowQrListModal(params.row.id);
                }
              },
              {
                title: '修改',
                action: () => {
                  this.addData = {
                    advertiserId: params.row.id,
                    advertiserName: params.row.advertiserName,
                    spreadCode: params.row.spreadCode,
                    contact: params.row.contact,
                    contactPhone: params.row.contactPhone,
                    address: params.row.address,
                    remark: params.row.remark
                  };
                  this.toShowAdd(true);
                }
              },
              {
                title: '删除',
                action: () => {
                  this.$refs.confirmModel.confirm('/merchant/api/advertiser/delete', { params: { advertiserId: params.row.id } });
                }
              }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      proData: [],
      qrColumns: [
        {
          title: '广告商',
          key: 'advertiserName'
        },
        {
          title: '推广码',
          key: 'spreadCode'
        },
        {
          title: '页面名称',
          key: 'pageName'
        },
        {
          title: '原页面地址',
          key: 'originalPageAddress'
        },
        {
          title: '推广地址',
          key: 'spreadAddress'
        },
        {
          title: '链接二维码',
          render: (h, params) => {
            return h('qrcode', { attrs: { value: params.row.spreadAddress, options: { size: 80 } }, style: { marginTop: '10px', marginBottom: '5px' } });
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 80,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '删除',
                action: () => {
                  this.advertiserId_now = params.row.advertiserId;
                  this.$refs.QrModel.confirm('/merchant/api/spread/delete', { params: { spreadId: params.row.spreadId } });
                }
              }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      advertiserId_now: null,
      params: { accType: this.$cookies.get('accType') },
      url: '/merchant/api/advertiser/grid'
    }
  },
  components: { list, confirm },
  methods: {
    isDone () {
      console.log(this.advertiserId_now)
      this.toShowQrListModal(this.advertiserId_now);
    },
    toSaveOrEdit () {
      this.$refs.addOrEditForm.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            let json = {
              advertiserId: this.addData.advertiserId,
              advertiserName: this.addData.advertiserName.replace(/\s+/g, ''),
              spreadCode: this.addData.spreadCode
            };
            if (this.addData.contact.replace(/\s+/g, '') !== '') json.contact = this.addData.contact.replace(/\s+/g, '');
            if (this.addData.contactPhone.replace(/\s+/g, '') !== '') json.contactPhone = this.addData.contactPhone.replace(/\s+/g, '');
            if (this.addData.address.replace(/\s+/g, '') !== '') json.address = this.addData.address.replace(/\s+/g, '');
            if (this.addData.remark.replace(/\s+/g, '') !== '') json.remark = this.addData.remark.replace(/\s+/g, '');

            this.apiPost('/merchant/api/advertiser/edit', json).then(data => {
              if (data.status == 200) {
                this.$Message.success(data.message);
                this.$store.dispatch('postApi');
                this.toCloseAdd();
              } else {
                this.$Message.warning(data.message);
              };
            }).catch(err => {
              this.$Message.warning('修改失败!');
            });
          } else {
            let json = {
              advertiserName: this.addData.advertiserName.replace(/\s+/g, '')
            };
            if (this.addData.contact.replace(/\s+/g, '') !== '') json.contact = this.addData.contact.replace(/\s+/g, '');
            if (this.addData.contactPhone.replace(/\s+/g, '') !== '') json.contactPhone = this.addData.contactPhone.replace(/\s+/g, '');
            if (this.addData.address.replace(/\s+/g, '') !== '') json.address = this.addData.address.replace(/\s+/g, '');
            if (this.addData.remark.replace(/\s+/g, '') !== '') json.remark = this.addData.remark.replace(/\s+/g, '');

            this.apiPost('/merchant/api/advertiser/create', json).then(data => {
              if (data.status == 200) {
                this.$Message.success(data.message);
                this.$store.dispatch('postApi');
                this.toCloseAdd();
              } else {
                this.$Message.warning(data.message);
              };
            }).catch(err => {
              this.$Message.warning('添加失败!');
            });
          };
        }
      });
    },
    toShowAdd (bl) {
      if (bl) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      };
      this.addAndEditModal = true;
    },
    toCloseAdd () {
      this.addData = {
        advertiserId: null,
        advertiserName: '',
        spreadCode: '',
        contact: '',
        contactPhone: '',
        address: '',
        remark: ''
      };
      this.addAndEditModal = false;
    },
    toShowQrListModal (id) {
      this.apiPost('/merchant/api/spread/grid', { page: 1, limit: 10000, advertiserId: id }).then(data => {
        if (data.status == 200) {
          this.proData = data.data.rows;
          this.qrListModal = true;
        } else {
          this.$Message.warning(data.message);
        };
        this.advertiserId_now = null;
      }).catch(err => {
        this.$Message.warning('连接失败!');
        this.advertiserId_now = null;
      });
    },
    toCloseQrListModal_bone () {
      this.qrListModal = false;
    },
    toShowModal_bone () {
      this.proModal = true;
    },
    toCloseModal_bone () {
      this.boneData = {
        advertiserId: '',
        spreadCode: '',
        advertiserName: '',
        pageName: '',
        originalPageAddress: '',
        spreadAddress: ''
      };
      this.proModal = false;
      this.showBone = false;
    },
    toBoneQr () {
      this.$refs.boneQrForm.validate(async valid => {
        if (valid) {
          this.boneData.spreadAddress = this.boneData.originalPageAddress + `?spreadCode=${this.boneData.spreadCode}`;
          this.apiPost('/merchant/api/spread/create', this.boneData).then(data => {
            if (data.status == 200) {
              this.$Message.success(data.message);
              this.showBone = true;
            } else {
              this.$Message.waining(data.message);
            };
          }).catch(err => {
            this.$Message.waining('二维码生成失败!');
          });
        }
      });
    },
    search () {
      this.$store.state.list.params = Object.assign(this.$store.state.list.params, this.searchForm)
      this.$store.dispatch('postApi')
    },
  }
}
</script>

<style lang="scss" scoped>
.pro-main {
  width: 100%;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  flex-direction: row;
  // align-items : center;
  .pro-left {
    flex: 7;
  }
  .pro-center {
    flex: 1;
    text-align: center;
  }
  .pro-right {
    flex: 7;
  }
}
.btn_class {
  margin-bottom: 25px;
  margin-left: 15px;
}
</style>