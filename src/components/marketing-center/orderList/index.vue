<template>
    <div class="orderList">
        <div :data="dataList">
            <div class="orderImg">
                <img :src="dataList.marketService.picture" alt="">
            </div>
            <div class="orderInfo">
                <h1>{{dataList.marketService.name}}</h1>
                <p>{{dataList.marketService.introduce}}</p>
                <div v-for="(item,index) in dataList.priceList" :key="index" style="display:inline-block;">
                    <div v-if="item.dateType=='1'" style="margin-right:20px">
                        <Button @click="add(item)">{{item.presentPrice}}/{{item.dateNum}}天</Button>
                    </div>
                    <div v-if="item.dateType=='2'" style="margin-right:20px">
                        <Button @click="add(item)">{{item.presentPrice}}/{{item.dateNum}}月</Button>
                    </div>
                    <div v-if="item.dateType=='3'" style="margin-right:20px">
                        <Button @click="add(item)">{{item.presentPrice}}/{{item.dateNum}}年</Button>
                    </div>
                    <div v-if="item.dateType=='4'" style="margin-right:20px">
                        <Button @click="add(item)">{{item.presentPrice}}/永久</Button>
                    </div>
                </div>
                <p>
                <span >
                    服务周期:
                </span>
                <span v-if="period.dateType=='1'">{{period.dateNum}}天</span>
                <span v-if="period.dateType=='2'">{{period.dateNum}}个月</span>
                <span v-if="period.dateType=='3'">{{period.dateNum}}年</span>
                <span v-if="period.dateType=='4'">永久</span>
               
               <p>
                <span >
                    销量:
                </span>  
                    <span>{{dataList.marketService.salesNum}}</span>
                </p>
                <Button type="primary" @click="orderSub">订购</Button>
                <Button>联系客服</Button>
            </div>
            <div style="clear:both"></div>
            <div style="padding-top:20px;margin:30px 0 0 20px;border-top:2px solid #ccc">
                <h1>服务详情</h1>
                <p style="margin:20px 20px">{{dataList.marketService.summary}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { apiPost,apiGet } from "@/fetch/api";
export default {
    data(){
        return{
            dataList:{
                marketService:{
                    name:'',
                   introduce:'', 
                   salesNum:'',
                   summary:'',
                   picture:''
                }
            },
            period:{},

        }
    },
    created(){
        apiGet('/marketing/marketService/detailFL?id='+this.$route.query.id).then(res=>{
            if(res.success){
                if(res.data&&res.data.marketService&&res.data.price&&res.data.priceList){
                    this.dataList=res.data
                    this.dataList.marketService=res.data.marketService
                    this.period=res.data.price
                }
            }
            
        })
    },
    methods:{
        add(res){
            this.period=res
        },
        orderSub(){
            this.$router.push({path:'/orderInfo',query:{id:this.dataList.marketService.id,pid:this.period.id}})
        }

    }
}
</script>

<style lang="scss">
.orderList{
    width:100%;
    .orderImg{
        margin:30px 50px 0 30px;
        width:155px;
        float:left;
        img{
            width:150px;
            height:150px;
        }
    }
    .orderInfo{
        width:79%;
        float:left;
        p{
            margin:5px 0
        }
    }
}
</style>


