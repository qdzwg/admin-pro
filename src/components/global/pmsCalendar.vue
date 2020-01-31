<template>
  <div class="calendar-panel">
    <div class="calendar-head">
      <ul>
        <li>
          <a href="javascript:void(0);" @click="prevM">
            <Icon type="ios-arrow-back"></Icon>
            {{nowMonth||12}}月
          </a>
        </li>
        <li></li>
        <li>
          {{nowYear}}年{{nowMonth + 1}}月
          <!-- <Checkbox v-model="checkAll"
          @on-change="checkAllChange">全选</Checkbox>-->
        </li>
        <li></li>
        <li>
          <a href="javascript:void(0);" @click="nextM">
            {{nowMonth==11?1:nowMonth + 2}}月
            <Icon type="ios-arrow-forward"></Icon>
          </a>
        </li>
      </ul>
    </div>
    <div class="calendar-contnet-pms">
      <table class="calendar-table">
        <tr>
          <th>
            <!-- <Checkbox v-model="sundayCheckAll"
            @on-change="headAllChange($event,0)">日</Checkbox>-->
            日
          </th>
          <th>
            <!-- <Checkbox v-model="mondayCheckAll"
            @on-change="headAllChange($event,1)">一</Checkbox>-->
            一
          </th>
          <th>
            <!-- <Checkbox v-model="tuesdayCheckAll"
            @on-change="headAllChange($event,2)">二</Checkbox>-->
            二
          </th>
          <th>
            <!-- <Checkbox v-model="wednesdayCheckAll"
            @on-change="headAllChange($event,3)">三</Checkbox>-->
            三
          </th>
          <th>
            <!-- <Checkbox v-model="thursdayCheckAll"
            @on-change="headAllChange($event,4)">四</Checkbox>-->
            四
          </th>
          <th>
            <!-- <Checkbox v-model="fridayCheckAll"
            @on-change="headAllChange($event,5)">五</Checkbox>-->
            五
          </th>
          <th>
            <!-- <Checkbox v-model="saturdayCheckAll"
            @on-change="headAllChange($event,6)">六</Checkbox>-->
            六
          </th>
        </tr>
        <tr v-for="index in row" :key="index">
          <td
            v-for="item in 7"
            :key="item"
            @click.stop="cellHandle(dayNum[7*(index-1)+(item-1)]._isDisabled,7*(index-1)+(item-1),item)"
          >
            <div
              v-if="dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._isShow"
              :class="dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._isDisabled?'disabled':''"
            >
              <span>
                {{dayNum[7*(index-1)+(item-1)]._day}}
                <!-- <Checkbox :value="dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._ischecked"
                v-if="!(dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._isDisabled)"></Checkbox>-->
              </span>
              <p
                class="calendar-explian"
                v-if="!(dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._isDisabled)"
              >
                <span v-for="eitem in extend" :key="eitem.key">
                  {{eitem.title}}：
                  <template v-if="eitem.render">
                    <renderItem :render="eitem.render" :column="dayNum[7*(index-1)+(item-1)]"></renderItem>
                    <br />
                  </template>
                  <template v-else>
                    <b>{{dayNum[7*(index-1)+(item-1)][eitem.key]}}</b>
                  </template>
                </span>
              </p>
            </div>
            <Poptip
              class="tip-box"
              transfer
              v-model="dayNum[7*(index-1)+(item-1)].popShow"
              placement="bottom"
            >
              <!-- <div slot="title"></div> -->
              <div class="api" slot="content">
                <div class="title">
                  私享库存：
                  <Input
                    :maxlength="5"
                    number
                    v-model="dayNum[7*(index-1)+(item-1)].privateStock"
                    style="width:100px;"
                  ></Input>
                </div>
                <div class="title">
                  共享库存：
                  <Input
                    :maxlength="5"
                    number
                    v-model="dayNum[7*(index-1)+(item-1)].publicStock"
                    style="width:100px;"
                  ></Input>
                </div>

                <div class="clearfix" style="margin-top:10px">
                  <Button
                    class="fl"
                    @click.stop="saveStorePrice([7*(index-1)+(item-1)])"
                    size="small"
                    type="primary"
                  >保存</Button>
                  <Button
                    class="fr"
                    @click.stop="cancelStorePrice([7*(index-1)+(item-1)])"
                    size="small"
                  >取消</Button>
                </div>
              </div>
            </Poptip>
          </td>
        </tr>
      </table>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>
