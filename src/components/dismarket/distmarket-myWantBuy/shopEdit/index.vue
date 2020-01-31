<template>
<div>
    <Form :model="formItem" label-position="right" :label-width="200" ref="formItem" :rules="ruleForm">
        <FormItem label="分销商店铺名称：" prop="name">
            <Input style="width:70%;" maxlength=64 v-model="formItem.name" placeholder="请填写分销商店铺名称"></Input>
        </FormItem>
        <FormItem label="店铺简介：" prop="briefIntro">
            <Input style="width:70%;" maxlength=200 v-model="formItem.briefIntro" placeholder="请填写店铺简介"></Input>
        </FormItem>
        <FormItem label="店铺logo：" prop="headPortrait">
            <Input style="display:none;" v-model="formItem.headPortrait"></Input>
            <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
        </FormItem>
        <FormItem label="服务电话：" prop="weixinCustomerService">
            <Input style="width:70%;" maxlength=64 v-model="formItem.weixinCustomerService" placeholder="请填写服务电话"></Input>
        </FormItem>
        <FormItem label="微信售后：" prop="weixinRepair">
            <Input style="width:70%;" maxlength=64 v-model="formItem.weixinRepair" placeholder="请填写微信售后"></Input>
        </FormItem>
        <FormItem label="备注：" prop="remarke">
            <Input style="width:70%;" maxlength=100 v-model="formItem.remarke" placeholder="请填写备注"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submit">提交</Button>
            <Button type="primary" @click="cancel">取消</Button>
        </FormItem>
    </Form>
</div>
</template>
<script>
import qs from 'qs'
import myImg from "@/components/global/singleImg";
import { apiPost, apiPostJson } from "@/fetch/api";
export default {
    data () {
        return {
            singleImgList: [],
            formItem: {
                id: '',
                name: '',
                briefIntro:'',
                headPortrait: '',
                weixinCustomerService:'',
                weixinRepair:'',
                remarke:'',
            },
            ruleForm: {
                name: [
                    {required: true, message: '请填写分销商店铺名称', trigger: 'blur'},
                ],
                briefIntro:[
                    {required: true, message: '请填写店铺简介', trigger: 'blur'},
                ],
                headPortrait: [
                    {
                        required: true,
                        message: "请选择手绘图片",
                        trigger: "blur"
                    }
                ],
                weixinCustomerService:[
                    {required: true, validator: this.common.validate.phone, message: '请填写服务电话', trigger: 'blur'},
                ],
                weixinRepair:[
                    {required: true, message: '请填写微信售后', trigger: 'blur'},
                ],
                remarke:[
                    {required: true, message: '请填写备注', trigger: 'blur'},
                ],
            }
        }
    },
    components: { myImg },
    mounted () {
        apiPost("/distmarket/webApi/distMarketShop/selectShop").then(res => {
            if(res.status==200){
                this.formItem = res.data;
                this.singleImgList.push(res.data.headPortrait);
            }else{
                this.$Message.warning(res.message)
            }
        });
    },
    methods: {
        setWapUrl(imgArr) {
            this.formItem.headPortrait = imgArr[0];
        },
        submit() {
            let _this = this
            delete this.formItem.createBy
            delete this.formItem.createTime
            delete this.formItem.deleted
            delete this.formItem.mainUserId
            delete this.formItem.modifyBy
            delete this.formItem.modifyTime
            let params = qs.stringify(this.formItem)
            let url = _this.formItem.id?"/distmarket/distMarketShop/editsFl":"/distmarket/distMarketShop/savesFl"
            _this.$refs.formItem.validate(async valid => {
                if (valid) {
                    apiPostJson(url+'?'+params).then(res => {
                        if(res.status==200){
                            _this.$Message.success("保存成功!");
                            _this.$router.back();
                        }else{
                            this.$Message.warning(res.message)
                        }
                    });
                } else {
                    //滚动到错误地方
                    // setTimeout(function() {
                    //     $("#content").scrollTop(
                    //     $(".ivu-form-item-error").offset().top -
                    //         90 +
                    //         $("#content").scrollTop()
                    //     );
                    // }, 500);
                }
            });
        },
        cancel() {
            this.$router.back()
        },
    }
}
</script>