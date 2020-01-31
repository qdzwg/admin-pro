<template>
<div>
    <div class="shopDetail">
        <div class="shopInfo">
            <div class="shopImg">
                <img :src="shop.headPortrait" alt="">
            </div>
            <div class="shopDes">
                <div class="shopName">{{shop.name}}</div>
                <div class="briefIntro">简介：{{shop.briefIntro}}</div>
                <Button type="primary" @click="editShop()">编辑店铺</Button>
            </div>
        </div>
        <div class="shopWX">
            <div class="weixinCustomerTel">服务电话：{{shop.weixinCustomerService}}</div>
            <div class="weixinRepair">售后微信：{{shop.weixinRepair}}</div>
        </div>
    </div>
    <list ref="gridTable" :search-items='searchItems' :columns="columns" :url="url"></list>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" width='1000' :type="type">
        <Form :model="formItem" label-position="right" :label-width="130" ref="formItem" :rules="ruleForm">
            <FormItem label="产品编码：">
                <Input style="width:70%;" v-model="formItem.code" readonly placeholder="填写产品编码"></Input>
            </FormItem>
            <FormItem label="产品规格：">
                <table border="1" border-spacing='0' style="border-collapse: collapse;" v-if='table.header.length'>
                    <thead align='center'>
                        <tr>
                            <th v-for="(item,index) in table.header" :key="index">{{item}}</th>
                        </tr>
                    </thead>
                    <tbody align='center'>
                        <tr v-for="(item,index) in table.trs" :key="index">
                            <td v-for="(it,inde) in item.tds" :key="inde">
                                <div v-if='it.type=="inputRead"'>
                                    <Input style="width:70%;" v-model="it.value" readonly></Input>
                                </div>
                                <div v-else-if='it.type=="checkbox"'>
                                    <Checkbox v-model="it.value" :disabled="formItem.goodsType=='mdse'||formItem.goodsType=='route'"></Checkbox>
                                </div>
                                <div v-else>{{it.value}}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </FormItem>
            <FormItem label="售后政策：" v-if='ueditorShow'>
                <ueditor id="salePolicy" ref="salePolicy" :config="config" :content="formItem.salePolicy"></ueditor>
            </FormItem>
            <FormItem label="展示价格：" prop="showPrice">
                <Input style="width:70%;" v-model="formItem.showPrice" placeholder="填写价格"></Input>
            </FormItem>
            <FormItem label="分销政策：" v-if='ueditorShow'>
                <ueditor id="distPolicy" ref="distPolicy" :config="config" :content="formItem.distPolicy"></ueditor>
            </FormItem>
            <FormItem label="投放类别：">
                <Select v-model="formItem.pushType" style="width:33%;">
                    <Option v-for="(item,index) in pushTypes" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="图片：" prop="picUrl">
                <Input style="display:none;" v-model="formItem.picUrl"></Input>
                <my-img :limitNum="5" :uploadList="picUrlList" @getImgUrl="setPicUrl"></my-img>
            </FormItem>
            <FormItem label="主图：" prop="masterPic">
                <Input style="display:none;" v-model="formItem.masterPic"></Input>
                <my-img :limitNum="1" :uploadList="masterPicList" @getImgUrl="setMasterPic"></my-img>
            </FormItem>
        </Form>
        <div slot="footer">
          <Button size="large" @click="ok" type="primary">确定</Button>
          <Button size="large" @click="cancel" type="ghost">取消</Button>
        </div>
    </Modal>
    <confirm ref="confirmModel" sucessMsg="操作成功！" content="确认操作？" mode="done"></confirm>
