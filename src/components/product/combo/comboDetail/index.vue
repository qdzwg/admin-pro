<template>
  <div>
    <Row :gutter="16" class="btn-groups">
       <Col span="3">
        <Button type="primary" icon="android-add" @click="add">添加产品</Button>
      </Col>
      <Col span="2">
        <Button type="ghost" @click="goBack">返回</Button>
      </Col>
    </Row>
    <div class="combo-table-title">门票</div>
    <Table border
           ref="table"
           :columns="ticketColumns"
           :data="ticketData">
      <slot name="footer"
            slot="footer"></slot>
    </Table>
    <div class="combo-table-title">酒店</div>
    <Table border
           ref="table"
           :columns="hotelColumns"
           :data="hotelData">
      <slot name="footer"
            slot="footer"></slot>
    </Table>
    <!-- <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable> -->
    <confirm ref="confirmModel" :mode="mode" @sucessDone='getList' :content="content" :sucessMsg="sucessMsg"></confirm>
    <Modal :mask-closable="false" width="800" v-model="modifyProductModal" id='productContent' title="添加产品" :loading="loading" @on-ok="addProductOK"  @on-cancel="addProductCancel">
      <div v-show="!currentId">
      <Form :model="productTypeForm" label-position="right" :label-width="100" ref="productType" :rules="productTypeRule">
        <FormItem label="产品类型：" prop="name">
          <Select v-model="productType"
                  style="width:180px">
            <Option v-for="sitem in productTypeList"
                    :value="sitem.value"
                    :key="sitem.value">{{ sitem.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Form ref="formInline" :model="searchForm" inline >
        <FormItem v-for="(item,index) in searchItems"  :key="index">
          <Input v-if="item.type=='input'" v-model="searchForm[item.name]" :placeholder="'请输入'+item.label"></Input>
          <DatePicker v-if="item.type=='date'" type="date" confirm @on-change="searchForm[item.name]=$event"  format="yyyy-MM-dd"  :placeholder="'请选择'+item.label" v-model="searchForm[item.name]"></DatePicker>
          <Select v-if="item.type=='select'" v-model="searchForm[item.name]" style="width:180px" :placeholder="'请选择'+item.label">
              <Option v-for="sitem in item.data" :value="sitem.value" :key="sitem.value">{{ sitem.label }}</Option>
          </Select>
        </FormItem>
        <Button type="primary" icon="ios-search" @click="searchSubmit()">搜索</Button>
        <!-- <FormItem>
            <Button type="success" @click="handleSubmit()">导出</Button>
        </FormItem> -->
      </Form>
      <Table border
           ref="table"
           :columns="columns"
           :data="addProductList"
           :loading="loading">
        <slot name="footer"
              slot="footer"></slot>
      </Table>
      <Page :total="addProductListTotal"
            style="margin-bottom: 20px;"
            class-name="pages"
            @on-change="changepage"
            @on-page-size-change='pageSizeChange'
            show-elevator
            show-sizer></Page>
      </div>
      <Form :model="ticketAddForm" label-position="right" v-show="productType=='ticket'" :label-width="160" ref="ticketForm" :rules="ticketRule">
        <FormItem label="景区名称：" v-show="currentId">{{ticketAddForm.parkName}}</FormItem>
        <FormItem label="票型名称：" v-show="currentId">{{ticketAddForm.modelName}}</FormItem>
        <FormItem label="子票简称：" prop="nickName">
            <Input  v-model="ticketAddForm.nickName" :maxlength="5" style="width:100px;"></Input>
          <span style="margin-left: 15px;">5个字以内，设置子票组成价使用</span>
        </FormItem>
        <FormItem label="子票游玩日期：" prop="playDetailType">
            <Select v-model="ticketAddForm.playDetailType"
                    @on-change="selectChange('ticketForm','ticketAddForm','playDetailType')"
                    style="width:180px">
              <Option v-for="sitem in playDetailTypeList"
                      :value="sitem.value"
                      :key="sitem.value">{{ sitem.label }}</Option>
            </Select>
            <!-- <div style="color: red;">说明：子票游玩时间为套票游玩日期+相对天数。</div> -->
        </FormItem>
        <FormItem label="套票游玩日期："
          :rules="ticketAddForm.playDetailType=='T'?
          [{ required: true, message: '请输入套票游玩日期', trigger: 'blur' },{ pattern: /^(([1-9][0-9]*)|[0]|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message: '数据格式不正确'}, {validator: validateNum4,message: '数值不能大于4'}]
          :[{ pattern: /^(([1-9][0-9]*)|[0]|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message: '数据格式不正确'}, {validator: validateNum4,message: '数值不能大于4'}]"
          v-show="ticketAddForm.playDetailType=='T'" prop="familyDay">
            <Input  v-model="ticketAddForm.familyDay" style="width:100px;"></Input> 天内，游客选择指定日期使用
        </FormItem>
        <FormItem label="组成数量：" prop="formNum">
          <Input  v-model="ticketAddForm.formNum" style="width:100px;" placeholder="请填写组成数量"></Input>
        </FormItem>
        <FormItem label="单价：" prop="price">
          <Input  v-model="ticketAddForm.price" style="width:100px;" placeholder="请填写单价"></Input>
        </FormItem>
        <FormItem label="组成价：" v-show="!currentId">
          <span>单价*组成数量=组成价</span>
          <span style="display: inline-block; vertical-align: top;margin-left: 15px;">组成价为子票组成数量的总价<br/>套票部分退票根据组成价格进行退票，请谨慎填写</span>
        </FormItem>
        <FormItem label="子产品频道展示：" prop="detailShowStatus">
          <Select v-model="ticketAddForm.detailShowStatus"
                  @on-change="selectChange('ticketForm','ticketAddForm','detailShowStatus')"
                  style="width:180px">
            <Option v-for="sitem in detailShowStatusList"
                    :value="sitem.value"
                    :key="sitem.value">{{ sitem.label }}</Option>
          </Select>
          <span style="margin-left: 15px;">选择展示则默认推送至对应版块详情页</span>
        </FormItem>
      </Form>
      <div v-show="productType=='hotel'&&!currentId" style="color: red;line-height: 30px;padding-left:100px;">套票业务酒店不支持订单待确认，只校验库存，请确保套票库存为酒店实时库存</div>
      <Form :model="hotelAddForm" label-position="right" v-show="productType=='hotel'" :label-width="160" ref="hotelForm" :rules="hotelRule">
        <FormItem label="酒店名称：" v-show="currentId">{{hotelAddForm.hotelName}}</FormItem>
        <FormItem label="票型名称：" v-show="currentId">{{hotelAddForm.modelName}}</FormItem>
        <FormItem label="子票简称：" prop="nickName">
            <Input  v-model="hotelAddForm.nickName" :maxlength="5" style="width:100px;"></Input>
          <span style="margin-left: 15px;">5个字以内，设置子票组成价使用</span>
        </FormItem>
        <FormItem label="酒店住店天数：" prop="hotelNum">
            <Input  v-model="hotelAddForm.hotelNum" placeholder="请填写酒店住店天数" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="价格：" prop="price">
          <Input  v-model="hotelAddForm.price" style="width:100px;" placeholder=""></Input>
        </FormItem>
        <FormItem label="子票入住日期" prop="playDetailType">
            <Select v-model="hotelAddForm.playDetailType"
                    @on-change="selectChange('hotelForm','hotelAddForm','playDetailType')"
                    style="width:180px">
              <Option v-for="sitem in hotelPlayDetailTypeList"
                      :value="sitem.value"
                      :key="sitem.value">{{ sitem.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="需在套票游玩日期："
          :rules="hotelAddForm.playDetailType=='T'?
          [{ required: true, message: '请输入套票游玩日期', trigger: 'change' }]
          :[]"
          v-show="hotelAddForm.playDetailType=='T'" prop="hotelDayType">
            <Select v-model="hotelAddForm.hotelDayType"
                    @on-change="selectChange('hotelForm','hotelAddForm','hotelDayType')"
                    style="width:180px">
              <Option v-for="sitem in hotelDayTypeList"
                      :value="sitem.value"
                      :key="sitem.value">{{ sitem.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="组成数量：" prop="formNum">
          <Input  v-model="hotelAddForm.formNum" style="width:100px;" placeholder="请填写组成数量"></Input>
        </FormItem>
        <FormItem label="组成价：">
          <span>价格*组成数量=组成价</span>
          <span style="display: inline-block; vertical-align: top;margin-left: 15px;">组成价为子票组成数量的总价<br/>套票部分退票根据组成价格进行退票，请谨慎填写</span>
        </FormItem>
        <FormItem label="子产品频道展示：" prop="detailShowStatus">
          <Select v-model="hotelAddForm.detailShowStatus"
                  @on-change="selectChange('hotelForm','hotelAddForm','detailShowStatus')"
                  style="width:180px">
            <Option v-for="sitem in detailShowStatusList"
                    :value="sitem.value"
                    :key="sitem.value">{{ sitem.label }}</Option>
          </Select>
          <span style="margin-left: 15px;">选择展示则默认推送至对应版块详情页</span>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center">
        <Button type="primary" :loading="add_loading" @click="addProductOK">提交</Button>
        <Button type="ghost" @click="addProductCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { apiPost, apiGet } from '@/fetch/api';
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  data () {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    const validateNum20 = (rule, value, callback) => {
      if (value > 20) {
        callback(new Error("最大值20"));
      } else {
        callback();
      }
    };
    const validateNum99 = (rule, value, callback) => {
      if (value > 99) {
        callback(new Error("最大值99"));
      } else {
        callback();
      }
    };
    return {
      add_loading: false,
      productTypeForm: {},
      productType: 'ticket',
      productTypeList: [
        {
          value: 'ticket',
          label: '门票',
        },
        {
          value: 'hotel',
          label: '酒店',
        }
      ],
      productTypeRule:{
        productType:[
          { required: true, message: '请选择产品类型', trigger: 'change' }
        ]
      },
      ticketRule:{
        nickName:[
          { required: true, message: '请输入子票简称', trigger: 'blur' }
        ],
        playDetailType:[
          { required: true, message: '请输入子票游玩日期', trigger: 'blur' }
        ],
        detailShowStatus:[
          { required: true, message: '请选择子产品频道展示', trigger: 'change' }
        ],
        formNum:[
          { required: true, message: '请输入组成数量', trigger: 'blur' },
          {
            pattern: /^([1-9][0-9]*|0)$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum99,
            message: "数值不能大于99"
          }
        ],
        // familyDay:[
        //   { required: true, message: '请输入套票游玩天数', trigger: 'blur' },
        //   {
        //     pattern: /^([1-9][0-9]*|0)$/,
        //     message: "数据格式不正确"
        //   },
        // ],
        price: [
          {
            required: true,
            message: "请输入单价",
            type: 'string'
          },
          {
            pattern: /^(([0-9]*)|(([0]\.\d{1,2}|[0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
      },
      hotelRule:{
        nickName:[
          { required: true, message: '请输入子票简称', trigger: 'blur' }
        ],
        playDetailType:[
          { required: true, message: '请输入子票入住日期', trigger: 'blur' }
        ],
        detailShowStatus:[
          { required: true, message: '请选择子产品频道展示', trigger: 'change' }
        ],
        formNum:[
          { required: true, message: '请输入组成数量', trigger: 'blur' },
          {
            pattern: /^([1-9][0-9]*|0)$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum20,
            message: "数值不能大于20"
          }
        ],
        // hotelDayType:[
        //   { required: true, message: '请输入套票游玩天数', trigger: 'blur' }
        // ],
        hotelNum:[
          { required: true, message: '请输入酒店入住天数', trigger: 'blur' },
          {
            pattern: /^([1-9][0-9]*|0)$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum99,
            message: "数值不能大于99"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入单价",
            type: 'string'
          },
          {
            pattern: /^(([0-9]*)|(([0]\.\d{1,2}|[0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
      },
      hotelPlayDetailTypeList: [
        // {
        //   value: 'T',
        //   label: '指定日期为游玩日期',
        // },
        {
          value: 'F',
          label: '套票日期为游玩日期',
        }
      ],
      playDetailTypeList: [
        {
          value: 'T',
          label: '指定日期为游玩日期',
        },
        {
          value: 'F',
          label: '套票日期为游玩日期',
        }
      ],
      detailShowStatusList: [
        {
          value: "T",
          label: '是',
        },
        {
          value: "F",
          label: '否',
        }
      ],
      hotelDayTypeList: [
        {
          value: '0',
          label: '当天',
        },
        {
          value: '1',
          label: '第二天',
        },
        {
          value: '2',
          label: '第三天',
        },
        {
          value: '3',
          label: '第四天',
        }
      ],
      ticketAddForm: {
        parkName: '',
        nickName: '',
        playDetailType: '',
        detailShowStatus: '',
        price: '',
        formNum: '',
        modelName: '',
        familyDay: '',
      },
      hotelAddForm: {
        hotelName: '',
        hotelNum: '',
        hotelDayType: '',
        nickName: '',
        playDetailType: '',
        detailShowStatus: '',
        price: '',
        formNum: '',
        modelName: '',
      },
      loading:true,
      modifyProductModal:false,
      afterSaleRuleModal: false,
      mode:"",
      content:"",
      sucessMsg:'',
      hotelColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          renderHeader: (h, params) => {
            return h("div", 'No.');
          },
        },
        {
          title: '供应商',
          key: 'supplierName'
        },
        {
          title: '酒店名称',
          key: 'hotelName'
        },
        {
          title: '房型名称',
          key: 'modelName',
        },
        {
          title: '编码',
          key: 'modelCode'
        },
        {
          title: '住店天数',
          key: 'hotelNum'
        },
        {
          title: '数量',
          key: 'formNum'
        },
        {
          title: '单价',
          key: 'price'
        },
        {
          title: '组成价',
          key: 'formPrice'
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '修改',
              action: () => {
                this.modify(params.row.id,'hotel',params.row.modelCode);
              }
            },
            {
              title: '删除',
              action: () => {
                this.mode= "post"
                this.content = "确认删除吗？"
                this.sucessMsg = "删除成功!"
                this.$refs.confirmModel.confirm('/product/api/familyDetail/del?familyDetailId=' + params.row.id,{familyDetailId: params.row.id})
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      hotelData: [],
      ticketColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
          renderHeader: (h, params) => {
            return h("div", 'No.');
          },
        },
        {
          title: '景区名称',
          key: 'parkName'
        },
        {
          title: '票型名称',
          key: 'modelName'
        },
        {
          title: '票型编码',
          key: 'modelCode',
        },
        {
          title: '来源',
          key: 'channel',
          render: (h,params) => {
            return h('span',this.filter.accountChannel(params.row.channel))
          }
        },
        {
          title: '相对套票天数',
          key: 'familyDay'
        },
        {
          title: '数量',
          key: 'formNum'
        },
        {
          title: '单价',
          key: 'price'
        },
        {
          title: '组成价',
          key: 'formPrice'
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '修改',
              action: () => {
                this.modify(params.row.id,'ticket',params.row.modelCode);
              }
            },
            {
              title: '删除',
              action: () => {
                this.mode= "post"
                this.content = "确认删除吗？"
                this.sucessMsg = "删除成功!"
                this.$refs.confirmModel.confirm('/product/api/familyDetail/del?familyDetailId=' + params.row.id,{familyDetailId:params.row.id})
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      ticketData: [],
      loading: false,
      addProductList: [],
      addProductListTotal: 0,
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      columns: [],
      searchForm: {},
      searchItems: [],
      data: '',
      url: '/product/parkTicket/grid',
      currentId: '',
      modelCode: '',
      familyTicketId: '',
      hotelAddColumns: [
        {
          width: 60,
          align: 'center',
          renderHeader: (h, params) => {
            return h("div", '');
          },
          render: (h, params) => {
            return h('Checkbox', {
              props: {
                value: params.row.checked
              },
              on: {
                "on-change": (event) => {
                  this.productCheck(params.row,event)
                }
              },
            })
          
          },
        },
        {
          title: '房型',
          key: 'modelName',
        },
        {
          title: '编码',
          key: 'modelCode'
        },
        {
          title: '酒店名称',
          key: 'hotelName'
        },
        {
          title: '来源',
          key: 'sellType',
          render: (h,params) => {
            return h('span',this.filter.sellType(params.row.sellType))
          }
        },
        {
          title: '展示价',
          key: 'price'
        },
        {
          title: '库存',
          key: 'stock'
        },
      ],
      ticketAddColumns: [
        {
          width: 60,
          align: 'center',
          renderHeader: (h, params) => {
            return h("div", '');
          },
          render: (h, params) => {
            return h('Checkbox', {
              props: {
                value: params.row.checked
              },
              on: {
                "on-change": (event) => {
                  this.productCheck(params.row,event)
                }
              },
            })
          
          },
        },
        {
          title: '票型',
          key: 'modelName'
        },
        {
          title: '编码',
          key: 'modelCode',
        },
        {
          title: '景区',
          key: 'parkName'
        },
        {
          title: '来源',
          key: 'channel',
          render: (h,params) => {
            return h('span',this.filter.accountChannel(params.row.channel))
          }
        },
        {
          title: '展示价',
          key: 'price'
        },
        {
          title: '库存',
          key: 'leftStockNum'
        },
      ],
      hotelSearchItems: [
        {
          label: '房型名称',
          type: 'input',
          name: 'modelName'
        },
        {
          label: '酒店名称',
          type: 'input',
          name: 'hotelName'
        }
      ],
      ticketSearchItems: [
        {
          label: '票型名称',
          type: 'input',
          name: 'modelName'
        },
        {
          label: '票型编码',
          type: 'input',
          name: 'modelCode'
        }
      ]
    }
  },
  watch: {
    productType(val,old) {
      this.params.businessType = val;
      if(val=='ticket'){
        this.columns = this.ticketAddColumns;
        this.url = '/product/api/familyDetail/modelTypeList';
        this.searchItems = this.ticketSearchItems;
      }else if (val=='hotel'){
        this.columns = this.hotelAddColumns;
        this.url = '/product/api/familyDetail/modelTypeList';
        this.searchItems = this.hotelSearchItems;
      }
      this.loadpage();
    },
  },
  mounted(){
    this.getList();
  },
  components: {searchForm, gridTable, confirm},
  methods: {
    selectChange(ref,form,props) {
      if(this.$refs[ref]&&this[form]&&this[form][props])
      this.$refs[ref].validateField(props);
    },
    getList() {
      apiPost('/product/api/familyDetail/list', {
        familyTicketId: this.$route.query.id||1,
      }).then(res => {
        if(res.status == 200){
          this.hotelData = res.data.familyHotelRoomDtoList
          this.ticketData = res.data.familyParkTicketDtoList
        }
      });
    },
    changepage (num) {
      this.params.page = num
      this.loadpage()
    },
    pageSizeChange (pageSize) {
      this.params.limit = pageSize
      this.loadpage()
    },
    searchSubmit() {
      this.params = Object.assign(this.params, this.searchForm);
      this.loadpage();
    },
    loadpage() {
      this.loading = true;
      apiPost(this.url, this.params).then(res => {
        this.loading = false;
        if (res.status == 200) {
          this.addProductList = [];
          this.addProductListTotal = res.data.total;
          res.data.rows.map(item=>{
            item.checked = false;
            if(item.modelCode==this.familyTicketId)
            item.checked = true;
            this.addProductList.push(item);
          })
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    productCheck(row,bool) {
      if(bool){
        this.familyTicketId = row.modelCode;
        this.modelCode = row.modelCode;
      }else{
        this.familyTicketId = '';
        this.modelCode = '';
      }
      this.addProductList.map(item=>{
        item.checked = false;
        if(item.modelCode==this.familyTicketId)
        item.checked = true;
      })
    },
    addProductOK() {
      this.add_loading = true;
      if(this.productType=='ticket'){
        this.$refs.ticketForm.validate(async (valid) => {
          if(valid){
            let form = {};
            form.familyTicketId = this.$route.query.id||1; // 套票票型ID
            form.modelType = this.productType; //产品类型
            form.modelCode = this.modelCode; //票型编码
            form.formNum = this.ticketAddForm.formNum; //组成数量
            form.price = this.ticketAddForm.price; //单价
            form.detailShowStatus = this.ticketAddForm.detailShowStatus; //子产品频道展示
            form.playDetailType = this.ticketAddForm.playDetailType; //子票游玩日期类型F:套票日期为游玩日期,T:指定日期为游玩日期
            form.familyDay = this.ticketAddForm.playDetailType=="T"?this.ticketAddForm.familyDay:null; //套票游玩日期天内
            form.nickName = this.ticketAddForm.nickName //别名=>子票简称
            let url = '/product/api/familyDetail/save';
            if(this.currentId){
              form.id = this.currentId //id
              url = '/product/api/familyDetail/update';
            }
            this.submit(url,form);
          }else{
            //滚动到错误地方
            this.$nextTick(()=>{
            let errList = $(".ivu-form-item-error");
            let list = $("#productContent .ivu-form-item");
            if (errList.length > 0) {
              let scroll_offset = errList.eq(0).offset().top;
              let top = $("#productContent .ivu-modal-body").offset().top;
              let test = list.eq(0).offset().top;
              $("#productContent .ivu-modal-body").animate(
                {
                  scrollTop: scroll_offset - test
                },
                300
              );
            }
            });
            this.add_loading =false;
          }
        });
      }else if (this.productType=='hotel'){
        this.$refs.hotelForm.validate(async (valid) => {
          if(valid){
            let form = {};
            form.familyTicketId = this.$route.query.id||1; // 套票票型ID
            form.modelType = this.productType; //产品类型
            form.modelCode = this.modelCode; //票型编码
            form.formNum = this.hotelAddForm.formNum; //组成数量
            form.price = this.hotelAddForm.price; //单价
            form.detailShowStatus = this.hotelAddForm.detailShowStatus; //子产品频道展示
            form.playDetailType = this.hotelAddForm.playDetailType; //子票游玩日期类型F:套票日期为游玩日期,T:指定日期为游玩日期
            form.hotelDayType = this.hotelAddForm.playDetailType=="T"?this.hotelAddForm.hotelDayType:null; //0:当天,1第二天,2第三天,3第四天
            form.hotelNum = this.hotelAddForm.hotelNum; //酒店入住天数
            form.nickName = this.hotelAddForm.nickName //别名=>子票简称
            let url = '/product/api/familyDetail/save';
            if(this.currentId){
              form.id = this.currentId //id
              url = '/product/api/familyDetail/update';
            }
            this.submit(url,form);
          }else{
            this.add_loading =false;
          }
        });
      }
    },
    submit(url,params) {
      apiPost(url, params).then(res => {
        if(res.status==200){
          this.add_loading =false;
          this.addProductCancel();
          this.getList();
          this.$Message.success("操作成功");
        }else{
          this.add_loading =false;
          this.$Message.warning(res.message);
        }
      });
    },
    addProductCancel() {
      this.$refs.ticketForm.resetFields();
      this.$refs.hotelForm.resetFields();
      this.modifyProductModal = false
    },
    validateNum4(rule, value, callback) {
      if (value > 4) {
        callback(new Error("最大值4"));
      } else {
        callback();
      }
    },
    goBack(){
      this.$router.go(-1);
    },
    validateNum(rule, value, callback) {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    },
    goBack(){
      this.$router.go(-1);
    },
    add(){
      this.currentId = ''; // 当前产品id
      this.searchForm = {};
      this.familyTicketId = '';
      this.modelCode = '';
      this.columns = this.ticketAddColumns;
      this.url = '/product/api/familyDetail/modelTypeList';
      this.productType = 'ticket';
      this.searchItems = this.ticketSearchItems;
      this.params = {page: 1, limit: 10, sort: 'createTime', businessType: 'ticket', order: 'desc'};
      this.ticketAddForm.familyDay = ''
      this.ticketAddForm.parkName = ''
      this.ticketAddForm.nickName = ''
      this.ticketAddForm.playDetailType = ''
      this.ticketAddForm.detailShowStatus = ''
      this.ticketAddForm.price = ''
      this.ticketAddForm.formNum = ''
      this.ticketAddForm.modelName = ''
      this.hotelAddForm.hotelName = ''
      this.hotelAddForm.hotelNum = ''
      this.hotelAddForm.hotelDayType = ''
      this.hotelAddForm.nickName = ''
      this.hotelAddForm.playDetailType = ''
      this.hotelAddForm.detailShowStatus = ''
      this.hotelAddForm.price = ''
      this.hotelAddForm.formNum = ''
      this.hotelAddForm.modelName = ''
      this.modelCode = '';
      this.loadpage();
      this.modifyProductModal = true
      this.add_loading = false;
    },
    modify(id,type,modelCode){
      this.add_loading = false;
      this.productType = type;
      this.modelCode = modelCode;
      this.currentId = id;
      this.modifyProductModal = true
      apiPost('/product/api/familyDetail/edit', {
        familyDetailId: id,
      }).then(res => {
        if (res.status == 200) {
          if(type=='ticket'){
            this.ticketAddForm.familyDay = res.data.familyDay?String(res.data.familyDay):'';
            this.ticketAddForm.parkName = res.data.parkName||'';
            this.ticketAddForm.nickName = res.data.nickName || '';
            this.ticketAddForm.playDetailType = res.data.playDetailType||'';
            this.ticketAddForm.detailShowStatus = res.data.detailShowStatus||'';
            this.ticketAddForm.price = (res.data.price||res.data.price===0)?String(res.data.price):'';
            this.ticketAddForm.formNum = res.data.formNum?String(res.data.formNum):'';
            this.ticketAddForm.modelName = res.data.modelName||'';
            this.modelCode = res.data.modelCode||'';
          }else if(type=='hotel'){
            this.hotelAddForm.hotelName = res.data.hotelName||'';
            this.hotelAddForm.hotelNum = res.data.hotelNum?String(res.data.hotelNum):'';
            this.hotelAddForm.hotelDayType = res.data.hotelDayType||'';
            this.hotelAddForm.nickName = res.data.nickName||'';
            this.hotelAddForm.playDetailType = res.data.playDetailType||'';
            this.hotelAddForm.detailShowStatus = res.data.detailShowStatus||'';
            this.hotelAddForm.price = (res.data.price||res.data.price===0)?String(res.data.price):'';
            this.hotelAddForm.formNum = res.data.formNum?String(res.data.formNum):'';
            this.hotelAddForm.modelName = res.data.modelName||'';
            this.modelCode = res.data.modelCode||'';
          }
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
  }
}
</script>

<style scope lang="scss">
  .combo-table-title{
    font-weight: bold;
    font-size: 24px;
    line-height: 50px;
    text-align: left;
  }
</style>