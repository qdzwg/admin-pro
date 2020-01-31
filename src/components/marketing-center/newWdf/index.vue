<template>
    <div class="newWdf">
        <Form :model="formItem" :label-width="120" label-position="right" ref="formItem" :rules="ruleForm">
        <div class="img-wdf" v-if="type=='add'">
            <div class="head-img">
                <h2>用户昵称</h2>
            </div>
            <div class="code">
                <span>二维码</span>
            </div>
            <img :src="formItem.posterUrl?formItem.posterUrl:'https://testwww.lotsmall.cn/static/h-ui/images/default_pic.png'" alt="">
        </div>
        <div class="wdf-info">           
                <FormItem label="活动名称：" prop="activityName">
                    <Input v-model="formItem.activityName" style="width:50%" :maxlength="32"></Input>
                </FormItem>
                <FormItem label="活动时间：">
                    <span v-if="type=='edit'">{{formItem.startDate}}至{{formItem.endDate}}</span>
                    <Row style="margin-top:20px;" v-if="type=='add'">
                        <Col span="6">
                        <DatePicker type="datetime" :value="formItem.startDate" @on-change="getvalidStart" :options="options3" placeholder="开始时间" style="width:85%"></DatePicker>
                        </Col>
                        <Col span="1">至</Col>
                        <Col span="6">
                        <DatePicker type="datetime" :value="formItem.endDate" @on-change="getvalidEnd" :options="options4" placeholder="结束时间" style="width:85%"></DatePicker>
                        </Col>
                        </Row>

                </FormItem>
                <FormItem label="海报模板：">
                    <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
                </FormItem>
                <FormItem v-if="type=='edit'" label="邀请人数：">
                    <span>{{formItem.inviteNum}}</span>
                </FormItem>
                <FormItem label="活动权益设置">
                    <span v-if="type=='edit'">赠送优惠券【{{formItem.couponName}}】 {{formItem.couponNum}} 张</span>
                    <table class="table" v-if="type=='add'">
                        <tr class="table-title">
                            <th>层级</th>
                            <th>邀请人数</th>
                            <th>活动权益(只针对属性为非公开的优惠券)</th>
                        </tr>
                        <tr v-for="(item,index) in formItem.gradeInfos" :key="index">
                            <td>1</td>
                            <td>
                                <FormItem :prop="'gradeInfos.' +index+ '.inviteNum'" :rules="[{required: true, message:'请输入邀请人数'}]">
                                    邀请
                                    <Input v-model="item.inviteNum" style="width:33%;" :maxlength="3"></Input>
                                    人
                                </FormItem>
                            </td>
                            <td> 
                                <FormItem :prop="'gradeInfos.' +index+ '.couponNum'" :rules="[{required: true, message:'请输入优惠券数量'}]">
                                    <Checkbox v-model="single">送优惠券</Checkbox>
                                    <Select v-model="item.couponCode" style="width:33%;" >
                                        <Option :value="el.code" v-for="(el,i) in couponList" :key="i">{{el.name}}</Option>
                                </Select>
                                    送
                                    <Input v-model="item.couponNum" style="width:13%;" :maxlength="3"></Input>
                                    张 (优惠券单人限领)
                                </FormItem>
                            </td>
                        </tr>
                    </table>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit">提交</Button>
                    <Button @click="test">取消</Button>
                </FormItem>
           
        </div>
         <div style="clear:both"></div>
         </Form>
    </div>
</template>

<script>
import { apiPost, apiGet } from "@/fetch/api";
import myImg from "@/components/global/singleImg";
export default {
  components: {
    myImg
  },
  data() {
    return {
      type: "add",
      options3: {},
      options4: {},
      singleImgList: [],
      single: true,
      couponList: [],
      formItem: {
        id: "",
        activityName: "",
        startDate: null,
        endDate: null,
        posterUrl: "",
        gradeInfos: [
          {
            grade: "1",
            inviteNum: "",
            sendCouponFlag: "T",
            couponCode: "",
            couponName: "",
            couponNum: ""
          }
        ],
        inviteNum: "",
        gradeInfo: "",
        couponName: "",
        couponNum: ""
      },
      ruleForm: {
        activityName: [
          { required: true, message: "请填写活动名称", trigger: "blur" }
        ],
        inviteNum: [
          { required: true, message: "请填写邀请人数", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    apiGet("/marketing/marketWdfActivity/addFL").then(res => {
      if (res.status == 200) {
        this.couponList = res.data.couponList;
      }
    });
    if (this.$route.query.id) {
      this.type = "edit";
      apiGet(
        "/marketing/marketWdfActivity/editFL?id=" + this.$route.query.id
      ).then(res => {
        if (res.status == 200) {
          this.formItem.id = res.data.marketWdfActivity.id;
          this.formItem.activityName = res.data.marketWdfActivity.activityName;
          this.singleImgList.push(res.data.marketWdfActivity.posterUrl);
          this.formItem.startDate = res.data.marketWdfActivity.startDate;
          this.formItem.endDate = res.data.marketWdfActivity.endDate;
          this.formItem.inviteNum = res.data.grade.inviteNum;
          this.formItem.couponName = res.data.grade.couponName;
          this.formItem.couponNum = res.data.grade.couponNum;
        }
      });
    } else {
      this.type = "add";
    }
  },
  methods: {
    setWapUrl(imgAll) {
      this.formItem.posterUrl = imgAll[0];
    },
    getvalidStart(time) {
      this.formItem.startDate = time;
    },
    getvalidEnd(time) {
      this.formItem.endDate = time;
    },
    submit() {
      let _this = this;
      if (this.type == "add") {
        this.couponList.forEach(item => {
          if (_this.formItem.gradeInfos[0].couponCode == item.code) {
            return (this.formItem.gradeInfos[0].couponName = item.name);
          }
        });
        this.formItem.gradeInfo = JSON.stringify(this.formItem.gradeInfos);
        let url = "/marketing/marketWdfActivity/saveActivity";
        this.common.formPost(this, {
          url,
          params: this.formItem,
          mold: "page",
          callback(res) {
            if (res.success) {
              _this.$Message.success("操作成功");
              _this.$router.back();
            } else {
              _this.$Message.warning(res.message);
            }
          }
        });
      } else if (this.type == "edit") {
        let params = {
          _method: "post",
          id: this.$route.query.id,
          activityName: this.formItem.activityName,
          posterUrl: this.formItem.posterUrl
        };
        apiPost("/marketing/marketWdfActivity/updateActivity", params).then(
          res => {
            if (res.success) {
              _this.$Message.success("操作成功");
              _this.$router.back();
            } else {
              _this.$Message.warning(res.message);
            }
          }
        );
      }
    },

    test() {
      this.$router.back();
    }
  }
};
</script>


<style lang="scss">
.newWdf {
  width: 100%;
  .img-wdf {
    width: 30%;
    float: left;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .head-img {
      position: absolute;
      margin: 20px 20px;
    }
    .code {
      width: 80px;
      height: 80px;
      background-color: #fff;
      position: absolute;
      bottom: 30px;
      right: 30px;
    }
  }
  .wdf-info {
    width: 70%;
    float: left;
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
  tr {
    td {
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #dddddd;
      padding: 8px;
      line-height: 20px;
    }
    th {
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #dddddd;
      padding: 8px;
      line-height: 20px;
    }
  }
  .table-title {
    background-color: #f5fafe;
  }
}
</style>


