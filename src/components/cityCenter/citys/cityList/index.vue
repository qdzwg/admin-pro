<template>
  <div>
    <Row :gutter="16" class="btn-groups">
      <Col span="3">
        <Button type="primary" icon="android-add" @click="addCity">新增</Button>
      </Col>
    </Row>
    <searchForm :search-items="searchItems"></searchForm>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

    <Modal v-model="cityAddModal" width="500" :title="addOrEdit=='add'?'城市新增':'城市修改'">
      <Form
        :model="cityForm"
        label-position="right"
        ref="cityForm"
        :rules="ruleCityForm"
        :label-width="130"
      >
        <FormItem label="城市名称:" required>
          <Input v-model="cityForm.cityName" type="text"></Input>         
        </FormItem>
        <FormItem label="状态:" required>
          <Select v-model="cityForm.useFlag" style="width:180px" placeholder="请选择景区名称">
              <Option v-for="(item, index) in useFlag" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center">
        <Button type="error" @click="submitCity('cityForm')">提交</Button>
        <Button type="ghost" @click="cityCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import QRcode from "@xkeshi/vue-qrcode";
export default {
  data() {
    return {
      cityId: '',
      cityAddModal: false,
      mode: "",
      content: "",
      sucessMsg: "",
      addOrEdit: '',
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "城市编码",
          key: "cityCode"
        },
        {
          title: "城市名称",
          key: "cityName"
        },
        {
          title: "状态",
          key: "useFlag",
          render: (h,params) => {
            return h('span',params.row.useFlag=='F'?'禁用':'启用')
          }
        },
        {
          title: "创建人",
          key: "createBy"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "更新人",
          key: "modifyBy"
        },
        {
          title: "更新时间",
          key: "modifyTime"
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: params.row.useFlag=='F'?'启用':'禁用',
                action: () => {                
                  this.mode = 'done'
                  this.sucessMsg = (params.row.useFlag=='F'?'启用':'禁用') + '成功！'
                  this.content = '确认' + (params.row.useFlag=='F'?'启用':'禁用') + '？'
                  this.$refs.confirmModel.confirm('/admin/api/cityInfo/enable?id=' + params.row.id + '&useFlag=' + (params.row.useFlag=='F'?'T':'F'))
                }
              },
              {
                title: '修改',
                action: () => {
                  this.editCity(params.row.id);
                }
              },              
              {
                title: "删除",
                action: () => {
                  this.del(params.row.id);
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      // mothods: 'get',
      data: "",
      params: { page: 1, limit: 10 },
      url: "/admin/api/cityInfo/grid",
      searchItems: [
        {
          label: "城市编码",
          type: "input",
          name: "cityCode"
        },
        {
          label: "城市名称",
          type: "input",
          name: "cityName"
        },
        {
          label: "状态",
          type: "select",
          name: "useFlag",
          data: [
            {
              value: "",
              label: "请选择"
            },
            {
              value: "T",
              label: "已启用"
            },
            {
              value: "F",
              label: "已禁用"
            }
          ]
        }
      ],
      useFlag: [
        {
          value: "T",
          label: "启用"
        }, {
          value: "F",
          label: "禁用"
        }
      ],
      codeUrl: "", // 二维码图片
      qrcodeUrl: "", // 生成二维码地址
      copyUrl: "", // 短链接
      copyLongUrl: "", // 长链接
      preLookModal: false, // 显示预览
      marketModal: false, // 显示全员营销
      marketTableModal: false, // 显示推广地址列表
      marketTableShow: false, // 是否替换已配置地址
      tableLoading: false, // 加载状态
      marketName: "",
      marketCode: "",
      blurGet: false, // 排序是否请求接口
      delMarketModal: false, // 取消绑定

      cityForm: {
        cityName: '',
        useFlag: ''
      },
      ruleMarketForm: {
        name: [{ required: true, message: "请填写全员推广地址" }]
      },
      ruleCityForm: {
        parkId: [{ required: true, message: "请输入景区名称", trigger: "blur" }]
      },
    };
  },
  components: { searchForm, gridTable, confirm, qrcode: QRcode },
  mounted() {},
  methods: {
    addCity() {
      this.cityAddModal = true;
      this.addOrEdit = 'add';
      this.cityForm = {
        cityName: '',
        useFlag: ''
      }
    },
    editCity(id) {
      this.cityAddModal = true;
      this.addOrEdit = 'edit';
      this.cityId = id;
      this.apiGet('/admin/api/cityInfo/edit',{id:id}).then(res => {
        this.cityForm.cityName = res.data.cityName;
        this.cityForm.useFlag = res.data.useFlag;
      });
    },
    submitCity() {
      let flag = true
      if (!this.cityForm.cityName || this.cityForm.cityName == '') {
        this.$Message.warning('请输入城市名称！');
        flag = false;
        return;
      }else if(!this.cityForm.useFlag || this.cityForm.useFlag==''){
        this.$Message.warning('请选择状态！');
        flag = false;
        return;
      }
      if(flag){
        if(this.addOrEdit == 'add'){
          this.apiGet('/admin/api/cityInfo/addSave', this.cityForm).then(res => {
            if(res.status == 200){
              this.$Message.success(res.message);
              this.$store.dispatch('postApi');
              this.cityAddModal = false;
            }else{
              this.$Message.warning(res.message);
            }
          })
        }else{
          let params = Object.assign(this.cityForm,{id: this.cityId})
          this.apiPost('/admin/api/cityInfo/editSave',params).then(res => {
            if(res.status == 200){
              this.$Message.success(res.message);
              this.$store.dispatch('postApi');
              this.cityAddModal = false;
            }else{
              this.$Message.warning(res.message);
            }
          })
        }
      }
    },
    cityCancel() {
      this.cityAddModal = false;
    },
    delAll() {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id;
      });
      if (arr.length > 0) {
        this.del(arr);
      } else {
        this.$Message.warning("请选择删除项");
      }
    },
    del(ids) {
      this.mode = "post";
      this.content = "确认删除吗?";
      this.sucessMsg = "删除成功!";
      this.$refs.confirmModel.confirm(
        "/admin/api/cityInfo/deleteCity?ids=" + ids
      );
    }
  }
};
</script>
