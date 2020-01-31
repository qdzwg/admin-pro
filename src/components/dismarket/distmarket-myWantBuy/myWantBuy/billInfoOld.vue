<template>
<div>
    <Row :gutter="16" class="btn-groups"> 
      <Col span="16" v-if="goodsType=='park'">
        <span>游玩日</span>
        <DatePicker v-model="occDate" @on-change="dateChange" format="yyyy-MM-dd" type="date" placeholder="Select date"></DatePicker>
      </Col>
      <Col span="16" v-if="goodsType=='hotel'">
        <span>入住/离店日期</span>
        <DatePicker v-model="daterange" @on-change="daterangeChange" format="yyyy-MM-dd" type="daterange" placement="bottom-start" placeholder="Select date"></DatePicker>
      </Col>
    </Row>
    <div class="resultList">
        <div class="resultItem">
            <div class="resultOpt">
                <div class="resultTable">
                    <div class="resultThead">
                        <div class="resultTh">{{goodsType=='park'?'票型名称':(goodsType=='mdse'?'商品规格':(goodsType=='hotel'?'房型':'票型'))}}</div>
                        <div class="resultTh">结算价格</div>
                        <div class="resultTh">库存</div>
                        <!-- <div v-if="goodsType=='park'" class="resultTh">游玩时段</div> -->
                        <div class="resultTh">预定数量</div>
                    </div>
                    <div class="resultTbody" v-for="(ticket,inde) in data.ticketPurchases" :key='inde'>
                        <div class="resultTr">
                            <div class="resultTd">{{ticket.ticketName}}<span v-if='ticket.isRealName=="T"'>实名制</span></div>
                            <div class="resultTd">￥{{ticket.distPrice}}</div>
                            <!-- <div v-if="goodsType=='park'" class="resultTd">{{ticket.stock}}</div> -->
                            <div class="resultTd">{{ticket.stock}}</div>
                            <div class="resultTd">
                                <Button size="small" @click='ticketNum(0,ticket,data,inde)' type="text">-</Button><input style="width:30px;line-height:20px;" type="text" v-model="ticket.value" readonly><Button type="text" size="small" @click='ticketNum(1,ticket,data,inde)'>+</Button>
                            </div>
                        </div>
                        <div class="resultTimeList" v-if='ticket.show&&false'>
                            <span class="resultTime" @click='timeIt(ind)' :class='{resultTimeSel: timeSel==ind,resultTime0: ind%3}' v-for="(ite,ind) in timer" :key='ind'>11.10-12.20</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="listInfo">
        <div class="infoTitle">{{goodsType=='mdse'?'收货人信息':'取票人信息'}}</div>
        <div class="infoWrap">
            <Form v-if='goodsType=="mdse"' :model="formItem" label-position="right" :label-width="130" ref="formItem" :rules="ruleForm">
                <FormItem label="取票人：" prop="name">
                    <Input style="width:70%;" v-model="formItem.name" placeholder="请填写取票人"></Input>
                </FormItem>
                <FormItem label="手机：" prop="phone">
                    <Input style="width:70%;" v-model="formItem.phone" placeholder="请填写手机"></Input>
                </FormItem>
                <FormItem label="所在地区：" prop="locationCode">
                    <select-item ref="select" style="width:70%;" :addrCode="formItem.locationCode" :span='8' @getProvince="getProvince" @getCity="getCity" @getQu="getQu"></select-item>
                </FormItem>
                <FormItem label="详细地址：" prop="address">
                    <Input style="width:70%;" v-model="formItem.address" placeholder="请填写身份证"></Input><a style="margin-left:20px;" @click='saveGuide' href="javascript:void(0);">保存为常用信息</a>
                </FormItem>
                <FormItem label="备注：" prop="remark">
                    <Input style="width:70%;" v-model="formItem.remark" placeholder="请填写备注"></Input>
                </FormItem>
            </Form>
            <Form v-else :model="formItem" label-position="right" :label-width="130" :ref="'formItem'" :rules="ruleForm">
                <FormItem label="取票人：" prop="name">
                    <Input style="width:70%;" v-model="formItem.name" placeholder="请填写取票人"></Input>
                </FormItem>
                <FormItem label="手机：" prop="phone">
                    <Input style="width:70%;" v-model="formItem.phone" placeholder="请填写手机"></Input>
                </FormItem>
                <FormItem label="身份证：" prop="idNo">
                    <Input style="width:70%;" v-model="formItem.idNo" placeholder="请填写身份证"></Input><a style="margin-left:20px;" @click='saveGuide' href="javascript:void(0);">保存为常用信息</a>
                </FormItem>
                <FormItem label="备注：" prop="remark">
                    <Input style="width:70%;" v-model="formItem.remark" placeholder="请填写备注"></Input>
                </FormItem>
            </Form>
            <div class="addressListWrap" v-if='goodsType=="mdse"'>
                <div class="listTitle">常用收件人</div>
                <div class="addressList">
                    <div class="addressItem" @click='guideEle(item)' :class='{addressDefault: item.defaultFlag}' v-if='more||!more&&inde<2' v-for="(item,inde) in guides" :key='inde'>
                        <span class='default' v-if='item.defaultFlag'>默</span>
                        <div class="itemLine">
                            <div class="lineInfo">
                                收货人：<span>{{item.name}}</span>
                            </div>
                            <div class="lineInfo linePhone">
                                手机号码：<span>{{item.phone}}</span><a href="javascript:void(0);" @click='setDefault(item)' class="setDefault">设置默认</a><a href="javascript:void(0);" @click='guideDel(item)'>删除</a>
                            </div>
                        </div>
                        <div class="itemLine">
                            <div class="lineInfo">
                                收货地址：<span>{{item.address}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="addressMore" v-if='!more&&guides.length<2'>
                        <a href="javascript:;" @click='more=true'>加载更多</a>
                    </div>
                </div>
            </div>
            <div class="guideListWrap" v-else>
                <div class="listTitle">{{goodsType=='park'?'常用联系人':'常用取票人'}}</div>
                <div class="guideList">
                    <div class="guideItem" v-for="(ele,index) in guides" :key='index'><span @click='guideEle(ele)'>{{ele.name}}</span><Icon type="close" @click='guideDel(ele)'></Icon></div>
                </div>
            </div>
        </div>
    </div>
    <div class="listInfo" v-for="(ele,index) in list" :key='index' v-if="goodsType=='park'">
        <div class="infoTitle">【{{ele.ticketName}}】实名制信息<Upload 
          :ref="'upload'+index"
          :show-upload-list="false"
          :before-upload="handleBeforeUpload(index)"
          :on-success="handleSuccess"
          :data='{amount:2||ele.form.length}'
          :format="['xlsx','xls']"
          :max-size="3072"
          :on-exceeded-size="handleMaxSize"
          action="/distmarket/webApi/uploadTemplate/uploadReallyName"
          style="display: inline-block;width:58px;">
          <a href="javascript:void(0);">导入</a>
      </Upload><a href="/distmarket/reallyName.xls">下载模板</a></div>
        <div class="guideFormList">
            <Form v-for="(item,inde) in ele.form" :key='inde' :ref='"form"+index+"-"+inde' label-position="right" :label-width="80" :model="item" inline :rules="ruleForm">
                <FormItem label="姓名：" prop="name">
                    <Input style="width:200px;" type="text" v-model="item.name" placeholder="游客姓名"></Input>
                </FormItem>
                <FormItem label="身份证：" prop="certNo">
                    <Input style="width:200px;" type="text" v-model="item.certNo" placeholder="游客身份证"></Input>
                </FormItem>
            </Form>
        </div>
    </div>
    <div class="resultOpt" v-if='total.num'>
        <div class="resultTotal">
            <div class="totalInfo">
                <div class="totalNum">总数量：<span>{{total.num}}</span>{{goodsType=="park"?"张":(goodsType=="hotel"?"间":"")}}</div>
                <div class="totalNum" v-if='goodsType=="mdse"'>邮费：<span>￥{{postagePrice}}</span></div>
                <div class="totalNum">合计：<span>￥{{total.price}}</span></div>
                <Button type="primary" @click='submitBill(item)'>提交订单</Button>
            </div>
        </div>
    </div>
    <confirm ref="confirmModel" sucessMsg="操作成功！" content="确认取消采购吗？" mode="done"></confirm>
    <confirm ref="submitModel" title='请注意' content="你所提交的信息已经审核通过，请及时跟进申请状况。如有问题，请联系审核人员或者拨打客服电话400-400-400。" mode="done"></confirm>
</div>
</template>
<script>
import confirm from '@/components/global/confirm'
import selectItem from "@/components/global/selectList";
import { apiGet, apiPost } from "@/fetch/api";
export default {
    data () {
        return {
            guides: [],
            address: [],
            current: 0,
            more: false,
            postagePrice: 0,
            formItem: {
                name: '',
                phone:'',
                idNo: '',
                remark:'',
                locationCode: ''
            },
            ruleForm: {
                name: [
                    {required: true, message: '请填写取票人', trigger: 'blur'},
                ],
                phone: [
                    {required: true, message: '请填写手机', trigger: 'blur'},
                ],
                idNo:[
                    {required: true, message: '请填写身份证', trigger: 'blur'},
                ],
                certNo:[
                    {required: true, message: '请填写身份证', trigger: 'blur'},
                ],
                address:[
                    {required: true, message: '请填写详细地址', trigger: 'blur'},
                ],
                locationCode:[
                    {required: true, message: '请选择所在地区', trigger: 'blur'},
                ],
            },
            timeSel: 0,
            timer: [0,1,2,3,4],
            occDate: new Date(),
            daterange: [new Date(),new Date(new Date() + 1000 * 60 * 60 * 24)],
            type: [
                {
                    goodsType: 'park',
                },
                {
                    goodsType: 'hotel',
                },
                {
                    goodsType: 'mdse',
                },
                {
                    goodsType: 'route',
                }
            ],
            goodsType: '',
            list: [],
            data: {}
        }
    },
    computed: {
        // list() {
        //     let list;
        //     let data = [];
        //     if (this.goodsType == 'park') {
        //         list = this.data.ticketPurchases;
        //     } else if (this.goodsType == 'hotel') {
        //         list = this.data.roomPurchases;
        //     } else if (this.goodsType == 'mdse') {
        //         list = this.data.specPurchases;
        //     } else {
        //         list = this.data.routeTicketPurchases;
        //     }
        //     if(list){
        //         list.map(it=>{
        //             if(it.value){
        //                 let arr = [];
        //                 for (let index = 0; index < it.value; index++) {
        //                     arr.push()
        //                 }
        //                 data.push({
        //                     ticketName: it.ticketName,
        //                     form: arr
        //                 })
        //             }
        //         });
        //     }
        //     return data
        // },
        total() {
            let list;
            let num = 0;
            let price = 0;
            if (this.goodsType == 'park') {
                list = this.data.ticketPurchases;
            } else if (this.goodsType == 'hotel') {
                list = this.data.roomPurchases;
            } else if (this.goodsType == 'mdse') {
                list = this.data.specPurchases;
            } else {
                list = this.data.routeTicketPurchases;
            }
            if(list){
                list.map(it=>{
                    if(it.value){
                        num += it.value;
                        price += it.distPrice*it.value;
                    }
                });
            }
            price += this.postagePrice;
            return {
                num: num,
                price: price
            }
        }
    },
    mounted () {
        apiGet("/distmarket/webApi/distMarketPurchase/getOrderInfoRedis",{
            orderInfoKey: this.$route.query.time
        }).then(res => {
            if(res.status==200){
                this.data = JSON.parse(res.message);
                this.goodsType = this.data.modelType;
                this.getGuide();
                this.list = this.getlist();
                if(this.goodsType=='mdse')
                this.getPostagePrice();
            }else{
                this.$Message.warning(res.message)
            }
        });
    },
    components: {
        confirm,
        selectItem
    },
    methods: {
        getPostagePrice() {
            let list;
            let num = 0;
            if (this.goodsType == 'park') {
                list = this.data.ticketPurchases;
            } else if (this.goodsType == 'hotel') {
                list = this.data.roomPurchases;
            } else if (this.goodsType == 'mdse') {
                list = this.data.specPurchases;
            } else {
                list = this.data.routeTicketPurchases;
            }
            if(list){
                list.map(it=>{
                    if(it.value){
                        num += it.value;
                    }
                });
            }
            apiGet("/distmarket/myWantBuy/getPostagePriceFl",{
                areaCode: this.$refs.select?this.$refs.select.sheng:110000,
                modelCode: this.data.goodsCode||this.data.hotelCode||this.data.mdseCode||this.data.routeCode,
                amount: num||1,
            }).then(res => {
                if(res.status==200){
                    this.postagePrice = res.postAgePrice;
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        getlist() {
            let list;
            let data = [];
            let params = this.data;
            if (this.goodsType == 'park') {
                list = params.ticketPurchases;
            } else if (this.goodsType == 'hotel') {
                list = params.roomPurchases;
            } else if (this.goodsType == 'mdse') {
                list = params.specPurchases;
            } else {
                list = params.routeTicketPurchases;
            }
            if(list){
                list.map(it=>{
                    if(it.value){
                        let arr = [];
                        for (let index = 0; index < it.value; index++) {
                            arr.push({})
                        }
                        data.push({
                            ticketName: it.ticketName,
                            form: arr
                        })
                    }
                });
            }
            return data
        },
        handleBeforeUpload(index) {
            this.current = index;
        },
        handleSuccess(res, file) {
            if (res.status == 200) {
                this.$Message.success("上传成功")
                this.$set(this.list[this.current],'form',res.data);
            } else {
                this.$Message.warning("上传失败，请重新上传")
            }
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '上传的文件过大',
                desc: '文件  ' + file.name + ' 过大, 不能超过 2M'
            });
        },
        getProvince(sheng){
            this.sheng=sheng
            this.getPostagePrice();
        },
        getCity(city){
            this.city=city
        },
        getQu(qu){
            this.qu=qu
        },
        setDefault(ele) {
            delete ele.createTime;
            delete ele.modifyTime;
            ele.defaultFlag = true;
            apiPost("/admin/webapi/guide/updateDefault",ele).then(res => {
                if(res.status==200){
                    this.getGuide();
                }else{
                    this.$Message.warning(res.message);
                    this.getGuide();
                }
            });
        },
        guideDel(ele) {
            apiGet("/admin/webapi/guide/delete",{Id:ele.id}).then(res => {
                if(res.status==200){
                    this.getGuide();
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        guideEle(ele) {
            this.formItem = ele;
        },
        saveGuide() {
            let url = this.formItem.id?'/admin/webapi/guide/update':'/admin/webapi/guide/saveReceive';
            delete this.formItem.createTime;
            delete this.formItem.modifyTime;
            this.formItem.idNo = '11010119800101007X';
            if(this.goodsType=='mdse'&&this.$refs.select.sheng&&this.$refs.select.shi&&this.$refs.select.qu){
                this.formItem.locationCode = this.$refs.select.sheng+'-'+this.$refs.select.shi+'-'+this.$refs.select.qu;
                this.formItem.locationName = this.sheng+'-'+this.shi+'-'+this.qu;
            }
            let _this = this;
            this.common.formPost(this, {
                url,
                params: _this.formItem,
                mold: 'modal',
                callback (res) {
                if (res.success||res.status==200) {
                    _this.getGuide();
                    _this.$Message.success(res.message)
                }else{
                    _this.$Message.warning(res.message)
                }
                }
            })
        },
        validateList(list,cb) {
            Promise.all(list).then((data)=>{
                for (let i = 0; i < data.length; i++) {
                    if(!data[i]){
                        return
                    }
                }
                cb();
            });
        },
        getGuide() {
            apiPost("/admin/webapi/guide/list",{}).then(res => {
                if(res.status==200){
                    this.guides = res.data;
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        submitBill() {
            let list = [];
            for (let index = 0; index < this.list.length; index++) {
                for (let ind = 0; ind < this.list[index].form.length; ind++) {
                    list.push(
                        this.$refs['form'+index+'-'+ind].validate?this.$refs['form'+index+'-'+ind].validate():this.$refs['form'+index+'-'+ind][0].validate()
                    )
                }
            }
            this.validateList([this.$refs['formItem'].validate()],this.validateList(list,this.callBack));
        },
        callBack() {
        },
        timeIt(ind) {
            this.timeSel = ind;
        },
        setNum(item,index,ite) {
            let list;
            if (this.goodsType == 'park') {
                list = item.ticketPurchases;
            } else if (this.goodsType == 'hotel') {
                list = item.roomPurchases;
            } else if (this.goodsType == 'mdse') {
                list = item.specPurchases;
            } else {
                list = item.roomPurchases;
            }
            this.$set(list,index,ite);
        },
        numOpt(bool,ticket) {
            if (!ticket.distPrice) {
                return
            }
            if(bool){
                ticket.value += 1;
            }else{
                ticket.value = ticket.value>1?ticket.value-1:0;
            }
        },
        ticketNum(bool,ticket,item,inde) {
            item.ticketPurchases.map(item=>{
                item.show = false;
            })
            ticket.show = true;
            this.numOpt(bool,ticket);
            this.setNum(item,inde,ticket);
            this.list = this.getlist();
        },
        show(item,index) {
            let bool = !item.show;
            this.data.map(item=>{
                item.show = false;
            })
            item.show = bool;
            this.$set(this.data, index, item);
        },
        dateChange(arg) {
            this.occDate = arg;
        },
        daterangeChange(arg) {
            this.daterange = arg;
            this.params.startDate = arg[0];
            this.params.endDate = arg[1];
        }
    }
}
</script>
<style lang="scss" scoped>
.resultList {
    .resultItem {
        .resultOpt {
            .resultTable {
                display: table;
                width: 100%;
                line-height: 48px;
                .resultThead {
                    display: table-row;
                    font-weight: bold;
                    .resultTh {
                        display: table-cell;
                        background-color: #ccc;
                    }
                }
                .resultTbody {
                    display: table-row-group;
                    .resultTr {
                        display: table-row;
                        .resultTd {
                            display: table-cell;
                            span {
                                display: inline-block;
                                width: 49px;
                                text-align: center;
                                line-height: 20px;
                                color: #fff;
                                border-radius: 3px;
                                margin-left: 5px;
                                background-color: #df4949;
                            }
                        }
                    }
                    .resultTimeList {
                        display: inline-block;
                        white-space: nowrap;
                        width: 100px;
                        .resultTime {
                            display: inline-block;
                            vertical-align: middle;
                            line-height: 36px;
                            text-align: center;
                            border-radius: 3px;
                            margin-right: 15px;
                            width: 80px;
                            border: 1px solid #ccc;
                        }
                        .resultTimeSel {
                            border-color: rgb(28, 163, 236);
                        }
                        .resultTime0 {
                            color: #ccc;
                            border-color: #ccc;
                        }
                    }
                }
            }
        }
    }
}
.listInfo {
    .infoTitle {
        background-color: #ccc;
        line-height: 40px;
        color: #fff;
        font-size: 14px;
        padding-left: 10px;
        a {
            margin-left: 30px;
        }
    }
    .guideFormList {
        padding: 20px;
    }
    .infoWrap {
        display: flex;
        padding-top: 20px;
        form {
            width: 50%;
        }
        .addressListWrap {
            width: 50%;
            .listTitle {
                font-weight: bold;
                font-size: 14px;
            }
            .addressList {
                padding: 20px 0px 0px;
                .addressItem {
                    border: 2px solid #ccc;
                    border-radius: 4px;
                    position: relative;
                    margin-bottom: 15px;
                    padding: 0px 20px;
                    .default {
                        position: absolute;
                        text-align: center;
                        display: none;
                        right: 0px;
                        top: 0px;
                        width: 20px;
                        height: 30px;
                        color: #fff;
                        background-color: #df4949;
                    }
                    .itemLine {
                        line-height: 30px;
                        display: flex;
                        color: #999;
                        .lineInfo {
                            flex-grow: 1;
                            span {
                                color: #333;
                            }
                        }
                        .linePhone {
                            flex-grow: 0;
                            width: 270px;
                            padding-right: 10px;
                            a {
                                margin-left: 20px;
                                display: none;
                            }
                            .setDefault {
                                margin-left: 30px;
                            }
                        }
                    }
                    &:hover {
                        border-color: #df4949;
                        .itemLine {
                            .linePhone {
                                a {
                                    display: inline;
                                }
                            }
                            
                        }
                    }
                }
                .addressDefault {
                    border-color: #df4949;
                    .itemLine {
                        .linePhone {
                            a {
                                display: none !important;
                            }
                        }
                    }
                    .default {
                        display: block;
                    }
                }
                .addressMore {
                    color: #999;
                    text-align: center;
                }
            }
        }
        .guideListWrap {
            flex-grow: 1;
            .listTitle {
                font-weight: bold;
                font-size: 14px;
            }
            .guideList {
                padding: 20px 0px;
                .guideItem {
                    cursor: pointer;
                    display: inline-block;
                    line-height: 24px;
                    margin-right: 20px;
                    span {
                        display: inline-block;
                        width: 80px;
                        text-align: center;
                    }
                }
            }
        }
    }
}
.resultOpt {
    .resultTotal {
        padding: 20px;
        text-align: right;
        background-color: #ccc;
        .totalInfo {
            display: inline-block;
            text-align: center;
            font-size: 14px;
            line-height: 30px;
            width: 180px;
            span {
                color: orangered;
            }
        }
    }
}
</style>