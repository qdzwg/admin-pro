<template>
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header :current-month="currentMonth"
      :first-day="firstDay"
      :locale="locale"
      @change="emitChangeMonth">

      <div slot="header-left">
        <slot name="fc-header-left">
        </slot>
      </div>

      <div slot="header-right">
        <slot name="fc-header-right">
        </slot>
      </div>
      <div class="selectAll" slot="selectAll">
        <slot name="fc-select-All">
          
        </slot>
      </div>
    </fc-header>
    <!-- body display date day and events -->
    <div class="full-calendar-body">
       <CheckboxGroup @on-change="selectWeekDayList" v-model="weekSelect">
      <div class="weeks">
        
              <strong class="week" v-for="dayIndex in 7" :key="dayIndex"> <Checkbox :label="dayIndex">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</Checkbox></strong>
        
      </div>
       </CheckboxGroup>
      
      <div class="dates" ref="dates">
        <!-- {{social}} -->
        <div class="dates-bg">
            <CheckboxGroup v-model="social">
              <div class="week-row" v-for="(week,index) in currentDates" :key="index">
                <div class="day-cell" v-for="(day,index) in week"
                  :key="index"
                  :class="{'today' : day.isToday,
                  'not-cur-month' : !day.isCurMonth||!day.isAllowSet}">
                  <p class="day-number">{{ day.isToday?"今天":day.monthDay }}<Checkbox v-if="day.isCurMonth&&day.isAllowSet"  :label="formattrDay(day.date)" class="dayCheck"><span> </span></Checkbox></p>
                  <div v-if="day.isCurMonth&&day.isAllowSet" class="dayInfoDetail">
                    <div>零：{{day.dateData.salePrice}}</div>
                    <div>分：--</div>
                    <div>库存：{{day.dateData.stockModel=='unlimit'?'无限库存':''}}</div>
                  </div>
                </div>
              </div>
          </CheckboxGroup>
        </div>
        <!-- absolute so we can make dynamic td -->
        <!-- <div class="dates-events">
          <div class="events-week" v-for="(week,index) in currentDates" :key="index">
            <div class="events-day" v-for="(day,index) in week" :key="index" track-by="$index"
                 :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth}" @click.stop="dayClick(day.date, $event)">
              <p class="day-number">{{day.monthDay}}</p>
              <div class="event-box">
                <event-card :event="event" :date="day.date" :firstDay="firstDay" v-for="(event,index) in day.events" :key="index" v-show="event.cellIndex <= eventLimit" @click="eventClick">
                  <template slot-scope="p">
                    <slot name="fc-event-card" :event="p.event"></slot>
                  </template>
                </event-card>
                <p v-if="day.events.length > eventLimit"
                   class="more-link" @click.stop="selectThisDay(day, $event)">
                  + {{day.events[day.events.length -1].cellIndex - eventLimit}} more
                </p>
              </div>
            </div>
          </div>
        </div> -->

        <!-- full events when click show more -->
        <!-- <div class="more-events" v-show="showMore"
             :style="{left: morePos.left + 'px', top: morePos.top + 'px'}">
          <div class="more-header">
            <span class="title">{{ moreTitle(selectDay.date) }}</span>
            <span class="close" @click.stop="showMore = false">x</span>
          </div>
          <div class="more-body">
            <ul class="body-list">
              <li v-for="(event,index) in selectDay.events"
                :key="index"
                  v-show="event.isShow" class="body-item"
                  @click="eventClick(event, $event)">
                {{event.title}}
              </li>
            </ul>
          </div>
        </div> -->

        <slot name="body-card">

        </slot>

      </div>
    </div>
  </div>
