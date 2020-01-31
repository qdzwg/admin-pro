<template>
<div>
    <div class="goodDetail">
        <div class="goodImgs">
            <div class="goodBigImg">
                <img :src="current" alt="">
            </div>
            <div class="goodImgList">
                <div class="goodimg" v-for="(item,index) in imgList" @mouseenter="imgChange(item)" :key='index'>
                    <img :src="item" alt="">
                </div>
            </div>
        </div>
        <div class="goodDes">
            <div v-if="$route.query.goodsType=='traffic'">
                <div class="goodTitle">{{goods.right.name}}</div>
                <div class="goodSummary" v-html='goods.right.summary||"暂无"'></div>
            </div>
            <div v-else>
                <div class="goodTitle">{{goods.right.name}}</div>
                <div class="goodSummary" v-html='goods.right.summary||"暂无"'></div>
                <div class="goodSale">
                    <span class="goodsSellingPrice">建议零售价<em>￥{{goods.right.goodsSellingPrice}}</em></span>
                    <span class="goodsSupplyPrice">供货价：<em>￥{{goods.right.goodsSupplyPrice}}</em></span>
                    <span class="goodsSales">总销量：<em>{{goods.right.goodsSales}}</em></span>
                    <span class="goodsStock">库存：<em>{{goods.right.goodsStock}}</em></span>
                </div>
                <div class="goodsFormat">
                    <div class="formatLabel">{{$route.query.goodsType=='hotel'?'房 型':($route.query.goodsType=='mdse'?'规 格':'票 型')}}</div>
                    <div class="formatList">
                        <div class="formatItem" :class='{formatCurrent:val==modelCode}' @click='getShowMsg(val)' v-for="(val, key, index) in goods.right.goodsFormat" :key="index">{{key}}</div>
                    </div>
                </div>
            </div>
            <div class="goodsBTN" v-if="$route.query.goodsType=='traffic'">
                <div class="buttonBuy" @click='purchaseTraffic' v-if="!isPurchase">采购</div>
                <div class="buttonBuy" @click='cancelPurchaseTraffic' v-else>取消采购</div>
                <div class="buttonFollow" v-if='!followed' @click='follow'><Icon type="android-favorite-outline"></Icon> 添加关注</div>
                <div class="buttonFollow buttonFollowed" v-else>已关注</div>
            </div>
            <div class="goodsBTN" v-else>
                <div class="buttonBuy" @click='modalList'>采购{{relationCount+'/'+skuSum}}</div>
                <div class="buttonFollow" v-if='!followed' @click='follow'><Icon type="android-favorite-outline"></Icon> 添加关注</div>
                <div class="buttonFollow buttonFollowed" v-else>已关注</div>
            </div>
        </div>
        <div class="goodShop">
            <div class="shopImg"><img :src="goods.left.headPortrait" alt=""></div>
            <div class="shopDes">
                <div class="shopName">{{goods.left.shopName}}</div>
                <div>简介：{{goods.left.briefIntro}}</div>
            </div>
            <div class="wechatSale">
                <img src="/static/h-ui/images/distmarket/detail/wx.png" alt="">
                <span>微信售后:{{goods.left.weixinRepair}}</span>
            </div>
            <div class="wechatCustomer">
                <img src="../../../../assets/images/tel.png" alt="">
                <span>服务电话:{{goods.left.weixinCustomerTel}}</span>
            </div>
            <div class="shopInfo">
                <div class="showInfoBTN" @click='shopTo'>进入店铺</div>
            </div>
        </div>
        <div class="goodInfo">
            <div class="infoNavs">
                <div @click='navTo("goodsText")' :class="nav=='goodsText'?'infoNavCurrent':''">分销商品详情</div>
                <div @click='navTo("description")' :class="nav=='description'?'infoNavCurrent':''">分销商品说明</div>
            </div>
            <div class="infoContent" v-if="nav=='goodsText'" v-html="goods.body.goodsText"></div>
            <div class="infoContent" v-if="nav=='description'">
                <div>分销政策：</div>
                <div v-html='goods.body.goodsDescription'></div>
                <div>售后政策：</div>
                <div v-html='goods.body.afterSale'></div>
            </div>
        </div>
    </div>
    <!-- 弹出层 -->
    <Modal v-model="modal" width=900 title="选择子产品" @on-ok="ok" ok-text='采购'  @on-cancel="cancel">
        <searchForm :search-items='searchItems'></searchForm>
        <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    </Modal>
    <confirm ref="confirmModel" @callBack='callBack' sucessMsg="操作成功！" content="你是否确认取消采购，取消后不可购买该产品。" mode="undefined"></confirm>