<script>
import renderItem from "./renderItem";
export default {
  data() {
    return {
      checkAll: false,
      sundayCheckAll: false,
      mondayCheckAll: false,
      tuesdayCheckAll: false,
      wednesdayCheckAll: false,
      thursdayCheckAll: false,
      fridayCheckAll: false,
      saturdayCheckAll: false,
      dateList: [],
      dayNum: [],
      row: 0,
      nowYear: new Date().getFullYear(),
      nowMonth: new Date().getMonth(),
      today:
        new Date().getFullYear() +
        "-" +
        this.p(new Date().getMonth() + 1) +
        "-" +
        this.p(new Date().getDate()),
      spinShow: true
    };
  },
  components: {
    renderItem
  },
  props: {
    action: {
      type: String
    },
    param: {
      type: Object
    },
    extend: {
      type: Array
    },
    list: {
      type: Object
    },
    popShow:{
        type:Boolean
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
    //   console.log(this.param);
      this.getMonthDays(this.nowYear, this.nowMonth);
    },
    async getMonthDays(year, month) {
      this.sundayCheckAll = false;
      this.mondayCheckAll = false;
      this.tuesdayCheckAll = false;
      this.wednesdayCheckAll = false;
      this.thursdayCheckAll = false;
      this.fridayCheckAll = false;
      this.saturdayCheckAll = false;
      this.checkAll = false;
      let newDate = new Date(year, month, 1);
      let monthDays = new Date(year, month + 1, 0).getDate();
      let tatalDays = Math.ceil((newDate.getDay() + monthDays) / 7) * 7;
      let array = [];
      this.row = Math.ceil((newDate.getDay() + monthDays) / 7);
      for (let i = 0; i < tatalDays; i++) {
        let day = i - newDate.getDay() + 1;
        let date = year + "-" + this.p(month + 1) + "-" + this.p(day);
        let _isShow = false;
        let _isDisabled = false;
        if (newDate.getDay() > i) {
          day = i - newDate.getDay() + 1 + new Date(year, month, 0).getDate();
          let prevMonth = month === 0 ? 12 : month;
          let prevYear = month === 0 ? year - 1 : year;
          date = prevYear + "-" + this.p(prevMonth) + "-" + this.p(day);
          _isDisabled = true;
        } else if (monthDays + newDate.getDay() - 1 < i) {
          day = i - newDate.getDay() + 1 - monthDays;
          date = year + "-" + this.p(month + 2) + "-" + this.p(day);
          _isDisabled = true;
        } else {
          _isShow = true;
          if (this.today > date) {
            _isDisabled = true;
          } else {
            _isDisabled = false;
          }
        }
        array[i] = {
          date,
          _day: day,
          _isShow,
          _isDisabled,
          _ischecked: false,
          popShow: false
        };
        //判断原先是否有保存过数据
        if (this.param && this.param.dateList && this.param.dateList.length) {
          let dateItem = this.param.dateList.find(
            item => date == item.stockDate
          );
          if (dateItem) {
            array[i] = Object.assign(array[i], dateItem);
          } else {
            array[i] = Object.assign(array[i], this.list);
          }
        } else {
          array[i] = Object.assign(array[i], this.list);
        }
      }
      this.spinShow = true;
      if (this.action) {
        let param = {
          stockDate: year + "-" + (month + 1)
        };
        let res = await this.apiGet(
          this.action,
          Object.assign(param, this.param)
        );
        // console.log(array)
        // console.log(res.data)
        if(res.data&&res.data.length){
            array.forEach((item, index) => {
          res.data.forEach(element => {
            if (item.date === element.stockDate.substring(0,10)) {
              item = Object.assign(item, element);
            }
          });
        });
        }
        
      }
      this.spinShow = false;
    //   console.log(array);
      this.dayNum = array;
      // if (this.list) {
      //   this.dayNum.forEach(item => {
      //     item = Object.assign(item, this.list);
      //   });
      // }

      //   this.$emit('getCheckInfo', this.getCheckInfo())
    },
    prevM() {
      this.nowMonth--;
      if (this.nowMonth < 0) {
        this.nowMonth = 11;
        this.nowYear--;
      }
      this.getMonthDays(this.nowYear, this.nowMonth);
    },
    nextM() {
      this.nowMonth++;
      if (this.nowMonth > 11) {
        this.nowMonth = 0;
        this.nowYear++;
      }
      this.getMonthDays(this.nowYear, this.nowMonth);
    },
    p(num) {
      return num < 10 ? "0" + num : num;
    },
    cellHandle(flag, index, column) {
      if (flag) return;
      //   let weekcheckeds = ['sundayCheckAll', 'mondayCheckAll', 'tuesdayCheckAll', 'wednesdayCheckAll', 'thursdayCheckAll', 'fridayCheckAll', 'saturdayCheckAll']
      //   let columncheck = true
      //   this.dayNum[index]._ischecked = !this.dayNum[index]._ischecked
      //   this.dayNum.forEach((element, num) => {
      //     if (num % 7 === (column - 1) && !element._isDisabled) {
      //       if (!element._ischecked) {
      //         columncheck = false
      //       }
      //     }
      //   })
      //   this[weekcheckeds[column - 1]] = columncheck
      //   this.setCheckAll()
      //   this.$emit('getCheckInfo', this.getCheckInfo())

      //   this.$emit('getCheckInfo', this.dayNum[index])
    if(this.param.differType=='inventory'){
         this.dayNum.forEach(ele=>{
             ele.popShow=false
         })
         this.dayNum[index].popShow = true;
    }
     
      //  this.$set(this.dayNum,this.dayNum[index],index)
    },
    saveStorePrice(i) {
      let obj = {
        stockDate: this.dayNum[i].date,
        publicStock: this.dayNum[i].publicStock,
        privateStock: this.dayNum[i].privateStock,
        hotelTypeId: this.dayNum[i].hotelTypeId,
        // hotelMerchantId: localStorage.getItem("hotelMerchantId")
      };
      // console.log(obj)
    
      this.$emit("getCheckInfo", obj, this.dayNum[i]);

        // this.dayNum[i].popShow = this.popShow;
      // this.apiPost("/manage/hotel/webApi/hotelNotify/saveDateStock", obj).then(
      //   res => {x
      //     if (res.status == 200) {
      //       this.$Message.success("操作成功");
      //       this.$emit("getCheckInfo", this.dayNum[i]);
      //       this.dayNum[i].popShow = false;
      //     } else {
      //       this.$Message.success(res.message);
      //     }
      //   }
      // );
    },
    cancelStorePrice(i) {
      this.dayNum[i].popShow = false;
    },
    checkAllChange(value) {
      this.sundayCheckAll = value;
      this.mondayCheckAll = value;
      this.tuesdayCheckAll = value;
      this.wednesdayCheckAll = value;
      this.thursdayCheckAll = value;
      this.fridayCheckAll = value;
      this.saturdayCheckAll = value;
      this.dayNum.forEach(element => {
        if (!element._isDisabled) {
          element._ischecked = value;
        }
      });
      //   this.$emit('getCheckInfo', this.getCheckInfo())
    },
    headAllChange(value, num) {
      let weekcheckeds = [
        "sundayCheckAll",
        "mondayCheckAll",
        "tuesdayCheckAll",
        "wednesdayCheckAll",
        "thursdayCheckAll",
        "fridayCheckAll",
        "saturdayCheckAll"
      ];
      this.dayNum.forEach((element, index) => {
        if (index % 7 === num && !element._isDisabled) {
          element._ischecked = value;
        }
      });
      this[weekcheckeds[num]] = value;
      this.setCheckAll();
      //   this.$emit('getCheckInfo', this.getCheckInfo())
    },
    reload() {
      this.init();
    },
    setCheckAll() {
      if (
        this.sundayCheckAll &&
        this.mondayCheckAll &&
        this.tuesdayCheckAll &&
        this.wednesdayCheckAll &&
        this.thursdayCheckAll &&
        this.fridayCheckAll &&
        this.saturdayCheckAll
      ) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    getCheckInfo() {
      let array = [];
      let datalist = JSON.parse(JSON.stringify(this.dayNum));
      datalist.forEach(element => {
        if (!element._isDisabled && element._ischecked) {
          delete element._ischecked;
          delete element._isDisabled;
          delete element._isShow;
          delete element._day;
          array.push(element);
        }
      });
      return array;
    }
  }
};
</script>
<style>
.calendar-panel {
  position: relative;
}
.calendar-table {
  width: 100%;
  border-collapse: collapse;
}
.calendar-table th {
  height: 40px;
  background-color: #f8f8f9;
  border: 1px solid #e9eaec;
  text-align: center;
  width: 14%;
}
.calendar-table td {
  border: 1px solid #e9eaec;
  padding: 10px;
  vertical-align: top;
  height: 75px;
}
.calendar-table td .tip-box {
  display: block;
}
.calendar-table td .tip-box .ivu-poptip-rel {
  display: block;
  /*  height: 30px;
              line-height: 30px; */
  cursor: pointer;
}
.calendar-table td .tip-box .title {
  font-size: 14px;
  margin-bottom: 10px;
}
.calendar-table td .disabled {
  color: #a0a0a0;
}
</style>
