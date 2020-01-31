<template>
  <div
    ref="hotelPriceMgtPage"
    class="hotelPriceMgt-page"
  >
    <Select
      v-model="pmsHotelId"
      filterable
      @on-change="hotelChange"
      style="width:200px;display:inline-block; margin-right:20px;"
      placeholder="请选择酒店"
    >
      <Option
        v-for="item in hotelList"
        :key="item.id"
        :value="item.id"
      >{{item.pmsName}}</Option>
    </Select>
    <div style="margin-bottom:5px;display:inline-block;">
      <Button @click="setSpePriceModalShow">批量设置特殊价格</Button>
      <Button @click="openSellingStrategy">销售策略管理</Button>
      <!-- <Button>维护分销商零售价建议区间规则</Button> -->
    </div>
    <p class="hotelPriceMgt-page-notice">
      1、 价格说明：默认价：黑色数字价格；周末价：绿色数字价格；特殊价：红色数字价格
      2、价格生效优先级：特殊价 >周末价> 默认价
      3、特殊价操作方式：单击格子或可通过上方批量设置特殊价按钮进行设置。
    </p>
    <div class="clearfix body-box">
      <div
        :style="{maxHeight:height}"
        class="left-table-box fl"
      >
        <table
          cellspacing="0"
          :style="{transform: 'translateY(' + -translateY + 'px)'}"
        >
          <tr :style="{transform: 'translateY(' + translateY + 'px)'}">
            <td colspan="3">
              <Icon
                type="chevron-left"
                size="16"
                @click="last"
                style="padding:3px 10px;cursor:pointer"
              ></Icon>
              <DatePicker
                size="small"
                :value="startDate"
                @on-change="dateChange"
                :editable="false"
                :clearable="false"
                :options="options3"
                type="date"
                placeholder="选择时间"
                style="width: 110px"
              ></DatePicker>
              <Icon
                style="padding:3px 10px;cursor:pointer"
                @click="next"
                size="16"
                type="chevron-right"
              ></Icon>
            </td>
            <td style="width:128px">操作</td>
          </tr>
          <template v-for="(item,index) in listData">
            <tr
              class="room-header"
              :key="index"
            >
              <td style="width:40px">
                <Icon
                  @click="roomTypeAddModalShow(item,index)"
                  color="#5cadff"
                  type="plus-circled"
                  size="20"
                ></Icon>
              </td>
              <td>
                <Button
                  v-if="item.pmsHotelType.isDirect=='T'"
                  type="success"
                  size="small"
                >直连</Button>
                <div class="room-name">{{item.pmsHotelType.pmsName}}</div>
              </td>
              <td style="width:60px">
                <Icon
                  @click="showIndex(index)"
                  class="show-icon"
                  :type="item.show?'chevron-up':'chevron-down'"
                  size="18"
                ></Icon>
                <!-- {{item.show}} -->
              </td>
              <td>
                <div class="type-name">剩余库存（私/共）</div>

                <!-- {{pageData[index]}} -->
              </td>
            </tr>
            <template v-if="item.show">
              <template v-for="(it,i) in item.pageData">
                <tr>
                  <td rowspan="1">
                    <Icon
                      @click="typeDeleteModalShow(it,item,index)"
                      color="#c5c8ce"
                      type="minus-circled"
                      size="20"
                    ></Icon>
                  </td>
                  <td rowspan="1">
                    <div class="type-name">{{it.saleRuleName}}</div>
                    <div>
                      <Button
                        @click="channelModal(it,item,index)"
                        size="small"
                        type="primary"
                      >渠道上下架</Button>
                    </div>
                  </td>
                  <td>
                    <div class="store-name">店铺 ({{it.isStore=='T'?'已上架':'已下架'}})</div>
                  </td>
                  <td>
                    <Button
                      v-if="it.isStorePrice"
                      @click="showPriceModal(it,item,index)"
                      size="small"
                      type="primary"
                    >改默认价</Button>
                    <Button
                      v-else
                      @click="showPriceModal(it,item,index)"
                      size="small"
                      type="primary"
                    >立即设置</Button>
                  </td>
                </tr>
                <!-- <tr>
                  <td>分销市场</td>
                  <td>
                    <Button size="small" type="primary">改默认价</Button>
                  </td>
                </tr>-->
              </template>
            </template>
          </template>
        </table>
      </div>
      <div
        :style="{maxHeight:height}"
        class="right-table-box fl"
      >
        <table cellspacing="0">
          <tr :style="{transform: 'translateY(' + translateY + 'px)'}">
            <td
              v-for="(item,index) in dayArr"
              :key="index"
            >
              <div
                class="top-day"
                :class="{'week-day':item.weekIndex==0||item.weekIndex==6}"
              >
                <div>
                  <span>{{item.month}}月</span>
                  <span
                    v-if="item.isToday"
                    style="background:#f90;color:#fff;padding:1px 4px;border-radius:2px"
                  >今天</span>
                  <template v-else>
                    <span
                      style="background:#f90;color:#fff;padding:1px 4px;border-radius:2px"
                      v-if="item.festivalGl||item.festivalNl"
                    >{{item.festivalGl}}{{item.festivalNl}}</span>
                    <span v-else>{{item.week}}</span>
                  </template>
                </div>
                <div class="day">{{item.day}}</div>
              </div>
            </td>
          </tr>
          <template v-for="(item,index) in listData">
            <tr
              :key="index"
              class="stock-tr"
            >
              <td
                v-for="(it,i) in item.pmsHotelStockList"
                :key="i"
              >{{it.privateStockNum?it.privateStockNum:0}} / {{it.stockNum}}</td>
            </tr>
            <template v-if="item.show">
              <template v-for="(it,i) in item.pageData">
                <tr>
                  <template v-if="it.isStorePrice">
                    <td
                      v-for="(day,dayIndex) in it.storeList"
                      :key="dayIndex"
                      @click.stop="showStorePop(index,i,dayIndex,day)"
                    >
                      <!-- {{day.popShow}} -->
                      <span :class="{'spec-color':day.isSpecial=='T','week-color':day.week==6||day.week==7}">{{day.price||day.price==0?day.price:""}}</span>
                      <Poptip
                        class="tip-box"
                        v-if="day.popShow"
                        v-model="day.popShow"
                        placement="bottom"
                      >
                        <!-- <div slot="title"></div> -->
                        <div
                          class="api"
                          slot="content"
                        >
                          <div class="title">特殊价</div>
                          <div>
                            <!-- <input v-model="day.price" type="text"> -->
                            <Input
                              :maxlength="5"
                              v-model="day.price"
                            ></Input>
                          </div>
                          <div
                            class="clearfix"
                            style="margin-top:10px"
                          >
                            <Button
                              class="fl"
                              @click.stop="saveStorePrice(index,day,it.storeId)"
                              size="small"
                              type="primary"
                            >保存</Button>
                            <Button
                              class="fr"
                              @click.stop="cancelStorePrice(i,dayIndex)"
                              size="small"
                            >取消</Button>
                          </div>
                        </div>
                      </Poptip>
                    </td>
                  </template>
                  <td
                    v-else
                    :colspan="dayArr.length"
                  >
                    <div style="text-align:left;">
                      <span>暂无默认价</span>
                      <Button
                        @click="showPriceModal(it,item,index)"
                        size="small"
                      >立即设置</Button>
                    </div>
                  </td>
                </tr>
                <!-- <tr>
                  <td
                    v-for="(day,dayIndex) in it.distList"
                    @click="showDistPop(i,dayIndex)"
                    :key="dayIndex"
                  >
                    {{day.price}}{{day.popShow}}
                    <Poptip
                      class="tip-box"
                      v-if="day.popShow"
                      v-model="day.popShow"
                      placement="right"
                    >
                      <div class="api" slot="content">
                        <div class="title">特殊价</div>
                        <div>
                          <Input v-model="day.price"></Input>
                        </div>
                        <div class="clearfix" style="margin-top:10px">
                          <Button
                            class="fl"
                            @click.stop="saveDistPrice"
                            size="small"
                            type="primary"
                          >保存</Button>
                          <Button
                            class="fr"
                            @click.stop="cancelDistPrice(i,dayIndex)"
                            size="small"
                          >取消2</Button>
                        </div>
                      </div>
                    </Poptip>
                  </td>
                </tr>-->
              </template>
            </template>
          </template>
        </table>
      </div>
    </div>
    <Modal
      width="800"
      class="price-s-modal"
      v-model="priceSetModal"
      title="修改默认价"
    >
      <div>
        <Form
          :model="formItem"
          label-position="right"
          ref="formItem"
          :rules="ruleComplteForm"
        >
          <div
            class="clearfix"
            style="margin-bottom:15px;"
          >
            <div
              class="room-name fl"
              style="font-size:16px;font-weight:600"
            >{{roomName}}</div>
            <div
              style="display:inline-block"
              class="fl"
            >（</div>
            <div class="type-name fl">{{roomTypeName}}</div>
            <div
              style="display:inline-block"
              class="fl"
            >）</div>
            <Button
              class="fl"
              type="success"
              size="small"
            >店铺</Button>
          </div>
          <Row>
            <Col span="12">
            <FormItem
              label="默认价(元)："
              prop="defaultPrice"
            >
              <Input
                style="width:100px"
                v-model="formItem.defaultPrice"
              ></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <div style="height:33px;line-height:33px;">
              <Checkbox
                @on-change="weekDiffChange"
                v-model="isShowWeek"
              >周末价与平日价不同</Checkbox>
            </div>
            </Col>
          </Row>
          <div v-if="isShowWeek">
            <table class="price-s-table">
              <thead>
                <tr>
                  <th>周一</th>
                  <th>周二</th>
                  <th>周三</th>
                  <th>周四</th>
                  <th>周五</th>
                  <th>周六</th>
                  <th>周日</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <FormItem
                      :label-width="0"
                      prop="week1"
                    >
                      <Input v-model="formItem.week1"></Input>
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      :label-width="0"
                      prop="week2"
                    >
                      <Input v-model="formItem.week2"></Input>
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      :label-width="0"
                      prop="week3"
                    >
                      <Input v-model="formItem.week3"></Input>
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      :label-width="0"
                      prop="week4"
                    >
                      <Input v-model="formItem.week4"></Input>
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      :label-width="0"
                      prop="week5"
                    >
                      <Input v-model="formItem.week5"></Input>
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      :label-width="0"
                      prop="week6"
                    >
                      <Input v-model="formItem.week6"></Input>
                    </FormItem>
                  </td>
                  <td>
                    <FormItem
                      :label-width="0"
                      prop="week7"
                    >
                      <Input v-model="formItem.week7"></Input>
                    </FormItem>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <FormItem>
            <Checkbox>Checkbox</Checkbox>
          </FormItem>-->
        </Form>
      </div>
      <div slot="footer">
        <Button
          :loading="btnLoading"
          @click="submit"
          type="primary"
        >保存</Button>
        <Button @click="priceSetModal=false">取消</Button>
      </div>
    </Modal>
    <Modal
      width="600"
      class="deltel-c-modal"
      v-model="deleteModalShow"
    >
      <div
        class="clearfix"
        slot="header"
      >
        <span class="fl room-name">{{roomName}}</span>
        <span class="fl">(</span>
        <span class="fl type-name">{{roomTypeName}}</span>
        <span class="fl">)</span>
      </div>
      <div>删除房型产品，将会下架所有渠道，并且会清除价格数据 ，确认删除吗？</div>
      <div slot="footer">
        <Button
          :loading="btnLoading"
          @click="typeDelete"
          type="primary"
        >确定</Button>
        <Button @click="deleteModalShow=false">取消</Button>
      </div>
    </Modal>
    <Modal
      width="600"
      class="add-rt-modal"
      title="添加房型产品"
      v-model="addModalShow"
    >
      <Form
        :model="addFormItem"
        label-position="right"
        ref="addFormItem"
        :label-width="120"
        :rules="addRuleComplteForm"
      >
        <FormItem label="房型：">{{addModalShowPmsProductName}}</FormItem>
        <FormItem
          label="销售策略："
          prop="palnId"
        >
          <Select
            v-model="addFormItem.palnId"
            style="width:200px"
          >
            <Option
              v-for="(item,index) in hotelPricePlanList"
              :value="item.id"
              :key="index"
            >{{ item.name }}</Option>
          </Select>
          <a style="display:inline-block;margin-left:15px;" @click="openSellingStrategy">销售策略管理</a>
        </FormItem>

        <FormItem label="上架渠道：">
          <CheckboxGroup v-model="social">
            <Checkbox
              disabled
              label="twitter"
            >
              <span>店铺</span>
            </Checkbox>
            <!-- <Checkbox label="facebook">
              <span>分销市场</span>
            </Checkbox>-->
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          :loading="btnLoading"
          @click="typeAdd"
          type="primary"
        >确定</Button>
        <Button @click="addModalShow=false">取消</Button>
      </div>
    </Modal>
    <!-- <Modal width="600" class="add-rt-modal" title="渠道上下架管理" v-model="channelModalMgtShow">
      <Form label-position="right" ref="addFormItemzz" :label-width="120">
        <FormItem label="房型：">{{channelRoomName}}</FormItem>
        <FormItem label="价格计划：">{{channelRoomTypeName}}</FormItem>

        <FormItem label="上架渠道：">
          <Checkbox v-model="channelStrore">店铺</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button :loading="btnLoading" @click="channelMgt" type="primary">确定</Button>
        <Button @click="channelModalMgtShow=false">取消</Button>
      </div>
    </Modal>-->
    <Modal
      width="1000"
      class="spe-price-modal"
      title="批量设置特殊价"
      v-model="spePriceModalShow"
    >
      <div>
        <Row>
          <Col
            class="m-l"
            span="8"
          >
          <div>
            <Checkbox @on-change="typeProductSelect">全选</Checkbox>
            <!-- {{typeProductList}} -->
            <CheckboxGroup v-model="typeProductListIds">
              <Checkbox
                v-for="(item,index) in typeProductList"
                :key="index"
                class="price-item"
                :label="item.productId"
              >
                <div
                  style="display:inline-block;vertical-align: middle"
                  class="clearfix"
                >
                  <span class="type-name fl">{{item.pmsProductName}}</span>
                  <span class="fl">(</span>
                  <span class="fl product-name">{{item.saleRuleName}}</span>
                  <span class="fl">)</span>
                </div>
              </Checkbox>
            </CheckboxGroup>
          </div>
          </Col>
          <Col
            class="m-r"
            span="16"
          >
          <Form
            :model="priceFormItem"
            :rules="priceRuleComplteForm"
            label-position="right"
            ref="priceMgtModal"
            :label-width="95"
          >
            <FormItem label="时间范围：">
              <Row>
                <Col span="11">
                <FormItem prop="startDate">
                  <DatePicker
                    transfer
                    :value="priceFormItem.startDate"
                    @on-change="setBegDate"
                    type="date"
                    :options="options3"
                    format="yyyy-MM-dd"
                  ></DatePicker>
                </FormItem>
                </Col>
                <Col
                  style="text-align:center"
                  span="2"
                >至</Col>
                <Col span="11">
                <FormItem prop="endDate">
                  <DatePicker
                    transfer
                    :value="priceFormItem.endDate"
                    @on-change="setEndDate"
                    type="date"
                    :options="options4"
                    format="yyyy-MM-dd"
                  ></DatePicker>
                </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem
              label="适用星期："
              prop="weeks"
            >
              <CheckboxGroup v-model="priceFormItem.weeks">
                <Checkbox label="1">
                  <span>周一</span>
                </Checkbox>
                <Checkbox label="2">
                  <span>周二</span>
                </Checkbox>
                <Checkbox label="3">
                  <span>周三</span>
                </Checkbox>
                <Checkbox label="4">
                  <span>周四</span>
                </Checkbox>
                <Checkbox label="5">
                  <span>周五</span>
                </Checkbox>
                <Checkbox label="6">
                  <span>周六</span>
                </Checkbox>
                <Checkbox label="7">
                  <span>周日</span>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>

            <FormItem label="特殊价格：">
              <table
                v-if="priceFormItem.spePriceSetList.length"
                class="spc-table"
                cellspacing="0"
              >
                <thead>
                  <tr>
                    <th>房型产品名字</th>
                    <th>特殊价</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item,index) in priceFormItem.spePriceSetList"
                    :key="index"
                  >
                    <td>
                      <div class="clearfix">
                        <span class="t-name fl">{{item.pmsProductName}}</span>
                        <span class="fl">(</span>
                        <span class="p-name fl">{{item.saleRuleName}}</span>
                        <span class="fl">)</span>
                      </div>
                    </td>
                    <td style="width:135px">
                      <FormItem
                        :rules="[{ pattern: /^(([1-9][0-9]*)|[0]|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message: '数据格式不正确'}, {validator: validateNum,message: '数值不能大于999999'}]"
                        :prop="'spePriceSetList.' + index + '.price'"
                      >
                        <Input v-model="item.price"></Input>
                      </FormItem>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else>请选择房型产品</div>
            </FormItem>
          </Form>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button
          :loading="btnLoading"
          @click="priceMgtSave"
          type="primary"
        >确定</Button>
        <Button @click="spePriceModalShow=false">取消</Button>
      </div>
    </Modal>
    <Modal
      width="600"
      class="add-rt-modal"
      title="渠道上下架管理"
      v-model="channelModalMgtShow"
    >
      <Form
        label-position="right"
        ref="addFormItemzz"
        :label-width="120"
      >
        <FormItem label="房型：">{{channelRoomName}}</FormItem>
        <FormItem label="销售策略：">{{channelRoomTypeName}}</FormItem>

        <FormItem label="上架渠道：">
          <Checkbox v-model="channelStrore">店铺</Checkbox>
          <!-- <CheckboxGroup>
            <Checkbox label="twitter">
              <span>店铺</span>
            </Checkbox>
            <Checkbox label="facebook">
              <span>分销市场</span>
            </Checkbox>
          </CheckboxGroup>-->
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          :loading="btnLoading"
          @click="channelMgt"
          type="primary"
        >确定</Button>
        <Button @click="channelModalMgtShow=false">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="sellingStrategyListModal"
      title="销售策略管理"
      width="800"
    >
      <Button
        type="primary"
        icon="android-add"
        style="margin-bottom:20px;"
        @click="addSellingStrategy"
      >添加销售策略</Button>
      <Table
        :loading='tableLoading'
        :columns="columns"
        :data="dataList"
      ></Table>
      <Page
        class-name="pages"
        :current="page"
        :page-size="pageSize"
        :total="totalStrategy"
        @on-change="changepage"
        @on-page-size-change='pageSizeChange'
        show-elevator
        show-sizer
      ></Page>
      <div slot="footer"></div>
    </Modal>
    <Modal
      v-model="sellingStrategyModal"
      class="room-edit-modal"
      :title="sellingName"
      width="800"
    >
      <Form
        :model="sellStregyForm"
        :rules="sellStregyFormRules"
        ref="sellStregy"
        style="padding-left:20px;"
      >
        <FormItem
          label="策略名称："
          prop="name"
        >
          <Input
            v-model="sellStregyForm.name"
            style="width:80%;"
          />
        </FormItem>
        <FormItem
          label="说明备注："
          prop="remark"
        >
          <Input
            v-model="sellStregyForm.remark"
            type="textarea"
            style="width:80%;"
            :rows="4"
            :maxlength="100"
            placeholder="100字以内"
          />
        </FormItem>
        <div class="form-title">预订规则</div>
        <FormItem
          label="每间每晚含早餐："
          prop="ifBreakfast"
        >
          <Select
            v-model="sellStregyForm.ifBreakfast"
            style="width:200px;"
          >
            <Option value="">请选择</Option>
            <Option value="0">无早</Option>
            <Option value="1">含单早</Option>
            <Option value="2">含双早</Option>
            <Option value="3">含三早</Option>
          </Select>
        </FormItem>
        <FormItem label="提前预订限制：">
          需提前
          <template>
            <FormItem
              style="display:inline-block;width:100px;"
              prop="bookBeforeDay"
            >
              <Input
                number
                v-model="sellStregyForm.bookBeforeDay"
              />
            </FormItem> 天
            <FormItem
              style="display:inline-block;width:100px;"
              prop="bookBeforeHour"
            >
              <Input
                number
                v-model="sellStregyForm.bookBeforeHour"
              />
            </FormItem> 小时 
            <FormItem
              style="display:inline-block;width:100px;"
              prop="bookBeforeMin"
            >
              <Input
                number
                v-model="sellStregyForm.bookBeforeMin"
              />
            </FormItem> 分预订 
          </template>
        </FormItem>
        <FormItem label="预订日期限制：">
          在
          <DatePicker
            @on-change='setBookDateStart'
            :options="startOption"
            :value="sellStregyForm.bookDateStart"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期"
            style="width: 200px"
          ></DatePicker> 至 
          <DatePicker
            @on-change='setBookDateEnd'
            :options="endOption"
            :value="sellStregyForm.bookDateEnd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择日期"
            style="width: 200px"
          ></DatePicker> 日期内可预订
        </FormItem>
        <FormItem label="预订时间限制：">
          在 <TimePicker
            type="time"
            format="HH:mm"
            v-model="sellStregyForm.bookTimeStart"
            placeholder="请选择时间"
            style="width: 200px"
          ></TimePicker> 至 
          <TimePicker
            type="time"
            format="HH:mm"
            v-model="sellStregyForm.bookTimeEnd"
            placeholder="请选择时间"
            style="width: 200px"
          ></TimePicker> 时段内可预订
        </FormItem>
        <FormItem label="预订连住限制：">
          <template>
            每间房最少预订
            <FormItem
              style="display:inline-block;width:100px;"
              prop="bookDaysNumMin"
            >
              <Input v-model="sellStregyForm.bookDaysNumMin" />
            </FormItem>
            晚起住，最多预订
            <FormItem
              style="display:inline-block;width:100px;"
              prop="bookDaysNumMax"
            >
              <Input v-model="sellStregyForm.bookDaysNumMax" />
            </FormItem>
            晚
          </template>
        </FormItem>
        <FormItem label="预订房间限制：">
          最少预订
          <FormItem
            style="display:inline-block;width:100px;"
            prop="bookRoomNumMin"
          >
            <Input v-model="sellStregyForm.bookRoomNumMin" />
          </FormItem>
          间，最多预订
          <FormItem
            style="display:inline-block;width:100px;"
            prop="bookRoomNumMax"
          >
            <Input v-model="sellStregyForm.bookRoomNumMax" />
          </FormItem>
          间
        </FormItem>
        <!-- <FormItem
          label="预订人工确认："
          prop="bookCheckTime"
        >
          订单付款成功后，如果超过 
          <Input
            v-model="sellStregyForm.bookCheckTime"
            style="width:10%;"
          />
          分钟不确认自动取消，不填则自动确认
        </FormItem> -->
        <FormItem label="加床规则：">
          <Input
            v-model="sellStregyForm.addBedRule"
            type="textarea"
            style="width:80%;"
            :rows="4"
            :maxlength="100"
            placeholder="100字以内"
          ></Input>
        </FormItem>
        <div class="form-title">取消退款规则</div>
        <FormItem
          label="取消规则："
          prop="ifCancel"
        >
          <Select
            v-model="sellStregyForm.ifCancel"
            style="width:200px;"
            placement="top"
          >
            <Option value="">请选择</Option>
            <Option value="F">不允许取消</Option>
            <Option value="T">允许取消</Option>
          </Select>
        </FormItem>
        <FormItem
          label="取消是否审核："
          v-if="sellStregyForm.ifCancel=='T'"
          prop="ifCheck"
        >
          <Select
            v-model="sellStregyForm.ifCheck"
            style="width:200px;"
            placement="top"
          >
            <Option value="">请选择</Option>
            <Option value="F">不审核</Option>
            <Option value="T">人工审核</Option>
          </Select>
        </FormItem>
        <FormItem
          label="取消时间规则："
          v-if="sellStregyForm.ifCancel=='T'"
          prop="cancelTimeRule"
        >
          <Select
            v-model="sellStregyForm.cancelTimeRule"
            style="width:200px;"
            placement="top"
          >
            <Option value="">请选择</Option>
            <Option value="T">设置取消时间规则</Option>
            <Option value="F">时间不限制</Option>
          </Select>
        </FormItem>
        <div v-if="sellStregyForm.ifCancel=='T'&&sellStregyForm.cancelTimeRule=='T'">
          <FormItem>预订成功后
            <FormItem
              style="display:inline-block;width:100px;"
              prop="excludeMinutes"
            >
              <Input
                v-model="sellStregyForm.excludeMinutes"
                style="width:100px;"
                number
              ></Input>
            </FormItem>
            分钟内取消，可退支付金额100%，不受下述规则限制
          </FormItem>
          <FormItem
            v-for="(item,index) in sellStregyForm.excludeTimeAdd"
            :key="index"
          >
            <span>入住当天24:00前
              <FormItem
                v-if="index==0"
                style="display:inline-block;width:110px;"
                :prop="'excludeTimeAdd.' + index + '.minutes'"
                :rules="[{required:true, type:'number',message: '不能为空',trigger: 'blur'},{pattern: /^[0-9]\d*$/, message: '数据格式不正确', trigger: 'blur' }]"
              >
                <Input
                  v-model="item.minutes"
                  style="width:100px;"
                  number
                ></Input>
              </FormItem>
              <FormItem
                v-if="index==1"
                style="display:inline-block;width:110px;"
                :prop="'excludeTimeAdd.' + index + '.minutes'"
                :rules="[{required:true, type:'number',message: '不能为空',trigger: 'blur'},{pattern: /^[0-9]\d*$/, message: '数据格式不正确', trigger: 'blur' },{ type:'number',max:sellStregyForm.excludeTimeAdd[0].minutes,message: '不能大于第'+(index)+'个数值',trigger: 'blur'}]"
              >
                <Input
                  v-model="item.minutes"
                  style="width:100px;"
                  number
                ></Input>
              </FormItem>
              <FormItem
                v-if="index==2"
                style="display:inline-block;width:110px;"
                :prop="'excludeTimeAdd.' + index + '.minutes'"
                :rules="[{required:true, type:'number',message: '不能为空',trigger: 'blur'},{pattern: /^[0-9]\d*$/, message: '数据格式不正确', trigger: 'blur' },{ type:'number',max:sellStregyForm.excludeTimeAdd[1].minutes,message: '不能大于第'+(index)+'个数值',trigger: 'blur'}]"
              >
                <Input
                  v-model="item.minutes"
                  style="width:100px;"
                  number
                ></Input>
              </FormItem>
              <span v-if="index==0">分钟以上可取消，可退支付金额</span>
              <span v-if="index==1">分钟至{{sellStregyForm.excludeTimeAdd[0].minutes}}分钟可取消，可退支付金额</span>
              <span v-if="index==2">分钟至{{sellStregyForm.excludeTimeAdd[1].minutes}}分钟可取消，可退支付金额</span>
              <FormItem
                style="display:inline-block;width:100px;"
                :prop="'excludeTimeAdd.' + index + '.per'"
                :rules="[{required:true, type:'number',message: '不能为空',trigger: 'blur'},{pattern: /^[0-9]\d*$/, message: '数据格式不正确', trigger: 'blur' },{ type:'number',max:100,message: '不能大于100',trigger: 'blur'}]"
              >
                <Input
                  v-model="item.per"
                  number
                ></Input>
              </FormItem>%
            </span>
            <span v-show="sellStregyForm.excludeTimeAdd[0].minutes==''">+添加</span>
            <a
              v-if="!index"
              v-show="sellStregyForm.excludeTimeAdd[0].minutes!=''"
              style="margin-left:20px;"
              @click.stop="addExcludeTime(index,item)"
            >+添加</a>

            <a
              v-else
              style="margin-left:20px;"
              @click="deleExcludeTime(index,item)"
            >-删除</a>
          </FormItem>
        </div>
        <div
          v-if="sellStregyForm.ifCancel=='T'&& sellStregyForm.cancelTimeRule=='F'"
          style="padding:5px 0;background:#eee;"
        >
          <p>注意：时间不限制，是指在用户实际入住核销前都支持申请退款取消</p>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="saveSellingStrategy"
          :loading='saveLoading'
        >保存</Button>
        <Button @click="sellingStrategyModal=false">取消</Button>
      </div>
    </Modal>
    <confirm
      ref="confirmModel"
      :mode="mode"
      :content="content"
      :sucessMsg="sucessMsg"
      @okClick="okClick"
    ></confirm>
  </div>
