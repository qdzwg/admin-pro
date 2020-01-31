<template>
    <div class="orderInfo">
        <Form :model="formItem" ref="formItem" :rules="ruleForm" label-position="right" :label-width="120">
        <div :data="dataList">
            <span style="font-size:20px;">订购信息</span>
            <FormItem label="价格：">
                <span>{{dataList.marketServicePrice.presentPrice}}</span>
            </FormItem>
            <FormItem label="周期：">
                <span v-if="dataList.marketServicePrice.dateType=='1'">{{dataList.marketServicePrice.dateNum}}天</span>
                <span v-if="dataList.marketServicePrice.dateType=='2'">{{dataList.marketServicePrice.dateNum}}个月</span>
                <span v-if="dataList.marketServicePrice.dateType=='3'">{{dataList.marketServicePrice.dateNum}}年</span>
                <span v-if="dataList.marketServicePrice.dateType=='4'">永久</span>
            </FormItem>
            <FormItem label="订购店铺：">
                <span>{{dataList.merchantInfo.name}}</span>
            </FormItem>
            <div style="border:1px solid #ccc;">
                <div style="background:#f3f3f3;padding:10px 15px;margin-bottom:15px;"><span style="font-size:20px;">提供联系人信息 </span><span>用于订购后，与您取得联系</span> </div>
                <FormItem label="姓名：" prop="shopName">
                    <Input v-model="formItem.shopName" style="width:33%"></Input>
                </FormItem>
                <FormItem label="手机号：" prop="shopTele">
                    <Input v-model="formItem.shopTele" style="width:33%"></Input>
                </FormItem>
            </div>

            <div style="border:1px solid #ccc;margin-top:20px;padding:10px;">
                <table class="table">
                    <tr>
                        <th>服务内容</th>
                        <th>规格</th>
                        <th>生效时间</th>
                        <th>价格</th>
                    </tr>
                    <tr>
                        <td><img :src="dataList.marketService.picture" alt="">{{dataList.marketService.name}}</td>
                        <td>
                            <span v-if="dataList.marketServicePrice.dateType=='1'">{{dataList.marketServicePrice.dateNum}}天</span>
                            <span v-if="dataList.marketServicePrice.dateType=='2'">{{dataList.marketServicePrice.dateNum}}个月</span>
                            <span v-if="dataList.marketServicePrice.dateType=='3'">{{dataList.marketServicePrice.dateNum}}年</span>
                            <span v-if="dataList.marketServicePrice.dateType=='4'">永久</span>
                        </td>
                        <td>订单成功后立即生效</td>
                        <td>￥{{dataList.marketServicePrice.presentPrice}}</td>
                    </tr>
                </table>
                <FormItem label="备注：" >
                    <Input v-model="formItem.remark" style="width:50%"></Input>
                </FormItem>
            </div>
            <FormItem>
                 <Radio v-model="single">同意《服务市场协议》</Radio>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">订购</Button>
            </FormItem>
        </div>

        </Form>
    </div>
</template>

<script>
import { apiPost,apiGet } from "@/fetch/api";
export default {
    data(){
        return{
            dataList:{
                marketServicePrice:{
                    presentPrice:'',
                    picture:''
                },
                merchantInfo:{
                    name:'',
                    id:''
                },
                marketService:{
                    picture:'',
                    name:'',
                }

            },
            formItem:{
                serviceId:'',
                priceId:'',
                amount:'',
                shopId:'',
                shopName:'',
                shopTele:'',
                remark:'',
                serviceRadio:'',
            },
            single:false,
            ruleForm:{
                shopName:[
                     { required: true, message: '请填写姓名', trigger: 'blur' }
                ],
                shopTele:[
                     { required: true, message: '请填写手机号', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        apiGet('/marketing/marketService/confirmOrderFL',{
            id:this.$route.query.id,
            priceId:this.$route.query.pid
        }
       ).then(res=>{
           if(res.success){
               this.dataList.marketServicePrice=res.data.marketServicePrice
               this.dataList.merchantInfo=res.data.merchantInfo
               this.dataList.marketService=res.data.marketService
           }
       })
    },
    methods:{
        submit(){
            this.formItem.serviceId=this.$route.query.id
            this.formItem.priceId=this.$route.query.pid
            this.formItem.shopId=this.dataList.merchantInfo.id
            this.formItem.serviceRadio=this.single?'1':''
            this.formItem.amount=this.dataList.marketServicePrice.presentPrice
            let _this=this
            let url="/marketing/marketService/saveOrder"
            this.common.formPost(this,{
                url,
                params:this.formItem,
                mold:'page',
                callback(res) {
                    if (res.success) {
                        _this.$Message.success("操作成功");
                    } else {
                        _this.$Message.warning(res.message);
                    }
                }
            })

        }
    }
}
</script>


<style lang="scss">
.orderInfo{
    width:100%;
    border:1px solid #ccc;
    padding:20px;
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
        img{
            width:50px;
            height:50px;
            vertical-align: middle;
            margin-right:10px;
        }
      }
      th{
        border-left: 1px solid #ddd;
        padding: 8px;
        line-height: 20px;
        background-color: #f5fafe;
      }
    }
  }
</style>


