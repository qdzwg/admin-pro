<template>
  <div class="comboTickets-addoredit">
    <div class="step">
        <Steps :current="2">
            <Step title="产品类型"></Step>
            <Step @click.native="goToCombo" title="套票信息"></Step>
            <Step title="票型信息"></Step>
            <Step title="完成"></Step>
        </Steps>
      </div>
    <Form
      height="450"
      :model="formItem"
      label-position="right"
      :label-width="120"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <!-- <h2 class="page-title">添加</h2> -->
      <div class="form-title">基本信息</div>
      <FormItem label="票型名称：" prop="modelName">
        <Input v-model="formItem.modelName" placeholder="请输入票型名称" style="width:33%" :maxlength="20"></Input>
      </FormItem>
      <FormItem label="票型别名：" prop="nickName">
        <Input v-model="formItem.nickName" placeholder="请输入票型别名" style="width:33%" :maxlength="20"></Input>
      </FormItem>
      <FormItem label="产品分组：">
        <Button v-if="formItem.proGroup.length<5" @click="addGroup">添加分组</Button>
        <RadioGroup style="display:block" v-model="selectedGroup">
          <table class="table" style="width:500px;margin-top:10px;">
            <thead>
              <tr>
                <th width="100">选择分组</th>
                <th width="200">分组名称</th>
                <th width="120">排序</th>
                <th width="80">操作</th>
              </tr>
            </thead>
            <tbody>
              <!-- <tr v-if="formItem.proGroup.length<1">
                <td colspan="4">
                  <span style="color:red">暂无分组，请新增分组</span>
                </td>
              </tr> -->
              <tr v-for="(item, index) in formItem.proGroup" :key="index">
                <td style="text-align:center" width="100">
                  <Radio :label="index">
                    <span></span>
                  </Radio>
                </td>
                <td width="200">
                  <FormItem
                    :prop="'proGroup.'+index+'.labelValue'"
                    :rules="[{required: true, message: '分组名称不能为空', trigger: 'blur'}]"
                    :label-width="1"
                  >
                    <Input v-model="item.labelValue" :maxlength="20"></Input>
                  </FormItem>
                </td>
                <td width="120">
                  <FormItem
                    :prop="'proGroup.'+index+'.sortNo'"
                    :rules="[{required: true, message: '分组排序不能为空', trigger: 'blur'},{ pattern:/^[1-9]+\d*$/, message: '数据格式不正确'}]"
                    :label-width="1"
                  >
                    <Input v-model="item.sortNo" :maxlength="8"></Input>
                  </FormItem>
                </td>
                <td width="80">
                  <span                    
                    @click="delGroup(item,index)"
                    style="cursor:pointer;"
                  >删除</span>
                </td>
              </tr>
            </tbody>
          </table>
        </RadioGroup>
      </FormItem>
      <FormItem label="票型标签：" prop="modelLabel">
        <div style="" class="travellSubject">
          <div class="subject-list">
            <div v-for="(item,index) in tagNameList" :key="index" class="subject-list-item">
              <Icon
                @click="subjectItemDel(index)"
                class="subject-list-item-del"
                type="close-circled"
              ></Icon>
              <Button>{{item}}</Button>
            </div>
          </div>
          <div class="subject-input" v-if="tagNameList.length<4">
            <Input
              @on-enter="setSubjectTag"
              :maxlength="4"
              v-model="tagName"
              placeholder="回车添加标签，如“日可定、立减20”"
              style="width: 200px"
            ></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left" v-if="tagNameList.length<4">输入后，回车添加</div>
          
          
        </div>
        
        <Input v-model="formItem.modelLabel" style="display:none"></Input>
      </FormItem>
      <FormItem label="" v-if="labelList.length>0">
        <div>
          <span style="margin-right:10px; font-weight:normal;">快捷标签</span>
          <div class="label-item" v-for="(item, index) in labelList" :key="index" style="display:inline-block;margin-right: 10px; position: relative;">
            <Button @click="addTosubject(item)">{{item}}</Button>
          </div>
        </div>
      </FormItem>
      <FormItem label="轮播图片：" prop="linkImg">
        <my-img :limitNum="5" :uploadList="wapImgList" @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="购票提醒：" prop="ticketNotice">
        <Select v-model="formItem.ticketNotice" style="width:120px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
      </FormItem>
      <FormItem v-if="formItem.ticketNotice=='T'" label="提醒内容：" prop="bookRemind">
        <Input
          v-model="formItem.bookRemind"
          type="textarea"
          :autosize="{minRows: 3,maxRows: 5}"
          placeholder="请填写购票提醒内容"
          style="width:33%"
        ></Input>
      </FormItem>
      <FormItem label="费用明细：" prop="feeDetail">
        <Input
          v-model="formItem.feeDetail"
          type="textarea"
          :autosize="{minRows: 3,maxRows: 5}"
          placeholder="请填写费用明细"
          style="width:33%"
        ></Input>
      </FormItem>

      <FormItem label="销售渠道：" prop="sellType">
        <Select v-model="formItem.sellType" style="width:200px">
          <Option value="2">仅店铺</Option>
        </Select>
      </FormItem>
      <div>
        <table class="table" style="width:60%;">
          <thead>
            <tr>
              <th>
                <!-- <Icon v-if="!isEdit" class="add-icon" @click="add" type="android-add-circle"></Icon> -->
                <Icon class="add-icon" @click="add" type="android-add-circle"></Icon>
              </th>
              <th>时间段/星期（预订周期不能重复）</th>
              <th>库存模式</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item,index) in formItem.tableList">
              <tr :key="index">
                <td class="center-td">
                  <Icon v-if="formItem.tableList.length>1" class="delete-icon" @click="del(index)" type="android-remove-circle"></Icon>
                </td>
                <td class="time">
                  <div>
                    
                        <!-- <FormItem
                            :prop="'tableList.'+index+'.stockBegDate'"
                            :rules="{required: true, message: '开始时间不能为空', trigger: 'change'}"
                            :label-width="1"
                          >
                            <DatePicker
                              type="date"
                              :value="item.stockBegDate"
                              @on-change="beginDateChange"
                              @on-open-change="getBeginDateIndex(index)"
                              placeholder="开始时间"
                              style="width: 120px"
                            ></DatePicker>
                        </FormItem>-->
                        <FormItem
                          :prop="'tableList.'+index+'.stockBegDate'"
                          :rules="{required: true,type: 'date', message: '开始时间不能为空', trigger: 'change'}"
                          :label-width="1"
                          style="display:inline-block;"
                        >
                          <DatePicker
                            type="date"
                            v-model="item.stockBegDate"
                            placeholder="开始时间"
                            style="width: 120px"
                            :options="dateOptions[index].startTimeOptions"
                            @on-open-change="startTimeOpenChange($event,index)"
                            
                          ></DatePicker>
                        </FormItem>
                     
                      <span style="margin:0 10px;">-</span>
                      
                        <!-- <FormItem
                            :prop="'tableList.'+index+'.endDate'"
                            :rules="{required: true,type: 'date', message: '结束日期不能为空', trigger: 'change'}"
                            :label-width="1"
                          >
                            <DatePicker
                              type="date"
                              :value="item.endDate"
                              @on-change="endDateChange"
                              @on-open-change="getEndDateIndex(index)"
                              placeholder="结束时间"
                              style="width: 120px"
                            ></DatePicker>
                        </FormItem>-->
                        <FormItem
                          :prop="'tableList.'+index+'.stockEndDate'"
                          :rules="{required: true,type: 'date', message: '结束时间不能为空', trigger: 'change'}"
                          :label-width="1"
                          style="display:inline-block"
                        >
                          <DatePicker
                            type="date"
                            v-model="item.stockEndDate"
                            placeholder="结束时间"
                            style="width: 120px"
                            :options="dateOptions[index].endTimeOptions"
                            @on-open-change="endTimeOpenChange($event,index)"
                          ></DatePicker>
                        </FormItem>
                     
                  </div>
                </td>
                <td>
                  <div>
                    <Select v-model="formItem.stockModel" prop="stockModel" style="width:200px">
                      <Option value="DAILY">日库存</Option>
                    </Select>
                  </div>
                  <div style="margin-top:5px;">
                    <FormItem
                      :prop="'tableList.' + index + '.totalNum'"
                      :rules="[{required: true, message: '请填写日库存', trigger: 'blur'},{ pattern: /^[0-9]\d*$/, message: '数据格式不正确', trigger: 'blur' }]"
                      class="dayStock-input-box"
                    >
                      <!-- <Input style="width:200px" v-model="item.totalNum" placeholder="请填写日库存" :maxlength="8" :disabled="isEdit?true:false"></Input> -->
                      <Input style="width:200px" v-model="item.totalNum" placeholder="请填写日库存" :maxlength="8"></Input>
                    </FormItem>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="form-title">预定规则</div>
      <FormItem label="提前预订限制：">
        
            <Select v-model="formItem.earlyAstrictType" style="width:80px;">
              <Option value="F">无限制</Option>
              <Option value="T">有限制</Option>
            </Select>
          
          <template v-if="formItem.earlyAstrictType=='T'">
            <span style="margin:0 10px;">需提前</span>
            
              <FormItem prop="earlyBookDay" :rules="[{ pattern: /^(([0-9]*))$/, message: '数据格式不正确'}]" style="display:inline-block">
                <InputNumber v-model="formItem.earlyBookDay" :min="0" style="width:80px;"></InputNumber>
                <!-- <Input v-model="formItem.earlyBookDay" :maxlength="8"></Input> -->
              </FormItem>
              <!-- <Input v-model="formItem.earlyBookDay" :maxlength="8" :rule="[{required: true, message: '该项不能为空！', trigger: 'blur'},{ pattern: /^(([1-9][0-9]*))$/, message: '数据格式不正确'}]"></Input> -->
            
            <span style="margin:0 10px;">天，</span>
            
              <Select v-model="formItem.earlyBookHour" style="width:80px;">
                <Option :value="index" v-for="(item, index) in 24" :key="index">{{index}}</Option>                 
              </Select>
              <!-- <Input v-model="formItem.earlyBookHour" :maxlength="8"></Input> -->
            
            <span style="margin:0 10px;">时，</span>
            
              <Select v-model="formItem.earlyBookMinute" style="width:80px;">
                <Option :value="index" v-for="(item, index) in 60" :key="index">{{index}}</Option>                 
              </Select>
              <!-- <Input v-model="formItem.earlyBookMinute" :maxlength="8"></Input> -->
            
            <span style="margin:0 10px;">分可预订</span>
          </template>            
      </FormItem>
      <FormItem label="预订日期限制：">
        
            <Select v-model="formItem.buyDayType" style="width:80px;">
              <Option value="F">无限制</Option>
              <Option value="T">有限制</Option>
            </Select>
         
          <template v-if="formItem.buyDayType=='T'">
            <span style="margin:0 10px;">在</span>
            
              <FormItem prop="orderBegDay" style="display:inline-block">
                <DatePicker
                  :value="formItem.orderBegDay"
                  @on-change="begbDateChange"
                  @on-open-change="begbDateIndex"
                  type="date"
                  placeholder
                  style="width:120px;"
                ></DatePicker>
              </FormItem>
            
           <span style="margin:0 10px;">至</span>
           
              <FormItem prop="orderEndDay" style="display:inline-block">
                <DatePicker
                  :value="formItem.orderEndDay"
                  @on-change="begeDateChange"
                  @on-open-change="begeDateIndex"
                  type="date"
                  placeholder
                  style="width:120px;"
                ></DatePicker>
              </FormItem>
           
            <span style="margin:0 10px;">期间内可预订</span>
          </template>
        
      </FormItem>
      <FormItem label="预订时间限制：">
        
          <Select v-model="formItem.isBookingTime" style="width:80px;">
            <Option value="F">无限制</Option>
            <Option value="T">有限制</Option>
          </Select>
          
          <template v-if="formItem.isBookingTime=='T'">
            <span style="margin:0 10px;">在</span>
           
            <FormItem prop="dayBegTime" style="display:inline-block;">
              <TimePicker v-model="formItem.dayBegTime" format="HH:mm" placeholder style="width:80px;"></TimePicker>
            </FormItem>
            
            <span style="margin:0 10px;">至</span>
            
            <FormItem prop="dayEndTime" style="display:inline-block;">
              <TimePicker v-model="formItem.dayEndTime" format="HH:mm" placeholder style="width:80px;"></TimePicker>
            </FormItem>
            
            <span style="margin:0 10px;">时间内可预订</span>
          </template>
        
      </FormItem>
      <FormItem label="预订数量限制：">       
        
            <Select v-model="formItem.numberType" style="width:80px;">
              <Option value="F">无限制</Option>
              <Option value="T">有限制</Option>
            </Select>
          
          <template v-if="formItem.numberType=='T'">
            <span style="margin:0 10px;">每个</span>
            
              <Select v-model="formItem.mobileIdcardType" style="width:140px;">
                <Option value="0">手机号</Option>
                <Option value="1">身份证</Option>
                <Option value="2">手机号+身份证</Option>
                <Option value="3">用户</Option>
              </Select>
           
            
              <Select v-model="formItem.marketTime" style="width:140px; margin-left:10px;">
                <Option value="0">整个销售时间段</Option>
                <Option value="1">每日</Option>
                <Option value="2">每周</Option>
                <Option value="3">每月</Option>
                <Option value="5">每次</Option>
                <!-- <Option value="4">每三月</Option> -->
              </Select>
            
            <span style="margin:0 10px;">限购</span>
            
            <FormItem prop="numAmount" :rules="[{ pattern: /^\+?[1-9][0-9]*$/, message: '数据格式不正确'}]" style="display:inline-block; margin-right:10px;">
              <InputNumber v-model="formItem.numAmount" :min="1" style="width:80px;"></InputNumber>
            </FormItem>
              <!-- <Input v-model="formItem.numAmount" style="width:120px"></Input> -->
            
            
              <Select v-model="formItem.numOrder" style="width:140px;">
                <Option value="F">张票</Option>
                <!-- <Option value="T">笔订单</Option> -->
              </Select>
            
          </template>
        
      </FormItem>
      <!-- <FormItem label="预订人工确认：">
        <Row>
          <Col span="2">
            <Select v-model="formItem.comboConfinrm">
              <Option value="F">否</Option>
              <Option value="T">是</Option>
            </Select>
          </Col>
          <template v-if="formItem.comboConfinrm=='T'">
            <Col span="1" style="text-align:center">请在</Col>
            <Col span="2">
              <Select v-model="formItem.orderTimeOut" style="width:120px">
                <Option :value="index" v-for="(item, index) in 60" :key="index">{{index}}</Option>
              </Select>
              
            </Col>
            <Col span="2" style="text-align:center">分钟 不确认自动取消</Col>
          </template>
        </Row>
      </FormItem> -->
      <div class="form-title">退改规则</div>
      <FormItem label="退单是否允许：" :label-width="150">
        <RadioGroup v-model="formItem.isRetreat" >
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
        <div
          v-if="formItem.isRetreat=='T'"          
        >
          <FormItem label="游玩日前是否可退：" :label-width="140" label-position="left">
            
              <Select v-model="formItem.isBeforeRetreat" style="width:80px; margin-right:10px;">
                <Option value="F">否</Option>
                <Option value="T">是</Option>
              </Select>
              
              <template v-if="formItem.isBeforeRetreat=='T'">
                
                <FormItem prop="refundBeforeDay" :rules="[{ pattern: /^(([0-9]*))$/, message: '数据格式不正确'}]" style="display:inline-block">
                  <InputNumber v-model="formItem.refundBeforeDay" :min="0" style="width:80px;"></InputNumber>
                </FormItem>
                <!-- <Input v-model="formItem.refundBeforeDay" :maxlength="8"></Input> -->
                
                <span style="margin:0 10px;">天前可退，{{formItem.refundBeforeDay}}天前的</span>
                
                <TimePicker v-model="formItem.refundBeforeTime" format="HH:mm" placeholder style="width:80px"></TimePicker>
                  <!-- <Input v-model="formItem.refundBeforeTime" style="width:100px" :maxlength="8"></Input> -->
               
                <span style="margin:0 10px;">点退票截止</span>
                <!-- <Col span="1" style="text-align:center">扣费</Col>
                <Col span="2">
                  <InputNumber v-model="formItem.refundBeforeVal" :min="0"></InputNumber>
                  
                </Col>
                <Col span="1" style="text-align:center">元</Col> -->
              </template>
            
          </FormItem>
          <FormItem label="游玩日当天是否可退：" style="margin-top:5px;" :label-width="140" label-position="left">
            
              <Select v-model="formItem.isTodayRetreat" style="width:80px;">
                <Option value="F">否</Option>
                <Option value="T">是</Option>
              </Select>
              
              <template v-if="formItem.isTodayRetreat=='T'">
                  <span style="margin:0 10px;">，当天</span>
               
                  <TimePicker v-model="formItem.refundTodayTime" format="HH:mm" placeholder style="width:80px;"></TimePicker>
                  <!-- <Input v-model="formItem.refundTodayTime" style="width:100px" :maxlength="8"></Input> -->
                
                  <span style="margin:0 10px;">点退票截止</span>
                <!-- <Col span="1" style="text-align:center">扣费</Col>
                <Col span="2">
                  <InputNumber v-model="formItem.refundTodayVal" :min="0"></InputNumber>
                  
                </Col>
                <Col span="1" style="text-align:center">元</Col> -->
              </template>
            
          </FormItem>
          <FormItem label="游玩日后是否可退：" class style="margin-top: 5px;" :label-width="140" label-position="left">
            
                <Select v-model="formItem.isAfterRetreat" style="width:80px; margin-right:10px;">
                  <Option value="F">否</Option>
                  <Option value="T">是</Option>
                </Select>
             
              <template v-if="formItem.isAfterRetreat=='T'">
               
                <FormItem prop="refundAfterDayIn" :rules="[{ pattern: /^\+?[1-9][0-9]*$/, message: '数据格式不正确'}]" style="display:inline-block;">
                  <InputNumber v-model="formItem.refundAfterDayIn" :min="1" style="width:80px;"></InputNumber>
                </FormItem>
                  <!-- <Input v-model="formItem.refundAfterDayIn" style="width:100px" :maxlength="8"></Input> -->
                
                <span style="margin:0 10px;">天内可退，{{formItem.refundAfterDayIn}}天后的</span>
                
                <TimePicker v-model="formItem.refundAfterTime" format="HH:mm" placeholder style="width:80px;"></TimePicker>
                  <!-- <Input v-model="formItem.refundAfterTime" style="width:100px" :maxlength="8"></Input> -->
                <span style="margin:0 10px;">点退票截止</span>
                <!-- <Col span="1" style="text-align:center">扣费</Col>
                <Col span="2">
                  <InputNumber v-model="formItem.refundAfterVal" :min="0"></InputNumber>
                 
                </Col>
                <Col span="1">元</Col> -->
              </template>
            
          </FormItem>
        </div>
      </FormItem>
      <FormItem label="子票是否可单独退：" :label-width="150">
        <RadioGroup
          v-model="formItem.detailRefundType"
          style="display:inline-block; vertical-align:middle"
        >
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
        <div
          v-if="formItem.detailRefundType=='T'"
          style="display:inline-block; vertical-align:middle; width:90%"
        >
          <span>退票价格按</span>
            
          <Select v-model="formItem.detailRefundPriceType" style="width:140px; margin:0 10px;">
            <Option value="0">子票组成价</Option>
            <!-- <Option value="1">后台审核自定义金额</Option> -->
          </Select>
          <span>退款</span>
          
        </div>
      </FormItem>
      <!-- <FormItem label="退单是否需要审核：" :label-width="150">
        <RadioGroup
          v-model="formItem.isRetreatAudit"
          style="display:inline-block; vertical-align:middle"
        >
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
        <div
          v-if="formItem.isRetreatAudit=='T'"
          style="display:inline-block; vertical-align:middle; width:90%"
        >
          <Row>
            <Col span="2" style="text-align:center">游玩日前</Col>
            <Col span="2">
              <InputNumber v-model="formItem.earlyDayAudit" :min="0"></InputNumber>
              
            </Col>
            <Col span="2" style="text-align:center">天退单需审核</Col>
          </Row>
        </div>
      </FormItem> -->
      <!-- <FormItem label="过期是否核销：">
        <RadioGroup
          v-model="formItem.isOverDueCheck"
          style="display:inline-block; vertical-align:middle"
        >
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
        <div
          v-if="formItem.isOverDueCheck=='T'"
          style="display:inline-block; vertical-align:middle; width:90%"
        >
          <Row>
            <Col span="2" style="text-align:center">游玩日后</Col>
            <Col span="2">
              <InputNumber v-model="formItem.checkRelativeDay" :min="0"></InputNumber>              
            </Col>
            <Col span="1" style="text-align:center">天</Col>
            <Col span="2">
              <TimePicker v-model="formItem.checkOverTime" format="HH:mm" placeholder></TimePicker>              
            </Col>
            <Col span="2" style="text-align:center">点自动核销</Col>
          </Row>
        </div>
      </FormItem> -->
      <FormItem>
        <Button type="primary" @click="submit">保存</Button>
        <Button type="ghost" style="margin-left: 8px" @click="quxiao">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