</template>
<script type="text/babel">
// import langSets from './dataMap/langSets'
import dateFunc from "./components/dateFunc.js";
import moment from "moment";
import EventCard from "./components/eventCard.vue";
import fcHeader from "./components/header";
import { apiPost } from "@/fetch/api";
export default {
  props: {
    locale: {
      type: String,
      default: "en"
    },
    firstDay: {
      type: Number | String,
      validator(val) {
        let res = parseInt(val);
        return res >= 0 && res <= 6;
      },
      default: 0
    }
  },
  components: {
    "event-card": EventCard,
    "fc-header": fcHeader
  },
  mounted() {
    this.emitChangeMonth(moment().startOf("month"));
  },
  data() {
    return {
      currentDates:[],
      dateDataList: [],
      weekSelect: [],
      social: [],
      weekList: [], //周一到周日对应的日期
      test: true,
      single: null,
      currentMonth: null, // 获取本月第一天
      isLismit: true,
      eventLimit: 3,
      showMore: false,
      morePos: {
        top: 0,
        left: 0
      },
      selectDay: {}
    };
  },

  computed: {
    // currentDates() {
    //   return this.getCalendar();
    // }
  },

  watch:{
    "currentMonth":"getCalendar"
  },

  methods: {
    selectAll(flag) {
      if (flag) {
        // 全选
        this.social = this.weekList.toString().split(",");
        this.weekSelect = [1, 2, 3, 4, 5, 6, 7];
      } else {
        this.social = [];
        this.weekSelect = [];
      }
    },
    selectWeekDayList() {
      // console.log(this.weekList)
      let arr = [];
      for (var i = 0; i < this.weekSelect.length; i++) {
        arr = arr.concat(this.weekList[this.weekSelect[i] - 1]);
      }
      // console.log(arr)
      this.social = arr;
    },
    formattrDay(date) {
      return date.format("YYYY-MM-DD");
    },
    selectCheck(flag) {},
    checkCon() {
      // console.log(this.$refs.checks)
    },
    emitChangeMonth(firstDayOfMonth) {
      this.$emit("changeSelectAll");
      this.weekSelect = [];
      this.social = [];
      this.currentMonth = firstDayOfMonth;

      let start = dateFunc.getMonthViewStartDate(
        firstDayOfMonth,
        this.firstDay
      );
      let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay);

      this.$emit("changeMonth", start, end, firstDayOfMonth);
    },
    moreTitle(date) {
      if (!date) return "";
      return moment(date).format("ll");
    },
    getCalendar() {
      this.weekList = [];
      let _this = this;
      // calculate 2d-array of each month
      let monthViewStartDate = dateFunc.getMonthViewStartDate(
        this.currentMonth,
        this.firstDay
      );
      let calendar = [];
      apiPost("product/productPriceStockCalendar/getCalendar", {
        ticketId: this.$route.params.id,
        modelType: "ticket",
        month: this.currentMonth.format("YYYY-MM")
      }).then(res => {
        for (let perWeek = 0; perWeek < 6; perWeek++) {
          let week = [];

          for (let perDay = 0; perDay < 7; perDay++) {
            if (!_this.weekList[perDay]) {
              _this.weekList[perDay] = [];
            }
            let isCurMonth = monthViewStartDate.isSame(this.currentMonth, "month") //当前日期是否是本月
            let isToday = monthViewStartDate.isSame(moment(), "day") //当前日期是否是本日
            let curDay = moment(monthViewStartDate).format("YYYY-MM-DD") // 格式化当前日期
            let isAllowSet = isToday?true:moment(monthViewStartDate).isAfter(moment()) //当前日期是否是当天及以后
            if (isCurMonth&&isAllowSet) {  //本月并且是今天及以后的日期
              _this.weekList[perDay].push(
                curDay
              ); // 将日期存入对应的星期几数组
            }
            // 过滤接口获取当天的数据
            let dayData = res.find(item=>{
              // console.log(moment(monthViewStartDate).format("YYYY-MM-DD"))
              return item.date === curDay
            })
            week.push({
              isAllowSet:isAllowSet,//是否允许修改,当前日记及以后允许修改
              monthDay: monthViewStartDate.date(),
              isToday: isToday,
              isCurMonth: isCurMonth,
              weekDay: perDay,
              date: moment(monthViewStartDate),
              dateData: dayData?dayData:null
            });

            monthViewStartDate.add(1, "day");
          }

          calendar.push(week);
        }
        // console.log(calendar)
        _this.currentDates = calendar
      });
      
      // console.log(calendar);
      // return calendar;
    },
    filterDate(){

    },
    selectThisDay(day, jsEvent) {
      this.selectDay = day;
      this.showMore = true;
      this.morePos = this.computePos(event.target);
      this.morePos.top -= 100;
      this.$emit("moreClick", day.date, jsEvent);
    },
    computePos(target) {
      let eventRect = target.getBoundingClientRect();
      let pageRect = this.$refs.dates.getBoundingClientRect();
      return {
        left: eventRect.left - pageRect.left,
        top: eventRect.top + eventRect.height - pageRect.top
      };
    },
    dayClick(day, jsEvent) {
      this.$emit("dayClick", day, jsEvent);
    },
    eventClick(event, jsEvent) {
      if (!event.isShow) return;

      jsEvent.stopPropagation();
      let pos = this.computePos(jsEvent.target);
      this.$emit("eventClick", event, jsEvent, pos);
    }
  },
  filters: {
    localeWeekDay(weekday, firstDay, locale) {
      firstDay = parseInt(firstDay);
      const localMoment = moment().locale(locale);
      return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7];
    }
  }
};
</script>
<style  lang="scss">
.dayCheck {
  float: right;
  margin-right: 10px;
}
.dayInfoDetail {
  padding: 5px;
  div {
    padding: 3px;
  }
}
.comp-full-calendar {
  // font-family: "elvetica neue", tahoma, "hiragino sans gb";
  padding: 20px;
  background: #fff;
  // margin: 0 auto;
  ul,
  p {
    margin: 0;
    padding: 0;
  }
}

