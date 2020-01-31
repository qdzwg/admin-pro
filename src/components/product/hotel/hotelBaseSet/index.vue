<template>
  <div>
    <!-- <searchForm :search-items="searchItems"></searchForm> -->
    <!-- <Row :gutter="16" class="btn-groups">
      <Col span="2" v-if="hotelId!=undefined">
        <Button type="primary" icon="android-add" @click="add">添加</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="android-done" @click="up">上架</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="android-close" @click="down">下架</Button>
      </Col>
    </Row>-->
    <!-- <gridTable
      ref="gridTable"
      :params="params"
      :columns="columns"
      :data="data"
      :url="url"
    ></gridTable> -->
    <list
      ref="gridTable"
      :params="params"
      :columns="columns"
      :data="data"
      :url="url"
      :searchItems="searchItems"
      :hannleItems="hannleItems"
    ></list>
    <Modal
      v-model="inventoryModal"
      title="合作库存管理"
    >
      <Form
        :model="formItem"
        style="maxHeight:450px;overflow:auto;"
        ref="formItem"
      >
        <template v-if="differType=='check'">
          <FormItem label="对接状态：">
            {{formItem.status | pmsStatus}}
          </FormItem>
          <FormItem label="酒店名称：">
            {{formItem.pmsHotelName}}
          </FormItem>
          <FormItem label="酒店编码：">
            {{formItem.hotelMerchantCode}}
          </FormItem>
          <FormItem label="对接企业名称：">
            {{formItem.corpName}}
          </FormItem>
          <FormItem label="对接方式所属：">
            {{formItem.type=='1'?'托管运营':'自主运营'}}
          </FormItem>
          <FormItem label="合作周期：">
            {{formItem.startTime}} ~ {{formItem.endTime}}（到期后自动停止对接）
          </FormItem>
        </template>
        <FormItem
          label="合作库存：（特殊库存优先级大于日常库存设置）"
          :required="differType=='inventory'"
        >
          <table class="docking-table">
            <tr>
              <th>房型</th>
              <!-- <th>库存</th> -->
              <th>日常保留房库存</th>
              <th>日常共享库存</th>
              <th>特殊库存设置</th>
            </tr>
            <tr
              v-for="(item,index) in formItem.tableList"
              :key="item.hotelTypeId"
            >
              <td>{{item.hotelTypeName}}</td>
              <!-- <td>{{item.roomNum}}</td> -->
              <td>
                <FormItem
                  :prop="'tableList.' + index + '.privateStock'"
                  :rules="[{required:true,message:'日常保留房库存'},{type:'number',max:item.roomNum-(item.publicStock==null?0:item.publicStock),message:'不能大于总库存'}]"
                >
                  <span v-if="differType=='check'">{{item.privateStock}}</span>
                  <Input
                    v-else
                    number
                    v-model="item.privateStock"
                    size="small"
                  ></Input>
                </FormItem>
              </td>
              <td>
                <FormItem
                  :prop="'tableList.' + index + '.publicStock'"
                  :rules="[{required:true,message:'日常共享库存'},{type:'number',max:item.roomNum-(item.privateStock==null?0:item.privateStock),message:'不能大于总库存'}]"
                >
                  <span v-if="differType=='check'">{{item.publicStock}}</span>
                  <Input
                    v-else
                    number
                    v-model="item.publicStock"
                    size="small"
                  ></Input>
                </FormItem>
              </td>
              <td>
                <Button
                  type="primary"
                  @click="inventory(index)"
                  size="small"
                >{{differType=='check'?'查看':'设置'}}</Button>
              </td>
            </tr>
          </table>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          v-if="differType=='inventory'"
          type="primary"
          :loading="checksaveLoading"
          @click="save('formItem')"
        >保存</Button>
        <Button
          v-if="differType=='check'&&formItem.status!='success'&&formItem.status!='refuse'&&formItem.status!='overdate'"
          :loading="checkrefuseLoading"
          @click="checkSave('refuse')"
        >拒绝</Button>
        <Button
          v-if="differType=='check'&&formItem.status!='success'&&formItem.status!='refuse'&&formItem.status!='overdate'"
          type="primary"
          :loading="checkLoading"
          @click="checkSave('success')"
        >通过</Button>
      </div>
    </Modal>
    <Modal
      v-model="inventoryCalendarModal"
      :mask-closable="false"
      title="库存管理日历"
      width="800"
    >
      <div>
        <Select
          style="width:200px;margin:10px 0;"
          v-model="hotelTypeId"
          @on-change="hotelChange"
        >
          <Option
            :value="item.hotelTypeId"
            v-for="item in hotelTypeList"
            :key="item.hotelTypeId"
          >{{item.hotelTypeName}}</Option>
        </Select>
      </div>
      <pms-calendar
        ref="fullCa"
        class="test-fc"
        :action="action"
        :extend="extend"
        :param="calendarParam"
        :list="list"
        :popShow="popShow"
        @getCheckInfo="getCheckInfo"
      ></pms-calendar>
      <div slot="footer"></div>
    </Modal>
    <confirm
      ref="confirmModel"
      :mode="mode"
      :content="content"
      :sucessMsg="sucessMsg"
    ></confirm>
  </div>
