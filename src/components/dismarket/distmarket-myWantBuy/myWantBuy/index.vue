<template>
    <div>
        <div class="boxShadow">
            <div class="indexTitle">
                <div @click="curChange(0)" :class="goodsType=='park'?'cur':''">
                    <Icon type="icon-jingdian"></Icon>景区门票</div>
                <div @click="curChange(1)" :class="goodsType=='hotel'?'cur':''">
                    <Icon type="icon-icon-hotel"></Icon>酒店房型</div>
                <div @click="curChange(2)" :class="goodsType=='mdse'?'cur':''">
                    <Icon type="icon-gouwuche1"></Icon>实物商品</div>
                <div @click="curChange(3)" :class="goodsType=='route'?'cur':''">
                    <Icon type="icon-nav-tours"></Icon>跟团游</div>
                <div @click="curChange(4)" :class="goodsType=='traffic'?'cur':''">
                    <Icon type="icon-nav-tours"></Icon>小交通</div>
            </div>
            <!-- <searchForm ref='searchForm' :search-items='searchItems'></searchForm> -->
            <Form ref="formInline" :model="params" inline label-position="right" class="formSearch">
                <FormItem v-for="(item,index) in searchItems" :key="index">
                    <Input v-if="item.type=='input'" @on-change='inputChange' v-model="params[item.name]" :placeholder="'请输入'+item.label"></Input>
                </FormItem>
                <FormItem v-if="goodsType=='park'">
                    游玩日
                    <DatePicker v-model="params.occDate" @on-change="dateChange" :options="options3" format="yyyy-MM-dd" type="date" placeholder="Select date"></DatePicker>
                </FormItem>
                <FormItem v-if="goodsType=='hotel'">
                    入住日期
                    <DatePicker :editable="false" style="width:130px;" v-model="params.startDate" @on-change="setBegDate" type="date" :options="options0" format="yyyy-MM-dd"></DatePicker>
                </FormItem>
                <FormItem v-if="goodsType=='hotel'">
                    离店日期
                    <DatePicker :editable="false" style="width:130px;" v-model="params.endDate" @on-change="setEndDate" type="date" :options="options1" format="yyyy-MM-dd"></DatePicker>
                </FormItem>
                <Button class="formSearchBtn handleSubmit" type="primary" @click="handleSubmit()">搜索</Button>
                <Button type="ghost" class="formSearchBtn" @click="resetSearch()">重置</Button>
            </Form>
        </div>
        <div class="resultList">
            <Spin size="large" fix v-if="(goodsType!='route')&&loading"></Spin>
            <div v-if="goodsType=='park'&&!loading">
              <div class="resultItem" v-for="(item,index) in data" :key='index'>
                  <div class="itemInfo boxShadow" :class="{itemInfoShow: item.show}">
                      <div class="infoImg">
                          <img :src="item.parkPic" alt="">
                      </div>
                      <div class="infoTxt">
                          <div class="infoTitle">{{item.parkName}}</div>
                          <div class="infoSource">来源：{{item.supplierName}}</div>
                          <div class="infoType" v-if="item.parkLevel!=''&&(item.parkLevel!='0'&&item.parkLevel!='6')">景区等级：
                              <span class='infoLevel'>{{item.parkLevel=='1'?'A':(item.parkLevel=='2'?'AA':(item.parkLevel=='3'?'AAA':(item.parkLevel=='4'?'AAAA':'AAAAA')))}}级</span>
                              <!-- <span>人文景观</span> -->
                          </div>
                          <div class="infoSource">所属区域：{{item.areaAddr}}</div>
                      </div>
                      <div class="infoBtn">
                          <div v-if='!item.show' class="infoShow" @click='show(item,index,true)'>预定</div>
                          <!-- <div v-else @click='show(item,index,false)'>收起</div> -->
                          <Button class="infoBtnHide" @click='show(item,index,false)' v-else type="ghost">收起</Button>
                      </div>
                  </div>
                  <div class="resultOpt" v-if='item.show'>
                      <div class="resultTable">
                          <div class="resultThead">
                              <div class="resultTh">票型编码</div>
                              <div class="resultTh">票型名称</div>
                              <div class="resultTh">分（采）价</div>
                              <div class="resultTh">库存</div>
                              <div class="resultTh">操作</div>
                          </div>
                          <div class="resultTbody" v-for="(ticket,inde) in item.ticketPurchases" :key='inde'>
                              <div class="resultTr" :class='{resultBCGF9: !(inde%2),timeShow:ticket.isFsyy=="T"&&ticket.timers&&(ticket.value&&ticket.timers.length||!ticket.timers.length)}'>
                                  <div class="resultTd">{{ticket.ticketCode}}</div>
                                  <div class="resultTd" style="line-height:24px;">{{ticket.ticketName}}
                                      <span class="isRealName">{{ticket.isRealName=='T'?'实名制':''}}</span>
                                  </div>
                                  <div class="resultTd">{{(ticket.distPrice||ticket.distPrice===0)?ticket.distPrice:'暂不售卖'}}</div>
                                  <div class="resultTd">{{ticket.stock}}</div>
                                  <div class="resultTd numOpt">
                                      <!-- <num-opt :numChange='ticketNum(0,ticket,item,inde)' :max='ticket.stock=="无限库存"?9999:1' :min=0></num-opt> -->
                                      <span :class="{numOptBtn:ticket.value>0}" @click='ticketReaded(0,ticket,item,inde)'>－</span><input :readonly='!ticket.distPrice&&ticket.distPrice!==0' :class="{priceLessInput: !ticket.distPrice&&ticket.distPrice!==0}" @change='numChange(ticket,$event,item,inde,1)' @input='numChange(ticket,$event,item,inde,1)' type="number" v-model="ticket.value"><span :class="{numOptBtn:(ticket.value<ticket.stock||ticket.stock=='无限库存')&&(ticket.distPrice||ticket.distPrice===0)}" @click='ticketReaded(1,ticket,item,inde)'>＋</span>
                                  </div>
                              </div>
                              <div class="resultTimeList" v-if='ticket.isFsyy=="T"&&ticket.timers&&(ticket.value&&ticket.timers.length||!ticket.timers.length)'>
                                <div v-if='ticket.isFsyy=="T"&&ticket.timers&&ticket.timers.length' style="max-width:130px;" class="timeTd">
                                  <div style="width: 800px;float:left;text-align:left;"><span class="resultTime" @click='timeIt(ind,ite,ticket,item,inde)' :class='{resultTimeSel: ite.selected,resultTime0: !ite.num}' v-for="(ite,ind) in ticket.timers" :key='ind'>{{ite.startTime}}-{{ite.endTime}}</span></div>
                                  <div style='clear:both;'></div>
                                </div>
                                <div v-if='ticket.isFsyy=="T"&&(!ticket.timers||!ticket.timers.length)||ticket.noTimers' class="timeTd timerNone">当前游玩日期没有可选时间段，换个日期试试。</div>
                                <div class="timeTd"></div>
                                <div class="timeTd"></div>
                                <div class="timeTd"></div>
                                <div class="timeTd"></div>
                              </div>
                          </div>
                      </div>
                      <div class="resultTotal" v-if='total.num'>
                          <div class="totalInfo">
                              <div>总数量：{{(total.num).toFixed(0)}}张</div>
                              <div class="totalNum">合计：
                                  <span>￥
                                      <em>{{(total.total).toFixed(2)}}</em>
                                  </span>
                              </div>
                          </div>
                          <div class="totalBtn">
                              <div :class="{totalBtnSub: total.num}" @click='submitBill(item)'>提交订单</div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
            <div v-if="goodsType=='hotel'&&!loading">
              <div class="resultItem" v-for="(item,index) in data" :key='index'>
                <div class="itemInfo">
                    <div class="infoImg">
                        <img :src="item.hotelPic" alt="">
                    </div>
                    <div class="infoTxt">
                        <div class="infoTitle">{{item.hotelName}}</div>
                        <div class="infoSource">{{item.supplierName}}</div>
                        <div class="infoType">{{item.hotelLevel&&item.hotelLevel!=0?(item.hotelLevel+'星级'):''}}</div>
                        <div class="infoType">{{item.hotelArea}}</div>
                    </div>
                    <div class="infoBtn">
                        <div v-if='!item.show' class="infoShow" @click='show(item,index,true)'>预定</div>
                        <Button class="infoBtnHide" @click='show(item,index,false)' v-else type="ghost">收起</Button>
                    </div>
                </div>
                <div class="resultOpt" v-if='item.show'>
                    <Table class='resultTable' :columns="columns" :data="item.roomPurchases"></Table>
                    <div class="resultTotal" v-if='total.num'>
                        <div class="totalInfo">
                            <div>总数量：<span>{{(total.num).toFixed(0)}}</span>间<span>{{total.date}}</span>晚</div>
                            <div class="totalNum">合计：
                                <span>￥
                                    <em>{{(total.total).toFixed(2)}}</em>
                                </span>
                            </div>
                        </div>
                        <div class="totalBtn">
                            <div :class="{totalBtnSub: total.num}" @click='submitBill(item)'>提交订单</div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div v-if="goodsType=='mdse'&&!loading">
              <div class="resultItem" v-for="(item,index) in data" :key='index' >
                <div class="itemInfo">
                    <div class="infoImg">
                        <img :src="item.mdsePic" alt="">
                    </div>
                    <div class="infoTxt">
                        <div class="infoTitle">{{item.mdseName}}</div>
                        <div class="infoSource">{{item.supplierName}}</div>
                    </div>
                    <div class="infoBtn">
                        <div v-if='!item.show' class="infoShow" @click='show(item,index,true)'>预定</div>
                        <Button class="infoBtnHide" @click='show(item,index,false)' v-else type="ghost">收起</Button>
                    </div>
                </div>
                <div class="resultOpt" v-if='item.show'>
                    <Table class='resultTable' :columns="columns" :data="item.specPurchases"></Table>
                    <div class="resultTotal" v-if='total.num'>
                        <div class="totalInfo">
                            <div>总数量：<span>{{(total.num).toFixed(0)}}</span>个</div>
                            <div class="totalNum">合计：
                                <span>￥
                                    <em>{{(total.total).toFixed(2)}}</em>
                                </span>
                            </div>
                        </div>
                        <div class="totalBtn">
                            <div :class="{totalBtnSub: total.num}" @click='submitBill(item)'>提交订单</div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <!-- <div class="resultItem" v-for="(item,index) in data" :key='index' v-if="goodsType=='route'">
                <div class="itemInfo">
                    <div class="infoImg">
                        <span @click='show(item,index)'><Icon type="chevron-up" v-if='item.show'></Icon><Icon type="chevron-down" v-else></Icon></span>
                        <img :src="item.mdsePic" alt="">
                    </div>
                    <div class="infoTxt">
                        <div class="infoTitle">{{item.mdseName}}</div>
                        <div class="infoSource">{{item.supplierName}}</div>
                        <div class="infoType">{{item.hotelLevel}}星级</div>
                        <div class="infoType">{{item.hotelArea}}</div>
                    </div>
                </div>
                <div class="resultOpt" v-if='item.show'>
                    <Table :columns="columns" :data="item.specPurchases"></Table>
                    <div class="resultTotal" v-if='total.num'>
                        <div class="totalInfo">
                            <div class="totalNum">总数量：<span>{{total.num}}</span>张</div>
                            <div class="totalNum">合计：<span>￥{{total.price}}</span></div>
                            <Button type="primary" @click='submitBill(item)'>提交订单</Button>
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- <Table :columns="columns" :loading='loading' :data="data" v-if="goodsType=='hotel'"></Table> -->
            <!-- <Table :columns="columns" :loading='loading' :data="data" v-if="goodsType=='mdse'"></Table> -->
            <Table :columns="columns" :loading='loading' :data="data" v-if="goodsType=='route'"></Table>
            <div v-if="goodsType=='traffic'&&!loading">
              <div class="resultItem" v-for="(item,index) in data" :key='index'>
                  <div class="itemInfo boxShadow" :class="{itemInfoShow: item.show}">
                      <div class="infoImg">
                          <img :src="item.masterPic" alt="">
                      </div>
                      <div class="infoTxt">
                          <div class="infoTitle">{{item.name}}</div>
                          <div class="infoSource">来源：{{item.supplierName}}</div>
                      </div>
                      <div class="infoBtn">
                          <div v-if='!item.show' class="infoShow" @click='show(item,index,true)'>预定</div>
                          <!-- <div v-else @click='show(item,index,false)'>收起</div> -->
                          <Button class="infoBtnHide" @click='show(item,index,false)' v-else type="ghost">收起</Button>
                      </div>
                  </div>
                  <div class="resultOpt" v-if='item.show'>
                      <div style="padding-top: 10px;">
                        <Select v-model="item.beginSiteCode" style="width:300px" @on-change="beginSiteChange(item,item.beginSiteCode)">
                            <Option v-for="sitem in item.trafficBeginSites" :value="sitem.siteCode" :key="sitem.id">{{ sitem.siteAliasName }}</Option>
                        </Select>
                        <Select v-model="item.endSiteCode" style="width:300px" @on-change="getDetailPrice(item)">
                            <Option v-for="sitem in item.trafficEndSites" :value="sitem.siteCode" :key="sitem.id">{{ sitem.siteAliasName }}</Option>
                        </Select>
                        <DatePicker v-model="item.occDate" @on-change="trafficDateChange(item)" :options="options3" format="yyyy-MM-dd" type="date" placeholder="选择日期"></DatePicker>
                        <Select v-model="item.shiteCode" style="width:100px" @on-change="checkedShiteTimeChange(item)">
                            <Option v-for="sitem in item.trafficShiftTimes" :value="sitem.traihNumberCode" :key="sitem.id">{{ sitem.traihNumberTIME }}</Option>
                        </Select>
                        <InputNumber v-model="item.quantity" @on-change="trafficQuantityChange(item)" style="width:100px" :precision="0" :max="50" :min="0" ></InputNumber>
                      </div>
                      <div class="resultTotal" v-if='item.buy'>
                          <div class="totalInfo">
                              <div>总数量：{{(item.quantity).toFixed(0)}}张</div>
                              <div class="totalNum">合计：
                                  <span>￥
                                      <em>{{(item.quantity*item.priceDist).toFixed(2)}}</em>
                                  </span>
                              </div>
                          </div>
                          <div class="totalBtn">
                              <div :class="{totalBtnSub: item.quantity&&item.priceDist}" @click='submitTraffic(item)'>提交订单</div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
            <Page :page-size='params.limit' :page-size-opts="[10]" @on-page-size-change="sizeChange" :total="totals" class-name="pages" @on-change="changepage" show-elevator show-sizer></Page>
        </div>
        <Modal v-model="confirmModel" width="560" class-name="ivu-confirm-modal">
            <p slot="header" style="color:#f60;">
                <Icon type="information-circled"></Icon>
                <span>请注意！</span>
            </p>
            <div>
                <div v-html='confirm.ticketNotice'></div>
            </div>
            <div slot="footer" style="text-align:center">
                <Button type="error" :loading="modal_loading" @click="confirmModelOK">确认</Button>
                <Button type="ghost" @click="confirmModelCancel">取消</Button>
            </div>
        </Modal>
        <confirm @callBack='callBack' ref="confirmModels" sucessMsg="操作成功！" content="你是否确认取消采购，取消后不可购买该产品。" mode="undefined"></confirm>
    </div>
