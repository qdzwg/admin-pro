<template>
  <div class="travellRoute-box">
    <div v-if="!id" class="step">
      <Steps :current="1">
        <Step title="产品类型"></Step>
        <Step title="跟团游信息"></Step>
        <Step title="票型信息"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <div id="base" class="form-title">基本信息</div>
    <base-info ref="travell1"></base-info>
    <div id="senicInfo" class="form-title">跟团游信息</div>
    <travelling-info ref="travell2"></travelling-info>
    <template v-if="!isSongcheng">
      <div id="distSet" class="form-title">分销设置</div>
      <sale ref="travell3"></sale>
    </template>
    <div style="padding-left:120px" v-if="id">
      <Button type="primary" @click="submit">保存</Button>
      <Button type="ghost" @click="cancelFun" style="margin-left: 8px"
        >返回列表</Button
      >
    </div>
    <div style="padding-left:120px" v-else>
      <Button type="primary" @click="submit">保存,下一步</Button>
      <Button type="ghost" @click="cancelFun" style="margin-left: 8px"
        >取消</Button
      >
    </div>
    <div class="fixed-box">
      <ul>
        <li>
          <a>快捷导航</a>
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('base')"
            >基本信息</a
          >
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('senicInfo')"
            >跟团游信息</a
          >
        </li>
        <li>
          <a href="javascript:;" class="tartg-a" @click="hashClick('distSet')"
            >分销设置</a
          >
        </li>
        <li>
          <Button size="small" @click="submit" type="primary">
            <template v-if="id">
              保存
            </template>
            <template v-else>
              保存,下一步
            </template>
          </Button>
          <!-- <button type="button" class="btn btn-primary btn-primary-outline" onclick="goTicketPublish()">保存，下一步</button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import quillEditor from "@/components/global/vueQuillEditor";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import baseInfo from "./components/baseInfo";
import travellingInfo from "./components/travellingInfo";
import sale from "./components/sale";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  components: { baseInfo, travellingInfo, sale },
  data() {
    return {
      id: "" //页面id
    };
  },
  computed: {
    ...mapState("travelling", ["diffInfo", "diffValue"]),
    ...mapGetters("travelling", ["isSongcheng"])
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapActions("travelling", ["getDiffInfo"]),
    cancelFun() {
      this.$router.go(-1);
    },
    async submit() {
      let promiseList = [];
      let list = [];
      if (this.isSongcheng) {
        list = [1, 2];
      } else {
        list = [1, 2, 3];
      }
      list.forEach(item => {
        let refName = "travell" + item;

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
            ...res[2]
          };
          if (this.isSongcheng) {
            postParams.sellType = 2;
          }
          if (this.id) {
            postParams.id = this.id;
            this.apiPost(
              "/product/api/routeProduct/saveEditRouteInfo",
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
            this.apiPost("/product/api/routePush/saveRoute", postParams).then(
              res => {
                if (res.status == 200) {
                  this.$Message.success("保存成功");
                  this.$router.push("/travellingRouteInfo");
                } else {
                  this.$Message.warning(res.message);
                }
              }
            );
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

          console.log("err");
          console.log(err);
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      let id = to.query.id;
      if (id) {
        vm.id = id;
      }
      let info = await vm.getDiffInfo(id);
    });
  }
};
</script>
<style lang="scss">
.modal-table {
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
        text-align: center;
      }
    }
  }
}
.travellRoute-box {
  .ql-container {
    height: 150px;
  }
  .money-unit {
    margin-left: 8px;
  }
  .save-cancel {
    padding-bottom: 50px;
  }
  .unit {
    padding: 0 10px;
  }
  .travellSubject {
    // border: 1px solid red;
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
  width: 100%;
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