</template>
<script>
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import list from "@/components/global/list";
import confirm from "@/components/global/confirm";
import pmsCalendar from "@/components/global/pmsCalendar";
export default {
  data() {
    return {
        checkLoading:false,
        checkrefuseLoading:false,
        checksaveLoading:false,
      popShow: true,
      inventoryModal: false,
      formItem: {
        tableList: []
      },
      differType: "check",
      inventoryCalendarModal: false,
      hotelTypeId: "",
      hotelMerchantId: "",
      hotelTypeList: [],
      action: "",
      extend: [
        {
          title: "私享",
          key: "privateStock",
          render: (h, params) => {
            return h(
              "span",
              params.row.privateStock != null
                ? params.row.privateStock + " / " + params.row.privateStock
                : "-- / --"
            );
          }
        },
        {
          title: "共享",
          key: "publicStock",
          render: (h, params) => {
            return h(
              "span",
              params.row.publicStock != null
                ? params.row.publicStock + " / " + params.row.publicStock
                : "-- / --"
            );
          }
        }
      ],
      calendarParam: {},
      list: {},
      xindex: "",
      mode: "",
      content: "",
      sucessMsg: "",
      hotelId: "",
      columns: [
        {
          title: "酒店状态",
          key: "enabled",
          render: (h, params) => {
            return h("div", [
              h("span", params.row.pmsEnale == "T" ? "" : "已停业"),
              h(
                "span",
                params.row.enabled == "T"
                  ? "在营"
                  : params.row.pmsEnale == "F"
                  ? "（已下架）"
                  : "已下架"
              )
            ]);
          }
        },
        {
          title: "酒店编码",
          key: "code"
        },
        {
          title: "酒店名称",
          width: 300,
          render: (h, params) => {
            let arr = [
              h(
                "span",
                {
                  style: {
                    marginRight: "10px"
                  }
                },
                params.row.pmsName || params.row.name
                  ? params.row.pmsName || params.row.name
                  : ""
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                params.row.type == "0" ? "自营" : "第三方"
              )
            ];
            if (params.row.isDirect == "T") {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.remove(params.index);
                      }
                    }
                  },
                  "直连"
                )
              );
            }
            return h("div", arr);
          }
        },
        {
          title: "排序",
          key: "listOrder",
          align: "center",
          render: (h, params) => {
            return h(
              "Input",
              {
                props: {
                  value: params.row.listOrder,
                  size: "small",
                  maxlength: 3
                },
                style: {
                  width: "80px"
                },
                on: {
                  input: value => {
                    params.row.listOrder = value;
                    this.blurGet = true;
                  },
                  "on-blur": () => {
                    if (this.blurGet) {
                      this.apiPost("/pmsproduct/api/pmsHotel/updateListOrder", {
                        hotelMerchantId: params.row.id,
                        listOrder: params.row.listOrder
                      }).then(res => {
                        if (res.status == 200) {
                          this.blurGet = false;
                          this.$Message.success("操作成功!");
                          this.$refs.gridTable.loadpage()
                        } else {
                          this.$Message.warning(res.message);
                        }
                      });
                    }
                  },
                  "on-keyup": value => {
                    if (params.row.listOrder.length) {
                      params.row.listOrder = params.row.listOrder.replace(
                        /[^\.\d]/g,
                        ""
                      );
                    }
                  }
                }
              },
              ""
            );
          }
        },
        {
          title: "房型数量",
          key: "hotelTypeNum",
          render: (h, params) => {
            return h(
              "span",
              params.row.hotelTypeNum ? params.row.hotelTypeNum : 0
            );
          }
        },
        {
          title: "酒店基础资料",
          key: "price",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    disabled:
                      params.row.notifyStatus == "auth_wait" ||
                      params.row.notifyStatus == "refuse" ||
                      params.row.notifyStatus == "stop"||
                       params.row.notifyStatus =="overdate"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      apiGet(
                        "/pmsproduct/api/pmsHotel/checkCreateMerchantByMain"
                      ).then(res => {
                        if (res.status == 200) {
                          if (res.createFlag) {
                            this.$router.push(
                              "/hotelBaseInfo?id=" +
                                params.row.id +
                                "&mainUserId=" +
                                params.row.mainUserId
                            );
                          } else {
                            // this.$Message.warning("未查询到店铺，请先创建店铺")
                            // console.log(window.location.protocol+"//"+ window.location.host +"/admin/index#/merchant/merchantInfo/survey")
                            // window.location.href =
                            //   window.location.protocol +
                            //   "//" +
                            //   window.location.host +
                            //   "/admin/index#/merchant/merchantInfo/survey";
                          }
                        }
                      });
                    }
                  }
                },
                "维护"
              )
            ]);
          }
        },
        // {
        //   title: "酒店认证资料",
        //   key: "enabled",
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "primary",
        //             size: "small"
        //           },
        //           style: {
        //             marginRight: "5px"
        //           },
        //           on: {
        //             click: () => {
        //               this.show(params.index);
        //             }
        //           }
        //         },
        //         params.row.isAuth == "T" ? "查看" : "认证"
        //       )
        //     ]);
        //   }
        // },
        {
          title: "房型基础资料",
          key: "price",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    disabled:
                      params.row.notifyStatus == "auth_wait" ||
                      params.row.notifyStatus == "refuse" ||
                      params.row.notifyStatus == "stop"||
                       params.row.notifyStatus =="overdate"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      apiGet(
                        "/pmsproduct/api/pmsHotel/checkCreateMerchantByMain"
                      ).then(res => {
                        if (res.status == 200) {
                          if (res.createFlag) {
                            apiGet(
                              "/pmsproduct/api/pmsHotel/checkHotelUphold?id=" +
                                params.row.id
                            ).then(res => {
                              if (res.status == 200) {
                                if (res.checkFlag) {
                                  this.$router.push(
                                    "/roomInfoSet?id=" +
                                      params.row.id +
                                      "&mainUserId=" +
                                      params.row.mainUserId
                                  );
                                } else {
                                  this.$router.push(
                                    "/hotelBaseInfo?id=" +
                                      params.row.id +
                                      "&mainUserId=" +
                                      params.row.mainUserId
                                  );
                                }
                              }
                            });
                          } else {
                            // this.$Message.warning("未查询到店铺，请先创建店铺")
                            // console.log(window.location.protocol+"//"+ window.location.host +"/admin/index#/merchant/merchantInfo/survey")
                            // window.location.href =
                            //   window.location.protocol +
                            //   "//" +
                            //   window.location.host +
                            //   "/admin/index#/merchant/merchantInfo/survey";
                          }
                        }
                      });
                    }
                  }
                },
                "维护"
              )
            ]);
          }
        },
        {
          title: "销售设置",
          key: "price",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    disabled:
                      params.row.notifyStatus == "auth_wait" ||
                      params.row.notifyStatus == "refuse" ||
                      params.row.notifyStatus == "stop"||
                      params.row.notifyStatus =="overdate"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      //  this.dataCheck(params.row.id)
                      apiGet(
                        "/pmsproduct/api/pmsHotel/checkCreateMerchantByMain"
                      ).then(res => {
                        if (res.status == 200) {
                          if (res.createFlag) {
                            apiGet(
                              "/pmsproduct/api/pmsHotel/checkHotelUphold?id=" +
                                params.row.id
                            ).then(res => {
                              if (res.status == 200) {
                                if (res.checkFlag) {
                                  this.$router.push(
                                    "/hoteldistributionSet?id=" +
                                      params.row.id +
                                      "&mainUserId=" +
                                      params.row.mainUserId
                                  );
                                } else {
                                  this.$router.push(
                                    "/hotelBaseInfo?id=" +
                                      params.row.id +
                                      "&mainUserId=" +
                                      params.row.mainUserId
                                  );
                                }
                              }
                            });
                          } else {
                            // this.$Message.warning("未查询到店铺，请先创建店铺")
                            // console.log(window.location.protocol+"//"+ window.location.host +"/admin/index#/merchant/merchantInfo/survey")
                            // window.location.href =
                            //   window.location.protocol +
                            //   "//" +
                            //   window.location.host +
                            //   "/admin/index#/merchant/merchantInfo/survey";
                          }
                        }
                      });
                    }
                  }
                },
                "维护"
              )
            ]);
          }
        },

        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [];
            if (params.row.notifyStatus == "success") {
              actions.push({
                title: "合作中",
                text:'primary',
                action: () => {
                  this.getNotify(params.row.notifyId);
                }
              });
              if (params.row.notifyType != "insert") {
              }
            } else if (
              params.row.notifyStatus == "auth_wait" ||
              params.row.notifyStatus == "stop"
            ) {
              actions.push({
                title: "审核",
                text:'primary',
                action: () => {
                  this.getNotify(params.row.notifyId);
                }
              });
            } else if (params.row.notifyStatus == "refuse") {
              actions.push(
                {
                  title: "已拒绝",
                  text:'primary',
                  action: () => {
                    this.getNotify(params.row.notifyId);
                  }
                },
                {
                  title: "删除",
                  text:'error',
                  action: () => {
                    this.mode = "post";
                    this.content = "删除后将影响已有订单退票、核销，请谨慎操作";
                    this.sucessMsg = "删除成功!";
                    this.$refs.confirmModel.confirm(
                      "/pmsproduct/api/pmsHotel/deleteHotel?hotelMerchantId=" +
                        params.row.id
                    );
                  }
                }
              );
            } else if (params.row.notifyStatus == "update_wait") {
              //合作中 待审核单独设置操作
              return h("div", [
                h(
                  "Button",
                  {
                       props:{
                          type:'primary',
                           size: 'small'
                      },
                    on: {
                      click: () => {
                        this.getNotify(params.row.notifyId);
                      }
                    }
                  },
                  "合作中"
                ),
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      textAlign: "center",
                      lineHeight: "16px",
                      color: "#fff",
                      backgroundColor: "red",
                      borderRadius: "50%",
                    }
                  },
                  "改"
                ),
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "text",
                //       size: "small"
                //     },
                //     on: {
                //       click: () => {
                //         if (params.row.hotelTypeNum) {
                //           apiPost("/pmsproduct/api/pmsHotel/updateEnable", {
                //             hotelMerchantId: params.row.id,
                //             enable: params.row.enabled == "F" ? "T" : "F"
                //           }).then(res => {
                //             if (res.status == 200) {
                //               this.$Message.success(res.message);
                //               this.$refs.gridTable.loadpage();
                //             } else {
                //               this.$Message.warning(res.message);
                //             }
                //           });
                //         } else {
                //           this.$Message.warning("请先完善房型信息！");
                //         }
                //       }
                //     }
                //   },
                //   params.row.enabled == "F" ? "上架" : "下架"
                // )
              ]);
            }else if (params.row.notifyStatus == "stop_wait"){
                 return h("div", [
                h(
                  "Button",
                  {
                     props:{
                          type:'primary',
                           size: 'small'
                      },
                    on: {
                      click: () => {
                        this.getNotify(params.row.notifyId);
                      }
                    }
                  },
                  "审核"
                ),
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      textAlign: "center",
                      lineHeight: "16px",
                      color: "#fff",
                      backgroundColor: "red",
                      borderRadius: "50%"
                    }
                  },
                  "停"
                ),
                 ]);
            }else if(params.row.notifyStatus =='overdate'){
                actions.push({
                title: "已过期",
                text:'primary',
                action: () => {
                    this.getNotify(params.row.notifyId);
                }
              });
            }else if(params.row.notifyStatus =='wait_start'){
                 actions.push({
                title: "合作未开始",
                text:'primary',
                action: () => {
                    this.getNotify(params.row.notifyId);
                }
              });
            }
            // if (
            //   params.row.notifyStatus != "auth_wait" &&
            //   params.row.notifyStatus != "refuse" &&
            //   params.row.notifyStatus != "stop"
            // ) {
            //   actions.push({
            //     title: params.row.enabled == "F" ? "上架" : "下架",
            //     action: () => {
            //       if (params.row.hotelTypeNum) {
            //         apiPost("/pmsproduct/api/pmsHotel/updateEnable", {
            //           hotelMerchantId: params.row.id,
            //           enable: params.row.enabled == "F" ? "T" : "F"
            //         }).then(res => {
            //           if (res.status == 200) {
            //             this.$Message.success(res.message);
            //             this.$refs.gridTable.loadpage();
            //           } else {
            //             this.$Message.warning(res.message);
            //           }
            //         });
            //       } else {
            //         this.$Message.warning("请先完善房型信息！");
            //       }
            //     }
            //   });
            // }
            if (params.row.isDirect == "F") {
              actions.push({
                title: "库存",
                text:'primary',
                action: () => {
                  if (params.row.hotelTypeNum) {
                    this.inventoryModal = true;
                    this.differType = "inventory";
                    this.getTableList(params.row.id);
                  } else {
                    this.$Message.warning("请先完善房型信息！");
                  }
                }
              });
            }

            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
        // hotelId: this.$route.query.hotelId
      },
      url: "/pmsproduct/api/pmsHotel/queryPmsHotelPage",
      searchItems: [
        {
          label: "酒店名称",
          type: "input",
          name: "pmsName"
        },
        {
          label: "酒店编码",
          type: "input",
          name: "pmsCode"
        }
      ],
      hannleItems: [
        {
          title: "新增酒店",
          icon: "android-add",
          callback: () => {
            this.$router.push("/hotelBaseInfo");
          }
        }
      ]
    };
  },
  components: { searchForm, gridTable, confirm, list, pmsCalendar },
  mounted() {
    //获取调转过来的id作为hotelId，决定添加按钮是否出现
    this.hotelId = this.$route.query.id;
  },
  methods: {
    getNotify(id) {
      apiGet("/pmsproduct/api/pmsNotifyApi/getNotify?id=" + id).then(res => {
        this.differType = "check";
        this.formItem = JSON.parse(JSON.stringify(res.data));
        this.formItem.tableList = JSON.parse(JSON.stringify(res.data.htdList));
        this.formItem.startTime = JSON.parse(
          JSON.stringify(res.data)
        ).startTime.substring(0, 10);
        this.formItem.endTime = JSON.parse(
          JSON.stringify(res.data)
        ).endTime.substring(0, 10);
        this.inventoryModal = true;
      });
    },
    getCheckInfo(data, data2) {
      // console.log(data, data2);
      if (data) {
        // 去重
        // if (this.formItem.tableList[this.activeIndex].dateList.length) {
        //   let index = this.formItem.tableList[
        //     this.activeIndex
        //   ].dateList.findIndex(item => item.stockDate == data.stockDate);
        //   if (index > -1) {
        //     //去重操作
        //     this.formItem.tableList[this.activeIndex].dateList.splice(index, 1);
        //   }
        // }
        // this.formItem.tableList[this.activeIndex].dateList.push(data);

        let obj = Object.assign(data, {
          hotelMerchantId: this.hotelMerchantId
        });
        this.apiPost(
          "/pmsproduct/api/pmsHotelDateStockApi/saveDateStock",
          obj
        ).then(res => {
          if (res.status == 200) {
            this.$Message.success("操作成功");
            data2.popShow = false;
          } else {
            this.$Message.success(res.message);
          }
        });
      }
    },
    checkSave(text) {
        if(text=='refuse'){
            this.checkrefuseLoading=true
        }else{
          this.checkLoading=true  
        }
        
      apiPost("/pmsproduct/api/pmsNotifyApi/updateNotify", {
        id: this.formItem.id,
        status: text
      }).then(res => {
        if (res.status == 200) {
          this.$Message.success("操作成功");
          this.inventoryModal = false;
          if(text=='refuse'){
            this.checkrefuseLoading=false
        }else{
          this.checkLoading=false  
        }
          this.$refs.gridTable.loadpage();
        }else{
           if(text=='refuse'){
            this.checkrefuseLoading=false
        }else{
          this.checkLoading=false  
        }
            this.$Message.warning(res.message);
        }
      });
    },
    save(name) {
        this.checksaveLoading=true
      let obj = {
        commonStockJson: this.formItem.tableList
      };
      this.$refs[name].validate(async vaild => {
        if (vaild) {
          await apiPostJson(
            "/pmsproduct/api/pmsHotelCommonStockApi/saveCommonStock",
            obj
          ).then(res => {
            if (res.status == 200) {
              this.$Message.success("操作成功");
              this.inventoryModal = false;
              this.checksaveLoading=false
            } else {
                this.checksaveLoading=false
              this.$Message.warning(res.message);
            }
          });
        }else{
            this.checksaveLoading=false
        }
      });
    },

    hotelChange(id) {
      this.hotelTypeId = id;
      this.formItem.tableList.forEach((item, index) => {
        if (item.hotelTypeId == id) {
          this.xindex = index;
        }
      });
      this.list = JSON.parse(
        JSON.stringify(this.formItem.tableList[this.xindex])
      );
      this.$nextTick(() => {
        this.$refs.fullCa.init();
      }, 200);
    },
    inventory(i) {
      this.activeIndex = i;
      this.hotelTypeList = this.formItem.tableList;
      let tableItem = this.formItem.tableList[i];
      if (tableItem.privateStock != null && tableItem.publicStock != null) {
        this.hotelTypeId = tableItem.hotelTypeId;
        this.list = JSON.parse(JSON.stringify(tableItem));
        if (tableItem.dateList && tableItem.dateList.length) {
          this.calendarParam = {
            dateList: tableItem.dateList,
            differType: this.differType
          };
        } else {
          this.calendarParam = {
            hotelTypeId: this.hotelTypeId,
            differType: this.differType
          };
          this.action = "/pmsproduct/api/pmsHotelDateStockApi/listDateStock";
        }

        this.inventoryCalendarModal = true;
        this.$nextTick(() => {
          this.$refs.fullCa.init();
        }, 200);
      } else {
        this.$Message.warning("请先设置私享和共享库存");
      }
    },
    getTableList(id) {
      this.hotelMerchantId = id;
      apiGet(
        "/pmsproduct/api/pmsHotelCommonStockApi/listCommonStock?hotelMerchantId=" +
          id
      ).then(res => {
        if (res.status == 200) {
          //   res.data.forEach(item => {
          //     item.privateStock = null;
          //     item.publicStock = null;
          //     item.dateList = [];
          //     // item.popShow=false
          //   });
          this.formItem.tableList = res.data;
          this.hotelTypeList = res.data;
        }
      });
    },
    async dataCheck(id) {
      let data = await apiGet(
        "/pmsproduct/api/pmsHotel/checkHotelUphold?id=" + id
      );
      if (data.status == 200) {
        this.checkFlag = data.checkFlag;
      }
    },
    add() {
      this.$router.push({
        path: "/hotelRoom-add-edit",
        query: { hotelId: this.hotelId }
      });
    },
    delAll() {
      this.mode = "delete";
      this.content = "删除后将影响已有订单退票、核销，请谨慎操作";
      this.sucessMsg = "删除成功!";
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let arr = [];
        selection.forEach(element => {
          arr.push(element.id);
        });
        this.$refs.confirmModel.confirm("product/hotelRoom/" + arr.join(","));
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    up() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let arr = [];
        selection.forEach(element => {
          arr.push(element.id);
        });
        this.mode = "done";
        this.content = "确认上架吗？";
        this.sucessMsg = "上架成功!";
        this.$refs.confirmModel.confirm(
          "product/hotelRoom/enable?enable=T&ids=" + arr.join(",")
        );
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    },
    down() {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let arr = [];
        selection.forEach(element => {
          arr.push(element.id);
        });
        this.mode = "done";
        this.content = "确认下架吗？";
        this.sucessMsg = "下架成功!";
        this.$refs.confirmModel.confirm(
          "product/hotelRoom/enable?enable=F&ids=" + arr.join(",")
        );
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    }
  }
};
</script>

<style lang="scss">
.docking-table {
  border: 1px solid #e8eaec;
  color: #303133;
  font-family: PingFang-SC-Medium;
  border-collapse: collapse;
  border-spacing: 0;
  width: calc(100% - 2px);
  tr {
    width: 100%;
    th {
      height: 50px;
      line-height: 50px;
      background-color: #ebeef9;
      width: 8%;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      text-align: center;
      padding: 0 10px;
    }
    td {
      height: 48px;
      line-height: 1.5;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      text-align: center;
      width: 8%;
      padding: 0 10px;
    }
  }
}
</style>