</template>
<script>
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import confirm from "@/components/global/confirm";
import axios from "axios";
export default {
  components: { confirm },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    };
    return {
      mode: "",
      content: "",
      sucessMsg: "",
      cancel: "F",
      cancel2: "F",
      cancel3: "F",
      sellingStrategyListModal: false,
      sellingStrategyModal: false,
      sellingName:'新增销售策略',
      page: 1,
      pageSize: 10,
      dataList: [],
      columns: [
        {
          title: "销售策略名称",
          key: "name"
        },
        {
          title: "备注说明",
          key: "remark"
        },
        {
          title: "有无早餐",
          key: "ifBreakfast",
          render(h, params) {
            let ifBreakfastHan = "";
            switch (+params.row.ifBreakfast) {
              case 0:
                ifBreakfastHan = "无早";
                break;
              case 1:
                ifBreakfastHan = "含单早";
                break;
              case 2:
                ifBreakfastHan = "含双早";
                break;
              case 3:
                ifBreakfastHan = "含三早";
                break;
              default:
                break;
            }

            return h("span", ifBreakfastHan);
          }
        },
        {
          title: "取消退款规则",
          key: "ifCancel",
          render(h, params) {
            let ifCancelHan =
              params.row.ifCancel === "T" ? "允许取消" : "不予许取消";
            return h("span", ifCancelHan);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "编辑",
                action: () => {
                  console.log(params.row);
                  this.sellStregyForm = params.row;
                //   this.sellStregyForm.excludeTimeAdd = [];
                  this.$set(
                        this.sellStregyForm,
                        "excludeTimeAdd",
                        []
                      );
                  this.sellStregyForm.bookBeforeDay = +params.row.bookBeforeDay;
                  this.sellStregyForm.bookBeforeHour = +params.row
                    .bookBeforeHour;
                  this.sellStregyForm.bookBeforeMin = +params.row.bookBeforeMin;
                  this.sellStregyForm.hotelMerchantId = this.pmsHotelId;
                  if (
                    this.sellStregyForm.ifCancel === "T" &&
                    this.sellStregyForm.cancelTimeRule == "T"
                  ) {
                    let timeConfig = JSON.parse(
                      this.sellStregyForm.cancelRuleJson
                    );
                    this.sellStregyForm.excludeMinutes =
                      timeConfig.excludeTime.minutes;
                    if (
                      timeConfig.excludeTimeAdd &&
                      timeConfig.excludeTimeAdd.length > 0
                    ) {
                      this.$set(
                        this.sellStregyForm,
                        "excludeTimeAdd",
                        timeConfig.excludeTimeAdd
                      );
                    }
                  }else{
                       this.sellStregyForm.excludeTimeAdd.push({
                           minutes:'',
                           per:''
                       })
                      
                  }
                  this.sellingName = '修改销售策略';
                  this.sellingStrategyModal = true;
                }
              },
              {
                title: "删除",
                action: () => {
                  this.mode = "post";
                  this.content =
                    "确认删除该策略，删除后，在使用该策略的酒店房型产品将在所有渠道下架并删除？";
                  this.sucessMsg = "删除成功!";
                  this.$refs.confirmModel.confirm(
                    "/pmsproduct/api/hotelSaleRule/delete",
                    { id: params.row.id }
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      totalStrategy: 0,
      sellingStrategyId: "",
      firstGetData: false,
      social: ["twitter"],
      typeProductListIds: [],
      spePriceSetList: [],
      typeProductList: [],
      spePriceModalShow: false,
      channelStrore: false,
      channelRoomName: "",
      channelRoomTypeName: "",
      channelModalMgtShow: false,
      addModalShowPmsProductName: "",
      hotelPricePlanList: [],
      addModalShow: false,
      roomTypeName: "", //房型名称
      roomName: "", //房间名称
      deleteModalShow: false,
      isShowWeek: false,
      addFormItem: {
        palnId: ""
      },
      addRuleComplteForm: {
        palnId: [
          {
            required: true,
            message: "请选择价格计划"
          }
        ]
      },
      priceFormItem: {
        weeks: [],
        startDate: null,
        endDate: null,
        spePriceSetList: []
      },
      priceRuleComplteForm: {
        weeks: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择1项",
            trigger: "change"
          }
        ],
        startDate: [
          { required: true, message: "请选择合同开始日期", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "请选择合同结束日期", trigger: "change" }
        ]
      },
      options4: {
        disabledDate(date) {
          return;
          (date &&
            date.valueOf() <
              (date &&
                date.valueOf() >
                  new Date(
                    new Date(time).getFullYear(),
                    new Date(time).getMonth() + 3,
                    new Date(time).getDate()
                  ).valueOf())) ||
            (date && date.valueOf() < Date.now() - 86400000);
        }
      },
      options3: {
        disabledDate(date) {
          return (
            date &&
            date.valueOf() <
              new Date(new Date(new Date().toLocaleDateString()).getTime())
          );
        }
      },
      formItem: {
        defaultPrice: "",
        week1: "",
        week2: "",
        week3: "",
        week4: "",
        week5: "",
        week6: "",
        week7: ""
      },
      btnLoading: false,
      ruleComplteForm: {
        defaultPrice: [
          {
            required: true,
            message: "请输入默认价"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        week1: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        week2: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        week3: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        week4: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        week5: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        week6: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ],
        week7: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          },
          {
            validator: validateNum,
            message: "数值不能大于999999"
          }
        ]
      },
      priceSetModal: false,
      popShow: false,
      activeIndex: 0,
      height: "",
      pageData: [],
      listData: [],
      maxHeight: 0,
      translateY: 0,
      lunar: {
        "1-1": "春节",
        "1-15": "元宵",
        "2-2": "龙头",
        "5-5": "端午",
        "7-7": "七夕",
        "7-15": "中元",
        "8-15": "中秋",
        "9-9": "重阳"
      },
      gregorian: {
        "1-1": "元旦",
        "2-14": "情人",
        "3-8": "妇女",
        "3-12": "植树",
        "5-1": "劳动",
        "5-4": "青年",
        "6-1": "儿童",
        "9-10": "教师",
        "10-1": "国庆",
        "12-24": "平安",
        "12-25": "圣诞"
      },
      dayArr: [],
      startDate: "",
      endDate: "",
      options3: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      hotelList: [], //酒店列表
      pmsHotelId: "",
      sellStregyForm: {
        id: "",
        hotelMerchantId: this.pmsHotelId,
        name: "", // 策略名称
        remark: "", // 备注
        ifBreakfast: "", // 是否含早
        bookBeforeDay: "", // 提前预定 天
        bookBeforeHour: "", // 提前预定 小时
        bookBeforeMin: "", // 提前预定 分钟
        bookDateStart: "", // 预定日期 开始
        bookDateEnd: "", // 预定日期 结束
        bookTimeStart: "", // 预定时间 开始
        bookTimeEnd: "",
        bookDaysNumMin: "", // 预定连住最少
        bookDaysNumMax: "",
        bookRoomNumMin: "", // 预定房间 最少
        bookRoomNumMax: "",
        bookCheckTime: "", // 预定人工确认
        addBedRule: "", // 加床规则
        ifCancel: "T", // 取消规则 T/F
        ifCheck: "F", // 是否人工审核 T/F
        cancelTimeRule: "F", // 取消时间规则 T设置规则 F不设置规则
        cancelRuleJson: {}, // 具体取消规则 json
        excludeTimeAdd: [
          {
            minutes: "",
            per: ""
          }
        ],
        excludeMinutes: ""
      },
      excludeTime: {
        minutes: ""
      },

      sellStregyFormRules: {
        name: [
          { required: true, message: "请输入策略名称", trigger: "blur" },
          { max: 30, message: "输入不得超过30个字符", trigger: "blur" }
        ],
        remark: [
          { max: 100, message: "输入不得超过100个字符", trigger: "blur" }
        ],
        ifBreakfast: [
          { required: true, message: "请选择每间每晚含早餐", trigger: "change" }
        ],
        bookBeforeDay: [
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" },
          { type: "number", max: 30, message: "不能大于30天", trigger: "blur" }
        ],
        bookBeforeHour: [
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" },
          {
            type: "number",
            max: 23,
            message: "不能大于23小时",
            trigger: "blur"
          }
        ],
        bookBeforeMin: [
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" },
           {
            type: "number",
            max: 59,
            message: "不能大于59分钟",
            trigger: "blur"
          }
        ],
        bookDaysNumMin: [
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" }
        ],
        bookDaysNumMax: [
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" }
        ],
        bookRoomNumMin: [
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" }
        ],
        bookRoomNumMax: [
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" }
        ],
        bookCheckTime: [
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" }
        ],
        ifCancel: [{ required: true, message: "请选择取消规则" }],
        ifCheck: [{ required: true, message: "请选择取消是否选择" }],
        cancelTimeRule: [{ required: true, message: "请选择取消时间规则" }],
        excludeMinutes: [
          {
            required: true,
            type: "number",
            message: "请输入取消时间",
            trigger: "blur"
          },
          { pattern: /^[0-9]\d*$/, message: "数据格式不正确", trigger: "blur" }
        ]

        // autoCheckDay: [{ pattern: /^[0-9]\d*$/, message: '数据格式不正确', trigger: 'blur' }],
        // autoCheckTime: [{ required: true, message: '请选择时间', trigger: 'change' }]
      },
      tableLoading: false,
      startOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      endOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now();
        }
      },
      saveLoading: false
    };
  },
  watch: {
    // isShowWeek(val){

    // },
    typeProductListIds(val) {
      //深度复制
      let copy_spePriceSetList = JSON.parse(
        JSON.stringify(this.priceFormItem.spePriceSetList)
      );
      //添加新增项
      this.priceFormItem.spePriceSetList = [];
      val.forEach(item => {
        let productItem = copy_spePriceSetList.find(it => {
          return it.productId == item;
        });
        //提选择的产品是否包含当前项
        if (!productItem) {
          //不包含
          this.priceFormItem.spePriceSetList.push(
            Object.assign(
              this.typeProductList.find(el => el.productId == item),
              {
                price: null
              }
            )
          );
        } else {
          this.priceFormItem.spePriceSetList.push(productItem);
        }
      });
      //删除减少项目
      console.log(this.priceFormItem.spePriceSetList);
    },
    startDate(val) {
      //   console.log(val);
      let nextDays;
      let dateArr = val.split("-");
      let year = dateArr[0];
      let month = parseInt(dateArr[1]);
      let day = parseInt(dateArr[2]);
      let nexDate = day;
      //计算下个月今天的日期，如果date<=29,下个月天也是date，如果date=30下个月可能2月最后一天是28/29,date=28/29 如果date=31，判断下个月天数

      if (day >= 29) {
        nextDays = this.getNextMonth(year, month);
        if (nextDays < day) {
          nexDate = nextDays;
        }
      }
      let nextYear = year;
      let nextMonth = month;
      if (nextMonth + 1 > 12) {
        nextMonth = 1;
        nextYear++;
      } else {
        nextMonth++;
      }

      //当月天数
      let curDays = new Date(year, month, 0).getDate();
      this.endDate = nextYear + "-" + nextMonth + "-" + nexDate;
      //   console.log(year, month, day);
      //   console.log(endDate);
      let tep = [];
      for (let i = 0; i < 40; i++) {
        if (i != 0) {
          day++;
        }

        if (day > curDays) {
          day = 1;
          month++;
          if (month > 12) {
            year++;
            month = 1;
          }
        }
        let date = year + "-" + month + "-" + day;
        //获取农历
        let nlArr = this.getNl(year, month, day);
        // console.log(nlArr);
        //判断今天是不是除夕
        let ngNextDayArr = this.getNlNextDay(year, month, day);
        //是不是除夕夜
        let isC = nlArr[0] != ngNextDayArr[0];
        //计算当年清明节日期
        let qmDateStr = this.getQinMingJieDate(year);
        let isQm = month + "-" + day == qmDateStr;

        // console.log(date)
        // console.log(new Date(date).valueOf())
        // console.log(new Date(this.getCurDate()).valueOf())
        // console.log(this.currentdate)

        let obj = {
          date: date,
          day: day,
          month: month,
          year: year,
          weekIndex: this.getWeekIndex(date),
          week: this.getWeek(date),
          nl: nlArr[0] + "-" + nlArr[1] + "-" + nlArr[2],
          festivalNl: isC
            ? "除夕"
            : isQm
            ? "清明"
            : this.getFestivalNl(nlArr[0], nlArr[1], nlArr[2]),
          festivalGl: this.getFestivalGl(year, month, day),
          isToday:
            new Date(date).valueOf() == new Date(this.currentdate).valueOf()
        };
        tep.push(obj);
        if (new Date(this.endDate).valueOf() == new Date(date).valueOf()) {
          break;
        }
      }
      this.dayArr = tep;
      console.log(tep);
      this.getPageData();
    },
    
  },
 
  created() {
    this.startDate = this.getCurDate();
    // this.getNl()
    apiPost("/pmsproduct/api/pmsHotel/queryPmsHotelList").then(res => {
      if (res.status == 200) {
          if(res.data.length){
             this.hotelList = res.data;
        this.pmsHotelId = res.data[0].id;
        this.getPageData(); 
          }
        
      }
    });
  },
  mounted() {
    // let content = $("#content");
    let content = $("#content");
    let _this = this;
    console.log(content);
    console.log(content.height());
    this.height = content.height() - 170 + "px";
    this.$nextTick(() => {
      //  console.log(content.height())
      //   this.maxHeight = content.height();
      console.log(this.$refs.hotelPriceMgtPage.style);
      console.log(this.$refs.hotelPriceMgtPage.style.height);

      let tableBox = $(".right-table-box");
      tableBox.scroll(() => {
        // console.log(tableBox.scrollTop());
        this.translateY = tableBox.scrollTop();

        if (
          (_this.roomIndex || _this.roomIndex == 0) &&
          (_this.dayActiveIndex || _this.dayActiveIndex == 0) &&
          (_this.dayActiveI || _this.dayActiveI == 0)
        ) {
          // _this.pageData[_this.dayActiveIndex].storeList[
          //   _this.dayActiveI
          // ].popShow = false;
          this.listData[this.roomIndex].pageData[this.dayActiveIndex].storeList[
            this.dayActiveI
          ].popShow = false;
          //     _this.pageData[_this.dayActiveIndex].distList[
          //       _this.dayActiveI
          //     ].popShow = false;
          //    this.listData[this.roomIndex].pageData[this.dayActiveIndex].storeList[
          //   this.dayActiveI
          // ].popShow = false
          _this.roomIndex = null;
          _this.dayActiveIndex = null;
          _this.dayActiveI = null;
        }
      });
    });
    window.onresize = () => {
      this.height = content.height() - 170 + "px";
    };

    // content.scroll(() => {
    //   //   console.log(content.scrollTop())
    //   let height = content.scrollTop() - 119;
    //   if (height > 0) {
    //     this.translateY = height;
    //   } else {
    //     this.translateY = 0;
    //   }
    // });
  },
  methods: {
    okClick() {
      this.getClList();
      location.reload();
    },
    addExcludeTime(index,item) {
      if (this.sellStregyForm.excludeTimeAdd.length < 3) {
        let obj = {
          minutes: "",
          per: ""
        };
        this.sellStregyForm.excludeTimeAdd.push(obj);
      } else {
        this.$Message.warning("添加失败，最多三条规则");
      }
    },
    deleExcludeTime(index, item) {
      this.sellStregyForm.excludeTimeAdd.splice(index, 1);
      this.$set(this.sellStregyForm, index, item);
    },
    setBookDateStart(val) {
      this.sellStregyForm.bookDateStart = val;
    },
    setBookDateEnd(val) {
      this.sellStregyForm.bookDateEnd = val;
       if (val) {
        this.startOption = {
          disabledDate(date) {
            return (

             (date &&
              date.valueOf() >
                new Date(val).valueOf() )
            );
          }
        };
      } else {
        this.startOption = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    changepage(num) {
      this.page = num;
      this.getClList();
    },
    openSellingStrategy() {
      this.getClList();
      this.sellingStrategyListModal = true;
    },
    pageSizeChange(num) {
      this.pageSize = num;
      this.getClList();
    },
    addSellingStrategy() {
      this.initSellingStrategy();
      this.sellingName = '新增销售策略';
      this.sellingStrategyModal = true;
    },
    initSellingStrategy() {
      this.sellStregyForm = {
        id: "",
        hotelMerchantId: this.pmsHotelId,
        name: "", // 策略名称
        remark: "", // 备注
        ifBreakfast: "", // 是否含早
        bookBeforeDay: null, // 提前预定 天
        bookBeforeHour: null, // 提前预定 小时
        bookBeforeMin: null, // 提前预定 分钟
        bookDateStart: "", // 预定日期 开始
        bookDateEnd: "", // 预定日期 结束
        bookTimeStart: "", // 预定时间 开始
        bookTimeEnd: "",
        bookDaysNumMin: "", // 预定连住最少
        bookDaysNumMax: "",
        bookRoomNumMin: "", // 预定房间 最少
        bookRoomNumMax: "",
        bookCheckTime: "", // 预定人工确认
        addBedRule: "", // 加床规则
        ifCancel: "T", // 取消规则 T/F
        ifCheck: "F", // 是否人工审核 T/F
        cancelTimeRule: "F", // 取消时间规则 T设置规则 F不设置规则
        cancelRuleJson: {}, // 具体取消规则 json
        excludeTimeAdd: [
          {
            minutes: "",
            per: ""
          }
        ]
      };
      this.$refs.sellStregy.resetFields();
    },
    getClList(num) {
      this.tableLoading = true;
      apiGet("/pmsproduct/api/hotelSaleRule/listRule", {
        hotelMerchantId: this.pmsHotelId,
        page: this.page,
        limit: this.pageSize
      }).then(res => {
        if (res.status == 200) {
          this.tableLoading = false;
          this.dataList = res.data.rows;
          this.hotelPricePlanList = res.data.rows;
          this.totalStrategy = res.data.total;
        }
      });
    },
    validateNum(rule, value, callback) {
      if (value > 999999) {
        callback(new Error("最大值999999"));
      } else {
        callback();
      }
    },
    weekDiffChange(val) {
      console.log(val);
      if (val) {
        this.setDefaltPrice();
      }
    },
    setDefaltPrice() {
      if (
        (this.formItem.defaultPrice || this.formItem.defaultPrice == 0) &&
        /^(([1-9][0-9]*)|[0]|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(
          this.formItem.defaultPrice
        )
      ) {
        this.formItem.week1 = this.formItem.defaultPrice;
        this.formItem.week2 = this.formItem.defaultPrice;
        this.formItem.week3 = this.formItem.defaultPrice;
        this.formItem.week4 = this.formItem.defaultPrice;
        this.formItem.week5 = this.formItem.defaultPrice;
        this.formItem.week6 = this.formItem.defaultPrice;
        this.formItem.week7 = this.formItem.defaultPrice;
      }
    },
    typeProductSelect(val) {
      if (val) {
        this.typeProductList.forEach(item => {
          let el = this.typeProductListIds.find(it => {
            return item.productId == it;
          });
          console.log(el);
          if (!el) {
            this.typeProductListIds.push(item.productId);
          }
        });
      } else {
        this.typeProductListIds = [];
      }
    },
    priceMgtSave() {
      this.btnLoading = true;
      if (this.priceFormItem.spePriceSetList.length) {
        this.$refs.priceMgtModal.validate(async valid => {
          if (valid) {
            let arr = [];
            this.priceFormItem.spePriceSetList.forEach((item, index) => {
              if (item.price) {
                arr.push({
                  pmsTypeProductId: item.productId,
                  price: item.price
                });
              }
            });
            if (arr.length) {
              apiPostJson(
                "/pmsproduct/api/pmsHotelDatePrice/batchSavePmsDatePrice?startDate=" +
                  this.priceFormItem.startDate +
                  "&endDate=" +
                  this.priceFormItem.endDate +
                  "&week=" +
                  this.priceFormItem.weeks.join(",") +
                  "&pmsHotelId=" +
                  this.pmsHotelId +
                  "&type=store",

                {
                  pmsHotelTypePriceList: arr
                }
              ).then(res => {
                this.btnLoading = false;
                this.spePriceModalShow = false;
                if (res.status == 200 || res.success) {
                  this.$Message.success("设置成功!");
                  let arr = [];
                  let indexArr = [];
                  this.listData.forEach((item, index) => {
                    if (item.show) {
                      indexArr.push(index);
                      arr.push(
                        apiPost(
                          "/pmsproduct/api/pmsHotelTypeProduct/pmsHotelProductList",
                          {
                            pmsHotelTypeId: this.listData[index].pmsHotelType
                              .id,
                            // mainUserId: this.mainUserId,
                            startDate: this.startDate,
                            endDate: this.endDate
                          }
                        )
                      );
                    }
                  });
                  axios.all(arr).then(resArr => {
                    resArr.forEach((item, index) => {
                      this.formaterData(indexArr[index], item);
                    });
                  });
                } else {
                  this.$Message.warning(res.message);
                }
              });
            } else {
              this.btnLoading = false;
              this.$Message.warning("请填写价格");
            }
          } else {
            this.btnLoading = false;
          }
        });
      } else {
        this.btnLoading = false;
        this.$Message.warning("请选择房型");
      }
    },
    setBegDate(time) {
      // this.priceFormItem.startDate = time;
      // this.options4 = {
      //   disabledDate: date => {
      //     let startTime = this.priceFormItem.startDate
      //       ? new Date(this.priceFormItem.startDate).valueOf()
      //       : "";
      //     return date && date.valueOf() < startTime;
      //   }
      // };
      console.log(time);
      if (time) {
        this.priceFormItem.startDate = time;
        if (time > this.priceFormItem.endDate) {
          this.$Message.warning("开始时间不能大于结束时间");
          this.priceFormItem.endDate = time;
        }
        // 重置结束时间规则
        let subtime = new Date(
          new Date(time).getFullYear(),
          new Date(time).getMonth() + 3,
          new Date(time).getDate()
        ).valueOf();
        this.options4 = {
          disabledDate(date) {
            return (
              (date && date.valueOf() > subtime) ||
              (date &&
                date.valueOf() <
                  new Date(time).valueOf() - 1 * 24 * 60 * 60 * 1000)
            );
          }
        };
      } else {
        this.options4 = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    setEndDate(time) {
      // if (time) {
      //   this.priceFormItem.endDate = time;
      //   let endTime = this.priceFormItem.endDate
      //     ? new Date(this.priceFormItem.endDate).valueOf() -
      //       1 * 24 * 60 * 60 * 1000
      //     : "";
      //   this.options3 = {
      //     disabledDate(date) {
      //       return date && date.valueOf() > endTime;
      //     }
      //   };
      // } else {
      //   this.options3 = {
      //     disabledDate(date) {
      //       return false;
      //     }
      //   };
      // }
      if (time) {
        this.priceFormItem.endDate = time;
        let endTime = time ? new Date(time).valueOf() : "";
        this.options3 = {
          disabledDate(date) {
            return (
              date &&
              date.valueOf() <
                new Date(
                  new Date(new Date().toLocaleDateString()).getTime()
                ).valueOf()
            );
          }
        };
      } else {
        this.options3 = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    threeMonthAfterDate() {
      //后去三个月的时间
    },
    setSpePriceModalShow() {
      //获取当前时间
      this.priceFormItem.startDate = this.getCurDate();
      this.priceFormItem.endDate = this.getLastDay();
      this.setBegDate(this.getCurDate2());
      this.typeProductListIds = [];
      this.priceFormItem.spePriceSetList = [];
      this.priceFormItem.weeks = ["1", "2", "3", "4", "5", "6", "7"];

      apiPost("/pmsproduct/api/pmsHotelTypeProduct/queryChannelProductList", {
        pmsHotelId: this.pmsHotelId,
        // mainUserId: this.mainUserId,
        type: "store"
      }).then(res => {
        if (res.status == 200 || res.success) {
          if (res.data.length) {
            this.spePriceModalShow = true;
            this.typeProductList = res.data;
          } else {
            this.$Message.warning("请添加房型产品,并设置默认价");
          }
        } else {
        }
      });
    },
    channelMgt() {
      apiPost("/pmsproduct/api/pmsHotelTypeProduct/isChannelEnabledDisable", {
        id: this.hotelTypeId,
        // mainUserId: this.mainUserId,
        isDist: "F",
        isStore: this.channelStrore ? "T" : "F",
        pmsHotelId: this.pmsHotelId
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.channelModalMgtShow = false;
          this.$Message.success("设置成功!");
          this.getPirceData(this.defaultIndex);
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    defaultPriceChange() {
      this.setDefaltPrice();
    },
    channelModal(it, item, index) {
      console.log(it, item);
      this.defaultIndex = index;
      this.channelRoomName = item.pmsHotelType.pmsName;
      this.channelStrore = it.isStore == "T";
      this.hotelTypeId = it.id;
      this.channelRoomTypeName = it.saleRuleName;
      this.channelModalMgtShow = true;
    },
    typeAdd() {
      this.btnLoading = true;
      this.$refs.addFormItem.validate(async valid => {
        if (valid) {
          let item = this.hotelPricePlanList.find(
            item => item.id == this.addFormItem.palnId
          );
          apiPost("/pmsproduct/api/pmsHotelTypeProduct/savePmsHotelProduct", {
            pmsProductName: item.name,
            pmsHotelTypeId: this.addModalShowPmsPmsHotelTypeId,
            pmsPricePlanId: this.addFormItem.palnId,
            isDist: "F",
            isStore: "T"
            // mainUserId: this.mainUserId
          }).then(res => {
            this.btnLoading = false;
            this.addModalShow = false;
            if (res.status == 200 || res.success) {
              this.$Message.success("添加成功!");
              this.getPirceData(this.defaultIndex);
            } else {
              this.$Message.warning(res.message);
            }
          });
        } else {
          this.btnLoading = false;
        }
      });
    },
    roomTypeAddModalShow(item, index) {
      this.defaultIndex = index;
      apiGet("/pmsproduct/api/hotelSaleRule/queryRuleList", {
        hotelMerchantId: item.pmsHotelType.pmsHotelId
        // mainUserId: this.mainUserId,
        // typeId: item.pmsHotelType.id
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.addModalShowPmsProductName = item.pmsHotelType.pmsName;
          this.addModalShowPmsPmsHotelTypeId = item.pmsHotelType.id;
          this.addModalShow = true;
          this.$refs.addFormItem.resetFields();
          this.hotelPricePlanList = res.data;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    typeDeleteModalShow(it, item, index) {
      // console.log(it, item);
      this.defaultIndex = index;
      this.deleteIt = it;
      this.roomName = item.pmsHotelType.pmsName;
      this.roomTypeName = it.saleRuleName;
      this.deleteModalShow = true;
    },
    typeDelete() {
      apiPost("/pmsproduct/api/pmsHotelTypeProduct/deletePmsHotelProduct", {
        id: this.deleteIt.id
        // mainUserId: this.mainUserId
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.$Message.success("删除成功!");
          this.deleteModalShow = false;
          this.firstGetData = false;
          this.getPirceData(this.defaultIndex);
        } else {
          this.$Message.success(res.message);
        }
      });
    },
      scrollError() {
      this.$nextTick(() => {
        let errList = $(".ivu-form-item-error");
        let list = $(".room-edit-modal .ivu-form-item");
        if (errList.length > 0) {
          let scroll_offset = errList.eq(0).offset().top;
          let top = $(".room-edit-modal .ivu-modal-body").offset().top;
          let test = list.eq(0).offset().top;
          console.log(scroll_offset);
          console.log(test);
          console.log(scroll_offset - test);
          // console.log($(".room-edit-modal .ivu-modal-body").scrollTop())
          // // console.log($(".room-edit-modal .hotel-roomType-content").offset().top)
          // console.log("top",top)
          // console.log("scroll_offset",scroll_offset)

          // // console.log( $(".room-edit-modal .ivu-modal-body"))
          $(".room-edit-modal .ivu-modal-body").animate(
            {
              scrollTop: scroll_offset - test
            },
            300
          );
        }
      });
    },
    submit() {
      this.btnLoading = true;
      let _this = this;
      this.$refs.formItem.validate(async valid => {
        // this.scrollError();
        if (valid) {
          // alert(1);
          let daliyPrice = this.formItem.defaultPrice
            ? this.formItem.defaultPrice
            : 0;
          let arr = [
            {
              daliyPrice: daliyPrice,
              week: 1,
              weekPrice:
                this.formItem.week1 || this.formItem.week1 == 0
                  ? this.formItem.week1
                  : ""
            },
            {
              daliyPrice: daliyPrice,
              week: 2,
              weekPrice:
                this.formItem.week2 || this.formItem.week2 == 0
                  ? this.formItem.week2
                  : ""
            },
            {
              daliyPrice: daliyPrice,
              week: 3,
              weekPrice:
                this.formItem.week3 || this.formItem.week3 == 0
                  ? this.formItem.week3
                  : ""
            },
            {
              daliyPrice: daliyPrice,
              week: 4,
              weekPrice:
                this.formItem.week4 || this.formItem.week4 == 0
                  ? this.formItem.week4
                  : ""
            },
            {
              daliyPrice: daliyPrice,
              week: 5,
              weekPrice:
                this.formItem.week5 || this.formItem.week5 == 0
                  ? this.formItem.week5
                  : ""
            },
            {
              daliyPrice: daliyPrice,
              week: 6,
              weekPrice:
                this.formItem.week6 || this.formItem.week6 == 0
                  ? this.formItem.week6
                  : ""
            },
            {
              daliyPrice: daliyPrice,
              week: 7,
              weekPrice:
                this.formItem.week7 || this.formItem.week7 == 0
                  ? this.formItem.week7
                  : ""
            }
          ];

          apiPostJson(
            "/pmsproduct/api/pmsHotelCommonPrice/updatePmsCommonPrice?pmsHotelChannelId=" +
              this.showPriceModalStoreId +
              "&pmsHotelId=" +
              this.pmsHotelId +
              "&type=" +
              (this.isShowWeek ? "F" : "T"),
            {
              pmsHotelPriceList: arr
            }
          ).then(res => {
            this.btnLoading = false;
            this.priceSetModal = false;
            if (res.status == 200 || res.success) {
              this.$Message.success("设置成功!");
              this.getPirceData(this.defaultIndex);
            } else {
              this.$Message.warning(res.message);
            }
          });
        } else {
          this.btnLoading = false;
        }
      });
    },
    showPriceModal(it, item, index) {
      this.defaultIndex = index;
      this.roomTypeName = it.saleRuleName;
      this.roomName = item.pmsHotelType.pmsName;
      this.showPriceModalStoreId = it.storeId;
      //重置数据

      apiPost("/pmsproduct/api/pmsHotelCommonPrice/queryPmsCommonPrice", {
        pmsHotelChannelId: this.showPriceModalStoreId
        // mainUserId: this.mainUserId
      }).then(res => {
        if (res.status == 200 || res.success) {
          this.priceSetModal = true;
          this.$refs.formItem.resetFields();
          let el = res.data[0];
          this.formItem.defaultPrice = el.daliyPrice;
          this.isShowWeek = el.isAlike == "F";
          if (this.isShowWeek) {
            res.data.forEach((item, index) => {
              let key = "week" + item.week;
              let price =
                item.weekPrice || item.weekPrice == 0
                  ? item.weekPrice + ""
                  : "";
              this.formItem[key] = price;
            });
          } else {
            this.formItem.week1 = "";
            this.formItem.week2 = "";
            this.formItem.week3 = "";
            this.formItem.week4 = "";
            this.formItem.week5 = "";
            this.formItem.week6 = "";
            this.formItem.week7 = "";
          }
          console.log(this.formItem);
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    saveDistPrice() {
      let val = this.pageData[this.dayActiveIndex].distList[this.dayActiveI]
        .price;
      if (val) {
        if (
          /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(val)
        ) {
          this.getPageData();
        } else {
          this.$Message.warning("特殊价格式错误");
        }
      } else {
        this.$Message.warning("请输入特殊价");
      }
    },
    saveStorePrice(index, day, id) {
      let val = this.listData[this.roomIndex].pageData[this.dayActiveIndex]
        .storeList[this.dayActiveI].price;
      if (val) {
        if (
          /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(val)
        ) {
          apiPost("/pmsproduct/api/pmsHotelDatePrice/updatePmsHotelDatePrice", {
            pmsHotelChannelId: id,
            priceDate: day.date,
            price: val,
            enabled: "T",
            pmsHotelId: this.pmsHotelId
            // mainUserId: this.mainUserId
          }).then(res => {
            this.$Message.success("保存成功!");
            this.getPirceData(index);
          });
        } else {
          this.$Message.warning("特殊价格式错误");
        }
      } else {
        this.$Message.warning("请输入特殊价");
      }
    },
    cancelStorePrice(i, dayIndex) {
      this.listData[this.roomIndex].pageData[this.dayActiveIndex].storeList[
        this.dayActiveI
      ].popShow = false;
      this.listData[this.roomIndex].pageData[this.dayActiveIndex].storeList[
        this.dayActiveI
      ].price = this.storePrice;
    },
    cancelDistPrice(i, dayIndex) {
      this.pageData[i].distList[dayIndex].popShow = false;
      this.pageData[i].distList[dayIndex].price = this.storePrice;
    },
    showStorePop(index, i, dayIndex, day) {
      if (day.price || day.price == 0) {
        this.storePrice =
          this.listData[index].pageData[i].storeList[dayIndex].price ||
          this.listData[index].pageData[i].storeList[dayIndex].price == 0
            ? this.listData[index].pageData[i].storeList[dayIndex].price
            : "";
        // this.pageData.forEach((item,index)=>{
        //   item.storeList.forEach((it,i)=>{
        //      this.pageData[index].storeList[i].popShow = false
        //   })
        // })
        this.listData.forEach((room, roomIndex) => {
          room.pageData.forEach((item, index) => {
            item.storeList.forEach((it, i) => {
              //  this.pageData[index].storeList[i].popShow = false
              this.listData[roomIndex].pageData[index].storeList[
                i
              ].popShow = false;
            });
          });
        });
        this.roomIndex = index;
        this.dayActiveIndex = i;
        this.dayActiveI = dayIndex;
        // this.pageData[i].storeList[dayIndex].popShow = true;
        this.listData[index].pageData[i].storeList[dayIndex].popShow = true;
      } else {
        this.$Message.warning("请设置默认价");
      }
    },
    showDistPop(i, dayIndex) {
      this.storePrice =
        this.pageData[i].distList[dayIndex].price ||
        this.pageData[i].distList[dayIndex].price == 0
          ? this.pageData[i].distList[dayIndex].price
          : "";
      this.dayActiveIndex = i;
      this.dayActiveI = dayIndex;
      this.pageData[i].distList[dayIndex].popShow = true;
    },
    showIndex(index) {
      // console.log(index);
      // this.listData[index].show = !this.listData[index].show;
      if (!this.listData[index].show) {
        this.getPirceData(index);
      } else {
        this.listData[index].show = false;
      }

      // this.activeIndex = index;
      // this.listData.forEach((item, i) => {
      //   // this.listData[i].show = index == i;
      //   if (index == i) {
      //     //当前项目
      //     this.listData[i].show = !this.listData[i].show;
      //   } else {
      //     this.listData[i].show = false;
      //   }
      // });
      // if (this.listData[index].show) {
      //   this.getPirceData();
      // } else {
      //   this.activeIndex = null;
      // }
    },
    hotelChange(id) {
      this.pmsHotelId = id;
      this.getPageData();
    },
    getPageData() {
      //   this.mainUserId = window.localStorage.getItem("xjsc_2018_userId");
      //第一家酒店房型
      if (this.pmsHotelId) {
        apiPost("/pmsproduct/api/pmsHotelType/queryPmsTypeListInfo", {
          pmsHotelId: this.pmsHotelId,
          // mainUserId: this.mainUserId,
          startDate: this.startDate,
          endDate: this.endDate
        }).then(res => {
          if (res.status == 200) {
            if (!res.data && res.data.length) {
              this.listData = [];
              return false;
            }
            res.data.forEach((item, index) => {
              // res.data[index].show = index == this.activeIndex;
              res.data[index].show = false;
              res.data[index].pageData = [];
            });
            this.listData = res.data;

            //初始化this.pageData为[[],[],[]]
            this.pageData = new Array(res.data, length).fill([]);
            // console.log( this.test)
            if (this.listData.length) {
              this.getPirceData(0);
            }
          } else {
            this.$Message.warning(res.message);
          }
        });
      }
    },
    formaterData(index, res) {
      // if(this.firstGetData){
      //   //开关,第一次加载
      //   if(res.data.length){
      //     this.listData[0].show = true
      //   }
      //   this.firstGetData = false
      // }else{
      //   if(!res.data.length){

      //   return false
      //   }
      // }
      if (res.data.length) {
        this.listData[index].show = true;
      } else {
        this.listData[index].show = false;
        if (this.firstGetData) {
          this.$Message.warning("请添加房型产品");
        } else {
          this.firstGetData = true;
        }
        return false;
      }

      res.data.forEach((item, index) => {
        item.pmsHotelChannel.forEach((it, i) => {
          let flag = false;
          it.priceInfo.forEach((day, dayIndex) => {
            it.priceInfo[dayIndex].popShow = false;
            if (
              it.priceInfo[dayIndex].price ||
              it.priceInfo[dayIndex].price == 0
            ) {
              flag = true;
            }
          });

          if (it.type == "dist") {
            //分销
            res.data[index].distList = it.priceInfo;
            res.data[index].isDistPrice = flag;
            res.data[index].distId = it.id;
          }
          if (it.type == "store") {
            //店铺
            res.data[index].storeId = it.id;
            res.data[index].storeList = it.priceInfo;
            res.data[index].isStorePrice = flag;
          }
        });
      });
      this.listData[index].pageData = res.data;
    },
    getPirceData(index) {
      //房型面的产品
      apiPost("/pmsproduct/api/pmsHotelTypeProduct/pmsHotelProductList", {
        pmsHotelTypeId: this.listData[index].pmsHotelType.id,
        // mainUserId: this.mainUserId,
        startDate: this.startDate,
        endDate: this.endDate
      }).then(res => {
        this.formaterData(index, res);
      });
    },
    getHeight() {
      let content = $("#content");
      console.log(content.height());
    },
    //判断是否是闰年
    isLeapYear(Year) {
      if ((Year % 4 == 0 && Year % 100 != 0) || Year % 400 == 0) {
        return true;
      } else {
        return false;
      }
    },
    getQinMingJieDate(fullYear) {
      //清明节的日期是不固定的，规律是：闰年开始的前2年是4月4日，闰年开始的第3年和第4年是4月5日
      if (this.isLeapYear(fullYear) || this.isLeapYear(fullYear - 1)) {
        return "4-4";
      } else {
        return "4-5";
      }
    },
    getNlNextDay(yy, mm, dd) {
      //当前月天数
      let curDays = new Date(yy, mm, 0).getDate();
      if (dd + 1 > curDays) {
        dd = 1;
        mm++;
        if (mm > 12) {
          mm = 1;
          yy++;
        }
      } else {
        dd++;
      }
      return this.getNl(yy, mm, dd);
    },
    //获取农历节假日
    getFestivalNl(yy, mm, dd) {
      return this.lunar[mm + "-" + dd] ? this.lunar[mm + "-" + dd] : "";
    },
    //获取公历
    getFestivalGl(yy, mm, dd) {
      return this.gregorian[mm + "-" + dd] ? this.gregorian[mm + "-" + dd] : "";
    },
    getNl(yy, mm, dd) {
      /*农历部分*/
      //   console.log("zzzzzzzzzzzz", mm, dd);
      var CalendarData = new Array(100);
      var madd = new Array(12);
      var tgString = "甲乙丙丁戊己庚辛壬癸";
      var dzString = "子丑寅卯辰巳午未申酉戌亥";
      var numString = "一二三四五六七八九十";
      var monString = "正二三四五六七八九十冬腊";
      var weekString = "日一二三四五六";
      var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
      var cYear, cMonth, cDay, TheDate;
      CalendarData = new Array(
        0xa4b,
        0x5164b,
        0x6a5,
        0x6d4,
        0x415b5,
        0x2b6,
        0x957,
        0x2092f,
        0x497,
        0x60c96,
        0xd4a,
        0xea5,
        0x50da9,
        0x5ad,
        0x2b6,
        0x3126e,
        0x92e,
        0x7192d,
        0xc95,
        0xd4a,
        0x61b4a,
        0xb55,
        0x56a,
        0x4155b,
        0x25d,
        0x92d,
        0x2192b,
        0xa95,
        0x71695,
        0x6ca,
        0xb55,
        0x50ab5,
        0x4da,
        0xa5b,
        0x30a57,
        0x52b,
        0x8152a,
        0xe95,
        0x6aa,
        0x615aa,
        0xab5,
        0x4b6,
        0x414ae,
        0xa57,
        0x526,
        0x31d26,
        0xd95,
        0x70b55,
        0x56a,
        0x96d,
        0x5095d,
        0x4ad,
        0xa4d,
        0x41a4d,
        0xd25,
        0x81aa5,
        0xb54,
        0xb6a,
        0x612da,
        0x95b,
        0x49b,
        0x41497,
        0xa4b,
        0xa164b,
        0x6a5,
        0x6d4,
        0x615b4,
        0xab6,
        0x957,
        0x5092f,
        0x497,
        0x64b,
        0x30d4a,
        0xea5,
        0x80d65,
        0x5ac,
        0xab6,
        0x5126d,
        0x92e,
        0xc96,
        0x41a95,
        0xd4a,
        0xda5,
        0x20b55,
        0x56a,
        0x7155b,
        0x25d,
        0x92d,
        0x5192b,
        0xa95,
        0xb4a,
        0x416aa,
        0xad5,
        0x90ab5,
        0x4ba,
        0xa5b,
        0x60a57,
        0x52b,
        0xa93,
        0x40e95
      );
      madd[0] = 0;
      madd[1] = 31;
      madd[2] = 59;
      madd[3] = 90;
      madd[4] = 120;
      madd[5] = 151;
      madd[6] = 181;
      madd[7] = 212;
      madd[8] = 243;
      madd[9] = 273;
      madd[10] = 304;
      madd[11] = 334;

      function GetBit(m, n) {
        return (m >> n) & 1;
      }
      function e2c() {
        TheDate =
          arguments.length != 3
            ? new Date()
            : new Date(arguments[0], arguments[1], arguments[2]);
        var total, m, n, k;
        var isEnd = false;
        var tmp = TheDate.getYear();
        if (tmp < 1900) {
          tmp += 1900;
        }
        total =
          (tmp - 1921) * 365 +
          Math.floor((tmp - 1921) / 4) +
          madd[TheDate.getMonth()] +
          TheDate.getDate() -
          38;

        if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
          total++;
        }
        for (m = 0; ; m++) {
          k = CalendarData[m] < 0xfff ? 11 : 12;
          for (n = k; n >= 0; n--) {
            if (total <= 29 + GetBit(CalendarData[m], n)) {
              isEnd = true;
              break;
            }
            total = total - 29 - GetBit(CalendarData[m], n);
          }
          if (isEnd) break;
        }
        cYear = 1921 + m;

        cMonth = k - n + 1;
        cDay = total;
        if (k == 12) {
          if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth = 1 - cMonth;
          }
          if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth--;
          }
        }
        return [cYear, cMonth, total];
        // console.log(cYear)
        // console.log(cMonth)
        // console.log(total)
      }

      function GetcDateString() {
        var tmp = "";
        tmp += tgString.charAt((cYear - 4) % 10);
        tmp += dzString.charAt((cYear - 4) % 12);
        tmp += "(";
        tmp += sx.charAt((cYear - 4) % 12);
        tmp += ")年 ";
        if (cMonth < 1) {
          tmp += "(闰)";
          tmp += monString.charAt(-cMonth - 1);
        } else {
          tmp += monString.charAt(cMonth - 1);
        }
        tmp += "月";
        tmp += cDay < 11 ? "初" : cDay < 20 ? "十" : cDay < 30 ? "廿" : "三十";
        if (cDay % 10 != 0 || cDay == 10) {
          tmp += numString.charAt((cDay - 1) % 10);
        }
        return tmp;
      }

      function GetLunarDay(solarYear, solarMonth, solarDay) {
        //solarYear = solarYear<1900?(1900+solarYear):solarYear;
        if (solarYear < 1921 || solarYear > 2020) {
          return "";
        } else {
          solarMonth = parseInt(solarMonth) > 0 ? solarMonth - 1 : 11;
          return e2c(solarYear, solarMonth, solarDay);
          // return GetcDateString();
        }
      }

      // var D = new Date();
      // var yy = D.getFullYear();
      // var mm = D.getMonth() + 1;
      // var dd = D.getDate();
      // var ww = D.getDay();
      // var ss = parseInt(D.getTime() / 1000);
      if (yy < 100) yy = "19" + yy;
      //   function showCal() {
      //     document.write(GetLunarDay(yy, mm, dd));
      //   }
      // console.log(yy,mm,dd)
      return GetLunarDay(yy, mm, dd);
      //   showCal();
      //   return e2c(yy, mm, dd);
    },
    getWeek(dateStr) {
      let date = new Date(dateStr);
      let index = date.getDay(); //获取存储当前日期
      let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      return weekday[index];
    },
    getWeekIndex(dateStr) {
      let date = new Date(dateStr);
      let index = date.getDay(); //获取存储当前日期
      return index;
    },
    last() {
      let dateArr = this.startDate.split("-");
      let year = dateArr[0];
      let month = parseInt(dateArr[1]);
      let nowDate = new Date();
      let curYear = nowDate.getFullYear();
      let curMonth = nowDate.getMonth() + 1;
      if (year == curYear && curMonth == month) {
        return false;
      }
      let day = parseInt(dateArr[2]);
      //计算下个月今天的日期，如果date<=29,下个月天也是date，如果date=30下个月可能2月最后一天是28/29,date=28/29 如果date=31，判断下个月天数

      if (day >= 29) {
        let lastDays = this.getLastMonth(year, month);
        if (lastDays < day) {
          day = lastDays;
        }
      }
      if (month - 1 == 0) {
        month = 12;
        year--;
      } else {
        month--;
      }
      //   this.endDate = this.startDate;
      this.firstGetData = false;
      this.startDate = year + "-" + month + "-" + day;
    },
    next() {
      this.firstGetData = false;
      this.startDate = this.endDate;
    },
    getLastMonth(year, month) {
      if (month - 1 == 0) {
        month = 12;
        year--;
      } else {
        month--;
      }
      console.log(year, month);
      //   console.log(new Date(year, month, 0).getDate());
      return new Date(year, month, 0).getDate();
    },
    getNextMonth(year, month) {
      //获取下个月天数
      if (month + 1 > 12) {
        month = 1;
        year++;
      } else {
        month++;
      }
      console.log(year, month);
      //   console.log(new Date(year, month, 0).getDate());
      return new Date(year, month, 0).getDate();
    },
    dateChange(date) {
      //   console.log(date);
      this.firstGetData = false;
      this.startDate = date;
    },
    getCurDate2() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      this.currentdate = currentdate;
      return currentdate;
    },
    getLastDay() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      var lastDay = new Date(year, month, 0).getDate();
      var lastDate = year + seperator1 + month + seperator1 + lastDay;
      return lastDate;
    },
    getCurDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      // if (month >= 1 && month <= 9) {
      //   month = "0" + month;
      // }
      // if (strDate >= 0 && strDate <= 9) {
      //   strDate = "0" + strDate;
      // }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      this.currentdate = currentdate;
      return currentdate;
    },
    
    saveSellingStrategy() {
      let _this = this;
      this.saveLoading = true;
      this.$refs.sellStregy.validate(async valid => {
          this.scrollError();
        if (valid) {
          if (
            this.sellStregyForm.ifCancel === "T" &&
            this.sellStregyForm.cancelTimeRule == "T"
          ) {
            // sellStregy
            // {"type":"D","Day":1,"Hour":1,"Min":0}
            let excludeTime = {
              minutes: this.sellStregyForm.excludeMinutes
            };
            // let arr=JSON.parse(JSON.stringify(this.sellStregyForm.excludeTimeAdd))
            // let sellStregyForm = arr.map( ele => {
            //     if(ele.minutes==''&&ele.per==''){
            //          return {
            //     minutes: ele.minutes,
            //     per:ele.per
            //   }
            //     }

            // })

            let cancelRuleJson = {
              excludeTime: excludeTime,
              excludeTimeAdd: this.sellStregyForm.excludeTimeAdd
            };

            this.sellStregyForm.cancelRuleJson = JSON.stringify(cancelRuleJson);
          }
          if (this.sellStregyForm.bookDateStart != "") {
            if (this.sellStregyForm.bookDateEnd != "") {
            } else {
              this.$Message.warning("预订日期区间不完整");
              this.saveLoading = false;
              return;
            }
          }
          if (this.sellStregyForm.bookDateEnd != "") {
            if (this.sellStregyForm.bookDateStart != "") {
            } else {
              this.$Message.warning("预订日期区间不完整");
              this.saveLoading = false;
              return;
            }
          }
          if (this.sellStregyForm.bookTimeStart != "") {
            if (this.sellStregyForm.bookTimeEnd != "") {
            } else {
              this.$Message.warning("预订时间区间不完整");
              this.saveLoading = false;
              return;
            }
          }
          if (this.sellStregyForm.bookTimeEnd != "") {
            if (this.sellStregyForm.bookTimeStart != "") {
            } else {
              this.$Message.warning("预订时间区间不完整");
              this.saveLoading = false;
              return;
            }
          }
          this.apiPost(
            "/pmsproduct/api/hotelSaleRule/updateRule",
            this.sellStregyForm
          ).then(res => {
            if (res.status === 200) {
              this.$Message.success(res.message);
              this.getClList();
              this.sellingStrategyModal = false;
            } else {
              this.$Message.warning(res.message);
            }
            this.saveLoading = false;
          });
        } else {
          this.saveLoading = false;
        }
      });
    }
  }
};
</script>

<style lang='scss'>
.add-rt-modal {
  .ivu-modal-body {
    overflow: visible;
  }
}
.form-title {
  background: #dedbdb;
  padding: 5px;
  margin-left: -20px;
  border-left: 4px solid rgba(100, 182, 255, 1);
  font-size: 16px;
  margin-bottom: 10px;
}

.spe-price-modal {
  .type-name {
    font-size: 14px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .product-name {
    font-size: 14px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .price-item {
    display: block;
    margin-top: 5px;
  }
  .m-l {
    padding: 10px;
    height: 350px;
    overflow: auto;
    border: 1px solid #e9eaec;
    border-right: none;
  }
  .m-r {
    height: 350px;
    overflow: auto;
    border: 1px solid #e9eaec;
    padding: 10px;
    padding-left: 0;
    .spc-table {
      width: 100%;
      tr {
        th {
          background: #e9eaec;
          border: 1px solid #e9eaec;
        }
        td {
          padding: 10px 3px;
          border: 1px solid #e9eaec;
          .t-name {
            display: inline-block;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .p-name {
            display: inline-block;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        td:last-child {
          text-align: center;
        }
      }
    }
  }
}
.deltel-c-modal {
  .room-name {
    max-width: 200px;
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 5px;
  }
  .type-name {
    max-width: 200px;
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.price-s-modal {
  .room-name {
    display: inline-block;
    max-width: 250px;
    font-size: 16px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .type-name {
    display: inline-block;
    max-width: 250px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .price-s-table {
    width: 100%;
    tr {
      td {
        padding: 0 5px;
      }
    }
  }
}
.hotelPriceMgt-page {
  height: 100%;
  // overflow: auto;
  .hotelPriceMgt-page-notice {
    background: #ffe0c1;
    font-size: 14px;
    padding: 10px 5px;
  }
  .body-box {
    border-top: 1px solid #ccc;
  }
  table {
    // width: 100%;
    // border-collapse: collapse;
    tr {
      td,
      th {
        // border: 1px solid #ccc;
        padding: 5px;
        height: 60px;
        font-size: 14px;
        text-align: center;
        background: #fff;
        border-bottom: 1px solid #ccc;
        border-left: 1px solid #ccc;
        &.t-l-r {
          text-align: right;
        }
        &.t-l-l {
          text-align: left;
        }
      }
      th {
        background: #ccc;
      }
    }
  }
  .left-table-box {
    width: 442px;
    // height: 500px;
    overflow: hidden;
    min-height: 300px;
    table {
      width: 100%;
      tr {
        td {
          .show-icon {
            cursor: pointer;
            padding: 10px 15px;
          }
          .type-name {
            margin: 0 auto;
            width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .store-name {
            margin: 0 auto;
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .room-name {
            margin: 0 auto;
            display: inline-block;
            // text-align: left;
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
          }
        }
      }
      tr.room-header {
        td {
          background: #f5f7f9;
        }
      }
    }
  }
  .right-table-box {
    max-width: calc(100% - 442px);
    border-right: 1px solid #ccc;
    overflow: auto;
    table {
      thead {
        tr {
          th {
            font-size: 12px;
            &:first-child {
              border-left: none;
            }
            .top-day {
              width: 95px;
              .day {
                font-size: 14px;
                font-weight: 600;
              }
            }
          }
        }
      }
      tr {
        td {
          //   padding: 5px 10px;
          background: #fff;
          font-size: 14px;
          .week-color {
            color: #339900;
          }
          .spec-color {
            color: red;
          }
          .tip-box {
            display: block;
            .ivu-poptip-rel {
              display: block;
              // height: 30px;
              // line-height: 30px;
              cursor: pointer;
            }
            .title {
              font-size: 16px;
            }
          }
          .top-day {
            width: 95px;
            .day {
              font-size: 14px;
              font-weight: 600;
            }
            &.week-day {
              color: #339900;
            }
          }
        }
        &.room-header {
          td {
            background: #aaa;
          }
        }
        &:first-child {
          td {
            background: #fff;
          }
        }
        &.stock-tr {
          td {
            background: #f5f7f9;
          }
        }
      }
    }
  }
}
</style>