</template>
<script>
import qs from "qs";
import confirm from "@/components/global/confirm";
import searchForm from "@/components/global/searchForm";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      occDate: new Date(),
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      loading: false,
      confirm: {},
      confirmModel: false,
      modal_loading: false,
      timeSel: 0,
      timer: [],
      totals: 0,
      options0: {},
      options1: {},
      daterange: [new Date(), new Date(new Date() + 1000 * 60 * 60 * 24)],
      // total: {
      //     num: 0,
      //     total: 0
      // },
      type: [
        {
          goodsType: "park",
          searchItems: [
            {
              label: "景区名称",
              type: "input",
              name: "parkName"
            },
            {
              label: "景区编码",
              type: "input",
              name: "parkCode"
            }
          ],
          url: "/distmarket/webApi/distMarketPurchase/selectPark",
          params: {
            limit: 10,
            page: 1,
            occDate: new Date()
          }
        },
        {
          goodsType: "hotel",
          searchItems: [
            {
              label: "酒店名称",
              type: "input",
              name: "goodsName"
            },
            // {
            //   label: "供应商",
            //   type: "input",
            //   name: "shopName"
            // }
            {
            label: "房型名称",
            type: "input",
            name: "roomCode"
            },
          ],
          url: '/distmarket/webApi/distMarketPurchase/selectHotel',
          // url: "/distmarket/myWantBuy/grid",
          params: {
            limit: 10,
            page: 1,
            sort: "createTime",
            order: "desc",
            modelType: "hotel",
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
          },
          columns: [
            // {
            //   title: "酒店图片",
            //   key: "photoUrl",
            //   sortable: true,
            //   render: (h, params) => {
            //     return h("img", {
            //       attrs: {
            //         src: params.row.photoUrl
            //           ? params.row.photoUrl
            //           : "https://testwww.lotsmall.cn/static/h-ui/images/default_pic.png",
            //         style: "width:100px;height:60px;padding:5px;"
            //       }
            //     });
            //   }
            // },
            // {
            //   title: "酒店名称",
            //   key: "goodsName",
            //   sortable: true
            // },
            // {
            //   title: "酒店编码",
            //   key: "goodsCode",
            //   sortable: true
            // },
            // {
            //   title: "供应商",
            //   key: "shopName",
            //   sortable: true
            // },
            // {
            //   title: "状态",
            //   key: "sellStatus",
            //   sortable: true,
            //   render: (h, params) => {
            //     return h(
            //       "span",
            //       params.row.sellStatus == "F" ? "失效" : "有效"
            //     );
            //   }
            // },
            {
            title: '房型编号',
            key: 'roomCode',
            },
            {
            title: '房型名称',
            key: 'roomName',
            render: (h, params) => {
                return h(
                  "div",
                  {
                    style: {
                      lineHeight: "25px"
                    },
                  },
                  params.row.roomName
                );
              }
            },
            {
            title: '分（采）价',
            key: 'distPrice',
            },
            {
            title: '剩余库存',
            key: 'stock',
            },
            {
            title: '操作',
            key: 'action',
            align: 'center',
            className: 'numOpt',
            render: (h, params) => {
                let arr = [];
                arr.push(h('span', {
                    attrs: {
                      class: params.row.value>0?'numOptBtn':'',
                    },
                    on: {
                    click: () => {
                            if (!params.row.distPrice) {
                                return
                            }
                            this.numOpt(0,params.row)
                            this.setNum(params.index,params.row);
                        }
                    }
                }, '-'))
                arr.push(h("input", {
                    attrs: {
                        type: 'number',
                        style: 'width:30px;',
                        value: params.row.value,
                        readonly: !params.row.distPrice&&params.row.distPrice!==0
                    },
                    on: {
                        change: () => {
                          this.numChange(params.row,event);
                        },
                        input: () => {
                          this.numChange(params.row,event);
                        }
                    }
                }))
                arr.push(h('span', {
                    attrs: {
                      class: (params.row.value<params.row.stock||params.row.stock=='无限库存')&&(params.row.distPrice||params.row.distPrice===0)?'numOptBtn':'',
                    },
                    on: {
                    click: () => {
                            if (!params.row.distPrice) {
                                return
                            }
                            this.numOpt(1,params.row)
                            this.setNum(params.index,params.row);
                        }
                    }
                }, '+'))
                return arr
            }
            },
            // {
            //   title: "操作",
            //   key: "action",
            //   align: "center",
            //   render: (h, params) => {
            //     const actions = [
            //       {
            //         title: "取消采购",
            //         action: () => {
            //           this.$refs.confirmModels.confirm(
            //             "/distmarket/myWantBuy/cancelPurchase?type=hotel&" +
            //               "goodsCode=" +
            //               params.row.goodsCode
            //           );
            //         }
            //       }
            //     ];
            //     if (params.row.sellStatus == "T") {
            //       actions.unshift({
            //         title: "购买",
            //         action: () => {
            //           this.routeLink(params.row);
            //         }
            //       });
            //     }
            //     return this.common.columnsHandle(h, actions);
            //   }
            // }
          ]
        },
        {
          goodsType: "mdse",
          searchItems: [
            // {
            //   label: "供应商",
            //   type: "input",
            //   name: "shopName"
            // },
            {
              label: "商品名称",
              type: "input",
              name: "mdseName"
            }
          ],
          url: '/distmarket/webApi/distMarketPurchase/selectMdse',
          // url: "/distmarket/myWantBuy/grid",
          params: {
            limit: 10,
            page: 1,
            sort: "createTime",
            order: "desc",
            modelType: "mdse"
          },
          columns: [
            // {
            //   title: "商品图片",
            //   key: "photoUrl",
            //   sortable: true,
            //   render: (h, params) => {
            //     return h("img", {
            //       attrs: {
            //         src: params.row.photoUrl
            //           ? params.row.photoUrl
            //           : "https://testwww.lotsmall.cn/static/h-ui/images/default_pic.png",
            //         style: "width:100px;height:60px;padding:5px;"
            //       }
            //     });
            //   }
            // },
            // {
            //   title: "商品名称",
            //   key: "goodsName",
            //   sortable: true
            // },
            // {
            //   title: "商品编码",
            //   key: "goodsCode",
            //   sortable: true
            // },
            // {
            //   title: "供应商",
            //   key: "shopName",
            //   sortable: true
            // },
            // {
            //   title: "状态",
            //   key: "sellStatus",
            //   sortable: true,
            //   render: (h, params) => {
            //     return h(
            //       "span",
            //       params.row.sellStatus == "F" ? "失效" : "有效"
            //     );
            //   }
            // },
            {
            title: '规格编号',
            key: 'specCode',
            width: 200
            },
            {
              title: '商品规格',
              key: 'specParam',
              render: (h, params) => {
                  let str = params.row.specParam.replace(/'/g,"");
                  let list = str.split(',');
                  let arr = [];
                  list.map(item=>{
                    let param = item.slice(1,-1);
                    let obj = param.split(':');
                    if(obj.length == 2)
                    arr.push(obj[0]+"："+'<span style="color: red;">'+obj[1]+'</span>');
                  });
                  return h('div', {
                    domProps: {
                      innerHTML: arr.join('/')
                    }
                  })
              }
            },
            {
            title: '分（采）价',
            key: 'distPrice',
            width: 100
            },
            {
            title: '剩余库存',
            key: 'stock',
            width: 100
            },
            {
              title: '操作',
              key: 'action',
              width: 200,
              align: 'center',
              className: 'numOpt',
              render: (h, params) => {
                let arr = [];
                arr.push(h('span', {
                    attrs: {
                      class: params.row.value>0?'numOptBtn':'',
                    },
                    on: {
                    click: () => {
                            if (!params.row.distPrice) {
                                return
                            }
                            this.numOpt(0,params.row)
                            this.setNum(params.index,params.row);
                        }
                    }
                }, '-'))
                arr.push(h("input", {
                    attrs: {
                        type: 'number',
                        style: 'width:30px;',
                        value: params.row.value,
                        readonly: !params.row.distPrice&&params.row.distPrice!==0
                    },
                    on: {
                        change: () => {
                          this.numChange(params.row,event);
                        },
                        input: () => {
                          this.numChange(params.row,event);
                        }
                    }
                }))
                arr.push(h('span', {
                    attrs: {
                      class: (params.row.value<params.row.stock||params.row.stock=='无限库存')&&(params.row.distPrice||params.row.distPrice===0)?'numOptBtn':'',
                    },
                    on: {
                    click: () => {
                            if (!params.row.distPrice) {
                                return
                            }
                            this.numOpt(1,params.row)
                            this.setNum(params.index,params.row);
                        }
                    }
                }, '+'))
                return arr
              }
            }
          ]
        },
        {
          goodsType: "route",
          searchItems: [
            // {
            // label: "线路编码",
            // type: "input",
            // name: "routeCode"
            // },
            {
              label: "供应商",
              type: "input",
              name: "shopName"
            },
            {
              label: "跟团游名称",
              type: "input",
              name: "goodsName"
            }
          ],
          // url: '/distmarket/webApi/distMarketPurchase/selectRoute',
          url: "/distmarket/myWantBuy/grid",
          params: {
            limit: 10,
            page: 1,
            sort: "createTime",
            order: "desc",
            modelType: "route"
            // occDate: new Date()
          },
          columns: [
            {
              title: "跟团游图片",
              key: "routePic",
              sortable: true,
              render: (h, params) => {
                return h("img", {
                  attrs: {
                    src: params.row.routePic
                      ? params.row.routePic
                      : "https://testwww.lotsmall.cn/static/h-ui/images/default_pic.png",
                    src: params.row.photoUrl
                      ? params.row.photoUrl
                      : "https://testwww.lotsmall.cn/static/h-ui/images/default_pic.png",
                    style: "width:100px;height:60px;padding:5px;"
                  }
                });
              }
            },
            {
              title: "跟团游名称",
              key: "routeName",
              key: "goodsName",
              sortable: true
            },
            {
              title: "跟团游编码",
              key: "routeCode",
              key: "goodsCode",
              sortable: true
            },
            {
              title: "供应商",
              key: "supplierName",
              key: "shopName",
              sortable: true
            },
            {
              title: "状态",
              key: "sellStatus",
              sortable: true,
              render: (h, params) => {
                return h(
                  "span",
                  params.row.sellStatus == "F" ? "失效" : "有效"
                );
              }
            },
            {
              title: "操作",
              key: "action",
              align: "center",
              render: (h, params) => {
                const actions = [
                  {
                    title: "取消采购",
                    action: () => {
                      this.$refs.confirmModels.confirm(
                        "/distmarket/myWantBuy/cancelPurchase?type=route&" +
                          "goodsCode=" +
                          params.row.goodsCode
                      );
                    }
                  }
                ];
                if (params.row.sellStatus == "T") {
                  actions.unshift({
                    title: "购买",
                    action: () => {
                      this.routeLink(params.row);
                    }
                  });
                }
                return this.common.columnsHandle(h, actions);
              }
            }
          ]
        },
        {
          goodsType: "traffic",
          searchItems: [
            {
              label: "线路名称",
              type: "input",
              name: "trafficName"
            },
            {
              label: "起始站",
              type: "input",
              name: "beginSiteName"
            },
            {
              label: "终点站",
              type: "input",
              name: "endSiteName"
            }
          ],
          url: "/distmarket/webApi/distMarketTraffic/selectTraffic",
          params: {
            limit: 10,
            page: 1,
            sort: "createTime",
            order: "desc",
            modelType: "traffic",
            occDate: new Date()
          },
          columns: []
        }
      ],
      searchItems: [],
      goodsType: "",
      columns: [],
      params: {},
      url: "",
      data: {},
      flag: false,
      options3: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }
    };
  },
  computed: {
    total() {
      let item;
      let obj = {
        num: 0,
        total: 0
      };
      this.data.map(it => {
        if (it.show) item = it;
      });
      let list;
      if (this.goodsType == "park") {
        list = item.ticketPurchases;
      } else if (this.goodsType == "hotel") {
        obj.date = Math.ceil(Math.abs(new Date(this.params.startDate).getTime() - new Date(this.params.endDate).getTime()) / (1000 * 60 * 60 * 24));
        list = item.roomPurchases;
      } else if (this.goodsType == "mdse") {
        list = item.specPurchases;
      } else {
        list = item.roomPurchases;
      }
      if (list)
        list.map(item => {
          obj.num += Number(item.value);
          if (item.distPrice) obj.total += item.distPrice * item.value;
        });
      return obj;
    }
  },
  mounted() {
    this.curChange(0);
    if (this.goodsType == "hotel") {
      this.setBegDate(new Date());
      this.setEndDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
    }
  },
  components: {
    confirm,
    searchForm
  },
  methods: {
    beginSiteChange(item) {
      item.endSiteCode = '';
      item.endSiteName = '';
      item.buy = false;
      item.trafficBeginSites.map(time=>{
        if(time.siteCode == item.beginSiteCode){
          item.beginSiteName = time.siteAliasName
        }
      });
      apiGet(
        "/distmarket/webApi/distMarketTraffic/getTrafficPurchaseDto",
        {
          beginSiteCode: item.beginSiteCode,
          goodsCode: item.code,
        }
      ).then(res => {
        if (res.status == 200) {
          item.trafficEndSites = res.data.trafficEndSites;
          item.trafficShiftTimes = res.data.trafficShiftTimes;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    trafficQuantityChange(item) {
      if(item.priceDist&&item.endSiteName&&item.beginSiteName&&item.checkedShiteTime){
        item.buy = true;
      }
    },
    trafficDateChange(item) {
      item.shiteCode = '';
      item.checkedShiteTime = '';
      item.trafficShiftTimes = [];
      item.buy = false;
      apiGet(
        "/distmarket/webApi/distMarketTraffic/getTrafficPurchaseDto",
        {
          beginSiteCode: item.beginSiteCode,
          occDate: this.common.formatDate(
            item.occDate,
            "yyyy-MM-dd"
          ),
          goodsCode: item.code,
        }
      ).then(res => {
        if (res.status == 200) {
          item.trafficShiftTimes = res.data.trafficShiftTimes;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    checkedShiteTimeChange(item){
      item.trafficShiftTimes.map(time=>{
        if(time.traihNumberCode == item.shiteCode){
          item.checkedShiteTime = time.traihNumberTIME
        }
      });
      if(item.priceDist&&item.endSiteName&&item.beginSiteName&&item.checkedShiteTime){
        item.buy = true;
      }
    },
    getDetailPrice(item) {
      item.trafficEndSites.map(time=>{
        if(time.siteCode == item.endSiteCode){
          item.endSiteName = time.siteAliasName
        }
      });
      if(item.beginSiteCode&&item.endSiteCode)
      apiGet(
        "/product/api/trafficProduct/getDetailPrice",
        {
          routeCode: item.code,
          beginSiteCode: item.beginSiteCode,
          endSiteCode: item.endSiteCode,
        }
      ).then(res => {
        if (res.status == 200) {
          item.priceDist = res.data.priceDist || 0;
          if(item.priceDist&&item.endSiteName&&item.beginSiteName&&item.checkedShiteTime){
            item.buy = true;
          }
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    submitTraffic(item) {
      item.totalPriceDist = (item.quantity*item.priceDist).toFixed(2);
      item.routeCode = item.code;
      item.routeName = item.name;
      let date = item.occDate;
      item.occDate =
            date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      localStorage.setItem('trafficBill',JSON.stringify(item))
      this.$router.push({ path: "/trafficBill"});
    },
    callBack() {
      this.handleSubmit();
    },
    numChange(e, ev, item, inde) {
      console.log(e, ev)
      e.value = ev.currentTarget.value||ev.target.value;
      e.value = (~~e.value).toFixed(0);
      if (e.value <= 0) {
        e.value = Math.abs(e.value);
      }
      if (~~e.value > e.stock) {
        e.value = e.stock;
      }
      if (~~e.value > 999) {
        e.value = 999;
      }
      if(ev.currentTarget){
        ev.currentTarget.value = (~~ev.currentTarget.value).toFixed(0);
        if (ev.currentTarget.value <= 0) {
          ev.currentTarget.value = Math.abs(ev.currentTarget.value);
        }
        if (e.stock != '无限库存' && ev.currentTarget.value > ~~e.stock) {
          ev.currentTarget.value = e.stock;
        }
        if (ev.currentTarget.value > 999) {
          ev.currentTarget.value = 999;
        }
      }
      ev.target.value = (~~ev.target.value).toFixed(0);
      if (ev.target.value <= 0) {
        ev.target.value = Math.abs(ev.target.value);
      }
      if (e.stock != '无限库存' && ev.target.value > ~~e.stock) {
        ev.target.value = e.stock;
      }
      if (ev.target.value > 999) {
        ev.target.value = 999;
      }
      if (
        e.isShowTicketNotice == "T" &&
        (!e.readed || (!e.oldValue&&e.value))
      ) {
        this.confirm = {
          ticketNotice: e.ticketNotice,
          value: e.value,
          distPrice: e.distPrice,
          isShowTicketNotice: e.isShowTicketNotice,
          show: e.show,
          stock: e.stock,
          ticketCode: e.ticketCode,
          ticketName: e.ticketName
        };
        e.oldValue = e.value;
        this.confirm.args = arguments;
        return (this.confirmModel = true);
      }
      e.oldValue = e.value;
      if(this.goodsType == 'park') {
        this.updateTimer(item);
        let _index;
        item.ticketPurchases.map((item,index) => {
          item.show = false;
          if(item.ticketCode == e.ticketCode){
            _index = index;
          }
        });
        e.show = true;
        this.initTime(e,item,_index);
        if (e.timers&&e.isFsyy=='T'&&!e.timers.length)
        e.value = 0;
      }
      if(this.goodsType == 'hotel') {
        let item, index;
        this.data.forEach((element,inde) => {
          if (element.show) {
            item = element;
            item.roomPurchases[e._index] = e;
            index = inde;
          }
        });
        this.$set(this.data, index, item);
      }
      if(this.goodsType == 'mdse') {
        let item, index;
        this.data.forEach((element,inde) => {
          if (element.show) {
            item = element;
            item.specPurchases[e._index] = e;
            index = inde;
          }
        });
        this.$set(this.data, index, item);
      }
    },
    confirmModelOK() {
      if(this.confirm.args.length==4){
        this.confirm.args[1].readed = true;
        this.ticketNum(...this.confirm.args);
      }
      if(this.confirm.args.length==5){ // e ev item index 1
        let ticket = this.confirm.args[0];
        ticket.readed = true;
        if(!ticket.timers&&ticket.isFsyy=='T'){
          this.initTime(ticket,this.confirm.args[2],this.confirm.args[3])
        }
      }
      if(this.confirm.args.length==2){
        this.confirm.args[0].readed = true;
      }
      this.confirmModel = false;
    },
    confirmModelCancel() {
      console.log(this.confirm.args)
      if(this.confirm.args.length==5){ // e ev item index 1
        let ticket = this.confirm.args[0];
        ticket.value = 0;
      }
      this.confirmModel = false;
      // this.confirmModelOK();
    },
    submitBill() {
      let item;
      this.data.forEach(element => {
        if (element.show) {
          item = JSON.stringify(element);
        }
      });
      item = JSON.parse(item);
      let arr = [];
      if (this.goodsType == "mdse") {
        item.specPurchases.map((ele, index) => {
          if (ele.value) {
            ele.postAgePrice = 0;
            arr.push(ele);
          }
        });
        item.specPurchases = arr;
        item.goodsCode = item.mdseCode;
      }
      if (this.goodsType == "hotel") {
        item.roomPurchases.map((ele, index) => {
          if (ele.value) {
            arr.push(ele);
          }
        });
        // let date = new Date(this.occDate);
        // let date_value =
        //   date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        item.roomPurchases = arr;
        item.startDate = this.startDate;
        item.endDate = this.endDate;
      }
      if (this.goodsType == "park") {
        item.spotPay = "on";
        let warning;
        item.ticketPurchases.map((ele, index) => {
          if (ele.value) {
            if(ele.isFsyy == 'T'){
              if(ele.timer)
              arr.push({...ele,ticketNotice:'',timers:''});
              else
              warning = ele
            }else{
              arr.push({...ele,ticketNotice:'',timers:''});
            }
            if(ele.scenePay != 'on')
            item.spotPay = "off";
          }
        });
        if(!arr.length){
          this.$Message.warning(warning.ticketName+'票 未选择可售时段');
          return
        }
        let date = new Date(this.occDate);
        let date_value =
          date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        item.ticketPurchases = arr;
        item.occDate = date_value;
      }
      this.routeLink(item);
    },
    getTicket(obj) {
      let data1 = apiGet("/distmarket/myWantBuy/buyscenicFl", {
        goodsCode: obj.goodsCode + obj.ticketType
      });
      let data = new Date();
      let occDate = "";
      occDate =
        data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
      let data2 = apiGet("/distmarket/myWantBuy/getProductStockPriceForRoute", {
        goodsCode: obj.goodsCode,
        occDate: occDate
      });
      Promise.all([data1, data2]).then(list => {
        let res = list[0];
        if (res.status == 200 || res.success) {
          obj.orderSkuList = res.data.dmproductInfo.orderSkuList;
        } else {
          this.$Message.warning(res.message);
        }
        res = list[1];
        if (res.status == 200 || res.success) {
          obj.params = res.params;
          obj.stock = res.stock;
        } else {
          this.$Message.warning(res.message);
        }
        if (obj.orderSkuList)
          obj.orderSkuList.map(item => {
            item.value = 0;
            if (obj.params)
              obj.params.map(ite => {
                if (item.ticketType == ite.ticketType) {
                  item.distPrice = ite.price;
                }
              });
          });
        let time = new Date().getTime();
        let param = {
          orderInfoKey: time,
          orderInfoValue: JSON.stringify(obj)
        };
        apiPost(
          "/distmarket/webApi/distMarketPurchase/saveOrderInfoRedis",
          param
        ).then(res => {
          if (res.status == 200) {
            this.$router.push({ path: "/billInfo", query: { time: time } });
          } else {
            this.$Message.warning(res.message);
          }
        });
      });
    },
    routeLink(obj) {
      obj.modelType = obj.modelType ? obj.modelType : this.goodsType;
      if (obj.modelType == "route") {
        return this.getTicket(obj);
      }
      let time = new Date().getTime();
      let param = {
        orderInfoKey: time,
        orderInfoValue: JSON.stringify(obj)
      };
      apiPost(
        "/distmarket/webApi/distMarketPurchase/saveOrderInfoRedis",
        param
      ).then(res => {
        if (res.status == 200) {
          this.$router.push({ path: "/billInfo", query: { time: time } });
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    resetSearch() {
      // this.type.map(item=>{
      //     if(item.goodsType == this.goodsType) {
      //         this.params = item.params;
      //     }
      // });
      this.params = {
        limit: 10,
        page: 1
      };
      if (this.goodsType == "park") {
        this.params.occDate = new Date();
        this.occDate = this.params.occDate;
      } else {
        this.params.modelType = this.goodsType;
      }
      if (this.goodsType == "hotel") {
        this.params.startDate = new Date();
        this.params.endDate = new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24
        );
        this.startDate = this.params.startDate;
        this.endDate = this.params.endDate;
      }
      this.handleSubmit();
    },
    handleSubmit() {
      if (this.goodsType != "route") {
        this.occDate = this.params.occDate;
        this.startDate = this.params.startDate;
        this.endDate = this.params.endDate;
        apiGet(this.url, this.params).then(res => {
          this.loading = false;
          if (res.status == 200) {
            res.data.rows.map((item, index) => {
              item.show = false;
              if (!index) item.show = true;
              let list;
              if (this.goodsType == "park") {
                list = item.ticketPurchases;
              } else if (this.goodsType == "hotel") {
                list = item.roomPurchases;
              } else if (this.goodsType == "mdse") {
                list = item.specPurchases;
              } else {
                list = item.routeTicketPurchases;
                item.buy = false;
              }
              if (list)
                list.map((it, inde) => {
                  it.value = 0;
                  if (this.goodsType == "park" && it.isFsyy == "T") {
                    it.show = false;
                    if (!inde) it.show = true;
                    // if (!inde&&!index) 
                    // this.initTime(it,item,inde)
                  }
                });
              if(this.goodsType == "traffic"){
                item.trafficEndSites = [];
                item.trafficShiftTimes = [];
                item.endSiteCode = [];
                item.beginSiteCode = [];
                item.shiteCode = [];
                item.occDate = this.occDate;
                item.quantity = 0;
              }
            });
            this.data = res.data.rows;
            this.totals = res.data.total;
          } else {
            this.$Message.warning(res.message);
          }
        });
      } else {
        apiPost(this.url + "?" + qs.stringify(this.params), this.params).then(
          res => {
            this.loading = false;
            // if(res.status==200){
            this.data = res.rows;
            this.totals = res.total;
            // }else{
            //     this.$Message.warning(res.message);
            // }
          }
        );
      }
    },
    updateTimer(item) {
      if(!item)
      return;
      let ticket;
      for (let index = 0; index < item.ticketPurchases.length; index++) {
        const element = item.ticketPurchases[index];
        if(element.show){
          ticket = element
          break
        }
      }
      if(ticket && ticket.isFsyy == "T" && ticket.timers)
      ticket.timers.map(item=>{
        if(item.selected){
          ticket.timer = item
        }
      })
    },
    initTime(ticket,item,index){
      if(ticket.isFsyy == "T"&&!ticket.timers){
        ticket.loading = true;
        apiGet("/distmarket/webApi/distMarketPurchase/timeReserveList", {
          modelCode: ticket.ticketCode,
          startTime: this.params.occDate,
          endTime: this.params.occDate
        }).then(res => {
          ticket.loading = false;
          if (res.status == 200) {
            if (res.data.code == 1) {
              ticket.timers = res.data.fsStockDtos;
              let _index,_item;
              if(ticket.timer) {
                ticket.timers.map((item,index)=>{
                  if(item.startTime == ticket.timer.startTime && item.endTime == ticket.timer.endTime) {
                    item.selected = true;
                    _index = index;
                    _item = item;
                  }
                })
                this.$set(ticket.timers,_index,_item);
              }else if(ticket.timers.length){
                if(ticket.timers[0] instanceof Object && ticket.timers[0].num){
                  ticket.timers[0].selected = true;
                  _index = 0;
                  _item = ticket.timers[0];
                  ticket.timer = ticket.timers[0];
                }
                this.$set(ticket.timers,_index,_item);
              }else{
                ticket.value = 0;
              }
              this.$set(item.ticketPurchases,index,ticket);
            } else {
              this.$Message.warning(res.data.msg);
            }
          } else {
            this.$Message.warning(res.message);
          }
        });
      }
    },
    timeIt(index,ite,ticket,item,_index) {
      if(ite.locked||ite.selected){
        return
      }
      ticket.timer = ite;
      ticket.timers.map(item=>{
        item.selected = false;
      })
      ite.selected = true
      // this.$set(ticket.timers, index, ite);
      this.$set(item.ticketPurchases, _index, ticket);
    },
    setNum(index, ite) {
      let item;
      this.data.map(it => {
        if (it.show) item = it;
      });
      let list;
      if (this.goodsType == "park") {
        list = item.ticketPurchases;
      } else if (this.goodsType == "hotel") {
        list = item.roomPurchases;
      } else if (this.goodsType == "mdse") {
        list = item.specPurchases;
      } else {
        list = item.roomPurchases;
      }
      this.$set(list, index, ite);
    },
    numOpt(bool, ticket) {
      if (!ticket.distPrice && ticket.distPrice !== 0) {
        return;
      }
      ticket.value = Math.abs(Number(ticket.value).toFixed(0));
      if (bool) {
        if (ticket.value < ticket.stock || ticket.stock == "无限库存")
          ticket.value += 1;
      } else {
        ticket.value = ticket.value > 1 ? ticket.value - 1 : 0;
      }
      ticket.oldValue = ticket.value;
    },
    ticketReaded(bool, ticket, item, inde) {
      ticket.value = Math.abs(Number(ticket.value).toFixed(0));
      if (
        ticket.isShowTicketNotice == "T" &&
        (!ticket.readed || !ticket.value) &&
        bool && (ticket.distPrice || ticket.distPrice === 0) &&
        ticket.value >= 0
      ) {
        this.confirm = {
          ticketNotice: ticket.ticketNotice,
          value: ticket.value,
          distPrice: ticket.distPrice,
          isShowTicketNotice: ticket.isShowTicketNotice,
          show: ticket.show,
          stock: ticket.stock,
          ticketCode: ticket.ticketCode,
          ticketName: ticket.ticketName
        };
        this.confirm.args = arguments;
        return (this.confirmModel = true);
      }
      this.ticketNum(...arguments);
    },
    ticketNum(bool, ticket, item, inde) {
      if(ticket.timers&&!ticket.timers.length&&ticket.isFsyy=='T'||!ticket.value&&!bool)
      return
      item.ticketPurchases.map(item => {
        item.show = false;
      });
      ticket.show = true;
      this.initTime(ticket,item,inde);
      this.numOpt(bool, ticket);
      this.$set(item.ticketPurchases, inde, ticket);
    },
    show(item, index, bool) {
      let _item;
      this.data.map(item => {
        if(item.show)
        _item = item;
        item.show = false;
      });
      if(this.goodsType=='park')
      this.updateTimer(_item);
      item.show = bool;
      // if(item.ticketPurchases.length&&item.ticketPurchases[0] instanceof Object)
      // this.initTime(item.ticketPurchases[0],item,index);
      this.$set(this.data, index, item);
    },
    sizeChange(num) {
      this.params.limit = num;
      this.handleSubmit();
    },
    changepage(num) {
      this.params.page = num;
      this.handleSubmit();
    },
    curChange(index) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.data = [];
      this.url = this.type[index].url;
      this.params = this.type[index].params;
      this.columns = this.type[index].columns;
      this.goodsType = this.type[index].goodsType;
      this.searchItems = this.type[index].searchItems;

      this.$store.state.list.url = this.url;
      this.$store.state.list.params = this.params;

      this.handleSubmit();
    },
    inputChange() {
      this.params.page = 1;
    },
    dateChange(arg) {
      this.params.occDate = arg;
      this.params.page = 1;
    },
    //处理起始日期
    setBegDate(time) {
      this.params.startDate = time;
      this.options1 = {
        disabledDate: date => {
          let startTime = this.params.startDate
            ? new Date(this.params.startDate).valueOf() -
              1 * 24 * 60 * 60 * 1000
            : "";
          return date && date.valueOf() < startTime;
        }
      };
      this.params.page = 1;
    },
    //处理结束日期
    setEndDate(time) {
      if (time) {
        this.params.endDate = time;
        let endTime = this.params.endDate
          ? new Date(this.params.endDate).valueOf()
          : "";
        this.options0 = {
          disabledDate(date) {
            return date && date.valueOf() > endTime || date.valueOf() < Date.now() - 86400000;
          }
        };
      } else {
        this.options0 = {
          disabledDate(date) {
            return false;
          }
        };
      }
      this.params.page = 1;
    }
  }
};
</script>
<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}
.resultOpt {
  .resultTable {
    td.numOpt {
      font-weight: 100;
      user-select: none;
      line-height: 30px;
      text-align: center;
      vertical-align: middle;
      overflow: hidden;
      font-size: 24px;
      border-radius: 3px;
      color: #c0c7d8;
      input {
        width: 70px;
        outline: none;
        font-size: 14px;
        height: 30px;
        border: none;
        color: #413838;
        text-align: center;
        vertical-align: middle;
        border-bottom: 1px solid #dcdfe6;
        border-top: 1px solid #dcdfe6;
      }
      span {
        width: 30px;
        background-color: #f5f7fa;
        cursor: not-allowed;
        display: inline-block;
        border: 1px solid #dcdfe6;
        vertical-align: middle;
      }
      .priceLessInput {
        color: #c0c7d8;
        cursor: not-allowed;
      }
      .numOptBtn {
        color: #413838;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.boxShadow {
  border-radius: 3px;
  margin-bottom: 20px;
  background-color: #f3f7fe;
  border-top: 1px solid #e9eaec;
  border-bottom: 1px solid #e9eaec;
}
.indexTitle {
  display: flex;
  padding-top: 8px;
  padding-left: 7px;
  line-height: 48px;
  font-size: 14px;
  color: #999999;
  text-align: center;
  border-bottom: 1px solid #e9eaec;
  .cur {
    color: #413838;
    border-bottom: 2px solid #2db6f4;
  }
  div {
    cursor: pointer;
    width: 120px;
    margin-right: 25px;
  }
}
.formSearch {
  background-color: #fff;
  padding: 20px;
  .ivu-form-item {
    margin-right: 20px;
    margin-bottom: 0px;
  }
  .handleSubmit {
    margin-left: 50px;
    margin-right: 30px;
  }
  .formSearchBtn {
    width: 86px;
  }
}
.resultList {
  position: relative;
  .resultItem {
    margin-bottom: 10px;
    .itemInfo {
      display: flex;
      padding: 20px 0px 20px;
      margin-bottom: 0px;
      .infoImg {
        padding-left: 20px;
        img {
          width: 232px;
          height: 146px;
          line-height: 0px;
          border-radius: 3px;
        }
      }
      .infoBtn {
        padding-right: 30px;
        align-self: center;
        text-align: center;
        font-size: 14px;
        line-height: 30px;
        color: #413838;
        .infoShow {
          background-color: #f05b47;
          border: 1px solid #f05b47;
          border-radius: 3px;
          cursor: pointer;
          width: 86px;
          color: #fff;
        }
        .infoBtnHide {
          width: 86px;
          background-color: #fff;
        }
      }
      .infoTxt {
        flex-grow: 1;
        padding-left: 40px;
        font-size: 12px;
        line-height: 12px;
        color: #666;
        .infoTitle {
          color: #413838;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 18px;
          line-height: 38px;
          font-weight: bold;
        }
        .infoSource {
          padding-top: 10px;
          color: #5c5c5c;
        }
        .infoType {
          padding-top: 10px;
          .infoLevel {
            margin-right: 25px;
            color: #f05b47;
          }
        }
      }
    }
    .itemInfoShow {
      border-bottom: 1px solid #f0f0f0;
    }
    .resultOpt {
      .resultTable {
        display: table;
        width: 100%;
        line-height: 52px;
        font-weight: bold;
        color: #413838;
        text-align: center;
        .resultThead {
          display: table-row;
          font-weight: bold;
          .resultTh {
            display: table-cell;
            border-bottom: 1px solid #e9eaec;
          }
        }
        .resultTbody {
          display: table-row-group;
          .resultBCGF9 {
            background-color: #fbfcff;
          }
          .resultTr {
            display: table-row;
            .resultTd {
              display: table-cell;
              border-bottom: 1px solid #e9eaec;
              .isRealName {
                display: inline-block;
                width: 49px;
                text-align: center;
                line-height: 20px;
                color: #fff;
                border-radius: 3px;
                margin-left: 5px;
                background-color: #df4949;
              }
            }
            .numOpt {
              min-width: 150px;
              font-weight: 100;
              user-select: none;
              line-height: 30px;
              text-align: center;
              vertical-align: middle;
              overflow: hidden;
              font-size: 24px;
              border-radius: 3px;
              color: #c0c7d8;
              input {
                width: 70px;
                outline: none;
                font-size: 14px;
                height: 30px;
                border: none;
                color: #413838;
                text-align: center;
                vertical-align: middle;
                border-bottom: 1px solid #dcdfe6;
                border-top: 1px solid #dcdfe6;
              }
              span {
                width: 30px;
                background-color: #f5f7fa;
                cursor: not-allowed;
                display: inline-block;
                border: 1px solid #dcdfe6;
                vertical-align: middle;
              }
              .priceLessInput {
                color: #c0c7d8;
                cursor: not-allowed;
              }
              .numOptBtn {
                color: #413838;
                cursor: pointer;
              }
            }
          }
          .timeShow {
            .resultTd {
              border: none;
            }
          }
          .resultTimeList {
            display: table-row;
            .timeTd {
              border-bottom: 1px solid #e9eaec;
              display: table-cell;
            }
            .timerNone {
              color: #f05b47;
            }
            .resultTime {
              display: inline-block;
              cursor: pointer;
              vertical-align: middle;
              line-height: 36px;
              text-align: center;
              border-radius: 3px;
              margin-right: 15px;
              width: 80px;
              border: 1px solid #e4e7ed;
              background-color: #fff;
            }
            .resultTimeSel {
              background-color: #f05b47;
              color: #fff;
            }
            .resultTime0 {
              color: #ccc;
              background-color: #f5f7fa;
            }
          }
        }
      }
      .resultTotal {
        padding-left: 20px;
        display: flex;
        border-bottom: 1px solid #e9eaec;
        .totalInfo {
          flex-grow: 1;
          text-align: left;
          font-size: 14px;
          line-height: 54px;
          color: #413838;
          .totalNum {
            line-height: 28px;
            span {
              color: #fc4150;
              em {
                font-size: 28px;
                font-style: normal;
              }
            }
          }
        }
        .totalBtn {
          text-align: center;
          div {
            width: 210px;
            cursor: pointer;
            line-height: 95px;
            color: #fff;
            font-size: 18px;
            background-color: #cbcbcb;
          }
          .totalBtnSub {
            background-color: #f05b47;
          }
        }
      }
    }
  }
}
</style>