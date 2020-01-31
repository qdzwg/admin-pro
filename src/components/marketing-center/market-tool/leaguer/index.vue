<template>
  <div>
    <no-buy v-if="noBuyShow&&apiOver"></no-buy>
  </div>
</template>

<script>
import { apiGet, apiPost } from "@/fetch/api";
import noBuy from "@/components/marketing-center/notBuyService";
import jsonp from "@/fetch/jsonp";
//不使用{jsonp}因为jsonp.js导出使用的是export default
import { options } from "@/common/config";
export default {
  components: {
    noBuy
  },
  data() {
    return {
      apiOver: false,
      noBuyShow: true,
      serviceCode: ""
    };
  },
  created() {
    this.apiGet("/marketing/webApi/market/selectServiceUse", {
      serviceType: "leaguer"
    }).then(res => {
      if (res.status == 200) {
        if (res.data.leaguer) {
          this.noBuyShow = false;
          this.getPageData();
        } else {
          this.noBuyShow = true;
          this.apiOver = true;
        }
      } else {
        this.apiOver = true;
        this.noBuyShow = true;
      }
    });
  },
  methods: {
    getPageData() {
      this.serviceCode = window.location.href.split("#/")[1];
      apiGet(
        "/marketing/marketService/getPubsLoginParam?serviceCode=" +
          this.serviceCode
      ).then(res => {
        //   console.log(res)
        this.apiOver = true;
        if (res.status == 200) {
          let obj = {};
          obj.corpCode = res.data.corpCode;
          obj.serviceCode = res.data.serviceCode;
          obj.sign = res.data.sign;
          obj.username = res.data.username;
          obj.requestTime = res.data.requestTime;
          //    window.open('http://pubs.sendinfo.com.cn/login?serviceCode='+res.data.serviceCode+'&sign='+res.data.sign+'&username='+res.data.username+'&corpCode='+res.data.corpCode+'&url='+res.data.url)
          jsonp(res.data.url, obj, options).then(res => {
            //   window.location.href=res.data.url
            var tempwindow = window.open("_blank");
            tempwindow.location =
              res.url + "?source=xjsc" + "&userInfoId=" + res.user.id;
          });
        } else {
          this.$Message.warning(res.message);
        }
      });
    }
  }
};
</script>

