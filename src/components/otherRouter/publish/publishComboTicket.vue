<template>
  <div>
    <div class="step">
      <Steps :current="2">
        <Step title="产品类型"></Step>
        <Step title="景区信息"></Step>
        <Step title="门票信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <Form :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm">
      <div id="base"
           class="form-title">基本信息</div>
      <FormItem label="门票名称："
                prop="modelName">
        <Input v-model="formItem.modelName"
               placeholder="请输入门票名称"
               style="width:33%"
               :maxlength="30"></Input>
      </FormItem>
      <FormItem label="门票别名："
                prop="nickName">
        <Input v-model="formItem.nickName"
               placeholder="请输入门票别名"
               style="width:33%"
               :maxlength="30"></Input>
      </FormItem>
      <FormItem label="外部编码："
                prop="externalCode"
                v-if="parkInfo.channel=='0'">
        <Input v-model="formItem.externalCode"
               placeholder="请输外部编码"
               style="width:33%"
               :maxlength="30"></Input>
      </FormItem>
      <FormItem label="是否推送云票务："
                prop="isSyncYpw"
                v-if="parkInfo.channel=='-1'">
        <Select v-model="formItem.isSyncYpw"
                style="width:200px">
          <Option value="F">否</Option>
          <Option value="T">是</Option>
        </Select>
      </FormItem>
      <FormItem label="票型说明：">
        <Input v-model="formItem.modelExplain"
               type="textarea"
               :autosize="{minRows: 2,maxRows: 5}"
               placeholder="请填写门票说明"
               style="width:33%"></Input>
      </FormItem>
      <FormItem label="产品分组：">
        <span v-for="(item,index) in formItem.groupItems"
              :key="index"
              class="group-item"
              :class="{'group-item-selected':index==groupselected}"
              @click="selectGroup(index)">
          <FormItem :prop="'groupItems.' + index + '.groupValue'"
                    :rules="{required: true, message: '该项不能为空', trigger: 'blur'}">
            <Input v-model="item.groupValue"
                   placeholder="填写分组名"></Input>
          </FormItem>
          <Icon type="android-close"
                @click.stop="delGroup(index)"
                class="group-del"
                v-if="formItem.groupItems.length>1"></Icon>
        </span>
        <Button type="primary"
                @click="addGroup"
                :disabled="groupDisabled">新增分组名称</Button>
      </FormItem>
      <FormItem label="是否实名制票型："
                prop="isRealName"
                v-if="parkInfo.channel=='0'">
        <Select v-model="formItem.isRealName"
                style="width:200px">
          <Option value="F">否</Option>
          <Option value="T">是</Option>
        </Select>
      </FormItem>
      <FormItem label="是否立即上架："
                prop="enabled">
        <Select v-model="formItem.enabled"
                style="width:200px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
      </FormItem>
      <FormItem label="特殊渠道销售："
                prop="isSpecial">
        <Select v-model="formItem.isSpecial"
                style="width:200px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
        <span style="color: red;">备注：“否”则正常展示对应销售渠道，选择“是”则需从“店铺设置-店铺二维码”中获取特殊渠道二维码方可显示</span>
      </FormItem>
      <FormItem label="销售渠道："
                prop="sellType">
        <Select v-model="formItem.sellType"
                style="width:200px">
          <Option value="">请选择</Option>
          <Option v-for="item in list"
                  :key="item.value"
                  :value="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="预订须知："
                prop="orderNotice">
        <ueditor v-model="formItem.orderNotice"></ueditor>
      </FormItem>
      <FormItem label="库存模式："
                prop="stockModel">
        <RadioGroup v-model="formItem.stockModel">
          <Radio label="day">
            <span>日库存</span>
          </Radio>
          <Radio label="unlimit">
            <span>无限库存</span>
          </Radio>
          <Radio label="limit">
            <span>有限库存</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="formItem.stockModel=='limit'"
                label="有限库存数量："
                prop="totalStockNum">
        <Input v-model="formItem.totalStockNum"
               placeholder="请输有限库存数量："
               style="width:120px"
               number></Input>
        <!-- <InputNumber v-model="formItem.totalStockNum"></InputNumber> -->
      </FormItem>
      <template v-if="formItem.sellType!='2'">
        <FormItem label="建议最低零售价："
                  prop="priceMin">
          <Input v-model="formItem.priceMin"
                 placeholder="请输建议最低零售价："
                 style="width:120px"
                 number></Input>
          元
        </FormItem>
        <FormItem label="建议最高零售价："
                  prop="priceMax">
          <Input v-model="formItem.priceMax"
                 placeholder="请输建议最高零售价："
                 style="width:120px"
                 number></Input>元
        </FormItem>
      </template>
      <FormItem label="购票是否提醒：">
        <Select v-model="formItem.isShowTicketNotice"
                style="width:200px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
      </FormItem>
      <FormItem label="提醒说明："
                v-if="formItem.isShowTicketNotice=='T'">
        <ueditor v-model="formItem.ticketNotice"></ueditor>
      </FormItem>
      <div>
        <table class="table">
          <thead>
            <tr>
              <th>
                <Icon class="add-icon"
                      @click="add"
                      type="android-add-circle"></Icon>
              </th>
              <th>时间段/星期（预订周期不能重复）</th>
              <th>成本价</th>
              <th>门市价</th>
              <th>渠道类别</th>
              <th v-if="formItem.sellType=='2'||formItem.sellType=='0'||formItem.sellType==''">零售价</th>
              <th v-if="formItem.sellType=='1'||formItem.sellType=='0'||formItem.sellType==''">供货价</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item,index) in formItem.tableList">
              <template v-if="formItem.sellType=='0'||formItem.sellType==''">
                <tr>
                  <td class="center-td"
                      rowspan="2">
                    <Icon class="delete-icon"
                          @click="del(index)"
                          type="android-remove-circle"></Icon>
                  </td>
                  <td rowspan="2"
                      class="time center-td">
                    <div>
                      <Row>
                        <Col span="11">
                        <FormItem :prop="'tableList.'+index+'.startTime'"
                                  :rules="{required: true,type: 'date', message: '开始时间不能为空', trigger: 'change'}"
                                  :label-width="1">
                          <DatePicker type="date"
                                      v-model="item.startTime"
                                      placeholder="开始时间"
                                      style="width: 120px"
                                      :options="dateOptions[index].startTimeOptions"
                                      @on-open-change="startTimeOpenChange($event,index)"></DatePicker>
                        </FormItem>
                        </Col>
                        <Col span="2"
                             style="text-align: center">-
                        </Col>
                        <Col span="11">
                        <FormItem :prop="'tableList.'+index+'.endTime'"
                                  :rules="{required: true,type: 'date', message: '结束时间不能为空', trigger: 'change'}"
                                  :label-width="1">
                          <DatePicker type="date"
                                      v-model="item.endTime"
                                      placeholder="结束时间"
                                      style="width: 120px"
                                      :options="dateOptions[index].endTimeOptions"
                                      @on-open-change="endTimeOpenChange($event,index)"></DatePicker>
                        </FormItem>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <CheckboxGroup v-model="item.weeks">
                        <Checkbox label="1">
                          <span>一</span>
                        </Checkbox>
                        <Checkbox label="2">
                          <span>二</span>
                        </Checkbox>
                        <Checkbox label="3">
                          <span>三</span>
                        </Checkbox>
                        <Checkbox label="4">
                          <span>四</span>
                        </Checkbox>
                        <Checkbox label="5">
                          <span>五</span>
                        </Checkbox>
                        <Checkbox label="6">
                          <span>六</span>
                        </Checkbox>
                        <Checkbox label="0">
                          <span>日</span>
                        </Checkbox>
                      </CheckboxGroup>
                    </div>
                    <div>
                      <Button type="ghost"
                              @click="selectAll(index)"
                              size="small">全选</Button>
                      <Button type="ghost"
                              @click="selectTime(index)"
                              size="small">平时</Button>
                      <Button type="ghost"
                              @click="selectWeekend(index)"
                              size="small">周末</Button>
                    </div>
                  </td>
                  <td class="num"
                      rowspan="2">
                    <FormItem :prop="'tableList.'+index+'.costPrice'"
                              :rules="[{required: true, message: '成本价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.costPrice"
                             placeholder="请输入成本价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                  <td class="num"
                      rowspan="2">
                    <FormItem :prop="'tableList.'+index+'.rackPrice'"
                              :rules="[{required: true, message: '门市价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.rackPrice"
                             placeholder="请输入门市价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                  <td>店铺</td>
                  <td>
                    <FormItem :prop="'tableList.'+index+'.retailPrice'"
                              :rules="[{required: true, message: '零售价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.retailPrice"
                             placeholder="请输入零售价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="2">分销市场</td>
                  <td>
                    <FormItem :prop="'tableList.'+index+'.supplyPrice'"
                              :rules="[{required: true, message: '供货价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.supplyPrice"
                             placeholder="请输入供货价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                </tr>
              </template>
              <template v-if="formItem.sellType=='1'">
                <tr>
                  <td class="center-td">
                    <Icon class="delete-icon"
                          @click="del(index)"
                          type="android-remove-circle"></Icon>
                  </td>
                  <td class="time">
                    <div>
                      <Row>
                        <Col span="11">
                        <FormItem :prop="'tableList.'+index+'.startTime'"
                                  :rules="{required: true,type: 'date', message: '开始时间不能为空', trigger: 'change'}"
                                  :label-width="1">
                          <DatePicker type="date"
                                      v-model="item.startTime"
                                      placeholder="开始时间"
                                      style="width: 120px"
                                      :options="dateOptions[index].startTimeOptions"
                                      @on-open-change="startTimeOpenChange($event,index)"></DatePicker>
                        </FormItem>
                        </Col>
                        <Col span="2"
                             style="text-align: center">-
                        </Col>
                        <Col span="11">
                        <FormItem :prop="'tableList.'+index+'.endTime'"
                                  :rules="{required: true,type: 'date', message: '结束时间不能为空', trigger: 'change'}"
                                  :label-width="1">
                          <DatePicker type="date"
                                      v-model="item.endTime"
                                      placeholder="结束时间"
                                      style="width: 120px"
                                      :options="dateOptions[index].endTimeOptions"
                                      @on-open-change="endTimeOpenChange($event,index)"></DatePicker>
                        </FormItem>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <CheckboxGroup v-model="item.weeks">
                        <Checkbox label="1">
                          <span>一</span>
                        </Checkbox>
                        <Checkbox label="2">
                          <span>二</span>
                        </Checkbox>
                        <Checkbox label="3">
                          <span>三</span>
                        </Checkbox>
                        <Checkbox label="4">
                          <span>四</span>
                        </Checkbox>
                        <Checkbox label="5">
                          <span>五</span>
                        </Checkbox>
                        <Checkbox label="6">
                          <span>六</span>
                        </Checkbox>
                        <Checkbox label="0">
                          <span>日</span>
                        </Checkbox>
                      </CheckboxGroup>
                    </div>
                    <div>
                      <Button type="ghost"
                              @click="selectAll(index)"
                              size="small">全选</Button>
                      <Button type="ghost"
                              @click="selectTime(index)"
                              size="small">平时</Button>
                      <Button type="ghost"
                              @click="selectWeekend(index)"
                              size="small">周末</Button>
                    </div>
                  </td>
                  <td class="num">
                    <FormItem :prop="'tableList.'+index+'.costPrice'"
                              :rules="[{required: true, message: '成本价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.costPrice"
                             placeholder="请输入成本价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                  <td class="num">
                    <FormItem :prop="'tableList.'+index+'.rackPrice'"
                              :rules="[{required: true, message: '门市价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.rackPrice"
                             placeholder="请输入门市价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                  <td>分销市场</td>
                  <td>
                    <FormItem :prop="'tableList.'+index+'.supplyPrice'"
                              :rules="[{required: true, message: '供货价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.supplyPrice"
                             placeholder="请输入供货价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                </tr>
              </template>
              <template v-if="formItem.sellType=='2'">
                <tr>
                  <td class="center-td">
                    <Icon class="delete-icon"
                          @click="del(index)"
                          type="android-remove-circle"></Icon>
                  </td>
                  <td class="time">
                    <div>
                      <Row>
                        <Col span="11">
                        <FormItem :prop="'tableList.'+index+'.startTime'"
                                  :rules="{required: true,type: 'date', message: '开始时间不能为空', trigger: 'change'}"
                                  :label-width="1">
                          <DatePicker type="date"
                                      v-model="item.startTime"
                                      placeholder="开始时间"
                                      style="width: 120px"
                                      :options="dateOptions[index].startTimeOptions"
                                      @on-open-change="startTimeOpenChange($event,index)"></DatePicker>
                        </FormItem>
                        </Col>
                        <Col span="2"
                             style="text-align: center">-
                        </Col>
                        <Col span="11">
                        <FormItem :prop="'tableList.'+index+'.endTime'"
                                  :rules="{required: true,type: 'date', message: '结束时间不能为空', trigger: 'change'}"
                                  :label-width="1">
                          <DatePicker type="date"
                                      v-model="item.endTime"
                                      placeholder="结束时间"
                                      style="width: 120px"
                                      :options="dateOptions[index].endTimeOptions"
                                      @on-open-change="endTimeOpenChange($event,index)"></DatePicker>
                        </FormItem>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <CheckboxGroup v-model="item.weeks">
                        <Checkbox label="1">
                          <span>一</span>
                        </Checkbox>
                        <Checkbox label="2">
                          <span>二</span>
                        </Checkbox>
                        <Checkbox label="3">
                          <span>三</span>
                        </Checkbox>
                        <Checkbox label="4">
                          <span>四</span>
                        </Checkbox>
                        <Checkbox label="5">
                          <span>五</span>
                        </Checkbox>
                        <Checkbox label="6">
                          <span>六</span>
                        </Checkbox>
                        <Checkbox label="0">
                          <span>日</span>
                        </Checkbox>
                      </CheckboxGroup>
                    </div>
                    <div>
                      <Button type="ghost"
                              @click="selectAll(index)"
                              size="small">全选</Button>
                      <Button type="ghost"
                              @click="selectTime(index)"
                              size="small">平时</Button>
                      <Button type="ghost"
                              @click="selectWeekend(index)"
                              size="small">周末</Button>
                    </div>
                  </td>
                  <td class="num">
                    <FormItem :prop="'tableList.'+index+'.costPrice'"
                              :rules="[{required: true, message: '成本价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.costPrice"
                             placeholder="请输入成本价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                  <td class="num">
                    <FormItem :prop="'tableList.'+index+'.rackPrice'"
                              :rules="[{required: true, message: '门市价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.rackPrice"
                             placeholder="请输入门市价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                  <td>店铺</td>
                  <td>
                    <FormItem :prop="'tableList.'+index+'.retailPrice'"
                              :rules="[{required: true, message: '零售价不能为空', trigger: 'blur'},{ validator: common.validate.floatNumber, trigger: 'blur' }]"
                              :label-width="1">
                      <Input v-model="item.retailPrice"
                             placeholder="请输入零售价"
                             style="width:120px"></Input>
                    </FormItem>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
      <div id="senicInfo"
           class="form-title">预定规则</div>
      <FormItem label="可购时间限制：">
        <RadioGroup v-model="formItem.buyFarthestType">
          <Radio label="any">
            <span>不限</span>
          </Radio>
          <Radio label="recent">
            <span>可购最近</span>
            <template v-if="formItem.buyFarthestType=='recent'">
              <InputNumber></InputNumber>天 (控制预订开始时间，当为1时则当天可预订)
            </template>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="下单日期限制：">
        <FormItem style="width:112px;display:inline-block"
                  prop="openTime">
          <DatePicker v-model="formItem.orderBegDay"
                      type="date"
                      placeholder=""
                      style="width: 112px"></DatePicker>
        </FormItem>
        <span>-</span>
        <FormItem style="width:112px;display:inline-block"
                  prop="endTime">
          <DatePicker v-model="formItem.orderEndDay"
                      type="date"
                      placeholder=""
                      style="width: 112px"></DatePicker>
        </FormItem>
      </FormItem>
      <FormItem label="下单时间限制：">
        <FormItem style="width:112px;display:inline-block"
                  prop="openTime">
          <TimePicker v-model="formItem.dayBegTime"
                      format="HH:mm"
                      placeholder=""
                      style="width: 112px"></TimePicker>
        </FormItem>
        <span>-</span>
        <FormItem style="width:112px;display:inline-block"
                  prop="endTime">
          <TimePicker v-model="formItem.dayEndTime"
                      format="HH:mm"
                      placeholder=""
                      style="width: 112px"></TimePicker>
        </FormItem>
      </FormItem>
      <FormItem label="购买数量限定：">
        <InputNumber v-model="formItem.minOrder"></InputNumber>
        <span>-</span>
        <InputNumber v-model="formItem.maxOrder"></InputNumber>
      </FormItem>
      <FormItem label="提前预订天数：">
        <InputNumber v-model="formItem.earlyBookDay"></InputNumber> 天
      </FormItem>
      <FormItem label="下单人身份证：">
        <RadioGroup v-model="formItem.isNeedIdcard">
          <Radio label="F">
            <span>选填</span>
          </Radio>
          <Radio label="T">
            <span>必填</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <template v-if="formItem.isNeedIdcard=='T'">
        <FormItem label="年龄限定："
                  prop="priceShow">
          <Row>
            <Col span="1">
            <FormItem prop="openTime">
              <InputNumber v-model="formItem.minAge"></InputNumber>
            </FormItem>
            </Col>
            <Col span="1"
                 style="text-align: center">-</Col>
            <Col span="1">
            <FormItem prop="endTime">
              <InputNumber v-model="formItem.maxAge"></InputNumber>
            </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="性别限定：">
          <RadioGroup>
            <Radio label="">
              <span>不限</span>
            </Radio>
            <Radio label="X">
              <span>仅男士</span>
            </Radio>
            <Radio label="Y">
              <span>仅女士</span>
            </Radio>
          </RadioGroup>
        </FormItem>
      </template>
      <div id="distSet"
           class="form-title">退改规则</div>
      <FormItem label="退单是否允许：">
        <RadioGroup v-model="formItem.isRetreat">
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="退单是否需要审核：">
        <RadioGroup v-model="formItem.isRetreatAudit">
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit"
                :loading="btnLoading">保存</Button>
        <Button type="ghost"
                style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="handleScroll('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="handleScroll('senicInfo')">预定规则</a>
        </li>
        <li>
          <a href="javascript:;"
             class="tartg-a"
             @click="handleScroll('distSet')">退改规则</a>
        </li>
        <li>
          <Button size="small"
                  type="primary"
                  @click="submit"
                  :loading="btnLoading">保存</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ueditor from '@/components/global/vueUEditor'
