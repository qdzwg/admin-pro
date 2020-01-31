<template>
  <div class="calendar-panel">
      <!-- {{row}} -->
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
          <Checkbox v-model="checkAll" @on-change="checkAllChange">全选</Checkbox>
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
    <div class="calendar-contnet">
      <table class="calendar-table">
        <tr>
          <th>
            <Checkbox v-model="sundayCheckAll" @on-change="headAllChange($event,0)">日</Checkbox>
          </th>
          <th>
            <Checkbox v-model="mondayCheckAll" @on-change="headAllChange($event,1)">一</Checkbox>
          </th>
          <th>
            <Checkbox v-model="tuesdayCheckAll" @on-change="headAllChange($event,2)">二</Checkbox>
          </th>
          <th>
            <Checkbox v-model="wednesdayCheckAll" @on-change="headAllChange($event,3)">三</Checkbox>
          </th>
          <th>
            <Checkbox v-model="thursdayCheckAll" @on-change="headAllChange($event,4)">四</Checkbox>
          </th>
          <th>
            <Checkbox v-model="fridayCheckAll" @on-change="headAllChange($event,5)">五</Checkbox>
          </th>
          <th>
            <Checkbox v-model="saturdayCheckAll" @on-change="headAllChange($event,6)">六</Checkbox>
          </th>
        </tr>
        <tr v-for="index in row" :key="index">
          <td
            v-for="item in 7"
            :key="item"
            @click="cellHandle(dayNum[7*(index-1)+(item-1)]._isDisabled,7*(index-1)+(item-1),item)"
          >
            <div
              v-if="dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._isShow"
              :class="dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._isDisabled?'disabled':''"
              style="position:relative"
            >
              <span>
                <span>{{dayNum[7*(index-1)+(item-1)]._day}}</span>
                <Checkbox
                  :value="dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._ischecked"
                  v-if="!(dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._isDisabled)"
                  style="margin-left:4px"
                ></Checkbox>
                <span v-if="dayNum[7*(index-1)+(item-1)].date==today">今天</span>
              </span>
              <p
                class="calendar-explian"
                v-if="!(dayNum[7*(index-1)+(item-1)]&&dayNum[7*(index-1)+(item-1)]._isDisabled)"
              >
                <span v-for="(eitem,ind) in extend" :key="eitem.key" :style="{position:ind==1?'absolute':'',top:ind==1?'0':'', right:ind==1?'0':''}">
                  <em v-if="ind!=1" style="display:inline; font-style:normal">{{eitem.title}}：</em>
                  <!-- {{eitem.title}}： -->
                  <template v-if="eitem.render">
                    <renderItem :render="eitem.render" :column="dayNum[7*(index-1)+(item-1)]"></renderItem>
                  </template>
                  <template v-else>
                    <b>{{dayNum[7*(index-1)+(item-1)][eitem.key]}}</b>
                  </template>
                </span>
              </p>
            </div>
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
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
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
          _ischecked: false
        };
      }
      this.spinShow = true;
      if (this.action) {
        let param = {
          month: year + "-" + (month + 1)
        };
        let res = await this.apiPost(
          this.action,
          Object.assign(param, this.param)
        );
        // console.log(res)
        array.forEach((item, index) => {
          res.data.forEach(element => {
            if (item.date === element.date) {
              item = Object.assign(item, element);
            }
          });
        });
      }
      this.spinShow = false;
      // console.log(array)
      this.dayNum = array;
      this.$emit("getCheckInfo", this.getCheckInfo());
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
      console.log(this.dayNum)
      if (flag) return;
      let weekcheckeds = [
        "sundayCheckAll",
        "mondayCheckAll",
        "tuesdayCheckAll",
        "wednesdayCheckAll",
        "thursdayCheckAll",
        "fridayCheckAll",
        "saturdayCheckAll"
      ];
      let columncheck = true;
      this.dayNum[index]._ischecked = !this.dayNum[index]._ischecked;
      this.dayNum.forEach((element, num) => {
        if (num % 7 === column - 1 && !element._isDisabled) {
          if (!element._ischecked) {
            columncheck = false;
          }
        }
      });
      this[weekcheckeds[column - 1]] = columncheck;
      this.setCheckAll();
      this.$emit("getCheckInfo", this.getCheckInfo());
      // console.log(this.dayNum)
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
      this.$emit("getCheckInfo", this.getCheckInfo());
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
      this.$emit("getCheckInfo", this.getCheckInfo());
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
.calendar-table td .disabled {
  color: #a0a0a0;
}
</style>
