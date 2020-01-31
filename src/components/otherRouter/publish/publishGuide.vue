<template>
  <div class="comboPublish-box">
    <div class="step">
        <!--<Steps :current="1">-->
            <!--<Step title="产品信息"></Step>-->
            <!--<Step title="分销设置"></Step>-->
            <!--<Step title="完成"></Step>-->
        <!--</Steps>-->
      </div>
    <Form
      :model="formItem"
      label-position="right"
      :label-width="150"
      ref="formItem"
      :rules="ruleComplteForm"
    >
      <div id="base" class="form-title">基本信息</div>

      <FormItem label="导游归属：" prop="belongTo">
        <Input v-model="formItem.belongTo" style="width:33%;" :maxlength="20" placeholder="请输入导游归属"></Input>
      </FormItem>
      <FormItem label="导游产品名称：" prop="productName">
        <Input v-model="formItem.productName" style="width:33%" :maxlength="20" placeholder="请输入导游产品名称"></Input>
      </FormItem>
      <FormItem label="导游产品类型：" prop="productType">
        <Select v-model="formItem.productType" style="width:200px" >
          <Option value="1">收费导游</Option>
          <!--<Option value="2">免费导游</Option>-->
          <!--<Option value="3">免费导游</Option>-->
        </Select>
      </FormItem>
      <FormItem label="导游产品来源：" prop="channel">
        <Select v-model="formItem.channel" style="width:200px">
          <Option value="-1">商城自建</Option>
        </Select>
      </FormItem>
      <FormItem label="自定义标签：" prop="labels">
        <div style="height:32px;" class="travellSubject">
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
              placeholder="回车添加标签，如“今日可定、立减20”"
              style="width: 200px"
            ></Input>
          </div>
          <div style="color:red;margin-left:10px;float:left" v-if="tagNameList.length<4">输入后，回车添加</div>
          <div style="float:left; margin-left:20px;">
            <div class="label-item" v-for="(item, index) in labelList" :key="index" style="display:inline-block;margin-right: 10px; position: relative;">
              <Button @click="addTosubject(item)">{{item}}</Button>
            </div>
          </div>
        </div>
        <Input v-model="formItem.labels" style="display:none"></Input>
      </FormItem>
      <FormItem label="产品详情：" prop="proDetail">
        <!-- <ueditor id="ue1" :content="formItem.proDetail" ref="proDetail" :config="config"></ueditor> -->
        <ueditor v-model="formItem.proDetail"></ueditor>
      </FormItem>
      <FormItem label="缩略图：" prop="linkMobileImg">
        <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
        <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
        <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <FormItem label="轮播图：" prop="wapUrl">
        <Input v-model="formItem.wapUrl" style="display:none"></Input>
        <my-img :limitNum="5"
                :uploadList="wapImgList"
                @getImgUrl="setWapListUrl"></my-img>
        <p>最多上传5张，建议上传小于1M， 宽750px，高560px的JPG/PNG格式的图片</p>
      </FormItem>
      <div class="form-title" id="productAndPrice">产品库存和价格</div>
      <FormItem label="库存模式：" prop="stockModel" >
        <RadioGroup v-model="formItem.stockModel">
          <Radio label="day">
            <span>日库存</span>
          </Radio>
          <!--<Radio label="unlimit">-->
            <!--<span>无限库存</span>-->
          <!--</Radio>-->
          <!--<Radio label="limit">-->
            <!--<span>有限库存</span>-->
          <!--</Radio>-->
        </RadioGroup>
      </FormItem>
      <FormItem label="预定是否提醒：" prop="isShowTicketNotice">
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
            <th v-if="formItem.distType=='2'||formItem.distType=='0'||formItem.distType==''">零售价</th>
            <th v-if="formItem.distType=='1'||formItem.distType=='0'||formItem.distType==''">供货价</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(item,index) in formItem.tableList">
            <template v-if="formItem.distType=='0'||formItem.distType==''">
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
                            :rules="[{required: true, message: '成本价不能为空', trigger: 'blur'},
                            { validator: common.validate.floatNumber, trigger: 'blur' },
                             { validator:maxNumValidate, trigger: 'blur' },]"
                            :label-width="1">
                    <Input v-model="item.costPrice"
                           :maxlength="9"
                           placeholder="请输入成本价"
                           style="width:120px"></Input>
                  </FormItem>
                </td>
                <td class="num"
                    rowspan="2">
                  <FormItem :prop="'tableList.'+index+'.rackPrice'"
                            :rules="[
                            {required: true, message: '门市价不能为空', trigger: 'blur'},
                            { validator: common.validate.floatNumber, trigger: 'blur' },
                            { validator: maxNumValidate, trigger: 'blur' }]"
                            :label-width="1">
                    <Input v-model="item.rackPrice"
                           :maxlength="9"
                           placeholder="请输入门市价"
                           style="width:120px"></Input>
                  </FormItem>
                </td>
                <td>店铺</td>
                <td>
                  <FormItem :prop="'tableList.'+index+'.retailPrice'"
                            :rules="[
                            {required: true, message: '零售价不能为空', trigger: 'blur'},
                            { validator: common.validate.floatNumber, trigger: 'blur' },
                            { validator: maxNumValidate, trigger: 'blur' }]"
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
            <template v-if="formItem.distType=='1'">
              <tr>
                <td class="center-td">
                  <Icon class="delete-icon"
                        @click="del(index)"
                        type="android-remove-circle"></Icon>
                </td>
                <td class="time">
                  <div style="width: 380px">
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
                            :rules="[
                            {required: true, message: '成本价不能为空', trigger: 'blur'},
                            { validator: common.validate.floatNumber, trigger: 'blur' },
                             { validator: maxNumValidate, trigger: 'blur' },]"
                            :label-width="1">
                    <Input v-model="item.costPrice"
                           :maxlength="9"
                           placeholder="请输入成本价"
                           style="width:120px"></Input>
                  </FormItem>
                </td>
                <td class="num">
                  <FormItem :prop="'tableList.'+index+'.rackPrice'"
                            :rules="[
                            {required: true, message: '门市价不能为空', trigger: 'blur'},
                            { validator: common.validate.floatNumber, trigger: 'blur' },
                            { validator: maxNumValidate, trigger: 'blur' }]"
                            :label-width="1">
                    <Input v-model="item.rackPrice"
                           :maxlength="9"
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
            <template v-if="formItem.distType=='2'">
              <tr>
                <td class="center-td">
                  <Icon class="delete-icon"
                        @click="del(index)"
                        type="android-remove-circle"></Icon>
                </td>
                <td class="time">
                  <div style="width: 380px">
                    <Row>
                      <Col span="11">
                        <FormItem :prop="'tableList.'+index+'.startTime'"
                                  :rules="{required: true,type: 'date', message: '开始时间不能为空', trigger: 'change'}"
                                  :label-width="1">
                          <DatePicker type="date"
                                      v-model="item.startTime"
                                      placeholder="开始时间"
                                      style="width: 100%"
                                      :options="dateOptions[index].startTimeOptions"
                                      @on-open-change="startTimeOpenChange($event,index)"></DatePicker>
                        </FormItem>
                      </Col>
                      <Col span="2"
                           style="text-align: center">
                        <span style="display:inline-block;width: 20px;height: 1px;background-color: #495060"></span>
                      </Col>
                      <Col span="11">
                        <FormItem :prop="'tableList.'+index+'.endTime'"
                                  :rules="{required: true,type: 'date', message: '结束时间不能为空', trigger: 'change'}"
                                  :label-width="1">
                          <DatePicker type="date"
                                      v-model="item.endTime"
                                      placeholder="结束时间"
                                      style="width: 100%"
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
                            :rules="[
                            {required: true, message: '成本价不能为空', trigger: 'blur'},
                            { validator: common.validate.floatNumber, trigger: 'blur' },
                            { validator: maxNumValidate, trigger: 'blur' },
                            ]"
                            :label-width="1">
                    <Input v-model="item.costPrice"
                           :maxlength="9"
                           placeholder="请输入成本价"
                           style="width:120px"></Input>
                  </FormItem>
                </td>
                <td class="num">
                  <FormItem :prop="'tableList.'+index+'.rackPrice'"
                            :rules="[
                            {required: true, message: '门市价不能为空', trigger: 'blur'},
                            { validator: common.validate.floatNumber, trigger: 'blur' },
                            { validator: maxNumValidate, trigger: 'blur' }]"
                            :label-width="1">
                    <Input v-model="item.rackPrice"
                           placeholder="请输入门市价"
                           :maxlength="9"
                           style="width:120px"></Input>
                  </FormItem>
                </td>
                <td>店铺</td>
                <td>
                  <FormItem :prop="'tableList.'+index+'.retailPrice'"
                            :rules="[
                            {required: true, message: '零售价不能为空', trigger: 'blur'},
                            { validator: common.validate.floatNumber, trigger: 'blur' },
                            { validator: maxNumValidate, trigger: 'blur' }]"
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
      <div>
        <FormItem label="服务人数和价格：" style="display: inline-block" prop="basePersonNum">
          <span>默认服务人数</span>
          <Input
            v-model="formItem.basePersonNum"
            style="width:80px;margin-right:5px;"
            placeholder="请输入人数"
            :maxlength="6"
          ></Input>
          <span>人以内，每增加1人，</span>
        </FormItem>
        <FormItem  prop="extraMoney" style="display: inline-block" :label-width="1">
          <span>增加费用</span>
          <Input
            v-model="formItem.extraMoney"
            style="width:80px;margin-right:5px;"
            placeholder="请输入费用"
            :maxlength="9"
          ></Input>
          <span>元</span>
        </FormItem>
      </div>
      <FormItem label="是否增补人数：" prop="enableAddPerson">
        <RadioGroup v-model="formItem.enableAddPerson">
          <Radio label="T">是</Radio>
          <Radio label="F">否</Radio>
        </RadioGroup>
      </FormItem>
      <div v-if="formItem.enableAddPerson == 'T'">
        <FormItem prop="suppMoney">
          <span>每增加1人，增加费用</span>
          <Input
            v-model="formItem.suppMoney"
            style="width:80px;margin-right:5px;"
            placeholder="请输入费用"
            :maxlength="8"
          ></Input>
          <span>元。</span>
        </FormItem>
      </div>
      <FormItem label="服务游客人数限制：" prop="maxPersonNum">
        <Input
          v-model="formItem.maxPersonNum"
          style="width:150px;margin-right:5px;"
          placeholder="请输入服务游客人数限制"
          :maxlength="6"
        ></Input>
        <span>人/次</span>
      </FormItem>
      <div class="form-title" id="reserveRule">预定规则</div>
      <FormItem label="可购时间限制：" prop="buyFarthestType">
        <RadioGroup v-model="formItem.buyFarthestType">
          <Radio label="any">
            <span>不限</span>
          </Radio>
          <Radio label="recent">
            <span>可购最近</span>
            <template v-if="formItem.buyFarthestType=='recent'">
              <Input  v-model="formItem.buyFarthestDay" :maxlength="9" style="width:150px;"></Input>天 (控制预订开始时间，当为1时则当天可预订)
              <!--<InputNumber v-model="formItem.buyFarthestDay" ></InputNumber>天 (控制预订开始时间，当为1时则当天可预订)-->
            </template>
          </Radio>
        </RadioGroup>
      </FormItem>
      <!--<FormItem label="购买数量限定：" prop="maxOrder">-->
        <!--<Input  v-model="formItem.maxOrder" :maxlength="9" style="width:150px;" disabled></Input>-->
        <!--&lt;!&ndash;<InputNumber v-model="formItem.maxOrder" disabled></InputNumber>&ndash;&gt;-->
      <!--</FormItem>-->
      <FormItem label="提前预订天数：" prop="earlyBookDay">
        <Input  v-model="formItem.earlyBookDay" :maxlength="6" style="width:150px;"></Input>天
        <!--<InputNumber v-model="formItem.earlyBookDay"></InputNumber> 天-->
      </FormItem>
      <FormItem label="过期是否核销：" prop="isOverDueCheck">
        <RadioGroup v-model="formItem.isOverDueCheck">
          <Radio label="T">是</Radio>
          <Radio label="F">否</Radio>
        </RadioGroup>
      </FormItem>
      <div class="form-title" id="refundRule">退改规则</div>
      <FormItem label="退单是否允许：" prop="isRetreat">
        <RadioGroup v-model="formItem.isRetreat">
          <Radio label="F">
            <span>否</span>
          </Radio>
          <Radio label="T">
            <span>是</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="退单时间限制：">
        <RadioGroup v-model="formItem.retreatPeriodType">
          <Radio label="0">
            <span>提前退</span>
          </Radio>
          <Radio label="1">
            <span>绝对日期前</span>
          </Radio>
          <Radio label="3">
            <span>游玩当天不可退</span>
          </Radio>
          <Radio label="2">
            <span>不限</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="formItem.retreatPeriodType=='0'" label="提前退票天数：">
        <Input number v-model="formItem.earlyDay" :maxlength="9" style="width:100px;"></Input>天
        <!--<InputNumber  v-model="formItem.earlyDay"-->
                     <!--:min="1"-->
                     <!--:max="120"></InputNumber>-->
        <!--<span>天</span>-->
      </FormItem>
      <FormItem v-if="formItem.retreatPeriodType=='1'" label="绝对日期："
                prop="absoluteDate"
                :rules="{required: true,type: 'date', message: '绝对日期不能为空', trigger: 'change'}">
        <DatePicker type="date"
                    v-model="formItem.absoluteDate"
                    placeholder="绝对日期"
                    style="width: 120px"></DatePicker>
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
      <div class="form-title" id="distSet">分销设置</div>
      <FormItem label="分销渠道：" prop="distType">
        <Select v-model="formItem.distType" style="width:200px">
          <Option value>请选择</Option>
          <Option value="2">仅店铺</Option>
        </Select>
      </FormItem>
      <FormItem label="产品别名：" prop="nickName">
        <Input
          v-model="formItem.nickName"
          style="width:150px;margin-right:5px;"
          placeholder="请输入产品别名"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="产品副标题：" prop="subTitle">
        <Input
          v-model="formItem.subTitle"
          style="width:150px;margin-right:5px;"
          placeholder="请输入产品副标题"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="店铺展示起价：" prop="merchantPrice">
        <Input
          v-model="formItem.merchantPrice"
          style="width:150px;margin-right:5px;"
          :maxlength="9"
          placeholder="请输入店铺展示起价"
        ></Input>元
      </FormItem>
      <FormItem label="店铺虚拟销量：" prop="merchantSale">
        <Input
          v-model="formItem.merchantSale"
          style="width:150px;margin-right:5px;"
          placeholder="请输入虚拟销量"
          :maxlength="6"
        ></Input>
      </FormItem>
      <FormItem label="分销展示价：" prop="distPrice">
        <Input  v-model="formItem.distPrice" :maxlength="9" style="width:150px;"></Input>元
        <!--<InputNumber :min="0" v-model="formItem.distPrice"></InputNumber>元-->
      </FormItem>
      <FormItem label="店铺预订须知：" prop="orderNotice">

        <!-- <ueditor id="ue3" :content="formItem.orderNotice" ref="orderNotice" :config="config"></ueditor> -->
        <ueditor v-model="formItem.orderNotice"></ueditor>
      </FormItem>
      <FormItem label="是否立即上架：">
        <Select v-model="formItem.enabled" style="width:200px">
          <Option value="T">是</Option>
          <Option value="F">否</Option>
        </Select>
      </FormItem>
      <FormItem label="留言：">
        <template v-if="formItem.orderCustomPlugins.length">
          <Row :gutter="16"
               style="width:55%; margin-bottom:24px;"
               v-for="(item,index) in formItem.orderCustomPlugins"
               :key="index">
            <Col span="6">
            <FormItem :prop="'orderCustomPlugins.' + index + '.title'"
                      :rules="{required: true, message: '请填写留言标题', trigger: 'blur'}">
              <Input v-model="item.title"
                     placeholder="请输入留言标题"
                     :maxlength="8"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem :prop="'orderCustomPlugins.' + index + '.type'"
                      :rules="{required: true, message: '请选择留言类型', trigger: 'change'}">
              <Select v-model="item.type"
                      placeholder="请选择留言类型"
                      @on-change="typeChange($event,index)">
                <Option v-for="sitem in leaveType"
                        :value="sitem.value"
                        :key="sitem.value">{{sitem.key}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem>
              <Input v-model="item.tips"
                     placeholder="请输入提示语"
                     :maxlength="20"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem>
              <Checkbox v-model="item.isRequired">必填</Checkbox>
              <Button type="ghost"
                      icon="minus-round"
                      style="margin-left:2%;"
                      @click="delPlugins(index)"></Button>
              <Button type="info"
                      icon="plus"
                      style="margin-left:2%;"
                      v-if="index===formItem.orderCustomPlugins.length-1&&index<4"
                      @click="addPlugins"></Button>
            </FormItem>
            </Col>
          </Row>
        </template>
        <Button type="info"
                icon="plus"
                v-else
                @click="addPlugins"></Button>
      </FormItem>
      <FormItem label="订单通知："
                prop="tel"
                :rules="tel?{required: tel, validator: common.validate.phone, trigger: 'blur'}:{}">
        <Checkbox label="tel"
                  @on-change='telChange'
                  v-model="tel"></Checkbox>
        <Input v-model="formItem.tel"
               :disabled='!tel'
               style="width:300px;"
               placeholder="用于接收下单提示短信"></Input>
        <Button type="primary"
                @click="getModal">查看模板</Button>
      </FormItem>
      <!--<FormItem prop="email"-->
                <!--:rules="email?{required: email, validator: common.validate.email, trigger: 'blur'}:{}">-->
        <!--<Checkbox label="email" @on-change='emailChange' v-model="email"></Checkbox>-->
        <!--<Input v-model="formItem.email" :disabled='!email' style="width:300px;" placeholder="用于接收下单提示邮箱"></Input>-->
      <!--</FormItem>-->
      <FormItem>
        <Button type="primary" @click="save" :loading="btnLoading">保存</Button>
        <Button v-if='isEdit'
                  type="ghost"
                  style="margin-left: 8px"
                  @click="test">返回列表</Button>
          <Button v-else
                  type="ghost"
                  style="margin-left: 8px"
                  @click="test">取消</Button>
      </FormItem>
    </Form>

    <Modal v-model="model" title="查看模板">
      <p>
        您有新的导游订单，订单内容:${orderInfo}，订单号：${orderNo}人，服务人数：${amount}人，服务日期${begDate}，实付金额${orderSum}，请及时处理。
      </p>
      <div slot="footer">
        <Button @click="templateCancel">关闭</Button>
      </div>
    </Modal>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')">基本信息</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('productAndPrice')">产品库存和价格</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('reserveRule')">预定规则</a>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('refundRule')">退改规则</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('distSet')">分销设置</a>
        </li>
        <li>
          <Button size="small" @click="save" type="primary">保存</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import ueditor from "@/components/global/ueditor";
import ueditor from '@/components/global/vueUEditor'
import myImg from '@/components/global/singleImg'
import leaveWord from '@/components/global/leaveWord'
import { apiPost, apiGet, apiPostJson } from '@/fetch/api'
export default {
  data () {
    return {
      model: false,
      loading: true,
      btnLoading: false,
      areaCode: '',
      tagNameList: [],
      tagName: '',
      labelList: [],
      singleImgList: [],
      wapImgList: [],
      formItem: {
        belongTo: '', // 导游归属
        productName: '', // 导游产品名称
        productType: '1', // 导游产品类型
        channel: '-1', // 导游产品来源
        labels: '', // 自定义标签
        proDetail: '', // 产品详情
        linkMobileImg: '', // 缩略图
        wapUrl: '', // 轮播图
        stockModel: 'day', // 产品库存和价格
        isShowTicketNotice: 'F', // 预定是否提醒
        basePersonNum: '', // 服务人数
        extraMoney: '', // 服务价格
        enableAddPerson: 'F', // 是否增补人数
        suppMoney: '', // 增加费用
        maxPersonNum: '', // 服务游客人数限制
        buyFarthestType: 'any', // 可购时间限制
        buyFarthestDay: 0, // 可购最近
        maxOrder: 1, // 购买数量限定
        earlyBookDay: 0, // 提前预订天数
        isOverDueCheck: 'T', // 过期是否核销
        isRetreat: 'T', // 退单是否允许
        retreatPeriodType: '2', // 退单时间限制
        earlyDay: 1, // 提前退票天数
        absoluteDate: '', // 绝对日期
        isRetreatAudit: 'F', // 退单是否需要审核
        distType: '2', // 分销设置
        nickName: '', // 产品别名
        subTitle: '', // 产品副标题
        merchantPrice: '', // 店铺展示起价
        merchantSale: '', // 店铺虚拟量
        distPrice: '', // 分销展示价
        orderNotice: '', // 店铺预订须知
        enabled: 'T', // 是否立即上架
        orderCustomPlugins: [], // 留言和下单填写信息字段
        tel: '', // 订单通知
        email: '', // 用于接收下单提示邮箱
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
        belongTo: [{ required: true, message: '请填写导游归属', trigger: 'blur' }],
        productName: [{ required: true, message: '请填写导游产品名称', trigger: 'blur' }],
        productType: [{ required: true, message: '请选择导游产品类型', trigger: 'change' }],
        channel: [{ required: true, message: '请选择导游产品来源', trigger: 'change' }],
        labels: [{ required: true, message: '请填写标签', trigger: 'blur' }],
        proDetail: [{ required: true, message: '请填写产品详情', trigger: 'blur' }],
        linkMobileImg: [{ required: true, message: '请上传缩略图' }],
        wapUrl: [{ required: true, message: '请上传轮播图' }],
        stockModel: [{ required: true, message: '请选择产品库存和价格', trigger: 'change' }],
        // isShowTicketNotice: [{ required: true, message: '请选择预定是否提醒', trigger: 'change' }],
        extraMoney: [
          { required: true, message: '请填写增加费用', trigger: 'blur' },
          { validator: this.common.validate.floatNumber, trigger: 'blur' },
          { validator: this.maxNumValidate, trigger: 'blur' }
        ],
        basePersonNum: [
          { required: true, message: '请填写默认服务人数', trigger: 'blur' },
          { validator: this.common.validate.positiveInteger, trigger: 'blur' },
          { validator: this.maxNumValidate, trigger: 'blur' }
        ],
        earlyBookDay: [
          { validator: this.common.validate.positiveInteger0, trigger: 'blur' },
          { validator: this.maxNumValidate, trigger: 'blur' }
        ],
        enableAddPerson: [{ required: true, message: '请选择是否增补人数', trigger: 'change' }],
        suppMoney: [{ required: false, message: '请填写费用', trigger: 'blur' }],
        maxPersonNum: [
          { required: true, message: '请填写服务游客人数限制', trigger: 'blur' },
          { validator: this.common.validate.positiveInteger, trigger: 'blur' },
          { validator: this.maxNumValidate, trigger: 'blur' }
        ],
        distType: [{ required: true, message: '请选择分销渠道', trigger: 'change' }],
        nickName: [{ required: true, message: '请填写别称', trigger: 'blur' }],
        subTitle: [{ required: true, message: '请填写副标题', trigger: 'blur' }],
        merchantPrice: [
          { required: true, message: '请填写店铺展示起价', trigger: 'blur'},
          { validator: this.common.validate.floatNumber, trigger: 'blur'},
          { validator: this.maxNumValidate, trigger: 'blur' }
        ],
        merchantSale: [
          { required: true, message: '请填写店铺虚拟销量', trigger: 'blur'},
          { validator: this.common.validate.integer, trigger: 'blur' }
        ],
        distPrice: [
          { required: true, message: '请填写分销展示价', trigger: 'blur' },
          { validator: this.common.validate.floatNumber, trigger: 'blur'},
          { validator: this.maxNumValidate, trigger: 'blur' }
        ],
        orderNotice: [{ required: true, message: '请填写店铺预订须知', trigger: 'blur' }],
        enabled: [{ required: true, message: '请选择是否立即上架', trigger: 'change' }]
      },
      name: true,
      tel: false,
      email: false,
      leaveType: [],
      isEdit: false,
      dataShow: false, // 保证页面在有数据的情况下一定展示
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
  computed: {

  },
  watch: {},
  mounted () {
    apiGet(
      '/admin/api/sysParam/changeList?key=leaveType').then(res => {
      if (res.status === 200) {
        this.leaveType = res.data
      } else {
        this.$Message.warning(res.message)
      }
    })
  },
  methods: {
    hashClick (val) {
      $('#content').scrollTop(
        $('#' + val).offset().top - 63 + $('#content').scrollTop()
      )
    },
    maxNumValidate (rule, value, callback) {
      if (value > 1000000) {
        callback(new Error('不能超过1000000'))
      } else {
        callback()
      }
    },
    setWapUrl (imgArr) {
      this.formItem.linkImg = imgArr.join(',')
      this.formItem.linkMobileImg = imgArr.join(',')
      this.$refs.formItem.validateField('linkMobileImg')
    },
    setWapListUrl (imgArr) {
      if (imgArr.length > 5) {
        this.formItem.wapUrl = imgArr.slice(0, 5).join(',')
      } else {
        this.formItem.wapUrl = imgArr.join(',')
      }
      this.$refs.formItem.validateField('wapUrl')
    },
    // 删除套票标签
    subjectItemDel (index) {
      this.tagNameList.splice(index, 1)
      this.formItem.labels = JSON.stringify(this.tagNameList)
    },
    // 回车添加标签名
    setSubjectTag () {
      if (this.tagNameList && this.tagNameList.length < 5) {
        if (this.tagName) {
          this.tagNameList.push(this.tagName)
          this.formItem.labels = JSON.stringify(this.tagNameList)

          this.tagName = ''
        } else {
          this.$Message.warning('请输入标签名！')
        }
      } else {
        this.$Message.warning('最多添加四个标签！')
      }
    },
    addTosubject (item) {
      if (this.tagNameList.length < 4) {
        this.tagNameList.push(item)
        this.formItem.labels = JSON.stringify(this.tagNameList)
      } else {
        this.$Message.warning('最多添加四个标签！')
      }
    },
    // 保存，下一步
    save () {
      // this.formItem.proDetail = this.$refs.proDetail.getUEContent();
      // this.formItem.buyNotes = this.$refs.buyNotes.getUEContent();
      // this.formItem.orderNotice = this.$refs.orderNotice.getUEContent();
      let formParam = JSON.parse(JSON.stringify(this.formItem))
      formParam.absoluteDate = this.filter.formatDate(this.common.changeDate(formParam.absoluteDate), 'yyyy-MM-dd')
      formParam.tableList.forEach(element => {
        element.weeks = element.weeks.join(',')
        element.startTime = this.filter.formatDate(this.common.changeDate(element.startTime), 'yyyy-MM-dd')
        element.endTime = this.filter.formatDate(this.common.changeDate(element.endTime), 'yyyy-MM-dd')
      })
      formParam.prices = JSON.stringify(formParam.tableList)
      delete formParam.tableList
      let orderCustomPlugins = [...formParam.orderCustomPlugins]
      orderCustomPlugins.unshift({
        title: '手机号',
        type: 'buyerMobile',
        tips: '请输入手机号',
        name: 'buyerMobile',
        isRequired: true
      })
      if (this.name) {
        orderCustomPlugins.unshift({
          title: '姓名',
          type: 'buyerName',
          tips: '请填写姓名',
          name: 'buyerName',
          isRequired: true
        })
      }
      if (this.idCard) {
        var idCardObj = {
          title: '身份证号',
          type: 'buyerIdNo',
          tips: '请填写身份证号',
          name: 'buyerIdNo',
          isRequired: false
        }
        if (orderCustomPlugins[0].type === 'buyerMobile') {
          orderCustomPlugins.splice(1, 0, idCardObj)
        } else {
          orderCustomPlugins.splice(2, 0, idCardObj)
        }
      }

      formParam.orderCustomPlugins = JSON.stringify(orderCustomPlugins)

      console.log(formParam)
      this.$refs.formItem.validate(async valid => {
        this.scrollError()
        if (valid) {
          this.btnLoading = true
          let url = '/product/api/chargeGuideInfo/addChargeGuideInfo'
          if (this.isEdit) {
            url = '/product/api/chargeGuideInfo/editChargeGuideInfo'
          }
          if (this.isEdit) {
            this.formItem.id = this.$route.query.id
          }
          let res = await apiPost(url, formParam)
          this.btnLoading = false
          console.log(res)
          if (res.status == 200) {
            this.$Message.success('保存成功!')
            this.$router.push('/guideInfo')
          } else {
            this.$Message.warning(res.message)
          }
        } else {
          this.btnLoading = false
          // 滚动到错误地方
          this.$nextTick(() => {
            setTimeout(function () {
              $('#content').scrollTop(
                $('.ivu-form-item-error').offset().top -
                90 +
                $('#content').scrollTop()
              )
            }, 500)
          })
        }
      })
    },
    telChange (bool) {
      if (!bool) {
        this.formItem.tel = ''
      }
    },
    emailChange (bool) {
      if (!bool) {
        this.formItem.email = ''
      }
    },
    getModal () {
      this.model = true
    },
    templateCancel () {
      this.model = false
    },
    // 编辑
    getPageData () {
      apiPost(
        '/product/api/chargeGuideInfo/chargeGuideInfo?id=' +
        this.$route.query.id
      ).then(res => {
        this.initData(res)
      })
    },
    // 获取标签等展示参数
    getViewParams () {
      apiPost('/product/api/chargeGuideInfo/getViewParam').then(res => {
        let labelArr = []
        if (res.status === 200) {
          res.data.guideLabels.forEach((item, index) => {
            labelArr.push(item)
          })
          this.labelList = labelArr
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    // 初始化页面数据
    initData (res) {
      this.dataShow = true
      if (res && res.data) {
        let detail = res.data.chargeGuideInfoModel
        Object.keys(detail).forEach(ele => {
          if (typeof detail[ele] === 'number') {
            detail[ele] = detail[ele] + ''
          }
          this.formItem[ele] = detail[ele]
        })
        if (res.data.priceList && res.data.priceList.length) {
          res.data.priceList.forEach(element => {
            Object.keys(element).forEach(ele => {
              if (typeof element[ele] === 'number') {
                element[ele] = element[ele] + ''
              }
            })
            element.weeks = element.weeks.split(',')
          })
          this.$set(this.formItem, 'tableList', res.data.priceList)
          // this.formItem.tableList = res.data.priceList
        }
        // this.formItem.merchantSale = this.formItem.merchantSale + ''
        // this.formItem.merchantPrice = this.formItem.merchantPrice + ''
        // this.formItem.salesNum = res.data.salesNum+'';
        if (!detail.orderCustomPlugins) {
          this.$set(this.formItem, 'orderCustomPlugins', [])
        } else {
          // let buyerName = false;
          let buyerIdNo = false
          let orderCustomPluginsObj = JSON.parse(detail.orderCustomPlugins).filter(element => {
            // if (element.type === 'buyerName') {
            //   buyerName = true
            // }
            if (element.type === 'buyerIdNo') {
              buyerIdNo = true
            }
            return element.type !== 'buyerMobile' && element.type !== 'buyerName' && element.type !== 'buyerIdNo'
          })
          // this.name = buyerName
          this.idCard = buyerIdNo
          this.$set(this.formItem, 'orderCustomPlugins', orderCustomPluginsObj)
        }
        this.tel = !!detail.tel
        this.email = !!detail.email
        this.tagNameList = detail.labels ? JSON.parse(detail.labels) : []
        this.wapImgList = detail.wapUrl ? detail.wapUrl.split(',') : []
        this.singleImgList = detail.linkMobileImg ? detail.linkMobileImg.split(',') : []
      } else {
        this.$Message.warning(res.message)
      }
    },
    test () {
      window.location.href = window.location.href.split('/manage')[0] + '/manage/#/guideInfo'
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
    addPlugins () {
      this.formItem.orderCustomPlugins.push({
        title: '',
        type: '',
        tips: '',
        name: '',
        isRequired: false
      })
    },
    delPlugins (index) {
      this.formItem.orderCustomPlugins.splice(index, 1)
    },
    typeChange (value, index) {
      this.formItem.orderCustomPlugins[index].name = value
    },
    goback () {
      this.$router.back()
    },
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
    }
  },
  created () {
    this.getViewParams()
    this.isEdit = this.$route && this.$route.query && this.$route.query.id
    if (this.isEdit) {
      this.getPageData()
    }
  },
  components: {
    ueditor,
    myImg,
    leaveWord
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
  top: 3px;
  width: 157px;
  left: 84px;
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
.senicInfo {
  margin-top: 10px;
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid rgba(35, 192, 250, 1);
  .address {
    color: #999;
  }
}
.comboPublish-box {
  .travellSubject {
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
        color: #000;
        padding: 3px 7px;
        text-decoration: none;
        border-bottom: 1px solid #e2d5d5;
      }
      a.active {
        color: #2d8cf0;
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
</style>
