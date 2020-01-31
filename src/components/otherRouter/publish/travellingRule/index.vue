<template>
  <div class="travell-rule">
    <div v-if="!id" class="step">
      <Steps :current="2">
        <Step title="产品类型"></Step>
        <Step class="last-step" title="跟团游信息"></Step>
        <Step title="票型信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <baseRule :id="id" ref="rule1">
      <div id="base" class="form-title" slot="title">基本信息</div>
    </baseRule>
    <other-rule ref="rule2">
      <div id="prerule" class="form-title" slot="title1">预定规则</div>
      <div id="checkrule" class="form-title" slot="title2">验证规则</div>
      <div id="returnrule" class="form-title" slot="title3">退改规则</div>
    </other-rule>
    <div class="save-cancel">
      <Button type="primary" @click="submit">保存</Button>
      <Button
        type="ghost"
        v-if="id"
        @click="editGoback"
        style="margin-left: 8px"
        >返回列表</Button
      >
      <Button type="ghost" v-else @click="goback" style="margin-left: 8px"
        >取消</Button
      >
    </div>
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
          <Button size="small" @click="submit" type="primary">保存</Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import baseRule from "./components/baseRule";
import otherRule from "./components/otherRule";
import { mapActions, mapGetters } from "vuex";
export default {
  components: { baseRule, otherRule },
  props: {},
  data() {
    return {
      id: ""
    };
  },
  watch: {},
  computed: {
    ...mapGetters("travelling", ["isSongcheng"])
  },
  methods: {
    ...mapActions("travellingRule", ["getDiffInfo"]),
    hashClick(val) {
      $("#content").scrollTop(
        $("#" + val).offset().top - 63 + $("#content").scrollTop()
      );
    },
    editGoback() {
      this.$router.back();
    },
    goback() {
      this.$router.back();
    },
    async submit() {
      let promiseList = [];
      [1, 2].forEach(item => {
        let refName = "rule" + item;
        promiseList.push(this.$refs[refName].handleSubmit());
      });
      Promise.all(promiseList)
        .then(res => {
          let postParams = {
            ...res[0],
            ...res[1]
          };

          if (this.id) {
            this.apiPost(
              "/product/api/routeProduct/saveEditRouteLine",
              postParams
            ).then(res => {
              if (res.status == 200) {
                this.$Message.success("修改成功");
                this.$router.push("/travellingRouteList");
              } else {
                this.$Message.warning(res.message);
              }
            });
          } else {
            this.apiPost(
              "product/api/routePush/saveRouteLine",
              postParams
            ).then(res => {
              if (res.status == 200) {
                this.$Message.success("保存成功");
                this.$router.push("/travellingRouteList");
              } else {
                res.message ? this.$Message.warning(res.message) : "";
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
          console.log(err);
        });
    }
  },
  created() {
    console.log(this.$router);
    // this.getDiffInfo()
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let id = to.query.id;
      vm.id = id;
      vm.getDiffInfo(id);
    });
  }
};
</script>
<style lang="scss" scoped>
.travell-rule {
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
  .senicInfo {
    position: relative;
    margin-top: 10px;
    display: inline-block;
    padding: 5px 10px;
    margin-right: 10px;
    border: 1px solid rgba(35, 192, 250, 1);
    .senicDel {
      position: absolute;
      top: -9px;
      right: -8px;
      background: #fff;
      font-size: 18px;
      cursor: pointer;
      display: none;
    }
    .address {
      color: #999;
    }
  }
  .senicInfo:hover {
    .senicDel {
      display: inline-block;
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
}
</style>
