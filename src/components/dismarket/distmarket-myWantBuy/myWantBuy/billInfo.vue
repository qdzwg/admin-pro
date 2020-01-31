<template>
    <div class="billContentDefault" :class='{billContentMdse: goodsType=="mdse"}'>
        <Row :gutter="24" class="btn-groups infoTitleStyle">
            <Col span="12" v-if="goodsType=='park'"> {{data.parkName}}
            <span>游玩日</span>
            <span>{{occDate}}</span>
            </Col>
            <Col span="12" v-if="goodsType=='route'">
            <span>游玩日</span>
            <DatePicker :clearable='false' v-model="occDate" @on-change="dateChange" :options="options3" format="yyyy-MM-dd" type="date" placeholder="请选择游玩日期"></DatePicker>
            <span>库存：{{this.data.stock||0}}</span>
            </Col>
            <Col span="24" v-if="goodsType=='hotel'">
              <span>入住日期</span>
              <span>{{startDate}}</span>
              <span>离店日期</span>
              <span>{{endDate}}</span>
            </Col>
            <Col span="24" v-if="goodsType=='mdse'">
            {{data.mdseName}}
            </Col>
            <!-- <Col span="24" v-if="goodsType=='hotel'"> 入住日期
            <DatePicker :clearable='false' :editable="false" v-model="startDate" @on-change="setBegDate" type="date" :options="options0" format="yyyy-MM-dd"></DatePicker>
            离店日期
            <DatePicker :clearable='false' :editable="false" v-model="endDate" @on-change="setEndDate" type="date" :options="options1" format="yyyy-MM-dd"></DatePicker>
            </Col> -->
        </Row>
        <div class="resultList">
            <div class="resultItem">
                <div class="resultOpt">
                    <div class="resultTable" v-if="goodsType=='park'">
                        <div class="resultThead">
                            <div class="resultTh">{{goodsType=='park'?'票型名称':(goodsType=='mdse'?'商品规格':(goodsType=='hotel'?'房型':'票型'))}}</div>
                            <div class="resultTh">结算价格</div>
                            <div class="resultTh">库存</div>
                            <div class="resultTh">游玩时段</div>
                            <div class="resultTh">预定数量</div>
                        </div>
                        <div class="resultTbody" v-for="(ticket,inde) in data.ticketPurchases" :key='inde'>
                            <div class="resultTr" :class='{resultBCGF9: !(inde%2)}'>
                                <div class="resultTd">{{ticket.ticketName}}
                                    <span class="isRealName" v-if='ticket.isRealName=="T"'>实名制</span>
                                </div>
                                <div class="resultTd">{{ticket.distPrice?(ticket.distPrice=='无'?'--':('￥'+ticket.distPrice)):(ticket.distPrice===0?0:'--')}}</div>
                                <div class="resultTd">{{ticket.stock}}</div>
                                <div class="resultTd">{{ticket.timer?ticket.timer.startTime+'-'+ticket.timer.endTime:''}}</div>
                                <div class="resultTd numOpt">
                                    <span :class="{numOptBtn:ticket.value>0}" @click='ticketNum(0,ticket,data,inde)'>-</span><input @change='ticketNumInput(ticket,data,inde)' @input='ticketNumInput(ticket,data,inde)' :readonly='!ticket.distPrice&&ticket.distPrice!==0' :class="{priceLessInput: !ticket.distPrice&&ticket.distPrice!==0}" type="number" v-model="ticket.value"><span :class="{numOptBtn:(ticket.value<ticket.stock||ticket.stock=='无限库存')&&(ticket.distPrice||ticket.distPrice===0)}" @click='ticketNum(1,ticket,data,inde)'>+</span>
                                </div>
                            </div>
                            <div class="resultTimeList" v-if='ticket.show&&false'>
                                <span class="resultTime" @click='timeIt(ind)' :class='{resultTimeSel: timeSel==ind,resultTime0: ind%3}' v-for="(ite,ind) in timer" :key='ind'>11.10-12.20</span>
                            </div>
                        </div>
                    </div>
                    <div class="resultTable" v-else-if="goodsType=='route'">
                        <div class="resultThead">
                            <div class="resultTh">票型名称</div>
                            <div class="resultTh">结算价格</div>
                            <div class="resultTh">预定数量</div>
                        </div>
                        <div class="resultTbody" :class='{resultBCGF9: !(inde%2)}' v-for="(sku,inde) in data.orderSkuList" :key='inde'>
                            <div class="resultTr">
                                <div class="resultTd">{{sku.modelName}}</div>
                                <div class="resultTd">{{sku.distPrice=='-1'?'--':(sku.distPrice=='无'?'--':('￥'+sku.distPrice))}}</div>
                                <div class="resultTd numOpt">
                                    <span :class="{numOptBtn:sku.value>0}" @click='skuNum(0,sku,inde)'>-</span><input @change='skuNumInput(sku,inde)' @input='skuNumInput(sku,inde)' :readonly="(!sku.distPrice||sku.distPrice==='无'||sku.distPrice===-1)&&sku.distPrice!==0" :class="{priceLessInput: (!sku.distPrice||sku.distPrice=='无'||sku.distPrice==-1)&&sku.distPrice!==0}" type="number" v-model="sku.value"><span :class="{numOptBtn:(sku.value<data.stock||data.stock=='无限库存')&&(sku.distPrice||sku.distPrice===0)&&sku.distPrice!='无'&&sku.distPrice!=-1}" @click='skuNum(1,sku,inde)'>+</span>
                                    <!-- <Button size="small" @click='skuNum(0,sku,inde)' type="text">-</Button><input style="width:30px;line-height:20px;" type="text" v-model="sku.value" readonly><Button type="text" size="small" @click='skuNum(1,sku,inde)'>+</Button> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="resultTable" v-else-if="goodsType=='hotel'">
                        <div class="resultThead">
                            <div class="resultTh">房型</div>
                            <div class="resultTh">结算价格</div>
                            <div class="resultTh">库存</div>
                            <div class="resultTh">预定数量</div>
                        </div>
                        <!-- <div class="resultTbody">
                            <div class="resultTr resultBCGF9">
                                <div class="resultTd">{{data.goodsName}}</div>
                                <div class="resultTd">{{(data.closePriceSectionShow=='无'||data.closePriceSectionShow=='-1')?'--':('￥'+data.closePriceSectionShow)}}</div>
                                <div class="resultTd">{{data.stock}}</div>
                                <div class="resultTd numOpt">
                                    <span :class="{numOptBtn:value>0}" @click='otherTicketNum(0,data.stock)'>-</span><input @change='otherTicketNumInput(data.stock)' @input='otherTicketNumInput(data.stock)' :readonly="!data.closePriceSectionShow && data.closePriceSectionShow!==0 && data.closePriceSectionShow=='无'" :class="{priceLessInput: data.closePriceSectionShow!==0&&!data.closePriceSectionShow&&data.closePriceSectionShow=='无'}" type="number" v-model="value"><span :class="{numOptBtn:(value<data.stock||data.stock=='无限库存')&&(data.closePriceSectionShow||data.closePriceSectionShow===0)&&data.closePriceSectionShow!='无'}" @click='otherTicketNum(1,data.stock)'>+</span>
                                </div>
                            </div>
                        </div> -->
                        <div class="resultTbody" v-for="(room,inde) in data.roomPurchases" :key='inde'>
                            <div class="resultTr" :class='{resultBCGF9: !(inde%2)}'>
                                <div class="resultTd">{{room.roomName}}</div>
                                <div class="resultTd">{{room.distPrice?(room.distPrice=='无'?'--':('￥'+room.distPrice)):(room.distPrice===0?0:'--')}}</div>
                                <!-- <div v-if="goodsType=='park'" class="resultTd">{{room.stock}}</div> -->
                                <div class="resultTd">{{room.stock}}</div>
                                <div class="resultTd numOpt">
                                    <span :class="{numOptBtn:room.value>0}" @click='roomNum(0,room,data,inde)'>-</span><input @change='roomNumInput(room,data,inde)' @input='roomNumInput(room,data,inde)' :readonly='!room.distPrice&&room.distPrice!==0' :class="{priceLessInput: !room.distPrice&&room.distPrice!==0}" type="number" v-model="room.value"><span :class="{numOptBtn:(room.value<room.stock||room.stock=='无限库存')&&(room.distPrice||room.distPrice===0)}" @click='roomNum(1,room,data,inde)'>+</span>
                                </div>
                            </div>
                            <div class="resultTimeList" v-if='room.show&&false'>
                                <span class="resultTime" @click='timeIt(ind)' :class='{resultTimeSel: timeSel==ind,resultTime0: ind%3}' v-for="(ite,ind) in timer" :key='ind'>11.10-12.20</span>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="resultTable" v-else>
                        <div class="resultThead">
                            <div class="resultTh">商品名称</div>
                            <div class="resultTh">商品规格</div>
                            <div class="resultTh">结算价格</div>
                            <div class="resultTh">库存</div>
                            <div class="resultTh">预定数量</div>
                        </div>
                        <div class="resultTbody">
                            <div class="resultTr">
                                <div class="resultTd">{{data.goodsName}}</div>
                                <div class="resultTd">
                                    <div class="orderSkuList">
                                        <div class="orderSkuItem" v-for="(sku,index) in skuList" :key='index'>
                                            <div class="orderSkuKey">{{sku.specification}}</div>
                                            <div class="orderSkuValues">
                                                <div class="orderSkuValue" @click='skuChange(ele,sku.specification,index,inde)' :class="{orderSkuValueCurrent: currentSku[index]===inde}" v-for="(ele,inde) in sku.list" :key='inde'>{{ele}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="resultTd">{{(closePriceSectionShow=='无'||closePriceSectionShow=='-1')?'--':('￥'+closePriceSectionShow)}}</div>
                                <div class="resultTd">{{stock}}</div>
                                <div class="resultTd numOpt">
                                    <span :class="{numOptBtn:value>0&&closePriceSectionShow!='无'}" @click='otherTicketNum(0,stock)' type="text">-</span><input @input='otherTicketNumInput(stock)' @change='otherTicketNumInput(stock)' :class="{priceLessInput: (!closePriceSectionShow||closePriceSectionShow=='无')&&closePriceSectionShow!==0}" :readonly="(!closePriceSectionShow||closePriceSectionShow=='无')&&closePriceSectionShow!==0" type="number" v-model="value"><span :class="{numOptBtn:(value<stock||stock=='无限库存')&&closePriceSectionShow!='无'&&closePriceSectionShow!=='undefined'}" @click='otherTicketNum(1,stock)'>+</span>
                                    <Button size="small" @click='otherTicketNum(0,stock)' type="text">-</Button><input style="width:30px;line-height:20px;" type="text" v-model="value" readonly><Button type="text" size="small" @click='otherTicketNum(1,stock)'>+</Button>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <div class="mdseTableWrap" v-else>
                      <Table :columns="columns" :data="data.specPurchases"></Table>
                    </div>
                </div>
            </div>
        </div>
        <div class="listInfo">
            <div class="infoTitle infoTitleStyle">{{goodsType=='mdse'?'收货人信息':'取票人信息'}}</div>
            <div class="infoWrap" v-if='guides.length'>
                <!-- <div class="addressListWrap" v-if='goodsType=="mdse"'>
                <div class="addressList">
                    <div class="addressItem" @click='guideEle(item)' :class='{addressDefault: item.defaultFlag}' v-if='more||!more&&inde<2' v-for="(item,inde) in guides" :key='inde'>
                        <span class='default' v-if='item.defaultFlag'>默</span>
                        <div class="itemLine">
                            <div class="lineInfo">
                                收货人：<span>{{item.name}}</span>
                            </div>
                            <div class="lineInfo linePhone">
                                手机号码：<span>{{item.phone}}</span><a href="javascript:void(0);" @click='setDefault(item)' class="setDefault">设置默认</a><a href="javascript:void(0);" @click='guideDel(item)'>删除</a>
                            </div>
                        </div>
                        <div class="itemLine">
                            <div class="lineInfo">
                                收货地址：<span>{{item.address}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="addressMore" v-if='!more&&guides.length>2'>
                        <a href="javascript:;" @click='more=true'>加载更多</a>
                    </div>
                </div>
            </div> -->
                <div class="guideListWrap">
                    <div class="guideList">
                        <div class="guideItem" :class="{guideItemSel: ele.selected,guideItemAddress:goodsType=='mdse'}" @click='guideEle(ele,index)' v-for="(ele,index) in guides" :key='index'>
                            <!-- <span @click='guideEle(ele)'>{{ele.name}}</span><Icon type="close" @click='guideDel(ele)'></Icon> -->
                            <div class="guideDefault" v-if='ele.defaultFlag'>默认</div>
                            <div class="guideSetDefault" @click='setDefault(ele)' v-if='!ele.defaultFlag&&ele.selected'>设为默认</div>
                            <div class="guideSelected" v-if='ele.selected'></div>
                            <div class="guideName">
                                <span>{{ele.name}}</span>
                                <i class="xx-icon icon-shanchu" v-if='ele.selected' @click='guideDel(ele)'></i>
                            </div>
                            <!-- <div class="guideInfo" v-if='goodsType=="mdse"'>{{ele.locationName?ele.locationName:''}}{{ele.address?ele.address:''}}{{'&nbsp;&nbsp;'+ele.phone}}</div> -->
                            <div class="guideInfo">{{ele.phone}}</div>
                            <!-- <div class="guideInfo" v-else>{{ele.phone}}</div> -->
                            <div class="guideModify" v-if='ele.selected'>
                                <a href="javascript:void(0);" @click='guideModify(ele,index)'>修改</a>
                            </div>
                        </div>
                    </div>
                    <div class="guideNew">
                        <a @click='guideModify()'>{{goodsType=="mdse"?"使用新地址":"使用新联系人"}}</a>
                    </div>
                </div>
            </div>
            <div class="infoWrap" v-else>
                <Form :model="formItem" label-position="right" :label-width="110" ref="formItem" :rules="ruleForm">
                    <!-- <FormItem label="是否自提：">
                        <RadioGroup v-model="delivery">
                            <Radio @on-change='deliveryChange' label="自提" v-if="deliveryStatus=='T'"></Radio>
                            <Radio label="快递"></Radio>
                        </RadioGroup>
                    </FormItem> -->
                    <FormItem label="取票人：" prop="name">
                        <Input style="width:180px;" v-model="formItem.name" :maxlength="10" placeholder="请填写取票人"></Input>
                        <a @click='saveGuide' href="javascript:void(0);">保存为常用信息</a>
                    </FormItem>
                    <FormItem label="手机：" prop="phone">
                        <Input style="width:180px;" v-model="formItem.phone" placeholder="请填写手机"></Input>
                    </FormItem>
                    <FormItem label="身份证：">
                        <Input style="width:180px;" v-model="formItem.idNo" placeholder="请填写身份证"></Input>
                    </FormItem>
                    <!-- <FormItem label="提货地址：" v-if="delivery=='自提'" prop="deliveryAddress">
                        <Select v-model="formItem.deliveryAddress" style="width:180px">
                            <Option v-for="sitem in deliveryList" :value="sitem.key" :key="sitem.key">{{ sitem.value }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所在地区：" v-if="delivery=='快递'" prop="locationCode">
                        <select-item ref="select" style="width:180px;" :addrCode="formItem.locationCode" :span='8' @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
                    </FormItem>
                    <FormItem label="详细地址：" v-if="delivery=='快递'" prop="address">
                        <Input style="width:180px;" v-model="formItem.address" placeholder="请填写详细地址"></Input>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                        <Input style="width:180px;" v-model="formItem.remark" placeholder="请填写备注"></Input>
                    </FormItem> -->
                </Form>
            </div>
        </div>
        <div class="listInfo" v-for="(ele,index) in list" :key='index' v-if="goodsType=='park'">
            <div class="infoTitle infoTitleStyle">【{{ele.ticketName}}】实名制信息
                <Upload :ref="'upload'+index" :show-upload-list="false" :on-success="handleSuccess" :data='{amount:ele.form.length,index:index}' :format="['xlsx','xls']" :max-size="3072" :on-exceeded-size="handleMaxSize" action="/distmarket/webApi/uploadTemplate/uploadReallyName" style="display: inline-block;width:58px;">
                    <a href="javascript:void(0);" @click='handleBeforeUpload(index)'>导入</a>
                </Upload>
                <a href="/distmarket/reallyName.xlsx">下载模板</a>
            </div>
            <div class="guideFormList">
                <Form class="guideForm" v-for="(item,inde) in ele.form" :key='inde' :ref='"form"+index+"-"+inde' label-position="right" :label-width="100" :model="item" inline :rules="ruleForm">
                    <FormItem label="姓名：" prop="name">
                        <Input style="width:200px;" type="text" :maxlength="10" v-model="item.name" placeholder="游客姓名"></Input>
                    </FormItem>
                    <FormItem label="身份证：" prop="certNo">
                        <Input style="width:200px;" type="text" v-model="item.certNo" placeholder="游客身份证"></Input>
                    </FormItem>
                </Form>
            </div>
        </div>
        <div style="padding:0px 0px 20px;" :style="{'padding-bottom':padding}">
            <Form v-if='goodsType=="mdse"' :model="formOther" label-position="right" :label-width="110" ref="formOther" :rules="ruleForm">
                <FormItem label="是否自提：">
                    <RadioGroup @on-change='deliveryChange' v-model="delivery">
                        <Radio label="快递" >快递</Radio>
                        <Radio label="自提" v-show="deliveryStatus=='T'">自提</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="提货地址：" v-show="delivery=='自提'" prop="deliveryAddress" :rules="[{required: delivery=='自提', message: '请选择提货地址' }]">
                    <Select v-model="formOther.deliveryAddress" style="width:360px">
                        <Option v-for="sitem in deliveryList" :value="sitem.key" :key="sitem.key">{{ sitem.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所在地区：" v-if="delivery=='快递'" prop="locationCode">
                    <select-item ref="select" style="min-width:180px;width:520px;" :addrCode="formOther.locationCode" :span='8' @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
                </FormItem>
                <FormItem label="详细地址：" v-if="delivery=='快递'" prop="address">
                    <Input style="min-width:180px;width:520px;" :maxlength="30" v-model="formOther.address" placeholder="请填写详细地址"></Input>
                </FormItem>
                <FormItem label="备注：" prop="remark">
                    <Input style="min-width:180px;width:520px;" :maxlength="60" v-model="formOther.remark" placeholder="请填写备注"></Input>
                </FormItem>
            </Form>
            <Form v-else :model="formOther" label-position="right" :label-width="110" ref="formOther" :rules="ruleForm">
                <FormItem label="是否到付：" v-show="goodsType=='park'&&data.spotPay=='on'">
                    <RadioGroup @on-change='deliveryChange' v-model="formOther.spotPay">
                        <Radio label="off">否</Radio>
                        <Radio label="on">是</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="备注：" prop="remark">
                    <Input style="min-width:180px;width:520px;" :maxlength="60" v-model="formOther.remark" placeholder="请填写备注"></Input>
                </FormItem>
            </Form>
        </div>
        <div class="resultOpt resultFixed">
            <div class="delivery" v-if="delivery=='快递'&&goodsType=='mdse'">运送方式：
                <span>快递{{ data.shipType == 0 ? " 包邮" : (postAgePrice?("￥"+(postAgePrice).toFixed(2)):" 包邮") }}</span>
            </div>
            <div class="resultTotal" v-if='goodsType=="park"||goodsType=="route"'>
                <!-- <div class="totalInfo" v-if='goodsType=="park"||goodsType=="route"'>
                    <div class="totalNum">总数量：<span>{{total.num}}</span>张</div>
                    <div class="totalNum">合计：<span>{{isNaN(total.price)?'暂无':('￥'+(total.price).toFixed(2))}}</span></div>
                    <Button type="primary" @click='submitBill()'>提交订单</Button>
                </div> -->
                <div class="totalInfo">
                    <div>总数量：{{total.num}}张</div>
                    <div class="totalNum">合计：
                        <span>
                            <em>{{isNaN(total.price)?'暂无':('￥'+(total.price).toFixed(2))}}</em>
                        </span>
                    </div>
                </div>
                <!-- <div class="totalBtnFail" v-if="flagShow=='fail'">
                    <div>提交订单</div>
                </div> -->
                <div class="totalBtn">
                  <div v-if="loading">
                    <Spin style="height:95px;">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中...</div>
                    </Spin>
                  </div>
                  <div v-else @click='guidesValidate("submitBill")'>提交订单</div>
                </div>
            </div>
            <div class="resultTotal" v-else-if='goodsType=="mdse"'>
                <!-- <div class="totalInfo" v-else-if='goodsType=="mdse"'>
                    <div class="totalNum">总数量：<span>{{value}}</span></div>
                    <div class="totalNum" v-if="delivery=='快递'">运费：<span>￥{{postAgePrice?postAgePrice:'0'}}</span></div>
                    <div class="totalNum">合计：<span>￥{{data.modelCode?(closePriceSectionShow*value).toFixed(2):'0'}}</span></div>
                    <Button type="primary" @click='submitRoute()'>提交订单</Button>
                </div> -->
                <div class="totalInfo">
                    <div>总数量：{{total.num}}</div>
                    <div class="totalNum">合计：
                        <span>
                            <em>{{isNaN(total.price)?'暂无':('￥'+(total.price).toFixed(2))}}</em>
                        </span>
                    </div>
                </div>
                <!-- <div class="totalBtnFail" v-if="flagShow=='fail'">
                    <div>提交订单</div>
                </div> -->
                <div class="totalBtn">
                  <div v-if="loading">
                    <Spin style="height:95px;">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中...</div>
                    </Spin>
                  </div>
                  <div v-else @click='guidesValidate("otherCallBack")'>提交订单</div>
                </div>
            </div>
            <div class="resultTotal" v-else>
                <!-- <div class="totalInfo">
                    <div class="totalNum">总数量：<span>{{value}}</span>间</div>
                    <div class="totalNum">合计：<span>{{isNaN(data.closePriceSectionShow)?'暂无':('￥'+(data.closePriceSectionShow*value).toFixed(2))}}</span></div>
                    <Button type="primary" @click='submitRoute()'>提交订单</Button>
                </div> -->
                <div class="totalInfo">
                    <div>总数量：{{total.num}}间{{total.date}}晚</div>
                    <div class="totalNum">合计：
                        <span>
                            <em>￥{{total.price}}</em>
                        </span>
                    </div>
                </div>
                <!-- <div class="totalBtnFail">
                    <div>提交订单</div>
                </div> -->
                <div class="totalBtn">
                  <div v-if="loading">
                    <Spin style="height:95px;">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中...</div>
                    </Spin>
                  </div>
                  <div v-else @click='guidesValidate("otherCallBack")'>提交订单</div>
                </div>

            </div>
        </div>
        <confirm ref="confirmModel" sucessMsg="操作成功！" content="确认取消采购吗？" mode="done"></confirm>
        <confirm ref="submitModel" title='请注意' content="你所提交的信息已经审核通过，请及时跟进申请状况。如有问题，请联系审核人员或者拨打客服电话400-400-400。" mode="done"></confirm>
        <!-- 弹出层 -->
        <Modal v-model="modal" :title="modalTitle" width='750' @on-cancel="modalCancel">
            <Form :model="formItem" label-position="right" :label-width="250" ref="formItemW" :rules="ruleForm">
                <!-- <FormItem label="是否自提：">
                <RadioGroup v-model="delivery">
                    <Radio @on-change='deliveryChange' label="自提" v-if="deliveryStatus=='T'"></Radio>
                    <Radio label="快递"></Radio>
                </RadioGroup>
            </FormItem> -->
                <FormItem label="取票人：" prop="name">
                    <Input style="width:180px;" v-model="formItem.name" :maxlength="10" placeholder="请填写取票人"></Input>
                </FormItem>
                <FormItem label="手机：" prop="phone">
                    <Input style="width:180px;" v-model="formItem.phone" placeholder="请填写手机"></Input>
                </FormItem>
                <FormItem label="身份证：">
                    <Input style="width:180px;" v-model="formItem.idNo" placeholder="请填写身份证"></Input>
                </FormItem>
                <!-- <FormItem label="提货地址：" v-if="delivery=='自提'" prop="deliveryAddress">
                <Select v-model="formItem.deliveryAddress" style="width:180px">
                    <Option v-for="sitem in deliveryList" :value="sitem.key" :key="sitem.key">{{ sitem.value }}</Option>
                </Select>
            </FormItem>
            <FormItem label="所在地区：" v-if="delivery=='快递'" prop="locationCode">
                <select-item ref="select" style="width:300px;" :addrCode="formItem.locationCode" :span='8' @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
            </FormItem>
            <FormItem label="详细地址：" v-if="delivery=='快递'" prop="address">
                <Input style="width:180px;" v-model="formItem.address" placeholder="请填写详细地址"></Input>
            </FormItem>
            <FormItem label="备注：" prop="remark">
                <Input style="width:180px;" v-model="formItem.remark" placeholder="请填写备注"></Input>
            </FormItem> -->
                <FormItem>
                    <Checkbox v-model="formItem.defaultFlag">设置为默认联系人</Checkbox>
                </FormItem>
                <FormItem>
                    <Button type="primary" size="large" @click="saveGuide">保存</Button>
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import confirm from "@/components/global/confirm";
import selectItem from "@/components/global/selectList";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      columns: [
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
        title: '结算价格',
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
                        this.mdseNum(0,params.row,this.data,params.index);
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
                      this.mdseNumInput(params.row,this.data,params.index,event);
                    },
                    input: () => {
                      this.mdseNumInput(params.row,this.data,params.index,event);
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
                        this.mdseNum(1,params.row,this.data,params.index);
                    }
                }
            }, '+'))
            return arr
          }
        }
      ],
      hadOpen: false,
      flagShow: "success",
      loadingSpin: false,
      loading: false,
      modal: false,
      modalTitle: "创建",
      sheng: "",
      city: "",
      qu: "",
      province: "",
      shi: "",
      area: "",
      postageIsFree: false, // 包邮
      delivery: "",
      deliveryStatus: "F",
      deliveryList: [],
      stock: 0,
      closePriceSectionShow: 0,
      value: 1,
      currentSku: {}, // 当前规格
      skuList: [], // 规格列表
      orderSkuList: [], //商品列表
      guides: [],
      address: [],
      current: 0,
      more: false,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      options0: {},
      options1: {},
       options3: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      postAgePrice: 0,
      formItem: {
        name: "",
        phone: "",
        idNo: "",
        remark: "",
        locationCode: ""
      },
      formOther: {
        name: "",
        phone: "",
        idNo: "",
        spotPay: "off", // 是否到付
        remark: "",
        locationCode: ""
      },
      ruleForm: {
        name: [{ required: true, message: "请填写取票人", trigger: "blur" }],
        phone: [
          {
            validator: this.common.validate.phone,
            required: true,
            message: "请填写手机",
            trigger: "blur"
          }
        ],
        idNo: [
          { required: true, message: "请填写身份证", trigger: "blur" },
          {
            validator: this.common.validate.IdCodeValid,
            message: "请填写正确的身份证"
          }
        ],
        certNo: [
          { required: true, message: "请填写身份证", trigger: "blur" },
          {
            validator: this.common.validate.IdCodeValid,
            message: "请填写正确的身份证"
          }
        ],
        address: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ],
        locationCode: [
          { required: true, message: "请选择所在地区", trigger: "blur" }
        ],
        // deliveryAddress: [
        //   { required: true, message: "请选择提货地址", trigger: "blur" }
        // ]
      },
      timeSel: 0,
      timer: [0, 1, 2, 3, 4],
      occDate: new Date(),
      daterange: [new Date(), new Date(new Date() + 1000 * 60 * 60 * 24)],
      type: [
        {
          goodsType: "park"
        },
        {
          goodsType: "hotel"
        },
        {
          goodsType: "mdse"
        },
        {
          goodsType: "route"
        }
      ],
      goodsType: "",
      list: [],
      data: {},
      padding: "30px" //火狐浏览器处理
    };
  },
  // watch: {
  //   delivery: {
  //     handler(val, oldVal) {
  //       this.$refs.formOther.resetFields();
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    hotelPrice() {
      if (this.data.closePriceSectionShow||this.data.closePriceSectionShow===0) {
        if (isNaN(this.data.closePriceSectionShow)) {
          return "暂无";
        } else {
          return (this.data.closePriceSectionShow * this.value).toFixed(2);
        }
      } else {
        return "暂无";
      }
    },
    total() {
      let list;
      let obj = {
        num: 0,
        price: 0
      }
      if (this.goodsType == "park") {
        list = this.data.ticketPurchases;
        this.data.spotPay = 'on';
      } else if (this.goodsType == "hotel") {
        obj.date = Math.ceil(Math.abs(new Date(this.data.startDate).getTime() - new Date(this.data.endDate).getTime()) / (1000 * 60 * 60 * 24));
        list = this.data.roomPurchases;
      } else if (this.goodsType == "mdse") {
        list = this.data.specPurchases;
      } else {
        list = this.data.orderSkuList;
      }
      if (list) {
        list.map(it => {
          if (it.value) {
            obj.num += Number(it.value);
            obj.price += it.distPrice * it.value;
            if(this.goodsType == "park" && it.scenePay != 'on'){
              this.data.spotPay = 'off'
            }
          }
        });
      }
      if (this.goodsType == "mdse") {
        if(this.delivery == '快递') // shipType 配送方式 0包邮 1统一快递费 2快递模板
        obj.price += this.postAgePrice;
      }
      return obj;
    }
  },
  created() {
    //firefox
    this.filter.formatDate("2019-02-26",'yyyy-mm-dd hh:mm:ss')
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("firefox") > 0) {
      this.padding = "100px";
    }
  },
  mounted() {
    apiGet("/distmarket/webApi/distMarketPurchase/getOrderInfoRedis", {
      orderInfoKey: this.$route.query.time
    }).then(res => {
      if (res.status == 200) {
        this.data = JSON.parse(res.message);
        this.goodsType = this.data.modelType;
        this.getGuide(); // 联系人列表
        this.list = this.getlist(); // 实名制列表
        if (this.goodsType == "park") {
          let data = new Date(Date.parse(this.data.occDate.replace(/-/g, "/")));
          this.occDate =
            data.getFullYear() +
            "-" +
            (data.getMonth() + 1) +
            "-" +
            data.getDate();
        }
        if (this.goodsType == "mdse") {
          this.getGoodsType()
          this.getPostagePriceAll(0)
        }; // 获取商品每个规格的邮费
        if (this.goodsType == "hotel") {
          // this.setBegDate(new Date(this.data.startDate));
          // this.setEndDate(new Date(this.data.endDate));
          let date = new Date(this.data.startDate);
          let date_value =
            date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
          this.startDate = date_value;
          date = new Date(this.data.endDate);
          date_value =
            date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
          this.endDate = date_value;
        }
      } else {
        this.$Message.warning(res.message);
      }
    });
  },
  components: {
    confirm,
    selectItem
  },
  methods: {
    // getTicket() {
    //     let data1 = apiGet("/distmarket/myWantBuy/buyscenicFl",{
    //         goodsCode: this.data.goodsCode+this.data.ticketType
    //     })
    //     let data = new Date(this.occDate);
    //     let occDate = '';
    //     occDate = data.getFullYear()+'-'+(data.getMonth() + 1)+'-'+data.getDate();
    //     let data2 = apiGet("/distmarket/myWantBuy/getProductStockPriceForRoute",{
    //         goodsCode: this.data.goodsCode,
    //         occDate: occDate
    //     })
    //     Promise.all([data1,data2]).then((list)=>{
    //         console.log(list);
    //         let orderSkuList = [];
    //         let res = list[0];
    //         if(res.status==200||res.success){
    //             orderSkuList = res.data.dmproductInfo.orderSkuList;
    //         }else{
    //             this.$Message.warning(res.message)
    //         }
    //         res = list[1];
    //         if(res.status==200||res.success){
    //             this.data.params = res.params;
    //             this.data.stock = res.stock;
    //         }else{
    //             this.$Message.warning(res.message)
    //         }
    //         if(orderSkuList)
    //         orderSkuList.map((item)=>{
    //             item.value = 0;
    //             if(this.data.params)
    //             this.data.params.map((ite)=>{
    //                 if(item.ticketType==ite.ticketType){
    //                     item.price = ite.price;
    //                 }
    //             })
    //         });
    //         this.$set(this.data,"orderSkuList",orderSkuList);
    //     });
    // },
    getGoodsType() {
      apiGet("/distmarket/myWantBuy/buyOtherFl", {
        goodsCode: this.data.goodsCode
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.orderSkuList = res.data.dmproductInfo.orderSkuList;
          this.delivery = "快递"
          this.deliveryStatus = res.data.deliveryStatus;
          this.deliveryList = res.data.deliveryList;
          // this.getSku(res.data.dmproductInfo.orderSkuList);
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    deliveryChange() {
      this.$nextTick(()=>{
        this.$refs.formOther.resetFields();
        this.$refs.formOther.spotPay = 'off';
      },300);
    },
    getSku(result) {
      this.stock = this.data.stock;
      this.closePriceSectionShow = this.data.closePriceSectionShow;
      let keys = [];
      if (!result.length) return;
      // 获取规格
      let obj = JSON.parse(result[0].specifications);

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          keys.push(key);
          this.skuList.push({
            specification: key,
            list: []
          });
        }
      }
      result.map(item => {
        let one = JSON.parse(item.specifications);
        this.skuList.map(it => {
          if (!it.list.includes(one[it.specification])) {
            it.list.push(one[it.specification]);
          }
        });
      });
    },
    compare(obj, sel) {
      for (const k in sel) {
        if (sel.hasOwnProperty(k)) {
          const element = sel[k];
          if (element != obj[k]) {
            return true;
          }
        }
      }
      return false;
    },
    haveSku(val, key) {
      let sel = {}; // 已选规格
      this.skuList.map((item, index) => {
        if (item.list[this.currentSku[index]])
          sel[item.specification] = item.list[this.currentSku[index]];
      });
      sel[key] = val;
      for (let j = 0; j < this.orderSkuList.length; j++) {
        let obj = JSON.parse(this.orderSkuList[j].specifications); // 可选规格
        if (!this.compare(obj, sel)) {
          return true;
        }
      }
      return false;
    },
    skuChange(val, key, index, inde) {
      if (!this.haveSku(val, key)) {
        return this.$Message.warning('暂未采购！');
      }
      this.$set(
        this.currentSku,
        index,
        this.currentSku[index] === inde ? "" : inde
      );
      this.getStock();
    },
    getStock() {
      for (const key in this.currentSku) {
        if (this.currentSku.hasOwnProperty(key)) {
          if (!this.currentSku[key] && !(this.currentSku[key] === 0)) {
            this.data.modelCode = "";
            this.stock = this.data.stock;
            return (this.closePriceSectionShow = this.data.closePriceSectionShow);
          }
        }
      }
      let obj = {};
      this.skuList.map((item, index) => {
        obj[item.specification] = item.list[this.currentSku[index]];
      });
      let str = JSON.stringify(obj);
      this.orderSkuList.map(item => {
        if (item.specifications == str) {
          this.stock = item.stock;
          this.closePriceSectionShow = item.price || "无";
          this.data.modelCode = item.modelCode;
          this.getPostagePrice();
        }
      });
    },
    getProductStockPriceForRoute(occDate) {
      apiGet("/distmarket/myWantBuy/getProductStockPriceForRoute", {
        goodsCode: this.data.goodsCode,
        occDate: occDate
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.data.stock = res.stock;
          if (this.data.orderSkuList)
            this.data.orderSkuList.map(item => {
              item.value = 0;
              if (res.params)
                res.params.map(ite => {
                  if (item.ticketType == ite.ticketType) {
                    item.distPrice = ite.price;
                  }
                });
            });
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    getProductHotelStockPrice(startDate, endDate) {
      let start =
        typeof startDate == "string"
          ? startDate
          : startDate.getFullYear() +
            "-" +
            (startDate.getMonth() + 1) +
            "-" +
            startDate.getDate();
      let end =
        typeof endDate == "string"
          ? endDate
          : endDate.getFullYear() +
            "-" +
            (endDate.getMonth() + 1) +
            "-" +
            endDate.getDate();
      apiGet("/distmarket/myWantBuy/getProductHotelStockPrice", {
        goodsCode: this.data.goodsCode,
        startDate: start,
        endDate: end
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.data.closePriceSectionShow = res.totalPrice;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    getPostagePriceAll(code) {
      if(this.data.shipType == '0') { // 配送方式 0包邮 1统一快递费 2快递模板
        this.postAgePrice = 0;
        return
      }
      let modelCodes = {};
      this.data.specPurchases.map(item=>{
        modelCodes[item.specCode] = item.value;
      })
      this.getPostagePrice(code,JSON.stringify(modelCodes));
    },
    getPostagePrice(code,modelCodes) {
		  if(this.province === "110000" ||this.province === "120000" ||this.province === "500000" ||this.province === "310000")
      var code = this.province;
      apiPost("/distmarket/webApi/distMarketMdse/getPostagePrice", {
        areaCode:
          code||(this.$refs.select?(this.$refs.select.shi
            ? this.$refs.select.shi
            : this.shi):0),
        modelCodes: modelCodes
      }).then(res => {
        if (res.status == 200) {
          // if(this.data.shipType == '1') 配送方式 0包邮 1统一快递费 2快递模板
          this.postAgePrice = res.data;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    getlist() {
      let list;
      let data = [];
      let params = this.data;
      if (this.goodsType == "park") {
        list = params.ticketPurchases;
      } else if (this.goodsType == "hotel") {
        list = params.roomPurchases;
      } else if (this.goodsType == "mdse") {
        list = params.specPurchases;
      } else {
        list = params.routeTicketPurchases;
      }
      if (list) {
        list.map(it => {
          if (it.value && it.isRealName == "T") {
            let arr = [];
            for (let index = 0; index < it.value; index++) {
              arr.push({});
            }
            data.push({
              ticketName: it.ticketName,
              modelCode: it.ticketCode,
              form: arr
            });
          }
        });
      }
      return data;
    },
    handleBeforeUpload(index) {
      this.current = index;
    },
    handleSuccess(res, file) {
      if (res.status == 200) {
        this.$Message.success("上传成功");
        this.$set(this.list[this.current], "form", res.data);
      } else {
        this.$Message.warning(res.message);
      }
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "上传的文件过大",
        desc: "文件  " + file.name + " 过大, 不能超过 2M"
      });
    },
    getProvince(sheng, code) {
      this.sheng = sheng;
      this.formOther.locationCode = '';
      this.province = code;
      this.city = '';
      this.shi = '';
      this.qu = '';
      this.area = '';
		  if(code === "110000" ||code === "120000" ||code === "500000" ||code === "310000")
      this.getPostagePriceAll(code);
    },
    getCity(city, code) {
      this.city = city;
      this.shi = code;
      this.formOther.locationCode = '';
      this.qu = '';
      this.area = '';
		  if(this.province === "110000" ||this.province === "120000" ||this.province === "500000" ||this.province === "310000")
        return;
      this.getPostagePriceAll();
    },
    getQu(qu, code) {
      this.qu = qu;
      this.area = code;
    },
    setDefault(ele) {
      delete ele.createTime;
      delete ele.modifyTime;
      ele.defaultFlag = true;
      apiPost("/admin/webapi/guide/updateDefault", ele).then(res => {
        if (res.status == 200) {
          this.getGuide();
        } else {
          this.$Message.warning(res.message);
          this.getGuide();
        }
      });
    },
    guideDel(ele) {
      this.formItem = {};
      apiGet("/admin/webapi/guide/delete", { Id: ele.id }).then(res => {
        if (res.status == 200) {
          this.getGuide();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    guideEle(ele, index) {
      this.guides.map(item => {
        item.selected = false;
      });
      ele.selected = true;
      this.formItem = JSON.parse(JSON.stringify(ele));
      this.$set(this.guides, index, ele);
    },
    guideModify(ele, index) {
      if(this.hadOpen){
        this.$nextTick(()=>{
        this.$refs.formItemW.resetFields()
        })
      }
      this.hadOpen = true;
      this.modalTitle = this.goodsType == "mdse" ? "修改地址" : "修改联系人";
      this.modal = true;
      let obj = {};
      if (ele) {
        this.formItem = JSON.parse(JSON.stringify(ele));
        // obj = ele;
      } else {
        (this.formItem = {
          name: "",
          phone: "",
          idNo: ""
        }),
          (this.modalTitle =
            this.goodsType == "mdse" ? "创建地址" : "创建联系人");
      }
    },
    saveGuide() {
      let url = "/admin/webapi/guide/saveReceive";
      delete this.formItem.createTime;
      delete this.formItem.modifyTime;
      let _this = this;
      this.$refs.formItemW.validate(vaild=>{
        if(vaild){
          apiPost(url, this.formItem).then(res => {
            _this.modal = false;
            if (res.status == 200) {
              _this.getGuide();
              _this.$Message.success(res.message);
            } else {
              _this.$Message.warning(res.message);
            }
          });
        }
      })
      // this.common.formPost(this, {
      //   url,
      //   params: _this.formItem,
      //   mold: "modal",
      //   modalName: "formItemW",
      //   callback(res) {
      //     _this.modal = false;
      //     if (res.success || res.status == 200) {
      //       _this.getGuide();
      //       _this.$Message.success(res.message);
      //     } else {
      //     }
      //   }
      // });
    },
    validateList(list, cb) {
      Promise.all(list).then(data => {
        for (let i = 0; i < data.length; i++) {
          if (!data[i]) {
            return;
          }
        }
        cb && cb();
      });
    },
    modalCancel() {
      this.formItem = {
        name: "",
        phone: "",
        idNo: ""
      };
      this.guides.map(item => {
        if (item.selected) {
          this.formItem = JSON.parse(JSON.stringify(item));
        }
      });
    },
    getGuide() {
      apiPost("/admin/webapi/guide/list", {}).then(res => {
        if (res.status == 200) {
          this.guides = res.data;
          this.formItem = {
            name: "",
            phone: "",
            idNo: ""
          };
          this.guides.map(item => {
            if (item.defaultFlag) {
              item.selected = true;
              this.formItem = JSON.parse(JSON.stringify(item));
            }
          });
        } else {
        }
      });
    },
    otherCallBack() {
      let obj = {};
      let url = "/distmarket/myWantBuy/saveScenic";
      if (this.goodsType == "route") {
        obj.modelType = "route";
        obj.batchOrderParam = this.data.orderSkuList;
        obj.batchOrderParam.map(item => {
          item.quantity = item.value;
          item.skuCode = item.modelCode;
          item.name = item.modelName;
        });
        obj.batchOrderParam = JSON.stringify(obj.batchOrderParam);
        let data = new Date(this.occDate);
        obj.occDate =
          data.getFullYear() +
          "-" +
          (data.getMonth() + 1) +
          "-" +
          data.getDate();
        obj.quantity = this.total.num;
        obj.modelCode = this.data.goodsCode;
      } else if (this.goodsType == "hotel") {
        url = "/distmarket/myWantBuy/saveScenics";
        // obj.price = this.data.closePriceSectionShow;
        obj.modelType = "room";
        // obj.goodsCode = this.data.goodsCode;
        obj.modelCode = this.data.goodsCode;
        // obj.quantity = this.value;
        let batchOrderParam = [];
        this.data.roomPurchases.map(item=>{
          batchOrderParam.push({
            quantity: item.value,
            skuCode: item.roomCode
          })
        });
        obj.batchOrderParam = JSON.stringify(batchOrderParam);
        obj.checkInDate = this.startDate
        obj.checkOutDate = this.endDate
        // let data = new Date(this.startDate);
        // obj.checkInDate =
        //   data.getFullYear() +
        //   "-" +
        //   (data.getMonth() + 1) +
        //   "-" +
        //   data.getDate();
        // data = new Date(this.endDate);
        // obj.checkOutDate =
        //   data.getFullYear() +
        //   "-" +
        //   (data.getMonth() + 1) +
        //   "-" +
        //   data.getDate();
      } else {
        url = "/distmarket/myWantBuy/saveScenics";
        obj.modelType = "mdse";
        obj.deliverType = this.delivery == "快递" ? 1 : 0; // 0: 自提 1: 快递
        let batchOrderParam = [];
        this.data.specPurchases.map(item=>{
          batchOrderParam.push({
            quantity: item.value,
            skuCode: item.specCode
          })
        });
        obj.batchOrderParam = JSON.stringify(batchOrderParam);
        if (obj.deliverType) {
          obj.regionCode = this.$refs.select.shi || this.shi;
          if(this.province === "110000" ||this.province === "120000" ||this.province === "500000" ||this.province === "310000")
          obj.regionCode = this.province;
          obj.areaCodeCheck = this.$refs.select.qu || this.area;
          obj.postageIsFree = this.postAgePrice;
          obj.address = this.formOther.locationName + this.formOther.address;
        } else {
          obj.deliveryAddress = this.formItem.deliveryAddress;
          obj.address = this.formOther.deliveryAddress;
        }
        obj.goodsCode = this.data.goodsCode;
        obj.modelCode = this.data.modelCode;
      }
      obj.certificateNo = this.formItem.idNo;
      obj.linkName = this.formItem.name;
      obj.tel = this.formItem.phone;
      obj.remark = this.formOther.remark;
      this.loading = true;
      apiPost(url, obj).then(res => {
        this.loading = false;
        if (res.status == 200 || res.success) {
          // this.$Message.success(res.message)
          this.$router.push({
            path: "/topay",
            query: { orderCode: res.orderCode }
          });
          this.flagShow = "success";
        } else {
          setTimeout(()=>{
              this.flagShow = "fail";
          },3000)
          this.$Message.warning(res.message);
        }
      });
    },
    guidesValidate(cb) {
      if (this.loading) return;
      if (this.guides.length) {
        if (!this.formItem.name || !this.formItem.phone) {
          return this.$Message.warning("请选择联系人!" );
        }
        if (this.goodsType == "mdse") {
          if (this.delivery == "快递") {
            if (this.province && this.shi && this.area)
              this.formOther.locationCode =
                (this.$refs.select.sheng || this.province) +
                "-" +
                (this.$refs.select.shi || this.shi) +
                "-" +
                (this.$refs.select.qu || this.area);
            if (this.sheng && this.city && this.qu)
              this.formOther.locationName =
                this.sheng + "-" + this.city + "-" + this.qu;
          }
          return this.validateList(
            [this.$refs["formOther"].validate((vaild)=>{
                if(vaild){

                }else{
                  // 滚动到错误地方
                  setTimeout(function() {
                      $("#content").scrollTop(
                      $(".ivu-form-item-error").offset().top -
                          90 +
                          $("#content").scrollTop()
                      );
                  }, 500);
                }
              })],
            this[cb]
          );
        }
        this[cb]();
      } else {
        if (this.goodsType == "mdse") {
          if (this.delivery == "快递") {
            if (this.province && this.shi && this.area)
              this.formOther.locationCode =
                (this.$refs.select.sheng || this.province) +
                "-" +
                (this.$refs.select.shi || this.shi) +
                "-" +
                (this.$refs.select.qu || this.area);
            if (this.sheng && this.city && this.qu)
              this.formOther.locationName =
                this.sheng + "-" + this.city + "-" + this.qu;
          }
          return this.validateList(
            [
              this.$refs["formItem"].validate((vaild)=>{
                if(vaild){

                }else{
                  // 滚动到错误地方
                  setTimeout(function() {
                      $("#content").scrollTop(
                      $(".ivu-form-item-error").offset().top -
                          90 +
                          $("#content").scrollTop()
                      );
                  }, 500);
                }
              }),
              this.$refs["formOther"].validate((vaild)=>{
                if(vaild){

                }else{
                  // 滚动到错误地方
                  setTimeout(function() {
                      $("#content").scrollTop(
                      $(".ivu-form-item-error").offset().top -
                          90 +
                          $("#content").scrollTop()
                      );
                  }, 500);
                }
              })
            ],
            this[cb]
          );
        }
        this.validateList([this.$refs["formItem"].validate(vaild=>{
          if(vaild){

          }else{
            // 滚动到错误地方
            setTimeout(function() {
                $("#content").scrollTop(
                $(".ivu-form-item-error").offset().top -
                    90 +
                    $("#content").scrollTop()
                );
            }, 500);
          }
        })], this[cb]);
      }
    },
    submitBill() {
      if (!this.total.num) {
        return this.$Message.warning("没有选购任何票");
      }
      if (this.goodsType == "route") return this.otherCallBack();
      let list = [];
      for (let index = 0; index < this.list.length; index++) {
        for (let ind = 0; ind < this.list[index].form.length; ind++) {
          list.push(
            this.$refs["form" + index + "-" + ind].validate
              ? this.$refs["form" + index + "-" + ind].validate()
              : this.$refs["form" + index + "-" + ind][0].validate()
          );
        }
      }
      this.validateList(list, this.callBack);
    },
    realNames() {
      let realNameParam = [];
      let batchOrderParam = [];
      let fsyyTimes = [];
      this.list.map(item => {
        item.form.map(it => {
          realNameParam.push({
            modelCode: item.modelCode,
            certificateNo: it.certNo,
            linkName: it.name,
            tel: it.phone
          });
        });
      });
      this.data.ticketPurchases.map(item => {
        batchOrderParam.push({
          skuCode: item.ticketCode,
          quantity: item.value
        });
        if(item.isFsyy=='T')
        fsyyTimes.push({
          code: item.ticketCode,
          endTime: item.timer.endTime,
          startTime: item.timer.startTime,
        });
      });
      realNameParam = JSON.stringify(realNameParam);
      batchOrderParam = JSON.stringify(batchOrderParam);
      fsyyTimes = JSON.stringify(fsyyTimes);
      return { realNameParam, batchOrderParam, fsyyTimes };
    },
    listRepeat() {
      let repeat = false;
      this.list.map(item => {
        let obj = {};
        item.form.map((ele, index) => {
          if (obj[ele.certNo]) {
            return (repeat = true);
          } else {
            obj[ele.certNo] = 1;
          }
        });
      });
      return repeat;
    },
    spotPay(obj) {
      apiPost("/order/orderInfo/spotPayUpdateAfter", {
        payOrderNo: obj.payOrderNo,
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.$router.push(
              "/pay-success?orderNo=" + obj.orderCode
            );
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    callBack() {
      if (this.listRepeat()) {
        return this.$Message.warning(
          "温馨提示：“同一票型有重复证件号，请修改后重试”"
        );
      }
      let data = new Date(Date.parse(this.occDate.replace(/-/g, "/")));
      let obj = this.goodsType == "park" ? this.realNames() : {};
      if (this.goodsType == "park" || this.goodsType == "route")
        obj.occDate =
          data.getFullYear() +
          "-" +
          (data.getMonth() + 1) +
          "-" +
          data.getDate();
      obj.modelType = "ticket";
      obj.certificateNo = this.formItem.idNo;
      obj.linkName = this.formItem.name;
      obj.tel = this.formItem.phone;
      obj.spotPay = this.formOther.spotPay; // 是否到付 on:是 off:否
      obj.remark = this.formOther.remark;
      this.loading = true;
      apiPost("/distmarket/myWantBuy/saveScenics", obj).then(res => {
        this.loading = false;
        if (res.status == 200 || res.success) {
          this.$Message.success("提交成功!");
          if(obj.spotPay == 'on')
          this.spotPay(res);
          else
          this.$router.push({
            path: "/topay",
            query: { orderCode: res.orderCode }
          });
          this.flagShow = "success";
        } else {
          setTimeout(()=>{
              this.flagShow = "fail";
          },3000)
          this.$Message.warning(res.message);
        }
      });
    },
    timeIt(ind) {
      this.timeSel = ind;
    },
    setNum(item, index, ite) {
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
    numOpt(bool, ticket, index, ticketPurchases) {
      if (!ticket.distPrice&&ticket.distPrice!==0) {
        return;
      }
      if (bool) {
        if (ticket.value < ticket.stock || ticket.stock == "无限库存") {
          ticket.value = 1 + Number(ticket.value);
          if (this.data[ticketPurchases][index].isRealName == "T")
            this.list.map(item => {
              if (item.modelCode == this.data[ticketPurchases][index].ticketCode)
                item.form.push({});
            });
        }
      } else {
        if (ticket.value > 1) {
          ticket.value -= 1;
          if (this.data[ticketPurchases][index].isRealName == "T")
            this.list.map(item => {
              if (item.modelCode == this.data[ticketPurchases][index].ticketCode)
                item.form.pop();
            });
        } else {
          ticket.value -= 1;
          if (this.data[ticketPurchases][index].isRealName == "T") {
            this.list.map((item, inde) => {
              if (item.modelCode == this.data[ticketPurchases][index].ticketCode)
                this.list.splice(inde, 1);
            });
          }
        }
      }
    },
    skuNumInput(sku, index) {
      sku.value = ~~Number(sku.value).toFixed(0);
      if (sku.value < 0) {
        sku.value = Math.abs(sku.value);
      }
      if (this.total.num > this.data.stock) sku.value = 0;
      if (sku.value > 999) sku.value = 999;
      this.$set(this.data.orderSkuList, index, sku);
    },
    otherTicketNumInput(max) {
      this.value = ~~Number(this.value).toFixed(0);
      if (this.value < 0) {
        this.value = Math.abs(this.value);
      }
      if (this.value > 999) {
        this.value = 999;
      }
      if (this.value > max) {
        this.value = max;
      }
    },
    otherTicketNum(bool, max) {
      if(this.goodsType == 'hotel'){
        if(this.data.closePriceSectionShow!==0 && !this.data.closePriceSectionShow && this.data.closePriceSectionShow=='无'){
          return
        }
      }
      if(this.goodsType == 'mdse'){
        if((!this.closePriceSectionShow&&this.closePriceSectionShow!==0)||this.closePriceSectionShow=='无'){
          return
        }
      }
      if (bool) {
        if (this.value < max) this.value = 1 + Number(this.value);
      } else {
        this.value == 1 ? 1 : this.value--;
      }
      this.getPostagePriceAll();
    },
    ticketNumInput(ticket, item, inde) {
      ticket.value = ~~Number(ticket.value).toFixed(0);
      if (ticket.value < 0) {
        ticket.value = Math.abs(ticket.value);
      }
      if (ticket.value > 999) ticket.value = 999;
      if(this.total.num==0){
        ticket.value=1;
      }
      if (ticket.value < ticket.stock || ticket.stock == "无限库存") {
        if (this.data.ticketPurchases[inde].isRealName == "T")
          this.list.map(item => {
            if (item.modelCode == this.data.ticketPurchases[inde].ticketCode) {
              item.form = [];
              for (let index = 0; index < ticket.value; index++) {
                item.form.push({});
              }
            }
          });
      } else {
        ticket.value = ticket.stock;
      }
      if (ticket.value) this.setNum(item, inde, ticket);
      else this.data.ticketPurchases.splice(inde, 1);
    },
    ticketNum(bool, ticket, item, inde) {
      if(this.total.num==1&&!bool){
        return;
      }
      item.ticketPurchases.map(item => {
        item.show = false;
      });
      ticket.show = true;
      this.numOpt(bool, ticket, inde, "ticketPurchases");
      if (ticket.value) this.setNum(item, inde, ticket);
      else this.data.ticketPurchases.splice(inde, 1);
      // this.list = this.getlist();
    },
    roomNum(bool, room, item, inde) {
      if(this.total.num==1&&!bool){
        return;
      }
      item.roomPurchases.map(item => {
        item.show = false;
      });
      room.show = true;
      this.numOpt(bool, room, inde, "roomPurchases");
      if (room.value) this.setNum(item, inde, room);
      else this.data.roomPurchases.splice(inde, 1);
    },
    roomNumInput(room, item, inde) {
      room.value = ~~Number(room.value).toFixed(0);
      if (room.value < 0) {
        room.value = Math.abs(room.value);
      }
      if (room.value > 999) room.value = 999;
      if(this.total.num==0){
        room.value=1;
      }
      if (room.value < room.stock || room.stock == "无限库存") {
      } else {
        room.value = room.stock;
      }
      if (room.value) this.setNum(item, inde, room);
      else this.data.roomPurchases.splice(inde, 1);
    },
    mdseNum(bool, room, item, inde) {
      if(this.total.num==1&&!bool){
        return;
      }
      item.specPurchases.map(item => {
        item.show = false;
      });
      room.show = true;
      this.numOpt(bool, room, inde, "specPurchases");
      if (room.value) {
        this.setNum(item, inde, room);
      } else {
        this.data.specPurchases.splice(inde, 1);
      }
      this.getPostagePriceAll();
    },
    mdseNumInput(room, item, inde, ev) {
      room.value = ev.currentTarget.value||ev.target.value;
      if(ev.currentTarget){
        ev.currentTarget.value = (~~ev.currentTarget.value).toFixed(0);
        if (ev.currentTarget.value <= 0) {
          ev.currentTarget.value = Math.abs(ev.currentTarget.value);
        }
        if (room.stock != '无限库存' && ev.currentTarget.value > ~~room.stock) {
          ev.currentTarget.value = room.stock;
        }
        if (ev.currentTarget.value > 999) {
          ev.currentTarget.value = 999;
        }
      }
      ev.target.value = (~~ev.target.value).toFixed(0);
      if (ev.target.value <= 0) {
        ev.target.value = Math.abs(ev.target.value);
      }
      if (room.stock != '无限库存' && ev.target.value > ~~room.stock) {
        ev.target.value = room.stock;
      }
      if (ev.target.value > 999) {
        ev.target.value = 999;
      }
      room.value = ~~Number(room.value).toFixed(0);
      if (room.value < 0) {
        room.value = Math.abs(room.value);
      }
      if (room.value > 999) room.value = 999;
      if(this.total.num==0){
        room.value=1;
      }
      if (room.value < room.stock || room.stock == "无限库存") {
      } else {
        room.value = room.stock;
      }
      if (room.value) {
        this.setNum(item, inde, room);
      } else {
        this.data.specPurchases.splice(inde, 1);
      }
      this.getPostagePriceAll();
    },
    skuNum(bool, sku, index) {
      if(sku.distPrice!==0&&(!sku.distPrice||sku.distPrice=='无'||sku.distPrice==-1)){
        return;
      }
      if (bool) {
        if (this.total.num < this.data.stock) sku.value = 1 + Number(sku.value);
      } else {
        sku.value = sku.value > 1 ? sku.value - 1 : 0;
      }
      this.$set(this.data.orderSkuList, index, sku);
    },
    show(item, index) {
      let bool = !item.show;
      this.data.map(item => {
        item.show = false;
      });
      item.show = bool;
      this.$set(this.data, index, item);
    },
    dateChange(arg) {
      this.occDate = arg;
      this.getProductStockPriceForRoute(arg);
    },
    //处理起始日期
    setBegDate(time,bool) {
      this.startDate = time;
      // if (bool)
      // this.getProductHotelStockPrice(time, this.endDate);
      this.options1 = {
        disabledDate: date => {
          let startTime = this.startDate
            ? new Date(this.startDate).valueOf() - 1 * 24 * 60 * 60 * 1000
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    //处理结束日期
    setEndDate(time) {
      if (time) {
        // this.getProductHotelStockPrice(this.startDate, time);
        this.endDate = time;
        let endTime = this.endDate ? new Date(this.endDate).valueOf() : "";
        this.options0 = {
          disabledDate(date) {
            return date && date.valueOf() > endTime || date.valueOf() < Date.now() - 86400000;
          }
        };
      } else {
        this.options1 = {
          disabledDate(date) {
            return false;
          }
        };
      }
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
.mdseTableWrap {
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
      height: 30px;
      font-size: 14px;
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
</style>

<style lang="scss" scoped>
@import "../../../../assets/styles/font/iconfont.css";
.billContentMdse {
  padding-bottom: 150px;
}
.billContentDefault {
  padding-bottom: 96px;
}
.btn-groups {
  span {
    color: #999;
    font-size: 12px;
    margin-left: 10px;
  }
}
.infoTitleStyle {
  line-height: 52px;
  margin: 0px !important;
  color: #413838;
  font-size: 14px;
  padding-left: 20px;
  background-color: #f3f7fe;
  border-top: 1px solid #e9eaec;
  border-bottom: 1px solid #e9eaec;
}
.resultList {
  margin-bottom: 20px;
  margin-top: 10px;
  .resultItem {
    .resultOpt {
      .resultTable {
        display: table;
        width: 100%;
        line-height: 48px;
        .resultThead {
          display: table-row;
          font-weight: bold;
          .resultTh {
            text-align: center;
            display: table-cell;
            vertical-align: middle;
            background-color: #fff;
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
              text-align: center;
              display: table-cell;
              border-bottom: 1px solid #e9eaec;
              vertical-align: middle;
              .orderSkuList {
                .orderSkuItem {
                  display: flex;
                  .orderSkuKey {
                    padding: 5px 10px;
                    line-height: 20px;
                    flex-shrink: 0;
                    align-self: center;
                  }
                  .orderSkuValues {
                    flex-grow: 1;
                    .orderSkuValue {
                      display: inline-block;
                      cursor: pointer;
                      line-height: 20px;
                      border: 1px solid #ccc;
                      margin-right: 10px;
                      padding: 5px 10px;
                    }
                    .orderSkuValueCurrent {
                      border-color: #df4949;
                    }
                  }
                }
              }
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
                height: 30px;
                font-size: 14px;
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
          .resultTimeList {
            display: inline-block;
            white-space: nowrap;
            width: 100px;
            .resultTime {
              display: inline-block;
              vertical-align: middle;
              line-height: 36px;
              text-align: center;
              border-radius: 3px;
              margin-right: 15px;
              width: 80px;
              border: 1px solid #ccc;
            }
            .resultTimeSel {
              border-color: rgb(28, 163, 236);
            }
            .resultTime0 {
              color: #ccc;
              border-color: #ccc;
            }
          }
        }
      }
    }
  }
}
.listInfo {
  .infoTitle {
    .ivu-upload {
      margin-left: 30px;
      margin-right: 20px;
      width: 86px !important;
    }
    a {
      display: inline-block;
      width: 84px;
      color: #413838;
      line-height: 30px;
      text-align: center;
      background-color: #f2f2f2;
      border: 1px solid #ccc;
    }
  }
  .guideFormList {
    padding-bottom: 20px;
    margin-bottom: 20px;
    .guideForm {
      padding-top: 20px;
      padding-left: 20px;
      border-bottom: 1px solid #e9eaec;
    }
  }
  .infoWrap {
    padding-top: 20px;
    form {
      border-bottom: 1px solid #e9eaec;
      margin-bottom: 20px;
      .ivu-form-item {
        padding-top: 20px;
        border-top: 1px solid #e9eaec;
      }
      a {
        color: #f05b47;
        font-size: 12px;
        margin-left: 20px;
      }
    }
    .addressListWrap {
      margin-bottom: 20px;
      .listTitle {
        font-weight: bold;
        font-size: 14px;
      }
      .addressList {
        padding: 20px 0px 0px;
        .addressItem {
          border: 2px solid #ccc;
          border-radius: 4px;
          position: relative;
          margin-bottom: 15px;
          padding: 0px 20px;
          .default {
            position: absolute;
            text-align: center;
            display: none;
            right: 0px;
            top: 0px;
            width: 20px;
            height: 30px;
            color: #fff;
            background-color: #df4949;
          }
          .itemLine {
            line-height: 30px;
            display: flex;
            color: #999;
            .lineInfo {
              flex-grow: 1;
              span {
                color: #333;
              }
            }
            .linePhone {
              flex-grow: 0;
              width: 270px;
              padding-right: 10px;
              a {
                margin-left: 20px;
                display: none;
              }
              .setDefault {
                margin-left: 30px;
              }
            }
          }
          &:hover {
            border-color: #df4949;
            .itemLine {
              .linePhone {
                a {
                  display: inline;
                }
              }
            }
          }
        }
        .addressDefault {
          border-color: #df4949;
          .itemLine {
            .linePhone {
              a {
                display: none !important;
              }
            }
          }
          .default {
            display: block;
          }
        }
        .addressMore {
          color: #999;
          text-align: center;
        }
      }
    }
    .guideListWrap {
      padding-bottom: 30px;
      .guideNew {
        a {
          display: inline-block;
          background: linear-gradient(to top, #e7e7e7, #fff);
          width: 94px;
          color: #413838;
          line-height: 30px;
          text-align: center;
          border: 1px solid #ccc;
        }
      }
      .guideList {
        padding: 0px 0px 20px;
        .guideItem {
          margin-top: 20px;
          position: relative;
          cursor: pointer;
          display: inline-block;
          vertical-align: middle;
          padding: 0px 8px;
          width: 173px;
          height: 72px;
          border: 2px dashed #ebe9ee;
          margin-right: 46px;
          line-height: 20px;
          font-size: 12px;
          color: #413838;
          background-color: #fafafa;
          &:hover {
            border: 2px dashed #f05b47;
            background-color: #fff7f6;
          }
          .guideName {
            line-height: 28px;
            border-bottom: 1px solid #ebe9ee;
            span {
              display: inline-block;
              vertical-align: middle;
              max-width: 50px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            i {
              vertical-align: middle;
            }
          }
          .guideInfo {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .guideModify {
            line-height: 12px;
            a {
              color: #cc9977;
            }
          }
          .guideSelected {
            position: absolute;
            right: -2px;
            bottom: -2px;
            width: 23px;
            height: 23px;
            background-image: url("../../../../assets/images/guide.png");
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .guideSetDefault {
            text-align: center;
            opacity: 0.8;
            background-color: #fff;
            position: absolute;
            top: -2px;
            right: -2px;
            width: 54px;
            line-height: 16px;
            color: #5c5c5c;
          }
          .guideDefault {
            text-align: center;
            background-color: #d2d2ce;
            position: absolute;
            top: -2px;
            right: -2px;
            width: 30px;
            line-height: 16px;
            color: #fff;
          }
        }
        .guideItemAddress {
          width: 202px;
          height: 90px;
        }
        .guideItemSel {
          border: 2px dashed #f05b47;
          background-color: #fff7f6;
        }
      }
    }
  }
}
.resultOpt {
  .delivery {
    line-height: 52px;
    border-top: 1px solid #e9eaec;
    padding-left: 20px;
    font-size: 14px;
    color: #413838;
  }
  .resultTotal {
    padding-left: 20px;
    display: flex;
    border-top: 1px solid #e9eaec;
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
    .totalBtn,
    .totalBtnFail {
      text-align: center;
       .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
      div {
        width: 210px;
        cursor: pointer;
        line-height: 95px;
        color: #fff;
        font-size: 18px;
        background-color: #f05b47;
      }
    }
    .totalBtnFail {
      div {
        background-color: #918f8f;
      }
    }
  }
}
.resultFixed {
  background-color: #fff;
  position: fixed;
  bottom: 0px;
  right: 0px;
  left: 200px;
}
</style>