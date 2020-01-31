<template>
    <div>

    </div>
</template>

<script>
import { apiGet, apiPost } from "@/fetch/api";
import jsonp from "@/fetch/jsonp";
//不使用{jsonp}因为jsonp.js导出使用的是export default
import { options } from "@/common/config";
export default {
  data() {
    return {
      serviceCode: ""
    };
  },
  created() {
    this.serviceCode = 'cms';
    apiGet(
      "/marketing/marketService/getPubsLoginParam?serviceCode=" +
        this.serviceCode
    ).then(res => {
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
};
</script>

