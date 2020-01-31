<template>
    <div class="travellingRouteInfo">
        <div v-if='!isEdit' class="step">
            <Steps :current="2">
                <Step title="产品类型"></Step>
                <Step class="last-step" title="跟团游信息"></Step>
                <Step title="票型信息"></Step>
                <Step title="完成"></Step>
            </Steps>
        </div>
        <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleComplteForm">
            <div id='base' class="form-title">基本信息</div>
            <FormItem label="跟团游名称：">
                {{name}}
            </FormItem>
            <!-- <FormItem label="销售渠道：">
                {{filter.sellType(formItem.sellType)}}
            </FormItem> -->
            <FormItem label="库存模式：">
                日库存
            </FormItem>
            <FormItem label="多票型：" prop='ticketType'>
                <Select :disabled='true' @on-change='test' v-model='ticketArr' multiple style="width:200px">
                    <Option value="0">成人</Option>
                    <Option value="1">儿童</Option>
                </Select>
            </FormItem>
            <div v-for='(item,index) in ticketArr' :key='index'>
                <template v-if='item=="0"'>
                    <h3 class="table-title">成人</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    <Icon class="add-icon" @click="adultAdd" type="android-add-circle"></Icon>
                                </th>
                                <th>时间段/星期（预订周期不能重复）</th>
                                <th v-if='formItem.sellType!="1"'>成本价</th>
                                <th v-if='formItem.sellType!="1"'>门市价</th>
                                <!-- <th>渠道类别</th> -->
                                <th v-if="formItem.sellType=='2'||formItem.sellType=='0'">零售价</th>
                                <template v-if="formItem.sellType=='1'||formItem.sellType=='0'">
                                    <th>供货价</th>
                                    <th>建议最低零售价</th>
                                    <th>建议最高零售价</th>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(item,index) in formItem.ticketPriceAduit">
                                <template v-if="formItem.sellType=='0'">
                                    <tr>
                                        <td class="center-td" rowspan="2">
                                            <Icon class="delete-icon" @click="adultDel(index)" type="android-remove-circle"></Icon>
                                        </td>
                                        <td rowspan="2" class="time center-td">
                                            <div style="margin-bottom:15px">
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceAduit.' + index + '.beginDate'" :rules="[{required: true, message: '开始时间不能为空'}]">
                                                    <DatePicker @on-open-change='beginDateIndex(index)' @on-change="setBegDate" format="yyyy-MM-dd" :options="options[index].end" :editable='false' type="date" v-model="item.beginDate" placeholder="开始时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                                <span style="display:inline-block;height:33px;line-height:33px">-</span>
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceAduit.' + index + '.endDate'" :rules="[{required: true, message: '结束时间不能为空'}]">
                                                    <DatePicker @on-open-change='beginDateIndex(index)' @on-change="setEndDate" format="yyyy-MM-dd" :options="options[index].start" :editable='false' type="date" v-model="item.endDate" placeholder="结束时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                            </div>
                                            <div>
                                                <CheckboxGroup v-model="item.thisweek">
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
                                                <Button type="ghost" @click="adultSelectAll(index)" size="small">全选</Button>
                                                <Button type="ghost" @click="adultSelectTime(index)" size="small">平时</Button>
                                                <Button type="ghost" @click="adultSelectWeekend(index)" size="small">周末</Button>
                                            </div>
                                        </td>
                                        <td class="num" rowspan="2">
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.costPrice'" :rules="[{required: true, message: '成本价不能为空'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.costPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td class="num" rowspan="2">
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.showPrice'" :rules="[{required: true, message: '门市价不能为空'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.showPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>店铺</td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.retailPrice'" :rules="[{required: true, message: '零售价不能为空'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.retailPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>分销市场</td>
                                        <td></td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.supplyPrice'" :rules="[{required: true, message: '供货价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.supplyPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.minRetailPrice'" :rules="[{required: true, message: '建议最低零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.minRetailPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.maxRetailPrice'" :rules="[{required: true, message: '建议最高零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.maxRetailPrice"></Input>
                                            </FormItem>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="formItem.sellType=='1'">
                                    <tr>
                                        <td class="center-td">
                                            <Icon class="delete-icon" @click="adultDel(index)" type="android-remove-circle"></Icon>
                                        </td>
                                        <td class="time center-td">
                                            <div style="margin-bottom:15px">
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceAduit.' + index + '.beginDate'" :rules="[{required: true, message: '开始时间不能为空'}]">
                                                    <DatePicker @on-open-change='beginDateIndex(index)' @on-change="setBegDate" format="yyyy-MM-dd" :options="options[index].end" :editable='false' type="date" v-model="item.beginDate" placeholder="开始时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                                <span style="display:inline-block;height:33px;line-height:33px">-</span>
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceAduit.' + index + '.endDate'" :rules="[{required: true, message: '结束时间不能为空'}]">
                                                    <DatePicker @on-open-change='beginDateIndex(index)' @on-change="setEndDate" format="yyyy-MM-dd" :options="options[index].start" :editable='false' type="date" v-model="item.endDate" placeholder="结束时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                            </div>
                                            <div>
                                                <CheckboxGroup v-model="item.thisweek">
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
                                                <Button type="ghost" @click="adultSelectAll(index)" size="small">全选</Button>
                                                <Button type="ghost" @click="adultSelectTime(index)" size="small">平时</Button>
                                                <Button type="ghost" @click="adultSelectWeekend(index)" size="small">周末</Button>
                                            </div>
                                        </td>
                                        <!-- <td class="num">
                      <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.costPrice'" :rules="[{required: true, message: '成本价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                        <Input :maxlength="6" v-model="item.costPrice"></Input>
                      </FormItem>
                    </td>
                    <td class="num">
                      <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.showPrice'" :rules="[{required: true, message: '门市价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                        <Input :maxlength="6" v-model="item.showPrice"></Input>
                      </FormItem>
                    </td> -->
                                        <td>分销市场</td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.supplyPrice'" :rules="[{required: true, message: '供货价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.supplyPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.minRetailPrice'" :rules="[{required: true, message: '建议最低零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.minRetailPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.maxRetailPrice'" :rules="[{required: true, message: '建议最高零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.maxRetailPrice"></Input>
                                            </FormItem>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="formItem.sellType=='2'">
                                    <tr>
                                        <td class="center-td">
                                            <Icon class="delete-icon" @click="adultDel(index)" type="android-remove-circle"></Icon>
                                        </td>
                                        <td class="time center-td">
                                            <div style="margin-bottom:15px">
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceAduit.' + index + '.beginDate'" :rules="[{required: true, message: '开始时间不能为空'}]">
                                                    <DatePicker @on-open-change='beginDateIndex(index)' @on-change="setBegDate" format="yyyy-MM-dd" :options="options[index].end" :editable='false' type="date" v-model="item.beginDate" placeholder="开始时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                                <span style="display:inline-block;height:33px;line-height:33px">-</span>
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceAduit.' + index + '.endDate'" :rules="[{required: true, message: '结束时间不能为空'}]">
                                                    <DatePicker @on-open-change='beginDateIndex(index)' @on-change="setEndDate" format="yyyy-MM-dd" :options="options[index].start" :editable='false' type="date" v-model="item.endDate" placeholder="结束时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                            </div>
                                            <div>
                                                <CheckboxGroup v-model="item.thisweek">
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
                                                <Button type="ghost" @click="adultSelectAll(index)" size="small">全选</Button>
                                                <Button type="ghost" @click="adultSelectTime(index)" size="small">平时</Button>
                                                <Button type="ghost" @click="adultSelectWeekend(index)" size="small">周末</Button>
                                            </div>
                                        </td>
                                        <td class="num">
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.costPrice'" :rules="[{required: true, message: '成本价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.costPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td class="num">
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.showPrice'" :rules="[{required: true, message: '门市价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.showPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <!-- <td>店铺</td> -->
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceAduit.' + index + '.retailPrice'" :rules="[{required: true, message: '零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.retailPrice"></Input>
                                            </FormItem>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </template>
                <template v-if='item=="1"'>
                    <h3 class="table-title">儿童</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    <Icon class="add-icon" @click="childAdd" type="android-add-circle"></Icon>
                                </th>
                                <th>时间段/星期（预订周期不能重复）</th>
                                <th v-if='formItem.sellType!="1"'>成本价</th>
                                <th v-if='formItem.sellType!="1"'>门市价</th>
                                <!-- <th>渠道类别</th> -->
                                <th v-if="formItem.sellType=='2'||formItem.sellType=='0'">零售价</th>
                                <template v-if="formItem.sellType=='1'||formItem.sellType=='0'">
                                    <th>供货价</th>
                                    <th>建议最低零售价</th>
                                    <th>建议最高零售价</th>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(item,index) in formItem.ticketPriceChild">
                                <template v-if="formItem.sellType=='0'">
                                    <tr>
                                        <td class="center-td" rowspan="2">
                                            <Icon class="delete-icon" @click="childDel(index)" type="android-remove-circle"></Icon>
                                        </td>
                                        <td rowspan="2" class="time center-td">
                                            <div style="margin-bottom:15px">
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceChild.' + index + '.beginDate'" :rules="[{required: true, message: '开始时间不能为空'}]">
                                                    <DatePicker @on-open-change='childDateIndex(index)' @on-change="childSetBegDate" format="yyyy-MM-dd" :options="childOptions[index].end" :editable='false' type="date" v-model="item.beginDate" placeholder="开始时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                                <span style="display:inline-block;height:33px;line-height:33px">-</span>
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceChild.' + index + '.endDate'" :rules="[{required: true, message: '结束时间不能为空'}]">
                                                    <DatePicker @on-open-change='childDateIndex(index)' @on-change="childSetEndDate" format="yyyy-MM-dd" :options="childOptions[index].start" :editable='false' type="date" v-model="item.endDate" placeholder="结束时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                            </div>
                                            <div>
                                                <CheckboxGroup v-model="item.thisweek">
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
                                                <Button type="ghost" @click="childSelectAll(index)" size="small">全选</Button>
                                                <Button type="ghost" @click="childSelectTime(index)" size="small">平时</Button>
                                                <Button type="ghost" @click="childSelectWeekend(index)" size="small">周末</Button>
                                            </div>
                                        </td>
                                        <td class="num" rowspan="2">
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.costPrice'" :rules="[{required: true, message: '成本价不能为空'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.costPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td class="num" rowspan="2">
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.showPrice'" :rules="[{required: true, message: '门市价不能为空'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.showPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>店铺</td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.retailPrice'" :rules="[{required: true, message: '零售价不能为空'},{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.retailPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>分销市场</td>
                                        <td></td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.supplyPrice'" :rules="[{required: true, message: '供货价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.supplyPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.minRetailPrice'" :rules="[{required: true, message: '建议最低零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.minRetailPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.maxRetailPrice'" :rules="[{required: true, message: '建议最高零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.maxRetailPrice"></Input>
                                            </FormItem>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="formItem.sellType=='1'">
                                    <tr>
                                        <td class="center-td">
                                            <Icon class="delete-icon" @click="childDel(index)" type="android-remove-circle"></Icon>
                                        </td>
                                        <td class="time center-td">
                                            <div style="margin-bottom:15px">
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceChild.' + index + '.beginDate'" :rules="[{required: true, message: '开始时间不能为空'}]">
                                                    <DatePicker @on-open-change='childDateIndex(index)' @on-change="childSetBegDate" format="yyyy-MM-dd" :options="childOptions[index].end" :editable='false' type="date" v-model="item.beginDate" placeholder="开始时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                                <span style="display:inline-block;height:33px;line-height:33px">-</span>
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceChild.' + index + '.endDate'" :rules="[{required: true, message: '结束时间不能为空'}]">
                                                    <DatePicker @on-open-change='childDateIndex(index)' @on-change="childSetEndDate" format="yyyy-MM-dd" :options="childOptions[index].start" :editable='false' type="date" v-model="item.endDate" placeholder="结束时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                            </div>
                                            <div>
                                                <CheckboxGroup v-model="item.thisweek">
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
                                                <Button type="ghost" @click="childSelectAll(index)" size="small">全选</Button>
                                                <Button type="ghost" @click="childSelectTime(index)" size="small">平时</Button>
                                                <Button type="ghost" @click="childSelectWeekend(index)" size="small">周末</Button>
                                            </div>
                                        </td>
                                        <!-- <td class="num">
                      <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.costPrice'" :rules="[{required: true, message: '成本价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                        <Input :maxlength="6" v-model="item.costPrice"></Input>
                      </FormItem>
                    </td>
                    <td class="num">
                      <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.showPrice'" :rules="[{required: true, message: '门市价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                        <Input :maxlength="6" v-model="item.showPrice"></Input>
                      </FormItem>
                    </td> -->
                                        <td>分销市场</td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.supplyPrice'" :rules="[{required: true, message: '供货价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.supplyPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.minRetailPrice'" :rules="[{required: true, message: '建议最低零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.minRetailPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.maxRetailPrice'" :rules="[{required: true, message: '建议最高零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.maxRetailPrice"></Input>
                                            </FormItem>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="formItem.sellType=='2'">
                                    <tr>
                                        <td class="center-td">
                                            <Icon class="delete-icon" @click="childDel(index)" type="android-remove-circle"></Icon>
                                        </td>
                                        <td class="time center-td">
                                            <div style="margin-bottom:15px">
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceChild.' + index + '.beginDate'" :rules="[{required: true, message: '开始时间不能为空'}]">
                                                    <DatePicker @on-open-change='childDateIndex(index)' @on-change="childSetBegDate" format="yyyy-MM-dd" :options="childOptions[index].end" :editable='false' type="date" v-model="item.beginDate" placeholder="开始时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                                <span style="display:inline-block;height:33px;line-height:33px">-</span>
                                                <FormItem style="width:120px;display:inline-block" class="no-margin" :prop="'ticketPriceChild.' + index + '.endDate'" :rules="[{required: true, message: '结束时间不能为空'}]">
                                                    <DatePicker @on-open-change='childDateIndex(index)' @on-change="childSetEndDate" format="yyyy-MM-dd" :options="childOptions[index].start" :editable='false' type="date" v-model="item.endDate" placeholder="结束时间" style="width: 120px"></DatePicker>
                                                </FormItem>
                                            </div>
                                            <div>
                                                <CheckboxGroup v-model="item.thisweek">
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
                                                <Button type="ghost" @click="childSelectAll(index)" size="small">全选</Button>
                                                <Button type="ghost" @click="childSelectTime(index)" size="small">平时</Button>
                                                <Button type="ghost" @click="childSelectWeekend(index)" size="small">周末</Button>
                                            </div>
                                        </td>
                                        <td class="num">
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.costPrice'" :rules="[{required: true, message: '成本价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.costPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <td class="num">
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.showPrice'" :rules="[{required: true, message: '门市价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.showPrice"></Input>
                                            </FormItem>
                                        </td>
                                        <!-- <td>店铺</td> -->
                                        <td>
                                            <FormItem class="no-margin" :prop="'ticketPriceChild.' + index + '.retailPrice'" :rules="[{required: true, message: '零售价不能为空' },{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '数据格式不正确'}]">
                                                <Input :maxlength="6" v-model="item.retailPrice"></Input>
                                            </FormItem>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </template>
            </div>
            <div id='prerule' class="form-title">预定规则</div>
            <FormItem label="提前预订限制：">
                <!-- {{formItem.isEarlyBook}} -->
                <Select :disabled='true' v-model='formItem.isEarlyBook' style="width:120px">
                    <Option value="F">无限制</Option>
                    <Option value="T">有限制</Option>
                </Select>
                <template v-if='formItem.isEarlyBook=="T"'>
                    <span class="unit">
                        需提前
                    </span>
                    <FormItem class="i-b" prop="earlyBookDay" :rules="[{required: true, message: '不能为空' },{ pattern: /^\d+$/, message: '数据格式不正确'}]">
                        <Input :disabled='true' :maxlength="6" v-model='formItem.earlyBookDay' style="width: 80px"></Input>
                    </FormItem>
                    <span class="unit">天</span>
                </template>
            </FormItem>
            <FormItem label="预订日期限制：">
                <Select :disabled='true' v-model='formItem.isOrderDate' style="width:120px">
                    <Option value="F">无限制</Option>
                    <Option value="T">有限制</Option>
                </Select>
                <template v-if='formItem.isOrderDate=="T"'>
                    <span class="unit">
                        在
                    </span>
                    <FormItem style="width:120px;display:inline-block" class="no-margin" prop="orderBegDay" :rules="[{required: true, message: '开始时间不能为空'}]">
                        <DatePicker @on-change="setBeg" format="yyyy-MM-dd" :options="options3" :editable='false' type="date" :value="formItem.orderBegDay" placeholder="开始时间" style="width: 120px"></DatePicker>
                    </FormItem>
                    <span class="unit">至</span>
                    <FormItem style="width:120px;display:inline-block" class="no-margin" prop="orderEndDay" :rules="[{required: true, message: '结束时间不能为空'}]">
                        <DatePicker @on-change="setEnd" format="yyyy-MM-dd" :options="options4" :editable='false' type="date" :value="formItem.orderEndDay" placeholder="结束时间" style="width: 120px"></DatePicker>
                    </FormItem>
                    <span class="unit">期间内可预订</span>
                </template>
            </FormItem>
            <FormItem label="预订数量限制：">
                <!-- isLimitNum: "", //是否限制数量
        minOrder: "", //最小购买数量限制
        maxOrder: "", //最大购买数量限制 -->
                <Select :disabled='true' v-model='formItem.isLimitNum' style="width:120px">
                    <Option value="F">无限制</Option>
                    <Option value="T">有限制</Option>
                </Select>
                <template v-if='formItem.isLimitNum=="T"'>
                    <span class="unit">
                        每次下单数量最少
                    </span>
                    <FormItem class="i-b" prop="minOrder" :rules="[{required: true, message: '不能为空' },{ pattern: /^\d+$/, message: '数据格式不正确'}]">
                        <Input :disabled='true' :maxlength="3" v-model='formItem.minOrder' style="width: 80px"></Input>
                    </FormItem>
                    <span class="unit">张，最多</span>
                    <FormItem class="i-b" prop="maxOrder" :rules="[{required: true, message: '不能为空' },{ pattern: /^\d+$/, message: '数据格式不正确'}]">
                        <Input :disabled='true' :maxlength="3" v-model='formItem.maxOrder' style="width: 80px"></Input>
                    </FormItem>
                    <span class="unit">张</span>
                </template>
            </FormItem>
            <div id='checkrule' class="form-title">验证规则</div>
            <!-- checkType: "", //过期检票操作
        refundAfterDay: "", //过期X天完结 退款
        checkRelativeDay: "", //过期X天完结 检票 -->
            <FormItem label="过期检票操作：">
                <Select :disabled='true' v-model='formItem.checkType' style="width:120px">
                    <Option value="0">无限制</Option>
                    <!-- <Option value="1">自定完结</Option> -->
                    <Option value="2">自动检验</Option>
                </Select>
                <!-- <template v-if='formItem.checkType=="1"'>
          <FormItem class="i-b" prop="refundAfterDay" :rules="[{required: true, message: '不能为空' },{ pattern: /^\d+$/, message: '数据格式不正确'}]">
            <Input :maxlength="3" v-model='formItem.refundAfterDay' style="width: 80px"></Input>
          </FormItem>
          <span class="unit">天后自动完结</span>
        </template> -->
                <template v-if='formItem.checkType=="2"'>
                    <FormItem class="i-b" prop="checkRelativeDay" :rules="[{required: true, message: '不能为空' },{ pattern: /^\d+$/, message: '数据格式不正确'}]">
                        <Input :disabled='true' :maxlength="3" v-model='formItem.checkRelativeDay' style="width: 80px"></Input>
                    </FormItem>
                    <span class="unit">天后自动检验</span>
                </template>
            </FormItem>
            <div id='returnrule' class="form-title">退改规则</div>
            <FormItem label="退单是否允许：">
                <RadioGroup v-model="formItem.isRetreat">
                    <Radio :disabled='true' label="F">
                        <span>否</span>
                    </Radio>
                    <Radio :disabled='true' label="T">
                        <span>是</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="退单是否需要审核：">
                <RadioGroup v-model="formItem.isRetreatAudit">
                    <Radio :disabled='true' label="F">
                        <span>否</span>
                    </Radio>
                    <Radio :disabled='true' label="T">
                        <span>是</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="游玩日前是否可退：">
                <!-- isBeforeRetreat: "T", //游玩日前是否可退
        refundBeforeDay: "", //游玩日前退票提前天数
        refundBeforeTime: "", //游玩日前退票截止时间
        refundBeforeVal: "", //游玩日前退票手续费 -->
                <Select :disabled='true' v-model='formItem.isBeforeRetreat' style="width:120px">
                    <Option value="T">是</Option>
                    <Option value="F">否</Option>
                </Select>
                <div v-if='formItem.isBeforeRetreat=="T"' style="padding:0px;display: inline-block;" class="before-list i-b">
                    <div style='margin:0px' class="before-item i-b">
                        <FormItem class="i-b" prop="refundBeforeDay" :rules="[{ pattern: /^\d+$/, message: '数据格式不正确'}]">
                            <Input :disabled='true' v-model='formItem.refundBeforeDay' :maxlength="3" style="width: 50px"></Input>
                        </FormItem>
                        <span class="unit">天前可退，{{formItem.refundBeforeDay}}天</span>
                        <FormItem class="i-b" prop="refundBeforeTime">
                            <TimePicker :disabled='true' v-model='formItem.refundBeforeTime' format="HH:mm" placeholder="" style="width: 112px"></TimePicker>
                        </FormItem>
                        <span class="unit">点退票截止，扣费</span>
                        <FormItem class="i-b" prop="refundBeforeVal" :rules="[{ pattern: /^\d+$/, message: '数据格式不正确'}]">
                            <Input :disabled='true' :maxlength="2" v-model='formItem.refundBeforeVal' style="width: 50px"></Input>
                        </FormItem>
                        <span class="unit">%</span>
                    </div>
                </div>
            </FormItem>
            <FormItem label="游玩当天是否可退：">
                <!-- isTodayRetreat: "", //游玩日当天是否可退
        refundTodayTime: "", //游玩日当天退票截止时间
        refundTodayVal: "", //游玩日当天退票费用 -->
                <Select :disabled='true' v-model='formItem.isTodayRetreat' style="width:120px">
                    <Option value="T">是</Option>
                    <Option value="F">否</Option>
                </Select>
                <div v-if='formItem.isTodayRetreat=="T"' style="padding:0px;display: inline-block;" class="before-list i-b">
                    <div style='margin:0px' class="before-item i-b">
                        <span class="unit">当天</span>
                        <FormItem class="i-b">
                            <TimePicker :disabled='true' v-model='formItem.refundTodayTime' format="HH:mm" placeholder="" style="width: 112px"></TimePicker>
                        </FormItem>
                        <span class="unit">点退票截止，扣费</span>
                        <FormItem class="i-b" prop="refundTodayVal">
                            <Input :disabled='true' :maxlength="2" v-model='formItem.refundTodayVal' style="width: 50px"></Input>
                        </FormItem>
                        <span class="unit">%</span>
                    </div>
                </div>
            </FormItem>
            <FormItem label="游玩日后是否可退：">
                <!-- isAfterRetreat: "1", //游玩日后是否可退
        refundAfterDayIn: "", //游玩日后退票天数
        refundAfterTime: "", //游玩日后退票截止时间
        refundAfterVal: "", //游玩日后退票费用 -->
                <Select :disabled='true' v-model='formItem.isAfterRetreat' style="width:120px">
                    <Option value="T">是</Option>
                    <Option value="F">否</Option>
                </Select>
                <div v-if='formItem.isAfterRetreat=="T"' style="padding:0px;display: inline-block;" class="before-list i-b">
                    <div style='margin:0px' class="before-item i-b">
                        <FormItem class="i-b" prop="refundAfterDayIn" :rules="[{ pattern: /^\d+$/, message: '数据格式不正确'}]">
                            <Input :disabled='true' v-model='formItem.refundAfterDayIn' :maxlength="3" style="width: 50px"></Input>
                        </FormItem>
                        <span class="unit">天前可退，{{formItem.refundAfterDayIn}}天</span>
                        <FormItem class="i-b">
                            <TimePicker :disabled='true' v-model='formItem.refundAfterTime' format="HH:mm" placeholder="" style="width: 112px"></TimePicker>
                        </FormItem>
                        <span class="unit">点退票截止，扣费</span>
                        <FormItem class="i-b" prop="refundAfterVal" :rules="[{ pattern: /^\d+$/, message: '数据格式不正确'}]">
                            <Input :disabled='true' :maxlength="2" v-model='formItem.refundAfterVal' style="width: 50px"></Input>
                        </FormItem>
                        <span class="unit">%</span>
                    </div>
                </div>
            </FormItem>
            <FormItem>
                <div class="save-cancel">
                    <Button type="primary" :loading='btnLoading' @click="submit">保存</Button>
                    <Button type="ghost" v-if='isEdit' @click="editGoback" style="margin-left: 8px">取消</Button>
                    <Button type="ghost" v-else @click="goback" style="margin-left: 8px">取消</Button>
                </div>
            </FormItem>
        </Form>
        <div class="fixed-box">
            <ul>
                <li>
                    <a>快捷导航</a>
                </li>
                <li>
                    <a @click="hashClick('base')" class="tartg-a">基本信息</a>
                </li>
                <li>
                    <a @click="hashClick('prerule')" class="tartg-a">预定规则</a>
                </li>
                <li>
                    <a @click="hashClick('checkrule')" class="tartg-a">验证规则</a>
                </li>
                <li>
                    <a @click="hashClick('returnrule')" class="tartg-a">退改规则</a>
                </li>
                <li>
                    <Button size="small" @click="submit" :loading='btnLoading' type="primary">保存</Button>
                    <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import ueditor from "@/components/global/ueditor";
import { apiPost, apiGet } from "@/fetch/api";
import store from "@/store";
import moment from "moment";
export default {
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     if (
  //       !store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)
  //     ) {
  //       vm.$router.back(); //如果没有就不会跳转
  //     }
  //   });
  // },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      btnLoading: false,
      routeId: "", //编辑的id
      isEdit: "", //是否编辑页
      name: "",
      options3: {},
      options4: {},
      childOptionIndex: null,
      childOptions: [
        {
          start: {},
          end: {}
        }
      ],
      options: [
        {
          start: {},
          end: {}
        }
      ],
      adultStartDateIndex: "",
      adultEndDateIndex: "",
      ticketArr: [], //多选 票型类别
      limitType: "any",
      isSelect: "F",
      // adultTableList: [],
      childTableList: [],
      social: [],
      type: "",
      distributionWay: "0",
      lmitList: [
        {
          value: "all",
          label: "无限制"
        }
      ],
      list: [
        {
          value: "0",
          label: "分销市场+店铺"
        },
        {
          value: "1",
          label: "仅分销市场"
        },
        {
          value: "2",
          label: "仅店铺"
        }
      ],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      formItem: {
        sellType: "0",
        ticketType: null, //票型
        ticketPriceJson: "", //票型价格信息
        isEarlyBook: "F", //提前预定限制
        earlyBookDay: "", //提前预订天数
        isOrderDate: "F", //  预订日期限制
        orderBegDay: "", //允许开始下单日期
        orderEndDay: "", //允许结束下单日期
        isLimitNum: "F", //是否限制数量
        minOrder: "", //最小购买数量限制
        maxOrder: "", //最大购买数量限制
        checkType: "0", //过期检票操作
        refundAfterDay: "", //过期X天完结 退款
        checkRelativeDay: "", //过期X天完结 检票
        isRetreat: "T", //是否可退.'F'不可退.'T'可退
        isRetreatAudit: "F", //退单是否要审核
        isBeforeRetreat: "T", //游玩日前是否可退
        refundBeforeDay: "", //游玩日前退票提前天数
        refundBeforeTime: "", //游玩日前退票截止时间
        refundBeforeVal: "", //游玩日前退票手续费
        isTodayRetreat: "T", //游玩日当天是否可退
        refundTodayTime: "", //游玩日当天退票截止时间
        refundTodayVal: "", //游玩日当天退票费用
        isAfterRetreat: "T", //游玩日后是否可退
        refundAfterDayIn: "", //游玩日后退票天数
        refundAfterTime: "", //游玩日后退票截止时间
        refundAfterVal: "", //游玩日后退票费用,
        ticketPriceJsonAduit: "", //json 成人
        ticketPriceAduit: [
          {
            thisweek: ["1", "2", "3", "4", "5", "6", "0"],
            weeks: "",
            beginDate: "", //开始时间
            endDate: "", //结束时间
            ticketType: "0", //票型
            costPrice: "", //成本价
            showPrice: "", //门市价
            retailPrice: "", // 零售价
            supplyPrice: "", //供货价
            minRetailPrice: "", //建议最低零售价
            maxRetailPrice: "" //建议最高零售价
          }
        ],
        ticketPriceJsonChild: "", //json 儿童
        ticketPriceChild: [
          {
            thisweek: ["1", "2", "3", "4", "5", "6", "0"],
            weeks: "",
            beginDate: "", //开始时间
            endDate: "", //结束时间
            ticketType: "1", //票型
            costPrice: "", //成本价
            showPrice: "", //门市价
            retailPrice: "", // 零售价
            supplyPrice: "", //供货价
            minRetailPrice: "", //建议最低零售价
            maxRetailPrice: "" //建议最高零售价
          }
        ]
        // beforeList: [
        //   //提前退票json
        //   {
        //     refundBeforeDay: "", //天
        //     refundBeforeTime: "", //时间
        //     val: "" //百分比
        //   }
        // ]
      },
      ruleComplteForm: {
        ticketType: [
          { required: true, message: "请选择票型", trigger: "change" }
        ],
        refundTodayTime: [{ required: true, message: "不能为空" }],
        refundTodayVal: [{ pattern: /^\d+$/, message: "数据格式不正确" }]
      }
    };
  },
  mounted() {
    let _this = this;
    $(".last-step").click(function() {
      _this.$router.back();
    });
  },
  watch: {},
  created() {
    this.isEdit = this.$route.params && this.$route.params.id;
    if (this.isEdit) {
      //编辑页
      this.pageData();
    } else {
      this.getRouteInfo();
    }
  },
  methods: {
    editGoback() {
      this.$router.back();
    },
    goback() {
      this.$router.back();
    },
    pageData() {
      //编辑页获取信息
      apiGet(
        "/merchant/api/merchantRouteInfo/editMerchantRouteLine?id=" +
          this.$route.params.id
      ).then(res => {
        if (res && res.data) {
          // 保存id
          this.routeId = res.data.id;

          if (
            //初始化weeks
            res.data &&
            res.data.ticketPricesAduit &&
            res.data.ticketPricesAduit.length
          ) {
            let _this = this;
            this.options = []; //初始化时间规则置空
            res.data.ticketPricesAduit.forEach((item, index) => {
              let obj = {};
              res.data.ticketPricesAduit[index].thisweek = res.data
                .ticketPricesAduit[index].weeks
                ? res.data.ticketPricesAduit[index].weeks.split(",")
                : [];
              //初始化时间规则
              obj.start = {
                disabledDate: date => {
                  let startTime = item.beginDate
                    ? new Date(item.beginDate).valueOf()
                    : "";
                  return date && date.valueOf() < startTime;
                }
              };
              let endTime = item.endDate
                ? new Date(item.endDate).valueOf() - 1 * 24 * 60 * 60 * 1000
                : "";
              obj.end = {
                disabledDate(date) {
                  return date && date.valueOf() > endTime;
                }
              };
              this.options.push(obj);
            });
          } else {
            res.data.ticketPricesAduit = [];
          }
          //防止前后端命名冲突
          res.data.ticketPriceAduit = res.data.ticketPricesAduit;
          delete res.data.ticketPricesAduit;

          //给父组件传名字
          this.$emit("setName", {
            name: res.data.routeName ? res.data.routeName : "",
            channel: res.data.channel ? res.data.channel : "",
            ticketType: res.data.ticketType ? res.data.ticketType : ""
          });

          if (
            //初始化weeks
            res.data &&
            res.data.ticketPricesChild &&
            res.data.ticketPricesChild.length
          ) {
            let _this = this;
            this.childOptions = []; //重置时间规则【】
            res.data.ticketPricesChild.forEach((item, index) => {
              res.data.ticketPricesChild[index].thisweek = res.data
                .ticketPricesChild[index].weeks
                ? res.data.ticketPricesChild[index].weeks.split(",")
                : [];

              //初始化时间规则
              let obj = {};
              obj.start = {
                disabledDate: date => {
                  let startTime = item.beginDate
                    ? new Date(item.beginDate).valueOf()
                    : "";
                  return date && date.valueOf() < startTime;
                }
              };
              let endTime = item.endDate
                ? new Date(item.endDate).valueOf() - 1 * 24 * 60 * 60 * 1000
                : "";
              obj.end = {
                disabledDate(date) {
                  return date && date.valueOf() > endTime;
                }
              };
              _this.childOptions.push(obj);
            });
          } else {
            res.data.ticketPricesChild = [];
          }
          //防止前后端命名冲突
          res.data.ticketPriceChild = res.data.ticketPricesChild;
          delete res.data.ticketPricesChild;

          res.data.isEarlyBook = res.data.isEarlyBook
            ? res.data.isEarlyBook
            : "F";
          res.data.isOrderDate = res.data.isOrderDate
            ? res.data.isOrderDate
            : "F";
          res.data.isLimitNum = res.data.isLimitNum ? res.data.isLimitNum : "F";
          res.data.checkType = res.data.checkType ? res.data.checkType : "0";
          res.data.isBeforeRetreat = res.data.isBeforeRetreat ? "T" : "F";
          res.data.isTodayRetreat = res.data.isTodayRetreat ? "T" : "F";
          res.data.isAfterRetreat = res.data.isAfterRetreat ? "T" : "F";
           res.data.isRetreatAudit = res.data.isRetreatAudit ? "T" : "F";
          this.formItem = res.data;
          this.name = res.data && res.data.routeName ? res.data.routeName : "";
          this.formItem.sellType ='2'
          this.ticketArr =
            res.data && res.data.ticketType
              ? res.data.ticketType.split(",")
              : [];
        } else {
          this.$Message.warning("web数据不完整");
        }
      });
    },
    // tavellInfo() {
    //   //获取线路名称和分销渠道
    //   apiGet(
    //     "product/api/routeProduct/editRouteInfo?routeId=" +
    //       this.$route.params.id
    //   ).then(res => {
    //     this.initTravellData(res);
    //     this.pageData();
    //   });
    // },
    getRouteInfo() {
      apiGet("/product/api/routePush/publishRoute").then(res => {
        this.initTravellData(res);
      });
    },
    initTravellData(res) {
      //初始化线路和分销渠道信息
      this.name = res.data && res.data.name ? res.data.name : "";
      this.formItem.sellType =
        res.data && res.data.channel ? res.data.channel : "";
    },
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    setBeg(time) {
      // orderBegDay: "", //允许开始下单日期
      // orderEndDay: "", //允许结束下单日期
      this.formItem.orderBegDay = time;
      this.options4 = {
        disabledDate: date => {
          let startTime = this.formItem.orderBegDay
            ? new Date(this.formItem.orderBegDay).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEnd(time) {
      this.formItem.orderEndDay = time;
      let endTime = this.formItem.orderEndDay
        ? new Date(this.formItem.orderEndDay).valueOf() -
          1 * 24 * 60 * 60 * 1000
        : "";
      this.options3 = {
        disabledDate(date) {
          return date && date.valueOf() > endTime;
        }
      };
    },
    beforeItemDel(index) {
      this.formItem.beforeList.splice(index, 1);
    },
    beforeItemAdd(index) {
      if (this.formItem.beforeList && this.formItem.beforeList.length < 3) {
        this.formItem.beforeList.splice(index + 1, 0, {
          refundBeforeDay: "", //天
          refundBeforeTime: "", //时间
          val: "" //百分比
        });
      } else {
        this.$Message.warning("最多新增3条！");
      }
    },
    childSetBegDate(time) {
      this.formItem.ticketPriceChild[this.childOptionIndex].beginDate = time;
      this.childOptions[this.childOptionIndex].start = {
        disabledDate: date => {
          let startTime = this.formItem.ticketPriceChild[this.childOptionIndex]
            .beginDate
            ? new Date(
                this.formItem.ticketPriceChild[this.childOptionIndex].beginDate
              ).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    childSetEndDate(time) {
      if (time) {
        //时间不为空
        this.formItem.ticketPriceChild[this.childOptionIndex].endDate = time;
        let endTime = this.formItem.ticketPriceChild[this.childOptionIndex]
          .endDate
          ? new Date(
              this.formItem.ticketPriceChild[this.childOptionIndex].endDate
            ).valueOf() -
            1 * 24 * 60 * 60 * 1000
          : "";
        this.childOptions[this.childOptionIndex].end = {
          disabledDate(date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        //时间为空
        this.childOptions[this.childOptionIndex].end = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    setBegDate(time) {
      this.formItem.ticketPriceAduit[this.adultStartDateIndex].beginDate = time;
      this.options[this.adultStartDateIndex].start = {
        disabledDate: date => {
          let startTime = this.formItem.ticketPriceAduit[
            this.adultStartDateIndex
          ].beginDate
            ? new Date(
                this.formItem.ticketPriceAduit[
                  this.adultStartDateIndex
                ].beginDate
              ).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEndDate(time) {
      if (time) {
        this.formItem.ticketPriceAduit[this.adultStartDateIndex].endDate = time;
        let endTime = this.formItem.ticketPriceAduit[this.adultStartDateIndex]
          .endDate
          ? new Date(
              this.formItem.ticketPriceAduit[this.adultStartDateIndex].endDate
            ).valueOf() -
            1 * 24 * 60 * 60 * 1000
          : "";
        this.options[this.adultStartDateIndex].end = {
          disabledDate(date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        this.options[this.adultStartDateIndex].end = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    beginDateIndex(index) {
      this.adultStartDateIndex = index;
    },
    childDateIndex(index) {
      this.childOptionIndex = index;
    },
    test(str) {
      this.formItem.ticketType = str.join(",");
      this.$refs.formItem.validateField("ticketType");
    },
    handle() {},
    adultSelectAll(index) {
      this.formItem.ticketPriceAduit[index].thisweek = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "0"
      ];
    },
    adultSelectTime(index) {
      this.formItem.ticketPriceAduit[index].thisweek = [
        "1",
        "2",
        "3",
        "4",
        "5"
      ];
    },
    adultSelectWeekend(index) {
      this.formItem.ticketPriceAduit[index].thisweek = ["6", "0"];
    },
    adultAdd() {
      if (
        this.formItem.ticketPriceAduit &&
        this.formItem.ticketPriceAduit.length < 10
      ) {
        this.formItem.ticketPriceAduit.push({
          thisweek: ["1", "2", "3", "4", "5", "6", "0"],
          weeks: "",
          beginDate: "", //开始时间
          endDate: "", //结束时间
          ticketType: "0", //票型
          costPrice: "", //成本价
          showPrice: "", //门市价
          retailPrice: "", // 零售价
          supplyPrice: "", //供货价
          minRetailPrice: "", //建议最低零售价
          maxRetailPrice: "" //建议最高零售价
        });
        this.options.push({
          start: {},
          end: {}
        });
      } else {
        this.$Message.warning("最多新增10条");
      }
    },
    adultDel(index) {
      this.formItem.ticketPriceAduit.splice(index, 1);
      this.options.splice(index, 1);
    },
    childSelectAll(index) {
      this.formItem.ticketPriceChild[index].thisweek = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "0"
      ];
    },
    childSelectTime(index) {
      this.formItem.ticketPriceChild[index].thisweek = [
        "1",
        "2",
        "3",
        "4",
        "5"
      ];
    },
    childSelectWeekend(index) {
      this.formItem.ticketPriceChild[index].thisweek = ["6", "0"];
    },
    childAdd() {
      if (
        this.formItem.ticketPriceChild &&
        this.formItem.ticketPriceChild.length < 10
      ) {
        this.formItem.ticketPriceChild.push({
          thisweek: ["1", "2", "3", "4", "5", "6", "0"],
          weeks: "",
          beginDate: "", //开始时间
          endDate: "", //结束时间
          ticketType: "1", //票型
          costPrice: "", //成本价
          showPrice: "", //门市价
          retailPrice: "", // 零售价
          supplyPrice: "", //供货价
          minRetailPrice: "", //建议最低零售价
          maxRetailPrice: "" //建议最高零售价
        });
        this.childOptions.push({
          start: {},
          end: {}
        });
      } else {
        this.$Message.warning("最多新增10条");
      }
    },
    childDel(index) {
      this.formItem.ticketPriceChild.splice(index, 1);
      this.childOptions.splice(index, 1);
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
    submit() {
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        this.btnLoading = true;
        if (valid) {
          let url = "/merchant/api/merchantRouteInfo/saveEditRouteLine";
          this.formItem.id = this.routeId;
          this.formItem.ticketPriceAduit.forEach((element, index) => {
            this.formItem.ticketPriceAduit[
              index
            ].weeks = this.formItem.ticketPriceAduit[index].thisweek.join(",");

            //格式化开始结束时间
            this.formItem.ticketPriceAduit[index].beginDate = moment(
              this.formItem.ticketPriceAduit[index].beginDate
            ).format("YYYY-MM-DD");
            this.formItem.ticketPriceAduit[index].endDate = moment(
              this.formItem.ticketPriceAduit[index].endDate
            ).format("YYYY-MM-DD");
          });
          this.formItem.ticketPriceChild.forEach((element, index) => {
            this.formItem.ticketPriceChild[
              index
            ].weeks = this.formItem.ticketPriceChild[index].thisweek.join(",");

            //格式化开始结束时间
            this.formItem.ticketPriceChild[index].beginDate = moment(
              this.formItem.ticketPriceChild[index].beginDate
            ).format("YYYY-MM-DD");
            this.formItem.ticketPriceChild[index].endDate = moment(
              this.formItem.ticketPriceChild[index].endDate
            ).format("YYYY-MM-DD");
          });
          // 没有选的票形，置空
          if (this.ticketArr && this.ticketArr.length != 2) {
            // 只选了一个
            if (this.ticketArr[0] == "0") {
              //成人，儿童置空
              this.formItem.ticketPriceChild = [];
            } else if (this.ticketArr[0] == "1") {
              //儿童，成人置空
              this.formItem.ticketPriceAduit = [];
            }
          }

          this.formItem.ticketPriceJsonAduit = JSON.stringify(
            this.formItem.ticketPriceAduit
          ); //转成json字符串
          this.formItem.ticketPriceJsonChild = JSON.stringify(
            this.formItem.ticketPriceChild
          ); //转成json字符串

          let res = await apiPost(url, this.formItem);
          this.btnLoading = false;
          if (res.status == 200) {
            this.$Message.success("保存成功!");
            this.$router.back();
          } else {
            this.btnLoading = false;
            this.$Message.warning(res.message);
          }
        } else {
          this.btnLoading = false;
          //滚动到错误地方
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 500);
        }
      });
    }
  },
  components: {
    ueditor
  }
};
</script>
<style lang="scss">
.travellingRouteInfo {
  .last-step {
    cursor: pointer;
  }
  .save-cancel {
    padding-bottom: 50px;
  }
  .i-b {
    display: inline-block;
  }
  .before-list {
    padding-top: 15px;
    .before-item {
      margin-bottom: 20px;
      .before-item-add {
        font-size: 20px;
        color: #29c103;
        cursor: pointer;
      }
      .before-item-del {
        font-size: 20px;
        color: red;
        cursor: pointer;
        margin-left: 15px;
      }
      .i-b {
        display: inline-block;
      }
    }
  }
  .no-margin {
    margin-bottom: 0px;
    .ivu-form-item-content {
      margin-left: 0px !important;
    }
  }
  .center-td {
    text-align: center;
  }
  .table-title {
    padding-bottom: 10px;
    font-size: 16px;
  }
  .unit {
    padding: 0 10px;
  }
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
}
</style>