</div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
import confirm from '@/components/global/confirm'
import gridTable from '@/components/global/gridTable'
import searchForm from "@/components/global/searchForm"
export default {
    data () {
        return {
            isPurchase: false, // 是否采购 小交通
            relationCount: 0,
            skuSum: 0,
            searchItems: [
                {
                label: "产品名称",
                type: "input",
                name: "name"
                },
            ],
            modal: false,
            params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
            url: '/distmarket/distMarketProductSku/distSkuGrid',
            columns: [
                {
                type: 'selection',
                width: 60,
                align: 'center'
                }, 
                {
                title: '产品名称',
                key: 'name',
                sortable: true
                },
                {
                title: '产品编码',
                key: 'code',
                sortable: true
                },
                {
                title: '分销状态',
                key: 'relationFlag',
                align: 'center',
                sortable: true,
                    render: (h,params) => {
                        return h('span', params.row.relationFlag=='F'?'未分销':'已分销')
                    }
                },
                {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (h, params) => {
                    const actions = [
                        {
                            title:'取消采购',
                            action: () => {
                                this.$refs.confirmModel.confirm('/distmarket/myWantBuy/cancelPurchase?type=park&'+'goodsCode='+params.row.code)
                            }
                        }
                        ]
                        if(params.row.relationFlag=='T')
                        return this.common.columnsHandle(h, actions)
                }
                }
            ],
            current: '',
            modelCode: '',
            followed: false,
            nav: 'goodsText',
            imgList: [],
            goods: {
                right: {
                    goodsFormat: {},
                    goodsSales: '',
                    goodsSellingPrice: '无',
                    goodsSupplyPrice: '无',
                    name: '',
                    summary: ''
                },
                left: {
                    briefIntro:"clm分销市场的店铺2",
                    dyLinkImg:"https://testwww.lotsmall.cn/static//fileupload/20180402/20180402170238y3q8ni.jpeg",
                    goodsCode:"hotel2018040216190047",
                    headPortrait:"http://statics.lotsmall.cn/image/20180418/20180418140539842g8t.jpeg",
                    linkImg:"http://statics.lotsmall.cn/image/20180413/20180413151106ia4uow.jpg",
                    shopCode:"186",
                    shopName:"18220084645酒店-自营",
                    shopProductCount:"0",
                    weixinCustomerTel:"天使中的魔鬼11",
                    weixinRepair:"天使中的魔鬼"
                },
                body: {
                    afterSale: '',
                    goodsDescription: '',
                    goodsText: ''
                }
            }
        }
    },
    computed: {
        data () {
            let arr = [];
            if (this.$store.state.list.res.rows)
            this.$store.state.list.res.rows.map(item=>{
                item._disabled = item.relationFlag=='T'
                item._checked = item.relationFlag=='T'
                arr.push(item)
            })
            return  arr
        },
    },
    mounted () {
        this.params.parentCode = this.$route.query.goodsCode;
        if(this.$route.query.goodsType!='park'){
            this.columns.pop();
        }
        if(this.$route.query.goodsType=='traffic'){
            apiGet("/distmarket/webApi/distMarketTraffic/isPurchase",{ // 是否采购
                distMainUserId:  localStorage.getItem("xjsc_2018_userId"),
                goodsCode: this.$route.query.goodsCode,
            }).then(res => {
                if(res.status==200){
                    this.isPurchase = res.data.flag;
                }else{
                    this.$Message.warning(res.message)
                }
            });
            // apiGet("/api/productPage/productDataHeaderRightFl",this.$route.query).then(res => {
            //     if(res.status==200){
            //         this.goods.right = res.data;
            //     }else{
            //         this.$Message.warning(res.message)
            //     }
            // });
            // return
        }
        if(this.$route.query.goodsType!=='traffic')
        this.getSkuNum(1);
        apiGet("/distmarket/productPage/productDataHeaderRightFl",this.$route.query).then(res => {
            if(res.status==200){
                this.goods.right = res.data;
                for (const key in res.data.goodsFormat) {
                    if (res.data.goodsFormat.hasOwnProperty(key)) {
                        this.modelCode = res.data.goodsFormat[key];
                        break;
                    }
                }
            }else{
                this.$Message.warning(res.message)
            }
        });
        apiGet("/distmarket/productPage/productDataHeaderLeftFl",this.$route.query).then(res => {
            if(res.status==200){
                this.goods.left = res.data;
                this.imgList = res.data.dyLinkImg.split(',');
                this.current = this.imgList[0];
            }else{
                this.$Message.warning(res.message)
            }
        });
        apiGet("/distmarket/productPage/productDataBodyFl",this.$route.query).then(res => {
            if(res.status==200){
                this.goods.body = res.data;
            }else{
                this.$Message.warning(res.message)
            }
        });
        apiGet("/distmarket/productPage/getFollowAndSaleedFl",{productCode:this.$route.query.goodsCode}).then(res => {
            if(res.status==200){
                this.followed = res.myFollowProductFlag;
            }else{
                this.$Message.warning(res.message)
            }
        });
    },
    components: {
        confirm,
        gridTable,
        searchForm
    },
    methods: {
        callBack() {
            this.getSkuNum();
            this.$refs.gridTable.loadpage();
        },
        getSkuNum(bool) {
            apiGet("/distmarket/productPage/listFl",{code:this.$route.query.goodsCode,type:this.$route.query.goodsType}).then(res => {
                if(res.status==200){
                    if(bool)
                    this.goods.right = res.data;
                    this.skuSum = res.data.skuSum;
                    this.relationCount = res.data.relationCount;
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        modalList() {
            this.modal = true;
            this.$refs.gridTable.loadpage()
        },
        ok() {
            let selection = [];
            this.$refs.gridTable.selection.map(item=>{
                if(!item._disabled){
                    selection.push(item)
                }
            })
            if (selection.length) {
                let codes = [];
                selection.forEach(element => {
                    codes.push(element.code);
                });
                apiGet("/distmarket/myWantBuy/purchase?codes="+codes.join(',')+'&parentCode='+this.$route.query.goodsCode).then(res=>{
                    if(res.status==200||res.success){
                        this.modal = false;
                        this.$Message.success('采购成功');
                        this.getSkuNum();
                    }else{
                        this.$Message.warning(res.message)
                    }
                });
            } else {
                this.$Message.warning("请选择一条数据！");
            }
        },
        cancel() {
            this.modal = false;
        },
        cancelPurchaseTraffic() {
            apiGet("/distmarket/webApi/distMarketTraffic/cancelPurchaseTraffic?goodsCode="+this.$route.query.goodsCode).then(res=>{
                if(res.status==200||res.success){
                    this.isPurchase = false;
                    this.$Message.success('取消采购成功');
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        purchaseTraffic() {
            apiGet("/distmarket/webApi/distMarketTraffic/purchaseTraffic?goodsCode="+this.$route.query.goodsCode).then(res=>{
                if(res.status==200||res.success){
                    this.isPurchase = true;
                    this.$Message.success('采购成功');
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        getShowMsg(item) {
            this.modelCode = item;
            apiGet("/distmarket/productPage/getShowMsgFl",{mainCode:this.$route.query.goodsCode,modelCode:item}).then(res => {
                if(res.status==200){
                    this.goods.right = Object.assign(this.goods.right,res.data)
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        follow() {
            apiPost("/distmarket/distMarketFollowGoods/followFl",{goodsCode:this.$route.query.goodsCode}).then(res => {
                if(res.status==200){
                    this.followed = true;
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        shopTo() {
            this.$router.push({path:'/supperShopDistProduct',query:{spc:this.goods.left.shopCode,gc:this.goods.left.goodsCode}})
        },
        navTo(arg) {
            this.nav = arg;
        },
        imgChange(item) {
            this.current = item;
        }
    }
}
</script>
<style lang="scss" scoped>
.goodDetail {
    overflow: hidden;
    .goodImgs {
        width: 40%;
        float: left;
        .goodBigImg {
            img {
                width: 100%;
                height: 260px;
            }
        }
        .goodImgList {
            height: 67px;
            .goodimg {
                width: 20%;
                float: left;
                height: 100%;
                cursor: pointer;
                border: 1px solid #dcdcdc;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .goodDes {
        float: left;
        width: 58%;
        padding-left: 2%;
        .goodTitle {
            width: 80%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 22px;
            line-height: 54px;
            color: #333333;
            font-family: '仿宋';
            font-weight: 600;
        }
        .goodSummary {
            font-size: 12px;
            line-height: 20px;
            color: #8f8f8f;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
        .goodSale {
            font-size: 12px;
            color: #5c5c5c;
            padding: 25px 0px;
            border-bottom: 2px solid #eee;
            span {
                vertical-align: baseline;
                display: inline-block;
            }
            em {
                font-style: normal;
            }
            .goodsSellingPrice {
                em {
                    font-size: 22px;
                    line-height: 22px;
                    color: #ff5b33;
                }
            }
            .goodsSupplyPrice, .goodsSales {
                padding-left: 20px;
                padding-right: 40px;
                border-right: 1px solid #000;
                
            }
            .goodsSales, .goodsStock {
                em {
                    color: #69b8fb;
                }
            }
            .goodsStock {
                margin-left: 44px;
            }
        }
        .goodsFormat {
            padding-top: 16px;
            .formatLabel {
                width: 10%;
                display: inline-block;
            }
            .formatList {
                width: 85%;
                display: inline-block;
                vertical-align: top;
                margin-left: 12px;
                .formatItem {
                    height: 30px;
                    cursor: pointer;
                    line-height: 30px;
                    border: 1px solid #666;
                    margin-right: 15px;
                    display: inline-block;
                    text-align: center;
                    padding: 0 10px;
                    margin-bottom: 10px;
                    color: #333;
                }
                .formatCurrent {
                    text-decoration: none;
                    border: 1px solid #f66262;
                    color: #f66262;
                }
            }
        }
        .goodsBTN {
            padding-left: 10%;
            padding-top: 30px;
            div {
                height: 40px;
                line-height: 40px;
                width: 90px;
                border: solid 1px #ddd;
                background-color: #fff;
                display: inline-block;
                box-sizing: border-box;
                cursor: pointer;
                text-align: center;
                font-weight: 400;
                white-space: nowrap;
                border-radius: 3px;
                vertical-align: middle;
            }
            .buttonBuy {
                color: #fff;
                background-color: #5a98de;
                border-color: #5a98de;
                &:hover {
                    color: #fff;
                    background-color: #0a6999;
                    border-color: #0a6999;
                }
            }
            .buttonFollow {
                border: 1px solid #0188fb;
                font-size: 12px;
                color: #0188fb;
                margin-left: 12px;
            }
            .buttonFollowed {
                cursor: auto;
            }
        }
    }
    .goodShop {
        display: flex;
        clear: both;
        padding: 20px 0px;
        width: 100%;
        .shopImg {
            img {
                width: 110px;
                height: 100px;
            }
        }
        .shopDes {
            margin: 0px 10px;
            width: 25%;
            font-size: 12px;
            line-height: 20px;
            div {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .shopName {
                width: 80%;
                font-size: 16px;
                line-height: 44px;
                margin-bottom: 10px;
            }
        }
        .wechatSale, .wechatCustomer {
            width: 220px;
            line-height: 110px;
            img, span {
                display: inline-block;
                vertical-align: middle;
            }
        }
        .shopInfo {
            line-height: 110px;
            .showInfoBTN {
                vertical-align: middle;
                display: inline-block;
                cursor: pointer;
                padding: 8px 23px;
                line-height: 22px;
                border: 1px solid #fe7352;
                border-radius: 50px;
                color: #fe7352;
            }
        }
    }
    .goodInfo {
        .infoNavs {
            display: flex;
            line-height: 46px;
            font-size: 14px;
            color: #333;
            border: 1px solid #e1e1e1;
            text-align: center;
            div {
                width: 163px;
                cursor: pointer;
            }
            .infoNavCurrent {
                color: #a0a0a0;
            }
        }
        .infoContent {
            line-height: 30px;
            padding-top: 20px;
            padding-left: 20px;
        }
    }
}

</style>