<template>
<div>
    <Form :model="formItem" label-position="right" :label-width="200" ref="formItem">
        <FormItem label="产品编码：">{{formItem.code}}</FormItem>
        <FormItem label="是否上架（可见）：">{{formItem.enabled=="T"?"已上架":"已下架"}}</FormItem>
        <FormItem label="产品规格：">
            <table border="1" border-spacing='0' class="table" style="border-collapse: collapse;border:1px solid #ccc;">
                <thead align='center'>
                    <tr>
                        <th style="padding:5px;background:#ebf7ff"  v-for="(item,index) in table.header" :key="index">{{item}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in table.trs" :key="index">
                        <td style="padding:5px 10px;" v-for="(it,inde) in item.tds" :key="inde">{{it.type=='checkbox'?(it.value=='T'?'是':'否'):it.value}}</td>
                    </tr>
                </tbody>
            </table>
        </FormItem>
        <FormItem label="售后政策："><div v-html='formItem.salePolicy'></div></FormItem>
        <FormItem label="分销政策："><div v-html='formItem.distPolicy'></div></FormItem>
        <FormItem label="投放类别：">{{formItem.pushType=='all'?'全局投放':'区域开发'}}</FormItem>
        <FormItem label="展示价格：">{{formItem.showPrice}}</FormItem>
        <FormItem label="图片：">
            
               <img style="width:200px;height:200px; margin-right:20px;" v-for="(item,index) in formItem.picUrl" :key="index" :src="item" alt=""> 
            
            
            </FormItem>
        <FormItem label="主图："><img style="width:200px;height:200px;" :src="formItem.masterPic" alt=""></FormItem>
        <FormItem>
            <Button type="primary" @click="cancel">取消</Button>
        </FormItem>
    </Form>
</div>
</template>
<script>
import { apiGet } from "@/fetch/api";
export default {
    data () {
        return {
            table: {
                header: [],
                trs: [{
                    tds: []
                }]
            },
            formItem: {
                mdseName: '',
                sortNo:'',
                hierarchy:'',
            },
        }
    },
    mounted () {
        apiGet("/distmarket/distMarketProduct/detailFl",{id:this.$route.query.id}).then(res => {
            if(res.status==200){
                this.formItem = res.data.distMarketProduct;
                this.formItem.picUrl = res.data.distMarketProduct.picUrl?res.data.distMarketProduct.picUrl.split(','):[]
                this.formItem.masterPic = res.data.distMarketProduct.masterPic?res.data.distMarketProduct.masterPic:''
                if(res.data.tableJson)
                this.table = res.data.tableJson
            }else{
                this.$Message.warning(res.message)
            }
        });
    },
    methods: {
        cancel() {
            this.$router.back()
        },
    }
}
</script>