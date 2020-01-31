<template>
  <div class="mdsePlace">
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
     
      <Col span="2">
       <Button type="primary" icon="android-add" @click="showModal">添加</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="checkmark-round" @click="addUp">上架</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="close-round" @click="addDown">下架</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

     <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok" width="800" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm" style="width:80%;margin:0 auto">
        
        <FormItem label="自提点名称：" prop="name">
         <Input v-model="formItem.name"></Input>
        </FormItem> 
         <FormItem label="自提点地址：">
             <!-- 暂时这样处理吧？ -->
          <span v-if="formItem.areaAddr!=''"> {{formItem.areaAddr}}</span>
          <select-item v-else ref="select" :addrCode="formItem.areaAddr"  @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
        </FormItem> 
         <FormItem label="自提点详细地址：" prop="addr">
         <Input v-model="formItem.addr"></Input>
        </FormItem> 
         <FormItem label="地图坐标：">
         <Input v-model="formItem.latitudeLongitude" readonly style="width:80%"></Input>
         <Button type="primary" @click="getMap">获取坐标</Button>
        </FormItem> 
         <FormItem label="联系电话：" prop="linkTel">
         <Input v-model="formItem.linkTel"></Input>
        </FormItem> 
         <FormItem label="营业时间：">
              <Row>
                <Col span="11">
                    <FormItem prop="pickupBeginDate">
                         <TimePicker confirm v-model="formItem.pickupBeginDate" format="HH:mm" placeholder="请选择开始时间" ></TimePicker >
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center"> 至</Col>
                <Col span="11">
                    <FormItem prop="pickupEndDate">
                        <TimePicker confirm v-model="formItem.pickupEndDate" format="HH:mm" placeholder="请选择结束时间" ></TimePicker >
                    </FormItem>
                </Col>
            </Row>    
        </FormItem>    
         <FormItem label="状态：" prop="enabled">
            <Select v-model="formItem.enabled" style="width:200px">
                <Option  value="T" >已上架</Option>
                <Option  value="F" >已下架</Option>
            </Select>
        </FormItem> 
         <FormItem label="说明：">
         <Input type="textarea" v-model="formItem.summary"></Input>
        </FormItem>    
        </Form>   
    </Modal>
    <amap ref="mapModel" @getPoint="getPoint"></amap>
  </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import selectItem from "@/components/global/select";
import amap from "@/components/global/amap";
export default {
  data() {
    return {
      mode: "",
      content: "",
      sucessMsg: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "自提点名称",
          key: "name",
          align: "center",
          sortable: true
        },
        {
          title: "地址",
          key: "areaAddr",
          align: "center",
          sortable: true
        },
        {
          title: "详细地址",
          key: "addr",
          align: "center",
          sortable: true
        },
        {
          title: "联系电话",
          key: "linkTel",
          align: "center",
          sortable: true
        },

        {
          title: "是否上下架",
          key: "enabled",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("span", params.row.enabled == "T" ? "已上架" : "已下架");
          }
        },

        {
          title: "提货开始时间",
          key: "pickupBeginDate",
          align: "center",
          sortable: true
        },
        {
          title: "提货结束时间",
          key: "pickupEndDate",
          align: "center",
          sortable: true
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.modal = true;
                  this.type = "edit";
                  this.formItem.name = params.row.name;
                  this.formItem.areaAddr = params.row.areaAddr;
                  this.formItem.addr = params.row.addr;
                  this.formItem.latitudeLongitude =
                    params.row.latitudeLongitude;
                  this.formItem.linkTel = params.row.linkTel;
                  this.formItem.pickupBeginDate = params.row.pickupBeginDate;
                  this.formItem.pickupEndDate = params.row.pickupEndDate;
                  this.formItem.enabled = params.row.enabled;
                  this.formItem.summary = params.row.summary;
                  this.formItem.id = params.row.id;
                  this.modalTitle = "修改";
                }
              },
              {
                title: "删除",
                action: () => {
                  this.mode='delete'
                  this.content = "确定删除吗？";
                  this.$refs.confirmModel.confirm(
                    "list/product/mdsePlace/" + params.row.id
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { page: 1, limit: 10, sort: "createTime", order: "desc" },
      url: "list/product/mdsePlace/grid",
      modal: false,
      loading: true,
      modalTitle: "",
      formItem: {
        areaAddr: "",
        latitudeLongitude: "",
        mainUserId: 1471,
        cmbProvince: '',    //省
        cmbCity: '',        //市
        cmbArea: '',        //区
      },
      type: "",
      searchItems: [
        {
          label: "自提点名称",
          type: "input",
          name: "name"
        },
        {
          label: "是否上架",
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
        }
      ],
      ruleForm:{
          name:[
              {required:true,message:'请输入自提点名称',trigger:'blur'}
          ],
           addr:[
              {required:true,message:'请输入自提点详细地址',trigger:'blur'}
          ],
           linkTel:[
              {required:true,message:'请输入联系电话',trigger:'blur'}
          ],
           pickupBeginDate:[
              {required:true,message:'请选择营业时间',trigger:'change'}
          ],
            pickupEndDate:[
              {required:true, message:'请选择营业时间',trigger:'change'}
          ],
           enabled:[
              {required:true,message:'请选择状态',trigger:'change'}
          ],
          
      }
    };
  },
  components: { searchForm, gridTable, confirm, selectItem, amap },
  mounted() {},
  methods: {
    ok() {
      if (this.type == "add") {
        this.formItem.areaAddr = this.formItem.cmbProvince+ "-" + this.formItem.cmbCity + "-" + this.formItem.cmbArea;
      }
      let _this = this;
      let url =
        _this.type === "add"
          ? "list/product/mdsePlace/saveMdsePlace"
          : "list/product/mdsePlace/updateMdsePlace";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback(res) {
          if (res.success) {
            _this.modal = false;
          }
        }
      });
    },
    //删除
    delAll() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.mode='delete'
        this.content = "确定删除吗？";
        this.$refs.confirmModel.confirm("list/product/mdsePlace/" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    //上架
    addUp() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.content = "确定上架？";
        this.$refs.confirmModel.confirm(
          "list/product/mdsePlace/enabled/?enabled=T" + ids
        );
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    //下架
    addDown() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.content = "确定下架？";
        this.$refs.confirmModel.confirm(
          "list/product/mdsePlace/enabled/?enabled=F" + ids
        );
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    // 添加(需要后台对接)
    showModal() {
      this.modal = true;
      this.type = "add";
      //this.formItem.id =''
      this.formItem.name = "";
      this.formItem.areaAddr = "";
      this.formItem.addr = "";
      this.formItem.latitudeLongitude = "";
      this.formItem.linkTel = "";
      this.formItem.pickupBeginDate = "";
      this.formItem.pickupEndDate = "";
      this.formItem.enabled = "";
      this.formItem.summary = "";
      this.formItem.switch = true;
      this.modalTitle = "新增";
    },
    getProvince(sheng) {
      this.formItem.cmbProvince = sheng;
    },

    getCity(city) {
      this.formItem.cmbCity = city;
    },
    getQu(qu) {
      this.formItem.cmbArea  = qu;
    },
    getMap() {
      this.$refs.mapModel.modal = true;
    },
    getPoint(point) {
      this.formItem.latitudeLongitude = point.lat + "," + point.lng;
    }
  }
};
</script>
