<template>
  <div class="template-user-define">
    <searchForm :search-items="searchItems"></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="16">
      <Button  @click="fresh">清除店铺缓存</Button>
      <Button type="primary" icon="plus-round" @click="add">新增页面</Button>
      </Col>
    </Row>
    
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <Modal class="template-modal-select" width="850" v-model="modal" title="选择页面模板" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formInline" inline>
        <FormItem>
          <Input v-model="templateName" placeholder="请输入模板名称"></Input>
        </FormItem>
        <!-- <FormItem>
              <Select placeholder='请选择状态' v-model="status" style="width:160px">
                <Option value="">全部</Option>
                <Option value="T">上架</Option>
                <Option value="F">下架</Option>
              </Select>
            </FormItem>-->
        <FormItem>
          <Select placeholder="请选择模板类型" v-model="type" style="width:160px">
            <Option value>全部</Option>
            <Option v-for="(item,index) in typeList" :key="index" :value="item.key">{{item.value}}</Option>
          </Select>
        </FormItem>
        <Button type="primary" icon="ios-search" @click="getList">搜索</Button>
      </Form>
      <div class="template-select-list clearfix">
        <Col class="item-warper" span="6">
        <div class="template-item user-defined">
          <!-- <img class="userdefine-img" src="http://f.hiphotos.baidu.com/image/h%3D300/sign=0eaa7d0c75f0f736c7fe4a013a54b382/f603918fa0ec08faf4f358d454ee3d6d54fbdad6.jpg" alt=""> -->
          <i style="font-size:65px;" class="icon xx-icon icon-moban2"></i>
          <div>自定义页面</div>
          <Button @click="create">立即新建</Button>
        </div>
        </Col>
        <Col v-for="(item,index) in listData" :key="index" class="item-warper" span="6">
        <div class="template-item">
          <img class="template-item-img" :src="item.picUrl" alt>
          <div class="cover">
            <Button @click="useTemplete(item.id)" class="template-use">使用模板</Button>
          </div>
        </div>
        <div class="template-name">{{item.name}}</div>
        </Col>
      </div>
      <!-- <Page @on-change='pageChange' :total="total" show-elevator></Page> -->
      <Page @on-change="pageChange" :page-size="7" :total="total"></Page>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="modal1" title="主页设置" @on-ok="set">
      <Form :label-width="80"  ref="mainPageForm" :model="mainPageForm" :rules="ruleForm">
        <!-- {{mainPageForm.select}} -->
        <FormItem style="margin-bottom:0" label="设置为：">
          <CheckboxGroup v-model="mainPageForm.select">
            <!-- <Checkbox label="wap">
              <span>主页</span>
            </Checkbox> -->
            <div>
              <Checkbox label="small">
                <span>小程序主页</span>
              </Checkbox>
            </div>            
            <div>
              <Checkbox label="cityWebsite">
                <span>城市主页</span>
              </Checkbox>
              <FormItem v-if="mainPageForm.select && mainPageForm.select.indexOf('cityWebsite') != -1" prop="extendsParam3" style="display:inline-block"> 
                <Select  v-model="mainPageForm.extendsParam3"
                  @on-change="chooseCity"
                  placeholder="请选择城市主页" style="width:200px;">  
                  <Option
                    v-for="(item, index) in cityList"  
                    :key="index"
                    :value="item.cityName">
                    {{item.cityName}}
                  </Option>  
                </Select> 
              </FormItem> 
            </div>
            <div style="margin-top:10px;">
              <Checkbox label="parkWebsite">
                <span>景区主页</span>
              </Checkbox>
              <FormItem v-if="mainPageForm.select && mainPageForm.select.indexOf('parkWebsite') != -1" prop="extendsParam4" style="display:inline-block">
                <Select v-model="mainPageForm.extendsParam4"
                  @on-change="choosePark"
                  placeholder="请选择景区主页" style="width:200px;">  
                  <Option
                    v-for="(item,index) in parkList"  
                    :key="index"
                    :value="item">
                    {{item}}
                  </Option>  
                </Select>
              </FormItem>
            </div>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="set" type="primary">确定</Button>
        <Button @click="setCancel" type="ghost">取消</Button>
      </div>
    </Modal>
    <!-- 预览 -->
    <Modal width="550" v-model="preLookModal" title="推广">
      <!--城市主页链接-->
      <div v-if="showPcUrl&&cityWebsite" class="">
        <span>城市主页链接：{{pcUrl}}</span>
        <Button v-clipboard:copy="pcUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接</Button>
      </div>   
      <div v-if="showWapUrl">
        <span>领取短链接：{{copyUrl}}</span>
        <Button v-clipboard:copy="copyUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
        <Button v-clipboard:copy="copyLongUrl" v-clipboard:success="onCopy2" v-clipboard:error="onError2">复制长链接</Button>
        <p>
          <span>
                领取二维码:
                <a :href="codeUrl" download>下载二维码</a>
              </span>
        </p>
        <p style="background:yellow;padding:5px 0;margin-top:5px;">扫一扫查看，推荐使用支付宝、微信、手机浏览器 全员推广请使用长链接</p>
        <center id="target" style="margin-top:20px;">
          <qrcode :value="qrcodeUrl" :options="{ size: 170}"></qrcode>
        </center>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import searchForm from "@/components/global/searchForm";
  import gridTable from "@/components/global/gridTable";
  import confirm from "@/components/global/confirm";
  import {
    apiGet,
    apiPost
  } from "@/fetch/api";
  import QRcode from "@xkeshi/vue-qrcode";
  export default {
    data() {
      return {
        
        codeUrl: "", //二维码图片
        qrcodeUrl: "zz", //生成二维码地址
        copyUrl: "", //短链接
        copyLongUrl: "", //长链接
        preLookModal: false,
        
        modal1: false,
        content: "",
        sucessMsg: "",
        mode: "",
        searchItems: [{
          label: "页面名称",
          type: "input",
          name: "pageName"
        }],
        columns: [{
            title: "页面名称",
            key: "renovationPageName",
            sortable: true,
            render: (h, params) => {
              let arr = [
                h(
                  "span", {
                    style: {
                      marginRight: "7px"
                    }
                  },
                  params.row.renovationPageName
                )
              ];
              
              if (params.row.smallUseFlag == "T") {
                arr.push(
                  h(
                    "Button", {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      style: {
                        marginRight: '5px'
                      },
                    },
                    "小程序主页"
                  )
                );
              }
              if (params.row.extendsParam1 == "T") {
                arr.push(
                  h(
                    "Button", {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: '5px'
                      },
                    },
                    params.row.extendsParam3
                  )
                );
              }
              if (params.row.extendsParam2 == "T") {
                arr.push(
                  h(
                    "Button", {
                      props: {
                        type: "warning",
                        size: "small"
                      }                      
                    },
                    params.row.extendsParam4
                  )
                );
              }
              
              return h("div", arr);
            }
          },
          {
            title: "更新时间",
            key: "modifyTime",
            sortable: true
          },
          {
            title: "操作",
            key: "action",
            // width: 200,
            align: "center",
            render: (h, params) => {              
              const actions =
                [{
                    title: params.row.status == "T"?"禁用":'启用',
                    action: () => {
                      this.mode = "done";
                      this.content = "确认" + (params.row.status == "T"?"禁用":'启用') + "吗?";
                      this.sucessMsg = (params.row.status == "T"?"禁用":'启用') + "成功!";
                      this.$refs.confirmModel.confirm(
                        "/merchant/webApi/merchantRenovationTob/updateStatus?id=" + params.row.id + "&status=" + (params.row.status == "T"?"F":'T')
                      );
                    }
                  },{
                    title: "装修页面",
                    action: () => {                        
                      this.$router.push("/create?id=" + params.row.id);                 
                    }
                  },
                  {
                    title: "复制",
                    action: () => {
                      apiGet(
                        "/merchant/webApi/merchantRenovationTob/copePage?id=" +
                        params.row.id
                      ).then(res => {
                        this.$Message.success("复制成功!");
                        this.$refs.gridTable.loadpage();
                      });
                    }
                  },
                  // {
                  //   title: "推广",
                  //   action: () => {
                  //     this.preview(
                  //       params.row.id,
                  //       params.row.renovationPageType
                  //     );
                  //   }
                  // },
                  {
                    title: "设为主页",
                    action: () => {
                      this.mainPageForm.select = [];
                      // if (params.row.wapUseFlag == "T") {
                      //   this.select.push("wap");
                      // }
                      if (params.row.smallUseFlag == "T") {
                        this.mainPageForm.select.push("small");
                      }
                      if (params.row.extendsParam1 == "T") {
                        this.mainPageForm.select.push("cityWebsite");
                      }
                      if (params.row.extendsParam2 == "T") {
                        this.mainPageForm.select.push("parkWebsite");
                      }
                      // if (params.row.pcUseFlag == 'T' && this.cityWebsite) {
                      //   this.select.push("cityWebsite");
                      // }
                       
                      if(params.row.extendsParam3 && params.row.extendsParam3 != ''){
                        this.mainPageForm.extendsParam3 = params.row.extendsParam3;
                        this.chooseCity();
                        this.mainPageForm.extendsParam4 = params.row.extendsParam4 ? params.row.extendsParam4 : '';
                      }
                      // this.mainPageForm.extendsParam4 = params.row.extendsParam4 ? params.row.extendsParam4 : '';
                      apiPost('/merchant/webApi/merchantRenovationTob/selectCity', {
                        // cityName: this.mainPageForm.extendsParam3
                      }).then(res => {
                        if(res.status == 200){
                          this.cityList = res.data;
                          this.modal1 = true;
                          this.templateId = params.row.id;
                        }
                      })
                    }
                  }
                ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        data: "",
        params: {
          page: 1,
          limit: 10,
          sort: "modifyTime",
          order: "desc"
        },        
        url: "/merchant/webApi/merchantRenovationTob/selectCustomPage",
        modal: false,
        templateCode: "",
        type: "",
        status: "",
        page: 1,
        total: null,
        listData: [],
        templateName: "",
        typeList: [],
        wxxcx: false,
        cityWebsite: false,
        showPcUrl: false,
        showWapUrl: false,
        showSmallUrl:false,
        pcUrl: '',
        cityList: [],
        parkList: [],
        ruleForm: {
          extendsParam3: [{ required: true, message: "请选择城市" }],
          extendsParam4: [{ required: true, message: "请选择景区" }],
        },
        mainPageForm: {  
          extendsParam3: '',
          extendsParam4: '',
          select: [],        
        }
      };
    },
    created() {
      apiGet("/admin/api/sysParam/changeList?key=" + "mercantTemplateType").then(
        res => {
          this.typeList = res.data;
        }
      );
      
    },
    mounted() {
      
    },
    destroyed() {
    },
    components: {
      gridTable,
      confirm,
      searchForm,
      qrcode: QRcode
    },
    methods: {
      fresh(){
        apiGet(
          "/merchant/webApi/merchantRenovationTob/deleteRedis"
        ).then(res => {
          if (res.status == 200) {
           this.$Message.success('缓存清除成功!')
          } else {
            this.$Message.warning(res.message);
          }
        });
      },
      onCopy() {
        this.$Message.success("复制成功！");
      },
      onError() {
        this.$Message.error("复制失败！");
      },
      onCopy2() {
        this.$Message.success("复制成功！");
      },
      onError2() {
        this.$Message.error("复制失败！");
      },
      //预览   生成二维码
      preview(id, pageType) {
        let _this = this;
        apiGet(
          "/merchant/webApi/merchantRenovationTob/getExtendUrl?id=" +
          id +
          "&&pageType=" +
          pageType
        ).then(res => {
          if (res.status == 200) {
            this.preLookModal = true;
            this.qrcodeUrl = res.data.qrCodeLongUrl;
            this.copyUrl = res.data.qrCodeUrl;
            this.copyLongUrl = res.data.qrCodeLongUrl;
            this.showPcUrl = res.data.pc_use_flag == 'T' ? true : false;
            this.showWapUrl =!(res.data.wap_use_flag == 'F'&&res.data.small_use_flag == 'F'&& res.data.pc_use_flag == 'T')? true : false;
            this.showSmallUrl = res.data.small_use_flag == 'T' ? true : false;
            this.pcUrl = res.data.pcUrl;
            //把生成的二维码转换成图片
            this.$nextTick(function() {
              if(this.showWapUrl){
                let canvasData = $("#target").children("canvas");
                _this.codeUrl = canvasData[0].toDataURL();
              }              
            });
          } else {
            this.$Message.warning(res.message);
          }
        });
      },
      setCancel() {
        this.modal1 = false;
      },
      scrollError() {
        let errList = $(".ivu-form-item-error");
        if (errList.length > 0) {
          let scroll_offset = errList.eq(0).offset().top;
          $("#content").animate(
            {
              scrollTop: scroll_offset
            },
            300
          );
        }
      },
      set() {
        console.log('vdssdvsdvsdvsdvsdvsdvsdv', this.mainPageForm.select);
        if (this.mainPageForm.select.length) {
          // this.$refs.mainPageForm.validate(async valid => {
          //   this.scrollError();
          //   if (valid) {
                            
          //   }
          // });
          if(this.mainPageForm.select.indexOf('cityWebsite') != -1 && (!this.mainPageForm.extendsParam3 || this.mainPageForm.extendsParam3 == '')){
            this.$Message.warning('请选择主页所属城市！');
          }else if(this.mainPageForm.select.indexOf('parkWebsite') != -1 && (!this.mainPageForm.extendsParam4 || this.mainPageForm.extendsParam4 == '')){
            this.$Message.warning('请选择主页所属景区！');
          }else{
            let params = JSON.parse(JSON.stringify(this.mainPageForm));
            params.id = this.templateId;
            params.pageType = 'mianPage';
            params.useRange = params.select.join(',');
            params.cityName = params.extendsParam3;
            params.parkName = params.extendsParam4;
            delete params.select;
            delete params.extendsParam3;
            delete params.extendsParam4;
            apiPost("/merchant/webApi/merchantRenovationTob/setUsePage", params).then(res => {
              if (res.status == 200) {
                let msg = res.message ? res.message : '设置成功'
                this.$Message.success(msg);
                this.modal1 = false;
                this.$store.dispatch("postApi");
              } else {
                this.$Message.warning(res.message);
              }
            });
          }          
        }else {
          this.$Message.warning("请选择设置类型");
        }
        
        
      },
      useTemplete(id) {
        this.$router.push("/create?templateId=" + id);
      },
      pageChange(page) {
        this.page = page;
        this.getList();
      },
      getList() {
        apiPost("/merchant/webApi/merchantTemplateInfoTob/selectPage", {
          page: this.page,
          limit: 7,
          templateName: this.templateName,
          status: "T",
          type: this.type
        }).then(res => {
          // console.log(res)
          this.total = res.data.total;
          this.listData = res.data.rows;
        });
      },
      create() {
        this.$router.push("/create");
      },
      add() {
        this.modal = true;
        this.getList();
      },
      splits(test) {
        return test.split(",");
      },
      ok() {
        this.formItem.accType = 0;
        this.formItem.useFlag = this.formItem.switch ? 1 : 0;
        let _this = this;
        let url =
          _this.type === "add" ?
          "list/admin/sysFunctions/saveRole" :
          "list/admin/sysFunctions/update";
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
      cancel() {
        // this.$Message.info('Clicked cancel')
      },
      showModal() {
        this.modal = true;
        this.formItem.funName = "";
        this.formItem.funCode = "";
        this.formItem.optType = "";
        this.formItem.sortNo = "";
        this.formItem.openModes = "";
        this.formItem.functionTypes = "";
        this.formItem.hierarchys = "";
        this.formItem.funTypes = [];
        this.type = "add";
        this.formItem.switch = true;
        this.modalTitle = "新增角色";
      },
      delAll() {
        let selection = this.$refs.gridTable.selection;
        if (selection.length) {
          let ids = "";
          selection.forEach(element => {
            ids += element.id + ",";
          });
          this.$refs.confirmModel.confirm("list/admin/sysFunctions/" + ids);
        } else {
          this.$Message.warning("请选择一条数据！");
        }
      },
      chooseCity(e) {
        apiPost('/merchant/webApi/merchantRenovationTob/selectPark', {
          cityName: this.mainPageForm.extendsParam3,
          // parkName: this.mainPageForm.extendsParam4
        }).then(res => {
          if(res.status == 200) {
            this.parkList = res.data;
          }
        });
        // console.log('22222222', e)
      },
      choosePark(e) {
        console.log('9999999', e)
      }
    },    
  };
</script>
<style lang='scss'>
  @import "../../../../assets/styles/font/iconfont.css";
  .template-modal-select {
    .template-select-list {
      margin-bottom: 15px;
      .item-warper {
        padding: 0 25px;
        margin-bottom: 10px;
        .template-name {
          text-align: center;
          padding: 10px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .template-item {
          // margin: 0 5px;
          margin-bottom: 10px; // height: 190px;
          height: 180px;
          width: 125px;
          position: relative;
          margin: 0 auto;
          .template-item-img {
            height: 180px;
            width: 125px;
          }
          .cover {
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            text-align: center;
            .template-use {
              margin-top: 85px;
            }
          }
        }
        .template-item:hover {
          .cover {
            display: block;
          }
        }
        .user-defined {
          border: 1px solid #eee;
          text-align: center;
          .userdefine-img {
            margin-top: 25px;
            height: 80px;
            width: 80px;
          }
        }
      }
    }
  }
  .template-user-define {}
</style>

