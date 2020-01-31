<template>
    <div class="orderPay" >
        <Form :model="formItem" :label-width="120">
            <FormItem label="订单号：">
                <span>{{formItem.orderNo}}</span>
            </FormItem>
             <FormItem label="金额：">
                <span>{{formItem.amount}}</span>
            </FormItem>
             <FormItem label="选择支付方式：">
                 <RadioGroup v-model="formItem.payType">
                    <Radio label="1">
                        <span><img src="./../../../assets/images/zfb.png" alt="" style="vertical-align: middle;"></span>
                    </Radio>
                    <Radio label="2">
                        <span><img src="./../../../assets/images/wx.png" alt="" style="vertical-align: middle;"></span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="addPay">去支付</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { apiPost,apiGet } from "@/fetch/api";
export default {
    data(){
        return{
            formItem:{
                orderNo:"",
                amount:'',
                payType:''
            },
            dataList:{
                userType:"",
                payOrderNo:"",
                accountId:"",
                paySum:"",
                payType:"",
                extendParamJson:{
                    orderInfo:''
                }
            }
        }
    },
    created(){
         apiGet('/marketing/marketService/toPayFL?orderNo='+this.$route.query.orderId).then(res=>{
             if(res.success){
                 this.formItem=res.data.marketServiceOrder
             }
        })
    },methods:{
        addPay(){
            apiPost('/marketing/marketService/savePayOrder',
            {
                orderNo:this.formItem.orderNo,
                payType:this.formItem.payType
            }
            ).then(res=>{
                if(res.status==200){
                    if(res.data){
                      this.dataList.userType=res.data.userType  
                      this.dataList.payOrderNo=res.data.payOrderNo  
                      this.dataList.accountId=res.data.accountId  
                      this.dataList.paySum=res.data.paySum  
                      this.dataList.payType=res.data.payType  
                      this.dataList.extendParamJson.orderInfo=res.data.orderDescription  
                    }
                    this.$nextTick(()=>{
                       this.toPay() 
                    })
                }else{
                    this.$Message.warning(res.messages)
                }
            })
        },
        toPay(){
            apiPost('/order/orderPay/toPay',this.dataList).then(res=>{
                if(res.status==200){
                }
            })
        }
    }
}
</script>

