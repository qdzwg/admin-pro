<template>
    <div class="electronicConfig">
        <Form ref="formItem" :model="formItem" :label-width="120" label-position="right" :rules="ruleForm" style="margin-left:100px;">
            <FormItem label="纳税人识别名称：" prop="ratepayerName">
                <Input v-model="formItem.ratepayerName" style="width:33%"></Input>
            </FormItem>
            <FormItem label="纳税人识别号：" prop="retepayerNo">
                <Input v-model="formItem.retepayerNo" style="width:33%"></Input>
            </FormItem>
            <FormItem label="开票人姓名：" prop="createInvoiceBy">
                <Input v-model="formItem.createInvoiceBy" style="width:33%"></Input>
            </FormItem>
            <FormItem label="固定电话：" prop="telephone">
                <Input v-model="formItem.telephone" style="width:33%"></Input>
            </FormItem>
            <FormItem label="地址：" prop="address">
                <Input v-model="formItem.address" style="width:33%"></Input>
            </FormItem>
            <FormItem label="销售方银行账户：" prop="bankNo">
                <Input v-model="formItem.bankNo" style="width:33%"></Input>
            </FormItem>
            <FormItem label="电票商类型：" prop="seller">
                <!-- <Input v-model="formItem.seller" style="width:33%"></Input> -->
                <Select v-model="formItem.seller" style="width:180px" placeholder="请选择状态">
                    <Option v-for="(item, index) in merchTypeList" :value="item.key" :key="index">{{ item.value }}</Option>
                </Select>
            </FormItem>
            <FormItem label="爱信诺编码：" prop="idEntity">
                <Input v-model="formItem.idEntity" style="width:33%"></Input>
            </FormItem>
            <FormItem label="私钥：" prop="privateKey">
                <Input v-model="formItem.privateKey" style="width:33%"></Input>
            </FormItem>
            <FormItem label="企业码：" prop="corpCode">
                <Input v-model="formItem.corpCode" style="width:33%"></Input>
            </FormItem>
            <FormItem label="用户名：" prop="corpName">
                <Input v-model="formItem.corpName" style="width:33%"></Input>
            </FormItem>
            <FormItem label="分销商税号：" prop="saleDutyNo">
                <Input v-model="formItem.saleDutyNo" style="width:33%"></Input>
            </FormItem>    
            <FormItem label="税号编码：" required>
                <table class="table">
                    <thead>
                        <tr>
                            <th>
                                <Icon class="add-icon" @click="add2" type="android-add-circle" v-if="formItem.rateData.length<10"></Icon>
                                <Icon type="plus-circled" @click="rateDataLimit" v-else style="font-size:28px;"></Icon>
                            </th>
                            <th>编号</th>
                            <th>税率</th>
                            <th width=180>业态类型</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(ele,i) in formItem.rateData">
                            <tr>
                                <td class="center-td">
                                    <Icon class="delete-icon" @click="del2(i)" type="android-remove-circle"></Icon>
                                </td>
                                <td>
                                    <FormItem :prop="'rateData.' + i + '.einCode'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]">                    
                                        <Input v-model="ele.einCode" style="width:50%"></Input> 
                                    </FormItem>
                                </td>
                                <td>                                       
                                    <FormItem :prop="'rateData.' + i + '.rate'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]">
                                        <Input v-model="ele.rate" style="width:50%"></Input> 
                                    </FormItem>                           
                                </td>
                                <td>
                                    <FormItem :prop="'rateData.' + i + '.type'" :rules="[{required: true, message:'请选择',trigger: 'change'}]">
                                        <Select v-model="ele.type">
                                            <Option value="">--请选择业态类型--</Option>
                                            <Option v-for="(item, index) in typeList" :value="item.key" :key="index">{{ item.value }}</Option>                                     
                                        </Select>
                                    </FormItem>                    
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </FormItem>
            <FormItem > 
                <Button type="primary" @click="submit">提交</Button>
                <Button @click="test">取消</Button>
            </FormItem>
            
        </Form>
    </div>