</div>
</template>
<script>
import myImg from "@/components/global/singleImg";
import ueditor from "@/components/global/ueditor"
import confirm from '@/components/global/confirm'
import list from '@/components/global/list'
import { apiGet, apiPost, apiPostJson } from "@/fetch/api";
export default {
    data () {
        return {
            ueditorShow: false,
            modalTitle: '',
            modal: false,
            type: 'done',
            picUrlList: [],
            masterPicList: [],
            config: {
                initialFrameWidth: 800,
                initialFrameHeight: 200
            },
            pushTypes: [
                {
                label: '全局开放',
                value: 'all'
                },
                // {
                // label: '区域开放',
                // value: 'area'
                // }
            ],
            table: {
                header: [],
                trs: [{
                    tds: []
                }]
            },
            formItem: {
                code: '',
                showPrice:'',
                pushType:'',
            },
            ruleForm: {
                showPrice: [
                    {required: true, message: '请输入价格', trigger: 'blur'},
                ],
                picUrl:[
                    {required: true, message: '请选择图片', trigger: 'blur'},
                ],
                masterPic:[
                    {required: true, message: '请选择图片', trigger: 'blur'}
                ]
            },
            searchItems: [
                {
                label: "商品名称",
                type: "input",
                name: "goodsName"
                },
                {
                label: "业务类型",
                type: "select",
                name: "goodsType",
                data: [
                    {
                    value: "",
                    label: "全部"
                    },
                    {
                    value: "park",
                    label: "景区"
                    },
                    {
                    value: "hotel",
                    label: "酒店"
                    },
                    {
                    value: "mdse",
                    label: "商品"
                    },
                    {
                    value: "route",
                    label: "跟团游"
                    },
                    {
                    value: "traffic",
                    label: "小交通"
                    }
                ]
                },
                {
                label: "是否上架",
                type: "select",
                name: "enabled",
                data: [
                    {
                    value: "",
                    label: "请选择"
                    },
                    {
                    value: "T",
                    label: "已上架"
                    },
                    {
                    value: "F",
                    label: "已下架"
                    }
                ]
                }
            ],
            columns: [
                {
                title: '名称',
                key: 'goodsName',
                },
                {
                title: '编码',
                key: 'code',
                },
                {
                title: '产品类别',
                key: 'goodsType',
                render: (h,params) => {
                    return h('span', this.filter.orderType(params.row.goodsType))
                }
                },
                {
                title: '展示价格',
                key: 'orderPrice',
                },
                {
                title: '是否上架（可见）',
                key: 'enabled',
                render: (h,params) => {
                    return h('span', params.row.enabled=="T"?"已上架":"已下架")
                }
                },
                {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (h, params) => {
                    const actions = [
                    {
                        title:'详情',
                        action: () => {
                            this.$router.push({path:'/productDetail',query:{id:params.row.id}})
                        }
                    },
                    {
                        title:'修改',
                        action: () => {
                            this.modal = true
                            this.type = 'edit'
                            this.modalTitle = '修改'
                            apiGet("/distmarket/distMarketProduct/detailFl",{id:params.row.id}).then(res => {
                                if(res.status==200){
                                    this.formItem = res.data.distMarketProduct;
                                    this.ueditorShow = true;
                                    this.formItem._method = 'post';
                                    this.picUrlList = res.data.distMarketProduct.picUrl?res.data.distMarketProduct.picUrl.split(','):[];
                                    this.masterPicList = res.data.distMarketProduct.masterPic?res.data.distMarketProduct.masterPic.split(','):[];
                                    this.table = res.data.tableJson?res.data.tableJson:this.table;
                                    this.table.trs.map(item=>{
                                        item.tds.map(it=>{
                                            if(it.type=='checkbox'){
                                                it.value = it.value == 'T' ? true : false;
                                            }
                                        })
                                    })
                                }else{
                                    this.$Message.warning(res.message)
                                }
                            });
                        }
                    },
                    {
                        title:'上/下架',
                        action: () => {
                            let url = params.row.goodsType == "traffic"?'/distmarket/webApi/distMarketTraffic/enabledTraffic?id=':'/distmarket/distMarketProduct/enabled?id=';
                            this.$refs.confirmModel.confirm(url+params.row.id+'&'+params.row.id)
                        }
                    }
                    ]
                    return this.common.columnsHandle(h, actions)
                }
                }
            ],
            data: '',
            url: '/distmarket/distMarketProduct/gridFl',
            params: {
                sort: "createTime",
                shopCode: '',
                order: "desc",
                limit: 10,
                page: 1,
            },
            shop: {
                weixinCustomerService: '',
                weixinRepair: '',
                briefIntro: '',
                name: '',
            }
        }
    },
    computed: {
        res () {
            return  this.$store.state.list.res.data?this.$store.state.list.res.data:{distSize: 0,distMarketProductDtos: []}      
        },
    },
    async mounted () {
        let _this = this;
        _this.$store.state.list.url = _this.url;
        _this.$store.state.list.params = _this.params;
        await apiPost("/distmarket/webApi/distMarketShop/selectShop").then(res => {
            if(res.status==200){
                _this.shop = res.data;
                _this.params.shopCode = res.data.id;
                // _this.$refs.gridTable.loadpage();
                _this.$refs.gridTable.loadpage();
            }else{
                if(res.status==402)
                _this.$router.push('/shopEdit')
                else
                _this.$Message.warning(res.message)
            }
        });
    },
    components: {
        myImg,
        ueditor,
        confirm,
        list
    },
    methods: {
        setPicUrl(imgArr) {
            this.formItem.picUrl = imgArr[0];
        },
        setMasterPic(imgArr) {
            this.formItem.masterPic = imgArr[0];
        },
        ok() {
            this.formItem.showPrice = String(this.formItem.showPrice);
            this.formItem.salePolicy=this.$refs.salePolicy
            ? this.$refs.salePolicy.getUEContent()
            : "";
            this.formItem.distPolicy=this.$refs.distPolicy
            ? this.$refs.distPolicy.getUEContent()
            : "";
            this.formItem.picUrl = this.picUrlList.join(',')
            let skuDtos = [];
            this.table.trs.map(item=>{
                item.tds.map(it=>{
                    if(it.type=='checkbox'){
                        skuDtos.push({
                            skuCode: item.code,
                            isSale: it.value == true ? "T" : "F"
                        })
                    }
                })
            })
            this.formItem.skuDtos = skuDtos;
            this.$refs.formItem.validate(vaild=>{
                if(vaild){
                    apiPostJson("/distmarket/webApi/distMarketProduct/editsProduct",this.formItem).then(res => {
                        if(res.status==200){
                            this.$Message.success("保存成功!");
                            this.modal = false;
                            this.ueditorShow = false;
                        }else{
                            this.$Message.warning(res.message)
                        }
                    });
                }else{
                }
            })
        },
        cancel() {
            this.modal = false;
            this.ueditorShow = false;
        },
        editShop() {
            this.$router.push('/shopEdit')
        },
    }
}
</script>
<style lang="scss" scoped>
.shopDetail {
    display: flex;
    padding-bottom: 20px;
    .shopInfo {
        flex-grow: 1;
        display: flex;
        .shopImg {
            padding-right: 15px;
            img {
                width: 75px;
                height: 75px;
            }
        }
        .shopDes {
            flex-grow: 1;
            .shopName {
                font-size: 16px;
                color: #333;
                line-height: 24px;
            }
            .briefIntro {
                color: #666;
                padding: 5px 0px;
                font-size: 12px;
                line-height: 20px;
            }
        }
    }
    .shopWX {
        width: 280px;
        color: #666;
        font-size: 12px;
        line-height: 35px;
        padding: 0px 10px;
        div {
            background: url('../../../../assets/images/wx-icon.png') no-repeat left center;
            padding-left: 25px;
        }
        .weixinCustomerTel {
            background-image: url("../../../../assets/images/tel.png");
            background-size: 20px;
        }
    }
}
</style>