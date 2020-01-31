<template>
  <div>
    <div class="step" v-if="!id">
      <Steps :current="2">
        <Step title="产品类型"></Step>
        <Step title="景区信息"></Step>
        <Step title="门票信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <div id="base" class="form-title">
      基本信息
    </div>
    <base-info ref="ticketRef1"></base-info>
    <div id="senicInfo" class="form-title">预定规则</div>
    <reserve-rule ref="ticketRef2"></reserve-rule>
    <div id="distSet" class="form-title">退改规则</div>
    <return-rule ref="ticketRef3"></return-rule>
    <div style="padding-left:120px">
      <Button type="primary" @click="submit">保存</Button>
      <Button type="ghost" style="margin-left: 8px">取消</Button>
    </div>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="handleScroll('base')"
            >基本信息</a
          >
        </li>
        <li>
          <a
            href="javascript:;"
            class="tartg-a"
            @click="handleScroll('senicInfo')"
            >预定规则</a
          >
        </li>
        <li>
          <a
            href="javascript:;"
            class="tartg-a"
            @click="handleScroll('distSet')"
            >退改规则</a
          >
        </li>
        <li>
          <Button size="small" type="primary" @click="submit">保存</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import baseInfo from "./components/baseInfo";
import reserveRule from "./components/reserveRule";
import returnRule from "./components/returnRule";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: {
    baseInfo,
    reserveRule,
    returnRule
  },
  data() {
    return {
      id: "",
      parkId: ""
    };
  },
  computed: {
    ...mapState("ticket", ["diffValue"]),
    ...mapGetters("ticket", ["getBaseInfo"])
  },
  watch: {
    getBaseInfo: function(val) {
      console.log(val);
    }
  },
  mounted() {},
  methods: {
    ...mapActions("ticket", ["getDiffInfo"]),
    handleScroll(str) {
      let offsetTop = document.getElementById(str).offsetTop;
      let content = document.getElementById("content");
      content.scrollTop = offsetTop - 60;
    },
    // startTimeOpenChange (e, index) {
    //   const tableList = this.formItem.tableList
    //   if (e) {
    //     if (tableList[index].endTime) {
    //       this.dateOptions[index].startTimeOptions = {
    //         disabledDate: date => {
    //           let endTime = new Date(tableList[index].endTime).valueOf()
    //           return date && (date.valueOf() > endTime || date.valueOf() < (Date.now() - 86400000))
    //         }
    //       }
    //     }
    //   }
    // },
    // endTimeOpenChange (e, index) {
    //   const tableList = this.formItem.tableList
    //   if (e) {
    //     if (tableList[index].startTime) {
    //       this.dateOptions[index].endTimeOptions = {
    //         disabledDate: date => {
    //           let startTime = new Date(tableList[index].startTime).valueOf()
    //           return date && (date.valueOf() < startTime)
    //         }
    //       }
    //     }
    //   }
    // },
    async submit() {
      let promiseList = [];
      [1, 2, 3].forEach(item => {
        let refName = "ticketRef" + item;
        promiseList.push(this.$refs[refName].handleSubmit());
      });
      Promise.all(promiseList)
        .then(res => {
          let list = JSON.stringify(res[0].parkTicketPriceJson);
          res[0].parkTicketPriceJson = list;
          let postParams = {
            ...this.diffValue,
            ...res[0],
            ...res[1],
            ...res[2],
            parkId: this.parkId
          };
          if (postParams.extendsParam1 == 1) {
            //双假模式
            postParams.parkTicketPriceJson = null;
          }
          if (this.id) {
            postParams.id = this.id;
            this.apiPost(
              "/product/api/park/api/updateNewTicketFL",
              postParams
            ).then(res => {
              if (res.success) {
                this.$Message.success("修改成功");

                this.$router.push({
                  path: "parkTicket",
                  query: { id: this.id, parkId: this.parkId }
                });
              } else {
                this.$Message.warning(res.message);
              }
            });
          } else {
            this.apiPost(
              "/product/api/park/api/saveParkTicketFL",
              postParams
            ).then(res => {
              if (res.success) {
                this.$Message.success("保存成功");
                this.$router.push({
                  path: "parkTicket",
                  query: { parkId: this.parkId }
                });
              } else {
                this.$Message.warning(res.message);
              }
            });
          }
        })
        .catch(err => {
          this.$nextTick(() => {
            let firstErr = $(".ivu-form-item-error")[0];
            if (firstErr) {
              $("#content").scrollTop(
                $(".ivu-form-item-error").offset().top -
                  90 +
                  $("#content").scrollTop()
              );
            }
          });
        });
      // let _this = this;
      // // 做一个深拷贝，改变数据字段
      // let postParams = JSON.parse(JSON.stringify(this.formItem));
      // postParams.tableList.forEach(element => {
      //   element.weeks = element.weeks.join(",");
      //   element.startTime = this.filter.formatDate(
      //     this.common.changeDate(element.startTime),
      //     "yyyy-MM-dd"
      //   );
      //   element.endTime = this.filter.formatDate(
      //     this.common.changeDate(element.endTime),
      //     "yyyy-MM-dd"
      //   );
      // });
      // postParams.parkTicketPriceJson = JSON.stringify(postParams.tableList);
      // delete postParams.tableList;
    }
  },
  async created() {},
  mounted() {
    // console.log("---mounted----");
    // console.log(this.diffValue);
    // if (!this.id) {
    //   let info = this._initData();
    //   this.getData(info);
    // }
  },
  destroyed() {},
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      //根据id是否有值来判断是新增和修改，以及数据出时尚话
      let id = to.query.id;
      let parkId = to.query.parkId;
      vm.id = id;
      vm.parkId = parkId;
      let info = await vm.getDiffInfo(id);
    });
  }
};
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
.date-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 0;
  .middle {
    padding: 0 6px;
  }
}
.ivu-table-large td {
  height: 120px;
}
</style>