import store from "@/store";
import myImg from "@/components/global/singleImg";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (
        !store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)
      ) {
        vm.$router.back(); //如果没有就不会跳转
      }
    });
  },
  data() {
    return {
      selectedGroup: null,
      isEdit: '',
      type: "",
      labelList: [],
      formItem: {
        modelName: "",
        nickName: "",
        enabled: "T",
        sellType: "2",
        stockModel: "DAILY",
        buyDayType: "F",
        orderBegDay: "",
        orderEndDay: "",
        isRetreat: "F",
        isRetreatAudit: "F",
        linkImg: "",
        proGroup: [],
        ticketNotice: "F",
        feeDetail: "",
        earlyAstrictType: "F",
        earlyBookDay: 0,
        earlyBookHour: "",
        earlyBookMinute: "",
        isBookingTime: "F",
        numberType: "F",
        mobileIdcardType: 0,
        marketTime: 0,
        numAmount: 1,
        refundBeforeVal: 0,
        refundBeforeDay: 0,
        refundBeforeTime: "",
        isBeforeRetreat: "F",
        isTodayRetreat: "F",
        refundTodayTime: "",
        isAfterRetreat: "F",
        refundTodayVal: 0,
        checkOverTime: "",
        checkRelativeDay: 0,
        isOverDueCheck: "F",
        earlyDayAudit: 0,
        refundAfterDayIn: 1,
        refundAfterTime: "",
        refundAfterVal: 0,
        detailRefundType: "F",
        detailRefundPriceType: 0,
        modelLabel: "",
        dayBegTime: "",
        dayEndTime: "",
        numOrder: 'F',
        tableList: [
          {
            stockBegDate: "",
            stockEndDate: "",
            totalNum: ""
          }
        ],
        action: "",
        comboConfinrm: "F",
        orderTimeOut: "",
        bookRemind: ""
      },
      ruleComplteForm: {
        modelName: [
          { required: true, message: "请填写票型名称", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "请填写票型别名", trigger: "blur" }
        ],
        modelLabel: [
          { required: true, message: "请填写票型标签", trigger: "blur" }
        ],
        linkImg: [{ required: true, message: "请上传轮播图" }],
        ticketNotice: [
          { required: true, message: "请选择购票提醒", trigger: "change" }
        ],
        bookRemind: [
          { required: true, message: "请填写购票提醒内容", trigger: "blur" }
        ],
        feeDetail: [
          { required: true, message: "请填写费用明细", trigger: "blur" }
        ],
        sellType: [
          { required: true, message: "请选择分销渠道", trigger: "change" }
        ],
        stockModel: [
          { required: true, message: "请选择库存模式", trigger: "change" }
        ]
      },
      wapImgList: [],
      tagName: "",
      tagNameList: [],
      dateOptions: [
        {
          startTimeOptions: {
            disabledDate: date => {
              return date && date.valueOf() < Date.now() - 86400000;
            }
          },
          endTimeOptions: {
            disabledDate: date => {
              return date && date.valueOf() < Date.now() - 86400000;
            }
          }
        }
      ],
      dataShow: false, // 保证页面在有数据的情况下一定展示
    }
  },
  watch: {},
  created() {
    this.isEdit = this.$route && this.$route.query && this.$route.query.cId;
    
    if(this.isEdit){
      apiPost(
        '/product/api/familyTicket/edit?familyId=' +
        this.$route.query.cId
      ).then(res => {
        
        if(res&&res.data&&res.status == 200){
          this.formItem.modelName = res.data.familyTicket.modelName;
          this.formItem.nickName = res.data.familyTicket.nickName;
          // this.formItem.proGroup = res.data.parkLabelDtoList;
          // if(this.formItem.proGroup.length>0){
          //   res.data.parkLabelDtoList.forEach((item,index)=>{              
          //     res.data.parkLabelDtoList[index].sortNo = ''+res.data.parkLabelDtoList[index].sortNo;
          //     if(!res.data.parkLabelDtoList[index].radioStatus){
          //         res.data.parkLabelDtoList[index].radioStatus = 'T'
          //     }
          //   })
          //   // this.formItem.proGroup[0].radioStatus = 'T';
          //   // this.selectedGroup = 0;
          // }          
          this.tagNameList = JSON.parse(res.data.familyTicket.modelLabel);  
          if(res.data.familyTicket.modelLabel&&JSON.parse(res.data.familyTicket.modelLabel).length>0){
            this.formItem.modelLabel = res.data.familyTicket.modelLabel; 
          }else{
            this.formItem.modelLabel = '';
          } 
          // this.formItem.modelLabel = res.data.familyTicket.modelLabel; 
          this.wapImgList = res.data.familyTicket.linkImg.split(',');  
          this.formItem.linkImg = res.data.familyTicket.linkImg; 
          this.formItem.ticketNotice = res.data.familyTicket.ticketNotice;
          this.formItem.bookRemind = res.data.familyTicket.bookRemind;
          this.formItem.feeDetail = res.data.familyTicket.feeDetail;
          this.formItem.sellType = res.data.familyTicket.sellType;            
          if(res.data.productDailyStocks&&res.data.productDailyStocks.length>0){
            res.data.productDailyStocks.forEach((item, index)=>{
              res.data.productDailyStocks[index].totalNum = ''+res.data.productDailyStocks[index].totalNum;
            })
          }    
          this.formItem.tableList = res.data.productDailyStocks;    
          this.formItem.earlyAstrictType = res.data.ruleBuy.earlyAstrictType;
          this.formItem.earlyBookDay = res.data.ruleBuy.earlyBookDay || 0;
          this.formItem.earlyBookHour = res.data.ruleBuy.earlyBookHour;
          this.formItem.earlyBookMinute = res.data.ruleBuy.earlyBookMinute;
          this.formItem.isBookingTime = res.data.ruleBuy.isBookingTime;
          this.formItem.dayBegTime = res.data.ruleBuy.dayBegTime;
          this.formItem.dayEndTime = res.data.ruleBuy.dayEndTime;
          this.formItem.isRetreat = res.data.ruleSold.isRetreat;
          this.formItem.isBeforeRetreat = res.data.ruleSold.isBeforeRetreat;
          this.formItem.refundBeforeDay = res.data.ruleSold.refundBeforeDay || 0;
          this.formItem.refundBeforeTime = res.data.ruleSold.refundBeforeTime;
          this.formItem.refundBeforeVal = Number(res.data.ruleSold.refundBeforeVal);
          this.formItem.isTodayRetreat = res.data.ruleSold.isTodayRetreat;
          this.formItem.refundTodayTime = res.data.ruleSold.refundTodayTime;
          this.formItem.refundTodayVal = Number(res.data.ruleSold.refundTodayVal);
          this.formItem.isAfterRetreat = res.data.ruleSold.isAfterRetreat;
          this.formItem.refundAfterDayIn = res.data.ruleSold.refundAfterDayIn || 1;
          this.formItem.refundAfterTime = res.data.ruleSold.refundAfterTime;
          this.formItem.refundAfterVal = Number(res.data.ruleSold.refundAfterVal);
          this.formItem.isRetreatAudit = res.data.ruleSold.isRetreatAudit || 'F';
          this.formItem.earlyDayAudit = res.data.ruleSold.earlyDayAudit || 0;
          this.formItem.isOverDueCheck = res.data.ruleSold.isOverDueCheck || 'F';
          this.formItem.detailRefundType = res.data.ruleSold.detailRefundType;
          this.formItem.checkRelativeDay = res.data.ruleSold.checkRelativeDay;
          this.formItem.checkOverTime = res.data.ruleSold.checkOverTime;
          this.formItem.buyDayType = res.data.ruleBuy.buyDayType;
          this.formItem.numberType = res.data.ruleBuy.numberType;
          this.formItem.mobileIdcardType = res.data.ruleBuy.mobileIdcardType;
          this.formItem.marketTime = res.data.ruleBuy.marketTime;
          this.formItem.numAmount = res.data.ruleBuy.numAmount||1;
          this.formItem.numOrder = res.data.ruleBuy.numOrder;
          this.formItem.comboConfinrm = res.data.ruleBuy.comboConfinrm;
          this.formItem.orderTimeOut = res.data.ruleBuy.orderTimeOut;
          this.formItem.detailRefundPriceType = res.data.ruleSold.detailRefundPriceType;
          this.formItem.orderBegDay = res.data.ruleBuy.orderBegDay;
          this.formItem.orderEndDay = res.data.ruleBuy.orderEndDay;
          
          this.formItem.proGroup = res.data.parkLabelDtoList;
          if(this.formItem.proGroup.length>0){
            res.data.parkLabelDtoList.forEach((item,index)=>{              
              res.data.parkLabelDtoList[index].sortNo = ''+res.data.parkLabelDtoList[index].sortNo;
              if(!res.data.parkLabelDtoList[index].radioStatus){
                  res.data.parkLabelDtoList[index].radioStatus = 'T'
              }
              if(res.data.parkLabelDtoList[index].id == res.data.familyTicket.parkLabelId){
                this.selectedGroup = index;
              }
            })        
          }
          let labelArr = [];
          res.data.labels.forEach((item, index)=>{
            labelArr.push(item.labelValue);
          })       
          this.labelList = labelArr;
          this.dataShow = true;

          for(var i = 1; i < res.data.productDailyStocks.length; i++){
            this.dateOptions.push({
              startTimeOptions: {
                disabledDate: date => {
                  return date && date.valueOf() < Date.now() - 86400000;
                }
              },
              endTimeOptions: {
                disabledDate: date => {
                  return date && date.valueOf() < Date.now() - 86400000;
                }
              }
            })
          }
          console.log('vdsvsdv565656', this.formItem.tableList);
        }
      })
    }
    if(this.$route.query&&this.$route.query.comboId&&!this.$route.query.cId){
      apiPost(
        '/product/api/familyTicket/add?familyInfoId=' +
        this.$route.query.comboId
      ).then(res => {
        this.formItem.proGroup = res.data.parkLabelDtoList;
        if(this.formItem.proGroup.length>0){
          res.data.parkLabelDtoList.forEach((item,index)=>{              
            res.data.parkLabelDtoList[index].sortNo = ''+res.data.parkLabelDtoList[index].sortNo;
            if(!res.data.parkLabelDtoList[index].radioStatus){
                res.data.parkLabelDtoList[index].radioStatus = 'T'
            }
          })        
        }
        let labelArr = [];
        res.data.labels.forEach((item, index)=>{
          labelArr.push(item.labelValue);
        })       
        this.labelList = labelArr;
      })
    }
    
  },
  methods: {
    // getBeginDateIndex(index) {
    //   this.beginIndex = index;
    // },
    // getEndDateIndex(index) {
    //   this.endIndex = index;
    // },
    // beginDateChange(date) {
    //   // alert(date)
    //   console.log(this.formItem.tableList);
    //   this.formItem.tableList[this.beginIndex].beginDate = date;
    // },
    // endDateChange(date) {
    //   this.formItem.tableList[this.endIndex].endDate = date;
    // },
    begbDateIndex() {},
    begeDateIndex() {},
    begbDateChange(date) {
      this.formItem.orderBegDay = date;
    },
    begeDateChange(date) {
      this.formItem.orderEndDay = date;
    },
    startTimeOpenChange(e, index) {
      const tableList = this.formItem.tableList;
      if (e) {
        if (tableList[index].stockEndDate) {
          this.dateOptions[index].startTimeOptions = {
            disabledDate: date => {
              let stockEndDate = new Date(tableList[index].stockEndDate).valueOf();
              return (
                date &&
                (date.valueOf() > stockEndDate ||
                  date.valueOf() < Date.now() - 86400000)
              );
            }
          };
        }
      }
    },
    endTimeOpenChange(e, index) {
      const tableList = this.formItem.tableList;
      if (e) {
        if (tableList[index].stockBegDate) {
          this.dateOptions[index].endTimeOptions = {
            disabledDate: date => {
              let stockBegDate = new Date(tableList[index].stockBegDate).valueOf();
              return date && date.valueOf() < stockBegDate;
            }
          };
        }
      }
    },
    handle() {
      // 用于初始化第一个tr
      this.formItem.tableList.splice(0, this.formItem.tableList.length, {
        stockBegDate: "",
        stockEndDate: "",
        totalNum: ""
      });
    },
    add() {
      this.formItem.tableList.push({
        stockBegDate: "",
        stockEndDate: "",
        totalNum: ""
      });
      this.dateOptions.push({
        startTimeOptions: {
          disabledDate: date => {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        endTimeOptions: {
          disabledDate: date => {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        }
      });
    },
    del(index) {
      this.formItem.tableList.splice(index, 1);
      this.dateOptions.splice(index, 1);
      this.$Message.error('请到该票型下的价格库存日历中删除库存！');
    },
    submit() {
      let _this = this;
      if (this.$route.query.action) {
        this.formItem.action = "add";   
        this.formItem.familyInfoId = this.$route.query.comboId;     
      } else {
        this.formItem.action = "redisAdd";
      }

      // 做一个深拷贝，改变数据字段
      let postParams = JSON.parse(JSON.stringify(this.formItem));
      postParams.tableList.forEach(element => {
        element.stockBegDate = this.filter.formatDate(
          this.common.changeDate(element.stockBegDate),
          "yyyy-MM-dd"
        );
        element.stockEndDate = this.filter.formatDate(
          this.common.changeDate(element.stockEndDate),
          "yyyy-MM-dd"
        );
      });
      //判断产品分组是否为空并且选中
      // if (postParams.proGroup.length > 0) {
      //   let flag = false;
      //   postParams.proGroup.forEach((item, index) => {
      //     if (index == this.selectedGroup) {
      //       flag = true;            
      //     }          
      //   });
      //   if(flag){
      //       postParams.proGroup[this.selectedGroup].radioStatus = "T";
      //     } else {      
      //       alert("请选择一个产品分组！");
      //       return false;      
      //     }
      // } else {
      //   alert("请添加产品分组！");          
      //   return;
      // }
      postParams.proGroup.forEach((item, index) => {
        postParams.proGroup[index].radioStatus = "T"
        if (index == this.selectedGroup){
          postParams.proGroup[this.selectedGroup].radioStatus = "F";
        }
      })
      postParams.ticketStockDtoList = JSON.stringify(postParams.tableList);
      postParams.parkLabelDtoList = JSON.stringify(postParams.proGroup);

      delete postParams.tableList;
      delete postParams.proGroup;
      
      let url = this.isEdit ? '/product/api/familyTicket/updateFamilyTicket?id=' + this.$route.query.cId : '/product/api/familyTicket/saveFamilyTicket';
      this.$refs.formItem.validate(async valid => {
        this.scrollError()
        if (valid){
          let res = await apiPost(url, postParams);
          if (res.status == 200) {
             _this.$Message.success("保存成功");
            if(_this.$route.query.comboId){
              _this.$router.push('/comboTicket?comboId='+_this.$route.query.comboId);
            }else if(_this.$route.query.cId && !_this.$route.query.comboId){
              _this.$router.push('/comboTicket');
            }else{
              _this.$router.push('/comboInfo');
            }
          }else{
             _this.$Message.warning(res.message)
          }
        }else{
          // 滚动到错误地方
          this.$nextTick(()=>{
            setTimeout(function () {
              $('#content').scrollTop(
                $('.ivu-form-item-error').offset().top -
                90 +
                $('#content').scrollTop()
              )
            }, 500)
          });
          return;
        }
      });
      // this.common.formPost(this, {
      //   url,
      //   params: postParams,
      //   callback(res) {
      //     if (res.status == 200) {
      //       _this.$Message.success("保存成功");
      //       // _this.$router.push('/comboTicket?id='+_this.$route.query.cId);
      //       if(_this.$route.query.comboId){
      //         _this.$router.push('/comboTicket?comboId='+_this.$route.query.comboId);
      //       }else{
      //         _this.$router.push('/comboInfo');
      //       }            
      //     }
      //   }
      // });
    },
    quxiao() {
      if(this.$route.query.comboId){
        this.$router.push('/comboTicket?comboId='+this.$route.query.comboId);
      }else if(this.$route.query &&this.$route.query.nAdd=='normalAdd'){
        this.$router.push('/publishCombo');
      }else{
        this.$router.push('/comboInfo');
      }
    },
    scrollError () {
      let errList = $('.ivu-form-item-error')
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top
        $('#content').animate(
          {
            scrollTop: scroll_offset
          },
          300
        )
      }
    },
    //产品分组
    addGroup() {
      this.formItem.proGroup.push({
        radioStatus: "T",
        labelValue: "",
        sortNo: "",
        id: "",
        isRequired: false
      });
    },
    delGroup(item,index) {
      console.log(item, index);
      if(item && item.id&&item.id!=''){
        apiPost(
          '/product/api/familyTicket/delFamilylabel?familylabelId=' +
          item.id
        ).then(res => {
          if(res.status == 200){
            this.$Message.warning(res.message);            
            if(this.selectedGroup == index){
              this.selectedGroup = null;
            }
            this.formItem.proGroup.splice(index, 1);
          }else{
            this.$Message.warning(res.message);
            return;
          }
          // console.log(res);
        })
      }else{
        if(this.selectedGroup == index){          
          this.formItem.proGroup.forEach((it,ind)=>{
            this.formItem.proGroup[ind].radioStatus = 'T';
          })                
        }
        this.formItem.proGroup.splice(index, 1);        
      }
      
    },
    //轮播图
    setWapListUrl(imgArr) {
      if (imgArr.length > 5) {
        this.formItem.linkImg = imgArr.slice(0, 5).join(",");
      } else {
        this.formItem.linkImg = imgArr.join(",");
      }
      this.$refs.formItem.validateField("linkImg");
    },
    //删除套票票型标签
    subjectItemDel(index) {
      this.tagNameList.splice(index, 1);

      this.formItem.modelLabel = JSON.stringify(this.tagNameList);
    },
    // 回车添加标签名
    setSubjectTag() {
      if (this.tagNameList && this.tagNameList.length < 4) {
        if (this.tagName) {
          this.tagNameList.push(this.tagName);
          this.formItem.modelLabel = JSON.stringify(this.tagNameList);
          this.tagName = "";
        } else {
          this.$Message.warning("请输入标签名！");
        }
      } else {
        this.$Message.warning("最多添加四个标签！");
      }
    },
    addTosubject(item) {
      if(this.tagNameList.length<4){
        this.tagNameList.push(item);
        this.formItem.modelLabel =JSON.stringify(this.tagNameList);
      }else{
        this.$Message.warning("最多添加四个标签！");
      }      
    },
    goToCombo(){
      if(this.$route.query.comboId){
        this.$router.push('/publishCombo?comboId='+this.$route.query.comboId);
      }else if(this.$route.query &&this.$route.query.nAdd=='normalAdd'){
        this.$router.push('/publishCombo');
      }
    }
  },
  components: {
    ueditor,
    myImg
  }
};
</script>
<style scope lang="scss">
.form-title {
  background: #dedbdb;
  padding: 5px;
  border-left: 4px solid rgba(100, 182, 255, 1);
  font-size: 16px;
  margin-bottom: 10px;
}
.page-title {
  margin-bottom: 15px;
}
.ivu-date-picker .ivu-select-dropdown {
  z-index: 1000;
}

.edui-default .edui-editor {
  z-index: 666 !important;
}
.table {
  margin-bottom: 15px;
  width: 100%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  thead {
    tr {
      th {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
      }
      th:first-child {
        text-align: center;
      }
    }
  }
  tbody {
    tr {
      td {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
      }
      td:first-child {
        // text-align: center
      }
    }
  }
}
td.time {
  width: 450px;
}
.add-icon {
  cursor: pointer;
  color: green;
  font-size: 28px;
}
.delete-icon {
  cursor: pointer;
  color: red;
  font-size: 28px;
}
.center-td {
  text-align: center;
}
.comboTickets-addoredit {
  em {
    font-style: normal;
    margin: 0 5px;
  }
  .nowDayRule {
    .ivu-form-item-label {
      width: 132px !important;
    }
  }
}
.comboTickets-addoredit {
  .travellSubject {
    height: 32px;
    .subject-list {
      float: left;
      margin-right: 10px;
      .subject-list-item {
        display: inline-block;
        margin-right: 10px;
        position: relative;
        .subject-list-item-del {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .subject-list-item:hover {
        .subject-list-item-del {
          display: inline-block;
        }
      }
    }
    .subject-input {
      float: left;
    }
  }
  .dayStock-input-box {
    .ivu-form-item-content {
      margin-left: 0 !important;
    }
  }
  .label-item:hover{

  }

  .step {
    width: 60%;
    margin: 2.5rem auto;
  }
}
</style>