export default {
  data () {
    return {
      limitType: 'any',
      isSelect: 'F',
      parkInfo: {},
      social: [],
      type: '',
      distributionWay: '0',
      lmitList: [
        {
          value: 'all',
          label: '无限制'
        }
      ],
      list: [
        {
          value: '0',
          label: '分销市场+店铺'
        },
        {
          value: '1',
          label: '仅分销市场'
        },
        {
          value: '2',
          label: '仅店铺'
        }
      ],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      formItem: {
        modelName: '',
        nickName: '',
        isSyncYpw: 'F',
        externalCode: '',
        modelExplain: '',
        enabled: 'T',
        sellType: '',
        isRealName: 'F',
        orderNotice: '',
        stockModel: 'day',
        totalStockNum: '',
        priceMin: '',
        priceMax: '',
        buyFarthestType: 'any',
        buyFarthestDay: '',
        orderBegDay: '',
        orderEndDay: '',
        dayBegTime: '',
        dayEndTime: '',
        minOrder: 0,
        maxOrder: 0,
        earlyBookDay: 0,
        isNeedIdcard: 'F',
        minAge: 0,
        maxAge: 0,
        sex: '',
        isRetreat: 'F',
        isRetreatAudit: 'F',
        isSpecial: 'F',
        isShowTicketNotice: 'F',
        groupItems: [
          {
            groupValue: '门票',
            groupValueId: ''
          }
        ],
        parklabelId: 0,
        tableList: [{
          weeks: ['1', '2', '3', '4', '5', '6', '0'],
          startTime: '',
          endTime: '',
          costPrice: '',
          rackPrice: '',
          retailPrice: '',
          supplyPrice: ''
        }]
      },
      ruleComplteForm: {
        modelName: [{ required: true, message: '请填写门票名称', trigger: 'blur' }],
        nickName: [{ required: true, message: '请填写门票别名', trigger: 'blur' }],
        externalCode: [{ required: true, message: '请填写外部编码', trigger: 'blur' }],
        isSyncYpw: [
          { required: true, message: '请选择是否推送云票务', trigger: 'change' }
        ],
        isRealName: [
          { required: true, message: '请选择是否实名制票型', trigger: 'change' }
        ],
        enabled: [
          { required: true, message: '请选择是否立即上架', trigger: 'change' }
        ],
        isSpecial: [
          { required: true, message: '请选择是否特殊渠道', trigger: 'change' }
        ],
        sellType: [
          { required: true, message: '请选择分销渠道', trigger: 'change' }
        ],
        stockModel: [
          { required: true, message: '请选择库存模式', trigger: 'change' }
        ],
        totalStockNum: [
          { required: true, message: '请填写有限库存数量', trigger: 'blur' }
        ],
        priceMin: [
          { required: true, type: 'number', message: '请填写建议最低零售价', trigger: 'blur' },
          { validator: this.common.validate.floatNumber, trigger: 'blur' }
        ],
        priceMax: [
          { required: true, type: 'number', message: '请填写建议最高零售价', trigger: 'blur' },
          { validator: this.common.validate.floatNumber, trigger: 'blur' }
        ],
        orderNotice: [
          { required: true, message: '请填写预定须知', trigger: 'blur' }
        ]
      },
      groupDisabled: false,
      groupselected: 0,
      btnLoading: false,
      dateOptions: [
        {
          startTimeOptions: {
            disabledDate: date => {
              return date && date.valueOf() < Date.now() - 86400000
            }
          },
          endTimeOptions: {
            disabledDate: date => {
              return date && date.valueOf() < Date.now() - 86400000
            }
          }
        }
      ]
    }
  },
  watch: {
    'formItem.sellType': 'handle'
  },
  async mounted () {
    let res = await this.apiGet('/product/parkPublish/publishParkTicketFL')
    if (res.success) {
      this.parkInfo = res.data.parkInfoDto
      res.data.parkLabelList.forEach(element => {
        this.formItem.groupItems.push({
          groupValue: element.labelValue,
          groupValueId: element.id
        })
      })
      switch (res.data.parkInfoDto.distType) {
        case '1':
          this.list.splice(0, 1)
          this.list.splice(1, 1)
          break
        case '2':
          this.list.splice(0, 2)
          break
      }
    }
  },
  methods: {
    handleScroll (str) {
      let offsetTop = document.getElementById(str).offsetTop
      let content = document.getElementById('content')
      content.scrollTop = offsetTop - 60
    },
    handle () { // 用于初始化第一个tr
      this.formItem.tableList.splice(0, this.formItem.tableList.length, {
        weeks: ['1', '2', '3', '4', '5', '6', '0'],
        startTime: '',
        endTime: '',
        costPrice: '',
        rackPrice: '',
        retailPrice: '',
        supplyPrice: ''
      })
    },
    selectAll (index) {
      this.formItem.tableList[index].weeks = ['1', '2', '3', '4', '5', '6', '0']
    },
    selectTime (index) {
      this.formItem.tableList[index].weeks = ['1', '2', '3', '4', '5']
    },
    selectWeekend (index) {
      this.formItem.tableList[index].weeks = ['6', '0']
    },
    add () {
      this.formItem.tableList.push({
        weeks: ['1', '2', '3', '4', '5', '6', '0'],
        startTime: '',
        endTime: '',
        costPrice: '',
        rackPrice: '',
        retailPrice: '',
        supplyPrice: ''
      })
      this.dateOptions.push({
        startTimeOptions: {
          disabledDate: date => {
            return date && date.valueOf() < Date.now() - 86400000
          }
        },
        endTimeOptions: {
          disabledDate: date => {
            return date && date.valueOf() < Date.now() - 86400000
          }
        }
      })
    },
    del (index) {
      this.formItem.tableList.splice(index, 1)
      this.dateOptions.splice(index, 1)
    },
    addGroup () {
      this.formItem.groupItems.push({
        groupValue: '',
        groupValueId: ''
      })
      this.setGroupDisabled()
    },
    selectGroup (index) {
      this.formItem.parklabelId = index
      this.groupselected = index
    },
    delGroup (index) {
      this.formItem.groupItems.splice(index, 1)
      if (index === this.groupselected) {
        this.formItem.parklabelId = 0
        this.groupselected = 0
      }
      this.setGroupDisabled()
    },
    setGroupDisabled () {
      if (this.formItem.groupItems.length > 4) {
        this.groupDisabled = true
      } else {
        this.groupDisabled = false
      }
    },
    // startTimeChange (e, index) {
    //   this.dateOptions[index].endTimeOptions = {
    //     disabledDate: date => {
    //       let startTime = new Date(e).valueOf() - 1 * 24 * 60 * 60 * 1000
    //       return date && (date.valueOf() < startTime)
    //     }
    //   }
    // },
    // endTimeChange (e, index) {
    //   this.dateOptions[index].startTimeOptions = {
    //     disabledDate: date => {
    //       let endTime = new Date(e).valueOf() - 1 * 24 * 60 * 60 * 1000
    //       return date && (date.valueOf() > endTime || date.valueOf() < (Date.now() - 86400000))
    //     }
    //   }
    // },
    startTimeOpenChange (e, index) {
      const tableList = this.formItem.tableList
      if (e) {
        if (tableList[index].endTime) {
          this.dateOptions[index].startTimeOptions = {
            disabledDate: date => {
              let endTime = new Date(tableList[index].endTime).valueOf()
              return date && (date.valueOf() > endTime || date.valueOf() < (Date.now() - 86400000))
            }
          }
        }
      }
    },
    endTimeOpenChange (e, index) {
      const tableList = this.formItem.tableList
      if (e) {
        if (tableList[index].startTime) {
          this.dateOptions[index].endTimeOptions = {
            disabledDate: date => {
              let startTime = new Date(tableList[index].startTime).valueOf()
              return date && (date.valueOf() < startTime)
            }
          }
        }
      }
    },
    submit () {
      console.log(this.formItem)
      let _this = this
      // 做一个深拷贝，改变数据字段
      let postParams = JSON.parse(JSON.stringify(this.formItem))
      postParams.tableList.forEach(element => {
        element.weeks = element.weeks.join(',')
        element.startTime = this.filter.formatDate(this.common.changeDate(element.startTime), 'yyyy-MM-dd')
        element.endTime = this.filter.formatDate(this.common.changeDate(element.endTime), 'yyyy-MM-dd')
      })
      postParams.parkTicketPriceJson = JSON.stringify(postParams.tableList)
      delete postParams.tableList
      let url = '/product/parkPublish/saveParkTicketFL'
      this.common.formPost(this, {
        url,
        params: postParams,
        callback (res) {
          if (res.success) {
            _this.$Message.success('保存成功')
          }
        }
      })
    }
  },
  components: {
    ueditor
  }
}
</script>
<style scope lang="scss">
.step {
  width: 60%;
  margin: 2.5rem auto;
}
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
  width: 330px;
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
.step-list {
  padding-top: 20px;
  display: inline-block;
  margin: 0 auto;
}

