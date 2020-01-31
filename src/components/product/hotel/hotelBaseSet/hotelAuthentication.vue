<template>
    <div class="houseType">
        <Row :gutter="16" class="btn-groups">
            <Col span="2">
            <Button icon="md-add" type="primary" @click="addRoom">新增房型</Button>
            </Col>
            <Col span="2">
            <!-- <Button @click="show=true">显示/隐藏房间</Button> -->
            </Col>
        </Row>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
        <confirm ref="confirmModel" :content="content" :sucessMsg="sucessMsg" :mode="mode" @sucessDone="sucessDone"></confirm>
        <Modal v-model="addShow" :mask-closable="false" :title="roomTitle" width=600 @on-cancel="roomCancel">
            <Form :model="formItem" :label-width="120" ref="formItem" :rules="ruleForm">
                <FormItem label="房型名称：" prop="name">
                    <Input v-model="formItem.name" :maxlength="15" style="width:300px;"></Input>
                </FormItem>
                <FormItem label="前台默认价：" prop="commonPrice">
                    <Input v-model="formItem.commonPrice" number style="width:100px;margin-right:20px;" :maxlength="8" @on-keyup="keyupNumber">
                    <span style="margin-top:8px;display:inline-block;" slot="prefix">￥</span>
                    </Input>
                    <Checkbox v-model="single">周末价与平日价不同</Checkbox>

                </FormItem>
                <div v-if="single" class="weeks">
                    <div v-for="(item,index) in weekPrice" :key="index">
                        <p>{{item.week | weeks}}</p>
                        <p>
                            <Input v-model="item.price" @on-keyup="weeksNumber" :maxlength="8" style="width:80%">
                            </Input>
                        </p>
                    </div>

                </div>
                <FormItem label="房间号：">
                    <div class="roomNum">
                        <div v-for="(item,i) in rooms" :key="i" class="room-inp">
                            <Input v-model="item.roomNo" style="width:80px;" :maxlength="8"></Input>
                            <Icon class="icon-del" type="ios-close-circle" @click="del(i)" />
                        </div>
                        <div class="btn-room" v-if="rooms.length<=300" @click="add">+添加房间号</div>
                    </div>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button type="primary" @click="submit">保存</Button>
            </div>
        </Modal>
        <Modal v-model="show" :mask-closable="false" title="隐藏/显示房间" width=700>
            <Tabs size="small" value="name1" :animated="false">
                <TabPane label="隐藏房间" name="name1">
                    <div class="text-bg">以下是已隐藏的房间号，可选择取消隐藏或彻底删除该房间。取消隐藏后，房态页会恢复显示；彻底删除则不可恢复！</div>

                </TabPane>
                <TabPane label="显示房间" name="name2">
                    <div class="text-bg">以下是已隐藏的房间号，可选择取消隐藏或彻底删除该房间。取消隐藏后，房态页会恢复显示；彻底删除则不可恢复！</div>
                    标签二的内容
                </TabPane>
            </Tabs>
            <div slot="footer">
                <Button type="primary" @click="save">确认</Button>
            </div>
        </Modal>
        <Modal v-model="priceShow" :mask-closable="false" title="批量设置特殊价" width=800 @on-cancel="cancel">
            <div class="clearfix">

                <div class="fl" style="width:20%;border:1px solid #ccc;height:350px;padding-top:20px;border-right:0;max-height:350px;overflow-y:auto;">
                    <Tree :data="data2" show-checkbox @on-check-change="specialPrice"></Tree>
                </div>
                <div class="fr" style="width:80%;height:350px;border:1px solid #ccc;padding-top:20px;padding-left:20px;">
                    <Form :model="formPriceItem" ref="formPriceItem" :rules="ruleFormPrice">
                        <FormItem label="时间范围：" prop="rulestartDate">
                            <DatePicker @on-change='setBegDate' :options="startOption" v-model="formPriceItem.rulestartDate" type="date" format="yyyy-MM-dd"></DatePicker>
                            <span>至</span>
                            <DatePicker @on-change='setEndDate' :options="endOption" v-model="formPriceItem.ruleendDate" type="date" format="yyyy-MM-dd"></DatePicker>
                        </FormItem>
                        <FormItem label="适用星期：" prop="weekDay">
                            <CheckboxGroup v-model="formPriceItem.weekDay">
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
                            <div class="newtable" style="max-height:213px;overflow-y:auto;">
                                <table class="table">
                                    <tr>
                                        <th>房型名称</th>
                                        <th>特殊价</th>
                                    </tr>
                                    <tr v-for="(item,index) in formPriceItem.specialData" :key="index">
                                        <td class="table-label">{{item.title}}</td>
                                        <td>
                                            <FormItem :show-message="index==0" :prop="'specialData.'+ index +'.price'" :rules="[{required: true, type:'number', message:'请填写价格'},{type:'number',max: 99999, message: '数值不能大于99999'}]">
                                                <Input v-model="item.price" number :maxlength="8">
                                                <span style="margin-top:8px;display:inline-block;" slot="prefix">￥</span>
                                                </Input>
                                            </FormItem>
                                        </td>
                                    </tr>

                                </table>
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" @click="save">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { apiPost, apiGet } from "@/fetch/api";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
export default {
  components: {
    gridTable,
    confirm
  },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value > 99999) {
        callback(new Error("最大值99999"));
      } else {
        callback();
      }
    };
    return {
      weekPrice: [
        {
          week: 1,
          price: ""
        },
        {
          week: 2,
          price: ""
        },
        {
          week: 3,
          price: ""
        },
        {
          week: 4,
          price: ""
        },
        {
          week: 5,
          price: ""
        },
        {
          week: 6,
          price: ""
        },
        {
          week: 7,
          price: ""
        }
      ],
      data2: [
        {
          title: "房型全选",
          expand: true,
          checked: false,
          children: [
            // {
            //   id: "",
            //   title: "大床房",
            //   price: "280",
            //   expand: true
            // },
            // {
            //   id: "",
            //   title: "标准间",
            //   price: "210",
            //   expand: true
            // }
          ]
        }
      ],
      columns: [
        {
          title: "房型名称",
          key: "name"
        },
        {
          title: "房间数",
          key: "num"
        },
        {
          title: "房间号",
          key: "rooms"
        },
        {
          title: "前台默认价格",
          key: "commonPrice",
          renderHeader: (h, params) => {
            return h("div", [
              h("span", params.column.title),
              h(
                "a",
                {
                  style: {
                    marginLeft: "15px",
                    textDecoration: "underline"
                  },
                  on: {
                    click: () => {
                      apiPost(
                        "/manage/product/webApi/hoteltype/listHotelType?hotelMerchantId=" +
                          localStorage.getItem("hotelMerchantId")
                      ).then(res => {
                        if (res.status == 200) {
                          this.data2[0].children = [];
                          let obj = {};
                          res.data.forEach(ele => {
                            obj = {
                              expand: true,
                              title: ele.name,
                              hotelTypeId: ele.id,
                              price: ""
                            };
                            this.data2[0].children.push(obj);
                          });
                        }
                      });
                      this.priceShow = true;
                    }
                  }
                },

                "设置特殊价格"
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "修改",
                action: () => {
                  apiPost(
                    "/manage/product/webApi/hoteltype/getHotelType?id=" +
                      params.row.id
                  ).then(res => {
                    if (res.status == 200) {
                      this.addShow = true;
                      this.roomTitle = "修改房型";
                      this.rooms = res.data.hotelRooms;
                      this.formItem.id = res.data.id;
                      this.formItem.name = res.data.name;
                      this.formItem.code = res.data.code;
                      this.formItem.isWeekPrice = res.data.isWeekPrice;
                      this.formItem.commonPrice = +res.data.commonPrice;

                      if (res.data.isWeekPrice == "T") {
                        this.single = true;
                      }
                      if (res.data.weekPrice.length) {
                        this.weekPrice.forEach(ele => {
                          res.data.weekPrice.forEach(item => {
                            if (ele.week == item.week) {
                              ele.price = item.price;
                            }
                          });
                        });
                      }
                    }
                  });
                }
              },
              {
                title: "删除",
                action: () => {
                  this.content = "确定删除？";
                  this.mode = "done";
                  this.sucessMsg = "删除成功！";
                  this.$refs.confirmModel.confirm(
                    "/manage/product/webApi/hoteltype/delete?id=" +
                      params.row.id
                  );
                }
              }
            ];
            if (params.row.hierarchy === 3) {
              actions.splice(0, 1);
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
        order: "desc",
        hotelMerchantId: localStorage.getItem("hotelMerchantId")
      },
      url: "/manage/product/webApi/hoteltype/grid",
      content: "",
      mode: "",
      sucessMsg: "",
      addShow: false,
      show: false,
      priceShow: false,
      roomTitle: "新增房型",
      formItem: {
        name: "",
        commonPrice: null,
        rooms: "",
        hotelMerchantId: localStorage.getItem("hotelMerchantId"),
        weekPriceStr: ""
      },
      single: false,
      rooms: [{ roomNo: "", listOrder: "", enabled: "" }],
      ruleForm: {
        name: [{ required: true, message: "请填写房型名称", trigger: "blur" }],
        commonPrice: [
          {
            required: true,
            type: "number",
            message: "请填写前台默认价",
            trigger: "blur"
          },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: "请输入正确的金额"
          },
          {
            validator: validateNum,
            message: "数值不能大于99999"
          }
        ]
      },
      startOption: {
        disabledDate(date) {
          return (
            date &&
            date.valueOf() <
              new Date(new Date(new Date().toLocaleDateString()).getTime())
          );
        }
      },
      endOption: {
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

      formPriceItem: {
        specialData: [],
        rulestartDate: new Date(),
        ruleendDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ),
        startDate: null,
        endDate: null,
        weekDays: "",
        weekDay: ["1", "2", "3", "4", "5", "6", "7"],
        hotelPricestr: "",
        hotelMerchantId: localStorage.getItem("hotelMerchantId")
      },
      ruleFormPrice: {
        rulestartDate: [
          {
            required: true,
            type: "date",
            message: "请选择日期",
            trigger: "change"
          }
        ],
        weekDay: [
          {
            required: true,
            type: "array",
            message: "请选择星期",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    single(val, oldVal) {
      if (this.roomTitle == "新增房型") {
        this.weekPrice.forEach(item => {
          item.price = this.formItem.commonPrice;
        });
      }
    }
  },
  created() {
    this.setBegDate(this.getCurDate());
  },
  methods: {
      sucessDone(){
          this.$refs.gridTable.loadpage()
      },
    //获取今天日期
    getCurDate() {
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
      return currentdate;
    },
    keyupNumber() {
      if (this.formItem.commonPrice.length) {
        this.formItem.commonPrice = this.formItem.commonPrice.replace(
          /[^\.\d]/g,
          ""
        );
      }
    },
    weeksNumber() {
      this.weekPrice.forEach(item => {
        item.price = item.price.replace(/[^\.\d]/g, "");
        item.price = item.price > 99999 ? "" : item.price;
      });
    },
    cancel() {
      this.$refs.formPriceItem.resetFields();
      this.formPriceItem.specialData = [];

      this.data2[0].checked = false;
      this.data2[0].children.forEach(item => {
        item.checked = false;
      });

      this.formPriceItem.rulestartDate = this.getCurDate();
      this.formPriceItem.ruleendDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );
      this.setBegDate(this.formPriceItem.rulestartDate);
      this.setEndDate(this.formPriceItem.ruleendDate);
    },
    roomCancel() {
      this.$refs.formItem.resetFields();
      this.rooms = [];
      this.single = false;
    },
    addRoom() {
      this.addShow = true;
      this.roomTitle = "新增房型";
      this.formItem.id = "";
      this.formItem.code = "";
    },
    specialPrice(item) {
      let arr = [],
        obj = {};
      console.log(item);
      item.forEach(ele => {
        if (ele.title != "房型全选") {
          obj = {
            hotelTypeId: ele.hotelTypeId,
            price: ele.price,
            title: ele.title
          };
          arr.push(obj);
        }
      });
      this.formPriceItem.specialData = arr;
    },
    dateAdd(startDate, num) {
      startDate = new Date(startDate);
      startDate = +startDate + 1000 * 60 * 60 * 24 * (num ? num : 1);
      startDate = new Date(startDate);
      let year = startDate.getFullYear();
      let mouth =
        (startDate.getMonth() + 1).toString().length === 1
          ? "0" + (startDate.getMonth() + 1).toString()
          : startDate.getMonth() + 1;
      let day =
        startDate.getDate().toString().length === 1
          ? "0" + startDate.getDate()
          : startDate.getDate();

      var nextStartDate = year + "-" + mouth + "-" + day;
      return nextStartDate;
    },
    setBegDate(time) {
      if (time) {
        this.formPriceItem.startDate = time;
        if (time > this.formPriceItem.endDate) {
          this.$Message.warning("开始时间不能大于结束时间");
          this.formPriceItem.ruleendDate = time;
        }
        // 重置结束时间规则
        let subtime = new Date(
          new Date(time).getFullYear(),
          new Date(time).getMonth() + 3,
          new Date(time).getDate()
        ).valueOf();
        this.endOption = {
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
        this.endOption = {
          disabledDate(date) {
            return false;
          }
        };
      }

      // 先选择结束时间再次选择开始时间大于结束，将结束时间置空
      //   if (
      //     this.endDate &&
      //     new Date(time).valueOf() > new Date(this.endDate).valueOf()
      //   ) {
      //     this.endDate = null;
      //   }
    },
    setEndDate(time) {
      if (time) {
        this.formPriceItem.endDate = time;
        let endTime = time ? new Date(time).valueOf() : "";
        this.startOption = {
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
        this.startOption = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    add() {
      this.rooms.push({ roomNo: "", listOrder: "", enabled: "T" });
    },
    del(i) {
      this.rooms.splice(i, 1);
    },
    GMTToStr(time) {
      let date = new Date(time);
      let Str =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return Str;
    },
    save() {
      let _this = this;
      if (this.formPriceItem.weekDay) {
        this.formPriceItem.weekDays = this.formPriceItem.weekDay.join(",");
      }
      if (this.formPriceItem.specialData) {
        this.formPriceItem.hotelPricestr = JSON.stringify(
          this.formPriceItem.specialData
        );
      }
      if (
        this.formPriceItem.startDate == null &&
        this.formPriceItem.rulestartDate
      ) {
        this.formPriceItem.startDate = this.GMTToStr(
          this.formPriceItem.rulestartDate
        );
      }

      if (
        this.formPriceItem.endDate == null &&
        this.formPriceItem.ruleendDate
      ) {
        this.formPriceItem.endDate = this.GMTToStr(
          this.formPriceItem.ruleendDate
        );
      }
      this.formPriceItem.endDate =
        this.formPriceItem.ruleendDate.getFullYear() +
        "-" +
        (this.formPriceItem.ruleendDate.getMonth() + 1) +
        "-" +
        this.formPriceItem.ruleendDate.getDate();
      console.log(this.formPriceItem);
      //   this.formPriceItem.startDate=this.startDate
      //   this.formPriceItem.endDate=this.endDate
      //   delete this.formPriceItem.weekDay;
      if (_this.formPriceItem.specialData.length) {
        this.$refs.formPriceItem.validate(async vaild => {
          if (vaild) {
            let url = "/manage/product/webApi/hoteltype/saveSpecialPrice";
            let res = await apiPost(url, this.formPriceItem);
            if (res.status == 200) {
              _this.$Message.success(res.message);
              _this.priceShow = false;
              _this.$refs.gridTable.loadpage();
              _this.formPriceItem.specialData = [];
              _this.data2[0].checked = false;
              _this.data2[0].children.forEach(item => {
                item.checked = false;
              });
              _this.formPriceItem.rulestartDate = _this.getCurDate();
              _this.formPriceItem.ruleendDate = new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              );
              _this.setBegDate(this.formPriceItem.rulestartDate);
              _this.setEndDate(this.formPriceItem.ruleendDate);
              _this.formPriceItem.weekDay = ["1", "2", "3", "4", "5", "6", "7"];
            } else {
              _this.$Message.warning(res.message);
            }
          }
        });
      } else {
        _this.$Message.warning("请至少选择一种房型");
      }
    },
    submit() {
      let _this = this;
      this.formItem.isWeekPrice = this.single ? "T" : "F";
      if (this.rooms) {
        this.formItem.rooms = JSON.stringify(this.rooms);
      }
      if (this.single) {
        this.formItem.weekPriceStr = JSON.stringify(this.weekPrice);
      }
      this.formItem.hotelMerchantId = localStorage.getItem("hotelMerchantId");
      let url = "/manage/product/webApi/hoteltype/save";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback(res) {
          if (res.status == 200) {
            _this.$Message.success(res.message);
            _this.addShow = false;
            _this.$refs.gridTable.loadpage();
            _this.single = false;
            _this.formItem.isWeekPrice = "F";
            _this.rooms = [];
            _this.formItem.commonPrice = null;
            _this.formItem.name = "";
            _this.formItem.id = "";
            _this.formItem.code = "";
          } else {
            _this.$router.warning(res.message);
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.houseType {
}
.roomNum {
  width: 340px;
  max-height: 300px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .btn-room {
    width: 94px;
    border: 1px solid #ccc;
    text-align: center;
    display: inline-block;
    height: 32px;
    cursor: pointer;
    //   margin-left:10px;
    margin-top: 10px;
  }
  .room-inp {
    width: 75px;
    height: 32px;
    margin-right: 20px;
    margin-top: 10px;
    display: inline-block;
    position: relative;
    .icon-del {
      display: none;
      font-size: 16px;
      color: #eb3941;
      position: absolute;
      top: -5px;
      right: -11px;
      cursor: pointer;
    }
    &:hover .icon-del {
      display: block;
    }
  }
}
.text-bg {
  background-color: #e4f2ff;
  height: 34px;
  line-height: 34px;
  text-indent: 20px;
  color: #728ebd;
  margin-top: -13px;
}
.weeks {
  width: 95%;
  padding: 20px 5px;
  margin: 20px 0;
  background-color: #f5f7fa;
  display: flex;
  justify-content: space-between;
  text-align: center;
}
</style>


