<template>
    <div class="marketApply">
        <div class="market-box">
            <div class="market-item" v-for="(item,index) in dataList" :key="index">
                <img :src="item.picture" alt="">
                <p class="market-text">
                    <span>{{item.name}}</span>
                    <span v-if="item.dateType=='1'">原价{{item.originalPrice}}元 / {{item.dateNum==1?'':item.dateNum}}天</span>
                    <span v-if="item.dateType=='2'">原价{{item.originalPrice}}元 / {{item.dateNum==1?'':item.dateNum}}月</span>
                    <span v-if="item.dateType=='3'">原价{{item.originalPrice}}元 / {{item.dateNum==1?'':item.dateNum}}年</span>
                    <span v-if="item.dateType=='4'">原价{{item.originalPrice}}元 / 永久</span>
                </p>

                <Button v-if="item.isRenewal=='T'&&item.isUse=='T'" type="primary" @click="goApp(item.plugCode,item.id)">打开应用</Button>
                <Button v-if="item.isUse=='F'&&item.isRenewal=='F'" type="primary" @click="getBuy(item.id)">订购</Button>
                <Button v-else type="success" @click="goDetail(item.id)">续费</Button>

            </div>
        </div>
    </div>
</template>

<script>
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      dataList: []
    };
  },
  created() {
    apiGet("/marketing/marketService/listFL").then(res => {
      this.dataList = res.data.list;
    });
  },
  methods: {
    goApp(text, id) {
      if (text == "coupon") {
        this.$router.push("/marketCoupon");
      } else if (text == "wdf") {
        this.$router.push("/wdf");
      } else if (text == "lpt") {
        this.$router.push("/lpt");
      } else if (text == "mjs") {
        this.$router.push("/buyorsend");
      } else if (text == "rlsb") {
        this.$router.push("/faceRecognition");
      } else if (text == "dzfp") {
        this.$router.push("/electronicInvoices");
      } else if (text == "jzyx") {
        window.location.href =
          "http://192.168.200.166:8103/manage/index.htm#ajax/welcome.html";
      } else if (text == "pyp") {
        this.$router.push("/AIphoto");
      } else if (text == "guide") {
          this.$router.push("/guide");
        // apiGet("/marketing/marketService/getPubsLoginParam?id=" + id).then(
        //   res => {
        //     //   console.log(res)
        //     if (res.status == 200) {
        //       let obj = {};
        //       obj.corpCode = res.data.corpCode;
        //       obj.serviceCode = res.data.serviceCode;
        //       obj.sign = res.data.sign;
        //       obj.username = res.data.username;

        //       apiPost(res.data.url, obj).then(res => {
        //         if (res.status == 200) {
        //           console.log(res);
        //         //   window.location.href=res.data.url
        //         var tempwindow=window.open('_blank')
        //           tempwindow.location=res.data.url+'?source=xjsc';
        //         }
        //       });
        //     }
        //   }
        // );
        //   this.$router.push('/publicService')
      } else if (text == "gynk") {
        this.$router.push("/parkCard");
      }else if(text=='theater'){
           this.$router.push("/theaterplaceMgt");
      }else if(text=='timeReserve'){
           this.$router.push("/timeReserve");
      }else if(text=='wxAttractFans'){
           this.$router.push("/wxAttractFans");
      }else if(text=='idCard'){
           this.$router.push("/idCard");
      }
    },
    goDetail(id) {
      apiPost("/marketing/marketService/tobuy", {
        id: id
      }).then(res => {
        if (res.success) {
        //   this.$router.push({ path: "/orderList", query: { id: id } });
          window.location.href='/admin/index#/marketing/marketService/detail?id='+id
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    getBuy(id) {      
      window.location.href = '/admin/index#/marketing/marketService/detail?id='+id        
    },
    getModal() {
      this.$refs.address.showModal();
    }
  }
};
</script>

<style lang="scss">
.marketApply {
  width: 100%;
  .market-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .market-item {
      width: 310px;
      margin: 10px;
      padding: 20px;
      border: 1px solid #ccc;
      text-align: center;
      img {
        width: 100px;
        height: 100px;
        vertical-align: middle;
      }
      .market-text {
        margin: 10px 0;
      }
    }
  }
}
</style>



