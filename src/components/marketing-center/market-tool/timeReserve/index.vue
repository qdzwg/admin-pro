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
    apiGet('/admin/appointment/fastLoginFL').then(res=>{
        if(res.success){
                let obj = {};
        obj.appCode = res.appCode;
        obj.password = res.password;
        obj.sign = res.sign;
        obj.userName = res.userName;
        obj.requestTime = res.requestTime;
        jsonp(res.requestUrl, obj, options).then(res => {
            // console.log(res)
            // window.location.href=res.indexUrl
          var tempwindow = window.open("_blank");
          tempwindow.location =
            res.indexUrl 
        });
        } else {
        this.$Message.warning(res.message);
      }
    })
  }
};
</script>