.full-calendar-body {
  margin-top: 20px;
  .weeks {
    display: flex;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    .week {
      flex: 1;
      text-align: center;
      border-right: 1px solid #e0e0e0;
    }
  }
  .dates {
    position: relative;
    .week-row {
      // width: 100%;
      // position:absolute;
      border-left: 1px solid #e0e0e0;
      display: flex;
      .day-cell {
        flex: 1;
        min-height: 112px;
        padding: 4px;
        border-right: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        .day-number {
          text-align: left;
        }
        &.today {
          background-color: #fcf8e3;
        }
        &.not-cur-month {
          .day-number {
            color: rgba(0, 0, 0, 0.24);
          }
        }
      }
    }
    .dates-events {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      .events-week {
        display: flex;
        .events-day {
          cursor: pointer;
          flex: 1;
          min-height: 112px;
          overflow: hidden;
          text-overflow: ellipsis;
          .day-number {
            text-align: right;
            padding: 4px 5px 4px 4px;
            opacity: 0;
          }
          &.not-cur-month {
            .day-number {
              color: rgba(0, 0, 0, 0.24);
            }
          }
          .event-box {
            .event-item {
              cursor: pointer;
              font-size: 12px;
              background-color: #c7e6fd;
              margin-bottom: 2px;
              color: rgba(0, 0, 0, 0.87);
              padding: 0 0 0 4px;
              height: 18px;
              line-height: 18px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              &.is-start {
                margin-left: 4px;
                // border-top-left-radius:4px;
                // border-bottom-left-radius:4px;
              }
              &.is-end {
                margin-right: 4px;
                // border-top-right-radius:4px;
                // border-bottom-right-radius:4px;
              }
              &.is-opacity {
                opacity: 0;
              }
            }
            .more-link {
              cursor: pointer;
              // text-align: right;
              padding-left: 8px;
              padding-right: 2px;
              color: rgba(0, 0, 0, 0.38);
              font-size: 14px;
            }
          }
        }
      }
    }
    .more-events {
      position: absolute;
      width: 150px;
      z-index: 2;
      border: 1px solid #eee;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      .more-header {
        background-color: #eee;
        padding: 5px;
        display: flex;
        align-items: center;
        font-size: 14px;
        .title {
          flex: 1;
        }
        .close {
          margin-right: 2px;
          cursor: pointer;
          font-size: 16px;
        }
      }
      .more-body {
        height: 146px;
        overflow: hidden;
        .body-list {
          height: 144px;
          padding: 5px;
          overflow: auto;
          background-color: #fff;
          .body-item {
            cursor: pointer;
            font-size: 12px;
            background-color: #c7e6fd;
            margin-bottom: 2px;
            color: rgba(0, 0, 0, 0.87);
            padding: 0 0 0 4px;
            height: 18px;
            line-height: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>