</template>
<script>
import { apiPost, apiGet } from "@/fetch/api";
export default {
    data(){
        return{
            merchTypeList: [],
            typeList: [],
            formItem:{
                ratepayerName:"",
                retepayerNo:"",
                telephone:"",
                address:"",
                bankNo:"",
                seller:"",
                idEntity:"",
                privateKey:"",
                corpCode:"",
                corpName:"",
                saleDutyNo:"",
                createInvoiceBy:"",
                rateData:[{
                    einCode:"",
                    rate:"",
                    type:"",
                }]
            },
            ruleForm:{
                ratepayerName:[
                    {required:true,message:"请填写纳税人识别名称",trigger:"blur"}
                ],
                retepayerNo:[
                    {required:true,message:"请填写纳税人识别号",trigger:"blur"}
                ],
                 telephone:[
                    {required:true,message:"请填写固定电话",trigger:"blur"}
                ],
                 address:[
                    {required:true,message:"请填写地址",trigger:"blur"}
                ],
                 bankNo:[
                    {required:true,message:"请填写销售方银行账户",trigger:"blur"}
                ],
                 seller:[
                    {required:true,message:"请填写电票商类型",trigger:"change"}
                ],
                 idEntity:[
                    {required:true,message:"请填写爱信诺编码",trigger:"blur"}
                ],
                 privateKey:[
                    {required:true,message:"请填写私钥",trigger:"blur"}
                ],
                 corpCode:[
                    {required:true,message:"请填写企业码",trigger:"blur"}
                ],
                 corpName:[
                    {required:true,message:"请填写用户名",trigger:"blur"}
                ],
                 saleDutyNo:[
                    {required:true,message:"请填写分销商税号",trigger:"blur"}
                ],
                 createInvoiceBy:[
                    {required:true,message:"请填写开票人姓名",trigger:"blur"}
                ],
                 corpName:[
                    {required:true,message:"请填写用户名",trigger:"blur"}
                ]
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            apiGet('/marketing/marketElectronicInvoices/addFL').then(res=>{
                if(res.success || res.status == 200){
                    this.merchTypeList = res.data.merchTypeList;
                    this.typeList = res.data.typeList;
                    if(res.data.marketElectronicInvoicesParam) {
                        this.formItem.id = res.data.marketElectronicInvoicesParam.id ? res.data.marketElectronicInvoicesParam.id : '';
                        this.formItem.ratepayerName = res.data.marketElectronicInvoicesParam.ratepayerName ? res.data.marketElectronicInvoicesParam.ratepayerName : '';
                        this.formItem.retepayerNo = res.data.marketElectronicInvoicesParam.retepayerNo ? res.data.marketElectronicInvoicesParam.retepayerNo : '';
                        this.formItem.createInvoiceBy = res.data.marketElectronicInvoicesParam.createInvoiceBy ? res.data.marketElectronicInvoicesParam.createInvoiceBy : '';
                        this.formItem.telephone = res.data.marketElectronicInvoicesParam.telephone ? res.data.marketElectronicInvoicesParam.telephone : '';
                        this.formItem.address = res.data.marketElectronicInvoicesParam.address ? res.data.marketElectronicInvoicesParam.address : '';
                        this.formItem.bankNo = res.data.marketElectronicInvoicesParam.bankNo ? res.data.marketElectronicInvoicesParam.bankNo : '';
                        this.formItem.seller = res.data.marketElectronicInvoicesParam.seller ? res.data.marketElectronicInvoicesParam.seller : '';
                        this.formItem.idEntity = res.data.marketElectronicInvoicesParam.idEntity ? res.data.marketElectronicInvoicesParam.idEntity : '';
                        this.formItem.privateKey = res.data.marketElectronicInvoicesParam.privateKey ? res.data.marketElectronicInvoicesParam.privateKey : '';
                        this.formItem.corpCode = res.data.marketElectronicInvoicesParam.corpCode ? res.data.marketElectronicInvoicesParam.corpCode : '';
                        this.formItem.corpName = res.data.marketElectronicInvoicesParam.corpName ? res.data.marketElectronicInvoicesParam.corpName : '';
                        this.formItem.saleDutyNo = res.data.marketElectronicInvoicesParam.saleDutyNo ? res.data.marketElectronicInvoicesParam.saleDutyNo : '';
                        if(res.data.marketElectronicInvoicesRates){
                            let marketElectronicInvoicesRates = res.data.marketElectronicInvoicesRates;
                            let arr = [];
                            marketElectronicInvoicesRates.forEach((item,index)=>{
                                let obj = {
                                    einCode: item.einCode,
                                    rate: item.rate,
                                    type: item.type
                                }
                                arr.push(obj);
                            })
                            this.formItem.rateData = arr;
                        }
                        // this.formItem.rateData = res.data.marketElectronicInvoicesRates ? res.data.marketElectronicInvoicesRates : [];     
                    }                                
                }else{
                    this.$Message.warning(res.message);
                }
            })
        },
        submit(){
            this.$refs.formItem.validate(async valid => {
                this.scrollError();
                if (valid) {
                    let url = "/marketing/marketElectronicInvoicesParam/editParamFL"
                    let formParam = JSON.parse(JSON.stringify(this.formItem));
                    formParam.rateData = JSON.stringify(formParam.rateData);
                    let res = await apiPost(url, formParam)
                    if(res.success || res.status == 200){
                        let msg = res.msg ? res.msg : '操作成功！'
                        this.$Message.success(msg)
                        this.$router.push('/electronicInvoices')
                    }else{
                        let msg = res.message ? res.message : '操作失败！'
                        this.$Message.warning(msg)
                    }
                }
            })
        },
        scrollError () {
            let errList = $('.ivu-form-item-error')
            if (errList.length > 0) {
                let scroll_offset = errList.eq(0).offset().top
                $('#content').animate(
                {
                    scrollTop: scroll_offset
                },
                300
                )
            }
        },
        add2(){
            if(this.formItem.rateData.length>=10){
                this.$Message.warning("最多可添加10条!");
            }else{
                this.formItem.rateData.push(
                    {
                        einCode:"",
                        rate:"",
                        type:"",
                    }
                )
            }
        },
        rateDataLimit(){
            this.$Message.warning("指定物流最多可添加10条!");
        },
        del2(i){
            this.formItem.rateData.splice(i, 1);
        },
        test(){
            this.$router.back()
        },
    }
}
</script>

<style lang="scss">
.electronicConfig{
    width:100%;
}
.table {
  margin-bottom: 15px;
  width: 80%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  thead {
    tr {
      th {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
  tbody {
    tr {
      td {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
}
.add-icon {
  cursor: pointer;
  color: green;
  font-size: 28px;
}
.delete-icon {
  cursor: pointer;
  color: red;
  font-size: 28px;
}
.center-td {
  text-align: center;
}
</style>