.step-list .step-item {
  display: inline-block;
  width: 160px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.step-list .step-item .line-img {
  position: absolute;
  top: 10px;
  left: 92px;
}

.step-list .step-item .line-img.line-nodo-img {
  top: 10px;
  width: 155px;
  left: 92px;
}

.step-list .step-item .step-title {
  margin-top: 10px;
  color: #19a2fe;
}

.step-list .step-item .step-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.step-list .step-item .step-nodo {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 9px;
}
.fixed-box {
  position: fixed;
  top: 40%;
  right: 24px;
  background: #ffffff;
  z-index: 1000;
  ul {
    list-style: none;
    li {
      text-align: center;
      width: 100px;
      button {
        width: 100%;
      }
      a {
        display: block;
        padding: 3px 7px;
        text-decoration: none;
        border-bottom: 1px solid #e2d5d5;
      }
    }
    li:first-child a {
      color: #ffffff;
      background: #0099ff;
    }
  }
  .btn-primary-outline {
    color: #5a98de;
    background-color: transparent;
    background-image: none;
    border-color: #5a98de;
  }
}
.group-item {
  display: inline-block;
  width: 100px;
  margin-right: 20px;
  position: relative;
  .group-del {
    position: absolute;
    top: 10px;
    right: 5px;
  }
}
.group-item-selected input {
  border: 1px solid #5a98de;
}
</style>
